---
executor: cli-devin
model: swe-1.6
iter: 4
started_at: 2026-05-23T08:20:00.000Z
finished_at: 2026-05-23T08:25:00.000Z
target_dimension: use-case-overlap
---

# Iter-004: Overlap-Surface Inventory Across Deep-* Skills

## Sources Read

1. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-001.md` — deep-review contract characterization
2. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-002.md` — deep-research contract characterization
3. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/iterations/iter-003.md` — deep-council contract characterization (proposed)
4. `.opencode/specs/skilled-agent-orchestration/130-deep-skills-unique-value-differentiation/research/findings-registry.json` — current registry for fingerprint dedup
5. `.opencode/skills/system-skill-advisor/SKILL.md` — skill advisor routing rules and overlap-detection guidance
6. `.opencode/commands/spec_kit/deep-review.md` — deep-review command entrypoint with keyword triggers
7. `.opencode/commands/spec_kit/deep-research.md` — deep-research command entrypoint with keyword triggers
8. `.opencode/skills/sk-ai-council/SKILL.md` — sk-ai-council skill with keyword triggers
9. `.opencode/skills/deep-review/SKILL.md` — deep-review skill with keyword triggers section
10. `.opencode/skills/deep-research/SKILL.md` — deep-research skill with keyword triggers section

## Overlap Findings

### F51 — Trigger-phrase overlap on "convergence" keyword
**Fingerprint:** `use-case-overlap:trigger-phrase:convergence-keyword`
**Severity:** CONFUSING
**Evidence:** Deep-review keyword triggers include "convergence detection" [SOURCE: .opencode/skills/deep-review/SKILL.md:112]. Deep-research keyword triggers include "convergence" in intent signals for CONVERGENCE phase [SOURCE: .opencode/skills/deep-research/SKILL.md:154]. Sk-ai-council keyword triggers include "council convergence" [SOURCE: .opencode/skills/sk-ai-council/SKILL.md:80]. An operator request like "check convergence on the deep-research packet" could route to any of the three skills, as all three have convergence-related triggers. This is confusing because convergence semantics differ significantly across skills (Bayesian coverage-graph signals for deep-review, newInfoRatio for deep-research, adjudicator-verdict stability for deep-council).

### F52 — Trigger-phrase overlap on "loop" keyword
**Fingerprint:** `use-case-overlap:trigger-phrase:loop-keyword`
**Severity:** CONFUSING
**Evidence:** Deep-review keyword triggers include "review loop" and "iterative review" [SOURCE: .opencode/skills/deep-review/SKILL.md:112]. Deep-research keyword triggers include "research loop" and "iterative research" [SOURCE: .opencode/skills/deep-research/SKILL.md:107]. An operator request like "run a loop on the spec folder" could route to either deep-review or deep-research, as both skills use "loop" terminology. This is confusing because the loop semantics differ (review dimensions vs research angles) and the output artifacts differ (review-report.md vs research.md).

### F53 — Trigger-phrase overlap on "deep" keyword
**Fingerprint:** `use-case-overlap:trigger-phrase:deep-keyword`
**Severity:** HELPFUL
**Evidence:** Deep-review keyword triggers include "deep review" [SOURCE: .opencode/skills/deep-review/SKILL.md:112]. Deep-research keyword triggers include "deep research" [SOURCE: .opencode/skills/deep-research/SKILL.md:107]. Sk-ai-council keyword triggers include "deep ai council" [SOURCE: .opencode/skills/sk-ai-council/SKILL.md:92]. All three skills use "deep" as a prefix. This overlap is HELPFUL because it signals to the operator that all three skills are part of the deep-* family and share the deep-loop runtime infrastructure. The overlap is not confusing because the second word disambiguates (review vs research vs council).

### F54 — Output-artifact overlap on findings-registry.json naming pattern
**Fingerprint:** `use-case-overlap:output-artifact:findings-registry-naming`
**Severity:** CONFUSING
**Evidence:** Deep-review uses `deep-review-findings-registry.json` [SOURCE: iter-001 F5]. Deep-research uses `findings-registry.json` (no skill prefix) [SOURCE: iter-002 F21]. Deep-council proposes `findings-registry.json` with canonical fingerprint schema [SOURCE: iter-003 F38]. The naming pattern overlap is confusing because deep-research and deep-council would both write files named `findings-registry.json` in their respective artifact directories, but the schema and semantics differ (evidence-shaped findings for deep-research vs opinion-shaped findings for deep-council). Deep-review's prefixed name is clearer. This could cause confusion when operators inspect artifact directories across different deep-* sessions.

### F55 — State-file ownership overlap on JSONL append-only pattern
**Fingerprint:** `use-case-overlap:state-file:jsonl-append-pattern`
**Severity:** HELPFUL
**Evidence:** All three skills use append-only JSONL state logs: deep-review uses `deep-review-state.jsonl` [SOURCE: iter-001 F8], deep-research uses `deep-research-state.jsonl` [SOURCE: iter-002 F24], deep-council proposes `session-state.jsonl` and `round-state.jsonl` [SOURCE: iter-003 F41]. The JSONL append-only pattern overlap is HELPFUL because it reflects shared deep-loop-runtime infrastructure (atomic-state, jsonl-repair primitives) [SOURCE: iter-003 F49]. The pattern is not confusing because the file names are skill-prefixed (deep-review, deep-research) or hierarchy-scoped (session/round for deep-council), making ownership clear.

### F56 — Convergence-threshold default divergence
**Fingerprint:** `use-case-overlap:convergence:threshold-default-divergence`
**Severity:** DANGEROUS
**Evidence:** Deep-review default convergenceThreshold is 0.10 [SOURCE: .opencode/commands/spec_kit/deep-review.md:106]. Deep-research default convergenceThreshold is 0.05 [SOURCE: .opencode/commands/spec_kit/deep-research.md:97]. Deep-council proposes saturation_threshold default of 0.20 [SOURCE: iter-003 F43]. This divergence is DANGEROUS because operators familiar with one skill's default may incorrectly assume the same default applies to other skills. The semantics also differ (weighted P0/P1/P2 ratio for deep-review, newInfoRatio for deep-research, adjudicator-verdict stability for deep-council). An operator requesting "run with default convergence" could get significantly different iteration counts and stop conditions across skills without realizing it.

### F57 — Executor-config flag set overlap
**Fingerprint:** `use-case-overlap:executor-config:flag-set-overlap`
**Severity:** HELPFUL
**Evidence:** All three skills accept the same executor configuration flags: `--executor`, `--model`, `--reasoning-effort`, `--service-tier`, `--executor-timeout` [SOURCE: .opencode/commands/spec_kit/deep-review.md:137-142; .opencode/commands/spec_kit/deep-research.md:124-129; iter-003 F36]. All three support the same 6 executor kinds: native, cli-codex, cli-gemini, cli-claude-code, cli-opencode, cli-devin [SOURCE: iter-001 F4, iter-002 F20, iter-003 F36]. This overlap is HELPFUL because it provides a consistent executor configuration surface across the deep-* family, reducing operator cognitive load. The overlap is not confusing because the executor contract is shared via deep-loop-runtime's executor-config.ts [SOURCE: .opencode/commands/spec_kit/deep-review.md:157].

### F58 — Operator-intent overlap on "audit the deep-research packet drift"
**Fingerprint:** `use-case-overlap:operator-intent:audit-research-packet`
**Severity:** CONFUSING
**Evidence:** An operator request "audit the deep-research packet drift" could route to either deep-review (audit code quality of the research packet implementation) or deep-research (audit the research findings for drift from original topic). Deep-review supports spec-folder review target type [SOURCE: iter-001 F3], which would cover the research packet folder. Deep-research can be invoked on the same topic to re-investigate. The right skill is ambiguous without additional context about whether the operator wants code-quality audit (deep-review) or findings-consistency audit (deep-research). This is confusing because both skills can legitimately claim jurisdiction over "auditing a research packet."

### F59 — Operator-intent overlap on "evaluate options for architecture decision"
**Fingerprint:** `use-case-overlap:operator-intent:evaluate-architecture-options`
**Severity:** CONFUSING
**Evidence:** An operator request "evaluate options for architecture decision" could route to deep-research (research architecture patterns and trade-offs), deep-review (review existing architecture code for quality), or deep-council (multi-seat deliberation on architecture strategy). Deep-research is appropriate for discovering architecture options via investigation. Deep-review is appropriate if architecture code already exists and needs quality audit. Deep-council is appropriate for comparing 2-3 proposed architecture strategies via multi-seat deliberation. The right skill is ambiguous without context about whether options exist (deep-council), need discovery (deep-research), or need code audit (deep-review). This is confusing because all three skills can legitimately claim jurisdiction over "evaluating architecture options."

### F60 — Operator-intent overlap on "iterate findings until convergence"
**Fingerprint:** `use-case-overlap:operator-intent:iterate-findings-convergence`
**Severity:** DANGEROUS
**Evidence:** An operator request "iterate findings until convergence" could route to any of the three skills, as all three use iterative loops with convergence detection. However, the convergence semantics and finding types differ significantly: deep-review uses P0/P1/P2 severity tiers with weighted ratio [SOURCE: iter-001 F11], deep-research uses newInfoRatio without severity tiers [SOURCE: iter-002 F27], deep-council uses adjudicator-verdict stability without severity tiers [SOURCE: iter-003 F43]. An operator expecting P0/P1/P2 severity classification (deep-review style) would get a different experience if routed to deep-research or deep-council. This is DANGEROUS because the operator's mental model of "findings" and "convergence" may not match the actual skill's semantics, leading to unexpected iteration counts and stop conditions.

### F61 — State-file overlap on strategy.md ownership pattern
**Fingerprint:** `use-case-overlap:state-file:strategy-ownership-pattern`
**Severity:** HELPFUL
**Evidence:** All three skills use a strategy.md file owned by the main loop: deep-review uses `deep-review-strategy.md` [SOURCE: iter-001 F8], deep-research uses `deep-research-strategy.md` [SOURCE: iter-002 F24], deep-council proposes `topic-config.json` (functionally equivalent to strategy) [SOURCE: iter-003 F41]. The strategy ownership pattern overlap is HELPFUL because it reflects shared deep-loop-runtime infrastructure and provides a consistent "main loop owns strategy, LEAF agent owns iteration artifacts" pattern [SOURCE: iter-001 F9, iter-002 F25, iter-003 F42]. The overlap is not confusing because the file names are skill-prefixed or hierarchy-scoped, making ownership clear.

### F62 — Output-artifact overlap on synthesis report structure
**Fingerprint:** `use-case-overlap:output-artifact:synthesis-report-structure`
**Severity:** CONFUSING
**Evidence:** Deep-review outputs `review-report.md` with 9 sections [SOURCE: iter-001 F7]. Deep-research outputs `research.md` with 17 sections [SOURCE: iter-002 F23]. Deep-council proposes `council-report.md` with 12 sections per topic plus optional `session-report.md` [SOURCE: iter-003 F39, F40]. All three are synthesis reports that aggregate iteration findings, but the section structures differ significantly. An operator expecting a 9-section review-report style would get a different structure if routed to deep-research (17 sections) or deep-council (12 sections). This is confusing because the operator's mental model of "synthesis report" may not match the actual skill's output structure, leading to difficulty locating specific information (e.g., "Coverage" section exists in review-report.md but not in research.md).

## Implications for Routing (Preview of Iter-008)

The overlap findings suggest routing rules should address:

1. **Convergence keyword disambiguation**: Route "convergence" requests based on secondary keywords (e.g., "convergence detection" → deep-review, "convergence on research" → deep-research, "council convergence" → deep-council).

2. **Loop keyword disambiguation**: Route "loop" requests based on secondary keywords (e.g., "review loop" → deep-review, "research loop" → deep-research).

3. **Audit intent clarification**: For "audit X" requests, ask clarifying question about audit type (code-quality audit → deep-review, findings-consistency audit → deep-research, strategy comparison → deep-council).

4. **Architecture decision routing**: For "evaluate architecture options" requests, ask clarifying question about whether options exist (yes → deep-council), need discovery (deep-research), or need code audit (deep-review).

5. **Convergence threshold awareness**: Routing should surface the appropriate default convergence threshold when a skill is selected, to avoid operator surprise at iteration counts.

6. **Synthesis report expectation management**: Routing should inform the operator of the expected synthesis report structure (9-section review-report vs 17-section research vs 12-section council-report) when a skill is selected.

## Open Questions for Iter-005

1. What are the 6+ fixture prompts where the right deep-* skill is non-obvious?
2. For each fixture prompt, what is the expected winner skill and rationale?
3. Should fixture prompts include operator context hints (e.g., "code exists" vs "options exist") to test routing robustness?
4. Should fixture prompts test ambiguous convergence requests (e.g., "check convergence") to test keyword disambiguation?
5. Should fixture prompts test audit intent ambiguity (e.g., "audit the research packet") to test clarification questions?
6. Should fixture prompts test architecture decision ambiguity (e.g., "evaluate architecture options") to test multi-skill candidacy?
7. How should fixture prompts be structured to support automated routing accuracy testing in iter-008?
