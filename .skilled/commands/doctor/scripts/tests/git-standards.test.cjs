#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Git Standards Override Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the standards script as a process against throwaway repositories, and
// checks every change against the sk-git validator the gates themselves call.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'git-standards.cjs');
const SKGIT = path.resolve(__dirname, '../../../../skills/sk-git');
const VALIDATOR = path.join(SKGIT, 'scripts/validate-message.mjs');
const SHIPPED = path.join(SKGIT, 'assets');
const FILES = { commit: 'commit-message-template.md', pr: 'pr-template.md', branch: 'worktree-checklist.md' };

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-standards-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, 'repo');
  const env = { ...process.env, GIT_CONFIG_GLOBAL: path.join(dir, 'global.gitconfig'), GIT_CONFIG_NOSYSTEM: '1' };
  delete env.GIT_DIR;
  delete env.GIT_WORK_TREE;
  fs.writeFileSync(env.GIT_CONFIG_GLOBAL, '');
  execFileSync('git', ['init', '-q', repo], { env });
  const run = (...args) => {
    const r = spawnSync(process.execPath, [SCRIPT, ...args, '--repo', repo], { encoding: 'utf8', env });
    return { code: r.status, out: r.stdout, err: r.stderr };
  };
  const explain = () => spawnSync(process.execPath, [VALIDATOR, '--explain', '--repo', repo], { encoding: 'utf8', env }).stdout;
  const override = (kind) => path.join(repo, '.sk-git', FILES[kind]);
  return { repo, env, run, explain, override };
}

function changedLines(a, b) {
  const x = a.split('\n');
  const y = b.split('\n');
  assert.equal(x.length, y.length, 'line count changed');
  return x.filter((line, i) => line !== y[i]).length;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('a repository with no templates reports no rules', (t) => {
  const f = fixture(t);
  const r = f.run('status');
  assert.equal(r.code, 0);
  assert.match(r.out, /Rules: none/);
  assert.match(r.out, /STATUS=OK SOURCE="none"/);
});

test('init is a dry run until --apply, copies the shipped templates, and never overwrites', (t) => {
  const f = fixture(t);
  assert.match(f.run('init').out, /Would copy: \.sk-git\/commit-message-template\.md/);
  assert.equal(fs.existsSync(path.join(f.repo, '.sk-git')), false);

  assert.equal(f.run('init', '--apply').code, 0);
  for (const [kind, name] of Object.entries(FILES)) {
    assert.equal(fs.readFileSync(f.override(kind), 'utf8'), fs.readFileSync(path.join(SHIPPED, name), 'utf8'));
  }
  fs.appendFileSync(f.override('commit'), '\nlocal note\n');
  assert.match(f.run('init', '--apply').out, /Keep: \.sk-git\/commit-message-template\.md \(already present/);
  assert.match(fs.readFileSync(f.override('commit'), 'utf8'), /local note/);
});

test('the shipped templates are never edited', (t) => {
  const f = fixture(t);
  const assets = path.join(f.repo, '.skilled/skills/sk-git/assets');
  fs.mkdirSync(assets, { recursive: true });
  for (const name of Object.values(FILES)) fs.copyFileSync(path.join(SHIPPED, name), path.join(assets, name));
  const before = fs.readFileSync(path.join(assets, FILES.commit), 'utf8');
  for (const args of [['set', 'commit', 'subject.maxLength', '90'], ['disable', 'commit']]) {
    const r = f.run(...args, '--apply');
    assert.equal(r.code, 2);
    assert.match(r.out, /shipped sk-git templates.*Run init/);
  }
  assert.equal(fs.readFileSync(path.join(assets, FILES.commit), 'utf8'), before);
});

test('set changes only the edited line and the gates enforce the new value', (t) => {
  const f = fixture(t);
  f.run('init', '--apply');
  const before = fs.readFileSync(f.override('commit'), 'utf8');
  const r = f.run('set', 'commit', 'subject.maxLength', '90', '--apply');
  assert.equal(r.code, 0);
  assert.match(r.out, /subject\.maxLength: 100 -> 90/);
  assert.match(r.out, /Prose to update: prose states 100 characters/);
  const after = fs.readFileSync(f.override('commit'), 'utf8');
  assert.equal(changedLines(before, after), 1);

  const subject = `feat(core): ${'a'.repeat(85)}`;
  const msg = path.join(f.repo, 'msg');
  fs.writeFileSync(msg, `${subject}\n\nWhy this changes.\n`);
  const v = spawnSync(process.execPath, [VALIDATOR, '--commit', msg, '--repo', f.repo, '--json'], { encoding: 'utf8', env: f.env });
  assert.match(v.stdout, /subject\.max-length/);
});

test('set refuses a value the validator rejects and writes nothing', (t) => {
  const f = fixture(t);
  f.run('init', '--apply');
  const before = fs.readFileSync(f.override('commit'), 'utf8');
  for (const args of [['subject.maxLength', '72'], ['subject.types', '"feat"'], ['subject.unknownKey', 'true'], ['kind', '"pr"'], ['subject.maxLength', 'notjson']]) {
    const r = f.run('set', 'commit', ...args, '--apply');
    assert.equal(r.code, 2, args.join(' '));
  }
  assert.equal(fs.readFileSync(f.override('commit'), 'utf8'), before);
});

test('set null removes a key and reports the rule it switches off', (t) => {
  const f = fixture(t);
  f.run('init', '--apply');
  const r = f.run('set', 'commit', 'trailers.spec.mustExist', 'null', '--apply');
  assert.equal(r.code, 0);
  assert.match(r.out, /Rules switched off: trailer\.spec-exists/);
  assert.doesNotMatch(fs.readFileSync(f.override('commit'), 'utf8'), /"mustExist"/);
});

test('disable stops enforcement of one kind and leaves the others', (t) => {
  const f = fixture(t);
  f.run('init', '--apply');
  assert.match(f.run('disable', 'pr').out, /Would remove: lines/);
  assert.match(f.explain(), /pr\s+enforced from/);
  assert.equal(f.run('disable', 'pr', '--apply').code, 0);
  const explained = f.explain();
  assert.match(explained, /pr\s+not enforced/);
  assert.match(explained, /commit\s+enforced from/);
  assert.equal(f.run('disable', 'pr', '--apply').code, 2);
});

test('check passes a fresh copy, reports drift, and fails a broken block', (t) => {
  const f = fixture(t);
  f.run('init', '--apply');
  assert.equal(f.run('check').code, 0);
  f.run('set', 'commit', 'subject.maxLength', '90', '--apply');
  const drift = f.run('check');
  assert.equal(drift.code, 1);
  assert.match(drift.out, /STATUS=DRIFT/);
  const file = f.override('branch');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('"kind": "branch",', '"kind": "branch",,'));
  assert.equal(f.run('check').code, 2);
});

test('the shipped rules blocks round-trip through the layout serializer', () => {
  // A layout change in a shipped block would make every set rewrite the whole block.
  const { serialize } = require(SCRIPT);
  for (const [kind, name] of Object.entries(FILES)) {
    const markdown = fs.readFileSync(path.join(SHIPPED, name), 'utf8');
    const rules = markdown.slice(markdown.search(/^#{1,6}\s+.*\bEnforced rules\b/im));
    const json = rules.match(/```json\n([\s\S]*?)\n```/)[1];
    const { text, reformatted } = serialize(JSON.parse(json), json);
    assert.equal(reformatted, false, kind);
    assert.equal(text, json, kind);
  }
});

test('a configured contract dir outranks .sk-git and init says so', (t) => {
  const f = fixture(t);
  const elsewhere = path.join(f.repo, 'rules');
  fs.mkdirSync(elsewhere);
  execFileSync('git', ['-C', f.repo, 'config', '--local', 'skgit.contractDir', 'rules'], { env: f.env });
  assert.match(f.run('init').out, /skgit\.contractDir points at .*rules, which outranks \.sk-git\//);
});
