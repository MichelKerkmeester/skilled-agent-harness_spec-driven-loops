---
title: "Task Breakdown: Relation-Backfill Review Remediation"
description: "Tasks for the relation-agnostic conflict guard, honest written/byRelation delta counting, strict inner backfill schema, handler hint, maintainability P2s, and the regression tests."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/026-relation-backfill-review-remediation"
    last_updated_at: "2026-06-04T14:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Guard + counting + schema + P2s + tests complete; suites green"
    next_safe_action: "Strict-validate packet"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Relation-Backfill Review Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · `[ ]` open. IDs `T#`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1: Reproduce the data-integrity defect — committed `{ contradicts:true }` on reciprocal lineage sets `invalid_at` on the just-created `caused` 20->21 edge.
- [x] T2: Locate the conflict rules (`relationsConflict`) and the invalidation path (`detectContradictions` -> `invalidateEdge`).
- [x] T3: Export `relationsConflict` from `lib/graph/contradiction-detection.ts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T4: Add `hasConflictingValidEdge(db, source, target, relation)` — column-aware valid-edge query, reuses `relationsConflict`, fails open.
- [x] T5: Add `insertNonConflictingEdges(db, edges)` (filters + inserts + returns skipped) and `insertInferredEdges(edges)` (single batch helper used by all collectors — M-004-4).
- [x] T6: Reorder the write transaction so non-conflicting edges (spec-chain + lineage `caused`, then similarity `supports`) insert first; filter the conflict-prone collectors against in-transaction valid edges.
- [x] T7: Add `skippedConflicting` to the result; skipped edges are NOT counted as written.
- [x] T8: Replace upsert-based counting with `countValidAutoEdgesByRelation` before/after snapshot; derive `written` + `byRelation` from the delta (COR-001).
- [x] T9: Make the inner `backfill` schema strict via `getSchema` (COR-002).
- [x] T10: Honest handler hint wording ("wrote N new auto edges") + `skippedConflicting` note.
- [x] T11: P2s — drop unused `createSpecDocumentChain` import (M-004-1); remove dead `bumpRelation(...,0)` no-op loop (M-004-2); name spec-chain strength constants + fix lock-step comment (M-004-3).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T12: New `tests/relation-backfill-conflict.vitest.ts` — (a) reciprocal caused-survives + contradicts-skipped + skippedConflicting; (b) manual-edge-survives; (c) written===0 on re-run; (d) byRelation==SQL valid-auto distribution (M-004-5); (e) strict-inner-schema rejection.
- [x] T13: `npx tsc --noEmit` clean; run the required + keep-green suites → 179 passed across 9 files.
- [ ] T14: Strict-validate the packet folder.
- [ ] T15: Commit + deploy (daemon rebuild + recycle) — user-gated.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Relation-agnostic conflict guard prevents any committed backfill from invalidating a pre-existing valid edge; `skippedConflicting` surfaced; `written`/`byRelation` honest on re-runs and equal to the live valid-auto distribution; inner schema strict; P2s cleared; tests green; `tsc` clean.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — REQ-001..007; `plan.md` — affected-surfaces + rollback; `decision-record.md` — ADR-001..004; `checklist.md` — verification evidence.
- Predecessors: packet 021 (built the backfill), packet 023 (added similarity/contradicts collectors). This packet remediates the deep-review findings on that subsystem.
<!-- /ANCHOR:cross-refs -->
