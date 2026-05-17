// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — schema helpers
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { BASELINE_EMBEDDER_NAME } from './registry.js';

export interface ActiveEmbedder {
  readonly name: string;
  readonly dim: number;
}

interface MetadataRow {
  readonly key: string;
  readonly value: string;
}

export const DEFAULT_ACTIVE_EMBEDDER: ActiveEmbedder = Object.freeze({
  name: BASELINE_EMBEDDER_NAME,
  dim: 768,
});

const ACTIVE_EMBEDDER_NAME_KEY = 'active_embedder_name';
const ACTIVE_EMBEDDER_DIM_KEY = 'active_embedder_dim';

function validateDim(dim: number): void {
  if (!Number.isInteger(dim) || dim <= 0) {
    throw new RangeError(`Embedder dimension must be a positive integer, got ${dim}`);
  }
}

export function vecTableNameForDim(dim: number): string {
  validateDim(dim);
  return `vec_${dim}`;
}

export function ensureVecMetadataTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export function hasActiveEmbedderPointer(db: Database.Database): boolean {
  ensureVecMetadataTable(db);
  const row = db.prepare(`
    SELECT 1 AS present
    FROM vec_metadata
    WHERE key = ?
    LIMIT 1
  `).get(ACTIVE_EMBEDDER_NAME_KEY) as { present: number } | undefined;
  return Boolean(row);
}

function readActivePointerRows(db: Database.Database): Map<string, string> {
  ensureVecMetadataTable(db);
  const rows = db.prepare(`
    SELECT key, value
    FROM vec_metadata
    WHERE key IN (?, ?)
  `).all(ACTIVE_EMBEDDER_NAME_KEY, ACTIVE_EMBEDDER_DIM_KEY) as MetadataRow[];

  return new Map(rows.map((row) => [row.key, row.value]));
}

export function ensureVecTableForDim(db: Database.Database, dim: number): void {
  const tableName = vecTableNameForDim(dim);
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      skill_id TEXT PRIMARY KEY REFERENCES skill_nodes(id) ON DELETE CASCADE,
      embedding BLOB NOT NULL,
      model_id TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_${tableName}_model ON ${tableName}(model_id);
    CREATE INDEX IF NOT EXISTS idx_${tableName}_hash ON ${tableName}(content_hash);
  `);
}

export function getActiveEmbedder(db: Database.Database): ActiveEmbedder {
  const rows = readActivePointerRows(db);
  const name = rows.get(ACTIVE_EMBEDDER_NAME_KEY);
  const dimRaw = rows.get(ACTIVE_EMBEDDER_DIM_KEY);
  const dim = typeof dimRaw === 'string' ? Number.parseInt(dimRaw, 10) : NaN;

  if (!name || !Number.isInteger(dim) || dim <= 0) {
    return DEFAULT_ACTIVE_EMBEDDER;
  }

  return { name, dim };
}

export function setActiveEmbedder(db: Database.Database, name: string, dim: number): void {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new TypeError('Active embedder name must be non-empty');
  }
  validateDim(dim);
  ensureVecMetadataTable(db);
  ensureVecTableForDim(db, dim);

  const writePointer = db.transaction(() => {
    db.prepare(`
      INSERT INTO vec_metadata (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(ACTIVE_EMBEDDER_NAME_KEY, trimmedName);

    db.prepare(`
      INSERT INTO vec_metadata (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(ACTIVE_EMBEDDER_DIM_KEY, String(dim));
  });

  writePointer();
}
