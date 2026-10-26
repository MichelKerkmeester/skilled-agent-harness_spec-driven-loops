#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled-Route Surface Hint Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { after, test } = require('node:test');

const ENGINE_DIR = path.join(__dirname, '..', 'lib', 'compiled-routing', '014-runtime-engine', 'lib');
const SK_CODE_LIB = path.join(__dirname, '..', 'lib', 'compiled-routing', '009-parent-hub-rollout', '001-sk-code', 'lib');
const SK_CODE_ROOT = path.join(__dirname, '..', '..', 'skills', 'sk-code');
const FRONT_DOOR = path.join(__dirname, '..', 'compiled-route.cjs');
const { compiledRoute } = require(path.join(ENGINE_DIR, 'compiled-route.cjs'));
const { compileRegistry } = require(path.join(SK_CODE_LIB, 'registry-compiler.cjs'));
const { applySurfaceHint, evaluateCanary } = require(path.join(SK_CODE_LIB, 'canary-router.cjs'));

const SKILLED_TESTING = 'Add an integration test and unit test coverage plan for a TypeScript advisor module, including vitest checks.';
const SKILLED_LANGUAGE = 'Check a TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish.';
const REVIEW_SKILLED = 'pr review opencode typescript';
const REVIEW_CI_SKILLED = 'review the github actions workflow yaml for the typescript bundle';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// A temporary activation root whose sk-code manifest selects the policy the
// engine compiles right now. The cases test hint ordering, so they must not
// depend on whether the committed manifest has been re-minted yet.
const ACTIVATION_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'surface-hint-activation-'));
const selected = compiledRoute('sk-code', SKILLED_TESTING);
fs.mkdirSync(path.join(ACTIVATION_ROOT, 'sk-code'));
fs.writeFileSync(path.join(ACTIVATION_ROOT, 'sk-code', 'manifest.json'), JSON.stringify({
  servingAuthority: 'compiled',
  selectedPolicy: { effectivePolicyHash: selected.effectivePolicyHash, generation: selected.generation },
}));
process.env.SPECKIT_ACTIVATION_ROOT_OVERRIDE = ACTIVATION_ROOT;
// Compiled routing is default-on. Clear the flag so an operator's shell cannot
// turn every answer into the legacy sentinel.
delete process.env.SPECKIT_COMPILED_ROUTING;
const { resolveRoute } = require(path.join(ENGINE_DIR, 'resolve.cjs'));

after(() => fs.rmSync(ACTIVATION_ROOT, { recursive: true, force: true }));

function modes(route) {
  return route.targets.map((target) => target.workflowMode);
}

function targetModes(targets) {
  return targets.map((target) => target.destinationId.workflowMode);
}

// The live sk-code registry and router, with a surface packet another repository
// adds to the hub. It declares a specific surfaceDetection block and takes its
// tie-break slot ahead of the fallback, as the compiler requires.
function hubWithAddedSurface() {
  const registry = JSON.parse(fs.readFileSync(path.join(SK_CODE_ROOT, 'mode-registry.json'), 'utf8'));
  const hubRouter = JSON.parse(fs.readFileSync(path.join(SK_CODE_ROOT, 'hub-router.json'), 'utf8'));
  registry.modes.push({
    workflowMode: 'sk-code-webflow',
    packetKind: 'surface',
    backendKind: 'evidence-base',
    packet: 'sk-code-webflow',
    packetSkillName: 'sk-code-webflow',
    aliases: [],
    advisorRouting: { routingClass: 'metadata' },
    surfaceDetection: { label: 'WEBFLOW', role: 'specific', pathMarkers: ['src/2_javascript/'], contentMarkers: ['--vw-'] },
  });
  hubRouter.routerSignals['sk-code-webflow'] = { weight: 4, classes: ['code-webflow-runtime'], resources: ['sk-code-webflow/SKILL.md'] };
  hubRouter.vocabularyClasses['code-webflow-runtime'] = { keywords: ['webflow'] };
  const tieBreak = hubRouter.routerPolicy.tieBreak;
  tieBreak.splice(tieBreak.length - 1, 0, 'sk-code-webflow');
  return { registry, hubRouter };
}

function compileHub({ registry, hubRouter }) {
  const skillMarkdown = fs.readFileSync(path.join(SK_CODE_ROOT, 'SKILL.md'), 'utf8');
  return compileRegistry({
    activationGeneration: 1,
    hubRouter,
    registry,
    skillMarkdown,
    sourceBytes: {
      'SKILL.md': Buffer.from(skillMarkdown, 'utf8'),
      'hub-router.json': Buffer.from(JSON.stringify(hubRouter), 'utf8'),
      'mode-registry.json': Buffer.from(JSON.stringify(registry), 'utf8'),
    },
  });
}

function routedTargets(snapshot, prompt, surfaceHint) {
  const { decision } = evaluateCanary(snapshot, { prompt });
  assert.equal(decision.action, 'route', prompt);
  return targetModes(applySurfaceHint(snapshot, decision.route.targets, surfaceHint));
}

function runFrontDoor(args) {
  return spawnSync(process.execPath, [FRONT_DOOR, ...args], { encoding: 'utf8', env: { ...process.env } });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESOLVER
// ─────────────────────────────────────────────────────────────────────────────

test('without a hint the only shipped surface is selected', () => {
  const route = resolveRoute('sk-code', SKILLED_TESTING);
  assert.equal(route.action, 'route');
  assert.equal(route.selectionKind, 'single');
  assert.deepEqual(modes(route), ['sk-code-skilled']);
});

test('a matching surface hint preserves the single-surface route', () => {
  for (const prompt of [SKILLED_TESTING, SKILLED_LANGUAGE]) {
    const route = resolveRoute('sk-code', prompt, { surfaceHint: 'SKILLED' });
    assert.equal(route.selectionKind, 'single');
    assert.deepEqual(modes(route), ['sk-code-skilled']);
  }
});

test('a hint the prompt did not match, UNKNOWN or an unknown name changes nothing', () => {
  const plain = resolveRoute('sk-code', SKILLED_TESTING);
  for (const surfaceHint of ['UNKNOWN', 'not-a-surface', '']) {
    assert.deepEqual(resolveRoute('sk-code', SKILLED_TESTING, { surfaceHint }), plain);
  }
});

test('a workflow mode stays first with the shipped surface', () => {
  const route = resolveRoute('sk-code', REVIEW_SKILLED, { surfaceHint: 'SKILLED' });
  assert.equal(route.selectionKind, 'surfaceBundle');
  assert.deepEqual(modes(route), ['sk-code-review', 'sk-code-skilled']);
});

// SKILLED is the fallback surface, so it ranks after every other surface. A
// session hint naming it confirms that order and never moves it forward.
test('a SKILLED hint never moves the fallback ahead of another surface', () => {
  const plain = resolveRoute('sk-code', REVIEW_CI_SKILLED);
  assert.equal(plain.selectionKind, 'surfaceBundle');
  assert.deepEqual(modes(plain), ['sk-code-review', 'sk-code-ci', 'sk-code-skilled']);
  for (const surfaceHint of ['SKILLED', 'sk-code-skilled']) {
    assert.deepEqual(modes(resolveRoute('sk-code', REVIEW_CI_SKILLED, { surfaceHint })), modes(plain));
  }
});

test('a surface another repository adds to the hub outranks SKILLED when both match', () => {
  const snapshot = compileHub(hubWithAddedSurface());
  assert.equal(snapshot.routingModel.surfaceDetection.fallback, 'sk-code-skilled');
  assert.deepEqual(snapshot.routingModel.surfaceDetection.specific, ['sk-code-webflow']);
  const prompt = 'fix the webflow slider typescript';
  for (const surfaceHint of [undefined, 'SKILLED', 'WEBFLOW']) {
    assert.deepEqual(routedTargets(snapshot, prompt, surfaceHint), ['sk-code-webflow', 'sk-code-skilled'], String(surfaceHint));
  }
  assert.deepEqual(
    routedTargets(snapshot, `review the ${prompt}`, 'WEBFLOW'),
    ['sk-code-review', 'sk-code-webflow', 'sk-code-skilled'],
  );
});

test('SKILLED alone still routes when a hub also declares another surface', () => {
  const snapshot = compileHub(hubWithAddedSurface());
  for (const surfaceHint of [undefined, 'SKILLED', 'WEBFLOW']) {
    assert.deepEqual(routedTargets(snapshot, 'fix the typescript helper', surfaceHint), ['sk-code-skilled'], String(surfaceHint));
  }
});

test('the compiler rejects a hub whose fallback surface is not exactly one or not last', () => {
  const notLast = hubWithAddedSurface();
  const tieBreak = notLast.hubRouter.routerPolicy.tieBreak;
  tieBreak.splice(tieBreak.indexOf('sk-code-skilled'), 1);
  tieBreak.splice(tieBreak.indexOf('sk-code-webflow'), 0, 'sk-code-skilled');
  assert.throws(() => compileHub(notLast), { code: 'SURFACE_FALLBACK_INVALID', message: /must be last/ });

  const twoFallbacks = hubWithAddedSurface();
  twoFallbacks.registry.modes.find((mode) => mode.workflowMode === 'sk-code-webflow').surfaceDetection.role = 'fallback';
  assert.throws(() => compileHub(twoFallbacks), { code: 'SURFACE_FALLBACK_INVALID', message: /exactly one fallback/ });

  const noFallback = hubWithAddedSurface();
  delete noFallback.registry.modes.find((mode) => mode.workflowMode === 'sk-code-skilled').surfaceDetection;
  assert.throws(() => compileHub(noFallback), { code: 'SURFACE_FALLBACK_INVALID', message: /found 0/ });
});

test('a CI workflow prompt bundles the CI surface', () => {
  const route = resolveRoute('sk-code', 'review the github actions workflow yaml');
  assert.equal(route.action, 'route');
  assert.equal(route.selectionKind, 'surfaceBundle');
  assert.deepEqual(modes(route), ['sk-code-review', 'sk-code-ci']);
});

// A matrix, a ruleset, a cache key, a fail-fast check, a concurrency group or a
// workflow timeout also names non-CI code, so the CI surface keys on the GitHub
// Actions form of each phrase and these prompts must stay off it.
test('non-CI prompts that share CI words do not select the CI surface', () => {
  for (const prompt of [
    'fix the cache key in the bun lockfile loader',
    'the ruleset in the advisor scorer is wrong',
    'write a vitest test matrix for the parser',
    'make the config loader fail-fast on a missing DATABASE_URL',
    'assign each tenant its own concurrency group inside the worker pool',
    'the Temporal workflow timeout on order-fulfilment is too short, raise it',
  ]) {
    const route = resolveRoute('sk-code', prompt);
    assert.ok(route, prompt);
    assert.ok(!modes(route).includes('sk-code-ci'), prompt);
  }
});

test('a hub without surface packets ignores the hint', () => {
  for (const hubId of ['sk-doc', 'mcp-tooling']) {
    for (const prompt of ['create a new skill and validate the docs', 'use the figma mcp transport']) {
      assert.deepEqual(compiledRoute(hubId, prompt, { surfaceHint: 'SKILLED' }), compiledRoute(hubId, prompt));
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. FRONT DOOR
// ─────────────────────────────────────────────────────────────────────────────

test('the front door passes --surface-hint through and keeps stdout to one route line', () => {
  const plain = runFrontDoor(['--hub', 'sk-code', '--prompt', SKILLED_TESTING]);
  const hinted = runFrontDoor(['--hub', 'sk-code', '--prompt', SKILLED_TESTING, '--surface-hint', 'SKILLED']);
  const invalid = runFrontDoor(['--hub', 'sk-code', '--prompt', SKILLED_TESTING, '--surface-hint', 'not-a-surface']);
  for (const run of [plain, hinted, invalid]) {
    assert.equal(run.status, 0);
    assert.equal(run.stderr, '');
  }
  assert.deepEqual(modes(JSON.parse(hinted.stdout)), ['sk-code-skilled']);
  assert.equal(invalid.stdout, plain.stdout);
});
