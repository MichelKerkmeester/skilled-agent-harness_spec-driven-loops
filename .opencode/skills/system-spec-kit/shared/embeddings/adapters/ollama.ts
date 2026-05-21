// ───────────────────────────────────────────────────────────────
// MODULE: Embedders — Ollama adapter (shared)
// ───────────────────────────────────────────────────────────────
// Canonical OllamaAdapter shared by mk-spec-memory and skill-advisor.
// Both skills' local `mcp_server/lib/embedders/adapters/ollama.ts`
// re-export from here.
//
// Promoted from mk-spec-memory's mcp_server/lib/embedders/adapters/ollama.ts
// in phase 003/006. The implementation is byte-equivalent to skill-advisor's
// prior copy plus mk-spec-memory's (they had already converged).
// ───────────────────────────────────────────────────────────────

import type { EmbedderAdapter, EmbedderOptions } from '../adapter.js';
import type { BackendKind, EmbedderManifest } from '../types.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────

export type OllamaInputType = 'document' | 'query';

export interface OllamaEmbedOptions {
  readonly inputType?: OllamaInputType;
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

// ───────────────────────────────────────────────────────────────
// 2. ERRORS
// ───────────────────────────────────────────────────────────────

export class OllamaAdapterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OllamaAdapterError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class OllamaBackendUnreachableError extends OllamaAdapterError {
  constructor(baseUrl: string, cause?: unknown) {
    const suffix = cause instanceof Error ? `: ${cause.message}` : '';
    super(`Ollama backend unreachable at ${baseUrl}${suffix}`);
    this.name = 'OllamaBackendUnreachableError';
  }
}

export class OllamaModelNotLoadedError extends OllamaAdapterError {
  constructor(model: string) {
    super(`Ollama model is not loaded: ${model}`);
    this.name = 'OllamaModelNotLoadedError';
  }
}

export class OllamaDimensionMismatchError extends OllamaAdapterError {
  constructor(model: string, expected: number, actual: number) {
    super(`Ollama embedding dimension mismatch for ${model}: expected ${expected}, got ${actual}`);
    this.name = 'OllamaDimensionMismatchError';
  }
}

// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────

const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

// ───────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────

function getOllamaBaseUrl(): string {
  return (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, '');
}

function getManifestModelName(manifest: EmbedderManifest): string {
  return manifest.ollamaName || manifest.name;
}

function normalizeErrorMessage(value: unknown): string {
  if (value instanceof Error) {
    return value.message;
  }
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
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

  const names = response.models
    .map((model: OllamaTag) => {
      if (typeof model.name === 'string') return model.name;
      if (typeof model.model === 'string') return model.model;
      return null;
    })
    .filter((name): name is string => name !== null);

  return new Set(names);
}

// ───────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export class OllamaAdapter implements EmbedderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind = 'ollama';
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;

  private readonly ollamaTag: string;
  private readonly baseUrl: string;
  private readonly maxInputChars?: number;

  constructor(private readonly manifest: EmbedderManifest) {
    if (manifest.backend !== 'ollama') {
      throw new TypeError(`OllamaAdapter requires an ollama manifest, got ${manifest.backend}`);
    }

    this.name = manifest.name;
    this.dim = manifest.dim;
    this.prefixQuery = manifest.prefixQuery;
    this.prefixDocument = manifest.prefixDocument;
    this.ollamaTag = getManifestModelName(manifest);
    this.baseUrl = getOllamaBaseUrl();
    this.maxInputChars = manifest.maxInputChars;
  }

  async embed(texts: ReadonlyArray<string>, options: EmbedderOptions = {}): Promise<Float32Array[]> {
    if (texts.length === 0) {
      return [];
    }

    const input = texts.map((text) => this.prepareInput(text, options.inputType ?? 'document'));
    const body = await this.postEmbed(input);
    const rows = parseEmbeddingRows(body);

    if (rows.length !== texts.length) {
      throw new OllamaAdapterError(
        `Ollama returned ${rows.length} embeddings for ${texts.length} inputs`,
      );
    }

    return rows.map((row) => this.toVector(row));
  }

  async ready(): Promise<boolean> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/api/tags`, { method: 'GET' });
    } catch {
      return false;
    }

    if (!response.ok) {
      return false;
    }

    const body = await readJson(response);
    return parseOllamaTagNames(body).has(this.ollamaTag);
  }

  private applyPrefix(text: string, inputType: OllamaInputType): string {
    const prefix = inputType === 'query' ? this.prefixQuery : this.prefixDocument;
    return prefix ? `${prefix}${text}` : text;
  }

  private prepareInput(text: string, inputType: OllamaInputType): string {
    const input = this.applyPrefix(text, inputType);
    if (this.maxInputChars === undefined) {
      return input;
    }

    const safeMaxInputChars = Math.floor(this.maxInputChars);
    if (!Number.isFinite(safeMaxInputChars) || safeMaxInputChars <= 0 || input.length <= safeMaxInputChars) {
      return input;
    }

    return input.slice(0, safeMaxInputChars);
  }

  private async postEmbed(input: ReadonlyArray<string>): Promise<unknown> {
    const batchResponse = await this.postJson('/api/embed', { model: this.ollamaTag, input });
    if (batchResponse.response.ok) {
      return batchResponse.body;
    }

    if (batchResponse.response.status !== 404 || input.length !== 1) {
      this.throwForEmbeddingResponse(batchResponse.response, batchResponse.body);
    }

    const singleResponse = await this.postJson('/api/embeddings', {
      model: this.ollamaTag,
      prompt: input[0],
    });
    if (!singleResponse.response.ok) {
      this.throwForEmbeddingResponse(singleResponse.response, singleResponse.body);
    }
    return singleResponse.body;
  }

  private async postJson(path: string, payload: Record<string, unknown>): Promise<{ response: Response; body: unknown }> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error: unknown) {
      throw new OllamaBackendUnreachableError(this.baseUrl, error);
    }

    const body = await readJson(response);
    return { response, body };
  }

  private throwForEmbeddingResponse(response: Response, body: unknown): never {
    if (isModelMissingResponse(response, body)) {
      throw new OllamaModelNotLoadedError(this.ollamaTag);
    }

    throw new OllamaAdapterError(
      `Ollama embedding request failed (${response.status} ${response.statusText}): ${normalizeErrorMessage(body)}`,
    );
  }

  private toVector(row: number[]): Float32Array {
    if (row.length !== this.dim) {
      throw new OllamaDimensionMismatchError(this.ollamaTag, this.dim, row.length);
    }
    return new Float32Array(row);
  }
}
