// ───────────────────────────────────────────────────────────────────
// MODULE: Prompt Advisor Adapter
// ───────────────────────────────────────────────────────────────────

import { isHookEnabled } from '../../../../hooks/shared/hook-flags.mjs';
import { loadDshLlm } from '../../../../hooks/shared/dsh/dsh-llm.mjs';
import { isLineageLeaf } from '../../../../hooks/shared/dsh/session-role.mjs';

const ADVISOR_MODULE_URL = new URL(
  '../../runtime/dist/hooks/claude/user-prompt-submit.js',
  import.meta.url,
).href;

// Mirrors the advisor renderer's directive label. A brief that drifts past it is
// never split, so it is always delivered whole.
const DIRECTIVE_SEPARATOR = '\nDirectives:';
const MAX_TRACKED_SESSIONS = 64;
const RECEIPTS = Symbol.for('skilled.repo-guards.directive-receipts');

export const ERROR_POLICY = 'fail-open';
// The advisor keys its metrics and outcome records by runtime and drops a label it does not list.
export const ADVISOR_RUNTIME = 'dsh';

function contentText(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content.map((part) => typeof part === 'string' ? part : part?.text)
    .filter((text) => typeof text === 'string').join('\n');
}

// Guard advisories and runtime-context snapshots also arrive as user-role messages,
// so only a message the operator typed counts as the prompt.
function latestOperatorPrompt(messages) {
  if (!Array.isArray(messages)) return '';
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role === 'user' && message.source?.kind === 'user') return contentText(message.content);
  }
  return '';
}

function receipts() {
  globalThis[RECEIPTS] ??= new Map();
  return globalThis[RECEIPTS];
}

function forgetReceipt(sessionId) {
  if (typeof sessionId === 'string' && sessionId) receipts().delete(sessionId);
}

function splitBrief(context) {
  const index = context.indexOf(DIRECTIVE_SEPARATOR);
  if (index > 0) return { head: context.slice(0, index), directives: context.slice(index) };
  const label = DIRECTIVE_SEPARATOR.slice(1);
  if (context.startsWith(label)) return { head: '', directives: context };
  return null;
}

/**
 * Deliver the directive block once per lifecycle epoch: in full the first time,
 * and as the routing head alone while the same block is still in context. An
 * unknown session, an unsplittable brief or a changed block gets the full text.
 */
function deliveredContext(context, sessionId, dedupEnabled) {
  const parts = splitBrief(context);
  if (!dedupEnabled || !parts || typeof sessionId !== 'string' || !sessionId) return context;
  const store = receipts();
  if (store.get(sessionId) === parts.directives) return parts.head.trim();
  if (!store.has(sessionId) && store.size >= MAX_TRACKED_SESSIONS) store.delete(store.keys().next().value);
  store.set(sessionId, parts.directives);
  return context;
}

function concernEnabled(isEnabled, concern) {
  try {
    return isEnabled(concern) !== false;
  } catch {
    return true;
  }
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

/**
 * Run the shared advisor hook for one operator prompt under the DSH runtime label.
 *
 * @param {Object} input - The UserPromptSubmit-shaped input.
 * @param {Function} [load] - Loads the advisor module, injectable for tests.
 * @returns {Promise<Object>} The advisor hook output.
 */
export async function runAdvisor(input, load = () => import(ADVISOR_MODULE_URL)) {
  const advisor = await load();
  return advisor.handleClaudeUserPromptSubmit(input, {
    runtime: ADVISOR_RUNTIME,
    writeDiagnostic: () => {},
  });
}

/**
 * Register the advisor brief on the DSH pre-step waterfall for interactive sessions.
 *
 * A fan-out leaf, marked by the lineage patch, gets no brief: its prompt is a fixed
 * task, so a route suggestion is noise. The directive block follows the shared
 * directive-lifecycle contract: once per session start or compaction.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Row flag and dependencies for deterministic tests.
 */
export function registerPromptAdvisor(ctx, {
  enabled = false,
  core = { runAdvisor },
  createNotice = makeNotice,
  isLeaf = isLineageLeaf,
  isEnabled = isHookEnabled,
} = {}) {
  if (enabled !== true) return;

  ctx.on('agent/created', async ({ agent }) => {
    forgetReceipt(agent?.session?.id);
    return undefined;
  });

  ctx.on('session/event', (session, event) => {
    if (event?.type === 'compaction/end' && !event.data?.error) forgetReceipt(session?.id);
  });

  ctx.on('agent/pre-step', async (payload, next) => {
    const downstream = await next();
    if (downstream.kind !== 'enter' || isLeaf()) return downstream;

    try {
      const prompt = latestOperatorPrompt(payload.messages);
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

      const delivered = deliveredContext(context, agent?.session?.id, concernEnabled(isEnabled, 'directive-lifecycle'));
      if (!delivered) return downstream;
      const notice = await createNotice(delivered);
      return { ...downstream, messages: [...(downstream.messages ?? []), notice] };
    } catch (error) {
      logFailure(ctx, error);
      return downstream;
    }
  });
}
