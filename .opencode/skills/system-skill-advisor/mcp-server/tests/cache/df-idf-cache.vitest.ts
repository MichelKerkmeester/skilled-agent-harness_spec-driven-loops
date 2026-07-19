// ───────────────────────────────────────────────────────────────
// MODULE: DF-IDF Corpus Cache Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { computeCorpusStatsCached } from '../../lib/corpus/df-idf.js';

const tempDirs: string[] = [];

function tempRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'df-idf-cache-'));
  tempDirs.push(root);
  return root;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

describe('DF-IDF corpus cold-start cache', () => {
  it('persists corpus stats under the advisor database and reuses matching graph-metadata mtimes', () => {
    const root = tempRoot();
    const documents = [
      { skillId: 'alpha', sourcePath: '.opencode/skills/alpha/graph-metadata.json', terms: ['route', 'alpha'], graphMetadataMtimeMs: 100 },
      { skillId: 'beta', sourcePath: '.opencode/skills/beta/graph-metadata.json', terms: ['route', 'beta'], graphMetadataMtimeMs: 200 },
    ];

    const first = computeCorpusStatsCached(documents, {
      workspaceRoot: root,
      now: new Date('2026-05-15T00:00:00Z'),
    });
    const second = computeCorpusStatsCached(documents, {
      workspaceRoot: root,
      now: new Date('2026-05-15T00:00:01Z'),
    });

    expect(first.cacheHit).toBe(false);
    expect(second.cacheHit).toBe(true);
    expect(second.stats).toEqual(first.stats);
    expect(first.cachePath).toBe(join(
      root,
      '.opencode',
      'skills',
      'system-skill-advisor',
      'mcp-server',
      'database',
      'df-idf-corpus-cache.json',
    ));
    expect(existsSync(first.cachePath)).toBe(true);
  });

  it('invalidates when a graph-metadata mtime changes', () => {
    const root = tempRoot();
    const cachePath = join(root, 'database', 'df-idf-corpus-cache.json');
    const documents = [
      { skillId: 'alpha', sourcePath: '.opencode/skills/alpha/graph-metadata.json', terms: ['route'], graphMetadataMtimeMs: 100 },
    ];
    const changedDocuments = [
      { skillId: 'alpha', sourcePath: '.opencode/skills/alpha/graph-metadata.json', terms: ['route'], graphMetadataMtimeMs: 101 },
    ];

    const first = computeCorpusStatsCached(documents, { cachePath, now: new Date('2026-05-15T00:00:00Z') });
    const second = computeCorpusStatsCached(changedDocuments, { cachePath, now: new Date('2026-05-15T00:00:01Z') });
    const persisted = JSON.parse(readFileSync(cachePath, 'utf8')) as { sourceKey: string };

    expect(first.cacheHit).toBe(false);
    expect(second.cacheHit).toBe(false);
    expect(second.sourceKey).not.toBe(first.sourceKey);
    expect(persisted.sourceKey).toBe(second.sourceKey);
  });
});
