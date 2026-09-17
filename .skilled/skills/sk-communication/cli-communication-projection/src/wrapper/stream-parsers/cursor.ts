// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor Agent Non-Interactive Parser
// ───────────────────────────────────────────────────────────────────

import { resolveWrapperRuntime } from '../registry.js';
import {
  buildStreamEnvelope,
  buildStreamOriginal,
} from '../stream-types.js';

import type { CursorAgentMessageChunkEvent } from '../../runtimes/cursor.js';
import type {
  RuntimeStreamParseInput,
  RuntimeStreamParseResult,
  RuntimeStreamParser,
} from '../stream-types.js';

/**
 * Parse a non-interactive cursor-agent stdout capture. The rendered assistant
 * message is the entire captured text, wrapped as a final agent-message-chunk
 * event. Empty output is unparsed so the wrapper passes the original through.
 */
export function parseCursorStream(input: RuntimeStreamParseInput): RuntimeStreamParseResult {
  const plan = resolveWrapperRuntime('cursor');
  if (plan === null) {
    return { status: 'unparsed', reasonCode: 'malformed-stream' };
  }

  const text = input.capturedText.trim();
  if (text.length === 0) {
    return { status: 'unparsed', reasonCode: 'empty-stream' };
  }

  const event: CursorAgentMessageChunkEvent = Object.freeze({
    type: 'agent-message-chunk',
    eventId: 'cursor-final',
    index: 0,
    final: true,
    sourceTimestamp: null,
  });
  return {
    status: 'captured',
    original: buildStreamOriginal('cursor-original', text, input.capturedAt),
    envelopes: [buildStreamEnvelope(plan, event, input.capturedAt)],
  };
}

/** Cursor agent non-interactive parser. */
export const cursorStreamParser: RuntimeStreamParser = Object.freeze({
  runtime: 'cursor',
  parse: parseCursorStream,
});
