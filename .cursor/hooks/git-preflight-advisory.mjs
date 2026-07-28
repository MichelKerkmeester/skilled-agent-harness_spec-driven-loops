#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Cursor Git Preflight Advisory Proxy                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Map Cursor Shell payloads onto the shared advisory hook.       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SHARED_HOOK_PATH = fileURLToPath(new URL(
  '../../.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs',
  import.meta.url,
));
const CHILD_TIMEOUT_MS = 9_000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function firstNonBlankString(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return;
  }

  if (payload?.tool_name !== 'Shell') return;
  const command = payload?.tool_input?.command;
  if (typeof command !== 'string') return;

  const projectDir = firstNonBlankString(
    payload?.cwd,
    payload?.workspace_roots?.[0],
    process.cwd(),
  );
  const result = spawnSync(process.execPath, [SHARED_HOOK_PATH], {
    cwd: projectDir,
    input: JSON.stringify({
      tool_name: 'Bash',
      tool_input: { command },
      cwd: projectDir,
    }),
    encoding: 'utf8',
    timeout: CHILD_TIMEOUT_MS,
  });
  if (result.error || result.status !== 0 || typeof result.stdout !== 'string') return;
  if (result.stdout) process.stdout.write(result.stdout);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch(() => undefined);
