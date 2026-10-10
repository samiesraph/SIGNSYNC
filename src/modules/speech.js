/**
 * SpeechService Module
 * Web Speech API Text-to-Speech integration.
 */

export class SpeechService {
    constructor() {
        this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
        this.isSpeaking = false;
    }

    /**
     * Speaks the given text string.
     * @param {string} text - Text to speak
     * @param {Function} [onEnd] - Callback when speech ends
     * @returns {boolean} Success status
     */
    speak(text, onEnd = () => {}) {
        if (!this.synth) {
            console.warn("[SpeechService] Web Speech API is not supported in this browser.");
            return false;
        }

        if (!text || text.trim() === '') {
            return false;
        }

        // Cancel active speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';

        utterance.onend = () => {
            this.isSpeaking = false;
            onEnd();
        };

        utterance.onerror = (e) => {
            this.isSpeaking = false;
            console.error("[SpeechService] Speech synthesis error:", e);
            onEnd();
        };

        this.isSpeaking = true;
        this.synth.speak(utterance);
        return true;
    }

    /**
     * Stops current speech output.
     */
    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.isSpeaking = false;
        }
    }
}
