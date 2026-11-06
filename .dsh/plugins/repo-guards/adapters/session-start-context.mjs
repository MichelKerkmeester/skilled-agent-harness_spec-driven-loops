// ───────────────────────────────────────────────────────────────────
// MODULE: Session Start Context Adapter
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { isHookEnabled } from '../../../../.skilled/hooks/shared/hook-flags.mjs';
import { loadDshLlm } from './dsh-llm.mjs';

const SESSION_PRIME_PATH = fileURLToPath(new URL(
  '../../../../.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js',
  import.meta.url,
));
const TIMEOUT_MS = 2_800;
const MAX_BUFFER_BYTES = 1_048_576;

export const ERROR_POLICY = 'fail-open';

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards session-start-context: ${String(error)}`);
  } catch {
    return undefined;
  }
  return undefined;
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

function runSessionPrime({ sessionId, projectDir, source }, spawn = spawnSync) {
  const result = spawn(process.execPath, [SESSION_PRIME_PATH], {
    cwd: projectDir,
    encoding: 'utf8',
    input: JSON.stringify({ session_id: sessionId, cwd: projectDir, source }),
    maxBuffer: MAX_BUFFER_BYTES,
    timeout: TIMEOUT_MS,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`session-prime exited with status ${String(result.status)}`);
  }
  return (result.stdout ?? '').trim();
}

function lifecycleEnabled(isEnabled) {
  try {
    return isEnabled('session-lifecycle') !== false;
  } catch {
    return true;
  }
}

/** Register session-prime context on the DSH agent creation event. */
export function registerSessionStartContext(ctx, {
  core = { runSessionPrime },
  isEnabled = isHookEnabled,
  createNotice = makeNotice,
} = {}) {
  if (!lifecycleEnabled(isEnabled)) return;

  ctx.on('agent/created', async ({ agent, source }) => {
    try {
      const sessionId = agent?.session?.id;
      if (typeof sessionId !== 'string' || !sessionId) return undefined;

      const projectDir = agent?.session?.header?.cwd ?? process.cwd();
      const context = core.runSessionPrime({
        sessionId,
        projectDir,
        source: source ?? 'startup',
      });
      if (typeof context !== 'string' || !context.trim()) return undefined;

      agent.inject(await createNotice(context));
    } catch (error) {
      logFailure(ctx, error);
    }
    return undefined;
  });
}
