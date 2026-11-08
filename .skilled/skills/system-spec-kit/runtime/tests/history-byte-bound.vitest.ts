// ───────────────────────────────────────────────────────────────────
// MODULE: History Byte Bound Tests
// ───────────────────────────────────────────────────────────────────

import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';

import {
  HistoryResponseError,
  MAXIMUM_INLINE_PART_BYTES,
  MAXIMUM_RECOVERY_REPLY_BYTES,
  recoveryResponse,
  recoveryTextReply,
  type HistoryTextReply,
} from '../hooks/lib/history/response.js';
import { projectHistoryEntries, type HistoryEntry } from '../hooks/lib/history/history.js';
import { recoveryHistoryItem, type RecoveryHistoryItem } from '../hooks/lib/history/projection.js';
import { boundedHistoryReply } from '../hooks/lib/history/loads.js';
import { createHistoryLookup, type HistoryLookup } from '../hooks/lib/history/core.js';

function replyBytes(reply: HistoryTextReply): number {
  return Buffer.byteLength(JSON.stringify(reply), 'utf8');
}

function textOfSize(characters: number): string {
  return 'a'.repeat(characters);
}

const TIMESTAMP = '2026-11-07T12:00:00.000Z';

function userEntry(id: string, sequence: number, text: string): HistoryEntry {
  return { id, role: 'user', sequence, timestamp: TIMESTAMP, content: [{ type: 'text', text }] };
}

function publicItems(entries: readonly HistoryEntry[]): RecoveryHistoryItem[] {
  return projectHistoryEntries(entries)
    .map(recoveryHistoryItem)
    .filter((item): item is RecoveryHistoryItem => item !== undefined);
}

function payloadOf(reply: HistoryTextReply): {
  references?: Array<Record<string, unknown>>;
  items?: Array<Record<string, unknown>>;
} {
  return JSON.parse(reply.content[0]?.text ?? '{}') as {
    references?: Array<Record<string, unknown>>;
    items?: Array<Record<string, unknown>>;
  };
}

function readAllText(lookup: HistoryLookup, historyId: string, part: string): string {
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

describe('complete reply cap', () => {
  it('keeps escaped text inside the cap and readable through pages', () => {
    const text = '\\"'.repeat(20_000);
    const lookup = createHistoryLookup([userEntry('escaped', 0, text)]);
    const reply = lookup.load(['escaped']);
    const payload = payloadOf(reply);
    const item = payload.items?.[0];

    expect(Buffer.byteLength(JSON.stringify(reply), 'utf8')).toBeLessThanOrEqual(MAXIMUM_RECOVERY_REPLY_BYTES);
    expect(item).toMatchObject({ id: 'escaped', deferred: true });
    expect(readAllText(lookup, 'escaped', '/userMessage/content/0')).toBe(text);
  });

  it('keeps four-byte characters inside the cap and pages them whole', () => {
    const text = '🙂'.repeat(6_000);
    const lookup = createHistoryLookup([userEntry('unicode', 0, text)]);
    const reply = lookup.load(['unicode']);

    expect(Buffer.byteLength(JSON.stringify(reply), 'utf8')).toBeLessThanOrEqual(MAXIMUM_RECOVERY_REPLY_BYTES);
    expect(readAllText(lookup, 'unicode', '/userMessage/content/0')).toBe(text);
  });

  it('defers a turn whose tool arguments alone exceed the cap', () => {
    const entries: HistoryEntry[] = [
      {
        id: 'large-arguments',
        role: 'assistant',
        sequence: 0,
        timestamp: TIMESTAMP,
        content: [{
          type: 'toolCall',
          id: 'call-large',
          name: 'write_file',
          arguments: { path: 'large.txt', body: 'A'.repeat(30_000) },
        }],
      },
      {
        id: 'large-arguments-result',
        role: 'toolResult',
        sequence: 1,
        timestamp: TIMESTAMP,
        toolCallId: 'call-large',
        content: [{ type: 'text', text: 'written' }],
      },
    ];
    const lookup = createHistoryLookup(entries);
    const reply = lookup.load(['large-arguments']);
    const payload = payloadOf(reply);

    expect(Buffer.byteLength(JSON.stringify(reply), 'utf8')).toBeLessThanOrEqual(MAXIMUM_RECOVERY_REPLY_BYTES);
    expect(payload.items?.[0]).toMatchObject({ id: 'large-arguments', deferred: true });
    const argumentsText = readAllText(lookup, 'large-arguments', '/assistantMessage/content/0/arguments');
    expect(argumentsText).toContain('A'.repeat(30_000));
  });

  it('stays under the cap with three requested items', () => {
    const entries = [
      userEntry('first', 0, 'F'.repeat(6_000)),
      userEntry('second', 1, 'S'.repeat(6_000)),
      userEntry('third', 2, 'T'.repeat(6_000)),
    ];
    const reply = createHistoryLookup(entries).load(['first', 'second', 'third']);
    const payload = payloadOf(reply);

    expect(Buffer.byteLength(JSON.stringify(reply), 'utf8')).toBeLessThanOrEqual(MAXIMUM_RECOVERY_REPLY_BYTES);
    expect(payload.items?.map((item) => item.id)).toEqual(['first', 'second', 'third']);
    expect(payload.items?.some((item) => item.deferred === true)).toBe(true);
  });

  it('bounds a 300-part item and every inline description', () => {
    const content = Array.from({ length: 300 }, (_, index) => ({
      type: 'text' as const,
      text: `part ${index} ${'x'.repeat(200)}`,
    }));
    const entry: HistoryEntry = { id: 'many-parts', role: 'user', sequence: 0, timestamp: TIMESTAMP, content };
    const reply = createHistoryLookup([entry]).load(['many-parts']);
    const payload = payloadOf(reply);
    const item = payload.items?.[0];
    const parts = (item?.parts ?? []) as Array<Record<string, unknown>>;

    expect(Buffer.byteLength(JSON.stringify(reply), 'utf8')).toBeLessThanOrEqual(MAXIMUM_RECOVERY_REPLY_BYTES);
    expect(item).toMatchObject({ id: 'many-parts', deferred: true });
    expect(item?.totalParts).toBe(301);
    expect(parts.length).toBeGreaterThan(0);
    expect(parts.length).toBeLessThan(301);
    for (const part of parts) {
      expect(Buffer.byteLength(JSON.stringify(part), 'utf8')).toBeLessThanOrEqual(MAXIMUM_INLINE_PART_BYTES);
    }
    expect(item?.nextPartOffset).toBe(parts.length);
    expect(item?.readParts).toMatchObject({ historyId: 'many-parts', mode: 'parts', offset: parts.length });
  });
});

describe('smallest-first', () => {
  it('loads later small items whole and defers the large first item', () => {
    const entries = [
      userEntry('large', 0, 'L'.repeat(24_000)),
      userEntry('small', 1, 'small body'),
      userEntry('medium', 2, 'M'.repeat(200)),
    ];
    const reply = boundedHistoryReply(publicItems(entries));
    const payload = payloadOf(reply);
    const items = payload.items ?? [];

    expect(items.map((item) => item.id)).toEqual(['large', 'small', 'medium']);
    expect(items[1]).toMatchObject({ id: 'small', kind: 'user' });
    expect(items[2]).toMatchObject({ id: 'medium', kind: 'user' });
    expect(items[1]?.deferred).toBeUndefined();
    expect(items[2]?.deferred).toBeUndefined();
    expect(items[0]).toMatchObject({
      id: 'large',
      kind: 'user',
      deferred: true,
      readParts: { historyId: 'large', mode: 'parts', offset: 0 },
    });
    expect(items[0]?.nextPartOffset).toBeNull();

    const parts = (items[0]?.parts ?? []) as Array<Record<string, unknown>>;
    expect(parts.length).toBeGreaterThan(0);
    for (const part of parts) {
      expect(Buffer.byteLength(JSON.stringify(part), 'utf8')).toBeLessThanOrEqual(MAXIMUM_INLINE_PART_BYTES);
    }
    expect(Buffer.byteLength(JSON.stringify(reply), 'utf8')).toBeLessThanOrEqual(MAXIMUM_RECOVERY_REPLY_BYTES);
  });

  it('reserves references by collapsing oversized metadata first', () => {
    const references = Array.from({ length: 40 }, (_, index) => ({
      historyId: `history-${index}`,
      sequence: index,
      kind: 'modelTurn' as const,
      timestamp: TIMESTAMP,
      preview: 'P'.repeat(160),
      tools: Array.from({ length: 10 }, (_, toolIndex) => `tool_${toolIndex}`),
      files: Array.from({ length: 10 }, (_, fileIndex) => `docs/file-${fileIndex}.md`),
      failed: false,
      previousHistoryId: index === 0 ? null : `history-${index - 1}`,
      nextHistoryId: index === 39 ? null : `history-${index + 1}`,
    }));
    const reply = boundedHistoryReply(undefined, references);
    const payload = payloadOf(reply);
    const compact = payload.references ?? [];

    expect(compact).toHaveLength(40);
    expect(compact.some((reference) => reference.detailsDeferred === true)).toBe(true);
    expect(compact.map((reference) => reference.historyId)).toEqual(references.map((reference) => reference.historyId));
    expect(Buffer.byteLength(JSON.stringify(reply), 'utf8')).toBeLessThanOrEqual(MAXIMUM_RECOVERY_REPLY_BYTES);
  });
});

describe('serialized cap', () => {
  it('emits no unloadedHistoryIds field when a caller passes both items and references', () => {
    const items = publicItems([userEntry('first', 0, 'first body')]);
    const references = [
      {
        historyId: 'first',
        sequence: 0,
        kind: 'user' as const,
        timestamp: TIMESTAMP,
        preview: 'first body',
        tools: [],
        files: [],
        failed: false,
        previousHistoryId: null,
        nextHistoryId: 'second',
      },
      {
        historyId: 'second',
        sequence: 1,
        kind: 'user' as const,
        timestamp: TIMESTAMP,
        preview: 'second body',
        tools: [],
        files: [],
        failed: false,
        previousHistoryId: 'first',
        nextHistoryId: null,
      },
    ];

    const reply = boundedHistoryReply(items, references);
    const payload = payloadOf(reply);

    expect(payload.items?.map((item) => item.id)).toEqual(['first']);
    expect(payload.references?.map((reference) => reference.historyId)).toEqual(['first', 'second']);
    expect(payload).not.toHaveProperty('unloadedHistoryIds');
  });

  it('publishes the 16 KiB reply and 4 KiB inline part constants', () => {
    expect(MAXIMUM_RECOVERY_REPLY_BYTES).toBe(16_384);
    expect(MAXIMUM_INLINE_PART_BYTES).toBe(4_096);
  });

  it('accepts a reply that serializes to exactly 16,384 bytes', () => {
    const overhead = replyBytes(recoveryTextReply(['']));
    const text = textOfSize(MAXIMUM_RECOVERY_REPLY_BYTES - overhead);
    expect(replyBytes(recoveryTextReply([text]))).toBe(MAXIMUM_RECOVERY_REPLY_BYTES);
  });

  it('throws instead of truncating a reply that serializes to 16,385 bytes', () => {
    const overhead = replyBytes(recoveryTextReply(['']));
    let caught: unknown;
    try {
      recoveryTextReply([textOfSize(MAXIMUM_RECOVERY_REPLY_BYTES - overhead + 1)]);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(HistoryResponseError);
    expect(caught instanceof HistoryResponseError ? caught.code : undefined).toBe('HISTORY_REPLY_TOO_LARGE');
  });

  it('measures the complete serialized payload, not the payload alone', () => {
    const payload = { value: textOfSize(MAXIMUM_RECOVERY_REPLY_BYTES) };
    expect(() => recoveryResponse(payload)).toThrow(HistoryResponseError);
  });
});
