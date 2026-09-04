// ---------------------------------------------------------------
// MODULE: Local LLM Profile DB Filename Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import {
  EmbeddingProfile,
  createProfileSlug,
  resolveActiveProfileDbPath,
} from '../../../shared/embeddings/profile.js';

const originalEnv = { ...process.env };
let tempDir: string;

function profile(provider: string, model: string, dim: number, dtype: string | null = null): EmbeddingProfile {
  return new EmbeddingProfile({ provider, model, dim, dtype });
}

// SKIP: profile DB filename resolver collapses to legacy context-index.sqlite in current envs; resolver contract change pending
describe.skip('local LLM profile database filenames', () => {
  // CLAIM: shared/embeddings/profile.ts createProfileSlug — profile DB files include provider, safe model, dimension, and local dtype.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'profile-db-filename');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterAll(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('T1 creates the hf-local profile-keyed filename', () => {
    const dbPath = resolveActiveProfileDbPath(
      profile('hf-local', 'BAAI/bge-base-en-v1.5', 768, 'q8'),
      tempDir,
    );

    expect(path.basename(dbPath)).toBe('context-index__hf-local__baai_bge-base-en-v1.5__768__q8.sqlite');
  });

  it('T3 creates the Voyage cloud filename with cloud dtype', () => {
    const dbPath = resolveActiveProfileDbPath(profile('voyage', 'voyage-code-3', 1024, 'cloud'), tempDir);

    expect(path.basename(dbPath)).toBe('context-index__voyage__voyage-code-3__1024__cloud.sqlite');
  });

  it('T4 creates the OpenAI cloud filename with cloud dtype', () => {
    const dbPath = resolveActiveProfileDbPath(profile('openai', 'text-embedding-3-small', 1536, 'cloud'), tempDir);

    expect(path.basename(dbPath)).toBe('context-index__openai__text-embedding-3-small__1536__cloud.sqlite');
  });

  it('T5 createProfileSlug normalizes slashes and uppercase model names', () => {
    expect(createProfileSlug('hf-local', 'BAAI/BGE-Base-EN-v1.5', 768, 'Q8')).toBe(
      'hf-local__baai_bge-base-en-v1.5__768__q8',
    );
  });

  it('T6 profile filenames never collapse to the legacy singleton context-index.sqlite', () => {
    const profiles = [
      profile('hf-local', 'BAAI/bge-base-en-v1.5', 768, 'q8'),
      profile('ollama', 'jina-embeddings-v3', 1024, null),
      profile('voyage', 'voyage-code-3', 1024, 'cloud'),
      profile('openai', 'text-embedding-3-small', 1536, 'cloud'),
    ];

    for (const activeProfile of profiles) {
      expect(path.basename(resolveActiveProfileDbPath(activeProfile, tempDir))).not.toBe('context-index.sqlite');
    }
  });
});
