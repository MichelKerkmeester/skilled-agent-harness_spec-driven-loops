#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-hub-vocabulary-source.test: one authored vocabulary per parent hub    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Proves the vocabulary-source check reads hub-router.json's vocabularyClasses
 * as the only authored mode vocabulary, and fails each of the copies that can
 * drift from it. Every case builds a throwaway hub: the check is a gate over
 * real files, and a fixture is the only way to watch one leg fail on its own
 * without the others moving with it.
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

function skillMarkdown(triggerLines) {
  return [
    '# alpha-pkt',
    '',
    ...triggerLines,
    '',
  ].join('\n');
}

// A complete hub whose three copies agree. Each option replaces one copy only,
// so a case fails the leg it targets and leaves the other copies clean.
function fixture(options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-vocab-'));
  ROOTS.push(root);
  const hub = path.join(root, options.hub || HUB);

  const modes = [
    { workflowMode: 'alpha', packet: ALPHA_PACKET, aliases: options.alphaAliases || ['alpha run', 'alpha mode'] },
    { workflowMode: 'beta', packet: BETA_PACKET, aliases: ['beta run'] },
  ];
  if (options.ghostMode) modes.push({ workflowMode: 'ghost', packet: 'ghost-pkt', aliases: ['totally-unrouted-name'] });

  writeJson(path.join(hub, 'mode-registry.json'), { modes });
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

  const triggerLine = options.alphaTriggerLine
    || `Keyword triggers: ${(options.alphaTriggers || ALPHA_AUTHORED).map((t) => `\`${t}\``).join(', ')}.`;
  write(path.join(hub, ALPHA_PACKET, 'SKILL.md'), skillMarkdown([triggerLine, ...(options.alphaExtraTriggerLines || [])]));
  if (options.orphanPacket) {
    write(path.join(hub, options.orphanPacket, 'SKILL.md'), skillMarkdown(['Keyword triggers: `alpha run`.']));
  }

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
  assert.match(result.stdout, /^OK {4}fixture-hub\s+alias=0 stage-two=0 triggers=0 packets=0 stage-two-reverse=0$/m, detail(result));
  assert.match(result.stdout, /checked=1 hub\(s\), drift=0/, detail(result));
  assert.match(result.stdout, /RESULT: PASSED/, detail(result));
});

test('an empty skills root is a usage error, not a green run', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-vocab-empty-'));
  ROOTS.push(root);
  const result = runCheck(root);
  assert.equal(result.status, 2, detail(result));
  assert.match(result.stderr, /no hubs found under /, detail(result));
  assert.doesNotMatch(result.stdout, /RESULT: PASSED/, detail(result));
});

test('a mode with no routerSignals entry fails instead of being skipped', () => {
  const result = runCheck(fixture({ ghostMode: true }));
  assert.equal(result.status, 1, detail(result));
  assert.match(result.stdout, /alias ghost: no routerSignals entry, so stage one can never reach this mode/, detail(result));
  assert.match(result.stdout, /alias=1 stage-two=0 triggers=0 packets=0 stage-two-reverse=0/, detail(result));
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
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

test('a stage-two exempt hub skips that leg in both directions and says so', () => {
  const result = runCheck(fixture({ hub: 'sk-code', alphaIntentKeywords: [...ALPHA_AUTHORED, 'alpha rogue'] }));
  assert.equal(result.status, 0, detail(result));
  assert.match(result.stdout, /alias=0 stage-two=0 triggers=0 packets=0 stage-two-reverse=0/, detail(result));
  assert.doesNotMatch(result.stdout, /stage-two-reverse alpha-pkt/, detail(result));
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

test('an unbackticked trigger item is compared like a backticked one', () => {
  const result = runCheck(fixture({
    alphaTriggerLine: 'Keyword triggers: `alpha run`, a completely unbackticked bogus term.',
  }));
  assert.equal(result.status, 1, detail(result));
  assert.match(result.stdout, /triggers alpha-pkt: "a completely unbackticked bogus term" is not in hub-router\.json vocabulary/, detail(result));
  assert.match(result.stdout, /alias=0 stage-two=0 triggers=1/, detail(result));
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
});

test('a second Keyword triggers line is read, not just the first', () => {
  const result = runCheck(fixture({
    alphaExtraTriggerLines: ['Keyword triggers: `bogus second line term`.'],
  }));
  assert.equal(result.status, 1, detail(result));
  assert.match(result.stdout, /triggers alpha-pkt: "bogus second line term" is not in hub-router\.json vocabulary/, detail(result));
  assert.match(result.stdout, /alias=0 stage-two=0 triggers=1/, detail(result));
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
});

test('a packet with a triggers line that no registry mode names fails the packets leg', () => {
  const result = runCheck(fixture({ orphanPacket: 'orphan-pkt' }));
  assert.equal(result.status, 1, detail(result));
  assert.match(result.stdout, /packets orphan-pkt: has a "Keyword triggers:" line but no registry mode names it as a packet/, detail(result));
  assert.match(result.stdout, /alias=0 stage-two=0 triggers=0 packets=1/, detail(result));
  assert.match(result.stdout, /RESULT: FAILED/, detail(result));
});

test('the reverse stage-two leg lists an intent keyword the vocabulary does not route', () => {
  const result = runCheck(fixture({ alphaIntentKeywords: [...ALPHA_AUTHORED, 'alpha rogue'] }));
  assert.equal(result.status, 0, detail(result));
  assert.match(result.stdout, /stage-two-reverse alpha-pkt: "alpha rogue" is an intent keyword in ROUTER\.md that hub-router\.json vocabulary does not route/, detail(result));
  assert.match(result.stdout, /alias=0 stage-two=0 triggers=0 packets=0 stage-two-reverse=1/, detail(result));
  assert.match(result.stdout, /stage-two-reverse=1 term\(s\)/, detail(result));
  assert.match(result.stdout, /RESULT: PASSED/, detail(result));
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
