#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-clarify-default                                         ║
// ║ clarify census and default-pick scorer                                   ║
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

const { spawn, spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const scenarios = require('./validate-compiled-routing-scenarios.cjs');
const { spawnClassifierCall } = require('../../../cli-classifier/shared/scripts/jev-transport.mjs');
const scorerReport = require('../../../cli-classifier/shared/scripts/scorer-report.mjs');

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
const USAGE = 'usage: score-clarify-default.cjs [--report <dir>] [--rows-out <file>] [--transcripts <dir>] | --score <rows file> [--jev] [--out <dir>]';

// The front door prints `hubId` then `action`; a transcript may hold that line JSON-escaped once or more, so any run of backslashes may precede a quote.
const FRONT_DOOR_PATTERN = /\\*"hubId\\*"\s*:\s*\\*"([A-Za-z0-9_.-]+)\\*"\s*,\s*\\*"action\\*"\s*:\s*\\*"(route|clarify|defer|reject)\\*"/g;

// These fix the call shape and the keep rule before any model call, so a change here is an amendment.
const LABEL_GATE = 30;
const CHOICE_INSTRUCTION = 'Which workflow mode should handle this request?';
const NONE_DESCRIPTION = 'None of these modes';
const ORDERS = 3;
const EARLY_STOP_ORDERS = 2;
const MARGIN_LINE = 'margin: 0.10';
const KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, kill P(X >= L) <= 0.05, margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M';

const JEV_VERSION = 'jev 0.6.2';
const JEV_TIMEOUT_MS = 90000;
const BACKOFF_MS = 2000;
const JEV_PAYLOAD = 'committed canary, playbook and routing-corpus prompts and mode descriptions';

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
    label: '',
    label_approver: '',
    decision_reference: ''
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
  const options = optionEntries(labeled, repoRoot);
  const lines = options.map((option) => option.hub + '/' + option.key + '=' + option.text);
  return {
    count: options.length,
    sha256: crypto.createHash('sha256').update(lines.join('\n')).digest('hex')
  };
}

/**
 * Resolve the distinct option records measured by a labeled row set.
 *
 * @param {Array<object>} labeled - labelRows labeled output.
 * @param {string} repoRoot - Repository root.
 * @returns {Array<{ hub: string, key: string, text: string }>} Sorted option records.
 */
function optionEntries(labeled, repoRoot) {
  const options = new Map();
  for (const row of labeled) {
    for (const [key, text] of describeModes(repoRoot, row.hub, [...row.alternatives, NONE_KEY])) {
      const identity = row.hub + '/' + key + '=' + text;
      options.set(identity, { hub: row.hub, key, text });
    }
  }
  return [...options.keys()].sort().map((identity) => options.get(identity));
}

/**
 * Identify the compiled router inputs that decide a row.
 *
 * @param {object} router - Compiled routing module.
 * @param {string} repoRoot - Repository root.
 * @param {string} hub - Hub id.
 * @param {object} snapshot - Loaded compiled policy snapshot.
 * @param {string} runtimeSha256 - Digest of the compiled routing entry module.
 * @returns {object} Stable runtime and policy identity.
 */
function routerBuildIdentity(router, repoRoot, hub, snapshot, runtimeSha256) {
  const policy = snapshot && snapshot.policy;
  const hubChild = router.HUB_CHILD && router.HUB_CHILD[hub];
  if (!hubChild || !policy || typeof policy.effectivePolicyHash !== 'string'
    || policy.activationGeneration === undefined || policy.activationGeneration === null) {
    throw new Error('router identity is incomplete for hub ' + hub);
  }
  const childRoot = path.join(repoRoot, CANARY_ROOT, hubChild);
  const canaryRouter = path.join(childRoot, 'lib', 'canary-router.cjs');
  const routerSource = fs.existsSync(canaryRouter)
    ? canaryRouter
    : path.join(childRoot, 'lib', 'router.cjs');
  const snapshotLoader = path.join(childRoot, 'harness', 'build-artifacts.cjs');
  const identity = {
    runtimeModule: COMPILED_ROUTE_MODULE,
    runtimeSha256,
    hubChild,
    routerSource: path.relative(repoRoot, routerSource),
    routerSourceSha256: crypto.createHash('sha256')
      .update(fs.readFileSync(routerSource))
      .digest('hex'),
    snapshotLoader: path.relative(repoRoot, snapshotLoader),
    snapshotLoaderSha256: crypto.createHash('sha256')
      .update(fs.readFileSync(snapshotLoader))
      .digest('hex'),
    policyHash: policy.effectivePolicyHash,
    generation: policy.activationGeneration
  };
  return {
    ...identity,
    buildId: crypto.createHash('sha256').update(JSON.stringify(identity)).digest('hex')
  };
}

/**
 * Replay each supplied row against the loaded compiled router and pin the
 * runtime and policy identity used for that score.
 *
 * @param {Array<object>} rows - Rows read from the input JSONL.
 * @param {object} router - Compiled routing module.
 * @param {string} repoRoot - Repository root.
 * @returns {{ rows: Array<object>, buildIdentity: Object<string, object>, refused: Array<{ id: string, action: string }> }}
 *   Replayed rows, per-hub identity, and rows whose action no longer clarifies.
 */
function replayRows(rows, router, repoRoot) {
  const runtimeSha256 = crypto.createHash('sha256')
    .update(fs.readFileSync(path.join(repoRoot, COMPILED_ROUTE_MODULE)))
    .digest('hex');
  const engines = new Map();
  const modesByHub = new Map();
  const buildIdentity = {};
  const replayed = [];
  const refused = [];

  for (const row of rows) {
    const rowId = row && row.id !== undefined ? String(row.id) : '(unknown)';
    let engine;
    let evaluated;
    try {
      if (!engines.has(row.hub)) engines.set(row.hub, router.loadHubEngine(row.hub));
      engine = engines.get(row.hub);
      evaluated = engine.evaluate(engine.snapshot, { prompt: row.prompt });
    } catch (error) {
      throw new Error('row ' + rowId + ' replay failed: ' + error.message);
    }

    const decision = evaluated && evaluated.decision;
    if (!decision || decision.action !== 'clarify') {
      const action = decision && typeof decision.action === 'string' ? decision.action : 'unparsed';
      refused.push({ id: rowId, action });
      continue;
    }

    if (!modesByHub.has(row.hub)) modesByHub.set(row.hub, readRegistry(repoRoot, row.hub).modes);
    const rawAlternatives = decision.clarify && decision.clarify.alternatives;
    const alternatives = modeAlternatives(rawAlternatives, modesByHub.get(row.hub));
    if (alternatives === null) {
      throw new Error('row ' + rowId + ' replay is not a mode clarification');
    }
    if (!Array.isArray(row.alternatives)
      || JSON.stringify(alternatives) !== JSON.stringify(row.alternatives)) {
      throw new Error('row ' + rowId + ' replay alternatives changed');
    }

    if (!buildIdentity[row.hub]) {
      buildIdentity[row.hub] = routerBuildIdentity(
        router,
        repoRoot,
        row.hub,
        engine.snapshot,
        runtimeSha256
      );
    }
    const identity = buildIdentity[row.hub];
    replayed.push({
      ...row,
      replay: {
        action: decision.action,
        alternatives: Array.isArray(rawAlternatives) ? rawAlternatives : [],
        modeAlternatives: alternatives,
        buildId: identity.buildId,
        policyHash: identity.policyHash,
        generation: identity.generation
      }
    });
  }

  return { rows: replayed, buildIdentity, refused };
}

/**
 * Compute the three deterministic baselines for a labeled row set.
 *
 * @param {Array<object>} labeled - Rows carrying a resolvable value.
 * @returns {object} Correct counts and the strongest simple policy.
 */
function baselineScores(labeled) {
  const total = labeled.length;
  const first = labeled.filter((row) => row.alternatives[0] === row.value).length;
  const second = labeled.filter((row) => row.alternatives[1] === row.value).length;
  const alwaysNone = labeled.filter((row) => row.value === NONE_KEY).length;
  const candidates = [
    { policy: 'first-alternative', correct: first },
    { policy: 'second-alternative', correct: second },
    { policy: 'always-none', correct: alwaysNone }
  ];
  candidates.sort((a, b) => b.correct - a.correct || a.policy.localeCompare(b.policy));
  return {
    total,
    firstAlternative: { correct: first, total },
    secondAlternative: { correct: second, total },
    alwaysNone: { correct: alwaysNone, total },
    strongest: candidates[0]
  };
}

/**
 * Summarize deterministic baselines and an optional measured column by hub
 * and by whether the label names a mode or none of the offered modes.
 *
 * @param {Array<object>} labeled - Rows carrying a resolvable value.
 * @param {Map<string, Array<string|null>>} [answersById] - Optional picks by row.
 * @returns {Array<object>} Sorted hub/class result records.
 */
function classHubResults(labeled, answersById = null) {
  const groups = new Map();
  for (const row of labeled) {
    const labelClass = row.value === NONE_KEY ? 'none' : 'mode';
    const key = row.hub + '\n' + labelClass;
    if (!groups.has(key)) {
      groups.set(key, {
        hub: row.hub,
        class: labelClass,
        rows: 0,
        firstAlternative: 0,
        secondAlternative: 0,
        alwaysNone: 0,
        measured: 0,
        correct: 0
      });
    }
    const group = groups.get(key);
    group.rows += 1;
    if (row.alternatives[0] === row.value) group.firstAlternative += 1;
    if (row.alternatives[1] === row.value) group.secondAlternative += 1;
    if (row.value === NONE_KEY) group.alwaysNone += 1;

    const answers = answersById && answersById.get(row.id);
    if (Array.isArray(answers) && answers.length >= EARLY_STOP_ORDERS && answers.length <= ORDERS
      && answers.every((answer) => typeof answer === 'string')) {
      group.measured += 1;
      if (modalPick(answers).pick === row.value) group.correct += 1;
    }
  }

  return [...groups.values()]
    .sort((a, b) => a.hub.localeCompare(b.hub) || a.class.localeCompare(b.class))
    .map((group) => ({
      hub: group.hub,
      class: group.class,
      rows: group.rows,
      baselines: {
        firstAlternative: group.firstAlternative,
        secondAlternative: group.secondAlternative,
        alwaysNone: group.alwaysNone
      },
      model: answersById ? {
        measured: group.measured,
        correct: group.correct,
        accuracy: group.measured > 0 ? group.correct / group.measured : null
      } : null
    }));
}

/**
 * Format class and hub summaries for the score report.
 *
 * @param {Array<object>} results - classHubResults output.
 * @returns {Array<string>} Human-readable report lines.
 */
function classHubLines(results) {
  return results.map((result) => {
    let line = 'result: hub=' + result.hub + ' class=' + result.class + ' rows=' + result.rows
      + ' first=' + result.baselines.firstAlternative + '/' + result.rows
      + ' second=' + result.baselines.secondAlternative + '/' + result.rows
      + ' always_none=' + result.baselines.alwaysNone + '/' + result.rows;
    if (result.model) {
      line += ' jev=' + result.model.correct + '/' + result.model.measured;
      if (result.model.accuracy !== null) line += ' accuracy=' + result.model.accuracy.toFixed(4);
    }
    return line;
  });
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
 * One column's counts. A row is measured when its record holds a measured
 * answer for every order it ran, at least the early-stop minimum and no more
 * than all orders, with every answer a string; every other row stays
 * unmeasured. A row that stopped early carries only the votes it measured, so
 * the flips a pick lacks are counted over those measured votes alone. An
 * unstable or abstained pick is wrong for the column.
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
    if (!Array.isArray(answers) || answers.length < EARLY_STOP_ORDERS || answers.length > ORDERS) continue;
    if (!answers.every((answer) => typeof answer === 'string')) continue;

    M += 1;
    const { pick, top } = modalPick(answers);
    F += answers.length - top;
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
 * Count the probability-aware column: the measure rule is scoreColumn's, but
 * a counted row's pick is the key its measured votes' probabilities favor
 * rather than the key they name most often. Each counted row also feeds the
 * decided-subset tally and one bootstrap delta against the first-alternative
 * baseline.
 *
 * @param {Array<{ id: string, hub: string, alternatives: Array<string>, value: string }>} labeled - Kept rows.
 * @param {Map<string, Array<string | null>>} picks - Row id to submitted keys in call order.
 * @param {Map<string, Array<{ pick: string | null, pickProb: number | null, noneProb: number | null }>>} votes - Row id to measured votes and their probabilities.
 * @returns {{ probabilityAware: object, bootstrap: object }} The probability-aware column and its cluster bootstrap interval.
 */
function scoreProbabilityArm(labeled, picks, votes) {
  const K = labeled.length;
  const pairs = [];
  const items = [];
  const probabilityPicks = new Map();
  let M = 0;
  let A = 0;
  let B = 0;
  let W = 0;
  let L = 0;
  let F = 0;

  for (const row of labeled) {
    const answers = picks.get(row.id);
    const pick = scorerReport.probabilityAwarePick(votes.get(row.id), NONE_KEY);
    probabilityPicks.set(row.id, typeof pick === 'string' ? pick : null);
    if (!Array.isArray(answers) || answers.length < EARLY_STOP_ORDERS || answers.length > ORDERS) continue;
    if (!answers.every((answer) => typeof answer === 'string')) continue;
    if (typeof pick !== 'string') continue;

    M += 1;
    F += answers.length - modalPick(answers).top;
    const right = pick === row.value;
    const baseRight = row.alternatives[0] === row.value;
    if (right) A += 1;
    if (baseRight) B += 1;
    if (right && !baseRight) W += 1;
    if (baseRight && !right) L += 1;
    pairs.push({ pick, gold: row.value });
    items.push({ cluster: row.hub, delta: Number(right) - Number(baseRight) });
  }

  const counts = { K, M, A, B, W, L, F };
  const decision = decideVerdict(counts);
  const subset = scorerReport.decidedSubset(pairs, NONE_KEY);
  const slack = scorerReport.marginSlack({ A, B, M });
  const seedText = labeled.map((row) => `${row.id}\u0000${probabilityPicks.get(row.id) ?? ''}`).join('\n');
  const bootstrap = scorerReport.clusterBootstrapInterval(items, seedText);

  return {
    probabilityAware: {
      K,
      M,
      A,
      B,
      W,
      L,
      F,
      outcome: decision.outcome,
      reason: decision.reason,
      p: decision.p,
      line: verdictLine('probability-aware', counts, decision),
      decidedCount: subset.decidedCount,
      decidedCorrect: subset.decidedCorrect,
      decidedAccuracy: subset.decidedAccuracy,
      marginSlack: slack,
      picks: Object.fromEntries(probabilityPicks)
    },
    bootstrap
  };
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
// 8. GATES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * First executable file of this name on PATH, or null when none is executable.
 * Empty PATH entries are skipped. A missing path, a directory, or a file that
 * cannot be executed is not a match.
 * @param {string} name
 * @param {{ PATH?: string }} env
 * @returns {string|null}
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
 * Identity line, then the pinned version and a credential check.
 * A miss prints a skip line and leaves the census text already written.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined> }} ctx
 * @returns {{ passed: boolean, path: string | null, provider: string }}
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

// ─────────────────────────────────────────────────────────────────────────────
// 9. ARMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * One bounded child process. Resolves exactly once with the exit code, the
 * collected output, the wall time, and whether the timeout fired.
 * The timer kills the child and resolves at once, without waiting for close:
 * a grandchild can hold the pipes open past the kill. Stdin is closed after
 * the write because the local client reads stdin to EOF and exits 2 on an
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
 * Append one call record as a JSON line to calls.jsonl under outDir.
 * A missing or empty outDir means the run keeps no records, so nothing is
 * created. One line per call keeps a killed arm's earlier records readable.
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
 * Judge one choice call: the pick it named, that pick's probability, the
 * probability the body gives the none key, and whether the call measured. A
 * timeout is its own status. Any other non-zero exit, an unparseable body, or
 * a choice outside the offered keys is unmeasured.
 *
 * @param {{ code: number|null, stdout: string, timedOut: boolean }} result - One spawnCall outcome.
 * @param {Array<string>} keys - The keys this call offered.
 * @returns {{ pick: string|null, pickProb: number|null, noneProb: number|null, status: string }} The judged fields.
 */
function judgeChoice(result, keys) {
  let pick = null;
  let pickProb = null;
  let noneProb = null;
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
      noneProb = parsed?.answers?.answer?.probabilities?.[NONE_KEY] ?? null;
      status = 'measured';
    }
  }
  return { pick, pickProb, noneProb, status };
}

/**
 * The Jev choice arm: one auth test, then two initial rotated choices per
 * labeled row, with a third only when the first two measured picks disagree.
 * When the first two agree the row stops early and keeps only those two
 * measured votes, so an unmeasured third order contributes no vote or flip. The
 * payload line prints before any call, so the cost is visible before anything
 * spends. A spawn exiting 4 is recorded as unmeasured, then retried once after
 * the backoff; the second result is judged. Exit 2, exit 3 and exit 130 stop the
 * arm. Every spawn reaches calls.jsonl before any stop, so a stopped run
 * keeps its records. A stop prints its line and the finished-row count and
 * returns without a verdict.
 *
 * @param {Array<{ id: string, hub: string, prompt: string, alternatives: Array<string>, value: string }>} labeled - Rows carrying a resolvable label.
 * @param {{ path: string, provider: string }} gate - Passed jev gate result.
 * @param {{ out: (line: string) => void, env: Record<string, string | undefined>, outDir: string | null, repoRoot: string, timeoutMs: number, backoffMs: number }} ctx - Output sink, environment, records directory, repository root, call timeout and exit-4 retry wait.
 * @returns {Promise<object>} The counts with outcome, reason, p, the verdict line, the arm's analysis and its model tuple, or `{ stopped }`.
 */
async function runJevArm(labeled, gate, ctx) {
  const { out, env, outDir, repoRoot, timeoutMs, backoffMs } = ctx;
  const K = labeled.length;
  const provider = gate.provider;
  let model = 'unknown';
  let calls = 0;

  let chars = 0;
  for (const row of labeled) {
    const keys = [...row.alternatives, NONE_KEY];
    const texts = describeModes(repoRoot, row.hub, keys);
    chars += row.prompt.length + CHOICE_INSTRUCTION.length;
    for (const key of keys) chars += key.length + texts.get(key).length + 1;
  }
  chars *= EARLY_STOP_ORDERS;
  out('jev: payload=' + JEV_PAYLOAD + ' planned_calls=' + (EARLY_STOP_ORDERS * K + 1)
    + ' max_calls=' + (ORDERS * K + 1) + ' est_input_tokens=' + Math.ceil(chars / 4));

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
    calls += 1;
    let result = await spawnClassifierCall({ file: gate.path, args, stdin: text, env, timeoutMs, report: out });
    if (result.code === 4) {
      writeCall(outDir, {
        kind: fields.kind,
        backend: 'jev',
        transport: result.transport ?? 'jev',
        row_id: fields.row_id,
        order: fields.order,
        wall_ms: result.wallMs,
        exit_code: result.code,
        pick: null,
        pick_prob: null,
        none_prob: null,
        status: 'unmeasured',
        jev_version: '0.6.2',
        provider,
        model
      });
      await new Promise((done) => { setTimeout(done, backoffMs); });
      calls += 1;
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
    transport: auth.transport ?? 'jev',
    row_id: null,
    order: null,
    wall_ms: auth.wallMs,
    exit_code: auth.code,
    pick: null,
    pick_prob: null,
    none_prob: null,
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
  const votes = new Map();
  const inferredThirdOrderIds = [];
  let choiceCalls = 0;
  let finished = 0;
  for (const row of labeled) {
    const keys = [...row.alternatives, NONE_KEY];
    const texts = describeModes(repoRoot, row.hub, keys);
    const rowPicks = [];
    const rowVotes = [];
    const orders = rotations(keys);

    for (let order = 0; order < orders.length; order += 1) {
      if (order >= EARLY_STOP_ORDERS && typeof rowPicks[0] === 'string'
        && rowPicks[0] === rowPicks[1]) {
        inferredThirdOrderIds.push(row.id);
        break;
      }
      choiceCalls += 1;
      const args = ['choice', '--provider', provider, '-q', CHOICE_INSTRUCTION, ...optionArgs(orders[order], texts)];
      const result = await call(args, row.prompt, { kind: 'choice', row_id: row.id, order });
      const fields = judgeChoice(result, keys);
      if (fields.status === 'measured') {
        try {
          const body = JSON.parse(result.stdout);
          // The outcome names the model that answered; the body can name the
          // configured alias the transport was asked for instead.
          if (typeof result.model === 'string') model = result.model;
          else if (typeof body.model === 'string') model = body.model;
        } catch {
          // judgeChoice already parsed this measured body; a failure here leaves the model as it was.
        }
      }
      writeCall(outDir, {
        kind: 'choice',
        backend: 'jev',
        transport: result.transport ?? 'jev',
        row_id: row.id,
        order,
        wall_ms: result.wallMs,
        exit_code: result.code,
        pick: fields.pick,
        pick_prob: fields.pickProb,
        none_prob: fields.noneProb,
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
      rowVotes.push({ pick: fields.pick, pickProb: fields.pickProb, noneProb: fields.noneProb });
    }

    picks.set(row.id, rowPicks);
    votes.set(row.id, rowVotes);
    finished += 1;
  }

  const counts = scoreColumn(labeled, picks);
  const decision = decideVerdict(counts);
  const line = verdictLine('jev', counts, decision, 'jev_version=0.6.2 provider=' + provider + ' model=' + model);
  out(line);
  out('jev: calls=' + calls + ' choice_calls=' + choiceCalls
    + ' early_stops=' + inferredThirdOrderIds.length);
  const analysis = scoreProbabilityArm(labeled, picks, votes);
  out(analysis.probabilityAware.line);
  out(scorerReport.decidedSubsetLine('probability-aware', analysis.probabilityAware));
  out(scorerReport.marginSlackLine('probability-aware', analysis.probabilityAware.marginSlack));
  out(scorerReport.bootstrapLine('probability-aware', analysis.bootstrap));
  return {
    ...counts,
    outcome: decision.outcome,
    reason: decision.reason,
    p: decision.p,
    line,
    calls,
    choiceCalls,
    inferredThirdOrderIds,
    picks: Object.fromEntries(picks),
    modelTuple: { jevVersion: '0.6.2', provider, model },
    analysis
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. CLI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the census CLI flags.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @returns {{ report: string | null, rowsOut: string | null, transcripts: string | null, score: string | null, jev: boolean, out: string | null, error: string | null }} Parsed flags, or the first argument error.
 */
function parseArgs(argv) {
  const args = { report: null, rowsOut: null, transcripts: null, score: null, jev: false, out: null, error: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--jev') {
      args.jev = true;
      continue;
    }
    if (token !== '--report' && token !== '--rows-out' && token !== '--transcripts' && token !== '--score' && token !== '--out') {
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
    else if (token === '--out') args.out = value;
    else args.score = value;
    i += 1;
  }
  if (args.score !== null && (args.report !== null || args.rowsOut !== null || args.transcripts !== null)) {
    args.error = '--score runs alone';
  }
  if (args.jev && args.score === null) {
    args.error = '--jev needs --score <file>';
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
 * fits; with --jev, run the choice arm and file its column.
 * Arithmetic over the labels on disk; an arm is the only part that calls a
 * model.
 *
 * @param {{ score: string, jev: boolean, out: string | null }} args - Parsed CLI flags.
 * @param {{ out: (line: string) => void, err: (line: string) => void, repoRoot: string, env: Record<string, string | undefined>, jevTimeoutMs: number, backoffMs: number }} deps - Output sinks, repository root, environment, the call timeout and the exit-4 retry wait.
 * @returns {Promise<number>} The process exit code.
 */
async function runScoreCommand(args, deps) {
  const { out, err, repoRoot, env, jevTimeoutMs, backoffMs, compiledRouter } = deps;

  let rows;
  try {
    rows = readRows(args.score);
  } catch (error) {
    err('error: ' + error.message);
    return 2;
  }

  let replay;
  try {
    const router = compiledRouter || require(path.join(repoRoot, COMPILED_ROUTE_MODULE));
    replay = replayRows(rows, router, repoRoot);
  } catch (error) {
    err('error: ' + error.message);
    return 2;
  }

  for (const entry of replay.refused) {
    out('replay refused: ' + entry.id + ' (' + entry.action + ')');
  }

  const { labeled, foreign } = labelRows(replay.rows);
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

  const baselines = baselineScores(labeled);
  const B = baselines.firstAlternative.correct;
  const options = optionEntries(labeled, repoRoot);
  const digest = optionsDigest(labeled, repoRoot);
  out('baseline: first alternative right on ' + B + '/' + K);
  out('baseline: second alternative right on ' + baselines.secondAlternative.correct + '/' + K);
  out('baseline: always none right on ' + baselines.alwaysNone.correct + '/' + K);
  out('baseline: strongest simple policy ' + baselines.strongest.policy
    + ' right on ' + baselines.strongest.correct + '/' + K);
  out(MARGIN_LINE);
  out(KEEP_RULE_LINE);
  out('instruction: -q "' + CHOICE_INSTRUCTION + '"');
  out('options: ' + digest.count + ' sha256=' + digest.sha256 + ' none="' + NONE_DESCRIPTION + '"');
  out('orders: ' + ORDERS + ', router order with none_of_these last, then rotated left by 1 and by 2');

  const hasHeadroom = 10 * B <= 9 * K;
  if (!hasHeadroom) {
    out('no headroom: the first alternative is right on ' + B + '/' + K + ', above 0.90');
  } else {
    out('headroom: a 10-point gain fits above ' + B + '/' + K);
  }

  const columns = {};
  let picksById = null;
  if (args.jev && !hasHeadroom) {
    columns.jev = { skipped: true, reason: 'no headroom' };
    out('jev arm skipped: no headroom');
  } else if (args.jev) {
    const gate = jevGate({ out, env });
    columns.jev = gate.passed
      ? await runJevArm(labeled, gate, { out, env, outDir: args.out, repoRoot, timeoutMs: jevTimeoutMs, backoffMs })
      : { skipped: true };
    if (columns.jev && columns.jev.picks) picksById = new Map(Object.entries(columns.jev.picks));
  }

  const resultsByClassAndHub = classHubResults(labeled, picksById);
  for (const line of classHubLines(resultsByClassAndHub)) out(line);

  if (args.jev) {
    const rowRecords = replay.rows.map((row) => ({
      id: row.id,
      hub: row.hub,
      source: row.source,
      prompt: row.prompt,
      alternatives: row.alternatives,
      gold: row.gold,
      replay: row.replay
    }));
    const labelRecords = replay.rows.map((row) => ({
      id: row.id,
      label: typeof row.label === 'string' ? row.label : '',
      gold: typeof row.gold === 'string' ? row.gold : null,
      label_approver: typeof row.label_approver === 'string' ? row.label_approver : '',
      decision_reference: typeof row.decision_reference === 'string' ? row.decision_reference : ''
    }));
    const sha256Json = (value) => crypto.createHash('sha256')
      .update(JSON.stringify(value))
      .digest('hex');
    const sha256File = (file) => crypto.createHash('sha256')
      .update(fs.readFileSync(file))
      .digest('hex');
    const digests = {
      rows: { count: rowRecords.length, sha256: sha256Json(rowRecords) },
      labels: { count: labelRecords.length, sha256: sha256Json(labelRecords) },
      options: digest,
      scorer: { sha256: sha256File(__filename) }
    };
    const dataPin = scorerReport.pinRowSet(
      labeled.map((row) => ({
        id: row.id,
        hub: row.hub,
        value: row.value,
        promptSha256: crypto.createHash('sha256').update(row.prompt).digest('hex')
      })),
      { optionSetSha256: digest.sha256 }
    );
    fs.mkdirSync(args.out, { recursive: true });
    const report = {
      buildIdentity: replay.buildIdentity,
      digests,
      dataPin,
      rows: rowRecords,
      labels: labelRecords,
      options,
      baselines,
      resultsByClassAndHub,
      K,
      B,
      columns
    };
    fs.writeFileSync(path.join(args.out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  }
  return 0;
}

/**
 * Run the clarify census and emit its report.
 *
 * @param {Array<string>} argv - Arguments after the script name.
 * @param {{
 *   out?: (line: string) => void,
 *   err?: (line: string) => void,
 *   repoRoot?: string,
 *   env?: Record<string, string | undefined>,
 *   timeoutMs?: number,
 *   backoffMs?: number,
 *   compiledRouter?: object
 * }} [deps] - Output sinks, root, environment, router, timeout and retry wait.
 * @returns {Promise<number>} The process exit code.
 */
async function main(argv, deps = {}) {
  const out = deps.out || ((line) => process.stdout.write(line + '\n'));
  const err = deps.err || ((line) => process.stderr.write('[score-clarify-default] ' + line + '\n'));
  const env = deps.env || process.env;

  const args = parseArgs(argv);
  if (args.error) {
    err('error: ' + args.error);
    err(USAGE);
    return 2;
  }

  if (args.jev && !args.out) {
    err('error: --jev needs --out <dir>');
    return 2;
  }

  if (args.jev && scorerReport.outDirectoryHoldsRun(args.out)) {
    err('error: --out directory already holds a run');
    return 2;
  }

  const repoRoot = deps.repoRoot || REPO_ROOT;
  const jevTimeoutMs = deps.timeoutMs || JEV_TIMEOUT_MS;
  const backoffMs = deps.backoffMs || BACKOFF_MS;
  if (args.score) return await runScoreCommand(args, {
    out,
    err,
    repoRoot,
    env,
    jevTimeoutMs,
    backoffMs,
    compiledRouter: deps.compiledRouter
  });

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
// 11. EXPORTS
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
  scoreProbabilityArm,
  formatP,
  verdictLine,
  which,
  jevGate,
  spawnCall,
  writeCall,
  rotations,
  optionArgs,
  judgeChoice,
  runJevArm,
  parseArgs,
  censusLines,
  main
};

if (require.main === module) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}
