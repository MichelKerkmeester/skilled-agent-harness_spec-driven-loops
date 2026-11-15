#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: session-cleanup Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A lifecycle hook over the shared session-cleanup implementation. On
// session_start it runs the startup guards and appends their warnings as
// additional_context; on session_end it runs the cleanup script and the
// process sweep. It never blocks, and it prints nothing unless a startup
// guard has a warning to add. A core error allows and is reported on stderr,
// so a guard bug never affects a session boundary.

import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';
import sessionCleanupPlugin from '../../../.opencode/plugins/session-cleanup.js';
import { allow, readPayload, runGuard, REPO_ROOT } from './lib/hook-io.mjs';

const PROCESS_SWEEP_SCRIPT = join(
  REPO_ROOT,
  '.skilled/skills/system-spec-kit/runtime/cli/dist/ops/process-sweep.js',
);
const PROCESS_TIMEOUT_MS = 8000;
const MAX_CAPTURE_BYTES = 8192;

// Appending context is the only channel a session_start hook has.
function addContext(text) {
  process.exitCode = 0;
  process.stdout.write(`${JSON.stringify({ hook_specific_output: { additional_context: text } })}\n`);
}

// The sweep reports ownership evidence and signals nothing today, so it is
// safe at either boundary. Its output is captured, never printed.
function runProcessSweep(projectDir) {
  try {
    spawnSync(process.execPath, [PROCESS_SWEEP_SCRIPT, 'apply'], {
      cwd: projectDir,
      encoding: 'utf8',
      timeout: PROCESS_TIMEOUT_MS,
      maxBuffer: MAX_CAPTURE_BYTES,
    });
  } catch {
    // A sweep failure must not affect the session boundary.
  }
}

async function runStartup(projectDir, sessionId) {
  const hooks = await sessionCleanupPlugin.server({ worktree: projectDir });
  await hooks.event({ event: { type: 'session.created', properties: { info: { id: sessionId } } } });
  const output = { system: [] };
  await hooks['experimental.chat.system.transform']({ sessionID: sessionId }, output);
  const text = output.system.filter(Boolean).join('\n').trim();
  if (text) addContext(text);
}

async function runEnd(projectDir) {
  const hooks = await sessionCleanupPlugin.server({ worktree: projectDir });
  await hooks.dispose();
  runProcessSweep(projectDir);
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('session-cleanup')) return allow();

  // A live session runs in a throwaway folder, so the checkout is located from
  // this hook's own file rather than from the payload's cwd.
  const sessionId = typeof payload.session_id === 'string' && payload.session_id
    ? payload.session_id
    : 'vibe-session';

  if (payload.hook_event_name === 'session_start') {
    await runStartup(REPO_ROOT, sessionId);
  } else if (payload.hook_event_name === 'session_end') {
    await runEnd(REPO_ROOT);
  }
  return allow();
}

await runGuard(main, 'session-cleanup');
