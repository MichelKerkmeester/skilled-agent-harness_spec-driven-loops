// ───────────────────────────────────────────────────────────────────
// MODULE: overlay-guard OpenCode Plugin
// ───────────────────────────────────────────────────────────────────
// OpenCode transport adapter over the runtime-neutral overlay-guard core. On
// tool.execute.before it throws when a write tool names a file a vendored tree's
// overlay owns, which both OpenCode hosts treat as a refusal, and the reason
// names the overlay file to edit instead. A write it cannot judge is allowed,
// and every note goes to a log file because OpenCode paints plugin stdout and
// stderr onto the prompt line.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { appendFileSync, copyFileSync, mkdirSync, statSync, truncateSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { findRepoRoot, findSourceRoot } from '../skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs';

import { isHookEnabled } from '../hooks/shared/hook-flags.mjs';
import { dualPlugin } from './lib/v2-bridge.js';

const require = createRequire(import.meta.url);
// The policy is a .cjs core so the command hooks, Pi, DSH and this plugin run
// the same rules.
const guardCore = require('../hooks/overlay-guard/lib/overlay-guard.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Every tool whose call ends in a file write, compared lower-cased because a
// host spells the same tool in more than one case.
const WRITE_TOOLS = new Set(['write', 'edit', 'multiedit', 'patch', 'apply_patch']);
const PATCH_TOOLS = new Set(['patch', 'apply_patch']);
// A patch body arrives under one of these keys. A write tool's `content` is the
// text being written, so it is never read as a patch.
const PATCH_KEYS = ['patch', 'patchText', 'patch_text', 'input'];
const LOG_NAME = 'overlay-guard.log';
const MAX_LOG_BYTES = 256 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Logs live under the source root of the checkout the project sits in. A
// project with no toolchain tree logs under its .opencode directory instead.
function logPathFor(projectDir) {
  const repoRoot = findRepoRoot(projectDir);
  return join(findSourceRoot(repoRoot) ?? join(repoRoot, '.opencode'), 'logs', LOG_NAME);
}

// OpenCode paints plugin stdout and stderr onto the prompt line, so a guard
// failure goes to a bounded, rotated log instead. A logging error is swallowed:
// it must never affect the call being judged.
function appendGuardLog(projectDir, detail) {
  try {
    const logPath = logPathFor(projectDir);
    mkdirSync(dirname(logPath), { recursive: true });
    try {
      if (statSync(logPath).size >= MAX_LOG_BYTES) {
        copyFileSync(logPath, `${logPath}.1`);
        truncateSync(logPath, 0);
      }
    } catch {
      // A missing log is the normal first-write case.
    }
    appendFileSync(logPath, `${new Date().toISOString()} [overlay-guard] ${detail}\n`, 'utf8');
  } catch {
    // Swallowed on purpose, see above.
  }
}

/**
 * The paths one write call names, in the shape the core expects: the file field
 * for every write tool, plus each header a patch body carries.
 * @param {string} tool - Lower-cased tool name.
 * @param {object} args - The tool call's arguments.
 * @returns {string[]} Raw path strings; the core resolves and de-duplicates them.
 */
function targetPaths(tool, args) {
  const paths = [];
  const filePath = guardCore.fileFieldPath(args);
  if (filePath) paths.push(filePath);
  if (PATCH_TOOLS.has(tool)) {
    for (const key of PATCH_KEYS) paths.push(...guardCore.pathsFromPatch(args?.[key]));
  }
  return paths;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PLUGIN FACTORY
// ─────────────────────────────────────────────────────────────────────────────

async function OverlayGuardPlugin(ctx) {
  const projectDir = ctx?.directory || process.cwd();

  return {
    async 'tool.execute.before'(input, output) {
      const tool = String(input?.tool || '').toLowerCase();
      if (!WRITE_TOOLS.has(tool)) return;
      if (!isHookEnabled('overlay-guard')) return;

      let result;
      try {
        const paths = targetPaths(tool, output?.args ?? {});
        if (paths.length === 0) return;
        result = guardCore.evaluateWrite({ paths, sessionDir: projectDir });
      } catch (error) {
        // Fail open, but leave a trace: a broken core would otherwise leave
        // every write unguarded in silence.
        const message = error instanceof Error ? error.message : String(error);
        appendGuardLog(projectDir, `allowing a write it could not judge: ${message}`);
        return;
      }
      for (const note of result.notes ?? []) appendGuardLog(projectDir, note);
      if (result.decision === 'deny') throw new Error(result.reason);
    },
  };
}

export default dualPlugin('overlay-guard', OverlayGuardPlugin);
