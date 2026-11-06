#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor preToolUse Overlay Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: wired via .cursor/hooks.json preToolUse matcher `Write`; silent in a
// tree with no overlay manifest.
//
// Cursor's counterpart to the Claude overlay-guard hook. Cursor answers every
// preToolUse call with its own permission envelope rather than a
// hookSpecificOutput, and a deny also exits 2, the same shape the spec-gate
// adapter uses. The workspace root comes from `workspace_roots[0]`. FAILS OPEN.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import guardCore from '../lib/overlay-guard.cjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { parseJsonFailOpen, readStdin } from '../../shared/hook-adapter-shared.cjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WRITE_TOOLS = new Set(['Write']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  process.stdout.write(JSON.stringify({ permission: 'allow' }));
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('overlay-guard')) return approve();
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || !WRITE_TOOLS.has(String(payload?.tool_name || ''))) return approve();

  const filePath = guardCore.fileFieldPath(payload?.tool_input);
  if (!filePath) return approve();
  const workspace = payload?.workspace_roots?.[0];
  const sessionDir = typeof workspace === 'string' && workspace.trim() ? workspace : process.cwd();

  const result = guardCore.evaluateWrite({ paths: [filePath], sessionDir });
  for (const note of result.notes) process.stderr.write(note + '\n');
  if (result.decision === 'deny') {
    process.stdout.write(JSON.stringify({
      permission: 'deny',
      user_message: result.reason,
      agent_message: result.reason,
    }));
    return process.exit(2);
  }
  return approve();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

main().catch((error) => {
  process.stderr.write(`overlay-guard: ${error instanceof Error ? error.message : String(error)}\n`);
  approve();
});
