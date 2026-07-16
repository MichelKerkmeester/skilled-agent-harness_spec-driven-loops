# Iteration 003, Q5: Dashboard presentation issues (PARTIAL)

**Focus:** Root-cause the bare-dash scores, the result-count-versus-rows mismatch, and the truncated titles.
**Executor:** gpt-5.5-fast xhigh, read-only.
**Status:** PARTIAL. The executor over-explored, hit its own context limit and paused mid-RCA. The score-field root cause is solid; the count and title causes are partially explained and need a confirming read. newInfoRatio: 0.6.

## Finding (a): bare-dash scores are a real data gap (the one code fix)

The formatter resolves a row score through a fallback chain `intentAdjustedScore -> rrfScore -> score -> similarity / averageSimilarity`, but the default public row shape exposes only `similarity` unless trace is requested. Graph-channel and degree-channel rows carry `rrfScore` / `score` but no `similarity`, so the rendered row has no displayable number and the model renders a bare dash. [SOURCE: `formatters/search-results.ts:679-689`; pipeline score fields `lib/search/pipeline/types.ts:15-18`, `:46-47`, `:65-76`; graph/degree scoring `lib/search/graph-search-fn.ts:589-603`; `lib/search/hybrid-search.ts:1443-1503`] A test confirms the gap: `tests/search-results-format.vitest.ts:176-196` asserts `similarity` survives but never asserts a top-level displayable `score` for graph/degree rows.

**Fix (a):** surface the resolved score (the `rrfScore -> score` result) on every rendered row, not just `similarity`, so graph and degree rows show a number. Blast radius: the row shape is consumed by the model renderer and any envelope consumer, so add the field rather than replace `similarity`.

## Finding (b): count-versus-rows is a render-contract gap, INFERRED model-side

The server rewrites the count post-truncation: `data.count = innerResults.length` and `meta.returnedResultCount = innerResults.length` after token-budget truncation. [SOURCE: `context-server.ts:1328`, `:1345-1349`] The benchmark's `results=5` header with one rendered row plus an "omitted due to token-budget truncation" note is therefore INFERRED to be MODEL-side rendering: the model received the result set, rendered fewer rows under its own output budget, and emitted the note while still printing the contract's count. The literal benchmark wording is not in the server or the contract asset. [INFERRED]

**Fix (b):** tighten the presentation contract so the rendered count equals the rows actually shown, or have the model render `shown/total`. This is a contract/prompt fix, not a server bug.

## Finding (c): the "(truncated)" title literal is not in the code

The exact `"(truncated)"` token is NOT found in the MCP formatter, the handlers, or the command presentation asset. The code-side title truncators append `...`, not `"(truncated)"`. [SOURCE: `lib/parsing/memory-parser.ts:623-646`; `scripts/core/title-builder.ts:23-33`, `:46-58`] So the `"(truncated)"` in the rendered dashboard is INFERRED to be the model's own rendering of a too-long path, not a code emission. [INFERRED, marked UNKNOWN for the literal source]

**Fix (c):** if undesired, instruct the contract to render the leaf title rather than the full path, so long paths do not force model truncation.

## Takeaway
Only (a) is a genuine code fix (surface a unified row score). (b) and (c) are model-rendering of imperfect data and are presentation-contract tightenings, the lowest-priority of the findings.

## Ruled out
- A checked-in renderer emitting the bare dash or `"(truncated)"` in the MCP server or command asset, none found.

## Next focus
Q6, retrieval determinism: is the pipeline deterministic for a fixed query string (the shipped ANN/RRF tie-breaks), so the benchmark's per-query score spread comes from the model varying the query rather than pipeline non-determinism? Keep the brief narrow to avoid the over-exploration that truncated this iteration.
