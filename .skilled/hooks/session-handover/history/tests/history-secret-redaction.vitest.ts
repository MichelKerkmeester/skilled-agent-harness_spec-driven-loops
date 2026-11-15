// ───────────────────────────────────────────────────────────────────
// MODULE: History Secret Redaction Tests
// ───────────────────────────────────────────────────────────────────
// Every fixture secret is assembled from fragments at run time, so this file
// never holds a literal credential signature for the secret scanners to flag.

import { describe, expect, it } from 'vitest';

import { createHistoryLookup, type HistoryLookup } from '../lib/core.js';
import type { HistoryEntry } from '../lib/history.js';

const TIMESTAMP = '2026-11-15T12:00:00.000Z';

/** Each value is a secret, and each tail is a fragment no redacted reply may hold. */
const SECRETS = {
  anthropic: { value: `sk-${'ant'}-api03-A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8`, tail: 'K1l2M3n4O5p6Q7r8' },
  github: { value: `gh${'p'}_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9`, tail: 'k1L2m3N4o5P6q7R8s9' },
  aws: { value: `AK${'IA'}QWERTYUIOPASDF12`, tail: 'QWERTYUIOPASDF12' },
  privateKey: {
    value: `-----BEGIN ${'RSA PRIVATE'} KEY-----\nMIIEowIBAAKCAQEAx1y2z3w4v5u6\n-----END ${'RSA PRIVATE'} KEY-----`,
    tail: 'MIIEowIBAAKCAQEAx1y2z3w4v5u6',
  },
  bearer: { value: `Authorization: Bearer Zx9Yw8Vu7Ts6Rq5Po4Nm3Lk2`, tail: 'Zx9Yw8Vu7Ts6Rq5Po4Nm3Lk2' },
  basic: { value: `Authorization: Basic dXNlcjpwYXNzd29yZA==`, tail: 'dXNlcjpwYXNzd29yZA' },
  urlPassword: { value: `postgres://admin:Hunter2${'Secret'}99@db.example.com:5432/app`, tail: 'Hunter2Secret99' },
} as const;

const KEYED_ARGUMENT_TAIL = 'plainpassphrase';

function userEntry(id: string, sequence: number, text: string): HistoryEntry {
  return { id, role: 'user', sequence, timestamp: TIMESTAMP, content: [{ type: 'text', text }] };
}

function secretEntries(): HistoryEntry[] {
  const allSecrets = Object.values(SECRETS).map((secret) => secret.value).join('\n');
  return [
    userEntry('user-1', 1, `deploy notes\n${allSecrets}`),
    {
      id: 'turn-1',
      role: 'assistant',
      sequence: 2,
      timestamp: TIMESTAMP,
      content: [
        { type: 'text', text: `calling with ${SECRETS.github.value}` },
        {
          type: 'toolCall',
          id: 'call-1',
          name: 'Bash',
          arguments: { command: `curl -H "${SECRETS.bearer.value}" ${SECRETS.urlPassword.value}` },
        },
        {
          type: 'toolCall',
          id: 'call-2',
          name: 'register_manual',
          arguments: { config: { password: KEYED_ARGUMENT_TAIL, token: '$GITHUB_TOKEN' } },
        },
      ],
    },
    { id: 'result-1', role: 'toolResult', sequence: 3, timestamp: TIMESTAMP, toolCallId: 'call-1', content: [{ type: 'text', text: `export KEY=${SECRETS.aws.value}` }] },
    { id: 'result-2', role: 'toolResult', sequence: 4, timestamp: TIMESTAMP, toolCallId: 'call-2', content: [{ type: 'text', text: 'registered' }] },
  ];
}

function replyText(reply: { content: readonly unknown[] }): string {
  return JSON.stringify(reply.content);
}

function expectNoSecret(text: string): void {
  for (const secret of Object.values(SECRETS)) expect(text).not.toContain(secret.tail);
  expect(text).not.toContain(KEYED_ARGUMENT_TAIL);
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

describe('history lookup secret redaction', () => {
  it('keeps every secret kind out of search, browse, load and page replies', () => {
    const lookup = createHistoryLookup(secretEntries());

    const replies = [
      lookup.search({ query: 'deploy' }),
      lookup.browse({ direction: 'backward' }),
      lookup.load(['user-1', 'turn-1']),
      lookup.page({ historyId: 'user-1', part: '/userMessage/content/0' }),
      lookup.page({ historyId: 'turn-1', mode: 'parts' }),
    ];
    for (const reply of replies) expectNoSecret(replyText(reply));

    const loaded = replyText(lookup.load(['user-1', 'turn-1']));
    for (const kind of ['anthropic-api-key', 'github-token', 'aws-access-key-id', 'private-key', 'bearer-token', 'authorization', 'url-password', 'credential-argument']) {
      expect(loaded).toContain(`[REDACTED:${kind}]`);
    }
    // The URL keeps its user and host so the reader still knows what was reached.
    expect(loaded).toContain('postgres://admin:[REDACTED:url-password]@db.example.com:5432/app');
    // A variable reference names a secret without holding one, so it stays.
    expect(loaded).toContain('$GITHUB_TOKEN');
  });

  it('never matches a search on the secret itself', () => {
    const lookup = createHistoryLookup(secretEntries());
    const reply = JSON.parse(lookup.search({ query: SECRETS.aws.value }).content[0]?.text ?? '{}') as { references?: unknown[] };
    expect(reply.references).toEqual([]);
  });

  it('redacts a secret that straddles a text page boundary', () => {
    // The token starts before the 2,000-unit page edge and ends after it.
    const text = `${'a'.repeat(1_990)} ${SECRETS.github.value} ${'b'.repeat(3_000)}`;
    const lookup = createHistoryLookup([userEntry('long-1', 1, text)]);
    const joined = readAllText(lookup, 'long-1', '/userMessage/content/0');
    expect(joined).not.toContain(SECRETS.github.tail);
    expect(joined).toContain('[REDACTED:github-token]');
  });

  it('still excludes a paging turn and leaves ordinary text and the input alone', () => {
    const ordinary = 'Load sk-create-with-human-voice, see https://host.example:8080/a@b, Authorization: required';
    const entries: HistoryEntry[] = [
      userEntry('user-1', 1, ordinary),
      {
        id: 'paging-turn',
        role: 'assistant',
        sequence: 2,
        timestamp: TIMESTAMP,
        content: [{
          type: 'toolCall',
          id: 'call-1',
          name: 'Bash',
          arguments: { command: `node .skilled/hooks/session-handover/bin/history-lookup.mjs browse -H "${SECRETS.bearer.value}"` },
        }],
      },
      { id: 'result-1', role: 'toolResult', sequence: 3, timestamp: TIMESTAMP, toolCallId: 'call-1', content: [{ type: 'text', text: '{}' }] },
    ];
    const before = JSON.stringify(entries);
    const lookup = createHistoryLookup(entries);

    const browse = JSON.parse(lookup.browse({ direction: 'backward' }).content[0]?.text ?? '{}') as {
      references?: Array<{ historyId: string }>;
    };
    expect(browse.references?.map((reference) => reference.historyId)).toEqual(['user-1']);
    expect(readAllText(lookup, 'user-1', '/userMessage/content/0')).toBe(ordinary);
    expect(JSON.stringify(entries)).toBe(before);
  });
});
