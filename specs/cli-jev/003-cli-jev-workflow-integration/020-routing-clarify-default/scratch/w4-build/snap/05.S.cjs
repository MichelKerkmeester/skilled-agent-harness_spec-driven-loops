#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-clarify-default — clarify census and default-pick scorer           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * score-clarify-default.cjs — replays committed prompts through each compiled
 * hub engine, read only, and counts clarify outcomes. It never calls a model
 * unless a later switch asks.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const scenarios = require('./validate-compiled-routing-scenarios.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NONE_KEY = 'none_of_these';
const SOURCES = Object.freeze(['canary', 'playbook', 'corpus']);
const ACTIONS = Object.freeze(['route', 'clarify', 'defer', 'reject']);
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const COMPILED_ROUTE_MODULE = '.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs';
const CANARY_ROOT = '.skilled/bin/lib/compiled-routing';
const CORPUS_DIR = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
const CORPUS_FILES = Object.freeze(['labeled-prompts.jsonl', 'holdout-prompts.jsonl']);
const USAGE = 'usage: score-clarify-default.cjs [--report <dir>] [--rows-out <file>] [--transcripts <dir>] | --score <rows file>';

// The front door prints `hubId` then `action`; a transcript may hold that line JSON-escaped once or more, so any run of backslashes may precede a quote.
const FRONT_DOOR_PATTERN = /\\*"hubId\\*"\s*:\s*\\*"([A-Za-z0-9_.-]+)\\*"\s*,\s*\\*"action\\*"\s*:\s*\\*"(route|clarify|defer|reject)\\*"/g;

// These fix the call shape and the keep rule before any model call, so a change here is an amendment.
const LABEL_GATE = 30;
const CHOICE_INSTRUCTION = 'Which workflow mode should handle this request?';
const NONE_DESCRIPTION = 'None of these modes';
const ORDERS = 3;
const MARGIN_LINE = 'margin: 0.10';
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M';

// ─────────────────────────────────────────────────────────────────────────────
// 3. CENSUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a zeroed census cell for one hub/source pair.
 *
 * @returns {{ prompts: number, unparsed: number, route: number, clarify: number, defer: number, reject: number, clarifyMode: number, clarifyChecklist: number, goldInAlternatives: number }} A fresh counter set.
 */
function emptyCell() {
  return {
    prompts: 0,
    unparsed: 0,
    route: 0,
    clarify: 0,
    defer: 0,
    reject: 0,
    clarifyMode: 0,
    clarifyChecklist: 0,
    goldInAlternatives: 0
  };
}

/**
 * Reduce a clarify decision's alternatives to its mode picks: drop the
 * none-of-these entry, then keep the list only when something is left and
 * every entry names a mode the hub declares. Anything else is the checklist
 * form, which the census counts apart.
 *
 * @param {unknown} alternatives - The engine's clarify alternatives list.
 * @param {Set<string>} modes - The hub's declared workflow modes.
 * @returns {Array<string> | null} The mode alternatives, or null when this is not a mode-pick list.
 */
function modeAlternatives(alternatives, modes) {
  if (!Array.isArray(alternatives)) return null;

  const picked = alternatives.filter((entry) => entry !== NONE_KEY);
  if (picked.length === 0) return null;
  return picked.every((entry) => modes.has(entry)) ? picked : null;
}

/**
 * Replay committed prompts through their hub engines and tally what each
 * engine decided, per hub and source, plus one row per mode-pick clarify.
 *
 * @param {Array<{ id: string, hub: string, source: string, prompt: string | null, gold: string | null }>} prompts - The committed prompt records, replayed in order.
 * @param {(hub: string) => { snapshot: object, evaluate: (snapshot: object, input: { prompt: string }) => object }} engineFor - Resolve a hub's engine; may throw for an unknown hub.
 * @param {(hub: string) => Set<string>} modesFor - Resolve a hub's declared workflow modes.
 * @returns {{ cells: Object, rows: Array<object> }} The per-hub/source census cells and the clarify rows.
 */
function runCensus(prompts, engineFor, modesFor) {
  const cells = {};
  const rows = [];

  for (const record of prompts) {
    const { id, hub, source, prompt, gold } = record;

    if (!cells[hub]) cells[hub] = {};
    if (!cells[hub][source]) cells[hub][source] = emptyCell();
    const cell = cells[hub][source];
    cell.prompts += 1;

    if (typeof prompt !== 'string' || prompt.length === 0) {
      cell.unparsed += 1;
      continue;
    }

    let result;
    try {
      const { snapshot, evaluate } = engineFor(hub);
      result = evaluate(snapshot, { prompt });
    } catch {
      cell.unparsed += 1;
      continue;
    }

    const action = result.decision.action;
    if (!ACTIONS.includes(action)) {
      cell.unparsed += 1;
      continue;
    }
    cell[action] += 1;

    if (action !== 'clarify') continue;

    const alternatives = modeAlternatives(
      result.decision.clarify && result.decision.clarify.alternatives,
      modesFor(hub)
    );

    if (alternatives === null) {
      cell.clarifyChecklist += 1;
      continue;
    }

    cell.clarifyMode += 1;
    const keptGold = alternatives.includes(gold) ? gold : null;
    if (keptGold !== null) cell.goldInAlternatives += 1;
    rows.push({ id, hub, source, prompt, alternatives, gold: keptGold });
  }

  return { cells, rows };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROMPT SOURCES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read one hub's mode registry: the workflow modes it declares and each
 * mode's packet. A missing or malformed registry contributes nothing rather
 * than failing the census.
 *
 * @param {string} repoRoot - Repository root.
 * @param {string} hub - Hub id, the directory name under `.skilled/skills`.
 * @returns {{ modes: Set<string>, packets: Map<string, string> }} Declared modes and their mode-to-packet map; both empty on a read or parse failure.
 */
function readRegistry(repoRoot, hub) {
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', hub, 'mode-registry.json'), 'utf8'));
    const modes = new Set();
    const packets = new Map();
    for (const entry of registry.modes || []) {
      if (!entry || typeof entry.workflowMode !== 'string') continue;
      modes.add(entry.workflowMode);
      if (typeof entry.packet === 'string') packets.set(entry.workflowMode, entry.packet);
    }
    return { modes, packets };
  } catch {
    return { modes: new Set(), packets: new Map() };
  }
}

/**
 * Resolve the hub that owns a skill id: the id itself when it names a hub,
 * otherwise the first hub, in key order, declaring it as a workflow mode or
 * mode packet.
 *
 * @param {string} skill - A skill id from the routing corpus.
 * @param {Object<string, { modes: Set<string>, packets: Map<string, string> }>} registries - Registries keyed by hub id.
 * @returns {string | null} The owning hub id, or null when no registry claims it.
 */
function hubForSkill(skill, registries) {
  if (Object.prototype.hasOwnProperty.call(registries, skill)) return skill;
  for (const [hub, registry] of Object.entries(registries)) {
    if (registry.modes.has(skill)) return hub;
    for (const packet of registry.packets.values()) {
      if (packet === skill) return hub;
    }
  }
  return null;
}

/**
 * Load the canary fixtures' prompts for every hub in the compiled-routing
 * map. A fixture that cannot be read or parsed contributes one unparsed
 * record, so the census counts it rather than dropping it.
 *
 * @param {string} repoRoot - Repository root.
 * @param {Object<string, string>} hubChild - Hub id -> compiled-routing child path.
 * @returns {Array<{ id: string, hub: string, source: string, prompt: string | null, gold: null }>} One record per canary case.
 */
function loadCanaryPrompts(repoRoot, hubChild) {
  const records = [];
  for (const [hub, child] of Object.entries(hubChild)) {
    let fixture;
    try {
      fixture = JSON.parse(fs.readFileSync(path.join(repoRoot, CANARY_ROOT, child, 'fixtures', 'canary-cases.v1.json'), 'utf8'));
    } catch {
      records.push({ id: hub + '/fixture', hub, source: 'canary', prompt: null, gold: null });
      continue;
    }
    const cases = Array.isArray(fixture.cases) ? fixture.cases : [];
    for (const c of cases) {
      records.push({
        id: String(c.id),
        hub,
        source: 'canary',
        prompt: typeof c.prompt === 'string' && c.prompt.length > 0 ? c.prompt : null,
        gold: null
      });
    }
  }
  return records;
}

/**
 * Load the manual-testing-playbook scenarios' prompts for every hub. A
 * scenario's expected workflow mode is gold only when it names a real mode;
 * the literal null/unknown placeholders are not gold.
 *
 * @param {string} repoRoot - Repository root.
 * @param {Array<string>} hubs - Hub ids to walk.
 * @returns {Array<{ id: string, hub: string, source: string, prompt: string | null, gold: string | null }>} One record per scenario file.
 */
function loadPlaybookPrompts(repoRoot, hubs) {
  const records = [];
  for (const hub of hubs) {
    const playbookDir = path.join(repoRoot, '.skilled', 'skills', hub, 'manual-testing-playbook');
    for (const file of scenarios.walkScenarioFiles(playbookDir)) {
      const parsed = scenarios.parseScenario(file);
      const expected = parsed.ok ? parsed.expectedWorkflowMode : null;
      const gold = typeof expected === 'string' && !['null', 'unknown'].includes(expected.toLowerCase())
        ? expected
        : null;
      records.push({
        id: (parsed.ok && parsed.id) || path.relative(repoRoot, file),
        hub,
        source: 'playbook',
        prompt: parsed.ok ? parsed.prompt : null,
        gold
      });
    }
  }
  return records;
}

/**
 * Load the routing-accuracy corpus rows whose top skill a compiled hub can
 * claim. Rows whose skill fires outside the compiled hubs stay in the
 * summary only and contribute no prompt record.
 *
 * @param {string} repoRoot - Repository root.
 * @param {Object<string, { modes: Set<string>, packets: Map<string, string> }>} registries - Registries keyed by hub id.
 * @returns {{ records: Array<{ id: string, hub: string, source: string, prompt: string | null, gold: null }>, summary: { rows: number, none: number, skillFiring: number, mapped: number, noCompiledHub: number, unparsedLines: number } }} Corpus prompt records and the corpus tally.
 */
function loadCorpusPrompts(repoRoot, registries) {
  const records = [];
  const summary = { rows: 0, none: 0, skillFiring: 0, mapped: 0, noCompiledHub: 0, unparsedLines: 0 };

  for (const file of CORPUS_FILES) {
    let text;
    try {
      text = fs.readFileSync(path.join(repoRoot, CORPUS_DIR, file), 'utf8');
    } catch {
      continue;
    }
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (line.length === 0) continue;
      const n = i + 1;

      let row;
      try {
        row = JSON.parse(line);
      } catch {
        summary.unparsedLines += 1;
        continue;
      }
      if (!row || typeof row.skill_top_1 !== 'string') {
        summary.unparsedLines += 1;
        continue;
      }

      summary.rows += 1;
      if (row.skill_top_1 === 'none') {
        summary.none += 1;
        continue;
      }

      summary.skillFiring += 1;
      const hub = hubForSkill(row.skill_top_1, registries);
      if (hub === null) {
        summary.noCompiledHub += 1;
        continue;
      }

      summary.mapped += 1;
      records.push({
        id: String(row.id ?? file + ':' + n),
        hub,
        source: 'corpus',
        prompt: typeof row.prompt === 'string' && row.prompt.length > 0 ? row.prompt : null,
        gold: null
      });
    }
  }

  return { records, summary };
}

/**
 * Serialize clarify rows as JSONL lines, each carrying an empty label slot
 * for a later labeling pass to fill.
 *
 * @param {Array<object>} rows - Census clarify rows.
 * @returns {Array<string>} One JSON line per row.
 */
function rowLines(rows) {
  return rows.map((r) => JSON.stringify({
    id: r.id,
    hub: r.hub,
    source: r.source,
    prompt: r.prompt,
    alternatives: r.alternatives,
    gold: r.gold,
    label: ''
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TRANSCRIPTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Count front-door lines across a transcript directory, recursing into
 * subdirectories. A line counts once when it names at least one hub/action
 * pair, and each distinct pair on it counts once for its hub. Only counts
 * leave this function; transcript text never does.
 *
 * @param {string} dir - Directory to walk.
 * @returns {{ files: number, linesMatched: number, byHub: Object<string, { route: number, clarify: number, defer: number, reject: number }>, perFile: Array<{ file: string, lines: number }> }} The transcript count.
 */
function countTranscripts(dir) {
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

  const byHub = {};
  const perFile = [];
  let linesMatched = 0;

  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    let matched = 0;
    for (const line of lines) {
      const pairs = new Set();
      for (const match of line.matchAll(FRONT_DOOR_PATTERN)) pairs.add(match[1] + '\t' + match[2]);
      if (pairs.size === 0) continue;
      matched += 1;
      for (const pair of pairs) {
        const [hub, action] = pair.split('\t');
        if (!byHub[hub]) byHub[hub] = { route: 0, clarify: 0, defer: 0, reject: 0 };
        byHub[hub][action] += 1;
      }
    }
    linesMatched += matched;
    perFile.push({ file: path.relative(dir, file), lines: matched });
  }

  return { files: files.length, linesMatched, byHub, perFile };
}

/**
 * Format the transcript count: the file and matched-line totals, one line
 * per hub in sorted order, and the real clarify rate the transcripts show.
 *
 * @param {{ files: number, linesMatched: number, byHub: Object<string, { route: number, clarify: number, defer: number, reject: number }> }} result - countTranscripts output.
 * @returns {Array<string>} Transcript report lines.
 */
function transcriptLines(result) {
  const lines = [`transcripts: files=${result.files} lines_matched=${result.linesMatched}`];
  let clarify = 0;
  let total = 0;
  for (const hub of Object.keys(result.byHub).sort()) {
    const cell = result.byHub[hub];
    lines.push(`transcript hub=${hub} route=${cell.route} clarify=${cell.clarify} defer=${cell.defer} reject=${cell.reject}`);
    clarify += cell.clarify;
    total += cell.route + cell.clarify + cell.defer + cell.reject;
  }
  lines.push(`real clarify rate: ${clarify}/${total}`);
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SCORER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read a rows file: one JSON record per non-blank line. A line that does not
 * parse names its 1-based line number, because skipping it silently would
 * score a shorter file than the operator believes.
 *
 * @param {string} file - Path to the JSONL rows file.
 * @returns {Array<object>} The parsed rows, in file order.
 */
function readRows(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const rows = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line.length === 0) continue;
    try {
      rows.push(JSON.parse(line));
    } catch {
      throw new Error('line ' + (i + 1) + ' is not JSON');
    }
  }
  return rows;
}

/**
 * Resolve each row's pick from its label, else its committed gold, and split
 * the rows into picks the row itself offers and picks that name something
 * outside its own alternatives.
 *
 * @param {Array<object>} rows - Parsed rows records.
 * @returns {{ labeled: Array<object>, foreign: Array<{ id: string, value: string }> }} Rows carrying a resolvable value, and the out-of-set picks.
 */
function labelRows(rows) {
  const labeled = [];
  const foreign = [];

  for (const row of rows) {
    const label = typeof row.label === 'string' && row.label.trim().length > 0 ? row.label.trim() : null;
    const gold = typeof row.gold === 'string' && row.gold.length > 0 ? row.gold : null;
    const value = label !== null ? label : gold;
    if (value === null) continue;

    if (![...row.alternatives, NONE_KEY].includes(value)) {
      foreign.push({ id: row.id, value });
      continue;
    }
    labeled.push({ ...row, value, valueSource: label !== null ? 'label' : 'gold' });
  }

  return { labeled, foreign };
}

/**
 * Resolve each mode key to the option text the clarify choice shows: the
 * packet's own description, with the none key fixed to its constant. Two keys
 * sharing one text each gain their key, because the local classifier refuses
 * two options with one description.
 *
 * @param {string} repoRoot - Repository root.
 * @param {string} hub - Hub id, the directory name under `.skilled/skills`.
 * @param {Array<string>} keys - Mode keys to describe.
 * @returns {Map<string, string>} Key -> option text.
 */
function describeModes(repoRoot, hub, keys) {
  const packets = readRegistry(repoRoot, hub).packets;
  const texts = new Map();

  for (const key of keys) {
    if (key === NONE_KEY) {
      texts.set(key, NONE_DESCRIPTION);
      continue;
    }

    const packet = packets.get(key);
    if (packet === undefined) throw new Error('no description for mode ' + hub + '/' + key);

    let skill;
    try {
      skill = fs.readFileSync(path.join(repoRoot, '.skilled', 'skills', hub, packet, 'SKILL.md'), 'utf8');
    } catch {
      throw new Error('no description for mode ' + hub + '/' + key);
    }

    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skill);
    const line = frontmatter && /^description:[ \t]*(.*)$/m.exec(frontmatter[1]);
    if (!line) throw new Error('no description for mode ' + hub + '/' + key);

    let text = line[1].trim();
    if (text.length >= 2 && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))) {
      text = text.slice(1, -1);
    }
    texts.set(key, text);
  }

  const counts = new Map();
  for (const text of texts.values()) counts.set(text, (counts.get(text) || 0) + 1);

  const modes = new Map();
  for (const [key, text] of texts) modes.set(key, counts.get(text) > 1 ? text + ' [' + key + ']' : text);
  return modes;
}

/**
 * Digest the option set the labeled rows describe: the distinct hub/key/text
 * triples, sorted, as a count and the sha256 of their newline join, so a
 * scored run can prove which option texts it measured.
 *
 * @param {Array<object>} labeled - labelRows labeled output.
 * @param {string} repoRoot - Repository root.
 * @returns {{ count: number, sha256: string }} The distinct option count and digest.
 */
function optionsDigest(labeled, repoRoot) {
  const options = new Set();
  for (const row of labeled) {
    for (const [key, text] of describeModes(repoRoot, row.hub, [...row.alternatives, NONE_KEY])) {
      options.add(row.hub + '/' + key + '=' + text);
    }
  }
  const sorted = [...options].sort();
  return {
    count: sorted.length,
    sha256: crypto.createHash('sha256').update(sorted.join('\n')).digest('hex')
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. VERDICT
// ─────────────────────────────────────────────────────────────────────────────

// Counts stay integers and every binomial tail is an exact BigInt sum over
// 2^n, so no rounding decides a verdict.

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
 * The answer named at least twice, with its count. No key reaching two names
 * no winner and reports top 0, so an unstable row counts every order as a
 * non-modal pick.
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
 * sign test, flips. Every outcome carries p, the sign test's exact tail.
 *
 * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - The column's counts.
 * @returns {{ outcome: 'keep' | 'kill' | 'stop', reason: 'coverage' | 'margin' | 'sign test' | 'flips' | null, p: number }} The decision.
 */
function decideVerdict({ K, M, A, B, W, L, F }) {
  const sign = tailP(W + L, W);
  if (!(10 * M >= 9 * K)) return { outcome: 'stop', reason: 'coverage', p: sign.p };
  const kill = tailP(W + L, L);
  if (W + L > 0 && 20n * kill.num <= kill.den) return { outcome: 'kill', reason: null, p: sign.p };
  if (!(10 * (A - B) >= M)) return { outcome: 'stop', reason: 'margin', p: sign.p };
  if (!(W + L > 0 && 20n * sign.num < sign.den)) return { outcome: 'stop', reason: 'sign test', p: sign.p };
  if (!(10 * F <= 3 * M)) return { outcome: 'stop', reason: 'flips', p: sign.p };
  return { outcome: 'keep', reason: null, p: sign.p };
}

/**
 * One column's counts. A row is measured only when its record holds exactly
 * one answer per order and every answer is a string; every other row stays
 * unmeasured. An unstable or abstained pick is wrong for the column, and the
 * votes a pick lacks add to the flip count.
 *
 * @param {Array<{ id: string, alternatives: Array<string>, value: string }>} labeled - Kept rows.
 * @param {Map<string, Array<string | null>>} answersById - Row id to submitted keys in call order.
 * @returns {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number, unstable: number, abstained: number }} The column's counts.
 */
function scoreColumn(labeled, answersById) {
  const K = labeled.length;
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;
  let unstable = 0;
  let abstained = 0;

  for (const row of labeled) {
    const answers = answersById.get(row.id);
    if (!Array.isArray(answers) || answers.length !== ORDERS) continue;
    if (!answers.every((answer) => typeof answer === 'string')) continue;

    M += 1;
    const { pick, top } = modalPick(answers);
    F += ORDERS - top;
    if (pick === null) unstable += 1;
    if (pick === NONE_KEY) abstained += 1;

    const colRight = pick === row.value;
    const baseRight = row.alternatives[0] === row.value;
    if (colRight) A += 1;
    if (baseRight) B += 1;
    if (colRight && !baseRight) W += 1;
    if (baseRight && !colRight) L += 1;
  }

  return { K, M, A, B, W, L, F, unstable, abstained };
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
 * @param {{ K: number, M: number, A: number, B: number, W: number, L: number, F: number }} counts - The column's counts.
 * @param {{ outcome: 'keep' | 'kill' | 'stop', reason: string | null, p: number }} decision - decideVerdict output.
 * @param {string} [suffix] - Appended to the line when non-empty.
 * @returns {string} The verdict line.
 */
function verdictLine(backend, counts, decision, suffix) {
  const label = decision.outcome === 'stop' ? 'stop (' + decision.reason + ')' : decision.outcome;
  let line = 'verdict ' + backend + ': ' + label
    + ' K=' + counts.K + ' M=' + counts.M + ' A=' + counts.A + ' B=' + counts.B
    + ' W=' + counts.W + ' L=' + counts.L + ' F=' + counts.F
    + ' p=' + formatP(decision.p);
  if (typeof suffix === 'string' && suffix !== '') line += ' ' + suffix;
  return line;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CLI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the census CLI flags.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @returns {{ report: string | null, rowsOut: string | null, transcripts: string | null, score: string | null, error: string | null }} Parsed flags, or the first argument error.
 */
function parseArgs(argv) {
  const args = { report: null, rowsOut: null, transcripts: null, score: null, error: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token !== '--report' && token !== '--rows-out' && token !== '--transcripts' && token !== '--score') {
      args.error = 'unknown argument ' + token;
      return args;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) {
      args.error = 'missing value for ' + token;
      return args;
    }
    if (token === '--report') args.report = value;
    else if (token === '--rows-out') args.rowsOut = value;
    else if (token === '--transcripts') args.transcripts = value;
    else args.score = value;
    i += 1;
  }
  if (args.score !== null && (args.report !== null || args.rowsOut !== null || args.transcripts !== null)) {
    args.error = '--score runs alone';
  }
  return args;
}

/**
 * Format the census report: a header, one line per hub/source cell, the
 * summed total, and the corpus coverage line.
 *
 * @param {Object} census - Cells keyed by hub, then source (runCensus output).
 * @param {{ rows: number, none: number, skillFiring: number, mapped: number, noCompiledHub: number, unparsedLines: number }} corpusSummary - Corpus tally.
 * @param {Array<string>} hubs - Hub ids, in report order.
 * @returns {Array<string>} Report lines.
 */
function censusLines(census, corpusSummary, hubs) {
  const fields = [
    ['prompts', 'prompts'],
    ['unparsed', 'unparsed'],
    ['route', 'route'],
    ['clarify', 'clarify'],
    ['defer', 'defer'],
    ['reject', 'reject'],
    ['clarifyMode', 'clarify_mode'],
    ['clarifyChecklist', 'clarify_checklist'],
    ['goldInAlternatives', 'gold_in_alternatives']
  ];
  const pairs = (cell) => fields.map(([key, label]) => `${label}=${cell[key]}`).join(' ');

  const totals = emptyCell();
  for (const sources of Object.values(census)) {
    for (const cell of Object.values(sources)) {
      for (const [key] of fields) totals[key] += cell[key];
    }
  }

  const lines = [`census: zero model calls, ${totals.prompts} prompts replayed through each hub's compiled engine`];
  for (const hub of hubs) {
    for (const source of SOURCES) {
      const cell = census[hub] && census[hub][source];
      if (cell) lines.push(`hub=${hub} source=${source} ${pairs(cell)}`);
    }
  }
  lines.push(`total ${pairs(totals)}`);
  lines.push(`corpus: rows=${corpusSummary.rows} none=${corpusSummary.none} skill_firing=${corpusSummary.skillFiring} mapped=${corpusSummary.mapped} no_compiled_hub=${corpusSummary.noCompiledHub} unparsed_lines=${corpusSummary.unparsedLines}`);
  return lines;
}

/**
 * Score a labeled rows file: gate the label count, report the first-alternative
 * baseline and the fixed keep rule, and say whether a ten-point gain still
 * fits. Arithmetic over the labels on disk only; no model call happens here.
 *
 * @param {{ score: string }} args - Parsed CLI flags.
 * @param {{ out: (line: string) => void, err: (line: string) => void, repoRoot: string }} deps - Output sinks and repository root.
 * @returns {number} The process exit code.
 */
function runScoreCommand(args, deps) {
  const { out, err, repoRoot } = deps;

  let rows;
  try {
    rows = readRows(args.score);
  } catch (error) {
    err('error: ' + error.message);
    return 2;
  }

  const { labeled, foreign } = labelRows(rows);
  if (foreign.length > 0) {
    for (const entry of foreign) {
      err('error: row ' + entry.id + ' label "' + entry.value + '" is not one of its alternatives or ' + NONE_KEY);
    }
    return 2;
  }

  const K = labeled.length;
  const operator = labeled.filter((row) => row.valueSource === 'label').length;
  const committedGold = labeled.filter((row) => row.valueSource === 'gold').length;
  out('rows: ' + rows.length + ' labeled=' + K + ' operator=' + operator + ' committed_gold=' + committedGold);

  if (K < LABEL_GATE) {
    out('stop: fewer than 30 labeled rows (' + K + ' labeled)');
    return 0;
  }

  const B = labeled.filter((row) => row.alternatives[0] === row.value).length;
  const digest = optionsDigest(labeled, repoRoot);
  out('baseline: first alternative right on ' + B + '/' + K);
  out(MARGIN_LINE);
  out(KEEP_RULE_LINE);
  out('instruction: -q "' + CHOICE_INSTRUCTION + '"');
  out('options: ' + digest.count + ' sha256=' + digest.sha256 + ' none="' + NONE_DESCRIPTION + '"');
  out('orders: ' + ORDERS + ', router order with none_of_these last, then rotated left by 1 and by 2');

  if (10 * B > 9 * K) {
    out('no headroom: the first alternative is right on ' + B + '/' + K + ', above 0.90');
    return 0;
  }
  out('headroom: a 10-point gain fits above ' + B + '/' + K);
  return 0;
}

/**
 * Run the clarify census and emit its report.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @param {{ out?: (line: string) => void, err?: (line: string) => void, repoRoot?: string }} [deps] - Injectable output sinks and repository root.
 * @returns {Promise<number>} The process exit code.
 */
async function main(argv, deps = {}) {
  const out = deps.out || ((line) => process.stdout.write(line + '\n'));
  const err = deps.err || ((line) => process.stderr.write(line + '\n'));

  const args = parseArgs(argv);
  if (args.error) {
    err('error: ' + args.error);
    err(USAGE);
    return 2;
  }

  const repoRoot = deps.repoRoot || REPO_ROOT;
  if (args.score) return runScoreCommand(args, { out, err, repoRoot });

  if (args.transcripts) {
    const stat = fs.statSync(args.transcripts, { throwIfNoEntry: false });
    if (!stat || !stat.isDirectory()) {
      err('error: --transcripts is not a directory: ' + args.transcripts);
      return 2;
    }
  }
  const transcriptCount = args.transcripts ? countTranscripts(args.transcripts) : null;

  const { loadHubEngine, HUB_CHILD } = require(path.join(repoRoot, COMPILED_ROUTE_MODULE));
  const hubs = Object.keys(HUB_CHILD);
  const registries = {};
  for (const hub of hubs) registries[hub] = readRegistry(repoRoot, hub);

  const canary = loadCanaryPrompts(repoRoot, HUB_CHILD);
  const playbook = loadPlaybookPrompts(repoRoot, hubs);
  const { records: corpus, summary } = loadCorpusPrompts(repoRoot, registries);

  const { cells, rows } = runCensus(
    [...canary, ...playbook, ...corpus],
    loadHubEngine,
    (hub) => (registries[hub] ? registries[hub].modes : new Set())
  );

  for (const line of censusLines(cells, summary, hubs)) out(line);
  if (transcriptCount) {
    for (const line of transcriptLines(transcriptCount)) out(line);
  } else {
    out('real clarify rate: not measured');
  }

  if (args.rowsOut) {
    fs.mkdirSync(path.dirname(args.rowsOut), { recursive: true });
    const lines = rowLines(rows);
    fs.writeFileSync(args.rowsOut, lines.length > 0 ? lines.join('\n') + '\n' : '');
    const withGold = rows.filter((r) => r.gold !== null).length;
    out(`rows written: ${rows.length} with_gold=${withGold} file=${args.rowsOut}`);
  }

  if (args.report) {
    fs.mkdirSync(args.report, { recursive: true });
    const rowsWithGold = rows.filter((r) => r.gold !== null).length;
    const clarifyTotal = transcriptCount ? Object.values(transcriptCount.byHub).reduce((sum, cell) => sum + cell.clarify, 0) : 0;
    const actionTotal = transcriptCount ? Object.values(transcriptCount.byHub).reduce((sum, cell) => sum + cell.route + cell.clarify + cell.defer + cell.reject, 0) : 0;
    const report = {
      cells,
      corpus: summary,
      realClarifyRate: transcriptCount ? { clarify: clarifyTotal, total: actionTotal } : null,
      transcripts: transcriptCount,
      rows: rows.length,
      rowsWithGold
    };
    fs.writeFileSync(path.join(args.report, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    out(`report written: ${args.report}/report.json`);
  }

  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  NONE_KEY,
  SOURCES,
  ACTIONS,
  emptyCell,
  modeAlternatives,
  runCensus,
  readRegistry,
  hubForSkill,
  loadCanaryPrompts,
  loadPlaybookPrompts,
  loadCorpusPrompts,
  rowLines,
  countTranscripts,
  transcriptLines,
  readRows,
  labelRows,
  describeModes,
  optionsDigest,
  tailP,
  modalPick,
  decideVerdict,
  scoreColumn,
  formatP,
  verdictLine,
  parseArgs,
  censusLines,
  main
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
