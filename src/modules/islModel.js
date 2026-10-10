/**
 * ISL Recognition AI Model Manager
 * Supports Model Versioning:
 * - Version 2.0 (Default): Expanded 30-class authentic ISL landmark model
 * - Version 1.0: Baseline 7-class landmark model
 * Also provides an integration point for external custom TensorFlow.js / TFLite models.
 */

import { ISLModelV1 } from '../../models/isl_model_v1/islModel_v1.js';
import { ISLModelV2 } from '../../models/isl_model_v2/islModel_v2.js';

export class ISLModel {
    constructor() {
        this.modelV1 = new ISLModelV1();
        this.modelV2 = new ISLModelV2();

        // Default to Version 2.0 (Expanded Real ISL Model)
        this.activeVersion = 'v2';

        this.customModel = null;
        this.isCustomModelLoaded = false;
    }

    /**
     * Sets active model version.
     * @param {'v1' | 'v2'} version
     */
    setModelVersion(version) {
        if (version === 'v1' || version === 'v2') {
            this.activeVersion = version;
            console.log(`[ISLModel] Switched to Model Version: ${version.toUpperCase()}`);
            return true;
        }
        console.warn(`[ISLModel] Invalid version requested: ${version}. Supported versions: 'v1', 'v2'`);
        return false;
    }

    /**
     * Returns current active model version string.
     * @returns {'v1' | 'v2'}
     */
    getModelVersion() {
        return this.activeVersion;
    }

    /**
     * Returns list of classes recognized by active model.
     * @returns {string[]}
     */
    getClasses() {
        if (this.isCustomModelLoaded && this.customModel && this.customModel.classes) {
            return this.customModel.classes;
        }
        return this.activeVersion === 'v1' ? this.modelV1.classes : this.modelV2.classes;
    }

    /**
     * Optional hook to attach an external TensorFlow.js / custom model.
     * @param {Object|Function} model - Custom model instance or predict function
     */
    async loadCustomModel(model) {
        this.customModel = model;
        this.isCustomModelLoaded = true;
        console.log("[ISLModel] External custom model loaded into pipeline.");
    }

    /**
     * Real ISL Landmark Classifier inference.
     * Analyzes 21 MediaPipe hand landmarks (wrist, thumb, index, middle, ring, pinky).
     * @param {Array<{x: number, y: number, z: number}>} landmarks - 21 hand keypoints
     * @returns {Promise<{label: string, confidence: number}>} Real prediction object
     */
    async predictFromLandmarks(landmarks) {
        // If external custom model is registered, delegate inference to it
        if (this.isCustomModelLoaded && this.customModel) {
            try {
                if (typeof this.customModel.predict === 'function') {
                    return await this.customModel.predict(landmarks);
                } else if (typeof this.customModel === 'function') {
                    return await this.customModel(landmarks);
                }
            } catch (err) {
                console.error("[ISLModel] Error executing custom model inference:", err);
            }
        }

        if (!landmarks || landmarks.length < 21) {
            return { label: "UNKNOWN", confidence: 0 };
        }

        // Delegate to active model version
        if (this.activeVersion === 'v1') {
            return await this.modelV1.predict(landmarks);
        } else {
            return await this.modelV2.predict(landmarks);
        }
    }
}
