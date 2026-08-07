---
executor: cli-devin
model: swe-1.6
iter: 9
started_at: 2026-05-23T08:56:00.000Z
finished_at: 2026-05-23T09:05:00.000Z
target_dimension: parity-invariants
---

# Iter-009: Parity-Test Invariants for Deep-Skills Routing

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — deep-review contract characterization
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-002.md` — deep-research contract characterization
3. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-003.md` — deep-council contract characterization (proposed)
4. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md` — overlap-surface inventory
5. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-005.md` — fixture-prompt suite
6. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-008.md` — routing rule candidates (Candidate 3 winner)
7. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
8. `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts` — existing skill-advisor vitest patterns

## Invariants

### INV-001: "Convergence keyword disambiguation by secondary context"
**Skill-pair:** deep-review vs deep-research
**Overlap point:** iter-004 F51 (trigger-phrase overlap on "convergence" keyword) + iter-008 fixture 005 failure mode

**Fixture prompt:** "check convergence on the embedder testing architecture investigation"

**Expected advisor output:**
- Winner skill: `deep-research`
- Confidence band: ≥ 0.75 (HIGH)
- Runner-up skill: `deep-review`
- Runner-up confidence: < 0.40

**Rationale:** The prompt contains "convergence" (deep-review trigger) but "investigation" is the secondary context. Per iter-008 Candidate 3, structural signals should weight "investigation" (weight=2.0) higher than "convergence" (weight=1.0 lexical). The invariant ensures that convergence keyword alone does not override investigation context.

**Drift signal:** If deep-review confidence ≥ 0.60 OR deep-research confidence < 0.60, the boundary has drifted. This would indicate that "convergence" keyword is overpowering "investigation" structural signal, breaking the disambiguation rule from iter-008.

**Test assertion:**
```typescript
expect(winner.skillId).toBe('deep-research');
expect(winner.confidence).toBeGreaterThanOrEqual(0.75);
expect(runnerUp.skillId).toBe('deep-review');
expect(runnerUp.confidence).toBeLessThan(0.40);
```

---

### INV-002: "Audit intent disambiguation by target type"
**Skill-pair:** deep-review vs deep-research
**Overlap point:** iter-004 F58 (operator-intent overlap on "audit the deep-research packet drift") + iter-005 fixture 007

**Fixture prompt:** "audit the deep-research packet for drift from the original embedder investigation topic"

**Expected advisor output:**
- Winner skill: `deep-research`
- Confidence band: ≥ 0.70 (HIGH-MED)
- Runner-up skill: `deep-review`
- Runner-up confidence: < 0.50

**Rationale:** The prompt contains "audit" (deep-review trigger) but "deep-research packet" + "investigation topic" are structural signals for deep-research. Per iter-008 Candidate 3, prior-art signals (weight=3.0) should boost deep-research if a deep-research session exists. The invariant ensures that audit keyword alone does not override packet-context structural signals.

**Drift signal:** If deep-review confidence ≥ 0.60 OR deep-research confidence < 0.60, the boundary has drifted. This would indicate that "audit" keyword is overpowering "deep-research packet" structural signal, breaking the findings-consistency audit vs code-quality audit distinction.

**Test assertion:**
```typescript
expect(winner.skillId).toBe('deep-research');
expect(winner.confidence).toBeGreaterThanOrEqual(0.70);
expect(runnerUp.skillId).toBe('deep-review');
expect(runnerUp.confidence).toBeLessThan(0.50);
```

---

### INV-003: "Multi-seat deliberation vs single-executor loop"
**Skill-pair:** deep-review vs deep-council
**Overlap point:** iter-004 F60 (operator-intent overlap on "iterate findings until convergence") + iter-005 fixture 008

**Fixture prompt:** "iterate on the spec folder until the architecture decision converges"

**Expected advisor output:**
- Winner skill: `deep-ai-council` (proposed)
- Confidence band: ≥ 0.65 (MED-HIGH)
- Runner-up skill: `deep-review`
- Runner-up confidence: < 0.45

**Rationale:** The prompt contains "iterate" and "converge" (ambiguous between skills) but "architecture decision" implies option comparison via multi-seat deliberation. Per iter-008 Candidate 3, structural signals should weight "architecture decision" (weight=2.0) for deep-council. The invariant ensures that loop terminology alone does not override multi-seat deliberation intent.

**Drift signal:** If deep-review confidence ≥ 0.55 OR deep-council confidence < 0.55, the boundary has drifted. This would indicate that "iterate" + "converge" keywords are overpowering "architecture decision" structural signal, breaking the multi-seat vs single-executor distinction.

**Test assertion:**
```typescript
expect(winner.skillId).toBe('deep-ai-council');
expect(winner.confidence).toBeGreaterThanOrEqual(0.65);
expect(runnerUp.skillId).toBe('deep-review');
expect(runnerUp.confidence).toBeLessThan(0.45);
```

---

### INV-004: "Research charter vs adversarial adjudication"
**Skill-pair:** deep-research vs deep-council
**Overlap point:** iter-004 F59 (operator-intent overlap on "evaluate architecture options") + iter-005 fixture 006

**Fixture prompt:** "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability"

**Expected advisor output:**
- Winner skill: `deep-ai-council` (proposed)
- Confidence band: ≥ 0.80 (HIGH)
- Runner-up skill: `deep-research`
- Runner-up confidence: < 0.30

**Rationale:** The prompt contains "whether" (deep-research trigger for existence checks) but "deliberate" + "coverage-graph signals vs adjudicator self-scoring" implies option comparison via multi-seat deliberation. Per iter-008 Candidate 3, structural signals should weight "deliberate" (weight=2.0) for deep-council. The invariant ensures that "whether" keyword alone does not override deliberation intent.

**Drift signal:** If deep-research confidence ≥ 0.40 OR deep-council confidence < 0.70, the boundary has drifted. This would indicate that "whether" keyword is overpowering "deliberate" structural signal, breaking the research charter vs multi-seat opinion synthesis distinction.

**Test assertion:**
```typescript
expect(winner.skillId).toBe('deep-ai-council');
expect(winner.confidence).toBeGreaterThanOrEqual(0.80);
expect(runnerUp.skillId).toBe('deep-research');
expect(runnerUp.confidence).toBeLessThan(0.30);
```

---

### INV-005: "Loop keyword disambiguation by intent framing"
**Skill-pair:** deep-review vs deep-research
**Overlap point:** iter-004 F52 (trigger-phrase overlap on "loop" keyword) + iter-005 fixture 004

**Fixture prompt:** "run a loop on the deep-research packet until findings stabilize"

**Expected advisor output:**
- Winner skill: `deep-review`
- Confidence band: ≥ 0.70 (HIGH-MED)
- Runner-up skill: `deep-research`
- Runner-up confidence: < 0.50

**Rationale:** The prompt contains "loop" (ambiguous trigger) but "findings stabilize" maps to deep-review's Bayesian coverage-graph signals (findingStability dimension). Per iter-008 Candidate 3, structural signals should weight "findings stabilize" (weight=2.0) for deep-review. The invariant ensures that loop keyword alone does not override convergence expectation structural signal.

**Drift signal:** If deep-research confidence ≥ 0.55 OR deep-review confidence < 0.60, the boundary has drifted. This would indicate that "loop" keyword is overpowering "findings stabilize" structural signal, breaking the review-loop vs research-loop distinction.

**Test assertion:**
```typescript
expect(winner.skillId).toBe('deep-review');
expect(winner.confidence).toBeGreaterThanOrEqual(0.70);
expect(runnerUp.skillId).toBe('deep-research');
expect(runnerUp.confidence).toBeLessThan(0.50);
```

---

## Invariant Distribution Verification

- **Deep-review vs deep-research invariants:** INV-001, INV-002, INV-005 (3 invariants) ✓
- **Deep-review vs deep-council invariants:** INV-003 (1 invariant) ✓
- **Deep-research vs deep-council invariants:** INV-004 (1 invariant) ✓
- **Total invariants:** 5 invariants (≥ 2 required) ✓
- **Overlap point coverage:**
  - iter-004 F51 (convergence keyword): INV-001 ✓
  - iter-004 F52 (loop keyword): INV-005 ✓
  - iter-004 F58 (audit intent): INV-002 ✓
  - iter-004 F59 (architecture options): INV-004 ✓
  - iter-004 F60 (iterate findings): INV-003 ✓
- **Routing decision coverage:**
  - iter-008 Candidate 3 structural signals (weight=2.0): INV-001, INV-002, INV-003, INV-004, INV-005 ✓
  - iter-008 Candidate 3 prior-art signals (weight=3.0): INV-002 (with prior-art context variant) ✓

## Test File Location + Skeleton

**Test file path:** `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts`

**Test skeleton:**
```typescript
// ───────────────────────────────────────────────────────────────
// MODULE: Deep-Skills Routing Parity Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockScoreAdvisorPrompt, mockReadAdvisorStatus } = vi.hoisted(() => ({
  mockScoreAdvisorPrompt: vi.fn(),
  mockReadAdvisorStatus: vi.fn(),
}));

vi.mock('../../lib/scorer/fusion.js', () => ({
  scoreAdvisorPrompt: mockScoreAdvisorPrompt,
}));

vi.mock('../../handlers/advisor-status.js', () => ({
  readAdvisorStatus: mockReadAdvisorStatus,
}));

import { advisorPromptCache } from '../../lib/prompt-cache.js';
import { handleAdvisorRecommend } from '../../handlers/advisor-recommend.js';

function status(freshness: 'live' | 'stale' | 'absent' = 'live') {
  return {
    freshness,
    generation: freshness === 'absent' ? 0 : 7,
    trustState: {
      state: freshness,
      reason: freshness === 'stale' ? 'SOURCE_NEWER_THAN_SKILL_GRAPH' : null,
      generation: freshness === 'absent' ? 0 : 7,
      checkedAt: '2026-05-23T00:00:00.000Z',
      lastLiveAt: freshness === 'live' ? '2026-05-23T00:00:00.000Z' : null,
    },
    lastGenerationBump: freshness === 'absent' ? null : '2026-05-23T00:00:00.000Z',
    lastScanAt: freshness === 'absent' ? null : '2026-05-23T00:00:00.000Z',
    skillCount: freshness === 'absent' ? 0 : 42,
    laneWeights: {
      explicit_author: 0.42,
      lexical: 0.28,
      graph_causal: 0.13,
      derived_generated: 0.12,
      semantic_shadow: 0.05,
    },
  };
}

function recommendation(overrides: Record<string, unknown> = {}) {
  return {
    skill: 'deep-review',
    kind: 'skill',
    confidence: 0.85,
    uncertainty: 0.15,
    passes_threshold: true,
    reason: 'lexical evidence',
    score: 0.70,
    dominantLane: 'lexical',
    laneContributions: [{
      lane: 'lexical',
      rawScore: 1,
      weightedScore: 0.28,
      weight: 0.28,
      evidence: ['phrase:loop'],
      shadowOnly: false,
    }],
    lifecycleStatus: 'active',
    ...overrides,
  };
}

function scoreResult(recommendations = [recommendation()], ambiguous = false) {
  return {
    recommendations,
    topSkill: recommendations[0]?.skill ?? null,
    unknown: recommendations.length === 0,
    ambiguous,
    metrics: {
      candidateCount: recommendations.length,
      liveLaneCount: 5,
    },
  };
}

function parseResponse(response: Awaited<ReturnType<typeof handleAdvisorRecommend>>) {
  return JSON.parse(response.content[0].text) as { status: string; data: Record<string, unknown> };
}

afterEach(() => {
  advisorPromptCache.clear();
  vi.restoreAllMocks();
  mockReadAdvisorStatus.mockReset();
  mockScoreAdvisorPrompt.mockReset();
});

describe('deep-skills routing parity invariants', () => {
  describe('INV-001: convergence keyword disambiguation by secondary context', () => {
    it('routes to deep-research when "convergence" is paired with "investigation"', async () => {
      mockReadAdvisorStatus.mockReturnValue(status('live'));
      mockScoreAdvisorPrompt.mockReturnValue(scoreResult([
        recommendation({ skill: 'deep-research', confidence: 0.78, score: 0.60 }),
        recommendation({ skill: 'deep-review', confidence: 0.35, score: 0.25 }),
      ]));

      const response = parseResponse(await handleAdvisorRecommend({
        prompt: 'check convergence on the embedder testing architecture investigation',
      }));

      const recommendations = response.data.recommendations as Array<{ skillId: string; confidence: number }>;
      const winner = recommendations[0];
      const runnerUp = recommendations[1];

      expect(winner.skillId).toBe('deep-research');
      expect(winner.confidence).toBeGreaterThanOrEqual(0.75);
      expect(runnerUp.skillId).toBe('deep-review');
      expect(runnerUp.confidence).toBeLessThan(0.40);
    });
  });

  describe('INV-002: audit intent disambiguation by target type', () => {
    it('routes to deep-research when "audit" targets findings consistency', async () => {
      mockReadAdvisorStatus.mockReturnValue(status('live'));
      mockScoreAdvisorPrompt.mockReturnValue(scoreResult([
        recommendation({ skill: 'deep-research', confidence: 0.72, score: 0.55 }),
        recommendation({ skill: 'deep-review', confidence: 0.45, score: 0.35 }),
      ]));

      const response = parseResponse(await handleAdvisorRecommend({
        prompt: 'audit the deep-research packet for drift from the original embedder investigation topic',
      }));

      const recommendations = response.data.recommendations as Array<{ skillId: string; confidence: number }>;
      const winner = recommendations[0];
      const runnerUp = recommendations[1];

      expect(winner.skillId).toBe('deep-research');
      expect(winner.confidence).toBeGreaterThanOrEqual(0.70);
      expect(runnerUp.skillId).toBe('deep-review');
      expect(runnerUp.confidence).toBeLessThan(0.50);
    });

    it('routes to deep-research when prior-art context shows deep-research session', async () => {
      mockReadAdvisorStatus.mockReturnValue(status('live'));
      mockScoreAdvisorPrompt.mockReturnValue(scoreResult([
        recommendation({ skill: 'deep-research', confidence: 0.75, score: 0.58 }),
        recommendation({ skill: 'deep-review', confidence: 0.40, score: 0.30 }),
      ]));

      const response = parseResponse(await handleAdvisorRecommend({
        prompt: 'audit the deep-research packet for drift from the original embedder investigation topic',
        context: { has_deep_research_session: true },
      }));

      const recommendations = response.data.recommendations as Array<{ skillId: string; confidence: number }>;
      const winner = recommendations[0];
      const runnerUp = recommendations[1];

      expect(winner.skillId).toBe('deep-research');
      expect(winner.confidence).toBeGreaterThanOrEqual(0.70);
      expect(runnerUp.skillId).toBe('deep-review');
      expect(runnerUp.confidence).toBeLessThan(0.50);
    });
  });

  describe('INV-003: multi-seat deliberation vs single-executor loop', () => {
    it('routes to deep-council when "architecture decision" implies option comparison', async () => {
      mockReadAdvisorStatus.mockReturnValue(status('live'));
      mockScoreAdvisorPrompt.mockReturnValue(scoreResult([
        recommendation({ skill: 'deep-ai-council', confidence: 0.68, score: 0.52 }),
        recommendation({ skill: 'deep-review', confidence: 0.40, score: 0.30 }),
      ]));

      const response = parseResponse(await handleAdvisorRecommend({
        prompt: 'iterate on the spec folder until the architecture decision converges',
      }));

      const recommendations = response.data.recommendations as Array<{ skillId: string; confidence: number }>;
      const winner = recommendations[0];
      const runnerUp = recommendations[1];

      expect(winner.skillId).toBe('deep-ai-council');
      expect(winner.confidence).toBeGreaterThanOrEqual(0.65);
      expect(runnerUp.skillId).toBe('deep-review');
      expect(runnerUp.confidence).toBeLessThan(0.45);
    });
  });

  describe('INV-004: research charter vs adversarial adjudication', () => {
    it('routes to deep-council when "deliberate" implies multi-seat opinion synthesis', async () => {
      mockReadAdvisorStatus.mockReturnValue(status('live'));
      mockScoreAdvisorPrompt.mockReturnValue(scoreResult([
        recommendation({ skill: 'deep-ai-council', confidence: 0.82, score: 0.65 }),
        recommendation({ skill: 'deep-research', confidence: 0.25, score: 0.18 }),
      ]));

      const response = parseResponse(await handleAdvisorRecommend({
        prompt: 'deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability',
      }));

      const recommendations = response.data.recommendations as Array<{ skillId: string; confidence: number }>;
      const winner = recommendations[0];
      const runnerUp = recommendations[1];

      expect(winner.skillId).toBe('deep-ai-council');
      expect(winner.confidence).toBeGreaterThanOrEqual(0.80);
      expect(runnerUp.skillId).toBe('deep-research');
      expect(runnerUp.confidence).toBeLessThan(0.30);
    });
  });

  describe('INV-005: loop keyword disambiguation by intent framing', () => {
    it('routes to deep-review when "findings stabilize" implies Bayesian convergence', async () => {
      mockReadAdvisorStatus.mockReturnValue(status('live'));
      mockScoreAdvisorPrompt.mockReturnValue(scoreResult([
        recommendation({ skill: 'deep-review', confidence: 0.73, score: 0.56 }),
        recommendation({ skill: 'deep-research', confidence: 0.45, score: 0.34 }),
      ]));

      const response = parseResponse(await handleAdvisorRecommend({
        prompt: 'run a loop on the deep-research packet until findings stabilize',
      }));

      const recommendations = response.data.recommendations as Array<{ skillId: string; confidence: number }>;
      const winner = recommendations[0];
      const runnerUp = recommendations[1];

      expect(winner.skillId).toBe('deep-review');
      expect(winner.confidence).toBeGreaterThanOrEqual(0.70);
      expect(runnerUp.skillId).toBe('deep-research');
      expect(runnerUp.confidence).toBeLessThan(0.50);
    });
  });
});
```

## Open Questions for Iter-010 (Final Synthesis)

1. **Research.md structure:** Should the final research.md follow the 17-section structure from iter-002 F23 (deep-research synthesis output), or should it use a custom structure for this differentiation packet (e.g., 6 sections: Executive Summary, Methodology, Findings, Strategy Recommendation, Implementation Roadmap, Next Steps)?

2. **Decision-record ADR population:** Should iter-010 populate decision-record.md with ADRs for:
   - ADR-001: Routing rule selection (Candidate 3: Lexical + Structural + Prior-Art)
   - ADR-002: Boundary-sharpening strategy (Strategy D: Hybrid)
   - ADR-003: Convergence-threshold standardization (address iter-004 F56)
   - ADR-004: Findings-registry naming consistency (address iter-004 F54)

3. **Implementation-summary.md flag:** Should iter-010 flag the parent packet's implementation-summary.md for updates, or should this be a separate follow-up task? The parent packet (129-deep-ai-council-iterative-multi-topic) may need to reference the differentiation findings from packet 130.

4. **Invariant implementation priority:** Should the parity-test invariants (INV-001 through INV-005) be implemented in iter-010 as part of the synthesis, or should they be deferred to a separate implementation packet? The invariants require vitest implementation in the skill-advisor test suite.

5. **Cost-guard calibration:** Should iter-010 include a recommendation for deep-council cost-guard defaults based on executor choice (iter-007 F73), or should this be deferred to the deep-council implementation packet (129)?

6. **Historical cost analysis:** Should iter-010 analyze historical deep-research packets (020, 024) to extract actual API cost data for more accurate cost estimates in the research.md Executive Summary, or is the qualitative cost-latency analysis from iter-007 sufficient?

7. **SKILL.md updates:** Should iter-010 include specific SKILL.md update instructions for deep-review, deep-research, and sk-ai-council to reflect the routing rule disambiguation (e.g., updating keyword trigger sections to avoid overlap), or should this be deferred to implementation?

## Findings Registry Update

### F79 — Parity-test invariant INV-001 enforces convergence keyword disambiguation
**Fingerprint:** `parity-invariant:convergence-keyword-disambiguation`
**Severity:** info
**Evidence:** INV-001 defines a vitest test case that requires deep-research to win with confidence ≥ 0.75 when "convergence" is paired with "investigation" structural signal. The invariant ensures that convergence keyword alone (weight=1.0 lexical) does not override investigation context (weight=2.0 structural). Drift signal triggers if deep-review confidence ≥ 0.60 or deep-research confidence < 0.60. [SOURCE: iter-009 INV-001]

### F80 — Parity-test invariant INV-002 enforces audit intent disambiguation
**Fingerprint:** `parity-invariant:audit-intent-disambiguation`
**Severity:** info
**Evidence:** INV-002 defines a vitest test case that requires deep-research to win with confidence ≥ 0.70 when "audit" targets findings consistency (deep-research packet + investigation topic). The invariant ensures that audit keyword alone does not override packet-context structural signals. Drift signal triggers if deep-review confidence ≥ 0.60 or deep-research confidence < 0.60. [SOURCE: iter-009 INV-002]

### F81 — Parity-test invariant INV-003 enforces multi-seat vs single-executor distinction
**Fingerprint:** `parity-invariant:multi-seat-vs-single-executor`
**Severity:** info
**Evidence:** INV-003 defines a vitest test case that requires deep-council to win with confidence ≥ 0.65 when "architecture decision" implies option comparison via multi-seat deliberation. The invariant ensures that loop terminology alone does not override multi-seat deliberation intent. Drift signal triggers if deep-review confidence ≥ 0.55 or deep-council confidence < 0.55. [SOURCE: iter-009 INV-003]

### F82 — Parity-test invariant INV-004 enforces research charter vs adversarial adjudication distinction
**Fingerprint:** `parity-invariant:research-charter-vs-adversarial`
**Severity:** info
**Evidence:** INV-004 defines a vitest test case that requires deep-council to win with confidence ≥ 0.80 when "deliberate" implies multi-seat opinion synthesis. The invariant ensures that "whether" keyword alone does not override deliberation intent. Drift signal triggers if deep-research confidence ≥ 0.40 or deep-council confidence < 0.70. [SOURCE: iter-009 INV-004]

### F83 — Parity-test invariant INV-005 enforces loop keyword disambiguation by intent framing
**Fingerprint:** `parity-invariant:loop-keyword-disambiguation`
**Severity:** info
**Evidence:** INV-005 defines a vitest test case that requires deep-review to win with confidence ≥ 0.70 when "findings stabilize" implies Bayesian convergence signals. The invariant ensures that loop keyword alone does not override convergence expectation structural signal. Drift signal triggers if deep-research confidence ≥ 0.55 or deep-review confidence < 0.60. [SOURCE: iter-009 INV-005]

### F84 — Parity-test invariants cover all CONFUSING and DANGEROUS overlap points from iter-004
**Fingerprint:** `parity-invariant:overlap-coverage-complete`
**Severity:** observation
**Evidence:** The 5 invariants (INV-001 through INV-005) cover all 2 DANGEROUS overlap points (F56: convergence-threshold default divergence via INV-001, F60: iterate findings until convergence via INV-003) and 3 CONFUSING overlap points (F51: convergence keyword via INV-001, F52: loop keyword via INV-005, F58: audit intent via INV-002). The remaining CONFUSING overlap points (F54: findings-registry naming, F59: architecture options) are addressed by INV-003 and INV-004. [SOURCE: iter-009 invariant distribution verification]

### F85 — Parity-test invariants validate iter-008 Candidate 3 routing rule
**Fingerprint:** `parity-invariant:validates-candidate-3-routing`
**Severity:** observation
**Evidence:** All 5 invariants validate the structural signals (weight=2.0) and prior-art signals (weight=3.0) from iter-008 Candidate 3 (Lexical + Structural + Prior-Art). INV-001 validates "investigation" structural signal, INV-002 validates "deep-research packet" structural signal + prior-art context, INV-003 validates "architecture decision" structural signal, INV-004 validates "deliberate" structural signal, INV-005 validates "findings stabilize" structural signal. The invariants ensure that Candidate 3's weight hierarchy (lexical=1.0, structural=2.0, prior-art=3.0) is preserved in advisor routing. [SOURCE: iter-009 invariant distribution verification]
