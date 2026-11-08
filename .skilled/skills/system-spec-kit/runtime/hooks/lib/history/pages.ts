// ───────────────────────────────────────────────────────────────────
// MODULE: History Pages
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { Buffer } from 'node:buffer';

import type { HistoryImageBlock, HistoryItem } from './history.js';
import { recoveryHistoryItem, type RecoveryHistoryItem } from './projection.js';
import {
  MAXIMUM_HISTORY_ID_CHARACTERS,
  MAXIMUM_PAGE_LIMIT,
  MAXIMUM_PART_CHARACTERS,
  MAXIMUM_TEXT_PAGE_CODE_UNITS,
  fitsRecoveryResponse,
  fitsRecoveryText,
} from './response.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────────

export type HistoryPart = {
  part: string;
  value: unknown;
};

export type PartReadHandle = {
  historyId: string;
  part: string;
  mode?: 'image';
};

export type HistoryPartDescription = {
  part: string;
  type: string;
  bytes: number;
  preview?: string;
  read: PartReadHandle;
};

export type HistoryPartText = {
  format: 'text' | 'json';
  text: string;
};

export type HistoryPageInput = {
  historyId: string;
  part?: string;
  mode?: 'text' | 'parts' | 'image';
  offset?: number;
  limit?: number;
};

export type HistoryPageHeader = {
  historyId: string;
  part: string;
  format: HistoryPartText['format'];
  offset: number;
  nextOffset: number | null;
  totalCharacters: number;
  next?: {
    historyId: string;
    part: string;
    offset: number;
    limit?: number;
  };
};

export type HistoryPage = {
  header: HistoryPageHeader;
  text: string;
};

export type HistoryImageAttachment = {
  type: 'image';
  data: string;
  mimeType: string;
};

export type HistoryPageErrorCode =
  | 'INVALID_PAGE_INPUT'
  | 'UNKNOWN_HISTORY_ID'
  | 'UNKNOWN_HISTORY_PART'
  | 'PART_TOO_LARGE';

/** A page request that cannot be answered, or a part that does not exist. */
export class HistoryPageError extends Error {
  readonly code: HistoryPageErrorCode;

  constructor(code: HistoryPageErrorCode, message: string = code) {
    super(message);
    this.code = code;
    this.name = 'HistoryPageError';
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. PART HELPERS
// ───────────────────────────────────────────────────────────────────

/** Resolve one id against the post-projection item list. */
export function publicHistoryItem(items: readonly HistoryItem[], historyId: string): RecoveryHistoryItem {
  const raw = items.find((item) => item.id === historyId);
  if (raw === undefined) {
    throw new HistoryPageError('UNKNOWN_HISTORY_ID', `Unknown history ID ${historyId}.`);
  }
  const item = recoveryHistoryItem(raw);
  if (item === undefined) {
    throw new HistoryPageError('UNKNOWN_HISTORY_PART', `History item ${historyId} is not public recovery output.`);
  }
  return item;
}

/** True for a native image attachment. */
export function isRecoveryImage(value: unknown): value is HistoryImageBlock {
  return typeof value === 'object'
    && value !== null
    && (value as { type?: unknown }).type === 'image'
    && typeof (value as { data?: unknown }).data === 'string'
    && typeof (value as { mimeType?: unknown }).mimeType === 'string';
}

const escapeKey = (key: string): string => key.replace(/~/g, '~0').replace(/\//g, '~1');

const MAXIMUM_CHOICE_CHARACTERS = 160;
const MAXIMUM_CHOICES_BYTES = 1_536;

/** Shorten a value echoed in an error without splitting a surrogate pair. */
export function clipValue(value: string): string {
  if (value.length <= MAXIMUM_CHOICE_CHARACTERS) return value;
  let end = MAXIMUM_CHOICE_CHARACTERS - 1;
  if (/[\uD800-\uDBFF]/u.test(value[end - 1] ?? '')) end--;
  return `${value.slice(0, end)}…`;
}

/** Keep error messages small when an item has many or long parts or results. */
export function listChoices(choices: readonly string[], limit = 20): string {
  if (choices.length === 0) return 'none';
  const shown: string[] = [];
  let bytes = 0;
  for (const choice of choices.slice(0, limit)) {
    const clipped = clipValue(choice);
    bytes += Buffer.byteLength(JSON.stringify(clipped), 'utf8');
    if (bytes > MAXIMUM_CHOICES_BYTES) break;
    shown.push(clipped);
  }
  const omitted = choices.length - shown.length;
  return omitted > 0 ? `${shown.join(', ')}, and ${omitted} more` : shown.join(', ');
}

function unknownPart(item: RecoveryHistoryItem): HistoryPageError {
  const pointers = historyParts(item).map((part) => JSON.stringify(part.part));
  return new HistoryPageError(
    'UNKNOWN_HISTORY_PART',
    `Unknown public recovery part. Public parts: ${listChoices(pointers)}. `
      + 'Use the parts mode to list them with read handles.',
  );
}

// ───────────────────────────────────────────────────────────────────
// 4. PART SELECTION
// ───────────────────────────────────────────────────────────────────

/**
 * Select only own public fields by JSON Pointer.
 *
 * Null assistant slots are not readable: a paging exchange was removed, so
 * pointing at its old index would return private history.
 */
export function selectHistoryPart(item: RecoveryHistoryItem, pointer: string): unknown {
  if (typeof pointer !== 'string' || (pointer !== '' && !pointer.startsWith('/')) || /~(?![01])/u.test(pointer)) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Invalid history part pointer.');
  }

  let value: unknown = item;
  for (const segment of pointer === '' ? [] : pointer.slice(1).split('/')) {
    const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
    if (isRecoveryImage(value)) {
      throw new HistoryPageError(
        'INVALID_PAGE_INPUT',
        'Read image attachments through their image handles, not image fields.',
      );
    }
    if (typeof value !== 'object' || value === null || !Object.hasOwn(value, key)) throw unknownPart(item);
    value = (value as Record<string, unknown>)[key];
  }

  if (value === undefined || (value === null && /^\/assistantMessage\/content\/\d+$/u.test(pointer))) {
    throw unknownPart(item);
  }
  return value;
}

/** Strings and plain text blocks read back as their text, without JSON escaping. */
function plainText(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (typeof value !== 'object' || value === null) return undefined;
  const block = value as Record<string, unknown>;
  const keys = Object.keys(block);
  return keys.length === 2 && block.type === 'text' && typeof block.text === 'string' ? block.text : undefined;
}

/** List content separately; the root handle also recovers headers and public fields. */
export function historyParts(item: RecoveryHistoryItem): HistoryPart[] {
  const parts: HistoryPart[] = [];
  const addContent = (content: unknown, path: string): void => {
    if (Array.isArray(content)) {
      content.forEach((value, index) => {
        if (value !== null && value !== undefined) parts.push({ part: `${path}/${index}`, value });
      });
      return;
    }
    parts.push({ part: path, value: content });
  };

  if (item.kind === 'user') {
    addContent(item.userMessage.content, '/userMessage/content');
  } else {
    addContent(item.assistantMessage.content, '/assistantMessage/content');
    item.toolResults.forEach((result, index) => {
      addContent(result.content, `/toolResults/${index}/content`);
    });
    parts.push({ part: '/metadata', value: item.metadata });
  }
  parts.push({ part: '', value: item });
  return parts;
}

// ───────────────────────────────────────────────────────────────────
// 5. SERIALIZATION
// ───────────────────────────────────────────────────────────────────

function imageMetadata(image: HistoryImageBlock, historyId: string, part: string): {
  type: 'image';
  mimeType: string;
  bytes: number;
  read: PartReadHandle;
} {
  const padding = image.data.endsWith('==') ? 2 : image.data.endsWith('=') ? 1 : 0;
  return {
    type: 'image',
    mimeType: image.mimeType,
    bytes: Math.max(0, Math.floor((image.data.length * 3) / 4) - padding),
    read: { historyId, part, mode: 'image' },
  };
}

/** Image bytes stay in native attachments, never JSON text, even in aggregate reads. */
export function serializeRecoveryPart(item: RecoveryHistoryItem, pointer: string): string {
  const value = selectHistoryPart(item, pointer);
  const paths = new WeakMap<object, string>();
  if (typeof value === 'object' && value !== null) paths.set(value, pointer);

  const text = JSON.stringify(value, function (this: object, key: string, child: unknown): unknown {
    const parentPath = paths.get(this);
    const path = parentPath === undefined ? pointer : `${parentPath}/${escapeKey(key)}`;
    if (isRecoveryImage(child)) return imageMetadata(child, item.id, path);
    if (typeof child === 'object' && child !== null) paths.set(child, path);
    return child;
  });

  if (text === undefined) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Recovery part could not be serialized.');
  }
  return text;
}

/** Text-mode pages slice this representation; every other part keeps image-safe JSON. */
export function recoveryPartText(item: RecoveryHistoryItem, pointer: string): HistoryPartText {
  const text = plainText(selectHistoryPart(item, pointer));
  return text === undefined
    ? { format: 'json', text: serializeRecoveryPart(item, pointer) }
    : { format: 'text', text };
}

function partType(value: unknown, format: HistoryPartText['format']): string {
  if (format === 'text') return 'text';
  if (typeof value !== 'object' || value === null || !('type' in value)) return 'json';
  return (value as { type?: unknown }).type === 'text' || (value as { type?: unknown }).type === 'toolCall'
    ? (value as { type: string }).type
    : 'json';
}

/** Describe one part with a read handle and a bounded preview. */
export function describeHistoryPart(item: RecoveryHistoryItem, part: HistoryPart): HistoryPartDescription {
  if (isRecoveryImage(part.value)) {
    const metadata = imageMetadata(part.value, item.id, part.part);
    return { part: part.part, type: 'image', bytes: metadata.bytes, read: metadata.read };
  }

  const { format, text } = recoveryPartText(item, part.part);
  return {
    part: part.part,
    type: partType(part.value, format),
    bytes: Buffer.byteLength(text, 'utf8'),
    preview: text.slice(0, 160).replace(/[\uD800-\uDBFF]$/u, ''),
    read: { historyId: item.id, part: part.part },
  };
}

// ───────────────────────────────────────────────────────────────────
// 6. TEXT PAGES
// ───────────────────────────────────────────────────────────────────

/** Headers echo these values, so long ones would leave no room for the page. */
export function validateHandleLengths(input: { historyId: string; part?: string }): void {
  if (typeof input.historyId !== 'string') {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'historyId must be a string.');
  }
  if (input.part !== undefined && typeof input.part !== 'string') {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'part must be a string when provided.');
  }
  if (input.historyId.length > MAXIMUM_HISTORY_ID_CHARACTERS) {
    throw new HistoryPageError(
      'INVALID_PAGE_INPUT',
      `historyId must be at most ${MAXIMUM_HISTORY_ID_CHARACTERS} characters.`,
    );
  }
  if (input.part !== undefined && input.part.length > MAXIMUM_PART_CHARACTERS) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', `part must be at most ${MAXIMUM_PART_CHARACTERS} characters.`);
  }
}

/** Turn a page into reply text blocks: a JSON header, then the page body. */
export function historyPageTexts(page: HistoryPage): string[] {
  const header = JSON.stringify(page.header);
  return page.text === '' ? [header] : [header, page.text];
}

function splitsSurrogate(text: string, index: number): boolean {
  return index > 0
    && index < text.length
    && /[\uD800-\uDBFF]/u.test(text[index - 1] ?? '')
    && /[\uDC00-\uDFFF]/u.test(text[index] ?? '');
}

/** Read a public part as bounded text pages with a resumable offset. */
export function readHistoryTextPage(items: readonly HistoryItem[], input: HistoryPageInput): HistoryPage {
  if (input.mode !== undefined && input.mode !== 'text') {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Text output requires text mode.');
  }
  validateHandleLengths(input);
  if (input.part === undefined) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Text output requires a part handle.');
  }

  const offset = input.offset ?? 0;
  if (!Number.isSafeInteger(offset) || offset < 0) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Output offset must be a nonnegative integer.');
  }
  if (input.limit !== undefined
    && (!Number.isSafeInteger(input.limit) || input.limit < 1 || input.limit > MAXIMUM_PAGE_LIMIT)) {
    throw new HistoryPageError(
      'INVALID_PAGE_INPUT',
      `Output limit must be an integer from 1 to ${MAXIMUM_PAGE_LIMIT}.`,
    );
  }

  const item = publicHistoryItem(items, input.historyId);
  const part = input.part;
  const { format, text } = recoveryPartText(item, part);
  if (offset > text.length) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Output offset exceeds the output length.');
  }
  if (splitsSurrogate(text, offset)) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Output offset splits a Unicode character.');
  }

  const pageAt = (end: number): HistoryPage => {
    const nextOffset = end < text.length ? end : null;
    const header: HistoryPageHeader = {
      historyId: item.id,
      part,
      format,
      offset,
      nextOffset,
      totalCharacters: text.length,
    };
    if (nextOffset !== null) {
      header.next = {
        historyId: item.id,
        part,
        offset: nextOffset,
        ...(input.limit === undefined ? {} : { limit: input.limit }),
      };
    }
    return { header, text: text.slice(offset, end) };
  };

  // A lone surrogate costs more escaped bytes than its whole pair, so size only
  // whole-character ends.
  const boundary = (end: number): number => (splitsSurrogate(text, end) ? end - 1 : end);
  const fits = (end: number): boolean => fitsRecoveryText(historyPageTexts(pageAt(boundary(end))));
  const pageLimit = Math.min(input.limit ?? MAXIMUM_TEXT_PAGE_CODE_UNITS, MAXIMUM_TEXT_PAGE_CODE_UNITS);
  const end = Math.min(offset + pageLimit, text.length);

  // The last page drops its next handle, so test it first; earlier ends grow
  // with the page.
  let low = offset;
  let high = end;
  if (fits(end)) {
    low = end;
  } else {
    high = end - 1;
  }
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (fits(middle)) low = middle;
    else high = middle - 1;
  }
  low = boundary(low);
  if (low === offset && offset < text.length) {
    throw new HistoryPageError(
      'INVALID_PAGE_INPUT',
      'Output limit is too small for the next Unicode character. Increase limit.',
    );
  }
  return pageAt(low);
}

// ───────────────────────────────────────────────────────────────────
// 7. PART LIST PAGES
// ───────────────────────────────────────────────────────────────────

/** List part descriptions with a resumable offset, bounded by the reply budget. */
export function historyPartsPage(
  item: RecoveryHistoryItem,
  offset = 0,
  limit = MAXIMUM_PAGE_LIMIT,
): {
  parts: HistoryPartDescription[];
  offset: number;
  nextOffset: number | null;
  totalParts: number;
} {
  const parts = historyParts(item);
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > parts.length) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Invalid part-list offset.');
  }
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > MAXIMUM_PAGE_LIMIT) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'Invalid part-list limit.');
  }

  const page: {
    parts: HistoryPartDescription[];
    offset: number;
    nextOffset: number | null;
    totalParts: number;
  } = {
    parts: [],
    offset,
    nextOffset: offset < parts.length ? offset : null,
    totalParts: parts.length,
  };

  for (let index = offset; index < parts.length && page.parts.length < limit; index++) {
    const part = parts[index];
    if (part === undefined) break;
    page.parts.push(describeHistoryPart(item, part));
    page.nextOffset = index + 1 === parts.length ? null : index + 1;
    if (!fitsRecoveryResponse(page)) {
      page.parts.pop();
      page.nextOffset = index;
      break;
    }
  }

  if (page.parts.length === 0 && offset < parts.length) {
    throw new HistoryPageError('PART_TOO_LARGE', 'Recovery part description exceeds the reply budget.');
  }
  return page;
}

// ───────────────────────────────────────────────────────────────────
// 8. IMAGE SELECTION
// ───────────────────────────────────────────────────────────────────

/** Select one native image attachment; image data never enters text mode. */
export function selectHistoryImage(item: RecoveryHistoryItem, pointer: string): HistoryImageBlock {
  const value = selectHistoryPart(item, pointer);
  if (!isRecoveryImage(value)) {
    throw new HistoryPageError('INVALID_PAGE_INPUT', 'The selected public part is not an image.');
  }
  return value;
}
