// ───────────────────────────────────────────────────────────────────
// MODULE: CI Report Text
// ───────────────────────────────────────────────────────────────────
'use strict';

// A gh failure and a YAML parse error both state their cause on the first line and then
// print detail. The report names one line and never a multi-line blob, because a whole
// message would break the table row, the JSON field and the stderr line that carry it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. ONE LINE FROM OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

function firstLine(text) {
  return String(text || '').split('\n').map((line) => line.trim()).find(Boolean) || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  firstLine,
};
