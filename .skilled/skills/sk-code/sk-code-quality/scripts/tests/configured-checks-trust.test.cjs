// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Configured Check Trust Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A committed config names commands, so a command starts only once some rule trusts it. These
// cases separate the rules from each other: the local trust key, a config the operator named,
// a value stored in the repository's own .git/config, the same key at another scope, and the
// hub's own checkout.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { REPO_ROOT, assertSnapshotUnchanged, buildRepo, trustRepoChecks } = require('./fixtures.cjs');
const { CHANGED_GO, CLEAN_GO, NODE, check, config, withRepo } = require('./quality-suite-helpers.cjs');
const { checkTrust } = require('../quality-gate.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
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
