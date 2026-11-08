// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Ask Surface Guard
// ───────────────────────────────────────────────────────────────────
// Pi's end-of-run events cannot block, but a follow-up message with
// triggerTurn starts the agent again, which is how this guard sends a prose
// option menu back to be asked through the question tool.

import askSurfaceCore from '../../.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs';
import { isHookEnabled } from '../../.skilled/hooks/shared/hook-flags.mjs';

import type { AgentEndEvent, ExtensionAPI } from '@earendil-works/pi-coding-agent';

const core = askSurfaceCore as {
  CONCERN: string;
  QUESTION_TOOLS: Record<string, string[]>;
  evaluateTurn(turn: { lastMessage: string; askToolCalled: boolean }): { verdict: string };
  recordFire(projectDir: string | undefined, entry: { runtime: string; mode: string }): boolean;
  repromptFor(runtime: string): string;
};

const CUSTOM_TYPE = 'ask-surface-guard';

/** The message fields this guard reads. */
interface PiMessage {
  role?: string;
  toolName?: string;
  content?: unknown;
}

/** The handler-context fields this guard reads. */
interface PiGuardContext {
  cwd?: string;
  sessionManager?: { getSessionId?(): string };
}

function isQuestionTool(name: unknown): boolean {
  return typeof name === 'string' && core.QUESTION_TOOLS.pi.includes(name);
}

/**
 * Read the run's last assistant text and whether it called a question tool,
 * counting only what came after the operator's last message.
 *
 * @param messages - The messages the agent loop ended with.
 * @returns The last assistant text and the ask-call flag.
 */
export function readRun(messages: unknown): { lastMessage: string; askToolCalled: boolean } {
  const list = Array.isArray(messages) ? (messages as PiMessage[]) : [];
  let start = 0;
  for (let index = list.length - 1; index >= 0; index -= 1) {
    if (list[index]?.role === 'user') { start = index + 1; break; }
  }
  const result = { lastMessage: '', askToolCalled: false };
  for (const message of list.slice(start)) {
    if (message?.role === 'toolResult' && isQuestionTool(message.toolName)) result.askToolCalled = true;
    if (message?.role !== 'assistant' || !Array.isArray(message.content)) continue;
    let text = '';
    for (const part of message.content as Array<{ type?: string; name?: string; text?: string }>) {
      if (part?.type === 'toolCall' && isQuestionTool(part.name)) result.askToolCalled = true;
      if (part?.type === 'text' && typeof part.text === 'string') text += `${part.text}\n`;
    }
    if (text.trim()) result.lastMessage = text.trim();
  }
  return result;
}

/**
 * Register the guard: on a run that ends in a prose option menu, start one
 * more turn that asks for the question tool.
 *
 * @param pi - The Pi extension API the handler registers on.
 */
export default function askSurfaceGuard(pi: ExtensionAPI): void {
  try {
    if (!isHookEnabled(core.CONCERN)) return undefined;

    // The run this guard starts must end normally even if it repeats the
    // menu, so its own session is skipped once.
    const reprompted = new Set<string>();

    pi.on('agent_end', async (event: AgentEndEvent, context) => {
      try {
        const guardContext = context as unknown as PiGuardContext;
        const sessionId = guardContext.sessionManager?.getSessionId?.();
        if (typeof sessionId !== 'string' || !sessionId) return undefined;
        if (reprompted.delete(sessionId)) return undefined;

        const run = readRun(event.messages);
        if (core.evaluateTurn(run).verdict !== 'fire') return undefined;

        reprompted.add(sessionId);
        core.recordFire(guardContext.cwd, { runtime: 'pi', mode: 'reprompt' });
        pi.sendMessage(
          { customType: CUSTOM_TYPE, content: core.repromptFor('pi'), display: false },
          { deliverAs: 'followUp', triggerTurn: true },
        );
      } catch {
        // Fail open: the run ends as it would have.
      }
      return undefined;
    });
  } catch {
    return undefined;
  }
  return undefined;
}
