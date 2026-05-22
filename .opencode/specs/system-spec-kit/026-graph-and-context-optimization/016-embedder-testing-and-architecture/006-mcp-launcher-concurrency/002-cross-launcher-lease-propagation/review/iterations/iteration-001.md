I'm in a non-interactive mode that prevents file writes. Since this is a read-only review iteration, I'll output the iter file content directly:

```markdown
# Iteration 1 — correctness

## Summary

Reviewed the cross-launcher lease propagation phase (002) which implements PID-file single-writer enforcement for mk-code-index and mk-spec-memory launchers. Read spec.md, plan.md, implementation-summary.md, checklist.md, changelog, and traced both launcher implementations plus the code-graph test suite. Found one P1 documentation correctness issue where the spec's risk mitigation description contradicts the actual implementation order, and one P2 observation about a theoretical race window.

## Findings

### [P1] Spec risk mitigation description contradicts implementation order
- File: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/002-cross-launcher-lease-propagation/spec.md:171
- Evidence: Spec states "Lease check happens after the bootstrap lock so only one launcher writes the PID file at a time" in the Risks table. However, the actual implementation in both launchers performs lease check BEFORE bootstrap lock: mk-code-index-launcher.cjs lines 391-404 (lease check) vs line 406 (acquireBootstrapLock); mk-spec-memory-launcher.cjs lines 320-333 (lease check) vs line 335 (acquireBootstrapLock).
- Impact: The documented risk mitigation strategy is inaccurate. The bootstrap lock does not absorb the lease-check race window as claimed. The actual race protection comes from the atomic rename in writeLeaseFile() (lines 153-158 in code-graph, 120-125 in spec-memory), not from the bootstrap lock ordering.
- Suggested fix: Update spec.md line 171 to accurately reflect the implementation: "Lease check happens before the bootstrap lock. Race protection is provided by atomic PID-file write (temp file + rename), not by the bootstrap lock."

### [P2] Lease check timing creates broader race window than spec implies
- File: .opencode/bin/mk-code-index-launcher.cjs:391-412 and .opencode/bin/mk-spec-memory-launcher.cjs:320-348
- Evidence: Both launchers check isLeaseHeld() before acquiring the bootstrap lock. If two launchers start simultaneously when no PID file exists, both can pass the lease check, then race to write the PID file. The atomic rename (writeLeaseFile() uses .tmp.<pid> + renameSync) ensures only one wins, but the race window extends through the entire lease-check-to-write period.
- Impact: The spec's risk mitigation at line 171 overstates the bootstrap lock's role. In practice, the atomic rename provides adequate protection, but the documentation should accurately describe the actual race-protection mechanism.
- Suggested fix: Same as P1 — correct the spec to reflect that atomic rename, not bootstrap lock ordering, is the primary race protection.

## Notes

Dimension coverage: Focused on correctness dimension by examining race conditions, error handling, and spec-to-implementation alignment. Traced the critical lease-check-to-write flow in both launchers and verified the test coverage for spawn-twice, stale-PID reclaim, and env-var disable scenarios.

Cross-phase observation: This phase correctly mirrors the 006 launcher-boundary lease pattern. The implementation is sound in practice — the atomic rename provides adequate race protection. The issue is purely documentation correctness.

Test coverage is comprehensive: 6 tests across both launchers cover held-owner exit, stale-PID reclaim, PID-file cleanup on SIGTERM/SIGQUIT, and env-var override. All tests pass per checklist.md and changelog verification evidence.

Review verdict: CONDITIONAL
```
