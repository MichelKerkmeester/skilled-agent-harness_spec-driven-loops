// ───────────────────────────────────────────────────────────────────
// MODULE: Prompt Advisor Adapter
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { isHookEnabled } from '../../../../hooks/shared/hook-flags.mjs';
import { loadDshLlm } from '../../../../hooks/shared/dsh/dsh-llm.mjs';
import { isLineageLeaf } from '../../../../hooks/shared/dsh/session-role.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ADVISOR_MODULE_URL = new URL(
  '../../runtime/dist/hooks/claude/user-prompt-submit.js',
  import.meta.url,
).href;
const LIFECYCLE_MODULE_URL = new URL(
  '../../runtime/dist/hooks/lib/directive-lifecycle.js',
  import.meta.url,
).href;
const ROUTE_RECEIPT_MODULE_URL = new URL(
  '../../runtime/dist/hooks/lib/route-receipt.js',
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

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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
 * The receipt is recorded by the returned `remember`, which the caller runs only
 * once the notice exists, so a turn whose notice fails sends the block again.
 */
function deliveredContext(context, sessionId, dedupEnabled) {
  const unchanged = { text: context, remember: () => {} };
  const parts = splitBrief(context);
  if (!dedupEnabled || !parts || typeof sessionId !== 'string' || !sessionId) return unchanged;
  const store = receipts();
  if (store.get(sessionId) === parts.directives) return { text: parts.head.trim(), remember: () => {} };
  return {
    text: context,
    remember: () => {
      if (!store.has(sessionId) && store.size >= MAX_TRACKED_SESSIONS) store.delete(store.keys().next().value);
      store.set(sessionId, parts.directives);
    },
  };
}

// A clock rotation is advisory: the boundary has already dropped the session's
// route receipt, so a failure is logged and never reaches the host. DSH sends no
// transcript path, so a receipt here never expires on a shrinking transcript.
// A session with no id has no clock to move, so only a named session whose clock
// did not move counts as a failure.
async function rotateSessionClock(ctx, core, sessionId) {
  try {
    const advanced = await core.advanceBoundary?.(sessionId);
    if (advanced === false && typeof sessionId === 'string' && sessionId.trim()) {
      logFailure(ctx, new Error('session clock did not advance'));
    }
  } catch (error) {
    logFailure(ctx, error);
  }
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

// A lost commit only means the next turn is briefed and routed as if this one
// had not happened, so a failure is logged and never reaches the host.
async function commitDeliveredReceipts(ctx, core, output) {
  try {
    await core.commitDelivery?.(output);
  } catch (error) {
    logFailure(ctx, error);
  }
}

async function makeNotice(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({
    content: [{ type: 'text', text }],
    source: { kind: 'repo-guards' },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the shared advisor hook for one operator prompt under the DSH runtime label.
 *
 * @param {Object} input - The UserPromptSubmit-shaped input.
 * @param {Function} [load] - Loads the advisor module, injectable for tests.
 * @returns {Promise<Object>} The advisor hook output.
 */
export async function runAdvisor(input, load = () => import(ADVISOR_MODULE_URL)) {
  const advisor = await load();
  // The handler holds its receipts until this extension commits them, so a turn
  // whose brief never reaches the model leaves the session's state unchanged.
  return advisor.handleClaudeUserPromptSubmit(input, {
    runtime: ADVISOR_RUNTIME,
    writeDiagnostic: () => {},
    deferDirectiveReceipt: true,
  });
}

/**
 * Drop one session's stored route receipt at a DSH boundary.
 *
 * DSH sends no transcript path, so the receipt's transcript expiry never fires and
 * the clock rotation alone would leave it current if the rotation failed.
 *
 * @param {string|undefined} sessionId - The DSH session id.
 * @param {Function} [load] - Loads the route-receipt module, injectable for tests.
 * @returns {Promise<boolean>} Whether a stored receipt was removed.
 */
export async function dropRouteReceipt(sessionId, load = () => import(ROUTE_RECEIPT_MODULE_URL)) {
  if (typeof sessionId !== 'string' || !sessionId.trim()) return false;
  const receipts = await load();
  return receipts.defaultRouteReceiptStore().remove(sessionId);
}

/**
 * Commit the receipts the handler held for one delivered output.
 *
 * @param {Object} output - The advisor hook output the notice was built from.
 * @param {Function} [load] - Loads the advisor module, injectable for tests.
 * @returns {Promise<boolean>} Whether the held receipts were committed.
 */
export async function commitDelivery(output, load = () => import(ADVISOR_MODULE_URL)) {
  const advisor = await load();
  return advisor.commitClaudeDirectiveDeliveryReceipt(output);
}

/**
 * Rotate the shared lifecycle clock for one session at a DSH boundary, so advisor
 * state stamped with that clock expires with the context it described.
 *
 * Without a session id nothing rotates, because the shared call would then
 * advance the store generation and reset every session.
 *
 * @param {string|undefined} sessionId - The DSH session id.
 * @param {Function} [load] - Loads the lifecycle module, injectable for tests.
 * @returns {Promise<boolean>} Whether a session clock was rotated.
 */
export async function advanceBoundary(sessionId, load = () => import(LIFECYCLE_MODULE_URL)) {
  if (typeof sessionId !== 'string' || !sessionId.trim()) return false;
  const lifecycle = await load();
  return lifecycle.advanceDirectiveLifecycleBoundary(lifecycle.defaultDirectiveLifecycleStore(), sessionId);
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
  core = { runAdvisor, advanceBoundary, commitDelivery, dropRouteReceipt },
  createNotice = makeNotice,
  isLeaf = isLineageLeaf,
  isEnabled = isHookEnabled,
} = {}) {
  if (enabled !== true) return;

  // The compaction handler is synchronous and cannot await its boundary work, so
  // the next turn of that session waits for it before it is scored.
  const pendingBoundaries = new Map();
  const closeBoundary = async (sessionId) => {
    try {
      await core.dropRouteReceipt?.(sessionId);
    } catch (error) {
      logFailure(ctx, error);
    }
    await rotateSessionClock(ctx, core, sessionId);
  };

  ctx.on('agent/created', async ({ agent }) => {
    forgetReceipt(agent?.session?.id);
    await closeBoundary(agent?.session?.id);
    return undefined;
  });

  ctx.on('session/event', (session, event) => {
    if (event?.type === 'compaction/end' && !event.data?.error) {
      const sessionId = session?.id;
      forgetReceipt(sessionId);
      const work = closeBoundary(sessionId);
      if (typeof sessionId === 'string' && sessionId) {
        pendingBoundaries.set(sessionId, work);
        void work.finally(() => {
          if (pendingBoundaries.get(sessionId) === work) pendingBoundaries.delete(sessionId);
        });
      }
    }
  });

  ctx.on('agent/pre-step', async (payload, next) => {
    const downstream = await next();
    if (downstream.kind !== 'enter' || isLeaf()) return downstream;

    try {
      const prompt = latestOperatorPrompt(payload.messages);
      if (!prompt.trim()) return downstream;

      const agent = payload.agent;
      await pendingBoundaries.get(agent?.session?.id);
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
      if (!delivered.text) return downstream;
      const notice = await createNotice(delivered.text);
      // The message list is built before any receipt is stored, so a host reply
      // that cannot take the notice leaves the session's state unchanged.
      const messages = [...(downstream.messages ?? []), notice];
      delivered.remember();
      await commitDeliveredReceipts(ctx, core, output);
      return { ...downstream, messages };
    } catch (error) {
      logFailure(ctx, error);
      return downstream;
    }
  });
}
