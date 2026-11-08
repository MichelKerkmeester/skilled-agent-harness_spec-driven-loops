// ───────────────────────────────────────────────────────────────────
// MODULE: History Projection Tests
// ───────────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { createHistoryLookup } from '../hooks/lib/history/core.js';
import {
  HistoryProjectionError,
  hasPagingToolCall,
  projectHistoryEntries,
  type HistoryEntry,
} from '../hooks/lib/history/history.js';
import { HistoryNavigatorError } from '../hooks/lib/history/navigator.js';
import { HistoryPageError, type HistoryPageInput } from '../hooks/lib/history/pages.js';
import {
  isRecoverableHistoryItem,
  publicAssistantBlock,
  recoveryHistoryItem,
  type RecoveryModelTurnHistoryItem,
} from '../hooks/lib/history/projection.js';
import { HistoryResponseError } from '../hooks/lib/history/response.js';
import { buildHistoryEntries, ONE_PIXEL_PNG } from './_support/history-fixtures.js';

const TIMESTAMP = '2026-11-07T12:00:00.000Z';

function entry(overrides: Partial<HistoryEntry> & Pick<HistoryEntry, 'id' | 'role'>): HistoryEntry {
  return {
    sequence: 0,
    timestamp: TIMESTAMP,
    content: [{ type: 'text', text: overrides.id }],
    ...overrides,
  };
}

function errorCode(run: () => unknown): string {
  try {
    run();
  } catch (error) {
    if (error instanceof HistoryProjectionError) return error.code;
    throw error;
  }
  throw new Error('Expected a HistoryProjectionError.');
}

describe('tool pairing', () => {
  it('rejects an orphan tool result', () => {
    const code = errorCode(() =>
      projectHistoryEntries([entry({ id: 'orphan', role: 'toolResult', toolCallId: 'call-1' })]),
    );
    expect(code).toBe('ORPHAN_TOOL_RESULT');
  });

  it('rejects duplicate tool calls in one assistant turn', () => {
    const code = errorCode(() =>
      projectHistoryEntries([
        entry({
          id: 'duplicate-call',
          role: 'assistant',
          content: [
            { type: 'toolCall', id: 'call-1', name: 'read_file', arguments: {} },
            { type: 'toolCall', id: 'call-1', name: 'read_file', arguments: {} },
          ],
        }),
      ]),
    );
    expect(code).toBe('DUPLICATE_TOOL_CALL');
  });

  it('rejects a duplicate result for one tool call', () => {
    const code = errorCode(() =>
      projectHistoryEntries([
        entry({
          id: 'duplicate-result',
          role: 'assistant',
          sequence: 0,
          content: [{ type: 'toolCall', id: 'call-1', name: 'read_file', arguments: {} }],
        }),
        entry({ id: 'result-1', role: 'toolResult', sequence: 1, toolCallId: 'call-1' }),
        entry({ id: 'result-2', role: 'toolResult', sequence: 2, toolCallId: 'call-1' }),
      ]),
    );
    expect(code).toBe('DUPLICATE_TOOL_RESULT');
  });

  it('rejects a result whose call id does not match', () => {
    const code = errorCode(() =>
      projectHistoryEntries([
        entry({
          id: 'mismatch',
          role: 'assistant',
          sequence: 0,
          content: [{ type: 'toolCall', id: 'call-1', name: 'read_file', arguments: {} }],
        }),
        entry({ id: 'result-1', role: 'toolResult', sequence: 1, toolCallId: 'call-2' }),
      ]),
    );
    expect(code).toBe('MISMATCHED_TOOL_RESULT');
  });

  it('rejects incomplete results in the middle of a live branch', () => {
    const code = errorCode(() =>
      projectHistoryEntries([
        entry({
          id: 'incomplete',
          role: 'assistant',
          sequence: 0,
          content: [
            { type: 'toolCall', id: 'call-1', name: 'read_file', arguments: {} },
            { type: 'toolCall', id: 'call-2', name: 'read_file', arguments: {} },
          ],
        }),
        entry({ id: 'result-1', role: 'toolResult', sequence: 1, toolCallId: 'call-1' }),
        entry({ id: 'after', role: 'user', sequence: 2 }),
      ]),
    );
    expect(code).toBe('INCOMPLETE_TOOL_RESULTS');
  });

  it('keeps a saved incomplete exchange only under the restore option', () => {
    const entries = [
      entry({
        id: 'restored',
        role: 'assistant',
        sequence: 0,
        content: [{ type: 'toolCall', id: 'call-1', name: 'read_file', arguments: {} }],
      }),
      entry({ id: 'after', role: 'user', sequence: 1 }),
    ];

    expect(() => projectHistoryEntries(entries)).toThrow(HistoryProjectionError);
    const restored = projectHistoryEntries(entries, { recoverIncomplete: true });
    expect(restored).toHaveLength(2);
    expect(restored[0]).toMatchObject({ id: 'restored', kind: 'modelTurn', interruptedByRestore: true });
  });
});

describe('public projection', () => {
  function modelTurn(id: string): RecoveryModelTurnHistoryItem {
    const item = projectHistoryEntries(buildHistoryEntries({ partCount: 2 })).find((candidate) => candidate.id === id);
    if (item === undefined || item.kind !== 'modelTurn') throw new Error(`Missing model turn ${id}`);
    const projected = recoveryHistoryItem(item);
    if (projected === undefined || projected.kind !== 'modelTurn') {
      throw new Error(`Model turn ${id} is not recoverable`);
    }
    return projected;
  }

  it('keeps text and non-paging calls while dropping thinking and signatures', () => {
    const turn = modelTurn('history-turn-mixed');
    expect(turn.assistantMessage.content[0]).toEqual({ type: 'text', text: 'Public answer after paging.' });
    expect(turn.assistantMessage.content[1]).toBeNull();
    expect(turn.assistantMessage.content[2]).toEqual({
      type: 'toolCall',
      id: 'call-read-2',
      name: 'read_file',
      arguments: { path: 'docs/answer.md' },
    });

    const serialized = JSON.stringify(turn);
    expect(serialized).not.toContain('private-mixed-signature');
    expect(serialized).not.toContain('search_history');
    expect(turn.metadata.tools).toEqual(['read_file']);
    expect(turn.metadata.files).toEqual(['docs/answer.md']);
    expect(turn.metadata.failed).toBe(true);
  });

  it('drops paging-only turns entirely', () => {
    const item = projectHistoryEntries(buildHistoryEntries({ partCount: 2 }))
      .find((candidate) => candidate.id === 'history-turn-paging');
    expect(item).toBeDefined();
    expect(item === undefined ? false : isRecoverableHistoryItem(item)).toBe(false);
    expect(item === undefined ? undefined : recoveryHistoryItem(item)).toBeUndefined();
  });

  it('drops a turn whose only content is private', () => {
    const [thinkingOnly] = projectHistoryEntries([
      entry({
        id: 'thinking-only',
        role: 'assistant',
        content: [{ type: 'thinking', thinking: 'private reasoning' }],
      }),
    ]);
    const [imageOnly] = projectHistoryEntries([
      entry({
        id: 'image-only',
        role: 'assistant',
        content: [{ type: 'image', data: ONE_PIXEL_PNG, mimeType: 'image/png' }],
      }),
    ]);

    for (const item of [thinkingOnly, imageOnly]) {
      expect(item).toBeDefined();
      if (item === undefined) continue;
      expect(isRecoverableHistoryItem(item)).toBe(false);
      expect(recoveryHistoryItem(item)).toBeUndefined();
    }
  });

  it('keeps the ordinary call from a mixed paging turn', () => {
    const [item] = projectHistoryEntries([
      entry({
        id: 'mixed-paging-turn',
        role: 'assistant',
        content: [
          { type: 'toolCall', id: 'call-search', name: 'search_history', arguments: { query: 'contract' } },
          { type: 'toolCall', id: 'call-read', name: 'read_file', arguments: { path: 'docs/answer.md' } },
        ],
      }),
      entry({ id: 'mixed-search-result', role: 'toolResult', sequence: 1, toolCallId: 'call-search' }),
      entry({ id: 'mixed-read-result', role: 'toolResult', sequence: 2, toolCallId: 'call-read' }),
    ]);

    if (item === undefined || item.kind !== 'modelTurn') throw new Error('Missing mixed model turn');
    expect(hasPagingToolCall(item)).toBe(true);

    const projected = recoveryHistoryItem(item);
    if (projected === undefined || projected.kind !== 'modelTurn') throw new Error('Mixed turn is not recoverable');
    expect(projected.assistantMessage.content).toEqual([
      null,
      { type: 'toolCall', id: 'call-read', name: 'read_file', arguments: { path: 'docs/answer.md' } },
    ]);
    expect(projected.toolResults.map((result) => result.toolCallId)).toEqual(['call-read']);
    expect(projected.metadata.tools).toEqual(['read_file']);
  });

  it('treats a shell call that runs the lookup CLI as paging', () => {
    const lookup = '(cd "$(git rev-parse --show-toplevel)" && node .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js --session s --handle h browse)';
    const [item] = projectHistoryEntries([
      entry({
        id: 'shell-paging-turn',
        role: 'assistant',
        content: [
          { type: 'toolCall', id: 'call-lookup', name: 'shell', arguments: { command: lookup } },
          { type: 'toolCall', id: 'call-ls', name: 'shell', arguments: { command: 'ls docs' } },
        ],
      }),
      entry({ id: 'shell-lookup-result', role: 'toolResult', sequence: 1, toolCallId: 'call-lookup' }),
      entry({ id: 'shell-ls-result', role: 'toolResult', sequence: 2, toolCallId: 'call-ls' }),
    ]);

    if (item === undefined || item.kind !== 'modelTurn') throw new Error('Missing shell model turn');
    expect(hasPagingToolCall(item)).toBe(true);
    const projected = recoveryHistoryItem(item);
    if (projected === undefined || projected.kind !== 'modelTurn') throw new Error('Shell turn is not recoverable');
    expect(projected.assistantMessage.content[0]).toBeNull();
    expect(projected.toolResults.map((result) => result.toolCallId)).toEqual(['call-ls']);
  });

  it('keeps null slots so contentIndex still addresses the projection', () => {
    const turn = modelTurn('history-turn-mixed');
    expect(turn.assistantMessage.content).toHaveLength(3);
    expect(turn.assistantMessage.content[1]).toBeNull();
  });

  it('keeps an image in a tool result but removes it from assistant content', () => {
    const turn = modelTurn('history-turn-1');
    expect(turn.assistantMessage.content.some((block) => block?.type === 'image')).toBe(false);
    expect(turn.toolResults[0]?.content.map((block) => block.type)).toEqual(['text', 'image']);
  });

  it('returns no public block for thinking, images or paging calls', () => {
    expect(publicAssistantBlock({ type: 'thinking', thinking: 'private' })).toBeNull();
    expect(publicAssistantBlock({ type: 'image', data: 'AA==', mimeType: 'image/png' })).toBeNull();
    expect(publicAssistantBlock({
      type: 'toolCall',
      id: 'call-1',
      name: 'search_history',
      arguments: {},
    })).toBeNull();
    expect(publicAssistantBlock({
      type: 'toolCall',
      id: 'call-2',
      name: 'read_file',
      arguments: {},
      thoughtSignature: 'private',
    })).toEqual({ type: 'toolCall', id: 'call-2', name: 'read_file', arguments: {} });
  });
});

describe('route projection', () => {
  const privateMarkers = [
    'private-thinking',
    'private-thinking-signature',
    'private-provider-signature',
    'private-mixed-signature',
    'private-paging-thinking',
    'search_history',
  ];

  function lookup() {
    return createHistoryLookup(buildHistoryEntries({ partCount: 4 }));
  }

  function expectPublic(reply: unknown): void {
    const serialized = JSON.stringify(reply);
    for (const marker of privateMarkers) {
      expect(serialized).not.toContain(marker);
    }
  }

  it('keeps search and browse references public', () => {
    const instance = lookup();
    const search = instance.search({ query: 'the' });
    const browse = instance.browse({ direction: 'backward', count: 10 });

    expectPublic(search);
    expectPublic(browse);
    expect(JSON.stringify(search)).not.toContain('history-turn-paging');
    expect(JSON.stringify(browse)).not.toContain('history-turn-paging');
  });

  it('keeps loaded items public and preserves null slots', () => {
    const instance = lookup();
    const reply = instance.load(['history-turn-mixed', 'history-turn-1']);
    const payload = JSON.parse(reply.content[0]?.text ?? '{}') as {
      items?: Array<{
        id: string;
        assistantMessage?: { content?: unknown[] };
        toolResults?: Array<{ toolCallId: string }>;
        metadata?: { tools?: string[] };
      }>;
    };
    const mixed = payload.items?.[0];
    const turn = payload.items?.[1];

    expectPublic(reply);
    expect(mixed?.assistantMessage?.content?.[1]).toBeNull();
    expect(mixed?.toolResults?.map((result) => result.toolCallId)).toEqual(['call-read-2']);
    expect(mixed?.metadata?.tools).toEqual(['read_file']);
    expect(turn).toMatchObject({ id: 'history-turn-1', deferred: true });
  });

  it('never loads a paging-only turn', () => {
    let code: string | undefined;
    try {
      lookup().load(['history-turn-paging']);
    } catch (error) {
      if (error instanceof HistoryNavigatorError) code = error.code;
    }
    expect(code).toBe('UNKNOWN_HISTORY_ID');
  });

  it('keeps page text public and rejects a private part', () => {
    const instance = lookup();
    const publicPage = instance.page({ historyId: 'history-turn-mixed', part: '/assistantMessage/content/0' });
    expectPublic(publicPage);
    expect(publicPage.content[1]).toMatchObject({ type: 'text', text: 'Public answer after paging.' });

    let code: string | undefined;
    try {
      instance.page({ historyId: 'history-turn-1', part: '/assistantMessage/content/0' });
    } catch (error) {
      if (error instanceof HistoryPageError) code = error.code;
    }
    expect(code).toBe('UNKNOWN_HISTORY_PART');
  });

  it('rejects a page handle with a missing or non-string input as a page error', () => {
    const instance = lookup();
    const inputs = [
      {},
      { part: '/userMessage/content/0' },
      { historyId: null, part: '/x' },
      { historyId: 'history-user-1', part: 42 },
    ];

    for (const input of inputs) {
      let code: string | undefined;
      try {
        instance.page(input as unknown as HistoryPageInput);
      } catch (error) {
        if (error instanceof HistoryPageError) code = error.code;
      }
      expect(code).toBe('INVALID_PAGE_INPUT');
    }
  });

  it('shows image metadata in text mode and one native attachment in image mode', () => {
    const instance = lookup();
    const part = '/toolResults/0/content/1';
    const textReply = instance.page({ historyId: 'history-turn-1', mode: 'text', part });
    const metadata = JSON.parse(textReply.content[1]?.text ?? '{}') as Record<string, unknown>;

    expect(metadata).toMatchObject({
      type: 'image',
      mimeType: 'image/png',
      read: { historyId: 'history-turn-1', part, mode: 'image' },
    });
    expect(JSON.stringify(textReply)).not.toContain(ONE_PIXEL_PNG);

    const imageReply = instance.page({ historyId: 'history-turn-1', mode: 'image', part });
    const attachments = imageReply.content.filter((block) => block.type === 'image');
    expect(attachments).toEqual([{ type: 'image', data: ONE_PIXEL_PNG, mimeType: 'image/png' }]);
    expect(JSON.stringify(imageReply.content[0])).not.toContain(ONE_PIXEL_PNG);
  });

  it('refuses an image page that would exceed the reply cap', () => {
    const entries = buildHistoryEntries({ partCount: 4 }).map((entry) => (entry.id === 'history-result-1'
      ? { ...entry, content: [{ type: 'text', text: 'public contract body' }, { type: 'image', data: 'A'.repeat(200_000), mimeType: 'image/png' }] }
      : entry)) as HistoryEntry[];
    let code: string | undefined;
    try {
      createHistoryLookup(entries).page({ historyId: 'history-turn-1', mode: 'image', part: '/toolResults/0/content/1' });
    } catch (error) {
      if (error instanceof HistoryResponseError) code = error.code;
    }
    expect(code).toBe('HISTORY_REPLY_TOO_LARGE');
  });
});

describe('history corpus', () => {
  it('projects the complete fixture corpus without mutating entries', () => {
    const entries = buildHistoryEntries({ partCount: 3 });
    const snapshot = JSON.stringify(entries);
    const items = projectHistoryEntries(entries);

    expect(JSON.stringify(entries)).toBe(snapshot);
    expect(items.map((item) => item.id)).toEqual([
      'history-user-1',
      'history-turn-1',
      'history-user-2',
      'history-turn-paging',
      'history-turn-mixed',
      'history-parts',
    ]);
  });
});
