// ───────────────────────────────────────────────────────────────────
// MODULE: Overlay Guard Adapter
// ───────────────────────────────────────────────────────────────────

import overlayCore from '../lib/overlay-guard.cjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

// The core denies only a path an overlay owns and allows anything it cannot judge,
// so an adapter error allows the write too, the same choice every other runtime makes.
export const ERROR_POLICY = 'fail-open';

const FILE_TOOLS = new Set(['write', 'edit']);
const PATCH_TOOL = 'apply_patch';

function targetPaths(core, exec) {
  const args = exec.arguments ?? {};
  if (exec.name === PATCH_TOOL) return core.pathsFromPatch(args.patch ?? args.input);
  const filePath = core.fileFieldPath(args);
  return filePath ? [filePath] : [];
}

function log(ctx, message) {
  try {
    ctx.logger.warn(message);
  } catch {
    // A logging failure must not change the write decision.
  }
}

/**
 * Deny a write, edit or patch that touches a file a vendored tree's overlay owns.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Shared core and kill-switch resolver for tests.
 */
export function registerOverlayGuard(ctx, {
  core = overlayCore,
  isEnabled = isHookEnabled,
  cwd = process.cwd(),
} = {}) {
  if (!isEnabled('overlay-guard')) return;

  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!FILE_TOOLS.has(exec.name) && exec.name !== PATCH_TOOL) return next();

    try {
      const paths = targetPaths(core, exec);
      if (paths.length === 0) return next();
      const sessionDir = exec.agent?.session?.header?.cwd ?? cwd;
      const result = core.evaluateWrite({ paths, sessionDir });
      for (const note of result.notes ?? []) log(ctx, note);
      if (result.decision === 'deny') return { kind: 'deny', reason: result.reason };
    } catch (error) {
      log(ctx, `repo-guards overlay-guard: ${String(error)}`);
    }
    return next();
  });
}
