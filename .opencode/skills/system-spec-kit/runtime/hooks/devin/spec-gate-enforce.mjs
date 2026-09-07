#!/usr/bin/env node
import * as guardCore from '../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';
const DEVIN_TOOL_MAP = { exec: 'bash', edit: 'edit' };

function filePathFrom(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  return firstNonBlankString(toolInput.file_path, toolInput.filePath, toolInput.path);
}

function approve() {
  process.exit(0);
}

function firstNonBlankString(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) return candidate;
  }
  return null;
}

async function main() {
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null) return approve(); // no/invalid payload -> fail open
  const tool = DEVIN_TOOL_MAP[String(payload?.tool_name || '').toLowerCase()];
  if (!tool) return approve();
  const sessionID = typeof payload?.session_id === 'string' ? payload.session_id : '';
  if (sessionID.trim().length === 0) return approve();
  const projectDir = (typeof payload?.cwd === 'string' && payload.cwd.trim()) ? payload.cwd : (process.env.DEVIN_PROJECT_DIR || process.cwd());
  const filePath = filePathFrom(payload?.tool_input, projectDir);
  const result = guardCore.runEnforceGate({ tool, filePath, sessionID, projectDir, env: process.env, runtimeKey: 'devin' });
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

main().catch((error) => {
  process.stderr.write(`spec-gate-enforce: ${error instanceof Error ? error.message : String(error)}\n`);
  approve();
});
