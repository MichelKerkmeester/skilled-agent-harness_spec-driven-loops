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
const { readClaudeStreamFinalText } = require('./lib/cli-guards.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const STATE_LOG_BY_LOOP_TYPE = {
  research: 'deep-research-state.jsonl',
  review: 'deep-review-state.jsonl',
};

// The append gateway's ledgers; a lineage holds the one its loop type writes.
const LEDGER_DIR_NAMES = ['deep-research-ledger', 'deep-review-ledger'];
const LINEAGE_LOG_PATTERN = /^fanout-lineage(\.\d+)?\.out$/;
// A pass ends at the gateway commit of its iteration row; the run's first commit
// opens the first pass.
const PASS_COMMIT_STEM_PATTERN = /\.iteration_(?:completed|recorded|error)$/;
const RUN_START_STEM_PATTERN = /\.run_initialized$/;
// A pass committed this soon after the previous one, with no tool call between them,
// is a batched record rather than a pass. Real passes ran no shorter than 33 s.
const BATCHED_COMMIT_GAP_MS = 15_000;
const READ_TOOL_NAMES = new Set(['read', 'grep', 'glob', 'list', 'ls', 'webfetch', 'websearch', 'codesearch']);
const SHELL_TOOL_NAMES = new Set(['bash', 'shell']);
// A shell call counts as a source read when one of its commands prints or searches files.
const SHELL_READ_COMMAND_PATTERN = /(?:^|[;&|(]\s*)(?:cat|sed|head|tail|rg|grep|nl|awk|less|find|ls|wc|jq|git\s+(?:show|log|diff|grep|blame))\b/;

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

  const claudeText = readClaudeStreamFinalText(stdout);
  if (claudeText !== null) {
    const answer = claudeText.trim();
    return answer.length > 50 ? answer.slice(0, 50_000) : null;
  }

  const raw = stdout.trim();
  return raw.length > 50 ? raw.slice(0, 50_000) : null;
}

/**
 * Read the provider cost one attempt's log reports: the sum of an opencode JSON log's
 * step_finish costs, or the last result event's total of a claude stream-json log.
 * Claude's total is cumulative over its session and one attempt is one session, so
 * the last result is the attempt's whole spend and summing them would count it twice.
 *
 * @param {string} stdout - One attempt's captured stdout.
 * @returns {number|null} USD total, or null when the log carries no cost record, so a
 *   text log or an unrecognised JSON shape reads as unknown rather than free.
 */
function sumProviderCostFromLog(stdout) {
  if (typeof stdout !== 'string') return null;
  let total = 0;
  let seen = false;
  let lastResultCost = null;
  for (const line of stdout.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (parsed && parsed.type === 'result' && typeof parsed.total_cost_usd === 'number'
      && Number.isFinite(parsed.total_cost_usd)) {
      lastResultCost = parsed.total_cost_usd;
      continue;
    }
    const cost = parsed && parsed.type === 'step_finish' && parsed.part ? parsed.part.cost : undefined;
    if (typeof cost === 'number' && Number.isFinite(cost)) {
      total += cost;
      seen = true;
    }
  }
  if (seen) return total;
  return lastResultCost;
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

function toEpochMs(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Read the timed tool calls a lineage log records.
 *
 * Opencode JSON events carry an epoch-ms timestamp, and claude stream-json assistant
 * events carry an ISO one. A log with neither, such as plain text, cannot place a
 * call in a pass, so it yields null rather than an empty list that would read as zero.
 *
 * @param {string} log - One or more attempts' captured stdout.
 * @returns {Array<{atMs:number, tool:string, input:Object}>|null} Calls, or null when
 *   the log holds no timed event.
 */
function readTimedToolEvents(log) {
  if (typeof log !== 'string') return null;
  let timed = false;
  const events = [];
  for (const line of log.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{')) continue;
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== 'object') continue;
    if (typeof parsed.timestamp === 'number' && parsed.part && typeof parsed.part === 'object') {
      timed = true;
      if (parsed.type !== 'tool_use') continue;
      const state = parsed.part.state || {};
      // The start time places the call in the pass it served; the event itself is
      // emitted once the call returns, which can fall after that pass's commit.
      const startMs = state.time && typeof state.time.start === 'number' ? state.time.start : parsed.timestamp;
      events.push({ atMs: startMs, tool: String(parsed.part.tool || ''), input: state.input || {} });
      continue;
    }
    if (typeof parsed.session_id !== 'string' || (parsed.type !== 'assistant' && parsed.type !== 'user')) continue;
    const atMs = toEpochMs(parsed.timestamp);
    if (atMs === null) continue;
    timed = true;
    if (parsed.type !== 'assistant' || !parsed.message || !Array.isArray(parsed.message.content)) continue;
    for (const block of parsed.message.content) {
      if (block && block.type === 'tool_use') {
        events.push({ atMs, tool: String(block.name || ''), input: block.input || {} });
      }
    }
  }
  return timed ? events : null;
}

function isSourceRead(event) {
  const tool = event.tool.toLowerCase();
  if (READ_TOOL_NAMES.has(tool)) return true;
  if (!SHELL_TOOL_NAMES.has(tool)) return false;
  const command = event.input && typeof event.input.command === 'string' ? event.input.command : '';
  return SHELL_READ_COMMAND_PATTERN.test(command.trim());
}

/**
 * Judge each committed pass from the runner's own log instead of the model's record.
 *
 * A pass is the tool calls between the previous gateway commit and its own. It is
 * `unexamined` when it read no source and recorded no finding, when it committed under
 * 15 s after the previous commit with no call between, or when its model stamp is later
 * than the gateway commit, which no honest writer can produce. Counts the log cannot
 * give stay null, and a pass no rule flags reads as unknown, not clean, while they do.
 *
 * @param {string} log - The lineage's captured stdout across attempts.
 * @param {Array<{iteration:number|null, committedAt:string|number, stampedAt?:string|number|null,
 *   findings?:number|null}>} commits - Gateway commits; a null iteration only opens a window.
 * @returns {Array<{iteration:number, toolCalls:number|null, sourceReads:number|null,
 *   commitGapMs:number|null, skewMs:number|null, findings:number|null,
 *   unexamined:boolean|null, reasons:string[]}>} One row per committed pass.
 */
function passEvidence(log, commits) {
  const events = readTimedToolEvents(log);
  const ordered = (Array.isArray(commits) ? commits : [])
    .map((commit) => ({
      ...commit,
      committedMs: toEpochMs(commit.committedAt),
      stampedMs: toEpochMs(commit.stampedAt),
    }))
    .filter((commit) => commit.committedMs !== null)
    .sort((left, right) => left.committedMs - right.committedMs);

  const passes = [];
  let windowStartMs = null;
  for (const commit of ordered) {
    const startMs = windowStartMs;
    windowStartMs = commit.committedMs;
    if (!Number.isInteger(commit.iteration)) continue;

    let toolCalls = null;
    let sourceReads = null;
    if (events !== null) {
      const inPass = events.filter((event) => (startMs === null || event.atMs > startMs)
        && event.atMs <= commit.committedMs);
      toolCalls = inPass.length;
      sourceReads = inPass.filter(isSourceRead).length;
    }
    const commitGapMs = startMs === null ? null : commit.committedMs - startMs;
    const skewMs = commit.stampedMs === null ? null : commit.stampedMs - commit.committedMs;
    const findings = Number.isInteger(commit.findings) ? commit.findings : null;

    const reasons = [];
    if (skewMs !== null && skewMs > 0) reasons.push('future_stamp');
    if (sourceReads === 0 && findings === 0) reasons.push('no_reads_no_findings');
    if (commitGapMs !== null && commitGapMs < BATCHED_COMMIT_GAP_MS && toolCalls === 0) reasons.push('batched_commit');
    const undecided = toolCalls === null || (sourceReads === 0 && findings === null);
    let unexamined = false;
    if (reasons.length > 0) unexamined = true;
    else if (undecided) unexamined = null;

    passes.push({
      iteration: commit.iteration,
      toolCalls,
      sourceReads,
      commitGapMs,
      skewMs,
      findings,
      unexamined,
      reasons,
    });
  }
  return passes;
}

/**
 * Read a lineage's gateway commits from its ledger frames: the run start, and each
 * iteration row with its model stamp and findings count.
 *
 * @param {string} lineageDir - The lineage's artifact directory.
 * @returns {Array<{iteration:number|null, committedAt:string, stampedAt:string|null,
 *   findings:number|null}>} Commits in ledger order, empty when no ledger exists.
 */
function readLineageCommits(lineageDir) {
  for (const ledgerName of LEDGER_DIR_NAMES) {
    const framesDir = path.join(lineageDir, ledgerName, 'frames');
    let names;
    try {
      names = fs.readdirSync(framesDir);
    } catch {
      continue;
    }
    const commits = [];
    for (const name of names.filter((entry) => entry.endsWith('.frame')).sort()) {
      let frame;
      let event;
      try {
        frame = JSON.parse(fs.readFileSync(path.join(framesDir, name), 'utf8'));
        event = JSON.parse(Buffer.from(frame.canonical_event_bytes, 'base64').toString('utf8'));
      } catch {
        // A torn frame is the gateway's to repair; the pass it held is simply not judged.
        continue;
      }
      const committedAt = frame && frame.receipt ? frame.receipt.committed_at : undefined;
      const payload = event && event.payload ? event.payload : {};
      const stem = typeof payload.stem === 'string' ? payload.stem : '';
      if (typeof committedAt !== 'string') continue;
      if (RUN_START_STEM_PATTERN.test(stem)) {
        commits.push({ iteration: null, committedAt, stampedAt: null, findings: null });
        continue;
      }
      if (!PASS_COMMIT_STEM_PATTERN.test(stem)) continue;
      // A review frame wraps the model's row in `record`; a research frame is the row.
      const data = payload.data || {};
      const row = data.record && typeof data.record === 'object' ? data.record : data;
      const iteration = payload.scope && Number.isInteger(payload.scope.iteration)
        ? payload.scope.iteration
        : (Number.isInteger(row.iteration) ? row.iteration : null);
      if (iteration === null) continue;
      // The row's own stamp is the model's claim. A research row without one takes the
      // event time, which then holds the model's stamp or, absent one, the gateway's.
      let stampedAt = null;
      if (typeof row.timestamp === 'string') stampedAt = row.timestamp;
      else if (typeof event.occurred_at === 'string') stampedAt = event.occurred_at;
      commits.push({
        iteration,
        committedAt,
        stampedAt,
        findings: Number.isInteger(row.findingsCount) ? row.findingsCount : null,
      });
    }
    return commits;
  }
  return [];
}

/**
 * Summarize a lineage's committed passes for its progress row.
 *
 * @param {string} lineageDir - The lineage's artifact directory.
 * @param {string} [liveLog] - The running attempt's stdout so far, which reaches
 *   disk only once the attempt exits.
 * @returns {{iterations:number, lastCommitAt:string|null, flaggedPasses:number|null}}
 *   `flaggedPasses` is null while any pass cannot be judged.
 */
function readLineagePassSummary(lineageDir, liveLog = '') {
  const logs = [];
  try {
    const logsDir = path.join(lineageDir, 'logs');
    for (const name of fs.readdirSync(logsDir).filter((entry) => LINEAGE_LOG_PATTERN.test(entry))) {
      logs.push(fs.readFileSync(path.join(logsDir, name), 'utf8'));
    }
  } catch {
    // No log on disk yet: the live stdout, if any, is all there is to judge.
  }
  if (typeof liveLog === 'string' && liveLog !== '') logs.push(liveLog);

  // One untimed attempt, such as a plain-text log from before the switch to stream-json,
  // leaves its passes with no calls to count; judging the joined logs would read them as zero.
  const untimed = logs.some((text) => text.trim() !== '' && readTimedToolEvents(text) === null);
  const commits = readLineageCommits(lineageDir);
  const passes = passEvidence(untimed ? '' : logs.join('\n'), commits);
  const passCommits = commits.filter((commit) => commit.iteration !== null);
  return {
    iterations: new Set(passCommits.map((commit) => commit.iteration)).size,
    lastCommitAt: passCommits.length > 0 ? passCommits[passCommits.length - 1].committedAt : null,
    flaggedPasses: passes.some((pass) => pass.unexamined === null)
      ? null
      : passes.filter((pass) => pass.unexamined === true).length,
  };
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
  passEvidence,
  readLineageCommits,
  readLineagePassSummary,
};
