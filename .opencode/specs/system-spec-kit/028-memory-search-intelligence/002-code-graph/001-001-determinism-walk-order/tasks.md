---
title: "Tasks: Code-Graph Determinism + Walk-Order"
description: "Task breakdown for the code-graph determinism + walk-order sub-phase: one task per candidate — the shipped Q4-C1 RRF-additive trust predecessor (pre-checked with commit e21caf5de6) and three gated PENDING follow-ups (det-context-order-global, the fuseResultsMulti dual-channel adapter, Q4-C1 benchmark tuning) — plus verification and Level-2 documentation closeout."
trigger_phrases:
  - "tasks code graph determinism walk order"
  - "code-graph-context tiebreak task breakdown"
  - "028 code-graph determinism tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/001-001-determinism-walk-order"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown: shipped Q4-C1 pre-checked with commit, residue pending"
    next_safe_action: "Author implementation-summary.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-determinism-walk-order"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Code-Graph Determinism + Walk-Order

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending (gated residue, not built this sub-phase) |
| `[x]` | Completed (shipped in Wave-0 with commit evidence) or explicitly gated-deferred with accepted evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or closeout action (primary seam) [status/evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Shipped predecessor (Wave-0 / packet 030): the Q4-C1 RRF-additive rank-time trust blend — the prerequisite already in place.

- [x] T001 Q4-C1 RRF-additive rank-time trust — blend `confidence`/`evidenceClass` into ranking as `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor` (additive, NOT `score × reliability`; structural weight unmutated); neutral edge byte-identical to the rowid baseline (`code-graph-context.ts:355-378`) [Done, commit `e21caf5de6`; 56 ranking/impact/gold-battery tests pass; the 8 full-package failures are unrelated IPC sandbox EPERM; `030` §14 cand 13].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Gated residue (PENDING — dispositioned, not built this sub-phase): walk-order determinism (gated on the 001 foundation) + trust tuning (gated on a retrieval benchmark).

- [x] T002 [B] det-context-order-global — replace the equal-`rankScore` tiebreak `|| (left.index - right.index)` at `code-graph-context.ts:377` with the 001 hand-written content-derived total comparator (target symbol id / content hash, COALESCE to id); cover `finalize()` at `:436`/`:712` so impact + dependency/callees + outline-export are reproducible across scan rebuilds [Pending — gate: shared-infra-dep (001 total-comparator keystone); ONE finalize seam, NOT impact-only; JS `(a,b)=>b-a` is not a total order — reuse the keystone (`roadmap.md` §1 Determinism cross-cut; `002` iter-7; `synthesis/01` SA7)].
- [x] T003 [B] Q8-fuser-adapter / fuseResultsMulti-codegraph-promote — adapter over the shared `fuseResultsMulti` (`shared/algorithms/rrf-fusion.ts`) for the dual CALLS+IMPORTS impact channels: synthesize `RrfItem.id`, pre-sort each channel, label the dual GRAPH channels, apply the cross-channel bonus (`code-graph-context.ts:627-671`) [Pending — gate: shared-infra-dep (001 `fuseResultsMulti` signature); promotable-with-adapter, NOT drop-in, zero Memory coupling; two candidate ids for the same adapter work (resolved Q8 open-item + roadmap-spine entry) (`roadmap.md` Provenance, RESOLVED by `002` iter-5; `synthesis/01` Wave-0 row)].
- [x] T004 [B] Q4-C1-benchmark-tuning — re-tune `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` (EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002) against a code-graph retrieval benchmark (`code-graph-context.ts:101-108`) [Pending — gate: needs-benchmark; the order-stability gate (neutral == rowid baseline) is the ship criterion and is met; magnitudes are an unbenchmarked default; no before/after number exists campaign-wide (`030` §14 cand 13 NOTE; `synthesis/03` §B)].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Re-confirm the shipped Q4-C1 commit against `030` section 14 candidate 13 (`e21caf5de6`).
- [x] T006 Record the cross-subsystem consume-the-shared-signature contract (001 total-comparator + `fuseResultsMulti`, zero Memory coupling) in `spec.md` + `plan.md`.
- [x] T007 Confirm the out-of-scope cluster (Q1-C1 bi-temporal, Q3-C1 PPR, Q6-* watermark, CG-edge-staleness) is recorded as belonging to other code-graph sub-phases, not silently dropped (`spec.md` section 3 Out of Scope).
- [x] T008 Author `plan.md`, `tasks.md`, `implementation-summary.md` from the system-spec-kit Level-2 templates.
- [x] T009 Run `validate.sh --strict` on this sub-phase and fix structure issues.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 4 candidates have a final status in `spec.md` section 11 (1 DONE-with-commit, 3 PENDING-with-gate).
- [x] The shipped Q4-C1 predecessor traces to Wave-0 commit `e21caf5de6` in `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 13.
- [x] Each gated residue task names its block reason (shared-infra-dep / shared-infra-dep / needs-benchmark) and its consuming dependency; none is disguised as incomplete in-flight work.
- [ ] det-order + the fuser adapter are built against the 001 foundation signatures, and Q4-C1 magnitudes are re-tuned against a retrieval benchmark (downstream verification, tracked).
- [x] Strict validation passes for this sub-phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 11 candidate status.
- **Plan**: `plan.md`.
- **Implementation Summary**: `implementation-summary.md`.
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` + `04`.
- **001 foundation (consumed, not modified)**: `../../001-speckit-memory/002-002-determinism-content-id-foundation/`.
- **Shipped predecessor (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 13.
<!-- /ANCHOR:cross-refs -->
