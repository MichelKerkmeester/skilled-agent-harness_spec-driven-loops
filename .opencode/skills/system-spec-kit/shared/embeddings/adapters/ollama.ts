// ───────────────────────────────────────────────────────────────────
// MODULE: Embedders — Ollama adapter (shared)
// ───────────────────────────────────────────────────────────────────
// Canonical OllamaAdapter for the shared embedding stack owned by the skill
// advisor. A consumer's local `mcp-server/lib/embedders/adapters/ollama.ts`
// re-exports from here, so a fix to the daemon protocol lands once.
// ───────────────────────────────────────────────────────────────────

import type { EmbedderAdapter, EmbedderOptions } from '../adapter.js';
import type { BackendKind, EmbedderManifest } from '../types.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────────
// 2. ERRORS
// ───────────────────────────────────────────────────────────────────

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

// A timeout is a subclass of "unreachable" on purpose: a server that accepts the
// connection and never answers is, to every caller, the same outage as one that
// refuses it, and callers already degrade on the unreachable case.
export class OllamaRequestTimeoutError extends OllamaBackendUnreachableError {
  constructor(baseUrl: string, path: string, timeoutMs: number) {
    super(baseUrl, new Error(`request to ${path} timed out after ${timeoutMs}ms`));
    this.name = 'OllamaRequestTimeoutError';
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

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

// Every request carries a deadline. A wedged Ollama accepts the TCP connection
// and then never answers, and its /api/tags endpoint keeps replying while it does,
// so the readiness probe reports healthy and an unbounded fetch parks the caller
// forever. The deadline is split by what the embedding is for, which `inputType`
// already tells us: a query embedding sits in an interactive scoring path whose
// caller falls back to a lexical-only answer, so it gives up fast; a document
// embedding runs inside batch indexing, where a long wait is the expected cost,
// so it scales with the batch instead of failing a legitimately slow run.
const OLLAMA_TAGS_TIMEOUT_MS = 5_000;
const OLLAMA_QUERY_TIMEOUT_MS = 5_000;
const OLLAMA_DOCUMENT_BASE_TIMEOUT_MS = 30_000;
const OLLAMA_DOCUMENT_PER_INPUT_TIMEOUT_MS = 2_000;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function getOllamaBaseUrl(): string {
  return (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, '');
}

// A positive OLLAMA_REQUEST_TIMEOUT_MS pins every request to one deadline, for
// operators whose backend is slower or faster than the defaults assume.
function getTimeoutOverrideMs(): number | null {
  const raw = Number.parseInt(process.env.OLLAMA_REQUEST_TIMEOUT_MS ?? '', 10);
  return Number.isFinite(raw) && raw > 0 ? raw : null;
}

function embedTimeoutMs(inputType: OllamaInputType, inputCount: number): number {
  const override = getTimeoutOverrideMs();
  if (override !== null) return override;
  if (inputType === 'query') return OLLAMA_QUERY_TIMEOUT_MS;
  return OLLAMA_DOCUMENT_BASE_TIMEOUT_MS
    + OLLAMA_DOCUMENT_PER_INPUT_TIMEOUT_MS * Math.max(0, inputCount - 1);
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
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

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

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

    const inputType = options.inputType ?? 'document';
    const input = texts.map((text) => this.prepareInput(text, inputType));
    const body = await this.postEmbed(input, inputType);
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
      response = await fetchWithTimeout(
        `${this.baseUrl}/api/tags`,
        { method: 'GET' },
        getTimeoutOverrideMs() ?? OLLAMA_TAGS_TIMEOUT_MS,
      );
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

  private async postEmbed(
    input: ReadonlyArray<string>,
    inputType: OllamaInputType,
  ): Promise<unknown> {
    const timeoutMs = embedTimeoutMs(inputType, input.length);
    const batchResponse = await this.postJson('/api/embed', { model: this.ollamaTag, input }, timeoutMs);
    if (batchResponse.response.ok) {
      return batchResponse.body;
    }

    if (batchResponse.response.status !== 404 || input.length !== 1) {
      this.throwForEmbeddingResponse(batchResponse.response, batchResponse.body);
    }

    const singleResponse = await this.postJson('/api/embeddings', {
      model: this.ollamaTag,
      prompt: input[0],
    }, timeoutMs);
    if (!singleResponse.response.ok) {
      this.throwForEmbeddingResponse(singleResponse.response, singleResponse.body);
    }
    return singleResponse.body;
  }

  private async postJson(
    path: string,
    payload: Record<string, unknown>,
    timeoutMs: number,
  ): Promise<{ response: Response; body: unknown }> {
    let response: Response;
    try {
      response = await fetchWithTimeout(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      }, timeoutMs);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new OllamaRequestTimeoutError(this.baseUrl, path, timeoutMs);
      }
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
