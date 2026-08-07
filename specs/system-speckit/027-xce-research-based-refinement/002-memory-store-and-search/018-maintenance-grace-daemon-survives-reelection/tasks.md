---
title: "Tasks: maintenance-grace daemon survives re-election"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "maintenance grace daemon survives re-election tasks"
  - "027 002/019 tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/018-maintenance-grace-daemon-survives-reelection"
    last_updated_at: "2026-06-17T16:05:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Broke down tasks for the maintenance-grace adopt-vs-reap fix"
    next_safe_action: "Confirm a full reindex completes end-to-end on the live daemon at deploy time"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-027-002-019-maintenance-grace"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: maintenance-grace daemon survives re-election

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T### [P?] Description (file path)` — `[P]` marks tasks that can run in parallel. All tasks below are sequential because they touch overlapping modules.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- T001 Read the launcher reap paths and the IPC bridge to confirm re-election fires because the busy daemon cannot answer the JSON-RPC liveness probe during a CPU block (`.opencode/bin/mk-spec-memory-launcher.cjs` ~line 1680, `.opencode/bin/lib/launcher-ipc-bridge.cjs`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- T002 Add the shared reference-counted writer `lib/storage/maintenance-marker.ts` (`beginMaintenance(label) -> { refresh(), end() }`, 180s TTL, 20s self-refresh) and call `beginMaintenance('index_scan')` from the background scan in `handlers/memory-index.ts`: write `.maintenance-active.json` on start, refresh every 20s plus at phase boundaries, and `end()` it in a `finally` on every terminal exit.
- T003 Add the pure `maintenanceMarkerPath` / `readMaintenanceMarker` / `shouldAdoptDespiteProbe` predicate with injectable fs/now and export it (`.opencode/bin/lib/model-server-supervision.cjs`).
- T004 Add env-aware `maintenanceMarkerDir()` with the same DB-dir precedence as the daemon, re-export the predicate, and call the guard at both the stale-reclaim adopt path and the dead-socket respawn path so a fresh marker naming the live child adopts/refuses respawn (`.opencode/bin/mk-spec-memory-launcher.cjs`).
- T005 Add the unit test through the launcher require and extend the isolated harness with adopt and stale-marker negative-control cases (`tests/launcher-maintenance-guard.vitest.ts`, `stress_test/durability/daemon-reelection-adoption-live.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- T006 Daemon `npm run build` exits 0; `node --check` passes on both touched `.cjs` files.
- T007 The unit test and the isolated harness adopt plus stale-marker negative-control cases pass.
- T008 Deploy the dist and confirm a full reindex runs to completion end-to-end on the live daemon (the deploy-time check).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

The daemon advertises a live scan via a refreshed marker, both launcher reap paths adopt a busy-but-healthy daemon, the guard fails safe toward reaping on a stale/mismatched marker, the build is clean, and the unit plus isolated-harness tests pass. Full live reindex completion is the deploy-time confirmation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md`
- Plan: `./plan.md`
- Summary: `./implementation-summary.md`
- Predecessor: `../018-reindex-scan-responsiveness-and-cancellation/`
<!-- /ANCHOR:cross-refs -->
