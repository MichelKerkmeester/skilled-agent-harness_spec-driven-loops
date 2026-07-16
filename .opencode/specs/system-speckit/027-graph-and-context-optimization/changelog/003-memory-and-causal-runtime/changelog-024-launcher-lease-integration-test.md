---
title: "Launcher Lease Integration Test De-Flake"
description: "The spawned-launcher lease integration suite was describe.skip'd as a flake, but it failed 100% deterministically: the fixture copied the launcher .cjs but not its lib/ tree, so every launcher died MODULE_NOT_FOUND before writing a lease. Un-skipped and de-flaked the suite, isolated it per-test, and added a spawned-launcher socketPath bridge test for packet 020."
trigger_phrases:
  - "launcher lease integration deflake"
  - "spawned launcher socketPath test"
  - "lib copy fixture module-not-found"
  - "un-skip launcher lease suite"
  - "024-launcher-lease-integration-test"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/024-launcher-lease-integration-test` (Level 2)

### Summary

The spawned-launcher lease integration suite (`tests/launcher-lease.vitest.ts`) sat behind `describe.skip` with the note "known launcher process lifecycle flake." The skip label was a misdiagnosis: the suite failed 100% of the time, not intermittently. The fixture copied `mk-spec-memory-launcher.cjs` into each temp workspace but not its `lib/` tree, so every spawned launcher crashed with `Cannot find module './lib/model-server-supervision.cjs'` before it could write a lease, surfacing downstream as a `waitForLeasePid` timeout that looked like a process race.

This packet un-skipped the suite, fixed the real root cause (copy the whole `lib/` tree with `cpSync`, all builtin-only modules so no `node_modules` needed), isolated each test with its own socket dir, and added an end-to-end test proving packet 020's `lease.socketPath` bridges a divergent-env launcher to the owner's real socket. Test-only change, no production code touched, no daemon recycled. Committed as `d1183dc07d`.

### Added

- A spawned-launcher socketPath bridge test: a stub context-server (`STUB_IPC_DAEMON`) binds a minimal JSON-RPC echo socket at the launcher's IPC path. The test boots a real owner launcher, asserts its lease records `socketPath` equal to the owner socket, then boots a second launcher under a divergent `SPECKIT_IPC_SOCKET_DIR` that prefers the stored path and logs `bridging to lease holder pid=<owner> socket=<owner socket>`.

### Changed

- `tests/launcher-lease.vitest.ts`: fixture now copies the whole `lib/` tree, every workspace allocates its own `ipc/` socket dir inside the temp root, `spawnLauncher` pins `SPECKIT_IPC_SOCKET_DIR` to it, `afterEach` reaps every spawned launcher (SIGTERM then a SIGKILL backstop) before removing temp dirs, and the suite is un-skipped (`describe.skip` to `describe`).
- LEASE_HELD_BY / legacy-path tests now set `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` so they assert the plaintext diagnostic without attempting a slower probe.

### Fixed

- The deterministic `MODULE_NOT_FOUND` boot crash in the lease integration fixture: it copied only the launcher `.cjs` and not its `./lib/*.cjs` requires, so every spawned launcher died before writing a lease. Packet 020's `lease.socketPath` was therefore verified by unit tests only until now.

### Verification

| Check | Result |
|-------|--------|
| `vitest run tests/launcher-lease.vitest.ts` (run 1) | PASS (9 passed, 0 skipped, ~1.09s) |
| Same, run 2 | PASS (9 passed, ~1.06s) |
| Same, run 3 | PASS (9 passed, ~0.91s) |
| `vitest run` launcher-ipc-bridge-probe plus launcher-recycle-lease | PASS (16 passed) |
| Temp-dir orphan `ps` audit after the run | PASS (no temp-dir orphans, only pre-existing live daemons, unchanged PIDs) |
| `validate.sh <packet> --strict` | PASS (Exit 0) |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts` | Copy `lib/` into the fixture, per-test socket isolation, un-skip, add the spawned-launcher socketPath bridge test |

### Follow-Ups

- Stub daemon, not the real context-server. The socketPath bridge test binds a minimal JSON-RPC echo socket rather than booting the full `context-server.js`. That is sufficient to exercise the launcher lease plus bridge prefer-stored-path logic (what packet 020 changed). It does not exercise real daemon request handling.
