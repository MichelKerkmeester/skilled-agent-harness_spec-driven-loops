// @ts-nocheck
// ---------------------------------------------------------------
// TEST: HANDLER MEMORY CONTEXT
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, vi } from 'vitest';

// Mock core/db-state to prevent real DB operations that cause timeouts.
// This must be hoisted before any handler imports.
// The handlers (memory-context, memory-search, memory-triggers) all import
// { checkDatabaseUpdated, waitForEmbeddingModel } from '../core' which
// re-exports from './db-state'.
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as unknown;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as unknown;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
    waitForEmbeddingModel: vi.fn(async () => true),
    isEmbeddingModelReady: vi.fn(() => true),
  };
});

// Mock the sub-handlers (memory-search, memory-triggers) to avoid
// requiring a real embedding model / database for mode-routing tests.
// These return valid MCP response shapes so the strategy executors succeed.
vi.mock('../handlers/memory-search', () => ({
  handleMemorySearch: vi.fn(async () => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
    isError: false,
  })),
}));

vi.mock('../handlers/memory-triggers', () => ({
  handleMemoryMatchTriggers: vi.fn(async () => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: {} }) }],
    isError: false,
  })),
}));

// DB-dependent imports - commented out for deferred test suite
import * as handler from '../handlers/memory-context';

async function withTimeout<T>(promise: Promise<T>, ms: number, name: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${name} exceeded ${ms}ms`)), ms)
    ),
  ]);
}

describe('Handler Memory Context (T524) [deferred - requires DB test fixtures]', () => {
  // ─────────────────────────────────────────────────────────────
  // SUITE: Auto Mode Routing
  // ─────────────────────────────────────────────────────────────
  describe('Auto Mode Routing (T524-1 to T524-3)', () => {
    it('T524-1: Auto mode routes "resume" to resume strategy', async () => {
      const result: any = await withTimeout(
        handler.handleMemoryContext({
          input: 'resume where I left off on the authentication module',
        }),
        5000,
        'T524-1'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = JSON.parse(result.content[0].text);

      const mode =
        parsed.meta?.mode ??
        parsed.data?.mode ??
        (parsed.error ? parsed.mode : undefined);

      expect(mode).toBe('resume');
    });

    it('T524-2: Short question routes to focused mode', async () => {
      const result: any = await withTimeout(
        handler.handleMemoryContext({
          input: 'what is the auth flow?',
        }),
        5000,
        'T524-2'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = JSON.parse(result.content[0].text);

      const mode =
        parsed.meta?.mode ??
        parsed.data?.mode ??
        (parsed.error ? parsed.mode : undefined);

      expect(mode).toBe('focused');
    });

    it('T524-3: Default mode is auto (adaptive strategy)', () => {
      expect(handler.CONTEXT_MODES).toBeTruthy();
      expect(handler.CONTEXT_MODES.auto).toBeTruthy();
      expect(handler.CONTEXT_MODES.auto.strategy).toBe('adaptive');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: Explicit Mode Selection
  // ─────────────────────────────────────────────────────────────
  describe('Explicit Mode Selection (T524-4)', () => {
    it('T524-4: Invalid mode falls back to focused', async () => {
      const result: any = await withTimeout(
        handler.handleMemoryContext({
          input: 'test query for invalid mode',
          mode: 'totally_invalid_mode',
        }),
        5000,
        'T524-4'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = JSON.parse(result.content[0].text);

      const mode =
        parsed.meta?.mode ??
        (parsed.data?.strategy === 'focused' ? 'focused' : undefined);

      expect(mode).toBe('focused');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: Mode-Specific Token Budgets
  // ─────────────────────────────────────────────────────────────
  describe('Mode-Specific Token Budgets (T524-5)', () => {
    it('T524-5: Each mode has correct token budget', () => {
      const expectedBudgets: Record<string, number | undefined> = {
        auto: undefined,
        quick: 800,
        deep: 2000,
        focused: 1500,
        resume: 1200,
      };

      for (const [modeName, expectedBudget] of Object.entries(expectedBudgets)) {
        const mode = handler.CONTEXT_MODES[modeName];
        expect(mode).toBeTruthy();
        expect(mode.tokenBudget).toBe(expectedBudget);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: INTENT_TO_MODE Routing Configuration
  // ─────────────────────────────────────────────────────────────
  describe('INTENT_TO_MODE Routing (T524-6)', () => {
    it('T524-6: INTENT_TO_MODE mapping is correct', () => {
      const expectedMappings: Record<string, string> = {
        add_feature: 'deep',
        fix_bug: 'focused',
        refactor: 'deep',
        security_audit: 'deep',
        understand: 'focused',
      };

      for (const [intent, expectedMode] of Object.entries(expectedMappings)) {
        expect(handler.INTENT_TO_MODE[intent]).toBe(expectedMode);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE: Error Response Structure
  // ─────────────────────────────────────────────────────────────
  describe('Error Response Structure (T524-7 to T524-8)', () => {
    it('T524-7: Empty input error includes L1 layer metadata', async () => {
      const result: any = await withTimeout(
        handler.handleMemoryContext({ input: '' }),
        5000,
        'T524-7'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.data.details.layer).toBeTruthy();
      expect(parsed.data.details.layer).toContain('L1');
    });

    it('T524-8: Error includes actionable hint', async () => {
      const result: any = await withTimeout(
        handler.handleMemoryContext({ input: '' }),
        5000,
        'T524-8'
      );

      expect(result).toBeTruthy();
      expect(result.content).toBeTruthy();

      const parsed = JSON.parse(result.content[0].text);
      expect(parsed.hints).toBeTruthy();
      expect(Array.isArray(parsed.hints)).toBe(true);
      expect(parsed.hints.length).toBeGreaterThan(0);
      expect(typeof parsed.hints[0]).toBe('string');
    });
  });
});
