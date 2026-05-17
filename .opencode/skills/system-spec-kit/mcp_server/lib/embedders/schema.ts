// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — schema helpers
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

export interface ActiveEmbedder {
  readonly name: string;
  readonly dim: number;
}

interface MetadataRow {
  readonly key: string;
  readonly value: string;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const DEFAULT_ACTIVE_EMBEDDER: ActiveEmbedder = Object.freeze({
  name: 'embeddinggemma-300m',
  dim: 768,
});

const ACTIVE_EMBEDDER_NAME_KEY = 'active_embedder_name';
const ACTIVE_EMBEDDER_DIM_KEY = 'active_embedder_dim';

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function validateDim(dim: number): void {
  if (!Number.isInteger(dim) || dim <= 0) {
    throw new RangeError(`Embedder dimension must be a positive integer, got ${dim}`);
  }
}

function vecTableNameForDim(dim: number): string {
  validateDim(dim);
  return `vec_${dim}`;
}

function ensureVecMetadataTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS vec_metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
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

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function ensureVecTableForDim(db: Database.Database, dim: number): void {
  const tableName = vecTableNameForDim(dim);
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY,
      vec BLOB NOT NULL
    )
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

  const writePointer = db.transaction(() => {
    db.prepare(`
      INSERT OR IGNORE INTO vec_metadata (key, value)
      VALUES
        (?, ?),
        (?, ?)
    `).run(
      ACTIVE_EMBEDDER_NAME_KEY,
      DEFAULT_ACTIVE_EMBEDDER.name,
      ACTIVE_EMBEDDER_DIM_KEY,
      String(DEFAULT_ACTIVE_EMBEDDER.dim),
    );

    db.prepare(`
      UPDATE vec_metadata
      SET value = CASE key
        WHEN ? THEN ?
        WHEN ? THEN ?
        ELSE value
      END
      WHERE key IN (?, ?)
    `).run(
      ACTIVE_EMBEDDER_NAME_KEY,
      trimmedName,
      ACTIVE_EMBEDDER_DIM_KEY,
      String(dim),
      ACTIVE_EMBEDDER_NAME_KEY,
      ACTIVE_EMBEDDER_DIM_KEY,
    );
  });

  writePointer();
}
