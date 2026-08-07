---
title: "Live F2 clean-close reap barrier coverage"
description: "The F2 clean-close barrier (reapLeaseChildBeforeRespawn) now has real end-to-end coverage against actual child processes and a real marker file, closing the live-coverage gap without the flaky launcher-spawn pattern that skipped the legacy suite."
trigger_phrases:
  - "live two-launcher reap test"
  - "F2 clean-close barrier coverage"
  - "reapLeaseChildBeforeRespawn test"
  - "launcher reap coverage"
  - "clean-close reap barrier test"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/001-live-two-launcher-test` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening`

### Summary

The F2 clean-close barrier (`reapLeaseChildBeforeRespawn`) decides whether a daemon database is clean after a child context server exits, but only its pure helpers had unit tests. The reap orchestration itself had zero live coverage because the only real-process launcher suite was entirely skipped as a known flake. This packet exported the reap function for testability and added a deterministic test suite that drives it against real child processes and a real marker file, avoiding the flaky launcher-spawn pattern entirely.

### Added
- Live reap-barrier test suite that drives the real `reapLeaseChildBeforeRespawn` function against throwaway child processes and a real `.unclean-shutdown` marker file, covering marker-path resolution, already-dead child, graceful clean exit, and graceful dirty exit branches
- Unknown-eperm liveness guard that skips the test with a reason when a hardened sandbox hides process liveness, preventing a false assertion on the wrong branch

### Changed
- Launcher now exports `reapLeaseChildBeforeRespawn` and `uncleanMarkerPresent` so tests can invoke the reap function directly (export-only, no behavior change, `require.main` guard keeps importing side-effect-free)

### Fixed
- None.

### Verification
- `launcher-clean-close-reap.vitest.ts`, PASS, 4 of 4 deterministic (3 consecutive clean runs, ~0.5s)
- `node --check` launcher, PASS
- Launcher export introspection (no auto-run), PASS, `reapLeaseChildBeforeRespawn` and `uncleanMarkerPresent` callable, marker path resolves, `main()` not invoked
- Launcher disk vs HEAD before edit, PASS, no drift
- Comment-hygiene audit, PASS, 0 violations
- Packet strict-validate, PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Exported `reapLeaseChildBeforeRespawn` and `uncleanMarkerPresent` for test access |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-reap.vitest.ts` | Created | Live reap-barrier test covering the four reap branches with real child processes and a real marker file |

### Follow-Ups
- Not a full two-launcher integration test. The reap function, the safety-critical core of the F2 barrier, is covered but the full launcher-B-bridges-then-respawns wiring is not. The bridge respawn-on-dead decision is separately unit-tested in `launcher-ipc-bridge-probe.vitest.ts`. Combining both into a real two-process test remains deferred for the same flake reason that skipped the legacy suite.
- The SIGKILL-escalation branch is not exercised live. Reliably forcing a child to ignore SIGTERM proved environment-fragile (the first attempt flaked), so the `killed=true` path is covered by the pure `cleanCloseAfterReap` unit test rather than a live reap. The live suite covers SIGTERM-reap and marker-based clean/unclean determination only.
