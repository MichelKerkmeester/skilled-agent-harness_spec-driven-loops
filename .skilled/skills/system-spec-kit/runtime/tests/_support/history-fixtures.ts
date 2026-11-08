// ───────────────────────────────────────────────────────────────────
// MODULE: History Test Fixtures
// ───────────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import type { HistoryContentBlock, HistoryEntry } from '../../hooks/lib/history/history.js';

const CLI_PATH = '.skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js';

/**
 * A temporary folder that looks like a checkout root. The lookup offer is
 * printed only for a workspace with a `.git` entry and the lookup CLI, so an
 * offer fixture needs both. The CLI is a placeholder file, because tests call
 * the CLI in process. The caller removes the folder when its suite ends.
 */
export function checkoutRoot(): string {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'history-checkout-')));
  mkdirSync(join(root, '.git'));
  mkdirSync(dirname(join(root, CLI_PATH)), { recursive: true });
  writeFileSync(join(root, CLI_PATH), '');
  return root;
}

const TIMESTAMP = '2026-11-07T12:00:00.000Z';

/** A 1x1 transparent PNG, small enough to keep fixtures readable. */
export const ONE_PIXEL_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

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
