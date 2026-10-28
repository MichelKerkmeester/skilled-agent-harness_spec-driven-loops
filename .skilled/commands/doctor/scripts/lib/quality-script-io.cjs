// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Doctor Script Contract
// ───────────────────────────────────────────────────────────────────
'use strict';

// The two ways this script answers whoever started it: the typed request failure that
// carries the exit code and the STATUS= error code a route reads, and the single place
// its report reaches stdout.
//
// WHY THIS IS SHARED: every mode may refuse through the error and every mode prints
// through emit, so both live beside the modes instead of in the entry point they are
// split out of. A route reads one last line whatever the mode, which is only true
// while one function writes it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. REQUEST ERROR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A refusal the caller can act on: which code it carries, which exit status it leaves
 * and, for init, which MODE= the STATUS line names.
 */
class RequestError extends Error {
  constructor(message, { code = 'USAGE', exit = 2, mode = null } = {}) {
    super(message);
    this.code = code;
    this.exit = exit;
    this.mode = mode;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. OUTPUT
// ─────────────────────────────────────────────────────────────────────────────

// --json prints one document before the STATUS line, and the text mode prints the
// lines it built. Either way the STATUS line is last, so a reader that takes the last
// line never has to know which mode ran.
function emit(opts, payload, lines, status) {
  if (opts.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  else process.stdout.write(lines.map((line) => `${line}\n`).join(''));
  process.stdout.write(`${status}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { RequestError, emit };
