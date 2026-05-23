---
title: "Tasks: Runtime Process Lifecycle Closure"
description: "Task ledger for F41/F43/F51/F90/F110 runtime lifecycle remediation."
trigger_phrases:
  - "020 005 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/005-fix-deferred-p2s-for-runtime-process-lifecycle"
    last_updated_at: "2026-05-23T10:55:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented runtime lifecycle fixes"
    next_safe_action: "Review and optionally commit packet"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0200050200050200050200050200050200050200050200050200050200050200"
      session_id: "020-005-runtime-process-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Runtime Process Lifecycle Closure

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Read packet `spec.md` after scaffolding.
- [x] T002 Read parent `../spec.md` and halt-on-first-regression rule.
- [x] T003 Read F53 shutdown baseline ADR and F37/testables precedent.
- [x] T004 Audit full `reindex.ts`, `execution-router.ts`, and sibling vitest files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add fail-fast DB-dir validation and `InvalidDatabaseDirError` (`reindex.ts`).
- [x] T006 Gate paused startup through `reindex.testables.ts` (`reindex.ts`, `reindex.testables.ts`).
- [x] T007 Keep `cancelJob` live and move test usage to testables (`reindex.ts`, `reindex.testables.ts`, `embedder-reindex.vitest.ts`).
- [x] T008 Add signal duplicate guard and non-blocking shutdown replay chain (`execution-router.ts`).
- [x] T009 Add direct provider adapter cache invalidation events on active adapter rotation (`execution-router.ts`).
- [x] T010 Expose necessary router test seams (`execution-router.testables.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Add F43/F110/F41 fixtures (`embedder-reindex.vitest.ts`).
- [x] T012 Add F51/F90 fixtures (`execution-router.vitest.ts`).
- [x] T013 Run focused touched tests: 2 files, 14 tests passed.
- [x] T014 Run requested embedders suite: first run hit known F48 flake; rerun passed 4 files, 49 tests.
- [x] T015 Run mcp-server typecheck: exit 0.
- [x] T016 Fill checklist, decision record, implementation summary, and strict-validate packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Requested verification passed, with one allowed F48 rerun.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Decisions**: See `decision-record.md`.
- **Checklist**: See `checklist.md`.
<!-- /ANCHOR:cross-refs -->
