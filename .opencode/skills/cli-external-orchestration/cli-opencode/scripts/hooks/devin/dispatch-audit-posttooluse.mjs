#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Devin PostToolUse Dispatch Audit                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Append a redacted audit line for a completed dispatch.          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// PostToolUse(exec) CLI dispatch audit trail for Devin CLI -- the Devin sibling of
// the Codex/Claude dispatch-audit hook. Observes a completed exec call, recognizes
// an `opencode run` / `claude -p` / `codex exec -p` dispatch shape, and appends
// one redacted, size-rotated JSONL audit line through the shared dispatch-audit
// primitives, tagged runtime:'devin'. Strictly observational -- never emits a
// permissionDecision. FAILS OPEN -- any missing payload, parse error, or
// audit-path failure exits 0 with no output.
//
// STATUS: DORMANT -- see ../../../../system-spec-kit/mcp-server/hooks/devin/README.md.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { join } from 'node:path';
import {
  DISPATCH_SHAPES,
  DEFAULT_LOG_RELATIVE_PATH,
  isAuditDisabled,
  extractDispatchMeta,
  buildAuditLine,
  appendAuditLog,
} from '../../lib/dispatch-audit.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function done() {
  // No output + exit 0 -> pure observation, nothing for Devin to act on.
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

  const shape = DISPATCH_SHAPES.find((candidate) => candidate.test.test(command));
  if (!shape) return done();

  const projectDir = payload?.cwd || process.env.DEVIN_PROJECT_DIR || process.cwd();
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
    runtime: 'devin',
    sessionID: payload?.session_id ?? null,
    callID: payload?.tool_use_id ?? null,
    skill: shape.skill,
    command,
    ...meta,
  });
  if (line) appendAuditLog(logPath, line);

  return done();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => done());
