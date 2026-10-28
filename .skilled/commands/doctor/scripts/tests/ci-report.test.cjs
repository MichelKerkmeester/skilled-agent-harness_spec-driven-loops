#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Workflow Report Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the report as a process against the throwaway repository the fixtures build, so
// every verdict is read from the same JSON a /doctor route reads: a job's switch state,
// the four missing-setting flags, the trigger and action-pin flags, the README drift, the
// rebuild-commit skip, the failing-gh degrade, the usage error and a no-write proof over
// the repository root. The CI profile cases live in ci-report-profile.test.cjs, on the
// same fixtures.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const test = require('node:test');

const {
  REAL_SHA,
  REBUILD_SHA,
  RUNS_REBUILD_ONLY,
  WORKFLOW_PARTIAL,
  WORKFLOW_UNSAFE,
  fixture,
  row,
} = require('./ci-report-fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('a job whose group variable is off reports off, with the switch ANDed onto another condition', (t) => {
  const { run } = fixture(t);
  const result = run(['--json']);
  assert.equal(result.code, 0);
  const a = row(result.json, 'a.yml');
  assert.equal(a.switch, 'off');
  assert.deepEqual(a.groups, ['SKILLED_CI_TESTS']);
  assert.ok(!a.flags.includes('switch-missing'));
  assert.deepEqual(a.events, ['push', 'pull_request']);
  assert.equal(a.pathFilterCount, 1);
  assert.equal(a.purpose, 'Checks the first thing.');
  assert.equal(result.json.variables.SKILLED_CI_TESTS, 'off');
  assert.equal(result.json.variables.SKILLED_CI, 'unset');
});

test('a workflow with no switch, timeout, permissions or concurrency raises the four flags', (t) => {
  const { run } = fixture(t);
  const b = row(run(['--json']).json, 'b.yml');
  assert.equal(b.switch, 'missing');
  assert.deepEqual(b.flags, ['timeout-missing', 'permissions-missing', 'concurrency-missing', 'switch-missing']);
});

test('the auto-merge workflow has no switch by design and reports on', (t) => {
  const { run } = fixture(t);
  const dependabot = row(run(['--json']).json, 'dependabot-auto-merge.yml');
  assert.equal(dependabot.switch, 'on');
  assert.ok(!dependabot.flags.includes('switch-missing'));
});

test('a quoted expression and a folded block resolve, and mixed jobs report partial', (t) => {
  const { run } = fixture(t, { 'partial.yml': WORKFLOW_PARTIAL });
  const partial = row(run(['--json']).json, 'partial.yml');
  assert.equal(partial.switch, 'partial');
  assert.deepEqual(partial.groups, ['SKILLED_CI_REPORTS', 'SKILLED_CI_TESTS']);
});

test('a workflow missing from the README table is flagged and has no purpose', (t) => {
  const { run } = fixture(t, { 'partial.yml': WORKFLOW_PARTIAL });
  const partial = row(run(['--json']).json, 'partial.yml');
  assert.ok(partial.flags.includes('readme-row-missing'));
  assert.equal(partial.purpose, null);
});

test('a pull_request_target trigger, a tag-pinned action and an event field in a run block are flagged', (t) => {
  const { run } = fixture(t, { 'unsafe.yml': WORKFLOW_UNSAFE });
  const unsafe = row(run(['--json']).json, 'unsafe.yml');
  assert.ok(unsafe.flags.includes('pull-request-target'));
  assert.ok(unsafe.flags.includes('uses-unpinned'));
  assert.ok(unsafe.flags.includes('event-in-run'));
  const clean = row(run(['--json']).json, 'a.yml');
  assert.ok(!clean.flags.includes('uses-unpinned'));
  assert.ok(!clean.flags.includes('event-in-run'));
});

test('an empty variable list leaves every switch on and the table says none', (t) => {
  const { run } = fixture(t);
  const json = run(['--json'], { GH_VARIABLES: '[]' }).json;
  assert.equal(row(json, 'a.yml').switch, 'on');
  assert.ok(Object.values(json.variables).every((state) => state === 'unset'));
  assert.match(run([], { GH_VARIABLES: '[]' }).out, /^variables: none$/m);
});

test('a rebuild commit is skipped by its trailer and the next commit is reported', (t) => {
  const { run } = fixture(t);
  const { json } = run(['--json']);
  assert.equal(json.newestNonRebuildSha, REAL_SHA);
  assert.match(json.newestNonRebuildReason, new RegExp(REBUILD_SHA));
});

test('no candidate SHA is guessed when every run is a rebuild commit', (t) => {
  const { run } = fixture(t);
  const { json } = run(['--json'], { GH_RUNS: RUNS_REBUILD_ONLY });
  assert.equal(json.newestNonRebuildSha, null);
  assert.equal(json.newestNonRebuildReason, 'no non-rebuild SHA in the last 100 runs');
});

test('--no-gh makes no gh call, reports unknown and still lists every file', (t) => {
  const { run, calls } = fixture(t);
  const result = run(['--json', '--no-gh']);
  assert.equal(result.code, 0);
  assert.equal(result.json.workflows.length, 3);
  assert.equal(row(result.json, 'a.yml').switch, 'unknown');
  assert.equal(row(result.json, 'dependabot-auto-merge.yml').switch, 'on');
  assert.equal(result.json.newestNonRebuildSha, null);
  assert.deepEqual(calls(), []);
});

test('a failing gh degrades to unknown, exits 0 and says why on stderr', (t) => {
  const { run } = fixture(t);
  const result = run(['--json'], { GH_FAIL: 'authentication required' });
  assert.equal(result.code, 0);
  assert.equal(row(result.json, 'a.yml').switch, 'unknown');
  assert.match(result.err, /authentication required/);
});

test('a malformed workflow is named in errors, exits 1 and the other files are still listed', (t) => {
  const { run } = fixture(t, { 'broken.yml': 'jobs: [unclosed\n  - nope: }\n' });
  const result = run(['--json']);
  assert.equal(result.code, 1);
  assert.equal(result.json.errors.length, 1);
  assert.equal(result.json.errors[0].file, 'broken.yml');
  assert.equal(result.json.workflows.length, 3);
  assert.match(result.err, /ERROR: broken\.yml:/);
});

test('an unknown argument exits 2 with the usage line', (t) => {
  const { run } = fixture(t);
  const result = run(['--bogus']);
  assert.equal(result.code, 2);
  assert.match(result.err, /ERROR: unknown argument: --bogus/);
  assert.match(result.err, /Usage:/);
});

test('a report run leaves the repository root byte for byte unchanged', (t) => {
  const { run, snapshot } = fixture(t, { 'partial.yml': WORKFLOW_PARTIAL });
  const before = snapshot();
  assert.equal(run(['--json']).code, 0);
  assert.equal(run([]).code, 0);
  assert.deepEqual(snapshot(), before);
});
