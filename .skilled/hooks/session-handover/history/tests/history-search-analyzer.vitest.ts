// ───────────────────────────────────────────────────────────────────
// MODULE: History Search Analyzer Tests
// ───────────────────────────────────────────────────────────────────
// A model recalls fragments of what it saw before compaction: part of an
// identifier, a word from a path, one half of a camelCase name. These tests
// pin that fragments find the turn, that the preview shows the fragment, and
// that the extra recall does not cost precision or the reply bound.

import { describe, expect, it } from 'vitest';

import { projectHistoryEntries, type HistoryEntry } from '../hooks/lib/history/history.js';
import { boundedHistoryReply } from '../hooks/lib/history/loads.js';
import { HistoryNavigator, type HistoryReference } from '../hooks/lib/history/navigator.js';

const TIMESTAMP = '2026-11-08T00:00:00.000Z';

function turns(texts: readonly string[]): HistoryEntry[] {
  return texts.map((text, index) => ({
    id: `entry-${index}`,
    role: index % 2 === 0 ? 'user' : 'assistant',
    sequence: index,
    timestamp: TIMESTAMP,
    content: [{ type: 'text', text }],
  }));
}

function navigatorOf(texts: readonly string[]): HistoryNavigator {
  return new HistoryNavigator(projectHistoryEntries(turns(texts)));
}

function sequences(references: readonly HistoryReference[]): number[] {
  return references.map((reference) => reference.sequence);
}

// The shape of the live session that exposed the miss: the code word sits in
// the first turn, and a later turn mentions only its first half.
const MARKER_SESSION = [
  'Remember this code word for later: LIVE-MARKER-dv-2b7e.',
  'OK',
  'Search the history for LIVE-MARKER and report it.',
  'Done.',
];

describe('search: compound identifiers', () => {
  it('finds a compound identifier from any of its fragments', () => {
    const navigator = navigatorOf(MARKER_SESSION);
    for (const query of ['LIVE-MARKER', 'MARKER', 'dv-2b7e', '2b7e', 'live marker']) {
      expect(sequences(navigator.search({ query })), query).toContain(0);
    }
  });

  it('ranks the exact identifier above a turn holding only a fragment', () => {
    const references = navigatorOf(MARKER_SESSION).search({ query: 'LIVE-MARKER-dv-2b7e' });
    expect(sequences(references)[0]).toBe(0);
    expect(sequences(references)).not.toContain(2);
  });

  it('ranks an exact mention of the fragment first', () => {
    expect(sequences(navigatorOf(MARKER_SESSION).search({ query: 'LIVE-MARKER' }))).toEqual([2, 0]);
  });

  it('splits camelCase, snake_case and paths', () => {
    const navigator = navigatorOf([
      'The scorer is bm25Score.',
      'ok',
      'Call normalize_term first.',
      'ok',
      'Edit src/hooks/lib/history/navigator.ts next.',
    ]);
    expect(sequences(navigator.search({ query: 'score' }))).toEqual([0]);
    expect(sequences(navigator.search({ query: 'normalize' }))).toEqual([2]);
    expect(sequences(navigator.search({ query: 'navigator' }))).toEqual([4]);
    expect(sequences(navigator.search({ query: 'history/navigator' }))).toEqual([4]);
  });

  it('does not match a fragment inside an unsplit word', () => {
    const navigator = navigatorOf(['The delivery left at noon.', 'ok', 'A LIVE-MARKER here.']);
    expect(sequences(navigator.search({ query: 'live' }))).toEqual([2]);
  });

  it('requires every part of one query token', () => {
    const navigator = navigatorOf(['Only live is said here.', 'ok', 'The LIVE-MARKER is here.']);
    expect(sequences(navigator.search({ query: 'live-marker' }))).toEqual([2]);
  });
});

describe('search: previews', () => {
  it('shows the identifier when a fragment matched it', () => {
    const filler = 'filler words before the match '.repeat(10);
    const references = navigatorOf([`${filler}LIVE-MARKER-dv-2b7e ends here.`]).search({ query: 'MARKER' });
    expect(references[0]?.preview).toContain('LIVE-MARKER-dv-2b7e');
  });
});

describe('search: Unicode', () => {
  it('matches full-width text against its ASCII form', () => {
    const navigator = navigatorOf(['The code word is ＬＩＶＥ－ＭＡＲＫＥＲ.', 'ok', 'Unrelated turn.']);
    expect(sequences(navigator.search({ query: 'LIVE-MARKER' }))).toEqual([0]);
    expect(sequences(navigatorOf(MARKER_SESSION).search({ query: 'ＬＩＶＥ－ＭＡＲＫＥＲ－ｄｖ－２ｂ７ｅ' }))).toEqual([0]);
  });

  it('matches a Han word only where its characters stand together', () => {
    const navigator = navigatorOf(['Only 検 appears here.', 'ok', 'This turn says 検索履歴.']);
    expect(sequences(navigator.search({ query: '検索' }))).toEqual([2]);
    expect(sequences(navigator.search({ query: '履歴' }))).toEqual([2]);
    expect(sequences(navigator.search({ query: '検' }))).toEqual([0, 2]);
  });
});

describe('search: empty queries', () => {
  it('returns nothing for an empty query without filters', () => {
    expect(navigatorOf(MARKER_SESSION).search({ query: '' })).toEqual([]);
  });

  it('keeps a filter-only search', () => {
    const entries: HistoryEntry[] = [
      { id: 'u', role: 'user', sequence: 0, timestamp: TIMESTAMP, content: [{ type: 'text', text: 'Read it.' }] },
      {
        id: 'a',
        role: 'assistant',
        sequence: 1,
        timestamp: TIMESTAMP,
        content: [{ type: 'toolCall', id: 'call-1', name: 'read_file', arguments: { path: 'docs/a.md' } }],
      },
      {
        id: 'r',
        role: 'toolResult',
        sequence: 2,
        timestamp: TIMESTAMP,
        toolCallId: 'call-1',
        isError: false,
        content: [{ type: 'text', text: 'body' }],
      },
    ];
    const navigator = new HistoryNavigator(projectHistoryEntries(entries));
    expect(navigator.search({ query: '', files: ['docs/a.md'] }).map((reference) => reference.historyId)).toEqual(['a']);
    expect(navigator.search({ query: '---', files: ['docs/a.md'] }).map((reference) => reference.historyId)).toEqual(['a']);
  });
});

describe('search: reference size', () => {
  it('keeps every preview when ten turns each touch sixty files', () => {
    const entries: HistoryEntry[] = [];
    for (let turn = 0; turn < 10; turn += 1) {
      entries.push({
        id: `user-${turn}`,
        role: 'user',
        sequence: turn * 2,
        timestamp: TIMESTAMP,
        content: [{ type: 'text', text: `Edit the batch ${turn}.` }],
      });
      entries.push({
        id: `turn-${turn}`,
        role: 'assistant',
        sequence: turn * 2 + 1,
        timestamp: TIMESTAMP,
        content: [{
          type: 'toolCall',
          id: `call-${turn}`,
          name: 'edit_files',
          arguments: { files: Array.from({ length: 60 }, (_, file) => `src/area-${turn}/module-${file}/index.ts`) },
        }],
      });
      entries.push({
        id: `result-${turn}`,
        role: 'toolResult',
        sequence: turn * 2 + 1,
        timestamp: TIMESTAMP,
        toolCallId: `call-${turn}`,
        isError: false,
        content: [{ type: 'text', text: 'edited' }],
      });
    }
    const navigator = new HistoryNavigator(projectHistoryEntries(entries));
    const references = navigator.search({ query: 'index', limit: 10 });
    expect(references).toHaveLength(10);
    expect(references.every((reference) => reference.files.length <= 12)).toBe(true);
    expect(references.every((reference) => reference.omittedFiles === 48)).toBe(true);

    const reply = boundedHistoryReply(undefined, references);
    expect(JSON.stringify(reply)).not.toContain('detailsDeferred');
  });
});
