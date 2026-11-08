// ───────────────────────────────────────────────────────────────────
// MODULE: History Response Byte Bound
// ───────────────────────────────────────────────────────────────────

import { Buffer } from 'node:buffer';

/** Hard cap for one complete serialized reply. */
export const MAXIMUM_RECOVERY_REPLY_BYTES = 16_384;

/** Cap for one inline part description in a deferred item. */
export const MAXIMUM_INLINE_PART_BYTES = 4_096;

/** Upper bound for a part-list or page limit, measured in reply budget units. */
export const MAXIMUM_PAGE_LIMIT = MAXIMUM_RECOVERY_REPLY_BYTES;

/** Headers repeat handles, so a long id would leave no room for a page body. */
export const MAXIMUM_HISTORY_ID_CHARACTERS = 128;
export const MAXIMUM_PART_CHARACTERS = 512;

/** A text page never returns more code units than this, even when bytes allow. */
export const MAXIMUM_TEXT_PAGE_CODE_UNITS = 2_000;

export type HistoryTextContent = {
  type: 'text';
  text: string;
};

export type HistoryTextReply = {
  content: HistoryTextContent[];
  details: undefined;
};

export type HistoryResponseErrorCode = 'HISTORY_REPLY_TOO_LARGE' | 'HISTORY_REPLY_UNSERIALIZABLE';

/** A reply that could not be serialized or would exceed the byte cap. */
export class HistoryResponseError extends Error {
  readonly code: HistoryResponseErrorCode;

  constructor(code: HistoryResponseErrorCode, message: string = code) {
    super(message);
    this.code = code;
    this.name = 'HistoryResponseError';
  }
}

/**
 * The model reads only content, so details stays empty instead of halving the
 * budget with a second copy of the same payload.
 */
function textReply(texts: readonly string[]): HistoryTextReply {
  return { content: texts.map((text) => ({ type: 'text' as const, text })), details: undefined };
}

function serialized(payload: unknown): string {
  const text = JSON.stringify(payload);
  if (text === undefined) {
    throw new HistoryResponseError('HISTORY_REPLY_UNSERIALIZABLE', 'Context paging response could not be serialized.');
  }
  return text;
}

/** Count the complete serialized reply, including escaping of every text block. */
export function fitsRecoveryText(texts: readonly string[]): boolean {
  return Buffer.byteLength(JSON.stringify(textReply(texts)), 'utf8') <= MAXIMUM_RECOVERY_REPLY_BYTES;
}

/** Build a text reply or throw before returning an oversized one. */
export function recoveryTextReply(texts: readonly string[]): HistoryTextReply {
  if (!fitsRecoveryText(texts)) {
    throw new HistoryResponseError(
      'HISTORY_REPLY_TOO_LARGE',
      `Context paging text reply exceeds the ${MAXIMUM_RECOVERY_REPLY_BYTES}-byte limit.`,
    );
  }
  return textReply(texts);
}

/** Measure one payload as it will appear inside the final text reply. */
export function fitsRecoveryResponse(payload: unknown): boolean {
  return fitsRecoveryText([serialized(payload)]);
}

/** Serialize a payload once and enforce the cap on the complete reply. */
export function recoveryResponse(payload: unknown): HistoryTextReply {
  return recoveryTextReply([serialized(payload)]);
}
