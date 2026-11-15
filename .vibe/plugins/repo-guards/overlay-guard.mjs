#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: overlay-guard Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A strict pre_tool hook over the runtime-neutral overlay-guard core.
// It refuses a write or edit of a file a vendored tree's overlay owns, and
// the core's reason names the overlay file to edit instead. Every other call
// is allowed. The core asks the overlay engine once per path and never reads
// the manifest itself; an engine error allows, so a guard bug never blocks a
// call it could not judge.

import { createRequire } from 'node:module';
import { join } from 'node:path';
import { allow, deny, readPayload, runGuard, sessionDirFor, toCoreCall, REPO_ROOT } from './lib/hook-io.mjs';
import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';

const require = createRequire(import.meta.url);
const guardCore = require('../../../.skilled/hooks/overlay-guard/lib/overlay-guard.cjs');

// The engine is generic over --root, so the checkout's copy judges every tree
// in scope and a tree needs only its own manifest to be judged.
const ENGINE_PATH = join(REPO_ROOT, '.skilled', 'commands', 'doctor', 'scripts', 'overlay-engine.cjs');

// Only a tool that ends in a file write is judged. A read of an owned file is
// harmless, and a shell command's arguments are not a path the core can trust.
const WRITE_TOOLS = new Set(['write', 'edit']);

/**
 * The trees one write is judged against: the tree the session runs in, then
 * the checkout holding this hook. A session started elsewhere can still write
 * into an overlaid tree, and this checkout's own overlays are always in scope.
 * @param {string} sessionDir - The absolute session directory.
 * @returns {string[]} Absolute tree roots, de-duplicated.
 */
function treeRootsFor(sessionDir) {
  return [...new Set([sessionDir, REPO_ROOT])];
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('overlay-guard')) return allow();
  if (!WRITE_TOOLS.has(toCoreCall(payload).tool)) return allow();

  const filePath = guardCore.fileFieldPath(payload.tool_input);
  if (!filePath) return allow();

  const sessionDir = sessionDirFor(payload.cwd);
  for (const treeRoot of treeRootsFor(sessionDir)) {
    const result = guardCore.evaluateWrite({ paths: [filePath], sessionDir, treeRoot, enginePath: ENGINE_PATH });
    for (const note of result.notes ?? []) {
      try {
        process.stderr.write(`${note}\n`);
      } catch {
        // A closed stderr must not turn a note into a block.
      }
    }
    if (result.decision === 'deny') return deny(result.reason);
  }
  return allow();
}

await runGuard(main, 'overlay-guard');
