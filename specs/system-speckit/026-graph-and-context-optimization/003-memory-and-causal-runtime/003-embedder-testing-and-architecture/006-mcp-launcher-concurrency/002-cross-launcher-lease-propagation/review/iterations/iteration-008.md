I've completed iteration 8 of the deep review focusing on the maintainability dimension. 

**Summary**: Read all anchor materials (spec.md, plan.md, implementation-summary.md, checklist.md, changelog) and both launcher source files. Found one P2 maintainability issue not covered in iteration-4: dead code in the code-graph launcher where `writeState()` function and `stateFile` variable are defined but never used, unlike the spec-memory launcher where they are actively called.

**Key finding**: The unused `writeState()` function at lines 120-123 and `stateFile` variable at line 96 in `mk-code-index-launcher.cjs` create confusion for maintainers who may mistake `stateFile` for the lease file or think the function is part of active lease logic.

**Verdict**: PASS (P2-only finding)
-launcher.cjs:96, 120-123
- Evidence: The `stateFile` variable is defined at line 96 (`let stateFile = path.join(dbDir, PID_FILE_NAME);`) and the `writeState()` function is defined at lines 120-123, but `writeState()` is never called anywhere in the code-graph launcher. In contrast, the spec-memory launcher defines the same function (lines 87-90) and actively calls it at lines 338 and 361 to write launcher state to disk.
- Impact: Creates confusion for maintainers who may think `stateFile` is the lease file (it's not — the lease file is accessed via `leasePath()`) or that `writeState()` is part of the active lease logic. Dead code increases cognitive load and makes the codebase harder to understand and modify correctly.
- Suggested fix: Remove the unused `writeState()` function and `stateFile` variable from the code-graph launcher, or add a comment explaining why they are retained (e.g., for future use or consistency with spec-memory). If retention is intentional, document the rationale to avoid future confusion.

## Notes

Dimension coverage: Focused on maintainability by examining code clarity, dead code, naming consistency, and architectural drift. Traced the lease implementation flow in both launchers, compared signal handling patterns, and verified that the stale lock detection difference (code-graph has STALE_LOCK_MS reclaim, spec-memory does not) is intentional per spec.md §3 Out of Scope. The dead code finding is distinct from iteration-4's findings (code duplication, hard-coded constants, missing JSDoc, test duplication) and represents a new maintainability concern.

Cross-phase observation: This phase correctly mirrors the 006 launcher-boundary lease pattern for the core lease logic. The dead code in code-graph appears to be legacy from an earlier state-file approach that was removed or never implemented, while spec-memory retained the state-file functionality. This divergence should either be aligned (remove from code-graph) or documented as intentional.

REQ coverage from spec.md: REQ-001 (code-graph launcher refuses duplicate-start), REQ-002 (spec-memory launcher refuses duplicate-start), REQ-003 (PID file write+cleanup), REQ-004 (stale PID reclaim), REQ-005 (env-var override), REQ-006 (tests added), REQ-007 (reference docs), REQ-008 (changelog). All are implemented and verified per checklist.md. The P2 finding does not affect any REQ — it is a code hygiene issue only.

Review verdict: PASS