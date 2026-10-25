#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Workflow Report Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the report as a process against a throwaway repository root that holds
// three small workflows, a README and a gh stub on PATH, so every verdict is read
// from the same JSON a /doctor route reads. The stub answers only the calls the
// report is allowed to make and fails on anything else.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'ci-report.cjs');
const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const SCRIPT_RELATIVE = '.skilled/commands/doctor/scripts/ci-report.cjs';

const REBUILD_SHA = 'a'.repeat(40);
const REAL_SHA = 'b'.repeat(40);

const VARIABLES_TESTS_OFF = JSON.stringify([{ name: 'SKILLED_CI_TESTS', value: 'off' }]);
const RUNS_AFTER_REBUILD = JSON.stringify([
  { headSha: REAL_SHA, createdAt: '2026-10-25T09:00:00Z' },
  { headSha: REBUILD_SHA, createdAt: '2026-10-25T10:00:00Z' },
  { headSha: REBUILD_SHA, createdAt: '2026-10-25T09:59:00Z' },
]);
const RUNS_REBUILD_ONLY = JSON.stringify([{ headSha: REBUILD_SHA, createdAt: '2026-10-25T10:00:00Z' }]);

const README_TEXT = [
  '# Workflows',
  '',
  '| Workflow | Responsibility |',
  '|---|---|',
  '| `a.yml` | Checks the first thing. It has a second sentence. |',
  '| `b.yml` | Checks the second thing. |',
  '| `dependabot-auto-merge.yml` | Merges the safe updates. |',
  '',
].join('\n');

const WORKFLOW_A = `name: A
on:
  push:
    paths: ['src/**']
  pull_request:
permissions:
  contents: read
concurrency:
  group: a
jobs:
  check:
    if: github.event_name == 'push' && vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1
`;

const WORKFLOW_B = `name: B
on: push
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: echo ok
`;

const WORKFLOW_DEPENDABOT = `name: Dependabot
on: pull_request
permissions:
  contents: read
concurrency:
  group: d
jobs:
  merge:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - run: echo ok
`;

// Two jobs with the group variable the stub switches off: one reads it through a
// quoted expression string, the other through a folded block on a different group.
const WORKFLOW_PARTIAL = `name: Partial
on: push
permissions:
  contents: read
concurrency:
  group: p
jobs:
  quoted:
    if: "\${{ (vars.SKILLED_CI != 'off') && (vars.SKILLED_CI_TESTS != 'off') && (github.event_name == 'push') }}"
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
  folded:
    if: >-
      vars.SKILLED_CI != 'off' &&
      vars.SKILLED_CI_REPORTS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - run: echo ok
`;

// A pull_request_target trigger, an action pinned to a tag and a run block that
// interpolates a free-text event field: the three shapes the standards forbid.
const WORKFLOW_UNSAFE = `name: Unsafe
on:
  pull_request_target:
permissions:
  contents: read
concurrency:
  group: u
jobs:
  check:
    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: echo "\${{ github.event.pull_request.title }}"
`;

// The stub is a node script so the answers can come from the environment. It logs
// every call, so a test can prove that a flag made none.
const GH_STUB = (callLog) => `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2).join(' ');
fs.appendFileSync(${JSON.stringify(callLog)}, args + '\\n');
const env = process.env;
if (args === 'variable list --json name,value') {
  if (env.GH_FAIL) { process.stderr.write(env.GH_FAIL + '\\n'); process.exit(1); }
  process.stdout.write(env.GH_VARIABLES || '[]');
} else if (args === 'run list --branch main --limit 100 --json headSha,createdAt') {
  process.stdout.write(env.GH_RUNS || '[]');
} else if (args === 'api repos/{owner}/{repo}/commits/${REBUILD_SHA} --jq .commit.message') {
  process.stdout.write('chore: rebuild the trigger index\\n\\nTrigger-Index-Rebuild: ci\\n');
} else if (args === 'api repos/{owner}/{repo}/commits/${REAL_SHA} --jq .commit.message') {
  process.stdout.write('fix: a real change\\n');
} else {
  process.stderr.write('unexpected gh call: ' + args + '\\n');
  process.exit(1);
}
`;

function writeFile(root, rel, body, mode) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body, mode ? { mode } : undefined);
}

function fixture(t, extraWorkflows = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-report-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const callLog = path.join(root, 'gh-calls.log');
  fs.writeFileSync(callLog, '');
  fs.mkdirSync(path.dirname(path.join(root, SCRIPT_RELATIVE)), { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(root, SCRIPT_RELATIVE));
  writeFile(root, '.github/workflows/README.md', README_TEXT);
  writeFile(root, '.github/workflows/a.yml', WORKFLOW_A);
  writeFile(root, '.github/workflows/b.yml', WORKFLOW_B);
  writeFile(root, '.github/workflows/dependabot-auto-merge.yml', WORKFLOW_DEPENDABOT);
  for (const [name, body] of Object.entries(extraWorkflows)) writeFile(root, `.github/workflows/${name}`, body);
  writeFile(root, 'bin/gh', GH_STUB(callLog), 0o755);

  const run = (args = [], env = {}) => {
    const result = spawnSync(process.execPath, [path.join(root, SCRIPT_RELATIVE), ...args], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}`,
        NODE_PATH: path.join(REPO_ROOT, '.skilled', 'node_modules'),
        GH_VARIABLES: VARIABLES_TESTS_OFF,
        GH_RUNS: RUNS_AFTER_REBUILD,
        ...env,
      },
    });
    let json = null;
    try { json = JSON.parse(result.stdout); } catch { /* table or empty output */ }
    return { code: result.status, out: result.stdout, err: result.stderr, json };
  };
  const calls = () => fs.readFileSync(callLog, 'utf8').split('\n').filter(Boolean);

  // Every file under the root except the stub's own call log, keyed by path.
  const snapshot = () => {
    const files = {};
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(abs);
        else if (abs !== callLog) files[path.relative(root, abs)] = fs.readFileSync(abs, 'utf8');
      }
    };
    walk(root);
    return files;
  };
  return { run, calls, snapshot };
}

const row = (report, file) => report.workflows.find((workflow) => workflow.file === file);

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
