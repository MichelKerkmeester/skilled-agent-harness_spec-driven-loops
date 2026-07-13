#!/usr/bin/env node
// PostToolUse(exec) CLI dispatch audit trail for Codex CLI -- the Codex sibling of
// the Claude dispatch-audit hook. Observes a completed exec call, recognizes an
// `opencode run` / `claude -p` / `codex exec -p` dispatch shape, and appends one
// redacted, size-rotated JSONL audit line through the SAME shared dispatch-audit
// primitives both runtimes use, tagged runtime:'codex'. Strictly observational --
// unlike the sibling PreToolUse preflight lint, it must never emit a
// permissionDecision, since a post-execution audit has no business affecting a
// result that already exists. FAILS OPEN -- any missing payload, parse error, or
// audit-path failure exits 0 with no output.
'use strict';

import { join } from 'node:path';
import {
  DISPATCH_SHAPES,
  DEFAULT_LOG_RELATIVE_PATH,
  isAuditDisabled,
  extractDispatchMeta,
  buildAuditLine,
  appendAuditLog,
} from '../../lib/dispatch-audit.mjs';

// Codex dispatches sub-agents via `codex exec -p <agent>` -- a shape the shared
// core (opencode run / claude -p) does not know. Extend the recognizer locally so
// the audit trail covers a Codex sub-dispatch too, without changing the shared
// dispatch core. The record is composed from the same exported primitives
// recordDispatch uses internally.
const CODEX_EXEC_SHAPE = {
  test: /\bcodex\s+exec\b[^\n]*\s-p\b/,
  skill: 'cli-codex',
  packetPath: 'cli-external-orchestration/cli-codex',
};
const SHAPES = [...DISPATCH_SHAPES, CODEX_EXEC_SHAPE];

function done() {
  // No output + exit 0 -> pure observation, nothing for Codex to act on.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return done(); // no/invalid payload -> fail open
  }

  if (String(payload?.tool_name || '').toLowerCase() !== 'exec') return done();
  if (isAuditDisabled(process.env)) return done();

  const toolInput = payload?.tool_input || {};
  const command = toolInput?.command;
  if (typeof command !== 'string' || command.length === 0) return done();

  const shape = SHAPES.find((candidate) => candidate.test.test(command));
  if (!shape) return done();

  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();
  const logPath = join(projectDir, DEFAULT_LOG_RELATIVE_PATH);

  const toolResponse = payload?.tool_response && typeof payload.tool_response === 'object'
    ? payload.tool_response
    : {};
  const outputText = [toolResponse.stdout, toolResponse.stderr]
    .filter((part) => typeof part === 'string')
    .join('\n') || undefined;

  const meta = extractDispatchMeta(command, { outputText, metadataObj: toolResponse });
  const line = buildAuditLine({
    ts: new Date().toISOString(),
    runtime: 'codex',
    sessionID: payload?.session_id ?? null,
    callID: payload?.tool_use_id ?? null,
    skill: shape.skill,
    command,
    ...meta,
  });
  if (line) appendAuditLog(logPath, line);

  return done();
}

main().catch(() => done());
