---
title: "Tasks: shutdown durability"
description: "Task Format: T### [P?] Description (file path). Implement and verify forwarded-signal shutdown durability for mk-spec-memory."
trigger_phrases:
  - "shutdown durability tasks"
  - "forwarded signal shutdown tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented shutdown durability guards"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Shutdown Durability

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

- [x] T001 Read `sk-code` and identify OpenCode TypeScript/Node verification route.
- [x] T002 Read required `context-server.ts` shutdown and connect regions.
- [x] T003 Read launcher external-signal shutdown region.
- [x] T004 Read existing shutdown-related vitest files and packet 008 docs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Add SIGHUP and SIGQUIT clean shutdown handlers (`context-server.ts`).
- [x] T011 Keep `vectorIndex.closeDb()` AFTER the async `fileWatcher` drain + invariant comment (reverted an initial hoist; review found closeDb-first reopens the DB post-TRUNCATE) (`context-server.ts`).
- [x] T012 Replace launcher 5000ms forwarded-signal waits with `RESPAWN_REAP_GRACE_MS` (`mk-spec-memory-launcher.cjs`).
- [x] T013 Add source-level regression assertions (`context-server.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run launcher syntax check.
- [ ] T021 Run MCP server workspace build.
- [ ] T022 Run targeted vitest suites.
- [ ] T023 Confirm the existing fatalShutdown/vectorIndex regex still passes.
- [ ] T024 Run strict validation for this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Staged verification and strict packet validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Sibling Packet**: `008-spec-memory-graceful-wal-checkpoint-on-close`
<!-- /ANCHOR:cross-refs -->
