// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — sidecar worker
// ───────────────────────────────────────────────────────────────

import readline from 'node:readline';

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';
import type { IEmbeddingProvider } from '@spec-kit/shared/types';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

type WorkerInputType = 'document' | 'query';

interface BaseRequest {
  readonly id: number;
  readonly type: string;
}

interface EmbedRequest extends BaseRequest {
  readonly type: 'embed';
  readonly input: string[];
  readonly model: string;
  readonly dimensions: number;
  readonly inputType?: WorkerInputType;
}

interface PingRequest extends BaseRequest {
  readonly type: 'ping';
}

interface ShutdownRequest extends BaseRequest {
  readonly type: 'shutdown';
}

type WorkerRequest = EmbedRequest | PingRequest | ShutdownRequest;

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

// ───────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────

function getProviderName(): string {
  return process.env.SPECKIT_EMBEDDER_SIDECAR_PROVIDER || 'hf-local';
}

function getModelName(requestModel: string): string {
  return requestModel
    || process.env.SPECKIT_EMBEDDER_SIDECAR_MODEL
    || process.env.HF_EMBEDDINGS_MODEL
    || 'BAAI/bge-base-en-v1.5';
}

function getDimensions(requestDimensions: number): number {
  if (Number.isInteger(requestDimensions) && requestDimensions > 0) {
    return requestDimensions;
  }

  const envDimensions = Number.parseInt(process.env.SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS || '', 10);
  return Number.isInteger(envDimensions) && envDimensions > 0 ? envDimensions : 768;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function parentProcessAlive(pid: number): boolean {
  if (!Number.isInteger(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (error: unknown) {
    return Boolean(error && typeof error === 'object' && 'code' in error && error.code === 'EPERM');
  }
}

function startParentDeathPolling(): void {
  const parentPid = Number.parseInt(process.env.SPECKIT_EMBEDDER_SIDECAR_PARENT_PID || '', 10);
  if (!Number.isInteger(parentPid) || parentPid <= 0) {
    return;
  }

  parentPollTimer = setInterval(() => {
    if (!parentProcessAlive(parentPid)) {
      process.exit(0);
    }
  }, 250);
  parentPollTimer.unref?.();
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function parseRequest(line: string): WorkerRequest {
  const parsed = JSON.parse(line) as Partial<WorkerRequest>;
  if (!parsed || typeof parsed !== 'object' || typeof parsed.id !== 'number' || typeof parsed.type !== 'string') {
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

async function getProvider(request: EmbedRequest): Promise<IEmbeddingProvider> {
  if (!providerPromise) {
    providerPromise = createEmbeddingsProvider({
      provider: getProviderName(),
      model: getModelName(request.model),
      dim: getDimensions(request.dimensions),
      warmup: false,
    });
  }

  return providerPromise;
}

async function handleEmbed(request: EmbedRequest): Promise<void> {
  const provider = await getProvider(request);
  const inputType = request.inputType ?? 'document';
  const vectors: number[][] = [];

  for (const input of request.input) {
    const embedding = inputType === 'query'
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

  if (trimmed.length > MAX_LINE_BYTES) {
    writeJson({
      id: 0,
      type: 'error',
      message: `Line exceeds maximum length of ${MAX_LINE_BYTES} bytes`,
    });
    process.exit(2);
    return;
  }

  void (async () => {
    let requestId = 0;
    try {
      const request = parseRequest(trimmed);
      requestId = request.id;
      await handleRequest(request);
    } catch (error: unknown) {
      writeJson({
        id: requestId,
        type: 'error',
        message: toErrorMessage(error),
      });
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

export const __sidecarWorkerTestables = { parseRequest };
