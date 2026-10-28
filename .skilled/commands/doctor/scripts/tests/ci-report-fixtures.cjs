// ───────────────────────────────────────────────────────────────────
// MODULE: CI Report Test Fixtures
// ───────────────────────────────────────────────────────────────────
'use strict';

// Builds the throwaway repository both report suites drive: three small workflows, a
// README, a CI profile and a gh stub on PATH, with the report and every module it loads
// copied in. The stub answers only the calls the report is allowed to make and fails on
// anything else, so a call a flag forbids shows up as a failed run, and its call log
// proves a flag made none. The default profile states this repository's conventions; a
// suite that hands in a foreign one proves a repository with other names, no README and
// another branch reads clean.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { REPO_PROFILE_FILE, REPO_ROOT } = require('../lib/ci-profile.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND COPIED MODULES
// ─────────────────────────────────────────────────────────────────────────────

const SCRIPTS = path.resolve(__dirname, '..');
const REPOSITORY_IDENTITY_LIB = path.resolve(__dirname, '../../../../skills/sk-code/shared/scripts/lib/repository-identity.cjs');
const SCRIPTS_RELATIVE = '.skilled/commands/doctor/scripts';
const SCRIPT_RELATIVE = `${SCRIPTS_RELATIVE}/ci-report.cjs`;
// Every module the report loads, so a copied fixture runs the same code and never
// resolves a module from this worktree, which would read the wrong repository's files.
const REPORT_MODULES = [
  'ci-report.cjs',
  'lib/ci-profile.cjs',
  'lib/ci-report-render.cjs',
  'lib/ci-report-sources.cjs',
  'lib/ci-report-text.cjs',
  'lib/ci-report-workflows.cjs',
];
const REPOSITORY_IDENTITY_RELATIVE = '.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs';
const PROFILE_RELATIVE = REPO_PROFILE_FILE;

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROFILES AND COMMITS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 4. WORKFLOW BODIES
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 5. GH STUB
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// 6. FIXTURE
// ─────────────────────────────────────────────────────────────────────────────

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
  for (const module of REPORT_MODULES) {
    writeFile(root, `${SCRIPTS_RELATIVE}/${module}`, fs.readFileSync(path.join(SCRIPTS, module), 'utf8'));
  }
  writeFile(root, REPOSITORY_IDENTITY_RELATIVE, fs.readFileSync(REPOSITORY_IDENTITY_LIB, 'utf8'));
  if (profile) writeFile(root, PROFILE_RELATIVE, `${JSON.stringify(profile, null, 2)}\n`);
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
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  PROFILE_RELATIVE,
  REAL_SHA,
  REBUILD_SHA,
  RUNS_REBUILD_ONLY,
  SKILLED_STYLE_PROFILE,
  WORKFLOW_PARTIAL,
  WORKFLOW_UNSAFE,
  fixture,
  row,
  writeFile,
};
