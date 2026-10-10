/**
 * HistoryLogger Module
 * Tracks accepted predictions with timestamps for the history panel.
 */

export class HistoryLogger {
    /**
     * @param {number} [maxEntries=20]
     */
    constructor(maxEntries = 20) {
        this.maxEntries = maxEntries;
        this.history = [];
    }

    /**
     * Adds an accepted prediction entry.
     * @param {string} label - Recognized sign label
     * @param {number} confidence - Confidence value (0.0 to 1.0)
     * @returns {Object} New entry object
     */
    addEntry(label, confidence) {
        if (!label) return null;

        const timeStr = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const entry = {
            id: Date.now() + Math.random(),
            timestamp: timeStr,
            label: label.toUpperCase(),
            confidencePercentage: Math.round(confidence * 100)
        };

        this.history.unshift(entry); // Newest first

        if (this.history.length > this.maxEntries) {
            this.history = this.history.slice(0, this.maxEntries);
        }

        return entry;
    }

    /**
     * Clears all history entries.
     */
    clear() {
        this.history = [];
    }

    /**
     * Returns history list.
     * @returns {Array<Object>}
     */
    getHistory() {
        return [...this.history];
    }
}
