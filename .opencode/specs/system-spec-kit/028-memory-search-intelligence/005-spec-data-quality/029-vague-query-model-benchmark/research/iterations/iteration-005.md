# Iteration 005, Q6: Retrieval is not strictly deterministic; residual wall-clock ranking inputs

**Focus:** Is the pipeline deterministic for a fixed query string, so the benchmark spread is model-driven?
**Executor:** gpt-5.5-fast xhigh, read-only (narrowed brief, completed cleanly).
**newInfoRatio:** 0.85, found residual clock inputs that break strict determinism, more than the "fully deterministic" prior expectation.

## Finding: deterministic ORDERING, non-deterministic SCORES

The tie-breaks are solid, but the scores carry wall-clock inputs, so a fixed query string alone is **not** strictly reproducible.

**Deterministic tie-breaks (ordering is stable given fixed scores):**
- ANN SQL ties by id: `ORDER BY distance ASC, m.id ASC` and `sub.id ASC`. [SOURCE: `lib/search/vector-index-queries.ts:163-201`, `:448-462`, `:556-575`]
- RRF sorts by `rrfScore`, then content hash, then canonical id. [SOURCE: `shared/algorithms/rrf-fusion.ts:229-241`, `:474-486`, `:568-569`]
- Stage 2 exits through deterministic score/similarity/hash/id sorting. [SOURCE: `lib/search/pipeline/ranking-contract.ts:64-78`; `lib/search/pipeline/stage2-fusion.ts:1449-1457`]

**Non-deterministic ranking INPUTS (the residual):**
- `vector_search()` defaults `useDecay = true`, and the decay uses SQLite wall clock `julianday('now')` inside the score expression before ordering. [SOURCE: `lib/search/vector-index-queries.ts:371-380`, `:393-404`, `:448-462`]
- Hybrid trigger scoring uses `Date.now()` via `timestampBoost()`. [SOURCE: `lib/search/hybrid-search.ts:714-719`, `:776-793`]
- Stage 2 recency fusion uses `computeRecencyScore()` → `Date.now()`. [SOURCE: `lib/search/pipeline/stage2-fusion.ts:1090-1103`; `shared/scoring/folder-scoring.ts:138-152`]
- The trigger-channel SQL ordering stops at updated-time, not id, so it lacks a final id tie-break. [SOURCE: `lib/search/hybrid-search.ts:761-764`, `:788-793`]

## Interpretation of the benchmark spread
- Fixed candidate set + fixed clock → deterministic. Fixed query string alone → not strictly deterministic.
- INFERRED: the large swings (e.g. `agent` 0.0 → 0.88) are dominated by the MODELS dispatching different actual query strings (refinements) for ambiguous one-word terms, because clock drift over a benchmark run is small. But the residual clock inputs are real, so "fully model-driven" cannot be asserted from code alone.

## Fix design
- For benchmark or strict reproducibility: inject a fixed `now`, set `useDecay = false` (or parameterize it) for the benchmark path, and add a final `id` tie-break to the trigger-channel ordering.
- For production: the clock inputs are arguably intentional (recency should matter), but they mean the search is not bit-reproducible. The decision is whether reproducibility is a goal for normal search or only for benchmarks.

## Uncertainty
- The raw benchmark outputs and the full retrieval stack were not inspected. Confirming check: 12 repeats with the exact final query string logged, a fixed DB snapshot, fixed `now`, and `useDecay=false`, then compare candidate id/score digests.

## Next focus
All seven questions are covered (Q2 was answered within Q1's verdict-path trace). Converge and synthesize the prioritized fix plan (Q7) into research.md.
