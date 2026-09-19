#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: COMPILED-SERVING ADMISSION CHECK                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { after, describe, test } = require('node:test');

const admission = require('../lib/compiled-route-admission.cjs');
const { compiledRoute, HUB_CHILD } = require('../lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs');
const { DEFAULT_ON_HUBS } = require('../lib/compiled-routing/014-runtime-engine/lib/resolve.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CLI_PATH = path.join(__dirname, '..', 'compiled-route-admission.cjs');
const ACTIVATION_ROOT = path.join(__dirname, '..', 'lib', 'compiled-routing', '013-live-activation', 'activation');
const TEMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'compiled-route-admission-'));
// The live gold corpus at the admitted hubs' playbook roots. A change here means
// scenarios were added or removed, so the baseline report needs a rerun.
const LIVE_CORPUS_SIZE = 73;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function writeFile(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function scenarioText({ id, stage = 'routing', mode, leaves, prompt }) {
  const lines = ['---', `id: ${id}`, `stage: ${stage}`];
  if (mode !== undefined) lines.push(`expected_workflow_mode: ${mode}`);
  if (leaves !== undefined) lines.push(leaves);
  lines.push('---', '', `# ${id}`, '');
  if (prompt !== undefined) lines.push('**Exact prompt**:', '```', prompt, '```', '');
  return `${lines.join('\n')}\n`;
}

// A two-mode fixture hub: `alpha` and `beta`, each with one declared leaf.
function makeHub(name, scenarios) {
  const root = path.join(TEMP_ROOT, name);
  writeFile(path.join(root, 'mode-registry.json'), JSON.stringify({
    modes: [{ workflowMode: 'alpha' }, { workflowMode: 'beta' }],
  }));
  writeFile(path.join(root, 'leaf-manifest.json'), JSON.stringify({
    resourceContractVersion: 1,
    modes: [
      { workflowMode: 'alpha', packet: 'alpha-packet', leaves: ['references/alpha.md'] },
      { workflowMode: 'beta', packet: 'beta-packet', leaves: ['references/beta.md'] },
    ],
  }));
  for (const scenario of scenarios) {
    writeFile(path.join(root, 'manual-testing-playbook', `${scenario.id}.md`), scenarioText(scenario));
  }
  return root;
}

function target(mode) {
  return { skillId: 'fixture', workflowMode: mode, packetId: `${mode}-packet` };
}

// Route prompts by their first word: "alpha", "beta", "both", "defer", "clarify",
// "ghost" (an undeclared mode) or "throw".
function fixtureRoute(hubId, prompt) {
  const word = prompt.split(/\s+/)[0];
  if (word === 'throw') throw new Error('engine exploded');
  if (word === 'defer' || word === 'clarify') return { action: word, selectionKind: null, targets: [] };
  if (word === 'both') return { action: 'route', selectionKind: 'multi', targets: [target('alpha'), target('beta')] };
  return { action: 'route', selectionKind: 'single', targets: [target(word)] };
}

function hashActivationTree() {
  const hash = crypto.createHash('sha256');
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else hash.update(`${path.relative(ACTIVATION_ROOT, full)}\0`).update(fs.readFileSync(full));
    }
  };
  walk(ACTIVATION_ROOT);
  return hash.digest('hex');
}

function byId(report) {
  return Object.fromEntries(report.scenarios.map((scenario) => [scenario.id, scenario]));
}

after(() => fs.rmSync(TEMP_ROOT, { recursive: true, force: true }));

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('gold parsing', () => {
  test('mode gold reads single, joined and sequenced modes, and flags junk', () => {
    assert.deepEqual(admission.parseModeGold('expected_workflow_mode: alpha').labels, ['alpha']);
    assert.deepEqual(admission.parseModeGold('expected_workflow_mode: alpha+beta').labels, ['alpha', 'beta']);
    assert.deepEqual(admission.parseModeGold('expected_workflow_mode: alpha → beta').labels, ['alpha', 'beta']);
    assert.match(admission.parseModeGold('expected_workflow_mode: not a mode!').parseError, /unparseable/);
    assert.equal(admission.parseModeGold('id: X').present, false);
  });

  test('leaf gold reads [] and typed pairs, and flags any other shape', () => {
    assert.deepEqual(admission.parseLeafGold('expected_leaf_resources: []').pairs, []);
    const typed = admission.parseLeafGold([
      'expected_leaf_resources:',
      '  - workflow_mode: alpha',
      '    leaf_resource_id: references/alpha.md',
    ].join('\n'));
    assert.deepEqual(typed.pairs, [{ workflowMode: 'alpha', leafResourceId: 'references/alpha.md' }]);
    assert.match(admission.parseLeafGold('expected_leaf_resources:\n  - references/alpha.md').parseError, /typed/);
    assert.equal(admission.parseLeafGold('id: X').present, false);
  });

  test('prompts come from a fenced block or an inline line, and a pointer is no prompt', () => {
    assert.equal(admission.parsePrompt('**Exact prompt**:\n```\nhello there\n```'), 'hello there');
    assert.equal(admission.parsePrompt('- Prompt: `hello there`'), 'hello there');
    assert.equal(admission.parsePrompt('- Prompt: See Setup.'), null);
    assert.equal(admission.parsePrompt('no prompt here'), null);
  });
});

describe('scenario scoring', () => {
  const leaf = (mode, id) => `expected_leaf_resources:\n  - workflow_mode: ${mode}\n    leaf_resource_id: ${id}`;
  const root = makeHub('scoring', [
    { id: 'pass-single', mode: 'alpha', leaves: leaf('alpha', 'references/alpha.md'), prompt: 'alpha please' },
    { id: 'wrong-mode', mode: 'alpha', prompt: 'beta please' },
    { id: 'defer', mode: 'alpha', prompt: 'defer please' },
    { id: 'clarify', mode: 'alpha', prompt: 'clarify please' },
    { id: 'unsafe', mode: 'UNKNOWN', prompt: 'alpha please' },
    { id: 'negative-pass', stage: 'negative', mode: 'alpha', prompt: 'defer please' },
    { id: 'multi-partial', mode: 'alpha+beta', prompt: 'alpha please' },
    { id: 'multi-full', mode: 'alpha+beta', prompt: 'both please' },
    { id: 'stale-mode', mode: 'gamma', prompt: 'alpha please' },
    { id: 'stale-leaf', mode: 'alpha', leaves: leaf('alpha', 'references/gone.md'), prompt: 'alpha please' },
    { id: 'missing-leaf', mode: 'alpha', leaves: leaf('beta', 'references/beta.md'), prompt: 'alpha please' },
    { id: 'orphan', mode: 'alpha', prompt: 'ghost please' },
    { id: 'engine-error', mode: 'alpha', prompt: 'throw please' },
    { id: 'invalid', mode: 'not a mode!', prompt: 'alpha please' },
    { id: 'no-prompt', mode: 'alpha' },
  ]);
  const report = admission.evaluateHub({ hubId: 'fixture', skillRoot: root, route: fixtureRoute, admitted: true });
  const scenarios = byId(report);
  const expected = {
    'pass-single': ['pass', null],
    'wrong-mode': ['drift', 'wrong-mode'],
    defer: ['drift', 'silent-defer'],
    clarify: ['drift', 'silent-defer'],
    unsafe: ['drift', 'unsafe-route'],
    'negative-pass': ['pass', null],
    'multi-partial': ['drift', 'wrong-mode'],
    'multi-full': ['pass', null],
    'stale-mode': ['stale-gold', 'undeclared-mode'],
    'stale-leaf': ['stale-gold', 'undeclared-leaf'],
    'missing-leaf': ['drift', 'missing-leaf'],
    orphan: ['drift', 'orphan-target'],
    'engine-error': ['broken', 'engine-error'],
    invalid: ['invalid', 'parse-failure'],
    'no-prompt': ['n/a', 'no-prompt'],
  };
  for (const [id, [status, reason]] of Object.entries(expected)) {
    test(`${id} scores ${status}${reason ? ` (${reason})` : ''}`, () => {
      assert.equal(scenarios[id].status, status);
      assert.equal(scenarios[id].reason, reason);
    });
  }

  test('the worst status sets the hub verdict', () => {
    assert.equal(report.verdict, 'broken');
  });
});

describe('hub verdicts and coverage floors', () => {
  const clean = makeHub('clean', [
    { id: 'a1', mode: 'alpha', prompt: 'alpha please' },
    { id: 'n1', stage: 'negative', mode: 'UNKNOWN', prompt: 'defer please' },
  ]);

  test('a candidate missing gold for a mode is insufficient-coverage', () => {
    const report = admission.evaluateHub({ hubId: 'fixture', skillRoot: clean, route: fixtureRoute, admitted: false });
    assert.equal(report.verdict, 'insufficient-coverage');
    assert.deepEqual(report.coverage.uncovered, ['beta']);
    assert.equal(report.coverage.enforced, true);
  });

  test('an admitted hub with the same gaps passes, and the gaps are still reported', () => {
    const report = admission.evaluateHub({ hubId: 'fixture', skillRoot: clean, route: fixtureRoute, admitted: true });
    assert.equal(report.verdict, 'pass');
    assert.deepEqual(report.coverage.uncovered, ['beta']);
    assert.equal(report.coverage.enforced, false);
  });

  test('a candidate with gold for every mode and a negative passes', () => {
    const full = makeHub('full', [
      { id: 'a1', mode: 'alpha', prompt: 'alpha please' },
      { id: 'b1', stage: 'holdout', mode: 'beta', prompt: 'beta please' },
      { id: 'n1', mode: 'defer', prompt: 'clarify please' },
    ]);
    const report = admission.evaluateHub({ hubId: 'fixture', skillRoot: full, route: fixtureRoute, admitted: false });
    assert.equal(report.verdict, 'pass');
    assert.deepEqual(report.holdout, { total: 1, judged: 1, pass: 1 });
  });

  test('a candidate with no negative scenario is insufficient-coverage', () => {
    const noNegative = makeHub('no-negative', [
      { id: 'a1', mode: 'alpha', prompt: 'alpha please' },
      { id: 'b1', mode: 'beta', prompt: 'beta please' },
    ]);
    const report = admission.evaluateHub({ hubId: 'fixture', skillRoot: noNegative, route: fixtureRoute, admitted: false });
    assert.equal(report.verdict, 'insufficient-coverage');
    assert.equal(report.coverage.negatives, 0);
  });

  test('the same inputs give the same report', () => {
    const first = admission.buildReport([admission.evaluateHub({ hubId: 'fixture', skillRoot: clean, route: fixtureRoute, admitted: true })]);
    const second = admission.buildReport([admission.evaluateHub({ hubId: 'fixture', skillRoot: clean, route: fixtureRoute, admitted: true })]);
    assert.equal(JSON.stringify(first), JSON.stringify(second));
    assert.match(admission.renderMarkdown(first), /^# Compiled-Serving Admission Report/);
  });
});

describe('live hubs', () => {
  test('the live corpus holds the pinned number of gold scenarios', () => {
    const total = [...DEFAULT_ON_HUBS]
      .map((hubId) => admission.loadGoldScenarios(path.join(admission.SKILLS_ROOT, hubId)).length)
      .reduce((sum, count) => sum + count, 0);
    assert.equal(total, LIVE_CORPUS_SIZE);
  });

  test('checking every live hub scores each one and leaves the activation state untouched', () => {
    const before = hashActivationTree();
    const reports = Object.keys(HUB_CHILD).sort().map((hubId) => admission.evaluateHub({
      hubId, route: compiledRoute, admitted: DEFAULT_ON_HUBS.has(hubId),
    }));
    assert.equal(hashActivationTree(), before);
    const skDoc = reports.find((report) => report.hubId === 'sk-doc');
    assert.ok(skDoc.counts.pass > 0, 'sk-doc should pass at least one scenario');
    assert.ok(reports.every((report) => admission.VERDICTS.includes(report.verdict)));
  });
});

describe('command line', () => {
  const run = (args) => spawnSync(process.execPath, [CLI_PATH, ...args], { encoding: 'utf8' });

  test('no hub is a usage error', () => {
    const result = run([]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /--hub or pass --all/);
  });

  test('an unregistered hub fails as broken', () => {
    const result = run(['--hub', 'not-a-hub', '--json']);
    assert.equal(result.status, 1);
    assert.equal(JSON.parse(result.stdout).hubs[0].verdict, 'broken');
  });

  test('--warn-only reports without failing, and --out writes both reports', () => {
    const out = path.join(TEMP_ROOT, 'cli-out');
    const result = run(['--hub', 'not-a-hub', '--warn-only', '--out', out]);
    assert.equal(result.status, 0);
    assert.ok(fs.existsSync(path.join(out, 'admission-report.json')));
    assert.ok(fs.existsSync(path.join(out, 'admission-report.md')));
  });
});
