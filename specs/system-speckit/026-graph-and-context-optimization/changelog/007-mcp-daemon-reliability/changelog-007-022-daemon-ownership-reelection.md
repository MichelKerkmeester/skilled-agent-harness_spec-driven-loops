---
title: "Changelog: RC-2 daemon ownership re-election (foundation) [007-mcp-daemon-reliability/022-daemon-ownership-reelection]"
description: "Chronological changelog for the RC-2 daemon ownership re-election (foundation) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/022-daemon-ownership-reelection` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The shared daemon can now be configured to outlive its owning session. Phase 017 made the owner exit cleanly, but the daemon still died with it because shutdownLauncherForSignal explicitly kills the context-server child. This packet lands the flag-gated, default-off foundation for the "complete" RC-2 fix: when enabled, the owner spawns the daemon detached and, on shutdown, releases it for a live secondary to bridge to instead of killing it. It ships dormant — default-off is byte-identical to phase 017 — because the full benefit needs a multi-session runtime-validation pass this session cannot do.

### Added

- daemonReelectionEnabled, contextServerSpawnIo, and shouldReleaseDaemonForReelection pure helpers in mk-spec-memory-launcher.cjs, all exported and unit-tested
- Shutdown release branch that reaps the model-server, keeps the daemon lease, drops only the owner lease, detaches the exit handler, and exits without killing the daemon
- launcher-daemon-reelection.vitest.ts covering flag logic, spawn-io (including flag-off identity assertion), and the release predicate

### Changed

- Verified the root cause: shutdownLauncherForSignal explicitly child.kill(signal)s the daemon, not a process-group effect
- Gated the context-server spawn on the flag (detached and unref when on; byte-identical historical options when off) in mk-spec-memory-launcher.cjs
- Ran node --check and a 12-assertion require smoke test including flag-off spawn-io identity
- Ran gpt-5.5-fast HIGH adversarial review of the diff; it found a blocking exit-handler lease-wipe bug that was fixed and re-verified

### Fixed

- The process.on('exit', clearAllLeaseFiles) handler would wipe the daemon lease that the release path deliberately preserves, leaving the released daemon alive but unfindable; the release branch now detaches the handler before dropping only the owner lease (found by adversarial review)

### Verification

- node --check launcher - PASS
- require-time smoke (12 assertions incl. flag-off identity) - PASS
- launcher-daemon-reelection.vitest.ts - PASS
- full launcher suite (9 files / 79 tests) - PASS (no regression)
- gpt-5.5 adversarial diff review - found 1 blocking bug (exit-handler lease wipe) -> FIXED + re-verified
- comment-hygiene (durable WHY, no ids/paths) - PASS
- validate.sh --strict (this packet) - PASS
- live secondary adoption + terminal death - DEFERRED (flag default-off; needs a multi-session runtime-validation pass)

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | daemonReelectionEnabled / contextServerSpawnIo / shouldReleaseDaemonForReelection (pure, exported); spawn gate (detached + unref when on); shutdown release branch (keep daemon lease, drop owner lease, detach the exit handler, exit without killing the daemon) |
| `mcp_server/tests/launcher-daemon-reelection.vitest.ts` | Created | Flag + spawn-io (incl. flag-off identity) + release-predicate tests |

### Follow-Ups

- Runtime-validate secondary adoption and terminal idle-death on multiple live sessions before enabling the flag.
- Foundation, not live hardening. The flag is default-off; the benefit (daemon survives owner exit) only materializes once a runtime-validation pass enables it. Default behavior matches the prior phase.
- Secondary ownership adoption is unproven, with a split-brain mechanism identified. After release, a secondary can bridge to the surviving daemon's socket, but full re-election of recycle ownership is not yet validated. Cross-validation pinned the exact blocker: the released daemon lease still records the exiting launcher's pid, so an adopter that liveness-checks the lease pid sees a dead pid, treats the lease as stale, and spawns a second daemon. Before the flag can be enabled, the release must rewrite the lease into an explicit released/ownerless state and the adopter must adopt rather than respawn.
- Terminal death relies on the orphan sweeper. A released daemon reparents to pid 1; until ownership adoption and idle-death are validated, the orphan sweeper bounds any released-daemon leak.
