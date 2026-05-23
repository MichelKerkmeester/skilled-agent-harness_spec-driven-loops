// ---------------------------------------------------------------
// MODULE: Profile
// ---------------------------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import type { ParsedProfileSlug, ProfileJson } from '../types.js';
import { getCanonicalFallback, type CanonicalProvider } from './registry.js';

// ---------------------------------------------------------------
// 1. UTILITY FUNCTIONS
// ---------------------------------------------------------------

/** Create safe slug for filenames (e.g., openai__text-embedding-3-small__1536) */
export function createProfileSlug(provider: string, model: string, dim: number, dtype?: string | null): string {
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();

  const safeDtype = dtype
    ? dtype.replace(/[^a-zA-Z0-9-_.]/g, '_').replace(/__+/g, '_').toLowerCase()
    : null;

  return safeDtype
    ? `${provider}__${safeModel}__${dim}__${safeDtype}`
    : `${provider}__${safeModel}__${dim}`;
}

/** Parse profile slug back to components */
export function parseProfileSlug(slug: string): ParsedProfileSlug | null {
  const parts = slug.split('__');
  if (parts.length !== 3 && parts.length !== 4) return null;

  const dim = parseInt(parts[2], 10);
  if (isNaN(dim)) return null;

  return {
    provider: parts[0],
    model: parts[1],
    dim,
    dtype: parts[3] ?? null,
  };
}

// ---------------------------------------------------------------
// 2. EMBEDDING PROFILE CLASS
// ---------------------------------------------------------------

interface EmbeddingProfileOptions {
  provider: string;
  model: string;
  dim: number;
  dtype?: string | null;
  baseUrl?: string | null;
}

/** Provides embedding profile. */
export class EmbeddingProfile {
  provider: string;
  model: string;
  dim: number;
  dtype: string | null;
  baseUrl: string | null;
  slug: string;

  constructor({ provider, model, dim, dtype = null, baseUrl = null }: EmbeddingProfileOptions) {
    this.provider = provider;
    this.model = model;
    this.dim = dim;
    this.dtype = dtype;
    this.baseUrl = baseUrl;
    this.slug = createProfileSlug(provider, model, dim, dtype);
  }

  /** Get stable canonical metadata database path. */
  getCanonicalDatabasePath(baseDir: string): string {
    return path.join(baseDir, 'context-index.sqlite');
  }

  /** Get profile-specific vector/cache shard path. */
  getVectorShardPath(baseDir: string): string {
    const vectorDir = path.join(baseDir, 'vectors');
    if (!fs.existsSync(vectorDir)) {
      fs.mkdirSync(vectorDir, { recursive: true, mode: 0o700 });
    }
    return path.join(vectorDir, `context-vectors__${this.slug}.sqlite`);
  }

  /** Deprecated: use getCanonicalDatabasePath() plus getVectorShardPath(). */
  getDatabasePath(baseDir: string): string {
    return this.getCanonicalDatabasePath(baseDir);
  }

  toFilename(): string {
    // dtype is part of the sqlite filename when present, preventing mixed-precision reuse.
    return `context-index__${this.slug}.sqlite`;
  }

  toDisplayString(): string {
    return this.dtype
      ? `${this.provider}:${this.model}:${this.dim}:${this.dtype}`
      : `${this.provider}:${this.model}:${this.dim}`;
  }

  equals(other: EmbeddingProfile): boolean {
    return this.provider === other.provider
      && this.model === other.model
      && this.dim === other.dim
      && this.dtype === other.dtype
      && this.baseUrl === other.baseUrl;
  }

  toJson(): ProfileJson {
    return {
      provider: this.provider,
      model: this.model,
      dim: this.dim,
      dtype: this.dtype,
      baseUrl: this.baseUrl,
      slug: this.slug,
    };
  }
}

type ActiveProfileProvider = 'voyage' | 'openai' | 'hf-local' | 'ollama';

const OLLAMA_MODEL_DIMENSIONS: Readonly<Record<string, number>> = Object.freeze({
  'nomic-embed-text-v1.5': 768,
  'mxbai-embed-large-v1': 1024,
  'bge-small-en-v1.5': 384,
  'bge-large-en-v1.5': 1024,
  'jina-embeddings-v3': 1024,
  'bge-m3': 1024,
  'snowflake-arctic-embed-l-v2.0': 1024,
});

export const ALLOWED_HF_LOCAL_DTYPES: ReadonlyArray<string> = [
  'fp32',
  'fp16',
  'q4',
  'q4f16',
  'q8',
  'int8',
  'uint8',
  'bnb4',
];

function normalizeProfileProvider(value: string | undefined | null): ActiveProfileProvider | null {
  const normalized = value?.trim().toLowerCase();
  if (
    normalized === 'voyage'
    || normalized === 'openai'
    || normalized === 'hf-local'
    || normalized === 'ollama'
  ) {
    return normalized;
  }
  return null;
}

function hasUsableApiKey(value: string | undefined): boolean {
  if (!value || value.trim().length < 10) {
    return false;
  }
  const upperValue = value.toUpperCase();
  return !upperValue.includes('YOUR_')
    && !upperValue.includes('PLACEHOLDER')
    && !upperValue.includes('HERE');
}

export function resolveActiveProfileProvider(): ActiveProfileProvider {
  const explicitProvider = normalizeProfileProvider(process.env.EMBEDDINGS_PROVIDER);
  if (explicitProvider) {
    return explicitProvider;
  }
  if (hasUsableApiKey(process.env.VOYAGE_API_KEY)) {
    return 'voyage';
  }
  if (hasUsableApiKey(process.env.OPENAI_API_KEY)) {
    return 'openai';
  }
  return 'hf-local';
}

function resolveActiveProfileModel(provider: ActiveProfileProvider): string {
  // Derived from registry MANIFESTS[0] + CLOUD_CANONICAL per ADR-013/014.
  // Pre-022 the switch returned inline string literals (`'BAAI/bge-base-en-v1.5'`,
  // `'jina-embeddings-v3'`, etc.) — see audit packet 021 findings f-iter001-001/002
  // and ADR-amendment in 022/010 for the verification clause.
  switch (provider) {
    case 'voyage':
      return process.env.VOYAGE_EMBEDDINGS_MODEL || getCanonicalFallback('voyage');
    case 'openai':
      return process.env.OPENAI_EMBEDDINGS_MODEL || getCanonicalFallback('openai');
    case 'ollama':
      return process.env.OLLAMA_EMBEDDINGS_MODEL || getCanonicalFallback('ollama');
    case 'hf-local':
    default:
      return process.env.HF_EMBEDDINGS_MODEL || getCanonicalFallback('hf-local');
  }
}

function resolveActiveProfileDim(provider: ActiveProfileProvider, model: string): number {
  const explicitDim = Number.parseInt(process.env.EMBEDDING_DIM || '', 10);
  if (Number.isFinite(explicitDim) && explicitDim > 0) {
    return explicitDim;
  }

  if (provider === 'openai' && model === 'text-embedding-3-large') {
    return 3072;
  }
  if (provider === 'hf-local' && model === 'intfloat/e5-large-v2') {
    return 1024;
  }
  if (provider === 'hf-local' && model === 'mixedbread-ai/mxbai-embed-large-v1') {
    return 1024;
  }
  if (provider === 'hf-local' && model === 'Snowflake/snowflake-arctic-embed-l-v2.0') {
    return 1024;
  }
  if (provider === 'hf-local' && model === 'BAAI/bge-m3') {
    return 1024;
  }
  if (provider === 'hf-local' && model === 'BAAI/bge-base-en-v1.5') {
    return 768;
  }
  if (provider === 'voyage') {
    return 1024;
  }
  if (provider === 'ollama') {
    return OLLAMA_MODEL_DIMENSIONS[model] ?? 1024;
  }
  return 768;
}

export function normalizeProfileDtype(value: string | undefined | null): string | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  return normalized.replace(/[^a-z0-9-_.]/g, '_').replace(/__+/g, '_');
}

function resolveAllowedDtype(
  value: string | undefined | null,
  allowed: ReadonlyArray<string>,
  fallback: string,
): string {
  const configured = normalizeProfileDtype(value);
  if (configured && allowed.includes(configured)) {
    return configured === 'q8_0' ? 'q8' : configured;
  }
  return fallback;
}

export function resolveActiveProfileDtype(provider: ActiveProfileProvider): string | null {
  if (provider === 'hf-local') {
    return resolveAllowedDtype(process.env.HF_EMBEDDINGS_DTYPE, ALLOWED_HF_LOCAL_DTYPES, 'q8');
  }
  if (provider === 'voyage' || provider === 'openai') {
    return 'cloud';
  }
  return null;
}

function createActiveProfileFromEnv(): EmbeddingProfile {
  const provider = resolveActiveProfileProvider();
  const model = resolveActiveProfileModel(provider);
  return new EmbeddingProfile({
    provider,
    model,
    dim: resolveActiveProfileDim(provider, model),
    dtype: resolveActiveProfileDtype(provider),
    baseUrl: provider === 'voyage'
      ? (process.env.VOYAGE_API_URL || null)
      : provider === 'ollama'
        ? ((process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, ''))
        : null,
  });
}

function findUp(startDir: string, predicate: (dir: string) => boolean): string | null {
  let currentDir = startDir;
  while (true) {
    if (predicate(currentDir)) {
      return currentDir;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      return null;
    }
    currentDir = parentDir;
  }
}

function resolveDefaultActiveProfileDbDir(): string {
  const configuredDir = process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR;
  if (configuredDir && configuredDir.trim().length > 0) {
    return path.resolve(process.cwd(), configuredDir.trim());
  }

  const workspaceRoot = findUp(process.cwd(), (dir) => (
    fs.existsSync(path.join(dir, 'mcp_server', 'database'))
    && fs.existsSync(path.join(dir, 'shared'))
  ));
  if (workspaceRoot) {
    return path.join(workspaceRoot, 'mcp_server', 'database');
  }

  const repoRoot = findUp(process.cwd(), (dir) => (
    fs.existsSync(path.join(dir, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'database'))
  ));
  if (repoRoot) {
    return path.join(repoRoot, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'database');
  }

  return path.resolve(process.cwd(), 'mcp_server', 'database');
}

export function resolveActiveProfileDbPath(profile?: EmbeddingProfile, dbDir?: string): string {
  const activeProfile = profile ?? createActiveProfileFromEnv();
  const databaseDir = dbDir && dbDir.trim().length > 0
    ? path.resolve(process.cwd(), dbDir.trim())
    : resolveDefaultActiveProfileDbDir();
  return activeProfile.getDatabasePath(databaseDir);
}
