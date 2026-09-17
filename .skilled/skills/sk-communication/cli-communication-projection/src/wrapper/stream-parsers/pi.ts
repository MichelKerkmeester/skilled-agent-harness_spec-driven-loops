// ───────────────────────────────────────────────────────────────────
// MODULE: Pi Print-Mode Parser
// ───────────────────────────────────────────────────────────────────

import { resolveWrapperRuntime } from '../registry.js';
import {
  buildStreamEnvelope,
  buildStreamOriginal,
} from '../stream-types.js';

import type { PiMessageEvent } from '../../runtimes/pi.js';
import type {
  RuntimeStreamParseInput,
  RuntimeStreamParseResult,
  RuntimeStreamParser,
} from '../stream-types.js';

/**
 * Parse a Pi print-mode capture. The printed final assistant message is the
 * entire captured text, wrapped as a message-end event. Empty output is
 * unparsed so the wrapper passes the original through untouched.
 */
export function parsePiStream(input: RuntimeStreamParseInput): RuntimeStreamParseResult {
  const plan = resolveWrapperRuntime('pi');
  if (plan === null) {
    return { status: 'unparsed', reasonCode: 'malformed-stream' };
  }

  const text = input.capturedText.trim();
  if (text.length === 0) {
    return { status: 'unparsed', reasonCode: 'empty-stream' };
  }

  const event: PiMessageEvent = Object.freeze({
    type: 'message-end',
    eventId: 'pi-final',
    index: 0,
    sourceTimestamp: null,
  });
  return {
    status: 'captured',
    original: buildStreamOriginal('pi-original', text, input.capturedAt),
    envelopes: [buildStreamEnvelope(plan, event, input.capturedAt)],
  };
}

/** Pi print-mode parser. */
export const piStreamParser: RuntimeStreamParser = Object.freeze({
  runtime: 'pi',
  parse: parsePiStream,
});
