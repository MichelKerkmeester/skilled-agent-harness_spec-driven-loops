// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: COMPILED-SERVING ADMISSION CHECK                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// A hub earns compiled-serving when its compiled decisions satisfy the routing
// gold its own playbook authors. This module measures that and nothing else: it
// reads scenario frontmatter, asks the compiled engine for a decision, and scores
// the decision against the gold. It never reads the serving flag, never reads or
// writes an activation manifest, and never changes which router serves a hub.
//
// The rules, in the order a scenario meets them:
//   - gold that cannot be parsed fails the run instead of being skipped;
//   - a scenario with no usable prompt is `n/a`;
//   - negative, `UNKNOWN` and `defer` gold pass only when the engine does not route;
//   - gold naming a mode or leaf the hub does not declare is stale gold;
//   - concrete gold fails on any non-route decision, `clarify` included;
//   - every gold mode must be among the routed modes (must-include), and every
//     leaf in the gold must belong to a routed mode.
// Coverage floors apply to a hub outside the default-on cohort; an admitted hub
// gets the same coverage measurement as a report that does not fail it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SKILLS_ROOT = path.resolve(__dirname, '..', '..', 'skills');
const LEAF_CONTRACT_PATH = path.join(
  SKILLS_ROOT, 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs',
);
const REPORT_SCHEMA_VERSION = 1;
const PLAYBOOK_DIR_NAME = 'manual-testing-playbook';
const INDEX_FILE_NAMES = new Set(['manual-testing-playbook.md', 'feature-catalog.md']);

// Gold labels that mean "the router should not pick a mode here".
const NO_ROUTE_LABELS = new Set(['UNKNOWN', 'defer', 'none']);
const MODE_LABEL_RE = /^[A-Za-z0-9_-]+$/;
// A prompt field that points elsewhere ("See Setup.") is not a prompt.
const POINTER_PROMPT_RE = /^see\s+(?:setup|above|below)\b/i;

// Hub verdicts, most severe first. A hub takes the first one any rule assigns.
const VERDICTS = Object.freeze([
  'broken',
  'invalid-gold',
  'drift',
  'stale-gold',
  'insufficient-coverage',
  'pass',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function frontmatterBlock(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text || '');
  return match ? match[1] : null;
}

function hasKey(block, key) {
  return new RegExp(`(?:^|\\n)[ \\t]*${escapeRegExp(key)}[ \\t]*:`).test(block);
}

function readScalar(block, key) {
  const match = new RegExp(
    `(?:^|\\n)[ \\t]*${escapeRegExp(key)}[ \\t]*:[ \\t]*["']?([^"'\\n]*?)["']?[ \\t]*(?:\\n|$)`,
  ).exec(block);
  return match ? match[1].trim() : undefined;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function listMarkdownFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith('.md') && !INDEX_FILE_NAMES.has(entry.name)) out.push(full);
    }
  }
  return out.sort();
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GOLD LOADING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse `expected_workflow_mode`. Multi-mode gold is authored as `a+b` or as a
 * sequence `a → b`; both become a label list. An unparseable value is a parse
 * error, never a silent absence.
 *
 * @param {string} block - Frontmatter body.
 * @returns {{present: boolean, labels: string[], parseError: (string|null)}} Parsed gold.
 */
function parseModeGold(block) {
  if (!hasKey(block, 'expected_workflow_mode')) return { present: false, labels: [], parseError: null };
  const value = readScalar(block, 'expected_workflow_mode') || '';
  const labels = value.split(/\s*(?:\+|→|->)\s*/).map((label) => label.trim()).filter(Boolean);
  if (labels.length === 0 || labels.some((label) => !MODE_LABEL_RE.test(label))) {
    return { present: true, labels: [], parseError: `expected_workflow_mode is unparseable: "${value}"` };
  }
  return { present: true, labels, parseError: null };
}

/**
 * Parse typed leaf gold: `expected_leaf_resources: []`, or a list of
 * `{workflow_mode, leaf_resource_id}` pairs. Any other shape is a parse error.
 *
 * @param {string} block - Frontmatter body.
 * @returns {{present: boolean, pairs: Array<{workflowMode: string, leafResourceId: string}>, parseError: (string|null)}} Parsed gold.
 */
function parseLeafGold(block) {
  if (!hasKey(block, 'expected_leaf_resources')) return { present: false, pairs: [], parseError: null };
  if (/(?:^|\n)[ \t]*expected_leaf_resources[ \t]*:[ \t]*\[[ \t]*\][ \t]*(?:\n|$)/.test(block)) {
    return { present: true, pairs: [], parseError: null };
  }
  const listMatch = /(?:^|\n)[ \t]*expected_leaf_resources[ \t]*:[ \t]*\n((?:[ \t]+.*(?:\n|$))+)/.exec(block);
  const pairs = [];
  if (listMatch) {
    const pairRe = /-[ \t]*workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*\n[ \t]*leaf_resource_id:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/g;
    let match;
    while ((match = pairRe.exec(listMatch[1])) !== null) {
      pairs.push({ workflowMode: match[1].trim(), leafResourceId: match[2].trim() });
    }
  }
  if (pairs.length === 0) {
    return { present: true, pairs: [], parseError: 'expected_leaf_resources is neither [] nor typed workflow_mode/leaf_resource_id pairs' };
  }
  return { present: true, pairs, parseError: null };
}

/**
 * Extract the routing prompt: a fenced block after an "Exact prompt" or
 * "Realistic user prompt" marker, else an inline "Prompt:" line. A pointer such
 * as "See Setup." yields null.
 *
 * @param {string} text - Whole scenario file.
 * @returns {string|null} Prompt text, or null when the scenario has none.
 */
function parsePrompt(text) {
  const fenced = /\*\*(?:Exact prompt|Realistic user prompt)\*\*:?\s*\n+```[a-z]*\n([\s\S]*?)\n```/i.exec(text);
  let value = fenced ? fenced[1].trim() : null;
  if (!value) {
    const inline = /(?:^|\n)\s*(?:[-*]\s+)?(?:\*\*)?(?:RCAF\s+)?Prompt(?:\*\*)?:\s*(.+)/i.exec(text);
    if (!inline) return null;
    value = inline[1].trim();
    const wrapped = /^`([^`]*)`$/.exec(value);
    if (wrapped) value = wrapped[1].trim();
  }
  if (!value || POINTER_PROMPT_RE.test(value)) return null;
  return value;
}

/**
 * Load every scenario in a hub's playbook that declares `expected_workflow_mode`.
 *
 * @param {string} skillRoot - Hub skill root.
 * @returns {Array<Object>} Scenarios sorted by file path.
 */
function loadGoldScenarios(skillRoot) {
  const playbookDir = path.join(skillRoot, PLAYBOOK_DIR_NAME);
  const scenarios = [];
  for (const file of listMarkdownFiles(playbookDir)) {
    const text = fs.readFileSync(file, 'utf8');
    const block = frontmatterBlock(text);
    if (block === null) continue;
    const modeGold = parseModeGold(block);
    if (!modeGold.present) continue;
    const leafGold = parseLeafGold(block);
    const rawStage = readScalar(block, 'stage') || 'routing';
    scenarios.push({
      id: readScalar(block, 'id') || path.basename(file, '.md'),
      file: path.relative(skillRoot, file).split(path.sep).join('/'),
      stage: rawStage === 'holdout' || rawStage === 'negative' ? rawStage : 'fitted',
      prompt: parsePrompt(text),
      modes: modeGold.labels,
      leafGold: leafGold.pairs,
      parseErrors: [modeGold.parseError, leafGold.parseError].filter(Boolean),
    });
  }
  return scenarios;
}

/**
 * Read the hub's declared workflow modes and each mode's leaves.
 *
 * @param {string} skillRoot - Hub skill root.
 * @returns {{declared: string[], modeIndex: Object<string, {packet: string, leaves: string[]}>}} Declarations.
 */
function loadHubDeclarations(skillRoot) {
  const modeIndex = {};
  const manifestPath = path.join(skillRoot, 'leaf-manifest.json');
  if (fs.existsSync(manifestPath)) {
    for (const mode of readJson(manifestPath).modes || []) {
      modeIndex[mode.workflowMode] = { packet: mode.packet, leaves: mode.leaves || [] };
    }
  }
  const registryPath = path.join(skillRoot, 'mode-registry.json');
  const registryModes = fs.existsSync(registryPath)
    ? (readJson(registryPath).modes || []).map((mode) => mode.workflowMode).filter(Boolean)
    : [];
  const declared = sortedUnique(registryModes.length > 0 ? registryModes : Object.keys(modeIndex));
  return { declared, modeIndex };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SCORING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve one compiled target to the workflow mode it routes to. The engine
 * returns either a qualified id string or a destination object; both go through
 * the leaf contract's bridge, which checks the mode and packet against the
 * hub's leaf manifest.
 *
 * @param {string|Object} target - Compiled target.
 * @param {string} hubId - Hub being scored.
 * @param {Object} modeIndex - workflowMode -> { packet, leaves }.
 * @param {Function} bridge - qualifiedIdToLeaf.
 * @returns {{ok: boolean, workflowMode?: string, message?: string}} Bridged mode.
 */
function bridgeTarget(target, hubId, modeIndex, bridge) {
  let qualifiedId = target;
  if (target && typeof target === 'object') {
    const segments = [target.skillId || hubId, target.workflowMode, target.packetId].filter(Boolean);
    qualifiedId = segments.join('/');
  }
  const bridged = bridge(qualifiedId, { modeIndex });
  return bridged.ok
    ? { ok: true, workflowMode: bridged.workflowMode }
    : { ok: false, message: bridged.message };
}

/**
 * Score one scenario against its compiled decision.
 *
 * @param {Object} scenario - From loadGoldScenarios.
 * @param {{decision?: Object, error?: string}} outcome - Engine decision or engine error.
 * @param {{hubId: string, declared: string[], modeIndex: Object, bridge: Function}} context - Hub declarations.
 * @returns {{status: string, reason: (string|null), detail: (string|null), routedModes: string[]}} Scenario result.
 */
function scoreScenario(scenario, outcome, context) {
  const result = (status, reason = null, detail = null, routedModes = []) => ({ status, reason, detail, routedModes });
  if (scenario.parseErrors.length > 0) return result('invalid', 'parse-failure', scenario.parseErrors.join('; '));
  if (!scenario.prompt) return result('n/a', 'no-prompt');
  if (outcome.error) return result('broken', 'engine-error', outcome.error);

  const decision = outcome.decision;
  const negative = scenario.stage === 'negative' || scenario.modes.every((label) => NO_ROUTE_LABELS.has(label));
  const bridgedModes = [];
  const orphans = [];
  if (decision.action === 'route') {
    for (const target of decision.targets || []) {
      const bridged = bridgeTarget(target, context.hubId, context.modeIndex, context.bridge);
      if (bridged.ok) bridgedModes.push(bridged.workflowMode);
      else orphans.push(bridged.message);
    }
  }
  const routedModes = sortedUnique(bridgedModes);

  if (negative) {
    return decision.action === 'route'
      ? result('drift', 'unsafe-route', `routed to ${routedModes.join(', ') || 'an unresolved target'}`, routedModes)
      : result('pass', null, null, routedModes);
  }

  const declared = new Set(context.declared);
  const undeclaredModes = scenario.modes.filter((mode) => !declared.has(mode));
  if (undeclaredModes.length > 0) return result('stale-gold', 'undeclared-mode', undeclaredModes.join(', '), routedModes);
  const undeclaredLeaves = scenario.leafGold.filter((pair) => {
    const mode = context.modeIndex[pair.workflowMode];
    return !mode || !mode.leaves.includes(pair.leafResourceId);
  });
  if (undeclaredLeaves.length > 0) {
    return result('stale-gold', 'undeclared-leaf',
      undeclaredLeaves.map((pair) => `${pair.workflowMode}:${pair.leafResourceId}`).join(', '), routedModes);
  }

  if (decision.action !== 'route') return result('drift', 'silent-defer', `engine returned ${decision.action}`, routedModes);
  if (orphans.length > 0) return result('drift', 'orphan-target', orphans.join('; '), routedModes);
  const routed = new Set(routedModes);
  const missingModes = scenario.modes.filter((mode) => !routed.has(mode));
  if (missingModes.length > 0) {
    return result('drift', 'wrong-mode', `missing ${missingModes.join(', ')}; routed ${routedModes.join(', ') || 'nothing'}`, routedModes);
  }
  const missingLeaves = scenario.leafGold.filter((pair) => !routed.has(pair.workflowMode));
  if (missingLeaves.length > 0) {
    return result('drift', 'missing-leaf',
      missingLeaves.map((pair) => `${pair.workflowMode}:${pair.leafResourceId}`).join(', '), routedModes);
  }
  return result('pass', null, null, routedModes);
}

/**
 * Measure gold coverage: scored positive scenarios per declared mode, plus the
 * scored negative scenarios.
 *
 * @param {Array<Object>} scored - Scenarios with their results.
 * @param {string[]} declared - Declared workflow modes.
 * @returns {{modes: Array<{workflowMode: string, scenarios: number}>, uncovered: string[], negatives: number}} Coverage.
 */
function measureCoverage(scored, declared) {
  const counts = Object.fromEntries(declared.map((mode) => [mode, 0]));
  let negatives = 0;
  for (const entry of scored) {
    if (entry.result.status === 'n/a' || entry.result.status === 'invalid') continue;
    const labels = entry.scenario.modes;
    if (entry.scenario.stage === 'negative' || labels.every((label) => NO_ROUTE_LABELS.has(label))) {
      negatives += 1;
      continue;
    }
    for (const mode of labels) if (mode in counts) counts[mode] += 1;
  }
  const modes = declared.map((mode) => ({ workflowMode: mode, scenarios: counts[mode] }));
  return { modes, uncovered: modes.filter((mode) => mode.scenarios === 0).map((mode) => mode.workflowMode), negatives };
}

function tally(scored, stage) {
  const inStage = scored.filter((entry) => (stage ? entry.scenario.stage === stage : true));
  const judged = inStage.filter((entry) => entry.result.status !== 'n/a');
  return { total: inStage.length, judged: judged.length, pass: judged.filter((entry) => entry.result.status === 'pass').length };
}

/**
 * Score one hub and assign its verdict.
 *
 * @param {Object} args - Inputs.
 * @param {string} args.hubId - Hub id.
 * @param {string} [args.skillRoot] - Hub skill root; defaults to the source root's skills tree.
 * @param {Function} args.route - (hubId, prompt) => compiled decision; may throw.
 * @param {boolean} args.admitted - Whether the hub is already in the default-on cohort.
 * @param {Function} [args.bridge] - qualifiedIdToLeaf; loaded from the leaf contract when omitted.
 * @returns {Object} Hub report.
 */
function evaluateHub({ hubId, skillRoot = path.join(SKILLS_ROOT, hubId), route, admitted, bridge }) {
  const qualifiedIdToLeaf = bridge || require(LEAF_CONTRACT_PATH).qualifiedIdToLeaf;
  const { declared, modeIndex } = loadHubDeclarations(skillRoot);
  const context = { hubId, declared, modeIndex, bridge: qualifiedIdToLeaf };
  const scored = loadGoldScenarios(skillRoot).map((scenario) => {
    let outcome = {};
    if (scenario.parseErrors.length === 0 && scenario.prompt) {
      try {
        outcome = { decision: route(hubId, scenario.prompt) };
      } catch (error) {
        outcome = { error: error && error.message ? error.message : String(error) };
      }
    }
    return { scenario, result: scoreScenario(scenario, outcome, context) };
  });

  const statuses = new Set(scored.map((entry) => entry.result.status));
  const coverage = measureCoverage(scored, declared);
  const coverageShort = coverage.uncovered.length > 0 || coverage.negatives === 0;
  let verdict = 'pass';
  if (statuses.has('broken')) verdict = 'broken';
  else if (statuses.has('invalid')) verdict = 'invalid-gold';
  else if (statuses.has('drift')) verdict = 'drift';
  else if (statuses.has('stale-gold')) verdict = 'stale-gold';
  else if (!admitted && coverageShort) verdict = 'insufficient-coverage';

  return {
    hubId,
    admitted,
    verdict,
    counts: Object.fromEntries(['pass', 'drift', 'stale-gold', 'invalid', 'broken', 'n/a']
      .map((status) => [status, scored.filter((entry) => entry.result.status === status).length])),
    fitted: tally(scored, 'fitted'),
    holdout: tally(scored, 'holdout'),
    negative: tally(scored, 'negative'),
    coverage: { ...coverage, enforced: !admitted, short: coverageShort },
    scenarios: scored.map(({ scenario, result }) => ({
      id: scenario.id,
      file: scenario.file,
      stage: scenario.stage,
      goldModes: scenario.modes,
      goldLeaves: scenario.leafGold.map((pair) => `${pair.workflowMode}:${pair.leafResourceId}`),
      status: result.status,
      reason: result.reason,
      detail: result.detail,
      routedModes: result.routedModes,
    })),
  };
}

/**
 * Assemble the report for a set of hubs, sorted by hub id.
 *
 * @param {Array<Object>} hubReports - From evaluateHub.
 * @returns {{schemaVersion: number, ok: boolean, hubs: Array<Object>}} Report.
 */
function buildReport(hubReports) {
  const hubs = [...hubReports].sort((a, b) => (a.hubId < b.hubId ? -1 : a.hubId > b.hubId ? 1 : 0));
  return { schemaVersion: REPORT_SCHEMA_VERSION, ok: hubs.every((hub) => hub.verdict === 'pass'), hubs };
}

/**
 * Render a report as Markdown.
 *
 * @param {Object} report - From buildReport.
 * @returns {string} Markdown text.
 */
function renderMarkdown(report) {
  const lines = ['# Compiled-Serving Admission Report', ''];
  lines.push('| Hub | Cohort | Verdict | Pass | Drift | Stale gold | n/a | Fitted | Holdout | Uncovered modes |');
  lines.push('|-----|--------|---------|------|-------|------------|-----|--------|---------|-----------------|');
  for (const hub of report.hubs) {
    lines.push(`| \`${hub.hubId}\` | ${hub.admitted ? 'admitted' : 'candidate'} | ${hub.verdict} | ${hub.counts.pass} | ${hub.counts.drift} | ${hub.counts['stale-gold']} | ${hub.counts['n/a']} | ${hub.fitted.pass}/${hub.fitted.judged} | ${hub.holdout.pass}/${hub.holdout.judged} | ${hub.coverage.uncovered.length > 0 ? hub.coverage.uncovered.map((mode) => `\`${mode}\``).join(', ') : 'none'} |`);
  }
  for (const hub of report.hubs) {
    const failing = hub.scenarios.filter((scenario) => scenario.status !== 'pass');
    if (failing.length === 0) continue;
    lines.push('', `## ${hub.hubId}`, '');
    lines.push('| Scenario | Stage | Status | Reason | Detail |');
    lines.push('|----------|-------|--------|--------|--------|');
    for (const scenario of failing) {
      const detail = (scenario.detail || '').replace(/\|/g, '\\|');
      lines.push(`| \`${scenario.file}\` | ${scenario.stage} | ${scenario.status} | ${scenario.reason || ''} | ${detail} |`);
    }
  }
  return `${lines.join('\n')}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  REPORT_SCHEMA_VERSION,
  VERDICTS,
  SKILLS_ROOT,
  parseModeGold,
  parseLeafGold,
  parsePrompt,
  loadGoldScenarios,
  loadHubDeclarations,
  scoreScenario,
  measureCoverage,
  evaluateHub,
  buildReport,
  renderMarkdown,
};
