// ───────────────────────────────────────────────────────────────────
// MODULE: Factory
// ───────────────────────────────────────────────────────────────────

import { existsSync, readdirSync } from 'fs';
import { createRequire } from 'node:module';
import path from 'path';
import { fileURLToPath } from 'url';

import { HfLocalProvider, resolveDtype as resolveHfLocalDtype } from './providers/hf-local.js';
import { OpenAIProvider, MODEL_DIMENSIONS as OPENAI_MODEL_DIMENSIONS } from './providers/openai.js';
import {
  getOllamaManifest,
  MODEL_DIMENSIONS as OLLAMA_MODEL_DIMENSIONS,
  OllamaProvider,
  resolveOllamaBaseUrl,
  resolveOllamaCanonicalModel,
} from './providers/ollama.js';
import { createProfileSlug, EmbeddingProfile, resolveActiveProfileDtype } from './profile.js';
import { getCanonicalFallback } from './registry.js';
import { VoyageProvider, MODEL_DIMENSIONS as VOYAGE_MODEL_DIMENSIONS, resolveVoyageBaseUrl } from './providers/voyage.js';
import type {
  IEmbeddingProvider,
  ProviderResolution,
  ProviderInfo,
  CreateProviderOptions,
  ApiKeyValidationResult,
} from '../types.js';

const require = createRequire(import.meta.url);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

interface ValidationErrorBody {
  detail?: string;
  error?: {
    message?: string;
  };
}

function parseValidationErrorBody(payload: unknown): ValidationErrorBody {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const payloadRecord = payload as Record<string, unknown>;
  const detail = typeof payloadRecord.detail === 'string' ? payloadRecord.detail : undefined;

  let message: string | undefined;
  if (payloadRecord.error && typeof payloadRecord.error === 'object') {
    const errorRecord = payloadRecord.error as Record<string, unknown>;
    if (typeof errorRecord.message === 'string') {
      message = errorRecord.message;
    }
  }

  return {
    detail,
    error: message ? { message } : undefined,
  };
}

type SupportedProviderName = 'voyage' | 'openai' | 'hf-local' | 'ollama';
type ConfiguredProviderName = SupportedProviderName | 'auto';
type ProviderFactoryMetadata = {
  requestedProvider: string;
  effectiveProvider: string;
  fallbackReason?: string;
  dimensionChanged: boolean;
};

type ProviderInfoWithFallback = ProviderInfo & ProviderFactoryMetadata;

type StartupEmbeddingConfig = {
  resolution: ProviderResolution;
  info: ProviderInfoWithFallback;
  dimension: number;
  validation: ApiKeyValidationResult;
};

interface ValidateApiKeyOptions {
  timeout?: number;
  provider?: SupportedProviderName;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

let lastProviderFactoryMetadata: ProviderFactoryMetadata | null = null;
let lastProviderFactoryFingerprint: string | null = null;

const providerValidationCache = new Map<string, Promise<ApiKeyValidationResult>>();

export const SUPPORTED_PROVIDERS = ['openai', 'voyage', 'hf-local', 'ollama', 'auto'] as const;
const SUPPORTED_PROVIDER_SET: ReadonlySet<string> = new Set(SUPPORTED_PROVIDERS);

// Voyage egress guard:
// Runtime guard that fires once per process startup if VOYAGE_API_KEY is present
// while the resolved provider is hf-local. The original Voyage purge only
// cleaned shell-propagating sources (~/.zshrc, project .env, macOS launchd). If a
// future setup re-exports the key (e.g. via a different shell rc or a system-wide
// launchd plist), `EMBEDDINGS_PROVIDER=auto` will silently fall back to Voyage and
// start making network calls to api.voyageai.com again. This guard surfaces that
// regression at the first provider-resolution call so users notice before egress.
let voyageDriftWarned = false;
function warnIfVoyageDriftDetected(effectiveProvider: string): void {
  if (voyageDriftWarned) {
    return;
  }
  if (effectiveProvider !== 'hf-local') {
    return;
  }
  if (process.env.VOYAGE_API_KEY) {
    voyageDriftWarned = true;
    console.warn(
      '[factory] VOYAGE_API_KEY is set in process.env but the resolved provider is hf-local. ' +
      'If you intended to use Voyage, set EMBEDDINGS_PROVIDER=voyage explicitly. ' +
      'If you intended local-only, unset VOYAGE_API_KEY to silence this warning. ' +
      'See 014-local-embeddings-setup-a/007-voyage-cleanup-and-egress-monitoring/spec.md.',
    );
  }
}

function warnIfVoyageWouldShadowLocal(explicitProvider: string | null): void {
  if (voyageDriftWarned) {
    return;
  }
  if (explicitProvider === 'voyage') {
    return;
  }
  if (process.env.VOYAGE_API_KEY && (!explicitProvider || explicitProvider === 'auto')) {
    voyageDriftWarned = true;
    console.warn(
      '[factory] VOYAGE_API_KEY is set but EMBEDDINGS_PROVIDER=auto resolves local-first ' +
      '(ollama, else hf-local) and will not auto-select Voyage. ' +
      'Set EMBEDDINGS_PROVIDER=voyage explicitly to use Voyage, or unset VOYAGE_API_KEY to silence this warning.',
    );
  }
}

// Per-provider canonical fallback names — derived from registry MANIFESTS[0]
// (for ollama / hf-local) and CLOUD_CANONICAL (for voyage / openai). This map
// is frozen at module load so a registry change (re-order MANIFESTS, swap
// CLOUD_CANONICAL) auto-propagates without code edits here. See
// shared/embeddings/registry.ts:getCanonicalFallback().
const DEFAULT_PROVIDER_MODELS: Readonly<Record<SupportedProviderName, string>> = Object.freeze({
  voyage: getCanonicalFallback('voyage'),
  openai: getCanonicalFallback('openai'),
  'hf-local': getCanonicalFallback('hf-local'),
  ollama: getCanonicalFallback('ollama'),
});

// Correctness: one canonical dimension map for startup and runtime
export const VALID_PROVIDER_DIMENSIONS = Object.freeze({
  voyage: Object.freeze({ ...VOYAGE_MODEL_DIMENSIONS }),
  openai: Object.freeze({ ...OPENAI_MODEL_DIMENSIONS }),
  'hf-local': Object.freeze({
    'nomic-ai/nomic-embed-text-v1.5': 768,
  }),
  ollama: Object.freeze({ ...OLLAMA_MODEL_DIMENSIONS }),
} satisfies Record<SupportedProviderName, Readonly<Record<string, number>>>);

function normalizeProviderName(value: string | undefined | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

function getExplicitProviderOverride(): ConfiguredProviderName | null {
  const explicitProvider = normalizeProviderName(process.env.EMBEDDINGS_PROVIDER);
  if (!explicitProvider) {
    return null;
  }

  return validateConfiguredEmbeddingsProvider(explicitProvider);
}

function getValidDimensionsForProvider(provider: SupportedProviderName): number[] {
  return Array.from(new Set(Object.values(VALID_PROVIDER_DIMENSIONS[provider]))).sort((left, right) => left - right);
}

function resolveConfiguredModel(provider: SupportedProviderName, model?: string): string {
  if (typeof model === 'string' && model.trim().length > 0) {
    return model.trim();
  }

  switch (provider) {
    case 'voyage':
      return process.env.VOYAGE_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS.voyage;
    case 'openai':
      return process.env.OPENAI_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS.openai;
    case 'ollama':
      return process.env.OLLAMA_EMBEDDINGS_MODEL || resolveActiveOllamaEmbedder()?.name || DEFAULT_PROVIDER_MODELS.ollama;
    case 'hf-local':
    default:
      return process.env.HF_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS['hf-local'];
  }
}

function isSupportedProviderName(value: string): value is ConfiguredProviderName {
  return SUPPORTED_PROVIDER_SET.has(value);
}

function toSupportedProviderName(provider: string): SupportedProviderName {
  const normalized = normalizeProviderName(provider);
  if (!normalized || normalized === 'auto' || !isSupportedProviderName(normalized)) {
    throw new Error(`Invalid EMBEDDINGS_PROVIDER "${provider}". Supported: ${SUPPORTED_PROVIDERS.join(', ')}`);
  }
  return normalized as SupportedProviderName;
}

function allowsAutomaticFallback(provider: string | undefined): boolean {
  const normalized = normalizeProviderName(provider);
  return normalized === null || normalized === 'auto';
}

function buildProviderConfigFingerprint(provider: string): string {
  return JSON.stringify({
    provider,
    EMBEDDINGS_PROVIDER: process.env.EMBEDDINGS_PROVIDER || '',
    VOYAGE_API_KEY: process.env.VOYAGE_API_KEY || '',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL || '',
    OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || '',
    HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || '',
    HF_EMBEDDINGS_DTYPE: process.env.HF_EMBEDDINGS_DTYPE || '',
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || '',
    OLLAMA_EMBEDDINGS_MODEL: process.env.OLLAMA_EMBEDDINGS_MODEL || '',
    MEMORY_DB_PATH: process.env.MEMORY_DB_PATH || '',
    SPEC_KIT_DB_DIR: process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || '',
  });
}

function resolveSpecKitPackageRoot(): string | null {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));
  while (currentDir !== path.dirname(currentDir)) {
    if (
      existsSync(path.join(currentDir, 'mcp_server', 'database'))
      && existsSync(path.join(currentDir, 'scripts'))
      && existsSync(path.join(currentDir, 'shared'))
    ) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return null;
}

interface ActiveOllamaEmbedder {
  name: string;
  dim: number;
  dbPath: string;
}

interface ActiveEmbedderMetadata {
  provider: string;
  name: string;
  dim: number;
  dbPath: string;
}

const activeOllamaWarnings = new Set<string>();
const hfLocalDimensionDriftWarnings = new Set<string>();

function warnActiveOllamaFallback(message: string): void {
  if (activeOllamaWarnings.has(message)) {
    return;
  }
  activeOllamaWarnings.add(message);
  console.warn(`[factory] ${message}`);
}

function quoteSqlIdentifier(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

interface SqliteStatement {
  get(...params: readonly unknown[]): Record<string, unknown> | undefined;
}

interface SqliteDatabase {
  prepare(sql: string): SqliteStatement;
  close(): void;
}

type DatabaseSyncConstructor = new (
  filename: string,
  options: { readOnly: boolean },
) => SqliteDatabase;

let databaseSyncConstructor: DatabaseSyncConstructor | null | undefined;

function loadDatabaseSync(): DatabaseSyncConstructor | null {
  if (databaseSyncConstructor !== undefined) {
    return databaseSyncConstructor;
  }

  try {
    const sqliteModule = require('node:sqlite') as unknown;
    const DatabaseSync = typeof sqliteModule === 'object' && sqliteModule !== null
      ? (sqliteModule as { DatabaseSync?: unknown }).DatabaseSync
      : undefined;
    if (typeof DatabaseSync !== 'function') {
      throw new Error('DatabaseSync export is unavailable');
    }

    databaseSyncConstructor = DatabaseSync as DatabaseSyncConstructor;
    return databaseSyncConstructor;
  } catch (error: unknown) {
    databaseSyncConstructor = null;
    warnActiveOllamaFallback(
      `node:sqlite is unavailable for active-embedder metadata reads (${getErrorMessage(error)}); continuing provider cascade.`,
    );
    return null;
  }
}

function querySqliteScalar(sqlitePath: string, sql: string, params: readonly unknown[] = []): string | null {
  const DatabaseSync = loadDatabaseSync();
  if (DatabaseSync === null) {
    return null;
  }

  let db: SqliteDatabase | null = null;
  try {
    db = new DatabaseSync(sqlitePath, { readOnly: true });
    const row = db.prepare(sql).get(...params);
    if (!row) {
      return null;
    }

    const value = Object.values(row)[0];
    if (value === null || value === undefined) {
      return null;
    }

    const scalar = String(value).trim();
    return scalar.length > 0 ? scalar : null;
  } catch (error: unknown) {
    warnActiveOllamaFallback(
      `Failed to read active-embedder metadata from ${sqlitePath}: ${getErrorMessage(error)}; continuing provider cascade.`,
    );
    return null;
  } finally {
    try {
      db?.close();
    } catch (error: unknown) {
      warnActiveOllamaFallback(
        `Failed to close SQLite metadata database ${sqlitePath}: ${getErrorMessage(error)}; continuing provider cascade.`,
      );
    }
  }
}

function readVecMetadataValue(sqlitePath: string, key: string): string | null {
  return querySqliteScalar(
    sqlitePath,
    'SELECT value FROM vec_metadata WHERE key = ? LIMIT 1;',
    [key],
  );
}

function tableExistsInSqlite(sqlitePath: string, tableName: string): boolean {
  return querySqliteScalar(
    sqlitePath,
    "SELECT COUNT(*) FROM sqlite_master WHERE type = 'table' AND name = ?;",
    [tableName],
  ) === '1';
}

function countRowsInSqliteTable(sqlitePath: string, tableName: string): number | null {
  const output = querySqliteScalar(sqlitePath, `SELECT COUNT(*) FROM ${quoteSqlIdentifier(tableName)};`);
  if (output === null) {
    return null;
  }
  const parsed = Number.parseInt(output, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveConfiguredDatabaseCandidates(): string[] {
  const candidates: string[] = [];

  if (process.env.MEMORY_DB_PATH?.trim()) {
    return [path.resolve(process.cwd(), process.env.MEMORY_DB_PATH.trim())];
  }

  const configuredDir = process.env.SPEC_KIT_DB_DIR?.trim() || process.env.SPECKIT_DB_DIR?.trim();
  const packageRoot = resolveSpecKitPackageRoot();
  const databaseDirs = [
    configuredDir ? path.resolve(process.cwd(), configuredDir) : null,
    !configuredDir && packageRoot ? path.join(packageRoot, 'mcp_server', 'database') : null,
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);

  for (const databaseDir of databaseDirs) {
    if (!existsSync(databaseDir)) {
      continue;
    }
    try {
      for (const filename of readdirSync(databaseDir)) {
        if (filename.endsWith('.sqlite')) {
          candidates.push(path.join(databaseDir, filename));
        }
      }
    } catch (_error: unknown) {
      // Ignore unreadable database directories; provider resolution can still use env.
    }
  }

  return Array.from(new Set(candidates));
}

function readActiveOllamaEmbedderFromDb(sqlitePath: string): ActiveOllamaEmbedder | null {
  if (!existsSync(sqlitePath) || !tableExistsInSqlite(sqlitePath, 'vec_metadata')) {
    return null;
  }

  const name = readVecMetadataValue(sqlitePath, 'active_embedder_name');
  const dimRaw = readVecMetadataValue(sqlitePath, 'active_embedder_dim');
  const provider = normalizeProviderName(readVecMetadataValue(sqlitePath, 'active_embedder_provider')) ?? 'ollama';
  const dim = typeof dimRaw === 'string' ? Number.parseInt(dimRaw, 10) : NaN;

  if (!name || !Number.isInteger(dim) || dim <= 0) {
    return null;
  }

  const manifest = getOllamaManifest(name);
  if (!manifest) {
    return null;
  }
  if (manifest.dim !== dim) {
    warnActiveOllamaFallback(
      `Active embedder ${name} has metadata dim ${dim}, but its manifest dim is ${manifest.dim}; continuing provider cascade.`,
    );
    return null;
  }

  const expectedTable = `vec_${dim}`;

  // The dim-tagged table moved out of the
  // main metadata DB and into a per-embedder shard at <db_dir>/vectors/. We accept
  // either location: main DB first (legacy layout), then the shard.
  let tableSource: string | null = null;
  if (tableExistsInSqlite(sqlitePath, expectedTable)) {
    tableSource = sqlitePath;
  } else {
    const shardPath = path.join(
      path.dirname(sqlitePath),
      'vectors',
      `context-vectors__${createProfileSlug(provider, manifest.name, dim)}.sqlite`,
    );
    if (existsSync(shardPath) && tableExistsInSqlite(shardPath, expectedTable)) {
      tableSource = shardPath;
    }
  }

  if (tableSource === null) {
    warnActiveOllamaFallback(
      `Active embedder ${name} points to ${expectedTable}, but that table is missing in ${sqlitePath} (and no matching shard under vectors/); continuing provider cascade.`,
    );
    return null;
  }

  const rowCount = countRowsInSqliteTable(tableSource, 'vec_memories_rowids');
  if (rowCount === null || rowCount <= 0) {
    warnActiveOllamaFallback(
      `Active embedder ${name} points to ${expectedTable}, but vec_memories_rowids is empty or missing in ${tableSource}; continuing provider cascade.`,
    );
    return null;
  }

  return {
    name: manifest.name,
    dim: manifest.dim,
    dbPath: sqlitePath,
  };
}

function readActiveEmbedderMetadataFromDb(sqlitePath: string): ActiveEmbedderMetadata | null {
  if (!existsSync(sqlitePath) || !tableExistsInSqlite(sqlitePath, 'vec_metadata')) {
    return null;
  }

  const name = readVecMetadataValue(sqlitePath, 'active_embedder_name');
  const dimRaw = readVecMetadataValue(sqlitePath, 'active_embedder_dim');
  const provider = normalizeProviderName(readVecMetadataValue(sqlitePath, 'active_embedder_provider')) ?? 'unknown';
  const dim = typeof dimRaw === 'string' ? Number.parseInt(dimRaw, 10) : NaN;

  if (!name || !Number.isInteger(dim) || dim <= 0) {
    return null;
  }

  return {
    provider,
    name,
    dim,
    dbPath: sqlitePath,
  };
}

function resolveActiveOllamaEmbedder(): ActiveOllamaEmbedder | null {
  for (const sqlitePath of resolveConfiguredDatabaseCandidates()) {
    const active = readActiveOllamaEmbedderFromDb(sqlitePath);
    if (active) {
      return active;
    }
  }
  return null;
}

function resolveActiveEmbedderMetadata(): ActiveEmbedderMetadata | null {
  for (const sqlitePath of resolveConfiguredDatabaseCandidates()) {
    const active = readActiveEmbedderMetadataFromDb(sqlitePath);
    if (active) {
      return active;
    }
  }
  return null;
}

// Compare a resolved hf-local dimension against the persisted vec_metadata active
// embedder and warn once per distinct drift. Shared by the create-time check (canonical
// model, dim known at construction) and the first-embed callback (custom model, dim only
// known after the server reports it — see createProviderInstance's onDimensionResolved).
function reportHfLocalDimensionDrift(resolvedDim: number, model: string): boolean {
  if (!Number.isInteger(resolvedDim) || resolvedDim <= 0) {
    return false;
  }

  const active = resolveActiveEmbedderMetadata();
  if (!active || active.dim === resolvedDim) {
    return false;
  }

  const key = [
    active.dbPath,
    active.provider,
    active.name,
    String(active.dim),
    'hf-local',
    model,
    String(resolvedDim),
  ].join(':');
  if (hfLocalDimensionDriftWarnings.has(key)) {
    return true;
  }
  hfLocalDimensionDriftWarnings.add(key);

  console.error(
    `[factory] WARNING: hf-local resolved embedding dimension differs from vec_metadata active embedder: ` +
    `active ${active.provider}/${active.name} is ${active.dim}-dim, ` +
    `requested hf-local/${model} is ${resolvedDim}-dim. ` +
    `Vector index may need rebuilding. Existing ${active.dim}-dim vectors are incompatible with ${resolvedDim}-dim vectors.`,
  );
  return true;
}

// Create-time check: only fires for models whose dim is known at construction (the
// canonical default). Custom HF_EMBEDDINGS_MODEL values resolve dim=0 until first embed,
// so their drift is caught by the onDimensionResolved callback, not here.
function warnIfHfLocalDimensionDrift(provider: IEmbeddingProvider): boolean {
  const metadata = provider.getMetadata();
  return reportHfLocalDimensionDrift(metadata.dim, metadata.model);
}

function setLastProviderFactoryMetadata(metadata: ProviderFactoryMetadata): void {
  lastProviderFactoryMetadata = metadata;
  lastProviderFactoryFingerprint = buildProviderConfigFingerprint(metadata.requestedProvider);
}

function getProviderFactoryMetadataForCurrentConfig(resolution: ProviderResolution): ProviderFactoryMetadata {
  const fingerprint = buildProviderConfigFingerprint(resolution.name);
  if (lastProviderFactoryMetadata && lastProviderFactoryFingerprint === fingerprint) {
    return lastProviderFactoryMetadata;
  }

  return {
    requestedProvider: resolution.name,
    effectiveProvider: resolution.name,
    dimensionChanged: false,
  };
}

function attachFactoryMetadata(provider: IEmbeddingProvider, metadata: ProviderFactoryMetadata): IEmbeddingProvider {
  Object.assign(provider as IEmbeddingProvider & { factoryMetadata?: ProviderFactoryMetadata }, {
    factoryMetadata: metadata,
  });
  setLastProviderFactoryMetadata(metadata);
  return provider;
}

function getProviderInfoForResolution(resolution: ProviderResolution): ProviderInfoWithFallback {
  const explicitProvider = validateConfiguredEmbeddingsProvider();
  const metadata = getProviderFactoryMetadataForCurrentConfig(resolution);
  const reason = metadata.fallbackReason
    ? `Fallback from ${metadata.requestedProvider} to ${metadata.effectiveProvider}: ${metadata.fallbackReason}`
    : resolution.reason;

  // Surface accidental Voyage drift at the first provider resolution.
  warnIfVoyageDriftDetected(metadata.effectiveProvider);

  return {
    provider: metadata.effectiveProvider,
    requestedProvider: metadata.requestedProvider,
    effectiveProvider: metadata.effectiveProvider,
    fallbackReason: metadata.fallbackReason,
    dimensionChanged: metadata.dimensionChanged,
    reason,
    config: {
      EMBEDDINGS_PROVIDER: explicitProvider || 'auto',
      VOYAGE_API_KEY: process.env.VOYAGE_API_KEY ? '***set***' : 'not set',
      VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS.voyage,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***set***' : 'not set',
      OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS.openai,
      HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || DEFAULT_PROVIDER_MODELS['hf-local'],
      OLLAMA_BASE_URL: resolveOllamaBaseUrl(),
      OLLAMA_EMBEDDINGS_MODEL: process.env.OLLAMA_EMBEDDINGS_MODEL || resolveActiveOllamaEmbedder()?.name || DEFAULT_PROVIDER_MODELS.ollama,
    },
  };
}

export function validateConfiguredEmbeddingsProvider(value: string | undefined = process.env.EMBEDDINGS_PROVIDER): ConfiguredProviderName | null {
  const normalized = normalizeProviderName(value);
  if (!normalized) {
    warnIfVoyageWouldShadowLocal(null);
    return null;
  }

  // Startup: fail-fast on unsupported provider names
  if (!isSupportedProviderName(normalized)) {
    throw new Error(`Invalid EMBEDDINGS_PROVIDER "${value}". Supported: ${SUPPORTED_PROVIDERS.join(', ')}`);
  }

  warnIfVoyageWouldShadowLocal(normalized);
  return normalized;
}

export function resolveProviderDimension(
  provider: string,
  options: Pick<CreateProviderOptions, 'model' | 'dim'> = {},
): number {
  const supportedProvider = toSupportedProviderName(provider);
  const dimensionsByModel: Readonly<Record<string, number>> = VALID_PROVIDER_DIMENSIONS[supportedProvider];
  const configuredDim = typeof options.dim === 'number' && Number.isFinite(options.dim) && options.dim > 0
    ? Math.trunc(options.dim)
    : null;

  if (configuredDim !== null) {
    return configuredDim;
  }

  const configuredModel = resolveConfiguredModel(supportedProvider, options.model);
  const modelDimension = dimensionsByModel[configuredModel];
  if (typeof modelDimension === 'number') {
    return modelDimension;
  }

  // Local model menus are intentionally nomic-only, but user-set unlisted
  // local overrides remain valid. Startup needs a provisional dimension for
  // metadata; the local provider locks to the first returned vector length.
  if (supportedProvider === 'hf-local' || supportedProvider === 'ollama') {
    const defaultDimension = dimensionsByModel[DEFAULT_PROVIDER_MODELS[supportedProvider]];
    if (typeof defaultDimension === 'number') {
      return defaultDimension;
    }
  }

  const [fallbackDimension] = getValidDimensionsForProvider(supportedProvider);
  return dimensionsByModel[DEFAULT_PROVIDER_MODELS[supportedProvider]] ?? fallbackDimension;
}

function resolveStartupEmbeddingDimension(resolution: ProviderResolution): number {
  if (process.env.EMBEDDING_DIM) {
    const explicitDimension = parseInt(process.env.EMBEDDING_DIM, 10);
    if (Number.isFinite(explicitDimension) && explicitDimension > 0) {
      return explicitDimension;
    }
  }

  return resolveProviderDimension(resolution.name);
}

export function getStartupEmbeddingDimension(): number {
  warnIfVoyageWouldShadowLocal(validateConfiguredEmbeddingsProvider());
  return resolveStartupEmbeddingDimension(resolveProvider());
}

export function getStartupEmbeddingProfile(): EmbeddingProfile {
  warnIfVoyageWouldShadowLocal(validateConfiguredEmbeddingsProvider());
  const resolution = resolveProvider();
  const provider = toSupportedProviderName(resolution.name);
  const model = resolveConfiguredModel(provider);
  const dim = resolveStartupEmbeddingDimension(resolution);

  const profile = new EmbeddingProfile({
    provider,
    model: provider === 'ollama'
        ? resolveOllamaCanonicalModel(model)
        : model,
    dim,
    dtype: provider === 'hf-local'
      ? resolveHfLocalDtype()
      : resolveActiveProfileDtype(provider),
    baseUrl: provider === 'voyage'
      ? resolveVoyageBaseUrl()
      : provider === 'ollama'
        ? resolveOllamaBaseUrl()
        : null,
  });
  return profile;
}

export async function resolveStartupEmbeddingConfig(
  options: Pick<ValidateApiKeyOptions, 'timeout'> = {},
): Promise<StartupEmbeddingConfig> {
  warnIfVoyageWouldShadowLocal(validateConfiguredEmbeddingsProvider());
  const resolution = resolveProvider();
  const validation = await validateApiKey({
    timeout: options.timeout,
    provider: resolution.name as SupportedProviderName,
  });

  return {
    resolution,
    info: getProviderInfoForResolution(resolution),
    dimension: resolveStartupEmbeddingDimension(resolution),
    validation,
  };
}

// ---------------------------------------------------------------
// 1. PROVIDER RESOLUTION
// ---------------------------------------------------------------

/**
 * Resolve provider based on env vars. Local-first precedence:
 * 1) explicit EMBEDDINGS_PROVIDER (the only way to auto-select cloud),
 * 2) persisted vec_metadata active Ollama pointer,
 * 3) hf-local local fallback.
 * Cloud (OpenAI/Voyage) is never auto-selected; it is reached only via an explicit
 * EMBEDDINGS_PROVIDER, or as a last-resort cascade when hf-local creation fails
 * (getCascadeFallbackOrder). Mirrors the bootstrap auto-select cascade order
 * ollama -> hf-local -> openai -> voyage.
 */
export function resolveProvider(): ProviderResolution {
  const explicitProvider = getExplicitProviderOverride();
  if (explicitProvider && explicitProvider !== 'auto') {
    return {
      name: explicitProvider,
      reason: 'Explicit EMBEDDINGS_PROVIDER variable',
    };
  }

  const activeOllamaEmbedder = resolveActiveOllamaEmbedder();
  if (activeOllamaEmbedder) {
    return {
      name: 'ollama',
      reason: `vec_metadata active_embedder_name=${activeOllamaEmbedder.name} (${activeOllamaEmbedder.dim}-dim)`,
    };
  }

  // Local-first: in auto mode prefer the local hf-local model server over cloud
  // providers. Cloud (OpenAI/Voyage) is opt-in — set EMBEDDINGS_PROVIDER explicitly,
  // or it is reached only as a last-resort cascade fallback when hf-local creation
  // fails (see getCascadeFallbackOrder). Auto-mode egress therefore stays local by
  // default: ollama when persisted/reachable, otherwise hf-local. This mirrors the
  // bootstrap auto-select cascade and the creation-failure cascade, which already
  // order ollama -> hf-local -> openai -> voyage.
  return {
    name: 'hf-local',
    reason: 'Local fallback provider',
  };
}

/**
 * Lightweight ollama-server reachability probe. resolveProvider()'s ollama branch is a one-shot
 * DB read (resolveActiveOllamaEmbedder) with no server probe, so a transient DB-gate miss — e.g.
 * post-crash WAL contention, or the vec shard mid-write — silently demotes to the hf-local
 * fallback even when ollama is healthy and reachable. createEmbeddingsProvider and getProvider use
 * this to prefer/recover ollama in that case. Returns false on any error (treat as unreachable).
 */
export async function isOllamaReachable(timeoutMs = 1500): Promise<boolean> {
  const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/+$/, '');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl}/api/version`, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function createProviderInstance(
  providerName: SupportedProviderName,
  options: CreateProviderOptions,
): Promise<IEmbeddingProvider> {
  switch (providerName) {
    case 'voyage':
      if (!process.env.VOYAGE_API_KEY && !options.apiKey) {
        throw new Error(
          'Voyage provider requires VOYAGE_API_KEY. ' +
          'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
        );
      }
      if (options.maxTextLength) {
        console.warn('[factory] VoyageProvider does not support maxTextLength option - ignored');
      }
      return new VoyageProvider({
        model: options.model,
        dim: options.dim,
        apiKey: options.apiKey,
        baseUrl: options.baseUrl,
        timeout: options.timeout,
      });

    case 'openai':
      if (!process.env.OPENAI_API_KEY && !options.apiKey) {
        throw new Error(
          'OpenAI provider requires OPENAI_API_KEY. ' +
          'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
        );
      }
      if (options.maxTextLength) {
        console.warn('[factory] OpenAIProvider does not support maxTextLength option - ignored');
      }
      return new OpenAIProvider({
        model: options.model,
        dim: options.dim,
        apiKey: options.apiKey,
        baseUrl: options.baseUrl,
        timeout: options.timeout,
      });

    case 'hf-local':
      if (options.baseUrl) {
        console.warn('[factory] HfLocalProvider does not support baseUrl option - ignored');
      }
      return new HfLocalProvider({
        model: options.model,
        dim: options.dim,
        dtype: options.dtype,
        maxTextLength: options.maxTextLength,
        timeout: options.timeout,
        // Catch dim drift for custom models, whose true dim is only known at first embed.
        onDimensionResolved: (resolvedDim, model) => {
          reportHfLocalDimensionDrift(resolvedDim, model);
        },
      });

    case 'ollama': {
      const model = resolveConfiguredModel('ollama', options.model);
      if (options.apiKey) {
        console.warn('[factory] OllamaProvider does not support apiKey option - ignored');
      }
      if (options.dtype) {
        console.warn('[factory] OllamaProvider does not support dtype option - ignored');
      }
      const availability = await OllamaProvider.canLoad({
        model,
        baseUrl: options.baseUrl,
        timeout: options.timeout,
      });
      if (!availability.available) {
        throw new Error(availability.reason || 'Ollama availability probe failed');
      }
      return new OllamaProvider({
        model,
        dim: options.dim,
        baseUrl: options.baseUrl,
        maxTextLength: options.maxTextLength,
        timeout: options.timeout,
      });
    }

    default:
      throw new Error(
        `Unknown provider: ${providerName}. ` +
        `Valid values: ${SUPPORTED_PROVIDERS.join(', ')}`
      );
  }
}

function buildProviderValidationCacheKey(options: ValidateApiKeyOptions): string {
  const provider = options.provider || 'hf-local';
  const apiKey = options.apiKey
    || (provider === 'voyage' ? process.env.VOYAGE_API_KEY : process.env.OPENAI_API_KEY)
    || '';
  const baseUrl = options.baseUrl
    || (provider === 'voyage'
      ? resolveVoyageBaseUrl()
      : provider === 'ollama'
        ? resolveOllamaBaseUrl()
        : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'));
  const model = resolveConfiguredModel(provider, options.model);

  return JSON.stringify({ provider, apiKey, baseUrl, model });
}

async function ensureCloudProviderValidated(options: ValidateApiKeyOptions): Promise<ApiKeyValidationResult> {
  const providerName = options.provider;
  if (!providerName || providerName === 'hf-local' || providerName === 'ollama') {
    return {
      valid: true,
      provider: providerName || 'hf-local',
      reason: 'Local provider - no API key required',
    };
  }

  const cacheKey = buildProviderValidationCacheKey(options);
  let validationPromise = providerValidationCache.get(cacheKey);
  if (!validationPromise) {
    validationPromise = validateApiKey(options);
    providerValidationCache.set(cacheKey, validationPromise);
  }

  const validation = await validationPromise;
  if (!validation.valid && !validation.networkError) {
    throw new Error(validation.error || `${providerName} API key validation failed`);
  }

  if (validation.networkError && validation.error) {
    console.warn(`[factory] API key validation warning for ${providerName}: ${validation.error}`);
  }

  return validation;
}

function getCascadeFallbackOrder(failedProvider: SupportedProviderName): SupportedProviderName[] {
  // Local-first cascade. When a provider fails at creation
  // time, fall through in the order Ollama -> hf-local -> OpenAI -> Voyage. The
  // ollama-specific short list keeps the legacy local-only progression.
  const cascadeOrder: SupportedProviderName[] = failedProvider === 'ollama'
    ? ['ollama', 'hf-local']
    : ['ollama', 'hf-local', 'openai', 'voyage'];
  const failedIndex = cascadeOrder.indexOf(failedProvider);
  return failedIndex === -1 ? [] : cascadeOrder.slice(failedIndex + 1);
}

function buildCascadeFallbackOptions(
  providerName: SupportedProviderName,
  options: CreateProviderOptions,
): CreateProviderOptions {
  const fallbackOptions: CreateProviderOptions = {
    maxTextLength: options.maxTextLength,
    timeout: options.timeout,
    warmup: options.warmup,
  };

  if (providerName === 'hf-local') {
    fallbackOptions.dtype = options.dtype;
  }

  return fallbackOptions;
}

function shouldSkipCascadeProvider(providerName: SupportedProviderName): string | null {
  if (providerName === 'voyage' && !process.env.VOYAGE_API_KEY) {
    return 'VOYAGE_API_KEY is not set';
  }

  if (providerName === 'openai' && !process.env.OPENAI_API_KEY) {
    return 'OPENAI_API_KEY is not set';
  }

  return null;
}

async function createFallbackProvider(
  requestedProvider: SupportedProviderName,
  options: CreateProviderOptions,
  fallbackReason: string,
  requestedDim: number,
): Promise<IEmbeddingProvider> {
  const fallbackOrder = getCascadeFallbackOrder(requestedProvider);
  const failures: string[] = [];

  for (const fallbackProvider of fallbackOrder) {
    const skipReason = shouldSkipCascadeProvider(fallbackProvider);
    if (skipReason) {
      console.warn(`[factory] Skipping fallback candidate ${fallbackProvider}: ${skipReason}`);
      continue;
    }

    console.warn(`[factory] Attempting cascade fallback from ${requestedProvider} to ${fallbackProvider}...`);
    const fallbackOptions = buildCascadeFallbackOptions(fallbackProvider, options);

    try {
      await ensureCloudProviderValidated({
        provider: fallbackProvider,
        timeout: options.timeout,
      });

      const provider = await createProviderInstance(fallbackProvider, fallbackOptions);
      const fallbackDim = provider.getMetadata().dim;
      const dimensionChanged = requestedDim !== fallbackDim;

      if (dimensionChanged) {
        console.error(
          `[factory] WARNING: Provider fallback changed embedding dimension from ${requestedDim} to ${fallbackDim}. ` +
          `Vector index may need rebuilding. Existing ${requestedDim}-dim vectors are incompatible with ${fallbackDim}-dim vectors.`
        );
      }

      if (options.warmup) {
        try {
          await provider.warmup();
        } catch (fallbackWarmupError: unknown) {
          if (fallbackWarmupError instanceof Error) {
            void fallbackWarmupError.message;
          }
          console.warn(`[factory] Fallback warmup failed for ${fallbackProvider}: ${getErrorMessage(fallbackWarmupError)}`);
          // Continue anyway - provider will attempt lazy initialization on first use
        }
      }

      return attachFactoryMetadata(provider, {
        requestedProvider,
        effectiveProvider: fallbackProvider,
        fallbackReason,
        dimensionChanged,
      });
    } catch (fallbackError: unknown) {
      failures.push(`${fallbackProvider}: ${getErrorMessage(fallbackError)}`);
      console.warn(`[factory] Cascade fallback candidate ${fallbackProvider} failed: ${getErrorMessage(fallbackError)}`);
    }
  }

  throw new Error(
    `Provider fallback failed after ${requestedProvider} error (${fallbackReason}). ` +
    `Cascade attempts: ${failures.length > 0 ? failures.join('; ') : 'none'}`,
  );
}

// ---------------------------------------------------------------
// 2. PROVIDER FACTORY
// ---------------------------------------------------------------

/** Create provider instance based on configuration */
export async function createEmbeddingsProvider(options: CreateProviderOptions = {}): Promise<IEmbeddingProvider> {
  const resolution = resolveProvider();
  // Auto-mode recovery: resolveProvider()'s ollama branch is a DB-only gate with no server probe,
  // so a transient miss demotes to the hf-local fallback even when ollama is up. If that happened,
  // probe ollama directly and prefer it (local-first) rather than the unhealthy fallback.
  const effectiveResolution =
    (options.provider === 'auto' || !options.provider)
    && resolution.name === 'hf-local'
    && resolution.reason === 'Local fallback provider'
    && (await isOllamaReachable())
      ? { name: 'ollama', reason: 'ollama reachable (auto fallback recovery)' }
      : resolution;
  const providerName: SupportedProviderName = options.provider === 'auto' || !options.provider
    ? (effectiveResolution.name as SupportedProviderName)
    : toSupportedProviderName(options.provider);
  const requestedDim = resolveProviderDimension(providerName, {
    model: options.model,
    dim: options.dim,
  });

  console.error(`[factory] Using provider: ${providerName} (${effectiveResolution.reason})`);

  try {
    await ensureCloudProviderValidated({
      provider: providerName,
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      model: options.model,
      timeout: options.timeout,
    });

    const provider = await createProviderInstance(providerName, options);

    if (options.warmup) {
      console.error(`[factory] Warming up ${providerName}...`);
      const success = await provider.warmup();
      if (!success) {
        console.warn(`[factory] Warmup failed for ${providerName}`);

        if ((providerName === 'openai' || providerName === 'voyage' || providerName === 'ollama') && allowsAutomaticFallback(options.provider)) {
          return createFallbackProvider(
            providerName,
            options,
            `warmup failed for ${providerName}`,
            requestedDim,
          );
        }
      }
    }

    const dimensionChanged = providerName === 'hf-local'
      ? warnIfHfLocalDimensionDrift(provider)
      : false;

    return attachFactoryMetadata(provider, {
      requestedProvider: providerName,
      effectiveProvider: providerName,
      dimensionChanged,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      void error.message;
    }
    console.error(`[factory] Error creating provider ${providerName}:`, getErrorMessage(error));

    // Resume the auto cascade when the selected backend is unavailable. hf-local is
    // included so a hard local failure falls through to cloud (openai -> voyage) per
    // getCascadeFallbackOrder, preserving cloud as the last-resort fallback tier.
    if ((providerName === 'openai' || providerName === 'voyage' || providerName === 'ollama' || providerName === 'hf-local') && allowsAutomaticFallback(options.provider)) {
      return createFallbackProvider(
        providerName,
        options,
        getErrorMessage(error),
        requestedDim,
      );
    }

    throw error;
  }
}

// ---------------------------------------------------------------
// 3. PROVIDER INFO
// ---------------------------------------------------------------

/** Get configuration information without creating the provider */
export function getProviderInfo(): ProviderInfoWithFallback {
  return getProviderInfoForResolution(resolveProvider());
}

// ---------------------------------------------------------------
// 4. PRE-FLIGHT API KEY VALIDATION
// ---------------------------------------------------------------

/**
 * Validation timeout in milliseconds.
 * Must complete within 5s.
 */
export const VALIDATION_TIMEOUT_MS: number = 5000;

/**
 * Validate API key at startup before any tool usage.
 * Pre-flight API key validation.
 *
 * This function should be called during MCP server startup to fail fast
 * if the configured embedding provider has an invalid API key.
 */
export async function validateApiKey(options: ValidateApiKeyOptions = {}): Promise<ApiKeyValidationResult> {
  const timeoutMs = options.timeout || VALIDATION_TIMEOUT_MS;
  if (!options.provider) {
    warnIfVoyageWouldShadowLocal(validateConfiguredEmbeddingsProvider());
  }
  const providerName: SupportedProviderName = options.provider || (resolveProvider().name as SupportedProviderName);

  // Local providers don't need API key validation
  if (providerName === 'hf-local' || providerName === 'ollama') {
    return {
      valid: true,
      provider: providerName,
      reason: 'Local provider - no API key required',
    };
  }

  // Check that API key environment variable is set
  const apiKey = options.apiKey || (providerName === 'voyage'
    ? process.env.VOYAGE_API_KEY
    : process.env.OPENAI_API_KEY);

  if (!apiKey) {
    return {
      valid: false,
      provider: providerName,
      error: `${providerName.toUpperCase()}_API_KEY environment variable not set`,
      errorCode: 'E050',
      actions: [
        `Set ${providerName.toUpperCase()}_API_KEY environment variable`,
        'Or use EMBEDDINGS_PROVIDER=hf-local to use local model',
        `Check provider dashboard: ${providerName === 'voyage' ? 'voyage.ai/dashboard' : 'platform.openai.com/api-keys'}`,
      ],
    };
  }

  // Attempt a lightweight API call with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const baseUrl = options.baseUrl || (providerName === 'voyage'
      ? resolveVoyageBaseUrl()
      : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'));

    const model = resolveConfiguredModel(providerName, options.model);

    const body: Record<string, unknown> = {
      input: 'api key validation test',
      model: model,
    };

    // Voyage uses input_type for optimization
    if (providerName === 'voyage') {
      body.input_type = 'query';
    } else {
      body.encoding_format = 'float';
    }

    const response = await fetch(`${baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const errorBody = parseValidationErrorBody(errorPayload);
      const errorMessage = errorBody.detail
        || errorBody.error?.message
        || response.statusText;

      // Detect specific authentication errors
      const isAuthError = response.status === 401 || response.status === 403;
      const isRateLimit = response.status === 429;

      if (isAuthError) {
        return {
          valid: false,
          provider: providerName,
          error: `API key invalid or unauthorized: ${errorMessage}`,
          errorCode: 'E050',
          httpStatus: response.status,
          actions: [
            `Verify API key is correct in ${providerName.toUpperCase()}_API_KEY`,
            `Check key validity at ${providerName === 'voyage' ? 'voyage.ai/dashboard' : 'platform.openai.com/api-keys'}`,
            'Ensure key has embedding permissions enabled',
          ],
        };
      }

      if (isRateLimit) {
        // Rate limit during validation still means the key is valid
        return {
          valid: true,
          provider: providerName,
          warning: 'API key valid but rate limited - may affect operations',
          httpStatus: response.status,
        };
      }

      // Other errors (500, etc.) - key might be valid, service issue
      return {
        valid: true,
        provider: providerName,
        warning: `Service returned error (${response.status}): ${errorMessage}`,
        httpStatus: response.status,
      };
    }

    return {
      valid: true,
      provider: providerName,
      reason: 'API key validated successfully',
    };

  } catch (error: unknown) {
    if (error instanceof Error) {
      void error.message;
    }
    clearTimeout(timeoutId);

    if (isAbortError(error)) {
      return {
        valid: false,
        provider: providerName,
        error: `API key validation timed out after ${timeoutMs}ms`,
        errorCode: 'E053',
        networkError: true,
        actions: [
          'Check network connectivity',
          'Retry startup - may be transient',
          'Consider using local model: EMBEDDINGS_PROVIDER=hf-local',
        ],
      };
    }

    // Network errors - can't determine key validity
    return {
      valid: false,
      provider: providerName,
      error: `Network error during validation: ${getErrorMessage(error)}`,
      errorCode: 'E053',
      networkError: true,
      actions: [
        'Check internet connectivity',
        'Verify firewall allows outbound HTTPS',
        'Retry startup - may be transient',
      ],
    };
  }
}
