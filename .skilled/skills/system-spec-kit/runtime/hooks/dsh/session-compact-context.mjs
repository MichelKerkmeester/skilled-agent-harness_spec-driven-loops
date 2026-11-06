// ───────────────────────────────────────────────────────────────────
// MODULE: Session Compact Context Adapter
// ───────────────────────────────────────────────────────────────────

import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { loadDshLlm } from '../../../../../hooks/shared/dsh/dsh-llm.mjs';
import { runSessionPrime } from './session-start-context.mjs';

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
    ctx.logger.warn(`repo-guards session-compact-context: ${String(error)}`);
  } catch {
    // A logging failure must not interrupt the session feed.
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

/**
 * Re-prime the agent after a completed compaction, the post-compact recovery
 * Claude and Pi get from session-prime's `compact` source.
 *
 * dsh never emits `agent/created` with a compact source, so the completed
 * `compaction/end` entry on the session feed is the trigger. A failed
 * compaction kept the old history, so it gets nothing.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Core, agent lookup and switches for deterministic tests.
 */
export function registerSessionCompactContext(ctx, {
  core = { runSessionPrime },
  getAgent = () => undefined,
  isEnabled = isHookEnabled,
  createNotice = makeNotice,
} = {}) {
  if (!lifecycleEnabled(isEnabled)) return;

  ctx.on('session/event', async (session, event) => {
    if (event?.type !== 'compaction/end' || event.data?.error) return;

    try {
      const sessionId = session?.id;
      if (typeof sessionId !== 'string' || !sessionId) return;
      const agent = getAgent(sessionId);
      if (!agent) return;

      const projectDir = session.header?.cwd ?? process.cwd();
      const context = core.runSessionPrime({ sessionId, projectDir, source: 'compact' });
      if (typeof context !== 'string' || !context.trim()) return;

      agent.inject(await createNotice(context));
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
