// ───────────────────────────────────────────────────────────────────
// MODULE: History Search Browse Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createHistoryLookup } from '../hooks/lib/history/core.js';
import { projectHistoryEntries, type HistoryEntry } from '../hooks/lib/history/history.js';
import {
  HistoryNavigator,
  HistoryNavigatorError,
  type HistoryReference,
} from '../hooks/lib/history/navigator.js';
import { HistoryPageError } from '../hooks/lib/history/pages.js';
import { buildHistoryEntries } from './_support/history-fixtures.js';

function navigator(): HistoryNavigator {
  return new HistoryNavigator(projectHistoryEntries(buildHistoryEntries({ partCount: 4 })));
}

function ids(references: readonly HistoryReference[]): string[] {
  return references.map((reference) => reference.historyId);
}

function navigatorErrorCode(run: () => unknown): string {
  try {
    run();
  } catch (error) {
    if (error instanceof HistoryNavigatorError) return error.code;
    throw error;
  }
  throw new Error('Expected a HistoryNavigatorError.');
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

describe('search', () => {
  it('finds a term and shows it in the preview', () => {
    const references = navigator().search({ query: 'contract' });
    expect(ids(references)).toEqual(['history-turn-1']);
    expect(references[0]?.preview.toLowerCase()).toContain('contract');
  });

  it('matches files, tools and failed filters', () => {
    const byFile = navigator().search({ query: 'the', files: ['docs/design.md'] });
    expect(ids(byFile)).toContain('history-turn-1');
    expect(ids(byFile)).not.toContain('history-user-1');

    const byTool = navigator().search({ query: 'docs', tools: ['read_file'] });
    expect(ids(byTool).sort()).toEqual(['history-turn-1', 'history-turn-mixed']);

    const failed = navigator().search({ query: 'read', failed: true });
    expect(ids(failed)).toEqual(['history-turn-mixed']);

    const succeeded = navigator().search({ query: 'contract', failed: false });
    expect(ids(succeeded)).toEqual(['history-turn-1']);
  });

  it('honours the result limit', () => {
    const references = navigator().search({ query: 'docs', limit: 1 });
    expect(references).toHaveLength(1);
    expect(['history-turn-1', 'history-turn-mixed']).toContain(references[0]?.historyId);
  });

  it('returns nothing for an empty corpus', () => {
    expect(new HistoryNavigator([]).search({ query: 'anything' })).toEqual([]);
  });
});

describe('browse', () => {
  it('walks backward and forward from an anchor with previous and next ids', () => {
    const instance = navigator();
    expect(ids(instance.browse({ direction: 'forward', count: 5 }))).toEqual([
      'history-user-1',
      'history-turn-1',
      'history-user-2',
      'history-turn-mixed',
      'history-parts',
    ]);
    expect(ids(instance.browse({ direction: 'backward', count: 2 }))).toEqual(['history-parts', 'history-turn-mixed']);
    expect(ids(instance.browse({ direction: 'forward', historyId: 'history-turn-1', count: 2 }))).toEqual([
      'history-user-2',
      'history-turn-mixed',
    ]);
    expect(ids(instance.browse({ direction: 'backward', historyId: 'history-turn-1', count: 2 }))).toEqual([
      'history-user-1',
    ]);

    const around = instance.browse({ direction: 'around', historyId: 'history-user-2', count: 3 });
    expect(ids(around)).toEqual(['history-turn-1', 'history-user-2', 'history-turn-mixed']);
    expect(around[1]?.previousHistoryId).toBe('history-turn-1');
    expect(around[1]?.nextHistoryId).toBe('history-turn-mixed');
  });

  it('honours stride and returns nothing for an empty corpus without an anchor', () => {
    expect(ids(navigator().browse({ direction: 'forward', count: 3, stride: 2 }))).toEqual([
      'history-user-1',
      'history-user-2',
      'history-parts',
    ]);
    expect(new HistoryNavigator([]).browse({ direction: 'backward' })).toEqual([]);
  });
});

describe('load', () => {
  it('returns items in requested order', () => {
    const loaded = navigator().load(['history-turn-1', 'history-user-1']);
    expect(loaded.map((item) => item.id)).toEqual(['history-turn-1', 'history-user-1']);
  });

  it('rejects a paging-only turn and a tool result as unknown ids', () => {
    expect(navigatorErrorCode(() => navigator().load(['history-turn-paging']))).toBe('UNKNOWN_HISTORY_ID');
    expect(navigatorErrorCode(() => navigator().load(['history-result-1']))).toBe('UNKNOWN_HISTORY_ID');
  });
});

describe('invalid input bounds', () => {
  it('rejects an oversized query and oversized filter arrays', () => {
    expect(navigatorErrorCode(() => navigator().search({ query: 'q'.repeat(201) }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().search({ query: 'q', files: Array(11).fill('f') }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().search({ query: 'q', tools: Array(11).fill('t') }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().search({ query: 'q', files: ['f'.repeat(201)] }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
  });

  it('rejects search limits outside 1-10 and a non-boolean failed flag', () => {
    expect(navigatorErrorCode(() => navigator().search({ query: 'q', limit: 0 }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().search({ query: 'q', limit: 11 }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().search({ query: 'q', failed: 'yes' as unknown as boolean }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
  });

  it('rejects browse bounds and unknown anchors with distinct codes', () => {
    expect(navigatorErrorCode(() => navigator().browse({ direction: 'sideways' as unknown as 'forward' }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().browse({ direction: 'forward', count: 0 }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().browse({ direction: 'forward', count: 11 }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().browse({ direction: 'forward', stride: 0 }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().browse({ direction: 'forward', sequence: -1 }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().browse({ direction: 'forward', sequence: 1_000_001 }))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().browse({ direction: 'forward', historyId: 'missing' }))).toBe(
      'UNKNOWN_HISTORY_ANCHOR',
    );
    expect(navigatorErrorCode(() =>
      navigator().browse({ direction: 'forward', historyId: 'history-user-1', sequence: 0 }))).toBe(
      'UNKNOWN_HISTORY_ANCHOR',
    );
  });

  it('rejects load cardinality and ids outside the bound', () => {
    expect(navigatorErrorCode(() => navigator().load([]))).toBe('INVALID_HISTORY_NAVIGATOR_INPUT');
    expect(navigatorErrorCode(() => navigator().load(['a', 'b', 'c', 'd']))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
    expect(navigatorErrorCode(() => navigator().load(['x'.repeat(129)]))).toBe(
      'INVALID_HISTORY_NAVIGATOR_INPUT',
    );
  });
});

describe('invalid page bounds', () => {
  function lookup() {
    return createHistoryLookup(buildHistoryEntries({ partCount: 4 }));
  }

  it('rejects oversized handles and invalid offsets', () => {
    expect(pageErrorCode(() => lookup().page({ historyId: 'h'.repeat(129) }))).toBe('INVALID_PAGE_INPUT');
    expect(pageErrorCode(() =>
      lookup().page({ historyId: 'history-user-1', part: `/${'p'.repeat(512)}` }))).toBe('INVALID_PAGE_INPUT');
    expect(pageErrorCode(() =>
      lookup().page({ historyId: 'history-user-1', part: '/userMessage/content/0', offset: -1 }))).toBe(
      'INVALID_PAGE_INPUT',
    );
    expect(pageErrorCode(() =>
      lookup().page({ historyId: 'history-user-1', part: '/userMessage/content/0', limit: 0 }))).toBe(
      'INVALID_PAGE_INPUT',
    );
  });

  it('rejects unknown ids, unknown parts and mode selector misuse', () => {
    expect(pageErrorCode(() => lookup().page({ historyId: 'missing', part: '/userMessage/content/0' }))).toBe(
      'UNKNOWN_HISTORY_ID',
    );
    expect(pageErrorCode(() =>
      lookup().page({ historyId: 'history-user-1', part: '/userMessage/content/9' }))).toBe('UNKNOWN_HISTORY_PART');
    expect(pageErrorCode(() => lookup().page({ historyId: 'history-user-1' }))).toBe('INVALID_PAGE_INPUT');
    expect(pageErrorCode(() =>
      lookup().page({ historyId: 'history-user-1', mode: 'parts', part: '/userMessage/content/0' }))).toBe(
      'INVALID_PAGE_INPUT',
    );
    expect(pageErrorCode(() =>
      lookup().page({ historyId: 'history-user-1', mode: 'image', part: '/userMessage/content/0', offset: 0 }))).toBe(
      'INVALID_PAGE_INPUT',
    );
    expect(pageErrorCode(() =>
      lookup().page({ historyId: 'history-user-1', mode: 'image', part: '/userMessage/content/0' }))).toBe(
      'INVALID_PAGE_INPUT',
    );
  });
});
