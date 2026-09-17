// ───────────────────────────────────────────────────────────────────
// MODULE: Codex Exec JSON-Stream Parser
// ───────────────────────────────────────────────────────────────────

import { resolveWrapperRuntime } from '../registry.js';
import {
  buildStreamEnvelope,
  buildStreamOriginal,
} from '../stream-types.js';

import type { CodexContentEvent, CodexTerminalEvent } from '../../runtimes/codex.js';
import type {
  RuntimeStreamParseInput,
  RuntimeStreamParseResult,
  RuntimeStreamParser,
} from '../stream-types.js';

/**
 * Parse a Codex non-interactive JSON-stream capture. Each non-empty line is
 * one JSON record. The final `agent-message` text is the assistant message;
 * an `error` terminal is surfaced as an error envelope so the adapter fails
 * open. Unparseable lines or a stream with no agent message are unparsed.
 */
export function parseCodexStream(input: RuntimeStreamParseInput): RuntimeStreamParseResult {
  const plan = resolveWrapperRuntime('codex');
  if (plan === null) {
    return { status: 'unparsed', reasonCode: 'malformed-stream' };
  }

  const lines = input.capturedText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) {
    return { status: 'unparsed', reasonCode: 'empty-stream' };
  }

  let messageText: string | null = null;
  let isError = false;
  for (const line of lines) {
    let record: unknown;
    try {
      record = JSON.parse(line);
    } catch {
      return { status: 'unparsed', reasonCode: 'malformed-stream' };
    }
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      return { status: 'unparsed', reasonCode: 'malformed-stream' };
    }
    const typed = record as Record<string, unknown>;
    if (typed.type === 'agent-message' && typeof typed.text === 'string') {
      messageText = typed.text;
    } else if (typed.type === 'error') {
      isError = true;
    }
  }

  if (isError) {
    const event: CodexTerminalEvent = Object.freeze({
      type: 'error',
      eventId: 'codex-error',
      index: 0,
      sourceTimestamp: null,
    });
    return {
      status: 'captured',
      original: buildStreamOriginal('codex-original', input.capturedText, input.capturedAt),
      envelopes: [buildStreamEnvelope(plan, event, input.capturedAt)],
    };
  }

  if (messageText === null || messageText.length === 0) {
    return { status: 'unparsed', reasonCode: 'no-assistant-message' };
  }
  const event: CodexContentEvent = Object.freeze({
    type: 'agent-message',
    eventId: 'codex-final',
    index: 0,
    sourceTimestamp: null,
    itemId: null,
    toolCallId: null,
  });
  return {
    status: 'captured',
    original: buildStreamOriginal('codex-original', messageText, input.capturedAt),
    envelopes: [buildStreamEnvelope(plan, event, input.capturedAt)],
  };
}

/** Codex non-interactive JSON-stream parser. */
export const codexStreamParser: RuntimeStreamParser = Object.freeze({
  runtime: 'codex',
  parse: parseCodexStream,
});
