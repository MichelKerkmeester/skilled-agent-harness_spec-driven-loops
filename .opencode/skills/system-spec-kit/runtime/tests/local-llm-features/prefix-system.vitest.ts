// ---------------------------------------------------------------
// MODULE: Local LLM Prefix System Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { PREFIX_REGISTRY, getPrefixFor } from '../../../shared/embeddings/providers/hf-local.js';

const originalEnv = { ...process.env };
let tempDir: string | null = null;

describe('local LLM prefix system', () => {
  // CLAIM: shared/embeddings/providers/hf-local.ts PREFIX_REGISTRY — model-keyed document/query prefixes and env overrides are canonical.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'prefix-system');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.HF_EMBEDDINGS_PREFIX_DOC;
    delete process.env.HF_EMBEDDINGS_PREFIX_QUERY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterAll(() => {
    if (tempDir && existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('T1 registers only the nomic prefix entry after consolidation', () => {
    // After consolidation, PREFIX_REGISTRY is nomic-only; removed models are gone.
    expect(Object.keys(PREFIX_REGISTRY)).toEqual(['nomic-ai/nomic-embed-text-v1.5']);
    for (const removed of [
      'BAAI/bge-base-en-v1.5',
      'intfloat/e5-large-v2',
      'mixedbread-ai/mxbai-embed-large-v1',
      'Snowflake/snowflake-arctic-embed-l-v2.0',
      'BAAI/bge-m3',
    ]) {
      expect(PREFIX_REGISTRY).not.toHaveProperty(removed);
    }
  });

  it('T2 returns the Nomic query prefix', () => {
    expect(getPrefixFor('nomic-ai/nomic-embed-text-v1.5', 'query')).toBe('search_query: ');
  });

  it('T3 returns the safe empty fallback for a removed local model', () => {
    // bge was removed → treated as an unknown model → empty prefix.
    expect(getPrefixFor('BAAI/bge-base-en-v1.5', 'query')).toBe('');
    expect(getPrefixFor('BAAI/bge-base-en-v1.5', 'document')).toBe('');
  });

  it('T4 returns the Nomic document prefix', () => {
    expect(getPrefixFor('nomic-ai/nomic-embed-text-v1.5', 'document')).toBe('search_document: ');
  });

  it('T5 lets HF_EMBEDDINGS_PREFIX_DOC override the registry', () => {
    process.env.HF_EMBEDDINGS_PREFIX_DOC = 'fixture-document: ';

    expect(getPrefixFor('nomic-ai/nomic-embed-text-v1.5', 'document')).toBe('fixture-document: ');
  });

  it('T6 returns the safe empty-string fallback for unknown models', () => {
    expect(getPrefixFor('example/unknown-local-model', 'document')).toBe('');
    expect(getPrefixFor('example/unknown-local-model', 'query')).toBe('');
  });
});
