#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: leaf-route-replay                                             ║
// ║ stage-two keyword replay and read recount                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * leaf-route-replay.cjs — replays the committed stage-two keyword block of
 * every parent hub's ROUTER.md against its gold scenarios, read only, and
 * recounts ROUTER.md reads. It makes zero model calls and holds or reads no
 * credential unless a tie-break arm is switched on.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootRouter = require('./lib/root-router-contract.cjs');
const leafContract = require('./lib/leaf-resource-contract.cjs');
const scenarios = require('./validate-compiled-routing-scenarios.cjs');
const { spawnClassifierCall } = require('../../../cli-classifier/shared/scripts/jev-transport.mjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NONE_KEY = 'none_of_these';
const AMBIGUITY_DELTA = 1;
const HEADROOM_MIN_IMPROVABLE = 5;
const MARGIN_LINE = 'margin: 0.10';
const CHOICE_INSTRUCTION = 'Which intent does this request need?';
const NONE_DESCRIPTION = 'None of these alone';
const ORDERS = 3;

const JEV_VERSION = 'jev 0.6.2';
const DEEM_MODEL = 'deem-0.8-v1';
const HEALTH_TIMEOUT_MS = 2000;
const JEV_TIMEOUT_MS = 90000;
const DEEM_TIMEOUT_MS = 90000;
const BACKOFF_MS = 2000;
// The measured median wall time of one local choice call on the served model.
const DEEM_P50_MS = 65.6;
const REPO_CLI_DEEM = '.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs';

// The seven parent hubs this replay reports, in report order. Each ships a
// ROUTER.md; cli-classifier declares itself stage1-only.
const HUBS = Object.freeze(['sk-doc', 'mcp-tooling', 'system-deep-loop', 'cli-external-orchestration', 'sk-design', 'sk-code', 'cli-classifier']);
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const USAGE = 'usage: leaf-route-replay.cjs [--report <dir>] [--transcripts <dir>] [--prose <file>] [--jev] [--deem] [--out <dir>]';

// A bare keyword like "review" gets swallowed by unrelated longer words
// ("preview" contains "review"), so match those on word boundaries. The short
// performance acronyms need the same guard for the opposite reason: bare "inp"
// would substring-match "input", firing the performance intent on unrelated
// prompts. Path- and identifier-style keywords keep substring matching so
// "javascript" still matches inside "2_javascript".
const WORD_BOUNDARY_KEYWORDS = new Set(['review', 'lcp', 'inp', 'cls']);

// A transcript may hold a tool call JSON-escaped once or more, so any run of
// backslashes may precede a quote before matching a tool name or a path.
const ROUTER_READ_NAME_PATTERN = /\\*"name\\*"\s*:\s*\\*"Read\\*"/;
const ROUTER_READ_PATH_PATTERN = /\\*"file_path\\*"\s*:\s*\\*"([^"\\]*ROUTER\.md)\\*"/;
const ROUTER_READ_ID_PATTERN = /\\*"id\\*"\s*:\s*\\*"([A-Za-z0-9_-]+)\\*"\s*,\s*\\*"name\\*"\s*:\s*\\*"Read\\*"/;
const ROUTER_READ_TIMESTAMP_PATTERN = /\\*"timestamp\\*"\s*:\s*\\*"([^"\\]+)\\*"/;
const MS_PER_WEEK = 604800000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ROUTER PARSING
// ─────────────────────────────────────────────────────────────────────────────

/** Every quoted string in one segment, in order. */
function quotedStrings(segment) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'/g;
  let m;
  while ((m = re.exec(segment)) !== null) out.push(m[1] !== undefined ? m[1] : m[2]);
  return out;
}

/**
 * Parse an INTENT_SIGNALS dict body into intent -> {weight, keywords}. The
 * entry grammar matches the root-router validator's, so a router the validator
 * blesses is scored from the same bytes. Keywords are lowercased at parse time
 * because the keyword arm matches against lowercased task text.
 *
 * @param {string|null} body - The extracted INTENT_SIGNALS body, or null.
 * @returns {Object} Intent signals, in declaration order.
 */
function parseIntentSignals(body) {
  const signals = {};
  if (!body) return signals;
  const entryRe = /["']([A-Z0-9_]+)["']\s*:\s*\{([^}]*)\}/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    const weightMatch = /["']weight["']\s*:\s*(\d+(?:\.\d+)?)/.exec(m[2]);
    const kwMatch = /["']keywords["']\s*:\s*\[([^\]]*)\]/.exec(m[2]);
    signals[m[1]] = {
      weight: weightMatch ? Number(weightMatch[1]) : 1,
      keywords: kwMatch ? quotedStrings(kwMatch[1]).map((kw) => kw.toLowerCase()) : []
    };
  }
  return signals;
}

/**
 * Parse a RESOURCE_MAP dict body into intent -> ordered resource paths, using
 * the same quoted-key/list entry grammar the validator reads.
 *
 * @param {string|null} body - The extracted RESOURCE_MAP body, or null.
 * @returns {Object} Intent -> resource paths.
 */
function parseResourceMap(body) {
  const map = {};
  if (!body) return map;
  const entryRe = /["']([A-Z0-9_]+)["']\s*:\s*\[([^\]]*)\]/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) map[m[1]] = quotedStrings(m[2]);
  return map;
}

/**
 * Parse one root ROUTER.md: its frontmatter state, both machine dicts and the
 * intent declaration order. Extraction goes through the shared fence and
 * dict-body readers so this replay and the contract validator never disagree
 * about what a router declares.
 *
 * @param {string} text - The whole ROUTER.md text.
 * @returns {{ state: string|null, intents: Object, resourceMap: Object, intentOrder: string[] }} The parsed router.
 */
function parseRouter(text) {
  const source = text || '';
  const frontmatter = rootRouter.extractFrontmatter(source);
  const stateValues = rootRouter.frontmatterValues(frontmatter, 'router_state');
  const intents = parseIntentSignals(rootRouter.extractDictBody(source, 'INTENT_SIGNALS'));
  const resourceMap = parseResourceMap(rootRouter.extractDictBody(source, 'RESOURCE_MAP'));
  return {
    state: stateValues.length > 0 ? stateValues[0] : null,
    intents,
    resourceMap,
    intentOrder: Object.keys(intents)
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. KEYWORD ARM
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether one keyword hits the lowercased task text. The word-boundary
 * keywords match only whole words; every other keyword keeps substring
 * matching, so path- and identifier-style keywords still hit inside larger
 * tokens.
 *
 * @param {string} taskLower - Lowercased task text.
 * @param {string} kw - One keyword from an intent signal.
 * @returns {boolean} True when the keyword hits.
 */
function keywordHits(taskLower, kw) {
  if (!kw) return false;
  if (WORD_BOUNDARY_KEYWORDS.has(kw)) {
    return new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(taskLower);
  }
  return taskLower.includes(kw);
}

/**
 * Score each intent by summing its weight for every keyword that hits the
 * lowercased task, keeping only positive-scoring intents (sorted desc).
 *
 * @param {string} taskLower - Lowercased task text.
 * @param {Object} intentSignals - Map of intent -> {weight, keywords}.
 * @returns {Array<{intent:string,score:number}>} Scored intents, highest first.
 */
function scoreIntents(taskLower, intentSignals) {
  const scores = [];
  for (const [key, sig] of Object.entries(intentSignals)) {
    let score = 0;
    for (const kw of sig.keywords) {
      if (keywordHits(taskLower, kw)) score += sig.weight;
    }
    if (score > 0) scores.push({ intent: key, score });
  }
  scores.sort((a, b) => b.score - a.score);
  return scores;
}

/**
 * Select intents within AMBIGUITY_DELTA of the top score (keeps near-tied
 * intents, mirroring the in-skill router).
 *
 * @param {Array<{intent:string,score:number}>} scores - Scored intents, highest first.
 * @returns {string[]} Selected intent keys; [] means no hit (UNKNOWN).
 */
function selectIntents(scores) {
  if (scores.length === 0) return [];
  const top = scores[0].score;
  return scores.filter((s) => top - s.score <= AMBIGUITY_DELTA).map((s) => s.intent);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HUB MODES AND LEAF CONVERSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read one hub's declared modes from its mode-registry.json. Only the
 * `workflowMode` and `packet` fields matter here: the packet field is what
 * lets a packet-qualified resource string resolve to a typed pair. A missing
 * or unreadable registry yields no modes, so every packet-qualified path is
 * counted unresolvable instead of guessed.
 *
 * @param {string} repoRoot - Repository root.
 * @param {string} hub - Hub id (its directory under .skilled/skills).
 * @returns {Array<{workflowMode: string, packet: string}>} Declared modes.
 */
function loadHubModes(repoRoot, hub) {
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', hub, 'mode-registry.json'), 'utf8'));
    return (Array.isArray(registry.modes) ? registry.modes : [])
      .filter((mode) => mode && mode.workflowMode && mode.packet)
      .map((mode) => ({ workflowMode: String(mode.workflowMode), packet: String(mode.packet) }));
  } catch {
    return [];
  }
}

/**
 * Read one hub's authored shared-alias entries from its leaf-aliases.json. A
 * hub that ships none has no alias-resolvable shared paths, so absence is an
 * empty list, not an error.
 *
 * @param {string} repoRoot - Repository root.
 * @param {string} hub - Hub id.
 * @returns {Array<{workflowMode: string, leafResourceId: string, diskPath: string}>} Alias entries.
 */
function loadAliasEntries(repoRoot, hub) {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', hub, 'leaf-aliases.json'), 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Convert a router's raw resource strings into typed pairs through the leaf
 * contract's dual read: already-canonical, declared-mode packet-qualified, or
 * an authored shared alias. Pairs dedupe on the composite key so one leaf
 * reached through two shapes counts once. A string no declared mode or alias
 * resolves is returned in `unresolvable` so the caller can count it rather
 * than drop it.
 *
 * @param {string[]} paths - Raw RESOURCE_MAP paths.
 * @param {Array<{workflowMode: string, packet: string}>} modes - Declared hub modes.
 * @param {Array<{workflowMode: string, leafResourceId: string, diskPath: string}>} aliases - Authored aliases.
 * @returns {{ pairs: Array<{workflowMode: string, leafResourceId: string}>, unresolvable: string[] }} Converted pairs and the raw strings that did not resolve.
 */
function toPairs(paths, modes, aliases) {
  const pairs = [];
  const unresolvable = [];
  const seen = new Set();
  for (const raw of paths || []) {
    const result = leafContract.dualReadLegacyResource({ raw, declaredModes: modes, aliasEntries: aliases });
    if (!result.ok) {
      unresolvable.push(raw);
      continue;
    }
    const key = leafContract.compositeKey(result.pair);
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push(result.pair);
  }
  return { pairs, unresolvable };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. GOLD AND ROW SCORING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load one hub's gold rows: every playbook scenario file under its
 * manual-testing-playbook directory, parsed with the shared scenario parser.
 * A row keeps its id, prompt and typed leaf pairs. An unreadable file is
 * returned with a null prompt and no pairs, so it is counted unscored rather
 * than vanishing from the report.
 *
 * @param {string} repoRoot - Repository root.
 * @param {string} hub - Hub id.
 * @returns {Array<{id: string|null, prompt: string|null, pairs: Array<{workflowMode: string, leafResourceId: string}>}>} Gold rows.
 */
function loadGold(repoRoot, hub) {
  const dir = path.join(repoRoot, '.skilled', 'skills', hub, 'manual-testing-playbook');
  return scenarios.walkScenarioFiles(dir).map((file) => {
    const parsed = scenarios.parseScenario(file);
    if (!parsed.ok) return { id: null, prompt: null, pairs: [] };
    return { id: parsed.id, prompt: parsed.prompt, pairs: parsed.leafPairs };
  });
}

/**
 * Score one row's prediction against its gold leaf set on composite keys:
 * precision over the prediction, recall over the gold, F1 the harmonic mean,
 * exact the set-equality flag. An empty prediction scores zero everywhere
 * instead of dividing by zero.
 *
 * @param {Iterable<string>} predKeys - Predicted composite keys.
 * @param {Iterable<string>} goldKeys - Gold composite keys.
 * @returns {{ precision: number, recall: number, f1: number, exact: boolean }} The row's score.
 */
function scoreRow(predKeys, goldKeys) {
  const pred = new Set(predKeys || []);
  const gold = new Set(goldKeys || []);
  let hits = 0;
  for (const key of pred) if (gold.has(key)) hits += 1;
  const precision = pred.size === 0 ? 0 : hits / pred.size;
  const recall = gold.size === 0 ? 0 : hits / gold.size;
  const f1 = pred.size + gold.size === 0 ? 0 : (2 * hits) / (pred.size + gold.size);
  return { precision, recall, f1, exact: pred.size === gold.size && hits === pred.size };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. REPLAY AND REPORT LINES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replay one hub. A stage1-only hub owns no stage-two leaf selection, so it
 * reports its state alone. The sk-code hub's stage-two slice is a surface and
 * language overlay this replay does not port, so its gold rows are reported
 * unscored and never scored. Every other hub scores each gold row's prompt
 * through the keyword arm, converts the kept intents' paths with toPairs, and
 * aggregates the row scores.
 *
 * @param {string} hub - Hub id.
 * @param {string} repoRoot - Repository root.
 * @returns {{ counts: Object, rows: Array<Object> }} Per-hub counts and its scored rows.
 */
function replayHub(hub, repoRoot) {
  const skillRoot = path.join(repoRoot, '.skilled', 'skills', hub);
  let routerText = null;
  try {
    routerText = fs.readFileSync(path.join(skillRoot, 'ROUTER.md'), 'utf8');
  } catch {
    routerText = null;
  }
  const router = parseRouter(routerText || '');

  if (router.state === 'stage1-only') {
    return { counts: { marker: 'stage1-only', gold: 0, unscored: 0 }, rows: [] };
  }

  const goldRows = loadGold(repoRoot, hub);

  if (hub === 'sk-code') {
    const gold = goldRows.filter((row) => row.pairs.length > 0).length;
    return { counts: { marker: 'surface slice not replayed', gold, unscored: gold }, rows: [] };
  }

  const modes = loadHubModes(repoRoot, hub);
  const aliases = loadAliasEntries(repoRoot, hub);
  const counts = { marker: null, gold: 0, unscored: 0, unknown: 0, unresolvable: 0, tied: 0, precision: 0, recall: 0, f1: 0, exact: 0 };
  const rows = [];
  const unresolvable = new Set();
  let precisionSum = 0;
  let recallSum = 0;
  let f1Sum = 0;

  for (const goldRow of goldRows) {
    const hasGold = goldRow.pairs.length > 0;
    if (hasGold) counts.gold += 1;
    if (!goldRow.prompt || !hasGold) {
      counts.unscored += 1;
      continue;
    }
    const kept = selectIntents(scoreIntents(String(goldRow.prompt).toLowerCase(), router.intents));
    if (kept.length === 0) counts.unknown += 1;
    if (kept.length >= 2) counts.tied += 1;
    const rowPairs = toPairs([...new Set(kept.flatMap((key) => router.resourceMap[key] || []))], modes, aliases);
    for (const raw of rowPairs.unresolvable) unresolvable.add(raw);
    const perIntentKeys = {};
    for (const key of kept) {
      perIntentKeys[key] = toPairs(router.resourceMap[key] || [], modes, aliases).pairs
        .map((pair) => leafContract.compositeKey(pair));
    }
    const predKeys = rowPairs.pairs.map((pair) => leafContract.compositeKey(pair));
    const goldKeys = goldRow.pairs.map((pair) => leafContract.compositeKey(pair));
    const score = scoreRow(predKeys, goldKeys);
    precisionSum += score.precision;
    recallSum += score.recall;
    f1Sum += score.f1;
    if (score.exact) counts.exact += 1;
    rows.push({
      hub,
      id: goldRow.id,
      prompt: goldRow.prompt,
      intents: router.intentOrder.filter((key) => kept.includes(key)),
      intentOrder: router.intentOrder,
      perIntentKeys,
      predKeys,
      goldKeys,
      f1: score.f1,
      exact: score.exact
    });
  }

  const scored = rows.length;
  counts.unresolvable = unresolvable.size;
  if (scored > 0) {
    counts.precision = precisionSum / scored;
    counts.recall = recallSum / scored;
    counts.f1 = f1Sum / scored;
  }
  return { counts, rows };
}

/**
 * Replay every named hub against its own committed gold and report the
 * aggregate. Hub order follows the input list. The returned rows are the
 * scored rows only, each carrying its kept intents, per-intent and union
 * composite keys and its score, so the prose comparison and the tie-break
 * arms consume one shared replay instead of re-running the keyword arm.
 *
 * @param {string[]} hubs - Hub ids to replay, in report order.
 * @param {string} repoRoot - Repository root.
 * @returns {{ hubs: Object<string, Object>, totals: { gold: number, scored: number, tied: number, meanF1: number, exact: number }, rows: Array<Object> }} Per-hub counts keyed by hub id, the summed totals, and the scored rows.
 */
function runReplay(hubs, repoRoot) {
  const hubCounts = {};
  const totals = { gold: 0, scored: 0, tied: 0, meanF1: 0, exact: 0 };
  const rows = [];
  let f1Sum = 0;
  for (const hub of hubs || []) {
    const result = replayHub(hub, repoRoot);
    hubCounts[hub] = result.counts;
    totals.gold += result.counts.gold || 0;
    totals.tied += result.counts.tied || 0;
    totals.exact += result.counts.exact || 0;
    for (const row of result.rows) {
      rows.push(row);
      f1Sum += row.f1;
    }
  }
  totals.scored = rows.length;
  totals.meanF1 = rows.length > 0 ? f1Sum / rows.length : 0;
  return { hubs: hubCounts, totals, rows };
}

/**
 * One hub's report line: the full counts for a replayed hub, the state alone
 * for a stage1-only hub, and the gold/unscored pair plus the marker for the
 * unported surface slice. Means print four significant digits.
 *
 * @param {string} hub - Hub id.
 * @param {Object} counts - One per-hub counts object from runReplay.
 * @returns {string} The hub's report line.
 */
function hubLine(hub, counts) {
  if (counts.marker === 'stage1-only') return `hub=${hub} stage1-only`;
  if (counts.marker) return `hub=${hub} gold=${counts.gold} unscored=${counts.unscored} ${counts.marker}`;
  return `hub=${hub} gold=${counts.gold} unscored=${counts.unscored} unknown=${counts.unknown} unresolvable=${counts.unresolvable} tied=${counts.tied} precision=${counts.precision.toPrecision(4)} recall=${counts.recall.toPrecision(4)} f1=${counts.f1.toPrecision(4)} exact=${counts.exact}`;
}

/**
 * The summed report line over every replayed hub.
 *
 * @param {{ gold: number, scored: number, tied: number, meanF1: number, exact: number }} totals - runReplay totals.
 * @returns {string} The totals line.
 */
function totalLine(totals) {
  return `total gold=${totals.gold} scored=${totals.scored} tied=${totals.tied} mean_f1=${totals.meanF1.toPrecision(4)} exact=${totals.exact}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. RECOUNT, PROSE AND THE REPLAY VERDICT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The ISO week label of one transcript timestamp, `YYYY-Www`, or `unknown`
 * when the line carries no parseable stamp. Weeks bucket the read recount.
 *
 * @param {string|null} stamp - The line's timestamp text.
 * @returns {string} The week label.
 */
function isoWeek(stamp) {
  const ms = Date.parse(stamp || '');
  if (Number.isNaN(ms)) return 'unknown';
  const date = new Date(ms);
  const day = (date.getUTCDay() + 6) % 7;
  const thursday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - day + 3));
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  const firstDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3);
  const week = 1 + Math.round((thursday - firstThursday) / MS_PER_WEEK);
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/**
 * Record the byte length of every tool result content string on one line,
 * keyed by tool_use_id. The line is parsed rather than scanned: an escaped
 * string's text length is not its byte count, and only the length leaves this
 * function.
 *
 * @param {string} line - One transcript line.
 * @param {Map<string, number>} bytesById - Collector keyed by tool_use_id.
 */
function recordResultBytes(line, bytesById) {
  if (!line.includes('tool_use_id')) return;
  let parsed;
  try {
    parsed = JSON.parse(line);
  } catch {
    return;
  }
  const content = parsed && parsed.message && parsed.message.content;
  if (!Array.isArray(content)) return;
  for (const block of content) {
    if (block && typeof block.tool_use_id === 'string' && typeof block.content === 'string') {
      bytesById.set(block.tool_use_id, block.content.length);
    }
  }
}

/**
 * Count Read tool calls on a ROUTER.md across a transcript directory,
 * recursing into subdirectories. One count per line naming a Read on a
 * ROUTER.md; the hub is the directory above the file, the week is the line's
 * timestamp, and the bytes are the paired tool_result's content length, 0
 * when unpaired. Only counts and bytes leave this function; transcript text
 * never does.
 *
 * @param {string} dir - Directory to walk.
 * @returns {{ files: number, reads: number, bytes: number, byHubWeek: Object<string, Object<string, { reads: number, bytes: number }>> }} The recount.
 */
function countRouterReads(dir) {
  const files = [];
  const walk = (cur) => {
    const entries = fs.readdirSync(cur, { withFileTypes: true })
      .sort((a, b) => {
        const left = path.join(cur, a.name);
        const right = path.join(cur, b.name);
        return left < right ? -1 : left > right ? 1 : 0;
      });
    for (const entry of entries) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) files.push(full);
    }
  };
  walk(dir);

  const reads = [];
  const bytesById = new Map();
  for (const file of files) {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      recordResultBytes(line, bytesById);
      if (!ROUTER_READ_NAME_PATTERN.test(line)) continue;
      const pathMatch = ROUTER_READ_PATH_PATTERN.exec(line);
      if (!pathMatch) continue;
      const idMatch = ROUTER_READ_ID_PATTERN.exec(line);
      const stampMatch = ROUTER_READ_TIMESTAMP_PATTERN.exec(line);
      reads.push({
        hub: path.basename(path.dirname(pathMatch[1])),
        week: isoWeek(stampMatch ? stampMatch[1] : null),
        id: idMatch ? idMatch[1] : null
      });
    }
  }

  const byHubWeek = {};
  let bytes = 0;
  for (const read of reads) {
    const size = read.id !== null && bytesById.has(read.id) ? bytesById.get(read.id) : 0;
    bytes += size;
    if (!byHubWeek[read.hub]) byHubWeek[read.hub] = {};
    if (!byHubWeek[read.hub][read.week]) byHubWeek[read.hub][read.week] = { reads: 0, bytes: 0 };
    byHubWeek[read.hub][read.week].reads += 1;
    byHubWeek[read.hub][read.week].bytes += size;
  }
  return { files: files.length, reads: reads.length, bytes, byHubWeek };
}

/**
 * Format the recount: the file, read and byte totals, then one line per hub
 * and week bucket in sorted order.
 *
 * @param {{ files: number, reads: number, bytes: number, byHubWeek: Object }} count - countRouterReads output.
 * @returns {Array<string>} Recount report lines.
 */
function routerReadLines(count) {
  const lines = [`router reads: files=${count.files} reads=${count.reads} bytes=${count.bytes}`];
  for (const hub of Object.keys(count.byHubWeek).sort()) {
    for (const week of Object.keys(count.byHubWeek[hub]).sort()) {
      const cell = count.byHubWeek[hub][week];
      lines.push(`router read hub=${hub} week=${week} reads=${cell.reads} bytes=${cell.bytes}`);
    }
  }
  return lines;
}

/**
 * Read the operator's prose file: one line per scenario, an id then the leaf
 * pairs the main AI loaded after reading a ROUTER.md, each
 * `workflowMode:leafResourceId`. Keys land in the composite form the replay
 * scores on. A line that does not fit the grammar is counted, never guessed.
 *
 * @param {string} file - Path to the prose file.
 * @returns {{ byId: Map<string, Set<string>>, unparsed: number }} Composite keys by scenario id, and the unparsed-line count.
 */
function readProse(file) {
  const byId = new Map();
  let unparsed = 0;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    const line = raw.trim();
    if (line.length === 0) continue;
    const tokens = line.split(/\s+/);
    if (tokens.length < 2) {
      unparsed += 1;
      continue;
    }
    const id = tokens[0];
    const pairs = [];
    let ok = true;
    for (const token of tokens.slice(1)) {
      const colon = token.indexOf(':');
      const workflowMode = colon > 0 ? token.slice(0, colon) : '';
      const leafResourceId = colon > 0 ? token.slice(colon + 1) : '';
      if (!workflowMode || !leafResourceId) {
        ok = false;
        break;
      }
      pairs.push({ workflowMode, leafResourceId });
    }
    if (!ok) {
      unparsed += 1;
      continue;
    }
    if (!byId.has(id)) byId.set(id, new Set());
    for (const pair of pairs) byId.get(id).add(leafContract.compositeKey(pair));
  }
  return { byId, unparsed };
}

/**
 * The replay verdict under the rule fixed before any run: coverage
 * (10*P >= 9*N) first, then the keyword arm's mean F1 on the covered rows
 * against the prose arm's on the same rows. Below the prose mean drops the
 * replay; otherwise it keeps. With no covered row both means are n/a.
 *
 * @param {Array<Object>} rows - The scored rows from runReplay.
 * @param {{ byId: Map<string, Set<string>> }|null} prose - readProse output, or null without the flag.
 * @returns {{ outcome: 'keep'|'drop'|'stop', reason: string|null, N: number, P: number, keywordF1: number|null, proseF1: number|null, line: string }} The verdict and its report line.
 */
function replayVerdict(rows, prose) {
  const scored = rows || [];
  const byId = prose && prose.byId ? prose.byId : new Map();
  const N = scored.length;
  const covered = scored.filter((row) => byId.has(row.id));
  const P = covered.length;
  let keywordF1 = null;
  let proseF1 = null;
  if (P > 0) {
    let keywordSum = 0;
    let proseSum = 0;
    for (const row of covered) {
      keywordSum += row.f1;
      proseSum += scoreRow(byId.get(row.id), row.goldKeys).f1;
    }
    keywordF1 = keywordSum / P;
    proseF1 = proseSum / P;
  }
  const keywordText = keywordF1 === null ? 'n/a' : keywordF1.toPrecision(4);
  const proseText = proseF1 === null ? 'n/a' : proseF1.toPrecision(4);
  const fields = `N=${N} P=${P} keyword_f1=${keywordText} prose_f1=${proseText}`;
  if (10 * P < 9 * N) {
    const reason = `prose arm covers ${P} of ${N} rows`;
    return { outcome: 'stop', reason, N, P, keywordF1, proseF1, line: `replay verdict: stop (${reason}) ${fields}` };
  }
  const outcome = keywordF1 !== null && keywordF1 < proseF1 ? 'drop' : 'keep';
  return { outcome, reason: null, N, P, keywordF1, proseF1, line: `replay verdict: ${outcome} ${fields}` };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. GATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is
 * executable. Empty PATH entries are skipped. A missing path, a directory, or
 * a file that cannot be executed is not a match.
 *
 * @param {string} name - Executable name to look up.
 * @param {{ PATH?: string }} env - Environment whose PATH is scanned.
 * @returns {string|null} The resolved path, or null.
 */
function which(name, env) {
  for (const dir of (env.PATH ?? '').split(path.delimiter)) {
    if (dir.length === 0) continue;
    const candidate = path.join(dir, name);
    try {
      if (fs.statSync(candidate).isFile()) {
        fs.accessSync(candidate, fs.constants.X_OK);
        return candidate;
      }
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Identity line, then the pinned version and a credential check. A miss
 * prints a skip line and leaves the report lines already written untouched.
 *
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx - Output sink and environment.
 * @returns {{ passed: boolean, path: string | null, provider: string }} The gate outcome.
 */
function jevGate(ctx) {
  const provider = ctx.env.JEV_PROVIDER || 'official';
  const path = which('jev', ctx.env);
  ctx.out(`jev: path=${path ?? 'none'} provider=${provider}`);
  if (path === null) {
    ctx.out('jev arm skipped: jev not on PATH');
    return { passed: false, path, provider };
  }

  const opts = {
    env: ctx.env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: JEV_TIMEOUT_MS,
  };
  const version = spawnSync(path, ['--version'], opts);
  const trimmed = (version.stdout ?? '').trim();
  const found = trimmed === '' ? '' : trimmed.split('\n')[0];
  if (found !== JEV_VERSION) {
    ctx.out('jev arm skipped: version');
    ctx.out(`jev: found=${JSON.stringify(found)} path=${path}`);
    return { passed: false, path, provider };
  }

  const auth = spawnSync(path, ['auth', 'status', '--provider', provider], opts);
  if (auth.status !== 0) {
    ctx.out('jev arm skipped: no credential');
    return { passed: false, path, provider };
  }
  return { passed: true, path, provider };
}

/**
 * cli-deem on PATH when that file is executable, otherwise the repo copy
 * under node.
 *
 * @param {{ PATH?: string }} env - Environment whose PATH is scanned.
 * @param {string} repoRoot - Repository root holding the fallback copy.
 * @returns {Array<string>} The command argv prefix.
 */
function deemCommand(env, repoRoot) {
  const found = which('cli-deem', env);
  if (found !== null) return [found];
  return [process.execPath, path.join(repoRoot, REPO_CLI_DEEM)];
}

/**
 * One health check. An unreachable binary, a stub backend, or a wrong model
 * is a failed check the caller prints as a skip.
 *
 * @param {Array<string>} cmd - deemCommand argv prefix.
 * @param {Record<string, string | undefined>} env - Child environment.
 * @returns {{ ok: true, backend: string, model: string, modelCommit: string, sourceCommit: string } | { ok: false, reason: string, found: unknown }} The health outcome.
 */
function readDeemHealth(cmd, env) {
  const result = spawnSync(cmd[0], [...cmd.slice(1), 'health'], {
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: HEALTH_TIMEOUT_MS,
  });
  let errorText = (result.stderr ?? '').trim();
  try {
    errorText = JSON.parse(errorText).error;
  } catch {
    // Leave the trimmed stderr when it is not JSON.
  }

  if (result.error || result.status === 4) {
    return { ok: false, reason: 'not reachable', found: errorText };
  }
  if (result.status === 3) {
    let reason = 'bad health response';
    if (typeof errorText === 'string' && errorText.includes('stub')) reason = 'stub backend';
    else if (typeof errorText === 'string' && errorText.includes('refused model')) reason = 'model';
    return { ok: false, reason, found: errorText };
  }
  if (result.status === 0) {
    const stdoutText = (result.stdout ?? '').trim();
    let body;
    try {
      body = JSON.parse(stdoutText);
    } catch {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    const backend = body?.backend;
    if (typeof backend === 'string' && backend.includes('stub')) {
      return { ok: false, reason: 'stub backend', found: backend };
    }
    if (backend !== 'torch' && !(typeof backend === 'string' && backend.startsWith('ensemble:'))) {
      return { ok: false, reason: 'bad health response', found: String(backend) };
    }
    const model = body?.model;
    if (model !== DEEM_MODEL) {
      return { ok: false, reason: 'model', found: String(model) };
    }
    const modelCommit = body?.model_commit;
    const sourceCommit = body?.source_commit;
    if (
      body?.ok !== true
      || typeof modelCommit !== 'string'
      || modelCommit === ''
      || typeof sourceCommit !== 'string'
      || sourceCommit === ''
    ) {
      return { ok: false, reason: 'bad health response', found: stdoutText };
    }
    return { ok: true, backend, model, modelCommit, sourceCommit };
  }
  return { ok: false, reason: 'bad health response', found: `exit ${result.status}: ${errorText}` };
}

/**
 * Prints the health line, or a skip line when the check fails. The details
 * line carries what the backend reported for the model and response-shape
 * misses.
 *
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, repoRoot: string }} ctx - Output sink, environment and repository root.
 * @returns {{ passed: boolean, cmd: Array<string> }} The gate outcome.
 */
function deemGate(ctx) {
  const cmd = deemCommand(ctx.env, ctx.repoRoot);
  const health = readDeemHealth(cmd, ctx.env);
  if (health.ok) {
    ctx.out(`deem: health backend=${health.backend} model=${health.model} model_commit=${health.modelCommit} source_commit=${health.sourceCommit}`);
    return { passed: true, cmd, ...health };
  }
  ctx.out(`deem arm skipped: ${health.reason}`);
  if (health.reason === 'model' || health.reason === 'bad health response') {
    ctx.out(`deem: found=${JSON.stringify(health.found)}`);
  }
  return { passed: false, cmd };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. BASELINE AND VERDICT MATH
// ─────────────────────────────────────────────────────────────────────────────

// The kill and sign tests compare exact BigInt tails over 2^n, so no rounding
// decides either one.

/**
 * Pick the baseline the tie-break arms measure against: the union of every
 * kept intent's leaves, or the leaves of the first tied intent in declaration
 * order, whichever scores higher over the tied rows. A tie goes to the union,
 * which is what the keyword arm already serves unaided. The chosen arm's
 * per-row keys and F1 ride along, so the arms score the baseline this choice
 * was measured on.
 *
 * @param {Array<Object>} rows - The tied scored rows from runReplay.
 * @returns {{ choice: 'union'|'first', baseKeys: Map<string, Set<string>>, baseF1: Map<string, number> }} The chosen baseline.
 */
function chooseBaseline(rows) {
  const unionKeys = new Map();
  const unionF1 = new Map();
  const firstKeys = new Map();
  const firstF1 = new Map();
  let unionSum = 0;
  let firstSum = 0;
  for (const row of rows || []) {
    const gold = row.goldKeys || [];
    const first = Array.isArray(row.intents) && row.intents.length > 0 ? row.intents[0] : null;
    const rowUnion = new Set(row.predKeys || []);
    const rowFirst = first === null ? new Set() : new Set((row.perIntentKeys || {})[first] || []);
    const uf1 = scoreRow(rowUnion, gold).f1;
    const ff1 = scoreRow(rowFirst, gold).f1;
    unionSum += uf1;
    firstSum += ff1;
    unionKeys.set(row.id, rowUnion);
    unionF1.set(row.id, uf1);
    firstKeys.set(row.id, rowFirst);
    firstF1.set(row.id, ff1);
  }
  const choice = unionSum >= firstSum ? 'union' : 'first';
  return { choice, baseKeys: choice === 'union' ? unionKeys : firstKeys, baseF1: choice === 'union' ? unionF1 : firstF1 };
}

/**
 * Rows the baseline does not already get exactly right: a baseline F1 below 1
 * leaves headroom for the tie-break arms to improve on.
 *
 * @param {Map<string, number>} baseF1 - The chosen baseline's per-row F1.
 * @returns {number} The count of rows with baseline F1 below 1.
 */
function improvableCount(baseF1) {
  if (!baseF1) return 0;
  let count = 0;
  for (const f1 of baseF1.values()) {
    if (f1 < 1) count += 1;
  }
  return count;
}

/**
 * Exact one-sided binomial tail P(X >= k) for X ~ Binomial(n, 1/2). The
 * coefficients and their sum stay in BigInt, so p is the exact ratio
 * num / 2^n, reported as a number and as its own parts.
 *
 * @param {number} n - Trial count.
 * @param {number} k - Tail start; zero or below covers every outcome.
 * @returns {{ p: number, num: bigint, den: bigint }} The tail probability and its exact num / 2^n ratio.
 */
function tailP(n, k) {
  if (n === 0 || k <= 0) return { p: 1, num: 1n, den: 1n };
  let coefficient = 1n;
  let num = 0n;
  for (let i = 0; i <= n; i += 1) {
    if (i > 0) coefficient = (coefficient * BigInt(n - i + 1)) / BigInt(i);
    if (i >= k) num += coefficient;
  }
  const den = 1n << BigInt(n);
  return { p: Number(num) / Number(den), num, den };
}

/**
 * The answer named at least twice, with its count. When no key reaches two
 * names there is no winner: the pick is null and the top count is 0, so an
 * unstable row counts every order as a non-modal pick.
 *
 * @param {Array<string>} answers - Submitted keys in call order.
 * @returns {{ pick: string | null, top: number }} The modal pick and its count, or no pick and top 0.
 */
function modalPick(answers) {
  const counts = new Map();
  for (const key of answers) {
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let pick = null;
  let top = 0;
  for (const [key, count] of counts) {
    if (count > top) {
      pick = key;
      top = count;
    }
  }
  if (top < 2) return { pick: null, top: 0 };
  return { pick, top };
}

/**
 * First failed condition decides, in this order: coverage, kill, margin,
 * sign test, flips. The margin compares the column's F1 sum against the
 * baseline's over the measured rows. Every outcome carries p, the sign
 * test's exact tail.
 *
 * @param {{ K: number, M: number, SA: number, SB: number, W: number, L: number, F: number }} counts - The column's counts.
 * @returns {{ outcome: 'keep' | 'kill' | 'stop', reason: 'coverage' | 'margin' | 'sign test' | 'flips' | null, p: number }} The decision.
 */
function decideVerdict({ K, M, SA, SB, W, L, F }) {
  const sign = tailP(W + L, W);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: sign.p };
  const kill = tailP(W + L, L);
  if (W + L > 0 && 20n * kill.num <= kill.den) return { outcome: 'kill', reason: null, p: sign.p };
  if (!(10 * (SA - SB) >= M)) return { outcome: 'stop', reason: 'margin', p: sign.p };
  if (!(W + L > 0 && 20n * sign.num < sign.den)) return { outcome: 'stop', reason: 'sign test', p: sign.p };
  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: sign.p };
  return { outcome: 'keep', reason: null, p: sign.p };
}

/**
 * @param {number} p - Probability in [0, 1].
 * @returns {string} Four significant digits.
 */
function formatP(p) {
  return p.toPrecision(4);
}

/**
 * One verdict line: the outcome, the counts and the exact p, with the
 * caller's suffix appended when it has one.
 *
 * @param {string} backend - Column name, printed on the line.
 * @param {{ K: number, M: number, SA: number, SB: number, W: number, L: number, F: number }} counts - The column's counts.
 * @param {{ outcome: 'keep' | 'kill' | 'stop', reason: string | null, p: number }} decision - decideVerdict output.
 * @param {string} [suffix] - Appended to the line when non-empty.
 * @returns {string} The verdict line.
 */
function verdictLine(backend, counts, decision, suffix) {
  const label = decision.outcome === 'stop' ? 'stop (' + decision.reason + ')' : decision.outcome;
  let line = 'verdict ' + backend + ': ' + label
    + ' K=' + counts.K + ' M=' + counts.M + ' SA=' + counts.SA + ' SB=' + counts.SB
    + ' W=' + counts.W + ' L=' + counts.L + ' F=' + counts.F
    + ' p=' + formatP(decision.p);
  if (typeof suffix === 'string' && suffix !== '') line += ' ' + suffix;
  return line;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. ARMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired. The timer
 * kills the child and resolves at once, without waiting for close: a
 * grandchild can hold the pipes open past the kill. Stdin is closed after the
 * write because the local client reads stdin to EOF and exits 2 on an
 * inherited terminal. A spawn error is code 127 with the message as stderr.
 *
 * @param {string} file - Executable to spawn.
 * @param {Array<string>} args - Arguments after the executable.
 * @param {string} stdinText - Text written to the child's stdin, then closed.
 * @param {Record<string, string | undefined>} env - Child environment.
 * @param {number} timeoutMs - Kill and settle the child after this many milliseconds.
 * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} The call outcome.
 */
function spawnCall(file, args, stdinText, env, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(file, args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let settled = false;

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    // A child that exits before reading stdin cannot fail the call through
    // the pipe: its exit code is the outcome the caller needs.
    child.stdin.on('error', () => {});
    child.stdin.end(stdinText);

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      settle(null, true);
    }, timeoutMs);

    function settle(code, timedOut) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ code, stdout, stderr, wallMs: Date.now() - start, timedOut });
    }

    child.on('close', (code) => settle(code === null ? -1 : code, false));
    child.on('error', (error) => {
      stderr = error.message;
      settle(127, false);
    });
  });
}

/**
 * Append one call record as a JSON line to calls.jsonl under outDir. A missing
 * or empty outDir means the run keeps no records, so nothing is created. One
 * line per call keeps a killed arm's earlier records readable.
 *
 * @param {string | null | undefined} outDir - Directory that holds calls.jsonl.
 * @param {object} record - The call record to append.
 * @returns {void}
 */
function writeCall(outDir, record) {
  if (typeof outDir === 'string' && outDir !== '') {
    fs.mkdirSync(outDir, { recursive: true });
    fs.appendFileSync(path.join(outDir, 'calls.jsonl'), JSON.stringify(record) + '\n');
  }
}

/**
 * The three option orders a row is asked in: as given, rotated left by one,
 * rotated left by two. Rotating moves the option texts against the question
 * while the key set stays the same, so a position bias cannot pass as a pick.
 *
 * @param {Array<string>} keys - Option keys in router order.
 * @returns {Array<Array<string>>} The three rotations.
 */
function rotations(keys) {
  return [keys, keys.slice(1).concat(keys.slice(0, 1)), keys.slice(2).concat(keys.slice(0, 2))];
}

/**
 * Flatten one rotation's keys and their option texts into the local client's
 * repeated -o pairs.
 *
 * @param {Array<string>} keys - Option keys in the order this call shows them.
 * @param {Map<string, string>} texts - Key -> option text.
 * @returns {Array<string>} The flat argument list.
 */
function optionArgs(keys, texts) {
  const args = [];
  for (const key of keys) args.push('-o', key + '=' + texts.get(key));
  return args;
}

/**
 * Judge one choice call: the pick it named, that pick's probability, and
 * whether the call measured. A timeout is its own status. Any other non-zero
 * exit, an unparseable body, or a choice outside the offered keys is
 * unmeasured.
 *
 * @param {{ code: number|null, stdout: string, timedOut: boolean }} result - One spawnCall outcome.
 * @param {Array<string>} keys - The keys this call offered.
 * @returns {{ pick: string|null, pickProb: number|null, status: string }} The judged fields.
 */
function judgeChoice(result, keys) {
  let pick = null;
  let pickProb = null;
  let status = 'unmeasured';
  if (result.timedOut) {
    status = 'unmeasured_timeout';
  } else if (result.code === 0) {
    /** @type {any} */
    let parsed;
    try {
      parsed = JSON.parse(result.stdout);
    } catch {
      // Unparseable stdout is an unmeasured call.
      parsed = undefined;
    }
    const choice = parsed?.answers?.answer?.choice;
    if (keys.includes(choice)) {
      pick = choice;
      pickProb = parsed?.answers?.answer?.probabilities?.[pick] ?? null;
      status = 'measured';
    }
  }
  return { pick, pickProb, status };
}

/**
 * Resolve each intent key to the option text a choice call shows: its
 * RESOURCE_MAP paths joined by commas, with the none key fixed to its
 * constant. Two keys sharing one text each gain their key, because the local
 * classifier refuses two options with one description.
 *
 * @param {{ resourceMap: Object<string, string[]> }} router - A parsed router.
 * @param {Array<string>} keys - Intent keys to describe.
 * @returns {Map<string, string>} Key -> option text.
 */
function intentTexts(router, keys) {
  const texts = new Map();
  for (const key of keys) {
    if (key === NONE_KEY) {
      texts.set(key, NONE_DESCRIPTION);
      continue;
    }
    texts.set(key, (router.resourceMap[key] || []).join(','));
  }

  const counts = new Map();
  for (const text of texts.values()) counts.set(text, (counts.get(text) || 0) + 1);

  const described = new Map();
  for (const [key, text] of texts) described.set(key, counts.get(text) > 1 ? text + ' [' + key + ']' : text);
  return described;
}

/**
 * The Deem choice arm: three rotated choice calls per tied row, then the
 * verdict. The payload line prints before the first call, so the cost is
 * visible before anything spends. Exit 4 rechecks health: a dead server or a
 * commit that changed mid-run stops the arm, otherwise the same call is
 * spawned once more and judged. Exit 2, exit 3 and exit 130 stop the arm.
 * Every spawn reaches calls.jsonl before any stop, so a stopped run keeps its
 * records. A stop prints its line and the finished-row count and returns
 * without a verdict. A pick of none_of_these, and an unstable row, keep the
 * union.
 *
 * @param {Array<{ id: string, hub: string, prompt: string, intents: string[], perIntentKeys: Object<string, string[]>, predKeys: string[], goldKeys: string[] }>} rows - The tied scored rows from runReplay.
 * @param {{ choice: 'union'|'first', baseF1: Map<string, number> }} baseline - The chosen baseline.
 * @param {{ cmd: Array<string>, model: string, modelCommit: string, sourceCommit: string }} gate - Passed deem health result.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, outDir: string | null, repoRoot: string, timeoutMs: number }} ctx - Output sink, environment, records directory, repository root and call timeout.
 * @returns {Promise<Object>} The counts with outcome, reason, p and the verdict line, or `{ stopped }`.
 */
async function runDeemArm(rows, baseline, gate, ctx) {
  const { out, env, outDir, repoRoot, timeoutMs } = ctx;
  const K = rows.length;
  out(`deem: nothing leaves the machine planned_calls=${3 * K} est_wall_s=${(3 * K * DEEM_P50_MS / 1000).toFixed(1)}`);

  const picks = new Map();

  /**
   * Print a stop's line and the rows that finished before it.
   *
   * @param {string} line - The stop line to print.
   * @param {number} finished - Rows that finished before the stop.
   * @returns {{ stopped: string }} The arm's stop result.
   */
  function stop(line, finished) {
    out(line);
    out(`deem: partial_rows=${finished}`);
    return { stopped: line };
  }

  /**
   * One choice spawn, with the exit-4 retry. The caller's persist records
   * every spawn before a stop can be reported, so a stop still leaves that
   * call on disk.
   *
   * @param {Array<string>} args - Arguments after the health command prefix.
   * @param {string} text - The row prompt, written to stdin.
   * @param {(result: { code: number|null, stdout: string, wallMs: number, timedOut: boolean }) => void} persist - Records one spawn.
   * @returns {Promise<{ r: { code: number|null, stdout: string, wallMs: number, timedOut: boolean }, stop?: string }>} The final result and any stop line.
   */
  async function deemCall(args, text, persist) {
    let r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], text, env, timeoutMs);
    persist(r);
    if (r.code === 4) {
      const health = readDeemHealth(gate.cmd, env);
      if (!health.ok) return { r, stop: 'deem arm stopped: server gone' };
      if (health.modelCommit !== gate.modelCommit || health.sourceCommit !== gate.sourceCommit) {
        return { r, stop: 'deem arm stopped: model commit changed mid-run' };
      }
      r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], text, env, timeoutMs);
      persist(r);
    }
    /** @type {string | undefined} */
    let stopLine;
    if (r.code === 2) stopLine = 'deem arm stopped: usage error';
    else if (r.code === 3) stopLine = 'deem arm stopped: backend refused';
    else if (r.code === 130) stopLine = 'deem arm stopped: interrupted';
    return { r, stop: stopLine };
  }

  let finished = 0;
  for (const row of rows) {
    const keys = [...row.intents, NONE_KEY];
    const router = parseRouter(fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', row.hub, 'ROUTER.md'), 'utf8'));
    const texts = intentTexts(router, keys);
    const rowPicks = [];
    const orders = rotations(keys);

    for (let order = 0; order < orders.length; order += 1) {
      const args = ['choice', '-q', CHOICE_INSTRUCTION, ...optionArgs(orders[order], texts)];
      const outcome = await deemCall(args, row.prompt, (result) => {
        const fields = judgeChoice(result, keys);
        writeCall(outDir, {
          kind: 'choice',
          backend: 'deem',
          row_id: row.id,
          order,
          wall_ms: result.wallMs,
          exit_code: result.code,
          pick: fields.pick,
          pick_prob: fields.pickProb,
          status: fields.status,
          model: gate.model,
          model_commit: gate.modelCommit,
          source_commit: gate.sourceCommit
        });
      });
      if (outcome.stop) return stop(outcome.stop, finished);
      rowPicks.push(judgeChoice(outcome.r, keys).pick);
    }

    picks.set(row.id, rowPicks);
    finished += 1;
  }

  let M = 0;
  let SA = 0;
  let SB = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  for (const row of rows) {
    const answers = picks.get(row.id);
    if (!Array.isArray(answers) || answers.length !== ORDERS) continue;
    if (!answers.every((answer) => typeof answer === 'string')) continue;
    M += 1;
    const { pick, top } = modalPick(answers);
    F += ORDERS - top;
    const picked = pick === null || pick === NONE_KEY ? row.predKeys : (row.perIntentKeys[pick] || []);
    const columnF1 = scoreRow(picked, row.goldKeys).f1;
    const baselineF1 = baseline.baseF1.get(row.id);
    SA += columnF1;
    SB += baselineF1;
    if (columnF1 > baselineF1) W += 1;
    else if (columnF1 < baselineF1) L += 1;
  }
  const counts = { K, M, SA, SB, W, L, F };
  const decision = decideVerdict(counts);
  const line = verdictLine('deem', counts, decision, 'baseline=' + baseline.choice + ' model=' + gate.model + ' model_commit=' + gate.modelCommit + ' source_commit=' + gate.sourceCommit);
  out(line);
  return { ...counts, outcome: decision.outcome, reason: decision.reason, p: decision.p, line };
}

/**
 * The Jev choice arm: one auth test, then three rotated choice calls per tied
 * row, then the verdict. The payload line prints before any call, so the cost
 * is visible before anything spends. A spawn that exits 4 is recorded as
 * unmeasured and the same call is spawned once more after the backoff; the
 * second result is judged. Exit 2, exit 3 and exit 130 stop the arm. Every
 * spawn reaches calls.jsonl before any stop, so a stopped run keeps its
 * records. A stop prints its line and the finished-row count and returns
 * without a verdict. A pick of none_of_these, and an unstable row, keep the
 * union.
 *
 * @param {Array<{ id: string, hub: string, prompt: string, intents: string[], perIntentKeys: Object<string, string[]>, predKeys: string[], goldKeys: string[] }>} rows - The tied scored rows from runReplay.
 * @param {{ choice: 'union'|'first', baseF1: Map<string, number> }} baseline - The chosen baseline.
 * @param {{ path: string, provider: string }} gate - Passed jev gate result.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, outDir: string | null, repoRoot: string, timeoutMs: number, backoffMs: number }} ctx - Output sink, environment, records directory, repository root, call timeout and exit-4 retry wait.
 * @returns {Promise<Object>} The counts with outcome, reason, p and the verdict line, or `{ stopped }`.
 */
async function runJevArm(rows, baseline, gate, ctx) {
  const { out, env, outDir, repoRoot, timeoutMs, backoffMs } = ctx;
  const K = rows.length;
  const provider = gate.provider;
  let model = 'unknown';

  let chars = 0;
  for (const row of rows) {
    const keys = [...row.intents, NONE_KEY];
    const router = parseRouter(fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', row.hub, 'ROUTER.md'), 'utf8'));
    const texts = intentTexts(router, keys);
    chars += row.prompt.length + CHOICE_INSTRUCTION.length;
    for (const key of keys) chars += key.length + texts.get(key).length + 1;
  }
  chars *= 3;
  out(`jev: payload=committed playbook prompts, intent keys and RESOURCE_MAP paths planned_calls=${3 * K + 1} est_input_tokens=${Math.ceil(chars / 4)}`);

  /**
   * One spawn with the exit-4 retry. The caller's judge records every spawn
   * before a stop can be reported, so a stop still leaves that call on disk.
   *
   * @param {Array<string>} args - Arguments after the executable.
   * @param {string} text - Text written to the child's stdin.
   * @param {{ kind: string, row_id: string | null, order: number | null }} fields - The fields that name this spawn in its record.
   * @returns {Promise<{ code: number|null, stdout: string, stderr: string, wallMs: number, timedOut: boolean }>} The final spawn's result.
   */
  async function call(args, text, fields) {
    let result = await spawnClassifierCall({ file: gate.path, args, stdin: text, env, timeoutMs, report: out });
    if (result.code === 4) {
      writeCall(outDir, {
        kind: fields.kind,
        backend: 'jev',
        row_id: fields.row_id,
        order: fields.order,
        wall_ms: result.wallMs,
        exit_code: result.code,
        pick: null,
        pick_prob: null,
        status: 'unmeasured',
        jev_version: '0.6.2',
        provider,
        model
      });
      await new Promise((done) => { setTimeout(done, backoffMs); });
      result = await spawnCall(gate.path, args, text, env, timeoutMs);
    }
    return result;
  }

  /**
   * Print a stop's line and the rows that finished before it.
   *
   * @param {string} line - The stop line to print.
   * @param {number} finished - Rows that finished before the stop.
   * @returns {{ stopped: string }} The arm's stop result.
   */
  function stop(line, finished) {
    out(line);
    out(`jev: partial_rows=${finished}`);
    return { stopped: line };
  }

  const auth = await call(['auth', 'test', '--provider', provider], '', { kind: 'auth_test', row_id: null, order: null });
  if (auth.code === 0) {
    try {
      const body = JSON.parse(auth.stdout);
      if (typeof body.model === 'string') model = body.model;
    } catch {
      // A non-JSON body leaves the model unknown.
    }
  }
  writeCall(outDir, {
    kind: 'auth_test',
    backend: 'jev',
    row_id: null,
    order: null,
    wall_ms: auth.wallMs,
    exit_code: auth.code,
    pick: null,
    pick_prob: null,
    status: auth.code === 0 ? 'measured' : 'unmeasured',
    jev_version: '0.6.2',
    provider,
    model
  });
  if (auth.code === 3) return stop('jev arm stopped: key rejected', 0);
  if (auth.code === 130) return stop('jev arm stopped: interrupted', 0);
  if (auth.code !== 0) return stop('jev arm stopped: auth test failed', 0);
  out(`jev: auth_test provider=${provider} model=${model}`);

  const picks = new Map();
  let finished = 0;
  for (const row of rows) {
    const keys = [...row.intents, NONE_KEY];
    const router = parseRouter(fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', row.hub, 'ROUTER.md'), 'utf8'));
    const texts = intentTexts(router, keys);
    const rowPicks = [];
    const orders = rotations(keys);

    for (let order = 0; order < orders.length; order += 1) {
      const args = ['choice', '--provider', provider, '-q', CHOICE_INSTRUCTION, ...optionArgs(orders[order], texts)];
      const result = await call(args, row.prompt, { kind: 'choice', row_id: row.id, order });
      const fields = judgeChoice(result, keys);
      if (fields.status === 'measured') {
        try {
          const body = JSON.parse(result.stdout);
          if (typeof body.model === 'string') model = body.model;
        } catch {
          // judgeChoice already parsed this measured body; a failure here leaves the model as it was.
        }
      }
      writeCall(outDir, {
        kind: 'choice',
        backend: 'jev',
        row_id: row.id,
        order,
        wall_ms: result.wallMs,
        exit_code: result.code,
        pick: fields.pick,
        pick_prob: fields.pickProb,
        status: fields.status,
        jev_version: '0.6.2',
        provider,
        model
      });
      /** @type {string | undefined} */
      let stopLine;
      if (result.code === 2) stopLine = 'jev arm stopped: usage error';
      else if (result.code === 3) stopLine = 'jev arm stopped: key rejected';
      else if (result.code === 130) stopLine = 'jev arm stopped: interrupted';
      if (stopLine !== undefined) return stop(stopLine, finished);
      rowPicks.push(fields.pick);
    }

    picks.set(row.id, rowPicks);
    finished += 1;
  }

  let M = 0;
  let SA = 0;
  let SB = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  for (const row of rows) {
    const answers = picks.get(row.id);
    if (!Array.isArray(answers) || answers.length !== ORDERS) continue;
    if (!answers.every((answer) => typeof answer === 'string')) continue;
    M += 1;
    const { pick, top } = modalPick(answers);
    F += ORDERS - top;
    const picked = pick === null || pick === NONE_KEY ? row.predKeys : (row.perIntentKeys[pick] || []);
    const columnF1 = scoreRow(picked, row.goldKeys).f1;
    const baselineF1 = baseline.baseF1.get(row.id);
    SA += columnF1;
    SB += baselineF1;
    if (columnF1 > baselineF1) W += 1;
    else if (columnF1 < baselineF1) L += 1;
  }
  const counts = { K, M, SA, SB, W, L, F };
  const decision = decideVerdict(counts);
  const line = verdictLine('jev', counts, decision, 'baseline=' + baseline.choice + ' jev_version=0.6.2 provider=' + provider + ' model=' + model);
  out(line);
  return { ...counts, outcome: decision.outcome, reason: decision.reason, p: decision.p, line };
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. CLI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the replay CLI flags.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @returns {{ report: string | null, transcripts: string | null, prose: string | null, jev: boolean, deem: boolean, out: string | null, error: string | null }} Parsed flags, or the first argument error.
 */
function parseArgs(argv) {
  const args = { report: null, transcripts: null, prose: null, jev: false, deem: false, out: null, error: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--jev' || token === '--deem') {
      if (token === '--jev') args.jev = true;
      else args.deem = true;
      continue;
    }
    if (token !== '--report' && token !== '--transcripts' && token !== '--prose' && token !== '--out') {
      args.error = 'unknown argument ' + token;
      return args;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) {
      args.error = 'missing value for ' + token;
      return args;
    }
    if (token === '--report') args.report = value;
    else if (token === '--transcripts') args.transcripts = value;
    else if (token === '--prose') args.prose = value;
    else args.out = value;
    i += 1;
  }
  return args;
}

/**
 * Run the replay report: the per-hub and total keyword-arm lines, the read
 * recount behind --transcripts, the replay verdict behind --prose, and the
 * JSON report behind --report. Zero model calls: the tie-break arms stay
 * dormant behind their switches.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @param {{ out?: (line: string) => void, err?: (line: string) => void, repoRoot?: string, env?: Record<string, string | undefined> }} [deps] - Injectable output sinks, repository root and environment.
 * @returns {Promise<number>} The process exit code.
 */
async function main(argv, deps = {}) {
  const out = deps.out || ((line) => process.stdout.write(line + '\n'));
  const err = deps.err || ((line) => process.stderr.write('[leaf-route-replay] ' + line + '\n'));
  const env = deps.env || process.env;

  const args = parseArgs(argv);
  if (args.error) {
    err('error: ' + args.error);
    err(USAGE);
    return 2;
  }

  if ((args.jev || args.deem) && !args.out) {
    err('error: --jev and --deem need --out <dir>');
    return 2;
  }

  if (args.transcripts) {
    const stat = fs.statSync(args.transcripts, { throwIfNoEntry: false });
    if (!stat || !stat.isDirectory()) {
      err('error: --transcripts is not a directory: ' + args.transcripts);
      return 2;
    }
  }

  if (args.prose) {
    const stat = fs.statSync(args.prose, { throwIfNoEntry: false });
    if (!stat || !stat.isFile()) {
      err('error: --prose is not a readable file: ' + args.prose);
      return 2;
    }
  }

  const repoRoot = deps.repoRoot || REPO_ROOT;

  const replay = runReplay(HUBS, repoRoot);
  for (const hub of HUBS) out(hubLine(hub, replay.hubs[hub]));
  out(totalLine(replay.totals));

  let readCount = null;
  if (args.transcripts) {
    readCount = countRouterReads(args.transcripts);
    for (const line of routerReadLines(readCount)) out(line);
  } else {
    out('router reads: not measured');
  }

  const verdict = replayVerdict(replay.rows, args.prose ? readProse(args.prose) : null);
  out(verdict.line);

  if (args.report) {
    fs.mkdirSync(args.report, { recursive: true });
    const report = {
      hubs: replay.hubs,
      totals: replay.totals,
      routerReads: readCount,
      replayVerdict: verdict
    };
    fs.writeFileSync(path.join(args.report, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  }

  if (args.jev || args.deem) {
    const tiedRows = replay.rows.filter((row) => row.intents.length >= 2);
    const baseline = chooseBaseline(tiedRows);
    out(`tied: K=${tiedRows.length}`);
    out(`baseline: ${baseline.choice}`);
    out(MARGIN_LINE);
    out('keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(SA-SB) >= M, sign test p < 0.05, flips 10*F <= 3*M');
    out('instruction: -q "' + CHOICE_INSTRUCTION + '"');

    const columns = {};
    if (improvableCount(baseline.baseF1) < HEADROOM_MIN_IMPROVABLE) {
      out('no headroom');
    } else {
      if (args.jev) {
        const gate = jevGate({ out, env });
        columns.jev = gate.passed
          ? await runJevArm(tiedRows, baseline, gate, { out, env, outDir: args.out, repoRoot, timeoutMs: JEV_TIMEOUT_MS, backoffMs: BACKOFF_MS })
          : { skipped: true };
      }
      if (args.deem) {
        const gate = deemGate({ out, env, repoRoot });
        columns.deem = gate.passed
          ? await runDeemArm(tiedRows, baseline, gate, { out, env, outDir: args.out, repoRoot, timeoutMs: DEEM_TIMEOUT_MS })
          : { skipped: true };
      }
    }

    const reportDir = args.report || args.out;
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, 'report.json'), JSON.stringify({
      hubs: replay.hubs,
      totals: replay.totals,
      routerReads: readCount,
      replayVerdict: verdict,
      columns
    }, null, 2) + '\n');
  }
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  NONE_KEY,
  AMBIGUITY_DELTA,
  WORD_BOUNDARY_KEYWORDS,
  HEADROOM_MIN_IMPROVABLE,
  MARGIN_LINE,
  CHOICE_INSTRUCTION,
  NONE_DESCRIPTION,
  ORDERS,
  JEV_VERSION,
  DEEM_MODEL,
  HEALTH_TIMEOUT_MS,
  JEV_TIMEOUT_MS,
  DEEM_TIMEOUT_MS,
  BACKOFF_MS,
  DEEM_P50_MS,
  REPO_CLI_DEEM,
  parseRouter,
  keywordHits,
  scoreIntents,
  selectIntents,
  loadHubModes,
  loadAliasEntries,
  toPairs,
  loadGold,
  scoreRow,
  runReplay,
  hubLine,
  totalLine,
  countRouterReads,
  routerReadLines,
  readProse,
  replayVerdict,
  which,
  jevGate,
  deemCommand,
  readDeemHealth,
  deemGate,
  spawnCall,
  writeCall,
  rotations,
  optionArgs,
  judgeChoice,
  intentTexts,
  runJevArm,
  runDeemArm,
  chooseBaseline,
  improvableCount,
  tailP,
  modalPick,
  decideVerdict,
  formatP,
  verdictLine,
  parseArgs,
  main
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
