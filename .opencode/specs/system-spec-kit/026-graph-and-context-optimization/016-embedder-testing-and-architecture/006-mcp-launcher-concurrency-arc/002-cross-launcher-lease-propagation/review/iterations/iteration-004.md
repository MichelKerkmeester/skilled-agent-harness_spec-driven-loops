I've completed iteration 4 focusing on the maintainability dimension. The iteration file has been written to:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc/002-cross-launcher-lease-propagation/review/iterations/iteration-004.md`

**Summary of findings:**

Found 4 P2 (hygiene/suggestion) maintainability issues:
1. **Code duplication between launchers** - Nearly identical lease functions in both files, but this is intentional per spec.md §3 Out of Scope which explicitly rejects a shared lib module
2. **Hard-coded timeout constants** - Magic numbers like 120000ms, 5000ms, 1000ms scattered throughout both launchers
3. **Missing JSDoc comments** - Core lease functions lack documentation explaining their contracts and error handling
4. **Test file duplication** - Test files are 95% identical, mirroring the intentional launcher duplication

**Verdict: PASS** - All findings are P2 suggestions; no P0 or P1 maintainability issues. The implementation is sound and the intentional trade-offs (inline vs shared lib) are well-documented in the spec.
gence. However, spec.md §3 Out of Scope explicitly states: "Introducing a shared lib/daemon/lease.ts module across skills — too invasive; each launcher gets a small inline primitive." This is an intentional design decision to avoid cross-skill coupling.
- Suggested fix: Accept as intentional design per spec. If future maintenance burden becomes significant, revisit the shared-lib decision and add a shared module under a neutral location (e.g., `.opencode/lib/launcher-lease.cjs`) that both launchers can require.

### [P2] Hard-coded timeout constants scattered throughout launchers
- File: .opencode/bin/mk-code-index-launcher.cjs:269, 336-339, 5s in signal handlers; .opencode/bin/mk-spec-memory-launcher.cjs:236, 287-291, 5s in signal handlers
- Evidence: Bootstrap lock timeout is 120000ms (line 269 in code-graph, line 236 in spec-memory). Signal handler SIGTERM grace period is 5000ms (line 336 in code-graph, line 287 in spec-memory). Sleep interval in bootstrap lock retry loop is 1000ms (line 299 in code-graph, line 251 in spec-memory). Test waitFor predicate uses 25ms poll interval (line 76 in both test files).
- Impact: Magic numbers reduce code clarity and make timeout tuning harder. Changes require grep-and-replace across multiple locations. However, these are not user-facing constants and the values are well-chosen for their contexts.
- Suggested fix: Extract named constants at the top of each launcher file (e.g., `const BOOTSTRAP_LOCK_TIMEOUT_MS = 120 * 1000; const SIGNAL_GRACE_PERIOD_MS = 5 * 1000; const BOOTSTRAP_LOCK_RETRY_INTERVAL_MS = 1000;`). This improves readability without changing behavior.

### [P2] Missing JSDoc comments on lease functions
- File: .opencode/bin/mk-code-index-launcher.cjs:129-167 and .opencode/bin/mk-spec-memory-launcher.cjs:96-134
- Evidence: The four core lease functions (readLeaseFile, isLeaseHeld, writeLeaseFile, clearLeaseFile) have no JSDoc comments explaining their purpose, parameters, return values, or error handling behavior. The code is readable but lacks explicit documentation for future maintainers.
- Impact: Future maintainers must read the implementation to understand the contract. The functions are small enough that this is not a major barrier, but documentation would improve onboarding and reduce cognitive load.
- Suggested fix: Add JSDoc comments to each lease function documenting the return type (object with held/ownerPid/staleReclaimable/startedAt fields), the error handling (catch blocks treat missing/corrupt files as no lease), and the atomic write pattern.

### [P2] Test file duplication mirrors launcher duplication
- File: .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts and .opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts
- Evidence: Both test files are 95% identical (268 lines vs 271 lines). The only differences are the launcher path (line 18), PID file path (line 19), workspace temp dir prefix (line 24), and fixture server paths (lines 31-40 vs 31-43). All helper functions (waitFor, waitForExit, waitForStdoutClose, terminate, readLeasePid, waitForLeasePid, createDeadPid, createLivePid) are identical.
- Impact: Test logic changes must be applied to both files manually. However, this mirrors the intentional launcher duplication design — keeping tests per-skill maintains the same boundary as the production code.
- Suggested fix: Accept as intentional design. If a shared test utility library emerges for launcher testing in the future, extract the common helpers there.

## Notes

Dimension coverage: Focused on maintainability by examining code clarity, duplication, hard-coded constants, missing documentation, and drift between docs and code. Traced the lease implementation flow in both launchers, reviewed test structure, and verified reference doc accuracy. All findings are P2 hygiene suggestions; no structural maintainability defects found.

Cross-phase observation: This phase correctly mirrors the 006 launcher-boundary lease pattern while respecting the spec's explicit decision to avoid shared lib infrastructure. The code duplication is a documented trade-off, not an oversight. The implementation is maintainable within the stated constraints.

REQ coverage from spec.md: REQ-001 (code-graph launcher refuses duplicate-start), REQ-002 (spec-memory launcher refuses duplicate-start), REQ-003 (PID file write+cleanup), REQ-004 (stale PID reclaim), REQ-005 (env-var override), REQ-006 (tests added), REQ-007 (reference docs), REQ-008 (changelog). All are implemented and verified per checklist.md.

Review verdict: PASS