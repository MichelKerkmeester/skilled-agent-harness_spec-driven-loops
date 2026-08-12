#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude PostToolUse Dispatch Audit                             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Append a redacted audit line for a completed dispatch.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PostToolUse(Bash) CLI dispatch audit trail for Claude Code.
//
// Claude's counterpart to the mk-cli-dispatch-audit OpenCode plugin: it observes a completed
// Bash tool call, recognizes an `opencode run` / `claude -p` dispatch shape, and appends one
// redacted, size-rotated JSONL audit line through the SAME shared dispatch-audit core both
// runtimes use. This hook is strictly observational -- unlike the sibling PreToolUse preflight
// lint, it must never emit a permissionDecision, since a post-execution audit has no business
// affecting a result that already exists. FAILS OPEN -- any missing payload, parse error, or
// audit-path failure exits 0 with no output, so a bug here can never break a real dispatch.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { join } from 'node:path';
import * as dispatchAuditCore from '../lib/dispatch-audit.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  // No output + exit 0 -> pure observation, nothing for Claude to act on.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('dispatch')) return done();
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return done(); // no/invalid payload -> fail open
  }

  // Normalize tool-name case: Claude emits 'Bash', OpenCode 'bash'.
  if (String(payload?.tool_name || '').toLowerCase() !== 'bash') return done();

  const toolInput = payload?.tool_input || {};
  const command = toolInput?.command;
  if (typeof command !== 'string' || command.length === 0) return done();

  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const logPath = join(projectDir, dispatchAuditCore.DEFAULT_LOG_RELATIVE_PATH);

  const toolResponse = payload?.tool_response && typeof payload.tool_response === 'object'
    ? payload.tool_response
    : {};
  const outputText = [toolResponse.stdout, toolResponse.stderr]
    .filter((part) => typeof part === 'string')
    .join('\n') || undefined;

  dispatchAuditCore.recordDispatch({
    command,
    logPath,
    runtime: 'claude',
    sessionID: payload?.session_id,
    callID: payload?.tool_use_id,
    outputText,
    metadataObj: toolResponse,
    env: process.env,
  });

  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => done());
