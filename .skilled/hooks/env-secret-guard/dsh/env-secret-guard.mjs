// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard Adapter
// ───────────────────────────────────────────────────────────────────

import guardCore from '../lib/env-secret-guard.cjs';
import guardWatch from '../lib/env-secret-watch.cjs';
import { loadDshLlm } from '../../shared/dsh/dsh-llm.mjs';

// A guard bug must never block a call it could not judge, so an adapter error
// allows the call, the same choice every other runtime makes.
export const ERROR_POLICY = 'fail-open';

function log(ctx, message) {
  try {
    ctx.logger.warn(message);
  } catch {
    // A logging failure must not change the decision.
  }
}

/**
 * Deny a read, write, edit, patch, grep or shell call that would expose a dotenv file.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Shared core and kill-switch resolver for tests.
 */
async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

export function registerEnvSecretGuard(ctx, {
  core = guardCore,
  watch = guardWatch,
  isEnabled = () => core.isGuardEnabled(),
  createNotice = makeNotice,
  cwd = process.cwd(),
} = {}) {
  if (!isEnabled(core.CONCERN)) return;
  ctx.on('tools/pre-execute', async (exec, next) => {
    try {
      const sessionDir = exec.agent?.session?.header?.cwd ?? cwd;
      const result = core.evaluateToolCall({ tool: exec.name, input: exec.arguments ?? {}, cwd: sessionDir });
      if (result.decision === 'deny') return { kind: 'deny', reason: result.reason };
      if (core.SHELL_TOOLS.has(String(exec.name).toLowerCase())) watch.snapshotDotenv(sessionDir);
    } catch (error) {
      log(ctx, `repo-guards env-secret-guard: ${String(error)}`);
    }
    return next();
  });

  // After the call: undo a dotenv write and report a dotenv value in the result.
  ctx.on('tools/post-execute', async (exec, result, next) => {
    const downstream = await next();
    try {
      const sessionDir = exec.agent?.session?.header?.cwd ?? cwd;
      const review = watch.reviewToolResult({
        tool: exec.name,
        output: result?.content ?? result?.value,
        cwd: sessionDir,
      });
      if (!review.message) return downstream;
      const notice = await createNotice(review.message);
      return { ...downstream, additionalContexts: [...(downstream.additionalContexts ?? []), notice] };
    } catch (error) {
      log(ctx, `repo-guards env-secret-guard: ${String(error)}`);
      return downstream;
    }
  });
}
