// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime — Fan-Out Lineage Salvage                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Recovers missing iteration files from captured subprocess stdout when    ║
// ║ a CLI executor fails to write outputs (sandbox write restrictions, etc). ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const fs = require('node:fs');
const path = require('node:path');

if (process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  require('tsx/cjs');
}

const { mergeJsonlUnderLock } = require('../lib/deep-loop/jsonl-repair.ts');

const STATE_LOG_BY_LOOP_TYPE = {
  research: 'deep-research-state.jsonl',
  review: 'deep-review-state.jsonl',
};

/**
 * Parse opencode --format json text parts from subprocess stdout.
 * Opencode emits JSONL lines of {type:"text",part:{text:"..."}}.
 * Concatenates all text parts; falls back to raw stdout for other executors.
 *
 * @param {string|null} stdout - Combined subprocess stdout.
 * @returns {string|null} Recovered text, or null if nothing substantive.
 */
function extractTextFromOpencodeJson(stdout) {
  if (!stdout || typeof stdout !== 'string') return null;

  const textParts = [];
  for (const line of stdout.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (
        parsed &&
        parsed.type === 'text' &&
        parsed.part &&
        typeof parsed.part.text === 'string'
      ) {
        textParts.push(parsed.part.text);
      }
    } catch {
      // non-JSON line — skip
    }
  }

  if (textParts.length > 0) return textParts.join('').slice(0, 50_000);

  const raw = stdout.trim();
  return raw.length > 50 ? raw.slice(0, 50_000) : null;
}

/**
 * After a lineage subprocess exits, recover any missing or empty iteration
 * files from the saved stdout (write-failure salvage path).
 *
 * For each iteration recorded in the state log that lacks its .md file:
 *   - If recoverable text is available: write it and append a
 *     salvaged_from_stdout event to the state log.
 *   - Otherwise: write a failed-marker placeholder so downstream steps
 *     see a file and can apply their own stuck-recovery logic.
 *
 * @param {string} lineageDir - Absolute path to the lineage artifact dir.
 * @param {'research'|'review'} loopType - Loop type for state log naming.
 * @param {string} savedStdout - Captured subprocess stdout.
 * @returns {{ salvaged: number, failed: number }}
 */
function runSalvageSweep(lineageDir, loopType, savedStdout) {
  const stateLogName = STATE_LOG_BY_LOOP_TYPE[loopType];
  if (!stateLogName) return { salvaged: 0, failed: 0 };

  const stateLogPath = path.join(lineageDir, stateLogName);
  const iterDir = path.join(lineageDir, 'iterations');

  if (!fs.existsSync(stateLogPath)) return { salvaged: 0, failed: 0 };

  // Discover which iterations completed by scanning the state log.
  const iterationNumbers = new Set();
  let stateContent;
  try {
    stateContent = fs.readFileSync(stateLogPath, 'utf8');
  } catch {
    return { salvaged: 0, failed: 0 };
  }

  for (const line of stateContent.trim().split('\n')) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      if (record && record.type === 'iteration' && typeof record.iteration === 'number') {
        iterationNumbers.add(record.iteration);
      }
    } catch {
      // malformed JSONL — skip
    }
  }

  if (iterationNumbers.size === 0) return { salvaged: 0, failed: 0 };

  let salvaged = 0;
  let failed = 0;
  const recoveredText = extractTextFromOpencodeJson(savedStdout);

  for (const iterNum of iterationNumbers) {
    const iterFile = path.join(iterDir, `iteration-${String(iterNum).padStart(3, '0')}.md`);

    // Skip iterations that already have a non-empty file.
    if (fs.existsSync(iterFile)) {
      try {
        if (fs.statSync(iterFile).size > 0) continue;
      } catch {
        // stat failed — treat as missing
      }
    }

    fs.mkdirSync(iterDir, { recursive: true });

    if (recoveredText) {
      fs.writeFileSync(iterFile, recoveredText, 'utf8');
      const eventRecord = {
        type: 'event',
        event: 'salvaged_from_stdout',
        iteration: iterNum,
        id: 'salvaged_from_stdout',
        source: 'fanout_lineage_stdout',
        bytes_recovered: recoveredText.length,
      };
      mergeJsonlUnderLock(stateLogPath, [eventRecord]);
      salvaged += 1;
    } else {
      fs.writeFileSync(
        iterFile,
        `<!-- fanout_salvage_failed: iteration ${iterNum} content not recoverable from subprocess stdout -->\n`,
        'utf8',
      );
      failed += 1;
    }
  }

  return { salvaged, failed };
}

module.exports = { runSalvageSweep, extractTextFromOpencodeJson };
