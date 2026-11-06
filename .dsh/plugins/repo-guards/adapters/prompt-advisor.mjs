// ───────────────────────────────────────────────────────────────────
// MODULE: Prompt Advisor Adapter
// ───────────────────────────────────────────────────────────────────

import { loadDshLlm } from './dsh-llm.mjs';

const ADVISOR_MODULE_URL = new URL(
  '../../../../.skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js',
  import.meta.url,
).href;

export const ERROR_POLICY = 'fail-open';

function contentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map((part) => typeof part === 'string' ? part : part?.text)
    .filter((text) => typeof text === 'string').join('\n');
}

function latestUserPrompt(messages) {
  if (!Array.isArray(messages)) return '';
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index]?.role === 'user') return contentText(messages[index].content);
  }
  return '';
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards prompt-advisor: ${String(error)}`);
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

async function runAdvisor(input) {
  const advisor = await import(ADVISOR_MODULE_URL);
  return advisor.handleClaudeUserPromptSubmit(input, {
    runtime: 'pi',
    writeDiagnostic: () => {},
  });
}

/** Register the optional advisor context on the DSH pre-step waterfall. */
export function registerPromptAdvisor(ctx, {
  enabled = false,
  core = { runAdvisor },
  createNotice = makeNotice,
} = {}) {
  if (enabled !== true) return;

  ctx.on('agent/pre-step', async (payload, next) => {
    const downstream = await next();
    if (downstream.kind !== 'enter') return downstream;

    try {
      const prompt = latestUserPrompt(payload.messages);
      if (!prompt.trim()) return downstream;

      const agent = payload.agent;
      const projectDir = agent?.session?.header?.cwd ?? process.cwd();
      const output = await core.runAdvisor({
        prompt,
        cwd: projectDir,
        session_id: agent?.session?.id,
        hook_event_name: 'UserPromptSubmit',
      });
      const context = output?.hookSpecificOutput?.additionalContext;
      if (typeof context !== 'string' || !context.trim()) return downstream;

      const notice = await createNotice(context);
      return { ...downstream, messages: [...(downstream.messages ?? []), notice] };
    } catch (error) {
      logFailure(ctx, error);
      return downstream;
    }
  });
}
