---
title: "Daemon-lifecycle healing (FTS auto-heal + clean-close barrier + substrate test)"
description: "The recurring SQLITE_CONSTRAINT_PRIMARYKEY write failure now heals itself. Three fixes close the root cause: boot FTS5 shadow auto-rebuild, launcher clean-close barrier with logging, and corrected substrate stress test."
trigger_phrases:
  - "daemon lifecycle healing fts auto-heal"
  - "boot fts rebuild clean-close barrier"
  - "substrate stress test diagnostic row fix"
  - "mk-spec-memory launcher clean close"
  - "FTS5 shadow divergent repair"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-daemon-lifecycle-healing` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn`

### Summary

The recurring SQLITE_CONSTRAINT_PRIMARYKEY write failure now heals itself. The 032 deep-research loop traced it to one production root cause (SQ4): the mk-spec-memory launcher could respawn over an unresponsive incumbent daemon without verifying the database closed cleanly, leaving the FTS5 shadow divergent so the next write aborted. Three fixes close it.

### Added

- Boot FTS auto-rebuild with re-verify and env opt-out added to `runBootFtsIntegrityCheck()` in context-server.ts
- UNCLEAN_SHUTDOWN_MARKER, `uncleanShutdownMarkerPath()`, `uncleanMarkerPresent()`, and `cleanCloseAfterReap()` helpers added to mk-spec-memory-launcher.cjs
- T56c updated for the auto-heal contract in context-server.vitest.ts
- launcher-clean-close-barrier.vitest.ts test suite created for F2 unit coverage

### Changed

- Compute and log cleanClose in `reapLeaseChildBeforeRespawn()` with exported helpers in mk-spec-memory-launcher.cjs
- Rewrite substrate assertions with diagnostic/scenario split, FAIL-only rejection, SKIP tolerance, and memory-scenario-ran required in substrate-runner-harness.vitest.ts

### Fixed

- BootFtsIntegrityHealth extended with 'repaired' state when FTS5 shadow is rebuilt at boot in context-server.ts
- Finding class corrected: algorithmic lifecycle root cause identified and test-isolation stale test fixed
- Same-class producer inventory updated: FTS rebuild verb now maps to boot path (new) and memory_health (existing)
- Consumer inventory updated: .unclean-shutdown writer, boot-reader, and launcher-reader all accounted for
- Adversarial table test added for cleanCloseAfterReap covering 4-row killed-by-markerPresent matrix
- Matrix axes listed (killed, markerPresent) before completion

### Verification

- npm run build (shared + mcp-server) - PASS (exit 0)
- node --check launcher - PASS
- context-server.vitest.ts - PASS, 378/378
- launcher-clean-close-barrier.vitest.ts - PASS, 4/4
- substrate stress (vs real daemon) - PASS, 1/1 (410 ran, runner and Code-Graph SKIP tolerated)
- launcher-watchdog.vitest.ts isRespawnLockStale - FAIL (pre-existing on HEAD, unrelated)
- Comment-hygiene audit - PASS, 0 ephemeral-pointer violations
- Tasks complete - 14 completed task items recorded

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/context-server.ts` | Modified | F1 boot FTS auto-heal + 'repaired' health |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | F2 clean-close barrier + exported helpers |
| `mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modified | F3 assertion correctness |
| `mcp_server/tests/context-server.vitest.ts` | Modified | T56c updated for the auto-heal contract |
| `mcp_server/tests/launcher-clean-close-barrier.vitest.ts` | Created | F2 unit test |

### Follow-Ups

- Live two-launcher integration is not exercised end-to-end. F2 decision logic and marker resolution are unit-tested. The live respawn path is covered at syntax and behavior level only. This is the same gap packet 031 and 009 left open.
- The durable systemic fix is deferred. F4 (worktree-per-session isolation, packet 035) removes the concurrent-launcher contention that triggers this in the first place. It is intentionally out of scope here.
- Pre-existing unrelated test failure. launcher-watchdog.vitest.ts isRespawnLockStale fails on HEAD independently of this change and is not addressed here.
