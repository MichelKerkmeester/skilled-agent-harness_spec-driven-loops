import { afterEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type CoverageModules = {
  closeDb: () => void;
  batchUpsert: (nodes: Array<Record<string, unknown>>, edges: Array<Record<string, unknown>>) => {
    insertedNodes: number;
    insertedEdges: number;
    rejectedEdges: number;
  };
  VALID_KINDS: Record<string, readonly string[]>;
  VALID_RELATIONS: Record<string, readonly string[]>;
};

const originalDbDir = process.env.SPEC_KIT_DB_DIR;
const tempDirs: string[] = [];
const futureReviewNodeKinds = ['BUG_CLASS', 'INVARIANT', 'PRODUCER', 'CONSUMER', 'TEST'] as const;
let activeCloseDb: (() => void) | null = null;

/**
 * Loads coverage-graph modules against a fresh temporary database.
 */
async function loadCoverageModules(): Promise<CoverageModules> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-depth-graph-'));
  tempDirs.push(tempDir);
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();

  const dbModule = await import('../../lib/coverage-graph/coverage-graph-db.js');
  dbModule.initDb(tempDir);

  activeCloseDb = dbModule.closeDb;

  return {
    closeDb: dbModule.closeDb,
    batchUpsert: dbModule.batchUpsert,
    VALID_KINDS: dbModule.VALID_KINDS,
    VALID_RELATIONS: dbModule.VALID_RELATIONS,
  };
}

afterEach(() => {
  activeCloseDb?.();
  activeCloseDb = null;
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }

  while (tempDirs.length > 0) {
    const tempDir = tempDirs.pop();
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('review-depth graph vocabulary fixtures', () => {
  it('upserting BUG_CLASS node succeeds because the Phase G graph vocabulary contract is live', async () => {
    const { batchUpsert } = await loadCoverageModules();
    const namespace = {
      specFolder: 'specs/review-depth-graph-fixture',
      loopType: 'review',
      sessionId: 'review-depth-graph-fixture',
    } as const;
    const data = batchUpsert([
      { ...namespace, id: 'bug-class-state-transition', kind: 'BUG_CLASS', name: 'State transition bug class' },
    ], []);

    expect(data.insertedNodes).toBe(1);
    expect(data.rejectedEdges).toBe(0);
  });

  for (const kind of futureReviewNodeKinds) {
    it(`upserting ${kind} node succeeds after Phase G allow-list extension`, async () => {
      const { batchUpsert, VALID_KINDS } = await loadCoverageModules();
      const namespace = {
        specFolder: 'specs/review-depth-graph-fixture',
        loopType: 'review',
        sessionId: `review-depth-graph-${kind.toLowerCase()}`,
      } as const;
      const data = batchUpsert([
        { ...namespace, id: `${kind.toLowerCase()}-1`, kind, name: `${kind} fixture` },
      ], []);

      expect(VALID_KINDS.review).toContain(kind);
      expect(data.insertedNodes).toBe(1);
    });
  }

  it('upserts candidate vocabulary edges with review graph relation allow-list coverage', async () => {
    const { batchUpsert, VALID_RELATIONS } = await loadCoverageModules();
    const namespace = {
      specFolder: 'specs/review-depth-graph-fixture',
      loopType: 'review',
      sessionId: 'review-depth-graph-edge',
    } as const;
    const data = batchUpsert([
      { ...namespace, id: 'dim-correctness', kind: 'DIMENSION', name: 'Correctness' },
      { ...namespace, id: 'bug-state-transition', kind: 'BUG_CLASS', name: 'State transition' },
    ], [
      { ...namespace, id: 'edge-bug-dim', sourceId: 'bug-state-transition', targetId: 'dim-correctness', relation: 'IN_DIMENSION' },
    ]);

    expect(VALID_RELATIONS.review).toContain('IN_DIMENSION');
    expect(data.insertedEdges).toBe(1);
  });
});
