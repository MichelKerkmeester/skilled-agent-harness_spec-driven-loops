// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — execution router
// ───────────────────────────────────────────────────────────────

import { createEmbeddingsProvider } from '@spec-kit/shared/embeddings/factory';
import { getStartupEmbeddingProfile } from '@spec-kit/shared/embeddings';
import type { IEmbeddingProvider } from '@spec-kit/shared/types';

import type { EmbedderAdapter } from './adapter.js';
import { getAdapter } from './registry.js';
import type { BackendKind } from './types.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

export type ExecutionRouterAdapter = Omit<EmbedderAdapter, 'ready'> & {
  dispose?: () => Promise<void>;
};

export interface CredentialCacheInvalidationEvent {
  readonly reason: 'active-adapter-rotated' | 'router-state-cleared';
  readonly previousKey: string | null;
  readonly nextKey: string | null;
  readonly clearedDirectAdapterKeys: readonly string[];
  readonly staleWindow: 'until-next-adapter-resolution';
}

export type CredentialCacheInvalidationListener = (event: CredentialCacheInvalidationEvent) => void;

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const directAdapters = new Map<string, ExecutionRouterAdapter>();
const credentialCacheInvalidationListeners = new Set<CredentialCacheInvalidationListener>();
let activeAdapterKey: string | null = null;
let executionPolicyNoOpWarningLogged = false;

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function normalizeProvider(provider: string): string {
  return provider.trim().toLowerCase();
}

function warnIgnoredExecutionPolicyEnv(): void {
  const raw = process.env.SPECKIT_EMBEDDER_EXECUTION?.trim();
  if (raw === undefined || raw.length === 0 || executionPolicyNoOpWarningLogged) {
    return;
  }

  executionPolicyNoOpWarningLogged = true;
  console.warn(
    `[embedder-execution] SPECKIT_EMBEDDER_EXECUTION="${raw}" is deprecated and ignored; using direct provider routing`,
  );
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

export function onCredentialCacheInvalidation(listener: CredentialCacheInvalidationListener): () => void {
  credentialCacheInvalidationListeners.add(listener);
  return () => {
    credentialCacheInvalidationListeners.delete(listener);
  };
}

function emitCredentialCacheInvalidation(event: CredentialCacheInvalidationEvent): void {
  for (const listener of credentialCacheInvalidationListeners) {
    listener(event);
  }
}

function warnDisposeFailure(context: string, error: unknown): void {
  console.warn(`[embedder-execution] ${context} failed: ${error instanceof Error ? error.message : String(error)}`);
}

function clearDirectAdapterCredentialCache(
  reason: CredentialCacheInvalidationEvent['reason'],
  previousKey: string | null,
  nextKey: string | null,
): void {
  const clearedDirectAdapterKeys = Array.from(directAdapters.keys());
  for (const key of clearedDirectAdapterKeys) {
    const adapter = directAdapters.get(key);
    void adapter?.dispose?.().catch((error: unknown) => warnDisposeFailure(`Direct adapter dispose for ${key}`, error));
  }
  directAdapters.clear();
  emitCredentialCacheInvalidation({
    reason,
    previousKey,
    nextKey,
    clearedDirectAdapterKeys,
    staleWindow: 'until-next-adapter-resolution',
  });
}

function reconcileActiveAdapterKey(nextKey: string): void {
  if (activeAdapterKey !== null && activeAdapterKey !== nextKey) {
    clearDirectAdapterCredentialCache('active-adapter-rotated', activeAdapterKey, nextKey);
  }
  activeAdapterKey = nextKey;
}

// ───────────────────────────────────────────────────────────────
// 4. DIRECT ADAPTER
// ───────────────────────────────────────────────────────────────

function createOllamaDelegatingAdapter(adapter: EmbedderAdapter): ExecutionRouterAdapter {
  return {
    name: adapter.name,
    dim: adapter.dim,
    backend: adapter.backend,
    embed(texts, options) {
      return adapter.embed(texts, options);
    },
  };
}

function toProviderFactoryName(provider: string): string {
  return provider === 'api' ? 'openai' : provider;
}

function toBackendKind(provider: string | undefined): BackendKind {
  if (provider === 'ollama') {
    return 'ollama';
  }
  if (provider === 'openai' || provider === 'voyage' || provider === 'api') {
    return 'api';
  }
  return 'sentence-transformers';
}

function createFactoryBackedAdapter(provider: string, model: string, dimensions: number): ExecutionRouterAdapter {
  let providerPromise: Promise<IEmbeddingProvider> | null = null;

  const getProvider = (): Promise<IEmbeddingProvider> => {
    if (!providerPromise) {
      const created = createEmbeddingsProvider({
        provider: toProviderFactoryName(provider),
        model,
        dim: dimensions,
        warmup: false,
      });
      providerPromise = created.catch((error: unknown) => {
        if (providerPromise === created) {
          providerPromise = null;
        }
        throw error;
      });
    }
    return providerPromise;
  };

  return {
    name: model,
    dim: dimensions,
    backend: toBackendKind(provider),
    async embed(texts, options = {}) {
      if (texts.length === 0) {
        return [];
      }

      const embeddingProvider = await getProvider();
      const vectors: Float32Array[] = [];
      for (const text of texts) {
        const embedding = options.inputType === 'query'
          ? await embeddingProvider.embedQuery(text)
          : await embeddingProvider.embedDocument(text);
        if (!embedding) {
          throw new Error(`Embedding provider returned null for ${provider}:${model}`);
        }
        vectors.push(embedding);
      }
      return vectors;
    },
    async dispose(): Promise<void> {
      const captured = providerPromise;
      providerPromise = null;
      if (!captured) {
        return;
      }
      const embeddingProvider = await captured.catch(() => null);
      await embeddingProvider?.dispose?.();
    },
  };
}

function createDirectProviderAdapter(provider: string, model: string, dimensions: number): ExecutionRouterAdapter {
  if (provider === 'ollama') {
    const adapter = getAdapter(model);
    if (adapter) {
      return createOllamaDelegatingAdapter(adapter);
    }
  }

  return createFactoryBackedAdapter(provider, model, dimensions);
}

// ───────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function getEmbedderAdapter(provider: string, model: string, dimensionsOverride?: number): ExecutionRouterAdapter {
  const normalizedProvider = normalizeProvider(provider);
  const key = `${normalizedProvider}:${model}`;
  const dimensions = resolveDimensions(normalizedProvider, model, dimensionsOverride);
  reconcileActiveAdapterKey(key);
  warnIgnoredExecutionPolicyEnv();

  let adapter = directAdapters.get(key);
  if (!adapter) {
    adapter = createDirectProviderAdapter(normalizedProvider, model, dimensions);
    directAdapters.set(key, adapter);
  }
  return adapter;
}

export async function disposeDirectAdapter(key: string): Promise<void> {
  const adapter = directAdapters.get(key);
  if (!adapter) {
    return;
  }

  directAdapters.delete(key);
  await adapter.dispose?.();
}

export async function teardownEmbedderAfterSwap(provider: string, model: string): Promise<void> {
  const normalizedProvider = normalizeProvider(provider);
  const key = `${normalizedProvider}:${model}`;
  await disposeDirectAdapter(key);
}

export function clearEmbedderExecutionRouterState(): void {
  const previousKey = activeAdapterKey;
  clearDirectAdapterCredentialCache('router-state-cleared', previousKey, null);
  activeAdapterKey = null;
  executionPolicyNoOpWarningLogged = false;
}

export function getDirectAdapterCacheKeys(): readonly string[] {
  return Array.from(directAdapters.keys());
}
