// ───────────────────────────────────────────────────────────────────
// MODULE: History Test Fixtures
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import {
  HISTORY_LOCATOR_KINDS,
  HISTORY_LOCATOR_VERSION,
  type HistoryLocator,
} from '../../../../../skills/system-spec-kit/runtime/hooks/claude/hook-state.js';
import type { HistoryContentBlock, HistoryEntry } from '../../lib/history.js';
import { historyHandle } from '../../lib/locator-digest.js';
import { placeLookup } from '../../lib/lookup-offer.js';

const ENTRY_PATH = '.skilled/hooks/session-handover/bin/history-lookup.mjs';
const CORE_PATH = '.skilled/hooks/session-handover/history/dist/cli.js';

/**
 * A temporary folder that looks like a checkout root. The lookup offer is
 * printed only for a workspace with a `.git` entry, the runnable entry and the
 * compiled core, so an offer fixture needs all three. Both files are
 * placeholders, because tests call the CLI in process. The caller removes the
 * folder when its suite ends.
 */
export function checkoutRoot(): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'history-checkout-')));
  mkdirSync(join(root, '.git'));
  for (const relativePath of [ENTRY_PATH, CORE_PATH]) {
    mkdirSync(dirname(join(root, relativePath)), { recursive: true });
    writeFileSync(join(root, relativePath), '');
  }
  return root;
}

const TIMESTAMP = '2026-11-07T12:00:00.000Z';

/** A 1x1 transparent PNG, small enough to keep fixtures readable. */
export const ONE_PIXEL_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

export type BuildLocatorOptions = {
  /** Runtime whose reader the locator names. */
  runtime: HistoryLocator['runtime'];
  sessionId: string;
  /** Folder the session ran in; the locator is keyed by the checkout root above it. */
  cwd: string;
  /**
   * Store path a transcript runtime hashes into the handle. The reader-backed
   * runtimes mint from the session identity alone and omit it.
   */
  storePath?: string | null;
  mintedAt?: string;
};

/**
 * Build the locator a handover mints, without running a producer.
 *
 * The fields and the digest are the handover's, so a suite can seed a locator
 * the lookup CLI accepts without a compaction hook to mint one.
 */
export function buildLocator(options: BuildLocatorOptions): HistoryLocator {
  const placement = placeLookup(options.cwd);
  if (placement === null) {
    throw new Error(`no checkout root can run the lookup CLI above ${options.cwd}`);
  }
  const mintedAt = options.mintedAt ?? TIMESTAMP;
  const identity = {
    runtime: options.runtime,
    sessionId: options.sessionId,
    ...placement,
    locatorKind: HISTORY_LOCATOR_KINDS[options.runtime],
  };
  return {
    version: HISTORY_LOCATOR_VERSION,
    ...identity,
    handle: historyHandle(identity, options.storePath ?? null),
    mintedAt,
    provenance: { source: 'handover', capturedAt: mintedAt },
  };
}

export type BuildHistoryEntriesOptions = {
  /** Number of text blocks on the large part fixture. */
  partCount?: number;
};

function partEntry(id: string, sequence: number, partCount: number): HistoryEntry {
  const content: HistoryContentBlock[] = Array.from({ length: partCount }, (_, index) => ({
    type: 'text',
    text: `part ${String(index).padStart(3, '0')}`,
  }));
  return { id, role: 'user', sequence, timestamp: TIMESTAMP, content };
}

/** One valid entry per role, including every optional field. */
export function buildRoleFixtures(): HistoryEntry[] {
  return [
    {
      id: 'role-user',
      role: 'user',
      sequence: 0,
      timestamp: TIMESTAMP,
      content: [
        { type: 'text', text: 'Find the lookup contract.' },
        { type: 'image', data: ONE_PIXEL_PNG, mimeType: 'image/png' },
      ],
    },
    {
      id: 'role-assistant',
      role: 'assistant',
      sequence: 1,
      timestamp: TIMESTAMP,
      content: [
        { type: 'thinking', thinking: 'private thinking', signature: 'thinking-signature' },
        { type: 'text', text: 'The contract lives in docs/design.md.' },
        {
          type: 'toolCall',
          id: 'call-role',
          name: 'read_file',
          arguments: { path: 'docs/design.md' },
          thoughtSignature: 'provider-signature',
        },
      ],
    },
    {
      id: 'role-tool-result',
      role: 'toolResult',
      sequence: 2,
      timestamp: TIMESTAMP,
      toolCallId: 'call-role',
      isError: true,
      content: [
        { type: 'text', text: 'tool output' },
        { type: 'image', data: ONE_PIXEL_PNG, mimeType: 'image/png' },
      ],
    },
  ];
}

/**
 * A deterministic corpus covering every projection path: escaped text,
 * Unicode, a paging-only turn, a mixed turn, an image result and a large part.
 */
export function buildHistoryEntries(options: BuildHistoryEntriesOptions = {}): HistoryEntry[] {
  const partCount = options.partCount ?? 300;
  return [
    {
      id: 'history-user-1',
      role: 'user',
      sequence: 0,
      timestamp: TIMESTAMP,
      content: [{ type: 'text', text: 'She said "hello" and wrote C:\\temp\\notes.txt.' }],
    },
    {
      id: 'history-turn-1',
      role: 'assistant',
      sequence: 1,
      timestamp: TIMESTAMP,
      content: [
        { type: 'thinking', thinking: 'private-thinking', signature: 'private-thinking-signature' },
        { type: 'text', text: 'The lookup contract lives in docs/design.md.' },
        {
          type: 'toolCall',
          id: 'call-read-1',
          name: 'read_file',
          arguments: { path: 'docs/design.md' },
          thoughtSignature: 'private-provider-signature',
        },
      ],
    },
    {
      id: 'history-result-1',
      role: 'toolResult',
      sequence: 2,
      timestamp: TIMESTAMP,
      toolCallId: 'call-read-1',
      isError: false,
      content: [
        { type: 'text', text: 'public contract body' },
        { type: 'image', data: ONE_PIXEL_PNG, mimeType: 'image/png' },
      ],
    },
    {
      id: 'history-user-2',
      role: 'user',
      sequence: 3,
      timestamp: TIMESTAMP,
      content: [{ type: 'text', text: 'Café 🙂 — naïve façade' }],
    },
    {
      id: 'history-turn-paging',
      role: 'assistant',
      sequence: 4,
      timestamp: TIMESTAMP,
      content: [
        { type: 'thinking', thinking: 'private-paging-thinking' },
        {
          type: 'toolCall',
          id: 'call-search-1',
          name: 'search_history',
          arguments: { query: 'contract' },
        },
      ],
    },
    {
      id: 'history-result-paging',
      role: 'toolResult',
      sequence: 5,
      timestamp: TIMESTAMP,
      toolCallId: 'call-search-1',
      content: [{ type: 'text', text: 'paging-only result' }],
    },
    {
      id: 'history-turn-mixed',
      role: 'assistant',
      sequence: 6,
      timestamp: TIMESTAMP,
      content: [
        { type: 'text', text: 'Public answer after paging.' },
        {
          type: 'toolCall',
          id: 'call-search-2',
          name: 'search_history',
          arguments: { query: 'public answer' },
        },
        {
          type: 'toolCall',
          id: 'call-read-2',
          name: 'read_file',
          arguments: { path: 'docs/answer.md' },
          thoughtSignature: 'private-mixed-signature',
        },
      ],
    },
    {
      id: 'history-result-mixed',
      role: 'toolResult',
      sequence: 7,
      timestamp: TIMESTAMP,
      toolCallId: 'call-search-2',
      content: [{ type: 'text', text: 'paging mixed result' }],
    },
    {
      id: 'history-result-mixed-2',
      role: 'toolResult',
      sequence: 8,
      timestamp: TIMESTAMP,
      toolCallId: 'call-read-2',
      isError: true,
      content: [{ type: 'text', text: 'read failed' }],
    },
    partEntry('history-parts', 9, partCount),
  ];
}
