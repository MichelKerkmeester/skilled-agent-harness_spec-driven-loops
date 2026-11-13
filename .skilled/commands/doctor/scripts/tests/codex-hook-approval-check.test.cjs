#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Hook Approval Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the check as a process against throwaway project and config fixtures,
// so each verdict is observed through its exit code and output exactly as a
// doctor route sees it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'codex-hook-approval-check.cjs');
const HOOKS_FILE = path.join('.codex', 'hooks.json');
const CONFIG_FILE = 'config.toml';

// The advisor entry sits at group 1, hook 1, so the verdict has to derive both
// indices from the file rather than assume the first slot.
const HOOKS_DOCUMENT = JSON.stringify({
  hooks: {
    UserPromptSubmit: [
      { hooks: [{ type: 'command', command: 'node other-prompt-hook.js' }] },
      {
        hooks: [
          { type: 'command', command: 'node spec-gate-classify.mjs' },
          {
            type: 'command',
            command: "bash -c 'node .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js'",
          },
        ],
      },
    ],
  },
});

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-hook-approval-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function writeFile(file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body);
}

function run(root, config) {
  return spawnSync(process.execPath, [SCRIPT, '--root', root, '--config', config], { encoding: 'utf8' });
}

function stateKey(root, group, index) {
  return `[hooks.state."${path.join(root, HOOKS_FILE)}:user_prompt_submit:${group}:${index}"]`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('an approved advisor entry passes', (t) => {
  const root = fixture(t);
  const config = path.join(root, CONFIG_FILE);
  writeFile(path.join(root, HOOKS_FILE), HOOKS_DOCUMENT);
  writeFile(config, [
    stateKey(root, 0, 0),
    'trusted_hash = "sha256:other"',
    stateKey(root, 1, 1),
    'trusted_hash = "sha256:advisor"',
    '',
  ].join('\n'));

  const result = run(root, config);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'PASS codex-hooks-approved\n');
  assert.doesNotMatch(result.stdout, /sha256/);
});

test('an entry with no approval warns and names the repair', (t) => {
  const root = fixture(t);
  const config = path.join(root, CONFIG_FILE);
  writeFile(path.join(root, HOOKS_FILE), HOOKS_DOCUMENT);

  // The advisor's key exists but holds no trusted_hash, and the one approval in
  // the file belongs to another group.
  writeFile(config, [
    stateKey(root, 0, 0),
    'trusted_hash = "sha256:other"',
    stateKey(root, 1, 1),
    'trusted = "not a hash"',
    '',
  ].join('\n'));

  const result = run(root, config);
  assert.equal(result.status, 1, result.stderr);
  assert.equal(result.stdout, [
    `WARN codex-hooks-unapproved ${root}`,
    `repair: open /hooks in a Codex session at ${root} and approve each entry`,
    '',
  ].join('\n'));
  assert.doesNotMatch(result.stdout, /sha256/);
});

test('a project without .codex is skipped', (t) => {
  const root = fixture(t);
  const result = run(root, path.join(root, CONFIG_FILE));
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'SKIP no-codex-hooks\n');
});
