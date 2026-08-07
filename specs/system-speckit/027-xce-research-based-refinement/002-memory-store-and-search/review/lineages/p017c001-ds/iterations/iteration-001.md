# Iteration 001: D1 Correctness

## Focus
D1 Correctness: Validate logic, invariants, state transitions, and edge cases in the token-budget skip-and-continue packing, detailed-count floor, summary-first overflow routing, and low-signal budget gating in `hybrid-search.ts` (lines 2731-2972) and `dynamic-token-budget.ts`.

## Scorecard
- Dimensions covered: D1 Correctness
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=5
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0 (no new P0 → no override)

## Findings

### P2, Suggestion
- **F001**: Skip-and-continue loop correctly prevents a large top result from starving the tail. The `for` loop at `mcp_server/lib/search/hybrid-search.ts:2845-2853` uses `continue` (not `break`) when a result overflows, advancing to the next candidate. Verified by test `token-budget-skip-and-floor.vitest.ts:32-68` which proves 3 smaller results survive when the top-1 is too large.
  - Claim: The skip-and-continue mechanism is correctly implemented and prevents the 5→1 collapse described in the implementation summary.
  - counterevidenceSought: Checked for any path where `continue` could be bypassed or where the loop could exit early before exhausting sorted candidates. The loop has no early-exit conditional outside the overflow check. The `sorted` array is pre-sorted and immutable during iteration.
  - alternativeExplanation: None. The implementation directly addresses the described bug.
  - dimension: correctness

- **F002**: Detailed-count floor correctly enforces min(limit, 3) via summary promotion. At `mcp_server/lib/search/hybrid-search.ts:2862-2867`, the `while` loop promotes overflow entries as token-cheap summaries when fewer than `floorTarget` full results fit. The floor is gated on `options.limit` being defined, falling back to ≥1 when absent (line 2862-2864). Verified by tests at `token-budget-skip-and-floor.vitest.ts:70-106` (floor honored even with includeContent=false) and `:109-122` (limit=2 floors at 2).
  - Claim: The floor mechanism guarantees a minimum usable result set regardless of budget pressure.
  - counterevidenceSought: Tested whether the `while` loop could exhaust `overflowRemainder` without reaching `floorTarget`. It safely terminates when `overflowRemainder.length === 0`. Checked whether `createSummaryFallback` could produce entries that exceed the budget. It caps content at `min(SUMMARY_MAX_CHARS, budget * 4)` at line 2752.
  - alternativeExplanation: None.
  - dimension: correctness

- **F003**: Summary-first overflow routing correctly preserves the remainder via progressive disclosure. At `mcp_server/lib/search/hybrid-search.ts:2875-2881`, `buildProgressiveResponse` is called with the overflowRemainder when non-empty, producing a `progressive` envelope with summary layer, first snippet page, and continuation cursor. Verified by test `token-budget-skip-and-floor.vitest.ts:105-107` which asserts `progressive` is defined and `summaryLayer.count > 0`.
  - Claim: Overflow results are routed to progressive disclosure rather than discarded.
  - counterevidenceSought: Checked whether the `progressive` field is always populated when there's overflow. The conditional at line 2875 guards on `overflowRemainder.length > 0`. The field is optionally spread into the return at line 2902.
  - alternativeExplanation: None.
  - dimension: correctness

- **F004**: Low-signal budget correctly preserves the full budget for weak queries. The call site at `mcp_server/lib/search/hybrid-search.ts:1339-1344` derives `lowSignalQuery` from `routeResult.classification.confidence ∈ {low, fallback}`. `getDynamicTokenBudget` at `mcp_server/lib/search/dynamic-token-budget.ts:90-92` floors at `DEFAULT_BUDGET` (4000) when `lowSignal` is true: `Math.max(tierBudget, DEFAULT_BUDGET)`. This prevents budget starvation for queries that rely on breadth for recall.
  - Claim: Weak/low-confidence queries are never trimmed below the full 4000-token budget.
  - counterevidenceSought: Checked for other confidence states that might represent weak queries but are not captured. The Known Limitations note at `implementation-summary.md:127` acknowledges that only the classifier confidence label is used, not downstream `requestQuality` assessment. This is a deliberate design trade-off.
  - alternativeExplanation: The sibling phase 002-request-quality-aggregation may provide a richer signal, but this is deferred.
  - dimension: correctness

- **F005**: `s3meta.tokenBudget.adjustedBudget` is initialized with a placeholder value before header overhead is known. At `mcp_server/lib/search/hybrid-search.ts:1354`, `adjustedBudget: budgetResult.budget` is set in the Stage E metadata block. It is patched later at line 2004 with `adjustedBudget = Math.max(budgetResult.budget - headerOverhead, 200)`. While no consumer reads the field between these two points (s3meta is only attached as non-enumerable metadata at line 2066), the mutation-after-construction pattern is fragile. If a future pipeline stage reads s3meta between Stage E and the truncation call, it would see the uncorrected budget.
  - Claim: The adjustedBudget field carries a misleading initial value before patching.
  - counterevidenceSought: Traced all reads of s3meta between line 1356 and line 2005. No intermediate reader exists in the current codebase.
  - alternativeExplanation: The comment at line 1352 acknowledges the patching and this is intentional staging.
  - dimension: correctness

## Assessment
- New findings ratio: 0.0 (all findings are P2 with severity weight 1.0, no refinements)
- Dimensions addressed: D1 Correctness
- Novelty justification: N/A (first iteration, all findings are by definition novel)

## Ruled Out
- [P0: Skip-and-continue miss]: The `continue` at line 2849 was verified to correctly advance to the next candidate without breaking the loop. The `for...of` loop exhausts all candidates.
- [P0: Floor infinite loop]: The `while` at line 2865 terminates because `overflowRemainder.shift()` reduces the array on each iteration. `createSummaryFallback` produces summaries bounded by `Math.min(SUMMARY_MAX_CHARS, budget * 4)` which is always positive.
- [P0: Budget starvation for weak queries]: The `Math.max(tierBudget, DEFAULT_BUDGET)` at `dynamic-token-budget.ts:91` guarantees a floor at 4000. No path can produce a lower budget when `lowSignal` is true.

## Dead Ends
None. The implementation is straightforward and well-tested.

## Recommended Next Focus
D2 Security: Review trust boundaries in the truncation pipeline (e.g., content handling in `createSummaryFallback`, overflow logging, and the progressive-disclosure envelope). The truncation path handles user-generated content from memory_index — verify no injection vectors in summary construction or cursor generation.

## Claim Adjudication
No P0 or P1 findings require adjudication. All 5 findings are P2 (advisory).

Review verdict: PASS
