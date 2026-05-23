---
executor: cli-devin
model: swe-1.6
iter: 5
started_at: 2026-05-23T08:30:00.000Z
finished_at: 2026-05-23T08:45:00.000Z
target_dimension: routing-fixtures
---

# Iter-005: Fixture-Prompt Suite With Expected Routing

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — deep-review contract characterization
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-002.md` — deep-research contract characterization
3. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-003.md` — deep-council contract characterization (proposed)
4. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-004.md` — overlap-surface inventory
5. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
6. `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` — current advisor scoring logic (confidence-calibration reference)

## Fixture Suite

### F-fixture-001: "deeply audit the embedder sidecar lifecycle hardening for drift"
- **Correct skill:** deep-review
- **Rationale:** Target is code subsystem (embedder sidecar), intent is audit (adversarial framing), dimensions are correctness+security+maintainability. The operator wants to find code defects and drift from hardening requirements, which matches deep-review's adversarial P0 adjudication and coverage-graph signals.
- **Wrong-plausible sibling:** deep-research
- **Why wrong:** Operator might think "investigate drift" maps to research, but deep-research is for discovering new knowledge (negative knowledge, research charter), not auditing existing code against requirements. Deep-research lacks severity tiers and adversarial adjudication, which are essential for security hardening audits.
- **Confidence:** HIGH
- **Ambiguity source:** iter-004 F58 (trigger-phrase overlap "audit" + "drift")

### F-fixture-002: "investigate whether the spec kit memory schema supports cross-packet negative knowledge"
- **Correct skill:** deep-research
- **Rationale:** Intent is investigation to discover whether a capability exists (knowledge discovery), target is a research question about schema capabilities. This matches deep-research's emphasis on negative knowledge (ruled-out directions) and research charter validation. The operator wants to know "does this exist or not," which is a research question, not a code audit.
- **Wrong-plausible sibling:** deep-review
- **Why wrong:** Operator might think "review the schema" maps to deep-review, but deep-review requires a review_target (spec-folder, skill, agent, track, files) and focuses on code quality defects, not capability discovery. Deep-review's P0/P1/P2 severity tiers are inappropriate for a yes/no research question.
- **Confidence:** HIGH
- **Ambiguity source:** iter-004 F59 (operator-intent overlap on "investigate" vs "review")

### F-fixture-003: "evaluate three proposed strategies for deep-council convergence detection and recommend the best one"
- **Correct skill:** deep-ai-council (proposed)
- **Rationale:** Intent is strategy comparison and recommendation, operator explicitly states "three proposed strategies" exist. This matches deep-council's multi-seat deliberation with different strategy lenses per round. The operator wants opinion synthesis on existing options, not discovery of new options or code audit.
- **Wrong-plausible sibling:** deep-research
- **Why wrong:** Operator might think "evaluate strategies" maps to research, but deep-research is for discovering options via investigation, not comparing existing options. Deep-research's newInfoRatio convergence is inappropriate when options already exist and need comparison.
- **Wrong-plausible sibling:** deep-review
- **Why wrong:** Operator might think "review the strategies" maps to deep-review, but deep-review requires code artifacts to audit (spec-folder, skill, agent, track, files). Strategy comparison is opinion-based, not evidence-based code defect finding.
- **Confidence:** HIGH
- **Ambiguity source:** iter-004 F59 (operator-intent overlap on "evaluate options")

### F-fixture-004: "run a loop on the deep-research packet until findings stabilize"
- **Correct skill:** deep-review
- **Rationale:** Operator uses "loop" terminology (iter-004 F52 overlap) but specifies "findings stabilize" which maps to deep-review's Bayesian coverage-graph signals (findingStability, dimensionCoverage). The operator wants adversarial P0 adjudication with severity tiers, which deep-review provides. Deep-research lacks severity tiers and adversarial adjudication.
- **Wrong-plausible sibling:** deep-research
- **Why wrong:** Operator says "deep-research packet" which could imply deep-research skill, but "findings stabilize" with severity expectations maps to deep-review's convergence semantics. Deep-research uses newInfoRatio without severity tiers, which would not match the operator's mental model of "findings" (P0/P1/P2).
- **Confidence:** MED
- **Ambiguity source:** iter-004 F52 (trigger-phrase overlap "loop") + iter-004 F60 (operator-intent overlap on "iterate findings until convergence")

### F-fixture-005: "check convergence on the embedder testing architecture investigation"
- **Correct skill:** deep-research
- **Rationale:** Operator uses "convergence" keyword (iter-004 F51 overlap) but specifies "investigation" which maps to deep-research's research charter and negative knowledge emphasis. The operator wants to know when investigation has exhausted new information (newInfoRatio), not when code defects are saturated (deep-review's weighted P0/P1/P2 ratio).
- **Wrong-plausible sibling:** deep-review
- **Why wrong:** Operator says "convergence" which is a deep-review trigger, but "investigation" implies knowledge discovery, not code audit. Deep-review's adversarial P0 adjudication and coverage-graph signals are inappropriate for a research investigation that may not have code artifacts to audit.
- **Confidence:** MED
- **Ambiguity source:** iter-004 F51 (trigger-phrase overlap "convergence") + iter-004 F56 (convergence-threshold default divergence)

### F-fixture-006: "deliberate on whether deep-council should use coverage-graph signals or adjudicator self-scoring for stability"
- **Correct skill:** deep-ai-council (proposed)
- **Rationale:** Intent is deliberation on a design decision with two existing options (coverage-graph signals vs adjudicator self-scoring). This matches deep-council's multi-seat opinion synthesis. The operator wants diverse AI vantages to weigh trade-offs, not code audit or knowledge discovery.
- **Wrong-plausible sibling:** deep-research
- **Why wrong:** Operator might think "research the options" maps to deep-research, but the options already exist (coverage-graph signals vs adjudicator self-scoring). Deep-research is for discovering options, not comparing existing options.
- **Wrong-plausible sibling:** deep-review
- **Why wrong:** Operator might think "review the options" maps to deep-review, but this is a design decision, not a code audit. Deep-review's adversarial P0 adjudication is inappropriate for opinion-based design deliberation.
- **Confidence:** HIGH
- **Ambiguity source:** iter-004 F59 (operator-intent overlap on "evaluate options")

### F-fixture-007: "audit the deep-research packet for drift from the original embedder investigation topic"
- **Correct skill:** deep-research
- **Rationale:** Intent is findings-consistency audit (drift from original topic), not code-quality audit. The operator wants to verify that research findings remain aligned with the original investigation charter, which matches deep-research's research charter validation and negative knowledge emphasis. Deep-research can re-investigate the topic to check for drift.
- **Wrong-plausible sibling:** deep-review
- **Why wrong:** Operator says "audit" which is a deep-review trigger (iter-004 F58), but the audit target is findings consistency, not code quality. Deep-review's adversarial P0 adjudication and coverage-graph signals are inappropriate for checking whether research findings drifted from the original topic.
- **Confidence:** MED
- **Ambiguity source:** iter-004 F58 (operator-intent overlap on "audit the deep-research packet drift")

### F-fixture-008: "iterate on the spec folder until the architecture decision converges"
- **Correct skill:** deep-ai-council (proposed) — TIE-BREAKER
- **Rationale:** Operator uses "iterate" and "converge" (iter-004 F60 overlap) but specifies "architecture decision" which implies a design decision with existing options. Deep-council is the best fit because architecture decisions typically involve comparing 2-3 proposed strategies via multi-seat deliberation. Deep-review is wrong because architecture decisions are opinion-based, not code defect finding. Deep-research is wrong because options likely already exist (operator says "the architecture decision" singular, implying a specific decision under deliberation).
- **Wrong-plausible sibling:** deep-review
- **Why wrong:** Operator might think "iterate on spec folder" maps to deep-review (spec-folder is a valid review_target_type), but "architecture decision" implies opinion synthesis, not code audit. Deep-review's adversarial P0 adjudication is inappropriate for design decisions.
- **Wrong-plausible sibling:** deep-research
- **Why wrong:** Operator might think "iterate until converges" maps to deep-research (newInfoRatio convergence), but "architecture decision" implies options exist and need comparison, not discovery. Deep-research is for discovering options, not comparing existing options.
- **Confidence:** LOW (genuinely contested)
- **Ambiguity source:** iter-004 F60 (operator-intent overlap on "iterate findings until convergence") + iter-004 F59 (operator-intent overlap on "evaluate architecture options")
- **Tie-breaker rationale:** Deep-council wins because (1) "architecture decision" strongly implies multi-seat deliberation on existing options, (2) deep-review's adversarial P0 adjudication is a poor fit for opinion-based decisions, (3) deep-research's newInfoRatio convergence assumes knowledge discovery, not option comparison. However, this fixture is intentionally ambiguous to test routing robustness — a clarifying question would be ideal in production.

## Distribution Verification

- **Deep-review fixtures:** F-fixture-001, F-fixture-004 (2 fixtures) ✓
- **Deep-research fixtures:** F-fixture-002, F-fixture-005, F-fixture-007 (3 fixtures) ✓
- **Deep-council fixtures:** F-fixture-003, F-fixture-006, F-fixture-008 (3 fixtures) ✓
- **Mixed-intent contested fixture:** F-fixture-008 (1 fixture) ✓
- **Total fixtures:** 8 fixtures (≥ 6 required) ✓

## Routing-Rule Preview

Based on the fixture suite, routing rules should address:

### Lexical Signals

1. **"Audit" disambiguation:**
   - "audit [code subsystem] for [defect/drift/hardening]" → deep-review (code-quality audit)
   - "audit [research packet] for [topic drift/findings consistency]" → deep-research (findings-consistency audit)
   - Signal: presence of code subsystem keywords (embedder, sidecar, lifecycle) vs research keywords (packet, topic, findings)

2. **"Convergence" disambiguation:**
   - "convergence on [investigation/research]" → deep-research (newInfoRatio)
   - "convergence on [review/audit]" → deep-review (Bayesian coverage-graph signals)
   - "council convergence" → deep-council (adjudicator-verdict stability)
   - Signal: secondary keyword after "convergence" (investigation vs review vs council)

3. **"Loop" disambiguation:**
   - "review loop" / "iterative review" → deep-review
   - "research loop" / "iterative research" → deep-research
   - Signal: presence of "review" vs "research" before/after "loop"

4. **"Evaluate options" disambiguation:**
   - "evaluate [number] proposed [strategies/options]" → deep-council (multi-seat deliberation)
   - "evaluate whether [capability] exists" → deep-research (knowledge discovery)
   - "evaluate [code] for [quality/defects]" → deep-review (code audit)
   - Signal: presence of count ("three proposed") implies existing options → deep-council; "whether" implies existence check → deep-research; code keywords → deep-review

### Structural Signals

1. **Target type detection:**
   - Spec-folder/skill/agent/track/files keywords → deep-review (requires review_target_type)
   - Research topic/question keywords → deep-research (single research_topic string)
   - Multi-topic/council/seat keywords → deep-council (multi-topic + multi-seat)

2. **Intent classification:**
   - Adversarial framing (audit, hardening, security, correctness) → deep-review
   - Knowledge discovery (investigate, whether exists, research charter) → deep-research
   - Opinion synthesis (deliberate, compare strategies, recommend best) → deep-council

3. **Convergence expectation:**
   - "findings stabilize" + severity expectations → deep-review (P0/P1/P2 tiers)
   - "new information stops" + negative knowledge → deep-research (newInfoRatio)
   - "verdict stability" + multi-seat → deep-council (adjudicator-verdict stability)

### Prior-Art Signals

1. **Artifact context:**
   - If operator references existing artifacts (review-report.md, research.md, council-report.md), route to the skill that produced that artifact type.
   - If operator references "deep-research packet," check whether intent is code audit (deep-review) or findings consistency (deep-research).

2. **Session state:**
   - If deep-review session exists in spec folder, "iterate on spec folder" likely means continue deep-review.
   - If deep-research session exists, "check convergence" likely means continue deep-research.
   - If deep-council session exists, "deliberate" likely means continue deep-council.

3. **Cost-guard awareness:**
   - Routing should surface the appropriate default convergence threshold when a skill is selected (0.10 for deep-review, 0.05 for deep-research, 0.20 for deep-council) to avoid operator surprise at iteration counts (iter-004 F56).

## Open Questions for Iter-006

1. **Saturation check:** If novelty rate < 0.2 across iter-004/005 fixtures, should we branch to synthesis (iter-007) or continue with iter-006 boundary-sharpening?
2. **Boundary-sharpening strategies:** If iter-006 is needed, which strategy should we prioritize: keep-distinct (enforce clear boundaries), merge (unify overlapping semantics), unify-mode (single deep-* with mode flags), or hybrid (retain distinct skills with routing clarification)?
3. **Clarification question protocol:** For LOW-confidence fixtures like F-fixture-008, should routing proactively ask clarifying questions (e.g., "Do options exist or need discovery?") or make a best-effort routing with explanation?
4. **Confidence calibration:** How should the advisor's confidence bands (HIGH/MED/LOW) map to the native advisor's confidence threshold (default 0.8)? Should LOW-confidence fixtures trigger uncertainty filtering?
5. **Fixture expansion:** Should iter-006 add more fixtures to cover edge cases (e.g., mixed-spec-folder-and-research-topic requests, cross-skill handoff scenarios)?
6. **Routing rule validation:** Should iter-006 implement a prototype routing rule set and test it against the fixture suite to measure accuracy before synthesis?
