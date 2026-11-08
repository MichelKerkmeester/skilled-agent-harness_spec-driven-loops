#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled-Route Subsumed Alias Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A one-word executor name that appears only inside another mode's longer phrase
// is part of that phrase. "The OpenCode Go route" names a DeepSeek Harness route,
// so it must not also pull in an OpenCode dispatch, while a prompt that names
// both executors still bundles them.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');

const ENGINE_DIR = path.join(__dirname, '..', 'lib', 'compiled-routing', '014-runtime-engine', 'lib');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// A temporary activation root whose manifest selects the policy the hub compiles
// right now, so the cases do not depend on a re-minted committed manifest.
const ACTIVATION_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'subsumed-alias-activation-'));
process.env.SPECKIT_ACTIVATION_ROOT_OVERRIDE = ACTIVATION_ROOT;
delete process.env.SPECKIT_COMPILED_ROUTING;

const { compiledRoute } = require(path.join(ENGINE_DIR, 'compiled-route.cjs'));

const HUB = 'cli-external-orchestration';
const policy = compiledRoute(HUB, 'delegate to dsh');
fs.mkdirSync(path.join(ACTIVATION_ROOT, HUB), { recursive: true });
fs.writeFileSync(path.join(ACTIVATION_ROOT, HUB, 'manifest.json'), JSON.stringify({
  servingAuthority: 'compiled',
  selectedPolicy: { effectivePolicyHash: policy.effectivePolicyHash, generation: policy.generation },
}));

after(() => fs.rmSync(ACTIVATION_ROOT, { recursive: true, force: true }));

function modes(prompt) {
  return (compiledRoute(HUB, prompt).targets ?? []).map((target) => target.workflowMode);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('a DeepSeek Harness run over the OpenCode Go route routes to the harness alone', () => {
  assert.deepEqual(modes('Run a headless DeepSeek Harness review over the OpenCode Go route'), ['cli-deepseek-harness']);
});

test('a prompt that names both executors still bundles them', () => {
  assert.deepEqual(modes('delegate to dsh over the opencode go route and also delegate to opencode'), [
    'cli-opencode',
    'cli-deepseek-harness',
  ]);
});

test('an OpenCode dispatch that names an OpenCode Go model stays on OpenCode', () => {
  assert.deepEqual(modes('use cli-opencode with opencode-go/deepseek-v4.1-flash to review the diff'), ['cli-opencode']);
});
