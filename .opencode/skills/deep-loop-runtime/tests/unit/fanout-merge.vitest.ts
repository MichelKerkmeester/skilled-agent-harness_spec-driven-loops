import { createRequire } from 'node:module';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runtimeRoot, spawnCjs } from '../helpers/spawn-cjs';

const require = createRequire(import.meta.url);
const {
  mergeResearchRegistries,
  mergeReviewRegistries,
  buildAttributionMd,
  reconstructReviewRegistryFromState,
  normalizeRegistrySchema,
} = require('../../scripts/fanout-merge.cjs') as {
  mergeResearchRegistries: (
    lineageData: Array<{ label: string; registry: Record<string, unknown> | null }>,
    options?: { enableNearDuplicateDedup?: boolean },
  ) => Record<string, unknown>;
  mergeReviewRegistries: (
    lineageData: Array<{ label: string; registry: Record<string, unknown> | null }>,
    options?: { enableNearDuplicateDedup?: boolean },
  ) => Record<string, unknown>;
  buildAttributionMd: (lineageData: unknown[], loopType: string) => string;
  reconstructReviewRegistryFromState: (
    stateRecords: Array<Record<string, unknown>>,
    label: string,
  ) => { openFindings: unknown[]; resolvedFindings: unknown[]; findingsBySeverity: Record<string, number>; _reconstructed: true } | null;
  normalizeRegistrySchema: (
    registry: Record<string, unknown> | null,
    opts: { canonicalKey: string; aliases: Record<string, string>; lineage: string },
  ) => { registry: Record<string, unknown> | null; warnings: Array<Record<string, unknown>> };
};

const tempDirs: string[] = [];

function makeTempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

const fanoutMergeScript = join(runtimeRoot, 'scripts', 'fanout-merge.cjs');

function registryBytes(value: unknown): string {
  return JSON.stringify(value);
}

// ─── Research merge unit tests ─────────────────────────────────────────────

describe('mergeResearchRegistries', () => {
  it('deduplicates findings with the same id across lineages', () => {
    const data = [
      {
        label: 'a',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Finding one', confidence: 0.9 }],
          openQuestions: [],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 3, convergenceScore: 0.8, openQuestions: 0, resolvedQuestions: 0, keyFindings: 1, coverageBySources: {} },
        },
      },
      {
        label: 'b',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Finding one', confidence: 0.7 }, { id: 'F2', title: 'Finding two' }],
          openQuestions: [],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 2, convergenceScore: 0.6, openQuestions: 0, resolvedQuestions: 0, keyFindings: 2, coverageBySources: {} },
        },
      },
    ];

    const result = mergeResearchRegistries(data);
    const findings = result.keyFindings as Array<{ id: string; _lineages: string[] }>;

    // F1 deduplicated — only one entry
    expect(findings.filter((f) => f.id === 'F1')).toHaveLength(1);
    // F2 present
    expect(findings.filter((f) => f.id === 'F2')).toHaveLength(1);
    // Total: 2 unique findings
    expect(findings).toHaveLength(2);

    // F1 should track both lineages
    const f1 = findings.find((f) => f.id === 'F1')!;
    expect(f1._lineages).toContain('a');
    expect(f1._lineages).toContain('b');
  });

  it('keeps both same-id findings when their substantive content differs and records the conflict', () => {
    const result = mergeResearchRegistries([
      {
        label: 'a',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Cache invalidation is missing', summary: 'TTL never updates' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
      {
        label: 'b',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Cache invalidation is safe', summary: 'TTL is refreshed by the writer' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
    ]);

    const findings = result.keyFindings as Array<{
      id: string;
      _conflictOf?: string;
      _conflicts?: Array<{ relation: string; originalId: string; peerId: string }>;
    }>;
    const conflictFindings = findings.filter((finding) => finding._conflictOf === 'F1');
    expect(conflictFindings).toHaveLength(2);
    expect(new Set(conflictFindings.map((finding) => finding.id)).size).toBe(2);
    expect(conflictFindings.every((finding) => finding.id.startsWith('F1--'))).toBe(true);
    expect(conflictFindings.every((finding) => finding._conflicts?.[0]?.relation === 'CONTRADICTS')).toBe(true);
    expect(conflictFindings.every((finding) => finding._conflicts?.[0]?.originalId === 'F1')).toBe(true);
  });

  it('aggregates total iteration count across lineages', () => {
    const data = [
      { label: 'a', registry: { keyFindings: [], openQuestions: [], ruledOutDirections: [], metrics: { iterationsCompleted: 4, convergenceScore: 0.9, openQuestions: 0, resolvedQuestions: 0, keyFindings: 0, coverageBySources: {} } } },
      { label: 'b', registry: { keyFindings: [], openQuestions: [], ruledOutDirections: [], metrics: { iterationsCompleted: 3, convergenceScore: 0.7, openQuestions: 0, resolvedQuestions: 0, keyFindings: 0, coverageBySources: {} } } },
    ];

    const result = mergeResearchRegistries(data);
    const metrics = result.metrics as { iterationsCompleted: number; convergenceScore: number };
    expect(metrics.iterationsCompleted).toBe(7);
    expect(metrics.convergenceScore).toBeCloseTo(0.8, 2);
  });

  it('handles lineages with null registry gracefully', () => {
    const data = [
      { label: 'ok', registry: { keyFindings: [{ id: 'F1', title: 'ok' }], openQuestions: [], ruledOutDirections: [], metrics: { iterationsCompleted: 1, convergenceScore: 0.5, openQuestions: 0, resolvedQuestions: 0, keyFindings: 1, coverageBySources: {} } } },
      { label: 'missing', registry: null },
    ];

    const result = mergeResearchRegistries(data as Parameters<typeof mergeResearchRegistries>[0]);
    expect((result.keyFindings as unknown[]).length).toBe(1);
  });

  it('orders merged findings deterministically by content rather than input order', () => {
    const alpha = { id: 'F3', title: 'Alpha finding' };
    const middle = { id: 'F1', title: 'Middle finding' };
    const zebra = { id: 'F2', title: 'Zebra finding' };
    const firstRun = mergeResearchRegistries([
      { label: 'b', registry: { keyFindings: [zebra, alpha], openQuestions: [], ruledOutDirections: [] } },
      { label: 'a', registry: { keyFindings: [middle], openQuestions: [], ruledOutDirections: [] } },
    ]);
    const secondRun = mergeResearchRegistries([
      { label: 'a', registry: { keyFindings: [middle], openQuestions: [], ruledOutDirections: [] } },
      { label: 'b', registry: { keyFindings: [zebra, alpha], openQuestions: [], ruledOutDirections: [] } },
    ]);

    expect((firstRun.keyFindings as Array<{ id: string }>).map((finding) => finding.id)).toEqual(['F3', 'F1', 'F2']);
    expect((secondRun.keyFindings as Array<{ id: string }>).map((finding) => finding.id)).toEqual(['F3', 'F1', 'F2']);
  });

  it('keeps the research registry byte-identical across lineage arrival orders', () => {
    const lineages = [
      {
        label: 'zeta',
        registry: {
          keyFindings: [
            { id: 'F3', title: 'Zebra finding', summary: 'Last content' },
            { id: 'F2', title: 'Shared finding', summary: 'Shared content' },
          ],
          openQuestions: [{ id: 'Q2', question: 'Zeta question' }],
          resolvedQuestions: [],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 2, convergenceScore: 0.8 },
        },
      },
      {
        label: 'alpha',
        registry: {
          keyFindings: [
            { id: 'F1', title: 'Alpha finding', summary: 'First content' },
            { id: 'F2', title: 'Shared finding', summary: 'Shared content' },
          ],
          openQuestions: [{ id: 'Q1', question: 'Alpha question' }],
          resolvedQuestions: [],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 3, convergenceScore: 0.6 },
        },
      },
      {
        label: 'middle',
        registry: {
          keyFindings: [{ id: 'F4', title: 'Middle finding', summary: 'Middle content' }],
          openQuestions: [],
          resolvedQuestions: [{ id: 'RQ1', question: 'Resolved question' }],
          ruledOutDirections: [{ id: 'D1', direction: 'Ruled out direction' }],
          metrics: { iterationsCompleted: 1, convergenceScore: 0.7 },
        },
      },
    ];

    const baseline = registryBytes(mergeResearchRegistries(lineages));
    expect(registryBytes(mergeResearchRegistries([lineages[2], lineages[0], lineages[1]]))).toBe(baseline);
    expect(registryBytes(mergeResearchRegistries([lineages[1], lineages[2], lineages[0]]))).toBe(baseline);
  });

  it('collapses research surface variants by normalized content when enabled', () => {
    const result = mergeResearchRegistries([
      {
        label: 'a',
        registry: {
          keyFindings: [{ id: 'F-cache-a', title: 'Cache invalidation missing', summary: 'Writer never refreshes cache TTL' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
      {
        label: 'b',
        registry: {
          keyFindings: [{ id: 'F-cache-b', title: 'Stale cache survives writes', summary: 'Writer never refreshes cache TTL' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
    ], { enableNearDuplicateDedup: true });

    const findings = result.keyFindings as Array<{ _lineages: string[] }>;
    expect(findings).toHaveLength(1);
    expect(findings[0]._lineages).toEqual(['a', 'b']);
    expect((result.metrics as { keyFindings: number }).keyFindings).toBe(1);
  });

  it('leaves research surface variants separate by default', () => {
    const result = mergeResearchRegistries([
      {
        label: 'a',
        registry: {
          keyFindings: [{ id: 'F-cache-a', title: 'Cache invalidation missing', summary: 'Writer never refreshes cache TTL' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
      {
        label: 'b',
        registry: {
          keyFindings: [{ id: 'F-cache-b', title: 'Stale cache survives writes', summary: 'Writer never refreshes cache TTL' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
    ]);

    expect(result.keyFindings as unknown[]).toHaveLength(2);
    expect((result.metrics as { keyFindings: number }).keyFindings).toBe(2);
  });

  it('keeps distinct research findings that share an exact id when enabled', () => {
    const result = mergeResearchRegistries([
      {
        label: 'a',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Cache behavior', summary: 'TTL never updates' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
      {
        label: 'b',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Cache behavior', summary: 'TTL refreshes after every write' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
    ], { enableNearDuplicateDedup: true });

    const findings = result.keyFindings as Array<{ _conflictOf?: string }>;
    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding._conflictOf === 'F1')).toBe(true);
  });

  it('merges resolvedQuestions across lineages and dedupes shared ids', () => {
    const data = [
      {
        label: 'a',
        registry: {
          keyFindings: [],
          openQuestions: [],
          resolvedQuestions: [
            { id: 'Q1', text: 'Shared question', addedAtIteration: 1, resolvedAtIteration: 2 },
            { id: 'Q2', text: 'A-only question', addedAtIteration: 1, resolvedAtIteration: 3 },
          ],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 2, convergenceScore: 0.8, openQuestions: 0, resolvedQuestions: 2, keyFindings: 0, coverageBySources: {} },
        },
      },
      {
        label: 'b',
        registry: {
          keyFindings: [],
          openQuestions: [],
          resolvedQuestions: [
            { id: 'Q1', text: 'Shared question', addedAtIteration: 1, resolvedAtIteration: 2 },
            { id: 'Q3', text: 'B-only question', addedAtIteration: 1, resolvedAtIteration: 4 },
          ],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 1, convergenceScore: 0.6, openQuestions: 0, resolvedQuestions: 2, keyFindings: 0, coverageBySources: {} },
        },
      },
    ];

    const result = mergeResearchRegistries(data);
    const resolved = result.resolvedQuestions as Array<{ id: string; _lineages: string[] }>;
    const metrics = result.metrics as { resolvedQuestions: number };

    // Q1 (shared), Q2 (a), Q3 (b) → 3 deduplicated entries
    expect(resolved).toHaveLength(3);
    expect(metrics.resolvedQuestions).toBe(3);

    const q1 = resolved.find((q) => q.id === 'Q1')!;
    expect(q1._lineages).toContain('a');
    expect(q1._lineages).toContain('b');
    // Shared label must not be duplicated in _lineages
    expect(q1._lineages.filter((l) => l === 'a')).toHaveLength(1);
  });

  it('emits empty resolvedQuestions when lineages report none', () => {
    const data = [
      { label: 'a', registry: { keyFindings: [], openQuestions: [], ruledOutDirections: [], metrics: { iterationsCompleted: 1, convergenceScore: 0.5, openQuestions: 0, resolvedQuestions: 0, keyFindings: 0, coverageBySources: {} } } },
    ];
    const result = mergeResearchRegistries(data);
    expect(result.resolvedQuestions as unknown[]).toHaveLength(0);
    expect((result.metrics as { resolvedQuestions: number }).resolvedQuestions).toBe(0);
  });

  it('includes findings from a lineage using "findings" instead of "keyFindings" (schema tolerance)', () => {
    const data = [
      {
        label: 'gpt',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Canonical finding' }],
          openQuestions: [],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 1, convergenceScore: 0.8, openQuestions: 0, resolvedQuestions: 0, keyFindings: 1, coverageBySources: {} },
        },
      },
      {
        label: 'glm',
        registry: {
          findings: [{ id: 'F2', title: 'Non-canonical finding' }],
          openQuestions: [],
          ruledOutDirections: [],
          metrics: { iterationsCompleted: 1, convergenceScore: 0.7, openQuestions: 0, resolvedQuestions: 0, keyFindings: 1, coverageBySources: {} },
        },
      },
    ];

    const result = mergeResearchRegistries(data);
    const findings = result.keyFindings as Array<{ id: string }>;

    // Both findings must be present — the bug is that F2 is silently dropped
    expect(findings).toHaveLength(2);
    expect(findings.map((f) => f.id).sort()).toEqual(['F1', 'F2']);
    expect((result.metrics as { keyFindings: number }).keyFindings).toBe(2);
  });

  it('sum(per-lineage finding counts) == merged finding count (sum-invariant regression)', () => {
    const data = [
      {
        label: 'gpt',
        registry: {
          keyFindings: [
            { id: 'F1', title: 'Finding one' },
            { id: 'F2', title: 'Finding two' },
            { id: 'F3', title: 'Finding three' },
          ],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
      {
        label: 'glm',
        registry: {
          findings: [
            { id: 'F4', title: 'Finding four' },
            { id: 'F5', title: 'Finding five' },
          ],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
      {
        label: 'kimi',
        registry: {
          keyFindings: [
            { id: 'F6', title: 'Finding six' },
          ],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
    ];

    const result = mergeResearchRegistries(data);
    const mergedFindings = result.keyFindings as Array<{ id: string }>;

    // Sum of per-lineage finding counts (3 + 2 + 1 = 6) must equal merged count
    // No dedup should occur since all ids are unique
    expect(mergedFindings).toHaveLength(6);
    expect((result.metrics as { keyFindings: number }).keyFindings).toBe(6);
  });

  it('emits schema_mismatch warning when a lineage uses "findings" alias', () => {
    const data = [
      {
        label: 'gpt',
        registry: {
          keyFindings: [{ id: 'F1', title: 'Canonical' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
      {
        label: 'glm',
        registry: {
          findings: [{ id: 'F2', title: 'Non-canonical' }],
          openQuestions: [],
          ruledOutDirections: [],
        },
      },
    ];

    const result = mergeResearchRegistries(data);
    const warnings = result.schema_mismatch as Array<{ type: string; lineage: string; coercedCount: number }>;

    expect(warnings).toBeDefined();
    expect(warnings).toHaveLength(1);
    expect(warnings[0].type).toBe('schema_mismatch');
    expect(warnings[0].lineage).toBe('glm');
    expect(warnings[0].coercedCount).toBe(1);
  });
});

// ─── Review merge unit tests (strongest-restriction) ──────────────────────

describe('mergeReviewRegistries — strongest-restriction', () => {
  it('merges FAIL when lineage A is clean but lineage B has an active P0', () => {
    const data = [
      { label: 'clean', registry: { openFindings: [] } },
      { label: 'p0-lineage', registry: { openFindings: [{ findingId: 'F1', severity: 'P0', status: 'active', title: 'Critical bug' }] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('FAIL');
    expect(result.activeP0).toBe(1);
    expect(result.activeP1).toBe(0);
  });

  it('merges PASS when all lineages have no active P0 or P1', () => {
    const data = [
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P2', status: 'active', title: 'Advisory' }] } },
      { label: 'b', registry: { openFindings: [] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('PASS');
    expect(result.activeP0).toBe(0);
    expect(result.activeP1).toBe(0);
    expect(result.activeP2).toBe(1);
  });

  it('merges CONDITIONAL when P1 exists but no P0', () => {
    const data = [
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P1', status: 'active', title: 'Non-critical' }] } },
      { label: 'b', registry: { openFindings: [] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('CONDITIONAL');
  });

  it('escalates to highest severity for duplicate findingId across lineages', () => {
    const data = [
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P2', status: 'active', title: 'X' }] } },
      { label: 'b', registry: { openFindings: [{ findingId: 'F1', severity: 'P0', status: 'active', title: 'X' }] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('FAIL');
    expect(result.activeP0).toBe(1);
    // Only one deduplicated finding
    expect((result.openFindings as unknown[]).length).toBe(1);
  });

  it('keeps both review findings for a same-id content conflict and marks both sides', () => {
    const result = mergeReviewRegistries([
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P1', status: 'active', title: 'Auth bypass exists' }] } },
      { label: 'b', registry: { openFindings: [{ findingId: 'F1', severity: 'P2', status: 'active', title: 'Auth bypass is mitigated' }] } },
    ]);

    const findings = result.openFindings as Array<{
      findingId: string;
      _conflictOf?: string;
      _conflicts?: Array<{ relation: string; originalId: string }>;
    }>;
    const conflictFindings = findings.filter((finding) => finding._conflictOf === 'F1');
    expect(conflictFindings).toHaveLength(2);
    expect(conflictFindings.every((finding) => finding._conflicts?.[0]?.relation === 'CONTRADICTS')).toBe(true);
    expect(result.mergedVerdict).toBe('CONDITIONAL');
  });

  it('skips non-active findings (resolved/contested)', () => {
    const data = [
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P0', status: 'resolved_false_positive', title: 'FP' }] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('PASS');
    expect(result.activeP0).toBe(0);
  });

  it('merges resolvedFindings across lineages and dedupes shared findingId', () => {
    const data = [
      {
        label: 'a',
        registry: {
          openFindings: [],
          resolvedFindings: [
            { findingId: 'R1', severity: 'P2', status: 'resolved_fixed', title: 'Shared resolved' },
            { findingId: 'R2', severity: 'P1', status: 'resolved_fixed', title: 'A-only resolved' },
          ],
        },
      },
      {
        label: 'b',
        registry: {
          openFindings: [],
          resolvedFindings: [
            { findingId: 'R1', severity: 'P2', status: 'resolved_fixed', title: 'Shared resolved' },
          ],
        },
      },
    ];

    const result = mergeReviewRegistries(data);
    const resolved = result.resolvedFindings as Array<{ findingId: string; _lineages: string[] }>;

    // R1 (shared) + R2 (a) → 2 deduplicated entries; open findings stay empty
    expect(resolved).toHaveLength(2);
    expect(result.resolvedFindingsCount).toBe(2);
    expect((result.openFindings as unknown[]).length).toBe(0);
    expect(result.mergedVerdict).toBe('PASS');

    const r1 = resolved.find((f) => f.findingId === 'R1')!;
    expect(r1._lineages).toContain('a');
    expect(r1._lineages).toContain('b');
  });

  it('keeps resolvedFindings empty when lineages report none', () => {
    const data = [
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P2', status: 'active', title: 'Advisory' }] } },
    ];
    const result = mergeReviewRegistries(data);
    expect(result.resolvedFindings as unknown[]).toHaveLength(0);
    expect(result.resolvedFindingsCount).toBe(0);
  });

  it('orders merged open findings deterministically while preserving severity rollup', () => {
    const alpha = { findingId: 'R3', severity: 'P2', status: 'active', title: 'Alpha review finding' };
    const middle = { findingId: 'R1', severity: 'P1', status: 'active', title: 'Middle review finding' };
    const zebra = { findingId: 'R2', severity: 'P0', status: 'active', title: 'Zebra review finding' };

    const firstRun = mergeReviewRegistries([
      { label: 'b', registry: { openFindings: [zebra, alpha] } },
      { label: 'a', registry: { openFindings: [middle] } },
    ]);
    const secondRun = mergeReviewRegistries([
      { label: 'a', registry: { openFindings: [middle] } },
      { label: 'b', registry: { openFindings: [zebra, alpha] } },
    ]);

    expect((firstRun.openFindings as Array<{ findingId: string }>).map((finding) => finding.findingId)).toEqual(['R3', 'R1', 'R2']);
    expect((secondRun.openFindings as Array<{ findingId: string }>).map((finding) => finding.findingId)).toEqual(['R3', 'R1', 'R2']);
    expect(firstRun.mergedVerdict).toBe('FAIL');
  });

  it('keeps the review registry byte-identical across lineage arrival orders', () => {
    const lineages = [
      {
        label: 'zeta',
        registry: {
          openFindings: [
            { findingId: 'R3', severity: 'P0', status: 'active', title: 'Zebra review finding' },
            { findingId: 'R2', severity: 'P1', status: 'active', title: 'Shared review finding' },
          ],
          resolvedFindings: [],
        },
      },
      {
        label: 'alpha',
        registry: {
          openFindings: [
            { findingId: 'R1', severity: 'P2', status: 'active', title: 'Alpha review finding' },
            { findingId: 'R2', severity: 'P1', status: 'active', title: 'Shared review finding' },
          ],
          resolvedFindings: [{ findingId: 'RR1', severity: 'P2', status: 'resolved_fixed', title: 'Resolved review finding' }],
        },
      },
      {
        label: 'middle',
        registry: {
          openFindings: [{ findingId: 'R4', severity: 'P1', status: 'active', title: 'Middle review finding' }],
          resolvedFindings: [],
        },
      },
    ];

    const baseline = registryBytes(mergeReviewRegistries(lineages));
    expect(registryBytes(mergeReviewRegistries([lineages[2], lineages[0], lineages[1]]))).toBe(baseline);
    expect(registryBytes(mergeReviewRegistries([lineages[1], lineages[2], lineages[0]]))).toBe(baseline);
  });

  it('collapses review surface variants by normalized content when enabled', () => {
    const result = mergeReviewRegistries([
      {
        label: 'a',
        registry: {
          openFindings: [{ findingId: 'R-cache-a', severity: 'P2', status: 'active', title: 'Cache advisory', description: 'Writer never refreshes cache TTL' }],
        },
      },
      {
        label: 'b',
        registry: {
          openFindings: [{ findingId: 'R-cache-b', severity: 'P0', status: 'active', title: 'Critical stale cache', description: 'Writer never refreshes cache TTL' }],
        },
      },
    ], { enableNearDuplicateDedup: true });

    const findings = result.openFindings as Array<{ severity: string; _lineages: string[] }>;
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('P0');
    expect(findings[0]._lineages).toEqual(['a', 'b']);
    expect(result.mergedVerdict).toBe('FAIL');
    expect(result.activeP0).toBe(1);
  });

  it('keeps distinct review findings that share an exact id when enabled', () => {
    const result = mergeReviewRegistries([
      {
        label: 'a',
        registry: {
          openFindings: [{ findingId: 'R1', severity: 'P1', status: 'active', title: 'Cache behavior', description: 'TTL never updates' }],
        },
      },
      {
        label: 'b',
        registry: {
          openFindings: [{ findingId: 'R1', severity: 'P2', status: 'active', title: 'Cache behavior', description: 'TTL refreshes after every write' }],
        },
      },
    ], { enableNearDuplicateDedup: true });

    const findings = result.openFindings as Array<{ _conflictOf?: string }>;
    expect(findings).toHaveLength(2);
    expect(findings.every((finding) => finding._conflictOf === 'R1')).toBe(true);
    expect(result.mergedVerdict).toBe('CONDITIONAL');
  });

  it('collapses resolved review variants by normalized content when enabled', () => {
    const result = mergeReviewRegistries([
      {
        label: 'a',
        registry: {
          openFindings: [],
          resolvedFindings: [{ findingId: 'RR-cache-a', severity: 'P2', status: 'resolved_fixed', title: 'Cache resolved', description: 'Writer now refreshes cache TTL' }],
        },
      },
      {
        label: 'b',
        registry: {
          openFindings: [],
          resolvedFindings: [{ findingId: 'RR-cache-b', severity: 'P2', status: 'resolved_fixed', title: 'Stale cache fixed', description: 'Writer now refreshes cache TTL' }],
        },
      },
    ], { enableNearDuplicateDedup: true });

    const resolved = result.resolvedFindings as Array<{ _lineages: string[] }>;
    expect(resolved).toHaveLength(1);
    expect(resolved[0]._lineages).toEqual(['a', 'b']);
    expect(result.resolvedFindingsCount).toBe(1);
  });

  it('includes openFindings from a review lineage using "findings" instead of "openFindings" (schema tolerance)', () => {
    const data = [
      {
        label: 'gpt',
        registry: {
          openFindings: [{ findingId: 'F1', severity: 'P0', status: 'active', title: 'Critical' }],
        },
      },
      {
        label: 'glm',
        registry: {
          findings: [{ findingId: 'F2', severity: 'P1', status: 'active', title: 'Non-canonical' }],
        },
      },
    ];

    const result = mergeReviewRegistries(data);
    const findings = result.openFindings as Array<{ findingId: string }>;

    expect(findings).toHaveLength(2);
    expect(findings.map((f) => f.findingId).sort()).toEqual(['F1', 'F2']);
    expect(result.mergedVerdict).toBe('FAIL');
  });
});

// ─── fanout-merge.cjs script tests ────────────────────────────────────────

describe('reconstructReviewRegistryFromState — leaf-only lineage fallback', () => {
  it('rebuilds an openFindings registry from state-log findingDetails when no registry file exists', () => {
    const stateRecords = [
      { type: 'iteration', findingDetails: [
        { id: 'P1-1', severity: 'P1', title: 'gap a', disposition: 'active' },
        { id: 'P2-2', severity: 'P2', title: 'advisory', disposition: 'active' },
        { id: 'P1-3', severity: 'P1', title: 'fixed', disposition: 'resolved' },
      ] },
    ];
    const registry = reconstructReviewRegistryFromState(stateRecords as never, 'glm');
    expect(registry).not.toBeNull();
    expect(registry!.openFindings).toHaveLength(2);
    expect(registry!.resolvedFindings).toHaveLength(1);
    expect(registry!.findingsBySeverity).toEqual({ P0: 0, P1: 1, P2: 1 });
    expect(registry!.openFindings[0]).toMatchObject({ findingId: 'P1-1', severity: 'P1', status: 'active', _lineages: ['glm'] });
  });

  it('returns null when the state log carries no findings, so the lineage stays skipped', () => {
    const registry = reconstructReviewRegistryFromState(
      [{ type: 'iteration', findingDetails: [] }] as never,
      'glm',
    );
    expect(registry).toBeNull();
  });
});

describe('fanout-merge.cjs — script', () => {
  it('exits 0 with ok when no lineages directory exists', async () => {
    const baseDir = makeTempDir('fanout-merge-empty-');
    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);
    expect(result.exitCode).toBe(0);
    const json = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(json.status).toBe('ok');
  });

  it('merges two review lineage registries and writes fanout-attribution.md', () => {
    const baseDir = makeTempDir('fanout-merge-review-');
    const lineagesDir = join(baseDir, 'lineages');

    // Set up lineage A (P0 finding)
    const linADir = join(lineagesDir, 'lina');
    mkdirSync(linADir, { recursive: true });
    writeFileSync(
      join(linADir, 'deep-review-findings-registry.json'),
      JSON.stringify({ openFindings: [{ findingId: 'F1', severity: 'P0', status: 'active', title: 'Critical' }], findingsBySeverity: { P0: 1, P1: 0, P2: 0 }, openFindingsCount: 1, resolvedFindingsCount: 0 }),
      'utf8',
    );

    // Set up lineage B (clean)
    const linBDir = join(lineagesDir, 'linb');
    mkdirSync(linBDir, { recursive: true });
    writeFileSync(
      join(linBDir, 'deep-review-findings-registry.json'),
      JSON.stringify({ openFindings: [], findingsBySeverity: { P0: 0, P1: 0, P2: 0 }, openFindingsCount: 0, resolvedFindingsCount: 0 }),
      'utf8',
    );

    // Run merge
    const { execSync } = require('node:child_process');
    execSync(`node "${fanoutMergeScript}" --loop-type review --artifact-dir "${baseDir}"`, { encoding: 'utf8' });

    // Merged registry should exist at base dir
    const mergedPath = join(baseDir, 'deep-review-findings-registry.json');
    expect(existsSync(mergedPath)).toBe(true);
    const merged = JSON.parse(readFileSync(mergedPath, 'utf8'));
    expect(merged.mergedVerdict).toBe('FAIL');
    expect(merged.activeP0).toBe(1);

    // Attribution md should exist
    expect(existsSync(join(baseDir, 'fanout-attribution.md'))).toBe(true);
  });

  it('enables near-duplicate research dedup through the CLI flag', () => {
    const baseDir = makeTempDir('fanout-merge-research-dedup-');
    const lineagesDir = join(baseDir, 'lineages');

    const linADir = join(lineagesDir, 'lina');
    mkdirSync(linADir, { recursive: true });
    writeFileSync(
      join(linADir, 'deep-research-findings-registry.json'),
      JSON.stringify({ keyFindings: [{ id: 'F-cache-a', title: 'Cache invalidation missing', summary: 'Writer never refreshes cache TTL' }] }),
      'utf8',
    );

    const linBDir = join(lineagesDir, 'linb');
    mkdirSync(linBDir, { recursive: true });
    writeFileSync(
      join(linBDir, 'deep-research-findings-registry.json'),
      JSON.stringify({ keyFindings: [{ id: 'F-cache-b', title: 'Stale cache survives writes', summary: 'Writer never refreshes cache TTL' }] }),
      'utf8',
    );

    const { execSync } = require('node:child_process');
    execSync(`node "${fanoutMergeScript}" --loop-type research --artifact-dir "${baseDir}" --enable-near-duplicate-dedup`, { encoding: 'utf8' });

    const merged = JSON.parse(readFileSync(join(baseDir, 'deep-research-findings-registry.json'), 'utf8'));
    expect(merged.keyFindings).toHaveLength(1);
    expect(merged.metrics.keyFindings).toBe(1);
  });
});
