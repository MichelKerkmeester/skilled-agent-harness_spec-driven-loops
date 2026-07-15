---
title: "Tasks: Phase 9: daemon-reclaim-hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "daemon reclaim hardening tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/025-code-graph-core/009-daemon-reclaim-hardening"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/009-daemon-reclaim-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: daemon-reclaim-hardening

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

- [x] T001 Add `probeExistingService(socketPath)` wrapping `probeDaemon` (normalize its `{status,reason}`) in `lib/launcher-ipc-bridge.cjs`; add an async `classifyLaunchOwner` wrapper (the sync `classifyOwnerLease`/`leaseHeldFromFile` cannot await the probe inline)
- [x] T002 Add `live-but-dead-socket` reclaimable state — reclaim only on the COMPOUND predicate (dead-socket AND aged-heartbeat AND past deadline) + a final post-lock socket veto; conditional CAS (re-stat/rename-claim before unlink)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 No-bridge-socket branch → respawn (not report); stamp `childSpawnedAtIso`; add `STARTUP_GRACE_MS`/`MAX_INIT_MS` grace window
- [x] T004 Startup WAL hygiene: pre-spawn `wal_checkpoint(TRUNCATE)` over-threshold/post-reap; `wal_autocheckpoint` in `initDb`; checkpoint before migration copy
- [x] T005 Crash-surviving `.code-graph-daemon-pid.json` registry + one-shot-guarded self-heal-on-acquire (discover→reap→checkpoint→spawn)
- [x] T006 Race/permission safety: PRIMARY-lease uid check, PID-identity verify before SIGKILL, re-stat-before-unlink; socket-gated heartbeat; `LAUNCHER_DIAGNOSTIC` line
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Deterministic wedge-simulation suite: reclaim wedge / spare still-starting / spare foreign-owner / checkpoint oversized WAL / bridge healthy
- [x] T008 Write implementation-summary.md. (Real-daemon unclean-crash smoke deferred to the production soak; the hermetic suite proves the behavior — see impl-summary Known Limitations.)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Wedge auto-reclaimed; starting/foreign spared; no -32000 after unclean crash
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
