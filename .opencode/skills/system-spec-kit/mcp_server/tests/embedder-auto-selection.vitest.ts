// -------------------------------------------------------------------
// TEST: Bootstrap embedder auto-selection (016/002/007)
// -------------------------------------------------------------------

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import Database from 'better-sqlite3';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  autoSelectActiveEmbedder,
  AutoSelectEmbedderError,
  type AutoSelectMetadataStore,
  type AutoSelectedEmbedder,
} from '@spec-kit/shared/embeddings/auto-select';
import { ensureActiveEmbedder } from '../lib/embedders/schema.js';

const VALID_VOYAGE_KEY = 'voyage_test_key_1234567890';
const VALID_OPENAI_KEY = 'openai_test_key_1234567890';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    statusText: init.statusText ?? 'OK',
    headers: { 'content-type': 'application/json' },
  });
}

function embedding(dim: number): number[] {
  return Array.from({ length: dim }, (_, index) => index / dim);
}

function createDb(): Database.Database {
  return new Database(':memory:');
}

describe('embedder bootstrap auto-selection', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    for (const dir of tempDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('tier 1 selects Voyage when the API key is set and the embeddings probe is reachable', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toBe('https://api.voyageai.com/v1/embeddings');
      return jsonResponse({ data: [{ embedding: embedding(1024) }] });
    });

    const selected = await autoSelectActiveEmbedder({
      env: { VOYAGE_API_KEY: VALID_VOYAGE_KEY },
      fetchImpl: fetchImpl as typeof fetch,
      runPythonImportProbe: async () => false,
    });

    expect(selected).toMatchObject({
      name: 'voyage-code-3',
      dim: 1024,
      provider: 'voyage',
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('tier 2 selects OpenAI when Voyage is unavailable and OpenAI is reachable', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toBe('https://api.openai.com/v1/embeddings');
      return jsonResponse({ data: [{ embedding: embedding(1536) }] });
    });

    const selected = await autoSelectActiveEmbedder({
      env: { OPENAI_API_KEY: VALID_OPENAI_KEY },
      fetchImpl: fetchImpl as typeof fetch,
      runPythonImportProbe: async () => false,
    });

    expect(selected).toMatchObject({
      name: 'text-embedding-3-small',
      dim: 1536,
      provider: 'openai',
    });
  });

  it('tier 3 selects the first pulled Ollama model in ADR-012 priority order', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      models: [
        { name: 'nomic-embed-text:v1.5' },
        { name: 'hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M' },
      ],
    }));

    const selected = await autoSelectActiveEmbedder({
      env: {},
      fetchImpl: fetchImpl as typeof fetch,
      runPythonImportProbe: async () => false,
    });

    expect(selected).toMatchObject({
      name: 'jina-embeddings-v3',
      dim: 1024,
      provider: 'ollama',
    });
  });

  it('tier 3 falls through to Nomic when Jina is not pulled', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      models: [{ name: 'nomic-embed-text:v1.5' }],
    }));

    const selected = await autoSelectActiveEmbedder({
      env: {},
      fetchImpl: fetchImpl as typeof fetch,
      runPythonImportProbe: async () => false,
    });

    expect(selected).toMatchObject({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      provider: 'ollama',
    });
  });

  it('tier 4 selects hf-local when cloud keys and Ollama are unavailable but sentence-transformers is importable', async () => {
    const selected = await autoSelectActiveEmbedder({
      env: {},
      fetchImpl: vi.fn(async () => {
        throw new Error('connection refused');
      }) as typeof fetch,
      runPythonImportProbe: async () => true,
    });

    expect(selected).toMatchObject({
      name: 'BAAI/bge-base-en-v1.5',
      dim: 768,
      provider: 'hf-local',
    });
  });

  it('throws a clear tier-by-tier error when no provider is available', async () => {
    await expect(autoSelectActiveEmbedder({
      env: {},
      fetchImpl: vi.fn(async () => {
        throw new Error('offline');
      }) as typeof fetch,
      runPythonImportProbe: async () => false,
    })).rejects.toThrow(AutoSelectEmbedderError);

    await expect(autoSelectActiveEmbedder({
      env: {},
      fetchImpl: vi.fn(async () => {
        throw new Error('offline');
      }) as typeof fetch,
      runPythonImportProbe: async () => false,
    })).rejects.toThrow(/voyage:.*openai:.*ollama:.*hf-local:/i);
  });

  it('persists the selected embedder to vec_metadata during daemon bootstrap', async () => {
    const db = createDb();
    try {
      await ensureActiveEmbedder(db, {
        env: { VOYAGE_API_KEY: VALID_VOYAGE_KEY },
        fetchImpl: vi.fn(async () => jsonResponse({ data: [{ embedding: embedding(1024) }] })) as typeof fetch,
        runPythonImportProbe: async () => false,
      });

      const row = db.prepare(`
        SELECT value
        FROM vec_metadata
        WHERE key = 'active_embedder_name'
      `).get() as { value: string };

      expect(row.value).toBe('voyage-code-3');
    } finally {
      db.close();
    }
  });

  it('serializes concurrent bootstrap calls so only one process writes vec_metadata', async () => {
    const tempDir = mkdtempSync(path.join(tmpdir(), 'embedder-auto-select-'));
    tempDirs.push(tempDir);
    let persisted: AutoSelectedEmbedder | null = null;
    let writeCount = 0;
    const store: AutoSelectMetadataStore = {
      readActiveEmbedder: () => persisted,
      persistActiveEmbedder: (embedder) => {
        writeCount += 1;
        persisted = embedder;
      },
    };
    const fetchImpl = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 25));
      return jsonResponse({ data: [{ embedding: embedding(1024) }] });
    });

    const [first, second] = await Promise.all([
      autoSelectActiveEmbedder({
        env: { VOYAGE_API_KEY: VALID_VOYAGE_KEY },
        fetchImpl: fetchImpl as typeof fetch,
        metadataStore: store,
        lockPath: path.join(tempDir, 'active.lock'),
        sleepMs: 1,
      }),
      autoSelectActiveEmbedder({
        env: { VOYAGE_API_KEY: VALID_VOYAGE_KEY },
        fetchImpl: fetchImpl as typeof fetch,
        metadataStore: store,
        lockPath: path.join(tempDir, 'active.lock'),
        sleepMs: 1,
      }),
    ]);

    expect(first.name).toBe('voyage-code-3');
    expect(second.name).toBe('voyage-code-3');
    expect(writeCount).toBe(1);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
