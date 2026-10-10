import fs from 'node:fs';
import path from 'node:path';

const classes = [
    'HELLO', 'HI', 'YES', 'NO', 'OK', 'PLEASE', 'THANK YOU', 'SORRY',
    'GOOD', 'BAD', 'HELP', 'WATER', 'FOOD', 'EAT', 'DRINK', 'STOP',
    'WAIT', 'I', 'ME', 'YOU', 'HOW', 'ARE', 'LOVE', 'PHONE',
    'TIME', 'HOME', 'EMERGENCY', 'PAIN', 'DOCTOR', 'SPACE'
];

export function classifyHand(landmarks) {
    if (!landmarks || landmarks.length < 21) return { label: 'UNKNOWN', confidence: 0 };

    const wrist = landmarks[0];
    const thumbCmc = landmarks[1];
    const thumbMcp = landmarks[2];
    const thumbIp = landmarks[3];
    const thumbTip = landmarks[4];

    const indexMcp = landmarks[5];
    const indexPip = landmarks[6];
    const indexDip = landmarks[7];
    const indexTip = landmarks[8];

    const middleMcp = landmarks[9];
    const middlePip = landmarks[10];
    const middleDip = landmarks[11];
    const middleTip = landmarks[12];

    const ringMcp = landmarks[13];
    const ringPip = landmarks[14];
    const ringDip = landmarks[15];
    const ringTip = landmarks[16];

    const pinkyMcp = landmarks[17];
    const pinkyPip = landmarks[18];
    const pinkyDip = landmarks[19];
    const pinkyTip = landmarks[20];

    const dist3D = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
    const handScale = Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y, middleMcp.z - wrist.z) || 0.1;

    // Palm vectors
    const palmDx = middleMcp.x - wrist.x;
    const palmDy = middleMcp.y - wrist.y;
    const isPalmHorizontal = Math.abs(palmDx) > Math.abs(palmDy) * 1.05;

    // Finger extensions
    const isExtended = (tip, mcp) => dist3D(tip, wrist) > dist3D(mcp, wrist) * 1.12;

    const thumbExt = (dist3D(thumbTip, indexMcp) / handScale > 0.52) || (dist3D(thumbTip, wrist) / dist3D(thumbMcp, wrist) > 1.25);
    const thumbCurled = !thumbExt;
    const thumbUpright = (thumbTip.y < thumbMcp.y - 0.04 * handScale) && (thumbTip.y < indexMcp.y);

    const indexExt = isExtended(indexTip, indexMcp);
    const middleExt = isExtended(middleTip, middleMcp);
    const ringExt = isExtended(ringTip, ringMcp);
    const pinkyExt = isExtended(pinkyTip, pinkyMcp);

    // Pairwise tip distances
    const dTI = dist3D(thumbTip, indexTip) / handScale;
    const dTP = dist3D(thumbTip, pinkyTip) / handScale;
    const dIM = dist3D(indexTip, middleTip) / handScale;
    const dMR = dist3D(middleTip, ringTip) / handScale;

    // Max tip distance (pinch detection)
    const tips = [thumbTip, indexTip, middleTip, ringTip, pinkyTip];
    let maxTipDist = 0;
    for (let i = 0; i < 5; i++) {
        for (let j = i + 1; j < 5; j++) {
            const d = dist3D(tips[i], tips[j]) / handScale;
            if (d > maxTipDist) maxTipDist = d;
        }
    }

    // 1. PINCH / O-CLUSTERS: FOOD, EAT
    if (maxTipDist < 0.28 || (dTI < 0.22 && dIM < 0.20 && dMR < 0.20)) {
        if (thumbTip.y < 0.45) return { label: 'EAT', confidence: 0.94 };
        return { label: 'FOOD', confidence: 0.93 };
    }

    // 2. WATER: 'W' shape (Index, Middle, Ring extended; Pinky curled; Thumb holding pinky)
    if (indexExt && middleExt && ringExt && !pinkyExt) {
        return { label: 'WATER', confidence: 0.95 };
    }

    // 3. OK: Thumb and Index touching forming 'O', Middle, Ring, Pinky extended
    if (dTI < 0.25 && middleExt && ringExt && pinkyExt) {
        return { label: 'OK', confidence: 0.95 };
    }

    // 4. NO: Thumb and Index touching or folded alone, Middle, Ring, Pinky curled
    if (dTI < 0.28 && !middleExt && !ringExt && !pinkyExt) {
        return { label: 'NO', confidence: 0.93 };
    }

    // 5. YES / GOOD: Thumbs up
    if (!indexExt && !middleExt && !ringExt && !pinkyExt && (thumbUpright || thumbExt)) {
        if (thumbTip.z < -0.05) return { label: 'GOOD', confidence: 0.93 };
        return { label: 'YES', confidence: 0.95 };
    }

    // 6. HOW / DOCTOR
    if (indexExt && middleExt && !ringExt && !pinkyExt) {
        if (dIM < 0.15) return { label: 'DOCTOR', confidence: 0.92 };
        return { label: 'HOW', confidence: 0.95 };
    }

    // 7. YOU / ME / I / TIME / PAIN
    if (indexExt && !middleExt && !ringExt && !pinkyExt) {
        if (indexTip.y > indexMcp.y + 0.10) return { label: 'TIME', confidence: 0.91 };
        if (indexTip.z > 0.08 || indexTip.y > indexMcp.y) return { label: 'ME', confidence: 0.92 };
        return { label: 'YOU', confidence: 0.95 };
    }

    // 8. ARE: Index and Pinky extended (horns)
    if (indexExt && pinkyExt && !middleExt && !ringExt && !thumbExt) {
        return { label: 'ARE', confidence: 0.94 };
    }

    // 9. LOVE: Thumb, Index, Pinky extended ('I Love You')
    if (thumbExt && indexExt && pinkyExt && !middleExt && !ringExt) {
        return { label: 'LOVE', confidence: 0.96 };
    }

    // 10. PHONE: Thumb and Pinky extended ('Y' phone receiver)
    if (thumbExt && pinkyExt && !indexExt && !middleExt && !ringExt) {
        return { label: 'PHONE', confidence: 0.94 };
    }

    // 11. BAD: Pinky extended alone
    if (pinkyExt && !indexExt && !middleExt && !ringExt && !thumbExt) {
        return { label: 'BAD', confidence: 0.93 };
    }

    // 12. DRINK: C-shape hand
    if (dTI > 0.35 && dTI < 0.60 && !indexExt && !ringExt) {
        return { label: 'DRINK', confidence: 0.91 };
    }

    // 13. SPACE: Horizontal open hand
    if (isPalmHorizontal && (middleExt || ringExt || pinkyExt)) {
        return { label: 'SPACE', confidence: 0.92 };
    }

    // 14. EMERGENCY: 'E' handshape (curled fingertips touching thumb)
    if (!indexExt && !middleExt && !ringExt && !pinkyExt && dTI < 0.15) {
        return { label: 'EMERGENCY', confidence: 0.90 };
    }

    // 15. SORRY: Closed fist
    if (!indexExt && !middleExt && !ringExt && !pinkyExt) {
        return { label: 'SORRY', confidence: 0.92 };
    }

    // 16. OPEN PALM GESTURES
    if (indexExt && middleExt && ringExt && pinkyExt) {
        if (Math.abs(palmDx) > 0.08) return { label: 'HOME', confidence: 0.91 };
        if (dIM < 0.18) return { label: 'STOP', confidence: 0.94 };
        if (dTI > 1.30) return { label: 'HI', confidence: 0.93 };
        if (thumbCurled) return { label: 'PLEASE', confidence: 0.92 };
        return { label: 'HELLO', confidence: 0.95 };
    }

    return { label: 'UNKNOWN', confidence: 0.55 };
}

let correct = 0;
let total = 0;
const results = {};

for (const c of classes) {
    const dir = path.join('dataset', c);
    const files = fs.readdirSync(dir);
    let classCorrect = 0;
    for (const f of files) {
        const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
        const pred = classifyHand(data.landmarks);
        if (pred.label === c) {
            classCorrect++;
            correct++;
        }
        total++;
    }
    results[c] = `${classCorrect}/${files.length}`;
}

console.log('Results summary:');
console.log(results);
console.log(`Overall Accuracy: ${((correct / total) * 100).toFixed(2)}% (${correct}/${total})`);
