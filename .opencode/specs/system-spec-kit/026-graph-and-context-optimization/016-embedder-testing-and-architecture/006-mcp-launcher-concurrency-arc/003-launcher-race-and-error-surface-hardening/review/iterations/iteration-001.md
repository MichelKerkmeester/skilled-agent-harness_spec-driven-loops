# Iteration 1 — correctness

## Summary

Reviewed the lease hardening packet (9 P1 findings from 006+007 audit) focusing on correctness dimension. All 9 P1 requirements (REQ-001 through REQ-009) are correctly implemented in the code surface: re-probe after lease write closes the check-and-write race, SIGTERM handler waits for child exit with SIGKILL backstop, env-var parsing is consistent across launchers, EPERM is treated as lease-held, busy_timeout precedes journal_mode, EACCES predicate is broadened, test isolation is tightened, and skill-advisor gained subprocess test coverage. Verification evidence shows all typechecks pass, 15 tests pass, and strict validate returns 0 errors. Minor P2 observations noted (debug logging, warning clarity) but no correctness or security blockers found.

## Findings

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

## Notes

Dimension coverage: Correctness dimension fully audited for race windows, error-surface handling, edge cases, and adversarial input conditions. All 9 P1 correctness requirements from the spec are correctly implemented with corresponding code evidence. Security surface reviewed: EPERM handling prevents guard bypass, no new attack surfaces introduced, env-var parsing does not eval user input. Traceability verified: spec REQ-001 through REQ-009 map to code changes in the implementation summary verification table. Test coverage: 15 tests pass across 3 packages, including the new skill-advisor subprocess test. No prior iterations exist for this packet, so no duplicate findings. The 14 deferred P2 findings from the review are correctly logged in the changelog but not addressed in this phase per spec scope.

Review verdict: PASS
