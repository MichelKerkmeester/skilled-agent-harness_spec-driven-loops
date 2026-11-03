#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled-Route sk-design Intent Tie Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

const ROUTER_DIR = path.join(
  __dirname, '..', 'lib', 'compiled-routing', '009-parent-hub-rollout', '009-sk-design', 'lib',
);
const { scoreIntents } = require(path.join(ROUTER_DIR, 'canary-router.cjs'));

const TEXT = 'alpha beta gamma';

function snapshot() {
  return {
    routingModel: {
      ambiguityDelta: 0,
      intents: [
        { intent: 'C', keywords: ['gamma'], leafPairs: [], mode: 'm', weight: 1 },
        { intent: 'A', keywords: ['alpha'], leafPairs: [], mode: 'm', weight: 1 },
        { intent: 'B', keywords: ['beta'], leafPairs: [], mode: 'm', weight: 1 },
      ],
      tieBreak: ['m'],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. SAME-MODE INTENT TIE
// ─────────────────────────────────────────────────────────────────────────────

test('a same-mode intent tie sorts by intent name without throwing', () => {
  let result;
  assert.doesNotThrow(() => {
    result = scoreIntents(snapshot(), ['m'], TEXT);
  });
  assert.deepEqual(result.scores.map((entry) => entry.intent), ['A', 'B', 'C']);
});
