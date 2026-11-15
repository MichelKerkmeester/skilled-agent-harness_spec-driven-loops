// ───────────────────────────────────────────────────────────────────
// MODULE: Deep Skill Routing Parity Tests
// ───────────────────────────────────────────────────────────────────
//
// The five legacy deep-loop skills are merged into one public skill,
// system-deep-loop, discriminated by workflowMode. Parity here is
// behavior-preserving: a prompt that used to win "deep-research" now resolves to
// { skill: system-deep-loop, mode: research }. Every invariant asserts BOTH
// the merged skill AND the concrete mode — flat skill equality is insufficient
// because it would hide a collapsed mode discriminator.

import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { findAdvisorWorkspaceRoot } from '../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const advisorScript = resolve(
  repoRoot,
  '.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py',
);

type DeepMode = 'research' | 'review';

interface RoutingResult {
  readonly skill: 'system-deep-loop';
  readonly mode: DeepMode;
  readonly scores: Record<DeepMode, number>;
  readonly winner: DeepMode;
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
  it('INV-001: convergence + investigation routes to system-deep-loop research mode', () => {
    const result = scoreRouting(
      'check convergence on the embedder testing architecture investigation',
      {
        artifacts: ['research/research.md', 'research/deep-research-state.jsonl'],
        recent_recommendations: ['deep-research'],
      },
    );

    expect(result.skill).toBe('system-deep-loop');
    expect(result.mode).toBe('research');
    expect(result.winner).toBe('research');
    expect(result.scores.research).toBeGreaterThanOrEqual(0.75);
    expect(result.scores.review).toBeLessThan(0.40);
  });

  it('INV-002: audit + research packet drift routes to system-deep-loop research mode', () => {
    const result = scoreRouting(
      'audit the deep-research packet for drift from the original embedder investigation topic',
      {
        artifacts: ['research/research.md', 'research/deep-research-findings-registry.json'],
        recent_recommendations: ['deep-research'],
      },
    );

    expect(result.skill).toBe('system-deep-loop');
    expect(result.mode).toBe('research');
    expect(result.winner).toBe('research');
    expect(result.scores.research).toBeGreaterThanOrEqual(0.70);
    expect(result.scores.review).toBeLessThan(0.50);
  });

  it('INV-006: autonomous research loop + newinforatio routes to system-deep-loop research mode', () => {
    const result = scoreRouting(
      'resume the autonomous research loop and check newinforatio convergence on the original investigation topic',
      {
        artifacts: ['research/research.md', 'research/deep-research-findings-registry.json'],
        recent_recommendations: ['deep-research'],
      },
    );

    expect(result.skill).toBe('system-deep-loop');
    expect(result.mode).toBe('research');
    expect(result.winner).toBe('research');
    expect(result.scores.research).toBeGreaterThanOrEqual(0.75);
    expect(result.scores.review).toBeLessThan(0.30);
  });

  it('INV-005: loop + findings stabilize routes to system-deep-loop review mode', () => {
    const result = scoreRouting(
      'run a loop on the deep-research packet until findings stabilize',
      {
        artifacts: ['review/deep-review-findings-registry.json', 'review/review-report.md'],
        recent_recommendations: ['deep-review'],
      },
    );

    expect(result.skill).toBe('system-deep-loop');
    expect(result.mode).toBe('review');
    expect(result.winner).toBe('review');
    expect(result.scores.review).toBeGreaterThanOrEqual(0.70);
    expect(result.scores.research).toBeLessThan(0.50);
  });

  it('INV-007: iterative review loop until p0/p1 stabilize routes to system-deep-loop review mode', () => {
    const result = scoreRouting(
      'continue the iterative review loop until the p0 and p1 findings stabilize',
      {
        artifacts: ['review/deep-review-findings-registry.json', 'review/review-report.md'],
        recent_recommendations: ['deep-review'],
      },
    );

    expect(result.skill).toBe('system-deep-loop');
    expect(result.mode).toBe('review');
    expect(result.winner).toBe('review');
    expect(result.scores.review).toBeGreaterThanOrEqual(0.75);
    expect(result.scores.research).toBeLessThan(0.30);
  });

  it('INV-008: multi-pass spec folder audit routes to system-deep-loop review mode', () => {
    const result = scoreRouting(
      'run a multi-pass spec folder audit until the review-report findings converge',
      {
        artifacts: ['review/review-report.md', 'review/deep-review-findings-registry.json'],
        recent_recommendations: ['deep-review'],
      },
    );

    expect(result.skill).toBe('system-deep-loop');
    expect(result.mode).toBe('review');
    expect(result.winner).toBe('review');
    expect(result.scores.review).toBeGreaterThanOrEqual(0.70);
    expect(result.scores.research).toBeLessThan(0.30);
  });

  it('INV-009: the adverb iteratively scores as the loop word iterate does', () => {
    const adverb = scoreRouting('Review this change iteratively using cli-opencode as the executor.', {});
    const verb = scoreRouting('Review this change and iterate using cli-opencode as the executor.', {});

    expect(adverb.skill).toBe('system-deep-loop');
    expect(adverb.mode).toBe('review');
    expect(adverb.scores).toEqual(verb.scores);
  });
});
