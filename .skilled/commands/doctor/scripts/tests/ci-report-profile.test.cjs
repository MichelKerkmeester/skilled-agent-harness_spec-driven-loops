#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Report Profile Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The report against the CI profile: which file it reads, the branch to read runs from,
// the README it takes purposes from, the trailer that marks a rebuild and the switch it
// must carry. A repository with its own switch names, no README and another branch has to
// read clean and raise no flag, because none of this repository's conventions can be
// assumed anywhere else. The fixtures are shared with ci-report.test.cjs.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const {
  PROFILE_RELATIVE,
  REAL_SHA,
  SKILLED_STYLE_PROFILE,
  fixture,
  row,
  writeFile,
} = require('./ci-report-fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE CI PROFILE
// ─────────────────────────────────────────────────────────────────────────────

const ACME_TESTS = `name: Tests
on: push
permissions:
  contents: read
concurrency:
  group: tests
jobs:
  unit:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
`;

const ACME_GATE = `name: Gate
on: pull_request
permissions:
  contents: read
concurrency:
  group: gate
jobs:
  gate:
    name: Required gate
    if: vars.ACME_CI != 'off' && vars.ACME_CI_GATE != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - run: echo ok
`;

// A workflow with no switch at all: nothing in this repository asks for one.
const ACME_RELEASE = `name: Release
on: push
permissions:
  contents: read
concurrency:
  group: release
jobs:
  publish:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - run: echo ok
`;

const ACME_WORKFLOWS = { 'tests.yml': ACME_TESTS, 'gate.yml': ACME_GATE, 'release.yml': ACME_RELEASE };
const ACME_VARIABLES = JSON.stringify([{ name: 'ACME_CI_TESTS', value: 'OFF' }, { name: 'UNRELATED', value: 'x' }]);

test('a foreign repository with no profile reads its own switch state and raises no flag', (t) => {
  const { run } = fixture(t, {}, { profile: null, workflows: ACME_WORKFLOWS, readme: null });
  const result = run(['--json'], {
    GH_VARIABLES: ACME_VARIABLES,
    GH_DEFAULT_BRANCH: 'trunk',
    GH_RUN_BRANCH: 'trunk',
    GH_RUNS: JSON.stringify([{ headSha: REAL_SHA, createdAt: '2026-10-25T09:00:00Z' }]),
  });
  assert.equal(result.code, 0, result.err);
  const { json } = result;
  assert.deepEqual(json.profile, { source: 'default', path: null });
  assert.deepEqual(json.variables, { ACME_CI: 'unset', ACME_CI_GATE: 'unset', ACME_CI_TESTS: 'off' });
  assert.equal(row(json, 'tests.yml').switch, 'off');
  assert.deepEqual(row(json, 'tests.yml').groups, ['ACME_CI', 'ACME_CI_TESTS']);
  assert.equal(row(json, 'gate.yml').switch, 'on');
  assert.equal(row(json, 'release.yml').switch, 'on');
  for (const workflow of json.workflows) assert.deepEqual(workflow.flags, [], workflow.file);
  assert.equal(json.newestNonRebuildSha, REAL_SHA);
  assert.equal(json.newestNonRebuildReason, 'the CI profile names no rebuild trailer');
});

test('with no profile and no default branch from GitHub the runs are read from main', (t) => {
  const { run, calls } = fixture(t, {}, { profile: null, workflows: ACME_WORKFLOWS, readme: null });
  assert.equal(run(['--json']).code, 0);
  assert.ok(calls().includes('run list --branch main --limit 100 --json headSha,createdAt'));
});

test('a profile names a branch other than main, the master switch and the README the repository keeps', (t) => {
  const profile = {
    schemaVersion: 1,
    defaultBranch: 'develop',
    workflowsReadme: { path: 'docs/ci.md' },
    switch: { master: 'ACME_CI', groups: ['ACME_CI_TESTS', 'ACME_CI_GATE'], required: true, exempt: ['release.yml'] },
  };
  const readme = '| Workflow | Responsibility |\n|---|---|\n| `tests.yml` | Runs the tests. |\n';
  const { root, run, calls } = fixture(t, {}, { profile, workflows: ACME_WORKFLOWS, readme: null });
  writeFile(root, 'docs/ci.md', readme);
  const result = run(['--json'], { GH_VARIABLES: ACME_VARIABLES, GH_RUN_BRANCH: 'develop' });
  assert.equal(result.code, 0, result.err);
  const { json } = result;
  assert.deepEqual(json.profile, { source: 'repo', path: PROFILE_RELATIVE });
  assert.deepEqual(Object.keys(json.variables), ['ACME_CI', 'ACME_CI_TESTS', 'ACME_CI_GATE']);
  assert.deepEqual(row(json, 'tests.yml').groups, ['ACME_CI_TESTS']);
  assert.equal(row(json, 'tests.yml').purpose, 'Runs the tests.');
  assert.deepEqual(row(json, 'gate.yml').flags, ['readme-row-missing']);
  assert.equal(row(json, 'release.yml').switch, 'on');
  assert.ok(!row(json, 'release.yml').flags.includes('switch-missing'));
  assert.ok(calls().includes('run list --branch develop --limit 100 --json headSha,createdAt'));
  assert.ok(!calls().some((call) => call.startsWith('repo view')));
});

test('a skill-folder profile written for another repository is ignored and named in the report', (t) => {
  const profile = { ...SKILLED_STYLE_PROFILE, repository: 'someone/else' };
  const { run } = fixture(t, {}, { profile });
  const result = run(['--json', '--no-gh'], { GITHUB_REPOSITORY: 'acme/widgets' });
  assert.equal(result.code, 0, result.err);
  assert.deepEqual(result.json.profile, {
    source: 'default',
    path: null,
    ignored: { path: PROFILE_RELATIVE, repository: 'someone/else', current: 'acme/widgets' },
  });
  assert.match(run(['--no-gh'], { GITHUB_REPOSITORY: 'acme/widgets' }).out,
    /^profile: default; ignored \.skilled\/skills\/sk-code\/sk-code-ci\/repository\/ci\.json, written for someone\/else, this repository is acme\/widgets$/m);
});

test('a profile left at the repository root exits 3 and names the move', (t) => {
  const { root, run } = fixture(t, {}, { profile: null, workflows: ACME_WORKFLOWS, readme: null });
  writeFile(root, '.sk-code/ci.json', JSON.stringify({ schemaVersion: 1 }));
  const result = run(['--json', '--no-gh']);
  assert.equal(result.code, 3);
  assert.match(result.err, /\.sk-code\/ci\.json is no longer read: move it to \.skilled\/skills\/sk-code\/sk-code-ci\/repository\/ci\.json/);
  assert.equal(result.out, '');
});

test('a required switch flags a foreign workflow that carries none', (t) => {
  const profile = { schemaVersion: 1, switch: { master: 'ACME_CI', required: true } };
  const { run } = fixture(t, {}, { profile, workflows: ACME_WORKFLOWS, readme: null });
  const { json } = run(['--json', '--no-gh']);
  assert.equal(row(json, 'release.yml').switch, 'missing');
  assert.deepEqual(row(json, 'release.yml').flags, ['switch-missing']);
});

test('--profile reads the named file and a missing one exits 3 instead of falling back', (t) => {
  const { root, run } = fixture(t, {}, { profile: null, workflows: ACME_WORKFLOWS, readme: null });
  writeFile(root, 'elsewhere/ci.json', JSON.stringify({ schemaVersion: 1, defaultBranch: 'trunk' }));
  const named = run(['--json', '--no-gh', '--profile', path.join(root, 'elsewhere/ci.json')]);
  assert.equal(named.code, 0, named.err);
  assert.equal(named.json.profile.source, 'cli');
  const missing = run(['--json', '--no-gh', '--profile', path.join(root, 'nowhere.json')]);
  assert.equal(missing.code, 3);
  assert.match(missing.err, /--profile names .*nowhere\.json, which does not exist/);
  assert.equal(missing.out, '');
});

test('git config skcode.ciProfile names the profile when no flag does', (t) => {
  const { root, run } = fixture(t, {}, { profile: null, workflows: ACME_WORKFLOWS, readme: null });
  writeFile(root, 'ci/profile.json', JSON.stringify({ schemaVersion: 1 }));
  assert.equal(spawnSync('git', ['init', '-q'], { cwd: root }).status, 0);
  assert.equal(spawnSync('git', ['config', 'skcode.ciProfile', 'ci/profile.json'], { cwd: root }).status, 0);
  const { json } = run(['--json', '--no-gh']);
  assert.deepEqual(json.profile, { source: 'git-config', path: 'ci/profile.json' });
});

test('an unknown profile key exits 3 and names the key', (t) => {
  const { run } = fixture(t, {}, { profile: { schemaVersion: 1, switch: { master: 'ACME_CI', prefix: 'ACME' }, colour: 'red' } });
  const result = run(['--json', '--no-gh']);
  assert.equal(result.code, 3);
  assert.match(result.err, /switch\.prefix: is not a known key/);
  assert.match(result.err, /colour: is not a known key/);
  assert.equal(result.out, '');
});

test('the text table names the profile it read', (t) => {
  const { run } = fixture(t);
  assert.match(run(['--no-gh']).out, /^profile: repo \(\.skilled\/skills\/sk-code\/sk-code-ci\/repository\/ci\.json\)$/m);
});
