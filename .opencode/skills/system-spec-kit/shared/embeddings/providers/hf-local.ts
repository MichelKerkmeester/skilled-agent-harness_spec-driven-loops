// ───────────────────────────────────────────────────────────────────
// MODULE: HF Local
// ───────────────────────────────────────────────────────────────────

import { existsSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import type { IncomingMessage, RequestOptions } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ALLOWED_HF_LOCAL_DTYPES, EmbeddingProfile, normalizeProfileDtype } from '../profile.js';
import { getCanonicalFallback } from '../registry.js';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking.js';
import type { IEmbeddingProvider, ProviderMetadata, TaskPrefixMap } from '../../types.js';

// ---------------------------------------------------------------
// 1. CONFIGURATION
// ---------------------------------------------------------------

// Derived from registry MANIFESTS[0] (single source of truth).
const DEFAULT_MODEL: string = getCanonicalFallback('hf-local');
// Provisional dimension for the canonical default model (nomic = 768), so getMetadata().dim is
// meaningful before the server is reached. The server-reported dim (adoptEmbeddingDimension)
// overrides it at runtime; unlisted user models start at 0 and adopt their dim from the server.
const CANONICAL_DEFAULT_DIM = 768;
const EMBEDDING_TIMEOUT: number = 30000;
const DEFAULT_READY_TIMEOUT: number = 45000;
const DEFAULT_LOADING_TIMEOUT: number = 150000;
const DEFAULT_HEALTH_TIMEOUT: number = 5000;
const READY_RETRY_INITIAL_DELAY: number = 100;
const READY_RETRY_MAX_DELAY: number = 1000;
const DEFAULT_READY_LATCH_TTL_MS: number = 30000;
const MAX_READY_LATCH_TTL_MS: number = 120000;
const SOCKET_FILE_NAME = 'hf-embed.sock';

// Task prefixes required by nomic-embed-text-v1.5
// See: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5
// NOTE: legacy compatibility export, not the current default, kept for consumers
// (shared/embeddings.ts, shared/index.ts, mcp_server/lib/providers/embeddings.ts).
// New code should call getPrefixFor() instead — see PREFIX_REGISTRY below.
/** Defines task prefix. */
export const TASK_PREFIX: TaskPrefixMap = {
  DOCUMENT: 'search_document: ',
  QUERY: 'search_query: ',
  CLUSTERING: 'clustering: ',
  CLASSIFICATION: 'classification: ',
};

// ---------------------------------------------------------------
// 1b. PREFIX REGISTRY
// ---------------------------------------------------------------
// Model-keyed prefix lookup. The supported local menu is nomic-only; unlisted
// user overrides fall through to an empty prefix unless env overrides are set.
//
// Resolution order (getPrefixFor):
//   1) env override:
//        HF_EMBEDDINGS_PREFIX_DOC   — overrides document prefix for any model
//        HF_EMBEDDINGS_PREFIX_QUERY — overrides query prefix for any model
//      Empty string is a VALID override meaning "no prefix"; `undefined` (unset)
//      means "fall through to the registry".
//   2) PREFIX_REGISTRY entry for the modelId
//   3) empty string '' (safe — no prefix is always valid)
export interface ModelPrefixConfig {
  document?: string;
  query?: string;
}

export const PREFIX_REGISTRY: Readonly<Record<string, Readonly<ModelPrefixConfig>>> = Object.freeze({
  'nomic-ai/nomic-embed-text-v1.5': Object.freeze({
    document: 'search_document: ',
    query: 'search_query: ',
  }),
});

/**
 * Resolve the prefix string for a given (modelId, kind) pair.
 * Returns '' (empty string) as the safe final fallback.
 *
 * @param modelId - HuggingFace model id, e.g. 'nomic-ai/nomic-embed-text-v1.5'
 * @param kind    - 'document' for index-time embeddings, 'query' for search-time embeddings
 */
export function getPrefixFor(modelId: string, kind: 'document' | 'query'): string {
  // 1) env override (distinguish unset vs empty-string)
  const envKey = kind === 'document' ? 'HF_EMBEDDINGS_PREFIX_DOC' : 'HF_EMBEDDINGS_PREFIX_QUERY';
  const envValue = process.env[envKey];
  if (envValue !== undefined) {
    return envValue;
  }

  // 2) registry entry
  const entry = PREFIX_REGISTRY[modelId];
  if (entry) {
    const candidate = entry[kind];
    if (candidate !== undefined) {
      return candidate;
    }
  }

  // 3) safe fallback
  return '';
}

// ---------------------------------------------------------------
// 2. TYPE DEFINITIONS
// ---------------------------------------------------------------

export type HfLocalDtype = 'fp32' | 'fp16' | 'q4' | 'q4f16' | 'q8' | 'int8' | 'uint8' | 'bnb4';

type HfLocalServerState = 'loading' | 'ready' | 'error';
type HfLocalInputType = 'document' | 'query' | 'raw';

interface HfLocalOptions {
  model?: string;
  dim?: number;
  maxTextLength?: number;
  timeout?: number;
  dtype?: HfLocalDtype;
  readyTimeout?: number;
  loadTimeout?: number;
  request?: HfLocalTransport;
  // Fired once per distinct resolved dimension, after the server reports it on first
  // embed. Lets the factory compare a CUSTOM model's true dim (unknown at construction)
  // against the persisted vec_metadata active dim without a provider->factory import cycle.
  onDimensionResolved?: (resolvedDim: number, model: string) => void;
}

interface HfLocalAvailability {
  available: boolean;
  reason?: string;
}

interface HfLocalTcpTarget {
  readonly kind: 'tcp';
  readonly host: string;
  readonly port: number;
}

interface HfLocalSocketTarget {
  readonly kind: 'socket';
  readonly socketPath: string;
}

type HfLocalServerTarget = HfLocalTcpTarget | HfLocalSocketTarget;

interface HfLocalTransportRequest {
  readonly target: HfLocalServerTarget;
  readonly method: 'GET' | 'POST';
  readonly path: string;
  readonly body?: unknown;
  readonly timeoutMs: number;
}

interface HfLocalJsonResponse {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;
}

type HfLocalTransport = (request: HfLocalTransportRequest) => Promise<HfLocalJsonResponse>;
type SleepFn = (ms: number) => Promise<void>;

interface HfLocalHealthResponse {
  readonly state?: unknown;
  readonly model?: unknown;
  readonly dim?: unknown;
  readonly device?: unknown;
  readonly loadTimeMs?: unknown;
  readonly loadStartedAt?: unknown;
  readonly loadProgressAt?: unknown;
  readonly timing?: unknown;
  readonly queueDepth?: unknown;
  readonly error?: unknown;
}

interface HfLocalEmbedResponse {
  readonly embeddings?: unknown;
  readonly dim?: unknown;
  readonly error?: unknown;
}

interface ErrorWithCode extends Error {
  code?: string;
}

// ---------------------------------------------------------------
// 3. HELPERS
// ---------------------------------------------------------------

let currentDevice: string | null = null;
let activeTransport: HfLocalTransport = nodeHttpTransport;
let sleep: SleepFn = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function resolveDtype(explicit?: string): HfLocalDtype {
  const raw = explicit ?? process.env.HF_EMBEDDINGS_DTYPE ?? 'q8';
  const normalized = normalizeProfileDtype(raw);
  if (!normalized || !ALLOWED_HF_LOCAL_DTYPES.includes(normalized)) {
    console.warn(
      `[hf-local] Unknown HF_EMBEDDINGS_DTYPE="${raw}"; falling back to q8. Allowed: ${ALLOWED_HF_LOCAL_DTYPES.join(', ')}`,
    );
    return 'q8';
  }
  return normalized as HfLocalDtype;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function getErrorCode(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return undefined;
  }

  const { code } = error as { code?: unknown };
  return typeof code === 'string' ? code : undefined;
}

function createError(message: string, code?: string): ErrorWithCode {
  const error = new Error(message) as ErrorWithCode;
  if (code) {
    error.code = code;
  }
  return error;
}

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoundedPositiveInteger(value: string | undefined, fallback: number, max: number): number {
  return Math.min(parsePositiveInteger(value, fallback), max);
}

function systemSpecKitRoot(): string {
  let currentDir = path.dirname(fileURLToPath(import.meta.url));
  while (currentDir !== path.dirname(currentDir)) {
    if (existsSync(path.join(currentDir, 'mcp_server')) && existsSync(path.join(currentDir, 'shared'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  const cwdCandidates = [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '.opencode', 'skills', 'system-spec-kit'),
  ];
  for (const candidate of cwdCandidates) {
    if (existsSync(path.join(candidate, 'mcp_server')) && existsSync(path.join(candidate, 'shared'))) {
      return candidate;
    }
  }

  return path.resolve(process.cwd());
}

function defaultDbDir(): string {
  return path.join(systemSpecKitRoot(), 'mcp_server', 'database');
}

function normalizeListenTarget(value: string | undefined): string | null {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const raw = value.trim();
  if (raw.startsWith('tcp://')) {
    return raw;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    const url = new URL(raw);
    return `tcp://${url.hostname}:${url.port || (url.protocol === 'https:' ? '443' : '80')}`;
  }
  if (raw.startsWith('unix://')) {
    return path.resolve(raw.slice('unix://'.length));
  }
  return path.resolve(raw);
}

function parseServerTarget(target: string): HfLocalServerTarget {
  if (!target.startsWith('tcp://')) {
    return {
      kind: 'socket',
      socketPath: target,
    };
  }

  const url = new URL(target);
  const port = Number.parseInt(url.port, 10);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`[hf-local] Invalid HF embed tcp target: ${target}`);
  }

  return {
    kind: 'tcp',
    host: url.hostname || '127.0.0.1',
    port,
  };
}

function resolveHfLocalServerTarget(env: NodeJS.ProcessEnv = process.env): HfLocalServerTarget {
  const explicitTarget = normalizeListenTarget(env.HF_EMBED_SERVER_URL);
  if (explicitTarget) {
    return parseServerTarget(explicitTarget);
  }

  if (env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
    return parseServerTarget(env.SPECKIT_IPC_SOCKET_DIR);
  }

  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
    ? path.resolve(env.SPECKIT_IPC_SOCKET_DIR)
    : path.resolve(env.SPEC_KIT_DB_DIR ?? env.SPECKIT_DB_DIR ?? defaultDbDir());

  return parseServerTarget(path.join(socketDir, SOCKET_FILE_NAME));
}

function formatServerTarget(target: HfLocalServerTarget): string {
  if (target.kind === 'tcp') {
    return `tcp://${target.host}:${target.port}`;
  }
  return target.socketPath;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));
}

function parseEmbeddingRows(body: unknown): number[][] {
  if (!isRecord(body)) {
    return [];
  }

  const payload = body as HfLocalEmbedResponse;
  if (Array.isArray(payload.embeddings) && payload.embeddings.every(isNumberArray)) {
    return payload.embeddings;
  }

  return [];
}

function parseResponseDim(body: unknown): number | null {
  if (!isRecord(body) || typeof body.dim !== 'number' || !Number.isFinite(body.dim) || body.dim <= 0) {
    return null;
  }
  return Math.trunc(body.dim);
}

function parseFiniteNumberOrNull(value: unknown): number | null | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (value === null) {
    return null;
  }
  return undefined;
}

function parseHealthState(body: unknown): HfLocalServerState | null {
  if (!isRecord(body)) {
    return null;
  }

  const { state } = body as HfLocalHealthResponse;
  return state === 'loading' || state === 'ready' || state === 'error' ? state : null;
}

function parseHealthModel(body: unknown): string | null {
  if (!isRecord(body) || typeof body.model !== 'string') {
    return null;
  }
  return body.model;
}

async function readIncomingMessage(response: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of response) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.trim().length === 0) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function nodeHttpTransport(request: HfLocalTransportRequest): Promise<HfLocalJsonResponse> {
  const requestBody = request.body === undefined ? undefined : JSON.stringify(request.body);
  const options: RequestOptions = {
    method: request.method,
    path: request.path,
    headers: requestBody === undefined
      ? undefined
      : {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(requestBody),
        },
  };

  if (request.target.kind === 'tcp') {
    options.hostname = request.target.host;
    options.port = request.target.port;
  } else {
    options.socketPath = request.target.socketPath;
  }

  return await new Promise((resolve, reject) => {
    const clientRequest = httpRequest(options, (response) => {
      readIncomingMessage(response)
        .then((body) => resolve({
          status: response.statusCode ?? 0,
          statusText: response.statusMessage ?? '',
          body,
        }))
        .catch(reject);
    });

    clientRequest.setTimeout(request.timeoutMs, () => {
      clientRequest.destroy(createError(`HF local request timed out after ${request.timeoutMs}ms`, 'ETIMEDOUT'));
    });
    clientRequest.on('error', reject);

    if (requestBody !== undefined) {
      clientRequest.write(requestBody);
    }
    clientRequest.end();
  });
}

function l2Normalize(vector: Float32Array): Float32Array {
  let norm = 0;
  for (const value of vector) {
    norm += value * value;
  }
  norm = Math.sqrt(norm);
  if (!Number.isFinite(norm) || norm === 0) {
    return vector;
  }

  const normalized = new Float32Array(vector.length);
  for (let index = 0; index < vector.length; index += 1) {
    normalized[index] = vector[index] / norm;
  }
  return normalized;
}

function isModelMissingResponse(response: HfLocalJsonResponse, body: unknown): boolean {
  if (response.status === 404) {
    return true;
  }

  const message = isRecord(body) && 'error' in body
    ? String((body as { error?: unknown }).error)
    : '';

  return /model.*(not found|not loaded|pull)|pull.*model/i.test(message);
}

function parseModelMissingDetails(body: unknown, requestedFallback: string): { requestedModel: string; loadedModel: string | null } {
  if (!isRecord(body)) {
    return {
      requestedModel: requestedFallback,
      loadedModel: null,
    };
  }

  const requestedModel = typeof body.model === 'string' && body.model.trim().length > 0
    ? body.model
    : requestedFallback;
  const loadedModel = typeof body.loadedModel === 'string' && body.loadedModel.trim().length > 0
    ? body.loadedModel
    : null;

  return {
    requestedModel,
    loadedModel,
  };
}

function isLoadingResponse(response: HfLocalJsonResponse): boolean {
  return (response.status === 503 || response.status === 200) && parseHealthState(response.body) === 'loading';
}

function isRetryableReadinessError(error: unknown): boolean {
  const code = getErrorCode(error);
  // ECONNREFUSED/ENOENT: server not yet listening (launcher still spawning).
  // ETIMEDOUT: slow cold load. ECONNRESET/EPIPE: the in-flight connection was
  // dropped by a mid-request reap (RSS watchdog SIGTERM, OOM, crash-loop) — the
  // supervisor respawns in ~250ms, so retry instead of tripping the circuit breaker.
  return code === 'ECONNREFUSED'
    || code === 'ENOENT'
    || code === 'ETIMEDOUT'
    || code === 'ECONNRESET'
    || code === 'EPIPE';
}

function nextDelay(currentDelay: number): number {
  return Math.min(currentDelay * 2, READY_RETRY_MAX_DELAY);
}

// ---------------------------------------------------------------
// 4. PROVIDER CLASS
// ---------------------------------------------------------------

/** Provides hf local provider. */
export class HfLocalProvider implements IEmbeddingProvider {
  modelName: string;
  dim: number;
  dtype: HfLocalDtype;
  maxTextLength: number;
  timeout: number;
  readyTimeout: number;
  loadTimeout: number;
  isHealthy: boolean;
  modelLoadTime: number | null;
  loadStartedAt: string | null;
  loadProgressAt: string | null;
  inferenceP50Ms: number | null;
  inferenceP95Ms: number | null;
  lastInferenceMs: number | null;
  queueDepth: number | null;
  requestCount: number;

  private notifiedDim: number | null = null;
  private readonly onDimensionResolved?: (resolvedDim: number, model: string) => void;
  private readonly target: HfLocalServerTarget;
  private readonly request: HfLocalTransport;
  private readonly readyLatchTtlMs: number;
  private readyLatch: { at: number } | null = null;
  private serverState: HfLocalServerState | null;

  constructor(options: HfLocalOptions = {}) {
    this.modelName = options.model || process.env.HF_EMBEDDINGS_MODEL || DEFAULT_MODEL;
    this.dim = typeof options.dim === 'number' && Number.isFinite(options.dim) && options.dim > 0
      ? Math.trunc(options.dim)
      : (this.modelName === DEFAULT_MODEL ? CANONICAL_DEFAULT_DIM : 0);
    this.dtype = resolveDtype(options.dtype);
    this.maxTextLength = options.maxTextLength || MAX_TEXT_LENGTH;
    this.timeout = options.timeout || EMBEDDING_TIMEOUT;
    this.readyTimeout = options.readyTimeout || parsePositiveInteger(
      process.env.HF_EMBED_SERVER_READY_TIMEOUT_MS,
      DEFAULT_READY_TIMEOUT,
    );
    this.loadTimeout = Math.max(
      this.readyTimeout,
      options.loadTimeout || parsePositiveInteger(
        process.env.SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS,
        DEFAULT_LOADING_TIMEOUT,
      ),
    );
    this.isHealthy = true;
    this.modelLoadTime = null;
    this.loadStartedAt = null;
    this.loadProgressAt = null;
    this.inferenceP50Ms = null;
    this.inferenceP95Ms = null;
    this.lastInferenceMs = null;
    this.queueDepth = null;
    this.requestCount = 0;
    this.onDimensionResolved = options.onDimensionResolved;
    this.target = resolveHfLocalServerTarget();
    this.request = options.request || activeTransport;
    this.readyLatchTtlMs = parseBoundedPositiveInteger(
      process.env.SPECKIT_HF_READY_LATCH_TTL_MS,
      DEFAULT_READY_LATCH_TTL_MS,
      MAX_READY_LATCH_TTL_MS,
    );
    this.serverState = null;
  }

  static async canLoad(options: Pick<HfLocalOptions, 'model' | 'timeout' | 'request'> = {}): Promise<HfLocalAvailability> {
    const target = resolveHfLocalServerTarget();
    const request = options.request || activeTransport;
    const timeoutMs = options.timeout || DEFAULT_HEALTH_TIMEOUT;

    try {
      const response = await request({
        target,
        method: 'GET',
        path: '/api/health',
        timeoutMs,
      });
      const state = parseHealthState(response.body);
      if (state === 'ready' || state === 'loading') {
        return { available: true };
      }
      if (state === 'error') {
        const reason = isRecord(response.body) && typeof response.body.error === 'string'
          ? response.body.error
          : `HF local model server reports error state at ${formatServerTarget(target)}`;
        return { available: false, reason };
      }

      return {
        available: false,
        reason: `HF local /api/health returned ${response.status} ${response.statusText}`,
      };
    } catch (error: unknown) {
      return {
        available: false,
        reason: `HF local backend unreachable at ${formatServerTarget(target)}: ${getErrorMessage(error)}`,
      };
    }
  }

  private prepareInput(text: string, inputType: HfLocalInputType): string | null {
    if (!text || typeof text !== 'string') {
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return null;
    }

    const prefix = inputType === 'raw' ? '' : getPrefixFor(this.modelName, inputType);
    const prefixed = `${prefix}${trimmedText}`;
    if (prefixed.length <= this.maxTextLength) {
      return prefixed;
    }

    return semanticChunk(prefixed, this.maxTextLength);
  }

  private async requestJson(
    method: 'GET' | 'POST',
    requestPath: string,
    body: unknown,
    timeoutMs: number,
  ): Promise<HfLocalJsonResponse> {
    return await this.request({
      target: this.target,
      method,
      path: requestPath,
      body,
      timeoutMs,
    });
  }

  private applyHealthMetadata(body: unknown): void {
    if (!isRecord(body)) {
      return;
    }

    const dim = parseResponseDim(body);
    if (dim !== null) {
      this.dim = dim;
    }

    const payload = body as HfLocalHealthResponse;
    if (typeof payload.device === 'string') {
      currentDevice = payload.device;
    } else if (payload.device === null) {
      currentDevice = null;
    }

    if (typeof payload.loadTimeMs === 'number' && Number.isFinite(payload.loadTimeMs)) {
      this.modelLoadTime = payload.loadTimeMs;
    } else if (payload.loadTimeMs === null) {
      this.modelLoadTime = null;
    }

    if (typeof payload.loadStartedAt === 'string') {
      this.loadStartedAt = payload.loadStartedAt;
    } else if (payload.loadStartedAt === null) {
      this.loadStartedAt = null;
    }

    if (typeof payload.loadProgressAt === 'string') {
      this.loadProgressAt = payload.loadProgressAt;
    } else if (payload.loadProgressAt === null) {
      this.loadProgressAt = null;
    }

    if (isRecord(payload.timing)) {
      const p50Ms = parseFiniteNumberOrNull(payload.timing.p50Ms);
      const p95Ms = parseFiniteNumberOrNull(payload.timing.p95Ms);
      const lastMs = parseFiniteNumberOrNull(payload.timing.lastMs);
      if (p50Ms !== undefined) {
        this.inferenceP50Ms = p50Ms;
      }
      if (p95Ms !== undefined) {
        this.inferenceP95Ms = p95Ms;
      }
      if (lastMs !== undefined) {
        this.lastInferenceMs = lastMs;
      }
    }

    const queueDepth = parseFiniteNumberOrNull(payload.queueDepth);
    if (queueDepth !== undefined) {
      this.queueDepth = queueDepth;
    }
  }

  private async healthOnce(timeoutMs: number): Promise<HfLocalJsonResponse> {
    const response = await this.requestJson('GET', '/api/health', undefined, timeoutMs);
    this.serverState = parseHealthState(response.body);
    this.applyHealthMetadata(response.body);
    return response;
  }

  private async waitForReady(): Promise<void> {
    const startedAt = Date.now();
    const readyDeadline = startedAt + this.readyTimeout;
    const loadingDeadline = startedAt + this.loadTimeout;
    let delay = READY_RETRY_INITIAL_DELAY;
    let lastError: unknown = null;
    let sawLoading = false;

    while (Date.now() <= (sawLoading ? loadingDeadline : readyDeadline)) {
      const activeDeadline = sawLoading ? loadingDeadline : readyDeadline;
      const remaining = Math.max(1, activeDeadline - Date.now());
      const healthTimeout = Math.min(DEFAULT_HEALTH_TIMEOUT, remaining);

      try {
        const response = await this.healthOnce(healthTimeout);
        const state = parseHealthState(response.body);
        const healthModel = parseHealthModel(response.body);
        if (state === 'ready') {
          this.serverState = 'ready';
          this.isHealthy = healthModel === null || healthModel === this.modelName;
          this.readyLatch = { at: Date.now() };
          return;
        }
        if (isLoadingResponse(response)) {
          sawLoading = true;
          lastError = createError(`HF local model server is still loading at ${formatServerTarget(this.target)}`);
        } else if (state === 'error') {
          const message = isRecord(response.body) && typeof response.body.error === 'string'
            ? response.body.error
            : 'unknown server error';
          throw new Error(`HF local model server is in error state: ${message}`);
        } else if (!response.status || response.status < 200 || response.status >= 300) {
          throw new Error(`HF local health request failed (${response.status} ${response.statusText}): ${JSON.stringify(response.body)}`);
        } else {
          throw new Error(`HF local health response did not report ready/loading/error: ${JSON.stringify(response.body)}`);
        }
      } catch (error: unknown) {
        if (!isRetryableReadinessError(error)) {
          this.isHealthy = false;
          throw error;
        }
        lastError = error;
      }

      const retryDeadline = sawLoading ? loadingDeadline : readyDeadline;
      if (Date.now() >= retryDeadline) {
        break;
      }

      await sleep(Math.min(delay, Math.max(1, retryDeadline - Date.now())));
      delay = nextDelay(delay);
    }

    this.isHealthy = false;
    const target = formatServerTarget(this.target);
    if (sawLoading) {
      // The server answered but was still loading/downloading the model when the
      // client gave up — actionable: this is a slow cold start, not an outage.
      throw new Error(
        `HF local model server at ${target} was still loading the model after ${this.loadTimeout}ms `
        + `(first-run model download can exceed this). Raise SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS or retry once warm.`,
      );
    }
    throw new Error(
      `HF local model server at ${target} was unreachable after ${this.readyTimeout}ms: `
      + `${lastError === null ? 'no response' : getErrorMessage(lastError)}`,
    );
  }

  private adoptEmbeddingDimension(row: number[], body: unknown): void {
    const serverDim = parseResponseDim(body);
    const expectedDim = serverDim ?? this.dim;
    if (serverDim !== null) {
      this.dim = serverDim;
    }

    if (expectedDim > 0 && row.length !== expectedDim) {
      throw new Error(`HF local embedding dimension mismatch for ${this.modelName}: expected ${expectedDim}, got ${row.length}`);
    }

    if (this.dim <= 0) {
      this.dim = row.length;
    }

    // First-embed drift hook: a custom HF_EMBEDDINGS_MODEL starts at dim 0 and only
    // resolves its true dimension here (from the server). This is the only point the
    // factory-injected reporter can compare it against the persisted vec_metadata active
    // dim, so the model-switch drift warning actually fires for non-canonical models.
    if (this.onDimensionResolved && this.dim > 0 && this.dim !== this.notifiedDim) {
      this.notifiedDim = this.dim;
      this.onDimensionResolved(this.dim, this.modelName);
    }
  }

  private async embedPrepared(inputs: string[]): Promise<Float32Array[]> {
    if (inputs.length === 0) {
      return [];
    }

    // A mid-request reap (RSS watchdog SIGTERM, OOM, crash-loop) drops the in-flight
    // /api/embed connection with ECONNRESET/EPIPE — the dominant reap window is DURING
    // the embed POST (inference load drives the pressure), not the cheap readiness GET.
    // Retry ONCE against the launcher-respawned server (~250ms) before surfacing, so a
    // single transient reap does not count toward the embedding circuit breaker. Bounded
    // at 2 attempts to cap worst-case latency for a permanently-resetting server.
    const MAX_EMBED_ATTEMPTS = 2;
    let lastError: unknown = null;
    for (let attempt = 1; attempt <= MAX_EMBED_ATTEMPTS; attempt += 1) {
      const now = Date.now();
      if (
        !this.readyLatch
        || this.serverState !== 'ready'
        || now - this.readyLatch.at >= this.readyLatchTtlMs
      ) {
        await this.waitForReady();
      }
      try {
        const response = await this.requestJson('POST', '/api/embed', {
          model: this.modelName,
          input: inputs,
        }, this.timeout);

        if (!response.status || response.status < 200 || response.status >= 300) {
          this.throwForEmbeddingResponse(response, response.body);
        }

        const rows = parseEmbeddingRows(response.body);
        if (rows.length !== inputs.length) {
          throw new Error(`HF local model server returned ${rows.length} embedding rows for ${inputs.length} inputs`);
        }
        if (!rows[0]) {
          throw new Error('HF local model server returned no embedding rows');
        }

        this.adoptEmbeddingDimension(rows[0], response.body);
        const embeddings = rows.map((row) => {
          if (row.length !== this.dim) {
            throw new Error(`HF local embedding dimension mismatch for ${this.modelName}: expected ${this.dim}, got ${row.length}`);
          }
          return l2Normalize(new Float32Array(row));
        });
        this.requestCount += rows.length;
        return embeddings;
      } catch (error: unknown) {
        if (attempt < MAX_EMBED_ATTEMPTS && isRetryableReadinessError(error)) {
          // Transient connection drop: force the next waitForReady() to re-probe the
          // respawned server, then re-issue the POST.
          lastError = error;
          this.serverState = null;
          this.readyLatch = null;
          continue;
        }
        this.readyLatch = null;
        throw error;
      }
    }
    throw lastError ?? new Error('HF local embedding failed after retries');
  }

  private throwForEmbeddingResponse(response: HfLocalJsonResponse, body: unknown): never {
    if (isModelMissingResponse(response, body)) {
      const { requestedModel, loadedModel } = parseModelMissingDetails(body, this.modelName);
      const loadedDetail = loadedModel === null
        ? 'server did not report loadedModel'
        : `server loaded ${loadedModel}`;
      throw new Error(`HF local model is not loaded: requested ${requestedModel}; ${loadedDetail}`);
    }

    throw new Error(`HF local embedding request failed (${response.status} ${response.statusText}): ${JSON.stringify(body)}`);
  }

  async generateEmbedding(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'raw');
    if (!input) {
      console.warn('[hf-local] Empty or invalid text provided');
      return null;
    }

    try {
      return (await this.embedPrepared([input]))[0] ?? null;
    } catch (error: unknown) {
      console.warn(`[hf-local] Generation failed: ${getErrorMessage(error)}`);
      this.isHealthy = false;
      throw error;
    }
  }

  async dispose(): Promise<void> {
    // Client provider owns no native model state; the model server handles disposal.
  }

  async embedDocument(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'document');
    if (!input) {
      return null;
    }
    return (await this.embedPrepared([input]))[0] ?? null;
  }

  async embedQuery(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'query');
    if (!input) {
      return null;
    }
    return (await this.embedPrepared([input]))[0] ?? null;
  }

  async embedBatch(texts: ReadonlyArray<string>, inputType: 'document' | 'query'): Promise<(Float32Array | null)[]> {
    const preparedInputs: string[] = [];
    const preparedIndexes: number[] = [];
    const results: (Float32Array | null)[] = texts.map(() => null);

    texts.forEach((text, index) => {
      const prepared = this.prepareInput(text, inputType);
      if (prepared === null) {
        return;
      }
      preparedIndexes.push(index);
      preparedInputs.push(prepared);
    });

    if (preparedInputs.length === 0) {
      return results;
    }

    const embeddings = await this.embedPrepared(preparedInputs);
    embeddings.forEach((embedding, index) => {
      results[preparedIndexes[index]] = embedding;
    });
    return results;
  }

  async warmup(): Promise<boolean> {
    try {
      await this.embedQuery('test warmup query');
      this.isHealthy = true;
      return true;
    } catch (error: unknown) {
      console.warn(`[hf-local] Warmup failed: ${getErrorMessage(error)}`);
      this.isHealthy = false;
      return false;
    }
  }

  getMetadata(): ProviderMetadata {
    return {
      provider: 'hf-local',
      model: this.modelName,
      dim: this.dim,
      dtype: this.dtype,
      serverState: this.serverState,
      device: currentDevice,
      healthy: this.isHealthy,
      loaded: this.serverState === 'ready',
      loadTimeMs: this.modelLoadTime,
      loadStartedAt: this.loadStartedAt,
      loadProgressAt: this.loadProgressAt,
      inferenceP50Ms: this.inferenceP50Ms,
      inferenceP95Ms: this.inferenceP95Ms,
      lastInferenceMs: this.lastInferenceMs,
      queueDepth: this.queueDepth,
      baseUrl: formatServerTarget(this.target),
      requestCount: this.requestCount,
    };
  }

  getProfile(): EmbeddingProfile {
    return new EmbeddingProfile({
      provider: 'hf-local',
      model: this.modelName,
      dim: this.dim,
      dtype: this.dtype,
      baseUrl: formatServerTarget(this.target),
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.healthOnce(Math.min(this.timeout, DEFAULT_HEALTH_TIMEOUT));
      const state = parseHealthState(response.body);
      this.isHealthy = state === 'ready' || state === 'loading';
      return this.isHealthy;
    } catch (error: unknown) {
      if (!isRetryableReadinessError(error)) {
        console.warn(`[hf-local] Health check failed: ${getErrorMessage(error)}`);
      }
      this.isHealthy = false;
      return false;
    }
  }

  getProviderName(): string {
    return 'HuggingFace Local Embeddings';
  }
}

export const __hfLocalProviderTestables = {
  reset(): void {
    activeTransport = nodeHttpTransport;
    sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    currentDevice = null;
  },
  setTransport(transport: HfLocalTransport): void {
    activeTransport = transport;
  },
  setSleep(sleepFn: SleepFn): void {
    sleep = sleepFn;
  },
  resolveHfLocalServerTarget,
};
