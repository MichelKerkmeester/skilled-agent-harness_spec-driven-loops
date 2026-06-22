---
title: "Verification Checklist: Code-Graph Determinism + Walk-Order"
description: "Level-2 verification checklist for the code-graph determinism + walk-order sub-phase: the shipped Q4-C1 RRF-additive trust predecessor, implemented det-context-order-global and two gated PENDING follow-ups recorded with their gates."
trigger_phrases:
  - "checklist code graph determinism walk order"
  - "Q4-C1 order-stability verification"
  - "028 code-graph determinism checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 checklist for the code-graph walk-order sub-phase"
    next_safe_action: "Run validate.sh --strict and confirm a clean pass"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-determinism-walk-order"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code-Graph Determinism + Walk-Order

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` includes Level-2 metadata, scope (4-candidate table), requirements, NFRs, edge cases, complexity and the candidate-status table.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes summary, architecture (one finalize/rank seam), phases, testing, dependencies, rollback and the L2 addenda.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `plan.md` section 6 lists the shipped Q4-C1 blend, the local det-order implementation, the isolation-compatible shared-fuser gate and the missing retrieval benchmark.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shipped Q4-C1 blend is RRF-additive, never multiplicative
  - **Evidence**: `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`. Structural weight unmutated (`code-graph-context.ts:355-378`, commit `e21caf5de6`).
- [x] CHK-011 [P0] Neutral edge byte-identical to the rowid baseline
  - **Evidence**: a neutral edge scores `1/(61+index)`, byte-verified against the pre-change output. The order-stability ship criterion (`030` §14 cand 13).
- [x] CHK-012 [P1] PENDING residue follows the reuse-not-fork pattern
  - **Evidence**: det-order is implemented locally in the isolated code-graph seam. The fuser adapter remains pending instead of forking a code-graph-specific fuser, recorded in `spec.md` section 3 and `plan.md` section 3.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: candidate seams and the consume-the-shared-signature contract mirror the 001 determinism foundation sub-phase.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Shipped Q4-C1 acceptance criteria met (REQ-001)
  - **Evidence**: 56 code-graph ranking/impact/gold-battery tests pass incl. neutral-byte-identical + trusted-boost. The 8 full-package failures are unrelated IPC sandbox EPERM (`e21caf5de6`).
- [x] CHK-021 [P1] det-order cross-rebuild reproducibility test implemented (REQ-002)
  - **Evidence**: `code-graph-context-handler.vitest.ts` verifies equal-trust impact callers return identical order across shifted DB row orders.
- [x] CHK-022 [P1] Fuser-adapter dual-channel test planned (REQ-003)
  - **Evidence**: CALLS+IMPORTS fuse by rank with a cross-channel bonus. Single-channel degrades cleanly. Not built, gated on an isolation-compatible shared-fuser consume path (`plan.md` section 5).
- [x] CHK-023 [P1] Q4-C1 tuning is benchmark-gated (REQ-004)
  - **Evidence**: re-tune `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` only against a retrieval benchmark. The neutral-fallback gate is non-negotiable. Benchmark does not exist campaign-wide (`synthesis/03` §B).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Every candidate has a final status (2 DONE, 2 PENDING-with-gate)
  - **Evidence**: `spec.md` section 11, Q4-C1 DONE (`e21caf5de6`), det-order DONE, fuser adapter and tuning PENDING with gates.
- [x] CHK-025 [P1] Out-of-scope cluster recorded, not silently dropped
  - **Evidence**: Q1-C1 bi-temporal, Q3-C1 PPR, Q6-* watermark, CG-edge-staleness recorded as other sub-phases in `spec.md` section 3 Out of Scope.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: docs contain only file paths, commit hashes and commands.
- [x] CHK-031 [P0] No new external data sink or trust boundary introduced
  - **Evidence**: code-graph context render is JSON-escaped + trusted-source. The cross-cutting C8 generalization was refuted/reachability-gated for code-graph (`synthesis/04`).
- [x] CHK-032 [P1] Auth/authz unaffected
  - **Evidence**: ordering-only ranking changes. No auth surface touched (`spec.md` NFR-S01).

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/impl-summary synchronized
  - **Evidence**: all four describe the same 2-DONE / 2-PENDING candidate set keyed to the `code-graph-context.ts` finalize/rank seam.
- [x] CHK-041 [P1] Research citations present per candidate
  - **Evidence**: each candidate cites `research.md` / `roadmap.md` / `synthesis/0{1,3,4}` and the `030` §14 commit for the shipped predecessor.
- [x] CHK-042 [P2] Cross-subsystem contract documented
  - **Evidence**: det-order's isolation-compatible local implementation and the remaining `fuseResultsMulti` consume-path gate are recorded in `spec.md` section 3 and `plan.md` section 3.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp/scratch files committed
  - **Evidence**: only the five Level-2 packet docs exist in this sub-phase folder.
- [x] CHK-051 [P1] Sub-phase nested under its research phase-parent
  - **Evidence**: folder is `028-memory-search-intelligence/002-code-graph/001-determinism-walk-order`, a child of the 002-code-graph research phase.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19
**Verified By**: Implementation pass (Q4-C1 shipped/verified, det-order implemented, residue gated, deferral documented)

<!-- /ANCHOR:summary -->
