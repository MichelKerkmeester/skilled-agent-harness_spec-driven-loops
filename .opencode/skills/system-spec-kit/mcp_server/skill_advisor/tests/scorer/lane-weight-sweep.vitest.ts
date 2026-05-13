// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Lane Weight Sweep Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { runLaneWeightSweep, type WeightVector } from '../../lib/scorer/ablation.js';
import { scoreAdvisorPrompt } from '../../lib/scorer/fusion.js';
import { createFixtureProjection } from '../../lib/scorer/projection.js';
import type { SkillProjection } from '../../lib/scorer/types.js';
import { INTENT_PROMPT_CORPUS } from './fixtures/intent-prompt-corpus.js';

const PACKET_RELATIVE_PATH = join(
  '.opencode',
  'specs',
  'system-spec-kit',
  '026-graph-and-context-optimization',
  '015-skill-advisor-semantic-lane',
  '003-weight-sweep-harness',
);

const WEIGHT_VECTORS: readonly WeightVector[] = [
  {
    label: 'V0-baseline-015-002',
    weights: {
      explicit_author: 0.42,
      lexical: 0.28,
      graph_causal: 0.13,
      derived_generated: 0.12,
      semantic_shadow: 0.05,
    },
  },
  {
    label: 'V1-pre-015-002',
    weights: {
      explicit_author: 0.45,
      lexical: 0.30,
      graph_causal: 0.15,
      derived_generated: 0.15,
      semantic_shadow: 0.00,
    },
  },
  {
    label: 'V2-slightly-higher',
    weights: {
      explicit_author: 0.40,
      lexical: 0.28,
      graph_causal: 0.13,
      derived_generated: 0.12,
      semantic_shadow: 0.07,
    },
  },
  {
    label: 'V3-medium',
    weights: {
      explicit_author: 0.38,
      lexical: 0.27,
      graph_causal: 0.12,
      derived_generated: 0.12,
      semantic_shadow: 0.11,
    },
  },
  {
    label: 'V4-aggressive',
    weights: {
      explicit_author: 0.35,
      lexical: 0.25,
      graph_causal: 0.12,
      derived_generated: 0.13,
      semantic_shadow: 0.15,
    },
  },
  {
    label: 'V5-explicit-heavy',
    weights: {
      explicit_author: 0.50,
      lexical: 0.25,
      graph_causal: 0.10,
      derived_generated: 0.10,
      semantic_shadow: 0.05,
    },
  },
  {
    label: 'V6-cosine-dominant',
    weights: {
      explicit_author: 0.30,
      lexical: 0.20,
      graph_causal: 0.10,
      derived_generated: 0.10,
      semantic_shadow: 0.30,
    },
  },
];

function findWorkspaceRoot(start = process.cwd()): string {
  let current = resolve(start);
  while (current !== dirname(current)) {
    if (existsSync(join(current, PACKET_RELATIVE_PATH))) {
      return current;
    }
    current = dirname(current);
  }
  throw new Error(`Could not find workspace root containing ${PACKET_RELATIVE_PATH}`);
}

function tableEscape(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function formatDecimal(value: number): string {
  return value.toFixed(4);
}

function renderReport(report: ReturnType<typeof runLaneWeightSweep>): string {
  const baselineByPrompt = new Map(
    report.perCase
      .filter((result) => result.vectorLabel === WEIGHT_VECTORS[0].label)
      .map((result) => [result.prompt, result.actualSkill]),
  );
  const diffs = report.perCase.filter((result) => (
    result.vectorLabel !== WEIGHT_VECTORS[0].label
    && result.actualSkill !== baselineByPrompt.get(result.prompt)
  ));

  const summaryRows = report.summaries.map((summary) => [
    summary.vectorLabel,
    formatDecimal(summary.accuracyTotal),
    formatDecimal(summary.todayCorrectAccuracy),
    formatDecimal(summary.intentDescribedAccuracy),
    String(summary.flippedFromBaseline),
  ].join(' | '));

  const diffRows = diffs.map((result) => [
    result.vectorLabel,
    result.category,
    tableEscape(result.prompt),
    baselineByPrompt.get(result.prompt) ?? 'null',
    result.actualSkill ?? 'null',
    result.expectedSkill,
  ].join(' | '));

  return [
    `# Lane Weight Sweep Results (${new Date().toISOString()})`,
    '',
    '| vectorLabel | accuracyTotal | todayCorrect | intentDescribed | flippedFromBaseline |',
    '|---|---:|---:|---:|---:|',
    ...summaryRows.map((row) => `| ${row} |`),
    '',
    '## Per-Case Routing Diffs vs Baseline',
    '',
    '| vectorLabel | category | prompt | baselineActual | vectorActual | expectedSkill |',
    '|---|---|---|---|---|---|',
    ...(diffRows.length > 0 ? diffRows.map((row) => `| ${row} |`) : ['| none | n/a | n/a | n/a | n/a | n/a |']),
    '',
  ].join('\n');
}

function skill(overrides: Partial<SkillProjection> & Pick<SkillProjection, 'id'>): SkillProjection {
  return {
    id: overrides.id,
    kind: 'skill',
    family: 'system',
    category: 'test',
    name: overrides.id,
    description: '',
    keywords: [],
    domains: [],
    intentSignals: [],
    derivedTriggers: [],
    derivedKeywords: [],
    sourcePath: null,
    lifecycleStatus: 'active',
    ...Object.fromEntries(Object.entries(overrides).filter(([key]) => key !== 'id')),
  };
}

describe('015/003 lane weight sweep harness', () => {
  it('applies lane weight overrides without changing unrelated lane weights', () => {
    const projection = createFixtureProjection([
      skill({
        id: 'semantic-skill',
        description: 'semantic scoring target',
        intentSignals: ['semantic scoring target'],
      }),
    ]);
    const baseline = scoreAdvisorPrompt('semantic scoring target', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
    });
    const overridden = scoreAdvisorPrompt('semantic scoring target', {
      workspaceRoot: process.cwd(),
      projection,
      includeAllCandidates: true,
      laneWeightsOverride: { semantic_shadow: 0.25 },
    });
    const baselineTop = baseline.recommendations[0];
    const overriddenTop = overridden.recommendations[0];

    for (const lane of baselineTop.laneContributions) {
      const after = overriddenTop.laneContributions.find((entry) => entry.lane === lane.lane);
      expect(after?.rawScore).toBe(lane.rawScore);
      expect(after?.weight).toBe(lane.lane === 'semantic_shadow' ? 0.25 : lane.weight);
    }
  });

  it('sweeps candidate lane weight vectors and writes the packet report', () => {
    const workspaceRoot = findWorkspaceRoot();
    const report = runLaneWeightSweep({
      cases: INTENT_PROMPT_CORPUS,
      vectors: WEIGHT_VECTORS,
      workspaceRoot,
    });
    const baseline = report.summaries.find((summary) => summary.vectorLabel === 'V0-baseline-015-002');

    expect(INTENT_PROMPT_CORPUS.length).toBeGreaterThanOrEqual(20);
    expect(WEIGHT_VECTORS).toHaveLength(7);
    expect(report.summaries.some((summary) => summary.todayCorrectAccuracy >= 0.95)).toBe(true);
    expect(baseline?.todayCorrectAccuracy).toBeGreaterThanOrEqual(0.95);

    const reportPath = join(workspaceRoot, PACKET_RELATIVE_PATH, 'research', 'sweep-results.md');
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, renderReport(report));
  });
});
