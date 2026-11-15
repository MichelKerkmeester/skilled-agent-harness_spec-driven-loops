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

export function buildRecoveryPointer() {
  return '## Recovery\nRun `/speckit:resume` against the active packet to recover session state.';
}

export function composeCompactionContext(baseContext) {
  const sections = [];
  if (typeof baseContext === 'string' && baseContext.trim()) sections.push(baseContext.trim());

  // The session-prime output already names /speckit:resume on every path, so a
  // second pointer would only repeat the instruction the model has already been
  // given.
  const primed = sections.length > 0 && sections[0].includes('/speckit:resume');
  if (!primed) sections.push(buildRecoveryPointer());
  return sections.join('\n\n');
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
      const sessionId = session && typeof session.id === 'string' ? session.id : null;
      if (!sessionId) return;
      const agent = getAgent(sessionId);
      if (!agent) return;

      const projectDir = session.header?.cwd ?? process.cwd();

      const context = composeCompactionContext(
        core.runSessionPrime({ sessionId, projectDir, source: 'compact' }),
      );
      if (typeof context !== 'string' || !context.trim()) return;

      agent.inject(await createNotice(context));
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
