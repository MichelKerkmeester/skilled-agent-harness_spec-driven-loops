#!/usr/bin/env node
'use strict';

// Deterministic append of one JSONL state record read from stdin.
//
// The deep-loop state logs (deep-review-state.jsonl, deep-alignment-state.jsonl,
// ...) accumulate multi-KB single-line iteration records. When an orchestrator
// fulfils an `append_jsonl` step with an edit/patch tool, the patch must
// context-match the preceding giant line and reliably fails, halting the loop.
// Piping the record to this helper appends it with a plain filesystem write, so
// the append never routes through a context-matched patch.
//
// Usage:  <producer> | node append-state-record.cjs <state-log-path>
// The record is read whole from stdin, validated as JSON, normalised to a single
// line, and appended with a trailing newline. Invalid JSON is rejected (a guard
// against a malformed interpolation) rather than silently corrupting the log.

const fs = require('fs');

function main() {
  const target = process.argv[2];
  if (!target) {
    process.stderr.write('usage: append-state-record.cjs <state-log-path> (record on stdin)\n');
    process.exit(2);
  }

  let buf = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => { buf += chunk; });
  process.stdin.on('end', () => {
    const record = buf.trim();
    if (!record) {
      process.stderr.write('append-state-record: empty record on stdin; nothing appended\n');
      process.exit(1);
    }
    let parsed;
    try {
      parsed = JSON.parse(record);
    } catch (err) {
      process.stderr.write(`append-state-record: record is not valid JSON (${err.message}); refusing to append\n`);
      process.exit(1);
    }
    // Re-serialise to a guaranteed single line (collapses any incidental newlines
    // from a heredoc without touching string contents).
    const line = JSON.stringify(parsed);
    fs.appendFileSync(target, `${line}\n`);
    process.stdout.write(`appended ${line.length} bytes to ${target}\n`);
  });
}

main();
