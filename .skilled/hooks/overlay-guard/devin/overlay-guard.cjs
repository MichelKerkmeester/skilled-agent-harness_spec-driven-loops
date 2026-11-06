#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Devin PreToolUse Overlay Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: wired via .devin/hooks.v1.json PreToolUse matcher
// `^(edit|write)$`; silent in a tree with no overlay manifest.
//
// The Devin sibling of the Claude overlay-guard hook: the same payload shape
// and the same deny envelope, with the project directory read from `cwd` or
// DEVIN_PROJECT_DIR. FAILS OPEN.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const guardCore = require('../lib/overlay-guard.cjs');
const { parseJsonFailOpen, readStdin } = require('../../shared/hook-adapter-shared.cjs');
const { isHookEnabled } = require('../../shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WRITE_TOOLS = new Set(['edit', 'write']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('overlay-guard')) return approve();
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || !WRITE_TOOLS.has(String(payload?.tool_name || '').toLowerCase())) return approve();

  const filePath = guardCore.fileFieldPath(payload?.tool_input);
  if (!filePath) return approve();
  // Whitespace-only cwd is treated as absent, as in the other devin adapters.
  const workspaceCwd = payload?.cwd;
  const sessionDir = typeof workspaceCwd === 'string' && workspaceCwd.trim()
    ? workspaceCwd
    : (process.env.DEVIN_PROJECT_DIR || process.cwd());

  const result = guardCore.evaluateWrite({ paths: [filePath], sessionDir });
  for (const note of result.notes) process.stderr.write(note + '\n');
  if (result.decision === 'deny') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: result.reason,
      },
    }));
    return process.exit(0);
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
