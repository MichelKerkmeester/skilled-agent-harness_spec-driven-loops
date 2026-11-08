// ───────────────────────────────────────────────────────────────────
// MODULE: DSH Ask Surface Guard
// ───────────────────────────────────────────────────────────────────
// dsh ends a turn only when nothing waits for the next step, so steering a
// message in from `agent/turn-stopping` makes the agent take one more step
// and re-ask the menu through ask_user_question.

import core from '../lib/ask-surface-core.cjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';
import { loadDshLlm } from '../../shared/dsh/dsh-llm.mjs';
import { isLineageLeaf } from '../../shared/dsh/session-role.mjs';

const { env: runtimeEnv } = process;

export const ERROR_POLICY = 'fail-open';

/**
 * Whether this process runs without a question tool. dsh registers
 * ask_user_question only for an attached client, so a headless profile and
 * a fan-out leaf both lack it.
 *
 * @param {string[]} [argv] - Process arguments.
 * @param {Object} [env] - Process environment.
 * @param {Function} [isLeaf] - Fan-out leaf check.
 * @returns {boolean} True when the session has no question tool.
 */
export function isHeadlessSession(argv = process.argv, env = runtimeEnv, isLeaf = isLineageLeaf) {
  const profileIndex = argv.indexOf('--profile');
  const headlessProfile = argv.includes('--profile=headless') || (profileIndex >= 0 && argv[profileIndex + 1] === 'headless');
  return headlessProfile || isLeaf() || env.AI_SESSION_CHILD === '1';
}

function textFromContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((part) => part && typeof part === 'object' && part.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('\n');
}

function isQuestionCall(name) {
  return core.QUESTION_TOOLS.dsh.includes(name);
}

/**
 * Read one turn's last assistant text and whether it called the question tool.
 *
 * @param {Object} agent - The dsh agent whose session holds the turn.
 * @param {number} turn - The turn number dsh is stopping.
 * @returns {{lastMessage: string, askToolCalled: boolean}} What the turn held.
 */
export function readTurn(agent, turn) {
  const snapshot = agent?.session?.snapshotEvents?.();
  const result = { lastMessage: '', askToolCalled: false };
  if (!Array.isArray(snapshot)) return result;
  for (const event of snapshot) {
    if (event?.data?.turn !== turn) continue;
    if (event.type === 'tool/call' && isQuestionCall(event.data.name)) result.askToolCalled = true;
    if (event.type !== 'assistant/message' || event.data.message?.role !== 'assistant') continue;
    const content = event.data.message.content;
    if (Array.isArray(content) && content.some((part) => part?.type === 'tool-call' && isQuestionCall(part.name))) {
      result.askToolCalled = true;
    }
    const text = textFromContent(content).trim();
    if (text) result.lastMessage = text;
  }
  return result;
}

function logFailure(ctx, error) {
  try {
    ctx.logger.warn(`repo-guards ask-surface: ${String(error)}`);
  } catch {
    // A logging failure must not affect turn stopping.
  }
}

async function makeReprompt(text) {
  const { createUserMessage } = await loadDshLlm();
  return createUserMessage({ content: [{ type: 'text', text }], source: { kind: 'repo-guards' } });
}

/**
 * Send a turn that closes on a prose option menu back once, through `agent.steer`.
 *
 * @param {Object} ctx - dsh plugin context with `on` and `logger`.
 * @param {Object} [options] - Core, kill switch, headless check, message factory, marker root and cwd for tests.
 */
export function registerAskSurfaceGuard(ctx, {
  askCore = core,
  isEnabled = isHookEnabled,
  isHeadless = () => isHeadlessSession(),
  createReprompt = makeReprompt,
  markerDir = undefined,
  cwd = process.cwd(),
} = {}) {
  if (!isEnabled(askCore.CONCERN)) return;

  ctx.on('agent/turn-stopping', async ({ agent, turn }) => {
    try {
      const { lastMessage, askToolCalled } = readTurn(agent, turn);
      const result = askCore.evaluateTurn({ lastMessage, askToolCalled, surfaceAvailable: !isHeadless() });
      if (result.verdict !== 'fire') return;

      const projectDir = agent?.session?.header?.cwd ?? cwd;
      const turnKey = `dsh:${agent?.session?.id ?? agent?.id ?? 'session'}:${turn}`;
      if (!askCore.markTurn(projectDir, turnKey, markerDir)) return;
      askCore.recordFire(projectDir, { runtime: 'dsh', mode: 'reprompt' });

      agent.steer(await createReprompt(askCore.repromptFor('dsh')));
    } catch (error) {
      logFailure(ctx, error);
    }
  });
}
