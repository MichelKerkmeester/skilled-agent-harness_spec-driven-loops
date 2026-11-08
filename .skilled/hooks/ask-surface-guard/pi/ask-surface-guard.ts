// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Ask Surface Guard
// ───────────────────────────────────────────────────────────────────
// Pi's end-of-run events cannot block, but a follow-up message with
// triggerTurn starts the agent again, which is how this guard sends a prose
// option menu back to be asked through the question tool. agent_end closes
// one agent loop, not the operator's turn, so the once-per-turn marker is
// keyed on the operator's last message: the follow-up arrives as a custom
// message, never a user one, so every loop of that turn shares the key.

import askSurfaceCore from '../../.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs';
import { isHookEnabled } from '../../.skilled/hooks/shared/hook-flags.mjs';

import type { AgentEndEvent, ExtensionAPI } from '@earendil-works/pi-coding-agent';

const core = askSurfaceCore as {
  CONCERN: string;
  QUESTION_TOOLS: Record<string, string[]>;
  evaluateTurn(turn: { lastMessage: string; askToolCalled: boolean; surfaceAvailable?: boolean }): { verdict: string };
  markTurn(projectDir: string, turnKey: string, baseDir?: string): boolean;
  recordFire(projectDir: string | undefined, entry: { runtime: string; mode: string }): boolean;
  repromptFor(runtime: string): string;
};

const CUSTOM_TYPE = 'ask-surface-guard';

/** The message fields this guard reads. */
interface PiMessage {
  role?: string;
  toolName?: string;
  content?: unknown;
  timestamp?: number;
}

/** The handler-context fields this guard reads. */
interface PiGuardContext {
  cwd?: string;
  hasUI?: boolean;
  sessionManager?: { getSessionId?(): string };
}

/** Options for tests. */
export interface AskSurfaceGuardOptions {
  markerDir?: string;
}

function isQuestionTool(name: unknown): boolean {
  return typeof name === 'string' && core.QUESTION_TOOLS.pi.includes(name);
}

/**
 * Read the run's last assistant text and whether it called a question tool,
 * counting only what came after the operator's last message.
 *
 * @param messages - The messages the agent loop ended with.
 * @returns The last assistant text, the ask-call flag and a key for the operator's last message.
 */
export function readRun(messages: unknown): { lastMessage: string; askToolCalled: boolean; operatorKey: string } {
  const list = Array.isArray(messages) ? (messages as PiMessage[]) : [];
  let start = 0;
  let operatorKey = 'none';
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const message = list[index];
    if (message?.role === 'user') {
      start = index + 1;
      operatorKey = `${index}:${message.timestamp ?? ''}:${JSON.stringify(message.content ?? '')}`;
      break;
    }
  }
  const result = { lastMessage: '', askToolCalled: false, operatorKey };
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
 * @param options - Marker root for tests.
 */
export default function askSurfaceGuard(pi: ExtensionAPI, options: AskSurfaceGuardOptions = {}): void {
  try {
    if (!isHookEnabled(core.CONCERN)) return undefined;

    pi.on('agent_end', async (event: AgentEndEvent, context) => {
      try {
        const guardContext = context as unknown as PiGuardContext;
        const sessionId = guardContext.sessionManager?.getSessionId?.();
        if (typeof sessionId !== 'string' || !sessionId) return undefined;

        // Without a UI neither Pi question tool can run: one is removed and
        // the other throws, so sending the turn back would ask for nothing.
        const run = readRun(event.messages);
        const surfaceAvailable = guardContext.hasUI === true;
        if (core.evaluateTurn({ ...run, surfaceAvailable }).verdict !== 'fire') return undefined;
        const projectDir = guardContext.cwd || process.cwd();
        if (!core.markTurn(projectDir, `pi:${sessionId}:${run.operatorKey}`, options.markerDir)) return undefined;

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
