// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Gate Classifier Adapter
// ───────────────────────────────────────────────────────────────────

import {
  GATE_3_DEFERRED_INSTRUCTION,
  recordGate3NoticeDelivered,
  resolveSessionKey,
  runClassifyGate,
  sanitizePromptForClassify,
  shouldDeliverGate3Deferral,
} from '../lib/spec-gate/spec-gate-core.mjs';
import { loadDshLlm } from '../../../../../hooks/shared/dsh/dsh-llm.mjs';

const { env: runtimeEnv } = process;

export const ERROR_POLICY = 'fail-open';

function contentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map((part) => typeof part === 'string' ? part : part?.text)
    .filter((text) => typeof text === 'string').join('\n');
}

// Guard notices and session-context snapshots also arrive as user-role messages, and a
// notice can read like a mutation request or a Gate 3 answer, so only a message the
// operator typed is classified.
function latestOperatorPrompt(messages) {
  if (!Array.isArray(messages)) return '';
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role === 'user' && message.source?.kind === 'user') return contentText(message.content);
  }
  return '';
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards spec-gate-classify: ${String(error)}`);
  } catch {
    // A logging failure must not interrupt the model step.
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
 * Classify each operator prompt with the shared spec gate and add the deferred
 * Gate 3 instruction to the step when the gate opens.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Shared core, notice factory, environment and cwd for tests.
 */
export function registerSpecGateClassify(ctx, {
  core = {
    resolveSessionKey,
    sanitizePromptForClassify,
    runClassifyGate,
    shouldDeliverGate3Deferral,
    recordGate3NoticeDelivered,
    GATE_3_DEFERRED_INSTRUCTION,
  },
  createNotice = makeNotice,
  env = runtimeEnv,
  cwd = process.cwd(),
} = {}) {
  ctx.on('agent/pre-step', async (payload, next) => {
    const downstream = await next();
    try {
      if (downstream.kind !== 'enter') return downstream;
      const operatorPrompt = latestOperatorPrompt(payload.messages);
      if (!operatorPrompt.trim()) return downstream;
      const agent = payload.agent;
      const projectDir = agent?.session?.header?.cwd ?? cwd;
      const sessionID = core.resolveSessionKey({ sessionId: agent?.session?.id });
      const prompt = core.sanitizePromptForClassify(operatorPrompt);
      const result = core.runClassifyGate({
        prompt,
        sessionID,
        projectDir,
        env,
        runtimeLabel: 'DSH',
      });
      if (!result.question || !core.shouldDeliverGate3Deferral({ sessionID, projectDir, env }).deliver) {
        return downstream;
      }

      const notice = await createNotice(core.GATE_3_DEFERRED_INSTRUCTION);
      core.recordGate3NoticeDelivered({ sessionID, projectDir, env, channel: 'classify-deferral' });
      return { ...downstream, messages: [...downstream.messages, notice] };
    } catch (error) {
      logFailure(ctx, error);
      return downstream;
    }
  });
}
