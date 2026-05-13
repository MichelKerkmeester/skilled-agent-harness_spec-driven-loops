// ---------------------------------------------------------------
// MODULE: Local LLM Native Module Tests
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

import {
  getLlamaCppAvailability,
  resolveWorkspaceNodeLlamaCppEntrypoint,
} from '../../../shared/embeddings/llama-cpp-availability.js';

const originalEnv = { ...process.env };
let tempDir: string | null = null;

describe('local LLM native module compatibility', () => {
  // CLAIM: 028 spec Group 7 — optional native modules probe cleanly and fail without DLOPEN crashes.
  beforeAll(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'spec-kit-test-'));
    writeFileSync(path.join(tempDir, 'claim.txt'), 'native-modules');
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
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

  it('T1 resolveWorkspaceNodeLlamaCppEntrypoint returns a path or null without throwing', () => {
    expect(() => resolveWorkspaceNodeLlamaCppEntrypoint()).not.toThrow();
    const entrypoint = resolveWorkspaceNodeLlamaCppEntrypoint();
    expect(entrypoint === null || typeof entrypoint === 'string').toBe(true);
  });

  it.skipIf(resolveWorkspaceNodeLlamaCppEntrypoint() === null)('T2 installed node-llama-cpp plus missing GGUF reports GGUF model not found', () => {
    const missingModelPath = path.join(tempDir ?? tmpdir(), 'missing-model.gguf');
    process.env.LLAMA_CPP_EMBEDDINGS_MODEL_PATH = missingModelPath;

    const availability = getLlamaCppAvailability();

    expect(availability.available).toBe(false);
    expect(availability.reason).toContain('GGUF model not found');
  });

  it('T3 Transformers.js loads via dynamic import', async () => {
    const mod = await import('@huggingface/transformers');

    expect(typeof mod.pipeline).toBe('function');
  });

  it('T4 better-sqlite3 and sqlite-vec can be required without DLOPEN errors', () => {
    const require = createRequire(import.meta.url);

    expect(() => require('better-sqlite3')).not.toThrow(/DLOPEN|NODE_MODULE_VERSION/i);
    expect(() => require('sqlite-vec')).not.toThrow(/DLOPEN|NODE_MODULE_VERSION/i);
  });
});
