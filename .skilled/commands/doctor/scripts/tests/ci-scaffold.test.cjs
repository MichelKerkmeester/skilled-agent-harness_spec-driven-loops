#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Scaffold Template Renderer Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Renders the shipped sk-code-ci templates twice: with this repository's profile, where
// every convention the scaffold always carried must still be in the file, and in a
// foreign repository, where none of this repository's names may appear.
//
// Both renders run on a copied tree. The profile this repository commits ships inside the
// skill folder, so the first render copies it verbatim and names the repository it was
// written for, and gives the same answer in a host that vendors these files.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const YAML = require('yaml');

const SCRIPTS = path.resolve(__dirname, '..');
const { REPO_PROFILE_FILE, REPO_ROOT } = require('../lib/ci-profile.cjs');
const ASSETS_RELATIVE = '.skilled/skills/sk-code/sk-code-ci/assets';
const SCRIPTS_RELATIVE = '.skilled/commands/doctor/scripts';
const PROFILE_RELATIVE = REPO_PROFILE_FILE;
const REPOSITORY_IDENTITY_RELATIVE = '.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs';

// Any directive the renderer failed to consume.
const UNFILLED_SLOT = /<<[#^/=!]?[A-Za-z]/;

// Every name this repository's own profile supplies. A foreign render that prints one
// of them would hand another repository this repository's conventions.
const SKILLED_TEXT = /SKILLED|\.skilled|\.opencode|skilled\/\*\*|actions\/setup|README|bun-version/;

function writeFile(root, rel, body) {
  const abs = path.join(root, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, body);
}

function render(script, args = [], env = {}) {
  const result = spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    env: { ...process.env, NODE_PATH: path.join(REPO_ROOT, '.skilled', 'node_modules'), ...env },
  });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

function foreignFixture(t, profile, env = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-scaffold-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const rel of ['ci-scaffold.cjs', 'lib/ci-profile.cjs']) {
    writeFile(root, `${SCRIPTS_RELATIVE}/${rel}`, fs.readFileSync(path.join(SCRIPTS, rel), 'utf8'));
  }
  writeFile(root, REPOSITORY_IDENTITY_RELATIVE, fs.readFileSync(path.join(REPO_ROOT, REPOSITORY_IDENTITY_RELATIVE), 'utf8'));
  for (const name of ['workflow-template.yml', 'job-block-template.yml']) {
    writeFile(root, `${ASSETS_RELATIVE}/${name}`, fs.readFileSync(path.join(REPO_ROOT, ASSETS_RELATIVE, name), 'utf8'));
  }
  if (profile) writeFile(root, PROFILE_RELATIVE, typeof profile === 'string' ? profile : JSON.stringify(profile));
  return (args) => render(path.join(root, SCRIPTS_RELATIVE, 'ci-scaffold.cjs'), args, env);
}

// The committed profile, as it ships. The repository it names is set for the render, so a
// CI job in another repository, which sets its own name, cannot make the copy ignore it.
const SHIPPED_PROFILE = fs.readFileSync(path.join(REPO_ROOT, PROFILE_RELATIVE), 'utf8');

function skilledFixture(t) {
  return foreignFixture(t, SHIPPED_PROFILE, { GITHUB_REPOSITORY: JSON.parse(SHIPPED_PROFILE).repository });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. THIS REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

test('here the workflow render keeps every convention the scaffold always carried', (t) => {
  const { code, out, err } = skilledFixture(t)([]);
  assert.equal(code, 0, err);
  assert.doesNotMatch(out, UNFILLED_SLOT);
  assert.ok(out.endsWith('\n'));
  for (const line of [
    "    branches: [main, 'skilled/**']",
    '    branches: [main]',
    "    if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_TESTS != 'off'",
    '    # entry that names .skilled/ needs its .opencode/ twin in the same filter, and a',
    '    # group variable that matches the job: TESTS, REPORTS, REVIEW, FRESHNESS or MESSAGES.',
    '# branch push run is never cancelled. Switch the value to true to cancel on main too.',
    '      # A job that imports built trees calls the composite setup action here instead of',
    '# Required last step: add one row for this workflow to .github/workflows/README.md, in the',
    '# contents table and in the push versus pull-request table.',
  ]) assert.ok(out.split('\n').includes(line), line);
  assert.equal(YAML.parse(out).jobs.example['timeout-minutes'], 10);
});

// The quality gate parses every changed YAML file, so a template that stopped parsing
// would block every change that touches it.
test('both templates parse as YAML before they are rendered', () => {
  for (const name of ['workflow-template.yml', 'job-block-template.yml']) {
    YAML.parse(fs.readFileSync(path.join(REPO_ROOT, ASSETS_RELATIVE, name), 'utf8'));
  }
});

test('here the job render calls the setup action with its input and the chosen group', (t) => {
  const { code, out } = skilledFixture(t)(['--job', '--group=FRESHNESS']);
  assert.equal(code, 0);
  const job = YAML.parse(out).jobs.example;
  assert.equal(job.if, "vars.SKILLED_CI != 'off' && vars.SKILLED_CI_FRESHNESS != 'off'");
  const setup = job.steps.find((step) => step.uses === './.github/actions/setup');
  assert.deepEqual(setup.with, { cache: 'true' });
  assert.ok(out.includes('      # to force a cold provision. bun-version is the only other input.\n'));
});

test('--protected lists the profile protected workflows here and nothing for the generic default', (t) => {
  const here = skilledFixture(t)(['--protected']);
  assert.equal(here.code, 0);
  assert.deepEqual(here.out.trim().split('\n'), ['gate-inputs.yml', 'trigger-index-rebuild.yml', 'dispatch-enforcement-guard.yml', 'naming-standard-guard.yml', 'message-contract.yml']);
  const foreign = foreignFixture(t, null)(['--protected']);
  assert.equal(foreign.code, 0);
  assert.equal(foreign.out, '');
});

test('an unknown group exits 2 and names the groups the profile has', (t) => {
  const { code, err } = skilledFixture(t)(['--group=NIGHTLY']);
  assert.equal(code, 2);
  assert.match(err, /--group=NIGHTLY is not a switch group in the CI profile \(SKILLED_CI_TESTS, /);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. A FOREIGN REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

test('a foreign profile renders its own switch and branch and no name of this repository', (t) => {
  const run = foreignFixture(t, {
    schemaVersion: 1,
    defaultBranch: 'trunk',
    integrationBranches: ['trunk', 'release/*'],
    switch: { master: 'ACME_CI', groups: ['ACME_CI_TESTS', 'ACME_CI_GATE'] },
    timeoutFloorMinutes: 15,
  });
  for (const args of [[], ['--job'], ['--group=GATE']]) {
    const { code, out, err } = run(args);
    assert.equal(code, 0, err);
    assert.doesNotMatch(out, SKILLED_TEXT, args.join(' '));
    assert.doesNotMatch(out, UNFILLED_SLOT);
    YAML.parse(out);
  }
  const workflow = YAML.parse(run([]).out);
  assert.deepEqual(workflow.on.push.branches, ['trunk', 'release/*']);
  assert.deepEqual(workflow.on.pull_request.branches, ['trunk']);
  assert.equal(workflow.jobs.example.if, "vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'");
  assert.equal(workflow.jobs.example['timeout-minutes'], 15);
  assert.match(run([]).out, /group variable that matches the job: TESTS or GATE\./);
});

test('with no profile the render forces no switch, no branch filter and no README step', (t) => {
  const run = foreignFixture(t, null);
  const { code, out } = run([]);
  assert.equal(code, 0);
  assert.doesNotMatch(out, SKILLED_TEXT);
  const workflow = YAML.parse(out);
  assert.equal(workflow.jobs.example.if, undefined);
  assert.equal(workflow.on.push, null);
  assert.equal(workflow.on.pull_request, null);
  assert.match(out, /cancel on the default branch too/);
});
