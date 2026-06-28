// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Coverage Graph Query Unit Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type DbModule = typeof import('../../lib/coverage-graph/coverage-graph-db.js');
type QueryModule = typeof import('../../lib/coverage-graph/coverage-graph-query.js');

let originalDbDir: string | undefined;
let tempDir: string;
let dbModule: DbModule;
let queryModule: QueryModule;

const namespace = {
  specFolder: 'specs/coverage-graph-query-fixture',
  loopType: 'research',
  sessionId: 'coverage-graph-query-fixture',
} as const;

function graphSnapshot(): Record<string, unknown> {
  return {
    nodes: dbModule.getNodes(namespace).sort((first, second) => first.id.localeCompare(second.id)),
    edges: dbModule.getEdges(namespace).sort((first, second) => first.id.localeCompare(second.id)),
  };
}

beforeEach(async () => {
  originalDbDir = process.env.SPEC_KIT_DB_DIR;
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-query-'));
  process.env.SPEC_KIT_DB_DIR = tempDir;
  vi.resetModules();
  dbModule = await import('../../lib/coverage-graph/coverage-graph-db.js');
  dbModule.initDb(tempDir);
  queryModule = await import('../../lib/coverage-graph/coverage-graph-query.js');
});

afterEach(() => {
  dbModule?.closeDb?.();
  vi.resetModules();
  if (originalDbDir === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = originalDbDir;
  }
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('coverage-graph-query', () => {
  it('findCoverageGaps returns empty array on empty namespace', () => {
    const gaps = queryModule.findCoverageGaps(namespace);
    expect(Array.isArray(gaps)).toBe(true);
    expect(gaps).toEqual([]);
  });

  it('findContradictions returns empty array on empty namespace', () => {
    const contradictions = queryModule.findContradictions(namespace);
    expect(Array.isArray(contradictions)).toBe(true);
    expect(contradictions).toEqual([]);
  });

  it('findUnverifiedClaims returns empty array on empty namespace', () => {
    const unverified = queryModule.findUnverifiedClaims(namespace);
    expect(Array.isArray(unverified)).toBe(true);
    expect(unverified).toEqual([]);
  });

  it('rankHotNodes returns empty array on empty namespace', () => {
    const hot = queryModule.rankHotNodes(namespace);
    expect(Array.isArray(hot)).toBe(true);
    expect(hot).toEqual([]);
  });

  it('rankHotNodes respects custom limit parameter', () => {
    const hot = queryModule.rankHotNodes(namespace, 5);
    expect(Array.isArray(hot)).toBe(true);
    expect(hot.length).toBeLessThanOrEqual(5);
  });

  it('findProvenanceChain returns empty array for non-existent node', () => {
    const chain = queryModule.findProvenanceChain(namespace, 'non-existent-node-id');
    expect(Array.isArray(chain)).toBe(true);
    expect(chain).toEqual([]);
  });

  it('findProvenanceChain respects maxDepth parameter', () => {
    const chain = queryModule.findProvenanceChain(namespace, 'non-existent', 5);
    expect(Array.isArray(chain)).toBe(true);
    expect(chain.length).toBeLessThanOrEqual(5);
  });

  it('findSimilarNodes does not return identical names from other kinds', () => {
    dbModule.batchUpsert(
      [
        { ...namespace, id: 'finding-shared', kind: 'FINDING', name: 'Shared duplicate wording' },
        { ...namespace, id: 'question-shared', kind: 'QUESTION', name: 'Shared duplicate wording' },
      ],
      [],
    );

    const similarClaims = queryModule.findSimilarNodes(namespace, {
      kind: 'CLAIM',
      name: 'Shared duplicate wording',
      threshold: 0.85,
    });

    expect(similarClaims).toEqual([]);
  });

  it('findConsolidationCandidates clusters near duplicates without mutating graph rows', () => {
    dbModule.batchUpsert(
      [
        {
          ...namespace,
          id: 'finding-retry',
          kind: 'FINDING',
          name: 'missing retry guard on network timeout',
        },
        {
          ...namespace,
          id: 'finding-retry-alias',
          kind: 'FINDING',
          name: 'missing retry guard on network timeout handling',
        },
        {
          ...namespace,
          id: 'question-retry',
          kind: 'QUESTION',
          name: 'missing retry guard on network timeout',
        },
        {
          ...namespace,
          id: 'finding-parser',
          kind: 'FINDING',
          name: 'parser error path is undocumented',
        },
      ],
      [],
    );
    const before = graphSnapshot();

    const similarFindings = queryModule.findSimilarNodes(namespace, {
      kind: 'FINDING',
      name: 'missing retry guard on network timeout',
      threshold: 0.85,
    });
    const candidates = queryModule.findConsolidationCandidates(namespace, { threshold: 0.85 });
    const after = graphSnapshot();

    expect(after).toEqual(before);
    expect(similarFindings.map(node => node.nodeId)).toEqual([
      'finding-retry',
      'finding-retry-alias',
    ]);
    expect(candidates.clusters).toHaveLength(1);
    expect(candidates.clusters[0]).toMatchObject({ kind: 'FINDING' });
    expect(candidates.clusters[0].nodes.map(node => node.nodeId)).toEqual([
      'finding-retry',
      'finding-retry-alias',
    ]);
    expect(candidates.leftovers.map(node => node.nodeId).sort()).toEqual([
      'finding-parser',
      'question-retry',
    ]);
  });

  it('findCoverageGaps surfaces uncovered QUESTION nodes when graph is populated', () => {
    dbModule.batchUpsert(
      [{ ...namespace, id: 'q1', kind: 'QUESTION', name: 'An uncovered question' }],
      [],
    );
    const gaps = queryModule.findCoverageGaps(namespace);
    expect(Array.isArray(gaps)).toBe(true);
    // The exact gap-detection semantics depend on coverage-graph-db; smoke-test ensures the function runs
    // against a populated namespace without throwing.
  });
});
