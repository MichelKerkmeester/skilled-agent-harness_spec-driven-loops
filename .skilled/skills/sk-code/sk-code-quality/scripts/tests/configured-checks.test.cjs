// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Configured Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case commits a repository config that names one or more commands, seeds a
// change and runs the runner the way a user would. The commands are node one-liners
// started through this process's own node, so a case needs no tool beyond the one
// running it, and each one proves what it saw through its exit code alone. Every
// case except the mutating one also checks that the run left the fixture unchanged.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { REPO_ROOT, assertSnapshotUnchanged, buildRepo, trustRepoChecks } = require('./fixtures.cjs');
const { checkTrust } = require('../quality-gate.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const NODE = process.execPath;
const CLEAN_GO = 'package a\n\nfunc A() {}\n';
const CHANGED_GO = 'package a\n\nfunc A() {}\nfunc B() {}\n';
const HOSTILE = '$(touch pwned); `touch pwned` | cat & ; * > out.txt';
// Started inside a check, this keeps a helper alive after the check itself ends, so a
// case can see whether the runner killed the whole group.
const FORK_HELPER = 'const c = require("child_process").spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { stdio: "ignore" });'
  + ' require("fs").writeFileSync(process.argv[1], String(c.pid));';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function withRepo(options, body) {
  const repo = buildRepo(options);
  try {
    return body(repo);
  } finally {
    repo.cleanup();
  }
}

function config(value) {
  return `${JSON.stringify({ schemaVersion: 1, ...value }, null, 2)}\n`;
}

function check(verdict, id) {
  return verdict.checks.find((entry) => entry.id === id);
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

// A killed helper is reaped by the system shortly after, so the wait allows for that.
function deadWithin(pid, ms) {
  const pause = new Int32Array(new SharedArrayBuffer(4));
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (!alive(pid)) return true;
    Atomics.wait(pause, 0, 0, 50);
  }
  return !alive(pid);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. NAMED FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

test('F06 required tool absent: the check is SKIPPED_ABSENT with a repair line and the run is UNVERIFIED', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'absent-tool', argv: ['sk-code-absent-tool', '{files}'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  const row = check(verdict, 'absent-tool');
  assert.deepEqual([row.origin, row.state, row.required, row.requires], ['configured', 'SKIPPED_ABSENT', true, 'sk-code-absent-tool']);
  assert.equal(row.repair, "install 'sk-code-absent-tool' or remove the check from .skilled/skills/sk-code/sk-code-quality/repository/quality.json");
  assert.deepEqual(verdict.summary.unverified, ['absent-tool']);
}));

test('F07 check fails: a required P0 check that exits 1 is RAN_FAIL and blocks, and a failing P1 check does not', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [
      { id: 'soft-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P1' },
      { id: 'hard-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P0' },
    ] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.deepEqual([check(verdict, 'hard-fail').state, check(verdict, 'hard-fail').exit], ['RAN_FAIL', 1]);
  assert.deepEqual([check(verdict, 'soft-fail').state, check(verdict, 'soft-fail').required], ['RAN_FAIL', false]);

  repo.write({ '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'soft-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P1' }] }) });
  assert.equal(repo.run(['--config', '.skilled/skills/sk-code/sk-code-quality/repository/quality.json']).status, 0);
}));

test('F08 check mutates: a check that rewrites a tracked file ends the run with CHECK_MUTATED_WORKSPACE and keeps the change', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [
      { id: 'rewriter', argv: [NODE, '-e', 'require("fs").appendFileSync("app.go", "func C() {}\\n")'], severity: 'P1' },
      { id: 'after', argv: [NODE, '-e', 'process.exit(0)'], severity: 'P1' },
    ] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = repo.run([]);
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  const mutation = verdict.errors.find((entry) => entry.code === 'CHECK_MUTATED_WORKSPACE');
  assert.deepEqual([mutation.check, mutation.paths], ['rewriter', ['app.go']]);
  assert.equal(fs.readFileSync(path.join(repo.root, 'app.go'), 'utf8'), `${CHANGED_GO}func C() {}\n`);
  assert.equal(check(verdict, 'after').state, 'ERROR');
  assert.match(check(verdict, 'after').repair, /not run, because the workspace changed while rewriter ran/);
}));

test('F09 discovered only: a package.json lint script is suggested with its config entry and never runs', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    'package.json': `${JSON.stringify({ name: 'fixture', scripts: {
      lint: 'node -e "require(\'fs\').writeFileSync(\'canary\', \'ran\')"',
      'format:check': 'prettier --write .',
      fix: 'eslint --fix .',
    } }, null, 2)}\n`,
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual(verdict.suggested_checks, [{
    id: 'lint',
    source: 'package.json',
    reason: 'package.json defines a lint script',
    entry: { id: 'lint', argv: ['npm', 'run', 'lint'], languages: ['javascript', 'typescript'], requires: 'npm', severity: 'P1', required: false },
  }]);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

// ─────────────────────────────────────────────────────────────────────────────
// 5. TRUST BOUNDARY AND SPAWN
// ─────────────────────────────────────────────────────────────────────────────

test('trust: a committed config with no trust rule leaves its required check SKIPPED_UNTRUSTED and starts nothing', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{
      id: 'untrusted-canary',
      argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran"); process.exit(1)'],
      severity: 'P0',
    }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  const row = check(verdict, 'untrusted-canary');
  assert.deepEqual([row.origin, row.state, row.required, row.repair],
    ['configured', 'SKIPPED_UNTRUSTED', true, 'git config --local skilled.trustRepoChecks true']);
  assert.deepEqual(verdict.summary.unverified, ['untrusted-canary']);
  assert.deepEqual([verdict.config.trust.checks, verdict.config.trust.reason], ['untrusted', 'the config names commands and no trust rule applies']);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('trust: a local skilled.trustRepoChecks true lets the committed check run and fail as before', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'trusted-fail', argv: [NODE, '-e', 'process.exit(1)'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.equal(check(verdict, 'trusted-fail').state, 'RAN_FAIL');
  assert.deepEqual([verdict.config.trust.checks, verdict.config.trust.reason], ['trusted', 'skilled.trustRepoChecks is true in this repository']);
}));

// Git stores any text under the key, and only a value it reads as a boolean true is a grant.
test('trust: a skilled.trustRepoChecks value that is not a git boolean is no grant and the check never starts', () => withRepo({
  base: { 'app.go': CLEAN_GO, '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': canaryConfig('maybe-grant') },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  repo.git(['config', '--local', 'skilled.trustRepoChecks', 'maybe']);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  const row = check(verdict, 'maybe-grant');
  assert.deepEqual([row.state, row.repair], ['SKIPPED_UNTRUSTED', 'git config --local skilled.trustRepoChecks true']);
  assert.deepEqual([verdict.config.trust.checks, verdict.config.trust.reason], ['untrusted', 'the config names commands and no trust rule applies']);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('trust: naming the committed config with --config trusts it for that run only', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'named-run', argv: [NODE, '-e', 'process.exit(0)'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const named = assertSnapshotUnchanged(repo, () => repo.run(['--config', '.skilled/skills/sk-code/sk-code-quality/repository/quality.json']));
  assert.equal(named.status, 0);
  assert.equal(check(named.verdict, 'named-run').state, 'RAN_CLEAN');
  assert.deepEqual([named.verdict.config.trust.checks, named.verdict.config.trust.reason],
    ['trusted', 'the operator named the config with --config']);
  const plain = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(check(plain.verdict, 'named-run').state, 'SKIPPED_UNTRUSTED');
}));

// A value git labels local is not necessarily a value the operator set: an include in
// .git/config reports the scope of the file that carries it, and that file is often
// tracked. Trust reads the local scope again with no include, so these cases separate the
// three ways the same key can reach a run.
const OUTSIDE_GITCONFIG = '[skcode]\n\tqualityConfig = .skilled/skills/sk-code/sk-code-quality/repository/quality.json\n';

function canaryConfig(id, extra = {}) {
  return config({ checks: [{ id, argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")'], severity: 'P0', ...extra }] });
}

function localGitConfig(repo, args) {
  repo.git(['config', '--local', ...args]);
  return repo;
}

test('trust: a skcode.qualityConfig value stored in .git/config itself lets the check run', () => withRepo({
  base: { 'app.go': CLEAN_GO, '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'own-config', argv: [NODE, '-e', 'process.exit(0)'], severity: 'P0' }] }) },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  localGitConfig(repo, ['skcode.qualityConfig', '.skilled/skills/sk-code/sk-code-quality/repository/quality.json']);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.config.source, 'git-config');
  // RAN_CLEAN is the state only a command that started and exited zero reads, and a config
  // no rule trusted reads SKIPPED_UNTRUSTED instead.
  assert.deepEqual([check(verdict, 'own-config').state, check(verdict, 'own-config').exit], ['RAN_CLEAN', 0]);
  assert.deepEqual([verdict.config.trust.checks, verdict.config.trust.reason],
    ['trusted', "git config skcode.qualityConfig is stored in this repository's own .git/config"]);
  assert.deepEqual(verdict.summary.unverified, []);
}));

test('trust: the same key at global scope does not trust the committed config', () => withRepo({
  base: { 'app.go': CLEAN_GO, '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': canaryConfig('global-key') },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const globalConfig = path.join(repo.parent, 'global.gitconfig');
  fs.writeFileSync(globalConfig, OUTSIDE_GITCONFIG);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([], { env: { GIT_CONFIG_GLOBAL: globalConfig } }));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  // Discovery accepts a value at any file scope, so the run reads the committed file and
  // still refuses to start a command from it.
  assert.equal(verdict.config.source, 'git-config');
  assert.deepEqual([verdict.config.trust.checks, verdict.config.trust.reason],
    ['untrusted', 'the config names commands and no trust rule applies']);
  assert.equal(check(verdict, 'global-key').state, 'SKIPPED_UNTRUSTED');
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('trust: a value reached through an include in .git/config is not trusted', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': canaryConfig('included-key'),
    'repo.gitconfig': OUTSIDE_GITCONFIG,
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  // The included file is tracked, so git reports the value at local scope while nothing
  // about it is the operator's.
  localGitConfig(repo, ['include.path', '../repo.gitconfig']);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  assert.equal(verdict.config.source, 'git-config');
  assert.deepEqual([verdict.config.trust.checks, verdict.config.trust.reason],
    ['untrusted', 'the config names commands and no trust rule applies']);
  assert.equal(check(verdict, 'included-key').state, 'SKIPPED_UNTRUSTED');
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
  // The text renderer says the same thing the JSON does, on its own line under the config.
  const text = assertSnapshotUnchanged(repo, () => repo.run(['--format', 'text'])).stdout;
  assert.match(text, /^config: git-config .*quality\.json\ntrust: untrusted \(the config names commands and no trust rule applies\)$/m);
}));

// The hub rule compares git common dirs rather than paths, so a worktree of the hub's own
// repository counts as the hub's checkout while another repository never does. A test
// cannot make a worktree of this repository, so the comparison is called where unit tests
// reach the runner's internals.
test('unit trust: a repository that shares the runner checkout\'s common dir is trusted, and no other is', () => {
  const other = buildRepo({});
  try {
    const same = checkTrust({ git: true, root: REPO_ROOT, env: other.env, source: 'repo', scope: null, configured: 1 });
    assert.deepEqual([same.checks, same.reason], ['trusted', 'the repository shares its git common dir with the runner checkout']);
    const elsewhere = checkTrust({ git: true, root: other.root, env: other.env, source: 'repo', scope: null, configured: 1 });
    assert.deepEqual([elsewhere.checks, elsewhere.reason], ['untrusted', 'the config names commands and no trust rule applies']);
    // A worktree shares its repository's common dir, which is still not the hub's.
    const worktree = path.join(other.parent, 'wt');
    other.git(['worktree', 'add', '-q', '-b', 'wt', worktree]);
    assert.deepEqual(checkTrust({ git: true, root: worktree, env: other.env, source: 'repo', scope: null, configured: 1 }), elsewhere);
  } finally {
    other.cleanup();
  }
});

test('trust: --no-run lists an untrusted configured check and never reports SKIPPED_UNTRUSTED', () => withRepo({
  base: { 'app.go': CLEAN_GO, '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': canaryConfig('listed-canary') },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const listed = assertSnapshotUnchanged(repo, () => repo.run(['--no-run']));
  const row = check(listed.verdict, 'listed-canary');
  assert.deepEqual([row.state, listed.verdict.config.trust.checks], ['LISTED', 'untrusted']);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
  // An explanation still says the check applies, so it also says nothing will start it.
  const explained = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'app.go']));
  const named = explained.verdict.checks.find((entry) => entry.id === 'listed-canary');
  assert.deepEqual([named.applies, named.why], [true,
    'matches every file the runner reads in .skilled/skills/sk-code/sk-code-quality/repository/quality.json, but it will not run until trusted: git config --local skilled.trustRepoChecks true']);
  const run = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(check(run.verdict, 'listed-canary').state, 'SKIPPED_UNTRUSTED');
}));

test('trust: an untrusted check that is not required leaves the gate short of UNVERIFIED', () => withRepo({
  base: { 'app.go': CLEAN_GO, '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': canaryConfig('optional-canary', { severity: 'P1', required: false }) },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  const row = check(verdict, 'optional-canary');
  assert.deepEqual([row.state, row.required], ['SKIPPED_UNTRUSTED', false]);
  assert.deepEqual(verdict.summary.unverified, []);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('trust: a repository generated row in an untrusted repository is SKIPPED_UNTRUSTED', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ generated: [{
      paths: ['dist/**'],
      argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")', '{files}'],
      severity: 'P0',
    }] }),
  },
  change: { 'dist/out.js': 'module.exports = 1;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  const row = check(verdict, 'generated-1');
  assert.deepEqual([row.origin, row.state, row.required], ['generated', 'SKIPPED_UNTRUSTED', true]);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('no git: a configured check reports ERROR with GUARD_UNAVAILABLE, starts nothing and leaves the run UNVERIFIED', () => withRepo({
  git: false,
  base: {
    'app.go': CHANGED_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'canary', argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")'], severity: 'P0' }] }),
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'app.go', '--config', '.skilled/skills/sk-code/sk-code-quality/repository/quality.json']));
  assert.equal(status, 4);
  const row = check(verdict, 'canary');
  assert.deepEqual([row.state, row.code], ['ERROR', 'GUARD_UNAVAILABLE']);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('argv: shell metacharacters reach the program as literal text, and no shell reads them', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{
      id: 'literal',
      argv: [NODE, '-e', `process.exit(process.argv[1] === ${JSON.stringify(HOSTILE)} ? 0 : 1)`, HOSTILE],
      severity: 'P0',
    }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(check(verdict, 'literal').state, 'RAN_CLEAN');
  assert.ok(!fs.existsSync(path.join(repo.root, 'pwned')));
  assert.ok(!fs.existsSync(path.join(repo.root, 'out.txt')));
}));

test('timeout: a check over its deadline is TIMEOUT, and the runner kills the whole process group', () => {
  const pids = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-pids-')));
  try {
    const stalled = path.join(pids, 'stalled');
    const exited = path.join(pids, 'exited');
    withRepo({
      base: {
        'app.go': CLEAN_GO,
        '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [
          { id: 'stall', argv: [NODE, '-e', `${FORK_HELPER} setInterval(() => {}, 1000);`, stalled], severity: 'P0', timeoutSec: 0.5 },
          { id: 'leave', argv: [NODE, '-e', `${FORK_HELPER} process.exit(0);`, exited], severity: 'P1' },
        ] }),
      },
      change: { 'app.go': CHANGED_GO },
    }, (repo) => {
      trustRepoChecks(repo);
      const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
      assert.equal(status, 4);
      assert.equal(check(verdict, 'stall').state, 'TIMEOUT');
      assert.equal(check(verdict, 'leave').state, 'RAN_CLEAN');
      assert.ok(deadWithin(Number(fs.readFileSync(stalled, 'utf8')), 3000), 'the helper of the stalled check survived');
      assert.ok(deadWithin(Number(fs.readFileSync(exited, 'utf8')), 3000), 'the helper of the finished check survived');
    });
  } finally {
    fs.rmSync(pids, { recursive: true, force: true });
  }
});

test('--no-run lists configured checks with their planned runs and spawns none, and the flags accept configured ids', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'canary', argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")', '{files}'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  assertSnapshotUnchanged(repo, () => {
    const listed = repo.run(['--no-run']);
    assert.equal(listed.status, 4);
    const row = check(listed.verdict, 'canary');
    assert.equal(row.state, 'LISTED');
    assert.deepEqual(row.runs.map((run) => [run.cwd, run.argv.at(-1), run.state]), [['.', 'app.go', 'LISTED']]);
    const skipped = repo.run(['--no-run', '--skip', 'canary']);
    assert.equal(check(skipped.verdict, 'canary').state, 'SKIPPED_BY_FLAG');
    const only = repo.run(['--no-run', '--only', 'canary']);
    assert.equal(check(only.verdict, 'canary').state, 'LISTED');
    assert.equal(check(only.verdict, 'comment-hygiene').state, 'SKIPPED_BY_FLAG');
  });
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('package cwd: a {files} check runs once per package folder and receives only that package\'s files', () => withRepo({
  base: {
    'pkg/a/package.json': '{"name": "a"}\n',
    'pkg/b/Cargo.toml': '[package]\nname = "b"\n',
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{
      id: 'per-package',
      // Exits 0 only when every file it was handed exists from where it started.
      argv: [NODE, '-e', 'process.exit(process.argv.slice(1).every((f) => require("fs").existsSync(f)) ? 0 : 1)', '{files}'],
      languages: ['javascript'],
      cwd: 'package',
      severity: 'P0',
    }] }),
  },
  change: { 'pkg/a/x.js': 'module.exports = 1;\n', 'pkg/b/src/y.js': 'module.exports = 2;\n', 'z.js': 'module.exports = 3;\n', '-dash.js': 'module.exports = 4;\n' },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  const row = check(verdict, 'per-package');
  assert.equal(row.state, 'RAN_CLEAN');
  assert.deepEqual(row.runs.map((run) => [run.cwd, run.argv.slice(3), run.state]), [
    ['.', ['./-dash.js', 'z.js'], 'RAN_CLEAN'],
    ['pkg/a', ['x.js'], 'RAN_CLEAN'],
    ['pkg/b', ['src/y.js'], 'RAN_CLEAN'],
  ]);
}));

// A program named with a slash is a repository file, so a run in a package folder
// starts the file the presence probe found rather than one under that folder.
test('relative program: a slash argv[0] starts from the repository root whatever cwd says', () => {
  const marks = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skq-marks-')));
  try {
    const marker = path.join(marks, 'started');
    withRepo({
      base: {
        'tools/lint.sh': `#!/bin/sh\nprintf '%s\\n' started > '${marker}'\n`,
        'pkg/package.json': '{"name": "pkg"}\n',
        '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{
          id: 'lint',
          argv: ['./tools/lint.sh', '{files}'],
          languages: ['python'],
          cwd: 'package',
          severity: 'P0',
        }] }),
      },
      change: { 'pkg/a.py': 'def a():\n    return 1\n' },
      modes: { 'tools/lint.sh': 0o755 },
    }, (repo) => {
      trustRepoChecks(repo);
      const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
      assert.equal(status, 0);
      const row = check(verdict, 'lint');
      assert.deepEqual([row.state, row.runs.map((run) => run.cwd)], ['RAN_CLEAN', ['pkg']]);
      assert.equal(fs.readFileSync(marker, 'utf8'), 'started\n');
    });
  } finally {
    fs.rmSync(marks, { recursive: true, force: true });
  }
});

test('NOT_APPLICABLE: a check whose selectors match no file in scope never starts', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ checks: [{ id: 'docs-only', argv: [NODE, '-e', 'require("fs").writeFileSync("canary", "ran")'], paths: ['docs/**'], severity: 'P0' }] }),
  },
  change: { 'app.go': CHANGED_GO },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual([check(verdict, 'docs-only').state, check(verdict, 'docs-only').files], ['NOT_APPLICABLE', 0]);
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')));
}));

test('generated: a row whose paths match a changed file runs as a configured check, even under an excluded folder', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': config({ generated: [{
      paths: ['dist/**'],
      argv: [NODE, '-e', 'process.exit(require("fs").existsSync(process.argv[1]) ? 0 : 1)', '{files}'],
      severity: 'P0',
    }] }),
  },
  change: { 'dist/out.js': 'module.exports = 1;\n' },
}, (repo) => {
  trustRepoChecks(repo);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  const row = check(verdict, 'generated-1');
  assert.deepEqual([row.origin, row.state, row.required, row.runs[0].argv.at(-1)], ['generated', 'RAN_CLEAN', true, 'dist/out.js']);
  assert.equal(verdict.coverage.files_checked, 1);
  assert.deepEqual(verdict.coverage.unchecked, []);
}));
