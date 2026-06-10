---
title: "Tasks: 027/006 Write Path Reconciliation"
description: "Task list for explicit statediff action planning and subscriber-based cache/hygiene reconciliation."
trigger_phrases:
  - "027 phase 006 tasks"
  - "statediff reconciliation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/004-write-path-reconciliation"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed statediff write-path reconciliation"
    next_safe_action: "Use action batches for future write-path sinks"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-006-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/006 Write Path Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Phase 003 stable chunk keys are available or define whole-document fallback behavior.
  - Evidence: `incremental-index-foundation` implementation summary confirms chunk ids and fingerprints, and statediff falls back to whole-document keys when handler paths lack chunk keys.
- [x] T002 Inventory inline reconciliation branches in `memory-index.ts`, `memory-save.ts`, `memory-bulk-delete.ts`, and `mutation-hooks.ts`.
  - Evidence: handler seams were mapped before edits; stale cleanup, save invalidation, bulk-delete invalidation, and hook cache clears were converted or preserved as explicit subscriber inputs.
- [x] T003 Inventory entity-density, graph, alias, divergence, retention, and feedback hook consumers.
  - Evidence: `mutation-hooks.ts` now gates entity-density, graph, coactivation, tool, trigger, and constitutional subscribers by action batch; feedback reports subscriber status.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create `mcp_server/lib/storage/statediff.ts` with typed action variants.
  - Evidence: `statediff.ts` exports `DiffActionKind`, `StatediffAction`, row targets, batches, sinks, and subscribers.
- [x] T005 Add deterministic diff planning for insert, upsert, replace, delete, and no-op.
  - Evidence: `tests/statediff.vitest.ts` covers insert, upsert, replace, delete, no-op, and stable ordering.
- [x] T006 Add composite target support for parent rows and child projections.
  - Evidence: `flattenCompositeTarget()` and its test cover parent plus child projection planning.
- [x] T007 Add target sink interfaces for memory index, embedding/cache, lexical rows, generated graph edges, and child projections.
  - Evidence: `StatediffTargetSink` and target type literals cover `memory_index`, `embedding`, `embedding_cache`, `fts`, `bm25`, `graph_edge`, and `child_projection`.
- [x] T008 Add action subscriber interface with target, action, source operation, and state-hash context.
  - Evidence: `StatediffSubscriber` plus `MutationHookResult.subscribers` expose action count and subscriber outcomes.
- [x] T009 Convert entity-density invalidation into an action subscriber.
  - Evidence: `mutation-hooks.ts` runs `entity-density-cache` only for memory or graph action targets; direct save and bulk-delete helpers were removed.
- [x] T010 Convert graph/degree/related cache clearing into action-specific subscribers.
  - Evidence: graph and coactivation subscribers run fail-safe for every non-empty action batch (advisory batches may under-report cascaded edge deletes, e.g. memory deletes); `mutation-hooks-statediff.vitest.ts` verifies the subscriber wiring and reports.
- [x] T011 Convert scan reconciliation to plan-before-write and preserve failed-replacement stale-delete guard.
  - Evidence: `memory-index.ts` logs planned statediff actions before `processBatches`, passes applied delete actions to subscribers, and keeps stale deletes behind `results.failed === 0`.
- [x] T012 Convert save reconciliation after semantic policy gates.
  - Evidence: `response-builder.ts` and atomic-save mapping pass explicit `memory_index` actions only after successful non-duplicate save results.
- [x] T013 Convert bulk delete to delete action batches and subscriber notifications.
  - Evidence: `memory-bulk-delete.ts` maps deleted ids to `memory_index/delete` actions and passes them to `runPostMutationHooks`.
- [x] T014 Update mutation feedback reporting for subscriber-based outcomes.
  - Evidence: `mutation-feedback.ts` reports post-mutation subscribers, action counts, and per-subscriber status while keeping legacy fields.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Test all diff action variants and deterministic ordering.
  - Evidence: `npm exec vitest run tests/statediff.vitest.ts ...` passed.
- [x] T016 Test no-op scan applies no durable writes.
  - Evidence: write-path regression asserts applied actions come only from mutation statuses and stale/orphan deletes, not from unchanged scan paths.
- [x] T017 Test failed replacement indexing does not apply stale delete actions.
  - Evidence: write-path regression asserts the stale delete call remains after the failed-replacement guard and the runtime branch still defers on `results.failed > 0`.
- [x] T018 Test save, scan, and bulk delete invalidate entity-density through subscribers.
  - Evidence: `mutation-hooks-statediff.vitest.ts` verifies memory-index actions run the entity-density subscriber; source regression verifies save and bulk-delete route statediff actions.
- [x] T019 Test graph cache subscribers fire for applied action batches.
  - Evidence: `mutation-hooks-statediff.vitest.ts` verifies graph, degree, and coactivation subscribers run fail-safe for both memory-index and causal-edge action batches; skipping graph clears on memory-index batches was reverted because memory deletes cascade causal-edge deletes the batches do not enumerate.
- [x] T020 Run focused TypeScript tests.
  - Evidence: `npm exec vitest run tests/statediff.vitest.ts tests/mutation-hooks-statediff.vitest.ts tests/write-path-reconciliation.vitest.ts tests/memory-save-dedup-order.vitest.ts tests/causal-edges-write-safety.vitest.ts tests/causal-edge-tombstones.vitest.ts tests/frontmatter-promoter.vitest.ts tests/secret-scrubber.vitest.ts tests/incremental-index-foundation.vitest.ts` passed, 9 files and 66 tests.
- [x] T021 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/003-memory-index-causal-lifecycle/004-write-path-reconciliation --strict`.
  - Evidence: strict validation passed after documentation reconciliation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Write paths produce explicit action batches before mutation where this phase owns the path.
- [x] Cache and hygiene effects subscribe to applied actions rather than scattered handler-specific calls.
- [x] Statediff is documented as reconciliation aid, not as an implicit source of semantic truth.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 048 and 060
<!-- /ANCHOR:cross-refs -->
