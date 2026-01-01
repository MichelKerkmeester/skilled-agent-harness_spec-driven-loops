// ───────────────────────────────────────────────────────────────
// LIB: ASCII BOX FORMATTING
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. BOX DRAWING CHARACTERS
──────────────────────────────────────────────────────────────── */

const BOX = {
  ROUND_TOP_LEFT: '╭', ROUND_TOP_RIGHT: '╮',
  ROUND_BOTTOM_LEFT: '╰', ROUND_BOTTOM_RIGHT: '╯',
  TOP_LEFT: '┌', TOP_RIGHT: '┐',
  BOTTOM_LEFT: '└', BOTTOM_RIGHT: '┘',
  HORIZONTAL: '─', VERTICAL: '│',
  ARROW_DOWN: '▼', ARROW_RIGHT: '▶',
  CHECK: '✓', CROSS: '✗', CHECKBOX: '□', BULLET: '•',
  CHOSEN: '✅', WARNING: '⚠️', CLIPBOARD: '📋',
};

/* ─────────────────────────────────────────────────────────────
   2. TEXT UTILITIES
──────────────────────────────────────────────────────────────── */

function pad_text(text, width, align = 'left') {
  const cleaned = text.substring(0, width);
  if (align === 'center') {
    const padding = Math.max(0, width - cleaned.length);
    const left_pad = Math.floor(padding / 2);
    return ' '.repeat(left_pad) + cleaned + ' '.repeat(padding - left_pad);
  }
  return cleaned.padEnd(width);
}

/* ─────────────────────────────────────────────────────────────
   3. DECISION TREE VISUALIZATION HELPERS
──────────────────────────────────────────────────────────────── */

function format_decision_header(title, context, confidence, timestamp) {
  const width = 48;
  const inner_width = width - 4;
  const date = new Date(timestamp);
  const time_str = date.toISOString().split('T')[1].substring(0, 8);
  const date_str = date.toISOString().split('T')[0];

  const max_context_width = inner_width - 9;
  const context_snippet = context ? context.substring(0, max_context_width - 3) + (context.length > max_context_width - 3 ? '...' : '') : '';

  return `╭${'─'.repeat(width)}╮
│  DECISION: ${pad_text(title, inner_width - 10)}  │
│  Context: ${pad_text(context_snippet, inner_width - 9)}  │
│  Confidence: ${confidence}% | ${date_str} @ ${time_str}${' '.repeat(Math.max(0, inner_width - 37 - confidence.toString().length))}  │
╰${'─'.repeat(width)}╯`;
}

function format_option_box(option, is_chosen, max_width = 20) {
  let box = `┌${'─'.repeat(max_width)}┐\n`;
  box += `│  ${pad_text(option.LABEL || 'Option', max_width - 4)}  │\n`;

  if (option.PROS && option.PROS.length > 0) {
    for (const pro of option.PROS.slice(0, 2)) {
      box += `│  ✓ ${pad_text(pro.PRO || pro, max_width - 6)}  │\n`;
    }
  }

  if (option.CONS && option.CONS.length > 0) {
    for (const con of option.CONS.slice(0, 2)) {
      box += `│  ✗ ${pad_text(con.CON || con, max_width - 6)}  │\n`;
    }
  }

  box += `└${'─'.repeat(max_width)}┘`;
  return box;
}

function format_chosen_box(chosen, rationale, evidence) {
  const width = 40;
  let box = `┌${'─'.repeat(width)}┐\n`;
  box += `│  ${pad_text('✅ CHOSEN: ' + chosen, width - 4)}  │\n`;
  box += `│  ${pad_text('', width - 4)}  │\n`;

  if (rationale) {
    box += `│  ${pad_text('Rationale:', width - 4)}  │\n`;
    const words = rationale.substring(0, 100).split(' ');
    let line = '';

    for (const word of words) {
      if ((line + ' ' + word).length > width - 4) {
        box += `│  ${pad_text(line, width - 4)}  │\n`;
        line = word;
      } else {
        line += (line ? ' ' : '') + word;
      }
    }
    if (line) {
      box += `│  ${pad_text(line, width - 4)}  │\n`;
    }
  }

  if (evidence && evidence.length > 0) {
    box += `│  ${pad_text('', width - 4)}  │\n`;
    box += `│  ${pad_text('Evidence:', width - 4)}  │\n`;
    for (const ev of evidence.slice(0, 3)) {
      box += `│  ${pad_text('• ' + (ev.EVIDENCE_ITEM || ev), width - 4)}  │\n`;
    }
  }

  box += `└${'─'.repeat(width)}┘`;
  return box;
}

function format_caveats_box(caveats) {
  if (!caveats || caveats.length === 0) return '';

  const width = 40;
  let box = `┌${'─'.repeat(width)}┐\n`;
  box += `│  ${pad_text('⚠️  Caveats:', width - 4)}  │\n`;

  for (const caveat of caveats.slice(0, 3)) {
    box += `│  ${pad_text('• ' + (caveat.CAVEAT_ITEM || caveat), width - 4)}  │\n`;
  }

  box += `└${'─'.repeat(width)}┘`;
  return box;
}

function format_follow_up_box(followup) {
  if (!followup || followup.length === 0) return '';

  const width = 40;
  let box = `┌${'─'.repeat(width)}┐\n`;
  box += `│  ${pad_text('📋 Follow-up Actions:', width - 4)}  │\n`;

  for (const action of followup.slice(0, 3)) {
    box += `│  ${pad_text('□ ' + (action.FOLLOWUP_ITEM || action), width - 4)}  │\n`;
  }

  box += `└${'─'.repeat(width)}┘`;
  return box;
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  BOX,
  pad_text,
  format_decision_header,
  format_option_box,
  format_chosen_box,
  format_caveats_box,
  format_follow_up_box,
};
