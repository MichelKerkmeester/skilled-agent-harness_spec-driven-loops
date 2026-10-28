#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Workflow Report Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the report as a process against a throwaway repository root that holds
// three small workflows, a README, a CI profile and a gh stub on PATH, so every verdict
// is read from the same JSON a /doctor route reads. The stub answers only the calls the
// report is allowed to make and fails on anything else. The default fixture profile
// states this repository's conventions, and the foreign fixtures prove that a
// repository with other names, no README and another branch reads clean.

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
const PROFILE_LIB = path.resolve(__dirname, '..', 'lib', 'ci-profile.cjs');
const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const SCRIPT_RELATIVE = '.skilled/commands/doctor/scripts/ci-report.cjs';
const PROFILE_LIB_RELATIVE = '.skilled/commands/doctor/scripts/lib/ci-profile.cjs';

// The conventions the original fixtures were written against: one master switch with
// groups, a switch on every job, the auto-merge exemption, a README and a trailer.
const SKILLED_STYLE_PROFILE = {
  schemaVersion: 1,
  defaultBranch: 'main',
  workflowsReadme: { path: '.github/workflows/README.md', rowTables: ['the contents table'] },
  switch: {
    master: 'SKILLED_CI',
    groups: ['SKILLED_CI_TESTS', 'SKILLED_CI_REPORTS', 'SKILLED_CI_REVIEW', 'SKILLED_CI_FRESHNESS', 'SKILLED_CI_MESSAGES'],
    required: true,
    exempt: ['dependabot-auto-merge.yml'],
  },
  rebuildTrailer: 'Trigger-Index-Rebuild: ci',
};

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
} else if (args === 'repo view --json defaultBranchRef --jq .defaultBranchRef.name') {
  if (!env.GH_DEFAULT_BRANCH) { process.stderr.write('no default branch\\n'); process.exit(1); }
  process.stdout.write(env.GH_DEFAULT_BRANCH + '\\n');
} else if (args === 'run list --branch ' + (env.GH_RUN_BRANCH || 'main') + ' --limit 100 --json headSha,createdAt') {
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

// `workflows` replaces the three default workflows and the README when given, and a
// null profile leaves the repository with no profile at all.
function fixture(t, extraWorkflows = {}, { profile = SKILLED_STYLE_PROFILE, workflows = null, readme = README_TEXT } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-report-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const callLog = path.join(root, 'gh-calls.log');
  fs.writeFileSync(callLog, '');
  fs.mkdirSync(path.dirname(path.join(root, SCRIPT_RELATIVE)), { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(root, SCRIPT_RELATIVE));
  writeFile(root, PROFILE_LIB_RELATIVE, fs.readFileSync(PROFILE_LIB, 'utf8'));
  if (profile) writeFile(root, '.sk-code/ci.json', `${JSON.stringify(profile, null, 2)}\n`);
  if (readme) writeFile(root, '.github/workflows/README.md', readme);
  const base = workflows || {
    'a.yml': WORKFLOW_A,
    'b.yml': WORKFLOW_B,
    'dependabot-auto-merge.yml': WORKFLOW_DEPENDABOT,
  };
  for (const [name, body] of Object.entries({ ...base, ...extraWorkflows })) writeFile(root, `.github/workflows/${name}`, body);
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
  return { root, run, calls, snapshot };
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

// ─────────────────────────────────────────────────────────────────────────────
// 3. THE CI PROFILE
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
  const result = run(['--json'], { GH_VARIABLES: ACME_VARIABLES, GH_DEFAULT_BRANCH: 'trunk', GH_RUN_BRANCH: 'trunk', GH_RUNS: JSON.stringify([{ headSha: REAL_SHA, createdAt: '2026-10-25T09:00:00Z' }]) });
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
  assert.deepEqual(json.profile, { source: 'repo', path: '.sk-code/ci.json' });
  assert.deepEqual(Object.keys(json.variables), ['ACME_CI', 'ACME_CI_TESTS', 'ACME_CI_GATE']);
  assert.deepEqual(row(json, 'tests.yml').groups, ['ACME_CI_TESTS']);
  assert.equal(row(json, 'tests.yml').purpose, 'Runs the tests.');
  assert.deepEqual(row(json, 'gate.yml').flags, ['readme-row-missing']);
  assert.equal(row(json, 'release.yml').switch, 'on');
  assert.ok(!row(json, 'release.yml').flags.includes('switch-missing'));
  assert.ok(calls().includes('run list --branch develop --limit 100 --json headSha,createdAt'));
  assert.ok(!calls().some((call) => call.startsWith('repo view')));
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
  assert.match(run(['--no-gh']).out, /^profile: repo \(\.sk-code\/ci\.json\)$/m);
});
