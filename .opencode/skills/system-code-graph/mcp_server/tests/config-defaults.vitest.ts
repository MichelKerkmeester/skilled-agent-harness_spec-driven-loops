// ───────────────────────────────────────────────────────────────
// TEST: Config Defaults (P1 extraction)
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { DEFAULT_EDGE_WEIGHTS } from '../lib/indexer-types.js';
import { DEFAULT_FLOORS } from '../lib/budget-allocator.js';

describe('config-defaults', () => {
  describe('CODE_GRAPH_DEFAULTS (env unset)', () => {
    let CODE_GRAPH_DEFAULTS: typeof import('../lib/config-defaults.js').CODE_GRAPH_DEFAULTS;

    beforeAll(async () => {
      const mod = await import('../lib/config-defaults.js');
      CODE_GRAPH_DEFAULTS = mod.CODE_GRAPH_DEFAULTS;
    });

    it('ttlMs defaults to 60000', () => {
      expect(CODE_GRAPH_DEFAULTS.ttlMs).toBe(60_000);
    });

    it('findFilesMaxDepth defaults to 20', () => {
      expect(CODE_GRAPH_DEFAULTS.findFilesMaxDepth).toBe(20);
    });

    it('quarantineAgeDays defaults to 14', () => {
      expect(CODE_GRAPH_DEFAULTS.quarantineAgeDays).toBe(14);
    });

    it('floors has correct default shape', () => {
      expect(CODE_GRAPH_DEFAULTS.floors).toMatchObject({
        constitutional: 700,
        codeGraph: 1200,
        cocoIndex: 900,
        triggered: 400,
        overflow: 800,
      });
    });

    it('edgeWeights has correct default shape', () => {
      expect(CODE_GRAPH_DEFAULTS.edgeWeights).toMatchObject({
        CONTAINS: 1.0,
        IMPORTS: 1.0,
        EXPORTS: 1.0,
        EXTENDS: 0.95,
        IMPLEMENTS: 0.95,
        DECORATES: 0.9,
        OVERRIDES: 0.9,
        TYPE_OF: 0.85,
        CALLS: 0.8,
        TESTED_BY: 0.6,
      });
    });
  });

  describe('export shapes preserved', () => {
    it('DEFAULT_FLOORS export matches CODE_GRAPH_DEFAULTS.floors', () => {
      expect(DEFAULT_FLOORS).toEqual({
        constitutional: 700,
        codeGraph: 1200,
        cocoIndex: 900,
        triggered: 400,
        overflow: 800,
      });
    });

    it('DEFAULT_EDGE_WEIGHTS export matches CODE_GRAPH_DEFAULTS.edgeWeights', () => {
      expect(DEFAULT_EDGE_WEIGHTS).toMatchObject({
        CONTAINS: 1.0,
        IMPORTS: 1.0,
      });
    });
  });

  describe('env-var overrides', () => {
    beforeEach(() => {
      vi.resetModules();
    });

    it('SPECKIT_CODE_GRAPH_TTL_MS overrides ttlMs', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_TTL_MS', '30000');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.ttlMs).toBe(30_000);
    });

    it('SPECKIT_CODE_GRAPH_FIND_FILES_MAX_DEPTH overrides depth', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_FIND_FILES_MAX_DEPTH', '10');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.findFilesMaxDepth).toBe(10);
    });

    it('SPECKIT_CODE_GRAPH_QUARANTINE_AGE_DAYS overrides quarantine days', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_QUARANTINE_AGE_DAYS', '7');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.quarantineAgeDays).toBe(7);
    });

    it('invalid env values fall back to defaults', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_TTL_MS', 'not_a_number');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.ttlMs).toBe(60_000);
    });

    it('negative env values fall back to defaults', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_TTL_MS', '-5');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.ttlMs).toBe(60_000);
    });

    it('SPECKIT_CODE_GRAPH_FLOORS_JSON merges partial overrides', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_FLOORS_JSON', '{"triggered": 200}');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.floors.triggered).toBe(200);
      expect(CODE_GRAPH_DEFAULTS.floors.constitutional).toBe(700);
      expect(CODE_GRAPH_DEFAULTS.floors.codeGraph).toBe(1200);
    });

    it('SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON merges partial overrides', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON', '{"CALLS": 0.5}');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.edgeWeights.CALLS).toBe(0.5);
      expect(CODE_GRAPH_DEFAULTS.edgeWeights.CONTAINS).toBe(1.0);
    });

    it('malformed JSON env vars fall back to defaults', async () => {
      vi.stubEnv('SPECKIT_CODE_GRAPH_FLOORS_JSON', '{bad json}');
      const { CODE_GRAPH_DEFAULTS } = await import('../lib/config-defaults.js');
      expect(CODE_GRAPH_DEFAULTS.floors).toMatchObject({
        constitutional: 700,
        codeGraph: 1200,
      });
    });
  });
});
