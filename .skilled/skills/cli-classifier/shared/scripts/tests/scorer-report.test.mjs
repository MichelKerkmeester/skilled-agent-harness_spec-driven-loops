// ───────────────────────────────────────────────────────────────────
// MODULE: Scorer Report Tests
// ───────────────────────────────────────────────────────────────────
// Every case runs in process and stays deterministic: no scorer starts, no
// file outside the temp directories is touched and no key is read.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';

import * as R from '../scorer-report.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ───────────────────────────────────────────────────────────────────

// Fresh temp directory whose name marks it as a fixture.
function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `scorerreport-${prefix}-`));
}

// ───────────────────────────────────────────────────────────────────
// 3. TESTS
// ───────────────────────────────────────────────────────────────────

test('pinRowSet pins the rows and extras behind one digest', () => {
  const rows = [
    { id: 'r1', track: 'alpha', questionSha256: 'aa' },
    { id: 'r2', track: 'beta', questionSha256: 'bb' },
  ];
  const pin = R.pinRowSet(rows, { optionSetSha256: 'abc' });
  const expected = createHash('sha256')
    .update(JSON.stringify({ rows, optionSetSha256: 'abc' }))
    .digest('hex');
  assert.equal(pin.rowSetSha256, expected);
  assert.deepEqual(Object.keys(pin), ['rowSetSha256', 'rowCount', 'optionSetSha256', 'rows']);
  const changed = R.pinRowSet(
    [{ id: 'r1', track: 'alpha', questionSha256: 'cc' }, rows[1]],
    { optionSetSha256: 'abc' },
  );
  assert.notEqual(changed.rowSetSha256, pin.rowSetSha256);
});

test('outDirectoryHoldsRun sees either durable run artifact', () => {
  const emptyDir = tempDir('empty');
  const reportDir = tempDir('report');
  const callsDir = tempDir('calls');
  try {
    assert.equal(R.outDirectoryHoldsRun(undefined), false);
    assert.equal(R.outDirectoryHoldsRun(''), false);
    assert.equal(R.outDirectoryHoldsRun(emptyDir), false);
    fs.writeFileSync(path.join(reportDir, 'report.json'), '{}');
    assert.equal(R.outDirectoryHoldsRun(reportDir), true);
    fs.writeFileSync(path.join(callsDir, 'calls.jsonl'), '');
    assert.equal(R.outDirectoryHoldsRun(callsDir), true);
  } finally {
    fs.rmSync(emptyDir, { recursive: true, force: true });
    fs.rmSync(reportDir, { recursive: true, force: true });
    fs.rmSync(callsDir, { recursive: true, force: true });
  }
});

test('probabilityAwarePick sums probabilities instead of counting votes', () => {
  const spread = [
    { pick: 'a', pickProb: 0.4 },
    { pick: 'a', pickProb: 0.4 },
    { pick: 'b', pickProb: 0.95 },
  ];
  assert.equal(R.probabilityAwarePick(spread, 'none'), 'b');
  const withNone = [
    { pick: 'a', pickProb: 0.5, noneProb: 0.1 },
    { pick: 'b', pickProb: 0.9, noneProb: 0.05 },
    { pick: 'a', pickProb: 0.5 },
  ];
  assert.equal(R.probabilityAwarePick(withNone, 'none'), 'a');
  assert.equal(R.probabilityAwarePick([{ pick: null, pickProb: 0.9 }], 'none'), null);
  assert.equal(R.probabilityAwarePick([], 'none'), null);
  assert.equal(
    R.probabilityAwarePick(
      [{ pick: 'none', pickProb: null, noneProb: 0.7 }, { pick: 'a', pickProb: 0.6 }],
      'none',
    ),
    'none',
  );
});

test('decidedSubset excludes abstentions from the accuracy', () => {
  const pairs = [
    { pick: 'a', gold: 'a' },
    { pick: 'none', gold: 'a' },
    { pick: 'b', gold: 'a' },
  ];
  assert.deepEqual(R.decidedSubset(pairs, 'none'), {
    decidedCount: 2,
    decidedCorrect: 1,
    decidedAccuracy: 0.5,
  });
  assert.deepEqual(R.decidedSubset([]), {
    decidedCount: 0,
    decidedCorrect: 0,
    decidedAccuracy: null,
  });
});

test('marginSlack removes the measured-row slack', () => {
  assert.equal(R.marginSlack({ A: 30, B: 20, M: 90 }), 1);
  assert.equal(R.marginSlack({ A: 30, B: 20, M: 0 }), null);
});

test('clusterBootstrapInterval is deterministic across calls', () => {
  const items = [
    { cluster: 'alpha', delta: 1 },
    { cluster: 'alpha', delta: 1 },
    { cluster: 'beta', delta: 0 },
    { cluster: 'beta', delta: 0 },
    { cluster: 'gamma', delta: 0 },
  ];
  const first = R.clusterBootstrapInterval(items, 'seed');
  const second = R.clusterBootstrapInterval(items, 'seed');
  assert.deepEqual(first, second);
  assert.equal(first.clusterCount, 3);
  assert.equal(first.replicates, 1000);
  assert.equal(first.estimate, 0.4);
  assert.ok(first.lower <= first.upper);
  assert.deepEqual(R.clusterBootstrapInterval([], 'seed'), {
    clusterCount: 0,
    replicates: 1000,
    estimate: null,
    lower: null,
    upper: null,
  });
});

test('the report line formatters render filled and none forms', () => {
  assert.equal(
    R.decidedSubsetLine('probability-aware', {
      decidedCount: 2,
      decidedCorrect: 1,
      decidedAccuracy: 0.5,
    }),
    'decided-subset probability-aware: 1/2 accuracy=0.5000',
  );
  assert.equal(
    R.decidedSubsetLine('probability-aware', {
      decidedCount: 0,
      decidedCorrect: 0,
      decidedAccuracy: null,
    }),
    'decided-subset probability-aware: 0/0 accuracy=none',
  );
  assert.equal(
    R.marginSlackLine('probability-aware', 1),
    'margin slack probability-aware: 1.0 rows',
  );
  assert.equal(
    R.marginSlackLine('probability-aware', null),
    'margin slack probability-aware: none rows',
  );
  assert.equal(
    R.bootstrapLine('probability-aware', {
      clusterCount: 3,
      replicates: 1000,
      lower: -0.1234,
      upper: 0.5678,
    }),
    'bootstrap probability-aware vs baseline: accuracy_delta_95_ci=[-0.1234,0.5678]'
      + ' clusters=3 replicates=1000',
  );
  assert.equal(
    R.bootstrapLine('probability-aware', {
      clusterCount: 0,
      replicates: 1000,
      lower: null,
      upper: null,
    }),
    'bootstrap probability-aware vs baseline: accuracy_delta_95_ci=[none,none]'
      + ' clusters=0 replicates=1000',
  );
});

test('CommonJS require reaches the module exports', () => {
  const require = createRequire(import.meta.url);
  const required = require('../scorer-report.mjs');
  assert.equal(typeof required.pinRowSet, 'function');
});
