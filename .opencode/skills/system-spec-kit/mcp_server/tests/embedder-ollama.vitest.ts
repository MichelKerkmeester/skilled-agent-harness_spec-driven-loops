// ───────────────────────────────────────────────────────────────
// TEST: Ollama embedder adapter
// ───────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createEmbeddingsProvider,
  resolveProvider,
} from '../../shared/dist/embeddings/factory.js';
import {
  __ollamaProviderTestables,
} from '../../shared/dist/embeddings/providers/ollama.js';
import {
  getAdapter,
  getManifest,
} from '../lib/embedders/index.js';
import {
  OllamaAdapter,
  OllamaBackendUnreachableError,
  OllamaDimensionMismatchError,
  OllamaModelNotLoadedError,
} from '../lib/embedders/adapters/ollama.js';
import type { EmbedderManifest } from '../lib/embedders/types.js';

const ORIGINAL_FETCH = globalThis.fetch;
const ORIGINAL_OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL;
const ORIGINAL_ENV = { ...process.env };
let tempDir: string | null = null;

function installFetchMock(
  handler: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(handler);
  globalThis.fetch = fetchMock as typeof fetch;
  return fetchMock;
}

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

function vector(dim: number, seed: number): number[] {
  return Array.from({ length: dim }, (_, index) => seed + index / 100);
}

function createActiveNomicDb(dbDir: string, withVec768Rows: boolean): string {
  const dbPath = path.join(dbDir, 'context-index.sqlite');
  execFileSync('sqlite3', [
    dbPath,
    [
      'CREATE TABLE vec_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);',
      "INSERT INTO vec_metadata (key, value) VALUES ('active_embedder_name', 'nomic-embed-text-v1.5');",
      "INSERT INTO vec_metadata (key, value) VALUES ('active_embedder_dim', '768');",
      withVec768Rows ? 'CREATE TABLE vec_768 (id INTEGER PRIMARY KEY, vec BLOB NOT NULL);' : '',
      withVec768Rows ? "INSERT INTO vec_768 (id, vec) VALUES (1, x'00');" : '',
    ].filter(Boolean).join('\n'),
  ]);
  return dbPath;
}

function requireManifest(name: string) {
  const manifest = getManifest(name);
  if (!manifest) {
    throw new Error(`Missing test manifest: ${name}`);
  }
  return manifest;
}

function testManifest(overrides: Partial<EmbedderManifest> = {}): EmbedderManifest {
  return {
    name: 'canonical-test-model',
    dim: 3,
    backend: 'ollama',
    ...overrides,
  };
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  globalThis.fetch = ORIGINAL_FETCH;
  if (ORIGINAL_OLLAMA_BASE_URL === undefined) {
    delete process.env.OLLAMA_BASE_URL;
  } else {
    process.env.OLLAMA_BASE_URL = ORIGINAL_OLLAMA_BASE_URL;
  }
  if (tempDir && existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
  tempDir = null;
  __ollamaProviderTestables.resetAvailabilityCache();
  vi.restoreAllMocks();
});

describe('016/002 OllamaAdapter', () => {
  it('embeds a batch through /api/embed and returns Float32Array rows', async () => {
    const adapter = new OllamaAdapter(requireManifest('nomic-embed-text-v1.5'));

    installFetchMock(async (_input, init) => {
      const payload = JSON.parse(String(init?.body)) as { model: string; input: string[] };
      expect(payload.model).toBe('nomic-embed-text:v1.5');
      expect(payload.input).toEqual(['search_document: alpha', 'search_document: beta']);
      return jsonResponse({ embeddings: [vector(768, 1), vector(768, 2)] });
    });

    const embeddings = await adapter.embed(['alpha', 'beta']);

    expect(embeddings).toHaveLength(2);
    expect(embeddings[0]).toBeInstanceOf(Float32Array);
    expect(embeddings[0]).toHaveLength(768);
    expect(embeddings[1]?.[0]).toBeCloseTo(2);
  });

  it('uses manifest ollamaName in embed POST bodies when it differs from name', async () => {
    const adapter = new OllamaAdapter(testManifest({
      name: 'canonical-provider-key',
      ollamaName: 'provider-tag:latest',
    }));

    installFetchMock(async (_input, init) => {
      const payload = JSON.parse(String(init?.body)) as { model: string; input: string[] };
      expect(payload.model).toBe('provider-tag:latest');
      expect(payload.input).toEqual(['alpha']);
      return jsonResponse({ embeddings: [vector(3, 1)] });
    });

    await adapter.embed(['alpha']);
  });

  it('falls back to manifest name in embed POST bodies when ollamaName is absent', async () => {
    const adapter = new OllamaAdapter(testManifest({ name: 'canonical-provider-key' }));

    installFetchMock(async (_input, init) => {
      const payload = JSON.parse(String(init?.body)) as { model: string; input: string[] };
      expect(payload.model).toBe('canonical-provider-key');
      expect(payload.input).toEqual(['alpha']);
      return jsonResponse({ embeddings: [vector(3, 1)] });
    });

    await adapter.embed(['alpha']);
  });

  it('prepends document and query prefixes for prefixed manifests', async () => {
    const adapter = new OllamaAdapter(requireManifest('nomic-embed-text-v1.5'));
    const payloads: Array<{ input: string[] }> = [];

    installFetchMock(async (_input, init) => {
      const payload = JSON.parse(String(init?.body)) as { input: string[] };
      payloads.push(payload);
      return jsonResponse({ embeddings: [vector(768, 1)] });
    });

    await adapter.embed(['hello']);
    await adapter.embed(['hello'], { inputType: 'query' });

    expect(payloads.map((payload) => payload.input[0])).toEqual([
      'search_document: hello',
      'search_query: hello',
    ]);
  });

  it('truncates inputs longer than manifest maxInputChars before POST', async () => {
    const adapter = new OllamaAdapter(testManifest({ maxInputChars: 5 }));

    installFetchMock(async (_input, init) => {
      const payload = JSON.parse(String(init?.body)) as { input: string[] };
      expect(payload.input).toEqual(['abcde']);
      return jsonResponse({ embeddings: [vector(3, 1)] });
    });

    await adapter.embed(['abcdefghij']);
  });

  it('sends inputs within manifest maxInputChars as-is', async () => {
    const adapter = new OllamaAdapter(testManifest({ maxInputChars: 10 }));

    installFetchMock(async (_input, init) => {
      const payload = JSON.parse(String(init?.body)) as { input: string[] };
      expect(payload.input).toEqual(['abcdef']);
      return jsonResponse({ embeddings: [vector(3, 1)] });
    });

    await adapter.embed(['abcdef']);
  });

  it('does not truncate when maxInputChars is undefined', async () => {
    const adapter = new OllamaAdapter(testManifest());
    const longInput = 'x'.repeat(2000);

    installFetchMock(async (_input, init) => {
      const payload = JSON.parse(String(init?.body)) as { input: string[] };
      expect(payload.input).toEqual([longInput]);
      return jsonResponse({ embeddings: [vector(3, 1)] });
    });

    await adapter.embed([longInput]);
  });

  it('ready() reads /api/tags and checks the ollama model name', async () => {
    const adapter = new OllamaAdapter(requireManifest('nomic-embed-text-v1.5'));

    const fetchMock = installFetchMock(async (input) => {
      expect(String(input)).toBe('http://127.0.0.1:11434/api/tags');
      return jsonResponse({
        models: [
          { name: 'nomic-embed-text:v1.5' },
        ],
      });
    });

    await expect(adapter.ready()).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('honors OLLAMA_BASE_URL', async () => {
    process.env.OLLAMA_BASE_URL = 'http://localhost:11435/';
    const adapter = new OllamaAdapter(requireManifest('nomic-embed-text-v1.5'));

    installFetchMock(async (input) => {
      expect(String(input)).toBe('http://localhost:11435/api/tags');
      return jsonResponse({ models: [{ name: 'nomic-embed-text:v1.5' }] });
    });

    await expect(adapter.ready()).resolves.toBe(true);
  });

  it('falls back to /api/embeddings for single-input legacy Ollama responses', async () => {
    const adapter = new OllamaAdapter(requireManifest('nomic-embed-text-v1.5'));
    const paths: string[] = [];

    installFetchMock(async (input, init) => {
      paths.push(new URL(String(input)).pathname);
      const payload = JSON.parse(String(init?.body)) as { input?: string[]; prompt?: string };
      if (payload.input) {
        return jsonResponse({ error: 'not found' }, { status: 404 });
      }
      expect(payload.prompt).toBe('search_document: alpha');
      return jsonResponse({ embedding: vector(768, 1) });
    });

    const embeddings = await adapter.embed(['alpha']);

    expect(paths).toEqual(['/api/embed', '/api/embeddings']);
    expect(embeddings[0]).toHaveLength(768);
  });

  it('throws typed errors for unreachable backend, missing model, and dimension mismatch', async () => {
    const adapter = new OllamaAdapter(requireManifest('nomic-embed-text-v1.5'));

    installFetchMock(async () => {
      throw new Error('ECONNREFUSED');
    });
    await expect(adapter.embed(['alpha'])).rejects.toBeInstanceOf(OllamaBackendUnreachableError);

    installFetchMock(async () => jsonResponse({ error: 'model not found, try pulling it first' }, { status: 404 }));
    await expect(adapter.embed(['alpha'])).rejects.toBeInstanceOf(OllamaModelNotLoadedError);

    installFetchMock(async () => jsonResponse({ embeddings: [vector(3, 1)] }));
    await expect(adapter.embed(['alpha'])).rejects.toBeInstanceOf(OllamaDimensionMismatchError);
  });

  it('serializes Ollama JSON error bodies instead of reporting [object Object]', async () => {
    const adapter = new OllamaAdapter(requireManifest('nomic-embed-text-v1.5'));

    installFetchMock(async () => jsonResponse(
      { error: 'the input length exceeds the context length' },
      { status: 400, statusText: 'Bad Request' },
    ));

    await expect(adapter.embed(['alpha'])).rejects.toThrow(
      'Ollama embedding request failed (400 Bad Request): {"error":"the input length exceeds the context length"}',
    );
  });

  it('registry getAdapter constructs Ollama adapters and returns undefined for unknown names', () => {
    expect(getAdapter('nomic-embed-text-v1.5')).toBeInstanceOf(OllamaAdapter);
    expect(getAdapter('missing-model')).toBeUndefined();
  });
});

describe('016/006 shared OllamaProvider factory wiring', () => {
  it('routes explicit unlisted Ollama models and derives runtime dimensions', async () => {
    process.env.EMBEDDINGS_PROVIDER = 'ollama';
    process.env.OLLAMA_EMBEDDINGS_MODEL = 'local-unlisted-ollama-model';
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    installFetchMock(async (input, init) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === '/api/tags') {
        return jsonResponse({
          models: [{ name: 'local-unlisted-ollama-model' }],
        });
      }

      expect(pathname).toBe('/api/embed');
      const payload = JSON.parse(String(init?.body)) as { model: string; input: string[] };
      expect(payload.model).toBe('local-unlisted-ollama-model');
      expect(payload.input).toEqual(['test query']);
      return jsonResponse({ embeddings: [vector(321, 1)] });
    });

    expect(resolveProvider()).toMatchObject({ name: 'ollama' });
    const provider = await createEmbeddingsProvider({ warmup: false });
    const embedding = await provider.generateEmbedding('test query');

    expect(embedding).toBeInstanceOf(Float32Array);
    expect(embedding).toHaveLength(321);
    expect(provider.constructor.name).toBe('OllamaProvider');
    expect(provider.getMetadata()).toMatchObject({
      provider: 'ollama',
      model: 'local-unlisted-ollama-model',
      dim: 321,
    });
  });

  it('auto-selects Ollama from vec_metadata when vec_768 exists and has rows', async () => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-ollama-provider-'));
    createActiveNomicDb(tempDir, true);
    process.env.SPEC_KIT_DB_DIR = tempDir;
    delete process.env.EMBEDDINGS_PROVIDER;
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    installFetchMock(async (input, init) => {
      const pathname = new URL(String(input)).pathname;
      if (pathname === '/api/tags') {
        return jsonResponse({
          models: [{ name: 'nomic-embed-text:v1.5' }],
        });
      }

      expect(pathname).toBe('/api/embed');
      const payload = JSON.parse(String(init?.body)) as { input: string[] };
      expect(payload.input).toEqual(['search_query: search']);
      return jsonResponse({ embeddings: [vector(768, 1)] });
    });

    expect(resolveProvider()).toMatchObject({ name: 'ollama' });
    const provider = await createEmbeddingsProvider({ warmup: false });
    await expect(provider.embedQuery('search')).resolves.toHaveLength(768);
  });

  it('does not select Ollama from vec_metadata when the active vec_768 table is missing', () => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-ollama-provider-'));
    createActiveNomicDb(tempDir, false);
    process.env.SPEC_KIT_DB_DIR = tempDir;
    delete process.env.EMBEDDINGS_PROVIDER;
    delete process.env.VOYAGE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    expect(resolveProvider().name).not.toBe('ollama');
  });
});
