// ───────────────────────────────────────────────────────────────────
// MODULE: MCP Route Guard Adapter
// ───────────────────────────────────────────────────────────────────

import { fileURLToPath } from 'node:url';

import guardCore from '../../../../.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs';
import { isHookEnabled, isTruthy } from '../../../../.skilled/hooks/shared/hook-flags.mjs';

const { env: runtimeEnv } = process;

// A dsh session can run outside the checkout, so repository rules come from this file's location.
const REPO_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

// A guard that cannot evaluate a call cannot vouch for it, so a core failure denies the call.
export const ERROR_POLICY = 'fail-closed';

const MCP_TOOL_PREFIX = 'mcp__';
const CODE_MODE_SERVER = 'code_mode';

// The model-facing Code Mode surface is discovery, inspection and execution.
// The manual and credential controls stay off a dsh mount, where an autonomous
// leaf has no operator to approve a runtime registration.
const CODE_MODE_TOOL_ALLOWLIST = new Set([
  'call_tool_chain',
  'list_tools',
  'search_tools',
  'tool_info',
]);

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards mcp-route-guard: ${String(error)}`);
  } catch {
    // A logging failure must not change the call decision.
  }
}

function outsideAllowlistReason(toolName) {
  const surface = [...CODE_MODE_TOOL_ALLOWLIST].join(', ');
  return `mcp-route-guard: "${toolName}" is outside the Code Mode allowlist; this mount exposes only ${surface}.`;
}

/**
 * Gate native MCP tool calls on the shared route-guard core, then deny a
 * Code Mode tool the dsh mount does not expose.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Runtime dependencies for deterministic tests.
 * @param {Object} [options.core] - Shared mcp-route-guard core.
 * @param {Function} [options.isEnabled] - Hook kill-switch resolver.
 * @param {Object} [options.env] - Environment for the core's kill switches.
 * @param {string} [options.repoRoot] - Checkout whose Code Mode manifest the core reads.
 */
export function registerMcpRouteGuard(ctx, {
  core = guardCore,
  isEnabled = isHookEnabled,
  env = runtimeEnv,
  repoRoot = REPO_ROOT,
} = {}) {
  if (!isEnabled('mcp-route-guard')) return;

  ctx.on('tools/pre-execute', async (exec, next) => {
    if (typeof exec.name !== 'string' || !exec.name.startsWith(MCP_TOOL_PREFIX)) return next();

    try {
      const verdict = core.evaluateNativeMcpCall({ toolName: exec.name, projectDir: repoRoot, env });
      // The mount allowlist is part of this guard, so the core's kill switch must silence it too.
      if (isTruthy(env[core.DISABLED_ENV])) return next();
      const parsed = core.parseClaudeShape(exec.name);
      if (parsed?.server === CODE_MODE_SERVER && !CODE_MODE_TOOL_ALLOWLIST.has(parsed.tool)) {
        return { kind: 'deny', reason: outsideAllowlistReason(exec.name) };
      }
      // dsh pre-execute has no advisory channel, so the core's routing warning
      // becomes the deny reason instead of the Pi extension's attached warning.
      if (verdict.decision === 'warn') {
        return { kind: 'deny', reason: verdict.warnings.join('\n') };
      }
    } catch (error) {
      logFailure(ctx, error);
      return { kind: 'deny', reason: `mcp-route-guard: could not evaluate "${exec.name}"; the call is denied.` };
    }
    return next();
  });
}
