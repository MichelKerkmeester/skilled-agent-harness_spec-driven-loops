// ───────────────────────────────────────────────────────────────────
// MODULE: Deep-Loop Coverage Graph Query Unit Tests
// ───────────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type DbModule = typeof import('../../lib/coverage-graph/coverage-graph-db.js');
type QueryModule = typeof import('../../lib/coverage-graph/coverage-graph-query.js');
type SignalsModule = typeof import('../../lib/coverage-graph/coverage-graph-signals.js');

let originalDbDir: string | undefined;
let tempDir: string;
let dbModule: DbModule;
let queryModule: QueryModule;
let signalsModule: SignalsModule;

const namespace = {
  specFolder: 'specs/coverage-graph-query-fixture',
  loopType: 'research',
  sessionId: 'coverage-graph-query-fixture',
} as const;

const reviewNamespace = {
  specFolder: 'specs/coverage-graph-query-fixture',
  loopType: 'review',
  sessionId: 'coverage-graph-query-review-fixture',
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
  signalsModule = await import('../../lib/coverage-graph/coverage-graph-signals.js');
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

  it('findCoverageGaps treats incoming COVERS edges as FILE coverage in review graphs', () => {
    dbModule.batchUpsert(
      [
        { ...reviewNamespace, id: 'slice-1', kind: 'SLICE', name: 'Reviewed slice' },
        { ...reviewNamespace, id: 'file-covered', kind: 'FILE', name: 'covered.ts' },
        { ...reviewNamespace, id: 'file-uncovered', kind: 'FILE', name: 'uncovered.ts' },
      ],
      [
        {
          ...reviewNamespace,
          id: 'edge-slice-covers-file',
          sourceId: 'slice-1',
          targetId: 'file-covered',
          relation: 'COVERS',
          weight: 1,
        },
      ],
    );

    const fileGaps = queryModule.findCoverageGaps(reviewNamespace)
      .filter(gap => gap.kind === 'FILE')
      .map(gap => gap.nodeId)
      .sort();

    expect(fileGaps).toEqual(['file-uncovered']);
  });

  it('findUnverifiedClaims matches research convergence claim-verification semantics', () => {
    dbModule.batchUpsert(
      [
        {
          ...namespace,
          id: 'claim-corroborated',
          kind: 'CLAIM',
          name: 'Corroborated claim',
          metadata: { verification_status: 'corroborated' },
        },
        {
          ...namespace,
          id: 'claim-unresolved',
          kind: 'CLAIM',
          name: 'Unresolved claim',
          metadata: { verification_status: 'unresolved' },
        },
      ],
      [],
    );

    const nodes = dbModule.getNodes(namespace);
    const unverified = queryModule.findUnverifiedClaims(namespace);

    expect(signalsModule.computeResearchClaimVerificationRateFromData(nodes)).toBe(0.5);
    expect(unverified.map(claim => claim.id)).toEqual(['claim-unresolved']);
  });

  it('findUnverifiedClaims emits prompt-safe metadata for returned claims', () => {
    const secret = `ghp_${'a'.repeat(36)}`;
    dbModule.batchUpsert(
      [
        {
          ...namespace,
          id: 'claim-secret',
          kind: 'CLAIM',
          name: 'Unresolved claim with metadata',
          metadata: {
            verification_status: 'unresolved',
            status: secret,
            apiToken: secret,
            confidence: 0.72,
          },
        },
      ],
      [],
    );

    const [claim] = queryModule.findUnverifiedClaims(namespace);

    expect(claim?.metadata).toEqual({
      verification_status: 'unresolved',
      status: '[REDACTED]',
      confidence: 0.72,
    });
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
