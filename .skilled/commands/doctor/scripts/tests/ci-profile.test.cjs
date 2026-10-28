#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: CI Repository Profile Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Holds the profile loader to its contract: the discovery order, the generic default
// that forces nothing, the strict schema and this repository's committed profile,
// which carries every protection the CI routes enforce here.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const {
  DEFAULT_PROFILE,
  ProfileError,
  REPO_PROFILE_FILE,
  loadProfile,
  normalizeProfile,
  validateProfile,
} = require('../lib/ci-profile.cjs');

const REPO_ROOT = path.resolve(__dirname, '../../../../..');

function tempRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ci-profile-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function writeProfile(root, rel, value) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
  return file;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DISCOVERY AND THE DEFAULT
// ─────────────────────────────────────────────────────────────────────────────

test('a repository with no profile gets the generic default, which forces nothing', (t) => {
  const loaded = loadProfile({ root: tempRoot(t), git: false });
  assert.equal(loaded.source, 'default');
  assert.equal(loaded.path, null);
  assert.deepEqual(loaded.errors, []);
  assert.deepEqual(loaded.profile, { ...DEFAULT_PROFILE, switch: { ...DEFAULT_PROFILE.switch } });
  assert.equal(loaded.profile.switch.required, false);
  assert.equal(loaded.profile.workflowsReadme, null);
  assert.equal(loaded.profile.defaultBranch, null);
});

test('--profile outranks the committed file, and a key it leaves out takes the default', (t) => {
  const root = tempRoot(t);
  writeProfile(root, REPO_PROFILE_FILE, { schemaVersion: 1, defaultBranch: 'main' });
  writeProfile(root, 'other.json', { schemaVersion: 1, defaultBranch: 'trunk', switch: { master: 'ACME_CI' } });
  const loaded = loadProfile({ cliPath: 'other.json', cwd: root, root, git: false });
  assert.equal(loaded.source, 'cli');
  assert.equal(loaded.profile.defaultBranch, 'trunk');
  assert.deepEqual(loaded.profile.switch, { master: 'ACME_CI', groups: [], required: false, exempt: [] });
  assert.equal(loaded.profile.timeoutFloorMinutes, 10);
});

test('a named path that does not exist throws instead of falling back', (t) => {
  const root = tempRoot(t);
  writeProfile(root, REPO_PROFILE_FILE, { schemaVersion: 1 });
  assert.throws(() => loadProfile({ cliPath: 'missing.json', cwd: root, root, git: false }),
    (error) => error instanceof ProfileError && error.code === 'PROFILE_PATH_MISSING');
});

// A repository copies the template to start its own profile, so the copy must load
// as the default and change nothing until a key is filled in.
test('the shipped template validates and reads as the generic default', () => {
  const template = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, '.skilled/skills/sk-code/sk-code-ci/assets/ci-profile.template.json'), 'utf8'));
  assert.deepEqual(validateProfile(template), []);
  assert.deepEqual(normalizeProfile(template), normalizeProfile(null));
  assert.deepEqual(Object.keys(template), Object.keys(DEFAULT_PROFILE));
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

test('an unknown key at any level, a wrong schema version and a bad name are all named', () => {
  const fields = validateProfile({
    schemaVersion: 2,
    branch: 'main',
    switch: { master: 'acme', groups: ['OK_NAME'], mode: 'x' },
    protected: [{ file: 'gate.yml', role: 'It gates.', owner: 'me' }],
    setupAction: { uses: './setup', cache: true },
  }).map((fault) => fault.field);
  assert.deepEqual(fields.sort(), ['branch', 'protected[0].owner', 'schemaVersion', 'setupAction.cache', 'switch.master', 'switch.mode'].sort());
});

test('a protected entry needs a role, and a path twin needs two roots that end in a slash', () => {
  const messages = validateProfile({
    schemaVersion: 1,
    protected: [{ file: 'gate.yml' }],
    pathTwins: [['src/', 'mirror']],
  }).map((fault) => fault.message);
  assert.ok(messages.some((message) => message.startsWith('protected[0].role:')));
  assert.ok(messages.some((message) => message.startsWith('pathTwins[0]:')));
});

test('a file that does not parse comes back as an error and no profile', (t) => {
  const root = tempRoot(t);
  writeProfile(root, REPO_PROFILE_FILE, '{ "schemaVersion": 1,');
  const loaded = loadProfile({ root, git: false });
  assert.equal(loaded.profile, null);
  assert.match(loaded.errors[0].message, /does not parse as JSON/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. THIS REPOSITORY'S PROFILE
// ─────────────────────────────────────────────────────────────────────────────

// Deleting the file or dropping an entry would apply the generic default here, which
// lets a single yes switch off a guard, so the protections are pinned one by one.
test('this repository commits its CI profile and it keeps every protection', () => {
  assert.ok(fs.existsSync(path.join(REPO_ROOT, REPO_PROFILE_FILE)), `${REPO_PROFILE_FILE} is missing`);
  const loaded = loadProfile({ root: REPO_ROOT, git: false });
  assert.equal(loaded.source, 'repo');
  assert.deepEqual(loaded.errors, []);
  const { profile } = loaded;
  assert.equal(profile.defaultBranch, 'main');
  assert.deepEqual(profile.integrationBranches, ['main', 'skilled/**']);
  assert.equal(profile.switch.master, 'SKILLED_CI');
  assert.deepEqual(profile.switch.groups, ['SKILLED_CI_TESTS', 'SKILLED_CI_REPORTS', 'SKILLED_CI_REVIEW', 'SKILLED_CI_FRESHNESS', 'SKILLED_CI_MESSAGES']);
  assert.equal(profile.switch.required, true);
  assert.deepEqual(profile.switch.exempt, ['dependabot-auto-merge.yml']);
  for (const name of ['SKILLED_CI', 'SKILLED_CI_MESSAGES']) assert.ok(profile.neverOff.includes(name), `neverOff lost ${name}`);
  const protectedFiles = profile.protected.map((entry) => entry.file);
  for (const file of ['gate-inputs.yml', 'trigger-index-rebuild.yml', 'dispatch-enforcement-guard.yml', 'naming-standard-guard.yml', 'message-contract.yml']) {
    assert.ok(protectedFiles.includes(file), `protected lost ${file}`);
  }
  assert.deepEqual(profile.pathTwins, [['.skilled/', '.opencode/']]);
  assert.equal(profile.workflowsReadme.path, '.github/workflows/README.md');
  assert.equal(profile.rebuildTrailer, 'Trigger-Index-Rebuild: ci');
  assert.equal(profile.setupAction.uses, './.github/actions/setup');
  assert.equal(profile.timeoutFloorMinutes, 10);
});
