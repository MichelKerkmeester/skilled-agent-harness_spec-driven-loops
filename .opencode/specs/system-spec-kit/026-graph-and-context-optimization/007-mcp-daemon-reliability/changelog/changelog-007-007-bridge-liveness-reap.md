---
title: "MCP Daemon Reliability Phase 007: Bridge Liveness Probe and Reap-Aware Respawn"
description: "Application-level JSON-RPC handshake probe added before IPC bridge connection. Reap-before-respawn path wired off the phase-006 child-pid lease. Cross-process single-winner respawn lock prevents double-daemon on concurrent reconnects. Three adversarial-review defects fixed before merge."
trigger_phrases:
  - "bridge liveness probe F3"
  - "reap before respawn dead socket"
  - "ipc bridge handshake single-winner"
  - "launcher-ipc-bridge probe"
  - "mcp daemon wedge reconnect fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/007-bridge-liveness-reap` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The IPC bridge previously connected to a socket whenever its file existed, with no check that the daemon behind it was actually alive. A SIGKILL'd or OOM-wedged daemon left a stale socket on disk. The bridge connected to nothing, served no MCP traffic. A manual reconnect was required. Because libuv accepts connections even when the Node.js event loop is blocked, a raw accept-success could not distinguish a healthy daemon from a wedged one.

Phase 007 ended this failure mode. Before bridging, `probeDaemon` now opens a throwaway connection and sends a newline-delimited JSON-RPC `initialize` request, resolving ALIVE on the first matching-id reply within roughly 2500ms and DEAD on timeout, connection-error or early close. On a confirmed-dead verdict, the launcher reaps the daemon child pid recorded in the phase-006 lease (SIGTERM, then 7000ms grace, then SIGKILL), acquires a cross-process exclusive `wx` lock with stale-lock reclaim, then spawns exactly one fresh daemon. Both launcher call sites were made async with a running-child duplicate-spawn guard. An adversarial review found and fixed three defects before the commit landed: a one-shot relaunch flag that disabled crash-loop recovery, a respawn lock with no stale reclaim, plus a bootstrap lock carrying the same gap.

### Added

- `probeDaemon(socketPath)` function in `launcher-ipc-bridge.cjs`: opens a throwaway connection with a newline-delimited JSON-RPC `initialize` handshake and a bounded reply window returning alive, dead or timeout
- `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` (NEW): four headless fake-socket probe tests covering alive, wedged (accepts-but-silent), connection-error, plus a respawn-verdict path
- Bootstrap lock and exclusive `wx` single-winner lock on the respawn path in `mk-spec-memory-launcher.cjs`, with stale-lock reclaim keyed on pid-liveness and a 60-second age backstop
- `shouldSkipLaunch` running-child duplicate-spawn guard at both launcher call sites
- Bounded `tcp://` EADDRINUSE retry and fallback in `socket-server.ts` for the respawn path

### Changed

- `maybeBridgeLeaseHolder` made async, now returns a `{action: bridge | respawn | report}` verdict object. The `existsSync`-only gate is replaced by the JSON-RPC probe result
- Reap-before-respawn wired into `mk-spec-memory-launcher.cjs`: uses the phase-006 `childPid` lease via `processLiveness`, then `reapProcessTreeGroups` for the sidecar, before spawning a replacement
- Both launcher call sites (`mk-spec-memory-launcher.cjs` and `mk-code-index-launcher.cjs`) updated to `await` the async bridge decision
- `mk-code-index-launcher.cjs` reuses its existing `wx` owner-lease as the single-winner primitive for respawn serialization

### Fixed

- P0: one-shot `launchStarted` flag permanently disabled F1 crash-loop relaunch after the first respawn. Replaced with a per-cycle running-child guard (`shouldSkipLaunch`)
- P1: respawn `wx`-lock had no stale reclaim path. A SIGKILL'd launcher would permanently wedge all future respawns. Fixed with pid-liveness plus age backstop matching the mk-code-index self-heal pattern
- P2: bootstrap lockdir lacked the same stale-reclaim as the `wx` lock. Patched in the same commit

### Verification

| Check | Result |
|-------|--------|
| `node --check` (bridge + both launchers) | PASS x3 |
| `npm run build --workspace=@spec-kit/mcp-server` (tsc) | PASS |
| `vitest run launcher-ipc-bridge-probe` (alive/wedged/connection-error/respawn-verdict) | PASS (4/4) |
| `vitest run launcher-watchdog` (F1 regression + 2 new fix tests) | PASS (14/14) |
| 6-lens adversarial review (happy-path, probe, reap, single-winner, async-guard, socket-server) | PASS (3 defects found: P0 relaunch regression, P1/P2 lock wedge) |
| Defect fixes and focused re-review | PASS (0 confirmed defects remaining) |
| `validate.sh --strict` on this packet | PASS |
| SC-001/SC-002 live kill/wedge/reconnect and concurrent race and tcp respawn | DEFERRED (needs a running daemon) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Modify | `probeDaemon` JSON-RPC handshake. Async verdict-based `maybeBridgeLeaseHolder` replacing the `existsSync` gate |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | Dead-socket respawn gated on `childPid` lease. Reap-before-respawn. Bootstrap and `wx` single-winner with stale-lock reclaim. `shouldSkipLaunch` running-child guard |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Await async bridge decision. Reuse existing `wx` owner-lease as single-winner primitive. Added `use strict` |
| `mcp_server/lib/ipc/socket-server.ts` | Modify | Bounded `tcp://` EADDRINUSE retry and fallback (UNIX unlink-relisten path intact) |
| `mcp_server/tests/launcher-ipc-bridge-probe.vitest.ts` | Create (NEW) | Four headless fake-socket probe tests (alive/wedged/connection-error/respawn-verdict) |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Modify | Two regression tests added for `shouldSkipLaunch` and `isRespawnLockStale` covering the review-found fixes |

### Follow-Ups

- Run live concurrent-launcher and kill/wedge/reconnect validation on a running daemon to satisfy SC-001 and SC-002. Headless fake-socket coverage exists. Live kill/wedge/reconnect and tcp respawn need a daemon process.
- Verify no duplicate spawn under a slow-probe concurrent race once a live test harness is available (REQ-003/004 are covered by adversarial review and bootstrap-lock analysis but not by a live concurrent test).
- Evaluate the `socketReadyAt` readiness marker (REQ-007) in a future phase. The probe's reply timeout already degrades slow cold starts gracefully so this is not blocking.
- Monitor for respawn-lock pid-reuse edge case: the 60-second age backstop plus bootstrap-lock serialization bounds the window but a reused pid within that window remains theoretically possible.
