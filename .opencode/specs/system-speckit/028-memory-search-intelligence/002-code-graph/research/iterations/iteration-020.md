# Iteration 20: Round I Implementation Sketch — Q4-C1 (needs-benchmark; tips to RRF-additive)

## Focus
Round I: build sketch for Q4-C1 rank-time trust multiplier. Read-only.

## Build sketch (newInfoRatio 0.60) — **NEEDS-BENCHMARK**
- **Correction:** no single sort site exists — the "sort sites" (code-graph-context.ts:607,:649) are `edges.push` in graph-iteration order; `queryEdgesFrom/To` (code-graph-db.ts:1271/1294) have NO `ORDER BY` (rowid order). confidence/evidenceClass are read-only projections, never scored (`:350-356`); structural weight only read, never mutated.
- **CHANGE:** add a re-rank at each edge-collection point in `expandAnchor` (after queryEdgesFrom :599, queryEdgesTo :638, CONTAINS/deps): `reliability=clamp01(confidence)×evidenceClassFactor`; sort desc by `weight×reliability` (original index tiebreak); neutral fallback confidence=null→1.0.
- **THE CRITICAL CAVEAT:** the "neutral fallback = no-op" claim FAILS — baseline is rowid order, NOT weight order, so sorting by `weight×1.0` still reorders neutral edges with differing raw weights. A true no-op needs re-ranking off ordinal RANK, not raw `weight`. Raw `edge.weight` is unnormalized → `weight×reliability` is scale-dominated with no clean no-op. **This tips decisively to RRF-additive** (scale-free, fuses a structural-rank list + a reliability-rank list, genuine no-op when reliability absent) over the multiplicative re-rank — sharpens G2/G16.
- **WHAT-BREAKS:** impact-order consumers (MCP output, detect_changes, golden tests) see reordering; the multiplicative-vs-RRF choice.
- **READINESS:** needs-benchmark (and re-formulate as RRF-additive, not multiplicative).

## Next Focus
Q4-C1 re-framed: implement as RRF-additive (not multiplicative weight×reliability) — the unnormalized-weight reality has no clean no-op for the multiplier. Feeds Round J.
