// MODULE: Deep-Loop Council Graph Query — Unit Tests

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

type DbModule = typeof import('../../lib/council/council-graph-db.js');
type QueryModule = typeof import('../../lib/council/council-graph-query.js');

let tempDir: string;
let dbModule: DbModule;
let queryModule: QueryModule;

const namespace = {
  specFolder: 'specs/council-graph-query-fixture',
  sessionId: 'council-graph-query-fixture',
} as const;

beforeEach(async () => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'council-graph-query-'));
  vi.resetModules();
  dbModule = await import('../../lib/council/council-graph-db.js');
  dbModule.initDb(tempDir);
  queryModule = await import('../../lib/council/council-graph-query.js');
});

afterEach(() => {
  dbModule?.closeDb?.();
  vi.resetModules();
  if (tempDir) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

describe('council-graph-db and council-graph-query', () => {
  it('preserves council-only taxonomy validation helpers', () => {
    expect(dbModule.VALID_KINDS).toEqual([
      'SESSION',
      'ROUND',
      'SEAT',
      'CLAIM',
      'EVIDENCE',
      'DISAGREEMENT',
      'DECISION',
      'RECOMMENDATION',
    ]);
    expect(dbModule.VALID_RELATIONS).toEqual([
      'PARTICIPATES_IN',
      'PROPOSES',
      'SUPPORTS',
      'CONTRADICTS',
      'DERIVES_FROM',
      'AGREES_WITH',
      'RESOLVES',
      'ESCALATES',
      'EVIDENCE_FOR',
      'RECOMMENDS',
    ]);
    expect(dbModule.isCouncilNodeKind('DECISION')).toBe(true);
    expect(dbModule.isCouncilNodeKind('QUESTION')).toBe(false);
    expect(dbModule.isCouncilRelation('EVIDENCE_FOR')).toBe(true);
    expect(dbModule.isCouncilRelation('CITES')).toBe(false);
  });

  it('clamps edge weights before storage', () => {
    dbModule.batchUpsert(
      [
        { ...namespace, id: 'claim-1', kind: 'CLAIM', name: 'Claim' },
        { ...namespace, id: 'decision-1', kind: 'DECISION', name: 'Decision' },
        { ...namespace, id: 'evidence-1', kind: 'EVIDENCE', name: 'Evidence' },
      ],
      [
        { ...namespace, id: 'edge-low', sourceId: 'claim-1', targetId: 'decision-1', relation: 'SUPPORTS', weight: -5 },
        { ...namespace, id: 'edge-high', sourceId: 'evidence-1', targetId: 'decision-1', relation: 'EVIDENCE_FOR', weight: 5 },
        { ...namespace, id: 'edge-default', sourceId: 'decision-1', targetId: 'evidence-1', relation: 'DERIVES_FROM', weight: Number.NaN },
      ],
    );

    const weights = Object.fromEntries(dbModule.getEdges(namespace).map((edge) => [edge.id, edge.weight]));
    expect(weights).toMatchObject({
      'edge-low': 0,
      'edge-high': 2,
      'edge-default': 1,
    });
  });

  it('keeps identical node IDs isolated by session namespace', () => {
    const first = { specFolder: namespace.specFolder, sessionId: 'session-a' };
    const second = { specFolder: namespace.specFolder, sessionId: 'session-b' };

    dbModule.upsertNode({ ...first, id: 'decision-1', kind: 'DECISION', name: 'First session decision' });
    dbModule.upsertNode({ ...second, id: 'decision-1', kind: 'DECISION', name: 'Second session decision' });

    expect(dbModule.getNode(first, 'decision-1')?.name).toBe('First session decision');
    expect(dbModule.getNode(second, 'decision-1')?.name).toBe('Second session decision');
    expect(dbModule.getStats(namespace.specFolder).totalNodes).toBe(2);
    expect(dbModule.getStats(namespace.specFolder, first.sessionId).totalNodes).toBe(1);
  });

  it('returns prompt-safe metadata only', () => {
    const longStatus = 'x'.repeat(120);
    dbModule.upsertNode({
      ...namespace,
      id: 'decision-1',
      kind: 'DECISION',
      name: 'Metadata safety decision',
      artifactPath: 'ai-council/round-001/report.md',
      roundId: 'round-001',
      metadata: {
        confidence: 0.91,
        status: longStatus,
        secretToken: 'should-not-surface',
        nested: { raw: 'artifact text' },
      },
    });

    const [support] = queryModule.findDecisionSupport(namespace, 'decision-1');
    expect(support.node.metadata?.confidence).toBe(0.91);
    expect(String(support.node.metadata?.status).length).toBeLessThanOrEqual(83);
    expect(support.node.artifactPath).toBe('ai-council/round-001/report.md');
    expect(support.node.roundId).toBe('round-001');
    expect(JSON.stringify(support.node)).not.toContain('should-not-surface');
    expect(JSON.stringify(support.node)).not.toContain('artifact text');
  });

  it('cleans one session namespace without deleting sibling sessions', () => {
    const first = { specFolder: namespace.specFolder, sessionId: 'session-a' };
    const second = { specFolder: namespace.specFolder, sessionId: 'session-b' };

    dbModule.upsertNode({ ...first, id: 'decision-1', kind: 'DECISION', name: 'First session decision' });
    dbModule.upsertNode({ ...second, id: 'decision-1', kind: 'DECISION', name: 'Second session decision' });
    const deleted = dbModule.cleanupNamespace(first);

    expect(deleted).toBe(1);
    expect(dbModule.getNode(first, 'decision-1')).toBeNull();
    expect(dbModule.getNode(second, 'decision-1')?.name).toBe('Second session decision');
  });
});
