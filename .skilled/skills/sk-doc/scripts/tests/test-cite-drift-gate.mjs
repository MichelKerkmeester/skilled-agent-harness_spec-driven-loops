#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Citation Drift Gate Tests
// ───────────────────────────────────────────────────────────────────
// Fixture repositories in the OS temp directory, each committed twice so a
// base revision exists; every fixture is removed when its test ends.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { brokenCitations, compareBroken, main } from '../../shared/scripts/cite-drift-gate.mjs';

const ALPHA_DOC = '.skilled/skills/alpha-skill/SKILL.md';

// A fixture must not inherit the caller's git redirectors or backend endpoints.
function cleanEnv() {
  const env = { ...process.env };
  for (const key of [
    'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_NAMESPACE', 'GIT_CEILING_DIRECTORIES',
    'JEV_PROVIDER', 'JEV_FEATURES', 'JEV_FEATURE_CITE_DRIFT', 'SKDOC_CITE_DRIFT_CHECK',
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

// Fixture repository whose base commit holds one skill document and a ten-line
// target. The given lines become the base's SKILL.md.
const makeFixture = (docLines) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-drift-gate-test-'));
  const files = {
    [ALPHA_DOC]: `${docLines.join('\n')}\n`,
    '.skilled/skills/alpha-skill/lib/code.ts': TEN_LINES,
  };
  for (const [relative, text] of Object.entries(files)) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }
  runGit(root, 'init', '-q');
  runGit(root, 'add', '-A');
  runGit(root, 'commit', '-q', '-m', 'base');
  return { root, base: runGit(root, 'rev-parse', 'HEAD').toString().trim() };
};

// Commit the current working tree as the fixture's head.
const commitHead = (root) => {
  runGit(root, 'add', '-A');
  runGit(root, 'commit', '-q', '-m', 'head');
};

const docPath = (root) => path.join(root, ALPHA_DOC);

const runMain = async (repoRoot, base) => {
  const lines = [];
  const errors = [];
  const code = await main(['--base', base], {
    repoRoot,
    out: (line) => lines.push(line),
    err: (line) => errors.push(line),
    redirects: [],
  });
  return { code, lines, errors };
};

test('unchanged in-range citation passes', async () => {
  const { root, base } = makeFixture(['# Alpha skill', 'The target `lib/code.ts:3` still holds.']);
  try {
    fs.appendFileSync(docPath(root), 'A prose line without a citation.\n');
    commitHead(root);
    const { code, lines } = await runMain(root, base);
    assert.equal(code, 0);
    assert.ok(lines.includes('0 older unresolved or past-end citations, not blocking'));
    assert.ok(!lines.some((line) => line.startsWith('new broken citation')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('new broken citation blocks', async () => {
  const { root, base } = makeFixture(['# Alpha skill', 'The target `lib/code.ts:3` still holds.']);
  try {
    fs.appendFileSync(docPath(root), 'A missing target `lib/missing.ts:4` is cited.\n');
    commitHead(root);
    const { code, lines, errors } = await runMain(root, base);
    assert.equal(code, 1);
    assert.deepEqual(errors, []);
    assert.ok(lines.some((line) => line.startsWith('new broken citation: .skilled/skills/alpha-skill/SKILL.md:') && line.includes('(unresolved)')));
    assert.ok(lines.some((line) => line.startsWith('BLOCKED: 1')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('pre-existing broken citation does not block', async () => {
  const { root, base } = makeFixture(['# Alpha skill', 'The target `lib/missing.ts:4` was never added.']);
  try {
    const lines = fs.readFileSync(docPath(root), 'utf8').split('\n');
    lines.splice(1, 0, 'A prose line.', 'Another prose line.');
    fs.writeFileSync(docPath(root), lines.join('\n'));
    commitHead(root);
    const { code, lines: output } = await runMain(root, base);
    assert.equal(code, 0);
    assert.ok(output.includes('1 older unresolved or past-end citations, not blocking'));
    assert.ok(!output.some((line) => line.startsWith('new broken citation')));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('symlinked doc is not scanned', () => {
  const { root } = makeFixture(['# Alpha skill']);
  try {
    const realDoc = path.join(root, '.skilled/skills/beta-skill/real.md');
    fs.mkdirSync(path.dirname(realDoc), { recursive: true });
    fs.writeFileSync(realDoc, 'A missing target `lib/missing.ts:4` is cited.\n');
    fs.symlinkSync('../beta-skill/real.md', path.join(root, '.skilled/skills/alpha-skill/link.md'));
    commitHead(root);
    const broken = brokenCitations(root, []);
    assert.ok(!broken.some((entry) => entry.doc === '.skilled/skills/alpha-skill/link.md'));
    assert.equal(broken.filter((entry) => entry.doc === '.skilled/skills/beta-skill/real.md').length, 1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('compareBroken separates keys fresh and older', () => {
  const base = [{ key: 'docs/a.md\tlib/a.ts:1' }];
  const head = [{ key: 'docs/a.md\tlib/a.ts:1' }, { key: 'docs/a.md\tlib/b.ts:2-4' }];
  const { fresh, older } = compareBroken(head, base);
  assert.deepEqual(older, [head[0]]);
  assert.deepEqual(fresh, [head[1]]);
});
