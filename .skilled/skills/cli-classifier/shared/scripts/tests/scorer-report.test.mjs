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

test('binomialTailHalf counts the exact tail of a fair coin', () => {
  assert.deepEqual(R.binomialTailHalf(10, 8), { num: 56n, den: 1024n });
  assert.deepEqual(R.binomialTailHalf(0, 0), { num: 1n, den: 1n });
  const whole = R.binomialTailHalf(6, 0);
  assert.equal(whole.num, whole.den);
});

test('signTestPower matches the exact one-sided sign test', () => {
  assert.equal(R.signTestPower(30, 0.6).toFixed(4), '0.2915');
  assert.equal(R.signTestPower(40, 0.75).toFixed(4), '0.9456');
  assert.equal(R.signTestPower(188, 0.588).toFixed(4), '0.7731');
  assert.equal(R.signTestPower(5, 0.9).toFixed(4), '0.5905');
  assert.equal(R.signTestPower(4, 0.99), 0);
});

test('pairsForPower finds the smallest count that reaches the target', () => {
  assert.equal(R.pairsForPower(0.65), 69);
  assert.equal(R.pairsForPower(0.588), 205);
  assert.equal(R.pairsForPower(0.6), 158);
});

test('pairsForPower returns null at or below even odds without a scan', () => {
  const started = Date.now();
  assert.equal(R.pairsForPower(0.5), null);
  assert.equal(R.pairsForPower(0.3), null);
  assert.ok(Date.now() - started < 1000);
});

test('pairsForPower scans even odds when the target sits below alpha', () => {
  assert.equal(R.pairsForPower(0.5, 0.01), 5);
});

test('pairsForPower agrees with a brute-force sign-test scan', () => {
  for (const winRate of [0.7, 0.75, 0.9]) {
    let expected = null;
    for (let pairs = 1; pairs <= 300; pairs += 1) {
      if (R.signTestPower(pairs, winRate) >= 0.8) {
        expected = pairs;
        break;
      }
    }
    assert.notEqual(expected, null);
    assert.equal(R.pairsForPower(winRate, 0.8, 300), expected);
  }
});

test('pairsForPower resolves a thin edge inside the time bound', () => {
  const started = Date.now();
  const pairs = R.pairsForPower(0.52);
  const elapsed = Date.now() - started;
  assert.equal(typeof pairs, 'number');
  assert.ok(elapsed < 5000, `pairsForPower(0.52) took ${elapsed} ms`);
});

test('minimumDetectableWinRate bisects for the target power', () => {
  assert.equal(R.minimumDetectableWinRate(30).toFixed(4), '0.7184');
  assert.equal(R.minimumDetectableWinRate(40).toFixed(4), '0.6981');
});

test('strongestPolicy picks the highest count and breaks ties by name', () => {
  assert.deepEqual(R.strongestPolicy({ beta: 3, alpha: 3, gamma: 1 }), { name: 'alpha', right: 3 });
  assert.deepEqual(R.strongestPolicy({ beta: 1, gamma: 4 }), { name: 'gamma', right: 4 });
  assert.deepEqual(R.strongestPolicy({}), { name: null, right: 0 });
});

test('beatsStrongestPolicy needs a strictly higher right count', () => {
  assert.deepEqual(R.beatsStrongestPolicy(4, { beta: 3 }), { pass: true, name: 'beta', right: 3 });
  assert.deepEqual(R.beatsStrongestPolicy(3, { beta: 3 }), { pass: false, name: 'beta', right: 3 });
});

test('classFloor reports the failing class and passes when every class holds', () => {
  const mixed = [
    { cls: 'alpha', jevRight: true, baselineRight: true },
    { cls: 'alpha', jevRight: true, baselineRight: false },
    { cls: 'beta', jevRight: false, baselineRight: true },
  ];
  const floor = R.classFloor(mixed);
  assert.deepEqual(floor.classes, [
    { cls: 'alpha', n: 2, jev: 2, baseline: 1 },
    { cls: 'beta', n: 1, jev: 0, baseline: 1 },
  ]);
  assert.deepEqual(floor.failing, ['beta']);
  assert.equal(floor.pass, false);
  const held = [
    { cls: 'alpha', jevRight: true, baselineRight: true },
    { cls: 'beta', jevRight: false, baselineRight: false },
  ];
  assert.equal(R.classFloor(held).pass, true);
  assert.deepEqual(R.classFloor(held).failing, []);
  assert.deepEqual(R.classFloor([]), { pass: true, classes: [], failing: [] });
});

test('the keep-rule line formatters render filled and none forms', () => {
  assert.equal(
    R.powerLine('probability-aware', { pairs: 30, winRate: 0.6 }),
    'power probability-aware: pairs=30 win_rate=0.6000 power=0.2915'
      + ' pairs_for_80=158 mde_win_rate=0.7184',
  );
  assert.equal(
    R.powerLine('probability-aware', { pairs: 30, winRate: null }),
    'power probability-aware: pairs=30 win_rate=none power=none'
      + ' pairs_for_80=none mde_win_rate=0.7184',
  );
  assert.equal(
    R.strongestPolicyLine('probability-aware', 4, { pass: true, name: 'beta', right: 3 }),
    'strongest policy probability-aware: policy=beta right=3 jev=4 pass=yes',
  );
  assert.equal(
    R.strongestPolicyLine('probability-aware', 2, { pass: false, name: null, right: 0 }),
    'strongest policy probability-aware: policy=none right=0 jev=2 pass=no',
  );
  assert.deepEqual(
    R.classFloorLines('probability-aware', {
      pass: false,
      classes: [
        { cls: 'alpha', n: 2, jev: 2, baseline: 1 },
        { cls: 'beta', n: 1, jev: 0, baseline: 1 },
      ],
      failing: ['beta'],
    }),
    [
      'class floor probability-aware alpha: n=2 jev=2 baseline=1',
      'class floor probability-aware beta: n=1 jev=0 baseline=1',
      'class floor probability-aware: failing=beta',
    ],
  );
  assert.deepEqual(
    R.classFloorLines('probability-aware', { pass: true, classes: [], failing: [] }),
    ['class floor probability-aware: failing=none'],
  );
});

test('CommonJS require reaches the module exports', () => {
  const require = createRequire(import.meta.url);
  const required = require('../scorer-report.mjs');
  assert.equal(typeof required.pinRowSet, 'function');
});
