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
function makeStubJev(directory, { answers = [], version = 'jev 0.6.2', authStatus = 0, noulExit = 0 } = {}) {
  const binDir = path.join(directory, 'bin');
  const logPath = path.join(directory, 'jev.log');
  const counterPath = path.join(directory, 'counter.txt');
  const answersPath = path.join(directory, 'answers.txt');
  const executable = path.join(binDir, 'jev');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(answersPath, answers.join('\n') + (answers.length > 0 ? '\n' : ''));
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
    if [ "$JEV_STUB_NOUL_EXIT" -ne 0 ]; then exit "$JEV_STUB_NOUL_EXIT"; fi
    if [ -f "$JEV_COUNTER" ]; then
      IFS= read -r count < "$JEV_COUNTER" || count=0
    else
      count=0
    fi
    count=$((count + 1))
    printf '%s\\n' "$count" > "$JEV_COUNTER"
    answer=
    index=0
    while IFS= read -r candidate; do
      index=$((index + 1))
      if [ "$index" -eq "$count" ]; then answer="$candidate"; break; fi
    done < "$JEV_ANSWERS_FILE"
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
      JEV_ANSWERS_FILE: answersPath,
      JEV_STUB_VERSION: version,
      JEV_STUB_AUTH_STATUS: String(authStatus),
      JEV_STUB_NOUL_EXIT: String(noulExit),
      JEV_PROVIDER: 'fixture'
    }
  };
}

function makeStubDeem(directory, {
  answers = [],
  healthStatus = 0,
  healthOutput = JSON.stringify({
    ok: true,
    backend: 'torch',
    model: 'deem-0.8-v1',
    model_commit: 'model-commit-fixture',
    source_commit: 'source-commit-fixture'
  }),
  healthStderr = '',
  firstNoulExit = 0,
  noulExit = 0
} = {}) {
  const binDir = path.join(directory, 'deem-bin');
  const logPath = path.join(directory, 'deem.log');
  const counterPath = path.join(directory, 'deem-counter.txt');
  const healthPath = path.join(directory, 'health.json');
  const healthStderrPath = path.join(directory, 'health-stderr.txt');
  const answersPath = path.join(directory, 'deem-answers.txt');
  const executable = path.join(binDir, 'cli-deem');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(healthPath, healthOutput);
  fs.writeFileSync(healthStderrPath, healthStderr);
  fs.writeFileSync(answersPath, answers.join('\n') + (answers.length > 0 ? '\n' : ''));
  fs.writeFileSync(executable, `#!/bin/sh
printf '%s\\n' "$*" >> "$DEEM_LOG"
case "$1" in
  health)
    cat "$DEEM_HEALTH_FILE"
    if [ -s "$DEEM_HEALTH_STDERR_FILE" ]; then cat "$DEEM_HEALTH_STDERR_FILE" >&2; fi
    exit "$DEEM_HEALTH_STATUS"
    ;;
  noul)
    if [ "$DEEM_STUB_NOUL_EXIT" -ne 0 ]; then exit "$DEEM_STUB_NOUL_EXIT"; fi
    if [ -f "$DEEM_COUNTER" ]; then
      IFS= read -r count < "$DEEM_COUNTER" || count=0
    else
      count=0
    fi
    count=$((count + 1))
    printf '%s\\n' "$count" > "$DEEM_COUNTER"
    if [ "$count" -eq 1 ] && [ "$DEEM_STUB_FIRST_NOUL_EXIT" -ne 0 ]; then
      exit "$DEEM_STUB_FIRST_NOUL_EXIT"
    fi
    answerIndex=$count
    if [ "$DEEM_STUB_FIRST_NOUL_EXIT" -ne 0 ] && [ "$count" -gt 1 ]; then
      answerIndex=$((count - 1))
    fi
    answer=$(sed -n "\${answerIndex}p" "$DEEM_ANSWERS_FILE")
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
      DEEM_LOG: logPath,
      DEEM_COUNTER: counterPath,
      DEEM_HEALTH_FILE: healthPath,
      DEEM_HEALTH_STDERR_FILE: healthStderrPath,
      DEEM_ANSWERS_FILE: answersPath,
      DEEM_HEALTH_STATUS: String(healthStatus),
      DEEM_STUB_FIRST_NOUL_EXIT: String(firstNoulExit),
      DEEM_STUB_NOUL_EXIT: String(noulExit)
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
    const deemStub = makeStubDeem(dir);
    const env = {
      ...stub.env,
      ...deemStub.env,
      PATH: [deemStub.binDir, stub.binDir, process.env.PATH || ''].filter(Boolean).join(path.delimiter),
      JEV_LOG: stub.logPath,
      DEEM_LOG: deemStub.logPath
    };
    const result = runFixture(fixture, [], env);

    assert.equal(result.status, 0);
    assert.equal(result.stdout, defaultOutput(fixture));
    assert.equal(readStubLog(stub.logPath), '');
    assert.equal(readStubLog(deemStub.logPath), '');

    const outWithoutArm = runFixture(fixture, ['--out', path.join(dir, 'unused-out')], env);
    assert.equal(outWithoutArm.status, 2);
    assert.equal(outWithoutArm.stderr, '[score-goal-lint] ERROR unknown option: --out\n');
    assert.equal(readStubLog(stub.logPath), '');
    assert.equal(readStubLog(deemStub.logPath), '');
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

test('--deem without --out exits before invoking the Deem stub', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-deem-no-out-'));

  try {
    const fixture = makeJevFixture(dir);
    const stub = makeStubDeem(dir);
    const result = runFixture(fixture, ['--deem'], stub.env);

    assert.equal(result.status, 2);
    assert.match(result.stderr, /--deem requires --out/u);
    assert.equal(readStubLog(stub.logPath), '');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the Deem health gate prints each skip reason and leaves lexical output unchanged', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-deem-gates-'));
  const cases = [
    {
      name: 'unreachable',
      options: { healthStatus: 4 },
      line: 'deem arm skipped: not reachable'
    },
    {
      name: 'stub-backend',
      options: {
        healthOutput: JSON.stringify({
          ok: true,
          backend: 'stub',
          model: 'deem-0.8-v1',
          model_commit: 'model-commit-fixture',
          source_commit: 'source-commit-fixture'
        })
      },
      line: 'deem arm skipped: stub backend'
    },
    {
      name: 'bad-response',
      options: { healthOutput: 'not json' },
      line: 'deem arm skipped: bad health response'
    },
    {
      name: 'wrong-model',
      options: { healthStatus: 3, healthStderr: '{"ok":false,"error":"refused model: deem-0.9-v1"}' },
      line: 'deem arm skipped: model',
      found: 'deem-0.9-v1'
    }
  ];

  try {
    for (const scenario of cases) {
      const scenarioDir = path.join(dir, scenario.name);
      fs.mkdirSync(scenarioDir);
      const fixture = makeJevFixture(scenarioDir);
      const stub = makeStubDeem(scenarioDir, scenario.options);
      const out = path.join(scenarioDir, 'deem-out');
      const result = runFixture(fixture, ['--deem', '--out', out], stub.env);

      assert.equal(result.status, 0, scenario.name + ': ' + result.stderr + result.stdout);
      assert.ok(result.stdout.startsWith(defaultOutput(fixture)), scenario.name);
      assert.ok(result.stdout.includes(scenario.line + '\n'), scenario.name);
      if (scenario.found) assert.ok(result.stdout.includes(scenario.found), scenario.name);
      assert.equal(readStubLog(stub.logPath), 'health', scenario.name);
      assert.equal(fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8'), '', scenario.name);

      const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
      assert.equal(report.columns.deem.status, 'skipped', scenario.name);
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the Deem arm reports one pass, both columns, commit provenance and a keep verdict', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-deem-'));

  try {
    const fixture = makeJevFixture(dir);
    const answers = fixture.labels.flatMap((row) => ['rule4_ok', 'rule5_ok'].map(
      (label) => row[label] === false ? '0.1' : '0.9'
    ));
    const stub = makeStubDeem(dir, { answers });
    const out = path.join(dir, 'deem-out');
    const result = runFixture(fixture, ['--deem', '--out', out], stub.env);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.ok(result.stdout.includes(
      'deem: health backend=torch model=deem-0.8-v1 model_commit=model-commit-fixture source_commit=source-commit-fixture\n'
    ));
    assert.ok(result.stdout.includes(
      'deem: nothing leaves the machine; planned calls: 8; estimated wall time: 0.5 s at 60.5 ms per call\n'
    ));
    assert.match(result.stdout, /column deem rule4: tp=\d+ fp=\d+ fn=\d+ tn=\d+ precision=1\.0000 recall=1\.0000 f1=1\.0000/u);
    assert.match(result.stdout, /column deem rule5: tp=\d+ fp=\d+ fn=\d+ tn=\d+ precision=1\.0000 recall=1\.0000 f1=1\.0000/u);
    assert.ok(result.stdout.includes('verdict deem rule5: keep ('));
    assert.ok(result.stdout.includes('model_commit=model-commit-fixture source_commit=source-commit-fixture'));
    assert.ok(!result.stdout.includes('flips:'));

    const calls = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(calls.length, 8);
    assert.ok(calls.every((call) => call.backend === 'deem' && call.phase === 'noul'));
    assert.ok(calls.every((call) => call.modelId === 'deem-0.8-v1'));
    assert.ok(calls.every((call) => call.modelCommit === 'model-commit-fixture'));
    assert.ok(calls.every((call) => call.sourceCommit === 'source-commit-fixture'));
    assert.equal(readStubLog(stub.logPath).split('\n').length, 9);

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.equal(report.columns.deem.backend, 'torch');
    assert.equal(report.columns.deem.modelId, 'deem-0.8-v1');
    assert.equal(report.columns.deem.rule5.f1, 1);
    assert.equal(report.columns.deem.verdicts.rule5.verdict, 'keep');
    assert.equal(report.columns.deem.rows[0].rule4.probability, 0.1);
    assert.equal(report.columns.deem.modelCalls, 8);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('Deem exit 4 rechecks the commit pair and retries that question once', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-deem-retry-'));

  try {
    const fixture = makeJevFixture(dir);
    const answers = fixture.labels.flatMap((row) => ['rule4_ok', 'rule5_ok'].map(
      (label) => row[label] === false ? '0.1' : '0.9'
    ));
    const stub = makeStubDeem(dir, { answers, firstNoulExit: 4 });
    const out = path.join(dir, 'deem-out');
    const result = runFixture(fixture, ['--deem', '--out', out], stub.env);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    const logLines = readStubLog(stub.logPath).split('\n');
    assert.equal(logLines.filter((line) => line === 'health').length, 2);
    assert.equal(logLines.filter((line) => line.startsWith('noul ')).length, 9);

    const calls = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.equal(calls.length, 9);
    assert.equal(calls[0].exitCode, 4);
    assert.equal(calls[0].status, 'unmeasured');
    assert.equal(calls[1].attempt, 2);
    assert.equal(calls[1].probability, 0.1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a Deem arm that measures no row stops both rules on coverage', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-deem-coverage-'));

  try {
    const fixture = makeJevFixture(dir);
    const stub = makeStubDeem(dir, { noulExit: 1 });
    const out = path.join(dir, 'deem-out');
    const result = runFixture(fixture, ['--deem', '--out', out], stub.env);

    assert.equal(result.status, 0, result.stderr + result.stdout);
    assert.ok(result.stdout.includes('deem: health backend=torch model=deem-0.8-v1'));
    assert.ok(result.stdout.includes(
      'verdict deem rule4: stop (coverage) M=0 K=4 ' +
      '(tp=0 fp=0 fn=0 tn=0; model=deem-0.8-v1 backend=torch ' +
      'model_commit=model-commit-fixture source_commit=source-commit-fixture)'
    ));
    assert.ok(result.stdout.includes(
      'verdict deem rule5: stop (coverage) M=0 K=4 ' +
      '(tp=0 fp=0 fn=0 tn=0; model=deem-0.8-v1 backend=torch ' +
      'model_commit=model-commit-fixture source_commit=source-commit-fixture)'
    ));
    assert.ok(!/verdict deem rule[45]: (keep|kill)/u.test(result.stdout));

    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.equal(report.columns.deem.status, 'partial');
    assert.equal(report.columns.deem.unmeasuredCalls, 8);
    assert.equal(report.columns.deem.verdicts.rule4.verdict, 'stop (coverage)');
    assert.equal(report.columns.deem.verdicts.rule5.verdict, 'stop (coverage)');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('Jev runs before Deem and both model columns share the output report', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-both-models-'));

  try {
    const fixture = makeJevFixture(dir);
    const jevAnswers = fixture.labels.flatMap((row) => ['rule4_ok', 'rule5_ok'].flatMap(
      (label) => {
        const probability = row[label] === false ? '0.1' : '0.9';
        return [probability, probability, probability];
      }
    ));
    const jevStub = makeStubJev(dir, { answers: jevAnswers });
    const deemAnswers = fixture.labels.flatMap((row) => ['rule4_ok', 'rule5_ok'].map(
      (label) => row[label] === false ? '0.1' : '0.9'
    ));
    const deemStub = makeStubDeem(dir, { answers: deemAnswers });
    const sharedLog = path.join(dir, 'both.log');
    const env = {
      ...jevStub.env,
      ...deemStub.env,
      PATH: [deemStub.binDir, jevStub.binDir, process.env.PATH || ''].filter(Boolean).join(path.delimiter),
      JEV_LOG: sharedLog,
      DEEM_LOG: sharedLog,
      JEV_PROVIDER: 'fixture'
    };
    const out = path.join(dir, 'both-out');
    const result = runFixture(fixture, ['--jev', '--deem', '--out', out], env);

    assert.equal(result.status, 0);
    assert.ok(result.stdout.indexOf('verdict jev rule5:') < result.stdout.indexOf('deem: health backend='));
    const logLines = readStubLog(sharedLog).split('\n');
    assert.equal(logLines[0], '--version');
    assert.equal(logLines[1], 'auth status --provider fixture');
    assert.ok(logLines.slice(2, 26).every((line) => line.startsWith('noul ')));
    assert.equal(logLines[26], 'health');
    assert.ok(logLines.slice(27).every((line) => line.startsWith('noul ')));

    const calls = fs.readFileSync(path.join(out, 'calls.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    assert.ok(calls.slice(0, 26).every((call) => call.backend === 'jev'));
    assert.ok(calls.slice(26).every((call) => call.backend === 'deem'));
    const report = JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8'));
    assert.equal(report.columns.jev.status, 'completed');
    assert.equal(report.columns.deem.status, 'completed');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
