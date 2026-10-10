/**
 * ISL Dataset Generator (Refined ISLRTC Anatomical Distinction)
 * Generates structured 3D MediaPipe landmark samples for 30 authentic ISL signs
 * following ISLRTC (Indian Sign Language Research and Training Centre) guidelines.
 * Saves samples to dataset/<WORD>/sample_001.json, etc.
 */

import fs from 'node:fs';
import path from 'node:path';

const CLASSES = [
    "HELLO", "HI", "YES", "NO", "OK", "PLEASE", "THANK YOU", "SORRY",
    "GOOD", "BAD", "HELP", "WATER", "FOOD", "EAT", "DRINK", "STOP",
    "WAIT", "I", "ME", "YOU", "HOW", "ARE", "LOVE", "PHONE",
    "TIME", "HOME", "EMERGENCY", "PAIN", "DOCTOR", "SPACE"
];

const DATASET_DIR = path.resolve('dataset');

function createGestureLandmarks(gesture, variation = 0) {
    const jitter = (amount = 0.004) => (Math.random() - 0.5) * amount * (variation > 0 ? 1 : 0);

    const wrist = { x: 0.5 + jitter(), y: 0.75 + jitter(), z: 0.0 + jitter() };

    const thumbCmc = { x: 0.44 + jitter(), y: 0.70 + jitter(), z: -0.01 };
    const thumbMcp = { x: 0.41 + jitter(), y: 0.63 + jitter(), z: -0.02 };
    const indexMcp = { x: 0.46 + jitter(), y: 0.54 + jitter(), z: -0.01 };
    const middleMcp = { x: 0.50 + jitter(), y: 0.52 + jitter(), z: 0.0 };
    const ringMcp = { x: 0.54 + jitter(), y: 0.54 + jitter(), z: 0.01 };
    const pinkyMcp = { x: 0.58 + jitter(), y: 0.58 + jitter(), z: 0.02 };

    const makeFinger = (mcp, dx, dy, dz, extended = true, curled = false) => {
        if (curled) {
            return [
                { x: mcp.x + dx * 0.3 + jitter(), y: mcp.y - 0.04 + jitter(), z: mcp.z + 0.04 },
                { x: mcp.x + dx * 0.4 + jitter(), y: mcp.y + 0.02 + jitter(), z: mcp.z + 0.06 },
                { x: mcp.x + dx * 0.2 + jitter(), y: mcp.y + 0.05 + jitter(), z: mcp.z + 0.05 }
            ];
        } else if (extended) {
            return [
                { x: mcp.x + dx * 0.33 + jitter(), y: mcp.y + dy * 0.33 + jitter(), z: mcp.z + dz * 0.33 },
                { x: mcp.x + dx * 0.66 + jitter(), y: mcp.y + dy * 0.66 + jitter(), z: mcp.z + dz * 0.66 },
                { x: mcp.x + dx * 1.00 + jitter(), y: mcp.y + dy * 1.00 + jitter(), z: mcp.z + dz * 1.00 }
            ];
        } else {
            return [
                { x: mcp.x + dx * 0.35 + jitter(), y: mcp.y + dy * 0.25 + jitter(), z: mcp.z + 0.02 },
                { x: mcp.x + dx * 0.50 + jitter(), y: mcp.y + dy * 0.40 + jitter(), z: mcp.z + 0.04 },
                { x: mcp.x + dx * 0.60 + jitter(), y: mcp.y + dy * 0.50 + jitter(), z: mcp.z + 0.05 }
            ];
        }
    };

    let thumb = [
        { x: thumbMcp.x - 0.03, y: thumbMcp.y - 0.05, z: -0.01 },
        { x: thumbMcp.x - 0.02, y: thumbMcp.y - 0.10, z: -0.01 }
    ];
    let index = makeFinger(indexMcp, 0, -0.22, 0, false, true);
    let middle = makeFinger(middleMcp, 0, -0.24, 0, false, true);
    let ring = makeFinger(ringMcp, 0, -0.22, 0, false, true);
    let pinky = makeFinger(pinkyMcp, 0, -0.18, 0, false, true);

    switch (gesture) {
        case "HELLO":
            // Open Palm upright facing camera
            thumb = [
                { x: thumbMcp.x - 0.06, y: thumbMcp.y - 0.07, z: -0.02 },
                { x: thumbMcp.x - 0.11, y: thumbMcp.y - 0.13, z: -0.03 }
            ];
            index = makeFinger(indexMcp, -0.02, -0.25, 0, true);
            middle = makeFinger(middleMcp, 0.0, -0.27, 0, true);
            ring = makeFinger(ringMcp, 0.02, -0.25, 0, true);
            pinky = makeFinger(pinkyMcp, 0.05, -0.21, 0, true);
            break;

        case "HI":
            // Open palm tilted waving outwards
            thumb = [
                { x: thumbMcp.x - 0.08, y: thumbMcp.y - 0.05, z: -0.02 },
                { x: thumbMcp.x - 0.14, y: thumbMcp.y - 0.10, z: -0.03 }
            ];
            index = makeFinger(indexMcp, 0.06, -0.23, 0, true);
            middle = makeFinger(middleMcp, 0.08, -0.24, 0, true);
            ring = makeFinger(ringMcp, 0.10, -0.23, 0, true);
            pinky = makeFinger(pinkyMcp, 0.12, -0.19, 0, true);
            break;

        case "YES":
            // Thumbs Up
            thumb = [
                { x: thumbMcp.x - 0.02, y: thumbMcp.y - 0.10, z: -0.04 },
                { x: thumbMcp.x - 0.01, y: thumbMcp.y - 0.19, z: -0.06 }
            ];
            index = makeFinger(indexMcp, 0, -0.20, 0, false, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "GOOD":
            // Thumbs Up angled forward
            thumb = [
                { x: thumbMcp.x - 0.01, y: thumbMcp.y - 0.08, z: -0.08 },
                { x: thumbMcp.x + 0.01, y: thumbMcp.y - 0.15, z: -0.14 }
            ];
            index = makeFinger(indexMcp, 0, -0.20, 0, false, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "NO":
            // Pinching index & thumb together, others folded
            thumb = [
                { x: 0.44, y: 0.53, z: -0.02 },
                { x: 0.46, y: 0.48, z: -0.01 }
            ];
            index = [
                { x: 0.46, y: 0.50, z: 0.0 },
                { x: 0.47, y: 0.48, z: 0.0 },
                { x: 0.47, y: 0.48, z: 0.0 }
            ];
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "WATER":
            // 'W' Handshape: Index, Middle, Ring extended upward spread; Thumb holding Pinky down
            thumb = [
                { x: 0.52, y: 0.60, z: 0.04 },
                { x: 0.55, y: 0.60, z: 0.05 }
            ];
            index = makeFinger(indexMcp, -0.05, -0.25, 0, true);
            middle = makeFinger(middleMcp, 0.0, -0.27, 0, true);
            ring = makeFinger(ringMcp, 0.05, -0.25, 0, true);
            pinky = makeFinger(pinkyMcp, 0, -0.18, 0, false, true);
            break;

        case "FOOD":
            // Pinched fingertips at chest level pointing upward
            thumb = [
                { x: 0.48, y: 0.54, z: 0.02 },
                { x: 0.49, y: 0.48, z: 0.03 }
            ];
            index = [
                { x: 0.48, y: 0.51, z: 0.02 },
                { x: 0.49, y: 0.49, z: 0.02 },
                { x: 0.50, y: 0.48, z: 0.02 }
            ];
            middle = [
                { x: 0.50, y: 0.51, z: 0.01 },
                { x: 0.50, y: 0.49, z: 0.02 },
                { x: 0.50, y: 0.48, z: 0.02 }
            ];
            ring = [
                { x: 0.51, y: 0.52, z: 0.02 },
                { x: 0.51, y: 0.49, z: 0.02 },
                { x: 0.50, y: 0.48, z: 0.02 }
            ];
            pinky = [
                { x: 0.52, y: 0.54, z: 0.02 },
                { x: 0.51, y: 0.50, z: 0.02 },
                { x: 0.50, y: 0.48, z: 0.02 }
            ];
            break;

        case "EAT":
            // Pinched fingertips brought higher up and angled towards mouth
            thumb = [
                { x: 0.48, y: 0.46, z: -0.04 },
                { x: 0.49, y: 0.40, z: -0.05 }
            ];
            index = [
                { x: 0.48, y: 0.44, z: -0.04 },
                { x: 0.49, y: 0.41, z: -0.04 },
                { x: 0.50, y: 0.39, z: -0.05 }
            ];
            middle = [
                { x: 0.50, y: 0.44, z: -0.04 },
                { x: 0.50, y: 0.41, z: -0.04 },
                { x: 0.50, y: 0.39, z: -0.05 }
            ];
            ring = [
                { x: 0.51, y: 0.45, z: -0.04 },
                { x: 0.51, y: 0.41, z: -0.04 },
                { x: 0.50, y: 0.39, z: -0.05 }
            ];
            pinky = [
                { x: 0.52, y: 0.47, z: -0.03 },
                { x: 0.51, y: 0.42, z: -0.04 },
                { x: 0.50, y: 0.39, z: -0.05 }
            ];
            break;

        case "DRINK":
            // 'C' Handshape: curved fingers forming open cup
            thumb = [
                { x: 0.41, y: 0.58, z: -0.04 },
                { x: 0.42, y: 0.50, z: -0.06 }
            ];
            index = makeFinger(indexMcp, 0.0, -0.15, -0.10, false, false);
            middle = makeFinger(middleMcp, 0.0, -0.15, -0.10, false, false);
            ring = makeFinger(ringMcp, 0.0, -0.15, -0.10, false, false);
            pinky = makeFinger(pinkyMcp, 0.0, -0.14, -0.10, false, false);
            break;

        case "HELP":
            // Flat horizontal palm facing up (support base hand)
            thumb = [
                { x: 0.38, y: 0.65, z: 0.04 },
                { x: 0.35, y: 0.60, z: 0.05 }
            ];
            index = makeFinger(indexMcp, 0.0, -0.22, 0.10, true);
            middle = makeFinger(middleMcp, 0.0, -0.23, 0.10, true);
            ring = makeFinger(ringMcp, 0.0, -0.22, 0.10, true);
            pinky = makeFinger(pinkyMcp, 0.0, -0.19, 0.10, true);
            break;

        case "THANK YOU":
            // Flat hand moving from chin forward (palm facing inward)
            thumb = [
                { x: 0.44, y: 0.58, z: -0.06 },
                { x: 0.45, y: 0.50, z: -0.07 }
            ];
            index = makeFinger(indexMcp, 0.0, -0.24, -0.06, true);
            middle = makeFinger(middleMcp, 0.0, -0.25, -0.06, true);
            ring = makeFinger(ringMcp, 0.0, -0.24, -0.06, true);
            pinky = makeFinger(pinkyMcp, 0.0, -0.19, -0.06, true);
            break;

        case "PLEASE":
            // Flat vertical palm pressed flat against chest
            thumb = [
                { x: 0.43, y: 0.64, z: 0.05 },
                { x: 0.44, y: 0.58, z: 0.05 }
            ];
            index = makeFinger(indexMcp, 0.0, -0.24, 0.04, true);
            middle = makeFinger(middleMcp, 0.0, -0.25, 0.04, true);
            ring = makeFinger(ringMcp, 0.0, -0.24, 0.04, true);
            pinky = makeFinger(pinkyMcp, 0.0, -0.19, 0.04, true);
            break;

        case "SORRY":
            // Closed fist ('A' handshape) held against chest
            thumb = [
                { x: 0.45, y: 0.60, z: 0.05 },
                { x: 0.47, y: 0.54, z: 0.06 }
            ];
            index = makeFinger(indexMcp, 0, -0.20, 0.04, false, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0.04, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0.04, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0.04, false, true);
            break;

        case "BAD":
            // Pinky extended alone pointing down/outward (standard ISL BAD gesture)
            thumb = [
                { x: 0.44, y: 0.62, z: 0.04 },
                { x: 0.46, y: 0.56, z: 0.05 }
            ];
            index = makeFinger(indexMcp, 0, -0.20, 0, false, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0.08, -0.21, 0, true);
            break;

        case "STOP":
            // Open palm pushed forward, fingers tight upright
            thumb = [
                { x: 0.41, y: 0.62, z: -0.01 },
                { x: 0.42, y: 0.55, z: -0.01 }
            ];
            index = makeFinger(indexMcp, -0.01, -0.25, 0, true);
            middle = makeFinger(middleMcp, 0.0, -0.26, 0, true);
            ring = makeFinger(ringMcp, 0.01, -0.25, 0, true);
            pinky = makeFinger(pinkyMcp, 0.02, -0.21, 0, true);
            break;

        case "WAIT":
            // Open palm facing upward, fingers slightly curved/relaxed
            thumb = [
                { x: 0.41, y: 0.63, z: 0.03 },
                { x: 0.39, y: 0.58, z: 0.04 }
            ];
            index = makeFinger(indexMcp, 0.0, -0.19, 0.08, false, false);
            middle = makeFinger(middleMcp, 0.0, -0.20, 0.08, false, false);
            ring = makeFinger(ringMcp, 0.0, -0.19, 0.08, false, false);
            pinky = makeFinger(pinkyMcp, 0.0, -0.17, 0.08, false, false);
            break;

        case "I":
            // Index pointing inward towards chest with tip tilted up
            thumb = [
                { x: 0.44, y: 0.65, z: 0.02 },
                { x: 0.46, y: 0.60, z: 0.03 }
            ];
            index = [
                { x: 0.46, y: 0.51, z: 0.06 },
                { x: 0.47, y: 0.56, z: 0.12 },
                { x: 0.48, y: 0.62, z: 0.16 }
            ];
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "ME":
            // Index touching chest center
            thumb = [
                { x: 0.44, y: 0.65, z: 0.02 },
                { x: 0.46, y: 0.60, z: 0.03 }
            ];
            index = [
                { x: 0.47, y: 0.53, z: 0.08 },
                { x: 0.49, y: 0.58, z: 0.15 },
                { x: 0.50, y: 0.65, z: 0.20 }
            ];
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "YOU":
            // Index pointing straight forward towards camera
            thumb = [
                { x: 0.44, y: 0.65, z: 0.02 },
                { x: 0.46, y: 0.60, z: 0.03 }
            ];
            index = makeFinger(indexMcp, 0.0, -0.26, -0.12, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "HOW":
            // 'V' Shape: Index & Middle extended & spread; others folded
            thumb = [
                { x: 0.46, y: 0.60, z: 0.04 },
                { x: 0.48, y: 0.58, z: 0.05 }
            ];
            index = makeFinger(indexMcp, -0.06, -0.25, 0, true);
            middle = makeFinger(middleMcp, 0.06, -0.25, 0, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "ARE":
            // Index and Pinky extended (call / horns gesture)
            thumb = [
                { x: 0.46, y: 0.60, z: 0.04 },
                { x: 0.48, y: 0.58, z: 0.05 }
            ];
            index = makeFinger(indexMcp, -0.03, -0.25, 0, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0.05, -0.21, 0, true);
            break;

        case "OK":
            // 'O' between thumb and index; Middle, Ring, Pinky extended
            thumb = [
                { x: 0.44, y: 0.54, z: -0.02 },
                { x: 0.47, y: 0.48, z: -0.01 }
            ];
            index = [
                { x: 0.46, y: 0.52, z: 0.0 },
                { x: 0.47, y: 0.48, z: 0.0 },
                { x: 0.47, y: 0.48, z: 0.0 }
            ];
            middle = makeFinger(middleMcp, 0.0, -0.25, 0, true);
            ring = makeFinger(ringMcp, 0.03, -0.24, 0, true);
            pinky = makeFinger(pinkyMcp, 0.06, -0.20, 0, true);
            break;

        case "PHONE":
            // Thumb and Pinky extended (Y-handshape/phone), 3 middle fingers folded
            thumb = [
                { x: 0.38, y: 0.58, z: -0.03 },
                { x: 0.34, y: 0.52, z: -0.04 }
            ];
            index = makeFinger(indexMcp, 0, -0.20, 0, false, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0.08, -0.20, 0, true);
            break;

        case "LOVE":
            // I-L-Y Handshape: Thumb, Index, Pinky extended; Middle and Ring folded
            thumb = [
                { x: 0.38, y: 0.58, z: -0.03 },
                { x: 0.34, y: 0.52, z: -0.04 }
            ];
            index = makeFinger(indexMcp, -0.02, -0.25, 0, true);
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0.07, -0.21, 0, true);
            break;

        case "TIME":
            // Index pointing down tapping wrist
            thumb = [
                { x: 0.44, y: 0.65, z: 0.02 },
                { x: 0.46, y: 0.60, z: 0.03 }
            ];
            index = [
                { x: 0.46, y: 0.55, z: 0.0 },
                { x: 0.47, y: 0.65, z: 0.02 },
                { x: 0.48, y: 0.72, z: 0.02 }
            ];
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "HOME":
            // Angled flat hand (45 degrees roof shape)
            thumb = [
                { x: 0.42, y: 0.63, z: 0.0 },
                { x: 0.44, y: 0.56, z: 0.0 }
            ];
            index = makeFinger(indexMcp, 0.14, -0.20, 0, true);
            middle = makeFinger(middleMcp, 0.14, -0.21, 0, true);
            ring = makeFinger(ringMcp, 0.14, -0.20, 0, true);
            pinky = makeFinger(pinkyMcp, 0.14, -0.17, 0, true);
            break;

        case "EMERGENCY":
            // 'E' Handshape (all 4 fingertips curled tightly touching thumb across bottom)
            thumb = [
                { x: 0.45, y: 0.58, z: 0.03 },
                { x: 0.48, y: 0.55, z: 0.04 }
            ];
            index = [
                { x: 0.46, y: 0.52, z: 0.02 },
                { x: 0.47, y: 0.53, z: 0.04 },
                { x: 0.47, y: 0.55, z: 0.05 }
            ];
            middle = [
                { x: 0.50, y: 0.51, z: 0.02 },
                { x: 0.50, y: 0.53, z: 0.04 },
                { x: 0.50, y: 0.55, z: 0.05 }
            ];
            ring = [
                { x: 0.54, y: 0.52, z: 0.02 },
                { x: 0.53, y: 0.53, z: 0.04 },
                { x: 0.52, y: 0.55, z: 0.05 }
            ];
            pinky = [
                { x: 0.57, y: 0.54, z: 0.02 },
                { x: 0.55, y: 0.54, z: 0.04 },
                { x: 0.53, y: 0.55, z: 0.05 }
            ];
            break;

        case "PAIN":
            // Crooked index finger
            thumb = [
                { x: 0.44, y: 0.65, z: 0.02 },
                { x: 0.46, y: 0.60, z: 0.03 }
            ];
            index = [
                { x: 0.46, y: 0.50, z: 0.0 },
                { x: 0.47, y: 0.46, z: 0.05 },
                { x: 0.47, y: 0.52, z: 0.07 }
            ];
            middle = makeFinger(middleMcp, 0, -0.20, 0, false, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "DOCTOR":
            // Index & Middle together touching pulse
            thumb = [
                { x: 0.44, y: 0.65, z: 0.02 },
                { x: 0.46, y: 0.60, z: 0.03 }
            ];
            index = makeFinger(indexMcp, -0.01, -0.24, 0, true);
            middle = makeFinger(middleMcp, 0.01, -0.24, 0, true);
            ring = makeFinger(ringMcp, 0, -0.20, 0, false, true);
            pinky = makeFinger(pinkyMcp, 0, -0.20, 0, false, true);
            break;

        case "SPACE":
            // Flat horizontal hand gesture
            thumb = [
                { x: 0.44, y: 0.65, z: 0.02 },
                { x: 0.46, y: 0.60, z: 0.03 }
            ];
            index = makeFinger(indexMcp, 0, -0.20, 0, false, true);
            middle = makeFinger(middleMcp, 0.15, 0.0, 0, true);
            ring = makeFinger(ringMcp, 0.15, 0.0, 0, true);
            pinky = makeFinger(pinkyMcp, 0.15, 0.0, 0, true);
            break;
    }

    return [
        wrist,
        thumbCmc,
        thumbMcp,
        thumb[0],
        thumb[1],
        indexMcp,
        index[0],
        index[1],
        index[2],
        middleMcp,
        middle[0],
        middle[1],
        middle[2],
        ringMcp,
        ring[0],
        ring[1],
        ring[2],
        pinkyMcp,
        pinky[0],
        pinky[1],
        pinky[2]
    ];
}

console.log("[Dataset Generator] Generating 30 distinct ISL classes...");
let totalSamples = 0;
const SAMPLES_PER_CLASS = 15;

for (const className of CLASSES) {
    const classDir = path.join(DATASET_DIR, className);
    if (!fs.existsSync(classDir)) {
        fs.mkdirSync(classDir, { recursive: true });
    }

    for (let i = 1; i <= SAMPLES_PER_CLASS; i++) {
        const sampleId = String(i).padStart(3, '0');
        const sampleFile = path.join(classDir, `sample_${sampleId}.json`);

        const landmarks = createGestureLandmarks(className, i > 1 ? 1 : 0);
        const sampleData = {
            class: className,
            sampleId: i,
            timestamp: Date.now() - (SAMPLES_PER_CLASS - i) * 1000,
            landmarks: landmarks
        };

        fs.writeFileSync(sampleFile, JSON.stringify(sampleData, null, 2), 'utf8');
        totalSamples++;
    }
}

console.log(`[Dataset Generator] Done. Generated ${totalSamples} samples in ${DATASET_DIR}`);
