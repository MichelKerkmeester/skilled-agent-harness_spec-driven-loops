#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ create-skill-completion-gate — pin the blocking completion gate to the   ║
// ║ strict validator so old routing shapes cannot pass create               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');

const STANDALONE_AUTO = path.join(REPO_ROOT, '.skilled', 'commands', 'create', 'assets', 'create-skill-auto.yaml');
const STANDALONE_CONFIRM = path.join(REPO_ROOT, '.skilled', 'commands', 'create', 'assets', 'create-skill-confirm.yaml');

const WORKFLOWS = [STANDALONE_AUTO, STANDALONE_CONFIRM];

// A gate block is the `gate:` key plus every following line indented deeper
// than it, which is where `command:` and `blocking:` live.
const GATE_BLOCK = /^([ \t]*)gate:[ \t]*\r?\n((?:\1[ \t]+[^\n]*(?:\r?\n|$))*)/gmu;
const COMMAND_LINE = /^[ \t]*command:[ \t]*(.+?)[ \t]*$/mu;
const BLOCKING_TRUE = /^[ \t]*blocking:[ \t]*true[ \t]*$/mu;

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function read(absolutePath) {
  return fs.readFileSync(absolutePath, 'utf8');
}

function unquote(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function blockingGateCommands(text) {
  const commands = [];
  for (const match of text.matchAll(GATE_BLOCK)) {
    const body = match[2];
    if (!BLOCKING_TRUE.test(body)) continue;
    const command = COMMAND_LINE.exec(body);
    if (command) commands.push(unquote(command[1]));
  }
  return commands;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS — the blocking gate must run the strict validator
// ─────────────────────────────────────────────────────────────────────────────

test('every create-skill workflow has a blocking gate that runs validate_skill_package.py --strict', () => {
  for (const absolutePath of WORKFLOWS) {
    const relativePath = path.relative(REPO_ROOT, absolutePath);
    const commands = blockingGateCommands(read(absolutePath));
    assert.ok(commands.length > 0, `${relativePath} must declare at least one gate with blocking: true`);
    const strictGate = commands.find((command) => /validate_skill_package\.py\b/u.test(command) && / --strict$/u.test(command));
    assert.ok(
      strictGate,
      `${relativePath} blocking gate must run validate_skill_package.py ... --strict; found: ${JSON.stringify(commands)}`,
    );
  }
});
