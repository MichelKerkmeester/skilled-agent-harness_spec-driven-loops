// ───────────────────────────────────────────────────────────────────
// MODULE: Devin Print-Mode Parser
// ───────────────────────────────────────────────────────────────────

import { resolveWrapperRuntime } from '../registry.js';
import {
  buildStreamEnvelope,
  buildStreamOriginal,
} from '../stream-types.js';

import type { DevinAgentMessageChunkEvent } from '../../runtimes/devin.js';
import type {
  RuntimeStreamParseInput,
  RuntimeStreamParseResult,
  RuntimeStreamParser,
} from '../stream-types.js';

/**
 * Parse a Devin `-p` print-mode capture. The single printed assistant message
 * is the entire captured text, wrapped as a final agent-message-chunk event.
 * Empty output is unparsed so the wrapper passes the original through.
 */
export function parseDevinStream(input: RuntimeStreamParseInput): RuntimeStreamParseResult {
  const plan = resolveWrapperRuntime('devin');
  if (plan === null) {
    return { status: 'unparsed', reasonCode: 'malformed-stream' };
  }

  const text = input.capturedText.trim();
  if (text.length === 0) {
    return { status: 'unparsed', reasonCode: 'empty-stream' };
  }

  const event: DevinAgentMessageChunkEvent = Object.freeze({
    type: 'agent-message-chunk',
    eventId: 'devin-final',
    index: 0,
    final: true,
    sourceTimestamp: null,
  });
  return {
    status: 'captured',
    original: buildStreamOriginal('devin-original', text, input.capturedAt),
    envelopes: [buildStreamEnvelope(plan, event, input.capturedAt)],
  };
}

/** Devin print-mode parser. */
export const devinStreamParser: RuntimeStreamParser = Object.freeze({
  runtime: 'devin',
  parse: parseDevinStream,
});
