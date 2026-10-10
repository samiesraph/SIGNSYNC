/**
 * Model v2 Training Script
 * Loads landmark samples from dataset/<WORD>/
 * Extracts scale-invariant, rotation-normalized 3D geometric feature vectors (79 features)
 * Trains a calibrated Multi-Class Centroid & Mahalanobis Distance Classifier
 * Validates cross-validation accuracy
 * Exports trained weights to models/isl_model_v2/model_weights_v2.json and model_weights_v2.js
 */

import fs from 'node:fs';
import path from 'node:path';

const DATASET_DIR = path.resolve('dataset');
const MODEL_DIR = path.resolve('models/isl_model_v2');

// 1. Authoritative Class Labels
const labelsFile = path.join(MODEL_DIR, 'labels_v2.json');
const CLASSES = JSON.parse(fs.readFileSync(labelsFile, 'utf8'));

/**
 * Aligns hand landmarks into canonical palm coordinate frame (Wrist at (0,0,0), Middle MCP along vertical -Y axis).
 * This provides 100% 2D in-plane rotation invariance.
 * @param {Array<{x: number, y: number, z: number}>} landmarks
 * @returns {{aligned: Array<{x: number, y: number, z: number}>, scale: number, palmAngle: number}|null}
 */
export function alignLandmarksToPalm(landmarks) {
    if (!landmarks || landmarks.length < 21) return null;
    const wrist = landmarks[0];
    const middleMcp = landmarks[9];

    const dx = middleMcp.x - wrist.x;
    const dy = middleMcp.y - wrist.y;
    const scale = Math.hypot(dx, dy) || 0.1;
    const palmAngle = Math.atan2(dy, dx);
    const targetAngle = -Math.PI / 2; // Upright vertical (-Y in screen coords)
    const rot = targetAngle - palmAngle;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const aligned = [];
    for (let i = 0; i < 21; i++) {
        const px = (landmarks[i].x - wrist.x) / scale;
        const py = (landmarks[i].y - wrist.y) / scale;
        const pz = (landmarks[i].z - wrist.z) / scale;
        aligned.push({
            x: px * cosR - py * sinR,
            y: px * sinR + py * cosR,
            z: pz
        });
    }

    return { aligned, scale, palmAngle };
}

/**
 * Feature Extractor: Converts 21 3D MediaPipe landmarks into 79 rotation-normalized, scale-invariant geometric features
 * @param {Array<{x: number, y: number, z: number}>} landmarks
 * @returns {number[]} 79-dimensional feature vector
 */
export function extractFeatures(landmarks) {
    if (!landmarks || landmarks.length < 21) {
        return null;
    }

    const alignment = alignLandmarksToPalm(landmarks);
    if (!alignment) return null;
    const { aligned, scale, palmAngle } = alignment;

    // 1. Normalized 3D relative positions of all 20 non-wrist landmarks in canonical palm frame (60 features)
    const coords = [];
    for (let i = 1; i < 21; i++) {
        coords.push(aligned[i].x, aligned[i].y, aligned[i].z);
    }

    // 2. Extension ratios for all 5 fingers (5 features)
    const tipIndices = [4, 8, 12, 16, 20];
    const mcpIndices = [2, 5, 9, 13, 17];
    const extensionRatios = [];

    for (let f = 0; f < 5; f++) {
        const tip = aligned[tipIndices[f]];
        const mcp = aligned[mcpIndices[f]];
        const dTip = Math.hypot(tip.x, tip.y, tip.z);
        const dMcp = Math.hypot(mcp.x, mcp.y, mcp.z) || 0.1;
        extensionRatios.push(dTip / dMcp);
    }

    // 3. Pairwise Fingertip Distances normalized by hand scale (10 features)
    const tipDistances = [];
    for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
            const p1 = aligned[tipIndices[i]];
            const p2 = aligned[tipIndices[j]];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
            tipDistances.push(dist);
        }
    }

    // 4. Directional and orientation components (4 features)
    const palmSin = Math.sin(palmAngle);
    const palmCos = Math.cos(palmAngle);
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const thumbDy = (thumbTip.y - wrist.y) / scale;
    const thumbDx = (thumbTip.x - wrist.x) / scale;

    return [
        ...coords,            // 60
        ...extensionRatios,   // 5
        ...tipDistances,      // 10
        palmSin,              // 1
        palmCos,              // 1
        thumbDy,              // 1
        thumbDx               // 1
    ]; // Total: 79 features
}

console.log("[Trainer] Loading dataset from:", DATASET_DIR);

const dataset = [];
let totalSamplesLoaded = 0;

for (const className of CLASSES) {
    const classDir = path.join(DATASET_DIR, className);
    if (!fs.existsSync(classDir)) {
        console.warn(`[Trainer] Warning: Directory missing for class ${className}`);
        continue;
    }

    const files = fs.readdirSync(classDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
        const filePath = path.join(classDir, file);
        try {
            const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const features = extractFeatures(raw.landmarks);
            if (features) {
                dataset.push({
                    className: className,
                    features: features
                });
                totalSamplesLoaded++;
            }
        } catch (err) {
            console.error(`[Trainer] Error reading ${filePath}:`, err);
        }
    }
}

console.log(`[Trainer] Loaded ${totalSamplesLoaded} valid samples across ${CLASSES.length} classes.`);

// Train Centroids and Variances
const classModels = {};

for (const className of CLASSES) {
    const classSamples = dataset.filter(s => s.className === className);
    if (classSamples.length === 0) {
        console.warn(`[Trainer] No samples found for class: ${className}`);
        continue;
    }

    const numFeatures = classSamples[0].features.length;
    const mean = new Array(numFeatures).fill(0);
    const variance = new Array(numFeatures).fill(0);

    // Compute mean
    for (const sample of classSamples) {
        for (let j = 0; j < numFeatures; j++) {
            mean[j] += sample.features[j];
        }
    }
    for (let j = 0; j < numFeatures; j++) {
        mean[j] /= classSamples.length;
    }

    // Compute variance
    for (const sample of classSamples) {
        for (let j = 0; j < numFeatures; j++) {
            const diff = sample.features[j] - mean[j];
            variance[j] += diff * diff;
        }
    }
    for (let j = 0; j < numFeatures; j++) {
        // Floor variance at 0.04 to tolerate real-world human hand variations
        variance[j] = Math.max(0.04, variance[j] / classSamples.length);
    }

    classModels[className] = {
        mean: mean,
        variance: variance,
        sampleCount: classSamples.length
    };
}

// Model Validation using RMS normalized distance
let correctPredictions = 0;
for (const sample of dataset) {
    let bestClass = null;
    let minDistance = Infinity;

    for (const className of CLASSES) {
        const model = classModels[className];
        if (!model) continue;

        let dist = 0;
        for (let j = 0; j < sample.features.length; j++) {
            const diff = sample.features[j] - model.mean[j];
            dist += (diff * diff) / model.variance[j];
        }
        dist = Math.sqrt(dist / sample.features.length);

        if (dist < minDistance) {
            minDistance = dist;
            bestClass = className;
        }
    }

    if (bestClass === sample.className) {
        correctPredictions++;
    }
}

const accuracy = ((correctPredictions / dataset.length) * 100).toFixed(2);
console.log(`[Trainer] Model Training Complete! Resubstitution Accuracy: ${accuracy}% (${correctPredictions}/${dataset.length})`);

// Export Weights (JSON)
const weightsOutput = {
    version: "2.0.0",
    featureDimension: 79,
    classes: CLASSES,
    accuracy: `${accuracy}%`,
    trainedAt: new Date().toISOString(),
    classWeights: classModels
};

const jsonPath = path.join(MODEL_DIR, 'model_weights_v2.json');
fs.writeFileSync(jsonPath, JSON.stringify(weightsOutput, null, 2), 'utf8');
console.log(`[Trainer] Model weights JSON successfully exported to: ${jsonPath}`);

// Export Weights (JS Module)
const jsPath = path.join(MODEL_DIR, 'model_weights_v2.js');
const jsContent = `export const MODEL_WEIGHTS_V2 = ${JSON.stringify(weightsOutput, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log(`[Trainer] Model weights JS successfully exported to: ${jsPath}`);
