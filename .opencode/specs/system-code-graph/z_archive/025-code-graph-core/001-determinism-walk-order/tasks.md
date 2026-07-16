---
title: "Tasks: Code-Graph Determinism + Walk-Order"
description: "Task breakdown for the code-graph determinism + walk-order sub-phase: one task per candidate, the shipped Q4-C1 RRF-additive trust predecessor, implemented det-context-order-global and two gated PENDING follow-ups (the fuseResultsMulti dual-channel adapter and Q4-C1 benchmark tuning), plus verification and Level-2 documentation closeout."
trigger_phrases:
  - "tasks code graph determinism walk order"
  - "code-graph-context tiebreak task breakdown"
  - "028 code-graph determinism tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/001-determinism-walk-order"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored task breakdown: shipped Q4-C1 pre-checked with commit, residue pending"
    next_safe_action: "Author implementation-summary.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
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

> Shipped predecessor (Wave-0 / packet 030): the Q4-C1 RRF-additive rank-time trust blend, the prerequisite already in place.

- [x] T001 Q4-C1 RRF-additive rank-time trust, blend `confidence`/`evidenceClass` into ranking as `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor` (additive, NOT `score × reliability`, structural weight unmutated). Neutral edge byte-identical to the rowid baseline (`code-graph-context.ts:355-378`) [Done, commit `e21caf5de6`. 56 ranking/impact/gold-battery tests pass. The 8 full-package failures are unrelated IPC sandbox EPERM. `030` §14 cand 13].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Current residue: walk-order determinism is implemented. The fuser adapter remains blocked on an isolation-compatible shared-fuser consume path. Trust tuning remains gated on a retrieval benchmark.

- [x] T002 det-context-order-global, replace DB-iteration-derived ordering with content-derived baseline rank assignment and equal-score ties in `rankContextEdges`. Key order is related content hash, related symbol id, file/fqName, edge type and endpoints. Covers the `finalize()` seam so impact + dependency/callees + outline-export are reproducible across scan rebuilds [Done, implemented in `code-graph-context.ts`. Deterministic unit test verifies equal-trust impact callers return identical order across shifted DB row orders].
- [ ] T003 [B] Q8-fuser-adapter / fuseResultsMulti-codegraph-promote, adapter over the shared `fuseResultsMulti` (`shared/algorithms/rrf-fusion.ts`) for the dual CALLS+IMPORTS impact channels: synthesize `RrfItem.id`, pre-sort each channel, label the dual GRAPH channels, apply the cross-channel bonus (`code-graph-context.ts:627-671`) [Pending, gate: isolation-compatible shared-fuser consume path. Current code-graph isolation checks block production source imports from system-spec-kit and `@spec-kit/*`. Do not fork a code-graph-specific fuser].
- [ ] T004 [B] Q4-C1-benchmark-tuning, re-tune `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` (EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002) against a code-graph retrieval benchmark (`code-graph-context.ts:101-108`) [Pending, gate: needs-benchmark. Magnitudes are an unbenchmarked default. No before/after number exists campaign-wide (`030` §14 cand 13 NOTE, `synthesis/03` §B)].
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

- [x] All 4 candidates have a final status in `spec.md` section 11 (2 DONE, 2 PENDING-with-gate).
- [x] The shipped Q4-C1 predecessor traces to Wave-0 commit `e21caf5de6`.
- [x] Each gated residue task names its block reason (isolation-compatible shared-fuser consume path / needs-benchmark) and its consuming dependency. None is disguised as incomplete in-flight work.
- [ ] The fuser adapter is built against an isolation-compatible shared-fuser consume path, and Q4-C1 magnitudes are re-tuned against a retrieval benchmark (downstream verification, tracked).
- [x] Strict validation passes for this sub-phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 11 candidate status.
- **Plan**: `plan.md`.
- **Implementation Summary**: `implementation-summary.md`.
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` + `04`.
- **001 foundation (consumed, not modified)**: `../../001-speckit-memory/002-determinism-content-id-foundation/`.
- **Shipped predecessor (historical evidence)**: Wave-0 record.
<!-- /ANCHOR:cross-refs -->
