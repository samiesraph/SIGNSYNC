/**
 * SentenceBuilder Module
 * Manages recognized words in application state and provides sentence mutation logic.
 */

export class SentenceBuilder {
    constructor() {
        this.recognizedWords = [];
    }

    /**
     * Adds a recognized word to the sentence state.
     * @param {string} word - The recognized label (e.g., "HELLO", "SPACE")
     * @returns {boolean} True if state changed, false otherwise.
     */
    addWord(word) {
        if (!word || typeof word !== 'string') return false;

        const cleanWord = word.trim().toUpperCase();

        if (!cleanWord || cleanWord === 'UNKNOWN') return false;

        if (cleanWord === 'SPACE' || cleanWord === 'PAUSE') {
            // Space separator handled if needed or represented by space string
            if (this.recognizedWords.length > 0 && this.recognizedWords[this.recognizedWords.length - 1] !== '') {
                // If last item isn't space, we don't necessarily push empty string if join(' ') handles spaces,
                // but we ensure clean word separation.
            }
            return false;
        }

        this.recognizedWords.push(cleanWord);
        return true;
    }

    /**
     * Removes the last recognized word from sentence (Backspace).
     * @returns {string|null} Removed word or null if empty.
     */
    removeLastWord() {
        if (this.recognizedWords.length === 0) return null;
        return this.recognizedWords.pop();
    }

    /**
     * Clears all recognized words from sentence.
     */
    clearText() {
        this.recognizedWords = [];
    }

    /**
     * Resets the entire prediction & sentence state.
     */
    resetPredictionState() {
        this.recognizedWords = [];
    }

    /**
     * Returns the formatted sentence string.
     * @returns {string} e.g. "HELLO HOW ARE YOU"
     */
    getSentence() {
        return this.recognizedWords.join(' ');
    }

    /**
     * Returns copy of array of recognized words.
     * @returns {string[]}
     */
    getWords() {
        return [...this.recognizedWords];
    }
}
