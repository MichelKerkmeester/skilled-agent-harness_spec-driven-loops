---
title: "Changelog: Daemon-lifecycle healing (FTS auto-heal + clean-close barrier + substrate test) [014-infra-memory-db-and-graph-churn/002-daemon-lifecycle-healing]"
description: "Chronological changelog for the Daemon-lifecycle healing (FTS auto-heal + clean-close barrier + substrate test) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/002-daemon-lifecycle-healing` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn`

### Summary

The recurring SQLITE_CONSTRAINT_PRIMARYKEY write failure now heals itself. The 032 deep-research loop traced it to one production root cause (SQ4): the mk-spec-memory launcher could respawn over an unresponsive incumbent daemon without verifying the database closed cleanly, leaving the FTS5 shadow divergent so the next write aborted. Three fixes close it.

### Added

- Added boot FTS auto-rebuild in runBootFtsIntegrityCheck() (context-server.ts): when the unclean-shutdown marker is present and integrity-check fails, the daemon rebuilds the FTS5 shadow, re-verifies, and reports health as repaired. Falls back to detect-only on rebuild failure or SPECKIT_BOOT_FTS_AUTOHEAL=0.
- Added UNCLEAN_SHUTDOWN_MARKER, uncleanShutdownMarkerPath(), uncleanMarkerPresent(), and cleanCloseAfterReap() to mk-spec-memory-launcher.cjs as the clean-close barrier.
- Created launcher-clean-close-barrier.vitest.ts covering the cleanCloseAfterReap truth table (killed x markerPresent matrix) and marker-path resolution.
- Updated context-server.vitest.ts T56c to assert the new auto-heal contract.

### Changed

- Extended BootFtsIntegrityHealth with the repaired state so the boot path reports whether the FTS5 shadow was rebuilt.
- Updated reapLeaseChildBeforeRespawn() to compute and log cleanClose after reaping, making unclean DB handoffs visible without blocking respawn.
- Rewrote substrate-runner-harness.vitest.ts assertions to separate runner diagnostic rows from scenario rows, reject connection and scenario FAILs, tolerate SKIP and PARTIAL, and require the memory scenario to actually run.

### Fixed

- None. This packet implements lifecycle healing; no prior defect was repaired in place.

### Verification

- npm run build (shared + mcp-server) - PASS (exit 0)
- node --check launcher - PASS
- context-server.vitest.ts - PASS, 378/378 (T56c asserts auto-heal)
- launcher-clean-close-barrier.vitest.ts - PASS, 4/4
- substrate stress (vs real daemon) - PASS, 1/1 (410 ran; runner + Code-Graph SKIP tolerated)
- launcher-watchdog.vitest.ts isRespawnLockStale - FAIL - pre-existing, fails on HEAD too without this change; unrelated
- Comment-hygiene audit - PASS, 0 ephemeral-pointer violations
- Tasks complete - 14 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp_server/context-server.ts` | Modified | F1 boot FTS auto-heal + 'repaired' health |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | F2 clean-close barrier + exported helpers |
| `mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modified | F3 assertion correctness |
| `mcp_server/tests/context-server.vitest.ts` | Modified | T56c updated for the auto-heal contract |
| `mcp_server/tests/launcher-clean-close-barrier.vitest.ts` | Created | F2 unit test |

### Follow-Ups

- Live two-launcher integration is not exercised end-to-end; F2's decision logic and marker resolution are unit-tested but the live respawn path is covered at syntax and behavior level only.
- The durable systemic fix (worktree-per-session isolation) removes the concurrent-launcher contention that triggers this root cause; it is intentionally deferred.
- launcher-watchdog.vitest.ts > isRespawnLockStale fails on HEAD independently of this change and is not addressed here.
