// ───────────────────────────────────────────────────────────────────
// MODULE: Deep AI Council Routing Parity Tests
// ───────────────────────────────────────────────────────────────────
//
// Council-specific structural signals route to the merged deep-loop-workflows
// skill in its ai-council mode. Each invariant asserts BOTH the merged skill AND
// the ai-council mode — flat skill equality is insufficient because it would
// hide a collapsed mode discriminator.

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

type DeepMode = 'research' | 'review' | 'ai-council';

interface RoutingResult {
  readonly skill: 'deep-loop-workflows';
  readonly mode: DeepMode;
  readonly scores: Record<DeepMode, number>;
  readonly winner: DeepMode;
  readonly confidence: number;
  readonly confidence_band: 'HIGH' | 'MED' | 'LOW';
  readonly clarifying_question?: string;
}

interface CouncilInvariant {
  readonly id: string;
  readonly prompt: string;
  readonly minConfidence: number;
  readonly runnerUp: 'review' | 'research';
  readonly runnerUpMax: number;
}

const councilPacketContext = {
  artifacts: [
    'ai-council/session-report.md',
    'ai-council/topics/topic-001/council-report.md',
    'ai-council/deep-ai-council-findings-registry.json',
  ],
  recent_recommendations: ['deep-ai-council'],
};

const invariants: readonly CouncilInvariant[] = [
  {
    id: 'COUNCIL-INV-001',
    prompt: 'deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring',
    minConfidence: 0.80,
    runnerUp: 'research',
    runnerUpMax: 0.30,
  },
  {
    id: 'COUNCIL-INV-002',
    prompt: 'iterate on the architecture decision with multi-seat strategy comparison',
    minConfidence: 0.75,
    runnerUp: 'review',
    runnerUpMax: 0.40,
  },
  {
    id: 'COUNCIL-INV-003',
    prompt: 'run a multi-topic deliberation across 3 design alternatives with cost guards',
    minConfidence: 0.80,
    runnerUp: 'research',
    runnerUpMax: 0.30,
  },
  {
    id: 'COUNCIL-INV-004',
    prompt: 'evaluate cross-topic priors for next council round',
    minConfidence: 0.75,
    runnerUp: 'review',
    runnerUpMax: 0.40,
  },
  {
    id: 'COUNCIL-INV-005',
    prompt: 'check verdict stability across deliberation rounds',
    minConfidence: 0.70,
    runnerUp: 'research',
    runnerUpMax: 0.40,
  },
];

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

describe('routing-parity-deep-council', () => {
  for (const invariant of invariants) {
    it(`${invariant.id}: routes council-specific structural signal to deep-loop-workflows ai-council mode`, () => {
      const result = scoreRouting(invariant.prompt, councilPacketContext);

      expect(result.skill).toBe('deep-loop-workflows');
      expect(result.mode).toBe('ai-council');
      expect(result.winner).toBe('ai-council');
      expect(result.confidence).toBeGreaterThanOrEqual(invariant.minConfidence);
      expect(result.scores['ai-council']).toBeGreaterThanOrEqual(invariant.minConfidence);
      expect(result.scores[invariant.runnerUp]).toBeLessThan(invariant.runnerUpMax);
    });
  }
});
