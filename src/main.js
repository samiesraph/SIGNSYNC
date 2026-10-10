/**
 * Main Application Orchestrator
 * Connects Camera -> Landmark Detection -> ISL Model (v1/v2) -> Prediction Adapter ->
 * Stabilizer -> Sentence Builder -> Live UI -> Speech TTS -> Dataset Collector Studio.
 */

import { CameraManager } from './modules/camera.js';
import { LandmarkDetector } from './modules/landmarkDetector.js';
import { ISLModel } from './modules/islModel.js';
import { PredictionAdapter } from './modules/predictionAdapter.js';
import { PredictionStabilizer } from './modules/predictionStabilizer.js';
import { SentenceBuilder } from './modules/sentenceBuilder.js';
import { SpeechService } from './modules/speech.js';
import { HistoryLogger } from './modules/historyLogger.js';
import { DatasetCollector } from './modules/datasetCollector.js';

// DOM Element References: Video & Overlays
const webcamVideo = document.getElementById('webcamVideo');
const outputCanvas = document.getElementById('outputCanvas');
const canvasCtx = outputCanvas.getContext('2d');

// Header & Navigation
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const fpsCounter = document.getElementById('fpsCounter');
const activeModelBadge = document.getElementById('activeModelBadge');
const modelVersionSelect = document.getElementById('modelVersionSelect');
const tabLiveTranslator = document.getElementById('tabLiveTranslator');
const tabCollectorStudio = document.getElementById('tabCollectorStudio');
const liveTranslatorView = document.getElementById('liveTranslatorView');
const datasetCollectorView = document.getElementById('datasetCollectorView');
const btnBackToTranslator = document.getElementById('btnBackToTranslator');

// Alerts
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');

// Current Sign Display
const currentSignLabel = document.getElementById('currentSignLabel');
const confidencePercentage = document.getElementById('confidencePercentage');
const visualConfidenceBar = document.getElementById('visualConfidenceBar');
const confidenceFill = document.getElementById('confidenceFill');

// Stabilization Overlay
const stabilizerProgressWrapper = document.getElementById('stabilizerProgressWrapper');
const stabilizingLabel = document.getElementById('stabilizingLabel');
const stabilizingPercent = document.getElementById('stabilizingPercent');
const stabilizerProgressBar = document.getElementById('stabilizerProgressBar');

// Config Sliders
const thresholdSlider = document.getElementById('thresholdSlider');
const thresholdVal = document.getElementById('thresholdVal');
const stabilizationSlider = document.getElementById('stabilizationSlider');
const stabilizationVal = document.getElementById('stabilizationVal');

// Sentence Builder Output
const recognizedTextBox = document.getElementById('recognizedTextBox');
const wordCount = document.getElementById('wordCount');

// Translation Action Controls
const btnPause = document.getElementById('btnPause');
const pauseBtnText = document.getElementById('pauseBtnText');
const btnBackspace = document.getElementById('btnBackspace');
const btnClear = document.getElementById('btnClear');
const btnSpeak = document.getElementById('btnSpeak');
const btnClearHistory = document.getElementById('btnClearHistory');
const historyTableBody = document.getElementById('historyTableBody');

// Dataset Collector Studio Elements
const collectorClassSelect = document.getElementById('collectorClassSelect');
const collectorCurrentClass = document.getElementById('collectorCurrentClass');
const collectorSampleCountText = document.getElementById('collectorSampleCountText');
const collectorProgressBar = document.getElementById('collectorProgressBar');
const btnToggleRecord = document.getElementById('btnToggleRecord');
const recordBtnIcon = document.getElementById('recordBtnIcon');
const recordBtnText = document.getElementById('recordBtnText');
const btnExportDataset = document.getElementById('btnExportDataset');
const btnClearSamples = document.getElementById('btnClearSamples');

// Instantiate Modules (Strict Model/UI Separation)
const cameraManager = new CameraManager(webcamVideo, outputCanvas);
const landmarkDetector = new LandmarkDetector();
const islModel = new ISLModel();
const predictionAdapter = new PredictionAdapter(islModel);
const predictionStabilizer = new PredictionStabilizer({
    confidenceThreshold: parseFloat(thresholdSlider.value),
    stabilizationTimeMs: parseInt(stabilizationSlider.value, 10)
});
const sentenceBuilder = new SentenceBuilder();
const speechService = new SpeechService();
const historyLogger = new HistoryLogger();

const datasetCollector = new DatasetCollector({
    targetCount: 100,
    onProgress: (progress) => {
        collectorCurrentClass.textContent = progress.targetClass;
        collectorSampleCountText.textContent = `${progress.count} / ${progress.targetCount}`;
        collectorProgressBar.style.width = `${progress.percentage}%`;

        if (progress.isRecording) {
            btnToggleRecord.className = 'btn btn-danger btn-large';
            recordBtnIcon.textContent = '⏹️';
            recordBtnText.textContent = `Recording (${progress.count}/${progress.targetCount})...`;
        } else {
            btnToggleRecord.className = 'btn btn-primary btn-large';
            recordBtnIcon.textContent = '⏺️';
            recordBtnText.textContent = progress.count >= progress.targetCount ? 'Target Reached (100/100)' : 'Start Recording';
        }
    }
});

// Populate Collector Class Dropdown
function populateCollectorDropdown() {
    const classes = islModel.getClasses();
    collectorClassSelect.innerHTML = classes.map(c => `
        <option value="${c}">${c}</option>
    `).join('');
    if (classes.length > 0) {
        datasetCollector.setTargetClass(classes[0]);
    }
}
populateCollectorDropdown();

// Application State Flags
let isPaused = false;
let isProcessingFrame = false;
let lastFrameTime = performance.now();
let frameCount = 0;
let fpsTimer = performance.now();

// UI Helper: Update Status Badge
function setStatus(type, text) {
    statusBadge.className = `status-badge status-${type}`;
    const dots = { recognizing: '🟢', processing: '🟡', paused: '🔴' };
    statusBadge.querySelector('.status-dot').textContent = dots[type] || '🟡';
    statusText.textContent = text;
}

// UI Helper: Show Error Alert
function showError(msg) {
    errorMessage.textContent = msg;
    errorAlert.classList.remove('hidden');
}

function hideError() {
    errorAlert.classList.add('hidden');
}

// UI Helper: Generate Visual ASCII Confidence Bar
function formatAsciiBar(confidence) {
    const totalBlocks = 10;
    const filledBlocks = Math.max(0, Math.min(10, Math.round(confidence * totalBlocks)));
    const emptyBlocks = totalBlocks - filledBlocks;
    const pct = Math.round(confidence * 100);
    return `${'█'.repeat(filledBlocks)}${'░'.repeat(emptyBlocks)} ${pct}%`;
}

// UI Helper: Render Recognized Text
function renderRecognizedText() {
    const sentence = sentenceBuilder.getSentence();
    const words = sentenceBuilder.getWords();

    wordCount.textContent = words.length;

    if (sentence.trim() === '') {
        recognizedTextBox.textContent = 'Recognized signs will accumulate into a sentence here...';
        recognizedTextBox.classList.add('placeholder');
    } else {
        recognizedTextBox.textContent = sentence;
        recognizedTextBox.classList.remove('placeholder');
    }
}

// UI Helper: Render History Table
function renderHistory() {
    const history = historyLogger.getHistory();
    if (history.length === 0) {
        historyTableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="3">No accepted predictions yet</td>
            </tr>
        `;
        return;
    }

    historyTableBody.innerHTML = history.map(item => `
        <tr>
            <td style="font-family: monospace; color: #94a3b8;">${item.timestamp}</td>
            <td style="font-weight: 700; color: #38bdf8;">${item.label}</td>
            <td style="color: #22c55e; font-weight: 600;">${item.confidencePercentage}%</td>
        </tr>
    `).join('');
}

// Main Real-Time Prediction Loop
async function processLoop() {
    requestAnimationFrame(processLoop);

    // Calculate FPS
    const now = performance.now();
    frameCount++;
    if (now - fpsTimer >= 1000) {
        fpsCounter.textContent = `${frameCount} FPS`;
        frameCount = 0;
        fpsTimer = now;
    }

    if (!cameraManager.isActive || isProcessingFrame) return;

    isProcessingFrame = true;

    try {
        // Guarantee canvas resolution matches active video resolution
        if (webcamVideo.videoWidth > 0 && (outputCanvas.width !== webcamVideo.videoWidth || outputCanvas.height !== webcamVideo.videoHeight)) {
            outputCanvas.width = webcamVideo.videoWidth;
            outputCanvas.height = webcamVideo.videoHeight;
        }

        // 1. Detect 3D Hand Landmarks from Video Frame
        const { landmarks } = landmarkDetector.detect(webcamVideo, now);

        // Clear & Draw Hand Skeleton Overlay Canvas
        canvasCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

        if (landmarks && landmarks.length > 0) {
            landmarkDetector.drawLandmarks(canvasCtx, landmarks, outputCanvas.width, outputCanvas.height);
        }

        // If dataset collector is active, record real frame sample
        if (datasetCollector.isRecording && landmarks) {
            datasetCollector.recordFrame(landmarks, Date.now());
        }

        if (isPaused) {
            setStatus('paused', 'Recognition Paused');
            isProcessingFrame = false;
            return;
        }

        setStatus('recognizing', 'Recognizing');

        // 2. Predict Sign via Prediction Adapter (calls real trained AI model)
        let rawPrediction = { label: 'UNKNOWN', confidence: 0 };
        if (landmarks) {
            rawPrediction = await predictionAdapter.predictSign(landmarks);
        }


        // 3. Process Prediction via Stabilizer (Confidence Filter, 700ms Hold, Duplicate Prevention)
        const stabilizationResult = predictionStabilizer.processPrediction(
            rawPrediction,
            !!landmarks,
            Date.now()
        );

        // Update Current Sign UI
        const displayLabel = stabilizationResult.label;
        const confidencePct = Math.round(stabilizationResult.confidence * 100);

        currentSignLabel.textContent = displayLabel;
        confidencePercentage.textContent = `${confidencePct}%`;
        visualConfidenceBar.textContent = formatAsciiBar(stabilizationResult.confidence);
        confidenceFill.style.width = `${confidencePct}%`;

        // Update Stabilization Progress Bar
        if (stabilizationResult.status === 'STABILIZING') {
            stabilizerProgressWrapper.classList.remove('hidden');
            stabilizingLabel.textContent = `Stabilizing ${displayLabel}...`;
            const pct = Math.round(stabilizationResult.progress * 100);
            stabilizingPercent.textContent = `${pct}%`;
            stabilizerProgressBar.style.width = `${pct}%`;
        } else {
            stabilizerProgressWrapper.classList.add('hidden');
        }

        // 4. Handle Accepted Word Event
        if (stabilizationResult.status === 'ACCEPTED' && stabilizationResult.acceptedWord) {
            const wordAdded = sentenceBuilder.addWord(stabilizationResult.acceptedWord);
            if (wordAdded) {
                historyLogger.addEntry(stabilizationResult.acceptedWord, stabilizationResult.confidence);
                renderRecognizedText();
                renderHistory();
            }
        }
    } catch (err) {
        console.error("[Main] Error in processing loop:", err);
    } finally {
        isProcessingFrame = false;
    }
}

// Event Listeners & UI Controls

// Model Version Switcher
modelVersionSelect.addEventListener('change', (e) => {
    const version = e.target.value;
    islModel.setModelVersion(version);
    activeModelBadge.textContent = version.toUpperCase();
    predictionStabilizer.reset();
    populateCollectorDropdown();
    console.log(`[Main] Model switched to ${version}. Total classes: ${islModel.getClasses().length}`);
});

// View Navigation Tabs
tabLiveTranslator.addEventListener('click', () => {
    tabLiveTranslator.classList.add('active');
    tabCollectorStudio.classList.remove('active');
    liveTranslatorView.classList.remove('hidden');
    datasetCollectorView.classList.add('hidden');
});

tabCollectorStudio.addEventListener('click', () => {
    tabCollectorStudio.classList.add('active');
    tabLiveTranslator.classList.remove('active');
    datasetCollectorView.classList.remove('hidden');
    liveTranslatorView.classList.add('hidden');
});

btnBackToTranslator.addEventListener('click', () => {
    tabLiveTranslator.click();
});

// Dataset Collector Controls
collectorClassSelect.addEventListener('change', (e) => {
    datasetCollector.setTargetClass(e.target.value);
});

btnToggleRecord.addEventListener('click', () => {
    datasetCollector.toggleRecording();
});

btnExportDataset.addEventListener('click', () => {
    datasetCollector.exportDatasetJSON();
});

btnClearSamples.addEventListener('click', () => {
    if (confirm(`Clear all recorded samples for class ${datasetCollector.targetClass}?`)) {
        datasetCollector.clearClassSamples();
    }
});

// Pause / Resume Control
btnPause.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
        btnPause.className = 'btn btn-primary';
        pauseBtnText.textContent = 'Resume Recognition';
        btnPause.querySelector('.btn-icon').textContent = '▶️';
        setStatus('paused', 'Recognition Paused');
    } else {
        btnPause.className = 'btn btn-warning';
        pauseBtnText.textContent = 'Pause Recognition';
        btnPause.querySelector('.btn-icon').textContent = '⏸️';
        setStatus('recognizing', 'Recognizing');
    }
});

// Clear Text Control
btnClear.addEventListener('click', () => {
    sentenceBuilder.clearText();
    predictionStabilizer.reset();
    renderRecognizedText();
});

// Backspace Control
btnBackspace.addEventListener('click', () => {
    sentenceBuilder.removeLastWord();
    renderRecognizedText();
});

// Speak Control
btnSpeak.addEventListener('click', () => {
    const textToSpeak = sentenceBuilder.getSentence();
    if (textToSpeak) {
        speechService.speak(textToSpeak);
    }
});

// Clear History Control
btnClearHistory.addEventListener('click', () => {
    historyLogger.clear();
    renderHistory();
});

// Confidence Threshold Slider
thresholdSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    thresholdVal.textContent = `${Math.round(val * 100)}%`;
    predictionStabilizer.setConfidenceThreshold(val);
});

// Stabilization Duration Slider
stabilizationSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    stabilizationVal.textContent = `${val} ms`;
    predictionStabilizer.setStabilizationDuration(val);
});

// Initialize Application
async function init() {
    try {
        hideError();
        setStatus('processing', 'Loading MediaPipe...');

        // 1. Initialize MediaPipe Detector
        await landmarkDetector.initialize((msg) => setStatus('processing', msg));

        // 2. Start Camera Feed
        setStatus('processing', 'Starting Camera...');
        const cameraStarted = await cameraManager.startCamera((errMessage) => {
            showError(errMessage);
            setStatus('paused', 'Camera Error');
        });

        if (cameraStarted) {
            setStatus('recognizing', 'Recognizing');
            // Start Prediction Loop
            processLoop();
        }
    } catch (error) {
        console.error("[Main] Initialization failure:", error);
        showError("Failed to initialize AI landmark detector. Check internet connection for MediaPipe models.");
        setStatus('paused', 'Initialization Error');
    }
}

// Launch application on page load
window.addEventListener('DOMContentLoaded', init);
