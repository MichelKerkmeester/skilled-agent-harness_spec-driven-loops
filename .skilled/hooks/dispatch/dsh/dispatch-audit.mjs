// ───────────────────────────────────────────────────────────────────
// MODULE: Dispatch Audit Adapter
// ───────────────────────────────────────────────────────────────────

import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEFAULT_LOG_RELATIVE_PATH, recordDispatch } from '../lib/dispatch-audit.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

// A dsh session runs in a lineage or scratch folder, so the checkout comes from this file, not the cwd.
const REPO_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

const { env: runtimeEnv } = process;

export const ERROR_POLICY = 'fail-open';

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards dispatch-audit: ${String(error)}`);
  } catch {
    // Logging must not affect a completed tool call.
  }
}

export function registerDispatchAudit(ctx, {
  core = { recordDispatch },
  isEnabled = isHookEnabled,
  repoRoot = REPO_ROOT,
} = {}) {
  if (!isEnabled('dispatch')) return;

  ctx.on('tools/post-execute', async (exec, result, next) => {
    const downstream = await next();
    if (exec.name !== 'bash' || typeof exec.arguments?.command !== 'string') return downstream;

    try {
      const outputText = Array.isArray(result.content)
        ? result.content.map((part) => typeof part?.text === 'string' ? part.text : '').filter(Boolean).join('\n')
        : undefined;
      core.recordDispatch({
        command: exec.arguments.command,
        logPath: join(repoRoot, DEFAULT_LOG_RELATIVE_PATH),
        runtime: 'dsh',
        sessionID: exec.agent?.session?.id,
        callID: exec.callId,
        outputText,
        outputBytes: typeof result.value === 'string' ? Buffer.byteLength(result.value) : undefined,
        metadataObj: { isError: result.isError, error: result.error },
        env: runtimeEnv,
      });
    } catch (error) {
      logFailure(ctx, error);
    }
    return downstream;
  });
}
