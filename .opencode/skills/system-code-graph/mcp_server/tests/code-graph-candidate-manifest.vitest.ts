// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Candidate Manifest Tests
// ───────────────────────────────────────────────────────────────
// A persisted candidate manifest tracks {count, digest} of
// known indexable file paths. On detectState, divergence (count or digest
// drift) flips freshness to stale + full_scan even if individual mtimes
// look fine.

import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  closeDb,
  getDb,
  getCodeGraphMetadata,
  initDb,
  replaceNodes,
  setCodeGraphScope,
  setCodeGraphMetadata,
  upsertFile,
} from '../lib/code-graph-db.js';
import {
  canRunInlineSelectiveRefreshForFullScan,
  getGraphReadinessSnapshot,
  recordCandidateManifest,
} from '../lib/ensure-ready.js';
import { generateContentHash, getDefaultConfig } from '../lib/indexer-types.js';

function writeWorkspaceFile(rootDir: string, relativePath: string, content: string): string {
  const filePath = join(rootDir, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
  return filePath;
}

afterEach(() => {
  try {
    closeDb();
  } catch {
    /* singleton cleanup */
  }
});

describe('F-014-C4-03: candidate manifest persistence', () => {
  it('round-trips a manifest record through code_graph_metadata', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-manifest-1-'));
    try {
      initDb(tempDir);
      const manifest = {
        count: 42,
        digest: 'abcdef0123456789',
        recordedAt: '2026-05-01T00:00:00.000Z',
      };
      setCodeGraphMetadata('candidate_manifest', JSON.stringify(manifest));

      const raw = getCodeGraphMetadata('candidate_manifest');
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed.count).toBe(42);
      expect(parsed.digest).toBe('abcdef0123456789');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns null for an absent manifest', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-manifest-2-'));
    try {
      initDb(tempDir);
      const raw = getCodeGraphMetadata('candidate_manifest');
      expect(raw).toBeNull();
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('overwrites an existing manifest on update', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-manifest-3-'));
    try {
      initDb(tempDir);
      setCodeGraphMetadata('candidate_manifest', JSON.stringify({ count: 10, digest: 'old', recordedAt: 'a' }));
      setCodeGraphMetadata('candidate_manifest', JSON.stringify({ count: 20, digest: 'new', recordedAt: 'b' }));

      const raw = getCodeGraphMetadata('candidate_manifest');
      const parsed = JSON.parse(raw!);
      expect(parsed.count).toBe(20);
      expect(parsed.digest).toBe('new');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('keeps broad-scan manifest aligned with the read-path comparison', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-manifest-read-path-'));
    try {
      initDb(tempDir);
      const content = 'export function scanned() { return 1; }\n';
      const filePath = writeWorkspaceFile(tempDir, 'src/scanned.ts', content);
      const fileId = upsertFile(
        filePath,
        'typescript',
        generateContentHash(content),
        1,
        0,
        'clean',
        1,
      );
      replaceNodes(fileId, [{
        symbolId: 'scanned-symbol',
        filePath,
        fqName: 'scanned',
        kind: 'function',
        name: 'scanned',
        startLine: 1,
        endLine: 1,
        startColumn: 0,
        endColumn: 0,
        language: 'typescript',
        contentHash: generateContentHash(content),
      }]);
      setCodeGraphScope(getDefaultConfig(tempDir).scopePolicy);
      const trackedFiles = (getDb().prepare('SELECT file_path FROM code_files').all() as Array<{ file_path: string }>)
        .map((row) => row.file_path);

      recordCandidateManifest(trackedFiles);

      expect(getGraphReadinessSnapshot(tempDir)).toMatchObject({
        freshness: 'fresh',
        action: 'none',
        reason: 'all tracked files are up-to-date',
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});

describe('inline selective refresh full-scan fallback gate', () => {
  it('blocks selective refresh when a HEAD-drift full scan has only a partial stale-file set', () => {
    expect(canRunInlineSelectiveRefreshForFullScan({
      action: 'full_scan',
      staleFiles: ['src/changed.ts'],
      reason: 'git HEAD changed: 11111111 -> 22222222; 1 file(s) have newer mtime than indexed_at',
    }, {
      canRunFullScan: false,
      allowInlineIndex: true,
    })).toBe(false);
  });

  it('allows selective refresh only for a bounded stale-file full-scan fallback', () => {
    expect(canRunInlineSelectiveRefreshForFullScan({
      action: 'full_scan',
      staleFiles: ['src/changed.ts'],
      reason: '1 file(s) have newer mtime than indexed_at',
    }, {
      canRunFullScan: false,
      allowInlineIndex: true,
    })).toBe(true);
  });
});
