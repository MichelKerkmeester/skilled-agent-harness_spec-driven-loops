#!/usr/bin/env node
import * as guardCore from '../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';
const CURSOR_TOOL_MAP = { Shell: 'bash', Write: 'write' };

function filePathFrom(toolInput) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  return firstNonBlankString(toolInput.file_path, toolInput.filePath, toolInput.path);
}

function approve() {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
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
  const tool = CURSOR_TOOL_MAP[String(payload?.tool_name || '')];
  if (!tool) return approve();
  const sessionID = payload?.session_id;
  const projectDir = (typeof payload?.workspace_roots?.[0] === 'string' && payload.workspace_roots[0].trim()) ? payload.workspace_roots[0] : process.cwd();
  const filePath = filePathFrom(payload?.tool_input, projectDir);
  const result = guardCore.runEnforceGate({ tool, filePath, sessionID, projectDir, env: process.env, runtimeKey: 'cursor' });
  if (result.decision === 'deny') {
    process.stdout.write(JSON.stringify({
      permission: 'deny',
      user_message: result.detail,
      agent_message: result.detail,
    }));
    return process.exit(2);
  }
  if (result.decision === 'advise' && result.detail) {
    process.stdout.write(JSON.stringify({
      permission: 'allow',
      agent_message: result.detail,
    }));
    return process.exit(0);
  }
  return approve();
}

main().catch((error) => {
  process.stderr.write(`spec-gate-enforce: ${error instanceof Error ? error.message : String(error)}\n`);
  approve();
});
