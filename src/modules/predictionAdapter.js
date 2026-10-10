/**
 * PredictionAdapter Module
 * Standardizes raw model outputs into `{ label: string, confidence: number }` format.
 */

export class PredictionAdapter {
    /**
     * @param {Object} model - The ISL model instance
     */
    constructor(model) {
        this.model = model;
    }

    /**
     * Standard prediction function matching requirement #1.
     * @param {Object|Array} input - Hand landmarks or image frame
     * @returns {Promise<{label: string, confidence: number}>}
     */
    async predictSign(input) {
        if (!input) {
            return { label: "UNKNOWN", confidence: 0 };
        }

        try {
            // Call the real ISL model
            const rawPrediction = await this.model.predictFromLandmarks(input);

            // Normalize and adapt format
            const predictionLabel = (rawPrediction && rawPrediction.label) ? String(rawPrediction.label).toUpperCase() : "UNKNOWN";
            const predictionConfidence = (rawPrediction && typeof rawPrediction.confidence === 'number') ? rawPrediction.confidence : 0;

            return {
                label: predictionLabel,
                confidence: predictionConfidence
            };
        } catch (error) {
            console.error("[PredictionAdapter] Error during sign prediction:", error);
            return {
                label: "UNKNOWN",
                confidence: 0
            };
        }
    }
}
