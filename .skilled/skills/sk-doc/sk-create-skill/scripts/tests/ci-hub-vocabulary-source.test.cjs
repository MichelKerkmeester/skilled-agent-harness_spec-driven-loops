#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-hub-vocabulary-source.test: one authored vocabulary per parent hub    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Proves the vocabulary-source check reads hub-router.json's vocabularyClasses
 * as the only authored mode vocabulary, and fails each of the three copies that
 * can drift from it. Every case builds a throwaway hub: the check is a gate over
 * real files, and a fixture is the only way to watch one leg fail on its own
 * without the other two moving with it.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const CHECK = path.join(REPO, '.skilled', 'skills', 'sk-doc', 'sk-create-skill', 'scripts', 'ci-hub-vocabulary-source.cjs');
const SPAWN_TIMEOUT_MS = 300000;

const HUB = 'fixture-hub';
const ALPHA_PACKET = 'alpha-pkt';
const BETA_PACKET = 'beta-pkt';
const ALPHA_AUTHORED = ['alpha run', 'alpha mode', 'alpha dispatch'];

assert.ok(fs.existsSync(CHECK), `vocabulary-source check is missing: ${CHECK}`);

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const ROOTS = [];

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function writeJson(file, value) {
  write(file, `${JSON.stringify(value, null, 2)}\n`);
}

function routerMarkdown(alphaKeywords) {
  return [
    '# fixture-hub Surface Router',
    '',
    '```python',
    'INTENT_SIGNALS = {',
    `    "ALPHA_RUN": {"weight": 3, "keywords": [${alphaKeywords.map((k) => JSON.stringify(k)).join(', ')}]},`,
    '    "BETA_RUN":  {"weight": 2, "keywords": ["beta run", "beta dispatch"]},',
    '}',
    '',
    'RESOURCE_MAP = {',
    '    "ALPHA_RUN": ["alpha-pkt/SKILL.md"],',
    '    "BETA_RUN":  ["beta-pkt/SKILL.md"],',
    '}',
    '```',
    '',
  ].join('\n');
}

function skillMarkdown(triggers) {
  return [
    '# alpha-pkt',
    '',
    `Keyword triggers: ${triggers.map((t) => `\`${t}\``).join(', ')}.`,
    '',
  ].join('\n');
}

// A complete hub whose three copies agree. Each option replaces one copy only,
// so a case fails the leg it targets and leaves the other two clean.
function fixture(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-vocab-'));
  ROOTS.push(root);
  const hub = path.join(root, options.hub || HUB);

  writeJson(path.join(hub, 'mode-registry.json'), {
    modes: [
      { workflowMode: 'alpha', packet: ALPHA_PACKET, aliases: options.alphaAliases || ['alpha run', 'alpha mode'] },
      { workflowMode: 'beta', packet: BETA_PACKET, aliases: ['beta run'] },
    ],
  });
  writeJson(path.join(hub, 'hub-router.json'), {
    routerSignals: {
      alpha: { weight: 3, classes: ['alpha-aliases'] },
      beta: { weight: 2, classes: ['beta-aliases'] },
    },
    vocabularyClasses: {
      'alpha-aliases': { keywords: ALPHA_AUTHORED },
      'beta-aliases': { keywords: ['beta run', 'beta dispatch'] },
    },
  });
  write(path.join(hub, 'ROUTER.md'), routerMarkdown(options.alphaIntentKeywords || ALPHA_AUTHORED));
  write(path.join(hub, ALPHA_PACKET, 'SKILL.md'), skillMarkdown(options.alphaTriggers || ALPHA_AUTHORED));

  return root;
}

function runCheck(skillsRoot, extraArgs = []) {
  return spawnSync(process.execPath, [CHECK, '--skills-root', skillsRoot, ...extraArgs], {
    cwd: REPO,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
  });
}

function detail(result) {
  return `status=${result.status} signal=${result.signal}\n${result.stdout}\n${result.stderr}`;
}

after(() => {
  for (const root of ROOTS) fs.rmSync(root, { recursive: true, force: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('a hub whose copies agree passes every leg', () => {
  const result = runCheck(fixture());
  assert.equal(result.status, 0, detail(result));
  assert.match(result.stdout, /^OK {4}fixture-hub\s+alias=0 stage-two=0 triggers=0$/m, detail(result));
  assert.match(result.stdout, /checked=1 hub\(s\), drift=0/, detail(result));
  assert.match(result.stdout, /RESULT: PASSED/, detail(result));
});

test('an alias the authored vocabulary does not carry fails the alias leg', () => {
  const result = runCheck(fixture({ alphaAliases: ['alpha run', 'alpha ghost'] }));
  assert.equal(result.status, 1, detail(result));
  assert.match(result.stdout, /alias alpha: "alpha ghost" is not in hub-router\.json vocabulary/, detail(result));
  assert.match(result.stdout, /alias=1 stage-two=0 triggers=0/, detail(result));
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
});

test('a term no stage-two intent carries fails the stage-two leg', () => {
  const result = runCheck(fixture({ alphaIntentKeywords: ['alpha run', 'alpha mode'] }));
  assert.equal(result.status, 1, detail(result));
  assert.match(result.stdout, /stage-two alpha: "alpha dispatch" routes here in hub-router\.json but no ROUTER\.md intent for this mode carries it/, detail(result));
  assert.match(result.stdout, /alias=0 stage-two=1 triggers=0/, detail(result));
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
});

test('a stage-two exempt hub skips that leg and says so', () => {
  const result = runCheck(fixture({ hub: 'sk-code', alphaIntentKeywords: ['alpha run', 'alpha mode'] }));
  assert.equal(result.status, 0, detail(result));
  assert.match(result.stdout, /stage-two=0 triggers=0/, detail(result));
  assert.match(result.stdout, /note: stage-two leg not applied \(a surface and phase router:/, detail(result));
  assert.match(result.stdout, /RESULT: PASSED/, detail(result));
});

test('a Keyword triggers term outside the authored vocabulary fails the triggers leg', () => {
  const result = runCheck(fixture({ alphaTriggers: [...ALPHA_AUTHORED, 'gamma unknown'] }));
  assert.equal(result.status, 1, detail(result));
  assert.match(result.stdout, /triggers alpha-pkt: "gamma unknown" is not in hub-router\.json vocabulary/, detail(result));
  assert.match(result.stdout, /alias=0 stage-two=0 triggers=1/, detail(result));
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
});

test('an unknown hub id is a usage error', () => {
  const result = runCheck(fixture(), ['--hub', 'nope']);
  assert.equal(result.status, 2, detail(result));
  assert.match(result.stderr, /no hub named "nope"/, detail(result));
});

test('the shipped fleet reaches a verdict', () => {
  const result = spawnSync(process.execPath, [CHECK], {
    cwd: REPO,
    encoding: 'utf8',
    timeout: SPAWN_TIMEOUT_MS,
  });
  assert.ok(result.status === 0 || result.status === 1, `the fleet must reach a verdict, not a usage error\n${detail(result)}`);
  assert.match(result.stdout, /RESULT: (PASSED|FAILED)/, detail(result));
});
