// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: behavior-bench-run git timeout guards                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the bounded, fsmonitor-free git status call and pin the      ║
// ║          isolation check's refusal to report "clean" when git never       ║
// ║          answered. execFileSync is stubbed before the runner loads, so    ║
// ║          no git process runs.                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const childProcess = require('node:child_process');
const test = require('node:test');

const RUNNER = path.join(__dirname, '..', 'behavior-bench-run.cjs');

const gitCalls = [];
let gitOutcome = '';

// Installed before the runner is required: the runner destructures execFileSync
// at load time, so a later patch would never reach gitStatusPaths.
childProcess.execFileSync = (file, argv, options) => {
  gitCalls.push({ file, argv, options });
  if (gitOutcome instanceof Error) throw gitOutcome;
  return gitOutcome;
};

delete require.cache[require.resolve(RUNNER)];
const bench = require(RUNNER);

function makeTempRoots(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'behavior-bench-git-timeout-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixtureDir = path.join(root, 'fixture');
  const outDir = path.join(root, 'out');
  const repoRoot = path.join(root, 'repo');
  fs.mkdirSync(fixtureDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(repoRoot, { recursive: true });
  return { fixtureDir, outDir, repoRoot };
}

test('git status disables fsmonitor and bounds the call with a timeout', () => {
  gitCalls.length = 0;
  gitOutcome = '?? a.txt\n';
  const paths = bench.gitStatusPaths('/tmp/some-repo');
  assert.deepEqual(paths, ['a.txt']);
  assert.equal(gitCalls.length, 1);
  assert.equal(gitCalls[0].file, 'git');
  assert.deepEqual(gitCalls[0].argv.slice(0, 2), ['-c', 'core.fsmonitor=false']);
  assert.deepEqual(gitCalls[0].argv, ['-c', 'core.fsmonitor=false', '-C', '/tmp/some-repo', 'status', '--porcelain']);
  assert.equal(gitCalls[0].options.timeout, 20000);
});

test('a failed git status returns null rather than an empty list', () => {
  gitCalls.length = 0;
  gitOutcome = new Error('spawnSync git ETIMEDOUT');
  assert.equal(bench.gitStatusPaths('/tmp/some-repo'), null);
});

test('isolation is reported unavailable when git status never answered', (t) => {
  const { fixtureDir, outDir, repoRoot } = makeTempRoots(t);
  const missingBefore = bench.isolationViolations(null, [], fixtureDir, outDir, repoRoot);
  assert.equal(missingBefore.length, 1);
  assert.ok(missingBefore[0].startsWith('git status unavailable'));
  const missingAfter = bench.isolationViolations(new Set(), null, fixtureDir, outDir, repoRoot);
  assert.equal(missingAfter.length, 1);
  assert.ok(missingAfter[0].startsWith('git status unavailable'));
});

test('paths outside the fixture and out dirs are still isolation violations', (t) => {
  const { fixtureDir, outDir, repoRoot } = makeTempRoots(t);
  assert.deepEqual(bench.isolationViolations(new Set(), ['a.txt'], fixtureDir, outDir, repoRoot), ['a.txt']);
});
