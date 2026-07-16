---
title: "Tasks: at-rest WAL durability"
description: "Task Format: T### [P?] Description (file path). Implement and verify bounded main and active vector shard WAL maintenance without changing production synchronous=NORMAL."
trigger_phrases:
  - "at-rest WAL durability tasks"
  - "active_vec checkpoint tasks"
  - "wal_autocheckpoint tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/010-at-rest-wal-durability"
    last_updated_at: "2026-05-29T13:10:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented bounded WAL maintenance"
    next_safe_action: "Run strict packet validation and update checklist evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: At-Rest WAL Durability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read `sk-code` and identify OpenCode TypeScript verification route.
- [x] T002 Read `system-spec-kit` template workflow.
- [x] T003 Read required `vector-index-store.ts` spans and full relevant function bodies.
- [x] T004 Read `timer-registry.ts`, context-server import/connect areas, and existing WAL vitest.
- [x] T005 Confirm `010-at-rest-wal-durability` did not exist and create only that child packet path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add main `wal_autocheckpoint = 256` after `synchronous = NORMAL` (`vector-index-store.ts`).
- [x] T011 Add active shard `wal_autocheckpoint = 256` after shard temp store (`vector-index-store.ts`).
- [x] T012 Re-sequence `close_db()` to shard TRUNCATE, main TRUNCATE, detach, close (`vector-index-store.ts`).
- [x] T013 Add `checkpointAllWal()` with best-effort shard and main TRUNCATE calls (`vector-index-store.ts`).
- [x] T014 Re-export `checkpointAllWal()` through `vector-index.ts`.
- [x] T015 Import `registerInterval` and schedule `vectorIndex.checkpointAllWal()` every 300000ms after connect (`context-server.ts`).
- [x] T016 Add vitest assertions for close order and helper behavior (`vector-index-store.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `npm run build --workspace=@spec-kit/mcp-server` from `.opencode/skills/system-spec-kit`.
- [x] T021 Run targeted vitest suite from `mcp_server`.
- [x] T022 Run copy-based WAL benchmark from packet scratch.
- [x] T023 Record benchmark results in `implementation-summary.md`.
- [ ] T024 Run strict packet validation.
- [ ] T025 Update checklist and implementation summary with strict validation evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Build, targeted vitest, benchmark, and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling Packet**: `008-spec-memory-graceful-wal-checkpoint-on-close`
- **Sibling Packet**: `009-shutdown-durability`
<!-- /ANCHOR:cross-refs -->
