---
title: "Tasks: spec-memory graceful WAL checkpoint on close"
description: "Task Format: T### [P?] Description (file path). Implement + verify checkpoint-on-close for context-index.sqlite."
trigger_phrases:
  - "spec-memory checkpoint on close tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close"
    last_updated_at: "2026-05-29T14:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete + verified"
    next_safe_action: "Restart mk-spec-memory to load rebuilt dist"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: spec-memory Graceful WAL Checkpoint on Close

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

- [x] T001 Trace the close path (fatalShutdown → vectorIndex.closeDb → close_db) and confirm the main handle is `vectorIndex.getDb()`
- [x] T002 Confirm no shutdown path runs `wal_checkpoint` on the main DB
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add best-effort `wal_checkpoint(TRUNCATE)` before `db.close()` in `close_db()` (`mcp_server/lib/search/vector-index-store.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Add regression tests: checkpoint-called-before-close (spy) + WAL-truncated-at-rest + data durable (`mcp_server/tests/vector-index-store.vitest.ts`)
- [x] T021 `npm run typecheck` clean; `vector-index-store` 3/3 pass
- [x] T022 Lifecycle regression set green (78 passed: lifecycle-shutdown, checkpoint, memory-save, corruption-recovery, shutdown-hooks, vector-index-store)
- [x] T023 `npm run build` (dist rebuilt; `wal_checkpoint(TRUNCATE)` confirmed in `dist/lib/search/vector-index-store.js`)
- [x] T024 `validate.sh --strict` on this packet → exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Tests + strict validation pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Incident**: `026/004-code-graph/012-empty-graph-first-time-auto-scan/bug-report-memory-db-corruption.md`
<!-- /ANCHOR:cross-refs -->
