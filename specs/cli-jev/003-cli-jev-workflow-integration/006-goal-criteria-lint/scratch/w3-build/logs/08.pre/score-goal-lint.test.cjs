// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-goal-lint tests: synthetic fixture labels                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { test } = require('node:test');

const {
  STOP_LINE,
  wilsonInterval,
  scoreLabels,
  formatScore
} = require('../score-goal-lint.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEST FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// Every record and label is synthetic, so the expected numbers are fixed by
// this file alone and no goal tree or label store has to exist.

function rec(hash, cls, rule4, rule5) {
  return { id: 'specs/a/goal.md:' + hash, text_sha12: hash, class: cls, rule4, rule5 };
}

function lab(hash, r4, r5) {
  return { id: 'x', text_sha12: hash, rubric: 'mimo-02-strict-v1', rule4_ok: r4, rule5_ok: r5, labeler: 'fixture' };
}

const RECORDS = [
  rec('a1', 'scored', ['The report'], []),
  rec('a2', 'scored', ['the rows'], ['as described in']),
  rec('a3', 'scored', [], []),
  rec('a4', 'scored', [], [])
];

const LABELS = [
  lab('a1', false, true),
  lab('a2', true, false),
  lab('a3', false, false),
  lab('a4', true, true)
];

const L = (rows, recs) => formatScore(scoreLabels(rows, recs));

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('per-rule precision, recall and F1', () => {
  const lines = L(LABELS, RECORDS);

  assert.ok(lines.includes('rule4 tp=1 fp=1 fn=1 tn=1 precision=0.5000 recall=0.5000 f1=0.5000'));
  assert.ok(lines.includes('rule5 tp=1 fp=0 fn=1 tn=2 precision=1.0000 recall=0.5000 f1=0.6667'));
});

test('the labeled violation rate carries a Wilson 95% interval', () => {
  const lines = L(LABELS, RECORDS);

  assert.ok(lines.includes('labeled_violation_rate=3/4=0.7500 wilson95=[0.3006,0.9544]'));
  assert.ok(!lines.includes(STOP_LINE));
  assert.equal(wilsonInterval(0, 0), null);
  assert.equal(wilsonInterval(0, 20)[0], 0);
});

test('a rate under 0.05 prints the stop line', () => {
  const records = [];
  const rows = [];
  for (let i = 0; i < 25; i += 1) {
    const hash = 'c' + String(i).padStart(11, '0');
    records.push(rec(hash, 'scored', [], []));
    rows.push(lab(hash, i !== 0, true));
  }

  const lines = L(rows, records);
  assert.ok(lines.includes('labeled_violation_rate=1/25=0.0400 wilson95=[0.0071,0.1954]'));
  assert.equal(lines[lines.length - 1], STOP_LINE);
  assert.equal(STOP_LINE, 'r20 model arm not built: labeled_violation_rate<0.05');
});

test('stale labels and unscored lines leave every rate', () => {
  const rows = [...LABELS, lab('ffffffffffff', false, false), lab('a5', false, false)];
  const records = [...RECORDS, rec('a5', 'placeholder', [], [])];

  const lines = L(rows, records);
  assert.ok(lines.includes('stale=1'));
  assert.ok(lines.includes('not_scored=1'));
  assert.ok(lines.includes('labeled=4'));
  assert.ok(lines.includes('labeled_violation_rate=3/4=0.7500 wilson95=[0.3006,0.9544]'));
});

test('unlabeled rows print no rate', () => {
  const rows = ['a1', 'a2', 'a3'].map((hash) => ({
    id: 'x',
    text_sha12: hash,
    rubric: null,
    rule4_ok: null,
    rule5_ok: null,
    labeler: null
  }));

  assert.deepEqual(L(rows, RECORDS), [
    'rows=3',
    'rubric=none',
    'unlabeled=3',
    'stale=0',
    'not_scored=0',
    'labeled=0',
    'no labeled rows'
  ]);
});

test('mixed rubrics print a mismatch and no rate', () => {
  const rows = [lab('a1', true, true), { ...lab('a2', true, true), rubric: 'c' }];

  assert.deepEqual(L(rows, RECORDS), ['rows=2', 'rubric mismatch: c,mimo-02-strict-v1']);
});
