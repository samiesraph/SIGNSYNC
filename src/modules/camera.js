/**
 * Camera Module
 * Manages HTML5 webcam initialization, media stream, dimensions, and error handling.
 */

export class CameraManager {
    /**
     * @param {HTMLVideoElement} videoElement
     * @param {HTMLCanvasElement} canvasElement
     */
    constructor(videoElement, canvasElement) {
        this.videoElement = videoElement;
        this.canvasElement = canvasElement;
        this.stream = null;
        this.isActive = false;
    }

    /**
     * Starts the webcam stream.
     * @param {Function} [onError] - Error callback
     * @returns {Promise<boolean>} Success status
     */
    async startCamera(onError = () => {}) {
        if (this.isActive) return true;

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Webcam access is not supported by your browser environment.");
            }

            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user"
                },
                audio: false
            });

            this.videoElement.srcObject = this.stream;
            this.videoElement.autoplay = true;

            await new Promise((resolve) => {
                const onReady = async () => {
                    try {
                        await this.videoElement.play();
                    } catch (playErr) {
                        console.warn("[CameraManager] Autoplay play() rejected:", playErr);
                    }
                    resolve();
                };

                if (this.videoElement.readyState >= 2) {
                    onReady();
                } else {
                    this.videoElement.onloadeddata = onReady;
                    this.videoElement.onloadedmetadata = onReady;
                    // Fallback timeout to prevent promise hanging
                    setTimeout(onReady, 1000);
                }
            });

            this.canvasElement.width = this.videoElement.videoWidth || 640;
            this.canvasElement.height = this.videoElement.videoHeight || 480;

            this.isActive = true;
            console.log(`[CameraManager] Camera feed started successfully (${this.canvasElement.width}x${this.canvasElement.height}).`);
            return true;
        } catch (err) {
            this.isActive = false;
            let userMessage = "Unable to start webcam stream.";
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                userMessage = "Camera permission was denied. Please allow camera access in your browser settings.";
            } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                userMessage = "No webcam device was found attached to your system.";
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                userMessage = "Camera is currently in use by another application.";
            }

            console.error("[CameraManager] Camera Error:", err);
            onError(userMessage, err);
            return false;
        }
    }

    /**
     * Stops the webcam stream.
     */
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
        this.isActive = false;
        console.log("[CameraManager] Camera feed stopped.");
    }
}
