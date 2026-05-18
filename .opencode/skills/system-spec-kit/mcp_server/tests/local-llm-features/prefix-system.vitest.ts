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

  it('T1 registers all documented hf-local model prefixes', () => {
    const expectedModels = [
      'BAAI/bge-base-en-v1.5',
      'nomic-ai/nomic-embed-text-v1.5',
      'intfloat/e5-large-v2',
      'mixedbread-ai/mxbai-embed-large-v1',
      'Snowflake/snowflake-arctic-embed-l-v2.0',
      'BAAI/bge-m3',
    ];

    for (const model of expectedModels) {
      expect(PREFIX_REGISTRY).toHaveProperty(model);
    }
  });

  it('T2 returns the BGE document prefix', () => {
    expect(getPrefixFor('BAAI/bge-base-en-v1.5', 'document')).toBe('');
  });

  it('T3 returns the BGE query prefix', () => {
    expect(getPrefixFor('BAAI/bge-base-en-v1.5', 'query')).toBe('Represent this sentence for searching relevant passages: ');
  });

  it('T4 returns the Nomic document prefix', () => {
    expect(getPrefixFor('nomic-ai/nomic-embed-text-v1.5', 'document')).toBe('search_document: ');
  });

  it('T5 lets HF_EMBEDDINGS_PREFIX_DOC override the registry', () => {
    process.env.HF_EMBEDDINGS_PREFIX_DOC = 'fixture-document: ';

    expect(getPrefixFor('BAAI/bge-base-en-v1.5', 'document')).toBe('fixture-document: ');
  });

  it('T6 returns the safe empty-string fallback for unknown models', () => {
    expect(getPrefixFor('example/unknown-local-model', 'document')).toBe('');
    expect(getPrefixFor('example/unknown-local-model', 'query')).toBe('');
  });
});
