// ───────────────────────────────────────────────────────────────
// MODULE: Graph Unified Rebind Flag Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

import { init } from '../core/db-state.js';
import type { DatabaseLike } from '../core/db-state.js';

const FLAG = 'SPECKIT_GRAPH_UNIFIED';
const originalFlag = process.env[FLAG];

afterEach(() => {
  vi.restoreAllMocks();
  if (originalFlag === undefined) {
    delete process.env[FLAG];
  } else {
    process.env[FLAG] = originalFlag;
  }
});

describe('graph unified rebind flag', () => {
  it('uses canonical parsing for zero and padded mixed-case false values', () => {
    const cases: Array<[string | undefined, boolean]> = [
      [undefined, true],
      ['true', true],
      ['off', true],
      ['0', false],
      [' FALSE ', false],
    ];

    for (const [rawValue, expectedEnabled] of cases) {
      if (rawValue === undefined) {
        delete process.env[FLAG];
      } else {
        process.env[FLAG] = rawValue;
      }

      const originalDb = { name: 'original' } as unknown as DatabaseLike;
      const reboundDb = { name: 'rebound' } as unknown as DatabaseLike;
      let connectionListener: ((database: DatabaseLike) => boolean | void) | null = null;
      const graphSearchFn = vi.fn();
      const graphSearchFactory = vi.fn(() => graphSearchFn);
      const hybridSearch = { init: vi.fn() };
      const vectorSearch = vi.fn();

      init({
        vectorIndex: {
          initializeDb: vi.fn(),
          getDb: vi.fn(() => originalDb),
          vectorSearch,
          onDatabaseConnectionChange: vi.fn((listener) => {
            connectionListener = listener;
            return () => {
              connectionListener = null;
            };
          }),
        },
        hybridSearch,
        sessionManager: { init: vi.fn(() => ({ success: true })) },
        graphSearchFn,
        graphSearchFactory,
      });

      expect(connectionListener).not.toBeNull();
      connectionListener?.(reboundDb);

      if (expectedEnabled) {
        expect(graphSearchFactory).toHaveBeenCalledWith(reboundDb);
        expect(hybridSearch.init).toHaveBeenCalledWith(reboundDb, vectorSearch, graphSearchFn);
      } else {
        expect(graphSearchFactory).not.toHaveBeenCalled();
        expect(hybridSearch.init).toHaveBeenCalledWith(reboundDb, vectorSearch, null);
      }
    }
  });
});
