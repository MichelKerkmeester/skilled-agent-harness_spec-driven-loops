# Iteration 7: REQ-006 memory_search budget — test verification and acceptance check

## Focus
Dimension: correctness (REQ-006 deep check). Verify the new budget path against REQ-006's acceptance: "handleMemorySearch applies the shared enforceTokenBudget / getTokenBudget('memory_search'); a test proves oversized results are truncated lowest-score-first with enforcement metadata".

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings
No new findings. REQ-006's functional core is verified working:
- The new vitest suite passes (5/5): truncation lowest-score-first with metadata, under-budget no-op, empty-set no-op, sole-oversized drop, unparseable-envelope pass-through (memory-search-token-budget.vitest.ts:46-141).
- `getTokenBudget('memory_search')` resolves via layer L2 (tokenBudget 3500, layer-definitions.ts:54) — a real per-tool budget.
- The acceptance's "test proves oversized results truncated lowest-score-first with enforcement metadata" is satisfied by test 1 (line 47).
- REQ-006's two deviations from acceptance are already tracked: F005 (local mirror `enforceSearchTokenBudget` at memory-search.ts:869 instead of importing the shared helper — CHK-006 reuse mandate violated) and F006 (feedback enqueued before truncation, memory-search.ts:2387 vs 2417). Both remain active.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | vitest 5/5 pass; REQ-006 acceptance met functionally | F005/F006 carry the residual drift |

## Assessment
- New findings ratio: 0.0
- Dimensions addressed: correctness
- Novelty justification: clean pass on the functional claim; confirms prior findings stand.

## Ruled Out
- "REQ-006 unbudgeted": [budget applied at memory-search.ts:2417 with layer budget 3500], [observed code + passing tests]
- "Budget truncation is non-deterministic": [min-scan drop keeps determinism; test asserts order], [test 1]

## Dead Ends
- None.

## Recommended Next Focus
Broaden: scope-adherence rule behavior — run check-scope-adherence.sh against in-scope and out-of-scope fixtures to verify REQ-005's pass/warn contract and its integration in validate.sh.

Review verdict: PASS