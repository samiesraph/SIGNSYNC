/**
 * LandmarkDetector Module
 * Integrates MediaPipe Hand Landmarker to extract 21 3D keypoints from webcam video streams.
 * Supports offline-first local WASM & model assets with automatic CDN fallback.
 */

import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export class LandmarkDetector {
    constructor() {
        this.handLandmarker = null;
        this.isLoaded = false;
        this.isLoading = false;
        this.lastVideoTimestamp = -1;
    }

    /**
     * Initializes the MediaPipe HandLandmarker detector.
     * Tries local offline assets first, falls back to CDN if local unavailable.
     * @param {Function} [onStatusChange] - Status message callback
     */
    async initialize(onStatusChange = () => {}) {
        if (this.isLoaded) return;
        if (this.isLoading) return;

        this.isLoading = true;
        onStatusChange("Loading MediaPipe Hand Detector...");

        // Try local offline assets first, fallback to CDN
        const wasmLocations = [
            `${window.location.origin}/wasm`,
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        ];

        const modelLocations = [
            `${window.location.origin}/models/hand_landmarker.task`,
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
        ];

        let lastError = null;

        for (const wasmPath of wasmLocations) {
            try {
                console.log(`[LandmarkDetector] Loading vision WASM from: ${wasmPath}`);
                const vision = await FilesetResolver.forVisionTasks(wasmPath);

                for (const modelPath of modelLocations) {
                    for (const delegate of ["GPU", "CPU"]) {
                        try {
                            console.log(`[LandmarkDetector] Initializing HandLandmarker (${delegate}) from: ${modelPath}`);
                            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                                baseOptions: {
                                    modelAssetPath: modelPath,
                                    delegate: delegate
                                },
                                runningMode: "VIDEO",
                                numHands: 1
                            });

                            this.isLoaded = true;
                            this.isLoading = false;
                            onStatusChange(`MediaPipe Hand Detector Ready (${delegate})`);
                            console.log(`[LandmarkDetector] Successfully initialized MediaPipe with ${delegate} from ${modelPath}`);
                            return;
                        } catch (delegateError) {
                            console.warn(`[LandmarkDetector] HandLandmarker failed with ${delegate} at ${modelPath}:`, delegateError);
                            lastError = delegateError;
                        }
                    }
                }
            } catch (wasmError) {
                console.warn(`[LandmarkDetector] FilesetResolver failed for ${wasmPath}:`, wasmError);
                lastError = wasmError;
            }
        }

        this.isLoading = false;
        console.error("[LandmarkDetector] Critical error initializing MediaPipe HandLandmarker:", lastError);
        throw lastError || new Error("Failed to initialize MediaPipe HandLandmarker");
    }

    /**
     * Detects 3D landmarks for a video frame.
     * @param {HTMLVideoElement} videoElement
     * @param {number} timestamp - Frame timestamp
     * @returns {{landmarks: Array<{x:number, y:number, z:number}>|null, rawResult: Object}}
     */
    detect(videoElement, timestamp) {
        if (!this.isLoaded || !this.handLandmarker || !videoElement || videoElement.readyState < 2) {
            return { landmarks: null, rawResult: null };
        }

        // Guarantee strictly monotonic increasing timestamp for MediaPipe Tasks Vision
        let safeTimestamp = timestamp;
        if (safeTimestamp <= this.lastVideoTimestamp) {
            safeTimestamp = this.lastVideoTimestamp + 1;
        }
        this.lastVideoTimestamp = safeTimestamp;

        try {
            const result = this.handLandmarker.detectForVideo(videoElement, safeTimestamp);
            if (result && result.landmarks && result.landmarks.length > 0) {
                return {
                    landmarks: result.landmarks[0],
                    rawResult: result
                };
            }
        } catch (err) {
            console.error("[LandmarkDetector] Error during landmark detection frame:", err);
        }

        return { landmarks: null, rawResult: null };
    }

    /**
     * Draws landmarks & skeleton connectors onto a 2D canvas context.
     * @param {CanvasRenderingContext2D} ctx
     * @param {Array<{x:number, y:number, z:number}>} landmarks
     * @param {number} width
     * @param {number} height
     */
    drawLandmarks(ctx, landmarks, width, height) {
        if (!ctx || !landmarks || landmarks.length === 0) return;

        ctx.clearRect(0, 0, width, height);

        // Hand skeleton connections (21 points)
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],       // Index
            [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
            [9, 13], [13, 14], [14, 15], [15, 16], // Ring
            [13, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [0, 17]                               // Palm base
        ];

        // Draw bone lines
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 3;

        for (const [startIdx, endIdx] of connections) {
            const start = landmarks[startIdx];
            const end = landmarks[endIdx];
            if (start && end) {
                ctx.beginPath();
                ctx.moveTo(start.x * width, start.y * height);
                ctx.lineTo(end.x * width, end.y * height);
                ctx.stroke();
            }
        }

        // Draw joint points
        for (let i = 0; i < landmarks.length; i++) {
            const point = landmarks[i];
            ctx.beginPath();
            ctx.arc(point.x * width, point.y * height, i === 4 || i === 8 || i === 12 || i === 16 || i === 20 ? 6 : 4, 0, 2 * Math.PI);
            ctx.fillStyle = i % 4 === 0 ? '#FF0055' : '#00FF66';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#FFFFFF';
            ctx.stroke();
        }
    }
}
