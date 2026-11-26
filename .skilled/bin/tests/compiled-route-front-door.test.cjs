#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: COMPILED-ROUTE FRONT DOOR PROMPT INPUT                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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

const FRONT_DOOR = path.join(__dirname, '..', 'compiled-route.cjs');
const PROMPT = 'review this typescript module for bugs';

// Compiled routing is default-on; clear the flag so an operator's shell cannot
// turn every answer into the same legacy sentinel.
function run(args, input) {
  const env = { ...process.env };
  delete env.SPECKIT_COMPILED_ROUTING;
  return spawnSync(process.execPath, [FRONT_DOOR, ...args], { encoding: 'utf8', env, input });
}

test('resolves the same route from stdin as from argv', () => {
  const fromArgv = run(['--hub', 'sk-code', '--prompt', PROMPT]);
  const fromStdin = run(['--hub', 'sk-code', '--prompt-stdin'], PROMPT);
  const emptyPrompt = run(['--hub', 'sk-code', '--prompt', '']);
  assert.equal(fromArgv.status, 0);
  assert.equal(fromStdin.status, 0);
  assert.equal(fromStdin.stdout, fromArgv.stdout);
  assert.notEqual(fromStdin.stdout, emptyPrompt.stdout, 'stdin must carry the prompt, not an empty one');
});

test('resolves the same route from a prompt file as from argv', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'compiled-route-file-'));
  try {
    const file = path.join(dir, 'task.txt');
    fs.writeFileSync(file, PROMPT);
    const fromArgv = run(['--hub', 'sk-code', '--prompt', PROMPT]);
    const fromFile = run(['--hub', 'sk-code', '--prompt-file', file]);
    assert.equal(fromFile.status, 0);
    assert.equal(fromFile.stdout, fromArgv.stdout);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// A heredoc ends at the first line equal to its delimiter, so a task holding that
// line used to run its remaining lines as shell. A file has no delimiter, and the
// whole text, delimiter line included, reaches the router as the prompt.
test('reads a prompt file whole, with a delimiter line and a shell line inside it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'compiled-route-file-'));
  try {
    const marker = path.join(dir, 'ran');
    const text = `${PROMPT}\nTASK\ntouch ${marker}\n`;
    const file = path.join(dir, 'task.txt');
    fs.writeFileSync(file, text);
    const fromArgv = run(['--hub', 'sk-code', '--prompt', text]);
    const fromFile = run(['--hub', 'sk-code', '--prompt-file', file]);
    assert.equal(fromFile.status, 0);
    assert.equal(fromFile.stdout, fromArgv.stdout);
    assert.equal(fs.existsSync(marker), false, 'no line of the prompt may run as a command');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('refuses an unreadable prompt file instead of routing an empty prompt', () => {
  const missing = path.join(os.tmpdir(), `compiled-route-missing-${process.pid}.txt`);
  const result = run(['--hub', 'sk-code', '--prompt-file', missing]);
  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /cannot read --prompt-file/);
});
