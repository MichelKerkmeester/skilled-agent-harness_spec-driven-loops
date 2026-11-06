#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Codex PreToolUse Overlay Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: wired via .codex/hooks.json PreToolUse matcher `apply_patch|edit`;
// silent in a tree with no overlay manifest.
//
// The Codex sibling of the Claude overlay-guard hook. An `edit` call names its
// file in a path field; an `apply_patch` call names every file in its patch
// body, so each Add, Update and Delete header and each Move to target is
// judged, and the call is denied when any one of them is owned. FAILS OPEN.
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

const WRITE_TOOLS = new Set(['apply_patch', 'edit']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function approve() {
  // No output + exit 0 -> defer to the normal permission flow.
  process.exit(0);
}

function pathsFrom(toolInput) {
  const filePath = guardCore.fileFieldPath(toolInput);
  if (filePath) return [filePath];
  if (!toolInput || typeof toolInput !== 'object') return [];
  return guardCore.pathsFromPatch(toolInput.command || toolInput.input || toolInput.patch);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!isHookEnabled('overlay-guard')) return approve();
  const payload = parseJsonFailOpen(await readStdin());
  if (payload === null || !WRITE_TOOLS.has(String(payload?.tool_name || '').toLowerCase())) return approve();

  const paths = pathsFrom(payload?.tool_input);
  if (paths.length === 0) return approve();
  const sessionDir = payload?.cwd || process.env.CODEX_PROJECT_DIR || process.cwd();

  const result = guardCore.evaluateWrite({ paths, sessionDir });
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
