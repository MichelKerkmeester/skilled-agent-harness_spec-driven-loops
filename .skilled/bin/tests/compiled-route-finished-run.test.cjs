#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled-Route Finished-Run Clause Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

const ENGINE_DIR = path.join(__dirname, '..', 'lib', 'compiled-routing', '014-runtime-engine', 'lib');
const { compiledRoute } = require(path.join(ENGINE_DIR, 'compiled-route.cjs'));

const HUB = 'system-deep-loop';

function modes(route) {
  return route.targets.map((target) => target.workflowMode);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FINISHED-RUN CLAUSE
// ─────────────────────────────────────────────────────────────────────────────

test('a finished-run clause alone names no mode', () => {
  assert.equal(compiledRoute(HUB, 'We just finished a deep-research run.').action, 'defer');
  assert.equal(compiledRoute(HUB, 'I completed the deep review loop yesterday.').action, 'defer');
});

test('a diagnosis request that mentions the finished run defers', () => {
  const route = compiledRoute(HUB, 'Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run.');
  assert.equal(route.action, 'defer');
});

test('a request that follows the finished-run clause still routes', () => {
  const route = compiledRoute(HUB, 'We just finished a deep-research run. Now start a deep review of the diff.');
  assert.equal(route.action, 'route');
  assert.deepEqual(modes(route), ['review']);
});

test('a run request is not a finished-run clause', () => {
  for (const prompt of [
    'For a deep research run, resolve the mode through the registry.',
    'Run a one-lineage deep-research fan-out on the spec folder.',
  ]) {
    const route = compiledRoute(HUB, prompt);
    assert.equal(route.action, 'route', prompt);
    assert.deepEqual(modes(route), ['research'], prompt);
  }
});
