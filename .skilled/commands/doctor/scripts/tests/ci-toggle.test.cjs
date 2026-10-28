#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Switch Toggle Plan Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the toggle planner as a process with a gh stub on PATH. The stub answers the
// three reads the planner may make (the variable list, the default branch and the
// branch ruleset) and fails on anything else, so a test that ends with no write call
// in the log proves the planner never changed a variable. One fixture is a foreign
// repository with its own switch names, and the last tests run against this
// repository's real workflows and profile with the same stub.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPTS = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(__dirname, '../../../../..');
const SCRIPTS_RELATIVE = '.skilled/commands/doctor/scripts';
const COPIED = ['ci-toggle.cjs', 'ci-report.cjs', 'lib/ci-profile.cjs'];
const PROFILE_RELATIVE = '.skilled/skills/sk-code/sk-code-ci/repository/ci.json';
const REPOSITORY_IDENTITY_RELATIVE = '.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs';

const MESSAGE_CONTEXT = 'Commit messages, branch names and PR description follow the templates';

const ACME_TESTS = `name: Tests
on: push
jobs:
  unit:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_TESTS != 'off'
    runs-on: ubuntu-latest
    steps:
      - run: echo ok
`;

const ACME_GATE = `name: Gate
on: pull_request
jobs:
  gate:
    name: Required gate
    if: vars.ACME_CI != 'off' && vars.ACME_CI_GATE != 'off'
    runs-on: ubuntu-latest
    steps:
      - run: echo ok
`;

const ACME_LINT = `name: Lint
on: push
jobs:
  lint:
    if: vars.ACME_CI != 'off' && vars.ACME_CI_LINT != 'off'
    runs-on: ubuntu-latest
    steps:
      - run: echo ok
`;

const RULESET_REQUIRES = (context) => JSON.stringify([
  { type: 'deletion' },
  { type: 'required_status_checks', parameters: { required_status_checks: [{ context, integration_id: 1 }] } },
]);

const GH_STUB = (callLog) => `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2).join(' ');
fs.appendFileSync(${JSON.stringify(callLog)}, args + '\\n');
const env = process.env;
if (args === 'variable list --json name,value') {
  process.stdout.write(env.GH_VARIABLES || '[]');
} else if (args === 'repo view --json defaultBranchRef --jq .defaultBranchRef.name') {
  process.stdout.write((env.GH_DEFAULT_BRANCH || 'main') + '\\n');
} else if (args === 'api repos/{owner}/{repo}/rules/branches/' + (env.GH_RULES_BRANCH || 'main')) {
  if (env.GH_RULES_FAIL) { process.stderr.write(env.GH_RULES_FAIL + '\\n'); process.exit(1); }
  process.stdout.write(env.GH_RULES || '[]');
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

// A throwaway gh stub directory with its call log, shared by both kinds of fixture.
function ghStub(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-toggle-gh-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const callLog = path.join(dir, 'gh-calls.log');
  fs.writeFileSync(callLog, '');
  writeFile(dir, 'bin/gh', GH_STUB(callLog), 0o755);
  const calls = () => fs.readFileSync(callLog, 'utf8').split('\n').filter(Boolean);
  return { bin: path.join(dir, 'bin'), calls };
}

function runner(script, bin, baseEnv) {
  return (args = [], env = {}) => {
    const result = spawnSync(process.execPath, [script, ...args], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}${path.delimiter}${process.env.PATH}`,
        NODE_PATH: path.join(REPO_ROOT, '.skilled', 'node_modules'),
        ...baseEnv,
        ...env,
      },
    });
    let json = null;
    try { json = JSON.parse(result.stdout); } catch { /* text output */ }
    return { code: result.status, out: result.stdout, err: result.stderr, json };
  };
}

function acmeFixture(t, { profile = null, readme = null } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-toggle-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const rel of COPIED) writeFile(root, `${SCRIPTS_RELATIVE}/${rel}`, fs.readFileSync(path.join(SCRIPTS, rel), 'utf8'));
  writeFile(root, REPOSITORY_IDENTITY_RELATIVE, fs.readFileSync(path.join(REPO_ROOT, REPOSITORY_IDENTITY_RELATIVE), 'utf8'));
  writeFile(root, '.github/workflows/tests.yml', ACME_TESTS);
  writeFile(root, '.github/workflows/gate.yml', ACME_GATE);
  writeFile(root, '.github/workflows/lint.yml', ACME_LINT);
  if (profile) writeFile(root, PROFILE_RELATIVE, JSON.stringify(profile));
  if (readme) writeFile(root, 'CI.md', readme);
  const gh = ghStub(t);
  const run = runner(path.join(root, SCRIPTS_RELATIVE, 'ci-toggle.cjs'), gh.bin, { GH_RULES: RULESET_REQUIRES('Required gate') });
  return { run, calls: gh.calls };
}

function repoFixture(t) {
  const gh = ghStub(t);
  const run = runner(path.join(SCRIPTS, 'ci-toggle.cjs'), gh.bin, { GH_RULES: RULESET_REQUIRES(MESSAGE_CONTEXT) });
  return { run, calls: gh.calls };
}

const WRITES = /^variable (set|delete)\b/;

// ─────────────────────────────────────────────────────────────────────────────
// 2. A FOREIGN REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

test('a foreign switch the workflows use is accepted and planned with its exact command', (t) => {
  const { run, calls } = acmeFixture(t);
  const result = run(['--variable=ACME_CI_TESTS', '--state=off', '--json']);
  assert.equal(result.code, 0, result.err);
  const plan = result.json;
  assert.equal(plan.status, 'PLAN');
  assert.equal(plan.allowlistSource, 'workflows');
  assert.deepEqual(plan.allowlist, ['ACME_CI', 'ACME_CI_GATE', 'ACME_CI_LINT', 'ACME_CI_TESTS']);
  assert.deepEqual(plan.covers, ['tests.yml']);
  assert.equal(plan.command, 'gh variable set ACME_CI_TESTS --body off');
  assert.equal(plan.undo, 'gh variable delete ACME_CI_TESTS');
  assert.equal(plan.secondConfirmation, null);
  assert.ok(!calls().some((call) => WRITES.test(call)));
});

test('the variable behind the status check the live ruleset requires is refused, and so is the switch above it', (t) => {
  const { run, calls } = acmeFixture(t);
  const gate = run(['--variable=ACME_CI_GATE', '--state=off']);
  assert.equal(gate.code, 1);
  assert.match(gate.out, /^REFUSE: ACME_CI_GATE must stay unset while the ruleset requires that context$/m);
  assert.match(gate.out, /^STATUS=FAIL ERROR="refused"$/m);
  const master = run(['--variable=ACME_CI', '--state=off', '--json']);
  assert.equal(master.code, 1);
  assert.equal(master.json.refusals[0].source, 'ruleset');
  assert.ok(calls().includes('api repos/{owner}/{repo}/rules/branches/main'));
  assert.ok(!calls().some((call) => WRITES.test(call)));
});

test('the ruleset is read on the branch the profile names, and the declared master gets the master wording', (t) => {
  const profile = { schemaVersion: 1, defaultBranch: 'develop', switch: { master: 'ACME_CI', groups: ['ACME_CI_TESTS', 'ACME_CI_GATE'] } };
  const { run, calls } = acmeFixture(t, { profile });
  const result = run(['--variable=ACME_CI', '--state=off'], { GH_RULES_BRANCH: 'develop' });
  assert.equal(result.code, 1);
  assert.match(result.out, /^REFUSE: ACME_CI must stay unset because it also skips gate\.yml, the only check the ruleset requires, and a skipped job reports Success$/m);
  assert.ok(calls().includes('api repos/{owner}/{repo}/rules/branches/develop'));
  assert.ok(!calls().some((call) => call.startsWith('repo view')));
  const lint = run(['--variable=ACME_CI_LINT', '--state=off'], { GH_RULES_BRANCH: 'develop' });
  assert.equal(lint.code, 1);
  assert.match(lint.out, /^REFUSE: ACME_CI_LINT is not a documented switch$/m);
});

test('when the ruleset cannot be read the profile neverOff list still refuses', (t) => {
  const profile = { schemaVersion: 1, neverOff: ['ACME_CI_GATE'] };
  const { run } = acmeFixture(t, { profile });
  const result = run(['--variable=ACME_CI_GATE', '--state=off', '--json'], { GH_RULES_FAIL: 'HTTP 403' });
  assert.equal(result.code, 1);
  assert.equal(result.json.requiredChecks.readable, false);
  assert.deepEqual(result.json.refusals.map((refusal) => refusal.source), ['neverOff']);
});

test('a plan to switch off with an unreadable ruleset says the required-check refusal was not applied', (t) => {
  const { run, calls } = acmeFixture(t);
  const result = run(['--variable=ACME_CI_GATE', '--state=off'], { GH_RULES_FAIL: 'HTTP 403: Resource not accessible' });
  assert.equal(result.code, 0, result.err);
  assert.match(result.out, /^SWITCH CHANGE PLAN$/m);
  assert.match(result.out, /^Required checks: not read \(HTTP 403: Resource not accessible\); the ruleset refusal was not applied$/m);
  assert.ok(result.out.indexOf('Required checks:') < result.out.indexOf('STATUS=OK ACTION=plan'));
  const on = run(['--variable=ACME_CI_GATE', '--state=on'], {
    GH_RULES_FAIL: 'HTTP 403',
    GH_VARIABLES: JSON.stringify([{ name: 'ACME_CI_GATE', value: 'off' }]),
  });
  assert.doesNotMatch(on.out, /Required checks:/);
  const readable = run(['--variable=ACME_CI_TESTS', '--state=off']);
  assert.doesNotMatch(readable.out, /Required checks:/);
  assert.ok(!calls().some((call) => WRITES.test(call)));
});

test('a README sentence that keeps a switch unset refuses as the third source', (t) => {
  const profile = { schemaVersion: 1, workflowsReadme: { path: 'CI.md' }, switch: { master: 'ACME_CI', groups: ['ACME_CI_LINT'] } };
  const { run } = acmeFixture(t, { profile, readme: 'ACME_CI_LINT must stay unset until the linter is fixed.\n' });
  const lint = run(['--variable=ACME_CI_LINT', '--state=off', '--json'], { GH_RULES: '[]' });
  assert.equal(lint.code, 1);
  assert.deepEqual(lint.json.refusals.map((refusal) => refusal.source), ['readme']);
  assert.match(lint.json.refusals[0].message, /^REFUSE: ACME_CI_LINT must stay unset, as CI\.md says$/);
  const master = run(['--variable=ACME_CI', '--state=off', '--json'], { GH_RULES: '[]' });
  assert.deepEqual(master.json.refusals.map((refusal) => refusal.source), ['readme']);
});

test('a change to the state the variable already has is refused as a no-op', (t) => {
  const { run } = acmeFixture(t);
  const off = run(['--variable=ACME_CI_TESTS', '--state=off'], { GH_VARIABLES: JSON.stringify([{ name: 'ACME_CI_TESTS', value: 'off' }]) });
  assert.equal(off.code, 0);
  assert.match(off.out, /^DOCTOR TARGET UNCHANGED$/m);
  assert.match(off.out, /^State: off, already as requested$/m);
  const on = run(['--variable=ACME_CI_TESTS', '--state=on', '--json']);
  assert.equal(on.json.status, 'NO_CHANGE');
  assert.equal(on.json.command, null);
});

test('turning a switch back on deletes the variable and needs no ruleset refusal', (t) => {
  const { run } = acmeFixture(t);
  const result = run(['--variable=ACME_CI_GATE', '--state=on', '--json'], { GH_VARIABLES: JSON.stringify([{ name: 'ACME_CI_GATE', value: 'off' }]) });
  assert.equal(result.code, 0);
  assert.equal(result.json.command, 'gh variable delete ACME_CI_GATE');
});

test('a bad argument exits 2 and an invalid profile exits 3', (t) => {
  const { run } = acmeFixture(t, { profile: { schemaVersion: 1, prefix: 'ACME' } });
  const bad = run(['--variable=ACME_CI_TESTS', '--state=maybe']);
  assert.equal(bad.code, 2);
  assert.match(bad.err, /--state must be on or off/);
  const invalid = run(['--variable=ACME_CI_TESTS', '--state=off']);
  assert.equal(invalid.code, 3);
  assert.match(invalid.err, /prefix: is not a known key/);
});

// An ignored profile is the one this repository committed, so the workflows it protects
// and the names it keeps unset go unread here. The line and the refusal keep that from
// being silent, while a change to on only deletes a variable and stays available.
test('a skill-folder profile written for another repository is named and refuses a change to off', (t) => {
  const profile = { schemaVersion: 1, repository: 'someone/else', switch: { master: 'ACME_CI', groups: ['ACME_CI_TESTS'] } };
  const { run, calls } = acmeFixture(t, { profile });
  const env = { GITHUB_REPOSITORY: 'acme/widgets' };
  const line = `Profile: ignored ${PROFILE_RELATIVE}, written for someone/else, this repository is acme/widgets; the protected workflows it lists are not checked`;

  const off = run(['--variable=ACME_CI_TESTS', '--state=off', '--json'], env);
  assert.equal(off.code, 1, off.err);
  assert.deepEqual(off.json.profile, {
    source: 'default',
    path: null,
    ignored: { path: PROFILE_RELATIVE, repository: 'someone/else', current: 'acme/widgets' },
  });
  assert.deepEqual(off.json.refusals.map((refusal) => refusal.source), ['ignored']);
  assert.equal(off.json.command, null);
  const refusedText = run(['--variable=ACME_CI_TESTS', '--state=off'], env).out;
  assert.match(refusedText, /^REFUSE: ACME_CI_TESTS must stay unset because the CI profile was ignored, so the protected workflows cannot be checked: fix its repository field or name it with --profile$/m);
  assert.match(refusedText, /^STATUS=FAIL ERROR="refused"$/m);
  assert.ok(refusedText.includes(line), refusedText);

  const changed = { ...env, GH_VARIABLES: JSON.stringify([{ name: 'ACME_CI_TESTS', value: 'off' }]) };
  const on = run(['--variable=ACME_CI_TESTS', '--state=on', '--json'], changed);
  assert.equal(on.code, 0, on.err);
  assert.equal(on.json.status, 'PLAN');
  assert.equal(on.json.command, 'gh variable delete ACME_CI_TESTS');
  const planText = run(['--variable=ACME_CI_TESTS', '--state=on'], changed).out;
  assert.ok(planText.includes(line), planText);
  assert.ok(planText.indexOf(line) < planText.indexOf('STATUS=OK ACTION=plan'));
  assert.ok(!calls().some((call) => WRITES.test(call)));
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. THIS REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

test('here SKILLED_CI_FRESHNESS off asks for a second named confirmation for the guards it skips', (t) => {
  const { run, calls } = repoFixture(t);
  const result = run(['--variable=SKILLED_CI_FRESHNESS', '--state=off', '--json']);
  assert.equal(result.code, 0, result.err);
  const plan = result.json;
  assert.equal(plan.status, 'PLAN');
  assert.deepEqual(plan.profile, { source: 'repo', path: PROFILE_RELATIVE });
  assert.deepEqual(plan.secondConfirmation.workflows.map((entry) => entry.file).sort(),
    ['dispatch-enforcement-guard.yml', 'gate-inputs.yml', 'naming-standard-guard.yml']);
  assert.ok(plan.secondConfirmation.workflows.every((entry) => entry.role.length > 0));
  assert.match(plan.secondConfirmation.prompt, /^Type SKILLED_CI_FRESHNESS to confirm a second time/);
  const text = run(['--variable=SKILLED_CI_FRESHNESS', '--state=off']).out;
  assert.match(text, /^- gate-inputs\.yml: /m);
  assert.match(text, /^Second confirmation: Type SKILLED_CI_FRESHNESS/m);
  assert.ok(!calls().some((call) => WRITES.test(call)));
});

test('here SKILLED_CI_REPORTS off asks for the second confirmation for the trigger index rebuild', (t) => {
  const { run } = repoFixture(t);
  const plan = run(['--variable=SKILLED_CI_REPORTS', '--state=off', '--json']).json;
  assert.deepEqual(plan.secondConfirmation.workflows.map((entry) => entry.file), ['trigger-index-rebuild.yml']);
  const tests = run(['--variable=SKILLED_CI_TESTS', '--state=off', '--json']).json;
  assert.equal(tests.secondConfirmation, null);
});

test('here the message variable and the master switch keep their refusal wording', (t) => {
  const { run } = repoFixture(t);
  const messages = run(['--variable=SKILLED_CI_MESSAGES', '--state=off']);
  assert.equal(messages.code, 1);
  assert.match(messages.out, /^REFUSE: SKILLED_CI_MESSAGES must stay unset while the ruleset requires that context$/m);
  const master = run(['--variable=SKILLED_CI', '--state=off']);
  assert.equal(master.code, 1);
  assert.match(master.out, /^REFUSE: SKILLED_CI must stay unset because it also skips message-contract\.yml, the only check the ruleset requires, and a skipped job reports Success$/m);
  const offline = run(['--variable=SKILLED_CI_MESSAGES', '--state=off', '--no-gh', '--json']).json;
  assert.deepEqual(offline.refusals.map((refusal) => refusal.source), ['neverOff', 'readme']);
});
