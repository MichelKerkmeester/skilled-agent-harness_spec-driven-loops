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
 * credential.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const rootRouter = require('./lib/root-router-contract.cjs');
const leafContract = require('./lib/leaf-resource-contract.cjs');
const scenarios = require('./validate-compiled-routing-scenarios.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const AMBIGUITY_DELTA = 1;

// The seven parent hubs this replay reports, in report order. Each ships a
// ROUTER.md.
const HUBS = Object.freeze(['sk-doc', 'mcp-tooling', 'system-deep-loop', 'cli-external-orchestration', 'sk-design', 'sk-code', 'cli-classifier']);
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const USAGE = 'usage: leaf-route-replay.cjs [--report <dir>] [--transcripts <dir>] [--prose <file>]';

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
 * composite keys and its score, so the prose comparison consumes one shared
 * replay instead of re-running the keyword arm.
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
// 9. BASELINE CHOICE
// ─────────────────────────────────────────────────────────────────────────────

// The kill and sign tests compare exact BigInt tails over 2^n, so no rounding
// decides either one.

/**
 * Pick the baseline for the tied rows: the union of every kept intent's
 * leaves, or the leaves of the first tied intent in declaration order,
 * whichever scores higher over those rows. A tie goes to the union, which is
 * what the keyword arm already serves unaided. The chosen arm's per-row keys
 * and F1 ride along with the choice.
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

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the replay CLI flags.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @returns {{ report: string | null, transcripts: string | null, prose: string | null, error: string | null }} Parsed flags, or the first argument error.
 */
function parseArgs(argv) {
  const args = { report: null, transcripts: null, prose: null, error: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token !== '--report' && token !== '--transcripts' && token !== '--prose') {
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
    else args.prose = value;
    i += 1;
  }
  return args;
}

/**
 * Run the replay report: the per-hub and total keyword-arm lines, the read
 * recount behind --transcripts, the replay verdict behind --prose, and the
 * JSON report behind --report. Zero model calls.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @param {{ out?: (line: string) => void, err?: (line: string) => void, repoRoot?: string }} [deps] - Injectable output sinks and repository root.
 * @returns {Promise<number>} The process exit code.
 */
async function main(argv, deps = {}) {
  const out = deps.out || ((line) => process.stdout.write(line + '\n'));
  const err = deps.err || ((line) => process.stderr.write('[leaf-route-replay] ' + line + '\n'));

  const args = parseArgs(argv);
  if (args.error) {
    err('error: ' + args.error);
    err(USAGE);
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

  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  AMBIGUITY_DELTA,
  WORD_BOUNDARY_KEYWORDS,
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
  chooseBaseline,
  parseArgs,
  main
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
