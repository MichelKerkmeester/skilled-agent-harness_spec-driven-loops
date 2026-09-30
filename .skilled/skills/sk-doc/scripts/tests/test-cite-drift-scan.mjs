#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Citation Drift Scan Tests
// ───────────────────────────────────────────────────────────────────
// Fixture repositories in the OS temp directory with stub jev and cli-deem
// binaries first on PATH; no test reaches a real backend.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { buildCensus, decideVerdict, extractCitations, flagByIdentifierOverlap, headCommit, identifierTokens, INSTRUCTION, jevGate, KEEP_RULE_LINE, labelCounts, listTrackedFiles, main, MARGIN_LINE, parseLabels, resolveCitation, runJevArm, sha256Hex, verdictLine } from '../../shared/scripts/cite-drift-scan.mjs';

const ALPHA_DOC = '.skilled/skills/alpha-skill/SKILL.md';
const ALPHA_SKILL_ROOT = '.skilled/skills/alpha-skill';

// A fixture must not inherit the caller's git redirectors or backend endpoints.
function cleanEnv() {
  const env = { ...process.env };
  for (const key of [
    'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
    'JEV_PROVIDER', 'CLI_DEEM_URL',
  ]) {
    delete env[key];
  }
  return env;
}

// The caller's global excludes, attributes and hooks must not shape a fixture.
const GIT_CONFIG = [
  '-c', 'user.email=fixture@example.com',
  '-c', 'user.name=fixture',
  '-c', 'commit.gpgsign=false',
  '-c', 'core.hooksPath=/dev/null',
  '-c', 'core.excludesFile=/dev/null',
  '-c', 'core.attributesFile=/dev/null',
];

const runGit = (root, ...args) =>
  execFileSync('git', ['-C', root, ...GIT_CONFIG, ...args], {
    env: cleanEnv(),
    stdio: 'pipe',
    maxBuffer: 268435456,
  });

// Ten numbered lines: a cited line fits and a line past the end does not.
const TEN_LINES = Array.from({ length: 10 }, (_, index) => `line ${index + 1}\n`).join('');

// Test double for the stub jev and cli-deem binaries: it logs one line per call
// and answers the Deem health shape and both noul shapes.
function stubMain() {
  const fs = require('node:fs');
  const path = require('node:path');
  const name = path.basename(process.argv[1]);
  const args = process.argv.slice(2);
  const env = process.env;
  const logPath = env.STUB_LOG;
  const prior = logPath && fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8').split('\n') : [];
  if (logPath) fs.appendFileSync(logPath, `${name}\t${args.join(' ')}\n`);

  if (name === 'cli-deem' && args[0] === 'health') {
    if (env.STUB_DEEM_HEALTH === 'stub') {
      process.stderr.write('{"ok":false,"error":"refused backend: ensemble:stub"}\n');
      process.exit(3);
    }
    // A second health check answers with another pair when the test asks for
    // one, as a server that loaded new weights between calls would.
    const recheck = prior.filter((line) => line.startsWith('cli-deem\thealth')).length > 0;
    const modelCommit = recheck && env.STUB_DEEM_RECHECK_COMMIT ? env.STUB_DEEM_RECHECK_COMMIT : 'stubmodel';
    const sourceCommit = recheck && env.STUB_DEEM_RECHECK_SOURCE ? env.STUB_DEEM_RECHECK_SOURCE : 'stubsource';
    process.stdout.write(`${JSON.stringify({ ok: true, backend: 'torch', model: 'deem-0.8-v1', model_commit: modelCommit, source_commit: sourceCommit })}\n`);
  } else if (name === 'cli-deem' && args[0] === 'noul') {
    if (env.STUB_DEEM_NOUL_EXIT) process.exit(Number(env.STUB_DEEM_NOUL_EXIT));
    process.stdout.write('{"model":"deem-0.8-v1","answers":{"answer":{"noul":0.9}}}\n');
  } else if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (name === 'jev' && args[0] === 'noul') {
    if (env.STUB_JEV_NOUL_EXIT) process.exit(Number(env.STUB_JEV_NOUL_EXIT));
    process.stdout.write('{"model":"stub-model","answers":{"answer":{"noul":0.9}}}\n');
  } else {
    process.exit(2);
  }
}

const STUB_SOURCE = `#!/usr/bin/env node\n(${stubMain.toString()})();\n`;

/**
 * Fixture repository: two skill folders, their committed documents and targets,
 * stub binaries on their own PATH entry, a live-window citation in the alpha
 * skill document, and one optional dead or refused citation line ahead of it.
 * Each option selects one dead or refused case.
 * @param {{ deadMissing?: boolean, deadPastEnd?: boolean, dotEnv?: boolean, refusedUntracked?: boolean }} [options]
 */
const makeFixture = ({ deadMissing = false, deadPastEnd = false, dotEnv = false, refusedUntracked = false } = {}) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-drift-test-'));
  const alphaLines = ['# Alpha skill'];
  if (deadMissing) alphaLines.push('The tracked target `gone/target.ts:1` is absent from the worktree.');
  if (deadPastEnd) alphaLines.push('A line past the end: `src/inside.ts:999`.');
  if (dotEnv) alphaLines.push('A credential path `config/.env.md:1` is never opened.');
  if (refusedUntracked) alphaLines.push('An untracked path `src/untracked.ts:1` is not in the index.');
  alphaLines.push('The live window `src/inside.ts:3` still holds.');
  alphaLines.push('Example:', '```', 'Fenced `src/inside.ts:1` is not prose.', '```');

  const files = {
    [ALPHA_DOC]: `${alphaLines.join('\n')}\n`,
    '.skilled/skills/beta-skill/SKILL.md': '# Beta skill\nAnother shared document.\n',
    '.skilled/skills/alpha-skill/docs/note.md': 'The note sits beside its target.\n',
    '.skilled/skills/alpha-skill/docs/src/dup.ts': 'export const beside = 1;\n',
    '.skilled/skills/alpha-skill/gone/target.ts': 'export const gone = 1;\n',
    'src/dup.ts': 'export const root = 1;\n',
    'src/inside.ts': TEN_LINES,
    'a/amb.ts': 'export const a = 1;\n',
    'b/amb.ts': 'export const b = 1;\n',
  };
  for (const [rel, text] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }

  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin);
  for (const name of ['cli-deem', 'jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });

  runGit(root, 'init', '-q');
  runGit(root, 'add', '-A');
  runGit(root, 'commit', '-q', '-m', 'fixture');
  return { root, bin };
};

const cleanup = (root) => fs.rmSync(root, { recursive: true, force: true });

// The first citation of the committed alpha skill document.
const alphaCitation = (root) =>
  extractCitations(fs.readFileSync(path.join(root, ALPHA_DOC), 'utf8'), ALPHA_DOC)[0];

const runMain = async (repoRoot) => {
  const lines = [];
  const errors = [];
  const code = await main([], { repoRoot, out: (line) => lines.push(line), err: (line) => errors.push(line) });
  return { code, lines, errors };
};

// A draw needs more committed in-range citations than the resolution cases:
// 20 live rows plus 20 constructed windows over files long enough that the
// 60-line offset still lands clear of the cited line.
const makeDrawFixture = () => {
  const { root } = makeFixture();
  const docLines = (label) => {
    const lines = [`# ${label} draw`];
    for (let index = 0; index < 30; index += 1) {
      lines.push(`Claim ${index + 1} reads \`big/${label}-target.ts:${index * 6 + 5}\`.`);
    }
    return `${lines.join('\n')}\n`;
  };
  const targetLines = (label) =>
    Array.from({ length: 200 }, (_, index) => `${label} line ${index + 1}\n`).join('');
  const files = {
    '.skilled/skills/alpha-skill/draw.md': docLines('alpha'),
    '.skilled/skills/beta-skill/draw.md': docLines('beta'),
    '.skilled/skills/alpha-skill/big/alpha-target.ts': targetLines('alpha'),
    '.skilled/skills/beta-skill/big/beta-target.ts': targetLines('beta'),
  };
  for (const [rel, text] of Object.entries(files)) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }
  runGit(root, 'add', '-A');
  runGit(root, 'commit', '-q', '-m', 'draw fixture');
  return root;
};

test('extract prose', () => {
  const citations = extractCitations('The window at `src/a.ts:12` is claimed live.\n', 'docs/note.md');
  assert.deepEqual(citations, [{
    doc: 'docs/note.md',
    line: 1,
    sentence: 'The window at `src/a.ts:12` is claimed live.',
    target: 'src/a.ts',
    targetLine: 12,
    targetLineEnd: null,
  }]);
});

test('extract fenced skip', () => {
  const prose = 'The window at `src/a.ts:12` is claimed live.';
  assert.deepEqual(extractCitations(`\`\`\`\n${prose}\n\`\`\`\n`, 'docs/note.md'), []);
  assert.deepEqual(extractCitations(`~~~\n${prose}\n~~~\n`, 'docs/note.md'), []);
});

test('resolve order', () => {
  const { root } = makeFixture();
  try {
    const tracked = listTrackedFiles(root);
    const citation = {
      doc: `${ALPHA_SKILL_ROOT}/docs/note.md`,
      line: 1,
      sentence: 'The note sits beside its target.',
      target: 'src/dup.ts',
      targetLine: 1,
      targetLineEnd: null,
    };
    const resolved = resolveCitation(citation, { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
    assert.equal(resolved.status, 'in_range');
    assert.equal(resolved.path, `${ALPHA_SKILL_ROOT}/docs/src/dup.ts`);
  } finally {
    cleanup(root);
  }
});

test('resolve ambiguous basename', () => {
  const { root } = makeFixture();
  try {
    const tracked = listTrackedFiles(root);
    const citation = {
      doc: `${ALPHA_SKILL_ROOT}/docs/note.md`,
      line: 1,
      sentence: 'One of two files shares the name.',
      target: 'amb.ts',
      targetLine: 1,
      targetLineEnd: null,
    };
    const resolved = resolveCitation(citation, { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
    assert.equal(resolved.status, 'ambiguous');
    assert.equal(resolved.path, null);
  } finally {
    cleanup(root);
  }
});

test('resolve unresolved', () => {
  const { root } = makeFixture();
  try {
    const tracked = listTrackedFiles(root);
    const citation = {
      doc: `${ALPHA_SKILL_ROOT}/docs/note.md`,
      line: 1,
      sentence: 'No candidate holds this path.',
      target: 'nowhere/missing.ts',
      targetLine: 1,
      targetLineEnd: null,
    };
    const resolved = resolveCitation(citation, { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
    assert.equal(resolved.status, 'unresolved');
    assert.equal(resolved.path, null);
  } finally {
    cleanup(root);
  }
});

test('dead missing target', async () => {
  const { root } = makeFixture({ deadMissing: true });
  try {
    fs.rmSync(path.join(root, `${ALPHA_SKILL_ROOT}/gone/target.ts`));
    const tracked = listTrackedFiles(root);
    assert.ok(tracked.has(`${ALPHA_SKILL_ROOT}/gone/target.ts`));
    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
    assert.equal(resolved.status, 'missing');
    const run = await runMain(root);
    assert.equal(run.code, 0);
    assert.deepEqual(run.lines.filter((line) => line.startsWith('cite dead: ')), [
      `cite dead: ${ALPHA_DOC}:2 -> gone/target.ts:1`,
    ]);
  } finally {
    cleanup(root);
  }
});

test('dead past end', async () => {
  const { root } = makeFixture({ deadPastEnd: true });
  try {
    const tracked = listTrackedFiles(root);
    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
    assert.equal(resolved.status, 'past_end');
    assert.equal(resolved.endLine, 999);
    const run = await runMain(root);
    assert.equal(run.code, 0);
    assert.deepEqual(run.lines.filter((line) => line.startsWith('cite dead: ')), [
      `cite dead: ${ALPHA_DOC}:2 -> src/inside.ts:999`,
    ]);
  } finally {
    cleanup(root);
  }
});

test('refused .env', () => {
  const { root } = makeFixture({ dotEnv: true });
  try {
    const envFile = path.join(root, `${ALPHA_SKILL_ROOT}/config/.env.md`);
    fs.mkdirSync(path.dirname(envFile), { recursive: true });
    fs.writeFileSync(envFile, 'example=1\n');
    const tracked = listTrackedFiles(root);
    assert.ok(!tracked.has(`${ALPHA_SKILL_ROOT}/config/.env.md`));
    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
    assert.equal(resolved.status, 'refused');
    assert.equal(resolved.path, null);
  } finally {
    cleanup(root);
  }
});

test('refused untracked', async () => {
  const { root } = makeFixture({ refusedUntracked: true });
  try {
    fs.writeFileSync(path.join(root, 'src/untracked.ts'), 'export const untracked = 1;\n');
    const tracked = listTrackedFiles(root);
    assert.ok(!tracked.has('src/untracked.ts'));
    const resolved = resolveCitation(alphaCitation(root), { tracked, repoRoot: root, skillRoot: ALPHA_SKILL_ROOT });
    assert.equal(resolved.status, 'refused');
    assert.equal(resolved.path, null);
    const census = buildCensus(root, tracked);
    assert.equal(census.refused, 1);
    const run = await runMain(root);
    assert.equal(run.code, 0);
    assert.match(run.lines.find((line) => line.startsWith('citations=')), /refused=1 dead=/);
  } finally {
    cleanup(root);
  }
});

test('draw reproducible', async () => {
  const root = makeDrawFixture();
  const first = path.join(os.tmpdir(), `cite-drift-draw-${process.pid}-a.jsonl`);
  const second = path.join(os.tmpdir(), `cite-drift-draw-${process.pid}-b.jsonl`);
  try {
    const draw = async (labelsPath) => {
      const lines = [];
      const errors = [];
      const code = await main(['--draw', '--seed', '1', '--labels', labelsPath], {
        repoRoot: root,
        out: (line) => lines.push(line),
        err: (line) => errors.push(line),
      });
      return { code, lines, errors };
    };
    const runA = await draw(first);
    const runB = await draw(second);
    assert.equal(runA.code, 0);
    assert.equal(runB.code, 0);
    assert.deepEqual(runA.errors, []);
    assert.deepEqual(runB.errors, []);

    const textA = fs.readFileSync(first, 'utf8');
    const textB = fs.readFileSync(second, 'utf8');
    assert.equal(textA, textB);

    const commit = headCommit(root);
    assert.deepEqual(runA.lines, [
      `draw: path=${first} seed=1 commit=${commit.slice(0, 12)} rows=40 live=20 constructed=20`,
    ]);

    const rows = parseLabels(textA);
    assert.equal(rows.length, 40);
    assert.deepEqual(labelCounts(rows), { labeled: 20, live: 20, constructed: 20 });

    // No row carries the window text itself: the field set is the whole row.
    const fields = ['id', 'doc', 'doc_line', 'target', 'target_line', 'window_start', 'window_end', 'commit', 'claim_sha12', 'window_sha12', 'kind', 'verdict', 'labeler'];
    for (const row of rows) {
      assert.deepEqual(Object.keys(row).sort(), [...fields].sort());
      assert.equal(row.commit, commit);
      if (row.kind === 'live') {
        assert.equal(row.verdict, null);
        assert.equal(row.labeler, null);
        assert.ok(row.window_start <= row.target_line && row.target_line <= row.window_end);
      } else {
        assert.equal(row.verdict, 'contradicts');
        assert.equal(row.labeler, 'construction');
        assert.ok(row.target_line < row.window_start || row.target_line > row.window_end);
      }
    }
  } finally {
    cleanup(root);
    fs.rmSync(first, { force: true });
    fs.rmSync(second, { force: true });
  }
});

test('draw refuses labels', async () => {
  const { root } = makeFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-draw-refuse-${process.pid}.jsonl`);
  try {
    const operatorRow = {
      id: 'live-01',
      doc: ALPHA_DOC,
      doc_line: 2,
      target: 'src/inside.ts',
      target_line: 3,
      window_start: 1,
      window_end: 10,
      commit: '0'.repeat(40),
      claim_sha12: '0'.repeat(12),
      window_sha12: '0'.repeat(12),
      kind: 'live',
      verdict: 'supports',
      labeler: 'operator',
    };
    fs.writeFileSync(labelsPath, `${JSON.stringify(operatorRow)}\n`);
    const before = fs.readFileSync(labelsPath, 'utf8');
    const lines = [];
    const errors = [];
    const code = await main(['--draw', '--seed', '1', '--labels', labelsPath], {
      repoRoot: root,
      out: (line) => lines.push(line),
      err: (line) => errors.push(line),
    });
    assert.equal(code, 2);
    assert.deepEqual(errors, [`draw: refusing to overwrite ${labelsPath}, operator labels present`]);
    assert.equal(fs.readFileSync(labelsPath, 'utf8'), before);
    assert.deepEqual(lines, []);
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

const GATE_DOC = '.skilled/skills/alpha-skill/labels.md';
const GATE_TARGET = 'src/window.ts';

// A gate fixture whose doc places a row on either side of the comparator: one
// sentence names a token the window shows, one names a token it lacks, and one
// names no token at all.
const makeGateFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-drift-gate-'));
  const targetText = Array.from({ length: 40 }, (_, index) =>
    (index === 0 ? 'export function resolves() {}\n' : `window line ${index + 1}\n`)).join('');
  const docText = [
    '# Labels',
    'The function `resolves` still sits here.',
    'The function `vanished` is gone.',
    'A plain sentence carries no code token.',
    '',
  ].join('\n');
  for (const [rel, text] of [[GATE_DOC, docText], [GATE_TARGET, targetText]]) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }
  runGit(root, 'init', '-q');
  runGit(root, 'add', '-A');
  runGit(root, 'commit', '-q', '-m', 'gate fixture');
  return { root, commit: headCommit(root) };
};

const gateRow = (commit, id, docLine, verdict) => ({
  id,
  doc: GATE_DOC,
  doc_line: docLine,
  target: GATE_TARGET,
  target_line: docLine,
  window_start: 1,
  window_end: 40,
  commit,
  claim_sha12: '0'.repeat(12),
  window_sha12: '0'.repeat(12),
  kind: verdict === 'supports' ? 'live' : 'constructed',
  verdict,
  labeler: verdict === 'supports' ? 'operator' : 'construction',
});

// Clean rows cite the sentence whose token the window shows and drifted rows
// cite the sentence with no token, so flag-nothing and identifier overlap are
// right on exactly the clean rows and flag-nothing wins the baseline tie.
const gateRows = (commit, clean, drifted) => [
  ...Array.from({ length: clean }, (_, index) => gateRow(commit, `clean-${index + 1}`, 2, 'supports')),
  ...Array.from({ length: drifted }, (_, index) => gateRow(commit, `drift-${index + 1}`, 4, 'partial')),
];

const writeGateLabels = (labelsPath, rows) =>
  fs.writeFileSync(labelsPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`);

const runGate = async (repoRoot, labelsPath) => {
  const lines = [];
  const errors = [];
  const code = await main(['--labels', labelsPath], { repoRoot, out: (line) => lines.push(line), err: (line) => errors.push(line) });
  return { code, lines, errors };
};

test('comparator flags', () => {
  const sentence = 'The function `vanished` is gone.';
  assert.deepEqual(identifierTokens(sentence, GATE_TARGET), ['vanished']);
  assert.equal(flagByIdentifierOverlap(sentence, 'export function resolves() {}', GATE_TARGET), true);
});

test('comparator no token', () => {
  const sentence = 'A plain sentence carries no code token.';
  assert.deepEqual(identifierTokens(sentence, GATE_TARGET), []);
  assert.equal(flagByIdentifierOverlap(sentence, 'window line 1', GATE_TARGET), false);
  // The target's own basename is not a token, so naming the file itself never
  // flags the row on that name.
  assert.deepEqual(identifierTokens('Read `src/window:4` for the data.', 'src/window'), ['src']);
});

test('comparator token present', () => {
  const sentence = 'The function `resolves` still sits here.';
  assert.deepEqual(identifierTokens(sentence, GATE_TARGET), ['resolves']);
  assert.equal(flagByIdentifierOverlap(sentence, 'export function resolves() {}', GATE_TARGET), false);
});

test('label gate 39', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-gate-39-${process.pid}.jsonl`);
  try {
    writeGateLabels(labelsPath, gateRows(commit, 20, 19));
    const run = await runGate(root, labelsPath);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.equal(run.lines.at(-1), 'stop: fewer than 40 labeled rows');
    assert.ok(run.lines.includes(MARGIN_LINE));
    assert.ok(run.lines.includes(KEEP_RULE_LINE));
    assert.ok(!run.lines.some((line) => line.startsWith('comparator ')));
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('instruction printed', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-instruction-${process.pid}.jsonl`);
  try {
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const run = await runGate(root, labelsPath);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.deepEqual(run.lines.filter((line) => line.startsWith('instruction: ')), [
      `instruction: "${INSTRUCTION}" sha256=${sha256Hex(INSTRUCTION)}`,
    ]);
    assert.ok(run.lines.includes('comparator flag-nothing: 30/40 = 0.7500'));
    assert.ok(run.lines.includes('comparator identifier-overlap: 30/40 = 0.7500'));
    assert.ok(run.lines.includes('baseline method: flag-nothing'));
    assert.ok(run.lines.includes('headroom: baseline=0.7500 margin=0.10'));
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('no headroom', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-no-headroom-${process.pid}.jsonl`);
  try {
    writeGateLabels(labelsPath, gateRows(commit, 38, 2));
    const run = await runGate(root, labelsPath);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.ok(run.lines.includes('comparator flag-nothing: 38/40 = 0.9500'));
    assert.equal(run.lines.at(-1), 'no headroom');
    assert.ok(!run.lines.some((line) => line.startsWith('instruction: ')));
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('underpowered', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-underpowered-${process.pid}.jsonl`);
  try {
    writeGateLabels(labelsPath, gateRows(commit, 36, 4));
    const run = await runGate(root, labelsPath);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.ok(run.lines.includes('comparator flag-nothing: 36/40 = 0.9000'));
    assert.ok(run.lines.includes('headroom: baseline=0.9000 margin=0.10'));
    assert.equal(run.lines.at(-1), 'underpowered: winnable=4');
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('default zero calls', async () => {
  const { root, bin } = makeFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-default-${process.pid}.jsonl`);
  const logPath = path.join(os.tmpdir(), `cite-drift-default-stub-${process.pid}.log`);
  const previousPath = process.env.PATH;
  const previousLog = process.env.STUB_LOG;
  try {
    process.env.PATH = `${bin}${path.delimiter}${previousPath ?? ''}`;
    process.env.STUB_LOG = logPath;
    const run = await runGate(root, labelsPath);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.ok(run.lines.some((line) => line.startsWith('citations=')));
    assert.equal(run.lines.at(-1), 'stop: fewer than 40 labeled rows');
    assert.ok(!fs.existsSync(labelsPath));
    assert.ok(!fs.existsSync(logPath));
    assert.equal(runGit(root, 'status', '--porcelain').toString(), '');
  } finally {
    if (previousPath === undefined) delete process.env.PATH; else process.env.PATH = previousPath;
    if (previousLog === undefined) delete process.env.STUB_LOG; else process.env.STUB_LOG = previousLog;
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
    fs.rmSync(logPath, { force: true });
  }
});

test('verdict keep', () => {
  const counts = { backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'keep');
  const line = verdictLine({ ...counts, ...decision }, 'abc123abc123', 'model=deem-0.8-v1 model_commit=aaa source_commit=bbb');
  assert.ok(line.startsWith('verdict deem: keep K=20 M=20 A=140 B=60 W=20 L=0 TP=20 FP=0 F=n/a p='));
  assert.ok(line.endsWith('labels_sha256=abc123abc123 model=deem-0.8-v1 model_commit=aaa source_commit=bbb'));
});

test('verdict kill precision', () => {
  const counts = { backend: 'deem', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 1, FP: 4, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'kill (precision)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict deem: kill (precision) '));
});

test('verdict stop coverage', () => {
  const counts = { backend: 'deem', K: 10, M: 8, A: 70, B: 30, W: 8, L: 0, TP: 8, FP: 0, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'stop (coverage)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict deem: stop (coverage) '));
});

test('verdict stop margin', () => {
  const counts = { backend: 'deem', K: 20, M: 20, A: 60, B: 60, W: 0, L: 0, TP: 20, FP: 0, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'stop (margin)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict deem: stop (margin) '));
});

test('verdict requalify', () => {
  const stored = { columns: { deem: { modelCommit: 'aaa000000000', sourceCommit: 'bbb000000000' } } };
  const summary = {
    backend: 'deem', verdict: 'keep', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0, p: 0.5,
    model: 'deem-0.8-v1', modelCommit: 'ccc111111111', sourceCommit: 'bbb000000000', stored,
  };
  const lines = verdictLine(summary, 'abc123abc123', 'model=deem-0.8-v1 model_commit=ccc111111111 source_commit=bbb000000000').split('\n');
  assert.equal(lines[0], 'requalify: model commit changed');
  assert.ok(lines[1].startsWith('verdict deem: keep '));

  const jevSummary = {
    backend: 'jev', verdict: 'keep', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0, p: 0.5,
    provider: 'official', model: 'gpt-x', stored: { columns: { jev: { provider: 'other', model: 'gpt-x' } } },
  };
  const jevLines = verdictLine(jevSummary, 'abc123abc123', 'jev_version=0.6.2 provider=official model=gpt-x').split('\n');
  assert.equal(jevLines[0], 'requalify: model changed');
  assert.ok(jevLines[1].startsWith('verdict jev: keep '));
});

// The gate fixture holds no stub binaries, so a run that must answer the Deem
// protocol gets them on its own PATH entry.
const addStubBin = (root) => {
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin, { recursive: true });
  for (const name of ['cli-deem', 'jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });
  return bin;
};

const deemEnv = (root, extra = {}) => ({
  ...cleanEnv(),
  PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH ?? ''}`,
  STUB_LOG: path.join(root, 'stub.log'),
  ...extra,
});

const readStubLog = (root) => {
  const logPath = path.join(root, 'stub.log');
  if (!fs.existsSync(logPath)) return [];
  return fs.readFileSync(logPath, 'utf8').split('\n').filter((line) => line.length > 0);
};

const runWithEnv = async (argv, repoRoot, env) => {
  const lines = [];
  const errors = [];
  const code = await main(argv, { repoRoot, out: (line) => lines.push(line), err: (line) => errors.push(line), env });
  return { code, lines, errors };
};

test('deem gate pass', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-deem-gate-${process.pid}.jsonl`);
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = deemEnv(root);
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const base = await runGate(root, labelsPath);
    const run = await runWithEnv(['--labels', labelsPath, '--deem', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.deepEqual(run.lines.slice(0, base.lines.length), base.lines);
    assert.equal(run.lines[base.lines.length], 'deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource');
    assert.ok(run.lines.includes('deem: nothing leaves the machine; planned calls: 40; estimated wall time: 2.4 s at 60.5 ms per call, the noul p50 in deem-local.md'));
    assert.ok(run.lines.some((line) => line.startsWith('column deem: rows=40 measured=40 unmeasured=0 latency_p50_ms=')));
    assert.ok(run.lines.includes('brier deem: 0.2100'));
    assert.ok(run.lines.includes('flips: not applicable (deem noul)'));
    assert.ok(run.lines.some((line) => line.startsWith('verdict deem: kill (precision) K=40 M=40 A=30 B=30 W=0 L=0 TP=0 FP=0 F=n/a p=')));

    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(calls.length, 40);
    for (const call of calls) {
      assert.deepEqual(Object.keys(call).sort(), ['backend', 'exitCode', 'flag', 'modelCommit', 'modelId', 'probability', 'rerun', 'rowId', 'sourceCommit', 'status', 'wallMs']);
      assert.equal(call.backend, 'deem');
      assert.equal(call.status, 'measured');
      assert.equal(call.exitCode, 0);
      assert.equal(call.probability, 0.9);
      assert.equal(call.flag, false);
      assert.equal(call.modelId, 'deem-0.8-v1');
      assert.equal(call.modelCommit, 'stubmodel');
      assert.equal(call.sourceCommit, 'stubsource');
    }

    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.deepEqual(Object.keys(report).sort(), [
      'baselineMethod', 'census', 'columns', 'commit', 'comparators', 'headroom',
      'keepRule', 'labels', 'margin', 'skipped', 'stopped', 'winnable',
    ]);
    assert.deepEqual(Object.keys(report.labels).sort(), ['labeled', 'path', 'rows', 'sha256']);
    assert.equal(report.labels.path, labelsPath);
    assert.equal(report.labels.rows, 40);
    assert.equal(report.labels.labeled, 40);
    assert.equal(report.commit, commit);
    assert.equal(report.baselineMethod, 'flag-nothing');
    assert.equal(report.headroom, true);
    assert.equal(report.winnable, 10);
    assert.ok(report.columns.deem.line.startsWith('verdict deem: '));
    assert.deepEqual(report.stopped, {});
    assert.deepEqual(report.skipped, {});

    const log = readStubLog(root);
    assert.equal(log.filter((line) => line.startsWith('cli-deem\thealth')).length, 1);
    assert.equal(log.filter((line) => line.startsWith('cli-deem\tnoul')).length, 40);
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('deem stub backend', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-deem-stub-${process.pid}.jsonl`);
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = deemEnv(root, { STUB_DEEM_HEALTH: 'stub' });
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const base = await runGate(root, labelsPath);
    const run = await runWithEnv(['--labels', labelsPath, '--deem', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.deepEqual(run.lines, [...base.lines, 'deem arm skipped: stub backend']);
    assert.equal(readStubLog(root).length, 1);

    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.equal(report.skipped.deem, 'deem arm skipped: stub backend');
    assert.deepEqual(report.columns, {});
    assert.deepEqual(report.stopped, {});
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('deem exit 4 changed pair', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-deem-exit4-${process.pid}.jsonl`);
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = deemEnv(root, {
      STUB_DEEM_NOUL_EXIT: '4',
      STUB_DEEM_RECHECK_COMMIT: 'stubmodel2',
      STUB_DEEM_RECHECK_SOURCE: 'stubsource2',
    });
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const run = await runWithEnv(['--labels', labelsPath, '--deem', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.ok(run.lines.includes('deem arm stopped: model commit changed mid-run'));
    assert.ok(run.lines.includes('deem: partial rows=0'));
    assert.ok(!run.lines.some((line) => line.startsWith('verdict deem:')));

    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(calls.length, 1);
    assert.equal(calls[0].exitCode, 4);
    assert.equal(calls[0].status, 'unmeasured');
    assert.equal(calls[0].modelCommit, 'stubmodel');

    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.deepEqual(report.stopped.deem, { line: 'deem arm stopped: model commit changed mid-run', partialRows: 0 });
    assert.deepEqual(report.columns, {});
    assert.equal(readStubLog(root).filter((line) => line.startsWith('cli-deem\thealth')).length, 2);
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('--out required', async () => {
  const { root } = makeFixture();
  try {
    const env = deemEnv(root);
    const run = await runWithEnv(['--jev'], root, env);
    assert.equal(run.code, 2);
    assert.deepEqual(run.lines, []);
    assert.match(run.errors.join('\n'), /--out/);
    assert.ok(!fs.existsSync(path.join(root, 'stub.log')));
    assert.ok(!fs.existsSync(path.join(root, 'out')));
  } finally {
    cleanup(root);
  }
});

test('jev gate pass', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-jev-gate-${process.pid}.jsonl`);
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = deemEnv(root);
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const base = await runGate(root, labelsPath);
    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.deepEqual(run.lines.slice(0, base.lines.length), base.lines);

    const tail = run.lines.slice(base.lines.length);
    assert.equal(tail.length, 6);
    assert.equal(tail[0], `jev: path=${path.join(root, 'bin', 'jev')} provider=official`);
    assert.match(tail[1], /^jev: payload: committed skill-doc sentences and tracked-file windows; planned calls: 121; estimated input tokens: \d+$/);
    assert.equal(tail[2], 'jev: auth test provider=official model=stub-model');
    assert.ok(tail[3].startsWith('column jev: rows=40 measured=40 unmeasured=0 latency_p50_ms='));
    assert.ok(tail[3].includes(' latency_p95_ms='));
    assert.equal(tail[4], 'brier jev: 0.2100');
    assert.ok(tail[5].startsWith('verdict jev: kill (precision) K=40 M=40 A=30 B=30 W=0 L=0 TP=0 FP=0 F=0 p='));
    assert.ok(tail[5].endsWith('jev_version=0.6.2 provider=official model=stub-model'));

    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(calls.length, 121);
    assert.deepEqual(Object.keys(calls[0]).sort(), ['backend', 'exitCode', 'flag', 'jevVersion', 'model', 'probability', 'provider', 'rerun', 'rowId', 'status', 'wallMs']);
    for (const call of calls) {
      assert.equal(call.backend, 'jev');
      assert.equal(call.provider, 'official');
      assert.equal(call.model, 'stub-model');
      assert.equal(call.jevVersion, '0.6.2');
      assert.equal(call.exitCode, 0);
    }
    const authCalls = calls.filter((call) => call.rowId === null);
    assert.equal(authCalls.length, 1);
    assert.equal(authCalls[0].status, 'measured');
    const rowCalls = calls.filter((call) => call.rowId !== null);
    assert.equal(rowCalls.length, 120);
    for (const call of rowCalls) {
      assert.equal(call.status, 'measured');
      assert.equal(call.probability, 0.9);
      assert.equal(call.flag, false);
      assert.ok(call.rerun >= 0 && call.rerun < 3);
    }

    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.ok(report.columns.jev.line.startsWith('verdict jev: '));
    assert.deepEqual(report.stopped, {});
    assert.deepEqual(report.skipped, {});
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('jev no credential', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-jev-cred-${process.pid}.jsonl`);
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = deemEnv(root, { STUB_AUTH_STATUS_EXIT: '3' });
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const base = await runGate(root, labelsPath);
    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.deepEqual(run.lines, [
      ...base.lines,
      `jev: path=${path.join(root, 'bin', 'jev')} provider=official`,
      'jev arm skipped: no credential',
    ]);
    assert.deepEqual(readStubLog(root), [
      'jev\t--version',
      'jev\tauth status --provider official',
    ]);

    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.equal(report.skipped.jev, 'jev arm skipped: no credential');
    assert.deepEqual(report.columns, {});
    assert.deepEqual(report.stopped, {});
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('jev one provider', async () => {
  const { root, commit } = makeGateFixture();
  try {
    addStubBin(root);
    const env = deemEnv(root);
    const gate = jevGate({ out: () => {}, env, timeoutMs: 90000 });
    assert.equal(gate.passed, true);
    assert.equal(gate.provider, 'official');
    assert.equal(gate.path, path.join(root, 'bin', 'jev'));

    const row = gateRow(commit, 'live-1', 2, 'supports');
    const windows = new Map([[row.id, {
      sentence: 'The function `resolves` still sits here.',
      windowText: 'export function resolves() {}',
    }]]);
    const result = await runJevArm(
      { rows: [row], windows, labelsSha: 'abc123abc123' },
      gate,
      {
        out: () => {},
        env,
        timeoutMs: 90000,
        backoffMs: 1,
        callLog: { append() {} },
        stored: null,
      },
    );
    assert.equal(result.stopped, undefined);
    assert.ok(result.column.line.startsWith('verdict jev: kill (precision) K=1 M=1 A=1 B=1 W=0 L=0 TP=0 FP=0 F=0 p='));
    assert.ok(result.column.line.endsWith('labels_sha256=abc123abc123 jev_version=0.6.2 provider=official model=stub-model'));

    const log = readStubLog(root);
    const versionIndex = log.indexOf('jev\t--version');
    assert.ok(versionIndex >= 0);
    const calls = log.slice(versionIndex + 1).filter((line) => line.startsWith('jev\t'));
    assert.equal(calls.filter((line) => line.startsWith('jev\tnoul')).length, 3);
    for (const line of calls) {
      assert.ok(line.includes('--provider official'));
    }
  } finally {
    cleanup(root);
  }
});

test('jev exit 3 after gate', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-jev-exit3-${process.pid}.jsonl`);
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = deemEnv(root, { STUB_JEV_NOUL_EXIT: '3' });
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const base = await runGate(root, labelsPath);
    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    const tail = run.lines.slice(base.lines.length);
    assert.equal(tail[0], `jev: path=${path.join(root, 'bin', 'jev')} provider=official`);
    assert.match(tail[1], /^jev: payload: committed skill-doc sentences and tracked-file windows; planned calls: 121; estimated input tokens: \d+$/);
    assert.equal(tail[2], 'jev: auth test provider=official model=stub-model');
    assert.deepEqual(tail.slice(3), ['jev arm stopped: key rejected', 'jev: partial rows=0']);
    assert.ok(!run.lines.some((line) => line.startsWith('verdict jev:')));

    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(calls.length, 2);
    assert.equal(calls[0].rowId, null);
    assert.equal(calls[0].exitCode, 0);
    assert.equal(calls[1].rowId, 'clean-1');
    assert.equal(calls[1].exitCode, 3);
    assert.equal(calls[1].status, 'unmeasured');

    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.deepEqual(report.stopped.jev, { line: 'jev arm stopped: key rejected', partialRows: 0 });
    assert.deepEqual(report.columns, {});
    assert.equal(readStubLog(root).filter((line) => line.startsWith('jev\tnoul')).length, 1);
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

