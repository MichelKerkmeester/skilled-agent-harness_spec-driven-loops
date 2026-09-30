// ───────────────────────────────────────────────────────────────────
// MODULE: Reply Judge Agreement Tests
// ───────────────────────────────────────────────────────────────────
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { baselineLevels, binomialTail, buildCensus, createCallLog, decideVerdict, joinLabels, levelOfScore, LEVELS, listMarkdown, loadRubric, main, modalLevel, parseLabels, parseScoreAnswer, payloadClass, POWER_LINE, readMaskedReply, readStoredReport, runBaseline, sha256Hex, spawnCall, summarizeColumn, summaryLines, verdictLine } from './judge-agreement.mjs';

const CASE_IDS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'NC1'];

const makeFixture = ({ editOneAfterMasking = false } = {}) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
  const repliesDirs = ['r1', 'r2', 'r3'].map((name) => path.join(root, name));
  for (const dir of repliesDirs) {
    const dirName = path.basename(dir);
    fs.mkdirSync(dir);
    for (const caseId of CASE_IDS) {
      fs.writeFileSync(
        path.join(dir, `${caseId}.md`),
        `Reply ${dirName} ${caseId}: the answer sits in \`src/${caseId}.ts\` and the run printed exit 0.\n`,
      );
    }
  }

  const maskedDirs = ['m1', 'm2'].map((name) => path.join(root, name));
  const sources = [
    [repliesDirs[0], repliesDirs[1]],
    [repliesDirs[1], repliesDirs[2]],
  ];
  for (let i = 0; i < maskedDirs.length; i++) {
    fs.mkdirSync(maskedDirs[i]);
    for (const caseId of CASE_IDS) {
      for (const [label, source] of [['A', sources[i][0]], ['B', sources[i][1]]]) {
        const reply = fs.readFileSync(path.join(source, `${caseId}.md`), 'utf8');
        fs.writeFileSync(
          path.join(maskedDirs[i], `${caseId}-${label}.md`),
          `Case: ${caseId}\n\nPrompt for ${caseId}\n\nReply ${label}:\n\n${reply.trim()}\n`,
        );
      }
    }
  }

  if (editOneAfterMasking) fs.writeFileSync(path.join(repliesDirs[2], 'C1.md'), 'edited after masking\n');

  return { root, repliesDirs, maskedDirs };
};

// Test double for the cli-deem and jev binaries: it logs one line per call and answers from a table.
function stubMain() {
  const fs = require('node:fs');
  const path = require('node:path');
  const { createHash } = require('node:crypto');
  const name = path.basename(process.argv[1]);
  const args = process.argv.slice(2);
  const env = process.env;
  const scoring = args[0] === 'score';
  const stdin = scoring ? fs.readFileSync(0, 'utf8') : '';
  const key = scoring ? `${createHash('sha256').update(stdin).digest('hex')}|${args[args.indexOf('-q') + 1]}` : '';
  const prior = env.STUB_LOG && fs.existsSync(env.STUB_LOG) ? fs.readFileSync(env.STUB_LOG, 'utf8').split('\n') : [];
  const rerun = prior.filter((line) => scoring && line.split('\t')[0] === name && line.split('\t')[2] === key).length;
  if (env.STUB_LOG) fs.appendFileSync(env.STUB_LOG, `${name}\t${args.join(' ')}\t${key}\n`);
  if (name === 'cli-deem' && args[0] === 'health') {
    if (env.STUB_HEALTH === 'stub') {
      process.stderr.write('{"ok":false,"error":"refused backend: ensemble:stub"}\n');
      process.exit(3);
    }
    process.stdout.write('{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"stubmodel","source_commit":"stubsource"}\n');
  } else if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (scoring) {
    if (env.STUB_SCORE_EXIT) process.exit(Number(env.STUB_SCORE_EXIT));
    const table = env.STUB_ANSWERS ? JSON.parse(fs.readFileSync(env.STUB_ANSWERS, 'utf8')) : {};
    const entry = table[key];
    const position = Array.isArray(entry) ? entry[rerun % entry.length] : (entry ?? 0);
    process.stdout.write(`${JSON.stringify({ model: 'deem-0.8-v1', answers: { answer: { score: position } } })}\n`);
  } else {
    process.exit(2);
  }
}

const STUB_SOURCE = `#!/usr/bin/env node\n(${stubMain.toString()})();\n`;

const makeStubBin = (root) => {
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin);
  for (const name of ['cli-deem', 'jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });
  return bin;
};

const stubEnv = (root, extra = {}) => ({
  ...process.env,
  PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}`,
  STUB_LOG: path.join(root, 'stub.log'),
  JEV_PROVIDER: '',
  ...extra,
});

const readStubLog = (root) => {
  const logPath = path.join(root, 'stub.log');
  if (!fs.existsSync(logPath)) return [];
  return fs.readFileSync(logPath, 'utf8').split('\n').filter((line) => line.length > 0);
};

const run = async (argv, env) => {
  const lines = [];
  const errors = [];
  const code = await main(argv, { out: (line) => lines.push(line), err: (line) => errors.push(line), env });
  return { code, lines, errors };
};

test('readMaskedReply returns the body under the marker and null without one', () => {
  assert.equal(readMaskedReply('Case: C1\n\nQ?\n\nReply B:\n\n  body text \n'), 'body text');
  assert.equal(readMaskedReply('no marker'), null);
});

test('buildCensus counts every masked file and matches every distinct reply', () => {
  const { root, repliesDirs, maskedDirs } = makeFixture();
  try {
    const census = buildCensus(maskedDirs, repliesDirs);
    assert.equal(census.masked, 28);
    assert.equal(census.distinct, 21);
    assert.equal(census.matched, 21);
    assert.equal(census.unmatched, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('buildCensus reports the masked reply whose source changed after masking', () => {
  const { root, repliesDirs, maskedDirs } = makeFixture({ editOneAfterMasking: true });
  try {
    const census = buildCensus(maskedDirs, repliesDirs);
    assert.equal(census.distinct, 21);
    assert.equal(census.matched, 20);
    assert.equal(census.unmatched, 1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('listMarkdown refuses a path that is not a directory', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
  try {
    assert.throws(() => listMarkdown(path.join(root, 'missing')), /not a directory/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('levelOfScore reads 0 as absent, 1 as fully met and a value between as partly met', () => {
  assert.equal(levelOfScore(0), 'absent');
  assert.equal(levelOfScore(1), 'fully met');
  assert.equal(levelOfScore(0.4), 'partly met');
  assert.deepEqual(baselineLevels({ a: 0, b: 0.5, c: 1 }, ['a', 'b', 'c']), { a: 'absent', b: 'partly met', c: 'fully met' });
});

test('levelOfScore returns null outside the scale or without a number', () => {
  for (const value of [-0.1, 1.5, NaN, '1', undefined]) assert.equal(levelOfScore(value), null);
});

const listJudgeTmpDirs = () =>
  fs
    .readdirSync(os.tmpdir())
    .filter((name) => name.startsWith('judge-agreement-') && !name.startsWith('judge-agreement-test-'))
    .sort();

test('runBaseline maps every reply file to its dimension scores and leaves no temp dir', () => {
  const { root, repliesDirs } = makeFixture();
  try {
    const before = listJudgeTmpDirs();
    const scores = runBaseline(repliesDirs);
    assert.equal(scores.size, 21);
    const expectedKeys = [
      'answer-position', 'next-action-honesty', 'receipts', 'tone',
      'tangent-suppression', 'completeness-under-cap', 'mechanical-tells',
    ].sort();
    for (const value of scores.values()) assert.deepEqual(Object.keys(value).sort(), expectedKeys);
    assert.deepEqual(listJudgeTmpDirs(), before);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('runBaseline stands in for a missing and an empty reply and still scores the rest', () => {
  const { root, repliesDirs } = makeFixture();
  try {
    fs.rmSync(path.join(repliesDirs[0], 'C1.md'));
    fs.writeFileSync(path.join(repliesDirs[0], 'C2.md'), '');
    const scores = runBaseline([repliesDirs[0]]);
    assert.equal(scores.size, 5);
    assert.ok(!scores.has(path.resolve(repliesDirs[0], 'C1.md')));
    assert.ok(!scores.has(path.resolve(repliesDirs[0], 'C2.md')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('runBaseline throws when score.mjs fails on a replies dir', () => {
  const { root, repliesDirs } = makeFixture();
  try {
    fs.writeFileSync(path.join(repliesDirs[0], 'C3.meta.json'), '{not json');
    assert.throws(() => runBaseline([repliesDirs[0]]), /score\.mjs failed on/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

const ids = loadRubric().map((d) => d.id);

const all = (level) => Object.fromEntries(ids.map((id) => [id, level]));

test('parseLabels numbers a row by its 1-based line and skips the empty ones', () => {
  const rows = parseLabels('\n' + JSON.stringify({ masked: 'x.md', grades: all('absent') }), ids);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].row, 2);
  assert.equal(rows[0].masked, 'x.md');
});

test('parseLabels names the first missing dimension', () => {
  const grades = all('absent');
  delete grades.tone;
  assert.throws(() => parseLabels(JSON.stringify({ masked: 'x.md', grades }), ids), /labels row 1: missing dimension tone/);
});

test('parseLabels rejects a grade outside the three levels', () => {
  assert.throws(
    () => parseLabels(JSON.stringify({ masked: 'x.md', grades: { ...all('absent'), tone: 'mostly' } }), ids),
    /tone must be absent, partly met or fully met/,
  );
});

test('joinLabels keys one entry per reply SHA and reports a grade conflict', () => {
  const { root, repliesDirs, maskedDirs } = makeFixture();
  try {
    const census = buildCensus(maskedDirs, repliesDirs);
    const rows = [
      { row: 1, masked: path.join(maskedDirs[0], 'C1-B.md'), grades: all('absent') },
      { row: 2, masked: path.join(maskedDirs[1], 'C1-A.md'), grades: all('absent') },
    ];
    const joined = joinLabels(rows, census, '/');
    assert.equal(joined.labeled.size, 1);
    assert.equal(joined.unmatchedRows, 0);
    assert.equal(joined.conflict, null);
    const conflicting = joinLabels([rows[0], { ...rows[1], grades: { ...all('absent'), tone: 'fully met' } }], census, '/');
    assert.match(conflicting.conflict, /rows 1 and 2 grade the same reply differently/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('joinLabels skips a graded reply edited after masking and refuses a path outside the census', () => {
  const { root, repliesDirs, maskedDirs } = makeFixture({ editOneAfterMasking: true });
  try {
    const census = buildCensus(maskedDirs, repliesDirs);
    const joined = joinLabels([{ row: 1, masked: path.join(maskedDirs[1], 'C1-B.md'), grades: all('absent') }], census, '/');
    assert.equal(joined.labeled.size, 0);
    assert.equal(joined.unmatchedRows, 1);
    assert.throws(
      () => joinLabels([{ row: 1, masked: path.join(root, 'missing.md'), grades: all('absent') }], census, '/'),
      /masked file is not in the census/,
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

const synthetic = (n, agreeing) => {
  const baseline = new Map();
  const labeled = new Map();
  for (let i = 0; i < n; i++) {
    const sha = `sha${i}`;
    baseline.set(sha, all('fully met'));
    labeled.set(sha, { grades: Object.fromEntries(ids.map((id, index) => [id, index < agreeing ? 'fully met' : 'absent'])) });
  }
  return { ids, baseline, labeled };
};

test('summaryLines stops below the label gate', () => {
  const { ids: dimensionIds, baseline, labeled } = synthetic(19, 3);
  const summary = summaryLines({
    census: { masked: 1, distinct: 1, matched: 1, unmatched: 0 },
    dimensionIds,
    questionsSha: 'q',
    baseline,
    labelsInfo: { rows: 19, sha256: 'h', unmatchedRows: 0 },
    labeled,
  });
  assert.equal(summary.gate, 'stop');
  assert.equal(summary.lines.at(-1), 'stop: fewer than 20 labeled replies');
});

test('summaryLines plans the arm calls and reports agreement above the gate', () => {
  const { ids: dimensionIds, baseline, labeled } = synthetic(20, 3);
  const summary = summaryLines({
    census: { masked: 1, distinct: 1, matched: 1, unmatched: 0 },
    dimensionIds,
    questionsSha: 'q',
    baseline,
    labelsInfo: { rows: 20, sha256: 'h', unmatchedRows: 0 },
    labeled,
  });
  assert.equal(summary.gate, 'planned');
  assert.equal(summary.lines.at(-1), 'planned calls: deem=140 jev=421');
  assert.ok(summary.lines.includes('baseline agreement: 60/140 = 0.4286'));
  assert.ok(summary.lines.includes('baseline agreement tone: 0/20'));
  assert.equal(summary.lines.at(-2), POWER_LINE);
});

test('summaryLines refuses headroom when the baseline already agrees', () => {
  const { ids: dimensionIds, baseline, labeled } = synthetic(20, 7);
  const summary = summaryLines({
    census: { masked: 1, distinct: 1, matched: 1, unmatched: 0 },
    dimensionIds,
    questionsSha: 'q',
    baseline,
    labelsInfo: { rows: 20, sha256: 'h', unmatchedRows: 0 },
    labeled,
  });
  assert.equal(summary.gate, 'no headroom');
  assert.equal(summary.lines.at(-1), 'no headroom');
});

test('the stub jev answers --version and logs the call, and cli-deem health exits 3', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
  try {
    makeStubBin(root);
    const version = spawnSync('jev', ['--version'], { env: stubEnv(root), encoding: 'utf8' });
    assert.equal(version.status, 0);
    assert.equal(version.stdout, 'jev 0.6.2\n');
    const log = readStubLog(root);
    assert.equal(log.length, 1);
    assert.ok(log[0].startsWith('jev\t--version'));
    const health = spawnSync('cli-deem', ['health'], { env: stubEnv(root, { STUB_HEALTH: 'stub' }), encoding: 'utf8' });
    assert.equal(health.status, 3);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('the stub scores the same state 2, then 2, then 0 from the answers table', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
  try {
    makeStubBin(root);
    const answersPath = path.join(root, 'answers.json');
    fs.writeFileSync(answersPath, JSON.stringify({ [`${sha256Hex('state')}|Q`]: [2, 2, 0] }));
    const env = stubEnv(root, { STUB_ANSWERS: answersPath });
    const scores = [];
    for (let i = 0; i < 3; i++) {
      const run = spawnSync('jev', ['score', '--provider', 'official', '-q', 'Q', '-l', 'a', '-l', 'b', '-l', 'c'], { env, input: 'state', encoding: 'utf8' });
      scores.push(JSON.parse(run.stdout).answers.answer.score);
    }
    assert.deepEqual(scores, [2, 2, 0]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('main prints the census report and the label gate stop on the default run', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const entriesBefore = fs.readdirSync(fixture.root).sort();
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
      ],
      stubEnv(fixture.root),
    );
    assert.equal(code, 0);
    assert.deepEqual(lines.slice(0, 4), ['masked: 28', 'distinct: 21', 'matched: 21', 'unmatched: 0']);
    assert.ok(lines.includes('labels: none'));
    assert.ok(lines.includes('labeled: 0'));
    assert.equal(lines.at(-1), 'stop: fewer than 20 labeled replies');
    assert.deepEqual(readStubLog(fixture.root), []);
    assert.deepEqual(fs.readdirSync(fixture.root).sort(), entriesBefore);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main keeps an empty reply out of the baseline and still reports the census', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    fs.writeFileSync(path.join(fixture.repliesDirs[0], 'C1.md'), '\n');
    fs.writeFileSync(path.join(fixture.maskedDirs[0], 'C1-A.md'), 'Case: C1\n\nPrompt for C1\n\nReply A:\n\n\n');
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
      ],
      stubEnv(fixture.root),
    );
    assert.equal(code, 0);
    assert.ok(lines.includes('matched: 21'));
    assert.ok(lines.includes('no baseline: 1'));
    assert.equal(lines.at(-1), 'stop: fewer than 20 labeled replies');
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main refuses --deem without --out before reading any file', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const { code, lines, errors } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--deem',
      ],
      stubEnv(fixture.root),
    );
    assert.equal(code, 2);
    assert.deepEqual(lines, []);
    assert.ok(errors.includes('--deem and --jev need --out <dir> so every call is recorded'));
    assert.deepEqual(readStubLog(fixture.root), []);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main prints the deem health line and skips the arm at the label gate', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const argv = [
      '--masked', fixture.maskedDirs[0],
      '--masked', fixture.maskedDirs[1],
      '--replies', fixture.repliesDirs[0],
      '--replies', fixture.repliesDirs[1],
      '--replies', fixture.repliesDirs[2],
    ];
    const base = await run(argv, stubEnv(fixture.root));
    const { code, lines } = await run([...argv, '--deem', '--out', path.join(fixture.root, 'out')], stubEnv(fixture.root));
    assert.equal(code, 0);
    assert.deepEqual(lines, [
      ...base.lines,
      'deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource',
      'deem arm skipped: label gate',
    ]);
    const log = readStubLog(fixture.root);
    assert.equal(log.length, 1);
    assert.ok(log[0].startsWith('cli-deem\thealth'));
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main skips the deem arm when the health check reports a stub backend', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const argv = [
      '--masked', fixture.maskedDirs[0],
      '--masked', fixture.maskedDirs[1],
      '--replies', fixture.repliesDirs[0],
      '--replies', fixture.repliesDirs[1],
      '--replies', fixture.repliesDirs[2],
    ];
    const env = stubEnv(fixture.root, { STUB_HEALTH: 'stub' });
    const base = await run(argv, env);
    const { code, lines } = await run([...argv, '--deem', '--out', path.join(fixture.root, 'out')], env);
    assert.equal(code, 0);
    assert.deepEqual(lines, [...base.lines, 'deem arm skipped: stub backend']);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main reports a labels row that drops a dimension', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const grades = all('absent');
    delete grades.tone;
    const labelsPath = path.join(fixture.root, 'labels.jsonl');
    fs.writeFileSync(labelsPath, `${JSON.stringify({ masked: path.join(fixture.maskedDirs[0], 'C1-A.md'), grades })}\n`);
    const { code, lines, errors } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
      ],
      stubEnv(fixture.root),
    );
    assert.equal(code, 2);
    assert.deepEqual(lines, []);
    assert.match(errors.join('\n'), /labels row 1: missing dimension tone/);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main stops on a label conflict between two rows grading one reply', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const grades = all('absent');
    const labelsPath = path.join(fixture.root, 'labels.jsonl');
    fs.writeFileSync(
      labelsPath,
      [
        JSON.stringify({ masked: path.join(fixture.maskedDirs[0], 'C1-B.md'), grades }),
        JSON.stringify({ masked: path.join(fixture.maskedDirs[1], 'C1-A.md'), grades: { ...grades, tone: 'fully met' } }),
      ].join('\n') + '\n',
    );
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
      ],
      stubEnv(fixture.root),
    );
    assert.equal(code, 2);
    assert.deepEqual(lines, ['stop: label conflict']);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('the script exits 2 with usage on stderr when --replies is missing', () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const script = fileURLToPath(new URL('./judge-agreement.mjs', import.meta.url));
    const result = spawnSync(process.execPath, [script, '--masked', fixture.maskedDirs[0]], {
      env: stubEnv(fixture.root),
      encoding: 'utf8',
    });
    assert.equal(result.status, 2);
    assert.match(result.stderr, /usage:/);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('binomialTail sums the exact upper tail and flags p below 0.05', () => {
  assert.deepEqual(binomialTail(5, 5), { p: 0.03125, below: true });
  assert.deepEqual(binomialTail(4, 4), { p: 0.0625, below: false });
  assert.deepEqual(binomialTail(0, 0), { p: 1, below: false });
  assert.deepEqual(binomialTail(0, 3), { p: 1, below: false });
});

test('modalLevel names the level over half the reruns and the unstable three-way split', () => {
  assert.deepEqual(modalLevel(['absent', 'absent', 'fully met']), { level: 'absent', top: 2 });
  assert.deepEqual(modalLevel(['absent', 'partly met', 'fully met']), { level: null, top: 1 });
  assert.deepEqual(modalLevel(['partly met']), { level: 'partly met', top: 1 });
});

test('decideVerdict stops at the first failed check in keep-rule order', () => {
  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 17, A: 119, B: 51, W: 17, L: 0, F: 0 }).verdict, 'stop (coverage)');
  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 0, B: 60, W: 0, L: 20, F: 0 }).verdict, 'kill');
  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 60, B: 60, W: 0, L: 0, F: 0 }).verdict, 'stop (margin)');
  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 4, L: 0, F: 0 }).verdict, 'stop (sign test)');
  assert.equal(decideVerdict({ backend: 'jev', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, F: 100 }).verdict, 'stop (flips)');
  assert.equal(decideVerdict({ backend: 'jev', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, F: 42 }).verdict, 'keep');
  assert.equal(decideVerdict({ backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, F: 0 }).verdict, 'keep');
});

test('summarizeColumn counts column and baseline hits and prints the verdict line', () => {
  const labeled = new Map();
  const baseline = new Map();
  const answers = new Map();
  for (let i = 0; i < 20; i++) {
    const sha = `sha${i}`;
    labeled.set(sha, { grades: all('fully met') });
    baseline.set(sha, Object.fromEntries(ids.map((id, index) => [id, index < 3 ? 'fully met' : 'absent'])));
    answers.set(sha, Object.fromEntries(ids.map((id) => [id, ['fully met']])));
  }
  const summary = summarizeColumn({ backend: 'deem', labeled, baseline, answers, dimensionIds: ids, reruns: 1 });
  assert.equal(summary.A, 140);
  assert.equal(summary.B, 60);
  assert.equal(summary.W, 20);
  assert.equal(summary.L, 0);
  assert.equal(summary.verdict, 'keep');
  const line = verdictLine(summary, 'abc', 'model=m');
  assert.ok(line.startsWith('verdict deem: keep K=20 M=20 A=140 B=60 W=20 L=0 F=n/a p_win='));
  assert.ok(line.endsWith(' labels_sha256=abc model=m'));
});

test('parseScoreAnswer rounds a fractional score to the nearest level and rejects anything off the scale', () => {
  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":1.4}}}'), 1);
  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":1.5}}}'), 2);
  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":0}}}'), 0);
  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":2.2}}}'), null);
  assert.equal(parseScoreAnswer('{"answers":{"answer":{"score":-0.1}}}'), null);
  assert.equal(parseScoreAnswer('not json'), null);
  assert.equal(parseScoreAnswer('{}'), null);
});

test('createCallLog keeps no record without an out dir and writes one line per call with one', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'));
  try {
    createCallLog(undefined).append({ a: 1 });
    assert.deepEqual(fs.readdirSync(d), []);
    const log = createCallLog(path.join(d, 'out'));
    log.append({ a: 1 });
    log.append({ a: 1 });
    const lines = fs.readFileSync(path.join(d, 'out', 'calls.jsonl'), 'utf8').split('\n').filter((line) => line.length > 0);
    assert.deepEqual(lines, ['{"a":1}', '{"a":1}']);
    assert.equal(readStoredReport(path.join(d, 'none')), null);
  } finally {
    fs.rmSync(d, { recursive: true, force: true });
  }
});

test('spawnCall pipes stdin to stdout, closes a child that overruns the timeout and reports both', async () => {
  const echoed = await spawnCall(process.execPath, ['-e', 'process.stdin.pipe(process.stdout)'], 'hi', process.env, 5000);
  assert.equal(echoed.code, 0);
  assert.equal(echoed.stdout, 'hi');
  assert.equal(echoed.timedOut, false);
  const stalled = await spawnCall(process.execPath, ['-e', 'setTimeout(() => {}, 5000)'], '', process.env, 200);
  assert.equal(stalled.timedOut, true);
});

// Grades copy the baseline on the first three dimensions and rotate one level on the
// rest, so one stub answer table can drive every agreement shape the arm reports.
const scenario = (fixture, pick) => {
  const dims = loadRubric();
  const dimensionIds = dims.map((dimension) => dimension.id);
  const census = buildCensus(fixture.maskedDirs, fixture.repliesDirs);
  const scores = runBaseline(fixture.repliesDirs);
  const rows = [];
  const answers = {};
  const seen = new Set();
  for (const maskedFile of census.maskedFiles) {
    const reply = census.replyBySha.get(maskedFile.sha);
    if (reply === undefined || seen.has(maskedFile.sha)) continue;
    seen.add(maskedFile.sha);
    const base = baselineLevels(scores.get(reply.file), dimensionIds);
    const grades = {};
    dims.forEach((dimension, index) => {
      grades[dimension.id] = index < 3 ? base[dimension.id] : LEVELS[(LEVELS.indexOf(base[dimension.id]) + 1) % 3];
    });
    rows.push(JSON.stringify({ masked: maskedFile.file, grades }));
    for (const dimension of dims) {
      answers[`${sha256Hex(maskedFile.text)}|${dimension.judgeGuidance}`] = pick(LEVELS.indexOf(grades[dimension.id]), LEVELS.indexOf(base[dimension.id]));
    }
  }
  const labelsPath = path.join(fixture.root, 'labels.jsonl');
  const answersPath = path.join(fixture.root, 'answers.json');
  fs.writeFileSync(labelsPath, `${rows.join('\n')}\n`);
  fs.writeFileSync(answersPath, JSON.stringify(answers));
  return { labelsPath, answersPath };
};

const third = (g, b) => [0, 1, 2].find((i) => i !== g && i !== b);

test('the deem arm measures every reply and dimension and the report keeps the column', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const { labelsPath, answersPath } = scenario(fixture, (g) => g);
    const outDir = path.join(fixture.root, 'out');
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
        '--deem',
        '--out', outDir,
      ],
      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
    );
    assert.equal(code, 0);
    const last = lines.at(-1);
    assert.ok(last.startsWith('verdict deem: keep K=21 M=21 A=147 B=63 W=21 L=0 F=n/a'));
    assert.ok(last.endsWith('model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource'));
    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line.length > 0);
    assert.equal(calls.length, 147);
    for (const line of calls) {
      const record = JSON.parse(line);
      assert.equal(typeof record.wallMs, 'number');
      assert.equal(typeof record.exitCode, 'number');
      assert.equal(record.modelId, 'deem-0.8-v1');
      assert.equal(record.modelCommit, 'stubmodel');
      assert.equal(record.sourceCommit, 'stubsource');
    }
    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.equal(report.columns.deem.verdict, 'keep');
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('the deem arm stops on the margin when the column repeats the baseline', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const { labelsPath, answersPath } = scenario(fixture, (g, b) => b);
    const outDir = path.join(fixture.root, 'out');
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
        '--deem',
        '--out', outDir,
      ],
      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
    );
    assert.equal(code, 0);
    assert.ok(lines.at(-1).startsWith('verdict deem: stop (margin) K=21 M=21 A=63 B=63 W=0 L=0'));
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('the deem arm kills a column that matches neither the grades nor the baseline', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const { labelsPath, answersPath } = scenario(fixture, third);
    const outDir = path.join(fixture.root, 'out');
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
        '--deem',
        '--out', outDir,
      ],
      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
    );
    assert.equal(code, 0);
    assert.ok(lines.at(-1).startsWith('verdict deem: kill K=21 M=21 A=0 B=63 W=0 L=21'));
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('the deem arm reports a coverage stop when every score call exits 1', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const { labelsPath, answersPath } = scenario(fixture, (g) => g);
    const outDir = path.join(fixture.root, 'out');
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
        '--deem',
        '--out', outDir,
      ],
      stubEnv(fixture.root, { STUB_ANSWERS: answersPath, STUB_SCORE_EXIT: '1' }),
    );
    assert.equal(code, 0);
    assert.ok(lines.at(-1).startsWith('verdict deem: stop (coverage) K=21 M=0'));
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main prints the jev identity line and skips the arm without a credential', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const argv = [
      '--masked', fixture.maskedDirs[0],
      '--masked', fixture.maskedDirs[1],
      '--replies', fixture.repliesDirs[0],
      '--replies', fixture.repliesDirs[1],
      '--replies', fixture.repliesDirs[2],
    ];
    const env = stubEnv(fixture.root, { STUB_AUTH_STATUS_EXIT: '3' });
    const base = await run(argv, env);
    const { code, lines } = await run([...argv, '--jev', '--out', path.join(fixture.root, 'out')], env);
    assert.equal(code, 0);
    assert.deepEqual(lines, [
      ...base.lines,
      `jev: path=${path.join(fixture.root, 'bin', 'jev')} provider=official`,
      'jev arm skipped: no credential',
    ]);
    assert.deepEqual(
      readStubLog(fixture.root).map((line) => line.split('\t').slice(0, 2)),
      [['jev', '--version'], ['jev', 'auth status --provider official']],
    );
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main takes --accept-payload for an untracked masked dir and still stops at the label gate', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const argv = [
      '--masked', fixture.maskedDirs[0],
      '--masked', fixture.maskedDirs[1],
      '--replies', fixture.repliesDirs[0],
      '--replies', fixture.repliesDirs[1],
      '--replies', fixture.repliesDirs[2],
    ];
    const env = stubEnv(fixture.root);
    const base = await run(argv, env);
    const { code, lines } = await run([...argv, '--jev', '--accept-payload', '--out', path.join(fixture.root, 'out')], env);
    assert.equal(code, 0);
    assert.deepEqual(lines.slice(0, -2), base.lines);
    assert.deepEqual(lines.slice(-2), [
      `jev: path=${path.join(fixture.root, 'bin', 'jev')} provider=official`,
      'jev arm skipped: label gate',
    ]);
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('main refuses an untracked payload without --accept-payload and still runs the deem arm', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const { labelsPath, answersPath } = scenario(fixture, (g) => g);
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
        '--jev',
        '--deem',
        '--out', path.join(fixture.root, 'out'),
      ],
      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
    );
    assert.equal(code, 0);
    assert.ok(lines.includes('jev arm skipped: payload not accepted'));
    assert.ok(lines.at(-1).startsWith('verdict deem: keep'));
    assert.ok(readStubLog(fixture.root).every((line) => !line.startsWith('jev\tscore')));
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('payloadClass reads an untracked masked reply as needing --accept-payload', () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const census = buildCensus(fixture.maskedDirs, fixture.repliesDirs);
    assert.equal(payloadClass(census.maskedFiles), 'untracked masked replies');
    assert.equal(payloadClass([{ file: fileURLToPath(new URL('./score.mjs', import.meta.url)) }]), 'committed masked replies');
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});

test('the jev arm reruns every score three times and stops on the flips', async () => {
  const fixture = makeFixture();
  try {
    makeStubBin(fixture.root);
    const { labelsPath, answersPath } = scenario(fixture, (g, b) => [g, g, third(g, b)]);
    const outDir = path.join(fixture.root, 'out');
    const { code, lines } = await run(
      [
        '--masked', fixture.maskedDirs[0],
        '--masked', fixture.maskedDirs[1],
        '--replies', fixture.repliesDirs[0],
        '--replies', fixture.repliesDirs[1],
        '--replies', fixture.repliesDirs[2],
        '--labels', labelsPath,
        '--jev',
        '--accept-payload',
        '--out', outDir,
      ],
      stubEnv(fixture.root, { STUB_ANSWERS: answersPath }),
    );
    assert.equal(code, 0);
    const last = lines.at(-1);
    assert.ok(last.startsWith('verdict jev: stop (flips) K=21 M=21 A=147 B=63 W=21 L=0 F=147'));
    assert.ok(last.endsWith('jev_version=0.6.2 provider=official model=stub-model'));
    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').split('\n').filter((line) => line.length > 0);
    assert.equal(calls.length, 442);
    for (const line of readStubLog(fixture.root)) {
      const [name, args] = line.split('\t');
      if (name !== 'jev' || args === '--version') continue;
      assert.ok(args.includes('--provider official'));
    }
  } finally {
    fs.rmSync(fixture.root, { recursive: true, force: true });
  }
});
