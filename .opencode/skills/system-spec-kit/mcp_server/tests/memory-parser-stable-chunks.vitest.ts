import { describe, expect, it } from 'vitest';

import { extractStableMemoryChunks } from '../lib/parsing/memory-parser';

describe('memory parser stable chunks', () => {
  it('prefers anchor identity over headings', () => {
    const content = `# Feature

<!-- ANCHOR:decision-log -->
## Decision Log

Use stable anchors for durable chunk identity.
<!-- /ANCHOR:decision-log -->
`;

    const chunks = extractStableMemoryChunks(content);

    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      chunkId: 'anchor:decision-log',
      chunkKind: 'anchor',
      chunkStartLine: 3,
      chunkEndLine: 7,
    });
  });

  it('keeps an H2 chunk fingerprint stable when lines are added outside it', () => {
    const before = `# Feature

Intro.

## Stable Section

The important content stays the same.

## Other Section

Other content.
`;
    const after = `# Feature

New intro line.
Intro.

## Stable Section

The important content stays the same.

## Other Section

Other content.
Trailing line.
`;

    const stableBefore = extractStableMemoryChunks(before).find((chunk) => chunk.chunkId === 'heading:stable-section');
    const stableAfter = extractStableMemoryChunks(after).find((chunk) => chunk.chunkId === 'heading:stable-section');

    expect(stableBefore).toBeDefined();
    expect(stableAfter).toBeDefined();
    expect(stableAfter?.chunkFingerprint).toBe(stableBefore?.chunkFingerprint);
    expect(stableAfter?.chunkStartLine).toBeGreaterThan(stableBefore?.chunkStartLine ?? 0);
  });

  it('falls back to fixed windows when anchors and H2 headings are absent', () => {
    const chunks = extractStableMemoryChunks('one\ntwo\nthree\nfour', { windowLines: 2 });

    expect(chunks.map((chunk) => chunk.chunkId)).toEqual(['window:1-2', 'window:3-4']);
    expect(chunks.every((chunk) => chunk.chunkKind === 'window')).toBe(true);
  });
});
