// ───────────────────────────────────────────────────────────────────
// MODULE: History Navigator
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import type { HistoryItem } from './history.js';
import { recoveryHistoryItem, type RecoveryHistoryItem } from './projection.js';
import { isRecoveryImage } from './pages.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const K1 = 1.2;
const B = 0.75;
const TERM_PATTERN = /\p{Script=Han}|[\p{L}\p{N}_./:-]+/gu;
const HAN_PATTERN = /^\p{Script=Han}$/u;
// A part shorter than this is mostly noise, such as a path's single-letter
// segment, and would match almost every turn.
const MINIMUM_PART_CHARACTERS = 2;
// An exact mention of the whole identifier outranks a turn that holds only
// its parts.
const WHOLE_TERM_BONUS = 1.5;
// A reference lists this many tools and files and counts the rest, so a turn
// that touched many files cannot push the reply over its byte bound and
// collapse every reference to an id. The full lists stay readable through load.
const MAXIMUM_REFERENCE_TOOLS = 6;
const MAXIMUM_REFERENCE_FILES = 12;
const MAXIMUM_QUERY_CHARACTERS = 200;
const MAXIMUM_FILTER_ENTRIES = 10;
const MAXIMUM_FILTER_CHARACTERS = 200;
const MAXIMUM_RESULT_COUNT = 10;
const MAXIMUM_SEQUENCE = 1_000_000;

// ───────────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────────

export type HistorySearchInput = {
  query: string;
  files?: string[];
  tools?: string[];
  failed?: boolean;
  limit?: number;
};

export type HistoryBrowseInput = {
  historyId?: string;
  sequence?: number;
  direction: 'backward' | 'forward' | 'around';
  count?: number;
  stride?: number;
};

export type HistoryReference = {
  historyId: string;
  sequence: number;
  kind: HistoryItem['kind'];
  timestamp: string;
  preview: string;
  tools: string[];
  files: string[];
  /** Tools beyond the listed ones; present only when the list was cut. */
  omittedTools?: number;
  /** Files beyond the listed ones; present only when the list was cut. */
  omittedFiles?: number;
  failed: boolean;
  previousHistoryId: string | null;
  nextHistoryId: string | null;
};

export type HistoryNavigatorErrorCode =
  | 'INVALID_HISTORY_NAVIGATOR_INPUT'
  | 'UNKNOWN_HISTORY_ANCHOR'
  | 'UNKNOWN_HISTORY_ID';

/** A navigator request that cannot be answered or an id that is not public. */
export class HistoryNavigatorError extends Error {
  readonly code: HistoryNavigatorErrorCode;

  constructor(code: HistoryNavigatorErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'HistoryNavigatorError';
  }
}

// ───────────────────────────────────────────────────────────────────
// 4. SEARCH TEXT
// ───────────────────────────────────────────────────────────────────

type SearchDocument = {
  /** The NFKC form of the turn's searchable text, which previews quote. */
  text: string;
  /** Whole terms, each a full identifier, path or word. */
  terms: Map<string, number>;
  /** Parts of the terms that split, and adjacent Han character pairs. */
  parts: Map<string, number>;
  length: number;
};

type SearchToken = {
  start: number;
  end: number;
  whole: string;
  parts: string[];
};

/**
 * One query token. A turn matches the group only when it holds every required
 * term, so `LIVE-MARKER` needs both `live` and `marker`. Separate query tokens
 * stay alternatives.
 */
type QueryGroup = {
  whole: string;
  required: string[];
};

function normalizeTerm(term: string): string {
  return term.replace(/^[./:-]+|[./:-]+$/g, '');
}

function isHan(term: string): boolean {
  return HAN_PATTERN.test(term);
}

// Case changes are read before lowercasing, so `bm25Score` yields `bm25` and
// `score`; separators then split paths, ids and snake_case names.
function partsOf(term: string): string[] {
  return term
    .replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2')
    .split(/[^\p{L}\p{N}]+/u)
    .map((piece) => piece.toLowerCase())
    .filter((piece) => piece.length >= MINIMUM_PART_CHARACTERS);
}

// Offsets are into the text as given, so a caller that passes NFKC text gets
// offsets it can quote from.
function tokensOf(text: string): SearchToken[] {
  const tokens: SearchToken[] = [];
  for (const match of text.matchAll(TERM_PATTERN)) {
    const trimmed = normalizeTerm(match[0]);
    if (!trimmed) continue;
    const start = (match.index ?? 0) + match[0].indexOf(trimmed);
    const whole = trimmed.toLowerCase();
    const pieces = partsOf(trimmed);
    // Only a term that splits gets parts, so a plain word is indexed once.
    const parts = pieces.length === 1 && pieces[0] === whole ? [] : pieces;
    tokens.push({ start, end: start + trimmed.length, whole, parts });
  }
  return tokens;
}

function adjacentHanPair(previous: SearchToken | undefined, token: SearchToken): string | undefined {
  if (previous === undefined || previous.end !== token.start) return undefined;
  return isHan(previous.whole) && isHan(token.whole) ? previous.whole + token.whole : undefined;
}

function countTerm(terms: Map<string, number>, term: string): void {
  terms.set(term, (terms.get(term) ?? 0) + 1);
}

function analyzeDocument(source: string): SearchDocument {
  // NFKC folds full-width and half-width forms, so `ＬＩＶＥ` and `LIVE` are one term.
  const text = source.normalize('NFKC');
  const terms = new Map<string, number>();
  const parts = new Map<string, number>();
  let length = 0;
  let previous: SearchToken | undefined;
  for (const token of tokensOf(text)) {
    length += 1;
    countTerm(terms, token.whole);
    for (const part of token.parts) countTerm(parts, part);
    // A Han word is a run of single characters, so its pairs carry the order.
    const pair = adjacentHanPair(previous, token);
    if (pair !== undefined) countTerm(parts, pair);
    previous = token;
  }
  return { text, terms, parts, length };
}

function hanRunGroup(run: readonly SearchToken[]): QueryGroup {
  if (run.length === 1) return { whole: run[0].whole, required: [run[0].whole] };
  const pairs = run.slice(1).map((token, index) => run[index].whole + token.whole);
  return { whole: run.map((token) => token.whole).join(''), required: [...new Set(pairs)] };
}

function queryGroups(query: string): QueryGroup[] {
  const groups: QueryGroup[] = [];
  let hanRun: SearchToken[] = [];
  const closeHanRun = (): void => {
    if (hanRun.length > 0) groups.push(hanRunGroup(hanRun));
    hanRun = [];
  };
  for (const token of tokensOf(query.normalize('NFKC'))) {
    if (isHan(token.whole)) {
      if (hanRun.length > 0 && hanRun[hanRun.length - 1].end !== token.start) closeHanRun();
      hanRun.push(token);
      continue;
    }
    closeHanRun();
    groups.push({
      whole: token.whole,
      required: token.parts.length > 1 ? [...new Set(token.parts)] : [token.whole],
    });
  }
  closeHanRun();
  return groups.filter((group, index) => groups.findIndex((other) => other.whole === group.whole) === index);
}

function serialized(value: unknown): string {
  const result = JSON.stringify(value);
  return result === undefined ? '' : result;
}

function contentText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return serialized(content);
  return content
    .flatMap((block) => {
      if (block === null) return [];
      if (isRecoveryImage(block)) return [`[Image: ${block.mimeType}]`];
      if (typeof block === 'object'
        && (block as { type?: unknown }).type === 'text'
        && typeof (block as { text?: unknown }).text === 'string') {
        return [(block as { text: string }).text];
      }
      return [serialized(block)];
    })
    .join(' ');
}

function itemText(item: RecoveryHistoryItem): string {
  if (item.kind === 'user') return contentText(item.userMessage.content);

  const toolCalls = item.assistantMessage.content.flatMap((block) => {
    if (block === null || block.type !== 'toolCall') return [];
    return [{ name: block.name, arguments: block.arguments }];
  });
  const fileSegments = item.metadata.files.flatMap((file) => file.split(/[\\/]/));
  return [
    contentText(item.assistantMessage.content),
    ...toolCalls.flatMap((call) => [call.name, serialized(call.arguments)]),
    ...item.toolResults.map((result) => contentText(result.content)),
    ...item.metadata.files,
    ...fileSegments,
  ].join(' ');
}

function previewFor(item: RecoveryHistoryItem): string {
  const content = item.kind === 'user' ? item.userMessage.content : item.assistantMessage.content;
  return contentText(content).replace(/\s+/g, ' ').trim().slice(0, 160);
}

function excerptAround(text: string, matchStart: number, matchEnd: number): string {
  const maximum = 160;
  if (text.length <= maximum) return text;
  const width = maximum - 2; // Reserve space for both ellipses.
  const before = Math.max(0, Math.floor((width - (matchEnd - matchStart)) / 2));
  const start = Math.min(Math.max(0, matchStart - before), text.length - width);
  const end = Math.min(text.length, start + width);
  const excerpt = text.slice(start, end).replace(/^[\uDC00-\uDFFF]|[\uD800-\uDBFF]$/gu, '');
  return `${start > 0 ? '…' : ''}${excerpt}${end < text.length ? '…' : ''}`;
}

// The preview centers on the term that made the turn match: an exact mention
// first, else the first identifier holding a required part, so a match on a
// fragment still shows the identifier it came from.
function searchPreview(text: string, groups: readonly QueryGroup[]): string | undefined {
  const compact = text.replace(/\s+/g, ' ').trim();
  const wholes = new Set(groups.map((group) => group.whole));
  const required = new Set(groups.flatMap((group) => group.required));
  let fallback: [number, number] | undefined;
  let previous: SearchToken | undefined;
  for (const token of tokensOf(compact)) {
    if (wholes.has(token.whole)) return excerptAround(compact, token.start, token.end);
    if (fallback === undefined) {
      const pair = adjacentHanPair(previous, token);
      if (required.has(token.whole) || token.parts.some((part) => required.has(part))) {
        fallback = [token.start, token.end];
      } else if (pair !== undefined && required.has(pair) && previous !== undefined) {
        fallback = [previous.start, token.end];
      }
    }
    previous = token;
  }
  return fallback === undefined ? undefined : excerptAround(compact, fallback[0], fallback[1]);
}

// ───────────────────────────────────────────────────────────────────
// 5. REFERENCES & VALIDATION
// ───────────────────────────────────────────────────────────────────

function buildReference(item: RecoveryHistoryItem, index: number, items: readonly RecoveryHistoryItem[]): HistoryReference {
  const metadata = item.kind === 'modelTurn' ? item.metadata : { tools: [], files: [], failed: false };
  const omittedTools = metadata.tools.length - MAXIMUM_REFERENCE_TOOLS;
  const omittedFiles = metadata.files.length - MAXIMUM_REFERENCE_FILES;
  return {
    historyId: item.id,
    sequence: item.sequence,
    kind: item.kind,
    timestamp: item.timestamp,
    preview: previewFor(item),
    tools: metadata.tools.slice(0, MAXIMUM_REFERENCE_TOOLS),
    files: metadata.files.slice(0, MAXIMUM_REFERENCE_FILES),
    ...(omittedTools > 0 ? { omittedTools } : {}),
    ...(omittedFiles > 0 ? { omittedFiles } : {}),
    failed: metadata.failed,
    previousHistoryId: items[index - 1]?.id ?? null,
    nextHistoryId: items[index + 1]?.id ?? null,
  };
}

function invalid(message: string): never {
  throw new HistoryNavigatorError('INVALID_HISTORY_NAVIGATOR_INPUT', message);
}

function validateString(value: unknown, label: string, maximum: number): asserts value is string {
  if (typeof value !== 'string' || value.length > maximum) {
    invalid(`${label} must be a string of at most ${maximum} characters`);
  }
}

function validateStringArray(value: unknown, label: string): asserts value is string[] {
  if (!Array.isArray(value) || value.length > MAXIMUM_FILTER_ENTRIES) {
    invalid(`${label} must contain at most ${MAXIMUM_FILTER_ENTRIES} strings`);
  }
  for (const item of value) validateString(item, `${label} item`, MAXIMUM_FILTER_CHARACTERS);
}

function hasFilters(input: HistorySearchInput): boolean {
  return (input.files?.length ?? 0) > 0 || (input.tools?.length ?? 0) > 0 || input.failed !== undefined;
}

function boundedInteger(value: unknown, label: string, minimum: number, maximum: number): number {
  if (!Number.isInteger(value) || (value as number) < minimum || (value as number) > maximum) {
    invalid(`${label} must be an integer from ${minimum} to ${maximum}`);
  }
  return value as number;
}

// ───────────────────────────────────────────────────────────────────
// 6. BROWSE WINDOWS
// ───────────────────────────────────────────────────────────────────

function directionalIndexes(
  length: number,
  anchorIndex: number | undefined,
  direction: 'backward' | 'forward',
  count: number,
  stride: number,
): number[] {
  const step = direction === 'backward' ? -stride : stride;
  let current = anchorIndex === undefined
    ? direction === 'backward'
      ? length - 1
      : 0
    : anchorIndex + step;
  const indexes: number[] = [];
  while (indexes.length < count && current >= 0 && current < length) {
    indexes.push(current);
    current += step;
  }
  return indexes;
}

function aroundIndexes(length: number, anchorIndex: number, count: number, stride: number): number[] {
  const candidates: number[] = [anchorIndex];
  for (let index = anchorIndex - stride; index >= 0; index -= stride) candidates.unshift(index);
  for (let index = anchorIndex + stride; index < length; index += stride) candidates.push(index);

  const anchorPosition = candidates.indexOf(anchorIndex);
  const itemsBefore = Math.floor((count - 1) / 2);
  const maximumStart = Math.max(0, candidates.length - count);
  const start = Math.max(0, Math.min(anchorPosition - itemsBefore, maximumStart));
  return candidates.slice(start, start + count);
}

// ───────────────────────────────────────────────────────────────────
// 7. NAVIGATOR
// ───────────────────────────────────────────────────────────────────

/** Indexes public history and answers search, browse and load without mutation. */
export class HistoryNavigator {
  private items: RecoveryHistoryItem[] = [];
  private itemById = new Map<string, RecoveryHistoryItem>();
  private itemBySequence = new Map<number, RecoveryHistoryItem>();
  private references: HistoryReference[] = [];
  private searchDocuments: SearchDocument[] | undefined;
  private documentFrequencies = new Map<string, number>();
  private partFrequencies = new Map<string, number>();
  private averageDocumentLength = 0;

  constructor(items: readonly HistoryItem[] = []) {
    this.rebuild(items);
  }

  /** Rebuild every index after the adapter refreshes its entry list. */
  rebuild(items: readonly HistoryItem[]): void {
    this.items = items
      .map(recoveryHistoryItem)
      .filter((item): item is RecoveryHistoryItem => item !== undefined)
      .map((item, sequence) => ({ ...item, sequence }));
    this.itemById = new Map(this.items.map((item) => [item.id, item]));
    this.itemBySequence = new Map(this.items.map((item) => [item.sequence, item]));
    this.references = this.items.map((item, index) => buildReference(item, index, this.items));
    this.searchDocuments = undefined;
    this.documentFrequencies = new Map();
    this.partFrequencies = new Map();
    this.averageDocumentLength = 0;
  }

  /** Search public history with BM25 and optional metadata filters. */
  search(input: HistorySearchInput): HistoryReference[] {
    validateString(input.query, 'query', MAXIMUM_QUERY_CHARACTERS);
    if (input.files !== undefined) validateStringArray(input.files, 'files');
    if (input.tools !== undefined) validateStringArray(input.tools, 'tools');
    if (input.failed !== undefined && typeof input.failed !== 'boolean') invalid('failed must be a boolean');
    const limit = input.limit === undefined
      ? 5
      : boundedInteger(input.limit, 'limit', 1, MAXIMUM_RESULT_COUNT);

    const groups = queryGroups(input.query);
    // A query with no terms and no filter would just list the oldest turns,
    // which browse already does. A filter-only search still lists its matches.
    // A query of punctuation alone has no terms either, so it counts as empty.
    if (groups.length === 0 && !hasFilters(input)) return [];
    const searchDocuments = this.searchDocuments ?? this.buildSearchIndex();
    const totalDocuments = searchDocuments.length;

    return this.items
      .map((item, index) => ({
        item,
        index,
        score: this.bm25Score(searchDocuments[index], groups, totalDocuments),
      }))
      .filter(({ item, score }) => score !== undefined && this.matchesFilters(item, input))
      .sort((left, right) => (right.score ?? 0) - (left.score ?? 0) || left.item.sequence - right.item.sequence)
      .slice(0, limit)
      .map(({ index }) => {
        const reference = this.references[index];
        const document = searchDocuments[index];
        if (groups.length === 0 || document === undefined) return reference;
        return { ...reference, preview: searchPreview(document.text, groups) ?? reference.preview };
      });
  }

  /** Return anchored backward, forward or around windows. */
  browse(input: HistoryBrowseInput): HistoryReference[] {
    if (input.direction !== 'backward' && input.direction !== 'forward' && input.direction !== 'around') {
      invalid('direction must be backward, forward, or around');
    }
    if (input.historyId !== undefined && input.sequence !== undefined) {
      throw new HistoryNavigatorError('UNKNOWN_HISTORY_ANCHOR', 'Specify historyId or sequence, not both');
    }
    if (input.historyId !== undefined) validateString(input.historyId, 'historyId', 128);
    if (input.sequence !== undefined) boundedInteger(input.sequence, 'sequence', 0, MAXIMUM_SEQUENCE);
    const count = input.count === undefined
      ? 5
      : boundedInteger(input.count, 'count', 1, MAXIMUM_RESULT_COUNT);
    const stride = input.stride === undefined ? 1 : boundedInteger(input.stride, 'stride', 1, 10);

    const anchor = this.resolveAnchor(input);
    if (this.items.length === 0 && anchor === undefined) return [];
    const anchorIndex = anchor?.sequence;
    const indexes = input.direction === 'around'
      ? aroundIndexes(this.items.length, anchorIndex ?? this.items.length - 1, count, stride)
      : directionalIndexes(this.items.length, anchorIndex, input.direction, count, stride);
    return indexes.map((index) => this.references[index]);
  }

  /** Resolve one to three ids in the caller's requested order. */
  load(historyIds: readonly string[]): RecoveryHistoryItem[] {
    if (!Array.isArray(historyIds) || historyIds.length < 1 || historyIds.length > 3) {
      invalid('historyIds must contain one to three IDs');
    }
    for (const historyId of historyIds) validateString(historyId, 'history ID', 128);
    const resolved = historyIds.map((historyId) => this.itemById.get(historyId));
    const missingIndex = resolved.findIndex((item) => item === undefined);
    if (missingIndex !== -1) {
      throw new HistoryNavigatorError('UNKNOWN_HISTORY_ID', `Unknown history ID ${historyIds[missingIndex]}`);
    }
    return resolved as RecoveryHistoryItem[];
  }

  private buildSearchIndex(): SearchDocument[] {
    this.documentFrequencies = new Map();
    this.partFrequencies = new Map();
    this.searchDocuments = this.items.map((item) => {
      const document = analyzeDocument(itemText(item));
      for (const term of document.terms.keys()) countTerm(this.documentFrequencies, term);
      for (const part of document.parts.keys()) countTerm(this.partFrequencies, part);
      return document;
    });
    this.averageDocumentLength = this.searchDocuments.length === 0
      ? 0
      : this.searchDocuments.reduce((sum, document) => sum + document.length, 0) / this.searchDocuments.length;
    return this.searchDocuments;
  }

  private bm25Score(
    document: SearchDocument | undefined,
    groups: readonly QueryGroup[],
    totalDocuments: number,
  ): number | undefined {
    if (groups.length === 0) return 0;
    if (document === undefined) return undefined;
    const termScore = (frequency: number, documentFrequency: number): number => {
      const idf = Math.log(1 + (totalDocuments - documentFrequency + 0.5) / (documentFrequency + 0.5));
      const lengthRatio = this.averageDocumentLength === 0 ? 0 : document.length / this.averageDocumentLength;
      return idf * (frequency * (K1 + 1)) / (frequency + K1 * (1 - B + B * lengthRatio));
    };
    let score = 0;
    let matched = false;
    for (const group of groups) {
      let groupScore = 0;
      let complete = true;
      for (const term of group.required) {
        const whole = document.terms.get(term) ?? 0;
        const part = whole > 0 ? 0 : document.parts.get(term) ?? 0;
        if (whole === 0 && part === 0) {
          complete = false;
          break;
        }
        groupScore += whole > 0
          ? termScore(whole, this.documentFrequencies.get(term) ?? 0)
          : termScore(part, this.partFrequencies.get(term) ?? 0);
      }
      if (!complete) continue;
      const exact = group.required[0] === group.whole ? 0 : document.terms.get(group.whole) ?? 0;
      if (exact > 0) groupScore += WHOLE_TERM_BONUS * termScore(exact, this.documentFrequencies.get(group.whole) ?? 0);
      matched = true;
      score += groupScore;
    }
    return matched ? score : undefined;
  }

  private matchesFilters(item: RecoveryHistoryItem, input: HistorySearchInput): boolean {
    const metadata = item.kind === 'modelTurn' ? item.metadata : { tools: [], files: [], failed: false };
    return (input.files === undefined || input.files.every((file) => metadata.files.includes(file)))
      && (input.tools === undefined || input.tools.length === 0 || input.tools.some((tool) => metadata.tools.includes(tool)))
      && (input.failed === undefined || input.failed === metadata.failed);
  }

  private resolveAnchor(input: HistoryBrowseInput): RecoveryHistoryItem | undefined {
    if (input.historyId === undefined && input.sequence === undefined) return undefined;
    const item = input.historyId === undefined
      ? this.itemBySequence.get(input.sequence as number)
      : this.itemById.get(input.historyId);
    if (item === undefined) {
      throw new HistoryNavigatorError('UNKNOWN_HISTORY_ANCHOR', 'Unknown history anchor');
    }
    return item;
  }
}
