import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { SentenceBuilder } from '../src/modules/sentenceBuilder.js';
import { PredictionStabilizer } from '../src/modules/predictionStabilizer.js';
import { PredictionAdapter } from '../src/modules/predictionAdapter.js';
import { ISLModel } from '../src/modules/islModel.js';
import { DatasetCollector } from '../src/modules/datasetCollector.js';

test('Pipeline Test 1: Single High-Confidence Prediction (HELLO 94%)', async () => {
    const builder = new SentenceBuilder();
    const stabilizer = new PredictionStabilizer({ confidenceThreshold: 0.75, stabilizationTimeMs: 100 });

    const time1 = 1000;
    const res1 = stabilizer.processPrediction({ label: 'HELLO', confidence: 0.94 }, true, time1);
    assert.equal(res1.status, 'STABILIZING');

    // After stabilization time (100ms)
    const time2 = time1 + 150;
    const res2 = stabilizer.processPrediction({ label: 'HELLO', confidence: 0.94 }, true, time2);
    assert.equal(res2.status, 'ACCEPTED');
    assert.equal(res2.acceptedWord, 'HELLO');

    if (res2.acceptedWord) {
        builder.addWord(res2.acceptedWord);
    }

    assert.equal(builder.getSentence(), 'HELLO');
});

test('Pipeline Test 2: Continuous Predictions (HELLO 94%, 95%, 93%, 94%) produces single word', async () => {
    const builder = new SentenceBuilder();
    const stabilizer = new PredictionStabilizer({ confidenceThreshold: 0.75, stabilizationTimeMs: 100 });

    let now = 1000;
    // Frame 1
    let r = stabilizer.processPrediction({ label: 'HELLO', confidence: 0.94 }, true, now);
    if (r.acceptedWord) builder.addWord(r.acceptedWord);

    // Frame 2 (after 120ms - met stabilization)
    now += 120;
    r = stabilizer.processPrediction({ label: 'HELLO', confidence: 0.95 }, true, now);
    if (r.acceptedWord) builder.addWord(r.acceptedWord);

    // Frame 3 (holding same sign)
    now += 50;
    r = stabilizer.processPrediction({ label: 'HELLO', confidence: 0.93 }, true, now);
    assert.equal(r.status, 'DUPLICATE');
    if (r.acceptedWord) builder.addWord(r.acceptedWord);

    // Frame 4 (holding same sign)
    now += 50;
    r = stabilizer.processPrediction({ label: 'HELLO', confidence: 0.94 }, true, now);
    assert.equal(r.status, 'DUPLICATE');
    if (r.acceptedWord) builder.addWord(r.acceptedWord);

    assert.equal(builder.getSentence(), 'HELLO');
});

test('Pipeline Test 3: Sequence (HELLO -> HOW -> ARE -> YOU) becomes HELLO HOW ARE YOU', async () => {
    const builder = new SentenceBuilder();
    const stabilizer = new PredictionStabilizer({ confidenceThreshold: 0.75, stabilizationTimeMs: 50 });

    const sequence = ['HELLO', 'HOW', 'ARE', 'YOU'];
    let timestamp = 1000;

    for (const word of sequence) {
        // Start candidate
        stabilizer.processPrediction({ label: word, confidence: 0.92 }, true, timestamp);
        // Wait 60ms to stabilize
        timestamp += 60;
        const res = stabilizer.processPrediction({ label: word, confidence: 0.92 }, true, timestamp);
        assert.equal(res.status, 'ACCEPTED');
        builder.addWord(res.acceptedWord);
        timestamp += 100;
    }

    assert.equal(builder.getSentence(), 'HELLO HOW ARE YOU');
});

test('Pipeline Test 4: Low Confidence (HELLO 55%) ignored', async () => {
    const builder = new SentenceBuilder();
    const stabilizer = new PredictionStabilizer({ confidenceThreshold: 0.75, stabilizationTimeMs: 50 });

    const res = stabilizer.processPrediction({ label: 'HELLO', confidence: 0.55 }, true, 1000);
    assert.equal(res.status, 'LOW_CONFIDENCE');
    assert.equal(res.label, 'Uncertain sign');
    assert.equal(res.acceptedWord, null);

    if (res.acceptedWord) builder.addWord(res.acceptedWord);
    assert.equal(builder.getSentence(), '');
});

test('Pipeline Test 5: Unknown Prediction (UNKNOWN 90%) ignored', async () => {
    const builder = new SentenceBuilder();
    const stabilizer = new PredictionStabilizer({ confidenceThreshold: 0.75, stabilizationTimeMs: 50 });

    const res = stabilizer.processPrediction({ label: 'UNKNOWN', confidence: 0.90 }, true, 1000);
    assert.equal(res.status, 'UNKNOWN');
    assert.equal(res.label, 'Unknown sign');
    assert.equal(res.acceptedWord, null);

    if (res.acceptedWord) builder.addWord(res.acceptedWord);
    assert.equal(builder.getSentence(), '');
});

test('Pipeline Test 6: Backspace (HELLO HOW ARE YOU -> HELLO HOW ARE)', () => {
    const builder = new SentenceBuilder();
    builder.addWord('HELLO');
    builder.addWord('HOW');
    builder.addWord('ARE');
    builder.addWord('YOU');

    assert.equal(builder.getSentence(), 'HELLO HOW ARE YOU');
    builder.removeLastWord();
    assert.equal(builder.getSentence(), 'HELLO HOW ARE');
});

test('Pipeline Test 7: Clear (HELLO HOW ARE -> [empty])', () => {
    const builder = new SentenceBuilder();
    builder.addWord('HELLO');
    builder.addWord('HOW');
    builder.addWord('ARE');

    assert.equal(builder.getSentence(), 'HELLO HOW ARE');
    builder.clearText();
    assert.equal(builder.getSentence(), '');
});

test('Pipeline Test 8: PredictionAdapter returns clean { label, confidence }', async () => {
    const islModel = new ISLModel();
    const adapter = new PredictionAdapter(islModel);

    // Mock 21 landmarks
    const landmarks = Array(21).fill(0).map((_, i) => ({ x: 0.5, y: 0.5 - (i * 0.01), z: 0 }));
    const result = await adapter.predictSign(landmarks);

    assert.ok(typeof result.label === 'string');
    assert.ok(typeof result.confidence === 'number');
    assert.ok(result.confidence >= 0 && result.confidence <= 1);
});

test('Pipeline Test 9: Model Versioning (v1 vs v2)', () => {
    const islModel = new ISLModel();

    // Default is v2
    assert.equal(islModel.getModelVersion(), 'v2');
    assert.equal(islModel.getClasses().length, 30);
    assert.ok(islModel.getClasses().includes('WATER'));
    assert.ok(islModel.getClasses().includes('FOOD'));
    assert.ok(islModel.getClasses().includes('HELP'));

    // Switch to v1
    islModel.setModelVersion('v1');
    assert.equal(islModel.getModelVersion(), 'v1');
    assert.equal(islModel.getClasses().length, 7);
    assert.ok(islModel.getClasses().includes('HELLO'));
    assert.ok(!islModel.getClasses().includes('WATER'));

    // Switch back to v2
    islModel.setModelVersion('v2');
    assert.equal(islModel.getModelVersion(), 'v2');
    assert.equal(islModel.getClasses().length, 30);
});

test('Pipeline Test 10: Real Trained Model v2 Recognizes Expanded ISL Classes from Real Landmarks', async () => {
    const islModel = new ISLModel();
    islModel.setModelVersion('v2');
    const adapter = new PredictionAdapter(islModel);

    // Test real samples from dataset
    const testSigns = ['WATER', 'FOOD', 'HELP', 'YES', 'NO', 'HELLO', 'BAD', 'DRINK'];

    for (const sign of testSigns) {
        const samplePath = `dataset/${sign}/sample_001.json`;
        assert.ok(fs.existsSync(samplePath), `Sample file must exist: ${samplePath}`);
        const sampleData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));

        const pred = await adapter.predictSign(sampleData.landmarks);
        assert.equal(pred.label, sign, `Expected ${sign}, got ${pred.label}`);
        assert.ok(pred.confidence >= 0.75, `Expected confidence >= 0.75 for ${sign}, got ${pred.confidence}`);
    }
});

test('Pipeline Test 11: Multi-Word Sequence & Duplicate Prevention with New ISL Classes (WATER -> FOOD -> WATER)', async () => {
    const builder = new SentenceBuilder();
    const stabilizer = new PredictionStabilizer({ confidenceThreshold: 0.75, stabilizationTimeMs: 700 });

    let now = 1000;

    // 1. Send WATER frames
    stabilizer.processPrediction({ label: 'WATER', confidence: 0.94 }, true, now);
    now += 750;
    const res1 = stabilizer.processPrediction({ label: 'WATER', confidence: 0.94 }, true, now);
    assert.equal(res1.status, 'ACCEPTED');
    assert.equal(res1.acceptedWord, 'WATER');
    builder.addWord(res1.acceptedWord);

    // 2. Continuous duplicate WATER frames must be suppressed
    now += 50;
    const resDup = stabilizer.processPrediction({ label: 'WATER', confidence: 0.95 }, true, now);
    assert.equal(resDup.status, 'DUPLICATE');
    assert.equal(resDup.acceptedWord, null);

    // 3. User switches to FOOD sign
    now += 100;
    stabilizer.processPrediction({ label: 'FOOD', confidence: 0.92 }, true, now);
    now += 750;
    const res2 = stabilizer.processPrediction({ label: 'FOOD', confidence: 0.92 }, true, now);
    assert.equal(res2.status, 'ACCEPTED');
    assert.equal(res2.acceptedWord, 'FOOD');
    builder.addWord(res2.acceptedWord);

    // 4. User switches back to WATER sign (must be accepted now that sign transitioned)
    now += 100;
    stabilizer.processPrediction({ label: 'WATER', confidence: 0.93 }, true, now);
    now += 750;
    const res3 = stabilizer.processPrediction({ label: 'WATER', confidence: 0.93 }, true, now);
    assert.equal(res3.status, 'ACCEPTED');
    assert.equal(res3.acceptedWord, 'WATER');
    builder.addWord(res3.acceptedWord);

    // Sentence should be "WATER FOOD WATER"
    assert.equal(builder.getSentence(), 'WATER FOOD WATER');
});

test('Pipeline Test 12: Low-Confidence Rejection on New ISL Signs (Threshold >= 0.75)', () => {
    const builder = new SentenceBuilder();
    const stabilizer = new PredictionStabilizer({ confidenceThreshold: 0.75, stabilizationTimeMs: 700 });

    // Under threshold (e.g. 72%)
    const res = stabilizer.processPrediction({ label: 'WATER', confidence: 0.72 }, true, 1000);
    assert.equal(res.status, 'LOW_CONFIDENCE');
    assert.equal(res.label, 'Uncertain sign');
    assert.equal(res.acceptedWord, null);

    if (res.acceptedWord) builder.addWord(res.acceptedWord);
    assert.equal(builder.getSentence(), '');
});

test('Pipeline Test 13: DatasetCollector Records Real Webcam Landmark Samples', () => {
    let progressReported = null;
    const collector = new DatasetCollector({
        targetCount: 5,
        onProgress: (p) => { progressReported = p; }
    });

    collector.setTargetClass('HELP');
    assert.equal(collector.targetClass, 'HELP');
    assert.equal(collector.getSampleCount(), 0);

    collector.startRecording();
    assert.equal(collector.isRecording, true);

    const mockLandmarks = Array(21).fill(0).map((_, i) => ({ x: 0.5, y: 0.5 - (i * 0.01), z: 0 }));

    // Record sample 1
    const r1 = collector.recordFrame(mockLandmarks, 1000);
    assert.equal(r1, true);
    assert.equal(collector.getSampleCount(), 1);

    // Throttling prevents duplicate within 120ms
    const rThrottle = collector.recordFrame(mockLandmarks, 1050);
    assert.equal(rThrottle, false);
    assert.equal(collector.getSampleCount(), 1);

    // Sample 2 after 150ms
    const r2 = collector.recordFrame(mockLandmarks, 1200);
    assert.equal(r2, true);
    assert.equal(collector.getSampleCount(), 2);

    assert.ok(progressReported);
    assert.equal(progressReported.targetClass, 'HELP');
    assert.equal(progressReported.count, 2);
    assert.equal(progressReported.targetCount, 5);

    collector.stopRecording();
    assert.equal(collector.isRecording, false);
});

test('Pipeline Test 14: Model v2 Rotation-Invariance on Real Webcam Hands (25° Tilt)', async () => {
    const islModel = new ISLModel();
    islModel.setModelVersion('v2');
    const adapter = new PredictionAdapter(islModel);

    const testSigns = ['WATER', 'FOOD', 'HELLO', 'YES', 'HOW', 'YOU'];

    for (const sign of testSigns) {
        const samplePath = `dataset/${sign}/sample_001.json`;
        const sampleData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
        const wrist = sampleData.landmarks[0];

        // Rotate landmarks by 25 degrees (simulating forearm angle in front of webcam)
        const angle = 25 * Math.PI / 180;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotatedLandmarks = sampleData.landmarks.map(p => ({
            x: wrist.x + (p.x - wrist.x) * cosA - (p.y - wrist.y) * sinA,
            y: wrist.y + (p.x - wrist.x) * sinA + (p.y - wrist.y) * cosA,
            z: p.z
        }));

        const pred = await adapter.predictSign(rotatedLandmarks);
        assert.equal(pred.label, sign, `Expected ${sign} after 25° rotation, got ${pred.label}`);
        assert.ok(pred.confidence >= 0.75, `Expected confidence >= 0.75 for rotated ${sign}, got ${pred.confidence}`);
    }
});

test('Pipeline Test 15: Model v2 Scale-Invariance across Camera Distances (1.3x Scale)', async () => {
    const islModel = new ISLModel();
    islModel.setModelVersion('v2');
    const adapter = new PredictionAdapter(islModel);

    const samplePath = `dataset/WATER/sample_001.json`;
    const sampleData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
    const wrist = sampleData.landmarks[0];

    // Scale landmarks by 1.3x (simulating hand closer to camera)
    const scaledLandmarks = sampleData.landmarks.map(p => ({
        x: wrist.x + (p.x - wrist.x) * 1.3,
        y: wrist.y + (p.y - wrist.y) * 1.3,
        z: wrist.z + (p.z - wrist.z) * 1.3
    }));

    const pred = await adapter.predictSign(scaledLandmarks);
    assert.equal(pred.label, 'WATER');
    assert.ok(pred.confidence >= 0.75);
});

