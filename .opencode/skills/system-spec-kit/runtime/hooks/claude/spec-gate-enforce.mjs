#!/usr/bin/env node
// PreToolUse enforce hook for Claude Code -- wired to TWO matchers in
// .claude/settings.json: "Write|Edit" (deny-capable) and "Bash" (advise-only,
// same file). It intercepts the tool call BEFORE it runs and evaluates the
// shared spec-gate core's evaluateMutation() policy. A deny emits Claude's
// PreToolUse deny-JSON form; an advisory surfaces via additionalContext
// without overriding the permission decision. FAILS OPEN -- any missing
// payload or internal error approves silently, so a bug here never blocks
// unrelated, correctly-scoped work.
'use strict';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function filePathFrom(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  const candidate = toolInput.file_path || toolInput.filePath || toolInput.path;
  return typeof candidate === 'string' ? candidate : null;
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return approve(); // no/invalid payload -> fail open
  }

  const tool = String(payload?.tool_name || '').toLowerCase();
  if (tool !== 'write' && tool !== 'edit' && tool !== 'bash') return approve();

  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const result = guardCore.evaluateMutation({
    tool,
    filePath: filePathFrom(payload?.tool_input),
    sessionID: payload?.session_id,
    projectDir,
    env: process.env,
  });

  if (result.decision === 'deny') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: result.detail,
      },
    }));
    return process.exit(0);
  }

  if (result.decision === 'advise' && result.detail) {
    // Warn-only: surface the advisory without overriding the permission decision.
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: result.detail,
      },
    }));
    return process.exit(0);
  }

  return approve();
}

main().catch(() => approve());
