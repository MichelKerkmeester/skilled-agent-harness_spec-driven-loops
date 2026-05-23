---
title: "Decision Record: Deep Skills Unique-Value Differentiation Analysis"
description: "ADRs emitted by 130 deep-research synthesis on deep-* skill differentiation."
trigger_phrases:
  - "deep skills adrs"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-deep-skills-unique-value-differentiation"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold decision-record placeholder"
    next_safe_action: "Run deep-research; populate ADRs from synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Decision Record: Deep Skills Unique-Value Differentiation Analysis

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core + level3-arch | v2.2 -->

> Populate after deep-research convergence. Each ADR must cite file:line evidence + at least one fixture prompt.

## ADR-001: Differentiation strategy verdict — Strategy D (Hybrid)

**Status**: Accepted
**Context**: Deep-review, deep-research, and proposed deep-council share deep-loop-runtime substrate but have distinct value propositions. Iter-001-003 identified unique value for each skill: adversarial P0 adjudication with coverage-graph signals (deep-review), negative knowledge with research charter (deep-research), multi-seat opinion synthesis with cross-topic priors (deep-council). Iter-004 identified 2 DANGEROUS overlap findings (F56: convergence-threshold default divergence, F60: iterate findings until convergence) and 4 CONFUSING overlap findings. Iter-006 enumerated 4 strategies (keep-distinct, merge, unify-with-mode, hybrid) with cost/risk analysis. Iter-007 cost-latency analysis showed that cost drivers are executor-specific and convergence-threshold defaults, not skill-specific.

**Decision**: Strategy D (Hybrid) — Extract shared primitives, keep distinct command entrypoints. Sharpen deep-loop-runtime extraction (loop-lock, jsonl-repair, atomic-state, executor-audit already extracted). Add low-cost hybrid fixes: (1) standardize convergence-threshold defaults across all three skills to address F56, (2) implement advisor clarifying questions for LOW-confidence fixtures to address F60, (3) rename deep-research's `findings-registry.json` to `deep-research-findings-registry.json` for consistency with deep-review's prefixed naming pattern (address F54). Keep distinct command entrypoints (`/spec_kit:deep-review`, `/spec_kit:deep-research`, `/spec_kit:deep-council`) to preserve distinct value propositions.

**Consequences**:
- **Positive**: Preserves adversarial P0 adjudication, negative knowledge, and multi-seat opinion synthesis as distinct capabilities. No breaking changes to command surfaces or state file schemas. Low operator disruption. Addresses DANGEROUS overlap findings via low-cost fixes.
- **Negative**: Overlap continues to confuse operators without perfect advisor disambiguation. Requires advisor rule implementation (Candidate 3 from iter-008) with clarifying questions for contested cases. Does not eliminate CONFUSING overlap findings (F51, F52, F58, F59) — relies on advisor routing to disambiguate.
- **Neutral**: Extends current deep-loop-runtime trajectory rather than reversing it. No runtime refactor required.

**Alternatives Considered and Rejected**:
- **Strategy A (Keep-Distinct)**: Rejected because 2 DANGEROUS overlap findings (F56, F60) require active fixes beyond documentation sharpening. Advisor accuracy without clarifying questions is insufficient (62.5% on clean slate, 87.5% with prior-art context).
- **Strategy B (Merge Two-of-Three)**: Rejected because overlap severity (2 DANGEROUS, 4 CONFUSING, 4 HELPFUL) does not justify high cost/risk of breaking changes. Would lose adversarial-vs-evidence distinction core to deep-review's unique value.
- **Strategy C (Unify-With-Mode-Suffix)**: Rejected because mode suffix migration is operator-facing disruption without addressing root causes (convergence-threshold divergence, executor cost variance). Hybrid fixes are lower-cost and equally effective.

**Evidence**:
- Distinct value propositions: iter-001 F15 (adversarial P0 adjudication) <ref_file file=".opencode/agents/deep-review.md" lines="182-183" />, iter-002 F31 (negative knowledge) <ref_file file=".opencode/agents/deep-research.md" lines="181-222, 264-269" />, iter-003 F48 (multi-seat opinion synthesis) <ref_file file=".opencode/specs/skilled-agent-orchestration/129-deep-ai-council-iterative-multi-topic/spec.md" lines="77-80" />.
- Overlap severity: iter-004 F56 (convergence-threshold default divergence, DANGEROUS) <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md" lines="52-56" />, iter-004 F60 (iterate findings until convergence, DANGEROUS) <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md" lines="72-76" />.
- Strategy cost/risk analysis: iter-006 strategy enumeration <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-006.md" lines="43-84" />.
- Cost-latency analysis: iter-007 F77 (wrong-skill dispatch cost waste, DANGEROUS) <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-007.md" lines="68-73" />, iter-007 F78 (convergence-threshold cost expectation mismatch, DANGEROUS) <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-007.md" lines="74-79" />.
- Advisor routing accuracy: iter-008 Candidate 3 (87.5% with prior-art context, 0% wrong-with-high-confidence) <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-008.md" lines="310-340" />.

---

## ADR-002: Skill-advisor routing rule — Candidate 3 (Lexical + Structural + Prior-Art)

**Status**: Accepted
**Context**: Iter-008 evaluated 3 routing rule candidates against 8 fixture prompts from iter-005. Candidate 1 (Pure Lexical) achieved 37.5% accuracy with 12.5% wrong-with-high-confidence failures. Candidate 2 (Lexical + Structural) achieved 62.5% accuracy with 0% wrong-with-high-confidence failures. Candidate 3 (Lexical + Structural + Prior-Art) achieved 87.5% accuracy with prior-art context and 0% wrong-with-high-confidence failures. Iter-007 cost-latency analysis showed that wrong-skill dispatch wastes operator budget (F77: wrong-skill dispatch cost waste, DANGEROUS), making high routing accuracy critical.

**Decision**: Implement Candidate 3 (Lexical + Structural + Prior-Art) with fallback to Candidate 2 when prior-art context unavailable. Formula: Lexical baseline (weight=1.0 per trigger phrase) + structural signals (weight=2.0 per intent classification, target type detection, convergence expectation) + prior-art signals (weight=3.0 per session state, artifact context, operator history). Add clarifying question protocol for LOW-confidence fixtures (e.g., fixture 008: "iterate on the spec folder until the architecture decision converges") and contested semantic disambiguation (e.g., fixture 005: "convergence on investigation" vs "convergence on review").

**Consequences**:
- **Positive**: Highest routing accuracy (87.5% with prior-art context). Zero wrong-with-high-confidence failures (no dangerous failure mode where advisor is confident but wrong). Resolves contested fixtures via prior-art context (fixture 007: deep-research session → deep-research, fixture 008: deep-council session → deep-council). Includes cost-guard awareness (warns about deep-council multi-seat cost amplification on paid executors).
- **Negative**: Implementation complexity requires session state tracking, artifact context detection, and operator history persistence. Accuracy degrades to 62.5% without prior-art context (same as Candidate 2). Fixture 005 remains incorrect without disambiguation rule ("convergence on investigation" vs "convergence on review").
- **Neutral**: Real-world alignment — operators typically work in sessions where prior-art context is available (existing deep-* sessions, referenced artifacts, recent dispatch history).

**Formula**:
```python
def score_lexical_structural_prior_art(prompt: str, context: Dict) -> Dict[str, float]:
    scores = score_lexical_structural(prompt)  # Base lexical + structural scores
    
    # Apply prior-art signal boosts (weight=3.0)
    if context.get("has_deep_review_session"):
        scores["deep-review"] += 3.0
    if context.get("has_deep_research_session"):
        scores["deep-research"] += 3.0
    if context.get("has_deep_council_session"):
        scores["deep-council"] += 3.0
    
    if "review-report.md" in context.get("referenced_artifacts", []):
        scores["deep-review"] += 3.0
    if "research.md" in context.get("referenced_artifacts", []):
        scores["deep-research"] += 3.0
    if "council-report.md" in context.get("referenced_artifacts", []):
        scores["deep-council"] += 3.0
    
    # Apply cost-guard awareness (weight=1.0)
    if context.get("executor") == "swe-1.6":
        # Free tier, no cost penalty
        pass
    else:
        # Paid executor, surface cost implications
        scores["deep-council"] -= 1.0  # Multi-seat cost amplification warning
    
    return scores
```

**Fixture Accuracy**:
- Clean slate (no prior-art context): 5/8 (62.5%)
- With prior-art context (fixtures 007, 008): 7/8 (87.5%)
- Wrong-with-high-confidence: 0/8 (0%)
- Tie-breaker failures: 0/8 (0% with prior-art, 1/8 without prior-art)

**Evidence**:
- Iter-005 fixture suite: 8 fixtures with expected winners and confidence bands <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-005.md" lines="23-168" />.
- Iter-008 Candidate 3 evaluation: accuracy analysis, comparison table, implementation recommendations <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-008.md" lines="186-340" />.
- Cost-latency urgency: iter-007 F77 (wrong-skill dispatch cost waste, DANGEROUS) <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-007.md" lines="68-73" />.

---

## ADR-003: Parity-test invariants — 5 invariants for routing boundary detection

**Status**: Accepted
**Context**: Iter-009 defined 5 parity-test invariants to detect boundary drift between deep-* skills. Each invariant maps to an overlap point from iter-004 and a fixture prompt from iter-005. Invariants specify expected advisor output (winner skill, confidence band, runner-up skill, runner-up confidence) and drift signals (thresholds that indicate boundary has drifted). Test file skeleton provided for vitest implementation in skill-advisor test suite.

**Decision**: Implement 5 parity-test invariants in `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts`. Invariants cover: (1) convergence keyword disambiguation by secondary context (INV-001), (2) audit intent disambiguation by target type (INV-002), (3) multi-seat deliberation vs single-executor loop (INV-003), (4) research charter vs adversarial adjudication (INV-004), (5) loop keyword disambiguation by intent framing (INV-005). Each invariant includes test assertion with confidence thresholds and drift signal detection.

**Consequences**:
- **Positive**: Automated detection of boundary drift prevents regression in advisor routing accuracy. Covers all 5 overlap points from iter-004 (F51, F52, F58, F59, F60). Provides regression guard for future changes to advisor rules, SKILL.md keyword triggers, or deep-* skill contracts.
- **Negative**: Requires test maintenance if fixture prompts or expected winners change. Test execution adds to CI pipeline duration (5 test cases). Does not prevent drift — only detects it after the fact.
- **Neutral**: Aligns with existing skill-advisor vitest patterns (advisor-recommend.vitest.ts). Test file location follows skill-advisor test directory structure.

**Invariants**:

**INV-001: Convergence keyword disambiguation by secondary context**
- **Skill-pair:** deep-review vs deep-research
- **Overlap point:** iter-004 F51 (trigger-phrase overlap on "convergence" keyword)
- **Fixture prompt:** "check convergence on the embedder testing architecture investigation"
- **Expected output:** Winner=deep-research (confidence ≥ 0.75), Runner-up=deep-review (confidence < 0.40)
- **Drift signal:** deep-review confidence ≥ 0.60 OR deep-research confidence < 0.60
- **Test assertion:** `expect(winner.skillId).toBe('deep-research'); expect(winner.confidence).toBeGreaterThanOrEqual(0.75); expect(runnerUp.skillId).toBe('deep-review'); expect(runnerUp.confidence).toBeLessThan(0.40);`

**INV-002: Audit intent disambiguation by target type**
- **Skill-pair:** deep-review vs deep-research
- **Overlap point:** iter-004 F58 (operator-intent overlap on "audit the deep-research packet drift")
- **Fixture prompt:** "audit the deep-research packet for drift from the original embedder investigation topic"
- **Expected output:** Winner=deep-research (confidence ≥ 0.70), Runner-up=deep-review (confidence < 0.50)
- **Drift signal:** deep-review confidence ≥ 0.60 OR deep-research confidence < 0.60
- **Test assertion:** `expect(winner.skillId).toBe('deep-research'); expect(winner.confidence).toBeGreaterThanOrEqual(0.70); expect(runnerUp.skillId).toBe('deep-review'); expect(runnerUp.confidence).toBeLessThan(0.50);`

**INV-003: Multi-seat deliberation vs single-executor loop**
- **Skill-pair:** deep-review vs deep-council
- **Overlap point:** iter-004 F60 (operator-intent overlap on "iterate findings until convergence")
- **Fixture prompt:** "iterate on the spec folder until the architecture decision converges"
- **Expected output:** Winner=deep-ai-council (confidence ≥ 0.65), Runner-up=deep-review (confidence < 0.45)
- **Drift signal:** deep-review confidence ≥ 0.55 OR deep-council confidence < 0.55
- **Test assertion:** `expect(winner.skillId).toBe('deep-ai-council'); expect(winner.confidence).toBeGreaterThanOrEqual(0.65); expect(runnerUp.skillId).toBe('deep-review'); expect(runnerUp.confidence).toBeLessThan(0.45);`

**INV-004: Research charter vs adversarial adjudication**
- **Skill-pair:** deep-research vs deep-council
- **Overlap point:** iter-004 F59 (operator-intent overlap on "evaluate architecture options")
- **Fixture prompt:** "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability"
- **Expected output:** Winner=deep-ai-council (confidence ≥ 0.80), Runner-up=deep-research (confidence < 0.30)
- **Drift signal:** deep-research confidence ≥ 0.40 OR deep-council confidence < 0.70
- **Test assertion:** `expect(winner.skillId).toBe('deep-ai-council'); expect(winner.confidence).toBeGreaterThanOrEqual(0.80); expect(runnerUp.skillId).toBe('deep-research'); expect(runnerUp.confidence).toBeLessThan(0.30);`

**INV-005: Loop keyword disambiguation by intent framing**
- **Skill-pair:** deep-review vs deep-research
- **Overlap point:** iter-004 F52 (trigger-phrase overlap on "loop" keyword)
- **Fixture prompt:** "run a loop on the deep-research packet until findings stabilize"
- **Expected output:** Winner=deep-review (confidence ≥ 0.70), Runner-up=deep-research (confidence < 0.50)
- **Drift signal:** deep-research confidence ≥ 0.55 OR deep-review confidence < 0.60
- **Test assertion:** `expect(winner.skillId).toBe('deep-review'); expect(winner.confidence).toBeGreaterThanOrEqual(0.70); expect(runnerUp.skillId).toBe('deep-research'); expect(runnerUp.confidence).toBeLessThan(0.50);`

**Test File Path**: `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts`

**Evidence**:
- Iter-009 invariant definitions with test skeleton <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-009.md" lines="23-408" />.
- Overlap point coverage: iter-004 F51 (INV-001), F52 (INV-005), F58 (INV-002), F59 (INV-004), F60 (INV-003) <ref_file file=".opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md" lines="27-76" />.
- Existing skill-advisor vitest patterns: advisor-recommend.vitest.ts <ref_file file=".opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-recommend.vitest.ts" />.
