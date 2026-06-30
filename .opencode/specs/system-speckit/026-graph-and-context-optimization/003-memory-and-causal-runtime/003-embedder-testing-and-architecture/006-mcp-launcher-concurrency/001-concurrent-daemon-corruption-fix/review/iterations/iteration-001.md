# Iteration 1 — correctness

## Summary

Reviewed the concurrent daemon corruption fix phase, which implements launcher-boundary single-writer lease enforcement and WAL+busy_timeout pragmas to prevent SQLite corruption from concurrent daemons. The implementation adds isLeaseHeld() helper, launcher exit-on-lease-held logic, WAL mode with EACCES fallback, and unit tests. Found one P1 traceability gap: the critical REQ-001 acceptance criterion (launcher exits with code 0 within 2s when sibling alive) lacks an integration test, relying only on unit tests of the isLeaseHeld() helper.

## Findings

### [P1] Missing integration test for REQ-001 launcher exit behavior
- File: `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts:85-133`
- Evidence: REQ-001 acceptance criteria states "Spawning launcher #2 while #1 is alive: #2 exits with code 0 within 2 seconds, prints LEASE_HELD_BY:<owner-pid>, does NOT open the SQLite file." The actual test suite only contains unit tests for isLeaseHeld() semantics (lines 96-119) and WAL pragma assertion (lines 121-132). No test actually spawns the launcher process twice via child_process.spawn and asserts exit code 0 and stdout containing LEASE_HELD_BY:<pid>.
- Impact: The critical user-facing behavior is not verified. Unit tests on isLeaseHeld() do not prove the launcher.cjs exit logic (lines 356-377) works end-to-end, including the env var gate and the actual process.exit(0) call.
- Suggested fix: Add an integration test in launcher-bootstrap.vitest.ts that uses child_process.spawn to launch mk-skill-advisor-launcher.cjs twice, asserting the second spawn exits with code 0 within 2s and stdout contains LEASE_HELD_BY:<pid>. This is acknowledged in implementation-summary.md limitation #1 as deferred but should be completed for full correctness coverage.

## Notes

Dimension coverage: correctness reviewed across lease check placement, WAL pragma implementation, stale PID handling, and test traceability. The lease check in mk-skill-advisor-launcher.cjs:356-377 correctly occurs before any DB operations, satisfying CHK-005. The WAL pragma EACCES fallback in skill-graph-db.ts:288-304 correctly handles read-only filesystems. The DB-dir override false-positive/false-negative issue is documented in daemon-lease-contract.md §6 as intentional design with operator guidance, not a correctness defect. Several checklist items (CHK-010 24-hour soak, CHK-011 launcher idempotency, CHK-012 three-DB-open paths, CHK-013 stale-PID reclaim, CHK-014 advisor surface regression) are DEFERRED per implementation-summary.md, but these are operational verifications rather than code correctness issues.

Review verdict: CONDITIONAL
