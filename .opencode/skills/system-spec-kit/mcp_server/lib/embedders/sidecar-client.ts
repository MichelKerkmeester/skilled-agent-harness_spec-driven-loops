// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — sidecar client
// ───────────────────────────────────────────────────────────────

import { fork, type ChildProcess } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { EmbedderAdapter } from './adapter.js';
import type { BackendKind } from './types.js';
import { clearRegisteredTimer, registerTimeout } from '../runtime/timer-registry.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

export type EmbedderSidecarInputType = 'document' | 'query';

/**
 * Production-only options for SidecarClient.
 * Test-only fields (workerPath, idleMs, pingTimeoutMs, requestTimeoutMs, envAllowlist, env)
 * are available via SidecarClientTestOptions for test consumers.
 */
export interface SidecarClientOptions {
  readonly provider: string;
  readonly model: string;
  readonly dimensions: number;
  readonly backend?: BackendKind;
}

/**
 * Test-only options extending production options.
 * Use only in test files to inject test doubles or override behavior.
 */
export interface SidecarClientTestOptions extends SidecarClientOptions {
  readonly workerPath?: string;
  readonly idleMs?: number;
  readonly pingTimeoutMs?: number;
  readonly requestTimeoutMs?: number;
  readonly envAllowlist?: readonly string[];
  readonly env?: NodeJS.ProcessEnv;
}

export interface SidecarWorkerInfo {
  readonly pid: number;
  readonly model: string;
  readonly last_request_at: number;
  readonly idle_for_ms: number;
  readonly request_count: number;
}

interface SidecarEmbedOptions {
  readonly inputType?: EmbedderSidecarInputType;
}

interface PendingRequest {
  readonly resolve: (value: unknown) => void;
  readonly reject: (reason: unknown) => void;
  readonly timer?: NodeJS.Timeout;
}

interface SidecarEmbeddingResponse {
  readonly id: number;
  readonly type: 'embedding';
  readonly vectors: number[][];
  readonly dimensions: number;
}

interface SidecarPongResponse {
  readonly id: number;
  readonly type: 'pong';
}

interface SidecarErrorResponse {
  readonly id: number;
  readonly type: 'error';
  readonly message: string;
}

type SidecarResponse = SidecarEmbeddingResponse | SidecarPongResponse | SidecarErrorResponse;

export class SidecarClientError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'SidecarClientError';
    this.code = code;
  }
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const DEFAULT_IDLE_MS = 300_000;
const DEFAULT_PING_TIMEOUT_MS = 2_000;
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;
const DEFAULT_TERMINATION_GRACE_MS = 1_000;
const MIN_TIMEOUT_MS = 1;
const ALLOWED_ENV_KEYS = new Set(['PATH', 'HOME', 'LANG', 'LC_ALL', 'LC_CTYPE', 'TMPDIR']);
const MAX_LINE_BYTES = 1024 * 1024; // 1MB
const MAX_STDOUT_BUFFER_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_EMBED_INPUTS = 500;

/**
 * Recognized SPECKIT_ environment variables for embedder sidecar configuration.
 *
 * **Cross-encoder sidecar (ensure-rerank-sidecar.cjs):**
 * - `SPECKIT_CROSS_ENCODER`: Set to "true" to enable the cross-encoder sidecar (default: disabled)
 *
 * **Embedder sidecar client (sidecar-client.ts):**
 * - `SPECKIT_EMBEDDER_SIDECAR_IDLE_MS`: Idle timeout before worker eviction (default: 300000)
 * - `SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS`: Health check ping timeout (default: 2000)
 * - `SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS`: Embed request timeout (default: 30000)
 *
 * **Embedder execution router (execution-router.ts):**
 * - `SPECKIT_EMBEDDER_EXECUTION`: Execution policy - "auto", "direct", or "sidecar" (default: "auto")
 *
 * **Internal sidecar worker environment (set by parent, not user-configurable):**
 * - `SPECKIT_EMBEDDER_SIDECAR_PROVIDER`: Provider name (e.g., "hf-local", "ollama")
 * - `SPECKIT_EMBEDDER_SIDECAR_MODEL`: Model name
 * - `SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS`: Embedding dimensions
 * - `SPECKIT_EMBEDDER_SIDECAR_PARENT_PID`: Parent process PID for liveness checks
 *
 * **Test-only prefixes (never used in production):**
 * - `SPECKIT_EMBEDDER_*`: Any other SPECKIT_EMBEDDER_ prefix is test-only
 * - `MOCK_SIDECAR_*`: Mock sidecar test prefix
 *
 * @see mcp_server/ENV_REFERENCE.md for canonical environment variable documentation
 */
export const RECOGNIZED_SPECKIT_ENV_VARS = [
  'SPECKIT_CROSS_ENCODER',
  'SPECKIT_EMBEDDER_SIDECAR_IDLE_MS',
  'SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS',
  'SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS',
  'SPECKIT_EMBEDDER_EXECUTION',
  'SPECKIT_EMBEDDER_SIDECAR_PROVIDER',
  'SPECKIT_EMBEDDER_SIDECAR_MODEL',
  'SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS',
  'SPECKIT_EMBEDDER_SIDECAR_PARENT_PID',
] as const;

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function parsePositiveIntegerEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim().length === 0) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= MIN_TIMEOUT_MS ? parsed : fallback;
}

function defaultWorkerPath(): string {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const compiled = join(currentDir, 'sidecar-worker.js');
  if (existsSync(compiled)) {
    return compiled;
  }

  return join(currentDir, 'sidecar-worker.ts');
}

/**
 * Canonical backend kind normalization.
 * Imported by execution-router.ts to avoid duplicate implementations.
 * Contract: undefined input defaults to 'sentence-transformers'.
 * This is the single canonical implementation - do not duplicate.
 */
export function toBackendKind(provider: string | undefined): BackendKind {
  if (provider === 'ollama') {
    return 'ollama';
  }
  if (provider === 'openai' || provider === 'voyage' || provider === 'api') {
    return 'api';
  }
  return 'sentence-transformers';
}

function responseHasId(value: unknown): value is { id: number } {
  return (
    typeof value === 'object'
    && value !== null
    && typeof (value as { id?: unknown }).id === 'number'
  );
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function signalChildProcessGroup(child: ChildProcess, signal: NodeJS.Signals): void {
  if (child.pid && process.platform !== 'win32') {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {
        process.stderr.write(`[sidecar:${child.pid}] process-group ${signal} failed: ${toErrorMessage(error)}\n`);
      }
    }
  }
  if (!child.killed) {
    child.kill(signal);
  }
}

function waitForChildExit(child: ChildProcess, timeoutMs: number): Promise<boolean> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (exited: boolean): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.off('exit', onExit);
      resolve(exited);
    };
    const onExit = (): void => finish(true);
    const timer = setTimeout(() => finish(false), timeoutMs);
    timer.unref?.();
    child.once('exit', onExit);
  });
}

function isAllowedEnvKey(key: string, explicitAllowlist: readonly string[] = []): boolean {
  return ALLOWED_ENV_KEYS.has(key)
    || key.startsWith('LC_')
    || key.startsWith('SPECKIT_EMBEDDER_')
    || key.startsWith('MOCK_SIDECAR_')
    || explicitAllowlist.includes(key);
}

export function buildSidecarEnv(
  parentEnv: NodeJS.ProcessEnv,
  explicitAllowlist: readonly string[] = [],
): NodeJS.ProcessEnv {
  const out: NodeJS.ProcessEnv = {};
  for (const [key, value] of Object.entries(parentEnv)) {
    if (value === undefined) continue;
    if (isAllowedEnvKey(key, explicitAllowlist)) {
      out[key] = value;
    }
  }
  return out;
}

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export class SidecarClient implements EmbedderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind;

  private readonly provider: string;
  private readonly workerPath: string;
  private readonly idleMs: number;
  private readonly pingTimeoutMs: number;
  private readonly requestTimeoutMs: number;
  private readonly envAllowlist: readonly string[];
  private readonly env: NodeJS.ProcessEnv;
  private child: ChildProcess | null = null;
  private stdoutBuffer = '';
  private pending = new Map<number, PendingRequest>();
  private idleTimer: NodeJS.Timeout | null = null;
  private lastRequestAt = 0;
  private requestCount = 0;
  private shuttingDown = false;
  private termination: Promise<void> | null = null;

  constructor(options: SidecarClientOptions) {
    // Internal cast to access test-only fields when needed
    const opts = options as SidecarClientTestOptions;
    this.provider = options.provider;
    this.name = options.model;
    this.dim = options.dimensions;
    this.backend = options.backend ?? toBackendKind(options.provider);
    this.workerPath = opts.workerPath ?? defaultWorkerPath();
    this.idleMs = opts.idleMs ?? parsePositiveIntegerEnv('SPECKIT_EMBEDDER_SIDECAR_IDLE_MS', DEFAULT_IDLE_MS);
    this.pingTimeoutMs = opts.pingTimeoutMs
      ?? parsePositiveIntegerEnv('SPECKIT_EMBEDDER_SIDECAR_PING_TIMEOUT_MS', DEFAULT_PING_TIMEOUT_MS);
    this.requestTimeoutMs = opts.requestTimeoutMs
      ?? parsePositiveIntegerEnv('SPECKIT_EMBEDDER_SIDECAR_REQUEST_TIMEOUT_MS', DEFAULT_REQUEST_TIMEOUT_MS);
    this.envAllowlist = opts.envAllowlist ?? [];
    this.env = opts.env ?? process.env;
  }

  async embed(texts: ReadonlyArray<string>, options: SidecarEmbedOptions = {}): Promise<Float32Array[]> {
    if (texts.length === 0) {
      return [];
    }

    if (texts.length > MAX_EMBED_INPUTS) {
      throw new SidecarClientError(
        'embed-input-cap-exceeded',
        `embed batch exceeds ${MAX_EMBED_INPUTS}-item cap`,
      );
    }

    await this.ensureHealthyWorker();
    this.lastRequestAt = Date.now();
    this.requestCount += 1;
    this.scheduleIdleEviction();

    const response = await this.sendRequest<SidecarEmbeddingResponse>({
      type: 'embed',
      input: [...texts],
      model: this.name,
      dimensions: this.dim,
      inputType: options.inputType ?? 'document',
    });

    if (response.dimensions !== this.dim) {
      throw new Error(`Sidecar embedding dimension mismatch for ${this.name}: expected ${this.dim}, got ${response.dimensions}`);
    }

    if (response.vectors.length !== texts.length) {
      throw new Error(`Sidecar returned ${response.vectors.length} embeddings for ${texts.length} inputs`);
    }

    return response.vectors.map((vector) => {
      if (vector.length !== this.dim) {
        throw new Error(`Sidecar vector dimension mismatch for ${this.name}: expected ${this.dim}, got ${vector.length}`);
      }
      return new Float32Array(vector);
    });
  }

  async ready(): Promise<boolean> {
    try {
      await this.ensureHealthyWorker();
      return true;
    } catch {
      return false;
    }
  }

  getWorkerInfo(now: number = Date.now()): SidecarWorkerInfo | null {
    if (!this.child?.pid) {
      return null;
    }

    return {
      pid: this.child.pid,
      model: this.name,
      last_request_at: this.lastRequestAt,
      idle_for_ms: this.lastRequestAt > 0 ? Math.max(0, now - this.lastRequestAt) : 0,
      request_count: this.requestCount,
    };
  }

  async shutdown(): Promise<void> {
    const child = this.child;
    if (!child) {
      this.clearIdleTimer();
      return;
    }

    try {
      await this.sendRequest({ type: 'shutdown' }, this.pingTimeoutMs);
    } catch {
      await this.terminateChild(child);
    } finally {
      this.clearIdleTimer();
      if (this.child === child) {
        await this.terminateChild(child);
      }
    }
  }

  private async ensureHealthyWorker(): Promise<void> {
    if (this.termination) {
      await this.termination;
    }
    this.ensureWorker();
    const healthy = await this.ping();
    if (healthy) {
      return;
    }

    await this.restartWorker();
    const respawnHealthy = await this.ping();
    if (!respawnHealthy) {
      throw new Error(`Embedder sidecar failed health check for ${this.provider}:${this.name}`);
    }
  }

  private ensureWorker(): void {
    if (this.child && !this.child.killed) {
      return;
    }

    this.shuttingDown = false;
    this.stdoutBuffer = '';
    const child = fork(this.workerPath, [], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      detached: process.platform !== 'win32',
      env: {
        ...buildSidecarEnv(this.env, this.envAllowlist),
        SPECKIT_EMBEDDER_SIDECAR_PROVIDER: this.provider,
        SPECKIT_EMBEDDER_SIDECAR_MODEL: this.name,
        SPECKIT_EMBEDDER_SIDECAR_DIMENSIONS: String(this.dim),
        SPECKIT_EMBEDDER_SIDECAR_PARENT_PID: String(process.pid),
      },
    });
    this.child = child;

    child.stdout?.setEncoding('utf8');
    child.stdout?.on('data', (chunk: string) => this.handleStdout(chunk));

    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk: string) => {
      const pid = child.pid ?? 'unknown';
      for (const line of chunk.split(/\r?\n/)) {
        if (line.length > 0) {
          process.stderr.write(`[sidecar:${pid}] ${line}\n`);
        }
      }
    });

    child.once('exit', () => {
      if (!this.shuttingDown) {
        this.rejectAllPending(new Error(`Embedder sidecar exited for ${this.provider}:${this.name}`));
      }
      this.cleanupChild(child);
    });
  }

  private async restartWorker(): Promise<void> {
    await this.killWorker();
    this.ensureWorker();
  }

  private async killWorker(): Promise<void> {
    if (!this.child) {
      return;
    }

    await this.terminateChild(this.child);
  }

  private async terminateChild(child: ChildProcess): Promise<void> {
    if (this.termination) {
      await this.termination;
      return;
    }

    this.shuttingDown = true;
    this.termination = (async () => {
      signalChildProcessGroup(child, 'SIGTERM');
      const exitedAfterTerm = await waitForChildExit(child, DEFAULT_TERMINATION_GRACE_MS);
      if (!exitedAfterTerm) {
        signalChildProcessGroup(child, 'SIGKILL');
        await waitForChildExit(child, DEFAULT_TERMINATION_GRACE_MS);
      }
      this.cleanupChild(child);
    })().finally(() => {
      this.termination = null;
      this.shuttingDown = false;
    });

    await this.termination;
  }

  private cleanupChild(child: ChildProcess | null = this.child): void {
    if (!child || (this.child !== child && this.child !== null)) {
      return;
    }
    child.stdout?.removeAllListeners();
    child.stderr?.removeAllListeners();
    child.removeAllListeners();
    if (this.child === child) {
      this.child = null;
    }
    this.stdoutBuffer = '';
    this.clearIdleTimer();
  }

  private async ping(): Promise<boolean> {
    try {
      const response = await this.sendRequest<SidecarPongResponse>({ type: 'ping' }, this.pingTimeoutMs);
      return response.type === 'pong';
    } catch {
      return false;
    }
  }

  private sendRequest<T extends SidecarResponse>(
    payload: Record<string, unknown>,
    timeoutMs: number = this.requestTimeoutMs,
  ): Promise<T> {
    this.ensureWorker();
    const child = this.child;
    if (!child?.stdin || child.killed) {
      return Promise.reject(new Error(`Embedder sidecar is unavailable for ${this.provider}:${this.name}`));
    }

    const id = randomBytes(4).readUInt32BE(0);
    const request = { id, ...payload };

    return new Promise<T>((resolve, reject) => {
      let timer: NodeJS.Timeout | undefined;
      if (timeoutMs !== undefined) {
        timer = registerTimeout(() => {
          this.pending.delete(id);
          void this.terminateChild(child);
          reject(new Error(`Embedder sidecar request timed out after ${timeoutMs}ms`));
        }, timeoutMs, { unref: true });
      }

      this.pending.set(id, {
        resolve: (value: unknown) => resolve(value as T),
        reject,
        timer,
      });

      child.stdin!.write(`${JSON.stringify(request)}\n`, (error: Error | null | undefined) => {
        if (!error) {
          return;
        }
        if (timer) {
          clearRegisteredTimer(timer);
        }
        this.pending.delete(id);
        reject(error);
      });
    });
  }

  private handleStdout(chunk: string): void {
    if (this.stdoutBuffer.length + chunk.length > MAX_STDOUT_BUFFER_BYTES) {
      this.stdoutBuffer = '';
      this.emitDispatchFailure('sidecar-stdout-buffer-cap-exceeded');
      if (this.child) {
        void this.terminateChild(this.child);
      }
      return;
    }

    this.stdoutBuffer += chunk;

    let newlineIndex = this.stdoutBuffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = this.stdoutBuffer.slice(0, newlineIndex).trim();
      this.stdoutBuffer = this.stdoutBuffer.slice(newlineIndex + 1);
      if (line.length > 0) {
        if (line.length > MAX_LINE_BYTES) {
          this.stdoutBuffer = '';
          this.emitDispatchFailure('sidecar-stdout-line-cap-exceeded');
          if (this.child) {
            void this.terminateChild(this.child);
          }
          return;
        }
        this.handleResponseLine(line);
      }
      newlineIndex = this.stdoutBuffer.indexOf('\n');
    }
  }

  private handleResponseLine(line: string): void {
    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch (error: unknown) {
      process.stderr.write(`[sidecar:${this.child?.pid ?? 'unknown'}] invalid json: ${toErrorMessage(error)}\n`);
      return;
    }

    if (!responseHasId(parsed)) {
      return;
    }

    const pending = this.pending.get(parsed.id);
    if (!pending) {
      return;
    }

    this.pending.delete(parsed.id);
    if (pending.timer) {
      clearRegisteredTimer(pending.timer);
    }

    const response = parsed as SidecarResponse;
    if (response.type === 'error') {
      pending.reject(new Error(response.message));
      return;
    }
    pending.resolve(response);
  }

  private rejectAllPending(error: Error): void {
    for (const [id, pending] of this.pending.entries()) {
      if (pending.timer) {
        clearRegisteredTimer(pending.timer);
      }
      pending.reject(error);
      this.pending.delete(id);
    }
  }

  private emitDispatchFailure(reason: string): void {
    const pid = this.child?.pid ?? 'unknown';
    process.stderr.write(`[sidecar:${pid}] dispatch_failure: ${reason}\n`);
  }

  private scheduleIdleEviction(): void {
    this.clearIdleTimer();
    this.idleTimer = registerTimeout(() => {
      if (this.pending.size > 0) {
        this.scheduleIdleEviction();
        return;
      }
      void this.killWorker();
    }, this.idleMs, { unref: true });
  }

  private clearIdleTimer(): void {
    if (this.idleTimer) {
      clearRegisteredTimer(this.idleTimer);
      this.idleTimer = null;
    }
  }
}
