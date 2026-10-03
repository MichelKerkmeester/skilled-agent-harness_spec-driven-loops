#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Citation Drift Scan Tests
// ───────────────────────────────────────────────────────────────────
// Fixture repositories in the OS temp directory with a stub jev binary first on
// PATH; no test reaches a real backend.

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
    'JEV_PROVIDER',
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

// Test double for the stub jev binary: it logs one line per call and answers
// the version, auth and noul shapes.
function stubMain() {
  const fs = require('node:fs');
  const path = require('node:path');
  const name = path.basename(process.argv[1]);
  const args = process.argv.slice(2);
  const env = process.env;
  const logPath = env.STUB_LOG;
  if (logPath) fs.appendFileSync(logPath, `${name}\t${args.join(' ')}\n`);

  if (name === 'jev' && args[0] === '--version') {
    process.stdout.write(`${env.STUB_JEV_VERSION || 'jev 0.6.2'}\n`);
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'status') {
    process.exit(Number(env.STUB_AUTH_STATUS_EXIT || 0));
  } else if (name === 'jev' && args[0] === 'auth' && args[1] === 'test') {
    process.stdout.write('{"ok":true,"model":"stub-model"}\n');
  } else if (name === 'jev' && args[0] === 'noul') {
    if (env.STUB_JEV_NOUL_EXIT) process.exit(Number(env.STUB_JEV_NOUL_EXIT));
    const inputLogPath = env.STUB_INPUT_LOG;
    if (inputLogPath) fs.appendFileSync(inputLogPath, `${fs.readFileSync(0, 'utf8')}\n`);
    const priorCalls = logPath && fs.existsSync(logPath)
      ? fs.readFileSync(logPath, 'utf8').split('\n').filter((line) => line.startsWith('jev\tnoul ')).length - 1
      : 0;
    const sequence = (env.STUB_JEV_PROBABILITIES || '').split(',').filter(Boolean).map(Number);
    const probability = sequence.length === 0 ? 0.9 : sequence[Math.min(priorCalls, sequence.length - 1)];
    process.stdout.write(`{"model":"stub-model","answers":{"answer":{"noul":${probability}}}}\n`);
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
  for (const name of ['jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });

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
  const labelsPath = path.join(repoRoot, 'labels-not-present.jsonl');
  const code = await main(['--labels', labelsPath], { repoRoot, out: (line) => lines.push(line), err: (line) => errors.push(line) });
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
      const citation = `\`big/${label}-target.ts:${index * 6 + 5}\``;
      lines.push('', index === 0 ? `**Evidence**: ${citation}.` : `Claim ${index + 1} reads ${citation}.`);
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

const makeGitShowCounter = (root) => {
  const bin = path.join(root, 'git-counter-bin');
  const logPath = path.join(root, 'git-show-paths.log');
  const realGit = execFileSync('which', ['git'], { encoding: 'utf8' }).trim();
  fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, 'git'), [
    '#!/bin/sh',
    'if [ "$3" = "show" ]; then printf "%s\\n" "${4#*:}" >> "$CITE_GIT_SHOW_LOG"; fi',
    'exec "$CITE_REAL_GIT" "$@"',
    '',
  ].join('\n'), { mode: 0o755 });
  return { bin, logPath, realGit };
};

test('extract prose', () => {
  const citations = extractCitations('The window at `src/a.ts:12` is claimed live.\n', 'docs/note.md');
  assert.deepEqual(citations, [{
    doc: 'docs/note.md',
    line: 1,
    sentence: 'The window at `src/a.ts:12` is claimed live.',
    claim: 'The window at `src/a.ts:12` is claimed live.',
    target: 'src/a.ts',
    targetLine: 12,
    targetLineEnd: null,
  }]);
});

test('extract enclosing paragraph claim', () => {
  const text = [
    'The implementation keeps the result stable.',
    'The cited window at `src/a.ts:12` supports that statement.',
    'The next line adds its boundary.',
    '',
    'A separate paragraph follows.',
  ].join('\n');
  const [citation] = extractCitations(text, 'docs/note.md');
  assert.equal(citation.sentence, 'The cited window at `src/a.ts:12` supports that statement.');
  assert.equal(citation.claim, [
    'The implementation keeps the result stable.',
    'The cited window at `src/a.ts:12` supports that statement.',
    'The next line adds its boundary.',
  ].join('\n'));
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
    const fields = [
      'id', 'doc', 'doc_line', 'target', 'target_line', 'window_start', 'window_end',
      'commit', 'claim_unit', 'claim_sha12', 'window_sha12', 'kind', 'verdict', 'labeler',
    ];
    for (const row of rows) {
      assert.deepEqual(Object.keys(row).sort(), [...fields].sort());
      assert.equal(row.commit, commit);
      assert.equal(row.claim_unit, 'paragraph');
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

test('draw drops evidence-only citations and reuses committed reads', async () => {
  const root = makeDrawFixture();
  const labelsPath = path.join(root, 'labels.jsonl');
  const counter = makeGitShowCounter(root);
  const tracked = listTrackedFiles(root);
  const expectedPaths = new Set([
    ...[...tracked].filter((entry) => entry.startsWith('.skilled/skills/') && entry.endsWith('.md')),
    '.skilled/skills/alpha-skill/big/alpha-target.ts',
    '.skilled/skills/beta-skill/big/beta-target.ts',
  ]);
  const previousEnv = {
    path: process.env.PATH,
    realGit: process.env.CITE_REAL_GIT,
    showLog: process.env.CITE_GIT_SHOW_LOG,
  };
  try {
    process.env.PATH = `${counter.bin}${path.delimiter}${previousEnv.path ?? ''}`;
    process.env.CITE_REAL_GIT = counter.realGit;
    process.env.CITE_GIT_SHOW_LOG = counter.logPath;
    const lines = [];
    const errors = [];
    const code = await main(['--draw', '--seed', '1', '--labels', labelsPath], {
      repoRoot: root,
      out: (line) => lines.push(line),
      err: (line) => errors.push(line),
    });
    assert.equal(code, 0);
    assert.deepEqual(errors, []);

    const rows = parseLabels(fs.readFileSync(labelsPath, 'utf8'));
    assert.equal(rows.length, 40);
    assert.ok(rows.filter((row) => row.kind === 'live').every((row) => row.doc_line !== 3));
    const readPaths = fs.readFileSync(counter.logPath, 'utf8').trim().split('\n');
    assert.equal(readPaths.length, expectedPaths.size);
    assert.deepEqual([...readPaths].sort(), [...expectedPaths].sort());
  } finally {
    if (previousEnv.path === undefined) delete process.env.PATH; else process.env.PATH = previousEnv.path;
    if (previousEnv.realGit === undefined) delete process.env.CITE_REAL_GIT; else process.env.CITE_REAL_GIT = previousEnv.realGit;
    if (previousEnv.showLog === undefined) delete process.env.CITE_GIT_SHOW_LOG; else process.env.CITE_GIT_SHOW_LOG = previousEnv.showLog;
    cleanup(root);
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
const GATE_LEGACY_DOC = 'docs/legacy-labels.md';
const GATE_TARGET = 'src/window.ts';
const GATE_LEGACY_LINE = 'The function `resolves` at `src/window.ts:1` remains available.';
const GATE_CLAIMS = {
  clean: 'The function `resolves` still sits here.',
  drifted: 'A plain sentence carries no code token.',
};
const GATE_WINDOW_TEXT = Array.from({ length: 40 }, (_, index) =>
  index === 0 ? 'export function resolves() {}' : `window line ${index + 1}`).join('\n');

// A gate fixture whose doc places a row on either side of the comparator: one
// sentence names a token the window shows, one names a token it lacks, and one
// names no token at all.
const makeGateFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-drift-gate-'));
  const targetText = Array.from({ length: 40 }, (_, index) =>
    (index === 0 ? 'export function resolves() {}\n' : `window line ${index + 1}\n`)).join('');
  const docText = [
    '# Labels',
    GATE_CLAIMS.clean,
    '',
    GATE_CLAIMS.drifted,
    '',
  ].join('\n');
  const legacyDocText = [
    '# Legacy labels',
    'The paragraph opens with context.',
    GATE_LEGACY_LINE,
    'The paragraph closes with context.',
    '',
  ].join('\n');
  for (const [rel, text] of [
    [GATE_DOC, docText],
    [GATE_LEGACY_DOC, legacyDocText],
    [GATE_TARGET, targetText],
  ]) {
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
  claim_sha12: sha256Hex(docLine === 2 ? GATE_CLAIMS.clean : GATE_CLAIMS.drifted).slice(0, 12),
  window_sha12: sha256Hex(GATE_WINDOW_TEXT).slice(0, 12),
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
  const counts = { backend: 'jev', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'keep');
  const line = verdictLine({ ...counts, ...decision }, 'abc123abc123', 'jev_version=0.6.2 provider=official model=stub-model');
  assert.ok(line.startsWith('verdict jev: keep K=20 M=20 A=140 B=60 W=20 L=0 TP=20 FP=0 F=0 p='));
  assert.ok(line.endsWith('labels_sha256=abc123abc123 jev_version=0.6.2 provider=official model=stub-model'));
});

test('verdict kill precision', () => {
  const counts = { backend: 'jev', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 1, FP: 4, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'kill (precision)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict jev: kill (precision) '));
});

test('verdict stop coverage', () => {
  const counts = { backend: 'jev', K: 10, M: 8, A: 70, B: 30, W: 8, L: 0, TP: 8, FP: 0, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'stop (coverage)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict jev: stop (coverage) '));
});

test('verdict stop margin', () => {
  const counts = { backend: 'jev', K: 20, M: 20, A: 60, B: 60, W: 0, L: 0, TP: 20, FP: 0, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'stop (margin)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict jev: stop (margin) '));
});

test('verdict stop sign test', () => {
  const counts = { backend: 'jev', K: 20, M: 20, A: 10, B: 0, W: 1, L: 19, TP: 10, FP: 0, F: 0 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'stop (sign test)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict jev: stop (sign test) '));
});

test('verdict stop flips', () => {
  const counts = { backend: 'jev', K: 20, M: 20, A: 20, B: 0, W: 20, L: 0, TP: 20, FP: 0, F: 7 };
  const decision = decideVerdict(counts);
  assert.equal(decision.verdict, 'stop (flips)');
  assert.ok(verdictLine({ ...counts, ...decision }, 'abc123abc123', '').startsWith('verdict jev: stop (flips) '));
});

test('refuses tampered claim and window hashes before scoring', async () => {
  for (const [field, reason] of [
    ['claim_sha12', 'claim hash mismatch'],
    ['window_sha12', 'window hash mismatch'],
  ]) {
    const { root, commit } = makeGateFixture();
    const labelsPath = path.join(root, 'labels.jsonl');
    try {
      const rows = gateRows(commit, 30, 10);
      rows[0][field] = 'f'.repeat(12);
      writeGateLabels(labelsPath, rows);
      const run = await runGate(root, labelsPath);
      assert.equal(run.code, 2);
      assert.deepEqual(run.errors, [`labels row clean-1: ${reason}`]);
      assert.ok(!run.lines.some((line) => line.startsWith('comparator ')));
    } finally {
      cleanup(root);
    }
  }
});

test('verdict requalify', () => {
  const summary = {
    backend: 'jev', verdict: 'keep', K: 20, M: 20, A: 140, B: 60, W: 20, L: 0, TP: 20, FP: 0, F: 0, p: 0.5,
    provider: 'official', model: 'gpt-x', stored: { columns: { jev: { provider: 'other', model: 'gpt-x' } } },
  };
  const lines = verdictLine(summary, 'abc123abc123', 'jev_version=0.6.2 provider=official model=gpt-x').split('\n');
  assert.equal(lines[0], 'requalify: model changed');
  assert.ok(lines[1].startsWith('verdict jev: keep '));
});

test('verdict requalifies on instruction rule and row-set hashes', () => {
  const identity = {
    instructionSha256: 'new-instruction',
    keepRuleSha256: 'new-rule',
    rowSetSha256: 'new-rows',
  };
  const changes = [
    ['instructionSha256', 'requalify: instruction changed'],
    ['keepRuleSha256', 'requalify: keep rule changed'],
    ['rowSetSha256', 'requalify: row set changed'],
  ];
  for (const [field, notice] of changes) {
    const stored = {
      columns: { jev: { provider: 'official', model: 'stub-model' } },
      measurement: {
        instructionSha256: identity.instructionSha256,
        keepRuleSha256: identity.keepRuleSha256,
        rowSetSha256: identity.rowSetSha256,
        [field]: 'old-value',
      },
    };
    const summary = {
      backend: 'jev', verdict: 'keep', K: 20, M: 20, A: 20, B: 0, W: 20, L: 0,
      TP: 20, FP: 0, F: 0, p: 0.0001, provider: 'official', model: 'stub-model',
      stored, ...identity,
    };
    assert.equal(verdictLine(summary, 'abc123abc123').split('\n')[0], notice);
  }
});

// The gate fixture holds no stub binaries, so a run that must answer the
// backend protocol gets them on its own PATH entry.
const addStubBin = (root) => {
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin, { recursive: true });
  for (const name of ['jev']) fs.writeFileSync(path.join(bin, name), STUB_SOURCE, { mode: 0o755 });
  return bin;
};

const armEnv = (root, extra = {}) => ({
  ...cleanEnv(),
  PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH ?? ''}`,
  STUB_LOG: path.join(root, 'stub.log'),
  ...extra,
  JEV_TRANSPORT: 'jev',
});

const readStubLog = (root) => {
  const logPath = path.join(root, 'stub.log');
  if (!fs.existsSync(logPath)) return [];
  return fs.readFileSync(logPath, 'utf8').split('\n').filter((line) => line.length > 0);
};

const runWithEnv = async (argv, repoRoot, env) => {
  const lines = [];
  const errors = [];
  const code = await main(argv, {
    repoRoot,
    out: (line) => lines.push(line),
    err: (line) => errors.push(line),
    env: { ...env, JEV_TRANSPORT: 'jev' },
  });
  return { code, lines, errors };
};

test('--out required', async () => {
  const { root } = makeFixture();
  try {
    const env = armEnv(root);
    const run = await runWithEnv(['--jev'], root, env);
    assert.equal(run.code, 2);
    assert.deepEqual(run.lines, []);
    assert.deepEqual(run.errors, ['--jev needs --out <dir> so every call is recorded']);
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
    const env = armEnv(root);
    const rows = gateRows(commit, 30, 10);
    rows.push({ ...gateRow(commit, 'unlabeled-extra', 2, 'supports'), verdict: null });
    writeGateLabels(labelsPath, rows);
    const base = await runGate(root, labelsPath);
    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    assert.deepEqual(run.lines.slice(0, base.lines.length), base.lines);

    const tail = run.lines.slice(base.lines.length);
    assert.equal(tail.length, 9);
    assert.equal(tail[0], `jev: path=${path.join(root, 'bin', 'jev')} provider=official`);
    assert.match(tail[1], /^jev: payload: committed skill-doc claims and tracked-file windows; planned calls: 40 screening \+ up to 80 adaptive \+ 1 auth; estimated input tokens \(max\): \d+$/);
    assert.equal(tail[2], 'jev: auth test provider=official model=stub-model');
    assert.ok(tail[3].startsWith('column jev: rows=40 measured=40 unmeasured=0 latency_p50_ms='));
    assert.ok(tail[3].includes(' latency_p95_ms='));
    assert.equal(tail[4], 'column jev.live: rows=30 measured=30 unmeasured=0 A=30 B=30 W=0 L=0 TP=0 FP=0');
    assert.equal(tail[5], 'column jev.constructed: rows=10 measured=10 unmeasured=0 A=0 B=0 W=0 L=0 TP=0 FP=0');
    assert.equal(tail[6], 'sign test jev.live: W=0 L=0 p=1.000');
    assert.equal(tail[7], 'brier jev: 0.2100');
    assert.ok(tail[8].startsWith('verdict jev: kill (precision) K=40 M=40 A=30 B=30 W=0 L=0 TP=0 FP=0 F=0 p='));
    assert.ok(tail[8].endsWith('jev_version=0.6.2 provider=official model=stub-model'));

    const calls = fs.readFileSync(path.join(outDir, 'calls.jsonl'), 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.equal(calls.length, 41);
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
    assert.equal(rowCalls.length, 40);
    for (const call of rowCalls) {
      assert.equal(call.status, 'measured');
      assert.equal(call.probability, 0.9);
      assert.equal(call.flag, false);
      assert.equal(call.rerun, 0);
    }

    const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));
    assert.ok(report.columns.jev.line.startsWith('verdict jev: '));
    assert.deepEqual(report.measurement.rowKinds, { live: 30, constructed: 10 });
    assert.equal(report.measurement.instructionSha256, sha256Hex(INSTRUCTION));
    assert.equal(report.measurement.keepRuleSha256, sha256Hex(KEEP_RULE_LINE));
    assert.match(report.measurement.rowSetSha256, /^[0-9a-f]{64}$/);
    assert.equal(report.measurement.outcomes.length, 40);
    assert.equal(report.columns.jev.live.M, 30);
    assert.equal(report.columns.jev.constructed.M, 10);
    assert.deepEqual(report.columns.jev.liveSignTest, { W: 0, L: 0, p: 1 });
    assert.deepEqual(report.stopped, {});
    assert.deepEqual(report.skipped, {});

    const repeated = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
    assert.equal(repeated.code, 0);
    assert.ok(!repeated.lines.some((line) => line.startsWith('requalify:')));
  } finally {
    cleanup(root);
    fs.rmSync(labelsPath, { force: true });
  }
});

test('legacy line claim validates and is sent as the cited line', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(root, 'labels.jsonl');
  const inputLogPath = path.join(root, 'inputs.jsonl');
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = armEnv(root, { STUB_INPUT_LOG: inputLogPath });
    const rows = gateRows(commit, 30, 10);
    rows[0] = {
      ...rows[0],
      id: 'legacy-line',
      doc: GATE_LEGACY_DOC,
      doc_line: 3,
      claim_sha12: sha256Hex(GATE_LEGACY_LINE).slice(0, 12),
    };
    assert.equal(Object.hasOwn(rows[0], 'claim_unit'), false);
    writeGateLabels(labelsPath, rows);

    const run = await runWithEnv(
      ['--labels', labelsPath, '--jev', '--out', outDir],
      root,
      env,
    );
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    const payloads = fs.readFileSync(inputLogPath, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    assert.equal(payloads.length, 40);
    assert.deepEqual(payloads[0], {
      claim: GATE_LEGACY_LINE,
      target: GATE_TARGET,
      window: GATE_WINDOW_TEXT,
    });
  } finally {
    cleanup(root);
  }
});

test('jev no credential', async () => {
  const { root, commit } = makeGateFixture();
  const labelsPath = path.join(os.tmpdir(), `cite-drift-jev-cred-${process.pid}.jsonl`);
  const outDir = path.join(root, 'out');
  try {
    addStubBin(root);
    const env = armEnv(root, { STUB_AUTH_STATUS_EXIT: '3' });
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
    const inputLogPath = path.join(root, 'inputs.jsonl');
    const env = armEnv(root, { STUB_INPUT_LOG: inputLogPath });
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
    assert.equal(calls.filter((line) => line.startsWith('jev\tnoul')).length, 1);
    assert.equal(JSON.parse(fs.readFileSync(inputLogPath, 'utf8').trim()).claim, 'The function `resolves` still sits here.');
    for (const line of calls) {
      assert.ok(line.includes('--provider official'));
    }
  } finally {
    cleanup(root);
  }
});

test('jev uses minimum reruns and adaptively includes the band endpoints', async () => {
  const { root, commit } = makeGateFixture();
  try {
    addStubBin(root);
    const inputLogPath = path.join(root, 'inputs.jsonl');
    const env = armEnv(root, {
      STUB_INPUT_LOG: inputLogPath,
      STUB_JEV_PROBABILITIES: '0.2,0.6,0.6,0.4,0.35,0.9,0.9,0.65,0.9,0.9',
    });
    const gate = jevGate({ out: () => {}, env, timeoutMs: 90000 });
    const rows = [
      gateRow(commit, 'screen-clean', 2, 'supports'),
      gateRow(commit, 'borderline-drift', 4, 'partial'),
      gateRow(commit, 'lower-edge', 2, 'supports'),
      gateRow(commit, 'upper-edge', 4, 'partial'),
    ];
    const claims = [
      'A clean claim.\nThe context carries through.',
      'A drifted claim.\nThe paragraph supplies its subject.',
      'A lower-edge claim.',
      'An upper-edge claim.',
    ];
    const windows = new Map(rows.map((row, index) => [row.id, {
      sentence: row.doc_line === 2 ? GATE_CLAIMS.clean : GATE_CLAIMS.drifted,
      claim: claims[index],
      windowText: GATE_WINDOW_TEXT,
    }]));
    const callRecords = [];
    const lines = [];
    const result = await runJevArm(
      { rows, windows, labelsSha: 'abc123abc123' },
      gate,
      {
        out: (line) => lines.push(line),
        env,
        timeoutMs: 90000,
        backoffMs: 1,
        callLog: { append(record) { callRecords.push(record); } },
        stored: null,
      },
    );
    assert.equal(result.stopped, undefined);
    assert.deepEqual(result.outcomes.map((outcome) => ({
      id: outcome.id,
      probabilities: outcome.probabilities,
      minimumProbability: outcome.minimumProbability,
      modalFlag: outcome.modalFlag,
      flagged: outcome.flagged,
    })), [
      { id: 'screen-clean', probabilities: [0.2], minimumProbability: 0.2, modalFlag: true, flagged: true },
      { id: 'borderline-drift', probabilities: [0.6, 0.6, 0.4], minimumProbability: 0.4, modalFlag: false, flagged: true },
      { id: 'lower-edge', probabilities: [0.35, 0.9, 0.9], minimumProbability: 0.35, modalFlag: false, flagged: true },
      { id: 'upper-edge', probabilities: [0.65, 0.9, 0.9], minimumProbability: 0.65, modalFlag: false, flagged: false },
    ]);
    const rowCalls = callRecords.filter((record) => record.rowId !== null);
    assert.deepEqual(rows.map((row) => rowCalls.filter((record) => record.rowId === row.id).length), [1, 3, 3, 3]);
    assert.equal(result.column.TP, 1);
    assert.equal(result.column.FP, 2);
    assert.equal(result.column.F, 2);
    assert.ok(lines.some((line) => line.startsWith('column jev.live:')));
    assert.ok(lines.some((line) => line.startsWith('column jev.constructed:')));
    assert.ok(lines.some((line) => line.startsWith('sign test jev.live:')));
    const payloads = fs.readFileSync(inputLogPath, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
    assert.deepEqual(payloads.map((payload) => payload.claim), [claims[0], claims[1], claims[1], claims[1], claims[2], claims[2], claims[2], claims[3], claims[3], claims[3]]);
  } finally {
    cleanup(root);
  }
});

test('Jev judgment call records include the selected transport', async () => {
  const { root, commit } = makeGateFixture();
  try {
    addStubBin(root);
    const env = armEnv(root);
    const out = () => {};
    const row = gateRow(commit, 'transport-record', 2, 'supports');
    const windows = new Map([[row.id, {
      sentence: GATE_CLAIMS.clean,
      claim: 'A short fixture claim.',
      windowText: GATE_WINDOW_TEXT,
    }]]);
    const records = [];
    const gate = jevGate({ out, env, timeoutMs: 90000 });

    await runJevArm({ rows: [row], windows, labelsSha: 'abc123abc123' }, gate, {
      out,
      env,
      timeoutMs: 90000,
      backoffMs: 1,
      callLog: { append(record) { records.push(record); } },
      stored: null,
    });

    const judgment = records.find((record) => record.rowId === row.id);
    assert.ok(judgment);
    assert.equal(judgment.transport, 'jev');
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
    const env = armEnv(root, { STUB_JEV_NOUL_EXIT: '3' });
    writeGateLabels(labelsPath, gateRows(commit, 30, 10));
    const base = await runGate(root, labelsPath);
    const run = await runWithEnv(['--labels', labelsPath, '--jev', '--out', outDir], root, env);
    assert.equal(run.code, 0);
    assert.deepEqual(run.errors, []);
    const tail = run.lines.slice(base.lines.length);
    assert.equal(tail[0], `jev: path=${path.join(root, 'bin', 'jev')} provider=official`);
    assert.match(tail[1], /^jev: payload: committed skill-doc claims and tracked-file windows; planned calls: 40 screening \+ up to 80 adaptive \+ 1 auth; estimated input tokens \(max\): \d+$/);
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
