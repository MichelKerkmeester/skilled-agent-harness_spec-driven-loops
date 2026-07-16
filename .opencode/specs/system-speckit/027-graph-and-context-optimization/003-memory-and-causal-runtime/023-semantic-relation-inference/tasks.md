---
title: "Task Breakdown: Semantic Relation Inference"
description: "Tasks for adding the two deferred OPT-IN collectors (similarity 'supports' from cached related_memories; 'contradicts' from structural supersession) to backfillRelationInference, wiring the options through schema/types/handler, updating the honest hint, and locking the contract with tests."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/023-semantic-relation-inference"
    last_updated_at: "2026-06-04T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Collectors + wiring + tests complete"
    next_safe_action: "Commit + deploy"
    blockers: []
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Semantic Relation Inference

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

- [x] T1: Read the cached `related_memories` shape + writers (`link_related_on_save` / `populateRelatedMemories`) and the tolerant `parseRelatedMemoryReferences`.
- [x] T2: Confirm `superseded_by_memory_id` direction in `lineage-state.ts` (memory_id superseded BY successor → predecessor contradicts successor).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T3: Add `collectSimilarityEdges` — read only the cached `related_memories` column, keep neighbours `similarity >= threshold` (default 75, configurable 1-100), top K<=5, exclude self + spec-chain pairs, emit `supports` at ~0.35.
- [x] T4: Add `parseRelatedNeighbors` + `columnExists` + `pairKey` helpers; drop bare-id entries (no score) so they never clear a >=1 threshold; graceful no-op on absent/empty/unparseable column.
- [x] T5: Add `collectSupersessionEdges` — emit predecessor->successor `contradicts` at ~0.3 from `superseded_by_memory_id`; graceful no-op if table/column absent. Do NOT call `detectContradictions` for candidates.
- [x] T6: Extend `BackfillRelationInferenceOptions` with `similarity?`/`contradicts?`/`similarityThreshold?` (defaults false/false/75); gate the new scans + collectors; thread into dry-run reporting, the existing transaction, and `byRelation` accounting.
- [x] T7: Wire the 3 options through `schemas/tool-input-schemas.ts`, `tools/types.ts`, and `handlers/causal-graph.ts` (local interface + pass-through); update the honest hint in `relation-coverage.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T8: New `tests/relation-backfill-similarity.vitest.ts` — opt-in default off, dry-run zero writes, bounded similarity (threshold/K/strength/auto), contradicts-from-supersession, idempotency, graceful no-op + unparseable.
- [x] T9: Run the new suite + keep-green causal suites → 166 passed across 7 files; `tsc --noEmit` clean.
- [ ] T10: Commit code + packet.
- [ ] T11: Deploy (daemon rebuild + recycle); smoke `memory_causal_stats({ backfill: { dryRun:false, similarity:true, contradicts:true } })`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Both deferred collectors built as OPT-IN extensions, bounded + safe (cached-column-only similarity, structural-only contradicts); options callable through the MCP tool path; honest hint updated; tests green; `tsc` clean; deployed and smoke-verified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — REQ-001..006; `plan.md` — affected surfaces + rollback; `decision-record.md` — ADR-001..003; `checklist.md` — verification evidence.
- Predecessor: packet 021 (`021-relation-inference-backfill`) shipped the backfill and deferred these two collectors; this packet adds them.
<!-- /ANCHOR:cross-refs -->
