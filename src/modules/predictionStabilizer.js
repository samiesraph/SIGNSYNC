/**
 * PredictionStabilizer Module
 * Filters by confidence threshold (default >= 0.75), applies temporal stabilization (default 700ms),
 * and prevents duplicate word additions until sign changes or resets.
 */

export const CONFIDENCE_THRESHOLD = 0.75;
export const STABILIZATION_MS = 700;

export class PredictionStabilizer {
    /**
     * @param {Object} options
     * @param {number} [options.confidenceThreshold=0.75] - Minimum required confidence (0.0 to 1.0)
     * @param {number} [options.stabilizationTimeMs=700] - Duration prediction must remain stable (ms)
     */
    constructor(options = {}) {
        this.confidenceThreshold = options.confidenceThreshold !== undefined ? options.confidenceThreshold : CONFIDENCE_THRESHOLD;
        this.stabilizationTimeMs = options.stabilizationTimeMs !== undefined ? options.stabilizationTimeMs : STABILIZATION_MS;

        this.candidateLabel = null;
        this.candidateStartTime = 0;
        this.lastAcceptedLabel = null;
        this.isHandPresent = false;
    }

    /**
     * Updates the configurable confidence threshold.
     * @param {number} threshold - Value between 0.0 and 1.0
     */
    setConfidenceThreshold(threshold) {
        this.confidenceThreshold = Math.max(0, Math.min(1, threshold));
    }

    /**
     * Updates the configurable stabilization duration.
     * @param {number} durationMs - Milliseconds
     */
    setStabilizationDuration(durationMs) {
        this.stabilizationTimeMs = Math.max(50, durationMs);
    }

    /**
     * Processes a raw prediction from predictionAdapter.
     * @param {Object} prediction - { label: string, confidence: number }
     * @param {boolean} [handDetected=true] - Whether hand landmarks are currently detected
     * @param {number} [timestamp=Date.now()] - Frame timestamp
     * @returns {Object} {
     *   status: 'ACCEPTED' | 'STABILIZING' | 'LOW_CONFIDENCE' | 'UNKNOWN' | 'NO_HAND' | 'DUPLICATE',
     *   label: string,
     *   confidence: number,
     *   acceptedWord: string|null,
     *   progress: number // 0.0 to 1.0 stabilization progress
     * }
     */
    processPrediction(prediction, handDetected = true, timestamp = Date.now()) {
        if (!handDetected || !prediction || !prediction.label) {
            this.candidateLabel = null;
            this.candidateStartTime = 0;
            // Reset duplicate prevention when hand is removed from view
            this.lastAcceptedLabel = null;
            return {
                status: 'NO_HAND',
                label: 'No hand detected',
                confidence: 0,
                acceptedWord: null,
                progress: 0
            };
        }

        const { label, confidence } = prediction;
        const normalizedLabel = label.trim().toUpperCase();

        // 1. Unknown sign check
        if (!normalizedLabel || normalizedLabel === 'UNKNOWN') {
            this.candidateLabel = null;
            this.candidateStartTime = 0;
            return {
                status: 'UNKNOWN',
                label: 'Unknown sign',
                confidence: confidence || 0,
                acceptedWord: null,
                progress: 0
            };
        }

        // 2. Confidence filter check (Threshold >= 0.75)
        if (confidence < this.confidenceThreshold) {
            this.candidateLabel = null;
            this.candidateStartTime = 0;
            return {
                status: 'LOW_CONFIDENCE',
                label: 'Uncertain sign',
                confidence: confidence,
                acceptedWord: null,
                progress: 0
            };
        }

        // 3. Duplicate prevention check
        if (normalizedLabel === this.lastAcceptedLabel) {
            return {
                status: 'DUPLICATE',
                label: normalizedLabel,
                confidence: confidence,
                acceptedWord: null,
                progress: 1.0
            };
        }

        // 4. Temporal stabilization (Hold window)
        if (normalizedLabel !== this.candidateLabel) {
            // New sign candidate detected - start timer
            this.candidateLabel = normalizedLabel;
            this.candidateStartTime = timestamp;
            return {
                status: 'STABILIZING',
                label: normalizedLabel,
                confidence: confidence,
                acceptedWord: null,
                progress: 0.1
            };
        }

        // Same sign candidate continues
        const elapsedTime = timestamp - this.candidateStartTime;
        const progress = Math.min(1.0, elapsedTime / this.stabilizationTimeMs);

        if (elapsedTime >= this.stabilizationTimeMs) {
            // Stability duration met! Accept prediction
            this.lastAcceptedLabel = normalizedLabel;
            this.candidateLabel = null;
            this.candidateStartTime = 0;

            return {
                status: 'ACCEPTED',
                label: normalizedLabel,
                confidence: confidence,
                acceptedWord: normalizedLabel,
                progress: 1.0
            };
        }

        return {
            status: 'STABILIZING',
            label: normalizedLabel,
            confidence: confidence,
            acceptedWord: null,
            progress: progress
        };
    }

    /**
     * Resets stabilizer state.
     */
    reset() {
        this.candidateLabel = null;
        this.candidateStartTime = 0;
        this.lastAcceptedLabel = null;
    }
}
