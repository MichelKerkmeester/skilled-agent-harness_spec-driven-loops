// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — execution router
// ───────────────────────────────────────────────────────────────

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';
import { getStartupEmbeddingProfile } from '@spec-kit/shared/embeddings';
import type { IEmbeddingProvider } from '@spec-kit/shared/types';

import type { EmbedderAdapter } from './adapter.js';
import { getAdapter, getManifest } from './registry.js';
import { SidecarClient, toBackendKind, type SidecarClientOptions, type SidecarWorkerInfo } from './sidecar-client.js';
import type { BackendKind } from './types.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

export type EmbedderExecutionPolicy = 'auto' | 'direct' | 'sidecar';
export type EmbedderExecutionInputType = 'document' | 'query';

interface EmbedOptions {
  readonly inputType?: EmbedderExecutionInputType;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SIDECAR_LOCAL_PROVIDERS = new Set(['hf-local', 'sentence-transformers']);
const directAdapters = new Map<string, EmbedderAdapter>();
const sidecarClients = new Map<string, SidecarClient>();
let shutdownHooksRegistered = false;

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function normalizeProvider(provider: string): string {
  return provider.trim().toLowerCase();
}

function cacheKey(provider: string, model: string): string {
  return `${normalizeProvider(provider)}:${model}`;
}

function resolveExecutionPolicy(): EmbedderExecutionPolicy {
  const raw = process.env.SPECKIT_EMBEDDER_EXECUTION?.trim().toLowerCase();
  if (raw === undefined || raw.length === 0 || raw === 'auto') {
    return 'auto';
  }
  if (raw === 'direct' || raw === 'sidecar') {
    return raw;
  }
  console.warn(`[embedder-execution] Invalid SPECKIT_EMBEDDER_EXECUTION="${raw}"; using auto`);
  return 'auto';
}

function shouldUseSidecar(provider: string): boolean {
  const policy = resolveExecutionPolicy();
  if (policy === 'direct') {
    return false;
  }
  if (policy === 'sidecar') {
    return true;
  }
  return SIDECAR_LOCAL_PROVIDERS.has(normalizeProvider(provider));
}

function resolveDimensions(provider: string, model: string, dimensions?: number): number {
  if (typeof dimensions === 'number' && Number.isInteger(dimensions) && dimensions > 0) {
    return dimensions;
  }

  const manifest = getManifest(model);
  if (manifest) {
    return manifest.dim;
  }

  const profile = getStartupEmbeddingProfile();
  if (profile.provider === provider && profile.model === model) {
    return profile.dim;
  }

  return profile.dim;
}

function normalizeProviderForFactory(provider: string): string {
  const normalized = normalizeProvider(provider);
  if (normalized === 'api') {
    return 'openai';
  }
  return normalized;
}

function registerShutdownHooks(): void {
  if (shutdownHooksRegistered) {
    return;
  }

  shutdownHooksRegistered = true;
  const shutdown = (): void => {
    void shutdownAllSidecars();
  };
  process.once('beforeExit', shutdown);
  process.once('SIGINT', () => {
    shutdown();
    process.kill(process.pid, 'SIGINT');
  });
  process.once('SIGTERM', () => {
    shutdown();
    process.kill(process.pid, 'SIGTERM');
  });
}

// ───────────────────────────────────────────────────────────────
// 4. DIRECT ADAPTER
// ───────────────────────────────────────────────────────────────

class DirectProviderAdapter implements EmbedderAdapter {
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
    this.backend = toBackendKind(normalizeProvider(provider));
    this.registryAdapter = normalizeProvider(provider) === 'ollama' ? getAdapter(model) : undefined;
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

  async ready(): Promise<boolean> {
    if (this.registryAdapter) {
      return this.registryAdapter.ready();
    }
    try {
      const provider = await this.getProvider();
      return provider.healthCheck();
    } catch {
      return false;
    }
  }

  private getProvider(): Promise<IEmbeddingProvider> {
    if (!this.providerPromise) {
      this.providerPromise = createEmbeddingsProvider({
        provider: normalizeProviderForFactory(this.provider),
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

export function getEmbedderAdapter(provider: string, model: string, dimensionsOverride?: number): EmbedderAdapter {
  const key = cacheKey(provider, model);
  const dimensions = resolveDimensions(provider, model, dimensionsOverride);

  if (shouldUseSidecar(provider)) {
    let client = sidecarClients.get(key);
    if (!client) {
      const options: SidecarClientOptions = {
        provider: normalizeProvider(provider),
        model,
        dimensions,
        backend: toBackendKind(normalizeProvider(provider)),
      };
      client = new SidecarClient(options);
      sidecarClients.set(key, client);
      registerShutdownHooks();
    }
    return client;
  }

  let adapter = directAdapters.get(key);
  if (!adapter) {
    adapter = new DirectProviderAdapter(normalizeProvider(provider), model, dimensions);
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

export const __embedderExecutionRouterTestables = {
  resolveExecutionPolicy,
  shouldUseSidecar,
  clear(): void {
    directAdapters.clear();
    sidecarClients.clear();
  },
};
