// ───────────────────────────────────────────────────────────────────
// MODULE: Classifier Injection Screen Adapter
// ───────────────────────────────────────────────────────────────────

import {
  fetchedText,
  screenAdvisory,
} from '../lib/classifier-injection-advisory.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { loadDshLlm } from '../../shared/dsh/dsh-llm.mjs';

export const ERROR_POLICY = 'fail-open';

function isScreenedTool(name) {
  return name === 'web_fetch' || name === 'web_search' || name.startsWith('mcp__');
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards classifier-injection-screen: ${String(error)}`);
  } catch {
    // A logging failure must not change the fetched result.
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

export function registerClassifierInjectionScreen(ctx, {
  core = { fetchedText, screenAdvisory },
  isEnabled = isHookEnabled,
  createNotice = makeNotice,
} = {}) {
  if (!isEnabled('injection-screen')) return;

  ctx.on('tools/post-execute', async (exec, result, next) => {
    const downstream = await next();
    if (!isScreenedTool(exec.name) || downstream.kind !== 'accept') return downstream;

    try {
      const advisory = await core.screenAdvisory(core.fetchedText(result.content ?? result.value));
      if (typeof advisory !== 'string' || advisory.length === 0) return downstream;
      const notice = await createNotice(advisory);
      return {
        ...downstream,
        additionalContexts: [...(downstream.additionalContexts ?? []), notice],
      };
    } catch (error) {
      logFailure(ctx, error);
      return downstream;
    }
  });
}
