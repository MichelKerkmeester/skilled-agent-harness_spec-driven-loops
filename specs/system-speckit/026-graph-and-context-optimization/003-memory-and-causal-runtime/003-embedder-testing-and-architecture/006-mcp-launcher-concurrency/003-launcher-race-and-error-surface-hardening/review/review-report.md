# Deep-Review Report — 003

- Scope: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening`
- Session: rvw-003-20260518-104712
- Iterations: 5 of 5 allocated
- Stop reason: max-iterations reached
- Completed: 2026-05-18T10:54:01Z

## Per-Iter Verdicts

| Iter | Dimension | P0 | P1 | P2 | Verdict |
|---|---|--:|--:|--:|---|
| 001 | correctness | 0 | 0 | 3 | PASS |
| 002 | security | 0 | 0 | 1 | PASS |
| 003 | traceability | 0 | 1 | 1 | CONDITIONAL |
| 004 | maintainability | 0 | 0 | 2 | PASS |
| 005 | correctness | 0 | 0 | 0 | PASS |

## Findings Aggregate

(Concatenated findings from all iters; review individual iter files for full evidence.)


### From iteration-001.md


### [P2] Re-probe exit lacks debug log before process.exit(0)
- File: .opencode/bin/mk-code-index-launcher.cjs:412-418
- Evidence: `if (!reprobe || reprobe.pid !== process.pid) { process.stdout.write(...); process.exit(0); }`
- Impact: When re-probe detects a race and exits, it emits the LEASE_HELD_BY message but does not log the reason to stderr before exiting. This could make debugging harder in production if launchers are exiting unexpectedly.
- Suggested fix: Add `log('Re-probe detected race: lease held by another process');` before the exit statement for operational visibility.

### [P2] WAL fallback warning message is imprecise
- File: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:299
- Evidence: `console.warn('[skill-graph] WAL mode unavailable (${code}); falling back to journal_mode=DELETE. Concurrent readers may stall during writes; performance degraded vs WAL mode.');`
- Impact: The warning message states "concurrent readers may stall during writes" but the actual impact of DELETE mode is that SQLite reduces to single-writer concurrency (not just reader stalls). This could mislead operators about the actual performance degradation.
- Suggested fix: Update the warning to accurately reflect the single-writer limitation: "concurrent writes are serialized; performance degraded vs WAL mode."

### [P2] Env-var helper accepts broader falsy values than spec requires
- File: .opencode/bin/mk-code-index-launcher.cjs:52-56
- Evidence: `return v === '0' || v === 'false' || v === 'no' || v === 'off' || v === '';`
- Impact: The implementation accepts 'False' (capitalized) in addition to 'false', 'FALSE' as specified in REQ-003. This is actually more permissive than required and is safe behavior, but represents a minor drift from the spec acceptance criteria which only explicitly listed 'FALSE'.
- Suggested fix: None needed - the broader acceptance is safe and user-friendly. Consider updating REQ-003 to document the actual accepted values for accuracy.


### From iteration-002.md


### [P2] EPERM handling asymmetry between TypeScript lease.ts and CommonJS launchers
- File: .opencode/bin/mk-code-index-launcher.cjs:147-149; .opencode/bin/mk-spec-memory-launcher.cjs:114-116
- Evidence: `if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt }; throw error;`
- Impact: CommonJS launchers (code-index, spec-memory) do not handle EPERM in their `isLeaseHeld()` functions, unlike the TypeScript lease.ts which correctly returns `{held: true}` for EPERM (lease.ts:168-170). If a CommonJS launcher runs under a different uid than the lease owner, `process.kill(pid, 0)` throws EPERM, which propagates to the outer try-catch and causes the launcher to exit with code 1. This is safe behavior (launcher doesn't start), but creates confusing error messages and inconsistent security posture across launchers.
- Suggested fix: Add EPERM handling to CommonJS launcher `isLeaseHeld()` functions for consistency: `if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt };`


### From iteration-003.md


### [P1] REQ-009 test count mismatch between spec and implementation
- File: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/003-launcher-race-and-error-surface-hardening/spec.md:147
- Evidence: REQ-009 acceptance criteria states "New `launcher-lease.vitest.ts` for skill-advisor mirroring 007 shape (3 cases: spawn-twice, dead-PID reclaim, env-disable)" but the actual implementation at `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` contains 6 test cases: "exits with LEASE_HELD_BY when a live owner exists", "reports the lease startedAt value for a live owner", "reclaims a dead-pid lease file and logs staleReclaimed", "removes the PID file on clean exit", "removes the PID file on SIGQUIT", "boots a sibling when strict single-writer is disabled".
- Impact: Spec→implementation mismatch creates confusion for future maintainers about the actual test coverage. The spec should have been updated to reflect 6 cases (matching the full 007 test suite shape) or the implementation limited to the 3 core cases specified. This violates traceability discipline.
- Suggested fix: Update REQ-009 in spec.md to reflect the actual 6 test cases delivered, or document why the additional 3 cases ("reports startedAt", "removes PID on clean exit", "removes PID on SIGQUIT") were added beyond the spec scope.

### [P2] No specific test for re-probe race condition (REQ-001)
- File: .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:180-192
- Evidence: The "exits with LEASE_HELD_BY when a live owner exists" test verifies that a second launcher exits when a live owner already holds the lease, but it does not specifically test the race condition described in REQ-001 where "both launchers pass the lease check then race the write". The test ensures the first launcher has already written the lease before the second starts, not the simultaneous-start scenario that the re-probe fix is designed to handle.
- Impact: The re-probe implementation (mk-code-index-launcher.cjs:412-418, mk-spec-memory-launcher.cjs:348-354) lacks dedicated test coverage for the specific race window it closes. While the existing test provides indirect coverage, a true race-condition test would need to orchestrate simultaneous launcher starts or inject a delay between check and write to prove the re-probe logic fires.
- Suggested fix: Consider adding a race-condition test that uses a fixture to simulate the "both pass check, race on write" scenario, or document why the existing test is considered sufficient coverage for this edge case.


### From iteration-004.md


### From iteration-005.md


## Notes

This report was generated by the minimal-viable driver `run-deep-review-arc.sh`. It does NOT run the canonical YAML reducer / dashboard / composite-convergence math. Per-iter findings are equally valid as a canonical dispatch would produce; the simplified concatenation here is the only deviation from canonical synthesis.
