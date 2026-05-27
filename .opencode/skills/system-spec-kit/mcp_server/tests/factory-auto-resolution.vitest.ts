// ───────────────────────────────────────────────────────────────
// TEST: Factory auto-resolution without sqlite3 on PATH
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { resolveProvider } from '../../shared/dist/embeddings/factory.js';

const require = createRequire(import.meta.url);
const ORIGINAL_ENV = { ...process.env };
let tempDir: string | null = null;

interface SqliteStatement {
  run(...params: readonly unknown[]): unknown;
}

interface SqliteDatabase {
  prepare(sql: string): SqliteStatement;
  close(): void;
}

type DatabaseSyncConstructor = new (filename: string) => SqliteDatabase;

function loadDatabaseSync(): DatabaseSyncConstructor {
  const sqliteModule = require('node:sqlite') as unknown;
  const DatabaseSync = typeof sqliteModule === 'object' && sqliteModule !== null
    ? (sqliteModule as { DatabaseSync?: unknown }).DatabaseSync
    : undefined;
  if (typeof DatabaseSync !== 'function') {
    throw new Error('node:sqlite DatabaseSync is unavailable in this test runtime');
  }
  return DatabaseSync as DatabaseSyncConstructor;
}

function createActiveOllamaDb(dbPath: string): void {
  const DatabaseSync = loadDatabaseSync();
  const db = new DatabaseSync(dbPath);
  try {
    db.prepare('CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)').run();
    const setMetadata = db.prepare('INSERT INTO vec_metadata (key, value) VALUES (?, ?)');
    setMetadata.run('active_embedder_name', 'nomic-embed-text-v1.5');
    setMetadata.run('active_embedder_dim', '768');
    setMetadata.run('active_embedder_provider', '');
    db.prepare('CREATE TABLE vec_768 (id INTEGER PRIMARY KEY, embedding BLOB NOT NULL)').run();
    db.prepare("INSERT INTO vec_768 (id, embedding) VALUES (1, x'00')").run();
  } finally {
    db.close();
  }
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  if (tempDir !== null) {
    rmSync(tempDir, { recursive: true, force: true });
    tempDir = null;
  }
});

describe('factory auto provider resolution', () => {
  it('resolves active Ollama metadata through node:sqlite when sqlite3 is absent from PATH', () => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'factory-auto-resolution-'));
    const dbPath = path.join(tempDir, 'context-index.sqlite');
    createActiveOllamaDb(dbPath);

    process.env.MEMORY_DB_PATH = dbPath;
    process.env.PATH = '';
    delete process.env.EMBEDDINGS_PROVIDER;
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    expect(resolveProvider().name).toBe('ollama');
  });
});
