// ───────────────────────────────────────────────────────────────────
// MODULE: Task Dispatch Guard Adapter
// ───────────────────────────────────────────────────────────────────

import dispatchCore from '../lib/dispatch-guard.cjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

const { env: runtimeEnv } = process;

export const ERROR_POLICY = 'fail-open';

const DISPATCH_TOOLS = new Set(['subagent', 'subagent_fork']);

function firstString(...values) {
  return values.find((value) => typeof value === 'string' && value.trim())?.trim();
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards task-dispatch-guard: ${String(error)}`);
  } catch {
    // A logging failure must not affect a valid hand-off.
  }
}

export function registerTaskDispatchGuard(ctx, {
  core = dispatchCore,
  isEnabled = isHookEnabled,
  env = runtimeEnv,
  cwd = process.cwd(),
} = {}) {
  if (!isEnabled('task-dispatch')) return;

  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!DISPATCH_TOOLS.has(exec.name)) return next();
    const args = exec.arguments ?? {};
    if (typeof args.action === 'string' || typeof args.resume === 'string') return next();
    const prompt = firstString(args.prompt, args.task, args.message, args.workflowScript);
    if (!prompt) return next();

    try {
      const projectDir = exec.agent?.session?.header?.cwd ?? cwd;
      const result = core.evaluateDispatch({
        subagentType: firstString(args.agent, args.agent_preset, args.subagent_type, args.subagentType),
        prompt,
        sessionID: exec.agent?.session?.id,
        projectDir,
        env,
      });
      const { stateDir } = core.resolveGuardPaths(projectDir);
      for (const audit of result.audits ?? []) core.appendRejectModeDegradedAudit(stateDir, audit);
      for (const warning of result.warnings ?? []) core.appendWarningLog(stateDir, warning);
    } catch (error) {
      logFailure(ctx, error);
    }
    return next();
  });
}
