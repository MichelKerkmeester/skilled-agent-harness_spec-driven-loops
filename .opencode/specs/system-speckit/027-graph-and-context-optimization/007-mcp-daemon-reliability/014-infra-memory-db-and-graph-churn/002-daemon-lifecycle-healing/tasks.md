---
title: "Tasks: Daemon-lifecycle healing (F1/F2/F3)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "daemon lifecycle healing tasks"
  - "boot fts rebuild tasks"
  - "substrate test fix tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/002-daemon-lifecycle-healing"
    last_updated_at: "2026-05-30T18:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Rewrote tasks to manifest scaffold"
    next_safe_action: "Strict-validate then commit atomically"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000323"
      session_id: "032-001-tasks"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Daemon-lifecycle healing (F1/F2/F3)

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

- [x] T001 Read the 4 change-sites + the `memory_health` rebuild logic (context-server.ts, mk-spec-memory-launcher.cjs, substrate vitest, memory-crud-health.ts)
- [x] T002 Confirm target files clean at HEAD before editing
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 F1: extend `BootFtsIntegrityHealth` with `'repaired'` (context-server.ts)
- [x] T004 F1: add boot FTS auto-rebuild + re-verify + env opt-out to `runBootFtsIntegrityCheck()` (context-server.ts)
- [x] T005 F2: add `UNCLEAN_SHUTDOWN_MARKER`, `uncleanShutdownMarkerPath()`, `uncleanMarkerPresent()`, `cleanCloseAfterReap()` (mk-spec-memory-launcher.cjs)
- [x] T006 F2: compute+log `cleanClose` in `reapLeaseChildBeforeRespawn()`; export helpers (mk-spec-memory-launcher.cjs)
- [x] T007 F3: rewrite substrate assertions - diagnostic/scenario split, FAIL-only rejection, SKIP tolerance, memory-scenario-ran (substrate-runner-harness.vitest.ts)
- [x] T008 Tests: update context-server T56c for auto-heal; add launcher-clean-close-barrier.vitest.ts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Build (shared + mcp-server) + `node --check` launcher
- [x] T010 Run affected vitest (context-server, launcher suite, substrate stress)
- [x] T011 Comment-hygiene audit + strict-validate the packet; commit atomically
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Build + affected tests green; strict-validate exit <=1
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence base**: See `../research/research.md` (F1-F4) + `../research/resource-map.md`
<!-- /ANCHOR:cross-refs -->
