---
title: "Implementation Plan: Skill Advisor - Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Default-off implementation plan for three Skill Advisor routing refinements riding the RRF spine: C1 conflict demotion, QCR query-class lane weights and C6 top-K exact semantic rerank. Live/default promotion remains gated by conflict-edge and benchmark evidence."
trigger_phrases:
  - "advisor conflict rerank routing plan"
  - "C1 post-fusion demotion sequencing"
  - "QCR benchmark gate plan"
  - "C6 top-K rerank after RRF spine"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off C1/QCR/C6 scorer seams and deterministic unit coverage"
    next_safe_action: "Run live conflict and benchmark gates"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-005-conflict-rerank-query-routing"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Skill Advisor - Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | Skill Advisor 5-lane fusion scorer (`lib/scorer/fusion.ts`, `lanes/graph-causal.ts`, `lanes/semantic-shadow.ts`) |
| **Storage** | skill-graph.sqlite (projection + `skill_edges`), embeddings cache (semantic-shadow lane) |
| **Testing** | vitest |

### Overview
Three routing-quality refinements ride the RRF determinism spine and are now implemented as additive, reversible, default-off scorer seams. C1 preserves `conflicts_with` mass as a post-fusion demotion and metric counter, it still changes zero live routing until a reciprocal edge exists. QCR adds a query class → per-lane multiplier path through `effectiveScorerWeights`, but the flag is off by default and live/default use remains benchmark-gated. C6 re-scores the fused top-K with full-precision cosine as a bounded rerank window, but only when both RRF and the exact-rerank flag are enabled. The plan remains gate-first for promotion: code can be tested behind flags, live/default behavior waits for conflict-edge and benchmark evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (C1/QCR/C6 + each gate)
- [x] Success criteria measurable (per-candidate invariants, default-inert when gate unmet)
- [x] Dependencies identified (001 RRF spine for all three, declared conflict edge for C1, held-out benchmark for QCR)
- [x] RRF spine exists as default-off infrastructure
- [ ] Live/default promotion gates materialized (C1 dormant-data, QCR needs-benchmark, C6 benchmark/recall acceptance)

### Definition of Done
- [x] Each candidate is implemented only as a default-off seam, with live/default promotion gates still explicit
- [x] Tests passing (per-candidate fixtures plus default-inert assertions)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary), live C1 dormancy re-check deferred by the no-live-data constraint
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive post-fusion / pre-fusion scorer-seam refinements layered on the deterministic-RRF spine, mirroring aionforge's query-class router and dense exact-rerank patterns, but staying additive and never replacing the dominant `explicit_author` lane. Each refinement is default-inert while its flag or live gate is unset.

### Key Components
- **C1 - post-fusion conflict demotion**: graph-causal split output keeps positive propagation in the opt-in RRF lane and conflict mass in the comparator, metrics expose `spec_kit.scorer.graph_conflict_demote_applied_total`.
- **QCR - class→lane-weight router**: `classifyAdvisorQuery` maps prompts to a small class set, class multipliers feed through `effectiveScorerWeights` only when `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING=true`, `explicit_author` remains the strongest lane.
- **C6 - top-K exact-rerank**: `scoreSemanticShadowExactSubset` reuses full-precision vectors for the fused top-K and bypasses the 0.2 cutoff only for that subset, the comparator applies exact cosine only inside a bounded score window and falls back to RRF rank then skill id.

### Data Flow
Prompt → (QCR, if flag enabled) class classification → class→lane-multiplier into `effectiveScorerWeights` → per-lane scores → weighted sum by default or opt-in deterministic RRF → (C6, if both flags enabled) top-K exact-cosine rerank window → (C1, if RRF enabled and conflict mass exists) post-fusion `conflicts_with` demotion in the comparator → ranked recommendations. With flags disabled the path is exactly today's weighted-sum behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

These are scorer-seam changes touching the ranking comparator, the effective-weight merge and a confidence/ordering-bearing output, so the affected-surface inventory applies. All rows are conditional on the candidate being promoted past its gate.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graph-causal.ts:18` `conflicts_with: -0.35` | Signed multiplier folded into the `graph_causal` lane sum, negative mass emitted but not enqueued (`:77`) | C1: stop folding into the lane sum, surface the conflict mass for the comparator | C1 fixture: demotion applied in the comparator, not the lane, inert when no conflict edge exists |
| `fusion.ts:425-433` ranking comparator | Sorts by `(score + commandBonus + intent)` then `localeCompare` (`:432`) | C1: add a deterministic `conflicts_with` demotion term beside `primaryIntentBonus` (`:428-430`) with an applied-counter | Deterministic tiebreak preserved, counter increments only when a conflict edge fires |
| `fusion.ts:69-82` `effectiveScorerWeights` | Merges a `laneWeightsOverride` into the lane weights | QCR: compute a class→lane-multiplier and feed it here before the per-skill loop, `explicit_author` stays dominant | Shadow-only by default, held-out benchmark shows net routing-quality gain before any live weight change |
| `fusion.ts:425+` post-rank | Fused ranking output | C6: top-K exact-cosine rerank tiebreak after C3 fusion | Byte-stable re-order via skill-id tiebreak, no recall regression vs the exhaustive pass |
| `semantic-shadow.ts:47-69,194-199` | `cosineSimilarity` + cached full-precision vectors (pre-fusion lane, 0.2 cutoff) | C6: REUSE for the top-K rerank, the pre-fusion 0.2-cutoff path is unchanged | The cutoff bypass applies ONLY to the top-K subset, the lane's own pass is untouched |
| `effectiveScorerWeights` consumers / `primaryIntentBonus` table | Existing intent surfaces | QCR generalizes the per-`(phrase,skill)` table, do NOT silently change its outputs | Grep `primaryIntentBonus` consumers, QCR is additive, not a replacement of the existing bonus until benchmarked |

Required invariant: when a candidate's gate is unmet it is ABSENT from the scorer (no default-on behavior), C1 is a no-op under empty `conflicts_with`, QCR is shadow-only, C6 does not exist before C3.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the RRF spine status - default-off infrastructure exists, so C6 can ship only behind flags
- [ ] Re-verify the C1 dormancy against live data before any live/default promotion (deferred by this task's no-live-data constraint)

### Phase 2: Core Implementation
- [x] C1 default-off carrier: conflict mass demotes in the comparator and increments its own counter when RRF is enabled and conflict mass exists (REQ-002)
- [x] QCR default-off seam: class→lane-multiplier through `effectiveScorerWeights`, flag-gated, `explicit_author`-dominant (REQ-003/REQ-006)
- [x] C6 default-off seam: top-K exact-cosine rerank on the RRF survivor set, bounded by score window and deterministic fallback (REQ-004/REQ-007)

### Phase 3: Verification
- [x] Per-candidate fixtures (C1 applied-counter and demotion, QCR default-off/additive/dominant, C6 exact subset cutoff bypass and deterministic bounded rerank)
- [x] `tsc` + broad advisor test suite green
- [ ] Live routing-quality and recall benchmarks before any default/live promotion
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | C1 post-fusion demotion: deterministic comparator term, applied-counter increments only on a real conflict edge, inert when all `conflicts_with []` | vitest |
| Unit | QCR class→lane-multiplier: additive, `explicit_author` stays dominant, shadow-only by default (no live weight change) | vitest |
| Unit | C6 top-K exact-rerank: byte-stable re-order via skill-id tiebreak, 0.2-cutoff bypass scoped to top-K only | vitest |
| Regression | With each gate unmet, scorer output matches the C3-only (or pre-spine weighted-sum) baseline exactly - no default-on behavior | vitest |
| Benchmark | QCR held-out routing-quality on a representative prompt corpus (gate for promotion, measures the misrouted-class false positive) | vitest + fixture corpus |
| Recall | C6 does not reduce recall vs the exhaustive cosine pass | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 RRF determinism spine (sibling `001-rrf-determinism-spine`, C3) | Sibling 028/003 sub-phase | Shipped default-off (`ce858fa165`, not in 030 Wave-0) | HARD - all three ride it, C6 cannot ship byte-stable without C3's rank-based survivor set [CONFIRMED: research.md C3, iter-004 F9] |
| Reciprocal `conflicts_with` skill edge | Data / authoring decision | Absent (0 live edges, all metadata `[]`) | HARD for C1 - C1 changes zero routing until an edge exists, do NOT fabricate edges [CONFIRMED: iter-010, verified live 2026-06-19] |
| Held-out routing-quality benchmark + QCR class taxonomy + per-class multipliers | Internal (this track, gate) | Pending | HARD for QCR - no demonstrated mis-routing, the costly error is a misrouted class demoting the right skill [CONFIRMED: roadmap.md:75,193] |
| aionforge query-class router + dense exact-rerank reference | External doc | Green | Reference pattern only, not a code dep [CONFIRMED: retrieval.md:107-143, :25-31] |
| C5/C5a/AMB (graceful lane-degrade) | Sibling 028/003 sub-phase | Independent | None - separate degrade unit, off this track [CONFIRMED: roadmap.md:90-91] |
| C4 / Beta posterior / SA-two-gate chain | Sibling 028/003 sub-phase | Out of scope | None - C1/QCR/C6 ship before/independent of the C4 Phase-2/3 chain [CONFIRMED: iter-010 "do not prioritize C1 above the C4 gate"] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A promoted candidate regresses routing - QCR misroutes and demotes the right skill, C6 re-orders non-deterministically or drops recall or C1's demotion fires when it should be inert.
- **Procedure**: Revert the per-candidate commit (branch-only, never pushed to main or deployed without explicit go). Each candidate is a self-contained, additive scorer-seam edit, reverting restores the C3-only (or pre-spine weighted-sum) behavior exactly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup / gate-verify) ──┐
                                ├──► Phase 2 (Core: C1 | QCR | C6) ──► Phase 3 (Verify)
001 RRF spine (C3) ─────────────┘   (each candidate gated independently)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (gate-verify) | 001 RRF spine status, live `conflicts_with` check | Core |
| Core: C1 | Setup + a declared reciprocal conflict edge | Verify (C1) |
| Core: QCR | Setup + a held-out routing benchmark + class taxonomy | Verify (QCR) |
| Core: C6 | Setup + the 001 RRF spine (C3) shipped | Verify (C6) |
| Verify | Whichever Core candidate was promoted | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (gate-verify) | Low | ~30m (RRF-spine status + live `conflicts_with` query) |
| C1 (when promoted) | Med | ~2-4h (comparator demotion + counter + inert-fixture), research effort M |
| QCR (when promoted) | Med | ~1-2d incl. the held-out benchmark + taxonomy calibration, research effort M |
| C6 (when promoted) | Med | ~3-5h (top-K rerank + byte-stable tiebreak + recall check), research effort M, depends on C3 |
| Verification | Med | ~2-3h per promoted candidate (fixtures + adversarial review) |
| **Total** | | **Deferred - 0h until a gate materializes, per-candidate estimates above when unblocked** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The promoted candidate's gate is confirmed materialized (declared conflict edge / benchmark result / C3 shipped)
- [ ] Shadow-weight path used for QCR (no live weight change on first ship)
- [ ] Default-inert assertion green for the still-deferred candidates

### Rollback Procedure
1. Revert the per-candidate commit (branch-only) - the change is additive and self-contained
2. Confirm the scorer output returns to the C3-only (or pre-spine weighted-sum) baseline
3. Re-run the default-inert / baseline regression fixture to verify the revert restored prior behavior
4. No stakeholder notification needed (branch-only, nothing deployed)

### Data Reversal
- **Has data migrations?** No - none of C1/QCR/C6 touch schema or persisted data (C1 reads existing graph edges, QCR/C6 are compute-only).
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
