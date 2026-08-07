# Iteration 14: S2-06 Incremental Fuzzy Finding Merge

## Focus

[S2-06] How does kasper do incremental fuzzy finding-merge -- cheap similarity (`weaknessSimilarity` / `weaknessCache`) first, then LLM consolidation only on leftover duplicates? Target mapping: `deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`.

Reference citations below use paths relative to `.opencode/specs/deep-loops/030-agent-loops-improved/`.

## Actions Taken

1. Searched the kasper reference for `weaknessSimilarity`, `weaknessCache`, `mergeWeaknessIntoMap`, `mergeAllWeaknesses`, and `mergeWeaknesses`.
2. Read the exact kasper implementation for deterministic similarity scoring, bounded alias caching, incremental map aggregation, LLM weakness consolidation, and unit tests.
3. Checked prior iteration outputs for overlap with S2-05 and kept this iteration to merge mechanics rather than rejected-pattern suppression.
4. Read our coverage graph query surface to map the mechanism onto query-time duplicate discovery without implementing changes.

## Findings

### S2-06A: Add a deterministic similar-node query before any LLM consolidation

Reference mechanism: kasper's cheap similarity helper normalizes strings, returns `1.0` for exact matches, assigns a substring score, checks exact word-overlap, then falls back to longer-word fuzzy overlap with Levenshtein word similarity (`external/kasper/src/utils.ts:13`, `external/kasper/src/utils.ts:18`, `external/kasper/src/utils.ts:21`, `external/kasper/src/utils.ts:33`, `external/kasper/src/utils.ts:51`, `external/kasper/src/utils.ts:68`, `external/kasper/src/utils.ts:71`). Thresholds are explicit constants (`external/kasper/src/constants.ts:55`, `external/kasper/src/constants.ts:56`, `external/kasper/src/constants.ts:57`, `external/kasper/src/constants.ts:58`, `external/kasper/src/constants.ts:59`), and tests cover exact, case-insensitive, trim, substring, and Jaccard-style overlap behavior (`external/kasper/tests/utils.test.ts:9`, `external/kasper/tests/utils.test.ts:26`, `external/kasper/tests/utils.test.ts:33`).

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`. Add a query helper such as `findSimilarNodes(ns, { kind, name, threshold })` that scores candidate node names inside the namespace before any expensive semantic consolidation. Port-difficulty: med. Tag: quick-win. Why it helps: coverage graph queries currently expose gaps, contradictions, provenance, unverified claims, and hot nodes, but no cheap way to discover duplicate `FINDING` or `CLAIM` nodes that differ only by wording.

### S2-06B: Use a bounded alias cache for repeated duplicate checks

Reference mechanism: kasper stores a hot-path `weaknessCache` with `WEAKNESS_CACHE_MAX = 500` (`external/kasper/src/state.ts:125`, `external/kasper/src/state.ts:126`). `mergeWeaknessIntoMap` first checks whether the incoming weakness already resolves to a cached canonical key (`external/kasper/src/state.ts:638`, `external/kasper/src/state.ts:639`, `external/kasper/src/state.ts:640`, `external/kasper/src/state.ts:641`), then only scans the map when there is no cache hit (`external/kasper/src/state.ts:643`, `external/kasper/src/state.ts:644`, `external/kasper/src/state.ts:645`, `external/kasper/src/state.ts:646`, `external/kasper/src/state.ts:647`). When the cache grows past the cap, it drops the oldest 250 keys and memoizes self-matches for new canonical strings (`external/kasper/src/state.ts:651`, `external/kasper/src/state.ts:652`, `external/kasper/src/state.ts:653`, `external/kasper/src/state.ts:655`).

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`. Add a namespace/kind-scoped alias memo for similar-node queries so repeated `graphEvents` imports or dashboard queries do not re-score the same text against the same node set. Port-difficulty: med. Tag: quick-win. Why it helps: research loops emit many near-identical finding labels across iterations, and a bounded memo keeps duplicate discovery cheap while avoiding unbounded process memory.

### S2-06C: Run LLM consolidation as an explicit second-stage sweep

Reference mechanism: kasper does not call the model for every new weakness. It incrementally merges into maps first, then `mergeAllWeaknesses` clears the cache, builds sorted global and per-agent weakness lists, and calls `scorer.mergeWeaknesses` only when each list has more than one pattern (`external/kasper/src/state.ts:422`, `external/kasper/src/state.ts:426`, `external/kasper/src/state.ts:427`, `external/kasper/src/state.ts:431`, `external/kasper/src/state.ts:432`, `external/kasper/src/state.ts:445`, `external/kasper/src/state.ts:446`). It only replaces maps when the model returns a non-empty shorter list (`external/kasper/src/state.ts:433`, `external/kasper/src/state.ts:434`, `external/kasper/src/state.ts:435`, `external/kasper/src/state.ts:447`, `external/kasper/src/state.ts:448`), then recomputes aggregate state (`external/kasper/src/state.ts:454`, `external/kasper/src/state.ts:455`, `external/kasper/src/state.ts:456`). The model prompt asks for fewer merged patterns and summed counts (`external/kasper/src/scorer.ts:64`, `external/kasper/src/scorer.ts:69`, `external/kasper/src/scorer.ts:71`, `external/kasper/src/scorer.ts:74`, `external/kasper/src/scorer.ts:80`), while `mergeWeaknesses` returns original input on one item, missing session id, no merge, or error (`external/kasper/src/scorer.ts:166`, `external/kasper/src/scorer.ts:170`, `external/kasper/src/scorer.ts:194`, `external/kasper/src/scorer.ts:198`, `external/kasper/src/scorer.ts:256`, `external/kasper/src/scorer.ts:260`, `external/kasper/src/scorer.ts:261`).

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`. Add a query-only `findConsolidationCandidates(ns, kind)` that returns high-confidence cheap clusters and low-confidence leftovers; a later workflow/validator can choose when to invoke an LLM over the leftovers. Port-difficulty: hard. Tag: deep-rewrite. Why it helps: graph consolidation should preserve cheap, deterministic duplicate handling as the default path and reserve model calls for ambiguous duplicate clusters that still survive cheap scoring.

### S2-06D: Guard merges by semantic class and make them reversible

Reference mechanism: kasper's `weaknessesMergeable` blocks cross-category merges unless either category is `unknown`, then applies the similarity threshold (`external/kasper/src/utils.ts:237`, `external/kasper/src/utils.ts:243`, `external/kasper/src/utils.ts:246`, `external/kasper/src/utils.ts:248`, `external/kasper/src/utils.ts:250`, `external/kasper/src/utils.ts:252`). It also has a reverse path: `unmergeWeaknessFromMap` finds the best mergeable key by highest similarity before decrementing counts (`external/kasper/src/state.ts:659`, `external/kasper/src/state.ts:663`, `external/kasper/src/state.ts:665`, `external/kasper/src/state.ts:667`, `external/kasper/src/state.ts:669`, `external/kasper/src/state.ts:670`), and aggregate decrement paths call it for global and per-agent maps (`external/kasper/src/state.ts:771`, `external/kasper/src/state.ts:775`, `external/kasper/src/state.ts:776`, `external/kasper/src/state.ts:789`, `external/kasper/src/state.ts:790`).

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`. Similar-node queries should stay namespace-scoped and kind-scoped, and should return candidate aliases plus scores rather than mutating graph rows directly. Port-difficulty: med. Tag: quick-win. Why it helps: `SOURCE`, `TARGET`, and `FINDING` nodes can share wording; a guarded query lets downstream graph repair or consolidation rewire duplicates deliberately and roll back a bad alias.

## Questions Answered

- S2-06 answered: kasper performs fuzzy merge in two layers. The cheap layer uses deterministic string/category similarity plus a bounded alias cache during every aggregate update. The expensive layer is an explicit consolidation sweep over already-aggregated maps; it asks an LLM to return fewer patterns, and falls back to the original list unless the model produces a valid shorter merge.

## Questions Remaining

- Our target design should decide whether graph aliasing is query-only metadata, a repair command that rewires edges, or both.
- The LLM consolidation target probably belongs outside `coverage-graph-query.ts`; this iteration maps the candidate-discovery part there and leaves the model caller for a later D2/D4 pass.
- [S2-07] remains next: kasper's category-aware weakness taxonomy and how category labels prevent bad merges in the coverage graph signal layer.

## Next Focus

[S2-07] How does kasper classify weaknesses into categories before similarity/merge decisions, and how should that map onto our coverage-graph node metadata and signal weighting?
