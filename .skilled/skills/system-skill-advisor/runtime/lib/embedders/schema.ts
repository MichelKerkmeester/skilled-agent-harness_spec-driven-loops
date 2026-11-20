// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — schema helpers
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';

import { getManifest, listManifests } from './registry.js';

import type {
  AutoSelectedEmbedderProvider,
  EmbedderContentType,
} from '@spec-kit/shared/embeddings/auto-select.js';
import type { BackendKind } from '@spec-kit/shared/embeddings/types.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

export interface ActiveEmbedder {
  readonly name: string;
  readonly dim: number;
  readonly provider?: AutoSelectedEmbedderProvider;
}

interface MetadataRow {
  readonly key: string;
  readonly value: string;
}

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// The `'auto'` sentinel keeps the default independent of backend availability.
// `ensureActiveEmbedder()` resolves the pointer to the first registered manifest.
export const DEFAULT_ACTIVE_EMBEDDER: ActiveEmbedder = Object.freeze({
  name: 'auto',
  dim: 0,
});

const ACTIVE_EMBEDDER_NAME_KEY = 'active_embedder_name';
const ACTIVE_EMBEDDER_DIM_KEY = 'active_embedder_dim';
const ACTIVE_EMBEDDER_PROVIDER_KEY = 'active_embedder_provider';
const ACTIVE_EMBEDDER_PROVIDERS = new Set<AutoSelectedEmbedderProvider>([
  'voyage',
  'openai',
  'ollama',
  'hf-local',
]);

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function validateDim(dim: number): void {
  if (!Number.isInteger(dim) || dim <= 0) {
    throw new RangeError(`Embedder dimension must be a positive integer, got ${dim}`);
  }
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

export function vecTableNameForDim(dim: number): string {
  validateDim(dim);
  return `vec_${dim}`;
}

/**
 * Name of the command-vector table for a given dimension. Commands are
 * embedded from the same vector space as skills, so a separate table per dim
 * keeps both searchable without mixing two id spaces in one file.
 */
export function commandVecTableNameForDim(dim: number): string {
  validateDim(dim);
  return `vec_cmd_${dim}`;
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
    WHERE key IN (?, ?, ?)
  `).all(ACTIVE_EMBEDDER_NAME_KEY, ACTIVE_EMBEDDER_DIM_KEY, ACTIVE_EMBEDDER_PROVIDER_KEY) as MetadataRow[];

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

/**
 * Create the command-vector table for a dimension. The shape mirrors the skill
 * table so the same read and write paths work over both, but `command_id`
 * carries no foreign key because command ids are not rows of `skill_nodes` and
 * a reference there would reject every insert.
 */
export function ensureCommandVecTableForDim(db: Database.Database, dim: number): void {
  const tableName = commandVecTableNameForDim(dim);
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${tableName} (
      command_id TEXT PRIMARY KEY,
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

  const providerRaw = rows.get(ACTIVE_EMBEDDER_PROVIDER_KEY);
  const provider = ACTIVE_EMBEDDER_PROVIDERS.has(providerRaw as AutoSelectedEmbedderProvider)
    ? (providerRaw as AutoSelectedEmbedderProvider)
    : undefined;

  return provider ? { name, dim, provider } : { name, dim };
}

function setActiveEmbedderTransactional(
  db: Database.Database,
  name: string,
  dim: number,
  afterSchemaCreated?: () => void,
  provider?: AutoSelectedEmbedderProvider,
): void {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new TypeError('Active embedder name must be non-empty');
  }
  validateDim(dim);
  // Distinguish "caller omitted provider" (undefined — preserve whatever is
  // already persisted) from "caller explicitly wants it cleared" (an empty
  // string is still a deliberate write). Only the omitted case skips the
  // provider write entirely, so a bare 3-arg call can no longer clobber an
  // already-persisted provider with an empty-string sentinel.
  const providerWrite = provider === undefined ? undefined : provider.trim();

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

    if (providerWrite !== undefined) {
      db.prepare(`
        INSERT INTO vec_metadata (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(ACTIVE_EMBEDDER_PROVIDER_KEY, providerWrite);
    }
  });

  writeActiveEmbedder();
}

export function setActiveEmbedder(
  db: Database.Database,
  name: string,
  dim: number,
  provider?: AutoSelectedEmbedderProvider,
): void {
  setActiveEmbedderTransactional(db, name, dim, undefined, provider);
}

// ───────────────────────────────────────────────────────────────────
// 6. POINTER RESOLUTION
// ───────────────────────────────────────────────────────────────────

export interface EnsureActiveEmbedderOptions {
  /** Retained for compatibility with callers that still specify content type. */
  readonly contentType?: EmbedderContentType;
}

/**
 * Decide whether the persisted active-embedder pointer needs manifest
 * resolution. Returns true when:
 * - the pointer is the `'auto'` sentinel (fresh install or explicit reset)
 * - the persisted name no longer resolves through `getManifest()`
 */
function pointerNeedsResolution(pointer: ActiveEmbedder): boolean {
  if (pointer.name === 'auto' || pointer.dim === 0) {
    return true;
  }
  return getManifest(pointer.name) === undefined;
}

/**
 * Map a manifest backend to the provider stored with the active pointer.
 * Manifests collapse API providers into `'api'`, so that backend currently
 * maps to `'openai'`. A Voyage manifest needs an explicit provider hint.
 */
function backendToProvider(backend: BackendKind | undefined): AutoSelectedEmbedderProvider {
  switch (backend) {
    case 'sentence-transformers':
      return 'hf-local';
    case 'api':
      return 'openai';
    case 'ollama':
    default:
      return 'ollama';
  }
}

/**
 * Resolve an unset or unknown pointer to the first registered manifest.
 * Known pointers stay unchanged, with their provider backfilled when it is missing.
 *
 * Skill and command vectors are written by a trusted `skill_graph_scan` and by the
 * daemon's background refresh after startup and after each watcher reindex.
 */
export async function ensureActiveEmbedder(
  db: Database.Database,
  _options: EnsureActiveEmbedderOptions = {},
): Promise<ActiveEmbedder> {
  const current = getActiveEmbedder(db);
  if (!pointerNeedsResolution(current)) {
    if (current.provider === undefined) {
      // Pre-existing pointer written before the provider column existed
      // (or via a bare 3-arg `setActiveEmbedder` call). Backfill the
      // provider from the manifest so future reads don't repeat this
      // derivation, without resolving the pointer again.
      const manifest = getManifest(current.name);
      if (manifest) {
        const provider = backendToProvider(manifest.backend);
        setActiveEmbedder(db, current.name, current.dim, provider);
        return { ...current, provider };
      }
    }
    return current;
  }

  const manifest = listManifests()[0];
  if (!manifest) {
    throw new Error('no embedder manifest is registered');
  }

  const provider = backendToProvider(manifest.backend);
  setActiveEmbedder(db, manifest.name, manifest.dim, provider);
  return { name: manifest.name, dim: manifest.dim, provider };
}

// ───────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ───────────────────────────────────────────────────────────────────

export const __embedderSchemaTestables = {
  setActiveEmbedderTransactional,
};
