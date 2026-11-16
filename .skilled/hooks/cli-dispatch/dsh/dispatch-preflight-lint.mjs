// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Preflight Lint Adapter
// ───────────────────────────────────────────────────────────────────

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { evaluateDispatch } from '../lib/dispatch-rule-checks.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

// A dsh session runs in a lineage or scratch folder, so the checkout comes from this file, not the cwd.
const REPO_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

export const ERROR_POLICY = 'fail-closed';

function logFailure(ctx, error) {
  try {
    ctx.logger.error(`repo-guards dispatch-preflight-lint: ${String(error)}`);
  } catch {
    // A logging failure cannot change the deny decision.
  }
}

function logAdvisory(ctx, message) {
  try {
    ctx.logger.warn(`repo-guards dispatch-preflight-lint: ${message}`);
  } catch {
    // Advisory logging must not change the shared-core verdict.
  }
}

/**
 * Deny a bash dispatch that breaks a target skill's blocking hard rules, and log
 * the rules it only warns on.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Shared core, kill-switch resolver and checkout root for tests.
 */
export function registerDispatchPreflightLint(ctx, {
  core = { evaluateDispatch },
  isEnabled = isHookEnabled,
  repoRoot = REPO_ROOT,
} = {}) {
  if (!isEnabled('dispatch-guard')) return;

  ctx.on('tools/pre-execute', async (exec, next) => {
    if (exec.name !== 'bash' || typeof exec.arguments?.command !== 'string') return next();

    let blocking;
    try {
      const verdicts = core.evaluateDispatch(exec.arguments.command, join(repoRoot, '.skilled', 'skills'));
      blocking = verdicts.flatMap((verdict) => (verdict.violations ?? [])
        .filter((violation) => violation.severity === 'block')
        .map((violation) => `${verdict.skill}: ${violation.message}`));
      for (const verdict of verdicts) {
        const warnings = (verdict.violations ?? []).filter((violation) => violation.severity === 'warn');
        if (warnings.length > 0) {
          logAdvisory(ctx, warnings.map((item) => item.message).join('\n'));
        }
      }
    } catch (error) {
      logFailure(ctx, error);
      return { kind: 'deny', reason: 'Dispatch preflight failed closed because the shared rule check could not complete.' };
    }
    if (blocking.length > 0) return { kind: 'deny', reason: blocking.join('\n') };
    return next();
  });
}
