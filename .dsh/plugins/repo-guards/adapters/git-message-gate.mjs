// ───────────────────────────────────────────────────────────────────
// MODULE: Git Message Gate Adapter
// ───────────────────────────────────────────────────────────────────

import { ContractError } from '../../../../.skilled/skills/sk-git/scripts/lib/message-contract.mjs';
import { evaluateCommand } from '../../../../.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs';

export const ERROR_POLICY = 'fail-open';

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards git-message-gate: ${String(error)}`);
  } catch {
    return undefined;
  }
  return undefined;
}

/** Register the shared message contract as a bash pre-execution gate. */
export function registerGitMessageGate(ctx, {
  core = { evaluateCommand },
  contractError = ContractError,
  cwd = process.cwd(),
} = {}) {
  ctx.on('tools/pre-execute', async (call, next) => {
    if (call.name !== 'bash' || typeof call.arguments?.command !== 'string') return next();

    const projectDir = call.agent?.session?.header?.cwd ?? call.cwd ?? cwd;
    try {
      const reason = core.evaluateCommand(call.arguments.command, projectDir);
      if (reason) return { kind: 'deny', reason };
    } catch (error) {
      logFailure(ctx, error);
      if (error instanceof contractError) {
        return {
          kind: 'deny',
          reason: `sk-git blocked this command because its contract could not be read: ${error.message}`,
        };
      }
    }
    return next();
  });
}
