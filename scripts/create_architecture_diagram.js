/**
 * Generates an SVG Architecture Diagram for the ISL Recognition Project.
 * Clean, modern, academic design suitable for slides and project reports.
 */
import fs from 'node:fs';
import path from 'node:path';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 680" width="1200" height="680" style="background:#0f172a; font-family:'Segoe UI', system-ui, -apple-system, sans-serif;">
  <defs>
    <!-- Gradients -->
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="blueCard" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" />
      <stop offset="100%" stop-color="#0f294a" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#22c55e" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#22c55e"/>
    </marker>
  </defs>

  <!-- Title Banner -->
  <rect x="40" y="24" width="1120" height="60" rx="10" fill="url(#headerGrad)" filter="url(#shadow)"/>
  <text x="600" y="52" fill="#ffffff" font-size="20" font-weight="700" text-anchor="middle" letter-spacing="0.5">SYSTEM ARCHITECTURE: REAL-TIME ISL TO TEXT / SPEECH TRANSLATION</text>
  <text x="600" y="72" fill="#93c5fd" font-size="12" font-weight="500" text-anchor="middle">End-to-End Client-Side Pipeline from Webcam Capture to Audio Synthesis</text>

  <!-- ================= ROW 1: INPUT -> PERCEPTION -> FEATURE EXTRACTION ================= -->
  
  <!-- STAGE 1: Video Capture -->
  <g transform="translate(50, 110)" filter="url(#shadow)">
    <rect width="320" height="210" rx="12" fill="url(#cardGrad1)" stroke="#334155" stroke-width="2"/>
    <rect width="320" height="38" rx="12" fill="#1e293b"/>
    <circle cx="20" cy="19" r="6" fill="#ef4444"/>
    <text x="35" y="24" fill="#38bdf8" font-size="13" font-weight="700">1. VIDEO INPUT MODULE</text>
    <text x="290" y="24" fill="#94a3b8" font-size="11">Input</text>

    <!-- Content Items -->
    <rect x="16" y="52" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="70" fill="#f8fafc" font-size="11" font-weight="600">📷 Real-Time Webcam Stream</text>
    <text x="26" y="85" fill="#94a3b8" font-size="10">HTML5 getUserMedia() • 640x480 @ 30 FPS</text>

    <rect x="16" y="102" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="120" fill="#f8fafc" font-size="11" font-weight="600">🔄 Frame Normalizer &amp; Mirroring</text>
    <text x="26" y="135" fill="#94a3b8" font-size="10">Horizontal flip for natural user interaction</text>

    <rect x="16" y="152" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="170" fill="#f8fafc" font-size="11" font-weight="600">⏱️ requestAnimationFrame Loop</text>
    <text x="26" y="185" fill="#94a3b8" font-size="10">Non-blocking, low-latency render cycle</text>
  </g>

  <!-- Arrow 1 -> 2 -->
  <line x1="375" y1="215" x2="435" y2="215" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="405" y="205" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="middle">Frames</text>

  <!-- STAGE 2: Landmark Detection -->
  <g transform="translate(440, 110)" filter="url(#shadow)">
    <rect width="320" height="210" rx="12" fill="url(#cardGrad1)" stroke="#0284c7" stroke-width="2"/>
    <rect width="320" height="38" rx="12" fill="#0284c7"/>
    <circle cx="20" cy="19" r="6" fill="#22c55e"/>
    <text x="35" y="24" fill="#ffffff" font-size="13" font-weight="700">2. MEDIAPIPE DETECTION</text>
    <text x="290" y="24" fill="#e0f2fe" font-size="11">Vision</text>

    <!-- Content Items -->
    <rect x="16" y="52" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="70" fill="#f8fafc" font-size="11" font-weight="600">🖐️ HandLandmarker (Tasks Vision)</text>
    <text x="26" y="85" fill="#94a3b8" font-size="10">GPU / WebAssembly Accelerated Engine</text>

    <rect x="16" y="102" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="120" fill="#f8fafc" font-size="11" font-weight="600">📍 21 3D Keypoint Extraction</text>
    <text x="26" y="135" fill="#94a3b8" font-size="10">Wrist, Thumb, Index, Middle, Ring, Pinky (x,y,z)</text>

    <rect x="16" y="152" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="170" fill="#f8fafc" font-size="11" font-weight="600">🦴 Dynamic Skeleton Overlay</text>
    <text x="26" y="185" fill="#94a3b8" font-size="10">21 Joint Nodes + 21 Inter-bone Connections</text>
  </g>

  <!-- Arrow 2 -> 3 -->
  <line x1="765" y1="215" x2="825" y2="215" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="795" y="205" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="middle">21 Keypoints</text>

  <!-- STAGE 3: Feature Engineering -->
  <g transform="translate(830, 110)" filter="url(#shadow)">
    <rect width="320" height="210" rx="12" fill="url(#cardGrad1)" stroke="#334155" stroke-width="2"/>
    <rect width="320" height="38" rx="12" fill="#1e293b"/>
    <circle cx="20" cy="19" r="6" fill="#38bdf8"/>
    <text x="35" y="24" fill="#38bdf8" font-size="13" font-weight="700">3. FEATURE NORMALIZATION</text>
    <text x="290" y="24" fill="#94a3b8" font-size="11">Preproc</text>

    <!-- Content Items -->
    <rect x="16" y="52" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="70" fill="#f8fafc" font-size="11" font-weight="600">📐 Hand Scale Invariance</text>
    <text x="26" y="85" fill="#94a3b8" font-size="10">Normalized by Wrist → Middle MCP Euclidean Distance</text>

    <rect x="16" y="102" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="120" fill="#f8fafc" font-size="11" font-weight="600">📏 Joint Flexion &amp; Extension</text>
    <text x="26" y="135" fill="#94a3b8" font-size="10">isExtended(Tip, MCP) test against wrist baseline</text>

    <rect x="16" y="152" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="170" fill="#f8fafc" font-size="11" font-weight="600">🧭 3D Spatial Angles &amp; Vectors</text>
    <text x="26" y="185" fill="#94a3b8" font-size="10">Inter-tip Euclidean ratios + Palm orientation</text>
  </g>

  <!-- Connective Path: Stage 3 -> Stage 4 (Turning down to Row 2) -->
  <path d="M 990 325 L 990 370 L 990 370 L 990 395" stroke="#38bdf8" stroke-width="3" fill="none" marker-end="url(#arrow)"/>
  <text x="1000" y="360" fill="#38bdf8" font-size="10" font-weight="600">Normalized Vectors</text>

  <!-- ================= ROW 2: AI MODEL -> STABILIZER -> OUTPUT/TTS ================= -->

  <!-- STAGE 4: AI Model & Prediction Adapter -->
  <g transform="translate(830, 400)" filter="url(#shadow)">
    <rect width="320" height="210" rx="12" fill="url(#cardGrad1)" stroke="#22c55e" stroke-width="2"/>
    <rect width="320" height="38" rx="12" fill="#15803d"/>
    <circle cx="20" cy="19" r="6" fill="#4ade80"/>
    <text x="35" y="24" fill="#ffffff" font-size="13" font-weight="700">4. ISL MODEL &amp; ADAPTER</text>
    <text x="290" y="24" fill="#dcfce7" font-size="11">AI Model</text>

    <!-- Content Items -->
    <rect x="16" y="52" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="70" fill="#f8fafc" font-size="11" font-weight="600">🧠 Versioned ISL Classifiers</text>
    <text x="26" y="85" fill="#94a3b8" font-size="10">Model v1 (7 baseline) / Model v2 (30 real ISL classes)</text>

    <rect x="16" y="102" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="120" fill="#f8fafc" font-size="11" font-weight="600">🔌 Custom Model Extension Hook</text>
    <text x="26" y="135" fill="#94a3b8" font-size="10">loadCustomModel() for collector trained weights</text>

    <rect x="16" y="152" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="170" fill="#f8fafc" font-size="11" font-weight="600">🎯 Prediction Adapter Interface</text>
    <text x="26" y="185" fill="#94a3b8" font-size="10">Standardized: { label: string, confidence: float }</text>
  </g>

  <!-- Arrow 4 -> 5 (Moving Left) -->
  <line x1="825" y1="505" x2="765" y2="505" stroke="#38bdf8" stroke-width="3" marker-end="url(#arrow)"/>
  <text x="795" y="495" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="middle">Raw Label + Conf</text>

  <!-- STAGE 5: Temporal Stabilization & Duplicate Prevention -->
  <g transform="translate(440, 400)" filter="url(#shadow)">
    <rect width="320" height="210" rx="12" fill="url(#cardGrad1)" stroke="#eab308" stroke-width="2"/>
    <rect width="320" height="38" rx="12" fill="#a16207"/>
    <circle cx="20" cy="19" r="6" fill="#fef08a"/>
    <text x="35" y="24" fill="#ffffff" font-size="13" font-weight="700">5. TEMPORAL STABILIZER</text>
    <text x="290" y="24" fill="#fef9c3" font-size="11">Filter</text>

    <!-- Content Items -->
    <rect x="16" y="52" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="70" fill="#f8fafc" font-size="11" font-weight="600">🛡️ Confidence Threshold Filter</text>
    <text x="26" y="85" fill="#94a3b8" font-size="10">Rejects predictions &lt; 0.75 ("Uncertain sign")</text>

    <rect x="16" y="102" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="120" fill="#f8fafc" font-size="11" font-weight="600">⏳ Temporal Hold Window (700ms)</text>
    <text x="26" y="135" fill="#94a3b8" font-size="10">Suppresses transient jitter &amp; transition noise</text>

    <rect x="16" y="152" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="170" fill="#f8fafc" font-size="11" font-weight="600">🚫 Intelligent Duplicate Prevention</text>
    <text x="26" y="185" fill="#94a3b8" font-size="10">Requires sign change / release before re-adding</text>
  </g>

  <!-- Arrow 5 -> 6 (Moving Left) -->
  <line x1="435" y1="505" x2="375" y2="505" stroke="#22c55e" stroke-width="3" marker-end="url(#arrowGreen)"/>
  <text x="405" y="495" fill="#22c55e" font-size="10" font-weight="600" text-anchor="middle">Accepted Word</text>

  <!-- STAGE 6: Sentence Builder & Speech Output -->
  <g transform="translate(50, 400)" filter="url(#shadow)">
    <rect width="320" height="210" rx="12" fill="url(#cardGrad1)" stroke="#38bdf8" stroke-width="2"/>
    <rect width="320" height="38" rx="12" fill="#0284c7"/>
    <circle cx="20" cy="19" r="6" fill="#38bdf8"/>
    <text x="35" y="24" fill="#ffffff" font-size="13" font-weight="700">6. SENTENCE BUILDER &amp; TTS</text>
    <text x="290" y="24" fill="#e0f2fe" font-size="11">Output</text>

    <!-- Content Items -->
    <rect x="16" y="52" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="70" fill="#f8fafc" font-size="11" font-weight="600">📝 Live Sentence Accumulator</text>
    <text x="26" y="85" fill="#94a3b8" font-size="10">addWord(), removeLastWord(), clearText(), SPACE</text>

    <rect x="16" y="102" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="120" fill="#f8fafc" font-size="11" font-weight="600">🔊 Web Speech API (TTS)</text>
    <text x="26" y="135" fill="#94a3b8" font-size="10">Synthesizes constructed sentences into clear voice</text>

    <rect x="16" y="152" width="288" height="42" rx="6" fill="#0f172a" stroke="#1e293b"/>
    <text x="26" y="170" fill="#f8fafc" font-size="11" font-weight="600">📜 UI Dashboard &amp; History Logger</text>
    <text x="26" y="185" fill="#94a3b8" font-size="10">Real-time ASCII bar, timestamps &amp; confidence log</text>
  </g>

  <!-- Footer Info / Legend -->
  <rect x="50" y="630" width="1100" height="32" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="70" y="651" fill="#94a3b8" font-size="11">Key Highlights:</text>
  <circle cx="160" cy="646" r="4" fill="#38bdf8"/>
  <text x="170" y="651" fill="#f8fafc" font-size="11">Zero GPU Requirement (Runs In-Browser)</text>
  <circle cx="430" cy="646" r="4" fill="#22c55e"/>
  <text x="440" y="651" fill="#f8fafc" font-size="11">30+ FPS Real-Time Inference</text>
  <circle cx="660" cy="646" r="4" fill="#eab308"/>
  <text x="670" y="651" fill="#f8fafc" font-size="11">Temporal Anti-Jitter (700ms)</text>
  <circle cx="890" cy="646" r="4" fill="#f43f5e"/>
  <text x="900" y="651" fill="#f8fafc" font-size="11">Dual Modality: Text + Audible Speech</text>
</svg>
`;

const outputPath = path.resolve('public', 'architecture_diagram.svg');
const rootOutputPath = path.resolve('architecture_diagram.svg');

// Ensure public dir exists
if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

fs.writeFileSync(outputPath, svgContent, 'utf-8');
fs.writeFileSync(rootOutputPath, svgContent, 'utf-8');

console.log('[Architecture Diagram] Created successfully at:', outputPath);
