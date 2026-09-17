// ───────────────────────────────────────────────────────────────────
// MODULE: Claude Code Headless Stream-JSON Parser
// ───────────────────────────────────────────────────────────────────

import { resolveWrapperRuntime } from '../registry.js';
import {
  buildStreamEnvelope,
  buildStreamOriginal,
} from '../stream-types.js';

import type { ClaudeMessageDisplayEvent, ClaudeTerminalEvent } from '../../runtimes/claude.js';
import type {
  RuntimeStreamParseInput,
  RuntimeStreamParseResult,
  RuntimeStreamParser,
} from '../stream-types.js';

/**
 * Parse a Claude Code headless `stream-json` capture. Each non-empty line is
 * one JSON record. Assistant text is concatenated from every `assistant`
 * record's text content parts; an error `result` terminal is surfaced as an
 * error envelope so the adapter fails open. Any unparseable line or a stream
 * with no assistant text resolves to the unparsed fallback.
 */
export function parseClaudeStream(input: RuntimeStreamParseInput): RuntimeStreamParseResult {
  const plan = resolveWrapperRuntime('claude');
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

  const textParts: string[] = [];
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
    const type = (record as Record<string, unknown>).type;
    if (type === 'assistant') {
      collectAssistantText(record, textParts);
    } else if (type === 'result' && (record as Record<string, unknown>).is_error === true) {
      isError = true;
    }
  }

  if (isError) {
    const event: ClaudeTerminalEvent = Object.freeze({
      type: 'error',
      eventId: 'claude-error',
      index: 0,
      sourceTimestamp: null,
    });
    return {
      status: 'captured',
      original: buildStreamOriginal('claude-original', input.capturedText, input.capturedAt),
      envelopes: [buildStreamEnvelope(plan, event, input.capturedAt)],
    };
  }

  const text = textParts.join('');
  if (text.length === 0) {
    return { status: 'unparsed', reasonCode: 'no-assistant-message' };
  }
  const event: ClaudeMessageDisplayEvent = Object.freeze({
    type: 'message-display',
    eventId: 'claude-final',
    index: 0,
    final: true,
    sourceTimestamp: null,
  });
  return {
    status: 'captured',
    original: buildStreamOriginal('claude-original', text, input.capturedAt),
    envelopes: [buildStreamEnvelope(plan, event, input.capturedAt)],
  };
}

function collectAssistantText(record: unknown, target: string[]): void {
  const message = (record as Record<string, unknown>).message;
  if (message === null || typeof message !== 'object' || Array.isArray(message)) {
    return;
  }
  const content = (message as Record<string, unknown>).content;
  if (!Array.isArray(content)) {
    return;
  }
  for (const part of content) {
    if (part === null || typeof part !== 'object' || Array.isArray(part)) {
      continue;
    }
    const recordPart = part as Record<string, unknown>;
    if (recordPart.type === 'text' && typeof recordPart.text === 'string') {
      target.push(recordPart.text);
    }
  }
}

/** Claude Code headless stream-json parser. */
export const claudeStreamParser: RuntimeStreamParser = Object.freeze({
  runtime: 'claude',
  parse: parseClaudeStream,
});
