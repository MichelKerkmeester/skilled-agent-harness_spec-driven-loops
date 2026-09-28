// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: score-verifier labeled-set test suite (node --test)           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Unit coverage for the row loader, label and verdict             ║
// ║          normalization, reason categories and the report and decision    ║
// ║          lines, plus CLI coverage that spawns the scorer on synthetic    ║
// ║          sets in temp dirs with stub jev and cli-deem binaries on PATH.  ║
// ║          No test reads a real session.                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const scorer = require('./score-verifier-labeled-set.cjs');
const core = require('./goal-core.cjs');

// Build one valid pi row; a test deletes or overwrites a field to make it fail.
function row(id, label) {
  return {
    id,
    source: 'pi',
    objective: 'Ship the widget exporter',
    raw_text: 'r',
    ingested_text: 'r',
    raw_length: 1,
    label,
  };
}

test('normalizeLabel folds aliases, blanks and unknown values', () => {
  assert.equal(scorer.normalizeLabel('met'), 'met');
  assert.equal(scorer.normalizeLabel('not-met'), 'not_met');
  assert.equal(scorer.normalizeLabel(' NOT_MET '), 'not_met');
  assert.equal(scorer.normalizeLabel('blocked'), 'blocked');
  assert.equal(scorer.normalizeLabel(''), 'unlabeled');
  assert.equal(scorer.normalizeLabel(undefined), 'unlabeled');
  assert.equal(scorer.normalizeLabel('unclear'), 'invalid');
  assert.equal(scorer.normalizeLabel('done'), 'invalid');
});

test('normalizeVerdict passes the four verdicts and folds not-met', () => {
  assert.equal(scorer.normalizeVerdict('not-met'), 'not_met');
  assert.equal(scorer.normalizeVerdict('unclear'), 'unclear');
  assert.equal(scorer.normalizeVerdict('met'), 'met');
  assert.throws(() => scorer.normalizeVerdict('maybe'), /unknown verdict: maybe/);
});

test('reasonCategory maps the verifier reasons and defaults to other', () => {
  assert.equal(scorer.reasonCategory('Evidence is too short to prove completion'), 'too_short');
  assert.equal(scorer.reasonCategory('Evidence includes blocking or incomplete-work language'), 'blocking');
  assert.equal(scorer.reasonCategory('Evidence appears truncated before it proves completion'), 'truncated');
  assert.equal(scorer.reasonCategory('Evidence lacks an explicit completion signal'), 'no_completion');
  assert.equal(scorer.reasonCategory('Evidence does not reference the goal objective specifically enough'), 'weak_link');
  assert.equal(scorer.reasonCategory('Evidence gives an explicit completion signal tied to the goal objective'), 'met');
  assert.equal(scorer.reasonCategory('Verifier returned no usable result'), 'other');
});

test('loadRows keeps labeled and unlabeled rows and counts sources', () => {
  const result = scorer.loadRows([
    JSON.stringify(row('r1', 'met')),
    JSON.stringify(row('r2', '')),
    JSON.stringify(row('r3', 'not-met')),
  ].join('\n'));

  assert.equal(result.total, 3);
  assert.equal(result.labeled.length, 2);
  assert.equal(result.labeled[1].label, 'not_met');
  assert.equal(result.unlabeled, 1);
  assert.deepEqual(result.sources, { claude: 0, pi: 3 });
  assert.deepEqual(result.errors, []);
});

test('loadRows drops only the failing rows and refs each error', () => {
  const missingRawText = row('r4', 'met');
  delete missingRawText.raw_text;
  const result = scorer.loadRows([
    JSON.stringify(row('r1', 'met')),
    JSON.stringify(row('r1', 'met')),
    '{bad',
    JSON.stringify(row('r3', 'done')),
    JSON.stringify(missingRawText),
  ].join('\n'));

  assert.deepEqual(result.errors, [
    'row r1: duplicate id',
    'line 3: not JSON',
    'row r3: label "done" is not met, not_met, not-met or blocked',
    'row r4: raw_text must be a string',
  ]);
});

test('reportLines prints three arms, the clamp count and the wrapper count', () => {
  const labels = ['met', 'met', 'not_met', 'blocked'];
  const rows = labels.map((label, index) => ({ id: 'r' + index, label }));
  const answer = (verdict, category) => ({ verdict, category });
  const results = [
    {
      heuristic: answer('not_met', 'truncated'),
      tail_window: answer('met', 'met'),
      parity: answer('unclear', 'truncated'),
    },
    {
      heuristic: answer('met', 'met'),
      tail_window: answer('met', 'met'),
      parity: answer('met', 'met'),
    },
    {
      heuristic: answer('met', 'met'),
      tail_window: answer('met', 'met'),
      parity: answer('met', 'met'),
    },
    {
      heuristic: answer('not_met', 'blocking'),
      tail_window: answer('not_met', 'blocking'),
      parity: answer('not_met', 'blocking'),
    },
  ];

  const lines = scorer.reportLines(rows, results);
  assert.equal(lines.length, 24);
  assert.deepEqual(lines.slice(0, 7), [
    'arm: heuristic',
    'table: verdict=met label_met=1 label_not_met=1 label_blocked=0',
    'table: verdict=not_met label_met=1 label_not_met=0 label_blocked=1',
    'table: verdict=blocked label_met=0 label_not_met=0 label_blocked=0',
    'table: verdict=unclear label_met=0 label_not_met=0 label_blocked=0',
    'two_class: arm=heuristic false_met=1 false_not_met=1 labeled_met=2 false_not_met_rate=0.50',
    'errors: arm=heuristic too_short=0 blocking=0 truncated=1 no_completion=0 weak_link=0 other=0']);
  assert.equal(lines[7], 'arm: tail_window');
  assert.equal(lines[14], 'arm: parity');
  assert.equal(lines[12], 'two_class: arm=tail_window false_met=1 false_not_met=0 labeled_met=2 false_not_met_rate=0.00');
  assert.equal(lines[18], 'table: verdict=unclear label_met=1 label_not_met=0 label_blocked=0');
  assert.equal(lines[19], 'two_class: arm=parity false_met=1 false_not_met=1 labeled_met=2 false_not_met_rate=0.50');
  assert.deepEqual(lines.slice(21, 23), ['clamp_defects: 1', 'wrapper: held=1']);
  assert.ok(lines[23].startsWith('finding: goal-core answers not-met and unclear'));
});

// ─────────────────────────────────────────────────────────────────────────────
// CLI coverage: the scorer arms spawn the goal plugin and report per arm.
// ─────────────────────────────────────────────────────────────────────────────

const SCORER = path.join(__dirname, 'score-verifier-labeled-set.cjs');

// The scorer loads the goal plugin through the .skilled/plugins link. Keeping
// that linked path intact with --preserve-symlinks lets @opencode-ai/plugin
// resolve from .skilled/node_modules, also in a worktree without
// .opencode/node_modules.
function run(args, env) {
  return spawnSync(process.execPath, ['--preserve-symlinks', SCORER, ...args], { encoding: 'utf8', env: env || process.env });
}

// Build one labeled row from its raw text; the ingested side is the redacted
// form the runtime would have stored for it.
function makeRow(id, raw, label) {
  return {
    id,
    source: 'pi',
    objective: 'Ship the widget exporter',
    raw_text: raw,
    ingested_text: core.redactEvidence(raw),
    raw_length: raw.length,
    label,
  };
}

// Write a labeled set as JSONL into a temp dir; the caller removes the dir.
function writeSet(dir, rows) {
  const file = path.join(dir, 'set.jsonl');
  fs.writeFileSync(file, rows.map((entry) => JSON.stringify(entry)).join('\n') + '\n');
  return file;
}

const GOOD = 'The widget exporter shipped and the tests passed for the widget exporter.';
const BLOCKING = 'The widget exporter build failed with an error in the packaging step today.';
const CLAMP = 'lorem ipsum dolor sit amet '.repeat(60).slice(0, 1300 - GOOD.length - 1) + ' ' + GOOD;
assert.equal(CLAMP.length, 1300);

const SET30 = [
  makeRow('c1', CLAMP, 'met'),
  makeRow('b1', BLOCKING, 'not_met'),
  ...Array.from({ length: 28 }, (_, index) => makeRow('g' + index, GOOD, 'met')),
];

test('main counts the set and stops below the labeled-row floor', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-verifier-score-'));
  try {
    const rows = [
      ...Array.from({ length: 29 }, (_, index) => makeRow('m' + index, GOOD, 'met')),
      ...Array.from({ length: 5 }, (_, index) => makeRow('u' + index, GOOD, '')),
    ];
    const result = run(['--set', writeSet(dir, rows)]);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, 'scorer: rows=34 labeled=29 unlabeled=5 claude=0 pi=34\nstop: fewer than 30 rows\n');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('main rejects flags it does not own', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-verifier-score-'));
  try {
    const file = writeSet(dir, SET30);
    const jev = run(['--set', file, '--jev']);
    assert.equal(jev.status, 2);
    assert.ok(jev.stderr.includes('error: unknown flag --jev'));
    const deem = run(['--set', file, '--deem']);
    assert.equal(deem.status, 2);
    assert.ok(deem.stderr.includes('error: unknown flag --deem'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('main scores the set through the plugin arms and writes the zero-call report', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-verifier-score-'));
  const stub = path.join(dir, 'stub');
  const out = path.join(dir, 'out');
  try {
    fs.mkdirSync(stub);
    for (const name of ['jev', 'cli-deem']) {
      fs.writeFileSync(
        path.join(stub, name),
        `#!/bin/sh\necho "$*" >> "$(dirname "$0")/${name}.log"\n`,
        { mode: 0o755 },
      );
    }

    const result = run(
      ['--set', writeSet(dir, SET30), '--out', out],
      { ...process.env, PATH: stub + path.delimiter + process.env.PATH },
    );

    assert.equal(result.status, 0);
    for (const line of [
      'table: verdict=not_met label_met=1 label_not_met=1 label_blocked=0',
      'two_class: arm=heuristic false_met=0 false_not_met=1 labeled_met=29 false_not_met_rate=0.03',
      'errors: arm=heuristic too_short=0 blocking=0 truncated=1 no_completion=0 weak_link=0 other=0',
      'two_class: arm=tail_window false_met=0 false_not_met=0 labeled_met=29 false_not_met_rate=0.00',
      'clamp_defects: 1',
      'wrapper: held=1',
    ]) {
      assert.ok(result.stdout.includes(line), `missing line: ${line}`);
    }
    assert.ok(
      result.stdout.indexOf('table: verdict=unclear label_met=1 label_not_met=0 label_blocked=0')
        > result.stdout.indexOf('arm: parity'),
    );
    assert.equal(fs.existsSync(path.join(stub, 'jev.log')), false);
    assert.equal(fs.existsSync(path.join(stub, 'cli-deem.log')), false);
    assert.equal(fs.readFileSync(path.join(out, 'zero-call-report.txt'), 'utf8'), result.stdout);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Decision coverage: the better-arm pick, the two stops and the gate lines.
// ─────────────────────────────────────────────────────────────────────────────

// Ten met rows; a test moves one or two of them off the all-met baseline.
function tenRows() {
  return Array.from({ length: 10 }, (_, index) => ({ id: 'r' + index, label: 'met' }));
}

// One row's arm answers from a pair of [verdict, category] entries per arm.
function arms(h, t) {
  return {
    heuristic: { verdict: h[0], category: h[1] },
    tail_window: { verdict: t[0], category: t[1] },
    parity: { verdict: h[0], category: h[1] },
  };
}

test('stop: no headroom at a rate of exactly 0.10', () => {
  const rows = tenRows();
  const results = rows.map(() => arms(['met', 'met'], ['met', 'met']));
  results[0] = arms(['not_met', 'truncated'], ['not_met', 'no_completion']);
  assert.deepEqual(scorer.decisionLines(rows, results), [
    'better: arm=heuristic false_met=0 false_not_met_rate=0.10',
    'stop: no headroom',
    'finding: clamp fix for the plugin and goal-core owners: clampText appends "..." and the truncation check then reads the cut evidence as truncated, clamp_defects=1',
  ]);
});

test('stop: no reachable rows when the wrapper rule holds every miss', () => {
  const rows = tenRows();
  const results = rows.map(() => arms(['met', 'met'], ['met', 'met']));
  results[0] = arms(['not_met', 'blocking'], ['not_met', 'blocking']);
  results[1] = arms(['not_met', 'blocking'], ['not_met', 'blocking']);
  assert.deepEqual(scorer.decisionLines(rows, results), [
    'better: arm=heuristic false_met=0 false_not_met_rate=0.20',
    'stop: no reachable rows',
  ]);
});

test('gate lines when a miss survives both the tail window and the wrapper rule', () => {
  const rows = tenRows();
  const results = rows.map(() => arms(['met', 'met'], ['met', 'met']));
  results[0] = arms(['not_met', 'no_completion'], ['not_met', 'no_completion']);
  results[1] = arms(['not_met', 'no_completion'], ['not_met', 'no_completion']);
  assert.deepEqual(scorer.decisionLines(rows, results), [
    'better: arm=heuristic false_met=0 false_not_met_rate=0.20',
    'gate: tail_window leaves 2 false not_met rows outside the wrapper rule',
    'gate: deem arm condition holds',
    'gate: jev arm also needs the three redaction cases and a recorded per-call latency, checked by hand',
  ]);
});
