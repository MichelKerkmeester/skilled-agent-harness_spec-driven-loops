---
title: "Task Breakdown: Relation-Inference Backfill"
description: "Tasks for building the bounded relation-inference backfill, flipping the honest stat to implemented:true, wiring the callable entry point, and locking the contract with tests."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/021-relation-inference-backfill"
    last_updated_at: "2026-06-04T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Module + wiring + tests complete"
    next_safe_action: "Commit + deploy"
    blockers: []
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Relation-Inference Backfill

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

- [x] T1: Read `backfillLineageState` (shape to mirror), `createSpecDocumentChain` (pairing rules), `insertEdge` guards, `invalidateEntityDensityCache`.
- [x] T2: Confirm strict tool-input schema would reject a new `backfill` arg (so the command stays callable end-to-end).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T3: Create `lib/causal/relation-backfill.ts` — `backfillRelationInference(db, { dryRun=true, limit, actor })`: bounded scan → infer (spec-doc chains + lineage links) → dryRun? report : transaction-write → summary `{ scanned, inferred, skipped, written, byRelation }`.
- [x] T4: All inferred edges `created_by='auto'` (inherit MAX_AUTO_STRENGTH + MAX_EDGES_PER_NODE + window-cap guards); idempotent upsert; self-loop guard.
- [x] T5: Explicit `invalidateEntityDensityCache()` after committing edges (NOT on dry run).
- [x] T6: Flip `relation-coverage.ts` `backfillJob.implemented:true`; set `command` to `memory_causal_stats({ backfill: { dryRun: false } })`; keep the honest hint accurate while below target.
- [x] T7: Wire `backfill` into `handleMemoryCausalStats` + add optional `backfill` to `memoryCausalStatsSchema` (and its allowed-params list).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T8: New `tests/relation-backfill-unit.vitest.ts` — proves dryRun-zero-writes, bounded guard-respecting writes, freshness cache invalidation, idempotency, stat flip, cold-start.
- [x] T9: Update `relation-coverage-unit.vitest.ts` + `causal-stats-output.vitest.ts` to the new implemented:true contract.
- [x] T10: `npx vitest run` the required + keep-green causal suites → 309 passed across 9 files; `tsc --noEmit` clean.
- [ ] T11: Commit code + packet.
- [ ] T12: Deploy (daemon rebuild + recycle); verify `memory_causal_stats({ backfill })` on the production DB.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Backfill subsystem built, bounded, and safe; honest stat flipped to implemented:true with a real callable command; tests green; `tsc` clean; deployed and smoke-verified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — REQ-001..006; `plan.md` — affected surfaces + rollback; `decision-record.md` — ADR-001..004; `checklist.md` — verification evidence.
- Predecessor: packet 019 (`019-causal-relation-coverage-honesty`) made the stat honest; this packet makes it true.
<!-- /ANCHOR:cross-refs -->
