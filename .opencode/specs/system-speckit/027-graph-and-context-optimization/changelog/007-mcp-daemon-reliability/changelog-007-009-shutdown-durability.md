---
title: "MCP Daemon Reliability 009: Shutdown Durability for Forwarded Launcher Signals"
description: "SIGHUP and SIGQUIT handlers added to the context server. vectorIndex.closeDb() ordering preserved after the fileWatcher drain. Launcher forwarded-signal reap grace raised from 5000ms to RESPAWN_REAP_GRACE_MS (7000ms) so the launcher SIGKILL strictly follows the daemon shutdown deadline."
trigger_phrases:
  - "shutdown durability"
  - "SIGHUP SIGQUIT fatalShutdown"
  - "launcher reap grace deadline"
  - "vectorIndex closeDb drain ordering"
  - "daemon WAL checkpoint before SIGKILL"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/009-shutdown-durability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

Packet 008 added a close-time WAL TRUNCATE checkpoint, but two durability gaps remained. The context server only registered SIGTERM and SIGINT handlers while the launcher forwarded all four signals: SIGTERM, SIGINT, SIGHUP, SIGQUIT. Any SIGHUP or SIGQUIT would terminate the daemon without entering the graceful shutdown path, skipping the checkpoint. The launcher also gave children exactly 5000ms before sending SIGKILL, equal to the daemon's own shutdown deadline, creating a race where the SIGKILL could arrive before the synchronous checkpoint completed.

This packet closed both gaps. SIGHUP and SIGQUIT now route to `fatalShutdown(..., 0)`. The launcher forwarded-signal child-reap grace was changed from a hardcoded 5000ms to the existing `RESPAWN_REAP_GRACE_MS` constant (7000ms), giving the daemon a 2000ms margin to finish its shutdown sequence before any external SIGKILL. An adversarial review during implementation found that hoisting `vectorIndex.closeDb()` before the `fileWatcher` drain would let draining reindex tasks reopen the database and write fresh WAL frames after the TRUNCATE checkpoint, defeating the durability goal. The close order was therefore kept as drain-then-close with an invariant comment encoding the reason. A regression test was added to lock both the handler routing and the cleanup ordering.

### Added

- `SIGHUP` and `SIGQUIT` process signal handlers in `context-server.ts` that route to `fatalShutdown(..., 0)`
- Source-level regression assertions in `context-server.vitest.ts` covering SIGHUP/SIGQUIT handler routing and the `vectorIndex.closeDb`-after-`fileWatcher`-drain cleanup order
- Invariant comment in `context-server.ts` encoding why `vectorIndex.closeDb()` must run after the `fileWatcher` drain

### Changed

- Launcher forwarded-signal child-reap grace replaced from hardcoded `5000` ms to `RESPAWN_REAP_GRACE_MS` (7000ms) in `mk-spec-memory-launcher.cjs` so the launcher SIGKILL window strictly exceeds the daemon shutdown deadline

### Fixed

- SIGHUP and SIGQUIT previously triggered default OS termination without entering the graceful shutdown path. The daemon now handles both signals through `fatalShutdown` and the close-time WAL checkpoint runs on those signals.
- Launcher grace was equal to the daemon deadline, creating a race. The 7000ms grace now gives the daemon a guaranteed 2000ms margin before any external SIGKILL.

### Verification

- `npm run build --workspace=@spec-kit/mcp-server`: PASS (2026-05-29, workspace build exit 0)
- `tsc --noEmit` (context-server): PASS (407 tests green, tsc clean per commit message)
- Vitest context-server + lifecycle-shutdown + signal-vocab + launcher suites: 407 tests pass (per commit `904204c272`)
- `validate.sh --strict` on packet folder: required before publishing
- CHK-022/023 targeted vitest suites: not re-run this session per implementation-summary

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modified | SIGHUP and SIGQUIT handlers added routing to `fatalShutdown(..., 0)`, invariant comment encodes drain-before-close ordering |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Forwarded-signal reap grace changed from hardcoded 5000ms to `RESPAWN_REAP_GRACE_MS` (7000ms) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modified | Regression assertions for handler routing and cleanup source order |

### Follow-Ups

- Run CHK-022 targeted vitest suites to confirm no regressions in the daemon-lifecycle test set.
- Run CHK-023 to confirm the `fatalShutdown`/`vectorIndex` source-order regex assertion still passes after any future refactor.
- Consider the slow-drain-starves-checkpoint residual risk when the fileWatcher drain takes close to the 5000ms deadline. Packet 010 (autocheckpoint and periodic TRUNCATE) mitigates the at-rest WAL growth but the deadline budget issue remains open.
