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
} = require('../../scripts/fanout-merge.cjs') as {
  mergeResearchRegistries: (lineageData: Array<{ label: string; registry: Record<string, unknown> | null }>) => Record<string, unknown>;
  mergeReviewRegistries: (lineageData: Array<{ label: string; registry: Record<string, unknown> | null }>) => Record<string, unknown>;
  buildAttributionMd: (lineageData: unknown[], loopType: string) => string;
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
          keyFindings: [{ id: 'F1', title: 'Finding one (duplicate)', confidence: 0.7 }, { id: 'F2', title: 'Finding two' }],
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
      { label: 'b', registry: { openFindings: [{ findingId: 'F1', severity: 'P0', status: 'active', title: 'X upgraded' }] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('FAIL');
    expect(result.activeP0).toBe(1);
    // Only one deduplicated finding
    expect((result.openFindings as unknown[]).length).toBe(1);
  });

  it('skips non-active findings (resolved/contested)', () => {
    const data = [
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P0', status: 'resolved_false_positive', title: 'FP' }] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('PASS');
    expect(result.activeP0).toBe(0);
  });
});

// ─── fanout-merge.cjs script tests ────────────────────────────────────────

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
});
