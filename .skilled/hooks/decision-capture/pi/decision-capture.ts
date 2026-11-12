// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Extension - Decision Capture
// ───────────────────────────────────────────────────────────────────

import { appendRecords, takeNudge } from '../lib/capture-core.mjs';
import { QUESTION_TOOLS, recoveredRecords } from '../bin/sweep-pi.mjs';
import { isHookEnabled } from '../../shared/hook-flags.mjs';

import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';

/** The fields of a Pi `tool_result` event the capture reads. */
interface PiToolResultEvent {
  toolName?: string;
  toolCallId?: string;
  input?: unknown;
  isError?: boolean;
  details?: {
    answers?: unknown[];
    cancelled?: boolean;
  };
}

/** The fields of a Pi handler context the capture reads. */
interface PiDecisionContext {
  cwd: string;
  hasUI?: boolean;
  ui?: {
    notify(message: string, type?: string): void;
  };
  sessionManager?: {
    getSessionId?: () => string | undefined;
  };
}

/**
 * Register the live decision capture on a Pi session.
 *
 * Capture is a side record of the operator's answers, so every failure here is
 * swallowed: a broken queue must never change a tool result or stop Pi loading.
 * The save-time sweep reads the same session file and recovers what this missed.
 *
 * @param pi - The Pi extension API the handler registers on
 */
export default function decisionCapture(pi: ExtensionAPI): void {
  try {
    if (!isHookEnabled('decision-capture')) return undefined;

    pi.on('tool_result', (event, context) => {
      try {
        const result = event as unknown as PiToolResultEvent;
        const sessionContext = context as unknown as PiDecisionContext;
        if (
          typeof result.toolName !== 'string'
          || !QUESTION_TOOLS.has(result.toolName)
          || result.isError === true
          || result.details?.cancelled === true
        ) return undefined;

        const sessionId = sessionContext.sessionManager?.getSessionId?.();
        if (typeof sessionId !== 'string' || sessionId.length === 0) return undefined;

        // The event is rebuilt as the two session-file lines the sweep reads, so a
        // live record and a swept one get the same key and never queue twice.
        const lines = [
          {
            type: 'message',
            message: {
              role: 'assistant',
              content: [{
                type: 'toolCall',
                name: result.toolName,
                id: result.toolCallId,
                arguments: result.input,
              }],
            },
          },
          {
            type: 'message',
            message: {
              role: 'toolResult',
              toolName: result.toolName,
              toolCallId: result.toolCallId,
              isError: result.isError,
              details: result.details,
            },
          },
        ];
        const records = recoveredRecords(lines, sessionId, new Date().toISOString())
          .map((record) => ({ ...record, source: 'hook' }));

        if (records.length > 0) appendRecords(sessionContext.cwd, sessionId, records);
      } catch {
        return undefined;
      }

      return undefined;
    });

    // Keep the reminder pending until Pi can display it in an interactive session.
    pi.on('turn_end', (_event, context) => {
      try {
        const sessionContext = context as unknown as PiDecisionContext;
        const sessionId = sessionContext.sessionManager?.getSessionId?.();
        if (
          typeof sessionId !== 'string'
          || sessionId.length === 0
          || sessionContext.hasUI !== true
          || !sessionContext.ui
        ) return undefined;

        const count = takeNudge(sessionContext.cwd, sessionId);
        if (count > 0) {
          sessionContext.ui.notify(
            `${count} operator answer(s) captured this session are not in a decision record yet. Run /speckit:save with --full-auto to record them.`,
            'info',
          );
        }
      } catch {
        return undefined;
      }

      return undefined;
    });
  } catch {
    return undefined;
  }

  return undefined;
}
