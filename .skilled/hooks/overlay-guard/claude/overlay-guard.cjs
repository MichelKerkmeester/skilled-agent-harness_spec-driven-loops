#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Claude PreToolUse Overlay Guard
// ───────────────────────────────────────────────────────────────────
// STATUS: wired via .claude/settings.json PreToolUse matcher
// `Write|Edit|MultiEdit`; silent in a tree with no overlay manifest.
//
// Reads the PreToolUse payload for a file write, hands the path to the
// runtime-neutral overlay-guard core, and denies the call when the overlay
// engine says an overlay owns that file. The deny reason is the engine's own
// line, which names the overlay file to edit instead. FAILS OPEN: a missing
// payload, an engine error or an internal bug approves, with a one-line note
// on stderr when the engine could not judge the path.
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

const WRITE_TOOLS = new Set(['Write', 'Edit', 'MultiEdit']);

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
  if (payload === null || !WRITE_TOOLS.has(payload?.tool_name)) return approve();

  const filePath = guardCore.fileFieldPath(payload?.tool_input);
  if (!filePath) return approve();
  const sessionDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();

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
