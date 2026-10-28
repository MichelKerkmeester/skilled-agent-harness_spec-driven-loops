// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Config Discovery Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case seeds a throwaway repository with one config source, runs the runner the way a
// user would and checks which source it chose, what it refused and where it looked. No case
// changes this process's environment.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const { assertSnapshotUnchanged } = require('./fixtures.cjs');
const { CLEAN_GO, LEGACY_TARGET, OPENCODE_TARGET, REPO_IDENTITY, TARGET, json, withRepo } = require('./quality-suite-helpers.cjs');
const { discoverConfig, isInside, repoConfigTarget } = require('../lib/quality-config.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MINIMAL = '{"schemaVersion": 1}\n';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Discovery reads the environment before the origin remote, so a case names the repository
// it runs in instead of depending on what the temp folder happens to hold.
function discover(repo, env = {}) {
  return discoverConfig({ cwd: repo.root, root: repo.root, git: false, env: { ...repo.env, ...env } });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('path containment accepts in-folder names that begin with two dots', () => {
  const root = path.resolve('quality-config-scope');
  const dotPrefixedChild = path.join(root, '..notes.md');
  const outsideChild = path.resolve(root, '..', 'outside');

  assert.equal(isInside(dotPrefixedChild, root), true);
  assert.equal(isInside(outsideChild, root), false);
  assert.equal(isInside(root, root), false);
});

test('discovery: --config wins over the other sources and is read relative to the working directory', () => withRepo({
  base: { 'sub/app.go': CLEAN_GO, [TARGET]: MINIMAL, 'conf/q.json': MINIMAL, 'sub/cli.json': MINIMAL },
  change: { 'sub/app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  repo.git(['config', 'skcode.qualityConfig', 'conf/q.json']);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--config', 'cli.json'], { cwd: path.join(repo.root, 'sub') }));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path], ['cli', 'sub/cli.json']);
}));

test('discovery: a file-scoped git config value beats the repository file and is read relative to the root', () => withRepo({
  base: { 'sub/app.go': CLEAN_GO, [TARGET]: MINIMAL, 'conf/q.json': MINIMAL },
  change: { 'sub/app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  repo.git(['config', 'skcode.qualityConfig', 'conf/q.json']);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([], { cwd: path.join(repo.root, 'sub') }));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path], ['git-config', 'conf/q.json']);
}));

test('discovery: the config the skill folder carries is the repository source, with its size', () => withRepo({
  base: { 'app.go': CLEAN_GO, [TARGET]: MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path, verdict.config.bytes], ['repo', TARGET, MINIMAL.length]);
}));

test('discovery: with no source the run uses the base layer alone and fills suggested_checks', () => withRepo({
  base: { 'app.go': CLEAN_GO, 'package.json': json({ name: 'fixture', scripts: { lint: 'eslint .', test: 'node --test' } }) },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path], ['none', null]);
  assert.deepEqual(verdict.suggested_checks.map((item) => item.id), ['lint']);
  assert.deepEqual(verdict.suggested_checks[0].entry.argv, ['npm', 'run', 'lint']);
}));

test('CONFIG_PATH_MISSING: a missing path named with --config exits 3, names the path and never falls back', () => withRepo({
  base: { 'app.go': CLEAN_GO, [TARGET]: MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const missing = path.join(repo.root, 'missing.json');
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--config', 'missing.json']));
  assert.equal(status, 3);
  assert.equal(verdict.errors[0].code, 'CONFIG_PATH_MISSING');
  assert.ok(verdict.errors[0].message.includes(missing));
  assert.deepEqual([verdict.config.source, verdict.config.path], ['cli', missing]);
  assert.deepEqual(verdict.checks, []);
}));

test('F11 config scope: a file-scoped value to a missing path is CONFIG_PATH_MISSING, and a git -c value is ignored', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  repo.git(['config', 'skcode.qualityConfig', 'missing.json']);
  const stored = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(stored.status, 3);
  assert.equal(stored.verdict.errors[0].code, 'CONFIG_PATH_MISSING');
  assert.equal(stored.verdict.config.source, 'git-config');
  repo.git(['config', '--unset', 'skcode.qualityConfig']);

  // A git -c flag reaches a child git as GIT_CONFIG_PARAMETERS, and GIT_CONFIG_COUNT is
  // the other command-scope channel. Both report scope command.
  const flagged = assertSnapshotUnchanged(repo, () => repo.run([], { env: { GIT_CONFIG_PARAMETERS: "'skcode.qualityConfig'='missing.json'" } }));
  assert.equal(flagged.status, 0);
  assert.equal(flagged.verdict.config.source, 'none');
  const counted = assertSnapshotUnchanged(repo, () => repo.run([], {
    env: { GIT_CONFIG_COUNT: '2', GIT_CONFIG_KEY_1: 'skcode.qualityConfig', GIT_CONFIG_VALUE_1: 'missing.json' },
  }));
  assert.equal(counted.status, 0);
  assert.equal(counted.verdict.config.source, 'none');
}));

test('discovery: a config left at the old root-level path is refused, and the message names where it belongs', () => withRepo({
  base: { 'app.go': CLEAN_GO, [LEGACY_TARGET]: MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  assert.throws(() => discover(repo), (error) => error.code === 'CONFIG_LEGACY_LOCATION'
    && error.source === 'repo'
    && error.path === path.join(repo.root, LEGACY_TARGET)
    && error.message === `${LEGACY_TARGET} is no longer read: move it to ${TARGET}`);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.match(verdict.errors[0].message, /^\.sk-code\/quality\.json is no longer read: move it to /);
  assert.deepEqual(verdict.checks, []);
}));

test('discovery: a repository field decides whether the config applies, and a mismatch names both repositories', () => withRepo({
  base: { 'app.go': CLEAN_GO, [TARGET]: json({ schemaVersion: 1, repository: REPO_IDENTITY }) },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  const elsewhere = discover(repo, { GITHUB_REPOSITORY: 'other/thing' });
  assert.equal(elsewhere.source, 'none');
  assert.equal(elsewhere.path, null);
  assert.deepEqual(elsewhere.ignored, { path: path.join(repo.root, TARGET), repository: REPO_IDENTITY, current: 'other/thing' });

  const here = discover(repo, { GITHUB_REPOSITORY: REPO_IDENTITY });
  assert.deepEqual([here.source, here.path], ['repo', path.join(repo.root, TARGET)]);
  assert.equal(here.ignored, undefined);

  const skipped = assertSnapshotUnchanged(repo, () => repo.run([], { env: { GITHUB_REPOSITORY: 'other/thing' } }));
  assert.equal(skipped.status, 0);
  assert.equal(skipped.verdict.config.source, 'none');
  const applied = assertSnapshotUnchanged(repo, () => repo.run([], { env: { GITHUB_REPOSITORY: REPO_IDENTITY } }));
  assert.equal(applied.verdict.config.source, 'repo');
}));

test('discovery: a config with no repository field applies in every repository', () => withRepo({
  base: { 'app.go': CLEAN_GO, [TARGET]: MINIMAL },
}, (repo) => {
  const found = discover(repo, { GITHUB_REPOSITORY: 'any/where' });
  assert.deepEqual([found.source, found.path], ['repo', path.join(repo.root, TARGET)]);
  assert.equal(found.ignored, undefined);
}));

test('discovery: a leading BOM does not hide the repository field, so a file written for another repository is ignored', () => withRepo({
  base: { 'app.go': CLEAN_GO, [TARGET]: `\uFEFF${json({ schemaVersion: 1, repository: REPO_IDENTITY })}` },
}, (repo) => {
  const elsewhere = discover(repo, { GITHUB_REPOSITORY: 'other/thing' });
  assert.equal(elsewhere.source, 'none');
  assert.equal(elsewhere.path, null);
  assert.deepEqual(elsewhere.ignored, { path: path.join(repo.root, TARGET), repository: REPO_IDENTITY, current: 'other/thing' });

  const here = discover(repo, { GITHUB_REPOSITORY: REPO_IDENTITY });
  assert.deepEqual([here.source, here.path], ['repo', path.join(repo.root, TARGET)]);
  assert.equal(here.ignored, undefined);
}));

test('discovery: a path named with --config or the git config value inside .sk-code/ is refused as CONFIG_LEGACY_LOCATION', () => withRepo({
  base: { 'app.go': CLEAN_GO, [LEGACY_TARGET]: MINIMAL },
}, (repo) => {
  assert.throws(() => discoverConfig({ cliPath: LEGACY_TARGET, cwd: repo.root, root: repo.root, git: false, env: repo.env }),
    (error) => error.code === 'CONFIG_LEGACY_LOCATION' && error.source === 'cli'
      && error.path === path.join(repo.root, LEGACY_TARGET));

  repo.git(['config', 'skcode.qualityConfig', LEGACY_TARGET]);
  assert.throws(() => discoverConfig({ cwd: repo.root, root: repo.root, git: true, env: repo.env }),
    (error) => error.code === 'CONFIG_LEGACY_LOCATION' && error.source === 'git-config'
      && error.path === path.join(repo.root, LEGACY_TARGET));

  const named = assertSnapshotUnchanged(repo, () => repo.run(['--config', LEGACY_TARGET]));
  assert.equal(named.status, 3);
  assert.equal(named.verdict.errors[0].code, 'CONFIG_LEGACY_LOCATION');
  assert.deepEqual([named.verdict.config.source, named.verdict.config.path], ['cli', path.join(repo.root, LEGACY_TARGET)]);

  const viaGit = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(viaGit.status, 3);
  assert.equal(viaGit.verdict.errors[0].code, 'CONFIG_LEGACY_LOCATION');
  assert.deepEqual([viaGit.verdict.config.source, viaGit.verdict.config.path], ['git-config', path.join(repo.root, LEGACY_TARGET)]);
}));

test('discovery: a repository that installs skills under .opencode/ keeps the config at the same path there', () => withRepo({
  base: { 'app.go': CLEAN_GO, [OPENCODE_TARGET]: MINIMAL },
  change: { 'app.go': `${CLEAN_GO}func B() {}\n` },
}, (repo) => {
  assert.equal(repoConfigTarget(repo.root), OPENCODE_TARGET);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual([verdict.config.source, verdict.config.path], ['repo', OPENCODE_TARGET]);
}));

test('discovery: a repository with no skill folder gets the path this framework installs', () => withRepo({
  base: { 'app.go': CLEAN_GO },
}, (repo) => {
  assert.equal(repoConfigTarget(repo.root), TARGET);
}));
