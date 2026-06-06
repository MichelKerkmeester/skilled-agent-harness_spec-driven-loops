import { afterEach, describe, expect, it, vi } from 'vitest';
import * as handler from '../handlers/causal-graph';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as causalEdges from '../lib/storage/causal-edges';

function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

function createStatsDb() {
  return {
    prepare(sql: string) {
      if (sql.includes('COUNT(*) as count FROM memory_index')) {
        return { get: () => ({ count: 10 }) };
      }
      if (sql.includes('SELECT DISTINCT source_id')) {
        return { all: () => [{ source_id: '1' }, { source_id: '2' }, { source_id: '3' }, { source_id: '4' }] };
      }
      if (sql.includes('Top') || sql.includes('FROM memory_index m')) {
        return { all: () => [{ id: 9, title: 'Unlinked packet', specFolder: 'specs/009-unlinked' }] };
      }
      if (sql.includes("created_by = 'auto'")) {
        return { get: () => ({ lastBackfillAt: null }) };
      }
      return {
        get: () => ({}),
        all: () => [],
      };
    },
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('memory_causal_stats output schema', () => {
  it('emits zero-filled memory causal graph relations, target-gated health, and remediation hints', async () => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
    vi.spyOn(vectorIndex, 'initializeDb').mockImplementation(() => undefined);
    vi.spyOn(vectorIndex, 'getDb').mockReturnValue(createStatsDb() as ReturnType<typeof vectorIndex.getDb>);
    vi.spyOn(causalEdges, 'init').mockImplementation(() => undefined);
    vi.spyOn(causalEdges, 'getGraphStats').mockReturnValue({
      totalEdges: 2,
      byRelation: {
        caused: 1,
        supports: 1,
      },
      avgStrength: 0.85,
      uniqueSources: 2,
      uniqueTargets: 2,
    });
    vi.spyOn(causalEdges, 'findOrphanedEdges').mockReturnValue([]);
    vi.spyOn(causalEdges, 'getAllEdges').mockReturnValue([]);

    const result = await handler.handleMemoryCausalStats({});
    const parsed = parseResponse(result);

    expect(parsed.summary).toContain('Memory causal graph');
    expect(parsed.data.graphName).toBe('memory causal graph');
    expect(parsed.data.health).toBe('attention');
    expect(parsed.data.meetsTarget).toBe(false);
    expect(parsed.data.reason).toContain('below the 60% target');

    for (const relation of ['supersedes', 'caused', 'supports', 'contradicts', 'enabled', 'derived_from']) {
      expect(parsed.data.by_relation).toHaveProperty(relation);
      expect(typeof parsed.data.by_relation[relation]).toBe('number');
    }

    expect(parsed.data.relationCoverage.backfillJob.name).toBe('autonomous-causal-relation-backfill');
    expect(parsed.data.relationCoverage.backfillJob.implemented).toBe(true);
    expect(parsed.data.relationCoverage.backfillJob.command).not.toBeNull();
    expect(parsed.data.relationCoverage.backfillJob.command).toContain('memory_causal_stats');
    // The wired relation-backfill is surfaced; hints must name the real command, never the no-op autoRepair.
    expect(parsed.hints.join('\n')).not.toContain('autoRepair');
    expect(parsed.data.relationCoverage.current.map((entry: { relation: string }) => entry.relation)).toEqual([
      'caused',
      'supports',
      'contradicts',
      'supersedes',
      'enabled',
      'derived_from',
    ]);
    expect(parsed.hints.join('\n')).toContain('Top 1 unlinked records');
  });
});
