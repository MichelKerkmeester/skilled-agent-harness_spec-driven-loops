---
title: "Implementation Summary: Launcher Lease Integration Test De-Flake"
description: "Un-skipped the spawned-launcher lease integration suite by fixing its real bug (fixture never copied the launcher's lib/ tree), isolated it per-test, and added an end-to-end test proving packet 020's lease.socketPath bridges a divergent-env launcher to the owner's real socket."
trigger_phrases:
  - "launcher lease integration deflaked"
  - "spawned launcher socketPath verified"
  - "lib copy fixture fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/024-launcher-lease-integration-test"
    last_updated_at: "2026-06-04T13:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Suite green 3x; 16 regression tests pass; no temp-dir orphans"
    next_safe_action: "None. Test-only change; no daemon recycle needed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The flake was a misdiagnosis: a deterministic MODULE_NOT_FOUND from a fixture that copied only the launcher .cjs, not its ./lib/*.cjs requires."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-launcher-lease-integration-test |
| **Completed** | 2026-06-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spawned-launcher lease integration suite is alive again. It had been parked behind `describe.skip` with the note "known launcher process lifecycle flake" but it was never flaky: it failed 100% of the time. Now it runs all nine tests green in under a second and, for the first time, proves packet 020's `lease.socketPath` works end-to-end against a real spawned launcher.

### Root cause: a fixture that copied half the launcher
The fixture copied `mk-spec-memory-launcher.cjs` into each temp workspace but not its `lib/` tree. The launcher `require`s `./lib/model-server-supervision.cjs`, `./lib/launcher-session-proxy.cjs`, and `./lib/launcher-ipc-bridge.cjs` at load time, so every spawned launcher crashed with `Cannot find module './lib/model-server-supervision.cjs'` before it could write a lease. That surfaced downstream as a `waitForLeasePid` timeout, which looked like a process race. The fix copies the whole `lib/` directory into the fixture with `cpSync`; all those modules use only Node builtins, so no `node_modules` is needed.

### Per-test isolation that never touches the live daemon
Every workspace now allocates its own `ipc/` socket dir inside the temp root, and `spawnLauncher` pins `SPECKIT_IPC_SOCKET_DIR` to it. No spawned launcher can resolve or bridge the real `/tmp/mk-spec-memory` daemon socket used by live sessions. `afterEach` reaps every spawned launcher (SIGTERM then a SIGKILL backstop) before removing temp dirs, so a failure can't leak processes.

### New end-to-end socketPath bridge test
A new stub context-server (`STUB_IPC_DAEMON`) binds a minimal JSON-RPC echo socket at the launcher's IPC path. The test boots a real owner launcher, asserts its lease records `socketPath` equal to the owner socket, then boots a second launcher under a divergent `SPECKIT_IPC_SOCKET_DIR`. The second launcher reads the same lease, prefers the stored `socketPath`, and logs `bridging to lease holder pid=<owner> socket=<owner socket>` instead of recomputing a divergent path and reporting no-bridge-socket. This is the real-process counterpart to the unit coverage already in `launcher-ipc-bridge-probe.vitest.ts`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts | Modified | Copy lib/ into fixture, per-test socket isolation, un-skip, add spawned-launcher socketPath bridge test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Diagnosed by un-skipping a throwaway copy and capturing the spawned launcher's stderr, which named the missing module directly. After fixing the fixture, ran the suite three times (9 passed each, ~0.9-1.1s), audited `ps` for temp-dir orphans (none), and ran both regression suites (16 passed). No production code changed and no daemon was recycled.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Copy the whole `lib/` tree instead of stubbing each module | The launcher's real lease/bridge logic is exactly what the integration test should exercise; stubbing would defeat the purpose and the modules are builtin-only so copying is cheap. |
| Set `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` on the LEASE_HELD_BY / legacy-path tests | Those tests assert the plaintext diagnostic; with the bridge enabled and no live owner socket they would attempt a probe and take a slower, less deterministic path. |
| Pin a per-test `SPECKIT_IPC_SOCKET_DIR` for every spawn | Guarantees the suite can never reach the live daemon socket, satisfying the isolation safety requirement explicitly rather than relying on the temp-root db dir default. |
| Keep the full suite un-skipped (no env-gated sub-test) | Every test became reliable once the real bug was fixed, so no sub-test needed gating. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/launcher-lease.vitest.ts` (run 1) | PASS, 9 passed (9), 0 skipped, ~1.09s |
| Same, run 2 | PASS, 9 passed (9), ~1.06s |
| Same, run 3 | PASS, 9 passed (9), ~0.91s |
| `npx vitest run tests/launcher-ipc-bridge-probe.vitest.ts tests/launcher-recycle-lease.vitest.ts` | PASS, 16 passed (16) |
| Temp-dir orphan `ps` audit after the run | PASS, NO TEMP-DIR ORPHANS (only pre-existing live daemons, unchanged PIDs) |
| `validate.sh <packet> --strict` | Exit 0 (recorded at completion) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stub daemon, not the real context-server.** The socketPath bridge test binds a minimal JSON-RPC echo socket rather than booting the full `context-server.js`. That is sufficient to exercise the launcher lease + bridge prefer-stored-path logic, which is what packet 020 changed; it does not exercise real daemon request handling.
<!-- /ANCHOR:limitations -->
