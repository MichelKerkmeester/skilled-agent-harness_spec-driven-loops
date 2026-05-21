// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — schema helpers
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import {
  autoSelectActiveEmbedder,
  type AutoSelectMetadataStore,
  type AutoSelectResult,
  type EmbedderContentType,
} from '@spec-kit/shared/embeddings/auto-select.js';

import { getManifest } from './registry.js';

export interface ActiveEmbedder {
  readonly name: string;
  readonly dim: number;
}

interface MetadataRow {
  readonly key: string;
  readonly value: string;
}

// Phase 003/006 (shared-embedder-logic-with-spec-memory) flipped the default
// from `embeddinggemma-300m` to the `'auto'` sentinel. The shared cascade
// (`@spec-kit/shared/embeddings/auto-select.ts`) picks the actual model at
// runtime: Ollama (nomic-embed-text:v1.5 priority) → hf-local nomic →
// OpenAI → Voyage. The `ensureActiveEmbedder()` helper added later in this
// packet invokes the cascade when the persisted pointer is `'auto'` or when
// the persisted name references a manifest the shared registry no longer
// knows about (orphan migration from the gemma era).
export const DEFAULT_ACTIVE_EMBEDDER: ActiveEmbedder = Object.freeze({
  name: 'auto',
  dim: 0,
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

function setActiveEmbedderTransactional(
  db: Database.Database,
  name: string,
  dim: number,
  afterSchemaCreated?: () => void,
): void {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new TypeError('Active embedder name must be non-empty');
  }
  validateDim(dim);

  const writeActiveEmbedder = db.transaction(() => {
    ensureVecMetadataTable(db);
    ensureVecTableForDim(db, dim);
    afterSchemaCreated?.();

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

  writeActiveEmbedder();
}

export function setActiveEmbedder(db: Database.Database, name: string, dim: number): void {
  setActiveEmbedderTransactional(db, name, dim);
}

// ───────────────────────────────────────────────────────────────
// Cascade integration (phase 003/006)
// ───────────────────────────────────────────────────────────────

export interface EnsureActiveEmbedderOptions {
  /** Override the content-type passed to the shared cascade. Defaults to 'text'. */
  readonly contentType?: EmbedderContentType;
  /** Override the lock path. Defaults to a per-database lock in `os.tmpdir()`. */
  readonly lockPath?: string;
  /**
   * Override the cascade invocation. Used by tests to inject a deterministic
   * resolver instead of probing real backends.
   */
  readonly autoSelect?: (options: { metadataStore: AutoSelectMetadataStore; contentType: EmbedderContentType; lockPath?: string }) => Promise<AutoSelectResult>;
}

/**
 * Decide whether the persisted active-embedder pointer needs cascade
 * resolution. Returns true when:
 * - the pointer is the `'auto'` sentinel (fresh install or explicit reset)
 * - the persisted name no longer resolves through `getManifest()` (orphan
 *   from a pre-phase-007 install that still has `embeddinggemma-300m` saved)
 */
function pointerNeedsResolution(pointer: ActiveEmbedder): boolean {
  if (pointer.name === 'auto' || pointer.dim === 0) {
    return true;
  }
  return getManifest(pointer.name) === undefined;
}

function defaultLockPath(db: Database.Database): string {
  const dbName = db.name ?? '';
  const digest = createHash('sha1').update(dbName).digest('hex').slice(0, 12);
  return path.join(os.tmpdir(), `skill-advisor-auto-select-${digest}.lock`);
}

/**
 * Ensure an embedder pointer is persisted in `vec_metadata`. If the
 * current pointer is the `'auto'` sentinel or references a manifest the
 * shared registry no longer knows about, invoke the shared cascade
 * (`@spec-kit/shared/embeddings/auto-select.ts`) to resolve and persist
 * the winner. Otherwise return the persisted pointer unchanged.
 *
 * The shared cascade probes (in order): Ollama → hf-local → OpenAI → Voyage,
 * landing on `nomic-embed-text-v1.5` in local-only environments. The
 * `contentType` parameter is currently informational (the TS shared cascade
 * is text-tuned by design; CocoIndex's code cascade lives in Python and is
 * out of scope) but is plumbed through for future-proofing.
 */
export async function ensureActiveEmbedder(
  db: Database.Database,
  options: EnsureActiveEmbedderOptions = {},
): Promise<ActiveEmbedder> {
  const current = getActiveEmbedder(db);
  if (!pointerNeedsResolution(current)) {
    return current;
  }

  const metadataStore: AutoSelectMetadataStore = {
    readActiveEmbedder() {
      const pointer = getActiveEmbedder(db);
      if (pointerNeedsResolution(pointer)) {
        return null;
      }
      // Provider is recoverable from the manifest at need; persist only name + dim.
      return { name: pointer.name, dim: pointer.dim, provider: 'ollama' };
    },
    persistActiveEmbedder(embedder) {
      setActiveEmbedder(db, embedder.name, embedder.dim);
    },
  };

  const contentType: EmbedderContentType = options.contentType ?? 'text';
  const lockPath = options.lockPath ?? defaultLockPath(db);

  const result = options.autoSelect
    ? await options.autoSelect({ metadataStore, contentType, lockPath })
    : await autoSelectActiveEmbedder({
      metadataStore,
      contentType,
      lockPath,
    });

  // Persist the winner explicitly. The real cascade also persists via
  // `metadataStore.persistActiveEmbedder`, but doing it here makes the
  // wiring obvious and keeps test mocks simple (they don't need to know
  // about the metadataStore round-trip).
  setActiveEmbedder(db, result.name, result.dim);

  return { name: result.name, dim: result.dim };
}

export const __embedderSchemaTestables = {
  setActiveEmbedderTransactional,
  pointerNeedsResolution,
};
