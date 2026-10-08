#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Git Hook Gate Settings Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the gate settings script as a process against throwaway repositories with
// an isolated global config, and proves the hook helper reads what it writes.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'git-hook-gates.cjs');
const HELPER = path.resolve(__dirname, '../../../../scripts/git-hooks/lib/gate-config.sh');

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-hook-gates-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const repo = path.join(dir, 'repo');
  const global = path.join(dir, 'global.gitconfig');
  fs.writeFileSync(global, '');
  const env = { ...process.env, GIT_CONFIG_GLOBAL: global, GIT_CONFIG_NOSYSTEM: '1' };
  for (const name of Object.keys(env)) if (/^(GIT_DIR|GIT_WORK_TREE|GIT_CONFIG_COUNT|SPECKIT_SKIP_|SPECKIT_ALLOW_)/.test(name)) delete env[name];
  execFileSync('git', ['init', '-q', repo], { env });
  const run = (...args) => {
    const r = spawnSync(process.execPath, [SCRIPT, ...args, '--repo', repo], { encoding: 'utf8', env });
    return { code: r.status, out: r.stdout, err: r.stderr };
  };
  const config = (...args) => spawnSync('git', ['-C', repo, 'config', ...args], { encoding: 'utf8', env }).stdout.trim();
  return { repo, global, env, run, config };
}

const gate = (out, key) => JSON.parse(out.slice(0, out.lastIndexOf('STATUS='))).gates.find((g) => g.key === key);

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('list reports every registered gate, all on in a fresh repository', (t) => {
  const f = fixture(t);
  const r = f.run('list');
  assert.equal(r.code, 0);
  assert.match(r.out, /STATUS=OK GATES=13 OFF=0/);
  assert.match(r.out, /\| cardSync \| pre-commit \| - \| - \| on \(default\) \|/);
  assert.match(r.out, /\| remotePush \| pre-push \| - \| - \| per push only \|/);
});

test('set is a dry run until --apply', (t) => {
  const f = fixture(t);
  const dry = f.run('set', 'cardSync', 'off');
  assert.equal(dry.code, 0);
  assert.match(dry.out, /Would run: git config --local --replace-all speckit\.hooks\.cardSync off/);
  assert.match(dry.out, /STATUS=OK MODE=DRY_RUN/);
  assert.equal(f.config('--get', 'speckit.hooks.cardSync'), '');
});

test('an applied off is what the hook helper reads', (t) => {
  const f = fixture(t);
  assert.equal(f.run('set', 'cardSync', 'off', '--apply').code, 0);
  assert.equal(f.config('--local', '--get', 'speckit.hooks.cardSync'), 'off');
  assert.equal(gate(f.run('list', '--json').out, 'cardSync').effective.state, 'off');
  const hook = spawnSync('bash', ['-c', `. "${HELPER}"; gate_config_apply pre-commit 2>/dev/null; printf '%s' "\${SPECKIT_SKIP_CARD_SYNC:-unset}"`],
    { cwd: f.repo, encoding: 'utf8', env: f.env });
  assert.equal(hook.stdout, '1');
});

test('on removes a local off, and writes an explicit local on over a global off', (t) => {
  const f = fixture(t);
  f.run('set', 'specRemint', 'off', '--apply');
  const unset = f.run('set', 'specRemint', 'on', '--apply');
  assert.match(unset.out, /--unset-all speckit\.hooks\.specRemint/);
  assert.equal(f.config('--local', '--get', 'speckit.hooks.specRemint'), '');

  f.run('set', 'specRemint', 'off', '--scope', 'global', '--apply');
  assert.match(fs.readFileSync(f.global, 'utf8'), /specRemint = off/);
  const override = f.run('set', 'specRemint', 'on', '--apply');
  assert.match(override.out, /--local --replace-all speckit\.hooks\.specRemint on/);
  assert.deepEqual(gate(f.run('list', '--json').out, 'specRemint').effective, { state: 'on', from: 'local config' });
});

test('a global on reports that a local off still wins', (t) => {
  const f = fixture(t);
  f.run('set', 'routeRemint', 'off', '--apply');
  f.run('set', 'routeRemint', 'off', '--scope', 'global', '--apply');
  const r = f.run('set', 'routeRemint', 'on', '--scope', 'global', '--apply');
  assert.match(r.out, /local config still switches this gate off/);
});

test('refuses unknown keys, per-push approvals and bad arguments without writing', (t) => {
  const f = fixture(t);
  for (const args of [['set', 'nope', 'off'], ['set', 'remotePush', 'off'], ['set', 'massDeletion', 'off'],
    ['set', 'cardSync', 'maybe'], ['set', 'cardSync', 'off', '--scope', 'system'], ['frobnicate']]) {
    const r = f.run(...args, '--apply');
    assert.equal(r.code, 2, args.join(' '));
    assert.match(r.out, /STATUS=FAIL/);
  }
  assert.equal(f.config('--get-regexp', '^speckit\\.hooks\\.'), '');
});
