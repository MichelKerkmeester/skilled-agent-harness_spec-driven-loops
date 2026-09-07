#!/usr/bin/env node
import * as guardCore from '../lib/spec-gate/spec-gate-core.mjs';
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';
const CODEX_TOOL_MAP = { exec: 'bash', apply_patch: 'write', edit: 'edit' };

function pathsFromPatch(patchText) {
  if (typeof patchText !== 'string') return [];
  const paths = [];
  const fileHeader = /^\*\*\* (?:Add|Update|Delete) File: (.+?)\s*$/gm;
  let match;
  while ((match = fileHeader.exec(patchText))) paths.push(match[1].trim());
  const moveTarget = patchText.match(/^\*\*\* Move to: (.+?)\s*$/m);
  if (moveTarget) paths.push(moveTarget[1].trim());
  return paths;
}

function filePathFrom(toolInput, projectDir) {
  if (!toolInput || typeof toolInput !== 'object') return null;
  const candidate = firstNonBlankString(toolInput.file_path, toolInput.filePath, toolInput.path);
  if (candidate !== null) return candidate;
  const paths = pathsFromPatch(toolInput.command || toolInput.input || toolInput.patch);
  if (paths.length === 0) return null;
  return paths.find((candidatePath) => !guardCore.isExemptTargetPath(candidatePath, projectDir)) || paths[0];
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
  const tool = CODEX_TOOL_MAP[String(payload?.tool_name || '').toLowerCase()];
  if (!tool) return approve();
  const sessionID = payload?.session_id;
  const projectDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();
  const filePath = filePathFrom(payload?.tool_input, projectDir);
  const result = guardCore.runEnforceGate({ tool, filePath, sessionID, projectDir, env: process.env, runtimeKey: 'codex' });
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
