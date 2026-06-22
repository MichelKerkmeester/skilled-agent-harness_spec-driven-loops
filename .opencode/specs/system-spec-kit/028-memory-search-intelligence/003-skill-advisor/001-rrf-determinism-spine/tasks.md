---
title: "Tasks: RRF Determinism Spine (Skill Advisor)"
description: "Task breakdown for the advisor RRF determinism-spine sub-phase: baseline capture, lane-to-RankedList adapter + fuseResultsMulti import (C3, C2 folded), the post-fusion conflict-suppression carrier, the routing-agreement benchmark gate and Level-2 documentation closeout. All implementation tasks PENDING (nothing shipped in Wave-0/030)."
trigger_phrases:
  - "tasks advisor rrf determinism spine"
  - "skill advisor fuseResultsMulti import tasks"
  - "advisor conflict re-rank task breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/001-rrf-determinism-spine"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off advisor RRF spine"
    next_safe_action: "Run live routing-agreement benchmark before enabling RRF by default"
    blockers:
      - "Live MCP benchmark/reindex/scan was out of scope for this pass"
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-rrf-determinism-spine"
      parent_session_id: null
    completion_pct: 85
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
| `[ ]` | Pending (not yet implemented, nothing in this sub-phase shipped in Wave-0/030) |
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

> Baseline capture, the gate the RRF flip is measured against. The import changes fused ordering (NOT byte-identical-by-default), so this is needs-benchmark (`synthesis/03` §B).

- [B] T001 Capture a top-1/top-3 routing-agreement baseline of the current weighted-sum advisor over a representative prompt set on the live skill graph (REQ-005) [LEFT-PENDING, live MCP benchmark/reindex/scan was explicitly out of scope. Required before live/default flip].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> RRF import + lane adapter + byte-stable order (C3, with C2 folded in as C3's mechanism), then the conflict-suppression carrier.

- [x] T002 C3 lane → `RankedList` adapter, adapt each lane's `LaneMatch[]` to a `RankedList{source, results}` (`LaneMatch{skillId}` → `RrfItem{id}`, 1:1) (`fusion.ts`) [DONE DEFAULT-OFF, `fuseAdvisorLaneRanks()` builds fixed-order ranked lists].
- [x] T003 C3 RRF import, import `fuseResultsMulti` from `shared/algorithms/rrf-fusion.ts`, replace the `weightedScore`-sum in the opt-in path and pass the advisor's own smaller `k` via `FuseMultiOptions.k` (REQ-001/002) [DONE DEFAULT-OFF, `SPECKIT_ADVISOR_RRF_FUSION=true`, `ADVISOR_RRF_K=8`. Default weighted path retained pending benchmark].
- [x] T004 C2 byte-stable tiebreak (folds into C3), rely on RRF's fixed-order rank sum + the shared `compareFusionResults` order (`rrf-fusion.ts:163-176`) (REQ-004) [DONE DEFAULT-OFF, opt-in comparator uses the RRF rank map as final post-bonus tiebreak].
- [x] T005 graph-causal emit split, split `graph-causal.ts` so positive propagation feeds the RRF lane and the `conflicts_with` negative mass is surfaced separately (`graph-causal.ts`) [DONE, `scoreGraphCausalLaneSplit()` exposes combined/positive/conflict matches].
- [x] T006 Post-fusion conflict re-rank (carrier), apply the `conflicts_with` demotion in the sort comparator, mirroring `primaryIntentBonus`, outside the lane sum, preserving `explicit_author` dominance (REQ-003) [DONE DEFAULT-OFF, conflict-specific index preserves negative mass for comparator adjustment].
- [x] T007 [B] Record dormant-data reality, the re-rank is a no-op while `conflicts_with` is DORMANT (zero reciprocal declarations). Ship the carrier seam, defer the full populated split-conflict signal (full C1) (REQ-006) [DONE/documented, carrier implemented. Full C1 remains out of scope].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T008 Benchmark gate, compare the RRF advisor's top-1/top-3 against the T001 baseline, confirm `explicit_author` dominance and only then propose a live flip (REQ-005) [LEFT-PENDING, live benchmark prohibited in this pass].
- [x] T009 Determinism check, confirm identical inputs produce byte-identical recommendation order across two runs (RRF fixed-order rank sum + `compareFusionResults`) (REQ-004), and confirm a populated `conflicts_with` fixture is demoted via the post-fusion re-rank, not dropped (REQ-003) [DONE, `rrf-determinism-spine.vitest.ts` plus broad scorer suite].
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:closeout -->
## Phase 4: Documentation + closeout

- [x] T010 Author `spec.md` from the system-spec-kit Level-2 template (3-candidate set, per-candidate PENDING status with research-cited acceptance criteria).
- [x] T011 Author `plan.md`, `tasks.md`, `checklist.md` from the system-spec-kit Level-2 templates.
- [x] T012 Re-confirm against `030` section 14 that NO advisor RRF candidate shipped, and record the dependency commit `65cfcea513` (the Memory-side `fuseResultsMulti` API extension this import consumes).
- [x] T013 Run `validate.sh --strict` on this sub-phase and fix structure issues.
<!-- /ANCHOR:closeout -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 3 candidates have a final status in `spec.md` section 13 (all PENDING-with-gate, 0 DONE, nothing shipped in Wave-0/030).
- [x] The shared `fuseResultsMulti` dependency is traced to its Wave-0 commit (`65cfcea513`, `030` §14 cand 5), and confirmed NO advisor candidate shipped.
- [x] C2 is recorded as folding into C3 (one change), and the conflict carrier is scoped distinct from the full (dormant) C1.
- [x] The RRF import is implemented default-off. The routing-agreement baseline gate remains pending before any live/default flip.
- [x] Strict validation passes for this sub-phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 13 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Source research**: `../research/research.md`, `../../research/synthesis/01-go-candidates.md` + `03`. Deltas `iter-002.jsonl` / `iter-006.jsonl` / `iter-010.jsonl`.
<!-- /ANCHOR:cross-refs -->
