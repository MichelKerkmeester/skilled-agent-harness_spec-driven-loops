// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Help Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Help reads no config and starts nothing, because it is the call an operator makes before
// trusting the tool. Its text is also the one list of what a caller may pass, so the case
// holds it against the parser itself rather than against a hand-kept list.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const { assertSnapshotUnchanged } = require('./fixtures.cjs');
const { ARGUMENTS, CLEAN_GO, OPENCODE_TARGET, RUNNER, TARGET, withRepo } = require('./quality-suite-helpers.cjs');
const { USAGE_TEXT } = require('../quality-gate.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('help: --help and -h print the usage and exit 0, even beside a broken config', () => withRepo({
  base: { 'app.go': CLEAN_GO },
  change: { [TARGET]: '{"bogus": true}\n' },
}, (repo) => {
  for (const flag of ['--help', '-h']) {
    const { status, stdout, stderr } = assertSnapshotUnchanged(repo, () => repo.run(['--worktree', flag]));
    assert.equal(status, 0, flag);
    assert.equal(stderr, '', flag);
    assert.equal(stdout, `${USAGE_TEXT}\n`, flag);
  }
  assert.match(USAGE_TEXT, /^Usage: /);
  // Every flag the parser accepts is in the usage, so the text cannot fall behind it. The
  // flag vocabulary lives in the arguments module beside the runner while the loop that reads
  // it lives in the runner, so both files are scanned and a flag cannot escape either.
  const parsed = [RUNNER, ARGUMENTS].flatMap((file) => [...fs.readFileSync(file, 'utf8').matchAll(/arg === '(--[a-z-]+)'/g)])
    .map((match) => match[1]).filter((flag) => flag !== '--');
  assert.ok(parsed.length >= 11);
  for (const flag of parsed) assert.ok(USAGE_TEXT.includes(flag), flag);
  for (const word of ['skcode.qualityConfig', TARGET, OPENCODE_TARGET, 'NO_BLOCKER_FOUND', 'BLOCKED', 'NOTHING_CHECKED', 'ERROR', 'UNVERIFIED']) {
    assert.ok(USAGE_TEXT.includes(word), word);
  }
  // After the separator, -h is a file name like any other, so the run goes on and meets
  // the broken config.
  const named = repo.run(['--', '-h']);
  assert.equal(named.status, 3);
  assert.equal(named.verdict.errors[0].code, 'CONFIG_INVALID');
}));
