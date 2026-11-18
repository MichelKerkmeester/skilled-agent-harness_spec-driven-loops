// ───────────────────────────────────────────────────────────────────
// MODULE: Fanout Merge Registries
// ───────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { runtimeRoot, spawnCjs } from '../helpers/spawn-cjs';

const require = createRequire(import.meta.url);

type LineageDataFixture = {
  label: string;
  registry: Record<string, unknown> | null;
  kind?: string;
  model?: string;
  reasoningEffort?: string | null;
};

const {
  mergeResearchRegistries,
  mergeResearchFrontier,
  mergeReviewRegistries,
  buildAttributionMd,
  reconstructReviewRegistryFromState,
  reconstructResearchRegistryFromState,
  normalizeRegistrySchema,
} = require('../../scripts/fanout-merge.cjs') as {
  mergeResearchRegistries: (
    lineageData: LineageDataFixture[],
    options?: { enableNearDuplicateDedup?: boolean; frontierPartition?: Record<string, string[]> | null },
  ) => Record<string, unknown>;
  mergeResearchFrontier: (
    lineageData: LineageDataFixture[],
    frontierPartition?: Record<string, string[]> | null,
  ) => {
    nodes: Array<{ nodeId: string; status: string; lineage: string; [key: string]: unknown }>;
    stats: Record<string, number>;
    partitionGuard?: { passed: boolean; missing: string[] };
  };
  mergeReviewRegistries: (
    lineageData: LineageDataFixture[],
    options?: { enableNearDuplicateDedup?: boolean; frontierPartition?: Record<string, string[]> | null },
  ) => Record<string, unknown>;
  buildAttributionMd: (lineageData: unknown[], loopType: string) => string;
  reconstructReviewRegistryFromState: (
    stateRecords: Array<Record<string, unknown>>,
    label: string,
  ) => { openFindings: unknown[]; resolvedFindings: unknown[]; findingsBySeverity: Record<string, number>; _reconstructed: true } | null;
  reconstructResearchRegistryFromState: (
    stateRecords: Array<Record<string, unknown>>,
    label: string,
  ) => { keyFindings: unknown[]; metrics: Record<string, number>; _reconstructed: true } | null;
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
const researchWorkflowPath = resolve(
  runtimeRoot,
  '..',
  '..',
  '..',
  'commands',
  'deep',
  'assets',
  'deep-research.yaml',
);

function registryBytes(value: unknown): string {
  return JSON.stringify(value);
}

function extractSynthesisInvariantCommand(yamlPath: string): string {
  const workflow = readFileSync(yamlPath, 'utf8');
  const stepStart = workflow.indexOf('      step_convergence_report:\n');
  if (stepStart < 0) throw new Error(`step_convergence_report missing from ${yamlPath}`);
  const match = workflow.slice(stepStart).match(/\n        command: \|\n([\s\S]*?)(?=\n        [a-zA-Z_]+:|\n      [a-zA-Z_]+:|\n  #)/);
  if (!match) throw new Error(`step_convergence_report command missing from ${yamlPath}`);
  return match[1].replace(/^          /gm, '').trim();
}

function runSynthesisInvariant(
  yamlPath: string,
  registryFindings: string[],
  expectedExitCode = 0,
  appendMalformedState = false,
): Record<string, unknown> {
  // The canonical artifact directory is named for its mode: the state log is a
  // projection the gateway refreshes, and the projection path is derived from
  // the run directory, so the fixture has to present the real layout rather
  // than a directory the workflow would never see.
  const artifactDir = join(makeTempDir('research-lineage-invariant-'), 'research');
  mkdirSync(artifactDir, { recursive: true });
  const stateLogPath = join(artifactDir, 'deep-research-state.jsonl');
  const registryPath = join(artifactDir, 'findings-registry.json');
  const researchPath = join(artifactDir, 'research.md');
  const dashboardPath = join(artifactDir, 'deep-research-dashboard.md');
  // A fan-out parent skips phase_init, so its state log does not exist until
  // the synthesis event is projected into it. Seeding a config row here would
  // present a row no ledger event produced, which the gateway refuses before
  // the append.
  writeFileSync(
    registryPath,
    `${JSON.stringify({ keyFindings: registryFindings.map((title, index) => ({ id: `F${index + 1}`, title })) })}\n`,
    'utf8',
  );
  writeFileSync(researchPath, '# Research\n', 'utf8');
  writeFileSync(dashboardPath, '# Dashboard\n', 'utf8');

  for (const [label, finding] of [['alpha', 'alpha finding'], ['beta', 'beta finding']]) {
    const lineageDir = join(artifactDir, 'lineages', label);
    mkdirSync(join(lineageDir, 'iterations'), { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, findingsCount: 1, findings: [finding] })}\n`,
      'utf8',
    );
    writeFileSync(join(lineageDir, 'iterations', 'iteration-001.md'), `# ${finding}\n`, 'utf8');
  }
  if (appendMalformedState) {
    appendFileSync(join(artifactDir, 'lineages', 'beta', 'deep-research-state.jsonl'), 'not-json\n', 'utf8');
  }

  const replacements: Record<string, string> = {
    '{state_paths.packet_dir}': artifactDir,
    '{state_paths.state_log}': stateLogPath,
    '{state_paths.registry}': registryPath,
    '{state_paths.research_output}': researchPath,
    '{state_paths.dashboard}': dashboardPath,
    '{answered_count}': '0',
    '{total_questions}': '0',
    '{reason}': 'converged',
    '{ISO_8601_NOW}': '2026-07-25T00:00:00.000Z',
  };
  const command = Object.entries(replacements).reduce(
    (rendered, [placeholder, value]) => rendered.split(placeholder).join(value),
    extractSynthesisInvariantCommand(yamlPath),
  );
  const result = spawnSync('/bin/sh', ['-c', command], {
    cwd: runtimeRoot,
    encoding: 'utf8',
  });
  expect(result.status, result.stderr).toBe(expectedExitCode);
  const records = readFileSync(stateLogPath, 'utf8').trim().split(/\r?\n/).map((line) => JSON.parse(line));
  return records.at(-1) as Record<string, unknown>;
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

  it('publishes per-lineage executor provenance so findings can be grouped by model', () => {
    const result = mergeResearchRegistries([
      {
        label: 'beta',
        registry: { keyFindings: [{ id: 'F2', title: 'Beta finding' }], openQuestions: [], ruledOutDirections: [] },
        kind: 'cli-devin',
        model: 'swe-2-max',
        reasoningEffort: null,
      },
      {
        label: 'alpha',
        registry: { keyFindings: [{ id: 'F1', title: 'Alpha finding' }], openQuestions: [], ruledOutDirections: [] },
        kind: 'cli-codex',
        model: 'gpt-6-luna',
        reasoningEffort: 'max',
      },
    ]);

    expect(result.lineageExecutors).toEqual({
      alpha: { kind: 'cli-codex', model: 'gpt-6-luna', reasoningEffort: 'max' },
      beta: { kind: 'cli-devin', model: 'swe-2-max', reasoningEffort: null },
    });
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

  it('merges FAIL when one lineage\'s terminal record names a failed required gate', () => {
    // A lineage that stopped with a required gate still failing did not pass; with no
    // findings to carry the failure, the terminal record is the only record of it.
    const data = [
      { label: 'clean', registry: { openFindings: [] }, stateRecords: [] },
      {
        label: 'gated',
        registry: { openFindings: [] },
        stateRecords: [
          { type: 'event', event: 'terminal_gates', run: 3, stopReason: 'maxIterationsReached', failedRequiredGateIds: ['coverage'] },
        ],
      },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('FAIL');
    expect(result.activeP0).toBe(0);
    expect(result.failedRequiredGateIds).toEqual(['coverage']);
  });

  it('reads a lineage\'s failed gates from its registry when its state log has no terminal row', () => {
    // The reducer can run before the terminal-gates row is written, so the registry is
    // the fallback source; either way the failed gate must reach the merged verdict.
    const data = [
      { label: 'clean', registry: { openFindings: [] }, stateRecords: [] },
      {
        label: 'gated',
        registry: { openFindings: [], terminalGates: { run: 2, stopReason: 'converged', failedRequiredGateIds: ['evidence'] } },
        stateRecords: [],
      },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('FAIL');
    expect(result.failedRequiredGateIds).toEqual(['evidence']);
  });
  it('keeps a registry-less lineage whose state log holds only a failed terminal gate', () => {
    // A lineage that stopped before reducing has no registry file, so its terminal row is
    // the only trace that a required gate failed; losing it would merge a failed review
    // to PASS.
    const stateRecords = [
      { type: 'event', event: 'terminal_gates', run: 2, stopReason: 'error', failedRequiredGateIds: ['coverage'] },
    ];

    const rebuilt = reconstructReviewRegistryFromState(stateRecords, 'gated');
    expect(rebuilt).not.toBeNull();
    expect(rebuilt).toMatchObject({ terminalGates: { failedRequiredGateIds: ['coverage'] } });

    const merged = mergeReviewRegistries([
      { label: 'clean', registry: { openFindings: [] }, stateRecords: [] },
      { label: 'gated', registry: rebuilt, stateRecords },
    ]);
    expect(merged.mergedVerdict).toBe('FAIL');
    expect(merged.failedRequiredGateIds).toEqual(['coverage']);

    expect(reconstructReviewRegistryFromState([], 'empty')).toBeNull();
  });

  it('marks the failing lineage FAIL in the attribution table', () => {
    // The table is read beside the merged verdict, so a lineage whose required gate is
    // still failing must not report PASS next to a FAIL merge.
    const lineageData = [
      {
        label: 'gated',
        registry: { openFindings: [] },
        stateRecords: [
          { type: 'event', event: 'terminal_gates', run: 3, stopReason: 'maxIterationsReached', failedRequiredGateIds: ['coverage'] },
        ],
        kind: 'cli',
        model: 'test-model',
      },
      { label: 'clean', registry: { openFindings: [] }, stateRecords: [], kind: 'cli', model: 'test-model' },
    ];

    const md = buildAttributionMd(lineageData, 'review');
    const rows = md.split('\n').filter((line) => line.startsWith('| '));
    const gatedRow = rows.find((line) => line.startsWith('| gated |'));
    const cleanRow = rows.find((line) => line.startsWith('| clean |'));
    expect(gatedRow?.endsWith('| FAIL |')).toBe(true);
    expect(cleanRow?.endsWith('| PASS |')).toBe(true);
  });

  it('reports an out-of-scale severity instead of letting it rank below every P2 in silence', () => {
    const result = mergeReviewRegistries([
      {
        label: 'a',
        registry: {
          // The same finding appears in both lists, so the check has to collapse its own
          // duplicate report the way the merge collapses the duplicate finding.
          openFindings: [
            { findingId: 'F1', severity: 'P3', status: 'active', title: 'Out-of-scale rating' },
            { findingId: 'F2', severity: 'P2', status: 'active', title: 'In-scale advisory' },
          ],
          resolvedFindings: [{ findingId: 'F1', severity: 'P3', status: 'resolved_fixed', title: 'Out-of-scale rating' }],
        },
      },
      { label: 'b', registry: { openFindings: [] } },
    ]);

    const warnings = result.schema_mismatch as Array<{ unknownSeverity: string; findingId: string; lineage: string }>;
    expect(warnings).toHaveLength(1);
    expect(warnings[0].unknownSeverity).toBe('P3');
    expect(warnings[0].findingId).toBe('F1');
    expect(warnings[0].lineage).toBe('a');
    // Loud is not re-ranked: the merge does not invent the tier the scale lacks, so the
    // out-of-scale finding still raises nothing and the in-scale P2 still decides the count.
    expect(result.activeP2).toBe(1);
    expect(result.mergedVerdict).toBe('PASS');
  });

  it('collects a finding whose active state is under `disposition` (real lineage shape), not `status`', () => {
    // Live lineage registries emit the active flag as `disposition`; a status-only filter
    // dropped every such finding and merged an empty PASS over an active P0.
    const data = [
      { label: 'clean', registry: { openFindings: [] } },
      { label: 'disp-lineage', registry: { openFindings: [{ findingId: 'F1', severity: 'P0', disposition: 'active', title: 'Active P0 flagged via disposition' }] } },
    ];

    const result = mergeReviewRegistries(data);
    expect(result.mergedVerdict).toBe('FAIL');
    expect(result.activeP0).toBe(1);
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

  it('merges a search-debt bug class two lineages both owe into one entry', () => {
    // Debt is one obligation per bug class, so a class two lineages still owe must not
    // count twice against the verdict; the union stays ordered by that key, falling back
    // to the obligation id when the class is missing.
    const result = mergeReviewRegistries([
      {
        label: 'a',
        registry: {
          openFindings: [],
          searchDebt: [
            { bugClass: 'input-validation', id: 'debt-b' },
            { bugClass: 'concurrency', id: 'debt-a' },
          ],
        },
      },
      {
        label: 'b',
        registry: {
          openFindings: [],
          searchDebt: [{ bugClass: 'input-validation', id: 'debt-c' }, { id: 'debt-id-only' }],
        },
      },
    ]);

    const debt = result.searchDebt as Array<{ bugClass?: string; id: string }>;
    expect(debt.map((entry) => entry.bugClass ?? entry.id)).toEqual([
      'concurrency',
      'debt-id-only',
      'input-validation',
    ]);
    // The first lineage's record of a shared class is the one kept.
    expect(debt.find((entry) => entry.bugClass === 'input-validation')?.id).toBe('debt-b');
  });

  it('merges CONDITIONAL when a lineage owes search debt but no P0 or P1 remains', () => {
    // A bug class the search never exercised leaves the review unfinished even with no
    // finding still open, so reading only the findings would report PASS.
    const result = mergeReviewRegistries([
      { label: 'a', registry: { openFindings: [], searchDebt: [{ bugClass: 'error-handling', id: 'debt-1' }] } },
      { label: 'b', registry: { openFindings: [{ findingId: 'F1', severity: 'P2', status: 'active', title: 'Advisory' }] } },
    ]);

    expect(result.mergedVerdict).toBe('CONDITIONAL');
    expect(result.activeP0).toBe(0);
    expect(result.activeP1).toBe(0);
  });

  it('keeps the merged verdict when no lineage carries search debt', () => {
    // A registry written before the debt ledger existed owes nothing, so an empty union
    // must leave the verdict the findings alone decide.
    const result = mergeReviewRegistries([
      { label: 'a', registry: { openFindings: [{ findingId: 'F1', severity: 'P2', status: 'active', title: 'Advisory' }] } },
      { label: 'b', registry: { openFindings: [] } },
    ]);

    expect(result.searchDebt).toEqual([]);
    expect(result.mergedVerdict).toBe('PASS');
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

  it('excludes a finding from resolvedFindings when it is still active in another lineage', () => {
    // Lineage a resolved F1; lineage b still reports it active. The finding is not
    // closed overall, so it must not also appear in the merged resolved list.
    const data = [
      {
        label: 'a',
        registry: {
          openFindings: [],
          resolvedFindings: [{ findingId: 'F1', severity: 'P2', status: 'resolved_fixed', title: 'Shared finding' }],
        },
      },
      {
        label: 'b',
        registry: {
          openFindings: [{ findingId: 'F1', severity: 'P1', status: 'active', title: 'Shared finding' }],
          resolvedFindings: [],
        },
      },
    ];

    const result = mergeReviewRegistries(data);
    const openIds = (result.openFindings as Array<{ findingId: string }>).map((f) => f.findingId);
    const resolvedIds = (result.resolvedFindings as Array<{ findingId: string }>).map((f) => f.findingId);

    expect(openIds).toEqual(['F1']);
    expect(resolvedIds).toEqual([]);
    expect(result.mergedVerdict).toBe('CONDITIONAL');
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

  it('publishes per-lineage executor provenance alongside the verdict for a review merge', () => {
    const result = mergeReviewRegistries([
      { label: 'glm', registry: { openFindings: [] }, kind: 'cli-opencode', model: 'llmgateway/glm-5.3-flash', reasoningEffort: 'max' },
      { label: 'bare', registry: { openFindings: [] } },
    ]);

    expect(result.lineageExecutors).toEqual({
      bare: { kind: 'unknown', model: 'unknown', reasoningEffort: null },
      glm: { kind: 'cli-opencode', model: 'llmgateway/glm-5.3-flash', reasoningEffort: 'max' },
    });
  });
});

describe('buildAttributionMd — active-disposition verdict', () => {
  it('derives the per-lineage verdict from active openFindings, not a stale findingsBySeverity count', () => {
    const lineageData = [
      {
        label: 'stale-counts',
        registry: {
          openFindings: [
            { findingId: 'F1', severity: 'P0', status: 'resolved_fixed', title: 'Already fixed' },
          ],
          // Stale/divergent raw count that still reports the resolved P0 as active.
          findingsBySeverity: { P0: 1, P1: 0, P2: 0 },
        },
        stateRecords: [],
        kind: 'cli',
        model: 'test-model',
      },
    ];

    const md = buildAttributionMd(lineageData, 'review');
    expect(md).toContain('| stale-counts | cli | test-model | 0 | n/a | 0 | PASS |');
    expect(md).not.toContain('FAIL');
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

  it('defaults a missing severity to P1 (not P2) so it cannot be masked as PASS', () => {
    const stateRecords = [
      { type: 'iteration', findingDetails: [
        { id: 'NO-SEV-1', title: 'lost its severity field', disposition: 'active' },
      ] },
    ];
    const registry = reconstructReviewRegistryFromState(stateRecords as never, 'glm');
    expect(registry).not.toBeNull();
    expect(registry!.openFindings[0]).toMatchObject({ findingId: 'NO-SEV-1', severity: 'P1', status: 'active' });

    // The severity-less finding must still clear the merged verdict past PASS — a
    // silent P2 default would let a P0/P1-shaped finding pass review undetected.
    const merged = mergeReviewRegistries([{ label: 'glm', registry }]);
    expect(merged.mergedVerdict).not.toBe('PASS');
    expect(merged.mergedVerdict).toBe('CONDITIONAL');
    expect(merged.activeP2).toBe(0);
  });
});

describe('reconstructResearchRegistryFromState — leaf-only lineage fallback', () => {
  it('rebuilds a keyFindings registry from state-log findings when no registry file exists', () => {
    const stateRecords = [
      { type: 'iteration', run: 2, findingsCount: 2, findings: ['cache TTL is never refreshed', 'retry budget masks failures'], newInfoRatio: 0.8 },
    ];
    const registry = reconstructResearchRegistryFromState(stateRecords as never, 'glm');
    expect(registry).not.toBeNull();
    expect(registry!.keyFindings).toHaveLength(2);
    expect(registry!.metrics).toMatchObject({ iterationsCompleted: 1, keyFindings: 2, convergenceScore: 0.8 });
    expect(registry!.keyFindings[0]).toMatchObject({ title: 'cache TTL is never refreshed', addedAtIteration: 2, _lineages: ['glm'] });
  });

  it('returns null when the state log carries no findings, so the lineage stays skipped', () => {
    const registry = reconstructResearchRegistryFromState(
      [{ type: 'iteration', run: 1, findingsCount: 0, findings: [] }] as never,
      'glm',
    );
    expect(registry).toBeNull();
  });
});

describe('research synthesis lineage evidence', () => {
  it('keeps duplicate iteration basenames distinct and completes against all lineage findings', () => {
    const workflow = readFileSync(researchWorkflowPath, 'utf8');
    expect(workflow).toContain('{state_paths.packet_dir}/lineages/*/iterations/iteration-*.md');
    expect(workflow).toContain('Duplicate basenames from different lineages are distinct synthesis inputs');
    expect(runSynthesisInvariant(researchWorkflowPath, ['alpha finding', 'beta finding'])).toMatchObject({
      event: 'synthesis_complete',
      totalIterations: 2,
    });
  });

  it('reports incomplete synthesis when one lineage finding is missing from the registry', () => {
    expect(runSynthesisInvariant(researchWorkflowPath, ['alpha finding'], 2)).toMatchObject({
      event: 'synthesis_incomplete',
      severity: 'error',
      totalIterations: 2,
      identifiableFindingCount: 2,
      missingStructuredFindingCount: 1,
      invariantFailures: expect.arrayContaining([
        'structured_state_findings_partially_reflected_in_registry',
        'structured_state_findings_missing_from_registry',
      ]),
    });
  });

  it('fails synthesis when any lineage state row is malformed', () => {
    expect(runSynthesisInvariant(researchWorkflowPath, ['alpha finding', 'beta finding'], 2, true)).toMatchObject({
      event: 'synthesis_incomplete',
      severity: 'error',
      stateParseFailureCount: 1,
      invariantFailures: expect.arrayContaining(['state_jsonl_parse_failure']),
    });
  });

  it('keeps resource-map emission bound to the parsed command flag', () => {
    const workflow = readFileSync(researchWorkflowPath, 'utf8');
    expect(workflow).toContain('resource_map.emit: "{resource_map_emit}"');
    // The run no longer writes the flat state-log row; it opens through the gateway and reads
    // every bound value, the emission flag included, from the config file the step is handed.
    const runOpenStep = workflow.slice(
      workflow.indexOf('      step_create_state_log:\n'),
      workflow.indexOf('      step_create_strategy:\n'),
    );
    expect(runOpenStep).toContain('fs.readFileSync(configPath)');
    expect(workflow).not.toContain('resource_map.emit: true');
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
    const { execFileSync } = require('node:child_process');
    execFileSync('node', [fanoutMergeScript, '--loop-type', 'review', '--artifact-dir', baseDir], { encoding: 'utf8' });

    // Merged registry should exist at base dir
    const mergedPath = join(baseDir, 'deep-review-findings-registry.json');
    expect(existsSync(mergedPath)).toBe(true);
    const merged = JSON.parse(readFileSync(mergedPath, 'utf8'));
    expect(merged.mergedVerdict).toBe('FAIL');
    expect(merged.activeP0).toBe(1);

    // Attribution md should exist
    expect(existsSync(join(baseDir, 'fanout-attribution.md'))).toBe(true);
  });

  it('prints every verdict count a two-lineage review merge binds', async () => {
    // The workflow binds these fields from the printed payload and hands them to the
    // verdict script, which refuses a caller that omits one.
    const baseDir = makeTempDir('fanout-merge-review-counts-');
    const lineagesDir = join(baseDir, 'lineages');

    const linADir = join(lineagesDir, 'lina');
    mkdirSync(linADir, { recursive: true });
    writeFileSync(
      join(linADir, 'deep-review-findings-registry.json'),
      JSON.stringify({
        openFindings: [{ findingId: 'F1', severity: 'P2', disposition: 'active', title: 'Advisory' }],
        searchDebt: [{ bugClass: 'concurrency', id: 'debt-1' }],
      }),
      'utf8',
    );

    const linBDir = join(lineagesDir, 'linb');
    mkdirSync(linBDir, { recursive: true });
    writeFileSync(
      join(linBDir, 'deep-review-findings-registry.json'),
      JSON.stringify({ openFindings: [{ findingId: 'F2', severity: 'P1', disposition: 'active', title: 'Missing guard' }] }),
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'review',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(payload).toMatchObject({
      merged_verdict: 'CONDITIONAL',
      active_p0: 0,
      active_p1: 1,
      active_p2: 1,
      search_debt: 1,
      failed_required_gate_ids: [],
    });
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

    const { execFileSync } = require('node:child_process');
    execFileSync('node', [fanoutMergeScript, '--loop-type', 'research', '--artifact-dir', baseDir, '--enable-near-duplicate-dedup'], { encoding: 'utf8' });

    const merged = JSON.parse(readFileSync(join(baseDir, 'deep-research-findings-registry.json'), 'utf8'));
    expect(merged.keyFindings).toHaveLength(1);
    expect(merged.metrics.keyFindings).toBe(1);
  });

  it('reconstructs a missing research registry from deep-research-state.jsonl during merge', async () => {
    const baseDir = makeTempDir('fanout-merge-research-reconstruct-');
    const lineagesDir = join(baseDir, 'lineages');
    const linADir = join(lineagesDir, 'glm');
    mkdirSync(linADir, { recursive: true });
    writeFileSync(
      join(linADir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 35, findingsCount: 1, findings: ['synthesis event can lie about missing artifacts'], newInfoRatio: 0.6 })}\n`,
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode).toBe(0);
    const merged = JSON.parse(readFileSync(join(baseDir, 'deep-research-findings-registry.json'), 'utf8'));
    expect(merged.keyFindings).toHaveLength(1);
    expect(merged.keyFindings[0]).toMatchObject({
      title: 'synthesis event can lie about missing artifacts',
      _lineages: ['glm'],
    });
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(payload).toMatchObject({ merged_lineages: 1, skipped_no_registry: 0, key_findings: 1 });
  });

  it('reconstructs an existing-empty canonical registry and publishes byte-identical registry names', async () => {
    const baseDir = makeTempDir('fanout-merge-research-empty-registry-');
    const lineageDir = join(baseDir, 'lineages', 'sol');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'findings-registry.json'),
      `${JSON.stringify({ keyFindings: [], openQuestions: [{ id: 'Q1', text: 'Preserved question' }], metrics: { iterationsCompleted: 0 } })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 5, findingsCount: 1, findings: ['lineage state survives empty registry initialization'], newInfoRatio: 0.4 })}\n`,
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode).toBe(0);
    const canonicalPath = join(baseDir, 'findings-registry.json');
    const compatibilityPath = join(baseDir, 'deep-research-findings-registry.json');
    expect(readFileSync(canonicalPath)).toEqual(readFileSync(compatibilityPath));
    const merged = JSON.parse(readFileSync(canonicalPath, 'utf8')) as Record<string, unknown>;
    expect(merged.keyFindings as unknown[]).toHaveLength(1);
    expect(merged.openQuestions).toEqual([expect.objectContaining({ id: 'Q1' })]);
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(payload).toMatchObject({
      merged_registry_path: canonicalPath,
      compatibility_registry_path: compatibilityPath,
      key_findings: 1,
    });
  });

  it('reconstructs count-only state from same-named lineage iteration files without collapsing either input', async () => {
    const baseDir = makeTempDir('fanout-merge-research-count-only-');
    for (const [label, finding] of [['alpha', 'alpha lineage finding'], ['beta', 'beta lineage finding']]) {
      const lineageDir = join(baseDir, 'lineages', label);
      mkdirSync(join(lineageDir, 'iterations'), { recursive: true });
      writeFileSync(
        join(lineageDir, 'deep-research-state.jsonl'),
        `${JSON.stringify({ type: 'iteration', run: 1, findingsCount: 1, newInfoRatio: 0.5 })}\n`,
        'utf8',
      );
      writeFileSync(
        join(lineageDir, 'iterations', 'iteration-001.md'),
        `# Iteration 1\n\n## Findings\n\n1. ${finding}\n\n## Next Focus\n\nDone.\n`,
        'utf8',
      );
    }

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const canonicalPath = join(baseDir, 'findings-registry.json');
    const compatibilityPath = join(baseDir, 'deep-research-findings-registry.json');
    expect(readFileSync(canonicalPath)).toEqual(readFileSync(compatibilityPath));
    const merged = JSON.parse(readFileSync(canonicalPath, 'utf8')) as {
      keyFindings: Array<{ title: string; _iteration_source: string }>;
      metrics: { sourceFindings: number; reconstructionGaps: number };
    };
    expect(merged.keyFindings.map((finding) => finding.title)).toEqual([
      'alpha lineage finding',
      'beta lineage finding',
    ]);
    expect(merged.keyFindings.map((finding) => finding._iteration_source)).toEqual([
      'lineages/alpha/iterations/iteration-001.md',
      'lineages/beta/iterations/iteration-001.md',
    ]);
    expect(merged.metrics).toMatchObject({ sourceFindings: 2, reconstructionGaps: 0 });
  });

  it('treats numbered finding subheadings as findings instead of nested numbered detail', async () => {
    const baseDir = makeTempDir('fanout-merge-research-heading-findings-');
    const lineageDir = join(baseDir, 'lineages', 'alpha');
    mkdirSync(join(lineageDir, 'iterations'), { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 5, findingsCount: 2, newInfoRatio: 0.5 })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'iterations', 'iteration-005.md'),
      [
        '# Iteration 5',
        '',
        '## Findings',
        '',
        '### 1. Topology decision',
        '',
        '1. Nested migration step',
        '2. Another nested migration step',
        '',
        '### 2. Compatibility boundary',
        '',
        '1. Nested verification step',
        '',
        '## Questions Answered',
        '',
      ].join('\n'),
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      keyFindings: Array<{ title: string }>;
    };
    expect(merged.keyFindings.map((finding) => finding.title)).toEqual([
      'Compatibility boundary',
      'Topology decision',
    ]);
  });

  it('isolates a single lineage reconstruction failure instead of aborting the whole merge', async () => {
    const baseDir = makeTempDir('fanout-merge-research-isolated-failure-');
    const goodDir = join(baseDir, 'lineages', 'good');
    mkdirSync(goodDir, { recursive: true });
    writeFileSync(
      join(goodDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, findingsCount: 1, findings: ['good lineage finding'] })}\n`,
      'utf8',
    );

    // findingsCount contradicts the structured evidence — reconstruction throws for
    // this lineage only.
    const badDir = join(baseDir, 'lineages', 'bad');
    mkdirSync(badDir, { recursive: true });
    writeFileSync(
      join(badDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, findingsCount: 5, findings: ['bad lineage finding'] })}\n`,
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      keyFindings: Array<{ title: string }>;
    };
    expect(merged.keyFindings.map((finding) => finding.title)).toEqual(['good lineage finding']);

    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(payload.skipped_no_registry).toBe(1);
    expect(payload.reconstruction_warnings).toEqual([
      expect.objectContaining({ lineage: 'bad', type: 'lineage_reconstruction_failed' }),
    ]);
  });

  it('keeps a short registry and counts the gap when no iteration matches', async () => {
    const baseDir = makeTempDir('fanout-merge-research-no-match-');
    const lineageDir = join(baseDir, 'lineages', 'grok');
    mkdirSync(join(lineageDir, 'deltas'), { recursive: true });
    writeFileSync(
      join(lineageDir, 'findings-registry.json'),
      `${JSON.stringify({
        keyFindings: [
          'No new classifier phase ships. D3 already covers the 0.8B server.',
          'Deem transport is its own client (route c), later, and does not threshold.',
          'Do not threshold raw temperature 1.0. Health does not show the calibration file. deem-ctl has no pin.',
        ],
      })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      [
        JSON.stringify({ type: 'iteration', iteration: 1, findingsCount: 5, newInfoRatio: 0.9 }),
        JSON.stringify({ type: 'iteration', iteration: 2, findingsCount: 6, newInfoRatio: 0.95 }),
        JSON.stringify({ type: 'iteration', iteration: 3, findingsCount: 4, newInfoRatio: 0.85 }),
      ].join('\n') + '\n',
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deltas', 'iter-001.jsonl'),
      [
        '{"type":"finding","id":"N-grok-01-1","label":"Do not serve deem-9b-v1; no shared published judgment with the served 0.8B","verdict":"drop","question":"A"}',
        '{"type":"finding","id":"N-grok-01-2","label":"Do not threshold raw temperature-1.0 probabilities from deem-0.8-v1","verdict":"later","question":"A"}',
      ].join('\n') + '\n',
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deltas', 'iter-002.jsonl'),
      [
        '{"type":"finding","id":"N-grok-02-1","label":"Translator in Python jev-cli for criteria to options/levels and value/level back to noul/score","verdict":"next","question":"A"}',
        '{"type":"finding","id":"N-grok-02-2","label":"Do not treat jevctl TYPESAFE_BASE_URL as cli-deem","verdict":"drop","question":"G"}',
      ].join('\n') + '\n',
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deltas', 'iter-003.jsonl'),
      [
        '{"type":"finding","id":"N-grok-03-1","label":"Do not use Deem MCP tools for context reduction","verdict":"drop","question":"C"}',
        '{"type":"finding","id":"N-grok-03-2","label":"Compaction-boundary two-noul keep/drop that throws on a missing answer","verdict":"later","question":"C"}',
      ].join('\n') + '\n',
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(payload).not.toHaveProperty('reconstruction_warnings');
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      metrics: { sourceFindings: number; reconstructionGaps: number };
    };
    expect(merged.metrics).toMatchObject({ sourceFindings: 3, reconstructionGaps: 12 });
  });

  it('counts the gap on a kept registry when reconstruction throws', async () => {
    const baseDir = makeTempDir('fanout-merge-research-throw-gap-');
    const lineageDir = join(baseDir, 'lineages', 'alpha');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'findings-registry.json'),
      `${JSON.stringify({
        keyFindings: [
          { id: 'r1', title: 'registry finding one' },
          { id: 'r2', title: 'registry finding two' },
        ],
      })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      [
        JSON.stringify({ type: 'iteration', run: 1, iteration: 1, findingsCount: 5, findings: ['only structured finding'] }),
        JSON.stringify({ type: 'iteration', run: 2, iteration: 2, findingsCount: 3 }),
      ].join('\n') + '\n',
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(payload.reconstruction_warnings).toEqual([
      expect.objectContaining({ lineage: 'alpha', type: 'lineage_reconstruction_failed' }),
    ]);
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      keyFindings: Array<{ title: string }>;
      metrics: { reconstructionGaps: number };
    };
    expect(merged.keyFindings.map((f) => f.title).sort()).toEqual([
      'registry finding one',
      'registry finding two',
    ]);
    expect(merged.metrics.reconstructionGaps).toBe(1);
  });

  it('rebuilds a short registry from delta finding records', async () => {
    const baseDir = makeTempDir('fanout-merge-research-short-registry-');
    const lineageDir = join(baseDir, 'lineages', 'deepseek');
    mkdirSync(join(lineageDir, 'deltas'), { recursive: true });
    writeFileSync(
      join(lineageDir, 'findings-registry.json'),
      `${JSON.stringify({
        keyFindings: [
          { id: 'f-budget-2200', title: 'Advisor child effective budget is 2200 ms then SIGKILL to {}' },
          { id: 'f-precompact-1800', title: 'PreCompact merge warns above 1500 ms against an 1800 ms cap' },
          { id: 'f-stop-corroboration', title: 'Stop path already corroborates the self-report against graph novelty' },
          { id: 'f-h14-binding', title: 'Blinded adjudication ships a deep-review severity adapter' },
          { id: 'f-verifier-switch', title: 'OpenCode goal plugin already selects heuristic or llm verifiers by env' },
          { id: 'f-version-probe', title: 'Exact jev 0.6.2 version probe closes the package collision' },
          { id: 'f-no-cache-risk', title: 'No surviving idea touches a provider-cached prompt' },
          { id: 'f-census-first', title: "The routing arm's first output is a no-key census" },
        ],
      })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      [
        JSON.stringify({ type: 'iteration', run: 1, iteration: 1, findingsCount: 6, newInfoRatio: 0.85 }),
        JSON.stringify({ type: 'iteration', run: 6, iteration: 6, findingsCount: 5, newInfoRatio: 0.68 }),
      ].join('\n') + '\n',
      'utf8',
    );
    const iter001FindingLines = [
      '{"type":"finding","id":"f-iter001-grader-shape","label":"D4 grader contract is {score, confidence, parse_status, dim_id, rationale, evidence}; only grader.score is consumed","iteration":1,"source":".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:198-226"}',
      '{"type":"finding","id":"f-iter001-parse-status","label":"Harness parse_status vocabulary is ok/dim_mismatch/fallback_*/failed; failures already return score 0 with parse_status failed","iteration":1,"source":".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:222-284"}',
      '{"type":"finding","id":"f-iter001-refusal-pattern","label":"run-benchmark refuses an unavailable grader at startup with stderr plus exit 2 (family-collision precedent)","iteration":1,"source":".skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:610-623"}',
      '{"type":"finding","id":"f-iter001-exit-map","label":"Exit-code mapping for a Jev grader: 0 judgment, 3 operator step, 4 retryable never a judgment, 2 usage no quota, 1 inspect","iteration":1,"source":".skilled/skills/cli-classifier/cli-usage/SKILL.md:167-174"}',
      '{"type":"finding","id":"f-iter001-sentinel-budget","label":"Completion sentinel internal check timeout is 1200 ms; live Jev call cannot be shown to fit the live path","iteration":1,"source":".skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:90-94"}',
      '{"type":"finding","id":"f-iter001-score-normalization","label":"Jev score returns zero-based position possibly fractional; D4 needs caller-owned normalization to [0,1]","iteration":1,"source":".skilled/skills/cli-classifier/cli-usage/SKILL.md:162-164"}',
    ];
    const iter006FindingLines = [
      '{"type":"finding","id":"f-iter006-front-door","label":"Compiled-routing front door stdout carries a single legal JSON shape and fails to a legacy sentinel; synchronous on every dispatch","iteration":6,"source":".skilled/bin/compiled-route.cjs:25-47"}',
      '{"type":"finding","id":"f-iter006-clarify-set","label":"Clarify decision is formed by modes within ambiguityDelta; contract requires two to four alternatives","iteration":6,"source":".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:199-218"}',
      '{"type":"finding","id":"f-iter006-thirteen-rows","label":"Only 13 clarify/defer gold rows across all hubs; too few to prove a Jev win","iteration":6,"source":"context/measurement-digest.md H7 (digest claim)"}',
      '{"type":"finding","id":"f-iter006-offline-permissive","label":"Offline CLI seams (alignment below 50, level flags, post-save review) permit an advisory line; they lack gold and frequency, not permission","iteration":6,"source":".skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:503-521"}',
      '{"type":"finding","id":"f-iter006-shortlist","label":"Wave-2 shortlist by wiring cost: advisor arm, stop replay, severity replay, goal mode, alignment suggestion, level flags","iteration":6,"source":"synthesis of iterations 2-6"}',
    ];
    writeFileSync(join(lineageDir, 'deltas', 'iter-001.jsonl'), `${iter001FindingLines.join('\n')}\n`, 'utf8');
    writeFileSync(join(lineageDir, 'deltas', 'iter-006.jsonl'), `${iter006FindingLines.join('\n')}\n`, 'utf8');

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const payload = JSON.parse(result.stdout.split('\n').filter(Boolean).at(-1) ?? '{}') as Record<string, unknown>;
    expect(payload).not.toHaveProperty('reconstruction_warnings');
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      keyFindings: Array<{ title: string }>;
      metrics: { sourceFindings: number; reconstructionGaps: number };
    };
    const copiedLabels = [...iter001FindingLines, ...iter006FindingLines].map(
      (line) => (JSON.parse(line) as { label: string }).label,
    );
    expect(merged.keyFindings.map((finding) => finding.title).sort()).toEqual([...copiedLabels].sort());
    expect(merged.metrics).toMatchObject({ sourceFindings: 11, reconstructionGaps: 0 });
  });

  it('fails closed on a symlinked delta file', async () => {
    const baseDir = makeTempDir('fanout-merge-research-linked-delta-');
    const outsideDir = makeTempDir('fanout-merge-research-delta-target-');
    const lineageDir = join(baseDir, 'lineages', 'alpha');
    mkdirSync(join(lineageDir, 'deltas'), { recursive: true });
    writeFileSync(
      join(lineageDir, 'findings-registry.json'),
      `${JSON.stringify({ keyFindings: [{ id: 'r1', title: 'registry finding' }] })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, iteration: 1, findingsCount: 2 })}\n`,
      'utf8',
    );
    const targetPath = join(outsideDir, 'iter-001.jsonl');
    writeFileSync(
      targetPath,
      '{"type":"finding","label":"outside finding","iteration":1}\n{"type":"finding","label":"second outside finding","iteration":1}\n',
      'utf8',
    );
    symlinkSync(targetPath, join(lineageDir, 'deltas', 'iter-001.jsonl'));

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.stdout).toContain('delta source must be a real file');
    expect(existsSync(join(baseDir, 'findings-registry.json'))).toBe(false);
  });

  it('fails closed on malformed lineage state instead of merging the valid prefix', async () => {
    const baseDir = makeTempDir('fanout-merge-research-malformed-');
    const lineageDir = join(baseDir, 'lineages', 'alpha');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, findings: ['valid prefix'] })}\nnot-json\n`,
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.stdout).toContain('invalid JSONL at line 2');
    expect(existsSync(join(baseDir, 'findings-registry.json'))).toBe(false);
  });

  it('rejects context artifacts instead of reading research-shaped state', async () => {
    const baseDir = makeTempDir('fanout-merge-context-');
    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'context',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.stdout).toContain('INPUT_VALIDATION');
  });

  it('rejects symlinked lineage directories before reading external evidence', async () => {
    const baseDir = makeTempDir('fanout-merge-research-linked-lineage-');
    const outsideDir = makeTempDir('fanout-merge-research-outside-lineage-');
    mkdirSync(join(baseDir, 'lineages'), { recursive: true });
    writeFileSync(
      join(outsideDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, findings: ['external finding'] })}\n`,
      'utf8',
    );
    symlinkSync(outsideDir, join(baseDir, 'lineages', 'external'));

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.stdout).toContain('lineage directory entries must not be symbolic links');
  });

  it('rejects a symlinked merged-registry output without changing its target', async () => {
    const baseDir = makeTempDir('fanout-merge-research-linked-output-');
    const outsideDir = makeTempDir('fanout-merge-research-output-target-');
    const lineageDir = join(baseDir, 'lineages', 'alpha');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, findings: ['contained finding'] })}\n`,
      'utf8',
    );
    const targetPath = join(outsideDir, 'target.json');
    writeFileSync(targetPath, 'outside-bytes\n', 'utf8');
    symlinkSync(targetPath, join(baseDir, 'findings-registry.json'));

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode).toBe(3);
    expect(result.stdout).toContain('merged registry must be a real file');
    expect(readFileSync(targetPath, 'utf8')).toBe('outside-bytes\n');
  });

  it('rebuilds a short registry from delta findings whose text sits under `claim` and counts them all', async () => {
    const baseDir = makeTempDir('fanout-merge-research-claim-');
    const lineageDir = join(baseDir, 'lineages', 'deepseek');
    mkdirSync(join(lineageDir, 'deltas'), { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, iteration: 1, findingsCount: 3, newInfoRatio: 0.9 })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deltas', 'iter-001.jsonl'),
      [
        '{"type":"finding","id":"c1","claim":"Advisor budget widens the completion sentinel","iteration":1}',
        '{"type":"finding","id":"c2","claim":"Severity rollup must surface unranked tiers","iteration":1}',
        '{"type":"finding","id":"c3","summary":"Stop path corroborates a self-report against graph novelty","iteration":1}',
      ].join('\n') + '\n',
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      keyFindings: Array<{ title: string }>;
      metrics: { sourceFindings: number; reconstructionGaps: number };
    };
    expect(merged.keyFindings.map((finding) => finding.title).sort()).toEqual([
      'Advisor budget widens the completion sentinel',
      'Severity rollup must surface unranked tiers',
      'Stop path corroborates a self-report against graph novelty',
    ].sort());
    expect(merged.metrics).toMatchObject({ sourceFindings: 3, reconstructionGaps: 0 });
  });

  it('warns with the file and row for a delta finding row it cannot read instead of dropping it in silence', async () => {
    const baseDir = makeTempDir('fanout-merge-research-unreadable-');
    const lineageDir = join(baseDir, 'lineages', 'deepseek');
    mkdirSync(join(lineageDir, 'deltas'), { recursive: true });
    writeFileSync(
      join(lineageDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'iteration', run: 1, iteration: 1, findingsCount: 2, newInfoRatio: 0.9 })}\n`,
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'deltas', 'iter-001.jsonl'),
      [
        '{"type":"finding","id":"ok","claim":"a readable finding","iteration":1}',
        '{"type":"finding","id":"no-text","verdict":"drop","iteration":1}',
      ].join('\n') + '\n',
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    expect(result.stderr).toContain('delta_finding_unreadable');
    expect(result.stderr).toContain('lineages/deepseek/deltas/iter-001.jsonl');
    expect(result.stderr).toContain('"row":2');
  });
});

// ─── lineage executor provenance ─────────────────────────────────────────────

describe('fanout-merge.cjs — lineage executor provenance', () => {
  it('reads kind and model from invocation-metadata.json for attribution and lineageExecutors', async () => {
    const baseDir = makeTempDir('fanout-merge-provenance-');
    const lineageDir = join(baseDir, 'lineages', 'lin-codex');
    mkdirSync(lineageDir, { recursive: true });
    writeFileSync(
      join(lineageDir, 'findings-registry.json'),
      JSON.stringify({
        keyFindings: [{ id: 'F1', title: 'Provenance finding' }],
        openQuestions: [],
        ruledOutDirections: [],
      }),
      'utf8',
    );
    writeFileSync(
      join(lineageDir, 'invocation-metadata.json'),
      JSON.stringify({
        effectiveConfig: { kind: 'cli-codex', model: 'gpt-6-luna', reasoningEffort: 'max' },
        invocationFingerprint: 'inv:test',
      }),
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      lineageExecutors: Record<string, { kind: string; model: string; reasoningEffort: string | null }>;
    };
    expect(merged.lineageExecutors).toEqual({
      'lin-codex': { kind: 'cli-codex', model: 'gpt-6-luna', reasoningEffort: 'max' },
    });

    const attribution = readFileSync(join(baseDir, 'fanout-attribution.md'), 'utf8');
    expect(attribution).toContain('| lin-codex | cli-codex | gpt-6-luna |');
  });

  it('degrades to the executor event and then to unknown when invocation-metadata.json is missing', async () => {
    const baseDir = makeTempDir('fanout-merge-provenance-fallback-');
    const eventDir = join(baseDir, 'lineages', 'lin-event');
    mkdirSync(eventDir, { recursive: true });
    writeFileSync(
      join(eventDir, 'findings-registry.json'),
      JSON.stringify({ keyFindings: [{ id: 'F1', title: 'Event finding' }], openQuestions: [], ruledOutDirections: [] }),
      'utf8',
    );
    writeFileSync(
      join(eventDir, 'deep-research-state.jsonl'),
      `${JSON.stringify({ type: 'event', event: 'executor_start', kind: 'cli-claude', model: 'claude-sonnet-5' })}\n`,
      'utf8',
    );

    const bareDir = join(baseDir, 'lineages', 'lin-bare');
    mkdirSync(bareDir, { recursive: true });
    writeFileSync(
      join(bareDir, 'findings-registry.json'),
      JSON.stringify({ keyFindings: [{ id: 'F2', title: 'Bare finding' }], openQuestions: [], ruledOutDirections: [] }),
      'utf8',
    );

    const result = await spawnCjs(fanoutMergeScript, [
      '--loop-type', 'research',
      '--artifact-dir', baseDir,
    ]);

    expect(result.exitCode, result.stderr).toBe(0);
    const merged = JSON.parse(readFileSync(join(baseDir, 'findings-registry.json'), 'utf8')) as {
      lineageExecutors: Record<string, { kind: string; model: string; reasoningEffort: string | null }>;
    };
    expect(merged.lineageExecutors).toEqual({
      'lin-bare': { kind: 'unknown', model: 'unknown', reasoningEffort: null },
      'lin-event': { kind: 'cli-claude', model: 'claude-sonnet-5', reasoningEffort: null },
    });

    const attribution = readFileSync(join(baseDir, 'fanout-attribution.md'), 'utf8');
    expect(attribution).toContain('| lin-event | cli-claude | claude-sonnet-5 |');
    expect(attribution).toContain('| lin-bare | unknown | unknown |');
  });
});

describe('mergeReviewRegistries — coverage surfaces', () => {
  const SURFACES = ['dimensionCoverage', 'traceability', 'searchCoverage', 'candidateCoverage', 'divergenceByLineage', 'ruledOutCandidates'];

  function coverageRegistry(overrides: Record<string, unknown>): Record<string, unknown> {
    return { openFindings: [], resolvedFindings: [], searchDebt: [], ...overrides };
  }

  const lineageA: LineageDataFixture = {
    label: 'lineage-a',
    registry: coverageRegistry({
      dimensionCoverage: { correctness: true, security: false, traceability: false, maintainability: false },
      traceability: {
        results: [
          { protocolId: 'spec_code', status: 'pass', applicable: true, gateClass: 'hard' },
          { protocolId: 'checklist_evidence', status: 'pass', applicable: true, gateClass: 'hard' },
        ],
        unfinishedCoreProtocols: ['spec_code'],
      },
      searchCoverage: { requiredBugClasses: ['injection', 'race'], covered: ['injection'], ruledOut: [], deferred: [], blocked: [], graphCoverageMode: 'graph' },
      candidateCoverage: {
        covered: ['injection'], ruledOut: [], deferred: [], blocked: [],
        byBugClass: { injection: { covered: true, ruledOut: false, deferred: false, blocked: false, iterations: [1] } },
      },
      divergence: { started: 1, completed: 1, failed: 0, overrides: [], saturatedDirections: ['auth'], remainingFrontier: [], currentFocus: 'pivot-a' },
      ruledOutCandidates: [
        { id: 'rc-1', iteration: 1, bugClass: 'race' },
        { id: 'rc-1', iteration: 2, bugClass: 'race' },
      ],
    }),
  };

  const lineageB: LineageDataFixture = {
    label: 'lineage-b',
    registry: coverageRegistry({
      dimensionCoverage: { correctness: false, security: true, traceability: false, maintainability: false },
      traceability: {
        results: [
          { protocolId: 'spec_code', status: 'fail', applicable: true, gateClass: 'hard' },
          { protocolId: 'checklist_evidence', status: 'pending', applicable: true, gateClass: 'hard' },
        ],
        unfinishedCoreProtocols: ['checklist_evidence'],
      },
      searchCoverage: { requiredBugClasses: ['race'], covered: ['race'], ruledOut: [], deferred: [], blocked: [], graphCoverageMode: 'fallback' },
      candidateCoverage: {
        covered: [], ruledOut: ['injection'], deferred: [], blocked: [],
        byBugClass: { injection: { covered: false, ruledOut: true, deferred: false, blocked: false, iterations: [2] } },
      },
      ruledOutCandidates: [{ id: 'rc-1', iteration: 1, bugClass: 'race' }],
    }),
  };

  function surfaces(result: Record<string, unknown>): string {
    return JSON.stringify(SURFACES.map((key) => [key, result[key]]));
  }

  it('carries all six coverage surfaces on the merged registry', () => {
    const result = mergeReviewRegistries([lineageA, lineageB]);
    for (const key of SURFACES) expect(result).toHaveProperty(key);
  });

  it('merges dimension coverage as a union with sorted keys', () => {
    const result = mergeReviewRegistries([lineageA, lineageB]);
    expect(result.dimensionCoverage).toEqual({ correctness: true, maintainability: false, security: true, traceability: false });
    expect(Object.keys(result.dimensionCoverage as Record<string, boolean>)).toEqual(['correctness', 'maintainability', 'security', 'traceability']);
  });

  it('merges traceability by strongest restriction and recomputes the summary', () => {
    const traceability = mergeReviewRegistries([lineageA, lineageB]).traceability as {
      results: Array<{ protocolId: string; status: string }>;
      summary: Record<string, number>;
      unfinishedCoreProtocols: string[];
    };
    expect(traceability.results.map((result) => [result.protocolId, result.status])).toEqual([
      ['checklist_evidence', 'pass'],
      ['spec_code', 'fail'],
    ]);
    expect(traceability.summary).toEqual({
      required: 2, executed: 2, pass: 1, partial: 0, fail: 1, blocked: 0, notApplicable: 0, gatingFailures: 1,
    });
    expect(traceability.unfinishedCoreProtocols).toEqual(['checklist_evidence', 'spec_code']);
  });

  it('merges search coverage lists and drops a graph coverage mode the lineages disagree on', () => {
    const disagree = mergeReviewRegistries([lineageA, lineageB]).searchCoverage as Record<string, unknown>;
    expect(disagree.requiredBugClasses).toEqual(['injection', 'race']);
    expect(disagree.covered).toEqual(['injection', 'race']);
    expect(disagree.graphCoverageMode).toBeNull();
    const agree = mergeReviewRegistries([lineageA, { ...lineageA, label: 'lineage-c' }]).searchCoverage as Record<string, unknown>;
    expect(agree.graphCoverageMode).toBe('graph');
  });

  it('merges candidate coverage buckets and ORs a shared bug class with its lineages', () => {
    const candidate = mergeReviewRegistries([lineageA, lineageB]).candidateCoverage as Record<string, unknown>;
    expect(candidate.covered).toEqual(['injection']);
    expect(candidate.ruledOut).toEqual(['injection']);
    expect(candidate.byBugClass).toEqual({
      injection: { covered: true, ruledOut: true, deferred: false, blocked: false, iterations: [1, 2], lineages: ['lineage-a', 'lineage-b'] },
    });
  });

  it('keeps pivot state per lineage under divergenceByLineage', () => {
    const result = mergeReviewRegistries([lineageA, lineageB]);
    expect(result.divergenceByLineage).toEqual({ 'lineage-a': (lineageA.registry as Record<string, unknown>).divergence });
  });

  it('dedupes ruled-out candidates on lineage plus id and sorts them', () => {
    const result = mergeReviewRegistries([lineageB, lineageA]);
    expect(result.ruledOutCandidates).toEqual([
      { id: 'rc-1', iteration: 1, bugClass: 'race', lineage: 'lineage-a' },
      { id: 'rc-1', iteration: 1, bugClass: 'race', lineage: 'lineage-b' },
    ]);
  });

  it('produces byte-identical surfaces when the lineage order is swapped', () => {
    expect(surfaces(mergeReviewRegistries([lineageB, lineageA]))).toBe(surfaces(mergeReviewRegistries([lineageA, lineageB])));
  });

  it('merges a lineage that has none of the coverage fields without error', () => {
    const bare: LineageDataFixture = { label: 'lineage-bare', registry: coverageRegistry({}) };
    const withBare = mergeReviewRegistries([lineageA, bare]);
    const alone = mergeReviewRegistries([lineageA]);
    expect(surfaces(withBare)).toBe(surfaces(alone));
  });
});

describe('research frontier merge', () => {
  const frontierNode = (nodeId: string, status: string) => ({ nodeId, status });

  const registryWithFrontier = (nodes: Array<{ nodeId: string; status: string }>) => ({
    keyFindings: [],
    openQuestions: [],
    resolvedQuestions: [],
    ruledOutDirections: [],
    metrics: {},
    frontier: { nodes, stats: {} },
  });

  const lineageA: LineageDataFixture = {
    label: 'a',
    registry: registryWithFrontier([frontierNode('F-1-001', 'open'), frontierNode('F-2-003', 'exhausted')]),
  };
  const lineageB: LineageDataFixture = {
    label: 'b',
    registry: registryWithFrontier([frontierNode('F-1-002', 'answered'), frontierNode('F-2-003', 'open')]),
  };

  const withoutFrontier = ({ label, registry }: LineageDataFixture): LineageDataFixture => {
    const { frontier: _frontier, ...rest } = registry as Record<string, unknown>;
    return { label, registry: rest };
  };

  it('merges each lineage frontier with its label', () => {
    const frontier = mergeResearchFrontier([lineageA, lineageB]);
    expect(frontier.nodes).toHaveLength(4);
    expect(frontier.nodes.filter((node) => node.lineageNodeId === 'F-2-003').map((node) => node.nodeId)).toEqual(['a:F-2-003', 'b:F-2-003']);
    expect(frontier.stats.total).toBe(4);
    expect(frontier.stats.open).toBe(2);
    expect(frontier.stats.exhausted).toBe(1);
    expect(frontier.stats.answered).toBe(1);
  });

  it('gives every merged research node a unique id when two lineages share a local id', () => {
    const frontier = mergeResearchFrontier([lineageA, lineageB]);
    const ids = frontier.nodes.map((node) => node.nodeId);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('adds no frontier key when no lineage has one', () => {
    const merged = mergeResearchRegistries([withoutFrontier(lineageA), withoutFrontier(lineageB)]);
    expect(Object.prototype.hasOwnProperty.call(merged, 'frontier')).toBe(false);
  });

  it('passes the guard when every partitioned node is reported', () => {
    const merged = mergeResearchRegistries([lineageA, lineageB], {
      frontierPartition: { a: ['F-1-001'], b: ['F-1-002'] },
    });
    const frontier = merged.frontier as { partitionGuard?: { passed: boolean; missing: string[] } };
    expect(frontier.partitionGuard).toEqual({ passed: true, missing: [] });
  });

  it('fails the guard when a partition was recorded but no lineage reports a frontier', () => {
    const merged = mergeResearchRegistries([withoutFrontier(lineageA), withoutFrontier(lineageB)], {
      frontierPartition: { a: ['F-1-001'], b: ['F-1-002'] },
    });
    const frontier = merged.frontier as { nodes: unknown[]; partitionGuard?: { passed: boolean; missing: string[] } };
    expect(frontier.nodes).toEqual([]);
    expect(frontier.partitionGuard).toEqual({ passed: false, missing: ['F-1-001', 'F-1-002'] });
  });

  it('adds no frontier key for an empty partition when no lineage has a frontier', () => {
    const merged = mergeResearchRegistries([withoutFrontier(lineageA), withoutFrontier(lineageB)], {
      frontierPartition: { a: [], b: [] },
    });
    expect(Object.prototype.hasOwnProperty.call(merged, 'frontier')).toBe(false);
  });

  it('fails the guard when a partitioned node is missing from every lineage', () => {
    const merged = mergeResearchRegistries([lineageA, lineageB], {
      frontierPartition: { a: ['F-1-001', 'F-1-004'], b: ['F-1-002'] },
    });
    const frontier = merged.frontier as { partitionGuard?: { passed: boolean; missing: string[] } };
    expect(frontier.partitionGuard).toEqual({ passed: false, missing: ['F-1-004'] });
  });
});

describe('review frontier merge', () => {
  const frontierNode = (nodeId: string, status: string) => ({ nodeId, status });

  const registryWithFrontier = (nodes: Array<{ nodeId: string; status: string }>) => ({
    openFindings: [],
    resolvedFindings: [],
    frontier: { nodes, stats: {} },
  });

  const lineageA: LineageDataFixture = {
    label: 'a',
    registry: registryWithFrontier([frontierNode('F-1-001', 'open'), frontierNode('F-2-003', 'exhausted')]),
  };
  const lineageB: LineageDataFixture = {
    label: 'b',
    registry: registryWithFrontier([frontierNode('F-1-002', 'answered'), frontierNode('F-2-003', 'open')]),
  };

  const withoutFrontier = ({ label, registry }: LineageDataFixture): LineageDataFixture => {
    const { frontier: _frontier, ...rest } = registry as Record<string, unknown>;
    return { label, registry: rest };
  };

  it('merges each lineage frontier with its label and stats', () => {
    const merged = mergeReviewRegistries([lineageA, lineageB]);
    const frontier = merged.frontier as {
      nodes: Array<{ nodeId: string; lineageNodeId: string; lineage: string }>;
      stats: Record<string, number>;
    };
    expect(frontier.nodes).toHaveLength(4);
    expect(frontier.nodes.filter((node) => node.lineageNodeId === 'F-2-003').map((node) => node.nodeId)).toEqual(['a:F-2-003', 'b:F-2-003']);
    expect(frontier.stats).toMatchObject({ total: 4, open: 2, exhausted: 1, answered: 1 });
  });

  it('passes the guard when every partitioned node is reported', () => {
    const merged = mergeReviewRegistries([lineageA, lineageB], {
      frontierPartition: { a: ['F-1-001'], b: ['F-1-002'] },
    });
    const frontier = merged.frontier as { partitionGuard?: { passed: boolean; missing: string[] } };
    expect(frontier.partitionGuard).toEqual({ passed: true, missing: [] });
  });

  it('fails the guard when a partitioned node is missing from every lineage', () => {
    const merged = mergeReviewRegistries([lineageA, lineageB], {
      frontierPartition: { a: ['F-1-001', 'F-1-004'], b: ['F-1-002'] },
    });
    const frontier = merged.frontier as { partitionGuard?: { passed: boolean; missing: string[] } };
    expect(frontier.partitionGuard).toEqual({ passed: false, missing: ['F-1-004'] });
  });

  it('gives every merged node a unique id when lineages number their children alike', () => {
    // Each lineage numbers the nodes it admits from its own store, so three lineages that
    // each hold one dealt depth-1 node all name their first child F-2-002.
    const lineage = (label: string, parentId: string) => ({
      label,
      registry: registryWithFrontier([
        { nodeId: parentId, parentId: 'root', status: 'answered' } as { nodeId: string; status: string },
        { nodeId: 'F-2-002', parentId, status: 'pruned' } as { nodeId: string; status: string },
      ]),
    });
    const merged = mergeReviewRegistries([lineage('pi-2', 'F-1-076'), lineage('pi-3', 'F-1-077'), lineage('pi-4', 'F-1-078')], {
      frontierPartition: { 'pi-2': ['F-1-076'], 'pi-3': ['F-1-077'], 'pi-4': ['F-1-078'] },
    });
    const frontier = merged.frontier as {
      nodes: Array<{ nodeId: string; lineageNodeId: string; parentId: string; lineage: string }>;
      partitionGuard?: { passed: boolean; missing: string[] };
    };
    const ids = frontier.nodes.map((node) => node.nodeId);

    expect(new Set(ids).size).toBe(ids.length);
    const child = frontier.nodes.find((node) => node.lineage === 'pi-3' && node.lineageNodeId === 'F-2-002');
    expect(child).toBeDefined();
    expect(ids).toContain(child?.parentId);
    expect(frontier.partitionGuard).toEqual({ passed: true, missing: [] });
  });

  it('fails the guard when a partition was recorded but no review lineage reports a frontier', () => {
    const merged = mergeReviewRegistries([withoutFrontier(lineageA), withoutFrontier(lineageB)], {
      frontierPartition: { a: ['F-1-001'], b: ['F-1-002'] },
    });
    const frontier = merged.frontier as { nodes: unknown[]; partitionGuard?: { passed: boolean; missing: string[] } };
    expect(frontier.nodes).toEqual([]);
    expect(frontier.partitionGuard).toEqual({ passed: false, missing: ['F-1-001', 'F-1-002'] });
  });

  it('adds no frontier key when no review lineage has one', () => {
    const merged = mergeReviewRegistries([withoutFrontier(lineageA), withoutFrontier(lineageB)]);
    expect(Object.prototype.hasOwnProperty.call(merged, 'frontier')).toBe(false);
  });
});
