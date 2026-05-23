// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — sidecar worker
// ───────────────────────────────────────────────────────────────

import readline from 'node:readline';

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';
import type { IEmbeddingProvider } from '@spec-kit/shared/types';

import type { EmbedOptions } from './sidecar-client.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

type WorkerInputType = NonNullable<EmbedOptions['inputType']>;

interface EmbedRequest {
  readonly id: number;
  readonly type: 'embed';
  readonly input: string[];
  readonly model: string;
  readonly dimensions: number;
  readonly inputType?: WorkerInputType;
}

interface PingRequest {
  readonly id: number;
  readonly type: 'ping';
}

interface ShutdownRequest {
  readonly id: number;
  readonly type: 'shutdown';
}

type WorkerRequest = EmbedRequest | PingRequest | ShutdownRequest;

type ParentLivenessReason = 'pid-1-orphaned' | 'kill-0-eperm' | 'kill-0-esrch' | 'ok' | 'unknown';

interface ParentLiveness {
  readonly alive: boolean;
  readonly reason: ParentLivenessReason;
  readonly errorCode?: number;
}

type WorkerErrorPhase = 'configuration' | 'liveness' | 'parse' | 'validation' | 'provider';

interface WorkerErrorDetail {
  readonly phase: WorkerErrorPhase;
  readonly code: string;
  readonly detail: string;
}

// ───────────────────────────────────────────────────────────────
// 2. STATE
// ───────────────────────────────────────────────────────────────

let providerPromise: Promise<IEmbeddingProvider> | null = null;
let parentPollTimer: NodeJS.Timeout | null = null;

// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────

const MAX_LINE_BYTES = 1024 * 1024; // 1MB
const MAX_INPUT_ITEMS = 500;
const DEFAULT_MODEL = 'BAAI/bge-base-en-v1.5';

// ───────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────

function getModelName(requestModel: string): string {
  const envModel = process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL?.trim();
  if (envModel) {
    return envModel;
  }

  const configModel = requestModel.trim();
  if (configModel) {
    return configModel;
  }

  process.stderr.write(
    `sidecar-worker: ${JSON.stringify(createWorkerError('configuration', 'model-defaulted', `No sidecar model configured; defaulting to ${DEFAULT_MODEL}`))}\n`,
  );
  return DEFAULT_MODEL;
}

function getDimensions(requestDimensions: number): number {
  if (Number.isInteger(requestDimensions) && requestDimensions > 0) {
    return requestDimensions;
  }

  const envDimensions = Number.parseInt(process.env.SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS || '', 10);
  return Number.isInteger(envDimensions) && envDimensions > 0 ? envDimensions : 768;
}

function toErrorDetail(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function createWorkerError(phase: WorkerErrorPhase, code: string, detail: string): WorkerErrorDetail {
  return { phase, code, detail };
}

function errorMessage(error: WorkerErrorDetail): string {
  return JSON.stringify(error);
}

function errorCodeFrom(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return undefined;
  }
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' ? code : undefined;
}

function errnoFrom(error: unknown): number | undefined {
  if (!error || typeof error !== 'object' || !('errno' in error)) {
    return undefined;
  }
  const errno = (error as { errno?: unknown }).errno;
  return typeof errno === 'number' ? errno : undefined;
}

function parentProcessLiveness(pid: number): ParentLiveness {
  if (!Number.isInteger(pid) || pid <= 0) {
    return { alive: false, reason: 'unknown' };
  }

  if (pid === 1) {
    return { alive: false, reason: 'pid-1-orphaned' };
  }

  try {
    process.kill(pid, 0);
    return { alive: true, reason: 'ok' };
  } catch (error: unknown) {
    const code = errorCodeFrom(error);
    const errorCode = errnoFrom(error);
    if (code === 'EPERM') {
      return { alive: true, reason: 'kill-0-eperm', errorCode };
    }
    if (code === 'ESRCH') {
      return { alive: false, reason: 'kill-0-esrch', errorCode };
    }
    return { alive: false, reason: 'unknown', errorCode };
  }
}

function startParentDeathPolling(): void {
  const parentPid = Number.parseInt(process.env.SPECKIT_EMBEDDER_SIDECAR_PARENT_PID || '', 10);
  if (!Number.isInteger(parentPid) || parentPid <= 0) {
    return;
  }

  parentPollTimer = setInterval(() => {
    const liveness = parentProcessLiveness(parentPid);
    if (liveness.reason === 'unknown') {
      process.stderr.write(
        `sidecar-worker: ${JSON.stringify(createWorkerError('liveness', 'parent-liveness-unknown', `Unable to verify parent pid ${parentPid}; errorCode=${liveness.errorCode ?? 'unknown'}`))}\n`,
      );
    }
    if (!liveness.alive) {
      process.exit(0);
    }
  }, 250);
  parentPollTimer.unref?.();
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isRequestEnvelope(value: unknown): value is { readonly id: number; readonly type: string } {
  return Boolean(value)
    && typeof value === 'object'
    && typeof (value as { readonly id?: unknown }).id === 'number'
    && typeof (value as { readonly type?: unknown }).type === 'string';
}

function parseRequest(line: string): WorkerRequest {
  const parsed = JSON.parse(line) as unknown;
  if (!isRequestEnvelope(parsed)) {
    throw new Error('Invalid sidecar request envelope');
  }

  if (parsed.type === 'ping' || parsed.type === 'shutdown') {
    return parsed as PingRequest | ShutdownRequest;
  }

  if (parsed.type !== 'embed') {
    throw new Error(`Unknown sidecar request type: ${parsed.type}`);
  }

  const candidate = parsed as Partial<EmbedRequest>;
  if (!isStringArray(candidate.input)) {
    throw new Error('Embed request input must be string[]');
  }

  if (candidate.input.length > MAX_INPUT_ITEMS) {
    throw new Error(`Embed request input exceeds maximum of ${MAX_INPUT_ITEMS} items`);
  }

  return {
    id: parsed.id,
    type: 'embed',
    input: candidate.input,
    model: typeof candidate.model === 'string' ? candidate.model : '',
    dimensions: typeof candidate.dimensions === 'number' ? candidate.dimensions : 0,
    inputType: candidate.inputType === 'query' ? 'query' : 'document',
  };
}

function writeJson(payload: Record<string, unknown>): void {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

function writeError(id: number, error: WorkerErrorDetail): void {
  writeJson({
    id,
    type: 'error',
    message: errorMessage(error),
    phase: error.phase,
    code: error.code,
    detail: error.detail,
  });
}

function recoverRequestId(line: string): number | null {
  const match = /"id"\s*:\s*(\d+)/.exec(line);
  if (!match) {
    return null;
  }

  const id = Number.parseInt(match[1], 10);
  return Number.isSafeInteger(id) ? id : null;
}

function requestErrorFrom(error: unknown): WorkerErrorDetail {
  if (error instanceof SyntaxError) {
    return createWorkerError('parse', 'invalid-json', toErrorDetail(error));
  }

  return createWorkerError('validation', 'request-invalid', toErrorDetail(error));
}

async function getProvider(request: EmbedRequest): Promise<IEmbeddingProvider> {
  if (!providerPromise) {
    const created = createEmbeddingsProvider({
      provider: process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER?.trim() || 'hf-local',
      model: getModelName(request.model),
      dim: getDimensions(request.dimensions),
      warmup: false,
    }).catch((error: unknown) => {
      if (providerPromise === created) {
        providerPromise = null;
      }
      throw error;
    });
    providerPromise = created;
  }

  return providerPromise;
}

async function handleEmbed(request: EmbedRequest): Promise<void> {
  const provider = await getProvider(request);
  const vectors: number[][] = [];

  for (const input of request.input) {
    const embedding = request.inputType === 'query'
      ? await provider.embedQuery(input)
      : await provider.embedDocument(input);
    if (!embedding) {
      throw new Error('Provider returned null embedding');
    }
    if (embedding.length !== request.dimensions) {
      throw new Error(`Embedding dimension mismatch: expected ${request.dimensions}, got ${embedding.length}`);
    }
    vectors.push(Array.from(embedding));
  }

  writeJson({
    id: request.id,
    type: 'embedding',
    vectors,
    dimensions: request.dimensions,
  });
}

async function handleRequest(request: WorkerRequest): Promise<void> {
  if (request.type === 'ping') {
    writeJson({ id: request.id, type: 'pong' });
    return;
  }

  if (request.type === 'shutdown') {
    process.exit(0);
  }

  await handleEmbed(request);
}

// ───────────────────────────────────────────────────────────────
// 5. ENTRYPOINT
// ───────────────────────────────────────────────────────────────

const reader = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

startParentDeathPolling();

reader.on('line', (line: string) => {
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    return;
  }

  const recoveredRequestId = recoverRequestId(trimmed);

  if (trimmed.length > MAX_LINE_BYTES) {
    if (recoveredRequestId === null) {
      process.stderr.write(
        `sidecar-worker: pre-parse failure ${errorMessage(createWorkerError('parse', 'line-too-long-without-id', `Line exceeds maximum length of ${MAX_LINE_BYTES} bytes`))}\n`,
      );
      process.exit(1);
      return;
    }

    writeError(
      recoveredRequestId,
      createWorkerError('parse', 'line-too-long', `Line exceeds maximum length of ${MAX_LINE_BYTES} bytes`),
    );
    process.exit(2);
    return;
  }

  void (async () => {
    let requestId = recoveredRequestId;
    let request: WorkerRequest;
    try {
      request = parseRequest(trimmed);
      requestId = request.id;
    } catch (error: unknown) {
      if (requestId === null) {
        process.stderr.write(
          `sidecar-worker: pre-parse failure ${errorMessage(createWorkerError('parse', 'unparseable-input', toErrorDetail(error)))}\n`,
        );
        process.exit(1);
        return;
      }

      writeError(requestId, requestErrorFrom(error));
      return;
    }

    try {
      await handleRequest(request);
    } catch (error: unknown) {
      writeError(
        requestId,
        createWorkerError('provider', 'request-failed', toErrorDetail(error)),
      );
    }
  })();
});

reader.on('close', () => {
  if (parentPollTimer) {
    clearInterval(parentPollTimer);
    parentPollTimer = null;
  }
  process.exit(0);
});

function resetProviderCacheForTests(): void {
  providerPromise = null;
}

export const __sidecarWorkerTestables = {
  parseRequest,
  parentProcessLiveness,
  recoverRequestId,
  getProvider,
  resetProviderCacheForTests,
};
