# Iteration 3: Token-Budget Truncation (5→1) — mechanism and fix

## Focus

Problem 3: detailed results collapse from ~5 to 1, hiding hits behind a small budget. Find
the exact truncation site and design a dynamic-budget / progressive-disclosure fix.

## Findings

1. **The live truncation site is `truncateToBudget`, called unconditionally on every
   non-eval search.** [SOURCE: hybrid-search.ts:1991-1996]. It runs even when the dynamic token
   budget feature is *off*, because `getDynamicTokenBudget` returns the `DEFAULT_BUDGET=4000`
   with `applied:false` [SOURCE: dynamic-token-budget.ts:39,74-80; hybrid-search.ts:1328]. So
   "dynamic budget disabled" does **not** disable budget truncation — it just fixes the budget at
   4000.

2. **The 5→1 collapse is a greedy-accumulate-with-hard-break defect, not a relevance decision.**
   `truncateToBudget` sorts by score, then accumulates from the top; the first result that would
   exceed the budget triggers `if (accepted.length > 0) break;`
   [SOURCE: hybrid-search.ts:2761-2776]. **A single large top memory therefore starves the entire
   tail**: once it is accepted, any subsequent result that overflows the remaining budget halts
   the loop — even if 4 small, relevant results sit just below it and would have fit. The cut is
   driven by the *byte size of the top hit*, not by relevance.

3. **There is an explicit single-result overflow path that returns exactly one item.**
   [SOURCE: hybrid-search.ts:2742-2759]. When the set is already 1, or when greedy accumulation
   accepts nothing, it returns `[sorted[0]]` with `truncated:true` and a console.warn. Combined
   with finding #2, this is the structural source of the grounding doc's "5→1" symptom and the
   live `count:1` observed for "Semantic Search".

4. **The fix primitives already exist but are mis-wired.** `createSummaryFallback` can shrink an
   oversized result to a summary [SOURCE: hybrid-search.ts:2743-2744], but it only fires when
   `includeContent` is true — and the live call passes `includeContent: options.includeContent ??
   false` [SOURCE: hybrid-search.ts:1992], so summary-first never triggers for the common
   metadata-only search. Progressive disclosure (`buildProgressiveResponse`, page size 5, with a
   continuation cursor) is a ready summary+snippet+cursor renderer
   [SOURCE: progressive-disclosure.ts:432-470] but is not the carrier for budget overflow.

## Proposed Fix (design, not implementation)

- **Replace hard-`break` with skip-and-continue:** when a result overflows the remaining budget,
  `continue` to try smaller lower-ranked results instead of halting. This alone restores the
  tail that a single large top hit currently starves.
- **Floor the detailed count:** guarantee `min(requestedLimit, MIN_DETAILED=3)` results returned
  as snippets even under budget pressure, mirroring `confidence-truncation`'s existing
  `DEFAULT_MIN_RESULTS=3` floor [SOURCE: confidence-truncation.ts:35] — the two truncators should
  agree on a floor.
- **Summary-first on overflow regardless of `includeContent`:** when the top hit alone blows the
  budget, emit its `createSummaryFallback` snippet plus snippets for the next K, rather than one
  full detailed result. Route overflow through `buildProgressiveResponse` so the cursor exposes
  the remainder instead of discarding it.
- **Make the budget tier-aware *upward* for low-signal queries:** generic queries (Problem 1)
  need *more* breadth, not less; the budget should not shrink them.

## Sources Consulted

- `hybrid-search.ts:1974-1998` (live call), `:2707-2786` (truncateToBudget body)
- `dynamic-token-budget.ts` (full)
- `progressive-disclosure.ts:432-470`, `confidence-truncation.ts:35`

## Assessment

- **newInfoRatio: 0.6** — The exact greedy-break mechanism (hib-search.ts:2768) and the
  always-on-at-4000 fact are net-new and more precise than the grounding doc's "small budget"
  framing; the fix reuses primitives already in the tree.
- Confidence: HIGH on mechanism (code-confirmed). MEDIUM on whether the live `count:1` for
  "Semantic Search" was greedy-break vs few-survivors — `budgetTruncated` flag on the result
  trace would confirm; not captured this pass (worth instrumenting).

## Reflection

- **Worked:** following the call site (1991) to the function body (2707) rather than trusting the
  "5→1" label revealed the precise starve-the-tail bug.
- **Ruled out:** "dynamic token budget OFF means no truncation" — false; truncation is
  unconditional at budget 4000.
- **Ruled out:** "stage4 per-tier state limits cause it" — live `stateLimitsApplied:false`,
  `removed:0` [SOURCE: live memory_search stateStats], so state limits were inert for these queries.

## Recommended Next Focus

Iteration 4 → Problem 4 (lightweight reranker value) + Problem 5 (FSRS cold-tier tuning).
