---
title: "Implementation Plan: Launcher Lease Integration Test De-Flake"
description: "Fix the fixture to copy the launcher's lib/ tree, pin a per-test SPECKIT_IPC_SOCKET_DIR, un-skip the suite, and add a spawned-launcher socketPath bridge test, all test-only."
trigger_phrases:
  - "launcher lease test plan"
  - "deflake fixture lib copy plan"
  - "spawned launcher socketPath plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/024-launcher-lease-integration-test"
    last_updated_at: "2026-06-04T13:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Documented test-only plan: fixture lib copy, socket isolation, new test"
    next_safe_action: "None. Plan executed and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No production .cjs change needed; the launcher and bridge were already correct."
---
# Implementation Plan: Launcher Lease Integration Test De-Flake

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (vitest), Node.js child_process |
| **Framework** | Vitest 4.x |
| **Storage** | Filesystem lease file + UNIX-domain IPC socket |
| **Testing** | vitest run |

### Overview
The lease integration fixture copied only `mk-spec-memory-launcher.cjs` into each temp workspace, but the launcher `require`s `./lib/model-server-supervision.cjs`, `./lib/launcher-session-proxy.cjs`, and `./lib/launcher-ipc-bridge.cjs` at load time. Every spawned launcher therefore died with MODULE_NOT_FOUND before writing a lease, which surfaced as a `waitForLeasePid` timeout and was mislabeled a process lifecycle flake. The fix copies the whole `lib/` tree into the fixture, pins a per-test `SPECKIT_IPC_SOCKET_DIR` for isolation, un-skips the suite, and adds an end-to-end socketPath bridge test.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause of the failure confirmed by reproduction (MODULE_NOT_FOUND in spawned launcher stderr)
- [x] Packet 020 socketPath lease semantics understood
- [x] Isolation strategy that never touches the live daemon socket

### Definition of Done
- [x] Suite un-skipped and passing 3x
- [x] No orphaned processes after the run
- [x] Regression suites pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Integration test harness: spawn real launcher process, poll filesystem lease + IPC socket for readiness, assert, reap.

### Key Components
- **createWorkspace**: builds an isolated temp repo root, copies the launcher + its `lib/` tree, writes stub dist files, allocates a per-workspace socket dir.
- **spawnLauncher**: spawns the launcher with a pinned `SPECKIT_IPC_SOCKET_DIR` (overridable to model a divergent worktree env).
- **STUB_IPC_DAEMON**: a stub context-server that binds the JSON-RPC IPC socket so the liveness deepProbe classifies the owner alive and a secondary launcher bridges.

### Data Flow
Owner launcher writes lease (incl. `socketPath`) then spawns the stub child which binds the socket. A secondary launcher reads the same lease file but resolves a divergent `SPECKIT_IPC_SOCKET_DIR`; the bridge prefers the stored `socketPath` and connects to the owner socket.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| tests/launcher-lease.vitest.ts | Spawned-launcher lease harness (was skipped) | update (fixture lib copy, isolation, un-skip, new test) | `npx vitest run` 9 passed |
| .opencode/bin/lib/*.cjs | Launcher runtime requires | unchanged - now copied into the fixture, not edited | grep require('./lib/...') in launcher |
| .opencode/bin/mk-spec-memory-launcher.cjs | Lease writer + bridge caller | unchanged (already records socketPath) | lease payload contains socketPath in the new test |
| tests/launcher-ipc-bridge-probe.vitest.ts | Unit-level socketPath coverage | unchanged - regression check | 16 passed alongside recycle-lease |

Required inventories:
- Launcher local requires: `rg -n "require\('\./lib" .opencode/bin/mk-spec-memory-launcher.cjs` -> 3 modules.
- socketPath consumers: `rg -n "socketPath" .opencode/bin/lib/launcher-ipc-bridge.cjs .opencode/bin/mk-spec-memory-launcher.cjs`.
- Algorithm invariant: bridge prefers `lease.socketPath` when it exists on disk; falls back to recompute otherwise; this packet exercises the prefer-stored branch with a real spawned owner.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Diagnose
- [x] Read the skipped suite and the launcher production file
- [x] Reproduce the failure and capture spawned-launcher stderr (MODULE_NOT_FOUND)
- [x] Confirm the missing dependency is the `./lib/*.cjs` tree

### Phase 2: De-Flake + Un-Skip
- [x] Copy `lib/` into each fixture workspace via `cpSync`
- [x] Pin per-test `SPECKIT_IPC_SOCKET_DIR` inside the temp root
- [x] Strengthen `afterEach` reaping (SIGTERM then SIGKILL) and bump bounded timeouts
- [x] Change `describe.skip` to `describe`

### Phase 3: New Test + Verification
- [x] Add a stub daemon that binds the IPC socket and add the socketPath bridge test
- [x] Run the suite 3x; confirm green and no orphans
- [x] Run the two regression suites
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Spawned launcher lease write/read/cleanup + socketPath bridge | vitest, child_process |
| Regression | Bridge probe unit + in-place recycle lease retention | vitest |
| Manual | Orphan-process `ps` audit after the run | ps |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Packet 020 (`020-lease-socket-path`): the lease.socketPath field and bridge prefer-stored-path behavior this test verifies.
- Launcher `lib/` modules: all Node-builtin-only requires; no `node_modules` needed in the fixture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the single test file to restore `describe.skip`. No production code or runtime state is touched, so rollback has zero blast radius.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (diagnose) gates Phase 2 (the fix depends on knowing the missing module). Phase 3 (new test) depends on Phase 2's working fixture.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Actual |
|-------|----------|--------|
| Diagnose | 0.5h | 0.5h |
| De-flake + un-skip | 0.5h | 0.5h |
| New test + verify | 0.5h | 0.5h |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No data migration, no schema change, no daemon recycle. `git checkout` of the test file fully reverts. The live daemon was never touched (isolated socket dirs).
<!-- /ANCHOR:enhanced-rollback -->
