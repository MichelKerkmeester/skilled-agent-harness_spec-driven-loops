// ───────────────────────────────────────────────────────────────────
// MODULE: Decision Capture Adapter
// ───────────────────────────────────────────────────────────────────

import { appendRecords, takeNudge } from '../lib/capture-core.mjs';
import { QUESTION_TOOL, dshAnswerRecords, recoveredRecords } from '../bin/sweep-dsh.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { loadDshLlm } from '../../shared/dsh/dsh-llm.mjs';

// Capture is a side record of the operator's answers: a broken queue must never
// change a tool result, and the save-time sweep recovers whatever this misses.
export const ERROR_POLICY = 'fail-open';

const LATE_REPLY_SOURCE = 'user-question-reply';

function contentText(content) {
  if (!Array.isArray(content)) return '';
  return content.filter((item) => item?.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text).join('\n');
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards decision-capture: ${String(error)}`);
  } catch {
    // A logging failure must not change the tool result.
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

function sessionOf(agent, cwd) {
  const sessionId = agent?.session?.id;
  if (typeof sessionId !== 'string' || !sessionId) return null;
  return { sessionId, projectDir: agent.session.header?.cwd ?? cwd };
}

/**
 * Queue every answered `ask_user_question` for the next full-auto save, and
 * remind the operator once answers wait.
 *
 * DSH has no operator notice a plugin can raise, so the reminder is a notice
 * injected at idle that rides with the operator's next prompt.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Queue core and switches for deterministic tests.
 */
export function registerDecisionCapture(ctx, {
  core = { appendRecords, takeNudge },
  isEnabled = isHookEnabled,
  createNotice = makeNotice,
  cwd = process.cwd(),
} = {}) {
  if (!isEnabled('decision-capture')) return;

  const queue = (session, records) => {
    const tagged = records.map((record) => ({ ...record, source: 'hook' }));
    if (tagged.length > 0) core.appendRecords(session.projectDir, session.sessionId, tagged);
  };

  ctx.on('tools/result', (exec, result) => {
    if (exec?.name !== QUESTION_TOOL || result?.isError) return;
    try {
      const session = sessionOf(exec.agent, cwd);
      if (!session) return;
      // The live value is the same answer batch the result text spells, so a live
      // record and a swept one get the same key and never queue twice.
      queue(session, dshAnswerRecords({
        callId: exec.callId,
        args: exec.arguments,
        value: result.value ?? contentText(result.content),
        sessionId: session.sessionId,
        source: 'hook',
      }));
    } catch (error) {
      logFailure(ctx, error);
    }
  });

  // A timed question that timed out is answered later by a steered user message.
  ctx.on('session/event', (session, event) => {
    if (event?.type !== 'user/message' || event.data?.source?.kind !== LATE_REPLY_SOURCE) return;
    try {
      const target = sessionOf({ session }, cwd);
      if (!target) return;
      queue(target, recoveredRecords([event], target.sessionId, new Date().toISOString()));
    } catch (error) {
      logFailure(ctx, error);
    }
  });

  ctx.on('agent/status', async ({ agent, status } = {}) => {
    if (status !== 'idle') return;
    try {
      const session = sessionOf(agent, cwd);
      if (!session) return;
      const count = core.takeNudge(session.projectDir, session.sessionId);
      if (count > 0) {
        agent.inject(await createNotice(
          `${count} operator answer(s) captured this session are not in a decision record yet. `
          + 'Run /speckit:save with --full-auto to record them.',
        ));
      }
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
