// ───────────────────────────────────────────────────────────────────
// MODULE: Fan-Out Lineage Salvage
// ───────────────────────────────────────────────────────────────────

'use strict';

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

if (process.env.DEEP_LOOP_TSX_LOADED !== '1') {
  require('tsx/cjs');
}

const { mergeJsonlUnderLock } = require('../lib/deep-loop/jsonl-repair.ts');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const STATE_LOG_BY_LOOP_TYPE = {
  research: 'deep-research-state.jsonl',
  review: 'deep-review-state.jsonl',
};

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

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
 * Sum the provider cost an opencode JSON log reports on its step_finish rows.
 *
 * @param {string} stdout - One attempt's captured stdout.
 * @returns {number|null} USD total, or null when the log carries no cost record, so a
 *   text log or an unrecognised JSON shape reads as unknown rather than free.
 */
function sumProviderCostFromLog(stdout) {
  if (typeof stdout !== 'string') return null;
  let total = 0;
  let seen = false;
  for (const line of stdout.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }
    const cost = parsed && parsed.type === 'step_finish' && parsed.part ? parsed.part.cost : undefined;
    if (typeof cost === 'number' && Number.isFinite(cost)) {
      total += cost;
      seen = true;
    }
  }
  return seen ? total : null;
}

/**
 * A lineage's provider cost across every attempt: the live log plus each rotated one.
 *
 * @param {string} lineageDir - The lineage's artifact directory.
 * @returns {number|null} USD total, or null when any attempt's log reports no cost,
 *   since that attempt's spend cannot be told from zero.
 */
function readLineageProviderCostUsd(lineageDir) {
  const logsDir = path.join(lineageDir, 'logs');
  let names;
  try {
    names = fs.readdirSync(logsDir);
  } catch {
    return null;
  }
  let total = 0;
  let counted = 0;
  for (const name of names.filter((entry) => /^fanout-lineage(\.\d+)?\.out$/.test(entry))) {
    // This runs after every lineage has settled, so an unreadable log makes the cost
    // unknown rather than crashing the run before its summary is written.
    let text;
    try {
      text = fs.readFileSync(path.join(logsDir, name), 'utf8');
    } catch {
      return null;
    }
    if (text.trim() === '') continue;
    const cost = sumProviderCostFromLog(text);
    if (cost === null) return null;
    total += cost;
    counted += 1;
  }
  return counted > 0 ? Math.round(total * 1e6) / 1e6 : null;
}

/**
 * Roll per-lineage costs into a run total that stays null while any lineage is unknown.
 *
 * @param {Object<string, number|null>} costByLabel - Lineage label to USD cost or null.
 * @returns {{total: number|null, by_lineage: Object<string, number|null>}}
 */
function summarizeProviderCost(costByLabel) {
  const values = Object.values(costByLabel);
  const complete = values.length > 0 && values.every((value) => typeof value === 'number');
  return {
    total: complete ? Math.round(values.reduce((sum, value) => sum + value, 0) * 1e6) / 1e6 : null,
    by_lineage: costByLabel,
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

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
  if (!stateLogName) {
    // An unrecognized loop type is a caller/config bug, not a benign
    // nothing-to-salvage state -- surface it instead of returning the same
    // zero counts a legitimate no-op sweep would return.
    throw new Error(
      `fanout-salvage: unrecognized loop type "${loopType}" -- add it to STATE_LOG_BY_LOOP_TYPE instead of silently skipping salvage`,
    );
  }

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

  // savedStdout is one undifferentiated capture from a single subprocess
  // invocation, so it can only plausibly belong to one iteration -- the
  // highest-numbered gap, i.e. the one this invocation most recently
  // reached. Stamping it into every gap would make recovered files
  // indistinguishable and misattribute one iteration's content to another.
  const missingIterations = [];
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

    missingIterations.push(iterNum);
  }

  if (missingIterations.length === 0) return { salvaged: 0, failed: 0 };

  fs.mkdirSync(iterDir, { recursive: true });

  let salvaged = 0;
  let failed = 0;
  const recoveredText = extractTextFromOpencodeJson(savedStdout);
  const recoverableIteration = recoveredText ? Math.max(...missingIterations) : null;

  for (const iterNum of missingIterations) {
    const iterFile = path.join(iterDir, `iteration-${String(iterNum).padStart(3, '0')}.md`);

    if (iterNum === recoverableIteration) {
      fs.writeFileSync(iterFile, recoveredText, 'utf8');
      const eventRecord = {
        type: 'event',
        event: 'salvaged_from_stdout',
        iteration: iterNum,
        id: 'salvaged_from_stdout',
        source: 'fanout_lineage_stdout',
        bytes_recovered: recoveredText.length,
      };
      // Advisory row only: nothing reads it to make a decision.
      // A later rewrite of the projection can drop it.
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

// ───────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────────

module.exports = {
  runSalvageSweep,
  extractTextFromOpencodeJson,
  sumProviderCostFromLog,
  readLineageProviderCostUsd,
  summarizeProviderCost,
};
