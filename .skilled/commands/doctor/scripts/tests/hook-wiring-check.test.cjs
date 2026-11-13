#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Wiring Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the hook wiring check as a process against throwaway checkouts. The
// cases pin both verdicts and the checkout that has no runtime folder at all.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'hook-wiring-check.cjs');
const CLAUDE_FILE = '.claude/settings.json';
const CLAUDE_MARKER = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-wiring-check-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const run = (...args) => {
    const result = spawnSync(process.execPath, [SCRIPT, '--root', root, ...args], { encoding: 'utf8' });
    return { code: result.status, out: result.stdout, err: result.stderr };
  };
  return { root, run };
}

function writeClaudeSettings(root, hooks) {
  fs.mkdirSync(path.join(root, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(root, CLAUDE_FILE), JSON.stringify({ hooks }, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('names a runtime whose prompt entry is absent', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: 'node some-other-hook.js' }] }],
  });
  const before = fs.readFileSync(path.join(f.root, CLAUDE_FILE), 'utf8');
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing claude \.claude\/settings\.json$/m);
  assert.equal(fs.readFileSync(path.join(f.root, CLAUDE_FILE), 'utf8'), before, 'check changed the hook file');
});

test('passes a runtime whose prompt entry is wired', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{
      hooks: [{ type: 'command', command: `node ${CLAUDE_MARKER}` }],
    }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
  const json = f.run('--json');
  assert.equal(json.code, 0);
  assert.equal(JSON.parse(json.out).checks.find((check) => check.runtime === 'claude').status, 'ok');
});

test('skips a runtime whose folder is absent', (t) => {
  const f = fixture(t);
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out, '');
  const json = f.run('--json');
  assert.equal(json.code, 0);
  assert.deepEqual(JSON.parse(json.out).checks.map((check) => check.status), ['skipped', 'skipped', 'skipped', 'skipped']);
});
