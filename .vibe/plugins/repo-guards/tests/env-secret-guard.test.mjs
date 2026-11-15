// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Env Secret Guard Hook Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Drives the pre_tool hook as Vibe runs it: one JSON payload on stdin and the
// verdict on stdout. A path the payload names is relative to the session
// folder, so a symlink there that resolves to a dotenv file must be refused
// even though the checkout root holds no such link.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const GUARDS = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Runs the hook with one payload under an environment that carries none of the
 * caller's guard switches, so the result does not depend on the shell.
 * @param {object} payload - The Vibe pre_tool payload.
 * @returns {string} The hook's stdout.
 */
function runHook(payload) {
  const env = { ...process.env };
  delete env.SYSTEM_ENV_SECRET_GUARD_DISABLED;
  delete env.SYSTEM_HOOKS_DISABLED;
  const result = spawnSync(process.execPath, [join(GUARDS, 'env-secret-guard.mjs')], {
    input: JSON.stringify(payload),
    env,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

/**
 * A read of one relative path inside a session folder.
 * @param {string} cwd - The session folder.
 * @param {string} filePath - The path as the model wrote it.
 * @returns {object} The payload.
 */
function readPayload(cwd, filePath) {
  return {
    hook_event_name: 'pre_tool',
    session_id: 'vibe-env-guard-relative',
    cwd,
    tool_name: 'file_system.read_file',
    tool_call_id: 'call-1',
    tool_input: { file_path: filePath },
  };
}

test('a relative symlink to a dotenv file in the session folder is denied', () => {
  const session = mkdtempSync(join(tmpdir(), 'vibe-env-guard-'));
  try {
    writeFileSync(join(session, '.env'), 'FIXTURE=1\n');
    symlinkSync('.env', join(session, 'notes.txt'));
    const verdict = JSON.parse(runHook(readPayload(session, 'notes.txt')));
    assert.equal(verdict.decision, 'deny');
  } finally {
    rmSync(session, { recursive: true, force: true });
  }
});

test('a relative file that is not a dotenv file is allowed', () => {
  const session = mkdtempSync(join(tmpdir(), 'vibe-env-guard-'));
  try {
    writeFileSync(join(session, 'notes.txt'), 'plain notes\n');
    assert.equal(runHook(readPayload(session, 'notes.txt')), '');
  } finally {
    rmSync(session, { recursive: true, force: true });
  }
});
