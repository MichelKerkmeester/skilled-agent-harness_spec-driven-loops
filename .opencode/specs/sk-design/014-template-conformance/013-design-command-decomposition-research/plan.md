---
title: "Implementation Plan: /interface:design command decomposition research"
description: "Three-phase plan: dispatch two independent 10-iteration deep-research lineages (cli-devin/glm-5-2 and cli-cursor/composer-2.5) against the five decomposition research questions, then compare their converged syntheses without merging them."
trigger_phrases:
  - "design command decomposition research plan"
  - "interface design command split plan"
  - "sk-design command surface research plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/013-design-command-decomposition-research"
    last_updated_at: "2026-07-27T14:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored three-phase plan"
    next_safe_action: "Dispatch Lineage A and Lineage B, 10 forced iterations each"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: /interface:design command decomposition research
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts + `/deep:research`-style iterative loop |
| **Framework** | Two independent lineages via `cli-devin` (`glm-5-2`) and `cli-cursor` (`composer-2.5`), both free-tier models |
| **Storage** | `research/lineages/{glm,composer}/` under this packet |
| **Testing** | Convergence-gate presence (10 completed iterations each), synthesis structure check (ranked + confidence + "not worth doing"), cross-lineage comparison completeness |

### Overview
Three phases. Phase 1 sets up the shared evidence base both lineages will reason from (the current `design-interface/SKILL.md` lane structure, argument lanes, and `INTENT_SIGNALS`/`RESOURCE_MAP` tables) and the fixed iteration-prompt framing (five research questions + hard constraint) so both lineages answer the same questions under the same guardrail. Phase 2 dispatches the two lineages, each forced to 10 iterations, producing an independent converged synthesis per lineage. Phase 3 compares the two syntheses — agreement, disagreement, and which disagreement is most load-bearing — without blending them into one answer, and verifies the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The five research questions and the hard constraint are stated identically in both lineages' iteration framing (no drift between the two prompts).
- [ ] `design-interface/SKILL.md`'s current lane structure, argument lanes, and `INTENT_SIGNALS`/`RESOURCE_MAP` tables are confirmed stable for the loop's duration (no concurrent sibling packet touches them, per this spec's Risks).

### Definition of Done
- [ ] Both `research/lineages/glm/` and `research/lineages/composer/` show 10 completed iterations each.
- [ ] Each lineage's synthesis is ranked by value-to-cost with explicit confidence, and carries a "not worth doing" section.
- [ ] A cross-lineage comparison names concrete agreements and disagreements.
- [ ] No recommendation in either synthesis reads as "split it because it's big" without a demonstrated problem and stated cost.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two parallel, independent deep-research lineages reasoning over the same fixed evidence base and question set, deliberately not cross-pollinated during the loop — the value is in comparing unbiased independent conclusions, not in producing one blended answer.

### Key Components
- **Shared evidence base**: `design-interface/SKILL.md`'s lane structure (5 argument lanes, 12 internal lanes), `INTENT_SIGNALS`, `RESOURCE_MAP`.
- **Lineage A**: `research/lineages/glm/` — `cli-devin` · `glm-5-2` (GLM-5.2 High, 200K context, free tier), 10 forced iterations.
- **Lineage B**: `research/lineages/composer/` — `cli-cursor` · `composer-2.5` (Cursor's native model), 10 forced iterations.
- **Comparison layer**: cross-lineage agreement/disagreement analysis, produced only after both lineages independently converge.

### Data Flow
Fix the shared evidence base and question framing -> dispatch Lineage A and Lineage B independently (no shared intermediate state between them) -> each runs 10 forced iterations toward its own converged, ranked, confidence-scored synthesis with a "not worth doing" section -> once both converge, compare the two syntheses for agreement/disagreement -> verify the packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the five research questions and hard constraint text match this packet's `spec.md` verbatim in both lineages' iteration framing.
- [ ] Snapshot `design-interface/SKILL.md`'s current lane structure, argument lanes, and `INTENT_SIGNALS`/`RESOURCE_MAP` tables as the shared, stable evidence base for both lineages.
- [ ] Create `research/lineages/glm/` and `research/lineages/composer/` directories.

### Phase 2: Implementation
- [ ] Dispatch Lineage A: `cli-devin` (`glm-5-2`), 10 forced iterations, no early convergence stop.
- [ ] Dispatch Lineage B: `cli-cursor` (`composer-2.5`), 10 forced iterations, no early convergence stop.
- [ ] Each lineage produces its own converged synthesis: recommendations ranked by value-to-cost with explicit confidence, plus a "not worth doing" section.
- [ ] Each lineage's synthesis addresses all five research questions explicitly, including "no evidence found" where applicable.

### Phase 3: Verification
- [ ] Confirm both lineages show 10 completed iteration records.
- [ ] Confirm each synthesis is ranked, confidence-scored, and carries a "not worth doing" section.
- [ ] Produce the cross-lineage comparison: named agreements, named disagreements, and which disagreement is most load-bearing for a future decision.
- [ ] Spot-check every ranked-above-"not worth doing" recommendation against the hard constraint (demonstrated problem, smallest fix, stated cost).
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/013-design-command-decomposition-research --strict` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Iteration-count check | Both lineages reach exactly 10 completed iterations | Directory/record count under `research/lineages/{glm,composer}/` |
| Synthesis-structure check | Ranked + confidence + "not worth doing" present in each lineage's synthesis | Manual read-through of each synthesis document |
| Constraint-compliance check | Every ranked recommendation states a demonstrated problem, smallest fix, and cost | Manual read-through against the hard constraint |
| Comparison-completeness check | Cross-lineage comparison names concrete agreements and disagreements, not vague summary | Manual read-through of the comparison section |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `cli-devin` (`glm-5-2` free tier) availability | External | Assumed available | Lineage A cannot start; Phase 2 blocked for that lineage only |
| `cli-cursor` (`composer-2.5`) availability | External | Assumed available | Lineage B cannot start; Phase 2 blocked for that lineage only |
| Sibling packets `011-retirement-residue` and `012-remaining-mode-conformance` not touching `design-interface/SKILL.md`'s lane/intent tables | Internal | Per their own stated scope, they do not | If violated, re-snapshot the evidence base before continuing either lineage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A lineage stalls (model unavailable) mid-loop, or a synthesis is found to violate the hard constraint pervasively (most recommendations lack a demonstrated problem).
- **Procedure**: For a stalled lineage, resume from the last completed iteration once the model tier is available again — no re-start from iteration 1. For a constraint-violating synthesis, flag the specific recommendations as "not worth doing" during Phase 3 review rather than re-running the whole lineage; only re-run if the violation is pervasive enough that the synthesis itself is unusable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) --> Phase 2 (Implementation: Lineage A + Lineage B, independent) --> Phase 3 (Verification: compare + validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation (both lineages converged) | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Both lineages' iteration framing verified identical (research questions + hard constraint) before dispatch.
- [ ] Evidence-base snapshot recorded before either lineage starts.

### Rollback Procedure
1. **Immediate**: If a lineage's synthesis is unusable (pervasive constraint violations, or fewer than 10 completed iterations), do not fold it into the cross-lineage comparison yet.
2. **Revert code**: Not applicable — no runtime code changes; only research artifacts revert (delete and re-run the affected lineage's directory).
3. **Verify**: Re-run the synthesis-structure and constraint-compliance checks after the fix.

### Data Reversal
- **Has data migrations?** No — research artifacts only, no runtime or data changes.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN
- Two independent parallel research lineages, compared not merged
- Research-only; no command decomposition executed in this packet
-->
