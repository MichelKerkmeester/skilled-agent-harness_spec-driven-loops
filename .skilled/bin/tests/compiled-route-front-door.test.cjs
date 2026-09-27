#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST: COMPILED-ROUTE FRONT DOOR PROMPT INPUT                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
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
