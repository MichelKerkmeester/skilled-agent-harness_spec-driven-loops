---
title: "Task Breakdown: Launcher Lease Integration Test De-Flake"
description: "Ordered tasks to diagnose the misdiagnosed flake, fix the fixture, un-skip the suite, add the spawned-launcher socketPath bridge test, and verify."
trigger_phrases:
  - "launcher lease test tasks"
  - "deflake launcher tasks"
  - "spawned launcher socketPath tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/024-launcher-lease-integration-test"
    last_updated_at: "2026-06-04T13:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete: diagnose, fix, un-skip, new test, verify"
    next_safe_action: "None. All tasks done"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Breakdown

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending. `[P]` marks tasks that could run in parallel (none here; the test file is a single surface).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read `tests/launcher-lease.vitest.ts` and the two regression suites.
- [x] T-002 Read `mk-spec-memory-launcher.cjs` lease/socketPath/bridge paths and `launcher-ipc-bridge.cjs` `getIpcSocketPath`/`maybeBridgeLeaseHolder`.
- [x] T-003 Reproduce the failure: un-skip a copy, run 3x, capture spawned-launcher stderr.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Diagnose: confirm MODULE_NOT_FOUND for `./lib/model-server-supervision.cjs` because the fixture copies only the launcher .cjs.
- [x] T-005 Copy the launcher `lib/` tree into each fixture workspace via `cpSync`.
- [x] T-006 Add a per-workspace `socketDir` inside the temp root and pin `SPECKIT_IPC_SOCKET_DIR` to it in `spawnLauncher` (overridable per call).
- [x] T-007 Harden `afterEach`/`terminate` reaping (SIGTERM then SIGKILL) and widen bounded timeouts (lease 8s, exit 10s).
- [x] T-008 Set `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` on the LEASE_HELD_BY / legacy-path tests so they take the deterministic plaintext-diagnostic path instead of attempting a bridge.
- [x] T-009 Un-skip the suite (`describe.skip` to `describe`).
- [x] T-010 Add `STUB_IPC_DAEMON` context-server stub that binds the JSON-RPC IPC socket.
- [x] T-011 Add the spawned-launcher socketPath bridge test (owner records socketPath; divergent-env secondary bridges to the stored path).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-012 Run `npx vitest run tests/launcher-lease.vitest.ts` 3x; confirm 9 passed each time.
- [x] T-013 Audit `ps` for temp-dir orphan launcher/daemon processes after the run.
- [x] T-014 Run `launcher-ipc-bridge-probe.vitest.ts` and `launcher-recycle-lease.vitest.ts`; confirm 16 passed.
- [x] T-015 Run `validate.sh --strict` on this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0/P1 requirements in `spec.md` satisfied with evidence in `checklist.md`.
- Suite green 3x, zero temp-dir orphans, regressions pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Verified fix: packet `020-lease-socket-path`
<!-- /ANCHOR:cross-refs -->
