// ───────────────────────────────────────────────────────────────────
// MODULE: Ollama Local
// ───────────────────────────────────────────────────────────────────

import { EmbeddingProfile } from '../profile.js';
import { getCanonicalFallback } from '../registry.js';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking.js';
import type { EmbeddingProfileData, IEmbeddingProvider, ProviderMetadata } from '../../types.js';
import { OllamaAdapter, probeOllamaModel, resolveOllamaBaseUrl } from '../adapters/ollama.js';
import type { OllamaAvailability } from '../adapters/ollama.js';

// The provider is the legacy single-text surface over the same transport the
// adapter exposes: prefixing and chunking happen here, then every request goes
// through an OllamaAdapter built from a prefix-free manifest.
export { resolveOllamaBaseUrl };

// ───────────────────────────────────────────────────────────────────
// 1. MANIFESTS
// ───────────────────────────────────────────────────────────────────

// Derived from registry MANIFESTS[0].
const DEFAULT_MODEL: string = getCanonicalFallback('ollama');
const EMBEDDING_TIMEOUT = 30000;

export interface OllamaManifest {
  readonly name: string;
  readonly dim: number;
  readonly ollamaName: string;
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;
  readonly maxInputChars?: number;
}

export const OLLAMA_MANIFESTS: ReadonlyArray<OllamaManifest> = Object.freeze([
  {
    name: 'nomic-embed-text-v1.5',
    dim: 768,
    ollamaName: 'nomic-embed-text:v1.5',
    prefixQuery: 'search_query: ',
    prefixDocument: 'search_document: ',
    maxInputChars: 5000,
  },
]);

export const MODEL_DIMENSIONS: Readonly<Record<string, number>> = Object.freeze(
  Object.fromEntries(
    OLLAMA_MANIFESTS.flatMap((manifest) => [
      [manifest.name, manifest.dim],
      [manifest.ollamaName, manifest.dim],
    ]),
  ),
);

interface OllamaOptions {
  model?: string;
  dim?: number;
  baseUrl?: string;
  maxTextLength?: number;
  timeout?: number;
}

let availabilityPromise: Promise<OllamaAvailability> | null = null;

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

export function getOllamaManifest(name: string | undefined | null): OllamaManifest | undefined {
  if (!name) {
    return undefined;
  }
  return OLLAMA_MANIFESTS.find((manifest) => manifest.name === name || manifest.ollamaName === name);
}

export function resolveOllamaCanonicalModel(model: string): string {
  return getOllamaManifest(model)?.name || model;
}

function resolveManifest(model: string | undefined, dim?: number): OllamaManifest {
  const configured = model || process.env.OLLAMA_EMBEDDINGS_MODEL || DEFAULT_MODEL;
  const manifest = getOllamaManifest(configured);
  if (manifest) {
    return manifest;
  }

  return {
    name: configured,
    dim: typeof dim === 'number' && Number.isFinite(dim) && dim > 0 ? Math.trunc(dim) : 0,
    ollamaName: configured,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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

// ───────────────────────────────────────────────────────────────────
// 3. PROVIDER CLASS
// ───────────────────────────────────────────────────────────────────

export class OllamaProvider implements IEmbeddingProvider {
  modelName: string;
  dim: number;
  baseUrl: string;
  maxTextLength: number;
  timeout: number;
  isHealthy: boolean;
  requestCount: number;

  private readonly manifest: OllamaManifest;
  private readonly adapter: OllamaAdapter;

  constructor(options: OllamaOptions = {}) {
    this.manifest = resolveManifest(options.model, options.dim);
    this.modelName = this.manifest.name;
    this.dim = options.dim || this.manifest.dim;
    this.baseUrl = resolveOllamaBaseUrl(options.baseUrl);
    this.maxTextLength = options.maxTextLength || this.manifest.maxInputChars || MAX_TEXT_LENGTH;
    this.timeout = options.timeout || EMBEDDING_TIMEOUT;
    this.isHealthy = true;
    this.requestCount = 0;
    // Prefixes and length limits are applied here before the request, so the
    // adapter receives a manifest without them and never applies them twice.
    this.adapter = new OllamaAdapter({
      name: this.manifest.name,
      dim: this.dim,
      backend: 'ollama',
      ollamaName: this.manifest.ollamaName,
    }, { baseUrl: this.baseUrl, timeoutMs: this.timeout });
  }

  static async canLoad(options: Pick<OllamaOptions, 'model' | 'baseUrl' | 'timeout'> = {}): Promise<OllamaAvailability> {
    if (!availabilityPromise) {
      availabilityPromise = (async (): Promise<OllamaAvailability> => {
        const manifest = resolveManifest(options.model);
        const baseUrl = resolveOllamaBaseUrl(options.baseUrl);
        return probeOllamaModel(baseUrl, manifest.ollamaName, options.timeout || 5000);
      })();
    }

    return availabilityPromise;
  }

  private applyPrefix(text: string, inputType: 'document' | 'query'): string {
    const prefix = inputType === 'query' ? this.manifest.prefixQuery : this.manifest.prefixDocument;
    return prefix ? `${prefix}${text}` : text;
  }

  private prepareInput(text: string, inputType: 'document' | 'query'): string | null {
    if (!text || typeof text !== 'string') {
      return null;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return null;
    }

    const prefixed = this.applyPrefix(trimmedText, inputType);
    if (prefixed.length <= this.maxTextLength) {
      return prefixed;
    }

    return semanticChunk(prefixed, this.maxTextLength);
  }

  private async embedPrepared(input: string, inputType: 'document' | 'query'): Promise<Float32Array> {
    const [row] = await this.adapter.embed([input], { inputType });
    if (!row) {
      throw new Error('Ollama returned no embedding rows');
    }
    if (this.dim <= 0) {
      this.dim = this.adapter.dim;
    }

    this.requestCount += 1;
    return l2Normalize(row);
  }

  async generateEmbedding(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'document');
    if (!input) {
      console.warn('[ollama] Empty or invalid text provided');
      return null;
    }

    try {
      return await this.embedPrepared(input, 'document');
    } catch (error: unknown) {
      this.isHealthy = false;
      console.warn(`[ollama] Generation failed: ${getErrorMessage(error)}`);
      throw error;
    }
  }

  async embedDocument(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'document');
    if (!input) {
      return null;
    }
    return await this.embedPrepared(input, 'document');
  }

  async embedQuery(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'query');
    if (!input) {
      return null;
    }
    return await this.embedPrepared(input, 'query');
  }

  async warmup(): Promise<boolean> {
    try {
      const availability = await OllamaProvider.canLoad({
        model: this.modelName,
        baseUrl: this.baseUrl,
        timeout: this.timeout,
      });
      if (!availability.available) {
        this.isHealthy = false;
        return false;
      }
      await this.embedQuery('test warmup query');
      this.isHealthy = true;
      return true;
    } catch (_error: unknown) {
      this.isHealthy = false;
      return false;
    }
  }

  getMetadata(): ProviderMetadata {
    return {
      provider: 'ollama',
      model: this.modelName,
      dim: this.dim,
      healthy: this.isHealthy,
      baseUrl: this.baseUrl,
      loaded: this.isHealthy,
      requestCount: this.requestCount,
    };
  }

  getProfile(): EmbeddingProfileData {
    return new EmbeddingProfile({
      provider: 'ollama',
      model: this.modelName,
      dim: this.dim,
      dtype: null,
      baseUrl: this.baseUrl,
    });
  }

  async healthCheck(): Promise<boolean> {
    const availability = await OllamaProvider.canLoad({
      model: this.modelName,
      baseUrl: this.baseUrl,
      timeout: this.timeout,
    });
    this.isHealthy = availability.available;
    return this.isHealthy;
  }

  getProviderName(): string {
    return 'ollama';
  }
}

