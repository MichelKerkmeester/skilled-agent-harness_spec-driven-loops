# Scenario 4 — Stop Gate Candidate

## Purpose
Exercise Phase 006 `candidateCoverageGate` behavior when required candidate classes remain uncovered.

## Prerequisites
- `review-depth-convergence.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- A standard or complex v2 session can set `searchCoverage` with uncovered required classes.
- Reducer state can expose `candidateCoverage` and `searchDebt`.

## Steps
1. Prepare a standard or complex v2 session with `searchCoverage` requiring at least one bug class.
2. Leave that required class uncovered so `candidateCoverage` remains incomplete.
3. Run the convergence or workflow path anchored by `review-depth-convergence.vitest.ts`.
4. Inspect the blocked stop output for `candidateCoverageGate`.
5. Confirm the blocked output includes the remaining `searchDebt`.
6. Record the gate name and the uncovered class evidence in the scenario notes.

## Expected Outcome
The review cannot legally stop. The blocked stop output names `candidateCoverageGate`, and the evidence points to incomplete `candidateCoverage` plus remaining `searchDebt`.

## Failure Modes
- STOP succeeds: verify the input scope is not `trivial` and required coverage is actually missing.
- The blocked output is generic: inspect whether `candidateCoverageGate` was dropped before the final gate payload.
- `searchDebt` is empty: rerun the reducer path and confirm the uncovered class is represented in reducer state.
