// ───────────────────────────────────────────────────────────────────
// MODULE: Session Stop Context Adapter
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { isLineageLeaf } from '../../../../../hooks/shared/dsh/session-role.mjs';

export const SESSION_STOP_PATH = fileURLToPath(new URL(
  '../../dist/hooks/claude/session-stop.js',
  import.meta.url,
));
const TIMEOUT_MS = 10_000;

// An autosave failure must never block the session from closing.
export const ERROR_POLICY = 'fail-open';

function lifecycleEnabled(isEnabled) {
  try {
    return isEnabled('session-lifecycle') !== false;
  } catch {
    return true;
  }
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards session-stop-context: ${String(error)}`);
  } catch {
    // A logging failure must not block the session from closing.
  }
}

/**
 * Run the shared session-stop hook with the Stop payload Pi sends on quit.
 *
 * @param {{sessionId: string, projectDir: string}} input - Session identity.
 * @param {Function} [spawn] - Synchronous spawner, replaced in tests.
 * @returns {Object} The spawn result.
 */
export function runSessionStop({ sessionId, projectDir }, spawn = spawnSync) {
  return spawn(process.execPath, [SESSION_STOP_PATH], {
    cwd: projectDir,
    encoding: 'utf8',
    input: JSON.stringify({ session_id: sessionId, cwd: projectDir, hook_event_name: 'Stop' }),
    timeout: TIMEOUT_MS,
  });
}

/**
 * Run session-stop's autosave and state cleanup when an interactive agent closes.
 *
 * A fan-out leaf skips it: the autosave writes continuity into the spec folder,
 * and a disposable child must never write the operator's packet state.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Core and switches for deterministic tests.
 */
export function registerSessionStopContext(ctx, {
  core = { runSessionStop },
  isEnabled = isHookEnabled,
  isLeaf = isLineageLeaf,
} = {}) {
  if (!lifecycleEnabled(isEnabled)) return;

  ctx.on('agent/disposed', ({ agent } = {}) => {
    if (isLeaf()) return;
    try {
      const sessionId = agent?.session?.id;
      if (typeof sessionId !== 'string' || !sessionId) return;
      const projectDir = agent.session.header?.cwd ?? process.cwd();
      core.runSessionStop({ sessionId, projectDir });
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
