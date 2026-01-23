'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

let padText, formatDecisionHeader, formatOptionBox, formatChosenBox, formatCaveatsBox, formatFollowUpBox;
let asciiBoxesAvailable = false;
try {
  ({
    padText,
    formatDecisionHeader,
    formatOptionBox,
    formatChosenBox,
    formatCaveatsBox,
    formatFollowUpBox
  } = require('../lib/ascii-boxes'));
  asciiBoxesAvailable = true;
} catch (err) {
  console.warn('Warning: ascii-boxes library not available:', err.message);
  console.warn('Decision tree generation will use fallback formatting.');
  // Provide minimal fallback implementations
  padText = (text, length) => String(text || '').substring(0, length).padEnd(length);
  formatDecisionHeader = (title) => `[DECISION: ${title}]`;
  formatOptionBox = (opt, isChosen) => `[${isChosen ? '✓' : ' '} ${opt?.LABEL || 'Option'}]`;
  formatChosenBox = (chosen) => `[CHOSEN: ${chosen}]`;
  formatCaveatsBox = (caveats) => `[CAVEATS: ${caveats?.length || 0}]`;
  formatFollowUpBox = (followup) => `[FOLLOWUP: ${followup?.length || 0}]`;
}

/* ─────────────────────────────────────────────────────────────
   2. DECISION TREE GENERATION
──────────────────────────────────────────────────────────────── */

function generateDecisionTree(decisionData) {
  // Handle legacy format (simple parameters) for backwards compatibility
  if (typeof decisionData === 'string') {
    const title = decisionData;
    const options = arguments[1] || [];
    const chosen = arguments[2] || '';

    const pad = (text, length) => text.substring(0, length).padEnd(length);
    return `┌──────────────────────┐
│  ${pad(title, 18)}  │
└──────────────────────┘
         │
         ▼
    ╱──────────╲
   ╱  Options?   ╲
   ╲            ╱
    ╲──────────╱
      ${chosen ? '✓' : ''}`;
  }

  const {
    TITLE = 'Decision',
    CONTEXT = '',
    CONFIDENCE = 75,
    TIMESTAMP = new Date().toISOString(),
    OPTIONS = [],
    CHOSEN = '',
    RATIONALE = '',
    EVIDENCE = [],
    CAVEATS = [],
    FOLLOWUP = []
  } = decisionData;

  if (OPTIONS.length === 0) {
    return formatDecisionHeader(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP) + '\n' +
           '         │\n' +
           '         ▼\n' +
           '   (No options provided)';
  }

  let tree = formatDecisionHeader(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP);
  tree += '\n                      │\n                      ▼\n';

  const questionText = OPTIONS.length > 2 ? `Select from ${OPTIONS.length} options?` : 'Choose option?';
  tree += `              ╱${'─'.repeat(questionText.length + 2)}╲\n`;
  tree += `             ╱  ${questionText}  ╲\n`;
  tree += `            ╱${' '.repeat(questionText.length + 4)}╲\n`;
  tree += `            ╲${' '.repeat(questionText.length + 4)}╱\n`;
  tree += `             ╲${'─'.repeat(questionText.length + 2)}╱\n`;

  const chosenOption = OPTIONS.find(opt =>
    opt.LABEL === CHOSEN ||
    CHOSEN.includes(opt.LABEL) ||
    opt.LABEL.includes(CHOSEN)
  );

  const displayedOptions = OPTIONS.slice(0, 4);
  const spacing = displayedOptions.length === 2 ? 15 : 10;

  if (displayedOptions.length === 2) {
    tree += '               │           │\n';
    tree += `            ${padText(displayedOptions[0].LABEL, 10)}     ${padText(displayedOptions[1].LABEL, 10)}\n`;
    tree += '               │           │\n';
    tree += '               ▼           ▼\n';
  } else {
    let branchLine = '      ';
    for (let i = 0; i < displayedOptions.length; i++) {
      branchLine += '│' + ' '.repeat(spacing);
    }
    tree += branchLine.trimEnd() + '\n';

    let labelLine = '   ';
    for (const opt of displayedOptions) {
      labelLine += padText(opt.LABEL, spacing + 1);
    }
    tree += labelLine.trimEnd() + '\n';
  }

  if (displayedOptions.length <= 3) {
    const boxes = displayedOptions.map(opt =>
      formatOptionBox(opt, opt === chosenOption, 18).split('\n')
    );

    const maxLines = Math.max(...boxes.map(b => b.length));

    for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
      let line = '';
      for (let boxIdx = 0; boxIdx < boxes.length; boxIdx++) {
        const boxLine = boxes[boxIdx][lineIdx] || ' '.repeat(20);
        line += boxLine + '  ';
      }
      tree += line.trimEnd() + '\n';
    }
  }

  if (chosenOption || CHOSEN) {
    tree += '             │           │\n';
    tree += '             │           ▼\n';
    tree += '             │  ' + formatChosenBox(CHOSEN, RATIONALE, EVIDENCE).split('\n').join('\n             │  ') + '\n';
    tree += '             │           │\n';
    tree += '             └─────┬─────┘\n';
    tree += '                   │\n';
    tree += '                   ▼\n';
  }

  if (CAVEATS && CAVEATS.length > 0) {
    tree += formatCaveatsBox(CAVEATS).split('\n').map(line => '     ' + line).join('\n') + '\n';
    tree += '                   │\n';
    tree += '                   ▼\n';
  }

  if (FOLLOWUP && FOLLOWUP.length > 0) {
    tree += formatFollowUpBox(FOLLOWUP).split('\n').map(line => '     ' + line).join('\n') + '\n';
    tree += '                   │\n';
    tree += '                   ▼\n';
  }

  tree += '        ╭────────────────╮\n';
  tree += '        │ Decision Logged │\n';
  tree += '        ╰────────────────╯';

  return tree;
}

/* ─────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  generateDecisionTree
};
