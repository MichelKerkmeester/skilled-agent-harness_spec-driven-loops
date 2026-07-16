---
title: "Changelog: Launcher RSS-ceiling watchdog and graceful-exit supervision"
description: "The mk-spec-memory launcher gained an RSS-ceiling watchdog, a crash-loop-guarded supervisor and a childPid lease field. On a sustained memory-ceiling breach the launcher gracefully exits so the host relaunches a fresh MCP session rather than waiting for the OS OOM-killer."
trigger_phrases:
  - "launcher rss watchdog"
  - "graceful exit supervision daemon"
  - "crash loop guard launcher"
  - "childPid lease field"
  - "process tree rss sidecar"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/006-graceful-exit-watchdog` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The mk-spec-memory launcher had no RSS ceiling and no supervised recovery. The embedding model's native memory (held in a forked sidecar grandchild under the default auto policy) grew unchecked until the OS OOM-killed the process. Nothing restarted it. Recovery required a manual MCP reconnect.

This phase added a periodic process-tree RSS monitor that rolls up memory across the daemon child and sidecar grandchild. On a sustained ceiling breach the launcher SIGTERMs the child, waits beyond the daemon's 5-second shutdown deadline, SIGKILLs if needed, then exits cleanly so the host runtime can relaunch a fresh session. Transparent in-process respawn was rejected because re-piping stdio bytes cannot restore the MCP initialize handshake. The self-exit path ships default-off until the host relaunch contract is confirmed. A crash-loop-guarded supervisor with exponential backoff was added for unexpected child exits. The daemon child pid is now written to the lease, which is the precondition for phase 007.

### Added

- `childPid` field in the launcher lease JSON written after spawn (additive, no existing reader breaks)
- `mcp_server/tests/launcher-watchdog.vitest.ts` with 12 headless tests covering RSS roll-up, EPERM-as-unknown, backoff vs give-up, grace clamp, default-off gating, orphan-reap-from-snapshot, dead-pid guard, lease shape, and kill-path EPERM

### Changed

- `sampleProcessTreeRssMb` in `mk-spec-memory-launcher.cjs` now walks the daemon's process tree including sidecar grandchildren via an injectable ps/proc runner. EPERM results are treated as unknown rather than as a breach.
- RSS-ceiling watchdog interval added with `.unref()` so it does not hold the event loop. N consecutive breaches trigger SIGTERM then SIGKILL then a clean `process.exit` (default-off behind `SPECKIT_LAUNCHER_RSS_SELF_EXIT=1`).
- Child-exit handler refactored into a crash-loop-guarded supervisor with configurable window, threshold and exponential backoff via environment variables. Give-up fails loud and reaps orphaned sidecars using a before-death descendant snapshot.

### Fixed

- Give-up reap was a no-op on hard daemon death because a detached sidecar re-parents to pid 1, making the dead childPid absent from `ps`. A before-death descendant snapshot (`lastKnownDescendantPids`) is now maintained by an always-on 30-second monitor. On give-up, `reapProcessTreeGroups` reaps the union of any still-live childPid subtree and snapshot pids, gated by an alive-check to bound pid-reuse.

### Verification

| Check | Result |
|-------|--------|
| `node --check mk-spec-memory-launcher.cjs` | PASS |
| `vitest run tests/launcher-watchdog.vitest.ts` | PASS (12/12) |
| Require-safety: import does not spawn a daemon | PASS (`require.main` guard, exports load clean) |
| 6-lens adversarial review including run-as-script regression | PASS (1 real P1 found: REQ-007 reap no-op + 3 test gaps) |
| REQ-007 reap fix and 3 test gaps closed, then focused re-review | PASS (0 confirmed defects, no wrong-pid-kill path) |
| `validate.sh --strict` on this packet | PASS |
| Host relaunch-on-exit-0 and SC-001/SC-002 live RSS/crash-loop | DEFERRED (REQ-008 unconfirmed, live observation needs a running daemon) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | `require.main` guard and exported helpers, process-tree RSS sampler with injectable runner and EPERM-as-unknown, default-off breach to graceful self-exit, crash-loop supervisor with before-death descendant snapshot and reap-after-reparent, additive `childPid` lease field, pure `buildLeaseObject` |
| `mcp_server/tests/launcher-watchdog.vitest.ts` | Create (NEW) | 12 headless tests: RSS roll-up, EPERM-unknown, backoff vs give-up, grace clamp, default-off gating, orphan-reap-from-snapshot, dead-pid guard, snapshot keep-on-unknown, lease shape, kill-path EPERM |

### Follow-Ups

- Confirm the host-runtime relaunch-on-clean-exit contract (REQ-008) before enabling RSS-breach self-exit by default. Until confirmed, activate with `SPECKIT_LAUNCHER_RSS_SELF_EXIT=1`.
- Run SC-001 and SC-002 against a live daemon to observe a real ceiling-breach recycle and crash-loop behavior (headless tests use injectable runners and mocked signals).
- Add a unit test for the `recycleViaGracefulSelfExit` mechanism and the `launcherShutdownInProgress` no-respawn guard, which are code-reviewed correct but exercised only on the default-off path.
- Document the give-up reap pid-reuse residual: the before-death snapshot is at most one monitor tick old and the alive-gate bounds but does not fully eliminate reaping a reused pid.
