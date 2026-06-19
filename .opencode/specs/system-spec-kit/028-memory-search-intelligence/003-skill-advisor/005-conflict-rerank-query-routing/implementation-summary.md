---
title: "Implementation Summary: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Three deferred routing-quality refinements held as documented, evidence-cited PENDING candidates behind the 001 RRF spine. No code shipped: C1's conflict path is dormant (zero conflicts_with edges live), QCR is benchmark-gated speculation, C6 needs C3's rank-based survivor set."
trigger_phrases:
  - "advisor conflict rerank routing summary"
  - "C1 QCR C6 deferred implementation summary"
  - "skill advisor deferred routing state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C1/QCR/C6 deferred-plan impl doc (all PENDING)"
    next_safe_action: "Hold until the 001 RRF spine ships and each candidate gate materializes"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-005-conflict-rerank-query-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing |
| **Completed** | N/A — deferred plan authored 2026-06-19; no candidate shipped |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No scorer code shipped. This sub-phase captures three routing-quality refinements the Skill Advisor research campaign surfaced and then deliberately deferred, so they are not silently lost. Each rides the 001 RRF determinism spine (sibling `001-rrf-determinism-spine`, candidate C3) and each is individually un-actionable today for its own concrete reason. The deliverable is the deferred plan: a problem statement, a per-candidate gate, and the materialization condition that would unblock each one. None of C1, QCR, or C6 appears in the 030 Wave-0 shipped record (`git log 1ecc531431..ab5459fb6d` has no advisor/conflict/query-class/rerank commit; 030 §14 covers only the Memory and Code-Graph Wave-0 candidates).

### C1 — Conflict-suppression re-rank (PENDING, dormant-data gate)

C1 would lift the signed `conflicts_with: -0.35` multiplier (`graph-causal.ts:18`) out of the `graph_causal` lane sum and apply it as a deterministic post-fusion demotion in the ranking comparator, beside `primaryIntentBonus` (`fusion.ts:428-430`), with its own applied-counter. It stays PENDING because the path is dormant: the live `skill-graph.sqlite` has zero `conflicts_with` edges (only `depends_on=9`, `enhances=33`, `prerequisite_for=10`, `siblings=22`, verified live 2026-06-19) and all 20 real-skill `graph-metadata.json` declare `"conflicts_with": []`. C1 changes zero observable routing until a reciprocal conflict edge is declared.

### QCR — Query-class lane-weight router (PENDING, needs-benchmark gate)

QCR would classify each query into a small intent class and feed per-class lane-weight multipliers through the existing `effectiveScorerWeights` merge (`fusion.ts:69-82`), additively, keeping `explicit_author` dominant — generalizing the hand-maintained per-`(phrase,skill)` `primaryIntentBonus` table. It is the highest-ceiling candidate but stays PENDING because no mis-routing has been demonstrated and no held-out routing-quality benchmark exists. The costly error is a misrouted class that demotes the right skill, so the class taxonomy and per-class multipliers must be calibrated against a benchmark before any live weight change.

### C6 — Cross-lane semantic exact-rerank (PENDING, shared-infra-dep gate)

C6 would re-score only the fused top-K survivors with full-precision cosine (reusing `cosineSimilarity` + the cached full-precision vectors at `semantic-shadow.ts:47-69,194-199`), bypassing the lane's 0.2 cutoff for that subset, as a bounded tiebreak that lets the 0.05 semantic lane resolve ties instead of diluting the sum. It stays PENDING because it needs C3's rank-based survivor set and the deterministic id tiebreak to stay byte-stable; on today's weighted-sum it would re-order a non-deterministic set.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Problem, scope, REQ-001..007, per-candidate PENDING status + gate |
| `plan.md` | Created | Gate-first sequencing, affected-surface inventory, rollback, phase deps |
| `tasks.md` | Created | T001-T010 breakdown, all PENDING/blocked with cited evidence |
| `checklist.md` | Created | Level-2 verification checklist (planning items checked; build/test items gate on promotion) |
| `implementation-summary.md` | Created | This deferred-plan summary |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Unchanged (deferred) | Target seam for C1 (comparator demotion), QCR (`effectiveScorerWeights`), C6 (top-K rerank) when promoted |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Unchanged (deferred) | C1 target — lift the signed conflict mass out of the lane sum |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Unchanged (deferred) | C6 reuse target — `cosineSimilarity` + cached vectors |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This is a re-plan, not an implementation. The deferred plan was authored from the 18-iteration Skill Advisor research campaign (`../research/research.md` + `iterations/` + `deltas/`), the authoritative roadmap (`../../research/roadmap.md`), and the synthesis go-candidates and all-findings docs — all of which independently land C1/QCR on "DEFER: both fix non-problems today." Two factual claims were re-verified live before authoring: the `skill-graph.sqlite` `conflicts_with` edge count (0) and the 20 `graph-metadata.json` `conflicts_with` arrays (all `[]`). The all-PENDING status was cross-checked against the 030 Wave-0 shipped record (§14 candidate-status table has no advisor C1/QCR/C6 row; the commit range carries no matching commit), confirming nothing here is already done.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep all three candidates PENDING; ship no code | Each fixes a problem that does not exist yet — C1's conflict edges are empty, QCR shows no demonstrated mis-routing, C6 needs a spine that has not shipped. Speculative implementation would harden dead paths and risk routing regressions for zero observable gain. |
| Track each with a distinct named gate, not a single blanket "deferred" | The unblock conditions differ: C1 needs a declared reciprocal `conflicts_with` edge (dormant-data); QCR needs a held-out routing-quality benchmark + calibrated taxonomy (needs-benchmark); C6 needs the 001 RRF spine / C3 rank-based survivor set (shared-infra-dep). Naming each makes promotion auditable. |
| Frame C1 as a post-fusion comparator demotion, not a fused rank term | The signed `conflicts_with: -0.35` mass has no rank-fusion meaning; a naive RRF port would silently drop conflict suppression. Lifting it into the deterministic comparator (the surface `primaryIntentBonus` already uses) preserves auditability and keeps it inert under empty edges. |
| Do NOT fabricate skill `conflicts_with` edges to "unblock" C1 | Declaring reciprocal conflict relationships between skills is a separate authoring decision with its own routing consequences; this sub-phase documents the gate, it does not manufacture the data that opens it. |
| Make QCR additive and `explicit_author`-dominant, shadow-only on first ship | The dominant explicit-author lane is the safety floor; QCR reweights the other lanes per class without ever replacing it, and ships behind shadow weights so the benchmark can measure before any live change. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this sub-phase | PASS expected after this file + checklist.md land (the FILE_EXISTS error was the 2 missing Level-2 files; GRAPH_METADATA is a non-blocking leaf warning shared by siblings) |
| Live `conflicts_with` edge count (`skill_edges` GROUP BY) | PASS — 0 conflict edges (only depends_on=9, enhances=33, prerequisite_for=10, siblings=22); confirms C1 dormancy (REQ-005) |
| `graph-metadata.json` `conflicts_with` arrays | PASS — 20 files declare the key, zero non-empty arrays; confirms C1 dormancy |
| Cited research iterations exist | PASS — iteration-001/002/003/004/006/010 all present |
| 030 Wave-0 cross-check (none done) | PASS — §14 has no advisor C1/QCR/C6 row; commit range has no matching commit |
| Code shipped | NONE — all three candidates PENDING by design |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All three candidates are unbuilt.** C1, QCR, and C6 remain PENDING; the scorer behaves exactly as today's weighted-sum fusion. This sub-phase adds no default-on behavior.
2. **C1 is gated on data that does not exist.** Until a reciprocal `conflicts_with` skill edge is declared, C1 changes zero routing. Re-verify the live edge count (REQ-005) before any promotion; a NEW conflict edge is the only justification.
3. **QCR's taxonomy and multipliers are uncalibrated.** The class set, per-class lane-weight values, and the held-out routing-quality benchmark are all open. Do not ship QCR on hand-picked values — the misrouted-class false positive must be measured first.
4. **C6 must wait for C3.** Building C6 before the 001 RRF spine lands violates the byte-stable invariant (it would re-order a non-deterministic survivor set). C6 may ship as soon as C3 lands even if C1/QCR stay PENDING — the three are independent downstream of the shared spine.
5. **No leaf `graph-metadata.json`.** Like sibling 004, this leaf sub-phase has no graph-metadata file; the parent `003-skill-advisor` owns the graph. The validator surfaces this as a non-blocking warning only.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
