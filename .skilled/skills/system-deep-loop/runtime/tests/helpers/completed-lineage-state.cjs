// ───────────────────────────────────────────────────────────────────
// MODULE: Completed Lineage State Fixture
// ───────────────────────────────────────────────────────────────────
//
// The fan-out runner fulfils a lineage only when its state log holds an iteration and,
// after it, the loop's terminal stop row, all stamped inside the lineage's own run. A stub
// executor that stands in for a lineage which finished therefore records that shape. The
// rows are written straight to the state log beside one ledger frame, the minimum the
// runner's unledgered-state check accepts; a stub that already recorded rows through the
// gateway keeps them and gains only the terminal row.
//
// Usable from a stub written as a Node script (require it) or as a shell script
// (`node completed-lineage-state.cjs <lineageDir> [research|review ...]`).

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const LOOP_FILES = {
  research: { stateLog: 'deep-research-state.jsonl', ledger: 'deep-research-ledger', terminal: 'synthesis_complete' },
  review: { stateLog: 'deep-review-state.jsonl', ledger: 'deep-review-ledger', terminal: 'terminal_gates' },
};

function appendRows(filePath, rows) {
  fs.appendFileSync(filePath, rows.map((row) => `${JSON.stringify(row)}\n`).join(''), 'utf8');
}

function writeCompletedLineageState(lineageDir, loopTypes = ['research', 'review']) {
  for (const loopType of loopTypes) {
    const files = LOOP_FILES[loopType];
    if (!files) throw new Error(`unknown loop type ${loopType}`);
    fs.mkdirSync(lineageDir, { recursive: true });
    const statePath = path.join(lineageDir, files.stateLog);
    if (!fs.existsSync(statePath) || fs.statSync(statePath).size === 0) {
      appendRows(statePath, [
        { type: 'config', timestamp: new Date().toISOString() },
        { type: 'iteration', iteration: 1, run: 1, status: 'complete', timestamp: new Date().toISOString() },
      ]);
      // The salvage sweep fails a recorded iteration whose markdown is missing.
      const iterationsDir = path.join(lineageDir, 'iterations');
      fs.mkdirSync(iterationsDir, { recursive: true });
      const iterationPath = path.join(iterationsDir, 'iteration-001.md');
      if (!fs.existsSync(iterationPath)) fs.writeFileSync(iterationPath, '# Iteration 1\n', 'utf8');
    }
    appendRows(statePath, [
      { type: 'event', event: files.terminal, stopReason: 'converged', timestamp: new Date().toISOString() },
    ]);
    const framesDir = path.join(lineageDir, files.ledger, 'frames');
    fs.mkdirSync(framesDir, { recursive: true });
    if (!fs.readdirSync(framesDir).some((name) => name.endsWith('.frame'))) {
      fs.writeFileSync(path.join(framesDir, 'stub.frame'), '', 'utf8');
    }
  }
}

if (require.main === module) {
  const [lineageDir, ...loopTypes] = process.argv.slice(2);
  if (!lineageDir) {
    process.stderr.write('Usage: node completed-lineage-state.cjs <lineageDir> [research|review ...]\n');
    process.exit(2);
  }
  writeCompletedLineageState(lineageDir, loopTypes.length > 0 ? loopTypes : undefined);
}

module.exports = { writeCompletedLineageState };
