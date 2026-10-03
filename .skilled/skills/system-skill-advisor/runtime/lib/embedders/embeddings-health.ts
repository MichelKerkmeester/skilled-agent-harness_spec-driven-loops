// ───────────────────────────────────────────────────────────────
// MODULE: Embeddings Health Probe
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { request as httpRequest, type RequestOptions } from 'node:http';
import { join, resolve } from 'node:path';

import { getProviderInfo } from '@spec-kit/shared/embeddings/factory.js';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS AND CONSTANTS
// ───────────────────────────────────────────────────────────────────

type SharedProviderInfo = ReturnType<typeof getProviderInfo>;

export type ProviderInfoLike = Pick<
  SharedProviderInfo,
  'requestedProvider' | 'effectiveProvider' | 'fallbackReason' | 'dimensionChanged' | 'reason'
>;

export type HealthTarget =
  | { protocol: 'tcp'; target: string; host: string; port: number }
  | { protocol: 'socket'; target: string; socketPath: string };

export type HealthRequest = (target: HealthTarget, timeoutMs: number) => Promise<unknown>;

export type EmbeddingsHealth = {
  checkedAt: string;
  provider:
    | {
      state: 'resolved';
      requestedProvider: string;
      effectiveProvider: string;
      fallbackReason: string | null;
      dimensionChanged: boolean;
      reason: string;
    }
    | { state: 'unavailable'; error: string };
  modelServer:
    | {
      state: 'reachable';
      target: string;
      serverState: string | null;
      model: string | null;
      dim: number | null;
      device: string | null;
      loadTimeMs: number | null;
      loadStartedAt: string | null;
      loadProgressAt: string | null;
      lastSuccessfulEmbedAt: string | null;
      inFlight: number | null;
      queueDepth: number | null;
      error: string | null;
    }
    | {
      state: 'unavailable';
      target: string;
      errorClass: 'unreachable' | 'timeout' | 'bad_response' | 'probe_failed';
      error: string;
    };
};

const DEFAULT_TIMEOUT_MS = 1_500;
const MAX_ERROR_LENGTH = 200;

type ProbeErrorClass = Extract<EmbeddingsHealth['modelServer'], { state: 'unavailable' }>['errorClass'];

class HealthProbeError extends Error {
  public readonly errorClass: ProbeErrorClass;

  constructor(errorClass: ProbeErrorClass, message: string) {
    super(message);
    this.name = 'HealthProbeError';
    this.errorClass = errorClass;
  }
}

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function errorText(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, MAX_ERROR_LENGTH);
}

function tcpTarget(value: string): HealthTarget {
  const parsed = new URL(value);
  const port = Number(parsed.port);
  if (parsed.protocol !== 'tcp:' || !parsed.hostname || !Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('Expected tcp://host:port');
  }
  return { protocol: 'tcp', target: value, host: parsed.hostname, port };
}

function resolveTarget(env: NodeJS.ProcessEnv): HealthTarget {
  const configuredServer = env.HF_EMBED_SERVER_URL;
  if (configuredServer) {
    return configuredServer.startsWith('tcp://')
      ? tcpTarget(configuredServer)
      : { protocol: 'socket', target: configuredServer, socketPath: configuredServer };
  }

  const socketDir = env.SPECKIT_IPC_SOCKET_DIR;
  if (socketDir?.startsWith('tcp://')) return tcpTarget(socketDir);

  const resolvedSocketDir = socketDir ? resolve(socketDir) : '/tmp/system-hf-embed';
  const socketPath = join(resolvedSocketDir, 'hf-embed.sock');
  return { protocol: 'socket', target: socketPath, socketPath };
}

function targetLabel(env: NodeJS.ProcessEnv): string {
  const configuredServer = env.HF_EMBED_SERVER_URL;
  if (configuredServer) return configuredServer;
  const socketDir = env.SPECKIT_IPC_SOCKET_DIR;
  if (socketDir?.startsWith('tcp://')) return socketDir;
  return join(socketDir ? resolve(socketDir) : '/tmp/system-hf-embed', 'hf-embed.sock');
}

function classifyProbeError(error: unknown): ProbeErrorClass {
  if (error instanceof HealthProbeError) return error.errorClass;

  const code = typeof error === 'object' && error !== null && 'code' in error
    && typeof error.code === 'string'
    ? error.code
    : '';
  if (code === 'ENOENT' || code === 'ECONNREFUSED') return 'unreachable';
  if (code === 'ETIMEDOUT' || code === 'ESOCKETTIMEDOUT') return 'timeout';
  return 'probe_failed';
}

function nullableString(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new HealthProbeError('bad_response', `Health payload field ${field} must be a string`);
  }
  return value;
}

function nullableNumber(value: unknown, field: string): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new HealthProbeError('bad_response', `Health payload field ${field} must be a number`);
  }
  return value;
}

/** Accepts the epoch-millisecond timestamps the live server emits and the ISO strings other builds emit. */
function nullableTimestamp(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return new Date(value).toISOString();
  if (typeof value === 'string') return value;
  throw new HealthProbeError('bad_response', `Health payload field ${field} must be a timestamp`);
}

function normalizeHealthPayload(target: string, payload: unknown): Extract<EmbeddingsHealth['modelServer'], { state: 'reachable' }> {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new HealthProbeError('bad_response', 'Health endpoint returned a non-object JSON payload');
  }
  const health = payload as Record<string, unknown>;
  return {
    state: 'reachable',
    target,
    serverState: nullableString(health.state, 'state'),
    model: nullableString(health.model, 'model'),
    dim: nullableNumber(health.dim, 'dim'),
    device: nullableString(health.device, 'device'),
    loadTimeMs: nullableNumber(health.loadTimeMs, 'loadTimeMs'),
    loadStartedAt: nullableTimestamp(health.loadStartedAt, 'loadStartedAt'),
    loadProgressAt: nullableTimestamp(health.loadProgressAt, 'loadProgressAt'),
    lastSuccessfulEmbedAt: nullableTimestamp(health.lastSuccessfulEmbedAt, 'lastSuccessfulEmbedAt'),
    inFlight: nullableNumber(health.inFlight, 'inFlight'),
    queueDepth: nullableNumber(health.queueDepth, 'queueDepth'),
    error: nullableString(health.error, 'error'),
  };
}

function requestHealth(target: HealthTarget, timeoutMs: number): Promise<unknown> {
  return new Promise((resolvePayload, rejectPayload) => {
    let settled = false;
    let timer: NodeJS.Timeout | undefined;
    const finish = (complete: (value: never) => void, value: unknown): void => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      complete(value as never);
    };
    const options: RequestOptions = target.protocol === 'tcp'
      ? { host: target.host, port: target.port, method: 'GET', path: '/api/health' }
      : { socketPath: target.socketPath, method: 'GET', path: '/api/health' };
    const outgoing = httpRequest(options, (response) => {
      const chunks: Buffer[] = [];
      response.on('data', (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      response.on('error', (error: Error) => finish(rejectPayload, error));
      response.on('aborted', () => finish(
        rejectPayload,
        new HealthProbeError('bad_response', 'Health response ended before its body was complete'),
      ));
      response.on('end', () => {
        if (response.statusCode === undefined || response.statusCode < 200 || response.statusCode >= 300) {
          finish(
            rejectPayload,
            new HealthProbeError('bad_response', `Health endpoint returned HTTP ${response.statusCode ?? 'unknown'}`),
          );
          return;
        }
        let payload: unknown;
        try {
          payload = JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
        } catch {
          finish(rejectPayload, new HealthProbeError('bad_response', 'Health endpoint returned invalid JSON'));
          return;
        }
        finish(resolvePayload, payload);
      });
    });

    timer = setTimeout(() => {
      outgoing.destroy(new HealthProbeError('timeout', `Health probe timed out after ${timeoutMs} ms`));
    }, timeoutMs);
    outgoing.on('error', (error: Error) => finish(rejectPayload, error));
    outgoing.end();
  });
}

async function boundedRequest(request: HealthRequest, target: HealthTarget, timeoutMs: number): Promise<unknown> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_resolveTimeout, rejectTimeout) => {
    timer = setTimeout(() => {
      rejectTimeout(new HealthProbeError('timeout', `Health probe timed out after ${timeoutMs} ms`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      Promise.resolve().then(() => request(target, timeoutMs)),
      timeout,
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function unavailableModelServer(
  target: string,
  error: unknown,
): Extract<EmbeddingsHealth['modelServer'], { state: 'unavailable' }> {
  return {
    state: 'unavailable',
    target,
    errorClass: classifyProbeError(error),
    error: errorText(error),
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Read provider resolution and local model-server health without loading a model. */
export async function readEmbeddingsHealth(
  options: {
    timeoutMs?: number;
    env?: NodeJS.ProcessEnv;
    request?: HealthRequest;
    providerInfo?: () => ProviderInfoLike;
  } = {},
): Promise<EmbeddingsHealth> {
  const env = options.env ?? process.env;
  const timeoutMs = Math.max(1, options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  const providerInfo = options.providerInfo ?? getProviderInfo;

  let provider: EmbeddingsHealth['provider'];
  try {
    const info = providerInfo();
    provider = {
      state: 'resolved',
      requestedProvider: info.requestedProvider,
      effectiveProvider: info.effectiveProvider,
      fallbackReason: info.fallbackReason ?? null,
      dimensionChanged: info.dimensionChanged,
      reason: info.reason,
    };
  } catch (error: unknown) {
    provider = { state: 'unavailable', error: errorText(error) };
  }

  const label = targetLabel(env);
  let modelServer: EmbeddingsHealth['modelServer'];
  try {
    const target = resolveTarget(env);
    const request = options.request ?? requestHealth;
    const payload = await boundedRequest(request, target, timeoutMs);
    modelServer = normalizeHealthPayload(target.target, payload);
  } catch (error: unknown) {
    modelServer = unavailableModelServer(label, error);
  }

  return {
    checkedAt: new Date().toISOString(),
    provider,
    modelServer,
  };
}
