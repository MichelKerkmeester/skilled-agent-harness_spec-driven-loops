#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: UNKNOWN-FLAG REJECTION                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Proves each CLI front door refuses a misspelled or unknown option instead of
// silently absorbing or ignoring it: an unknown flag exits non-zero (2, or 1
// for speckit-completion) and names the offending token. It also pins the two
// boundaries of that rule: a value that merely looks like a flag (a prompt's
// value) stays a value, and the valid --all flag keeps working.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO = path.resolve(__dirname, '..', '..', '..');
const CHECK_AGENT_MIRROR_SYNC = path.join(REPO, '.skilled', 'bin', 'check-agent-mirror-sync.cjs');
const SPECKIT_COMPLETION = path.join(REPO, '.skilled', 'bin', 'speckit-completion.cjs');
const COMPILED_ROUTE = path.join(REPO, '.skilled', 'bin', 'compiled-route.cjs');
const COMPILED_ROUTE_GUARD = path.join(REPO, '.skilled', 'bin', 'compiled-route-guard.cjs');
const COMPILED_ROUTE_STATUS = path.join(REPO, '.skilled', 'bin', 'compiled-route-status.cjs');
const PARENT_SKILL_CHECK = path.join(REPO, '.skilled', 'commands', 'doctor', 'scripts', 'parent-skill-check.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Compiled routing is default-on; clear the flag so an operator's shell cannot
// change what these front doors do under the test.
function run(script, args, cwd) {
  const env = { ...process.env };
  delete env.SPECKIT_COMPILED_ROUTING;
  return spawnSync(process.execPath, [script, ...args], {
    encoding: 'utf8',
    env,
    cwd: cwd || REPO,
    timeout: 120000,
  });
}

// A rejected flag may be reported on either stream, so a verdict is read from both.
function both(result) {
  return `${result.stdout || ''}\n${result.stderr || ''}`;
}

function assertNamesFlag(result, flag) {
  assert.ok(both(result).includes(flag), `output must name ${flag}, got:\n${both(result)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('check-agent-mirror-sync.cjs rejects an unknown option --bogus-xyz', () => {
  const result = run(CHECK_AGENT_MIRROR_SYNC, ['--bogus-xyz']);
  assert.equal(result.status, 2);
  assertNamesFlag(result, '--bogus-xyz');
});

test('check-agent-mirror-sync.cjs rejects a truncated --al typo', () => {
  const result = run(CHECK_AGENT_MIRROR_SYNC, ['--al']);
  assert.equal(result.status, 2);
  assertNamesFlag(result, '--al');
});

test('check-agent-mirror-sync.cjs keeps the valid --all flag working', () => {
  const result = run(CHECK_AGENT_MIRROR_SYNC, ['--all']);
  assert.notEqual(result.status, null, 'the script must run to completion');
  assert.notEqual(result.status, 2, `a valid flag must not be rejected:\n${both(result)}`);
});

test('speckit-completion.cjs rejects a misspelled --strict (--strcit)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'typo-flags-'));
  try {
    const result = run(SPECKIT_COMPLETION, [dir, '--strcit']);
    assert.equal(result.status, 1);
    assertNamesFlag(result, '--strcit');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('compiled-route.cjs rejects an unknown --bogus-xyz option', () => {
  const result = run(COMPILED_ROUTE, ['--hub', 'sk-code', '--prompt', 'hello', '--bogus-xyz']);
  assert.equal(result.status, 2);
  assertNamesFlag(result, '--bogus-xyz');
});

test('compiled-route.cjs keeps a flag-shaped prompt value as the prompt', () => {
  const result = run(COMPILED_ROUTE, ['--hub', 'sk-code', '--prompt', '--bogus-xyz']);
  assert.equal(result.status, 0);
});

test('compiled-route-guard.cjs rejects an unknown --bogus-xyz option', () => {
  const result = run(COMPILED_ROUTE_GUARD, ['--bogus-xyz']);
  assert.equal(result.status, 2);
  assertNamesFlag(result, '--bogus-xyz');
});

test('compiled-route-status.cjs rejects an unknown --bogus-xyz option', () => {
  const result = run(COMPILED_ROUTE_STATUS, ['--bogus-xyz']);
  assert.equal(result.status, 2);
  assertNamesFlag(result, '--bogus-xyz');
});

test('parent-skill-check.cjs rejects an unknown --bogus-xyz option after the target', () => {
  const result = run(PARENT_SKILL_CHECK, ['.skilled/skills/sk-code', '--bogus-xyz'], REPO);
  assert.equal(result.status, 2);
  assertNamesFlag(result, '--bogus-xyz');
});

test('parent-skill-check.cjs rejects an unknown --bogus-xyz option as the argument', () => {
  const result = run(PARENT_SKILL_CHECK, ['--bogus-xyz'], REPO);
  assert.equal(result.status, 2);
  assertNamesFlag(result, '--bogus-xyz');
});
