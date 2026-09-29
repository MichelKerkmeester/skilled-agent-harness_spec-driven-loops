#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-residue-flagger.test — corpus, parser and location coverage        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const S = require('../score-residue-flagger.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

// A fixture must not inherit the caller's git redirectors or backend endpoints.
function cleanEnv() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith('GIT_') || key === 'JEV_PROVIDER' || key === 'CLI_DEEM_URL') delete env[key];
  }
  return env;
}

// Fresh temp directory whose name marks it as a fixture.
function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `residue-flgr-${prefix}-`));
}

// The caller's global excludes and attributes files must not hide or rewrite fixture files.
function runGit(root, args) {
  const base = [
    '-C', root,
    '-c', 'user.email=fixture@example.com', '-c', 'user.name=fixture',
    '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null',
    '-c', 'core.excludesFile=/dev/null', '-c', 'core.attributesFile=/dev/null'
  ];
  return execFileSync('git', [...base, ...args], { env: cleanEnv(), encoding: 'utf8' });
}

function writeFiles(root, files) {
  for (const [rel, text] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }
}

// One 10-line document, so a cited line 5 resolves and a cited line 999 drops.
function docLines(name) {
  return Array.from({ length: 10 }, (_, n) => `${name} line ${n + 1}.`).join('\n') + '\n';
}

// Four tables: the three recognized header shapes and one unrecognized shape.
const FINDINGS = [
  '# Findings',
  '',
  '| Severity | Dimension | File:Line | Finding |',
  '| --- | --- | --- | --- |',
  '| P0 | Correctness | docs/a.md:5 | behavior its own text disproves |',
  '| P1 | Spec-Alignment / Traceability | docs/a.md:999 | cites a line past the end |',
  '| P2 | Maintainability | docs/b.md:3 | stale comment |',
  '',
  '| Sev | Dimension | File |',
  '| --- | --- | --- |',
  '| P1 | Security | .env.example:3 |',
  '| P2 | Traceability | docs/b.md |',
  '',
  '| Severity | Dimension | Evidence |',
  '| --- | --- | --- |',
  '| P0 | Traceability | docs/b.md:7 |',
  '',
  '| Level | Area | Where |',
  '| --- | --- | --- |',
  '| P0 | Correctness | docs/a.md:5 |',
  ''
].join('\n');

// A shaped table that must add no rows when its file is outside the corpus walk.
const TRIPWIRE = [
  '| Severity | Dimension | File:Line |',
  '| --- | --- | --- |',
  '| P0 | Correctness | docs/a.md:5 |',
  ''
].join('\n');

// The temp git repository: commit 1 adds the cited documents, commit 2 adds
// the review files, and one review file stays untracked on purpose.
function makeFixture() {
  const root = tempDir('repo');
  runGit(root, ['init', '-q']);
  writeFiles(root, {
    'docs/a.md': docLines('a'),
    'docs/b.md': docLines('b'),
    '.env.example': 'TOKEN=stub\n'
  });
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'documents']);
  const commit1 = runGit(root, ['rev-parse', 'HEAD']).trim();
  writeFiles(root, {
    'specs/demo/review/findings.md': FINDINGS,
    'specs/demo/ai-council/council.md': '# Council\n\nNo findings here.\n',
    'specs/demo/context/notes.md': TRIPWIRE,
    'specs/demo/scratch/draft.md': TRIPWIRE,
    'specs/demo/review/extra.txt': TRIPWIRE
  });
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'reviews']);
  const commit2 = runGit(root, ['rev-parse', 'HEAD']).trim();
  writeFiles(root, { 'specs/demo/review/untracked.md': TRIPWIRE });
  return { root, commit1, commit2 };
}

// A stub binary that logs one line of JSON arguments per call and exits 0.
function stubScript(logName) {
  return [
    '#!/usr/bin/env node',
    "const fs = require('fs');",
    "const path = require('path');",
    `fs.appendFileSync(path.join(__dirname, '${logName}'), JSON.stringify(process.argv.slice(2)) + '\\n');`,
    ''
  ].join('\n');
}

// Stub jev and cli-deem binaries first on PATH; no case reaches a real backend.
function makeStubs() {
  const bin = tempDir('bin');
  fs.writeFileSync(path.join(bin, 'jev'), stubScript('jev.log'), { mode: 0o755 });
  fs.writeFileSync(path.join(bin, 'cli-deem'), stubScript('cli-deem.log'), { mode: 0o755 });
  return bin;
}

// The argument arrays the named stub recorded, empty when it never ran.
function stubLog(bin, name) {
  const file = path.join(bin, `${name}.log`);
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').slice(0, -1).map((line) => JSON.parse(line));
}

function findingsText(root) {
  return fs.readFileSync(path.join(root, 'specs/demo/review/findings.md'), 'utf8');
}

// The draw corpus: two 100-line documents, each cited by 30 findings, so a
// full draw has enough resolvable rows and enough spaced negative lines.
const DRAW_DOC_LINES = 100;

function drawDocLines(name) {
  return Array.from({ length: DRAW_DOC_LINES }, (_, n) => `${name} line ${n + 1}.`).join('\n') + '\n';
}

function makeDrawFixture() {
  const root = tempDir('draw-repo');
  runGit(root, ['init', '-q']);
  writeFiles(root, {
    'docs/a.md': drawDocLines('a'),
    'docs/b.md': drawDocLines('b')
  });
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'documents']);
  const commit1 = runGit(root, ['rev-parse', 'HEAD']).trim();
  const cited = [];
  for (let line = 1; line <= 30; line += 1) cited.push(`| P0 | Correctness | docs/a.md:${line} | cited |`);
  for (let line = 1; line <= 30; line += 1) cited.push(`| P1 | Traceability | docs/b.md:${line} | cited |`);
  writeFiles(root, {
    'specs/demo/review/draw.md': ['| Severity | Dimension | File:Line |', '| --- | --- | --- |', ...cited, ''].join('\n')
  });
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'reviews']);
  return { root, commit1 };
}

// Runs main against one fixture repository and collects its output lines and exit code.
async function runMain(args, options = {}) {
  const lines = [];
  const errs = [];
  const code = await S.main(args, {
    repoRoot: options.root,
    out: (line) => lines.push(line),
    err: (line) => errs.push(line),
    env: cleanEnv(),
    timeoutMs: 20000,
    backoffMs: 1
  });
  return { code, lines, errs };
}

// Runs main with the stub binaries first on PATH, so any call a case makes is
// logged by the stub instead of reaching a real backend.
async function runMainWithStubs(args, { root, bin }) {
  const lines = [];
  const errs = [];
  const code = await S.main(args, {
    repoRoot: root,
    out: (line) => lines.push(line),
    err: (line) => errs.push(line),
    env: { ...cleanEnv(), PATH: `${bin}${path.delimiter}${process.env.PATH}` },
    timeoutMs: 20000,
    backoffMs: 1
  });
  return { code, lines, errs };
}

// Writes a drawn labels file relabeled for the gate and baseline cases. The
// draw is the operator's own, so the row shape under test stays the drawn shape.
function writeLabels(root, seed, labelFor) {
  const census = S.buildCensus(root, S.trackedFiles(root));
  const rows = S.drawRows(census, root, census.commit, seed);
  const file = path.join(tempDir('labels'), 'labels.jsonl');
  S.writeJsonl(file, rows.map((row, index) => {
    const label = labelFor(index);
    return label === null ? { ...row, label: null, labeler: null } : { ...row, label, labeler: 'fixture' };
  }));
  return file;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('corpus walk', () => {
  const { root } = makeFixture();
  const tracked = S.trackedFiles(root);
  assert.deepEqual(S.walkReviewFiles(tracked), ['specs/demo/ai-council/council.md', 'specs/demo/review/findings.md']);
  assert.equal(S.buildCensus(root, tracked).files, 2);
});

test('parser three shapes', () => {
  const { root } = makeFixture();
  const parsed = S.parseFindingTables(findingsText(root), 'specs/demo/review/findings.md');
  assert.deepEqual(parsed.tables.map((table) => table.shape), [
    'Severity|Dimension|File:Line',
    'Sev|Dimension|File',
    'Severity|Dimension|Evidence'
  ]);
  assert.deepEqual(parsed.tables.map((table) => table.rows.length), [3, 2, 1]);
  const severity = { P0: 0, P1: 0, P2: 0 };
  for (const table of parsed.tables) {
    for (const row of table.rows) severity[row.severity] += 1;
  }
  assert.deepEqual(severity, { P0: 2, P1: 2, P2: 2 });
});

test('parser skipped shape', () => {
  const { root } = makeFixture();
  const parsed = S.parseFindingTables(findingsText(root), 'specs/demo/review/findings.md');
  assert.deepEqual(parsed.skipped, [{ line: 18, header: '| Level | Area | Where |' }]);
  let rows = 0;
  for (const table of parsed.tables) rows += table.rows.length;
  assert.equal(rows, 6);
});

test('parser ignores a table without severities', () => {
  const text = [
    '| Metric | Value |',
    '| --- | --- |',
    '| iterations | 5 |',
    '| findings | 3 |',
    ''
  ].join('\n');
  const parsed = S.parseFindingTables(text, 'specs/demo/review/findings.md');
  assert.deepEqual(parsed.tables, []);
  assert.deepEqual(parsed.skipped, []);
});

test('dimension mapping', () => {
  const { root } = makeFixture();
  const parsed = S.parseFindingTables(findingsText(root), 'specs/demo/review/findings.md');
  const rows = [];
  for (const table of parsed.tables) rows.push(...table.rows);
  assert.equal(rows.find((row) => row.location === 'docs/a.md:5').dimension, 'correctness');
  assert.equal(rows.find((row) => row.location === 'docs/a.md:999').dimension, 'traceability');
  const census = S.buildCensus(root, S.trackedFiles(root));
  assert.equal(census.byDimension.correctness, 1);
  assert.equal(census.byDimension.traceability, 3);
});

test('commit resolution', () => {
  const { root, commit1, commit2 } = makeFixture();
  assert.equal(S.addingCommit(root, 'specs/demo/review/findings.md'), commit2);
  assert.equal(S.reviewedCommit(root, 'specs/demo/review/findings.md'), commit1);
});

test('git output above 1 MB', () => {
  const root = tempDir('big-repo');
  runGit(root, ['init', '-q']);
  writeFiles(root, { 'docs/big.md': 'x'.repeat(2000000) });
  runGit(root, ['add', '-A']);
  runGit(root, ['commit', '-q', '-m', 'big document']);
  const commit = runGit(root, ['rev-parse', 'HEAD']).trim();
  assert.equal(S.readAtCommit(root, commit, 'docs/big.md').length, 2000000);
});

test('untracked review file', () => {
  const { root } = makeFixture();
  const tracked = S.trackedFiles(root);
  assert.ok(!tracked.includes('specs/demo/review/untracked.md'));
  assert.ok(!S.walkReviewFiles(tracked).includes('specs/demo/review/untracked.md'));
  const census = S.buildCensus(root, tracked);
  assert.equal(census.files, 2);
  assert.equal(census.rows, 6);
});

test('staged review file', async () => {
  const { root } = makeFixture();
  writeFiles(root, {
    'specs/demo/review/staged.md': [
      '| Severity | Dimension | Location | Finding |',
      '| --- | --- | --- | --- |',
      '| P1 | Correctness | docs/a.md:1 | staged row |',
      ''
    ].join('\n')
  });
  runGit(root, ['add', 'specs/demo/review/staged.md']);
  // Staging is not committing: the census reads HEAD's tree, so a staged file
  // is still outside it and must add nothing to the counts.
  assert.ok(!S.trackedFiles(root).includes('specs/demo/review/staged.md'));
  const { code, lines, errs } = await runMain([], { root });
  assert.equal(code, 0, errs.join('\n'));
  const census = lines.find((line) => line.startsWith('census: '));
  assert.ok(census.includes('files=2'));
  assert.ok(census.includes('rows=6'));
});

test('location resolves', () => {
  const { root, commit1 } = makeFixture();
  const tracked = S.trackedFiles(root);
  assert.deepEqual(
    S.resolveLocation('docs/a.md:5', { commit: commit1, tracked, repoRoot: root }),
    { status: 'resolved', path: 'docs/a.md', line: 5 }
  );
  assert.equal(S.buildCensus(root, tracked).resolvable.correctness, 1);
});

test('location dropped', () => {
  const { root, commit1 } = makeFixture();
  const tracked = S.trackedFiles(root);
  assert.deepEqual(
    S.resolveLocation('docs/a.md:999', { commit: commit1, tracked, repoRoot: root }),
    { status: 'dropped', path: 'docs/a.md', line: 999 }
  );
  assert.equal(
    S.buildCensus(root, tracked).dropped, 2,
    'the past-end row and the missing-line row are both counted'
  );
});

test('refused .env', () => {
  const { root } = makeFixture();
  const tracked = S.trackedFiles(root);
  assert.ok(tracked.includes('.env.example'));
  // A commit that cannot be read would drop the row, so a refusal here proves
  // the file was never opened.
  assert.deepEqual(
    S.resolveLocation('.env.example:3', { commit: 'no-such-commit', tracked, repoRoot: root }),
    { status: 'refused', path: '.env.example', line: 3 }
  );
  assert.equal(S.buildCensus(root, tracked).refused, 1);
});

test('draw reproducible', async () => {
  const { root, commit1 } = makeDrawFixture();
  const fileA = path.join(tempDir('draw-a'), 'labels.jsonl');
  const fileB = path.join(tempDir('draw-b'), 'labels.jsonl');
  const first = await runMain(['--draw', '--seed', '1', '--labels', fileA], { root });
  const second = await runMain(['--draw', '--seed', '1', '--labels', fileB], { root });
  assert.equal(first.code, 0, first.errs.join('\n'));
  assert.equal(second.code, 0, second.errs.join('\n'));
  assert.equal(fs.readFileSync(fileA, 'utf8'), fs.readFileSync(fileB, 'utf8'));
  const rows = S.readJsonl(fileA);
  assert.equal(rows.length, 100);
  assert.deepEqual(Object.keys(rows[0]), ['id', 'source', 'category', 'doc', 'line', 'window_start', 'window_end',
    'commit', 'window_sha12', 'kind', 'label', 'labeler']);
  assert.deepEqual([...rows.map((row) => row.id)].sort(),
    Array.from({ length: 100 }, (_, n) => `r${String(n + 1).padStart(3, '0')}`).sort());
  assert.equal(rows.filter((row) => row.kind === 'positive').length, 50);
  assert.equal(rows.filter((row) => row.kind === 'negative').length, 50);
  for (const category of ['correctness', 'traceability']) {
    assert.equal(rows.filter((row) => row.kind === 'positive' && row.category === category).length, 25);
    assert.equal(rows.filter((row) => row.kind === 'negative' && row.category === category).length, 25);
  }
  for (const row of rows) {
    assert.ok(!('text' in row) && !('passage' in row), `${row.id} must carry no passage text`);
    assert.equal(row.commit, commit1);
    assert.equal(row.label, null);
    assert.equal(row.labeler, null);
    assert.match(row.window_sha12, /^[0-9a-f]{12}$/);
    assert.ok(row.window_start >= 1 && row.window_start <= row.line && row.line <= row.window_end);
  }
  assert.equal(first.lines.length, 1);
  assert.equal(first.lines[0],
    `draw: path=${fileA} seed=1 commit=${S.headCommit(root).slice(0, 12)} rows=100 positives=50 negatives=50`);
});

test('draw spacing', async () => {
  const { root } = makeDrawFixture();
  const labels = path.join(tempDir('draw-c'), 'labels.jsonl');
  const run = await runMain(['--draw', '--seed', '1', '--labels', labels], { root });
  assert.equal(run.code, 0, run.errs.join('\n'));
  const negatives = S.readJsonl(labels).filter((row) => row.kind === 'negative');
  assert.equal(negatives.length, 50);
  const citedLines = { 'docs/a.md': [], 'docs/b.md': [] };
  for (let line = 1; line <= 30; line += 1) {
    citedLines['docs/a.md'].push(line);
    citedLines['docs/b.md'].push(line);
  }
  for (const negative of negatives) {
    assert.ok(Object.hasOwn(citedLines, negative.doc), `${negative.id} is drawn from a document no finding cites`);
    for (const line of citedLines[negative.doc]) {
      assert.ok(Math.abs(negative.line - line) >= 20,
        `${negative.id} at line ${negative.line} sits within 20 lines of cited line ${line}`);
    }
  }
});

test('draw refuses labels', async () => {
  const { root } = makeDrawFixture();
  const labels = path.join(tempDir('draw-d'), 'labels.jsonl');
  assert.equal((await runMain(['--draw', '--seed', '1', '--labels', labels], { root })).code, 0);
  const rows = S.readJsonl(labels);
  rows[0] = { ...rows[0], label: 'defect', labeler: 'operator' };
  S.writeJsonl(labels, rows);
  const before = fs.readFileSync(labels, 'utf8');
  const refused = await runMain(['--draw', '--seed', '2', '--labels', labels], { root });
  assert.equal(refused.code, 2);
  assert.deepEqual(refused.lines, []);
  assert.deepEqual(refused.errs, [`draw refused: ${labels} holds a label`]);
  assert.equal(fs.readFileSync(labels, 'utf8'), before);
});

test('draw shortfall', async () => {
  const { root } = makeFixture();
  const labels = path.join(tempDir('draw-e'), 'labels.jsonl');
  const run = await runMain(['--draw', '--seed', '1', '--labels', labels], { root });
  assert.equal(run.code, 2);
  assert.deepEqual(run.lines, []);
  assert.deepEqual(run.errs, ['draw needs 25 resolvable rows in correctness, found 1']);
  assert.equal(fs.existsSync(labels), false);
});

test('label gate 99', async () => {
  const { root } = makeDrawFixture();
  const bin = makeStubs();
  const labels = writeLabels(root, 11, (index) => (index < 99 ? 'clean' : null));
  assert.deepEqual(S.labelGate(S.readJsonl(labels)), { complete: false, labeled: 99 });
  const run = await runMainWithStubs(['--labels', labels], { root, bin });
  assert.equal(run.code, 0, run.errs.join('\n'));
  assert.ok(run.lines.includes('stop: fewer than 100 labeled rows'));
  assert.ok(!run.lines.some((line) => line.startsWith('baseline:')));
  assert.deepEqual(stubLog(bin, 'jev'), []);
  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
});

test('default zero calls', async () => {
  const { root } = makeFixture();
  const bin = makeStubs();
  const before = runGit(root, ['status', '--porcelain']);
  const run = await runMainWithStubs([], { root, bin });
  assert.equal(run.code, 0, run.errs.join('\n'));
  assert.ok(run.lines.some((line) => line.startsWith('census: ')));
  assert.ok(run.lines.some((line) => line.startsWith('severity ')));
  assert.ok(run.lines.some((line) => line.startsWith('dimension ')));
  assert.deepEqual(stubLog(bin, 'jev'), []);
  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
  assert.equal(runGit(root, ['status', '--porcelain']), before);
  assert.equal(fs.existsSync(path.join(root, 'report.json')), false);
  assert.equal(fs.existsSync(path.join(root, 'calls.jsonl')), false);
});

test('baseline and headroom', async () => {
  const { root } = makeDrawFixture();
  const bin = makeStubs();
  const labels = writeLabels(root, 12, (index) => (index < 60 ? 'clean' : 'defect'));
  const run = await runMainWithStubs(['--labels', labels], { root, bin });
  assert.equal(run.code, 0, run.errs.join('\n'));
  assert.ok(run.lines.includes('baseline: flag-nothing right=60 of 100'));
  assert.ok(run.lines.includes('baseline: defect share=40 of 100'));
  assert.ok(run.lines.includes('margin: 0.10'));
  assert.ok(run.lines.includes('keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)'));
  assert.ok(run.lines.includes('headroom: a 10-point gain fits above 60/100'));
  assert.deepEqual(S.ruleLines(), ['margin: 0.10',
    'keep rule: coverage 10*M >= 9*K, precision 5*TP >= 4*(TP+FP), margin 10*(A-B) >= M, sign test p < 0.05, flips 10*F <= 3*M (jev only)']);
  const correctness = 'Does this passage claim behavior that its own text shows to be wrong or inconsistent?';
  const traceability = 'Does this passage name a spec item or requirement that the text it describes does not match or does not contain?';
  assert.deepEqual(S.instructionLines(), [
    `instruction correctness sha256=${S.sha256Hex(correctness)}: ${correctness}`,
    `instruction traceability sha256=${S.sha256Hex(traceability)}: ${traceability}`
  ]);
  assert.deepEqual(stubLog(bin, 'jev'), []);
  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
});

test('no headroom', async () => {
  const { root } = makeDrawFixture();
  const bin = makeStubs();
  const labels = writeLabels(root, 13, (index) => (index < 95 ? 'clean' : 'defect'));
  const run = await runMainWithStubs(['--labels', labels], { root, bin });
  assert.equal(run.code, 0, run.errs.join('\n'));
  assert.ok(run.lines.includes('baseline: flag-nothing right=95 of 100'));
  assert.ok(run.lines.includes('baseline: defect share=5 of 100'));
  assert.ok(run.lines.includes('no headroom'));
  assert.ok(!run.lines.some((line) => line.startsWith('headroom:')));
  assert.equal(S.headroomLine({ right: 95, defect: 5, K: 100 }), 'no headroom');
  assert.deepEqual(stubLog(bin, 'jev'), []);
  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
});

test('underpowered', () => {
  // Four defect rows in ten: below the five a sign test needs, so no arm may start.
  assert.equal(S.headroomLine({ right: 6, defect: 4, K: 10 }), 'underpowered');
});

test('verdict keep', () => {
  const counts = { K: 90, M: 90, A: 90, B: 60, W: 30, L: 0, TP: 30, FP: 0, F: 0 };
  const verdict = S.decideVerdict({ backend: 'jev', ...counts });
  assert.equal(verdict.outcome, 'keep');
  assert.equal(verdict.reason, null);
  assert.equal(S.verdictText(verdict), 'keep');
  assert.deepEqual(S.signTestP(5, 0), { p: 0.03125, below: true });
  assert.equal(S.signTestP(4, 0).below, false, 'p 0.0625 is not below the 0.05 bar');
  assert.equal(
    S.verdictLine('jev', counts, verdict, 'jev_version=0.6.2 provider=official model=stub-model'),
    'verdict jev: keep K=90 M=90 A=90 B=60 W=30 L=0 TP=30 FP=0 F=0 p=9.313e-10 jev_version=0.6.2 provider=official model=stub-model'
  );
});

test('verdict kill precision', () => {
  const verdict = S.decideVerdict({ backend: 'jev', K: 90, M: 90, A: 85, B: 60, W: 28, L: 3, TP: 3, FP: 2, F: 0 });
  assert.equal(verdict.outcome, 'kill');
  assert.equal(verdict.reason, 'precision');
  assert.equal(S.verdictText(verdict), 'kill (precision)');
  const counts = { K: 10, M: 10, A: 6, B: 6, W: 0, L: 0, TP: 0, FP: 0, F: 0 };
  const deem = S.decideVerdict({ backend: 'deem', ...counts });
  assert.equal(S.verdictText(deem), 'kill (precision)');
  assert.equal(
    S.verdictLine('deem', counts, deem, ''),
    'verdict deem: kill (precision) K=10 M=10 A=6 B=6 W=0 L=0 TP=0 FP=0 F=n/a p=1.000'
  );
});

test('verdict stop coverage', () => {
  const verdict = S.decideVerdict({ backend: 'jev', K: 10, M: 8, A: 8, B: 3, W: 5, L: 0, TP: 5, FP: 0, F: 0 });
  assert.equal(verdict.outcome, 'stop');
  assert.equal(verdict.reason, 'coverage');
  assert.equal(S.verdictText(verdict), 'stop (coverage)');
});

test('verdict stop margin', () => {
  const verdict = S.decideVerdict({ backend: 'deem', K: 90, M: 90, A: 66, B: 60, W: 8, L: 2, TP: 28, FP: 2, F: 0 });
  assert.equal(verdict.outcome, 'stop');
  assert.equal(verdict.reason, 'margin');
  assert.equal(S.verdictText(verdict), 'stop (margin)');
});

test('brier score', () => {
  const rows = [
    { id: 'r001', label: 'defect' },
    { id: 'r002', label: 'clean' },
    { id: 'r003', label: 'defect' },
    { id: 'r004', label: 'defect' }
  ];
  const calls = [
    { rowId: 'r001', probability: 1 },
    { rowId: 'r002', probability: 0 },
    { rowId: 'r003', probability: 0.5 }
  ];
  assert.equal(S.brierScore(calls, rows), 0.25 / 3, 'the unmeasured row leaves the score');
  assert.equal(S.brierScore([], rows), null);
});

// A cli-deem stub driven by a JSON config beside it: health answers by call
// index, and each noul answer is keyed by the window hash, so a call's
// judgment follows the text the arm sent rather than its position.
function writeDeemStub(bin, config) {
  fs.writeFileSync(path.join(bin, 'cli-deem.config.json'), JSON.stringify(config));
  const script = [
    '#!/usr/bin/env node',
    "'use strict';",
    "const fs = require('fs');",
    "const path = require('path');",
    "const crypto = require('crypto');",
    'const dir = __dirname;',
    "const config = JSON.parse(fs.readFileSync(path.join(dir, 'cli-deem.config.json'), 'utf8'));",
    'const argv = process.argv.slice(2);',
    "fs.appendFileSync(path.join(dir, 'cli-deem.log'), JSON.stringify(argv) + '\\n');",
    'function bump(name) {',
    '  const file = path.join(dir, name);',
    "  const next = (fs.existsSync(file) ? Number(fs.readFileSync(file, 'utf8')) : 0) + 1;",
    '  fs.writeFileSync(file, String(next));',
    '  return next - 1;',
    '}',
    "if (argv[0] === 'health') {",
    "  const answer = config.health[Math.min(bump('health.count'), config.health.length - 1)];",
    "  if (answer.stderr !== undefined) process.stderr.write(answer.stderr);",
    '  if (answer.exit !== 0) process.exit(answer.exit);',
    '  process.stdout.write(JSON.stringify(answer.body));',
    '  process.exit(0);',
    '}',
    "if (argv[0] === 'noul') {",
    "  const answer = config.noul[Math.min(bump('noul.count'), config.noul.length - 1)];",
    '  if (answer.exit !== 0) process.exit(answer.exit);',
    "  let stdin = '';",
    "  process.stdin.setEncoding('utf8');",
    "  process.stdin.on('data', (chunk) => { stdin += chunk; });",
    "  process.stdin.on('end', () => {",
    "    const key = crypto.createHash('sha256').update(stdin).digest('hex').slice(0, 12);",
    '    const noul = (answer.probabilities ?? {})[key] ?? null;',
    '    process.stdout.write(JSON.stringify({ answers: { answer: { noul } } }));',
    '    process.exit(0);',
    '  });',
    '  return;',
    '}',
    'process.exit(2);',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(bin, 'cli-deem'), script, { mode: 0o755 });
}

// The environment the fixtures reach the stubs through: first on PATH, no
// redirectors inherited from the caller.
function stubEnv(bin) {
  return { ...cleanEnv(), PATH: `${bin}${path.delimiter}${process.env.PATH}` };
}

// A hand-built plan the size of a small run, one window per row, so a case
// reaches the arm without a drawn file.
function smallPlan(defects, cleans) {
  const rows = [];
  const add = (label) => {
    const category = rows.length % 2 === 0 ? 'correctness' : 'traceability';
    rows.push({
      id: `r${String(rows.length + 1).padStart(3, '0')}`,
      category,
      label,
      instruction: `Q ${category}`,
      text: `window ${rows.length + 1}`
    });
  };
  for (let n = 0; n < defects; n += 1) add('defect');
  for (let n = 0; n < cleans; n += 1) add('clean');
  const baselineFlags = new Map(rows.map((row) => [row.id, false]));
  return { rows, baselineFlags };
}

// The probabilities a stub answers for each hand-built plan window.
function planProbabilities(plan) {
  const probabilities = {};
  for (const row of plan.rows) {
    probabilities[S.sha256Hex(row.text).slice(0, 12)] = row.label === 'defect' ? 0.9 : 0.1;
  }
  return probabilities;
}

// The probabilities a stub answers for each drawn row's window, read back at
// the commit the row names.
function labelsProbabilities(root, labelsFile, probabilityForLabel) {
  const probabilities = {};
  for (const row of S.readJsonl(labelsFile)) {
    const lines = S.readAtCommit(root, row.commit, row.doc).split('\n');
    if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
    const text = lines.slice(row.window_start - 1, row.window_end).join('\n');
    probabilities[S.sha256Hex(text).slice(0, 12)] = probabilityForLabel(row.label);
  }
  return probabilities;
}

// The identity a stub health reports.
function deemHealthBody(modelCommit, sourceCommit) {
  return { ok: true, backend: 'torch', model: 'deem-0.8-v1', model_commit: modelCommit, source_commit: sourceCommit };
}

test('deem gate pass', async () => {
  const bin = makeStubs();
  const plan = smallPlan(5, 5);
  writeDeemStub(bin, {
    health: [{ exit: 0, body: deemHealthBody('mdl-gate', 'src-gate') }],
    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
  });
  const lines = [];
  const out = (line) => lines.push(line);
  const env = stubEnv(bin);
  const gate = S.deemGate({ out, env, repoRoot: tempDir('deem-gate-root') });
  assert.equal(gate.passed, true);
  assert.deepEqual(lines, ['deem: health backend=torch model=deem-0.8-v1 model_commit=mdl-gate source_commit=src-gate']);
  const outDir = tempDir('deem-gate-out');
  const result = await S.runDeemArm(plan, gate, { out, env, timeoutMs: 20000, callLog: S.createCallLog(outDir), stored: null });
  assert.equal(result.column.line,
    'verdict deem: keep K=10 M=10 A=10 B=5 W=5 L=0 TP=5 FP=0 F=n/a p=0.03125 model=deem-0.8-v1 model_commit=mdl-gate source_commit=src-gate');
  assert.equal(lines[1], 'deem: nothing leaves the machine; planned calls: 10; estimated wall time: 0.6 s at 60.5 ms per call, the noul p50 in deem-local.md');
  assert.ok(lines.includes('brier deem: 0.0100'));
  assert.ok(lines.includes('flips: not applicable (deem noul)'));
  assert.equal(lines[lines.length - 1], result.column.line);
  assert.equal(S.readJsonl(path.join(outDir, 'calls.jsonl')).length, 10);
  assert.deepEqual(stubLog(bin, 'cli-deem')[0], ['health']);
});

test('deem stub backend', async () => {
  const { root } = makeDrawFixture();
  const bin = makeStubs();
  const labels = writeLabels(root, 31, (index) => (index < 50 ? 'defect' : 'clean'));
  writeDeemStub(bin, { health: [{ exit: 3, stderr: '{"error":"stub backend"}' }], noul: [] });
  const outDir = tempDir('deem-stub-out');
  const plain = await runMainWithStubs(['--labels', labels], { root, bin });
  const skipped = await runMainWithStubs(['--labels', labels, '--deem', '--out', outDir], { root, bin });
  assert.equal(plain.code, 0, plain.errs.join('\n'));
  assert.equal(skipped.code, 0, skipped.errs.join('\n'));
  assert.deepEqual(skipped.lines.slice(0, plain.lines.length), plain.lines);
  assert.deepEqual(skipped.lines.slice(plain.lines.length), ['deem arm skipped: stub backend']);
  assert.deepEqual(stubLog(bin, 'cli-deem'), [['health']]);
  assert.equal(fs.existsSync(path.join(outDir, 'calls.jsonl')), false);
  assert.equal(fs.existsSync(path.join(outDir, 'report.json')), false);
});

test('deem keep', async () => {
  const { root } = makeDrawFixture();
  const bin = makeStubs();
  const labels = writeLabels(root, 32, (index) => (index < 50 ? 'defect' : 'clean'));
  writeDeemStub(bin, {
    health: [{ exit: 0, body: deemHealthBody('mdl-keep', 'src-keep') }],
    noul: [{ exit: 0, probabilities: labelsProbabilities(root, labels, (label) => (label === 'defect' ? 0.9 : 0.1)) }]
  });
  const outDir = tempDir('deem-keep-out');
  const run = await runMainWithStubs(['--labels', labels, '--deem', '--out', outDir], { root, bin });
  assert.equal(run.code, 0, run.errs.join('\n'));
  assert.ok(run.lines.includes('brier deem: 0.0100'));
  assert.ok(run.lines.includes('flips: not applicable (deem noul)'));
  const verdicts = run.lines.filter((line) => line.startsWith('verdict deem: '));
  assert.equal(verdicts.length, 1);
  assert.equal(verdicts[0],
    'verdict deem: keep K=100 M=100 A=100 B=50 W=50 L=0 TP=50 FP=0 F=n/a p=8.882e-16 model=deem-0.8-v1 model_commit=mdl-keep source_commit=src-keep');
  const calls = S.readJsonl(path.join(outDir, 'calls.jsonl'));
  assert.equal(calls.length, 100);
  for (const call of calls) {
    assert.equal(call.backend, 'deem');
    assert.equal(call.rerun, 0);
    assert.ok(Number.isFinite(call.wallMs) && call.wallMs >= 0);
    assert.equal(call.exitCode, 0);
    assert.equal(call.modelId, 'deem-0.8-v1');
    assert.equal(call.modelCommit, 'mdl-keep');
    assert.equal(call.sourceCommit, 'src-keep');
    assert.equal(call.status, 'measured');
    assert.equal(call.flag, call.probability >= 0.5);
  }
  const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
  assert.deepEqual(Object.keys(report),
    ['commit', 'census', 'labels', 'baseline', 'headroom', 'margin', 'keepRule', 'instructions', 'columns', 'requalify', 'stopped', 'skipped']);
  assert.deepEqual(Object.keys(report.labels), ['path', 'sha256', 'rows', 'labeled']);
  assert.equal(report.labels.path, labels);
  assert.equal(report.labels.sha256, S.sha256Hex(fs.readFileSync(labels, 'utf8')));
  assert.equal(report.labels.rows, 100);
  assert.equal(report.labels.labeled, 100);
  assert.deepEqual(report.baseline, { right: 50, defect: 50, K: 100 });
  assert.equal(report.headroom, 'headroom: a 10-point gain fits above 50/100');
  assert.equal(report.margin, 'margin: 0.10');
  assert.ok(report.keepRule.startsWith('keep rule: coverage 10*M >= 9*K'));
  const correctness = 'Does this passage claim behavior that its own text shows to be wrong or inconsistent?';
  const traceability = 'Does this passage name a spec item or requirement that the text it describes does not match or does not contain?';
  assert.deepEqual(report.instructions, {
    correctness: { sha256: S.sha256Hex(correctness) },
    traceability: { sha256: S.sha256Hex(traceability) }
  });
  assert.equal(report.columns.deem.line, verdicts[0]);
  assert.equal(report.columns.deem.modelCommit, 'mdl-keep');
  assert.equal(report.requalify.deem, null);
  assert.deepEqual(report.stopped, {});
  assert.deepEqual(report.skipped, {});
  assert.equal(report.commit, report.census.commit);
});

test('deem exit 4 changed pair', async () => {
  const bin = makeStubs();
  const plan = smallPlan(5, 5);
  writeDeemStub(bin, {
    health: [
      { exit: 0, body: deemHealthBody('mdl-one', 'src-one') },
      { exit: 0, body: deemHealthBody('mdl-two', 'src-two') }
    ],
    noul: [{ exit: 4 }]
  });
  const lines = [];
  const out = (line) => lines.push(line);
  const env = stubEnv(bin);
  const gate = S.deemGate({ out, env, repoRoot: tempDir('deem-stop-root') });
  assert.equal(gate.passed, true);
  const outDir = tempDir('deem-stop-out');
  const result = await S.runDeemArm(plan, gate, { out, env, timeoutMs: 20000, callLog: S.createCallLog(outDir), stored: null });
  assert.deepEqual(result, { stopped: 'deem arm stopped: model commit changed mid-run', partialRows: 0 });
  assert.ok(lines.includes('deem arm stopped: model commit changed mid-run'));
  assert.ok(lines.includes('deem: partial rows=0'));
  assert.ok(!lines.some((line) => line.startsWith('verdict ')));
  assert.deepEqual(stubLog(bin, 'cli-deem'), [['health'], ['noul', '-q', 'Q correctness'], ['health']]);
  const calls = S.readJsonl(path.join(outDir, 'calls.jsonl'));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].rowId, 'r001');
  assert.equal(calls[0].rerun, 0);
  assert.ok(Number.isFinite(calls[0].wallMs));
  assert.equal(calls[0].exitCode, 4);
  assert.equal(calls[0].backend, 'deem');
  assert.equal(calls[0].probability, null);
  assert.equal(calls[0].flag, null);
  assert.equal(calls[0].status, 'unmeasured');
  assert.equal(calls[0].modelCommit, 'mdl-one');
  assert.equal(calls[0].sourceCommit, 'src-one');
});

test('--out required', async () => {
  const { root } = makeFixture();
  const bin = makeStubs();
  const run = await runMainWithStubs(['--jev'], { root, bin });
  assert.equal(run.code, 2);
  assert.deepEqual(run.lines, []);
  assert.deepEqual(run.errs, ['--jev and --deem need --out <dir> so every call is recorded']);
  assert.deepEqual(stubLog(bin, 'jev'), []);
  assert.deepEqual(stubLog(bin, 'cli-deem'), []);
  assert.equal(fs.existsSync(path.join(root, 'report.json')), false);
});

test('requalify', async () => {
  const bin = makeStubs();
  const plan = smallPlan(5, 5);
  writeDeemStub(bin, {
    health: [{ exit: 0, body: deemHealthBody('mdl-new', 'src-new') }],
    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
  });
  const lines = [];
  const out = (line) => lines.push(line);
  const env = stubEnv(bin);
  const gate = S.deemGate({ out, env, repoRoot: tempDir('deem-requalify-root') });
  const outDir = tempDir('deem-requalify-out');
  const stored = { columns: { deem: { modelCommit: 'mdl-old', sourceCommit: 'src-old' } } };
  const result = await S.runDeemArm(plan, gate, { out, env, timeoutMs: 20000, callLog: S.createCallLog(outDir), stored });
  assert.equal(result.requalify, 'requalify: model commit changed');
  const index = lines.indexOf('requalify: model commit changed');
  assert.ok(index >= 0);
  assert.ok(lines[index + 1].startsWith('verdict deem: '));
  assert.equal(lines.filter((line) => line.startsWith('requalify:')).length, 1);
});

// A jev stub driven by a JSON config beside it: the version and credential
// answers for the gate, then the model identity and a per-window noul answer
// per call, so a call's judgment follows the text the arm sent.
function writeJevStub(bin, config) {
  fs.writeFileSync(path.join(bin, 'jev.config.json'), JSON.stringify(config));
  const script = [
    '#!/usr/bin/env node',
    "'use strict';",
    "const fs = require('fs');",
    "const path = require('path');",
    "const crypto = require('crypto');",
    'const dir = __dirname;',
    "const config = JSON.parse(fs.readFileSync(path.join(dir, 'jev.config.json'), 'utf8'));",
    'const argv = process.argv.slice(2);',
    "fs.appendFileSync(path.join(dir, 'jev.log'), JSON.stringify(argv) + '\\n');",
    'function bump(name) {',
    '  const file = path.join(dir, name);',
    "  const next = (fs.existsSync(file) ? Number(fs.readFileSync(file, 'utf8')) : 0) + 1;",
    '  fs.writeFileSync(file, String(next));',
    '  return next - 1;',
    '}',
    "if (argv[0] === '--version') {",
    "  process.stdout.write((config.version ?? 'jev 0.6.2') + '\\n');",
    '  process.exit(0);',
    '}',
    "if (argv[0] === 'auth' && argv[1] === 'status') {",
    "  const answer = config.status[Math.min(bump('status.count'), config.status.length - 1)];",
    '  if (answer.stderr !== undefined) process.stderr.write(answer.stderr);',
    '  process.exit(answer.exit);',
    '}',
    "if (argv[0] === 'auth' && argv[1] === 'test') {",
    "  process.stdout.write(JSON.stringify({ model: config.model ?? 'stub-model' }));",
    '  process.exit(0);',
    '}',
    "if (argv[0] === 'noul') {",
    "  const answer = config.noul[Math.min(bump('noul.count'), config.noul.length - 1)];",
    '  if (answer.exit !== 0) process.exit(answer.exit);',
    "  let stdin = '';",
    "  process.stdin.setEncoding('utf8');",
    "  process.stdin.on('data', (chunk) => { stdin += chunk; });",
    "  process.stdin.on('end', () => {",
    "    const key = crypto.createHash('sha256').update(stdin).digest('hex').slice(0, 12);",
    '    const noul = (answer.probabilities ?? {})[key] ?? null;',
    '    process.stdout.write(JSON.stringify({ answers: { answer: { noul } } }));',
    '    process.exit(0);',
    '  });',
    '  return;',
    '}',
    'process.exit(2);',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(bin, 'jev'), script, { mode: 0o755 });
}

test('jev gate pass', async () => {
  const bin = makeStubs();
  const plan = smallPlan(5, 5);
  writeJevStub(bin, {
    version: 'jev 0.6.2',
    status: [{ exit: 0 }],
    model: 'stub-model',
    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
  });
  const lines = [];
  const out = (line) => lines.push(line);
  const env = stubEnv(bin);
  const gate = S.jevGate({ out, env, timeoutMs: 20000 });
  assert.equal(gate.passed, true);

  const outDir = tempDir('jev-gate-out');
  const result = await S.runJevArm(plan, gate, { out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(outDir), stored: null });
  assert.deepEqual(lines, [
    `jev: path=${path.join(bin, 'jev')} provider=official`,
    'jev: payload: windows of committed documents; planned calls: 31; estimated input tokens: 162',
    'jev: auth test provider=official model=stub-model',
    'brier jev: 0.0100',
    'verdict jev: keep K=10 M=10 A=10 B=5 W=5 L=0 TP=5 FP=0 F=0 p=0.03125 jev_version=0.6.2 provider=official model=stub-model'
  ]);
  assert.equal(result.requalify, null);
  assert.equal(S.readJsonl(path.join(outDir, 'calls.jsonl')).length, 31);

  const requalified = await S.runJevArm(plan, gate, {
    out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(tempDir('jev-requalify-out')),
    stored: { columns: { jev: { provider: 'openrouter', model: 'stub-model' } } }
  });
  assert.equal(requalified.requalify, 'requalify: model changed');
  assert.equal(lines.at(-2), 'requalify: model changed');
  assert.equal(lines.at(-1), requalified.column.line);
});

test('jev no credential', async () => {
  const { root } = makeFixture();
  const bin = makeStubs();
  writeJevStub(bin, { version: 'jev 0.6.2', status: [{ exit: 3 }], model: 'stub-model', noul: [] });
  const labels = path.join(tempDir('jev-labels'), 'labels.jsonl');
  S.writeJsonl(labels, Array.from({ length: 99 }, (_, n) => ({ id: `r${String(n + 1).padStart(3, '0')}`, label: 'clean', labeler: 'fixture' })));
  const outDir = path.join(tempDir('jev-no-cred'), 'run');
  const run = await runMainWithStubs(['--labels', labels, '--jev', '--out', outDir], { root, bin });
  assert.equal(run.code, 0, run.errs.join('\n'));
  assert.ok(run.lines.includes('stop: fewer than 100 labeled rows'));
  assert.ok(run.lines.includes(`jev: path=${path.join(bin, 'jev')} provider=official`));
  assert.ok(run.lines.includes('jev arm skipped: no credential'));
  assert.ok(!run.lines.some((line) => line.startsWith('verdict ')));
  assert.equal(fs.existsSync(outDir), false);
  assert.deepEqual(stubLog(bin, 'jev'), [['--version'], ['auth', 'status', '--provider', 'official']]);
});

test('jev one provider', async () => {
  const bin = makeStubs();
  const plan = smallPlan(1, 0);
  writeJevStub(bin, {
    version: 'jev 0.6.2',
    status: [{ exit: 0 }],
    model: 'stub-model',
    noul: [{ exit: 0, probabilities: planProbabilities(plan) }]
  });
  const lines = [];
  const out = (line) => lines.push(line);
  const env = stubEnv(bin);
  const gate = S.jevGate({ out, env, timeoutMs: 20000 });
  assert.equal(gate.passed, true);
  const outDir = tempDir('jev-provider-out');
  const result = await S.runJevArm(plan, gate, { out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(outDir), stored: null });
  assert.equal(result.column.M, 1);
  const noulCalls = stubLog(bin, 'jev').filter((args) => args[0] === 'noul');
  assert.equal(noulCalls.length, 3);
  for (const args of stubLog(bin, 'jev').filter((args) => args[0] !== '--version')) {
    assert.equal(args.filter((arg) => arg === '--provider').length, 1);
    assert.equal(args[args.indexOf('--provider') + 1], 'official');
  }
});

test('jev exit 3 after gate', async () => {
  const bin = makeStubs();
  const plan = smallPlan(1, 0);
  writeJevStub(bin, {
    version: 'jev 0.6.2',
    status: [{ exit: 0 }],
    model: 'stub-model',
    noul: [{ exit: 3 }]
  });
  const lines = [];
  const out = (line) => lines.push(line);
  const env = stubEnv(bin);
  const gate = S.jevGate({ out, env, timeoutMs: 20000 });
  const outDir = tempDir('jev-key-out');
  const result = await S.runJevArm(plan, gate, { out, env, timeoutMs: 20000, backoffMs: 1, callLog: S.createCallLog(outDir), stored: null });
  assert.deepEqual(result, { stopped: 'jev arm stopped: key rejected', partialRows: 0 });
  assert.deepEqual(lines.slice(-2), ['jev arm stopped: key rejected', 'jev: partial rows=0']);
  assert.ok(!lines.some((line) => line.startsWith('verdict ')));
});
