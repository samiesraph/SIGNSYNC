/**
 * DatasetCollector Module
 * Allows users to record real MediaPipe 3D landmark samples directly from their webcam.
 * Displays real-time progress:
 * "Current class: WATER | Samples collected: 23 / 100"
 */

export class DatasetCollector {
    /**
     * @param {Object} options
     * @param {number} [options.targetCount=100] - Target number of samples per class
     * @param {Function} [options.onProgress] - Callback for sample count updates
     */
    constructor(options = {}) {
        this.targetClass = 'WATER';
        this.targetCount = options.targetCount || 100;
        this.isRecording = false;
        this.samplesByClass = {}; // { 'WATER': [sample1, sample2, ...] }
        this.onProgress = options.onProgress || (() => {});
        this.lastSampleTime = 0;
        this.minSampleIntervalMs = 120; // Captures genuine, naturally varying frames (approx 8 samples/sec)
    }

    /**
     * Sets the active class for recording.
     * @param {string} className
     */
    setTargetClass(className) {
        if (!className) return;
        this.targetClass = className.trim().toUpperCase();
        if (!this.samplesByClass[this.targetClass]) {
            this.samplesByClass[this.targetClass] = [];
        }
        this.notifyProgress();
    }

    /**
     * Returns current sample count for target class.
     * @returns {number}
     */
    getSampleCount(className = this.targetClass) {
        return (this.samplesByClass[className] || []).length;
    }

    /**
     * Starts recording samples.
     */
    startRecording() {
        this.isRecording = true;
        this.notifyProgress();
    }

    /**
     * Stops recording samples.
     */
    stopRecording() {
        this.isRecording = false;
        this.notifyProgress();
    }

    /**
     * Toggles recording state.
     * @returns {boolean} New recording state
     */
    toggleRecording() {
        this.isRecording = !this.isRecording;
        this.notifyProgress();
        return this.isRecording;
    }

    /**
     * Processes live frame landmarks from webcam.
     * @param {Array<{x: number, y: number, z: number}>|null} landmarks
     * @param {number} [timestamp=Date.now()]
     * @returns {boolean} True if a sample was recorded
     */
    recordFrame(landmarks, timestamp = Date.now()) {
        if (!this.isRecording || !landmarks || landmarks.length < 21) {
            return false;
        }

        // Throttle to avoid capturing identical duplicate frames
        if (timestamp - this.lastSampleTime < this.minSampleIntervalMs) {
            return false;
        }

        if (!this.samplesByClass[this.targetClass]) {
            this.samplesByClass[this.targetClass] = [];
        }

        const classSamples = this.samplesByClass[this.targetClass];

        if (classSamples.length >= this.targetCount) {
            this.stopRecording();
            return false;
        }

        const sample = {
            class: this.targetClass,
            sampleId: classSamples.length + 1,
            timestamp: timestamp,
            landmarks: landmarks.map(pt => ({
                x: Number(pt.x.toFixed(4)),
                y: Number(pt.y.toFixed(4)),
                z: Number(pt.z.toFixed(4))
            }))
        };

        classSamples.push(sample);
        this.lastSampleTime = timestamp;

        this.notifyProgress();

        if (classSamples.length >= this.targetCount) {
            this.stopRecording();
        }

        return true;
    }

    /**
     * Notifies progress callback.
     */
    notifyProgress() {
        const count = this.getSampleCount();
        this.onProgress({
            targetClass: this.targetClass,
            count: count,
            targetCount: this.targetCount,
            isRecording: this.isRecording,
            percentage: Math.min(100, Math.round((count / this.targetCount) * 100))
        });
    }

    /**
     * Clears recorded samples for current class.
     */
    clearClassSamples(className = this.targetClass) {
        this.samplesByClass[className] = [];
        this.notifyProgress();
    }

    /**
     * Clears all recorded samples across all classes.
     */
    clearAll() {
        this.samplesByClass = {};
        this.notifyProgress();
    }

    /**
     * Exports collected samples as a downloadable JSON file.
     */
    exportDatasetJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.samplesByClass, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `isl_dataset_${this.targetClass}_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }
}
