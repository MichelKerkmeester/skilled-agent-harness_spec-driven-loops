// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Gate Enforcement Adapter
// ───────────────────────────────────────────────────────────────────

import {
  resolveSessionKey,
  runEnforceGate,
} from '../lib/spec-gate/spec-gate-core.mjs';

const { env: runtimeEnv } = process;

export const ERROR_POLICY = 'fail-closed';

const GUARDED_TOOLS = new Set(['write', 'edit', 'apply_patch', 'bash']);

function filePathFrom(args) {
  for (const key of ['path', 'file_path', 'filePath']) {
    if (typeof args?.[key] === 'string' && args[key]) return args[key];
  }
  return undefined;
}

function logFailure(ctx, error) {
  try {
    ctx.logger.error(`repo-guards spec-gate-enforce: ${String(error)}`);
  } catch {
    // A logging failure cannot change the deny decision.
  }
}

/**
 * Deny a write, edit, patch or bash call the shared spec gate blocks, and ask
 * before a write or edit while the gate is open and its notice is undelivered.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Shared core, environment and cwd for tests.
 */
export function registerSpecGateEnforce(ctx, {
  core = { resolveSessionKey, runEnforceGate },
  env = runtimeEnv,
  cwd = process.cwd(),
} = {}) {
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GUARDED_TOOLS.has(exec.name)) return next();

    const projectDir = exec.agent?.session?.header?.cwd ?? cwd;
    let result;
    try {
      const sessionID = core.resolveSessionKey({ sessionId: exec.agent?.session?.id });
      result = core.runEnforceGate({
        tool: exec.name,
        filePath: filePathFrom(exec.arguments),
        sessionID,
        projectDir,
        env,
        runtimeKey: 'dsh',
      });
      if (result.decision === 'deny') {
        return { kind: 'deny', reason: result.detail || 'Blocked by the spec gate.' };
      }
      if ((exec.name === 'write' || exec.name === 'edit') && result.gateOpenUndelivered) {
        const verdict = { kind: 'ask', reason: result.detail || 'Choose a spec folder before this write.' };
        // The returned verdict is the delivery, so record it now or every later write asks again.
        result.observe?.();
        return verdict;
      }
    } catch (error) {
      logFailure(ctx, error);
      return { kind: 'deny', reason: 'Spec gate enforcement failed closed because the shared guard could not complete.' };
    }
    return next();
  });
}
