// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-goal-lint tests: synthetic fixture labels                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const {
  STOP_LINE,
  wilsonInterval,
  scoreLabels,
  formatScore,
  parseLabels
} = require('../score-goal-lint.cjs');

const SCORER = path.join(__dirname, '..', 'score-goal-lint.cjs');

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

function hashText(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 12);
}

/**
 * Creates a goal file whose recorded IDs resolve to the fixture criteria.
 * @param {string} directory Temporary parent directory for the fixture.
 * @returns {object} Paths, labels and lint records for a CLI run.
 */
function makeJevFixture(directory) {
  const root = path.join(directory, 'workspace');
  const goalPath = path.join(root, 'specs', 'a', 'goal.md');
  const criteria = [
    'The report records the generated file name.',
    'The summary includes the final row count.',
    'The result is ready to review.',
    'The output lists each validation error.'
  ];
  const goalLines = ['# Fixture Goal', '', '## Completion Criteria', ...criteria.map((text) => '- ' + text)];
  fs.mkdirSync(path.dirname(goalPath), { recursive: true });
  fs.writeFileSync(goalPath, goalLines.join('\n') + '\n');

  const records = RECORDS.map((record, index) => ({
    ...record,
    id: 'specs/a/goal.md:' + (index + 4),
    text_sha12: hashText(criteria[index])
  }));
  const labels = LABELS.map((row, index) => ({ ...row, text_sha12: hashText(criteria[index]) }));
  const labelsPath = path.join(directory, 'labels.jsonl');
  const lintPath = path.join(directory, 'lint.json');
  fs.writeFileSync(labelsPath, labels.map((row) => JSON.stringify(row)).join('\n') + '\n');
  fs.writeFileSync(lintPath, JSON.stringify({ records }));

  return {
    root,
    records,
    labels,
    args: ['--labels', labelsPath, '--lint', lintPath, '--root', root]
  };
}

/**
 * Creates an executable Jev stub that records calls and serves scripted answers.
 * @param {string} directory Temporary parent directory for the stub.
 * @param {object} options Gate results, model exit status and answer probabilities.
 * @returns {{ binDir: string, logPath: string, env: NodeJS.ProcessEnv }} Stub path and environment.
 */
function makeStubJev(directory, { answers = [], version = 'jev 0.6.2', authStatus = 0, noulExit = 0, noulExits = [] } = {}) {
  const binDir = path.join(directory, 'bin');
  const logPath = path.join(directory, 'jev.log');
  const counterPath = path.join(directory, 'counter.txt');
  const answerCounterPath = path.join(directory, 'answer-counter.txt');
  const answersPath = path.join(directory, 'answers.txt');
  const exitsPath = path.join(directory, 'exits.txt');
  const executable = path.join(binDir, 'jev');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(answersPath, answers.join('\n') + (answers.length > 0 ? '\n' : ''));
  fs.writeFileSync(exitsPath, noulExits.join('\n') + (noulExits.length > 0 ? '\n' : ''));
  fs.writeFileSync(executable, `#!/bin/sh
printf '%s\\n' "$*" >> "$JEV_LOG"
case "$1" in
  --version)
    printf '%s\\n' "$JEV_STUB_VERSION"
    exit 0
    ;;
  auth)
    if [ "$JEV_STUB_AUTH_STATUS" -ne 0 ]; then exit "$JEV_STUB_AUTH_STATUS"; fi
    exit 0
    ;;
  noul)
    if [ -f "$JEV_COUNTER" ]; then
      IFS= read -r count < "$JEV_COUNTER" || count=0
    else
      count=0
    fi
    count=$((count + 1))
    printf '%s\\n' "$count" > "$JEV_COUNTER"
    exitCode="$JEV_STUB_NOUL_EXIT"
    scripted=$(sed -n "\${count}p" "$JEV_EXITS_FILE")
    if [ -n "$scripted" ]; then exitCode="$scripted"; fi
    if [ "$exitCode" -ne 0 ]; then exit "$exitCode"; fi
    if [ -f "$JEV_ANSWER_COUNTER" ]; then
      IFS= read -r ok < "$JEV_ANSWER_COUNTER" || ok=0
    else
      ok=0
    fi
    ok=$((ok + 1))
    printf '%s\\n' "$ok" > "$JEV_ANSWER_COUNTER"
    answer=$(sed -n "\${ok}p" "$JEV_ANSWERS_FILE")
    if [ -z "$answer" ]; then answer=0.9; fi
    printf '{"answers":{"answer":{"noul":%s}}}\\n' "$answer"
    exit 0
    ;;
esac
exit 2
`);
  fs.chmodSync(executable, 0o755);

  return {
    binDir,
    logPath,
    env: {
      ...process.env,
      PATH: [binDir, process.env.PATH || ''].filter(Boolean).join(path.delimiter),
      JEV_LOG: logPath,
      JEV_COUNTER: counterPath,
      JEV_ANSWER_COUNTER: answerCounterPath,
      JEV_ANSWERS_FILE: answersPath,
      JEV_EXITS_FILE: exitsPath,
      JEV_STUB_VERSION: version,
      JEV_STUB_AUTH_STATUS: String(authStatus),
      JEV_STUB_NOUL_EXIT: String(noulExit),
      JEV_PROVIDER: 'fixture'
    }
  };
}

function readStubLog(logPath) {
  return fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').trimEnd() : '';
}

function defaultOutput(fixture) {
  return L(fixture.labels, fixture.records).join('\n') + '\n';
}

function runFixture(fixture, args, env) {
  return spawnSync(process.execPath, [SCORER, ...fixture.args, ...args], {
    encoding: 'utf8',
    env
  });
}

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

test('the command line scores fixture labels from a saved lint run', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-'));

  try {
    fs.writeFileSync(path.join(dir, 'lint.json'), JSON.stringify({ records: RECORDS }));
    fs.writeFileSync(
      path.join(dir, 'labels.jsonl'),
      LABELS.map((row) => JSON.stringify(row)).join('\n') + '\n'
    );

    const scored = spawnSync(
      process.execPath,
      [SCORER, '--labels', path.join(dir, 'labels.jsonl'), '--lint', path.join(dir, 'lint.json')],
      { encoding: 'utf8' }
    );

    assert.equal(scored.status, 0);
    assert.ok(scored.stdout.split(/\r?\n/u).includes('labeled_violation_rate=3/4=0.7500 wilson95=[0.3006,0.9544]'));

    fs.writeFileSync(
      path.join(dir, 'unlabeled.jsonl'),
      ['a1', 'a2'].map((hash) => JSON.stringify({
        id: 'x',
        text_sha12: hash,
        rubric: null,
        rule4_ok: null,
        rule5_ok: null,
        labeler: null
      })).join('\n') + '\n'
    );

    const blank = spawnSync(
      process.execPath,
      [SCORER, '--labels', path.join(dir, 'unlabeled.jsonl'), '--lint', path.join(dir, 'lint.json')],
      { encoding: 'utf8' }
    );
    const lines = blank.stdout.split(/\r?\n/u);

    assert.equal(blank.status, 0);
    assert.ok(lines.includes('unlabeled=2'));
    assert.ok(lines.includes('no labeled rows'));
    assert.ok(!lines.some((line) => line.startsWith('labeled_violation_rate')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the command line refuses a missing labels flag and names a bad labels line', () => {
  const refused = spawnSync(process.execPath, [SCORER], { encoding: 'utf8' });

  assert.equal(refused.status, 2);
  assert.ok(refused.stderr.includes('[score-goal-lint] ERROR --labels is required'));

  const parsed = parseLabels('{"a":1}\n\nnot json\n[1]\n');
  assert.deepEqual(parsed.rows, [{ a: 1 }]);
  assert.deepEqual(parsed.errors.map((e) => e.line), [3, 4]);
});

test('the default command keeps its output and does not invoke model stubs', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-default-'));

  try {
    const fixture = makeJevFixture(dir);
    const stub = makeStubJev(dir);
    const result = runFixture(fixture, [], stub.env);

    assert.equal(result.status, 0);
    assert.equal(result.stdout, defaultOutput(fixture));
    assert.equal(readStubLog(stub.logPath), '');

    const outWithoutArm = runFixture(fixture, ['--out', path.join(dir, 'unused-out')], stub.env);
    assert.equal(outWithoutArm.status, 2);
    assert.equal(outWithoutArm.stderr, '[score-goal-lint] ERROR unknown option: --out\n');
    assert.equal(readStubLog(stub.logPath), '');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('--jev without --out exits before invoking the Jev stub', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-no-out-'));

  try {
    const fixture = makeJevFixture(dir);
    const stub = makeStubJev(dir);
    const result = runFixture(fixture, ['--jev'], stub.env);

    assert.equal(result.status, 2);
    assert.match(result.stderr, /--jev requires --out/u);
    assert.equal(readStubLog(stub.logPath), '');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the Jev arm skip lines cover a missing binary, wrong version and failed auth gate', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-gates-'));

  try {
    const fixture = makeJevFixture(dir);
    const base = defaultOutput(fixture);
    const noJevBin = path.join(dir, 'empty-bin');
    fs.mkdirSync(noJevBin);
    const noJevOut = path.join(dir, 'no-jev-out');
    const noJev = runFixture(fixture, ['--jev', '--out', noJevOut], {
      ...process.env,
      PATH: noJevBin,
      JEV_PROVIDER: 'fixture'
    });
    assert.equal(noJev.status, 0);
    assert.equal(
      noJev.stdout,
      base + 'jev: path=none provider=fixture\n' + 'jev arm skipped: jev not on PATH\n'
    );
    assert.equal(fs.readFileSync(path.join(noJevOut, 'calls.jsonl'), 'utf8'), '');

    const wrongVersion = makeStubJev(path.join(dir, 'wrong-version'), { version: 'jev 0.6.1' });
    const wrongVersionOut = path.join(dir, 'wrong-version-out');
    const wrong = runFixture(fixture, ['--jev', '--out', wrongVersionOut], wrongVersion.env);
    assert.equal(wrong.status, 0);
    assert.ok(wrong.stdout.startsWith(base));
    assert.ok(wrong.stdout.includes('jev arm skipped: version\n'));
    assert.ok(wrong.stdout.includes('jev: found="jev 0.6.1" path=' + wrongVersion.binDir + '/jev\n'));
    assert.equal(readStubLog(wrongVersion.logPath), '--version');

    const authFailure = makeStubJev(path.join(dir, 'auth-failure'), { authStatus: 3 });
    const authOut = path.join(dir, 'auth-out');
    const authEnv = { ...authFailure.env };
    delete authEnv.JEV_PROVIDER;
    const noCredential = runFixture(fixture, ['--jev', '--out', authOut], authEnv);
    assert.equal(noCredential.status, 0);
    assert.ok(noCredential.stdout.startsWith(base));
    assert.ok(noCredential.stdout.includes('jev: path=' + authFailure.binDir + '/jev provider=official\n'));
    assert.ok(noCredential.stdout.endsWith('jev arm skipped: no credential\n'));
    assert.equal(readStubLog(authFailure.logPath), '--version\nauth status --provider official');
    assert.equal(fs.readFileSync(path.join(authOut, 'calls.jsonl'), 'utf8').trim().split('\n').length, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the Jev arm reports columns, flips and a keep verdict when its answers match labels', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-jev-'));

  try {
    const fixture = makeJevFixture(dir);
    const answers = [];
    for (const row of fixture.labels) {
      for (const label of ['rule4_ok', 'rule5_ok']) {
        const probability = row[label] === false ? '0.1' : '0.9';
        answers.push(probability, probability, probability);
      }
    }
    const stub = makeStubJev(dir, { answers });
    const out = path.join(dir, 'jev-out');
    const result = runFixture(fixture, ['--jev', '--out', out], stub.env);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes(
      'jev: payload: committed goal criterion lines; planned calls: 24; estimated input tokens: '
    ));
    assert.match(
      result.stdout,
      /column jev rule4: tp=\d+ fp=\d+ fn=\d+ tn=\d+ precision=1\.0000 recall=1\.0000 f1=1\.0000/u
    );
    assert.match(
      result.stdout,
      /column jev rule5: tp=\d+ fp=\d+ fn=\d+ tn=\d+ precision=1\.0000 recall=1\.0000 f1=1\.0000/u
    );
    assert.ok(result.stdout.includes('flips: F=0 of 8'));
    assert.ok(result.stdout.includes('verdict jev rule5: keep ('));
    assert.ok(result.stdout.includes('jev_version=0.6.2 provider=fixture'));

    const callLines = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n');
    const calls = callLines.map((line) => JSON.parse(line));
    assert.equal(calls.length, 26);
    const noulCalls = calls.filter((call) => call.phase === 'noul');
    assert.equal(noulCalls.length, 24);
    assert.ok(noulCalls.every((call) => call.args.includes('--provider') && call.args.includes('fixture')));
    assert.equal(readStubLog(stub.logPath).split('\n').length, 26);

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.equal(report.columns.lint.rule4.f1, 0.5);
    assert.ok(Math.abs(report.columns.jev.rows[0].rule4.meanProbability - 0.1) <= Number.EPSILON);
    assert.equal(report.columns.jev.rows[0].rule4.predictedViolation, true);
    assert.equal(report.columns.jev.rule5.f1, 1);
    assert.equal(report.columns.jev.verdicts.rule5.verdict, 'keep');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a stored Jev column from another identity prints a requalify notice before the verdict', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-requalify-'));

  try {
    const fixture = makeJevFixture(dir);
    const answers = [];
    for (const row of fixture.labels) {
      for (const label of ['rule4_ok', 'rule5_ok']) {
        const probability = row[label] === false ? '0.1' : '0.9';
        answers.push(probability, probability, probability);
      }
    }
    const stub = makeStubJev(dir, { answers });
    const out = path.join(dir, 'jev-out');
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(
      path.join(out, 'report.json'),
      JSON.stringify({ columns: { jev: { provider: 'earlier-run', jevVersion: '0.6.2' } } })
    );
    const result = runFixture(fixture, ['--jev', '--out', out], stub.env);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    const lines = result.stdout.split(/\r?\n/u);
    const requalified = lines.indexOf('requalify: jev identity changed');
    const verdict = lines.findIndex((line) => line.startsWith('verdict jev '));
    assert.ok(requalified !== -1);
    assert.ok(verdict !== -1);
    assert.ok(requalified < verdict);

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.equal(report.columns.jev.requalified, 'jev identity changed');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('more than ten percent aggregate flips kills both Jev rule verdicts', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-flips-'));

  try {
    const fixture = makeJevFixture(dir);
    const answers = [];
    for (const row of fixture.labels) {
      for (const label of ['rule4_ok', 'rule5_ok']) {
        const probability = row[label] === false ? '0.1' : '0.9';
        answers.push(probability, probability, probability);
      }
    }
    answers[1] = '0.9';
    const stub = makeStubJev(dir, { answers });
    const result = runFixture(fixture, ['--jev', '--out', path.join(dir, 'jev-out')], stub.env);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.includes('flips: F=1 of 8'));
    assert.ok(result.stdout.includes('verdict jev rule4: kill (aggregate flip rate above 0.10'));
    assert.ok(result.stdout.includes('verdict jev rule5: kill (aggregate flip rate above 0.10'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('exit 3 after the gate stops the Jev arm with the key-rejected line', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-rejected-'));

  try {
    const fixture = makeJevFixture(dir);
    const stub = makeStubJev(dir, { noulExit: 3 });
    const out = path.join(dir, 'jev-out');
    const result = runFixture(fixture, ['--jev', '--out', out], stub.env);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.endsWith('jev arm stopped: key rejected\n'));
    assert.ok(!result.stdout.includes('verdict jev rule'));
    assert.equal(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').length, 3);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a Jev arm that measures no row stops both rules on coverage', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-jev-coverage-'));

  try {
    const fixture = makeJevFixture(dir);
    const stub = makeStubJev(dir, { noulExit: 1 });
    const out = path.join(dir, 'jev-out');
    const result = runFixture(fixture, ['--jev', '--out', out], stub.env);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.ok(result.stdout.includes('flips: F=0 of 8'));
    assert.ok(result.stdout.includes(
      'verdict jev rule4: stop (coverage) M=0 K=4 ' +
      '(tp=0 fp=0 fn=0 tn=0; flips=0/8; jev_version=0.6.2 provider=fixture)'
    ));
    assert.ok(result.stdout.includes(
      'verdict jev rule5: stop (coverage) M=0 K=4 ' +
      '(tp=0 fp=0 fn=0 tn=0; flips=0/8; jev_version=0.6.2 provider=fixture)'
    ));
    assert.ok(!/verdict jev rule[45]: (keep|kill)/u.test(result.stdout));

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.equal(report.columns.jev.status, 'partial');
    assert.equal(report.columns.jev.unmeasuredCalls, 8);
    assert.equal(report.columns.jev.verdicts.rule4.verdict, 'stop (coverage)');
    assert.equal(report.columns.jev.verdicts.rule5.verdict, 'stop (coverage)');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a Jev arm over rows that all miss the join stops both rules on coverage', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-jev-no-join-'));

  try {
    const fixture = makeJevFixture(dir);
    const placeholderHash = hashText('A criterion the lint never scored.');
    const lintPath = path.join(dir, 'lint-mixed.json');
    fs.writeFileSync(lintPath, JSON.stringify({
      records: [...fixture.records, rec(placeholderHash, 'placeholder', [], [])]
    }));
    const labelsPath = path.join(dir, 'labels-mixed.jsonl');
    fs.writeFileSync(
      labelsPath,
      [lab('ffffffffffff', false, false), lab(placeholderHash, true, true)]
        .map((row) => JSON.stringify(row)).join('\n') + '\n'
    );

    const stub = makeStubJev(dir);
    const out = path.join(dir, 'jev-out');
    const result = spawnSync(
      process.execPath,
      [SCORER, '--labels', labelsPath, '--lint', lintPath, '--root', fixture.root, '--jev', '--out', out],
      { encoding: 'utf8', env: stub.env }
    );

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.ok(result.stdout.includes('stale=1'));
    assert.ok(result.stdout.includes('not_scored=1'));
    assert.ok(result.stdout.includes('verdict jev rule4: stop (coverage) M=0 K=0 '));
    assert.ok(result.stdout.includes('verdict jev rule5: stop (coverage) M=0 K=0 '));
    assert.ok(!/verdict jev rule[45]: (keep|kill)/u.test(result.stdout));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a Jev exit 4 gets one backoff retry, then leaves the question unmeasured', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-jev-retry-'));

  try {
    const fixture = makeJevFixture(dir);
    const answers = [];
    for (const row of fixture.labels) {
      for (const label of ['rule4_ok', 'rule5_ok']) {
        const probability = row[label] === false ? '0.1' : '0.9';
        answers.push(probability, probability, probability);
      }
    }

    const once = makeStubJev(path.join(dir, 'once'), { answers, noulExits: [4] });
    const onceOut = path.join(dir, 'once-out');
    const first = runFixture(fixture, ['--jev', '--out', onceOut], once.env);

    assert.equal(first.status, 0, first.stderr + first.stdout);
    const onceCalls = fs.readFileSync(path.join(onceOut, 'calls.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    const onceNoul = onceCalls.filter((call) => call.phase === 'noul');
    assert.equal(onceNoul.length, 25);
    assert.equal(onceNoul[0].exitCode, 4);
    assert.equal(onceNoul[0].attempt, 1);
    assert.equal(onceNoul[1].exitCode, 0);
    assert.equal(onceNoul[1].attempt, 2);
    const onceReport = JSON.parse(fs.readFileSync(path.join(onceOut, 'report.json'), 'utf8'));
    assert.ok(Math.abs(onceReport.columns.jev.rows[0].rule4.meanProbability - 0.1) <= Number.EPSILON);
    assert.equal(onceReport.columns.jev.rows[0].rule4.status, undefined);
    assert.equal(onceReport.columns.jev.status, 'completed');

    // The unmeasured question's three answers are never served, so the twice
    // stub's answer list drops them to keep every later call aligned.
    const twice = makeStubJev(path.join(dir, 'twice'), { answers: answers.slice(3), noulExits: [4, 4] });
    const twiceOut = path.join(dir, 'twice-out');
    const second = runFixture(fixture, ['--jev', '--out', twiceOut], twice.env);

    assert.equal(second.status, 0, second.stderr + second.stdout);
    const twiceReport = JSON.parse(fs.readFileSync(path.join(twiceOut, 'report.json'), 'utf8'));
    assert.equal(twiceReport.columns.jev.rows[0].rule4.status, 'unmeasured');
    assert.equal(twiceReport.columns.jev.unmeasuredCalls, 1);
    assert.ok(second.stdout.includes('verdict jev rule4: stop (coverage) M=3 K=4'));
    assert.ok(second.stdout.includes('verdict jev rule5: keep ('));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('Jev exit 130 stops the arm with the interrupted line', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-jev-interrupted-'));

  try {
    const fixture = makeJevFixture(dir);
    const stub = makeStubJev(dir, { noulExit: 130 });
    const out = path.join(dir, 'jev-out');
    const result = runFixture(fixture, ['--jev', '--out', out], stub.env);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.ok(result.stdout.endsWith('jev arm stopped: interrupted\n'));
    assert.ok(!result.stdout.includes('verdict jev rule'));

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.equal(report.columns.jev.status, 'stopped');
    assert.equal(report.columns.jev.reason, 'interrupted');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('an unknown option is rejected', () => {
  const unknownFlag = '--bogus';
  const refused = spawnSync(process.execPath, [SCORER, '--labels', 'labels.jsonl', unknownFlag], { encoding: 'utf8' });

  assert.equal(refused.status, 2);
  assert.equal(refused.stderr, '[score-goal-lint] ERROR unknown option: ' + unknownFlag + '\n');
});
