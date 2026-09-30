// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: build-verifier-fixture CLI                                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Builds the verifier fixture from Pi session logs and from       ║
// ║          Claude transcripts the operator names: one JSONL row per nudge  ║
// ║          or native goal_status record, with the turn text behind it.     ║
// ║          Pi rows are sampled round-robin across reason categories. Every ║
// ║          label stays empty, and the builder never overwrites its output. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { createHash } = require('node:crypto');
const { existsSync, readdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const core = require('./goal-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NUDGE_CUSTOM_TYPE = 'goal-verify-nudge';
const NUDGE_PATTERN = /^\[goal_verify\] verdict=([^;]*); reason=([\s\S]*)$/;
const DEFAULT_LIMIT = 50;
const REASON_CATEGORIES = new Map([
  ['Evidence is too short to prove completion', 'too_short'],
  ['Evidence includes blocking or incomplete-work language', 'blocking'],
  ['Evidence appears truncated before it proves completion', 'truncated'],
  ['Evidence lacks an explicit completion signal', 'no_completion'],
  ['Evidence does not reference the goal objective specifically enough', 'weak_link'],
]);
// Category order fixes the round-robin deal and the pick order, so the same
// logs always yield the same rows.
const ORDER = ['too_short', 'blocking', 'truncated', 'no_completion', 'weak_link', 'other'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. RECORD HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Flatten a content value to text: a string as is, text parts joined by newline. */
function textOf(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .filter((item) => item !== null && typeof item === 'object' && item.type === 'text')
      .map((item) => String(item.text))
      .join('\n');
  }
  return '';
}

/**
 * Read the objective out of an injected active-goal block, or null when the
 * text carries none.
 *
 * @param {string} text - Record text to scan.
 * @returns {string|null} The objective line's value, or null.
 */
function objectiveFrom(text) {
  if (!text.includes('[active_goal:')) return null;
  const match = text.slice(text.lastIndexOf('[active_goal:')).match(/\nobjective: ([^\n]*)/);
  return match ? match[1] : null;
}

/** Map a recorded nudge reason to its sampling category. */
function category(reason) {
  return REASON_CATEGORIES.get(reason) || 'other';
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PI SESSION COLLECTION
// ─────────────────────────────────────────────────────────────────────────────

function collectJsonlPaths(baseDir) {
  const found = [];
  const pending = [''];
  while (pending.length > 0) {
    const relativeDir = pending.pop();
    const absolute = relativeDir === '' ? baseDir : join(baseDir, relativeDir);
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const childRelative = relativeDir === '' ? entry.name : `${relativeDir}/${entry.name}`;
      if (entry.isDirectory()) pending.push(childRelative);
      else if (entry.isFile() && entry.name.endsWith('.jsonl')) found.push(childRelative);
    }
  }
  // Sort once here so every run walks the same files in the same order.
  found.sort();
  return found;
}

/**
 * Walk a Pi session directory and collect one candidate per recorded
 * goal-verify nudge, keeping the objective and the turn evidence behind it.
 *
 * @param {string} dir - Directory holding Pi session `.jsonl` files.
 * @returns {{ candidates: Array<Object>, skippedNoTurn: number, skippedNoObjective: number }}
 *   Candidates in file and line order, plus the nudges that could not be used.
 */
function collectPiCandidates(dir) {
  const candidates = [];
  let skippedNoTurn = 0;
  let skippedNoObjective = 0;
  for (const relativePath of collectJsonlPaths(dir)) {
    let objective = null;
    let turnText = null;
    let toolTexts = [];
    const lines = readFileSync(join(dir, relativePath), 'utf8').split('\n');
    for (let index = 0; index < lines.length; index += 1) {
      const raw = lines[index];
      if (raw.trim() === '') continue;
      let record;
      try {
        record = JSON.parse(raw);
      } catch {
        continue;
      }
      const type = record !== null && typeof record === 'object' ? record.type : undefined;
      if (type === 'message') {
        const text = textOf(record.message?.content);
        const found = objectiveFrom(text);
        if (found !== null) objective = found;
        const role = record.message?.role;
        if (role === 'assistant') {
          turnText = text;
          toolTexts = [];
        } else if (role === 'toolResult') {
          toolTexts.push(text);
        }
      } else if (type === 'custom_message') {
        const text = textOf(record.content);
        const found = objectiveFrom(text);
        if (found !== null) objective = found;
        if (record.customType !== NUDGE_CUSTOM_TYPE) continue;
        const match = text.match(NUDGE_PATTERN);
        const rawText = [turnText, toolTexts.filter(Boolean).join('\n')]
          .filter(Boolean)
          .join('\n');
        if (turnText === null || rawText === '') {
          skippedNoTurn += 1;
        } else if (objective === null) {
          skippedNoObjective += 1;
        } else {
          candidates.push({
            source: 'pi',
            key: `${relativePath}:${index + 1}`,
            objective,
            rawText,
            recordedVerdict: match ? match[1] : '',
            recordedReason: match ? match[2] : '',
          });
        }
        turnText = null;
        toolTexts = [];
      }
    }
  }
  return { candidates, skippedNoTurn, skippedNoObjective };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLAUDE TRANSCRIPT COLLECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Walk a Claude transcript directory and collect one candidate per native
 * goal_status record, keeping the turn text that stands behind it. Lines the
 * parser rejects are skipped. A record with no turn text behind it or no
 * usable condition is counted as skipped.
 *
 * @param {string} dir - Directory holding Claude transcript `.jsonl` files.
 * @returns {{ candidates: Array<Object>, skipped: number }}
 *   Candidates in file and line order, plus the records that could not be used.
 */
function collectClaudeCandidates(dir) {
  const candidates = [];
  let skipped = 0;
  for (const relativePath of collectJsonlPaths(dir)) {
    let turnText = null;
    const lines = readFileSync(join(dir, relativePath), 'utf8').split('\n');
    for (let index = 0; index < lines.length; index += 1) {
      const raw = lines[index];
      if (raw.trim() === '') continue;
      let record;
      try {
        record = JSON.parse(raw);
      } catch {
        continue;
      }
      const type = record !== null && typeof record === 'object' ? record.type : undefined;
      if (type === 'assistant') {
        const text = textOf(record.message?.content);
        if (text !== '') turnText = text;
      } else if (type === 'attachment' && record.attachment?.type === 'goal_status') {
        const condition = String(record.attachment.condition ?? '');
        if (turnText === null || condition.trim() === '') {
          skipped += 1;
        } else {
          candidates.push({
            source: 'claude',
            key: `${relativePath}:${index + 1}`,
            objective: condition,
            rawText: turnText,
            // The native judge is a model, so its verdict is kept as prelabel
            // and never written to label.
            prelabel: record.attachment.met === true ? 'met' : 'not_met',
          });
        }
        turnText = null;
      }
    }
  }
  return { candidates, skipped };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ROW SELECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick up to `limit` candidates, dealing the quota round-robin across reason
 * categories and sampling evenly inside each one, so a quota keeps every
 * reason represented instead of favouring whichever file came first.
 *
 * @param {Array<Object>} candidates - Candidate records from the session walk.
 * @param {number} limit - Maximum number of picks.
 * @returns {Array<Object>} The picked candidates, grouped in category order.
 */
function selectRows(candidates, limit) {
  const quota = Math.min(candidates.length, limit);
  const groups = new Map();
  for (const candidate of candidates) {
    const key = category(candidate.recordedReason);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(candidate);
  }
  const slots = new Map();
  let dealt = 0;
  while (dealt < quota) {
    let dealtThisRound = false;
    for (const key of ORDER) {
      if (dealt >= quota) break;
      const group = groups.get(key);
      if (!group || (slots.get(key) || 0) >= group.length) continue;
      slots.set(key, (slots.get(key) || 0) + 1);
      dealt += 1;
      dealtThisRound = true;
    }
    if (!dealtThisRound) break;
  }
  const picks = [];
  for (const key of ORDER) {
    const group = groups.get(key);
    const count = slots.get(key) || 0;
    if (!group || count === 0) continue;
    for (let index = 0; index < count; index += 1) {
      picks.push(group[Math.floor((index * group.length) / count)]);
    }
  }
  return picks;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. ROW BUILDING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build fixture rows from Pi session logs, Claude transcripts, or both.
 * Claude rows lead, then Pi rows fill the rest of the limit.
 *
 * @param {Object} options - Build options.
 * @param {string} [options.piDir] - Directory holding Pi session `.jsonl` files.
 * @param {string} [options.claudeDir] - Directory holding Claude transcript `.jsonl` files.
 * @param {number} options.limit - Maximum number of rows.
 * @returns {{ rows: Array<Object>, stats: Object }} Rows plus the walk counters.
 */
function buildRows({ piDir, claudeDir, limit }) {
  const piCollected = piDir
    ? collectPiCandidates(piDir)
    : { candidates: [], skippedNoTurn: 0, skippedNoObjective: 0 };
  const claudeCollected = claudeDir
    ? collectClaudeCandidates(claudeDir)
    : { candidates: [], skipped: 0 };
  const piCount = piCollected.candidates.length;
  const claudeCount = claudeCollected.candidates.length;
  // Claude rows lead, so they get the floor first: half the limit whenever Pi
  // candidates exist to fill the other half, the whole limit otherwise. Then
  // any limit the Pi side cannot use falls back to Claude.
  let claudeQuota = piCount > 0
    ? Math.min(claudeCount, Math.floor(limit / 2))
    : Math.min(claudeCount, limit);
  const piQuota = Math.min(piCount, limit - claudeQuota);
  claudeQuota = Math.min(claudeCount, limit - piQuota);
  const claudeRows = [];
  for (let index = 0; index < claudeQuota; index += 1) {
    const candidate = claudeCollected.candidates[Math.floor((index * claudeCount) / claudeQuota)];
    claudeRows.push({
      id: `claude-${createHash('sha256').update(candidate.key, 'utf8').digest('hex').slice(0, 12)}`,
      source: candidate.source,
      objective: candidate.objective,
      raw_text: candidate.rawText,
      ingested_text: core.redactEvidence(candidate.rawText),
      raw_length: candidate.rawText.length,
      heuristic_recorded: '',
      recorded_reason: '',
      prelabel: candidate.prelabel,
      label: '',
    });
  }
  const piRows = selectRows(piCollected.candidates, piQuota).map((candidate) => ({
    id: `pi-${createHash('sha256').update(candidate.key, 'utf8').digest('hex').slice(0, 12)}`,
    source: candidate.source,
    objective: candidate.objective,
    raw_text: candidate.rawText,
    ingested_text: core.redactEvidence(candidate.rawText),
    raw_length: candidate.rawText.length,
    heuristic_recorded: candidate.recordedVerdict,
    recorded_reason: candidate.recordedReason,
    prelabel: '',
    label: '',
  }));
  // A row reproduces when the current heuristic would record the same verdict
  // and reason for the evidence that produced the original nudge.
  const reproducedPi = piRows.filter((row) => {
    const result = core.verifyGoalHeuristic({
      goal: { objective: row.objective },
      transcriptText: row.raw_text,
    });
    return result.verdict === row.heuristic_recorded && result.reason === row.recorded_reason;
  }).length;
  return {
    rows: [...claudeRows, ...piRows],
    stats: {
      candidatesPi: piCollected.candidates.length,
      skippedPiNoTurn: piCollected.skippedNoTurn,
      skippedPiNoObjective: piCollected.skippedNoObjective,
      reproducedPi,
      candidatesClaude: claudeCount,
      skippedClaude: claudeCollected.skipped,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CLI
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = { piDir: null, claudeDir: null, out: null, limitText: undefined };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === '--pi') {
      options.piDir = argv[index + 1] ?? null;
      index += 1;
    } else if (flag === '--claude') {
      options.claudeDir = argv[index + 1] ?? null;
      index += 1;
    } else if (flag === '--out') {
      options.out = argv[index + 1] ?? null;
      index += 1;
    } else if (flag === '--limit') {
      options.limitText = argv[index + 1] ?? null;
      index += 1;
    } else {
      return { error: `error: unknown flag ${flag}` };
    }
  }
  return { options };
}

/**
 * Run the fixture builder over a Pi session directory.
 *
 * @param {string[]} argv - Arguments after the script name.
 * @returns {number} 0 on success, 2 on a usage or output error.
 */
function main(argv) {
  const parsed = parseArgs(argv);
  if (parsed.error) {
    process.stderr.write(`[build-verifier-fixture] ${parsed.error}\n`);
    return 2;
  }
  const { piDir, claudeDir, out, limitText } = parsed.options;
  if (!piDir && !claudeDir) {
    process.stderr.write('[build-verifier-fixture] error: give --pi <dir>, --claude <dir> or both\n');
    return 2;
  }
  if (!out) {
    process.stderr.write('[build-verifier-fixture] error: --out <file> is required\n');
    return 2;
  }
  let limit = DEFAULT_LIMIT;
  if (limitText !== undefined) {
    if (!/^[0-9]+$/.test(limitText) || Number(limitText) < 1) {
      process.stderr.write('[build-verifier-fixture] error: --limit must be a positive integer\n');
      return 2;
    }
    limit = Number(limitText);
  }
  if (existsSync(out)) {
    process.stderr.write(`[build-verifier-fixture] error: OUT_EXISTS ${out}\n`);
    return 2;
  }
  const { rows, stats } = buildRows({ piDir, claudeDir, limit });
  try {
    const text = rows.map((row) => `${JSON.stringify(row)}\n`).join('');
    writeFileSync(out, text, { mode: 0o600, flag: 'wx' });
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      process.stderr.write(`[build-verifier-fixture] error: OUT_EXISTS ${out}\n`);
      return 2;
    }
    throw error;
  }
  const claudeBuilt = rows.filter((row) => row.source === 'claude').length;
  const built = `built: rows=${rows.length} pi=${rows.length - claudeBuilt} claude=${claudeBuilt}`
    + ` candidates_pi=${stats.candidatesPi} candidates_claude=${stats.candidatesClaude}`
    + ` skipped_pi_no_turn=${stats.skippedPiNoTurn}`
    + ` skipped_pi_no_objective=${stats.skippedPiNoObjective}`
    + ` skipped_claude=${stats.skippedClaude}`
    + ` pi_recorded_reproduced=${stats.reproducedPi} out=${out}`;
  process.stdout.write(`${built}\n`);
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  collectPiCandidates,
  collectClaudeCandidates,
  selectRows,
  buildRows,
  main,
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
