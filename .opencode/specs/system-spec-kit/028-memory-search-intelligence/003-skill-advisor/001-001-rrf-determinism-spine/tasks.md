---
title: "Tasks: RRF Determinism Spine (Skill Advisor)"
description: "Task breakdown for the advisor RRF determinism-spine sub-phase: baseline capture, lane-to-RankedList adapter + fuseResultsMulti import (C3, C2 folded), the post-fusion conflict-suppression carrier, the routing-agreement benchmark gate, and Level-2 documentation closeout. All implementation tasks PENDING (nothing shipped in Wave-0/030)."
trigger_phrases:
  - "tasks advisor rrf determinism spine"
  - "skill advisor fuseResultsMulti import tasks"
  - "advisor conflict re-rank task breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-001-rrf-determinism-spine"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown: all impl tasks PENDING; baseline + verification + docs tasks"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-rrf-determinism-spine"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: RRF Determinism Spine (Skill Advisor)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending (not yet implemented — nothing in this sub-phase shipped in Wave-0/030) |
| `[x]` | Completed (re-plan authoring tasks done in this session) |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or action (primary seam) [status/evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M0 | T001 | Routing-agreement baseline (the benchmark gate) |
| M1 | T002-T004 | RRF import + lane adapter + byte-stable order (C3, C2 folded) |
| M2 | T005-T007 | Conflict-suppression carrier (post-fusion re-rank) |
| M3 | T008-T009 | Benchmark gate + determinism verification |
| M4 | T010-T013 | Docs + validation closeout |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Baseline capture — the gate the RRF flip is measured against. The import changes fused ordering (NOT byte-identical-by-default), so this is needs-benchmark (`synthesis/03` §B).

- [ ] T001 Capture a top-1/top-3 routing-agreement baseline of the current weighted-sum advisor over a representative prompt set on the live skill graph (REQ-005) [Pending — the comparison the RRF flip is measured against; `explicit_author` dominance recorded].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> RRF import + lane adapter + byte-stable order (C3, with C2 folded in as C3's mechanism), then the conflict-suppression carrier.

- [ ] T002 C3 lane → `RankedList` adapter — adapt each lane's `LaneMatch[]` to a `RankedList{source, results}` (`LaneMatch{skillId}` → `RrfItem{id}`, 1:1) (`fusion.ts:69-82`) [Pending — `001` iter-2 F17].
- [ ] T003 C3 RRF import — import `fuseResultsMulti` from `shared/algorithms/rrf-fusion.ts`; replace the `weightedScore`-sum (`fusion.ts:366,372`) with the fused call; pass the advisor's own smaller `k` via `FuseMultiOptions.k` (REQ-001/002) [Pending — do NOT re-implement/fork RRF; `001` iter-2 F18, `003` iter-2 C3].
- [ ] T004 C2 byte-stable tiebreak (folds into C3) — remove the `toFixed(6)` + `localeCompare` tiebreak (`fusion.ts:409,425-433`); rely on RRF's fixed-order rank sum + the shared `compareFusionResults` order (`rrf-fusion.ts:163-176`) (REQ-004) [Pending — C2 is C3's mechanism, ships with T003; `003` iter-2 C2].
- [ ] T005 graph-causal emit split — split `graph-causal.ts` so positive propagation feeds the RRF lane and the `conflicts_with` negative mass is surfaced separately (`graph-causal.ts:18,70-103`) [Pending — `fuseResultsMulti` elides negative/zero-weight lanes; `001` iter-2 F16].
- [ ] T006 Post-fusion conflict re-rank (carrier) — apply the `conflicts_with` demotion in the sort comparator, mirroring `primaryIntentBonus` (`fusion.ts:428-430`), outside the lane sum, preserving `explicit_author` dominance (REQ-003) [Pending — deterministic, auditable, lane-weight-independent; `003` iter-6 F6-02 C1-rerank].
- [ ] T007 [B] Record dormant-data reality — the re-rank is a no-op while `conflicts_with` is DORMANT (zero reciprocal declarations); ship the carrier seam, defer the full populated split-conflict signal (full C1) (REQ-006) [Pending/documented — `003` iter-10 O10-01; do NOT prioritize C1 above C4].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Benchmark gate — compare the RRF advisor's top-1/top-3 against the T001 baseline; confirm `explicit_author` dominance; only then propose a live flip (REQ-005).
- [ ] T009 Determinism check — confirm identical inputs produce byte-identical recommendation order across two runs (RRF fixed-order rank sum + `compareFusionResults`) (REQ-004); confirm a populated `conflicts_with` fixture is demoted via the post-fusion re-rank, not dropped (REQ-003).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:closeout -->
## Phase 4: Documentation + closeout

- [x] T010 Author `spec.md` from the system-spec-kit Level-2 template (3-candidate set, per-candidate PENDING status with research-cited acceptance criteria).
- [x] T011 Author `plan.md`, `tasks.md`, `checklist.md` from the system-spec-kit Level-2 templates.
- [x] T012 Re-confirm against `030` section 14 that NO advisor RRF candidate shipped; record the dependency commit `65cfcea513` (the Memory-side `fuseResultsMulti` API extension this import consumes).
- [x] T013 Run `validate.sh --strict` on this sub-phase and fix structure issues.
<!-- /ANCHOR:closeout -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 3 candidates have a final status in `spec.md` section 13 (all PENDING-with-gate; 0 DONE — nothing shipped in Wave-0/030).
- [x] The shared `fuseResultsMulti` dependency is traced to its Wave-0 commit (`65cfcea513`, `030` §14 cand 5); confirmed NO advisor candidate shipped.
- [x] C2 is recorded as folding into C3 (one change), and the conflict carrier is scoped distinct from the full (dormant) C1.
- [ ] The RRF import is implemented and the routing-agreement baseline gate is met before any live flip (downstream implementation, tracked).
- [x] Strict validation passes for this sub-phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 13 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Source research**: `../research/research.md`, `../../research/synthesis/01-go-candidates.md` + `03`; deltas `iter-002.jsonl` / `iter-006.jsonl` / `iter-010.jsonl`.
- **Shipped record (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14.
<!-- /ANCHOR:cross-refs -->
