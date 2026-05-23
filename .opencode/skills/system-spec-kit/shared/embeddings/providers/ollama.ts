// ───────────────────────────────────────────────────────────────────
// MODULE: Ollama Local
// ───────────────────────────────────────────────────────────────────

import { EmbeddingProfile } from '../profile.js';
import { getCanonicalFallback } from '../registry.js';
import { semanticChunk, MAX_TEXT_LENGTH } from '../../chunking.js';
import type { EmbeddingProfileData, IEmbeddingProvider, ProviderMetadata } from '../../types.js';

// ---------------------------------------------------------------
// 1. MANIFESTS
// ---------------------------------------------------------------

const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
// Derived from registry MANIFESTS[0] per ADR-013/014.
// Previously hardcoded to 'jina-embeddings-v3' — that was stale
// (pre-ADR-013) and contradicted the bake-off operator override.
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
  {
    name: 'mxbai-embed-large-v1',
    dim: 1024,
    ollamaName: 'mxbai-embed-large:latest',
    maxInputChars: 1200,
  },
  {
    name: 'bge-small-en-v1.5',
    dim: 384,
    ollamaName: 'bge-small-en-v1.5:latest',
  },
  {
    name: 'bge-large-en-v1.5',
    dim: 1024,
    ollamaName: 'bge-large-en-v1.5:latest',
  },
  {
    name: 'jina-embeddings-v3',
    dim: 1024,
    ollamaName: 'hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M',
    maxInputChars: 8000,
  },
  {
    name: 'bge-m3',
    dim: 1024,
    ollamaName: 'bge-m3:latest',
    maxInputChars: 8000,
  },
  {
    name: 'snowflake-arctic-embed-l-v2.0',
    dim: 1024,
    ollamaName: 'snowflake-arctic-embed2:latest',
    maxInputChars: 8000,
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

interface OllamaTag {
  readonly name?: unknown;
  readonly model?: unknown;
}

interface OllamaTagsResponse {
  readonly models?: unknown;
}

interface OllamaEmbedResponse {
  readonly embeddings?: unknown;
  readonly embedding?: unknown;
}

interface OllamaAvailability {
  available: boolean;
  reason?: string;
}

let availabilityPromise: Promise<OllamaAvailability> | null = null;

// ---------------------------------------------------------------
// 2. HELPERS
// ---------------------------------------------------------------

export function resolveOllamaBaseUrl(value: string | undefined = process.env.OLLAMA_BASE_URL): string {
  return (value || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, '');
}

export function getOllamaManifest(name: string | undefined | null): OllamaManifest | undefined {
  if (!name) {
    return undefined;
  }
  return OLLAMA_MANIFESTS.find((manifest) => manifest.name === name || manifest.ollamaName === name);
}

export function resolveOllamaCanonicalModel(model: string): string {
  return getOllamaManifest(model)?.name || model;
}

function resolveManifest(model: string | undefined): OllamaManifest {
  const configured = model || process.env.OLLAMA_EMBEDDINGS_MODEL || DEFAULT_MODEL;
  const manifest = getOllamaManifest(configured);
  if (!manifest) {
    throw new Error(
      `Unknown Ollama embedding model "${configured}". Supported: ${OLLAMA_MANIFESTS.map((m) => m.name).join(', ')}`,
    );
  }
  return manifest;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));
}

function parseEmbeddingRows(body: unknown): number[][] {
  if (typeof body !== 'object' || body === null) {
    return [];
  }

  const payload = body as OllamaEmbedResponse;
  if (Array.isArray(payload.embeddings) && payload.embeddings.every(isNumberArray)) {
    return payload.embeddings;
  }

  if (isNumberArray(payload.embedding)) {
    return [payload.embedding];
  }

  return [];
}

function parseOllamaTagNames(body: unknown): Set<string> {
  if (typeof body !== 'object' || body === null) {
    return new Set();
  }

  const response = body as OllamaTagsResponse;
  if (!Array.isArray(response.models)) {
    return new Set();
  }

  return new Set(
    response.models
      .map((model: OllamaTag) => {
        if (typeof model.name === 'string') return model.name;
        if (typeof model.model === 'string') return model.model;
        return null;
      })
      .filter((name): name is string => name !== null),
  );
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
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

function isModelMissingResponse(response: Response, body: unknown): boolean {
  if (response.status === 404) {
    return true;
  }

  const message = typeof body === 'object' && body !== null && 'error' in body
    ? String((body as { error?: unknown }).error)
    : '';

  return /model.*(not found|not loaded|pull)|pull.*model/i.test(message);
}

// ---------------------------------------------------------------
// 3. PROVIDER CLASS
// ---------------------------------------------------------------

export class OllamaProvider implements IEmbeddingProvider {
  modelName: string;
  dim: number;
  baseUrl: string;
  maxTextLength: number;
  timeout: number;
  isHealthy: boolean;
  requestCount: number;

  private readonly manifest: OllamaManifest;

  constructor(options: OllamaOptions = {}) {
    this.manifest = resolveManifest(options.model);
    this.modelName = this.manifest.name;
    this.dim = options.dim || this.manifest.dim;
    this.baseUrl = resolveOllamaBaseUrl(options.baseUrl);
    this.maxTextLength = options.maxTextLength || this.manifest.maxInputChars || MAX_TEXT_LENGTH;
    this.timeout = options.timeout || EMBEDDING_TIMEOUT;
    this.isHealthy = true;
    this.requestCount = 0;
  }

  static async canLoad(options: Pick<OllamaOptions, 'model' | 'baseUrl' | 'timeout'> = {}): Promise<OllamaAvailability> {
    if (!availabilityPromise) {
      availabilityPromise = (async (): Promise<OllamaAvailability> => {
        const manifest = resolveManifest(options.model);
        const baseUrl = resolveOllamaBaseUrl(options.baseUrl);
        try {
          const response = await fetchWithTimeout(`${baseUrl}/api/tags`, { method: 'GET' }, options.timeout || 5000);
          if (!response.ok) {
            return { available: false, reason: `Ollama /api/tags returned ${response.status} ${response.statusText}` };
          }
          const tags = parseOllamaTagNames(await readJson(response));
          if (!tags.has(manifest.ollamaName)) {
            return { available: false, reason: `Ollama model is not loaded: ${manifest.ollamaName}` };
          }
          return { available: true };
        } catch (error: unknown) {
          return { available: false, reason: `Ollama backend unreachable at ${baseUrl}: ${getErrorMessage(error)}` };
        }
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

  private async postJson(path: string, payload: Record<string, unknown>): Promise<{ response: Response; body: unknown }> {
    const response = await fetchWithTimeout(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    }, this.timeout);

    return {
      response,
      body: await readJson(response),
    };
  }

  private async embedPrepared(input: string): Promise<Float32Array> {
    const batchResponse = await this.postJson('/api/embed', {
      model: this.manifest.ollamaName,
      input: [input],
    });

    let body = batchResponse.body;
    if (!batchResponse.response.ok) {
      if (batchResponse.response.status !== 404) {
        this.throwForEmbeddingResponse(batchResponse.response, body);
      }

      const legacyResponse = await this.postJson('/api/embeddings', {
        model: this.manifest.ollamaName,
        prompt: input,
      });
      if (!legacyResponse.response.ok) {
        this.throwForEmbeddingResponse(legacyResponse.response, legacyResponse.body);
      }
      body = legacyResponse.body;
    }

    const [row] = parseEmbeddingRows(body);
    if (!row) {
      throw new Error('Ollama returned no embedding rows');
    }
    if (row.length !== this.dim) {
      throw new Error(`Ollama embedding dimension mismatch for ${this.modelName}: expected ${this.dim}, got ${row.length}`);
    }

    this.requestCount += 1;
    return l2Normalize(new Float32Array(row));
  }

  private throwForEmbeddingResponse(response: Response, body: unknown): never {
    if (isModelMissingResponse(response, body)) {
      throw new Error(`Ollama model is not loaded: ${this.manifest.ollamaName}`);
    }

    throw new Error(`Ollama embedding request failed (${response.status} ${response.statusText}): ${JSON.stringify(body)}`);
  }

  async generateEmbedding(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'document');
    if (!input) {
      console.warn('[ollama] Empty or invalid text provided');
      return null;
    }

    try {
      return await this.embedPrepared(input);
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
    return await this.embedPrepared(input);
  }

  async embedQuery(text: string): Promise<Float32Array | null> {
    const input = this.prepareInput(text, 'query');
    if (!input) {
      return null;
    }
    return await this.embedPrepared(input);
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

export const __ollamaProviderTestables = {
  resetAvailabilityCache(): void {
    availabilityPromise = null;
  },
};
