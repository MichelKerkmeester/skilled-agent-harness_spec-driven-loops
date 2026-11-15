#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Session Start Hook
// ───────────────────────────────────────────────────────────────────
// Vibe delivers one JSON payload on stdin at session_start and reads one
// optional additional_context line back. This hook composes up to four parts
// in a fixed order: the bound packet's goal slice, the shared session context,
// the startup-guard warnings and the stale-dist warning. It never blocks and
// never exits non-zero: malformed input, a disabled concern or a failing part
// contributes nothing, and an empty result prints nothing at all.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderVibeGoalSlice } from '../../goal/vibe/goal-inject.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A Vibe session runs in a throwaway folder, so the checkout is located from
// this file instead: vibe -> session-lifecycle -> hooks -> .skilled -> root.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');

const SESSION_PRIME_PATH = resolve(
  REPO_ROOT,
  '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js',
);
const SESSION_CLEANUP_PATH = resolve(REPO_ROOT, '.vibe/plugins/repo-guards/session-cleanup.mjs');
const DIST_STALENESS_PATH = resolve(
  REPO_ROOT,
  '.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh',
);

const SESSION_PRIME_TIMEOUT_MS = 2_800;
const SESSION_CLEANUP_TIMEOUT_MS = 8_000;
const DIST_TIMEOUT_MS = 5_000;
const MAX_BUFFER_BYTES = 1_048_576;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function readStdin() {
  process.stdin.setEncoding('utf8');
  let text = '';
  for await (const chunk of process.stdin) text += chunk;
  return text;
}

function runNode(script, { input, timeout }) {
  const result = spawnSync(process.execPath, [script], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    input,
    maxBuffer: MAX_BUFFER_BYTES,
    timeout,
  });
  return String(result.stdout ?? '');
}

function goalPart() {
  return renderVibeGoalSlice({ workspace: REPO_ROOT });
}

function sessionContextPart(payload) {
  if (!isHookEnabled('session-lifecycle')) return '';
  const sessionId = typeof payload.session_id === 'string' ? payload.session_id : '';
  const source = typeof payload.source === 'string' && payload.source ? payload.source : 'startup';
  return runNode(SESSION_PRIME_PATH, {
    input: JSON.stringify({ session_id: sessionId, cwd: REPO_ROOT, source }),
    timeout: SESSION_PRIME_TIMEOUT_MS,
  });
}

function startupGuardsPart(stdinText) {
  const output = runNode(SESSION_CLEANUP_PATH, {
    input: stdinText,
    timeout: SESSION_CLEANUP_TIMEOUT_MS,
  }).trim();
  if (!output) return '';

  const parsed = JSON.parse(output);
  const context = parsed?.hook_specific_output?.additional_context;
  return typeof context === 'string' ? context : '';
}

function distFreshnessPart() {
  if (!isHookEnabled('dist-freshness')) return '';
  const result = spawnSync('python3', [DIST_STALENESS_PATH, '--all'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER_BYTES,
    timeout: DIST_TIMEOUT_MS,
  });
  return String(result.stdout ?? '');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const stdinText = await readStdin();

  let payload;
  try {
    payload = JSON.parse(stdinText);
  } catch {
    return;
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return;
  if (payload.hook_event_name !== 'session_start') return;

  const builders = [
    () => goalPart(),
    () => sessionContextPart(payload),
    () => startupGuardsPart(stdinText),
    () => distFreshnessPart(),
  ];

  const parts = [];
  for (const build of builders) {
    try {
      const text = String(build() ?? '').trim();
      if (text) parts.push(text);
    } catch {
      // A failing part contributes nothing; the other parts still land.
    }
  }

  const text = parts.join('\n\n');
  if (!text) return;

  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

main().catch(() => {
  process.exitCode = 0;
});
