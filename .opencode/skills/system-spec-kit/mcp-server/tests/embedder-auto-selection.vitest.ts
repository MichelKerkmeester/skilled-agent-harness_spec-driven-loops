// -------------------------------------------------------------------
// TEST: Bootstrap embedder auto-selection
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

  it('selects Voyage when local probes are unavailable and the Voyage probe is reachable', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input) === 'http://127.0.0.1:11434/api/tags') {
        throw new Error('connection refused');
      }
      expect(String(input)).toBe('https://api.voyageai.com/v1/embeddings');
      return jsonResponse({ data: [{ embedding: embedding(1024) }] });
    });

    const selected = await autoSelectActiveEmbedder({
      env: { VOYAGE_API_KEY: VALID_VOYAGE_KEY },
      fetchImpl: fetchImpl as typeof fetch,
      probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
    });

    expect(selected).toMatchObject({
      name: 'voyage-code-3',
      dim: 1024,
      provider: 'voyage',
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('honors an explicit EMBEDDINGS_PROVIDER ahead of the local-first cascade (DR-001/015)', async () => {
    // With EMBEDDINGS_PROVIDER=voyage the cascade is reordered so Voyage is
    // probed FIRST; ollama is never contacted (would otherwise be probe #1).
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      expect(String(input)).toBe('https://api.voyageai.com/v1/embeddings');
      return jsonResponse({ data: [{ embedding: embedding(1024) }] });
    });

    const selected = await autoSelectActiveEmbedder({
      env: { EMBEDDINGS_PROVIDER: 'voyage', VOYAGE_API_KEY: VALID_VOYAGE_KEY },
      fetchImpl: fetchImpl as typeof fetch,
      probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
    });

    expect(selected).toMatchObject({ provider: 'voyage', dim: 1024 });
    // Only Voyage was probed — the explicit provider jumped the cascade.
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('selects OpenAI when local probes are unavailable and OpenAI is reachable', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input) === 'http://127.0.0.1:11434/api/tags') {
        throw new Error('connection refused');
      }
      expect(String(input)).toBe('https://api.openai.com/v1/embeddings');
      return jsonResponse({ data: [{ embedding: embedding(1536) }] });
    });

    const selected = await autoSelectActiveEmbedder({
      env: { OPENAI_API_KEY: VALID_OPENAI_KEY },
      fetchImpl: fetchImpl as typeof fetch,
      probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
    });

    expect(selected).toMatchObject({
      name: 'text-embedding-3-small',
      dim: 1536,
      provider: 'openai',
    });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('selects the first pulled Ollama model in the current priority order', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      models: [
        { name: 'nomic-embed-text:v1.5' },
        { name: 'hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M' },
      ],
    }));

    const selected = await autoSelectActiveEmbedder({
      env: {},
      fetchImpl: fetchImpl as typeof fetch,
      probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
    });

    expect(selected).toMatchObject({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      provider: 'ollama',
    });
  });

  it('selects Nomic when it is the only pulled Ollama model', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({
      models: [{ name: 'nomic-embed-text:v1.5' }],
    }));

    const selected = await autoSelectActiveEmbedder({
      env: {},
      fetchImpl: fetchImpl as typeof fetch,
      probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
    });

    expect(selected).toMatchObject({
      name: 'nomic-embed-text-v1.5',
      dim: 768,
      provider: 'ollama',
    });
  });

  it('selects hf-local Nomic when Ollama is unavailable but the hf-local model server is reachable', async () => {
    const selected = await autoSelectActiveEmbedder({
      env: {},
      fetchImpl: vi.fn(async () => {
        throw new Error('connection refused');
      }) as typeof fetch,
      probeHfLocalServer: async () => ({ available: true }),
    });

    expect(selected).toMatchObject({
      name: 'nomic-ai/nomic-embed-text-v1.5',
      dim: 768,
      provider: 'hf-local',
    });
  });

  it('persists dim 0 for a custom hf-local model so the true dim resolves at first embed', async () => {
    const selected = await autoSelectActiveEmbedder({
      env: { HF_EMBEDDINGS_MODEL: 'BAAI/bge-large-en-v1.5' },
      fetchImpl: vi.fn(async () => {
        throw new Error('connection refused');
      }) as typeof fetch,
      probeHfLocalServer: async () => ({ available: true }),
    });

    expect(selected).toMatchObject({
      name: 'BAAI/bge-large-en-v1.5',
      dim: 0,
      provider: 'hf-local',
    });
  });

  it('ignores the legacy HF_LOCAL_MODEL alias so the model name matches HfLocalProvider', async () => {
    const selected = await autoSelectActiveEmbedder({
      env: { HF_LOCAL_MODEL: 'BAAI/bge-large-en-v1.5' },
      fetchImpl: vi.fn(async () => {
        throw new Error('connection refused');
      }) as typeof fetch,
      probeHfLocalServer: async () => ({ available: true }),
    });

    expect(selected).toMatchObject({
      name: 'nomic-ai/nomic-embed-text-v1.5',
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
      probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
    })).rejects.toThrow(AutoSelectEmbedderError);

    await expect(autoSelectActiveEmbedder({
      env: {},
      fetchImpl: vi.fn(async () => {
        throw new Error('offline');
      }) as typeof fetch,
      probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
    })).rejects.toThrow(/ollama:.*hf-local:.*openai:.*voyage:/i);
  });

  it('persists the selected embedder to vec_metadata during daemon bootstrap', async () => {
    const db = createDb();
    try {
      await ensureActiveEmbedder(db, {
        env: { VOYAGE_API_KEY: VALID_VOYAGE_KEY },
        fetchImpl: vi.fn(async (input: RequestInfo | URL) => {
          if (String(input) === 'http://127.0.0.1:11434/api/tags') {
            throw new Error('connection refused');
          }
          return jsonResponse({ data: [{ embedding: embedding(1024) }] });
        }) as typeof fetch,
        probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
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
        probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
      }),
      autoSelectActiveEmbedder({
        env: { VOYAGE_API_KEY: VALID_VOYAGE_KEY },
        fetchImpl: fetchImpl as typeof fetch,
        metadataStore: store,
        lockPath: path.join(tempDir, 'active.lock'),
        sleepMs: 1,
        probeHfLocalServer: async () => ({ available: false, reason: 'test: hf-local server unreachable' }),
      }),
    ]);

    expect(first.name).toBe('voyage-code-3');
    expect(second.name).toBe('voyage-code-3');
    expect(writeCount).toBe(1);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
