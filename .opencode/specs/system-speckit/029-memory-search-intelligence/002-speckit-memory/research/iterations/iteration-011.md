# Iteration 11: External Mining — aionforge retrieval.md + decay-and-importance.md → Memory

## Focus
Round B external mining: two unread aionforge docs (retrieval, decay-and-importance) for NET-NEW Memory candidates beyond the existing C2-C9/C-X1/C-G set. Read-only; proposals only.

## Actions Taken
1. Read aionforge `docs/retrieval.md` + `docs/decay-and-importance.md`.
2. Grepped internal Memory seams under `mcp_server/` (formatters/search-results.ts, handlers/memory-search.ts, lib/cognitive/tier-classifier.ts, handlers/memory-retention-sweep.ts, tool-schemas.ts) to confirm cover-vs-gap.

## Findings — NET-NEW candidates (8; retrieval/decay largely saturated → mostly FIX-class hardening)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| relative-score-band (coarse high/med/low vs THIS recall's top hit) | formatters/search-results.ts:144 | M/S | BUILD | INFERRED |
| lexical-exact-anchor-contribution (exact surface match gets visible fused weight) | search-results.ts:610 | M/M | BUILD | INFERRED |
| competition-ranking-for-rerank-neutrality (equal scores share rank → uniform field reorders nothing) | search-results.ts:610; memory-search.ts:314 | M/S | FIX | INFERRED |
| decay-defensive-short-circuits (pinned / inert half-life / NaN / clock-regression guards) | memory-search.ts:145; schemas:622 | M/S | FIX | INFERRED |
| pin-short-circuits-rank-time-importance (pin keeps full importance in ranking, not just tier) | tier-classifier.ts:305/504 | M/S | FIX | pin CONFIRMED |
| recency-vs-decay-dual-axis-separation (recency=ingestion-time vs decay=last_access; no double-count) | memory-search.ts:314,145 | M/S | FIX | recency CONFIRMED |
| forget-eligible-spare-only-predicate (AND-axes, any axis only SPARES; shared rank/sweep decay fn) | memory-retention-sweep.ts:44 | M/M | FIX | sweep CONFIRMED |
| provenance-gated-sensitive-recall (recall-time `sensitive` flag → provenance-grounded rows only) | tool-schemas.ts:384 (ingest only) | M/M | BUILD | ingest CONFIRMED |

**Already covered:** retrieval.md → C2-A/B/C, C3-*, C5-*, C7-A, C8, C9, C-X1; decay → C6-A. fp16/exact rerank already benchmarked internally; entity-seed PPR needs an associative graph the Memory store lacks (depends on C3).

## Questions Answered
- Net-new Memory surface in retrieval/decay? MODEST (newInfoRatio 0.35) — mostly FIX-class numeric/ranking hardening + 2 BUILD (relative band, sensitive recall). Core retrieval is saturated vs the roadmap.

## Questions Remaining
- Does internal `recency` read ingestion-time or reuse decay `last_access`? Does RRF neutralize a uniform re-rank field (competition-rank)? Any rank-time consumer of `is_pinned`?

## Next Focus
Memory retrieval/decay saturating; the FIX-class hardening cluster (competition-rank + decay guards + pin-at-rank + dual-axis) is a coherent small-effort sub-packet. Continue Round B on consolidation/identifiers (B6/B7) + forgetting/erasure (B2 relaunch).
