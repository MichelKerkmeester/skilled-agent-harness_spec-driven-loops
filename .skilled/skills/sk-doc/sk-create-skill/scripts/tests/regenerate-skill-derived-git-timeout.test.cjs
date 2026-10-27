#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: regenerate-skill-derived-git-timeout.test
// ───────────────────────────────────────────────────────────────────
'use strict';

/**
 * Covers the bounded check-ignore call in the skill-derived regenerator:
 * fsmonitor is disabled, each call carries a timeout, an error answer keeps the
 * reference, and the first error latches later calls onto that keep answer.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const childProcess = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const MODULE_PATH = path.join(__dirname, '..', 'regenerate-skill-derived.cjs');
const MISSING_ONE = '.skilled/__no_such_file_for_test__.md';
const MISSING_TWO = '.skilled/__no_such_file_for_test__.md.bak';

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// The module destructures spawnSync when it loads, so the patched module has to
// be in place before the cached copy is dropped and re-read.
function loadRegenerator(spawnImpl) {
  const original = childProcess.spawnSync;
  childProcess.spawnSync = spawnImpl;
  delete require.cache[require.resolve(MODULE_PATH)];
  try {
    return require(MODULE_PATH);
  } finally {
    childProcess.spawnSync = original;
  }
}

function timedOut() {
  return {
    error: Object.assign(new Error('t'), { code: 'ETIMEDOUT' }),
    status: null,
    stdout: '',
    stderr: '',
  };
}

function captureStderr(fn) {
  const original = process.stderr.write;
  let text = '';
  process.stderr.write = (chunk) => { text += chunk; return true; };
  try {
    fn();
  } finally {
    process.stderr.write = original;
  }
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('check-ignore disables fsmonitor and carries the git timeout', () => {
  const calls = [];
  const regen = loadRegenerator((command, args, options) => {
    calls.push({ command, args, options });
    return { status: 1, stdout: '', stderr: '' };
  });
  assert.equal(fs.existsSync(path.join(regen.REPO_ROOT, MISSING_ONE)), false);
  assert.equal(regen.keyFileExists(MISSING_ONE), false);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].command, 'git');
  assert.deepEqual(calls[0].args.slice(0, 4), ['-c', 'core.fsmonitor=false', '-C', regen.REPO_ROOT]);
  assert.equal(calls[0].options.timeout, 20000);
});

test('a spawn error keeps a reference that is missing from disk', () => {
  const regen = loadRegenerator(() => timedOut());
  assert.equal(fs.existsSync(path.join(regen.REPO_ROOT, MISSING_ONE)), false);
  let result = null;
  const stderr = captureStderr(() => { result = regen.keyFileExists(MISSING_ONE); });

  assert.equal(result, true);
  assert.match(stderr, /check-ignore failed/);
  assert.match(stderr, /ETIMEDOUT/);
});

test('after one spawn error a second missing reference spawns no further git call', () => {
  const calls = [];
  const regen = loadRegenerator((command, args) => {
    calls.push(args.join(' '));
    return timedOut();
  });
  let first = null;
  let second = null;
  const stderr = captureStderr(() => {
    first = regen.keyFileExists(MISSING_ONE);
    second = regen.keyFileExists(MISSING_TWO);
  });

  assert.equal(first, true);
  assert.equal(second, true);
  assert.equal(calls.length, 1, 'a latched error must not spawn git again');
  assert.equal(stderr.trim().split('\n').length, 1, 'the latch must report exactly once');
});

test('status 1 on a missing path is not ignored', () => {
  const regen = loadRegenerator(() => ({ status: 1, stdout: '', stderr: '' }));
  assert.equal(fs.existsSync(path.join(regen.REPO_ROOT, MISSING_ONE)), false);
  assert.equal(regen.keyFileExists(MISSING_ONE), false);
});
