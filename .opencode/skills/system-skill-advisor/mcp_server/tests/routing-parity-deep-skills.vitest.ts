// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Skill Routing Parity Tests
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const advisorScript = resolve(
  repoRoot,
  '.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py',
);

interface RoutingResult {
  readonly scores: Record<'deep-review' | 'deep-research' | 'deep-ai-council', number>;
  readonly winner: 'deep-review' | 'deep-research' | 'deep-ai-council';
  readonly confidence: number;
  readonly confidence_band: 'HIGH' | 'MED' | 'LOW';
  readonly clarifying_question?: string;
}

function scoreRouting(prompt: string, packetContext: Record<string, unknown>): RoutingResult {
  const stdout = execFileSync('python3', [advisorScript, '--deep-skill-routing-json'], {
    cwd: repoRoot,
    encoding: 'utf8',
    input: JSON.stringify({
      prompt,
      packet_context: packetContext,
    }),
  });

  return JSON.parse(stdout) as RoutingResult;
}

describe('routing-parity-deep-skills', () => {
  it('INV-001: convergence + investigation routes to deep-research', () => {
    const result = scoreRouting(
      'check convergence on the embedder testing architecture investigation',
      {
        artifacts: ['research/research.md', 'research/deep-research-state.jsonl'],
        recent_recommendations: ['deep-research'],
      },
    );

    expect(result.winner).toBe('deep-research');
    expect(result.scores['deep-research']).toBeGreaterThanOrEqual(0.75);
    expect(result.scores['deep-review']).toBeLessThan(0.40);
  });

  it('INV-002: audit + deep-research packet drift routes to deep-research', () => {
    const result = scoreRouting(
      'audit the deep-research packet for drift from the original embedder investigation topic',
      {
        artifacts: ['research/research.md', 'research/deep-research-findings-registry.json'],
        recent_recommendations: ['deep-research'],
      },
    );

    expect(result.winner).toBe('deep-research');
    expect(result.scores['deep-research']).toBeGreaterThanOrEqual(0.70);
    expect(result.scores['deep-review']).toBeLessThan(0.50);
  });

  it('INV-003: architecture decision convergence routes to deep-ai-council', () => {
    const result = scoreRouting(
      'iterate on the spec folder until the architecture decision converges',
      {
        artifacts: ['ai-council/topics/topic-001/council-report.md'],
        recent_recommendations: ['deep-ai-council'],
      },
    );

    expect(result.winner).toBe('deep-ai-council');
    expect(result.scores['deep-ai-council']).toBeGreaterThanOrEqual(0.65);
    expect(result.scores['deep-review']).toBeLessThan(0.45);
  });

  it('INV-004: deliberate + option comparison routes to deep-ai-council', () => {
    const result = scoreRouting(
      'deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability',
      {
        artifacts: ['ai-council/session-report.md', 'ai-council/topics/topic-001/council-report.md'],
        recent_recommendations: ['sk-ai-council'],
      },
    );

    expect(result.winner).toBe('deep-ai-council');
    expect(result.scores['deep-ai-council']).toBeGreaterThanOrEqual(0.80);
    expect(result.scores['deep-research']).toBeLessThan(0.30);
  });

  it('INV-005: loop + findings stabilize routes to deep-review', () => {
    const result = scoreRouting(
      'run a loop on the deep-research packet until findings stabilize',
      {
        artifacts: ['review/deep-review-findings-registry.json', 'review/review-report.md'],
        recent_recommendations: ['deep-review'],
      },
    );

    expect(result.winner).toBe('deep-review');
    expect(result.scores['deep-review']).toBeGreaterThanOrEqual(0.70);
    expect(result.scores['deep-research']).toBeLessThan(0.50);
  });
});
