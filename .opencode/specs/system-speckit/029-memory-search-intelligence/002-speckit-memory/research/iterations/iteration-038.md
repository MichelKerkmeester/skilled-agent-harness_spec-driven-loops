# Iteration 38: Round J Cross-System — Shared-Infra Map + Critical Path (build-once-reuse-N)

## Focus
Round J: the cross-system shared-infra map + the critical path that unlocks the most across all 4 subsystems. Read-only.

## Shared primitives (newInfoRatio 0.30)
| Primitive | Build once at | Reused by |
|---|---|---|
| **total-comparator + content-id** (the determinism keystone) | NEW `shared/algorithms/total-order.ts` (sibling to rrf-fusion.ts) — NaN-safe total comparator + `canonicalId=sha256(canonical-fields)` | **ALL FOUR**: Memory C5-B, Advisor C2/C3 (replaces toFixed+localeCompare), Code Graph det-order + Q4-C1, Deep Loop merge-tiebreak + fold. (rrf-fusion.ts:255/391/424/551 sorts raw score, NO tiebreak; `total_cmp` = 0 hits anywhere) |
| **Beta posterior** | `bayesian-scorer.ts:13-44` additive export (cold-start 0.5, two-gate k≥2 AND posterior, reachability-validation) | Advisor C4 + Deep Loop D1/D2/D3/Q2 (both have ZERO internal Beta math) |
| **bi-temporal close-don't-delete + read-through-view** | Memory `getValidEdges` (temporal-edges.ts:111, exists/unwired) | Memory C3 + Code Graph Q1-C1 (same schema+read-filter shape) |
| **content-addressed id recipe** | falls out of #1 | Memory C4-A/C4-B + Deep Loop content-hash dedup + Code Graph G2 invariant |
| **recall/injection trust axis** | Memory render boundary (envelope.ts:284-295) | Memory recall + the red-team probe gate |

## Cross-system critical path
**Build total-comparator + content-id (#1) FIRST** — the deepest shared dependency (every determinism candidate in all 4 blocks on it, and it IS the content-id half of #4); one edit wires it into the already-shared `rrf-fusion.ts` sort → makes the fuser deterministic for Memory (current) + Advisor C3 + Code Graph promote in one stroke. → Then C-X1 `{bonusOverChannels}` on the same file. → In PARALLEL build the Beta posterior (#2) → unlocks Deep Loop D2→D3→Q2 + Advisor C4. → Generalize the bi-temporal read-filter (#3): Memory wires the read-side filter (the corrected C3-A) → Code Graph reuses the shape.

## Build-once-reuse-N (highest leverage)
(1) total-comparator+content-id → 4 subsystems / ≥5 candidates (zero exists; one file + one fuser-edit). (2) Beta posterior → 2 subsystems / 5 candidates. (3) rrf-fusion is the proven 3-of-4 choke point (already shared). (4) bi-temporal read-filter → Memory + Code Graph.

## Next Focus
This shared-infra map is the spine of the migration plan — build the 2 shared primitives (total-comparator+content-id, Beta posterior) FIRST; they unlock the determinism + reliability candidates across all 4 subsystems. Feeds the roadmap re-sync.
