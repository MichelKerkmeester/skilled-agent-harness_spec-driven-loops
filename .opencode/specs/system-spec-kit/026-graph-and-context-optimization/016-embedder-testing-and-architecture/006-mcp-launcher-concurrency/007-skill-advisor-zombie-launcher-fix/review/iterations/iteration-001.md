# Iteration 1 — correctness

## Summary

Reviewed Phase 007 skill-advisor zombie launcher fix, which adds a launcher-owned PID guard before daemon server spawn to close the process-count invariant gap. Read anchor materials (spec.md, plan.md, implementation-summary.md, checklist.md) and traced the launcher code (mk-skill-advisor-launcher.cjs:456-462) and test coverage (launcher-lease.vitest.ts:287-314). The fix correctly adds atomic PID guard write with re-probe verification before spawn, and the spawn-three regression test covers the zombie launcher pattern. Verification evidence shows all quality gates passed.

## Findings

### [P2] Potential race window between bootstrap lock release and PID guard write
- File: `.opencode/bin/mk-skill-advisor-launcher.cjs:440-462`
- Evidence: The bootstrap lock is released in the finally block at line 481-483, but the PID guard write happens at line 456. A duplicate launcher arriving after lock release but before PID guard write could pass the launcher lease check at line 435 and line 454, then race to write its own PID guard.
- Impact: In theory, two launchers could both write their PID guards if the timing window aligns, though the re-probe at line 457-462 would catch the loser. The window is small (atomic file write + read) but non-zero.
- Suggested fix: Consider moving the PID guard write inside the bootstrap lock critical section, or add a file-level exclusive lock around the PID guard write/re-probe sequence to eliminate this theoretical race.

## Notes

- REQs in scope: 007-REQ-001 (spawn-three rejection), 007-REQ-002 (launcher-boundary guard), 007-REQ-003 (daemon lease intact), 007-REQ-004 (cleanup ordering).
- Files opened: spec.md, plan.md, implementation-summary.md, checklist.md, mk-skill-advisor-launcher.cjs, launcher-lease.vitest.ts, lease.ts.
- The fix correctly preserves the daemon SQLite lease behavior unchanged (lease.ts inspection confirmed no source change needed).
- Test coverage includes the 007-REQ-001 spawn-three regression case at launcher-lease.vitest.ts:287-314.
- Verification evidence shows typecheck, focused Vitest (11 tests passed), and strict spec validation all passed.
- The sandbox blocked `ps` process-list access during smoke verification, but the focused Vitest includes fallback assertions when `ps` is unavailable.

Review verdict: PASS
