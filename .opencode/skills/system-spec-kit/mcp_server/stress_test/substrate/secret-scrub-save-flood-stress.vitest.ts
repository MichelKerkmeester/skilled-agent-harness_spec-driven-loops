import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as memorySave from '../../handlers/memory-save.js';
import * as vectorIndex from '../../lib/search/vector-index.js';
import { applyWriteProvenance } from '../../lib/storage/write-provenance.js';

const AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
const GITHUB_TOKEN = 'github_pat_11ABCDEFG0abcdefghijklmnop';
const SAVE_COUNT = 52;

let tempDir = '';
let dbPath = '';
let previousMemoryDbPath: string | undefined;
let previousDisableCanonicalRouting: string | undefined;

function specDir(index: number): string {
  return path.join(tempDir, '.opencode', 'specs', 'stress-secret-scrub', `001-packet-${index}`);
}

function memoryPath(index: number): string {
  return path.join(specDir(index), 'graph-metadata.json');
}

function memoryContent(index: number): string {
  return JSON.stringify({
    schema_version: 1,
    packet_id: `stress-secret-scrub/001-packet-${index}`,
    spec_folder: `stress-secret-scrub/001-packet-${index}`,
    parent_id: null,
    children_ids: [],
    manual: {
      depends_on: [],
      supersedes: [],
      related_to: [],
    },
    derived: {
      trigger_phrases: [
        `secret scrub stress ${index}`,
        `fake aws ${AWS_ACCESS_KEY}`,
        `fake github ${GITHUB_TOKEN}`,
      ],
      key_topics: ['secret-scrub', 'atomic-save', 'provenance'],
      importance_tier: 'normal',
      status: 'in_progress',
      key_files: ['graph-metadata.json'],
      entities: [
        {
          name: `Secret scrub ${AWS_ACCESS_KEY}`,
          kind: 'proper_noun',
          path: 'graph-metadata.json',
          source: 'derived',
        },
      ],
      causal_summary: `Atomic save must redact ${AWS_ACCESS_KEY} and ${GITHUB_TOKEN} before durable storage.`,
      created_at: '2026-06-11T00:00:00.000Z',
      last_save_at: '2026-06-11T00:00:00.000Z',
      save_lineage: 'graph_only',
      last_accessed_at: null,
      source_docs: ['graph-metadata.json'],
      last_active_child_id: null,
      last_active_at: null,
    },
  }, null, 2);
}

function listFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) return listFiles(entryPath);
    return [entryPath];
  });
}

function tableExists(database: Database.Database, tableName: string): boolean {
  const row = database.prepare(`
    SELECT 1 AS found
    FROM sqlite_master
    WHERE type IN ('table', 'virtual table') AND name = ?
    LIMIT 1
  `).get(tableName) as { found?: number } | undefined;
  return row?.found === 1;
}

function stringifyRows(rows: unknown[]): string {
  return rows.map((row) => JSON.stringify(row)).join('\n');
}

function assertNoRawSecrets(label: string, surface: string): void {
  expect(surface, `${label} leaked AWS access key`).not.toContain(AWS_ACCESS_KEY);
  expect(surface, `${label} leaked GitHub token`).not.toContain(GITHUB_TOKEN);
}

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'secret-scrub-save-flood-'));
  dbPath = path.join(tempDir, 'memory.sqlite');
  previousMemoryDbPath = process.env.MEMORY_DB_PATH;
  previousDisableCanonicalRouting = process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING;
  process.env.MEMORY_DB_PATH = dbPath;
  process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = 'true';
  vectorIndex.closeDb();
  vectorIndex.initializeDb(dbPath);
});

afterEach(() => {
  vectorIndex.closeDb();
  if (previousMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
  else process.env.MEMORY_DB_PATH = previousMemoryDbPath;
  if (previousDisableCanonicalRouting === undefined) delete process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING;
  else process.env.SPECKIT_TEST_DISABLE_CANONICAL_ROUTING = previousDisableCanonicalRouting;
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('secret scrub save flood stress', () => {
  it('keeps raw secret substrings out of markdown, index, FTS, and provenance surfaces', async () => {
    const results = await Promise.all(
      Array.from({ length: SAVE_COUNT }, async (_value, index) => {
        const dir = specDir(index);
        fs.mkdirSync(dir, { recursive: true });
        return await memorySave.atomicSaveMemory({
          file_path: memoryPath(index),
          content: memoryContent(index),
          plannerMode: 'full-auto',
        }, { force: true });
      }),
    );

    expect(results).toHaveLength(SAVE_COUNT);
    expect(results.filter((result) => !result.success).map((result) => ({
      status: result.status,
      message: result.message,
      error: result.error,
    }))).toEqual([]);

    const database = new Database(dbPath);
    try {
      for (const result of results) {
        expect(result.id).toEqual(expect.any(Number));
        applyWriteProvenance(database, result.id as number, {
          provenanceSource: `agent-import ${AWS_ACCESS_KEY}`,
          provenanceActor: `opencode-bot ${GITHUB_TOKEN}`,
          tool: 'memory_save',
        });
      }

      const memorySurface = stringifyRows(database.prepare(`
        SELECT title, trigger_phrases, content_text, provenance_source, provenance_actor
        FROM memory_index
        ORDER BY id ASC
      `).all());
      assertNoRawSecrets('memory_index', memorySurface);
      expect(memorySurface).toContain('[REDACTED:aws-access-key-id]');
      expect(memorySurface).toContain('[REDACTED:github-token]');

      if (tableExists(database, 'memory_fts')) {
        const ftsSurface = stringifyRows(database.prepare('SELECT * FROM memory_fts').all());
        assertNoRawSecrets('memory_fts', ftsSurface);
      }
    } finally {
      database.close();
    }

    const fileSurface = listFiles(tempDir)
      .filter((filePath) => filePath.endsWith('.json'))
      .map((filePath) => fs.readFileSync(filePath, 'utf8'))
      .join('\n');
    assertNoRawSecrets('written files', fileSurface);
    expect(fileSurface).toContain('[REDACTED:aws-access-key-id]');
    expect(fileSurface).toContain('[REDACTED:github-token]');
  });
});
