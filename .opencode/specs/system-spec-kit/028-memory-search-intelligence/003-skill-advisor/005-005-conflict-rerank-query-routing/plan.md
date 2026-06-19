---
title: "Implementation Plan: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Gate-first sequencing for three deferred routing refinements that all ride the 001 RRF spine: hold each PENDING until its gate materializes (a declared reciprocal conflict edge for C1, a held-out routing benchmark for QCR, the shipped C3 rank-based survivor set for C6), then implement each as an additive, reversible, default-inert scorer-seam change."
trigger_phrases:
  - "advisor conflict rerank routing plan"
  - "C1 post-fusion demotion sequencing"
  - "QCR benchmark gate plan"
  - "C6 top-K rerank after RRF spine"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C1/QCR/C6 deferred-routing impl plan (re-plan; all PENDING)"
    next_safe_action: "Hold until 001 RRF spine ships and each candidate gate materializes"
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
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)

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
| **Storage** | skill-graph.sqlite (projection + `skill_edges`); embeddings cache (semantic-shadow lane) |
| **Testing** | vitest |

### Overview
Three deferred routing-quality refinements that ALL ride the 001 RRF determinism spine (sibling `001-001-rrf-determinism-spine`, candidate C3 — "fuse by RANK, not raw score") and are each individually un-actionable today. C1 lifts the `conflicts_with: -0.35` mass out of the `graph_causal` lane sum into a deterministic post-fusion demotion in the sort comparator (like `primaryIntentBonus`), but the path is DORMANT — 0 `conflicts_with` edges live, every skill declares `[]`, so C1 changes zero routing until a reciprocal edge exists [CONFIRMED: iter-006, iter-010]. QCR adds an intent class → per-lane weight multiplier through `effectiveScorerWeights` (`fusion.ts:69-82`), additive and `explicit_author`-dominant, but it is benchmark-gated speculation with no demonstrated mis-routing [CONFIRMED: iter-001 Q1; roadmap.md:75,193]. C6 re-scores the fused top-K with full-precision cosine as a bounded tiebreak, but it needs C3's rank-based survivor set to stay byte-stable [CONFIRMED: iter-003 C6]. The plan is gate-first: keep each PENDING, verify its gate, then implement only the unblocked one as an additive, reversible, default-inert change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (C1/QCR/C6 + each gate)
- [x] Success criteria measurable (per-candidate invariants; default-inert when gate unmet)
- [x] Dependencies identified (001 RRF spine for all three; declared conflict edge for C1; held-out benchmark for QCR)
- [ ] Each candidate's gate materialized (none has today: C1 dormant-data + spine; QCR needs-benchmark + spine; C6 spine)

### Definition of Done
- [ ] Each candidate stays PENDING until its gate materializes, OR is implemented under its invariant once unblocked (REQ-002..004)
- [ ] Tests passing (per-candidate fixtures when promoted; default-inert assertion otherwise)
- [ ] Docs updated (spec/plan/tasks/implementation-summary; the C1 dormancy re-verified live)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive post-fusion / pre-fusion scorer-seam refinements layered on the 001 deterministic-RRF spine, mirroring aionforge's query-class router (`retrieval.md:107-143`) and dense exact-rerank (`retrieval.md:25-31`), but staying additive and never replacing the dominant `explicit_author` lane. Each refinement is default-inert when its gate is unmet.

### Key Components
- **C1 — post-fusion conflict demotion (`fusion.ts:425-433`)**: lift the `conflicts_with: -0.35` mass out of `graph-causal.ts:18` (which today emits it into the lane sum) and apply it as a bounded subtractive demotion in the ranking comparator beside `primaryIntentBonus` (`fusion.ts:428-430`), deterministic and auditable with its own applied-counter (like `primary_intent_bonus_applied_total`). Inert while all `conflicts_with` are `[]` [CONFIRMED: iter-006].
- **QCR — class→lane-weight router (`fusion.ts:69-82`)**: a small query-class classifier computes a class→lane-multiplier and feeds it through the existing `effectiveScorerWeights` merge (which already accepts a `laneWeightsOverride`) BEFORE the per-skill loop, keeping `explicit_author` dominant. Shipped behind shadow weights; generalizes the hand-maintained `primaryIntentBonus` table [CONFIRMED: iter-001 Q1; iter-004 QCR].
- **C6 — top-K exact-rerank (`fusion.ts:425+`, reusing `semantic-shadow.ts:47-69,194-199`)**: after the C3 rank-based fusion, re-score the top-K survivors with full-precision cosine (bypassing the 0.2 cutoff for that subset only) as a bounded tiebreak/boost with a deterministic skill-id tiebreak.

### Data Flow
Prompt → (QCR, if promoted) class classification → class→lane-multiplier into `effectiveScorerWeights` → per-lane scores → C3 deterministic RRF fusion (rank-based survivor set) → (C6, if promoted) top-K exact-cosine rerank tiebreak → (C1, if promoted) post-fusion `conflicts_with` demotion in the comparator → ranked recommendations. When a candidate's gate is unmet it is absent from the flow and the path is exactly today's weighted-sum (pre-spine) or C3-only (post-spine) behavior.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

These are scorer-seam changes touching the ranking comparator, the effective-weight merge, and a confidence/ordering-bearing output, so the affected-surface inventory applies. All rows are conditional on the candidate being promoted past its gate.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `graph-causal.ts:18` `conflicts_with: -0.35` | Signed multiplier folded into the `graph_causal` lane sum; negative mass emitted but not enqueued (`:77`) | C1: stop folding into the lane sum; surface the conflict mass for the comparator | C1 fixture: demotion applied in the comparator, not the lane; inert when no conflict edge exists |
| `fusion.ts:425-433` ranking comparator | Sorts by `(score + commandBonus + intent)` then `localeCompare` (`:432`) | C1: add a deterministic `conflicts_with` demotion term beside `primaryIntentBonus` (`:428-430`) with an applied-counter | Deterministic tiebreak preserved; counter increments only when a conflict edge fires |
| `fusion.ts:69-82` `effectiveScorerWeights` | Merges a `laneWeightsOverride` into the lane weights | QCR: compute a class→lane-multiplier and feed it here before the per-skill loop; `explicit_author` stays dominant | Shadow-only by default; held-out benchmark shows net routing-quality gain before any live weight change |
| `fusion.ts:425+` post-rank | Fused ranking output | C6: top-K exact-cosine rerank tiebreak after C3 fusion | Byte-stable re-order via skill-id tiebreak; no recall regression vs the exhaustive pass |
| `semantic-shadow.ts:47-69,194-199` | `cosineSimilarity` + cached full-precision vectors (pre-fusion lane, 0.2 cutoff) | C6: REUSE for the top-K rerank; the pre-fusion 0.2-cutoff path is unchanged | The cutoff bypass applies ONLY to the top-K subset; the lane's own pass is untouched |
| `effectiveScorerWeights` consumers / `primaryIntentBonus` table | Existing intent surfaces | QCR generalizes the per-`(phrase,skill)` table; do NOT silently change its outputs | Grep `primaryIntentBonus` consumers; QCR is additive, not a replacement of the existing bonus until benchmarked |

Required invariant: when a candidate's gate is unmet it is ABSENT from the scorer (no default-on behavior); C1 is a no-op under empty `conflicts_with`; QCR is shadow-only; C6 does not exist before C3.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the 001 RRF spine (sibling `001-001-rrf-determinism-spine`, candidate C3) status — all three candidates ride it; do not start C6 before C3 ships
- [ ] Re-verify the C1 dormancy against live data: `skill-graph.sqlite skill_edges` `conflicts_with` count and the `graph-metadata.json` `conflicts_with` arrays (REQ-005)

### Phase 2: Core Implementation
- [ ] C1 (only if a reciprocal `conflicts_with` edge now exists): lift the conflict mass out of the lane sum into a deterministic post-fusion demotion in the comparator, with its own applied-counter (REQ-002)
- [ ] QCR (only if a held-out routing-quality benchmark + calibrated class taxonomy exist): class→lane-multiplier through `effectiveScorerWeights`, shadow-only, `explicit_author`-dominant (REQ-003/REQ-006)
- [ ] C6 (only after C3 ships): top-K exact-cosine rerank tiebreak on the rank-based survivor set, byte-stable via skill-id tiebreak, no recall regression (REQ-004/REQ-007)

### Phase 3: Verification
- [ ] Per-candidate fixtures (C1 inert-under-empty-edges + deterministic; QCR additive + dominant + shadow-only; C6 byte-stable + no recall regression)
- [ ] `tsc` + advisor test suite green; independent adversarial review (refute QCR mis-routing, C6 non-determinism, C1 over-eager demotion)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | C1 post-fusion demotion: deterministic comparator term; applied-counter increments only on a real conflict edge; inert when all `conflicts_with []` | vitest |
| Unit | QCR class→lane-multiplier: additive, `explicit_author` stays dominant, shadow-only by default (no live weight change) | vitest |
| Unit | C6 top-K exact-rerank: byte-stable re-order via skill-id tiebreak; 0.2-cutoff bypass scoped to top-K only | vitest |
| Regression | With each gate unmet, scorer output matches the C3-only (or pre-spine weighted-sum) baseline exactly — no default-on behavior | vitest |
| Benchmark | QCR held-out routing-quality on a representative prompt corpus (gate for promotion; measures the misrouted-class false positive) | vitest + fixture corpus |
| Recall | C6 does not reduce recall vs the exhaustive cosine pass | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 RRF determinism spine (sibling `001-001-rrf-determinism-spine`, C3) | Sibling 028/003 sub-phase | Pending (not in 030 Wave-0 advisor scope) | HARD — all three ride it; C6 cannot ship byte-stable without C3's rank-based survivor set [CONFIRMED: research.md C3; iter-004 F9] |
| Reciprocal `conflicts_with` skill edge | Data / authoring decision | Absent (0 live edges; all metadata `[]`) | HARD for C1 — C1 changes zero routing until an edge exists; do NOT fabricate edges [CONFIRMED: iter-010; verified live 2026-06-19] |
| Held-out routing-quality benchmark + QCR class taxonomy + per-class multipliers | Internal (this track, gate) | Pending | HARD for QCR — no demonstrated mis-routing; the costly error is a misrouted class demoting the right skill [CONFIRMED: roadmap.md:75,193] |
| aionforge query-class router + dense exact-rerank reference | External doc | Green | Reference pattern only; not a code dep [CONFIRMED: retrieval.md:107-143, :25-31] |
| C5/C5a/AMB (graceful lane-degrade) | Sibling 028/003 sub-phase | Independent | None — separate degrade unit; off this track [CONFIRMED: roadmap.md:90-91] |
| C4 / Beta posterior / SA-two-gate chain | Sibling 028/003 sub-phase | Out of scope | None — C1/QCR/C6 ship before/independent of the C4 Phase-2/3 chain [CONFIRMED: iter-010 "do not prioritize C1 above the C4 gate"] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A promoted candidate regresses routing — QCR misroutes and demotes the right skill, C6 re-orders non-deterministically or drops recall, or C1's demotion fires when it should be inert.
- **Procedure**: Revert the per-candidate commit (branch-only; never pushed to main or deployed without explicit go). Each candidate is a self-contained, additive scorer-seam edit; reverting restores the C3-only (or pre-spine weighted-sum) behavior exactly.
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
| Setup (gate-verify) | 001 RRF spine status; live `conflicts_with` check | Core |
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
| C1 (when promoted) | Med | ~2-4h (comparator demotion + counter + inert-fixture); research effort M |
| QCR (when promoted) | Med | ~1-2d incl. the held-out benchmark + taxonomy calibration; research effort M |
| C6 (when promoted) | Med | ~3-5h (top-K rerank + byte-stable tiebreak + recall check); research effort M, depends on C3 |
| Verification | Med | ~2-3h per promoted candidate (fixtures + adversarial review) |
| **Total** | | **Deferred — 0h until a gate materializes; per-candidate estimates above when unblocked** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The promoted candidate's gate is confirmed materialized (declared conflict edge / benchmark result / C3 shipped)
- [ ] Shadow-weight path used for QCR (no live weight change on first ship)
- [ ] Default-inert assertion green for the still-deferred candidates

### Rollback Procedure
1. Revert the per-candidate commit (branch-only) — the change is additive and self-contained
2. Confirm the scorer output returns to the C3-only (or pre-spine weighted-sum) baseline
3. Re-run the default-inert / baseline regression fixture to verify the revert restored prior behavior
4. No stakeholder notification needed (branch-only, nothing deployed)

### Data Reversal
- **Has data migrations?** No — none of C1/QCR/C6 touch schema or persisted data (C1 reads existing graph edges; QCR/C6 are compute-only).
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
