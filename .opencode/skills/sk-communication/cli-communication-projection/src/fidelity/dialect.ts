// ───────────────────────────────────────────────────────────────────
// MODULE: Conservative Markdown Dialect
// ───────────────────────────────────────────────────────────────────

import { ProtectedSpanKinds } from './types.js';

import type { ProtectedSpanKind } from './types.js';

/** One non-overlapping source range selected for exact preservation. */
export interface ProtectedSourceRange {
  readonly start: number;
  readonly end: number;
  readonly kind: ProtectedSpanKind;
}

interface SourceLine {
  readonly start: number;
  readonly contentEnd: number;
  readonly end: number;
  readonly text: string;
}

const COMMAND_PREFIX = /^[ \t]*(?:bun|cargo|deno|git|go|node|npm|npx|pnpm|python|python3|sh|bash|yarn)\s+\S/u;
const TABLE_DELIMITER = /^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?[ \t]*$/u;

/** Select technical and structural ranges using the pinned conservative dialect. */
export function collectProtectedRanges(
  sourceText: string,
  configuredLiterals: readonly string[],
): readonly ProtectedSourceRange[] {
  const ranges: ProtectedSourceRange[] = [];
  const lines = createLines(sourceText);
  const addRange = (
    start: number,
    end: number,
    kind: ProtectedSpanKind,
  ): boolean => {
    if (start < 0 || end <= start || end > sourceText.length) {
      return false;
    }
    if (ranges.some((range) => start < range.end && end > range.start)) {
      return false;
    }
    ranges.push({ start, end, kind });
    return true;
  };

  collectBlockRanges(lines, sourceText.length, addRange);
  collectConfiguredRanges(sourceText, configuredLiterals, addRange);
  collectInlineRanges(sourceText, addRange);

  return Object.freeze(ranges.sort((left, right) =>
    left.start - right.start || left.end - right.end));
}

/** Create a stable structural signature without retaining prose. */
export function createMarkdownStructureSignature(sourceText: string): string {
  const lines = createLines(sourceText);
  const headings: string[] = [];
  const lists: string[] = [];
  const quotes: number[] = [];
  const fences: string[] = [];
  const tables: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) {
      continue;
    }
    const atx = line.text.match(/^[ \t]{0,3}(#{1,6})(?:[ \t]+|$)/u);
    if (atx?.[1] !== undefined) {
      headings.push(`atx:${atx[1].length}`);
    }
    const next = lines[index + 1];
    if (line.text.trim().length > 0 && next !== undefined) {
      const setext = next.text.match(/^[ \t]{0,3}(=+|-+)[ \t]*$/u);
      if (setext?.[1] !== undefined) {
        headings.push(`setext:${setext[1].startsWith('=') ? 1 : 2}`);
      }
    }
    const list = line.text.match(/^([ \t]*)([-+*]|\d+[.)])[ \t]+/u);
    if (list?.[1] !== undefined && list[2] !== undefined) {
      lists.push(`${indentWidth(list[1])}:${/^\d/u.test(list[2]) ? 'ordered' : list[2]}`);
    }
    const quote = line.text.match(/^[ \t]*(>+(?:[ \t]|$))/u);
    if (quote?.[1] !== undefined) {
      quotes.push((quote[1].match(/>/gu) ?? []).length);
    }
    const fence = line.text.match(/^[ \t]{0,3}(`{3,}|~{3,})([^`]*)$/u);
    if (fence?.[1] !== undefined) {
      fences.push(`${fence[1][0]}:${fence[1].length}:${(fence[2] ?? '').trim()}`);
    }
    if (next !== undefined && line.text.includes('|') && TABLE_DELIMITER.test(next.text)) {
      let rowCount = 2;
      let cursor = index + 2;
      while (cursor < lines.length && (lines[cursor]?.text.includes('|') ?? false)) {
        rowCount += 1;
        cursor += 1;
      }
      tables.push(`${countTableCells(line.text)}x${rowCount}`);
    }
  }

  return JSON.stringify({
    headings,
    lists,
    quotes,
    fences,
    tables,
    links: countPattern(sourceText, /!?\[[^\]\n]*\]\([^\n)]+\)/gu),
    referenceLinks: countPattern(sourceText, /!?\[[^\]\n]+\]\[[^\]\n]*\]/gu),
    inlineCode: countPattern(sourceText, /(`+)([^`]|`(?!\1))*?\1/gu),
    html: countPattern(sourceText, /<(?:!--[\s\S]*?--|\/?[A-Za-z][^>\n]*)>/gu),
  });
}

/** Reject strings that cannot round trip through strict UTF-8 text semantics. */
export function hasUnpairedSurrogate(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xD800 && code <= 0xDBFF) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xDC00 && next <= 0xDFFF)) {
        return true;
      }
      index += 1;
    } else if (code >= 0xDC00 && code <= 0xDFFF) {
      return true;
    }
  }
  return false;
}

function collectBlockRanges(
  lines: readonly SourceLine[],
  sourceLength: number,
  addRange: (start: number, end: number, kind: ProtectedSpanKind) => boolean,
): void {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line === undefined) {
      continue;
    }

    const fence = line.text.match(/^[ \t]{0,3}(`{3,}|~{3,})/u)?.[1];
    if (fence !== undefined) {
      const marker = fence[0] ?? '`';
      const closing = new RegExp(`^[ \\t]{0,3}${escapeRegex(marker)}{${fence.length},}[ \\t]*$`, 'u');
      let last = line;
      let cursor = index + 1;
      for (; cursor < lines.length; cursor += 1) {
        const candidate = lines[cursor];
        if (candidate === undefined) {
          break;
        }
        last = candidate;
        if (closing.test(candidate.text)) {
          break;
        }
      }
      addRange(line.start, last.contentEnd, ProtectedSpanKinds.FENCED_CODE);
      index = Math.min(cursor, lines.length - 1);
      continue;
    }

    if (/^[ \t]*:::{3,}/u.test(line.text)) {
      let last = line;
      let cursor = index + 1;
      for (; cursor < lines.length; cursor += 1) {
        const candidate = lines[cursor];
        if (candidate === undefined) {
          break;
        }
        last = candidate;
        if (/^[ \t]*:::{3,}[ \t]*$/u.test(candidate.text)) {
          break;
        }
      }
      addRange(line.start, last.contentEnd, ProtectedSpanKinds.RUNTIME_EXTENSION);
      index = Math.min(cursor, lines.length - 1);
      continue;
    }

    if (/^[ \t]*<!--/u.test(line.text)) {
      let last = line;
      let cursor = index;
      while (!last.text.includes('-->') && cursor + 1 < lines.length) {
        cursor += 1;
        last = lines[cursor] ?? last;
      }
      addRange(line.start, last.contentEnd, ProtectedSpanKinds.HTML);
      index = cursor;
      continue;
    }

    const next = lines[index + 1];
    if (next !== undefined && line.text.includes('|') && TABLE_DELIMITER.test(next.text)) {
      let last = next;
      let cursor = index + 2;
      while (cursor < lines.length && (lines[cursor]?.text.includes('|') ?? false)) {
        last = lines[cursor] ?? last;
        cursor += 1;
      }
      addRange(line.start, last.contentEnd, ProtectedSpanKinds.TABLE);
      index = cursor - 1;
      continue;
    }

    if (/^(?: {4}|\t)/u.test(line.text)) {
      let last = line;
      let cursor = index + 1;
      while (cursor < lines.length && /^(?: {4}|\t|[ \t]*$)/u.test(lines[cursor]?.text ?? '')) {
        last = lines[cursor] ?? last;
        cursor += 1;
      }
      addRange(line.start, last.contentEnd, ProtectedSpanKinds.INDENTED_CODE);
      index = cursor - 1;
      continue;
    }

    if (/^[ \t]{0,3}#{1,6}(?:[ \t]+|$)/u.test(line.text)) {
      addRange(line.start, line.contentEnd, ProtectedSpanKinds.HEADING);
      continue;
    }

    if (COMMAND_PREFIX.test(line.text)) {
      addRange(line.start, line.contentEnd, ProtectedSpanKinds.COMMAND);
      continue;
    }

    const list = line.text.match(/^[ \t]*(?:[-+*]|\d+[.)])[ \t]+/u)?.[0];
    if (list !== undefined) {
      addRange(line.start, line.start + list.length, ProtectedSpanKinds.LIST_MARKER);
    }
    const quote = line.text.match(/^[ \t]*>+[ \t]?/u)?.[0];
    if (quote !== undefined) {
      addRange(line.start, line.start + quote.length, ProtectedSpanKinds.LIST_MARKER);
    }
  }

  if (lines.length === 0 && sourceLength > 0) {
    addRange(0, sourceLength, ProtectedSpanKinds.QUOTED_LITERAL);
  }
}

function collectConfiguredRanges(
  sourceText: string,
  configuredLiterals: readonly string[],
  addRange: (start: number, end: number, kind: ProtectedSpanKind) => boolean,
): void {
  const literals = [...configuredLiterals].sort((left, right) => right.length - left.length);
  for (const literal of literals) {
    let cursor = 0;
    while (cursor <= sourceText.length - literal.length) {
      const start = sourceText.indexOf(literal, cursor);
      if (start < 0) {
        break;
      }
      addRange(start, start + literal.length, ProtectedSpanKinds.CONFIGURED_LITERAL);
      cursor = start + Math.max(1, literal.length);
    }
  }
}

function collectInlineRanges(
  sourceText: string,
  addRange: (start: number, end: number, kind: ProtectedSpanKind) => boolean,
): void {
  addPattern(sourceText, /⟦pcp:v1:[^:⟧]+:\d+:[^⟧]+⟧/gu, ProtectedSpanKinds.QUOTED_LITERAL, addRange);
  addPattern(sourceText, /(`+)([\s\S]*?)\1/gu, ProtectedSpanKinds.INLINE_CODE, addRange);
  addPattern(sourceText, /!?\[[^\]\n]*\]\((?:\\.|[^)\n])+\)/gu, ProtectedSpanKinds.LINK, addRange);
  addPattern(sourceText, /!?\[[^\]\n]+\]\[[^\]\n]*\]/gu, ProtectedSpanKinds.LINK, addRange);
  addPattern(sourceText, /<(?:https?:\/\/[^>\s]+|!--[\s\S]*?--|\/?[A-Za-z][^>\n]*)>/gu, ProtectedSpanKinds.HTML, addRange);
  addPattern(sourceText, /\bhttps?:\/\/[^\s<>()]+/giu, ProtectedSpanKinds.URL, addRange);
  addPattern(sourceText, /\b[A-Za-z]:\\(?:[^\\\s<>:"|?*]+\\)*[^\\\s<>:"|?*]+/gu, ProtectedSpanKinds.PATH, addRange);
  addPattern(sourceText, /(?:~|\.{1,2})?\/(?:[A-Za-z0-9._~@%+,:=-]+\/?)+/gu, ProtectedSpanKinds.PATH, addRange);
  addPattern(sourceText, /\b(?:[A-Za-z0-9._-]+\/)+[A-Za-z0-9._-]+\b/gu, ProtectedSpanKinds.PATH, addRange);
  addPattern(sourceText, /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n]){2,}'/gu, ProtectedSpanKinds.QUOTED_LITERAL, addRange);
  addPattern(sourceText, /\$\{?[A-Za-z_][A-Za-z0-9_]*\}?/gu, ProtectedSpanKinds.VARIABLE, addRange);
  addPattern(sourceText, /(?:^|(?<=\s))--?[A-Za-z0-9][A-Za-z0-9-]*(?:=[^\s]+)?/gu, ProtectedSpanKinds.FLAG, addRange);
  addPattern(sourceText, /\b(?:sha256:)?[a-f0-9]{12,128}\b/giu, ProtectedSpanKinds.HASH, addRange);
  addPattern(sourceText, /\b\p{Lu}[\p{L}\p{N}-]{1,}(?:[ \t]+\p{Lu}[\p{L}\p{N}-]{1,})+\b/gu, ProtectedSpanKinds.IDENTIFIER, addRange);
  addPattern(sourceText, /\b\d+(?:[.,]\d+)*(?:\s?(?:%|ms|s|min|h|B|KB|MB|GB|KiB|MiB|GiB|px|rem|em|Hz|kHz|MHz|GHz))?\b/gu, ProtectedSpanKinds.NUMBER, addRange);
  addPattern(sourceText, /\b[a-z]+(?:[A-Z][A-Za-z0-9]*)+\b/gu, ProtectedSpanKinds.IDENTIFIER, addRange);
  addPattern(sourceText, /\b[A-Za-z][A-Za-z0-9]*_[A-Za-z0-9_]+\b/gu, ProtectedSpanKinds.IDENTIFIER, addRange);
  addPattern(sourceText, /\b[A-Za-z][A-Za-z0-9-]*(?:\.[A-Za-z0-9][A-Za-z0-9-]*)+\b/gu, ProtectedSpanKinds.IDENTIFIER, addRange);
  addPattern(sourceText, /\b[A-Z][A-Z0-9_]{2,}\b/gu, ProtectedSpanKinds.IDENTIFIER, addRange);
}

function addPattern(
  sourceText: string,
  pattern: RegExp,
  kind: ProtectedSpanKind,
  addRange: (start: number, end: number, kind: ProtectedSpanKind) => boolean,
): void {
  for (const match of sourceText.matchAll(pattern)) {
    const value = match[0];
    if (value.length > 0 && match.index !== undefined) {
      addRange(match.index, match.index + value.length, kind);
    }
  }
}

function createLines(sourceText: string): readonly SourceLine[] {
  if (sourceText.length === 0) {
    return [];
  }
  const lines: SourceLine[] = [];
  let start = 0;
  while (start < sourceText.length) {
    const newline = sourceText.indexOf('\n', start);
    const contentEnd = newline < 0 ? sourceText.length : newline;
    const end = newline < 0 ? sourceText.length : newline + 1;
    const raw = sourceText.slice(start, contentEnd);
    lines.push({
      start,
      contentEnd: raw.endsWith('\r') ? contentEnd - 1 : contentEnd,
      end,
      text: raw.endsWith('\r') ? raw.slice(0, -1) : raw,
    });
    start = end;
  }
  return lines;
}

function countPattern(value: string, pattern: RegExp): number {
  return [...value.matchAll(pattern)].length;
}

function countTableCells(line: string): number {
  return line
    .replace(/^\s*\|/u, '')
    .replace(/\|\s*$/u, '')
    .split('|').length;
}

function indentWidth(value: string): number {
  return [...value].reduce((total, character) => total + (character === '\t' ? 4 : 1), 0);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}
