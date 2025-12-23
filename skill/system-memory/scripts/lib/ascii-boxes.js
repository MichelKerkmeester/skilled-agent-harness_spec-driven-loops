/**
 * ASCII Box Formatting Utilities
 * Extracted from generate-context.js for modularity
 * @module ascii-boxes
 * @version 1.0.0
 */

// ───────────────────────────────────────────────────────────────
// BOX DRAWING CHARACTERS
// ───────────────────────────────────────────────────────────────

const BOX = {
  // Rounded corners
  ROUND_TOP_LEFT: '╭',
  ROUND_TOP_RIGHT: '╮',
  ROUND_BOTTOM_LEFT: '╰',
  ROUND_BOTTOM_RIGHT: '╯',
  // Square corners
  TOP_LEFT: '┌',
  TOP_RIGHT: '┐',
  BOTTOM_LEFT: '└',
  BOTTOM_RIGHT: '┘',
  // Lines
  HORIZONTAL: '─',
  VERTICAL: '│',
  // Arrows
  ARROW_DOWN: '▼',
  ARROW_RIGHT: '▶',
  // Markers
  CHECK: '✓',
  CROSS: '✗',
  CHECKBOX: '□',
  BULLET: '•',
  CHOSEN: '✅',
  WARNING: '⚠️',
  CLIPBOARD: '📋'
};

// ───────────────────────────────────────────────────────────────
// TEXT UTILITIES
// ───────────────────────────────────────────────────────────────

/**
 * Pad or truncate text to specified width
 * @param {string} text - Text to pad/truncate
 * @param {number} width - Target width
 * @param {string} align - Alignment: 'left' | 'center' | 'right'
 * @returns {string} Padded/truncated text
 */
function padText(text, width, align = 'left') {
  const cleaned = text.substring(0, width);
  if (align === 'center') {
    const padding = Math.max(0, width - cleaned.length);
    const leftPad = Math.floor(padding / 2);
    const rightPad = padding - leftPad;
    return ' '.repeat(leftPad) + cleaned + ' '.repeat(rightPad);
  }
  return cleaned.padEnd(width);
}

// ───────────────────────────────────────────────────────────────
// DECISION TREE VISUALIZATION HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Format decision header box with context and metadata
 * @param {string} title - Decision title
 * @param {string} context - Decision context
 * @param {number} confidence - Confidence percentage
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted header box
 */
function formatDecisionHeader(title, context, confidence, timestamp) {
  const width = 48;
  const innerWidth = width - 4;

  // Format timestamp
  const date = new Date(timestamp);
  const timeStr = date.toISOString().split('T')[1].substring(0, 8);
  const dateStr = date.toISOString().split('T')[0];

  // Truncate context for header (innerWidth - 9 = max context display width after "Context: " prefix)
  const maxContextWidth = innerWidth - 9;
  const contextSnippet = context ? context.substring(0, maxContextWidth - 3) + (context.length > maxContextWidth - 3 ? '...' : '') : '';

  return `╭${'─'.repeat(width)}╮
│  DECISION: ${padText(title, innerWidth - 10)}  │
│  Context: ${padText(contextSnippet, innerWidth - 9)}  │
│  Confidence: ${confidence}% | ${dateStr} @ ${timeStr}${' '.repeat(Math.max(0, innerWidth - 37 - confidence.toString().length))}  │
╰${'─'.repeat(width)}╯`;
}

/**
 * Format option box with pros/cons
 * @param {Object} option - Option object with LABEL, PROS, CONS
 * @param {boolean} isChosen - Whether this option was chosen
 * @param {number} maxWidth - Maximum box width
 * @returns {string} Formatted option box
 */
function formatOptionBox(option, isChosen, maxWidth = 20) {
  let box = `┌${'─'.repeat(maxWidth)}┐\n`;
  box += `│  ${padText(option.LABEL || 'Option', maxWidth - 4)}  │\n`;

  // Add pros if present
  if (option.PROS && option.PROS.length > 0) {
    for (const pro of option.PROS.slice(0, 2)) {
      const proText = pro.PRO || pro;
      box += `│  ✓ ${padText(proText, maxWidth - 6)}  │\n`;
    }
  }

  // Add cons if present
  if (option.CONS && option.CONS.length > 0) {
    for (const con of option.CONS.slice(0, 2)) {
      const conText = con.CON || con;
      box += `│  ✗ ${padText(conText, maxWidth - 6)}  │\n`;
    }
  }

  box += `└${'─'.repeat(maxWidth)}┘`;
  return box;
}

/**
 * Format chosen decision box with rationale and evidence
 * @param {string} chosen - Chosen option label
 * @param {string} rationale - Rationale for choice
 * @param {Array} evidence - Evidence items
 * @returns {string} Formatted chosen box
 */
function formatChosenBox(chosen, rationale, evidence) {
  const width = 40;

  let box = `┌${'─'.repeat(width)}┐\n`;
  box += `│  ${padText('✅ CHOSEN: ' + chosen, width - 4)}  │\n`;
  box += `│  ${padText('', width - 4)}  │\n`;

  // Add rationale (split into lines if needed)
  if (rationale) {
    box += `│  ${padText('Rationale:', width - 4)}  │\n`;
    const rationaleText = rationale.substring(0, 100);
    const words = rationaleText.split(' ');
    let line = '';

    for (const word of words) {
      if ((line + ' ' + word).length > width - 4) {
        box += `│  ${padText(line, width - 4)}  │\n`;
        line = word;
      } else {
        line += (line ? ' ' : '') + word;
      }
    }
    if (line) {
      box += `│  ${padText(line, width - 4)}  │\n`;
    }
  }

  // Add evidence if present
  if (evidence && evidence.length > 0) {
    box += `│  ${padText('', width - 4)}  │\n`;
    box += `│  ${padText('Evidence:', width - 4)}  │\n`;
    for (const ev of evidence.slice(0, 3)) {
      const evText = ev.EVIDENCE_ITEM || ev;
      box += `│  ${padText('• ' + evText, width - 4)}  │\n`;
    }
  }

  box += `└${'─'.repeat(width)}┘`;
  return box;
}

/**
 * Format caveats box
 * @param {Array} caveats - Array of caveat items
 * @returns {string} Formatted caveats box or empty string
 */
function formatCaveatsBox(caveats) {
  if (!caveats || caveats.length === 0) return '';

  const width = 40;
  let box = `┌${'─'.repeat(width)}┐\n`;
  box += `│  ${padText('⚠️  Caveats:', width - 4)}  │\n`;

  for (const caveat of caveats.slice(0, 3)) {
    const text = caveat.CAVEAT_ITEM || caveat;
    box += `│  ${padText('• ' + text, width - 4)}  │\n`;
  }

  box += `└${'─'.repeat(width)}┘`;
  return box;
}

/**
 * Format follow-up actions box
 * @param {Array} followup - Array of follow-up action items
 * @returns {string} Formatted follow-up box or empty string
 */
function formatFollowUpBox(followup) {
  if (!followup || followup.length === 0) return '';

  const width = 40;
  let box = `┌${'─'.repeat(width)}┐\n`;
  box += `│  ${padText('📋 Follow-up Actions:', width - 4)}  │\n`;

  for (const action of followup.slice(0, 3)) {
    const text = action.FOLLOWUP_ITEM || action;
    box += `│  ${padText('□ ' + text, width - 4)}  │\n`;
  }

  box += `└${'─'.repeat(width)}┘`;
  return box;
}

// ───────────────────────────────────────────────────────────────
// EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Constants
  BOX,
  // Text utilities
  padText,
  // Decision tree helpers
  formatDecisionHeader,
  formatOptionBox,
  formatChosenBox,
  formatCaveatsBox,
  formatFollowUpBox
};
