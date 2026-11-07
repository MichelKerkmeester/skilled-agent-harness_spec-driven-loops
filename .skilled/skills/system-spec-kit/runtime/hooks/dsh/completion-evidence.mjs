// ───────────────────────────────────────────────────────────────────
// MODULE: Completion Evidence Adapter
// ───────────────────────────────────────────────────────────────────

import completionCore from '../lib/completion-evidence-sentinel.cjs';
import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { loadDshLlm } from '../../../../../hooks/shared/dsh/dsh-llm.mjs';

const { env: runtimeEnv } = process;

export const ERROR_POLICY = 'fail-open';

function textFromContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((part) => part && typeof part === 'object' && part.type === 'text')
    .map((part) => typeof part.text === 'string' ? part.text : '')
    .filter(Boolean)
    .join('\n');
}

function claimTextFromSession(agent, turn) {
  const snapshot = agent?.session?.snapshotEvents?.();
  if (!Array.isArray(snapshot)) return '';
  for (let index = snapshot.length - 1; index >= 0; index -= 1) {
    const event = snapshot[index];
    if (event?.type !== 'assistant/message' || event.data?.turn !== turn) continue;
    const message = event.data.message;
    if (message?.role === 'assistant') return textFromContent(message.content).trim();
  }
  return '';
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards completion-evidence: ${String(error)}`);
  } catch {
    // A logging failure must not affect turn stopping.
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text: `[completion-evidence] ${text}` }],
    source: { kind: 'repo-guards' },
  });
}

/**
 * When a stopping turn claims completion for a spec folder, run the shared
 * evidence check and inject its advisory.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Shared core, kill-switch resolver, notice factory, environment and cwd for tests.
 */
export function registerCompletionEvidence(ctx, {
  core = completionCore,
  isEnabled = isHookEnabled,
  createNotice = makeNotice,
  env = runtimeEnv,
  cwd = process.cwd(),
} = {}) {
  if (!isEnabled('completion')) return;

  ctx.on('agent/turn-stopping', async ({ agent, turn }) => {
    try {
      const claimText = claimTextFromSession(agent, turn);
      if (!core.detectCompletionClaim(claimText)) return;

      const projectDir = agent?.session?.header?.cwd ?? cwd;
      const specFolder = core.resolveSpecFolderFromText(claimText);
      if (!specFolder) return;

      const result = core.evaluateCompletionEvidence({ specFolder, claimText, projectDir, env });
      if (result.decision !== 'advise' || !result.detail) return;

      core.appendAdvisoryLog(projectDir, result.detail);
      agent.inject(await createNotice(result.detail));
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
