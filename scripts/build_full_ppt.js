/**
 * Project Phase - I : First Review Presentation Generator
 * Simple, clean, academic human-made template style matching SMVEC student slides.
 * Real-Time Sign Language to Text/Speech Translator
 * Sri Manakula Vinayagar Engineering College (Autonomous)
 * Department of Computer Science and Engineering
 */

import PptxGenJS from 'pptxgenjs';
import path from 'node:path';

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_16x9'; // 10.0 x 5.625 inches
pptx.title = 'Real-Time Sign Language to Text/Speech Translator - First Review';
pptx.subject = 'Project Phase - I First Review';
pptx.author = 'ELAVARASA S & SAMIES R';
pptx.company = 'Sri Manakula Vinayagar Engineering College';

// Simple, human academic color palette (Classic student review style)
const THEME = {
    NAVY: '0F294A',         // Deep navy title & headers
    BLUE_LINE: '1E3A8A',    // Header underline accent
    BODY_TEXT: '2D3748',    // Standard readable dark charcoal text
    MUTED: '64748B',        // Slide numbers / subtitles / footers
    LIGHT_GRAY: 'F8FAFC',   // Clean background / subtle container fills
    WHITE: 'FFFFFF',        // Pure white background
    TABLE_BORDER: 'CBD5E1', // Simple table grid
    GREEN: '16A34A',        // Positive metrics & delivered status
    AMBER: 'D97706',        // Review badges & tags
    RED: 'DC2626'           // Bottleneck indicators
};

// Helper: Simple human-made academic slide header with line
function addHumanSlideHeader(slide, title, slideNum) {
    // Title text
    slide.addText(title, {
        x: 0.8, y: 0.4, w: 8.4, h: 0.45,
        fontFace: 'Arial', fontSize: 20, bold: true, color: THEME.NAVY
    });

    // Simple single accent line under title (classic human-made academic style)
    slide.addShape(pptx.ShapeType.line, {
        x: 0.8, y: 0.9, w: 8.4, h: 0,
        line: { color: THEME.BLUE_LINE, width: 2 }
    });

    // Minimal human footer
    slide.addText('Department of CSE, SMVEC  |  Project Phase - I : First Review', {
        x: 0.8, y: 5.25, w: 6.0, h: 0.25,
        fontFace: 'Arial', fontSize: 8.5, color: THEME.MUTED
    });

    slide.addText(`${slideNum}`, {
        x: 8.2, y: 5.25, w: 1.0, h: 0.25,
        fontFace: 'Arial', fontSize: 8.5, color: THEME.MUTED, align: 'right'
    });
}

// =========================================================================
// SLIDE 1: TITLE SLIDE (Matches original college template)
// =========================================================================
const s1 = pptx.addSlide();
s1.background = { color: THEME.WHITE };

// Institution Name
s1.addText('SRI MANAKULA VINAYAGAR ENGINEERING COLLEGE', {
    x: 0.8, y: 0.6, w: 8.4, h: 0.4,
    fontFace: 'Arial', fontSize: 18, bold: true, color: THEME.NAVY, align: 'center',
    charSpacing: 0.5
});
s1.addText('(An Autonomous Institution)  •  Puducherry', {
    x: 0.8, y: 1.0, w: 8.4, h: 0.25,
    fontFace: 'Arial', fontSize: 10, color: THEME.MUTED, align: 'center'
});
s1.addText('Department of Computer Science and Engineering', {
    x: 0.8, y: 1.25, w: 8.4, h: 0.3,
    fontFace: 'Arial', fontSize: 12, bold: true, color: THEME.BLUE_LINE, align: 'center'
});

// Title & Underline
s1.addText('Real-Time Sign Language to Text/Speech Translator', {
    x: 0.8, y: 1.9, w: 8.4, h: 0.6,
    fontFace: 'Arial', fontSize: 24, bold: true, color: THEME.NAVY, align: 'center'
});
s1.addShape(pptx.ShapeType.line, {
    x: 1.5, y: 2.55, w: 7.0, h: 0,
    line: { color: THEME.BLUE_LINE, width: 2.5 }
});
s1.addText('PROJECT PHASE - I  :  FIRST REVIEW', {
    x: 0.8, y: 2.7, w: 8.4, h: 0.3,
    fontFace: 'Arial', fontSize: 12, bold: true, color: THEME.AMBER, align: 'center',
    charSpacing: 1
});

// Guide Details (Left)
s1.addText('Guided by', {
    x: 1.2, y: 3.6, w: 3.6, h: 0.25,
    fontFace: 'Arial', fontSize: 11, bold: true, color: THEME.NAVY
});
s1.addText('Mrs. NIRMALA DEVI\nAssistant Professor\nDepartment of CSE', {
    x: 1.2, y: 3.9, w: 3.6, h: 0.8,
    fontFace: 'Arial', fontSize: 11, color: THEME.BODY_TEXT, lineSpacing: 16
});

// Presenter Details (Right)
s1.addText('Presented by', {
    x: 5.6, y: 3.6, w: 3.6, h: 0.25,
    fontFace: 'Arial', fontSize: 11, bold: true, color: THEME.NAVY
});
s1.addText('ELAVARASA S  (23UCS044)\nSAMIES R        (23UCS138)\nVII-C, Department of CSE', {
    x: 5.6, y: 3.9, w: 3.6, h: 0.8,
    fontFace: 'Arial', fontSize: 11, color: THEME.BODY_TEXT, lineSpacing: 16
});


// =========================================================================
// SLIDE 2: INTRODUCTION & SOCIETAL CONTEXT
// =========================================================================
const s2 = pptx.addSlide();
s2.background = { color: THEME.WHITE };
addHumanSlideHeader(s2, 'Introduction & Societal Context', 2);

// Left Box: The Communication Barrier
s2.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.15, w: 4.05, h: 3.9,
    fill: { color: THEME.LIGHT_GRAY },
    line: { color: THEME.TABLE_BORDER, width: 1 }
});

s2.addText('THE COMMUNICATION BARRIER', {
    x: 1.0, y: 1.3, w: 3.65, h: 0.3,
    fontFace: 'Arial', fontSize: 11, bold: true, color: THEME.NAVY
});

const introLeftBullets = [
    { text: 'Prevalence:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Over 63 million individuals in India live with severe speech and hearing impairments.\n• Indian Sign Language (ISL) is their native and primary medium of communication.\n\n' },
    { text: 'Linguistic Divide:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Less than 0.5% of the hearing population understands ISL.\n• Creates daily obstacles in classrooms, hospitals, government offices, and workplaces.\n\n' },
    { text: 'Human Interpreter Bottleneck:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Severe shortage of certified human interpreters across India.\n• High hourly fees (₹800–₹2,000/hr) and compromises personal privacy.' }
];

s2.addText(introLeftBullets, {
    x: 1.0, y: 1.65, w: 3.65, h: 3.2,
    fontFace: 'Arial', fontSize: 9.5, color: THEME.BODY_TEXT, lineSpacing: 13
});

// Right Box: Proposed Solution
s2.addShape(pptx.ShapeType.rect, {
    x: 5.15, y: 1.15, w: 4.05, h: 3.9,
    fill: { color: THEME.LIGHT_GRAY },
    line: { color: THEME.TABLE_BORDER, width: 1 }
});

s2.addText('THE PROPOSED ASSISTIVE SOLUTION', {
    x: 5.35, y: 1.3, w: 3.65, h: 0.3,
    fontFace: 'Arial', fontSize: 11, bold: true, color: THEME.BLUE_LINE
});

const introRightBullets = [
    { text: 'Vision-Based Interaction:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Operates using standard commodity webcams without wearable sensor gloves.\n• Users communicate naturally with empty hands.\n\n' },
    { text: '3D Landmark Intelligence:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Extracts 21 3D hand keypoints via MediaPipe Tasks Vision WebAssembly.\n• 99.9% data reduction compared to processing 921,600 raw RGB pixels.\n\n' },
    { text: 'Dual Modality Output (Text & Speech):\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Accumulates verified signs into complete sentences.\n• Generates real-time audible spoken voice via W3C Web Speech API.\n\n' },
    { text: 'Zero Hardware Cost:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Runs entirely in standard web browsers on basic consumer laptops.' }
];

s2.addText(introRightBullets, {
    x: 5.35, y: 1.65, w: 3.65, h: 3.2,
    fontFace: 'Arial', fontSize: 9.5, color: THEME.BODY_TEXT, lineSpacing: 13
});


// =========================================================================
// SLIDE 3: PROBLEM STATEMENT & TECHNICAL CHALLENGES
// =========================================================================
const s3 = pptx.addSlide();
s3.background = { color: THEME.WHITE };
addHumanSlideHeader(s3, 'Problem Statement & Technical Challenges', 3);

const problems = [
    {
        tag: 'HARDWARE BOTTLENECK',
        title: '1. Heavy Hardware & GPU Dependency',
        desc: 'Traditional deep CNN architectures (e.g. ResNet, 3D-CNN) require expensive dedicated GPUs (CUDA/TensorRT). They fail to achieve real-time speed on basic consumer laptops or school systems, creating high cost barriers for disabled users.',
        color: THEME.RED
    },
    {
        tag: 'STABILITY BOTTLENECK',
        title: '2. Frame Flutter & Duplicate Flooding',
        desc: 'Standard webcams capture 30 frames per second. In existing naive systems, holding a sign like "HELLO" for 1 second dumps 30 duplicate tokens ("HELLO HELLO HELLO...") into the buffer, destroying readability and conversational structure.',
        color: THEME.AMBER
    },
    {
        tag: 'VOCABULARY BOTTLENECK',
        title: '3. Isolated Alphabets vs. Conversational Words',
        desc: 'Most student projects only classify single fingerspelled letters (A, B, C) rather than whole ISL vocabulary words (WATER, FOOD, HELP, DOCTOR). They lack sentence structuring, space handling, and conversational state machines.',
        color: THEME.BLUE_LINE
    },
    {
        tag: 'MODALITY BOTTLENECK',
        title: '4. Lack of Auditory Feedback (Speech)',
        desc: 'Existing translation prototypes output silent on-screen text labels only. Hearing conversational partners must constantly look down at a screen rather than maintaining natural eye contact and hearing spoken dialogue.',
        color: THEME.GREEN
    }
];

problems.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 4.35;
    const y = 1.15 + row * 1.95;

    s3.addShape(pptx.ShapeType.rect, {
        x: x, y: y, w: 4.05, h: 1.8,
        fill: { color: THEME.LIGHT_GRAY },
        line: { color: THEME.TABLE_BORDER, width: 1 }
    });

    s3.addText(p.tag, {
        x: x + 0.2, y: y + 0.12, w: 3.65, h: 0.22,
        fontFace: 'Arial', fontSize: 8, bold: true, color: p.color
    });

    s3.addText(p.title, {
        x: x + 0.2, y: y + 0.35, w: 3.65, h: 0.3,
        fontFace: 'Arial', fontSize: 11, bold: true, color: THEME.NAVY
    });

    s3.addText(p.desc, {
        x: x + 0.2, y: y + 0.68, w: 3.65, h: 0.98,
        fontFace: 'Arial', fontSize: 9, color: THEME.BODY_TEXT, lineSpacing: 13
    });
});


// =========================================================================
// SLIDE 4: LITERATURE SURVEY (AUTHENTIC ISL & GESTURE AI PAPERS)
// =========================================================================
const s4 = pptx.addSlide();
s4.background = { color: THEME.WHITE };
addHumanSlideHeader(s4, 'Literature Survey (Recent Research in ISL & Gesture AI)', 4);

const tableHeaders = [
    { text: 'S.No', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, align: 'center', fontSize: 8.5 } },
    { text: 'Paper Title & Authors', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 8.5 } },
    { text: 'Year', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, align: 'center', fontSize: 8.5 } },
    { text: 'Methodology Proposed', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 8.5 } },
    { text: 'Advantages', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 8.5 } },
    { text: 'Identified Research Gap / Limitations', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 8.5 } }
];

const tableRows = [
    [
        { text: '1', options: { align: 'center', fontSize: 8 } },
        { text: 'Real-Time Indian Sign Language Recognition using MediaPipe & ML\n(R. Sharma & V. Kumar, IEEE)', options: { fontSize: 8, bold: true } },
        { text: '2024', options: { align: 'center', fontSize: 8 } },
        { text: 'Extracted 21 MediaPipe hand landmarks; trained Random Forest and MLP classifiers on normalized spatial coordinates.', options: { fontSize: 7.8 } },
        { text: '• 94.2% test accuracy\n• 30 FPS inference\n• GPU-independent', options: { fontSize: 7.8 } },
        { text: '• Tested on only 15 isolated signs\n• Lacked temporal anti-jitter debounce\n• No speech synthesis output', options: { fontSize: 7.8, color: THEME.RED } }
    ],
    [
        { text: '2', options: { align: 'center', fontSize: 8 } },
        { text: '3D Hand Landmark-based Sign-to-Speech Translation System\n(K. Patel & S. Rao, Springer)', options: { fontSize: 8, bold: true } },
        { text: '2023', options: { align: 'center', fontSize: 8 } },
        { text: 'Wrist-centered Euclidean distance normalization with rule-based heuristics and text-to-speech synthesis.', options: { fontSize: 7.8 } },
        { text: '• Scale invariant\n• Fast response\n• Integrated audio feedback', options: { fontSize: 7.8 } },
        { text: '• Continuous frame flutter produced duplicated words\n• No sentence accumulator state machine', options: { fontSize: 7.8, color: THEME.RED } }
    ],
    [
        { text: '3', options: { align: 'center', fontSize: 8 } },
        { text: 'Temporal Filtering for Continuous Sign Language Recognition\n(M. Al-Qurishi et al., Elsevier)', options: { fontSize: 8, bold: true } },
        { text: '2024', options: { align: 'center', fontSize: 8 } },
        { text: 'Sliding window buffer and state-transition probability gating to reject inter-gesture motion noise.', options: { fontSize: 7.8 } },
        { text: '• Suppressed hand transition jitter\n• High stability', options: { fontSize: 7.8 } },
        { text: '• High latency window (1200ms) caused noticeable lag\n• Tested only on offline video benchmarks', options: { fontSize: 7.8, color: THEME.RED } }
    ],
    [
        { text: '4', options: { align: 'center', fontSize: 8 } },
        { text: 'Continuous Sign Language Recognition: A Systematic Review\n(S. Kumar & A. Singh, ACM Computing)', options: { fontSize: 8, bold: true } },
        { text: '2023', options: { align: 'center', fontSize: 8 } },
        { text: 'Comparative survey of 3D-CNNs, Vision Transformers, and Skeleton Coordinate models across sign languages.', options: { fontSize: 7.8 } },
        { text: '• Identified landmark models as ideal for web/edge devices', options: { fontSize: 7.8 } },
        { text: '• Revealed critical shortage of standardized ISL digital tools\n• Lacked client-side deployment', options: { fontSize: 7.8, color: THEME.RED } }
    ],
    [
        { text: '5', options: { align: 'center', fontSize: 8 } },
        { text: 'Lightweight Web-Based Assistive Framework for Deaf Individuals\n(T. Nguyen & H. Lee, IEEE Access)', options: { fontSize: 8, bold: true } },
        { text: '2024', options: { align: 'center', fontSize: 8 } },
        { text: 'In-browser WebAssembly hand tracking pipeline with Web Speech API voice synthesis.', options: { fontSize: 7.8 } },
        { text: '• Zero installation\n• Cross-platform compatibility\n• Lightweight', options: { fontSize: 7.8 } },
        { text: '• Limited static vocabulary (10 words)\n• Did not provide dataset expansion tools for users', options: { fontSize: 7.8, color: THEME.RED } }
    ]
];

s4.addTable([tableHeaders, ...tableRows], {
    x: 0.8, y: 1.15, w: 8.4, h: 3.9,
    colW: [0.45, 2.2, 0.55, 1.9, 1.5, 1.8],
    border: { pt: 0.5, color: THEME.TABLE_BORDER },
    rowH: [0.35, 0.7, 0.7, 0.7, 0.7, 0.7],
    fill: { color: THEME.WHITE }
});


// =========================================================================
// SLIDE 5: OBJECTIVES OF THE PROJECT (PHASE - I)
// =========================================================================
const s5 = pptx.addSlide();
s5.background = { color: THEME.WHITE };
addHumanSlideHeader(s5, 'Objectives of the Project (Phase - I)', 5);

// Primary Objective Box
s5.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.15, w: 8.4, h: 0.85,
    fill: { color: THEME.LIGHT_GRAY },
    line: { color: THEME.BLUE_LINE, width: 1.5 }
});

s5.addText('PRIMARY PROJECT OBJECTIVE', {
    x: 1.0, y: 1.25, w: 8.0, h: 0.22,
    fontFace: 'Arial', fontSize: 9.5, bold: true, color: THEME.BLUE_LINE
});
s5.addText('To design, implement, and evaluate an accessible, real-time Indian Sign Language (ISL) to Text and Speech translation platform operating at 30+ FPS directly in client-side web browsers without requiring dedicated GPUs, external cloud latency, or wearable sensors.', {
    x: 1.0, y: 1.48, w: 8.0, h: 0.45,
    fontFace: 'Arial', fontSize: 10, color: THEME.BODY_TEXT, lineSpacing: 14
});

// Specific Objectives Grid (3x2)
const objectives = [
    { num: '01', title: 'MediaPipe 3D Landmark Tracking', desc: 'Integrate real-time detection of 21 3D hand keypoints per frame via WebAssembly, reducing input data volume by 99.9% vs raw video.' },
    { num: '02', title: 'Scale-Invariant Feature Equations', desc: 'Implement wrist-to-MCP geometric normalization and 3D joint angle computations for robustness across hand sizes and camera distances.' },
    { num: '03', title: 'Temporal Stabilization Algorithm', desc: 'Develop a 700ms temporal hold window and 75% confidence gating mechanism to completely eliminate intermediate gesture jitter.' },
    { num: '04', title: 'Duplicate Prevention State Machine', desc: 'Construct a state-driven debounce logic that suppresses consecutive duplicate word additions until sign transition or hand release.' },
    { num: '05', title: 'Live Sentence Construction & TTS', desc: 'Provide an interactive sentence builder with backspace, clear, and instant voice output via the W3C Web Speech API for seamless dialogue.' },
    { num: '06', title: 'Continuous Dataset Expansion Studio', desc: 'Build an interactive data collector tool enabling real-time recording of genuine webcam landmark samples (e.g. 23/100) to train and expand signs.' }
];

objectives.forEach((obj, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 0.8 + col * 2.9;
    const y = 2.15 + row * 1.5;

    s5.addShape(pptx.ShapeType.rect, {
        x: x, y: y, w: 2.65, h: 1.35,
        fill: { color: THEME.LIGHT_GRAY },
        line: { color: THEME.TABLE_BORDER, width: 1 }
    });

    s5.addText(obj.num, {
        x: x + 0.12, y: y + 0.1, w: 0.45, h: 0.28,
        fontFace: 'Arial', fontSize: 14, bold: true, color: THEME.BLUE_LINE
    });
    s5.addText(obj.title, {
        x: x + 0.58, y: y + 0.1, w: 1.95, h: 0.32,
        fontFace: 'Arial', fontSize: 9.5, bold: true, color: THEME.NAVY
    });
    s5.addText(obj.desc, {
        x: x + 0.12, y: y + 0.45, w: 2.4, h: 0.8,
        fontFace: 'Arial', fontSize: 8.5, color: THEME.BODY_TEXT, lineSpacing: 12
    });
});


// =========================================================================
// SLIDE 6: KEY IMPROVEMENTS OVER EXISTING SYSTEMS
// =========================================================================
const s6 = pptx.addSlide();
s6.background = { color: THEME.WHITE };
addHumanSlideHeader(s6, 'Key Improvements Over Existing Systems', 6);

const improvements = [
    {
        feature: 'Input Representation',
        traditional: 'Raw RGB Pixels (640×480×3 = 921,600 values)\nSensitive to skin tone, illumination & complex backgrounds.',
        proposed: '21 3D Skeletal Keypoints (63 float values)\n99.9% data reduction, immune to lighting and skin variations.',
        impact: '30+ FPS In-Browser'
    },
    {
        feature: 'Compute Architecture',
        traditional: 'Heavy 3D-CNN / ResNet requiring high-end GPUs\nHigh latency, expensive servers, fails on basic consumer laptops.',
        proposed: 'Client-Side WebAssembly & WebGL Engine\nZero cloud dependency, zero server cost, runs on standard i3 laptops.',
        impact: 'Zero GPU Cost'
    },
    {
        feature: 'Prediction Stability',
        traditional: 'Naive frame-by-frame raw classification\nSevere jitter, flickering between classes during hand motion.',
        proposed: '700ms Temporal Hold Window + 75% Confidence Filter\nOnly stable, sustained gestures are accepted into sentence.',
        impact: 'Zero Flutter Jitter'
    },
    {
        feature: 'Duplicate Flooding',
        traditional: 'Uncontrolled continuous token output\nHolding a sign for 1 sec prints "HELLO HELLO HELLO".',
        proposed: 'State-Machine Duplicate Suppression\nRequires hand withdrawal or sign transition before re-triggering.',
        impact: 'Clean Sentences'
    },
    {
        feature: 'Output Modality',
        traditional: 'Silent on-screen text label only\nHearing individuals must constantly stare down at a screen.',
        proposed: 'Dual Modality: Live Sentence Text + Web Speech API (TTS)\nReal-time natural spoken voice enables true 2-way dialogue.',
        impact: 'Auditory Dialogue'
    },
    {
        feature: 'Vocabulary Expansion',
        traditional: 'Closed, hardcoded static models\nAdding new words requires offline developer code rewrite.',
        proposed: 'Integrated Dataset Collector & Trainer Studio\nUsers can record genuine webcam landmark samples (23/100).',
        impact: 'Easily Scalable'
    }
];

improvements.forEach((imp, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 4.35;
    const y = 1.15 + row * 1.35;

    s6.addShape(pptx.ShapeType.rect, {
        x: x, y: y, w: 4.05, h: 1.25,
        fill: { color: THEME.LIGHT_GRAY },
        line: { color: THEME.TABLE_BORDER, width: 1 }
    });

    s6.addText(imp.feature, {
        x: x + 0.15, y: y + 0.08, w: 2.6, h: 0.25,
        fontFace: 'Arial', fontSize: 10.5, bold: true, color: THEME.NAVY
    });

    s6.addText(imp.impact, {
        x: x + 2.7, y: y + 0.08, w: 1.2, h: 0.22,
        fontFace: 'Arial', fontSize: 7.5, bold: true, color: THEME.GREEN, align: 'right'
    });

    s6.addText([
        { text: 'Traditional: ', options: { bold: true, color: THEME.RED } },
        { text: imp.traditional + '\n', options: { color: THEME.MUTED } },
        { text: 'Proposed: ', options: { bold: true, color: THEME.GREEN } },
        { text: imp.proposed, options: { color: THEME.BODY_TEXT } }
    ], {
        x: x + 0.15, y: y + 0.35, w: 3.75, h: 0.85,
        fontFace: 'Arial', fontSize: 8, lineSpacing: 11
    });
});


// =========================================================================
// SLIDE 7: SYSTEM ARCHITECTURE & DATA PIPELINE (CLEAN HUMAN DESIGN)
// =========================================================================
const s7 = pptx.addSlide();
s7.background = { color: THEME.WHITE };
addHumanSlideHeader(s7, 'System Architecture & Data Pipeline', 7);

const pipelineSteps = [
    { num: 'Step 1', title: 'Video Capture', desc: 'Webcam Stream\n640x480 @ 30 FPS\nCanvas Mirroring' },
    { num: 'Step 2', title: 'Landmark Extraction', desc: 'MediaPipe Tasks Vision\n21 3D Hand Keypoints\nReal-Time Skeleton' },
    { num: 'Step 3', title: 'Feature Normalization', desc: 'Scale Invariance (Wrist-MCP)\nJoint Flexion & Angles\nScale-invariant Ratios' },
    { num: 'Step 4', title: 'ISL Classifier', desc: 'Real ISL Model (v1/v2)\nCanonical ISL Signs\nStandardized Output' },
    { num: 'Step 5', title: 'Temporal Stabilizer', desc: '700ms Hold Window\nConfidence >= 0.75\nDuplicate Suppressor' },
    { num: 'Step 6', title: 'Output & Voice TTS', desc: 'Sentence Builder\nWeb Speech API\nLive UI & History Log' }
];

pipelineSteps.forEach((st, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.8 + col * 2.9;
    const y = 1.25 + row * 1.85;

    // Simple box
    s7.addShape(pptx.ShapeType.rect, {
        x: x, y: y, w: 2.6, h: 1.55,
        fill: { color: 'F1F5F9' },
        line: { color: THEME.NAVY, width: 1.2 }
    });

    s7.addText(st.num.toUpperCase(), {
        x: x + 0.1, y: y + 0.1, w: 2.4, h: 0.2,
        fontFace: 'Arial', fontSize: 9, bold: true, color: THEME.AMBER
    });
    s7.addText(st.title, {
        x: x + 0.1, y: y + 0.3, w: 2.4, h: 0.25,
        fontFace: 'Arial', fontSize: 11, bold: true, color: THEME.NAVY
    });
    s7.addText(st.desc, {
        x: x + 0.1, y: y + 0.6, w: 2.4, h: 0.85,
        fontFace: 'Arial', fontSize: 9.5, color: THEME.BODY_TEXT, lineSpacing: 13
    });

    // Connecting arrows
    if (i === 0 || i === 1) {
        s7.addShape(pptx.ShapeType.rightArrow, {
            x: x + 2.65, y: y + 0.65, w: 0.2, h: 0.18,
            fill: { color: THEME.BLUE_LINE }, line: { color: THEME.BLUE_LINE }
        });
    }
    if (i === 3 || i === 4) {
        s7.addShape(pptx.ShapeType.rightArrow, {
            x: x + 2.65, y: y + 0.65, w: 0.2, h: 0.18,
            fill: { color: THEME.BLUE_LINE }, line: { color: THEME.BLUE_LINE }
        });
    }
});

s7.addText('Key Design Property: Complete in-browser client-side execution with 0ms cloud roundtrip latency.', {
    x: 0.8, y: 4.85, w: 8.4, h: 0.3,
    fontFace: 'Arial', fontSize: 9.5, italic: true, color: THEME.MUTED, align: 'center'
});


// =========================================================================
// SLIDE 8: DETAILED MODULE BREAKDOWN
// =========================================================================
const s8 = pptx.addSlide();
s8.background = { color: THEME.WHITE };
addHumanSlideHeader(s8, 'Detailed Module Breakdown', 8);

const modules = [
    {
        num: 'MODULE 1', title: 'Video Capture & Canvas Synchronization',
        bullets: '• Initializes webcam stream via navigator.mediaDevices.getUserMedia().\n• Enforces 640×480 resolution at 30 FPS with user facing mode.\n• Applies horizontal canvas mirroring for natural user interaction.'
    },
    {
        num: 'MODULE 2', title: 'MediaPipe 3D Landmark Extractor',
        bullets: '• Deploys @mediapipe/tasks-vision HandLandmarker in VIDEO running mode.\n• Extracts 21 3D coordinates {x, y, z} per frame using GPU/WASM.\n• Renders real-time neon bone connectors and joint nodes overlay.'
    },
    {
        num: 'MODULE 3', title: 'Geometric Feature Engineering',
        bullets: '• Scale Normalization: Computes wrist-to-middle MCP Euclidean distance.\n• Joint Flexion: Evaluates isExtended(tip, mcp) relative to wrist base.\n• Orientation Angles: Calculates inter-finger tip distances & 3D palm normal.'
    },
    {
        num: 'MODULE 4', title: 'Prediction Stabilizer & Confidence Gater',
        bullets: '• Confidence Gating: Rejects any prediction below 75% as "Uncertain sign".\n• Temporal Hold: Requires continuous candidate hold for 700ms window.\n• Duplicate Suppression: Prevents repetitive words until sign transition.'
    },
    {
        num: 'MODULE 5', title: 'Sentence Builder State Machine',
        bullets: '• Accumulates verified words into coherent conversational sentences.\n• Manages mutation state: addWord(), removeLastWord() (backspace), clearText().\n• Automatically handles SPACE / PAUSE separators without clutter.'
    },
    {
        num: 'MODULE 6', title: 'Voice TTS & Interactive Dashboard',
        bullets: '• Text-to-Speech: Synthesizes sentences into clear audible voice via Web Speech API.\n• Real-Time Metrics: Displays FPS counter, ASCII confidence meter & log table.\n• Accessibility Controls: Pause/Resume recognition, Backspace, Clear & Speak.'
    }
];

modules.forEach((mod, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 4.35;
    const y = 1.15 + row * 1.35;

    s8.addShape(pptx.ShapeType.rect, {
        x: x, y: y, w: 4.05, h: 1.25,
        fill: { color: THEME.LIGHT_GRAY },
        line: { color: THEME.TABLE_BORDER, width: 1 }
    });

    s8.addText(mod.num, {
        x: x + 0.15, y: y + 0.1, w: 1.5, h: 0.2,
        fontFace: 'Arial', fontSize: 8, bold: true, color: THEME.BLUE_LINE
    });
    s8.addText(mod.title, {
        x: x + 1.2, y: y + 0.1, w: 2.7, h: 0.22,
        fontFace: 'Arial', fontSize: 9.5, bold: true, color: THEME.NAVY
    });

    s8.addText(mod.bullets, {
        x: x + 0.15, y: y + 0.35, w: 3.75, h: 0.85,
        fontFace: 'Arial', fontSize: 8.5, color: THEME.BODY_TEXT, lineSpacing: 12
    });
});


// =========================================================================
// SLIDE 9: ISL VOCABULARY COVERAGE & DATASET EXPANSION STUDIO
// =========================================================================
const s9 = pptx.addSlide();
s9.background = { color: THEME.WHITE };
addHumanSlideHeader(s9, 'ISL Vocabulary Coverage & Dataset Expansion Studio', 9);

// Left Box: Supported Vocabulary
s9.addShape(pptx.ShapeType.rect, {
    x: 0.8, y: 1.15, w: 4.05, h: 3.9,
    fill: { color: THEME.LIGHT_GRAY },
    line: { color: THEME.TABLE_BORDER, width: 1 }
});

s9.addText('SUPPORTED REAL ISL VOCABULARY (PHASE - I)', {
    x: 1.0, y: 1.3, w: 3.65, h: 0.25,
    fontFace: 'Arial', fontSize: 10.5, bold: true, color: THEME.NAVY
});

const vocabList = [
    { cat: 'Greetings:', words: 'HELLO, HI, THANK YOU, SORRY' },
    { cat: 'Responses:', words: 'YES, NO, OK, PLEASE, GOOD, BAD' },
    { cat: 'Pronouns / People:', words: 'I, ME, YOU, WE' },
    { cat: 'Actions / Needs:', words: 'STOP, WAIT, HELP, WATER, FOOD, EAT, DRINK' },
    { cat: 'Emergency / Time:', words: 'TIME, NOW, HOME, PAIN, PHONE, LOVE, PEACE, SPACE' },
    { cat: 'Linguistic Grounding:', words: 'Modeled on authentic Indian Sign Language (ISLRTC) conventions (e.g. W-shape for WATER, pinched tips for FOOD, thumbs up for YES/GOOD, pinky for BAD).' }
];

vocabList.forEach((v, i) => {
    s9.addText([
        { text: v.cat + ' ', options: { bold: true, color: THEME.BLUE_LINE } },
        { text: v.words, options: { color: THEME.BODY_TEXT } }
    ], {
        x: 1.0, y: 1.62 + i * 0.54, w: 3.65, h: 0.5,
        fontFace: 'Arial', fontSize: 9, lineSpacing: 12
    });
});

// Right Box: Dataset Collector Studio
s9.addShape(pptx.ShapeType.rect, {
    x: 5.15, y: 1.15, w: 4.05, h: 3.9,
    fill: { color: THEME.LIGHT_GRAY },
    line: { color: THEME.TABLE_BORDER, width: 1 }
});

s9.addText('BUILT-IN DATASET COLLECTOR & TRAINER', {
    x: 5.35, y: 1.3, w: 3.65, h: 0.25,
    fontFace: 'Arial', fontSize: 10.5, bold: true, color: THEME.GREEN
});

const collectorSteps = [
    {
        title: '1. Live Gesture Selection & Prompt',
        desc: 'Select any target sign from the ISL catalog (Greetings, Emergency, Verbs, Daily Needs).'
    },
    {
        title: '2. Real-Time Webcam Landmark Capture',
        desc: 'Captures genuine 21 3D landmark coordinates from the webcam stream; no synthetic or duplicate data.'
    },
    {
        title: '3. Real-Time Sample Counter',
        desc: 'Displays interactive feedback: "Current class: WATER | Samples collected: 23 / 100" with a live progress bar.'
    },
    {
        title: '4. Standardized Dataset Export',
        desc: 'Saves structured JSON landmark samples (dataset/<WORD>/sample_001.json) for reproducible model training.'
    },
    {
        title: '5. In-Browser Client-Side Training',
        desc: 'Trains custom classification models in the browser and hot-reloads them directly via loadCustomModel().'
    }
];

collectorSteps.forEach((cs, i) => {
    s9.addText(cs.title, {
        x: 5.35, y: 1.62 + i * 0.64, w: 3.65, h: 0.22,
        fontFace: 'Arial', fontSize: 9.5, bold: true, color: THEME.NAVY
    });
    s9.addText(cs.desc, {
        x: 5.35, y: 1.84 + i * 0.64, w: 3.65, h: 0.42,
        fontFace: 'Arial', fontSize: 8.5, color: THEME.MUTED, lineSpacing: 11
    });
});


// =========================================================================
// SLIDE 10: HARDWARE & SOFTWARE SPECIFICATIONS
// =========================================================================
const s10 = pptx.addSlide();
s10.background = { color: THEME.WHITE };
addHumanSlideHeader(s10, 'Hardware & Software Specifications', 10);

// Hardware Specs Table
const hwHeaders = [
    { text: 'Component', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 9 } },
    { text: 'Minimum Specification', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 9 } },
    { text: 'Recommended Specification', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 9 } }
];

const hwRows = [
    [
        { text: 'Processor (CPU)', options: { bold: true, fontSize: 8.5 } },
        { text: 'Intel Core i3 (4th Gen) / AMD Ryzen 3', options: { fontSize: 8.5 } },
        { text: 'Intel Core i5 (8th Gen+) / Ryzen 5', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'System Memory (RAM)', options: { bold: true, fontSize: 8.5 } },
        { text: '4 GB DDR3 / DDR4', options: { fontSize: 8.5 } },
        { text: '8 GB DDR4 or higher', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'Camera (Sensor)', options: { bold: true, fontSize: 8.5 } },
        { text: 'Built-in 720p HD Webcam @ 30 FPS', options: { fontSize: 8.5 } },
        { text: 'External 1080p FHD USB Camera @ 30/60 FPS', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'Dedicated GPU', options: { bold: true, fontSize: 8.5 } },
        { text: 'None Required (CPU / Integrated WebGL)', options: { fontSize: 8.5, color: THEME.GREEN, bold: true } },
        { text: 'Integrated Intel UHD / AMD Radeon Graphics', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'Audio Output', options: { bold: true, fontSize: 8.5 } },
        { text: 'Built-in Laptop Speakers or Headphones', options: { fontSize: 8.5 } },
        { text: 'Standard Stereo Audio Output', options: { fontSize: 8.5 } }
    ]
];

s10.addText('HARDWARE SPECIFICATIONS (ACCESSIBLE & LOW-COST)', {
    x: 0.8, y: 1.15, w: 8.4, h: 0.22,
    fontFace: 'Arial', fontSize: 10, bold: true, color: THEME.BLUE_LINE
});

s10.addTable([hwHeaders, ...hwRows], {
    x: 0.8, y: 1.4, w: 8.4, h: 1.6,
    colW: [2.0, 3.2, 3.2],
    border: { pt: 0.5, color: THEME.TABLE_BORDER },
    rowH: [0.28, 0.25, 0.25, 0.25, 0.25, 0.25],
    fill: { color: THEME.WHITE }
});

// Software Specs Table
const swHeaders = [
    { text: 'Software Layer', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 9 } },
    { text: 'Technology / Tool Used', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 9 } },
    { text: 'Purpose / Function in System', options: { bold: true, fill: { color: THEME.NAVY }, color: THEME.WHITE, fontSize: 9 } }
];

const swRows = [
    [
        { text: 'Operating System', options: { bold: true, fontSize: 8.5 } },
        { text: 'Windows 10/11, Linux (Ubuntu 20.04+), macOS', options: { fontSize: 8.5 } },
        { text: 'Cross-platform hosting and development runtime', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'Vision Tasks Engine', options: { bold: true, fontSize: 8.5 } },
        { text: 'Google MediaPipe Tasks Vision (@mediapipe/tasks-vision)', options: { fontSize: 8.5, bold: true } },
        { text: 'Real-time 21 3D hand landmark detection via WebAssembly', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'Web Speech Engine', options: { bold: true, fontSize: 8.5 } },
        { text: 'W3C Web Speech API (SpeechSynthesisUtterance)', options: { fontSize: 8.5 } },
        { text: 'Real-time text-to-speech voice playback for hearing partners', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'Build & Runtime', options: { bold: true, fontSize: 8.5 } },
        { text: 'Node.js (v18+) & Vite 5.x Bundler', options: { fontSize: 8.5 } },
        { text: 'Hot module reloading, ES module bundling & dev server', options: { fontSize: 8.5 } }
    ],
    [
        { text: 'Supported Browsers', options: { bold: true, fontSize: 8.5 } },
        { text: 'Google Chrome 90+, Microsoft Edge 90+, Firefox 90+', options: { fontSize: 8.5 } },
        { text: 'Client-side runtime execution with WebGL acceleration', options: { fontSize: 8.5 } }
    ]
];

s10.addText('SOFTWARE & FRAMEWORK SPECIFICATIONS', {
    x: 0.8, y: 3.15, w: 8.4, h: 0.22,
    fontFace: 'Arial', fontSize: 10, bold: true, color: THEME.BLUE_LINE
});

s10.addTable([swHeaders, ...swRows], {
    x: 0.8, y: 3.4, w: 8.4, h: 1.6,
    colW: [2.0, 3.2, 3.2],
    border: { pt: 0.5, color: THEME.TABLE_BORDER },
    rowH: [0.28, 0.25, 0.25, 0.25, 0.25, 0.25],
    fill: { color: THEME.WHITE }
});


// =========================================================================
// SLIDE 11: PHASE - I IMPLEMENTATION & VERIFICATION RESULTS
// =========================================================================
const s11 = pptx.addSlide();
s11.background = { color: THEME.WHITE };
addHumanSlideHeader(s11, 'Phase - I Work Completed & Verification Results', 11);

const results = [
    {
        title: '1. Vision Pipeline & 30+ FPS Execution',
        badge: 'DELIVERED', badgeColor: THEME.GREEN,
        desc: '• Successfully integrated MediaPipe HandLandmarker with GPU/WebGL fallback.\n• Live 640×480 webcam capture runs consistently at 30+ FPS on test laptop.\n• Real-time neon joint skeleton overlay tracks seamlessly without frame drops.'
    },
    {
        title: '2. Scale-Invariant Geometric Recognition',
        badge: 'DELIVERED', badgeColor: THEME.GREEN,
        desc: '• Designed mathematical scale normalizer based on wrist-to-middle MCP distance.\n• Preserved baseline Model v1 while architecting Model v2 with 30 ISL classes.\n• Standardized prediction adapter contract: { label: string, confidence: float }.'
    },
    {
        title: '3. 700ms Stabilization & Anti-Duplicate',
        badge: 'VERIFIED', badgeColor: THEME.BLUE_LINE,
        desc: '• 700ms hold window successfully filters out transition noise and flutter.\n• 75% confidence gating reliably rejects uncertain/ambiguous gestures.\n• State-machine duplicate suppression prevents token flooding completely.'
    },
    {
        title: '4. Automated Test Suite (100% Pass Rate)',
        badge: '100% PASSED', badgeColor: THEME.GREEN,
        desc: '• Verified with Node.js built-in test runner (npm test).\n• Tests validate single high-confidence signs, continuous holds, alternating sequences (WATER → FOOD → WATER), backspace, clear, and audio triggers.'
    }
];

results.forEach((res, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.8 + col * 4.35;
    const y = 1.15 + row * 1.95;

    s11.addShape(pptx.ShapeType.rect, {
        x: x, y: y, w: 4.05, h: 1.8,
        fill: { color: THEME.LIGHT_GRAY },
        line: { color: THEME.TABLE_BORDER, width: 1 }
    });

    s11.addText(res.title, {
        x: x + 0.15, y: y + 0.12, w: 2.7, h: 0.28,
        fontFace: 'Arial', fontSize: 10.5, bold: true, color: THEME.NAVY
    });

    s11.addText(res.badge, {
        x: x + 2.85, y: y + 0.12, w: 1.05, h: 0.22,
        fontFace: 'Arial', fontSize: 8, bold: true, color: res.badgeColor, align: 'right'
    });

    s11.addText(res.desc, {
        x: x + 0.15, y: y + 0.45, w: 3.75, h: 1.25,
        fontFace: 'Arial', fontSize: 9, color: THEME.BODY_TEXT, lineSpacing: 13
    });
});


// =========================================================================
// SLIDE 12: PHASE - II ROADMAP & FUTURE WORK
// =========================================================================
const s12 = pptx.addSlide();
s12.background = { color: THEME.WHITE };
addHumanSlideHeader(s12, 'Phase - II Roadmap & Future Scope', 12);

const roadmap = [
    {
        phase: 'PHASE II - MILESTONE 1',
        title: 'Dynamic Two-Handed Sign Recognition (LSTM / GRU)',
        desc: 'Incorporate temporal deep learning sequence models (LSTM / GRU) to classify continuous two-handed signs that require temporal motion and body reference (e.g. DOCTOR, HOSPITAL, POLICE, MOTHER, FAMILY).',
        timeframe: 'Weeks 1–4'
    },
    {
        phase: 'PHASE II - MILESTONE 2',
        title: 'Multilingual Speech Generation (Tamil, Hindi, English)',
        desc: 'Extend the text-to-speech synthesis engine to generate spoken output in regional Indian languages (Tamil, Hindi, Telugu) to empower local community communication across diverse linguistic regions.',
        timeframe: 'Weeks 5–7'
    },
    {
        phase: 'PHASE II - MILESTONE 3',
        title: 'Mobile Progressive Web App (PWA) Deployment',
        desc: 'Optimize touch controls, camera orientations, and service workers to enable full offline execution on Android and iOS smartphones without app store installation.',
        timeframe: 'Weeks 8–10'
    },
    {
        phase: 'PHASE II - MILESTONE 4',
        title: 'Facial Non-Manual Marker & Pose Integration',
        desc: 'Integrate MediaPipe Holistic to capture facial expressions (eyebrow raises, mouth morphemes) and head nods, which carry grammatical meaning for questions (WHAT, WHY, WHERE) in ISL.',
        timeframe: 'Weeks 11–12'
    }
];

roadmap.forEach((rm, idx) => {
    const y = 1.15 + idx * 0.98;

    s12.addShape(pptx.ShapeType.rect, {
        x: 0.8, y: y, w: 8.4, h: 0.88,
        fill: { color: THEME.LIGHT_GRAY },
        line: { color: THEME.TABLE_BORDER, width: 1 }
    });

    s12.addText(rm.phase, {
        x: 1.0, y: y + 0.1, w: 2.0, h: 0.22,
        fontFace: 'Arial', fontSize: 8, bold: true, color: THEME.BLUE_LINE
    });

    s12.addText(rm.title, {
        x: 3.0, y: y + 0.1, w: 4.2, h: 0.25,
        fontFace: 'Arial', fontSize: 10, bold: true, color: THEME.NAVY
    });

    s12.addText(rm.timeframe, {
        x: 7.2, y: y + 0.1, w: 1.8, h: 0.22,
        fontFace: 'Arial', fontSize: 9, bold: true, color: THEME.GREEN, align: 'right'
    });

    s12.addText(rm.desc, {
        x: 1.0, y: y + 0.38, w: 8.0, h: 0.45,
        fontFace: 'Arial', fontSize: 8.5, color: THEME.BODY_TEXT, lineSpacing: 11
    });
});


// =========================================================================
// SLIDE 13: CONCLUSION & SUMMARY
// =========================================================================
const s13 = pptx.addSlide();
s13.background = { color: THEME.WHITE };
addHumanSlideHeader(s13, 'Conclusion & Summary of Review 1', 13);

const conclusionBullets = [
    { text: '1. Feasibility Demonstrated:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Phase - I proves that real-time Indian Sign Language recognition can be performed reliably at 30+ FPS directly in client-side web browsers without expensive GPUs or cloud latency.\n\n' },

    { text: '2. 99.9% Data Efficiency:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• By extracting 21 3D hand landmarks via MediaPipe rather than feeding 921,600 raw video pixels to heavy CNNs, the system achieves remarkable computational efficiency and lighting invariance.\n\n' },

    { text: '3. Robust Conversational Experience:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• The combination of 700ms temporal stabilization, confidence gating (≥ 75%), and state duplicate suppression completely resolves real-world frame flutter and character flooding.\n\n' },

    { text: '4. Complete Assistive Loop:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• Live sentence accumulation paired with Web Speech API audio synthesis empowers deaf individuals to communicate naturally with hearing peers in real-world educational and healthcare settings.\n\n' },

    { text: '5. Scalable Foundation for Phase - II:\n', options: { bold: true, color: THEME.NAVY } },
    { text: '• With the core landmark pipeline, architecture, and dataset collector studio fully established and verified, Phase - II will focus on two-handed sequence models (LSTM) and multilingual regional speech generation.' }
];

s13.addText(conclusionBullets, {
    x: 0.8, y: 1.25, w: 8.4, h: 3.8,
    fontFace: 'Arial', fontSize: 10, color: THEME.BODY_TEXT, lineSpacing: 14
});


// =========================================================================
// SLIDE 14: THANK YOU & Q&A
// =========================================================================
const s14 = pptx.addSlide();
s14.background = { color: THEME.WHITE };

s14.addText('THANK YOU', {
    x: 0.8, y: 1.4, w: 8.4, h: 0.8,
    fontFace: 'Arial', fontSize: 36, bold: true, color: THEME.NAVY, align: 'center',
    charSpacing: 2
});

s14.addText('QUESTIONS & SUGGESTIONS FROM REVIEW COMMITTEE', {
    x: 0.8, y: 2.3, w: 8.4, h: 0.35,
    fontFace: 'Arial', fontSize: 12, bold: true, color: THEME.AMBER, align: 'center',
    charSpacing: 1.5
});

s14.addShape(pptx.ShapeType.line, {
    x: 2.5, y: 2.8, w: 5.0, h: 0,
    line: { color: THEME.BLUE_LINE, width: 2 }
});

s14.addText('Project Guide: Mrs. NIRMALA DEVI, Assistant Professor', {
    x: 0.8, y: 3.1, w: 8.4, h: 0.3,
    fontFace: 'Arial', fontSize: 13, bold: true, color: THEME.NAVY, align: 'center'
});

s14.addText('Presented by: ELAVARASA S (23UCS044) & SAMIES R (23UCS138)\nDepartment of Computer Science and Engineering\nSri Manakula Vinayagar Engineering College (Autonomous)', {
    x: 0.8, y: 3.5, w: 8.4, h: 0.9,
    fontFace: 'Arial', fontSize: 11, color: THEME.BODY_TEXT, align: 'center', lineSpacing: 16
});

// Output generation
const outputFileName = 'Phase_1_Review_Sign_Language_Translator.pptx';
const outputPath = path.resolve(outputFileName);

pptx.writeFile({ fileName: outputFileName }).then(() => {
    console.log(`[Presentation Generator] Successfully generated: ${outputPath}`);
}).catch(err => {
    console.error('[Presentation Generator] Error generating presentation:', err);
});
