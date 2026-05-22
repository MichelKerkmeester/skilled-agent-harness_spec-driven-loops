# Scenario 5 — Stop Gate Graphless Fallback

## Purpose
Exercise Phase 006 `graphlessFallbackGate` behavior when graph fallback evidence is missing.

## Prerequisites
- `review-depth-convergence.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- A standard or complex v2 session can set `graphCoverageMode` to `graphless_fallback`.
- The session can leave `searchLedger` empty.

## Steps
1. Prepare a standard or complex v2 session with `graphCoverageMode` set to `graphless_fallback`.
2. Leave `searchLedger` empty.
3. Run the convergence or workflow path anchored by `review-depth-convergence.vitest.ts`.
4. Inspect the blocked stop output for `graphlessFallbackGate`.
5. Confirm the output explains that fallback proof is missing rather than requiring graph mode.
6. Add a cited `searchLedger` row and rerun to verify the gate condition changes.

## Expected Outcome
With `graphCoverageMode` set to `graphless_fallback` and empty `searchLedger`, the review cannot legally stop and the blocked stop output names `graphlessFallbackGate`.

## Failure Modes
- The run asks for graph mode instead: verify the input uses `graphCoverageMode` with value `graphless_fallback`.
- The gate does not fire: confirm `searchLedger` is empty and the scope is not `trivial`.
- The rerun still blocks after adding proof: inspect whether the new `searchLedger` row is cited and linked to `searchCoverage`.
