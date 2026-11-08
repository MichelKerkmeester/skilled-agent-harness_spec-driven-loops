// ───────────────────────────────────────────────────────────────────
// MODULE: History Cursor Reconstruction Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createHistoryLookup } from '../hooks/lib/history/core.js';
import { projectHistoryEntries, type HistoryEntry } from '../hooks/lib/history/history.js';
import { HistoryNavigatorError } from '../hooks/lib/history/navigator.js';
import { recoveryHistoryItem } from '../hooks/lib/history/projection.js';
import {
  HistoryPageError,
  historyPageTexts,
  historyParts,
  historyPartsPage,
  publicHistoryItem,
  readHistoryTextPage,
  recoveryPartText,
  selectHistoryPart,
  type HistoryPage,
} from '../hooks/lib/history/pages.js';
import { buildHistoryEntries } from './_support/history-fixtures.js';

const TIMESTAMP = '2026-11-07T12:00:00.000Z';

function userTextEntry(id: string, text: string): HistoryEntry {
  return { id, role: 'user', sequence: 0, timestamp: TIMESTAMP, content: [{ type: 'text', text }] };
}

function projected(id: string, text: string) {
  const raw = projectHistoryEntries([userTextEntry(id, text)])[0];
  if (raw === undefined) throw new Error('Missing fixture');
  const item = recoveryHistoryItem(raw);
  if (item === undefined) throw new Error('Fixture is not public');
  return item;
}

function pageErrorCode(run: () => unknown): string {
  try {
    run();
  } catch (error) {
    if (error instanceof HistoryPageError) return error.code;
    throw error;
  }
  throw new Error('Expected a HistoryPageError.');
}

describe('four operations', () => {
  it('answers search, browse, load and page over one entry list', () => {
    const lookup = createHistoryLookup(buildHistoryEntries({ partCount: 4 }));

    const searchPayload = JSON.parse(lookup.search({ query: 'contract' }).content[0]?.text ?? '{}') as {
      references?: Array<Record<string, unknown>>;
    };
    expect(searchPayload.references?.[0]).toMatchObject({ historyId: 'history-turn-1', kind: 'modelTurn' });
    expect(searchPayload.references?.[0]).toHaveProperty('previousHistoryId');
    expect(searchPayload.references?.[0]).toHaveProperty('nextHistoryId');

    const browsePayload = JSON.parse(lookup.browse({ direction: 'forward', count: 2 }).content[0]?.text ?? '{}') as {
      references?: Array<Record<string, unknown>>;
    };
    expect(browsePayload.references?.map((reference) => reference.historyId)).toEqual([
      'history-user-1',
      'history-turn-1',
    ]);

    const loadPayload = JSON.parse(lookup.load(['history-turn-mixed', 'history-user-1']).content[0]?.text ?? '{}') as {
      items?: Array<Record<string, unknown>>;
    };
    expect(loadPayload.items?.map((item) => item.id)).toEqual(['history-turn-mixed', 'history-user-1']);

    const pageReply = lookup.page({ historyId: 'history-user-1', part: '/userMessage/content/0' });
    const header = JSON.parse(pageReply.content[0]?.text ?? '{}') as Record<string, unknown>;
    expect(header).toMatchObject({
      historyId: 'history-user-1',
      part: '/userMessage/content/0',
      format: 'text',
      offset: 0,
      nextOffset: null,
    });
    expect(pageReply.content[1]).toMatchObject({ type: 'text', text: 'She said "hello" and wrote C:\\temp\\notes.txt.' });
  });

  it('never exposes a paging-only turn through load', () => {
    const lookup = createHistoryLookup(buildHistoryEntries({ partCount: 4 }));
    let code: string | undefined;
    try {
      lookup.load(['history-turn-paging']);
    } catch (error) {
      if (error instanceof HistoryNavigatorError) code = error.code;
    }
    expect(code).toBe('UNKNOWN_HISTORY_ID');
  });
});

describe('deferred parts', () => {
  function readAllText(lookup: ReturnType<typeof createHistoryLookup>, historyId: string, part: string): string {
    let offset: number | null = 0;
    const texts: string[] = [];
    while (offset !== null) {
      const reply = lookup.page({ historyId, part, offset });
      const header = JSON.parse(reply.content[0]?.text ?? '{}') as { nextOffset?: number | null };
      for (const block of reply.content.slice(1)) {
        if ('text' in block) texts.push(block.text);
      }
      offset = header.nextOffset ?? null;
    }
    return texts.join('');
  }

  it('reassembles a deferred item from readParts with no gap or duplicate', () => {
    const content = Array.from({ length: 100 }, (_, index) => ({
      type: 'text' as const,
      text: `section ${index} ${'z'.repeat(2_000)}`,
    }));
    const entries: HistoryEntry[] = [{
      id: 'deferred-parts',
      role: 'user',
      sequence: 0,
      timestamp: TIMESTAMP,
      content,
    }];
    const lookup = createHistoryLookup(entries);
    const reply = lookup.load(['deferred-parts']);
    const payload = JSON.parse(reply.content[0]?.text ?? '{}') as {
      items?: Array<{ deferred?: boolean; parts?: Array<{ part: string }>; readParts?: { offset: number } }>;
    };
    const deferred = payload.items?.[0];
    expect(deferred).toMatchObject({ id: 'deferred-parts', deferred: true });
    if (deferred === undefined || deferred.readParts === undefined) throw new Error('Missing deferred item');

    const item = publicHistoryItem(projectHistoryEntries(entries), 'deferred-parts');
    const expected = historyParts(item).map((part) => part.part);
    const inline = deferred.parts ?? [];
    const continued: Array<{ part: string }> = [];
    let offset: number | null = deferred.readParts.offset;

    while (offset !== null) {
      const page = JSON.parse(
        lookup.page({ historyId: 'deferred-parts', mode: 'parts', offset }).content[0]?.text ?? '{}',
      ) as { parts?: Array<{ part: string }>; nextOffset?: number | null };
      continued.push(...(page.parts ?? []));
      offset = page.nextOffset ?? null;
    }

    const all = [...inline, ...continued];
    expect(all.map((part) => part.part)).toEqual(expected);
    expect(new Set(all.map((part) => part.part)).size).toBe(all.length);

    for (const part of all) {
      expect(readAllText(lookup, 'deferred-parts', part.part)).toBe(recoveryPartText(item, part.part).text);
    }
  });
});

describe('pointer', () => {
  it('decodes ~0 and ~1 inside a public part pointer', () => {
    const entry: HistoryEntry = {
      id: 'pointer-entry',
      role: 'assistant',
      sequence: 0,
      timestamp: TIMESTAMP,
      content: [{
        type: 'toolCall',
        id: 'call-1',
        name: 'read_file',
        arguments: { 'a/b': 'slash', 'c~d': 'tilde' },
      }],
    };
    const result: HistoryEntry = {
      id: 'pointer-result',
      role: 'toolResult',
      sequence: 1,
      timestamp: TIMESTAMP,
      toolCallId: 'call-1',
      content: [{ type: 'text', text: 'ok' }],
    };
    const raw = projectHistoryEntries([entry, result])[0];
    if (raw === undefined) throw new Error('Missing fixture');
    const item = recoveryHistoryItem(raw);
    if (item === undefined) throw new Error('Fixture is not public');

    expect(selectHistoryPart(item, '/assistantMessage/content/0/arguments/a~1b')).toBe('slash');
    expect(selectHistoryPart(item, '/assistantMessage/content/0/arguments/c~0d')).toBe('tilde');
  });

  it('rejects an invalid or unreadable pointer', () => {
    const entries = buildHistoryEntries({ partCount: 3 });
    const items = projectHistoryEntries(entries);
    const mixed = publicHistoryItem(items, 'history-turn-mixed');

    expect(pageErrorCode(() => selectHistoryPart(mixed, '/assistantMessage/content/1'))).toBe('UNKNOWN_HISTORY_PART');
    expect(pageErrorCode(() => selectHistoryPart(mixed, 'assistantMessage'))).toBe('INVALID_PAGE_INPUT');
    expect(pageErrorCode(() => selectHistoryPart(mixed, '/assistantMessage/content/0/~2'))).toBe('INVALID_PAGE_INPUT');
  });
});

describe('text page', () => {
  it('rebuilds a 5,000-unit part at 2,000 units per page', () => {
    const original = `${'a'.repeat(1999)}🙂${'b'.repeat(3000)}`;
    const item = projected('long-text', original);
    const pages: HistoryPage[] = [];
    let offset: number | null = 0;

    while (offset !== null) {
      const page = readHistoryTextPage(projectHistoryEntries([userTextEntry('long-text', original)]), {
        historyId: 'long-text',
        part: '/userMessage/content/0',
        mode: 'text',
        offset,
      });
      pages.push(page);
      expect(page.text.length).toBeLessThanOrEqual(2_000);
      expect(page.header.offset).toBe(offset);
      expect(page.text.startsWith('\uDC00')).toBe(false);
      expect(page.text.endsWith('\uD800')).toBe(false);
      if (page.header.nextOffset !== null) {
        expect(page.header.nextOffset).toBe(offset + page.text.length);
      }
      offset = page.header.nextOffset;
    }

    expect(pages.map((page) => page.text).join('')).toBe(original);
    expect(pages.map((page) => page.text.length)).toEqual([1999, 2000, 1002]);
    expect(pages.at(-1)?.header.nextOffset).toBeNull();
    expect(item.id).toBe('long-text');
  });

  it('advances nextOffset by the returned UTF-16 length', () => {
    const original = 'x'.repeat(4_500);
    const page = readHistoryTextPage(projectHistoryEntries([userTextEntry('plain', original)]), {
      historyId: 'plain',
      part: '/userMessage/content/0',
    });
    expect(page.text).toBe('x'.repeat(2_000));
    expect(page.header.nextOffset).toBe(2_000);
  });

  it('rejects an offset that splits a surrogate pair', () => {
    const original = `a🙂b`;
    const code = pageErrorCode(() =>
      readHistoryTextPage(projectHistoryEntries([userTextEntry('split', original)]), {
        historyId: 'split',
        part: '/userMessage/content/0',
        offset: 2,
      }),
    );
    expect(code).toBe('INVALID_PAGE_INPUT');
  });
});

describe('parts page', () => {
  it('walks every part with a resumable offset and no duplicate', () => {
    const items = projectHistoryEntries(buildHistoryEntries({ partCount: 7 }));
    const item = publicHistoryItem(items, 'history-parts');
    const expected = historyParts(item).map((part) => part.part);
    const seen: string[] = [];
    let offset: number | null = 0;

    while (offset !== null) {
      const page = historyPartsPage(item, offset, 3);
      expect(page.offset).toBe(offset);
      expect(page.totalParts).toBe(expected.length);
      seen.push(...page.parts.map((part) => part.part));
      offset = page.nextOffset;
    }

    expect(seen).toEqual(expected);
    expect(new Set(seen).size).toBe(seen.length);
  });

  it('reassembles a text part byte-for-byte through the page cursor', () => {
    const items = projectHistoryEntries(buildHistoryEntries({ partCount: 3 }));
    const item = publicHistoryItem(items, 'history-user-1');
    const part = '/userMessage/content/0';
    const expected = recoveryPartText(item, part);
    const texts: string[] = [];
    let offset: number | null = 0;

    while (offset !== null) {
      const page = readHistoryTextPage(items, { historyId: item.id, part, offset });
      texts.push(...historyPageTexts(page).slice(1));
      offset = page.header.nextOffset;
    }

    expect(texts.join('')).toBe(expected.text);
  });
});
