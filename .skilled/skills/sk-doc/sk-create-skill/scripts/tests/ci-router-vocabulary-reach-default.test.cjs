#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-router-vocabulary-reach-default.test — the reach gate's safe default   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Pins the reach check's default concurrency. A busy advisor reported probe
 * errors at a high default, and a probe that cannot answer is not a phrase that
 * reached nobody, so the default is deliberately low. `--concurrency` still
 * overrides it for a one-off run.
 */

const { test } = require('node:test');
const assert = require('node:assert/strict');

const { DEFAULT_CONCURRENCY } = require('../ci-router-vocabulary-reach.cjs');

test('router reach defaults to concurrency 2', () => {
  assert.equal(DEFAULT_CONCURRENCY, 2);
});
