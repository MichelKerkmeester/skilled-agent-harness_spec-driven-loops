# Changelog , , ,  001: Live coverage for the F2 clean-close reap barrier

**Shipped**: 2026-05-30
**Commit**: 4b2c5de6a3

## What Changed
- Modified `.opencode/bin/mk-spec-memory-launcher.cjs` to export reapLeaseChildBeforeRespawn and uncleanMarkerPresent (export-only, no logic change)
- Created `mcp_server/tests/launcher-clean-close-reap.vitest.ts` with live reap-barrier test covering 4 deterministic cases: marker-path resolution, already-dead child, graceful exit + no marker, graceful exit + marker survives
- Test uses real throwaway node -e children and real .unclean-shutdown marker file pinned via MEMORY_DB_PATH
- SIGKILL-escalation branch covered by pure unit test in launcher-clean-close-barrier.vitest.ts

## Why
The F2 clean-close barrier that decides whether a reaped context-server child handed off the DB cleanly had zero live coverage. The only real-process launcher suite is entirely skipped as a "known launcher process lifecycle flake," so the safety-critical path was untested.

## Verification
- launcher-clean-close-reap.vitest.ts: PASS, 4/4 deterministic (3 consecutive clean runs, ~0.5s)
- node --check launcher: PASS
- Launcher export introspection (no auto-run): PASS , , ,  reapLeaseChildBeforeRespawn + uncleanMarkerPresent callable, marker path resolves, main() not invoked
- Launcher disk == HEAD before edit: PASS , , ,  no drift
- Comment-hygiene audit: PASS, 0 violations
- Packet strict-validate: PASS
