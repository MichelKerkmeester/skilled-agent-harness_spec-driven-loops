---
title: "Tasks: 027/004 Causal Edge Tombstones"
description: "Task list for tombstone-backed causal edge deletion and orphan cleanup."
trigger_phrases:
  - "027 phase 004 tasks"
  - "causal edge tombstone tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones"
    last_updated_at: "2026-06-10T07:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented tombstone-backed causal edge deletion"
    next_safe_action: "Proceed to metadata-edge promoter phase"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-04-027-phase-004-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 027/004 Causal Edge Tombstones

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

- [x] T001 Inventory all active causal-edge delete paths with exact symbols and SQL strings. Evidence: `rg` found production deletes in storage, delete handlers, health, vector-index mutations, checkpoints, corrections, memory-index stale cleanup, and CLI cleanup.
- [x] T002 Confirm transaction boundaries for single delete, bulk delete, stale cleanup, manual unlink, and health auto-repair. Evidence: handler transactions and `runInTransaction` use were preserved; build and targeted tests passed.
- [x] T003 Identify existing graph/degree/related cache invalidation after edge deletes. Evidence: sweep helper clears graph/degree caches and storage wrappers still bump causal-edge generation on active deletes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add additive `causal_edge_tombstones` schema and lifecycle generation support. Evidence: `SCHEMA_VERSION` is 32; migration and compatibility tests verify table, columns, indexes, and active-edge preservation.
- [x] T005 Add active-edge snapshot helpers in causal edge storage. Evidence: `sweepCausalEdges()` snapshots active rows before deleting by id and stores restore metadata JSON.
- [x] T006 Create a central sweep helper for tombstone-then-delete behavior. Evidence: `lib/causal/sweep.ts` is the only production `DELETE FROM causal_edges` site.
- [x] T007 Route single-memory delete through the sweep helper. Evidence: `handleMemoryDelete` and `vector-index-mutations.deleteAncillaryMemoryRows` use tombstone-backed cleanup.
- [x] T008 Route bulk memory delete through the sweep helper. Evidence: `handleMemoryBulkDelete` uses storage cleanup and the lower-level mutation path tombstones first.
- [x] T009 Route stale memory-index cleanup through the sweep helper. Evidence: `memory-index.deleteIndexedRecordIds` pre-sweeps with stale cleanup reason before deleting stale rows.
- [x] T010 Route manual causal unlink through the sweep helper. Evidence: `handleMemoryCausalUnlink` calls `deleteEdge()` with tombstone reason and restore context.
- [x] T011 Route health auto-repair orphan cleanup through the sweep helper. Evidence: `memory_health` reports orphan samples before repair and `cleanupOrphanedEdges()` tombstones on confirmed repair.
- [x] T012 Confirm CLI cleanup paths preserve the helper semantics. Evidence: CLI bulk delete passes reason/context into `deleteEdgesForMemory()`.
- [x] T012a Route the three audit-discovered raw-delete sites through the tombstone-then-delete helper: `lib/search/vector-index-mutations.ts:137-145`, `lib/storage/checkpoints.ts:1668-1676`, and `lib/learning/corrections.ts:611-649`. Evidence: each site now calls `sweepCausalEdges()`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Test single delete tombstones all incoming and outgoing edges. Evidence: `tests/causal-edge-tombstones.vitest.ts` single-delete case passed.
- [x] T014 Test bulk delete produces one tombstone per removed active edge. Evidence: `tests/causal-edge-tombstones.vitest.ts` bulk-delete case passed.
- [x] T015 Test manual unlink includes reason and restore metadata. Evidence: `tests/causal-edge-tombstones.vitest.ts` unlink case passed.
- [x] T016 Test health auto-repair reports orphans before tombstoning/deleting them. Evidence: `tests/causal-edge-tombstones.vitest.ts` health report/repair case passed.
- [x] T017 Test active graph reads are unchanged for non-delete queries. Evidence: existing causal suites passed with active reads still querying `causal_edges`.
- [x] T018 Run focused causal graph tests. Evidence: targeted regression command passed 16 files and 325 tests.
- [x] T019 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/002-memory-index-causal-lifecycle/002-causal-edge-tombstones --strict`. Evidence: strict validation passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every active causal-edge delete path either uses the sweep helper or is documented as non-deleting. Evidence: production grep shows only the sweep helper hard-deletes `causal_edges`.
- [x] Tombstones preserve enough metadata for retention-window diagnosis or restore planning. Evidence: restore metadata includes original edge id, endpoints, anchors, evidence, strength, creator, timestamps, command, reason, and context.
- [x] Phase 005 generated-edge promotion can safely rely on tombstone-backed cleanup. Evidence: tombstone lifecycle shipped additively and active graph reads remain unchanged.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research Evidence**: `../research/research.md` iterations 046 and 060
<!-- /ANCHOR:cross-refs -->
