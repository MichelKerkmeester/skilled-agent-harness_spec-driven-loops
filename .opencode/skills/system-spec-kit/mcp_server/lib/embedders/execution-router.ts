// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — execution router
// ───────────────────────────────────────────────────────────────

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';
import { getStartupEmbeddingProfile } from '@spec-kit/shared/embeddings';
import type { IEmbeddingProvider } from '@spec-kit/shared/types';

import type { EmbedderAdapter } from './adapter.js';
import { getAdapter } from './registry.js';
import { SidecarClient, toBackendKind, type EmbedOptions, type SidecarClientOptions, type SidecarWorkerInfo } from './sidecar-client.js';
import type { BackendKind } from './types.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

type EmbedderExecutionPolicy = 'auto' | 'direct' | 'sidecar';
export type ExecutionRouterAdapter = Omit<EmbedderAdapter, 'ready'>;

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SIDECAR_LOCAL_PROVIDERS = new Set(['hf-local', 'sentence-transformers']);
const SHUTDOWN_SIGNALS: readonly NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];
const directAdapters = new Map<string, ExecutionRouterAdapter>();
const sidecarClients = new Map<string, SidecarClient>();
let shutdownHooksRegistered = false;

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function normalizeProvider(provider: string): string {
  return provider.trim().toLowerCase();
}

function readExecutionPolicyEnv(): string | undefined {
  return process.env.SPECKIT_EMBEDDER_EXECUTION?.trim().toLowerCase();
}

export function resolveExecutionPolicy(raw: string | undefined = readExecutionPolicyEnv()): EmbedderExecutionPolicy {
  if (raw === undefined || raw.length === 0 || raw === 'auto') {
    return 'auto';
  }
  if (raw === 'direct' || raw === 'sidecar') {
    return raw;
  }
  return 'auto';
}

export function logPolicyResolution(
  raw: string | undefined = readExecutionPolicyEnv(),
  policy: EmbedderExecutionPolicy = resolveExecutionPolicy(raw),
): void {
  if (policy === 'auto' && raw !== undefined && raw.length > 0 && raw !== 'auto') {
    console.warn(`[embedder-execution] Invalid SPECKIT_EMBEDDER_EXECUTION="${raw}"; using auto`);
  }
}

export function shouldUseSidecar(provider: string): boolean {
  const rawPolicy = readExecutionPolicyEnv();
  const policy = resolveExecutionPolicy(rawPolicy);
  logPolicyResolution(rawPolicy, policy);
  if (policy === 'direct') {
    return false;
  }
  if (policy === 'sidecar') {
    return true;
  }
  return SIDECAR_LOCAL_PROVIDERS.has(normalizeProvider(provider));
}

export function resolveDimensions(provider: string, model: string, dimensions?: number): number {
  if (typeof dimensions === 'number' && Number.isInteger(dimensions) && dimensions > 0) {
    return dimensions;
  }

  const profile = getStartupEmbeddingProfile();
  if (normalizeProvider(profile.provider) !== normalizeProvider(provider) || profile.model !== model) {
    console.warn(
      `[embedder-execution] Falling back to default dimensions ${profile.dim} for ${provider}:${model}; default profile is ${profile.provider}:${profile.model}`,
    );
  }
  return profile.dim;
}

export function registerShutdownHooks(): void {
  if (shutdownHooksRegistered) {
    return;
  }

  shutdownHooksRegistered = true;
  const shutdown = async (): Promise<void> => {
    await shutdownAllSidecars();
  };
  const handleSignal = async (signal: NodeJS.Signals): Promise<void> => {
    await shutdown();
    process.kill(process.pid, signal);
  };
  process.once('beforeExit', shutdown);
  SHUTDOWN_SIGNALS.forEach((signal) => process.once(signal, handleSignal));
}

// ───────────────────────────────────────────────────────────────
// 4. DIRECT ADAPTER
// ───────────────────────────────────────────────────────────────

class DirectProviderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind;

  private providerPromise: Promise<IEmbeddingProvider> | null = null;
  private readonly registryAdapter: EmbedderAdapter | undefined;

  constructor(
    private readonly provider: string,
    model: string,
    dimensions: number,
  ) {
    this.name = model;
    this.dim = dimensions;
    this.backend = toBackendKind(provider);
    this.registryAdapter = provider === 'ollama' ? getAdapter(model) : undefined;
  }

  async embed(texts: ReadonlyArray<string>, options: EmbedOptions = {}): Promise<Float32Array[]> {
    if (texts.length === 0) {
      return [];
    }

    if (this.registryAdapter) {
      const adapter = this.registryAdapter as EmbedderAdapter & {
        embed: (input: ReadonlyArray<string>, opts?: EmbedOptions) => Promise<Float32Array[]>;
      };
      return adapter.embed(texts, options);
    }

    const provider = await this.getProvider();
    const vectors: Float32Array[] = [];
    for (const text of texts) {
      const embedding = options.inputType === 'query'
        ? await provider.embedQuery(text)
        : await provider.embedDocument(text);
      if (!embedding) {
        throw new Error(`Embedding provider returned null for ${this.provider}:${this.name}`);
      }
      vectors.push(embedding);
    }
    return vectors;
  }

  private getProvider(): Promise<IEmbeddingProvider> {
    if (!this.providerPromise) {
      this.providerPromise = createEmbeddingsProvider({
        provider: this.provider === 'api' ? 'openai' : this.provider,
        model: this.name,
        dim: this.dim,
        warmup: false,
      });
    }
    return this.providerPromise;
  }
}

// ───────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function getEmbedderAdapter(provider: string, model: string, dimensionsOverride?: number): ExecutionRouterAdapter {
  const normalizedProvider = normalizeProvider(provider);
  const key = `${normalizedProvider}:${model}`;
  const dimensions = resolveDimensions(normalizedProvider, model, dimensionsOverride);

  if (shouldUseSidecar(normalizedProvider)) {
    let client = sidecarClients.get(key);
    if (!client) {
      const options: SidecarClientOptions = {
        provider: normalizedProvider,
        model,
        dimensions,
        backend: toBackendKind(normalizedProvider),
      };
      client = new SidecarClient(options);
      sidecarClients.set(key, client);
      registerShutdownHooks();
    }
    return client;
  }

  let adapter = directAdapters.get(key);
  if (!adapter) {
    adapter = new DirectProviderAdapter(normalizedProvider, model, dimensions);
    directAdapters.set(key, adapter);
  }
  return adapter;
}

export function getSidecarWorkerSnapshot(now: number = Date.now()): Record<string, SidecarWorkerInfo> {
  const snapshot: Record<string, SidecarWorkerInfo> = {};
  for (const [key, client] of sidecarClients.entries()) {
    const info = client.getWorkerInfo(now);
    if (info) {
      snapshot[key] = info;
    }
  }
  return snapshot;
}

export async function shutdownAllSidecars(): Promise<void> {
  const clients = Array.from(sidecarClients.values());
  await Promise.all(clients.map((client) => client.shutdown()));
}

export function clearEmbedderExecutionRouterState(): void {
  directAdapters.clear();
  sidecarClients.clear();
  shutdownHooksRegistered = false;
}
