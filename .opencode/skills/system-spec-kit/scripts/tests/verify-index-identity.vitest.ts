// ───────────────────────────────────────────────────────────────────
// MODULE: Verify Index Identity Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it } from 'vitest';

import {
  formatHumanSummary,
  verifyIndexIdentity,
} from '../memory/verify-index-identity.js';

const tempDirectories: string[] = [];

function createFixtureDatabase(): string {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-index-identity-'));
  tempDirectories.push(tempDirectory);
  const databasePath = path.join(tempDirectory, 'context-index.sqlite');
  const database = new Database(databasePath);
  database.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL,
      file_path TEXT NOT NULL,
      canonical_file_path TEXT,
      anchor_id TEXT,
      document_type TEXT,
      title TEXT,
      content_hash TEXT,
      importance_tier TEXT,
      parent_id INTEGER
    );
  `);

  const insert = database.prepare(`
    INSERT INTO memory_index (
      id,
      spec_folder,
      file_path,
      canonical_file_path,
      anchor_id,
      document_type,
      title,
      content_hash,
      importance_tier,
      parent_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(
    1,
    'current-packet',
    '/workspace/current/028-packet/plan.md',
    null,
    null,
    'plan',
    'Plan',
    'plan-hash',
    'normal',
    null,
  );
  insert.run(
    2,
    'current-packet',
    '/workspace/current/028-packet/./plan.md',
    '/workspace/current/028-packet/plan.md',
    null,
    'plan',
    'Plan',
    'plan-hash',
    'normal',
    null,
  );
  insert.run(
    3,
    'current-packet',
    '/workspace/current/028-packet/plan.md',
    null,
    'summary',
    'plan',
    'Plan',
    'plan-hash',
    'normal',
    null,
  );
  insert.run(
    4,
    'renamed-packet',
    '/workspace/legacy/root/028-renamed/001-research/research.md',
    null,
    'finding',
    'research',
    'Identity Research',
    'renamed-content-hash',
    'important',
    null,
  );
  insert.run(
    5,
    'renamed-packet',
    '/workspace/current/root/028-renamed/001-research/research.md',
    null,
    'finding',
    'research',
    'Identity Research',
    'renamed-content-hash',
    'important',
    null,
  );
  insert.run(
    6,
    'current-packet',
    '/workspace/current/028-packet/plan.md',
    null,
    null,
    'plan',
    'Plan',
    'plan-hash',
    'normal',
    1,
  );
  insert.run(
    7,
    'other-packet',
    '/workspace/other/unique/tasks.md',
    null,
    null,
    'tasks',
    'Tasks',
    'tasks-hash',
    'normal',
    null,
  );
  insert.run(
    8,
    'unrelated-a',
    '/workspace/packet-a/001-discovery/research.md',
    null,
    null,
    'research',
    'Research',
    'unrelated-a-hash',
    'normal',
    null,
  );
  insert.run(
    9,
    'unrelated-b',
    '/workspace/packet-b/001-discovery/research.md',
    null,
    null,
    'research',
    'Research',
    'unrelated-b-hash',
    'normal',
    null,
  );
  insert.run(
    10,
    'reused-phase-a',
    '/workspace/barter/005-notifications/001-research/research/research.md',
    null,
    null,
    'research',
    'Research',
    'reused-phase-a-hash',
    'normal',
    null,
  );
  insert.run(
    11,
    'reused-phase-b',
    '/workspace/system/029-headroom/001-research/research/research.md',
    null,
    null,
    'research',
    'Research',
    'reused-phase-b-hash',
    'normal',
    null,
  );
  database.close();
  return databasePath;
}

function createArchiveFixtureDatabase(archiveTier: string): string {
  const databasePath = createFixtureDatabase();
  const database = new Database(databasePath);
  const insert = database.prepare(`
    INSERT INTO memory_index (
      id,
      spec_folder,
      file_path,
      canonical_file_path,
      anchor_id,
      document_type,
      title,
      content_hash,
      importance_tier,
      parent_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insert.run(
    12,
    'archive-packet',
    '/workspace/specs/z_archive/029-packet/001-research/research.md',
    null,
    'finding',
    'research',
    'Archive Research',
    'archive-content-hash',
    archiveTier,
    null,
  );
  insert.run(
    13,
    'live-packet',
    '/workspace/specs/live/029-packet/001-research/research.md',
    null,
    'finding',
    'research',
    'Archive Research',
    'archive-content-hash',
    'important',
    null,
  );
  database.close();
  return databasePath;
}

afterEach(() => {
  for (const tempDirectory of tempDirectories.splice(0)) {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
});

describe('verify-index-identity', () => {
  it('reports exact duplicates and only strongly signalled historical-prefix pairs', () => {
    const databasePath = createFixtureDatabase();
    const beforeStat = fs.statSync(databasePath);

    const report = verifyIndexIdentity(databasePath);

    expect(report.summary).toEqual({
      rowsScanned: 11,
      parentRowsScanned: 10,
      canonicalPathDuplicateClusters: 1,
      canonicalPathDuplicateRows: 3,
      canonicalPathExcessRows: 2,
      documentIdentityDuplicateClusters: 1,
      documentIdentityDuplicateRows: 2,
      documentIdentityExcessRows: 1,
      suspectedHistoricalPrefixClusters: 1,
      suspectedHistoricalPrefixPairs: 1,
      historicalPrefixSignalBreakdown: {
        matchingContentHashPairs: 1,
        matchingTitleAnchorIdentityPairs: 1,
        multiSegmentPathSuffixPairs: 1,
      },
    });
    expect(report.canonicalPathDuplicates).toEqual([
      expect.objectContaining({
        canonicalFilePath: '/workspace/current/028-packet/plan.md',
        rowCount: 3,
        excessRowCount: 2,
        rows: [
          expect.objectContaining({ id: 1, anchorId: null, documentType: 'plan' }),
          expect.objectContaining({ id: 2, anchorId: null, documentType: 'plan' }),
          expect.objectContaining({ id: 3, anchorId: 'summary', documentType: 'plan' }),
        ],
      }),
    ]);
    expect(report.documentIdentityDuplicates).toEqual([
      expect.objectContaining({
        canonicalFilePath: '/workspace/current/028-packet/plan.md',
        anchorId: null,
        documentType: 'plan',
        rowCount: 2,
        excessRowCount: 1,
        rows: [
          expect.objectContaining({ id: 1 }),
          expect.objectContaining({ id: 2 }),
        ],
      }),
    ]);
    expect(report.suspectedHistoricalPrefixes).toEqual([
      {
        tailKey: '001-research/research.md',
        parentName: '001-research',
        basename: 'research.md',
        paths: [
          {
            canonicalFilePath: '/workspace/current/root/028-renamed/001-research/research.md',
            prefix: '/workspace/current/root/028-renamed',
            rows: [expect.objectContaining({ id: 5 })],
          },
          {
            canonicalFilePath: '/workspace/legacy/root/028-renamed/001-research/research.md',
            prefix: '/workspace/legacy/root/028-renamed',
            rows: [expect.objectContaining({ id: 4 })],
          },
        ],
        pairs: [
          {
            leftPath: '/workspace/current/root/028-renamed/001-research/research.md',
            rightPath: '/workspace/legacy/root/028-renamed/001-research/research.md',
            leftPrefix: '/workspace/current',
            rightPrefix: '/workspace/legacy',
            sharedIdentities: [{ anchorId: 'finding', documentType: 'research' }],
            matchedSignals: [
              'matching_content_hash',
              'matching_title_anchor_identity',
              'multi_segment_path_suffix',
            ],
            sharedContentHashes: ['renamed-content-hash'],
            sharedTitleAnchorIdentities: [{
              title: 'Identity Research',
              anchorId: 'finding',
              documentType: 'research',
            }],
            sharedPathSuffix: 'root/028-renamed/001-research/research.md',
          },
        ],
      },
    ]);
    expect(report.suspectedHistoricalPrefixes.flatMap((cluster) => cluster.pairs)).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          leftPath: expect.stringContaining('/packet-a/001-discovery/research.md'),
        }),
        expect.objectContaining({
          sharedPathSuffix: '001-research/research/research.md',
        }),
      ]),
    );

    const afterStat = fs.statSync(databasePath);
    expect(afterStat.size).toBe(beforeStat.size);
    expect(afterStat.mtimeMs).toBe(beforeStat.mtimeMs);
    expect(report.databaseReadOnlySelfCheck).toEqual({
      sizeBeforeBytes: beforeStat.size,
      sizeAfterBytes: beforeStat.size,
      mtimeBeforeMs: beforeStat.mtimeMs,
      mtimeAfterMs: beforeStat.mtimeMs,
      sizeUnchanged: true,
      mtimeUnchanged: true,
      passed: true,
    });

    expect(formatHumanSummary(report)).toContain(
      'Historical-prefix signal pairs: content_hash=1, title_anchor=1, path_suffix=1',
    );
    expect(formatHumanSummary(report)).toContain('Database read-only self-check: PASS');
    expect(formatHumanSummary(report)).toContain(
      `Database size (bytes): ${beforeStat.size} -> ${beforeStat.size} (unchanged)`,
    );
    expect(formatHumanSummary(report)).toContain(
      `Database mtime (ms): ${beforeStat.mtimeMs} -> ${beforeStat.mtimeMs} (unchanged)`,
    );
  });

  it('suppresses only z_archive-to-live pairs marked as cold-tier archives', () => {
    const archivedReport = verifyIndexIdentity(createArchiveFixtureDatabase('archived'));
    expect(archivedReport.summary.suspectedHistoricalPrefixPairs).toBe(1);

    const activeArchiveReport = verifyIndexIdentity(createArchiveFixtureDatabase('important'));
    expect(activeArchiveReport.summary.suspectedHistoricalPrefixPairs).toBe(2);
    expect(activeArchiveReport.suspectedHistoricalPrefixes.flatMap((cluster) => cluster.pairs)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          leftPath: '/workspace/specs/live/029-packet/001-research/research.md',
          rightPath: '/workspace/specs/z_archive/029-packet/001-research/research.md',
          matchedSignals: [
            'matching_content_hash',
            'matching_title_anchor_identity',
            'multi_segment_path_suffix',
          ],
        }),
      ]),
    );
  });
});
