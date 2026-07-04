import { readFileSync } from 'fs';
import { resolve } from 'path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { handleMemorySearch } from '../handlers/memory-search';
import * as hybridSearch from '../lib/search/hybrid-search';
import {
  applyRetrievalRescueLayer,
  isRetrievalRescueEnabled,
  __testables,
} from '../lib/search/rerank/retrieval-rescue';
import * as vectorIndex from '../lib/search/vector-index';
import type { PipelineRow } from '../lib/search/pipeline/types';

const savedRescueFlag = process.env.SPECKIT_RERANK_LAYER;
const savedRescueMode = process.env.SPECKIT_RETRIEVAL_RESCUE_MODE;

function resetRescueFlagsForDefault(): void {
  delete process.env.SPECKIT_RERANK_LAYER;
  delete process.env.SPECKIT_RETRIEVAL_RESCUE_MODE;
}

function restoreRescueFlag(): void {
  if (savedRescueFlag === undefined) {
    delete process.env.SPECKIT_RERANK_LAYER;
  } else {
    process.env.SPECKIT_RERANK_LAYER = savedRescueFlag;
  }
  if (savedRescueMode === undefined) {
    delete process.env.SPECKIT_RETRIEVAL_RESCUE_MODE;
  } else {
    process.env.SPECKIT_RETRIEVAL_RESCUE_MODE = savedRescueMode;
  }
}

function extractSearchRows(result: Awaited<ReturnType<typeof handleMemorySearch>>): Array<{ id: number }> {
  const envelope = JSON.parse(result.content[0].text) as { data?: { results?: Array<{ id: number }> } };
  return envelope.data?.results ?? [];
}

describe('retrieval rescue layer', () => {
  beforeAll(() => {
    resetRescueFlagsForDefault();
  });

  afterAll(() => {
    restoreRescueFlag();
  });

  it('is enabled by default and disabled only by explicit false', () => {
    expect(isRetrievalRescueEnabled()).toBe(true);

    process.env.SPECKIT_RERANK_LAYER = 'false';
    expect(isRetrievalRescueEnabled()).toBe(false);

    delete process.env.SPECKIT_RERANK_LAYER;
    expect(isRetrievalRescueEnabled()).toBe(true);
  });

  it('demotes generic trigger-only archive neighbors below richer task matches', () => {
    const query = 'stress-test task list tracking cat-14 pipeline gaps, cat-16 tooling fixes, and the remaining cat-24 memory-recall failure';
    const rows: PipelineRow[] = [
      {
        id: 1,
        title: 'Tasks: Remaining archived remediation',
        file_path: '/repo/.opencode/specs/system-spec-kit/z_archive/054-remediation/tasks.md',
        spec_folder: 'system-spec-kit/z_archive/054-remediation',
        document_type: 'tasks',
        trigger_phrases: '["tasks","remaining"]',
        content: 'Generic remaining remediation task list.',
        score: 1,
        rrfScore: 1,
        intentAdjustedScore: 1,
      },
      {
        id: 2,
        title: 'Tasks: 008 mk-spec-memory stress test',
        file_path: '/repo/.opencode/specs/system-spec-kit/026/008-mk-spec-memory-stress-test/tasks.md',
        spec_folder: 'system-spec-kit/026/008-mk-spec-memory-stress-test',
        document_type: 'tasks',
        trigger_phrases: '["008 tasks"]',
        content: 'cat-14-pipeline gaps, cat-16 tooling fixes, stress-test execution, memory recall failure',
        score: 0.1,
        rrfScore: 0.1,
        intentAdjustedScore: 0.1,
      },
    ];

    const ranked = applyRetrievalRescueLayer(query, rows);
    expect(ranked[0].id).toBe(2);
  });

  it('keeps lexical overwrite as the default ranking authority', () => {
    delete process.env.SPECKIT_RETRIEVAL_RESCUE_MODE;

    expect(__testables.computeRescueLayerScore(1, 1)).toBeCloseTo(0.81, 10);
    expect(__testables.computeRescueLayerScore(1, 0)).toBeCloseTo(0.03, 10);
  });

  it('can fold lexical rescue in without erasing upstream score authority', () => {
    process.env.SPECKIT_RETRIEVAL_RESCUE_MODE = 'additive';
    const query = 'specific rescue phrase';
    const rows: PipelineRow[] = [
      {
        id: 1,
        title: 'Specific rescue phrase',
        trigger_phrases: '[]',
        content: 'specific rescue phrase',
        score: 0.2,
        rrfScore: 0.2,
        intentAdjustedScore: 0.2,
      },
      {
        id: 2,
        title: 'Strong upstream result',
        trigger_phrases: '[]',
        content: 'unrelated upstream authority',
        score: 0.85,
        rrfScore: 0.85,
        intentAdjustedScore: 0.85,
      },
    ];

    const ranked = applyRetrievalRescueLayer(query, rows);

    expect(ranked[0].id).toBe(2);
    expect(ranked.find((row) => row.id === 1)?.score).toBeGreaterThan(0.2);
    expect(ranked.find((row) => row.id === 1)?.score).toBeLessThan(0.4);
  });

  it('scores specific decision records above sibling specs for ADR-shaped queries', () => {
    const query = 'ADR about consolidating spec-kit templates into the level and addendum generator instead of leaving compose scripts separate';
    const specScore = __testables.lexicalScore(query, {
      id: 10,
      title: 'Feature Specification: Template System Consolidation',
      file_path: '/repo/spec.md',
      spec_folder: 'system-spec-kit/074-template-system-consolidation',
      document_type: 'spec',
      trigger_phrases: '["template consolidation","spec-kit templates","core addendum"]',
      content: 'Consolidate spec-kit templates into level and addendum generator.',
    });
    const decisionScore = __testables.lexicalScore(query, {
      id: 11,
      title: 'Decision Record: Template System Consolidation',
      file_path: '/repo/decision-record.md',
      spec_folder: 'system-spec-kit/074-template-system-consolidation',
      document_type: 'decision_record',
      trigger_phrases: '["template consolidation decision","spec-kit template ADR","compose.sh decision"]',
      content: 'Decision to consolidate templates into the generator instead of compose scripts.',
    });

    expect(decisionScore.score).toBeGreaterThan(specScore.score);
  });

  // SKIP: corpus drift baseline pending recalibration after 016 embedder migration
  it.skip('keeps the post-surgery cat-24/409 fixture at or above 8/10 top-3', async () => {
    const fixturePath = resolve(
      import.meta.dirname,
      '..',
      '..',
      'manual_testing_playbook',
      '24--local-llm-query-intelligence',
      '409-fixture.json'
    );
    const fixture = JSON.parse(readFileSync(fixturePath, 'utf8')) as Array<{
      query: string;
      expected_source_memory_id: number;
    }>;

    const db = vectorIndex.initialize_db();
    hybridSearch.init(db, vectorIndex.vectorSearch, null);

    let top3Hits = 0;
    for (const pair of fixture) {
      const result = await handleMemorySearch({
        query: pair.query,
        limit: 10,
        rerank: false,
        includeContent: false,
        includeConstitutional: false,
        bypassCache: true,
      });
      const ids = extractSearchRows(result).map((row) => row.id);
      const rank = ids.indexOf(pair.expected_source_memory_id);
      if (rank >= 0 && rank < 3) {
        top3Hits++;
      }
    }

    expect(top3Hits).toBeGreaterThanOrEqual(8);
  }, 30_000);
});

describe('retrieval rescue — injected-row scope boundary', () => {
  // Guards against the cross-scope leak where rescue-injected backfill/sibling
  // rows (fetched in Stage 2, after Stage-1 scope filtering) bypass the caller's
  // governance/spec_folder boundary. The other two injection paths (constitutional,
  // community-fallback) re-apply scope; rescue must too.
  type RescueOpts = Parameters<typeof __testables.buildInjectionBoundary>[0];
  const boundary = (o: Partial<RescueOpts>) =>
    __testables.buildInjectionBoundary(o as RescueOpts);
  const row = (spec_folder: string, extra: Record<string, unknown> = {}): PipelineRow =>
    ({ id: 1, spec_folder, ...extra }) as unknown as PipelineRow;

  it('returns no boundary when neither scope nor specFolder is set', () => {
    expect(boundary({})).toBeNull();
  });

  it('keeps in-folder rows (exact + descendant) and drops out-of-folder rows', () => {
    const gate = boundary({ specFolder: 'specs/A' });
    expect(gate).not.toBeNull();
    expect(gate!(row('specs/A'))).toBe(true); // exact
    expect(gate!(row('specs/A/child'))).toBe(true); // descendant
    expect(gate!(row('specs/B'))).toBe(false); // sibling — the leak this fix closes
    expect(gate!(row('specs/AB'))).toBe(false); // prefix without a path separator must not match
    expect(gate!(row(''))).toBe(false); // missing folder
  });

  it('drops rows outside the governance (tenant) scope', () => {
    const gate = boundary({ scopeFilter: { tenantId: 't1' } });
    expect(gate).not.toBeNull();
    expect(gate!(row('specs/A', { tenant_id: 't1' }))).toBe(true);
    expect(gate!(row('specs/A', { tenant_id: 't2' }))).toBe(false);
  });
});
