// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — schema helpers
// ───────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';

import {
  autoSelectActiveEmbedder,
  type AutoSelectOptions,
  type AutoSelectedEmbedderProvider,
} from '@spec-kit/shared/embeddings/auto-select';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

export interface ActiveEmbedder {
  readonly name: string;
  readonly dim: number;
  readonly provider?: AutoSelectedEmbedderProvider;
}

interface MetadataRow {
  readonly key: string;
  readonly value: string;
}

const ACTIVE_EMBEDDER_PROVIDERS = new Set<AutoSelectedEmbedderProvider>([
  'voyage',
  'openai',
  'ollama',
  'hf-local',
]);

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const DEFAULT_ACTIVE_EMBEDDER: ActiveEmbedder = Object.freeze({
  name: 'auto',
  dim: 0,
});

const MODEL_NAME_ALIASES = new Map<string, string>([
  ['nomic-ai/nomic-embed-text-v1.5', 'nomic-embed-text-v1.5'],
]);

const ACTIVE_EMBEDDER_NAME_KEY = 'active_embedder_name';
const ACTIVE_EMBEDDER_DIM_KEY = 'active_embedder_dim';
const ACTIVE_EMBEDDER_PROVIDER_KEY = 'active_embedder_provider';

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function validateDim(dim: number): void {
  if (!Number.isInteger(dim) || dim <= 0) {
    throw new RangeError(`Embedder dimension must be a positive integer, got ${dim}`);
  }
}

export function normalizeEmbeddingModelName(name: string | null | undefined): string | null {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (trimmed.length === 0) {
    return null;
  }

  return MODEL_NAME_ALIASES.get(trimmed) ?? trimmed;
}

export function vecTableNameForDim(dim: number): string {
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

function readActiveEmbedderIfValid(db: Database.Database): ActiveEmbedder | null {
  ensureVecMetadataTable(db);
  const rows = new Map((db.prepare(`
    SELECT key, value
    FROM vec_metadata
    WHERE key IN (?, ?, ?)
  `).all(
    ACTIVE_EMBEDDER_NAME_KEY,
    ACTIVE_EMBEDDER_DIM_KEY,
    ACTIVE_EMBEDDER_PROVIDER_KEY,
  ) as MetadataRow[]).map((row) => [row.key, row.value]));

  const name = normalizeEmbeddingModelName(rows.get(ACTIVE_EMBEDDER_NAME_KEY));
  const dimRaw = rows.get(ACTIVE_EMBEDDER_DIM_KEY);
  const dim = typeof dimRaw === 'string' ? Number.parseInt(dimRaw, 10) : NaN;

  if (!name || !Number.isInteger(dim) || dim <= 0) {
    return null;
  }

  const providerRaw = rows.get(ACTIVE_EMBEDDER_PROVIDER_KEY);
  const provider = ACTIVE_EMBEDDER_PROVIDERS.has(providerRaw as AutoSelectedEmbedderProvider)
    ? providerRaw as AutoSelectedEmbedderProvider
    : undefined;
  return provider ? { name, dim, provider } : { name, dim };
}

function resolveAutoSelectLockPath(db: Database.Database): string {
  const candidate = (db as Database.Database & { name?: unknown }).name;
  const dbName = typeof candidate === 'string' && candidate.length > 0 ? candidate : ':memory:';
  const digest = createHash('sha256').update(dbName).digest('hex').slice(0, 16);
  const lockDir = dbName === ':memory:' ? os.tmpdir() : path.dirname(dbName);
  return path.join(lockDir, `.active-embedder-auto-select-${digest}.lock`);
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
  return readActiveEmbedderIfValid(db) ?? DEFAULT_ACTIVE_EMBEDDER;
}

export async function ensureActiveEmbedder(
  db: Database.Database,
  options: Omit<AutoSelectOptions, 'metadataStore'> = {},
): Promise<ActiveEmbedder> {
  const active = readActiveEmbedderIfValid(db);
  if (active) {
    return active;
  }

  const selected = await autoSelectActiveEmbedder({
    ...options,
    lockPath: options.lockPath ?? resolveAutoSelectLockPath(db),
    metadataStore: {
      readActiveEmbedder: () => {
        const existing = readActiveEmbedderIfValid(db);
        return existing?.provider
          ? { name: existing.name, dim: existing.dim, provider: existing.provider }
          : null;
      },
      persistActiveEmbedder: (embedder) => {
        setActiveEmbedder(db, embedder.name, embedder.dim, embedder.provider);
      },
    },
  });

  return {
    name: selected.name,
    dim: selected.dim,
    provider: selected.provider,
  };
}

export function setActiveEmbedder(
  db: Database.Database,
  name: string,
  dim: number,
  provider?: AutoSelectedEmbedderProvider,
): void {
  const trimmedName = normalizeEmbeddingModelName(name);
  if (!trimmedName) {
    throw new TypeError('Active embedder name must be non-empty');
  }
  validateDim(dim);
  const trimmedProvider = provider?.trim();
  ensureVecMetadataTable(db);

  const writePointer = db.transaction(() => {
    db.prepare(`
      INSERT OR IGNORE INTO vec_metadata (key, value)
      VALUES
        (?, ?),
        (?, ?),
        (?, ?)
    `).run(
      ACTIVE_EMBEDDER_NAME_KEY,
      trimmedName,
      ACTIVE_EMBEDDER_DIM_KEY,
      String(dim),
      ACTIVE_EMBEDDER_PROVIDER_KEY,
      trimmedProvider ?? '',
    );

    db.prepare(`
      UPDATE vec_metadata
      SET value = CASE key
        WHEN ? THEN ?
        WHEN ? THEN ?
        WHEN ? THEN ?
        ELSE value
      END
      WHERE key IN (?, ?, ?)
    `).run(
      ACTIVE_EMBEDDER_NAME_KEY,
      trimmedName,
      ACTIVE_EMBEDDER_DIM_KEY,
      String(dim),
      ACTIVE_EMBEDDER_PROVIDER_KEY,
      trimmedProvider ?? '',
      ACTIVE_EMBEDDER_NAME_KEY,
      ACTIVE_EMBEDDER_DIM_KEY,
      ACTIVE_EMBEDDER_PROVIDER_KEY,
    );
  });

  writePointer();
}
