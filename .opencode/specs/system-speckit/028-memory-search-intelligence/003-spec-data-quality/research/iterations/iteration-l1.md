# Iteration L1 - Logic Rollup-Nodes plus Set-Merge (deepseek, hierarchy-aggregation feasibility)

## TITLE

Cohort L1 logic angle. Model deepseek. Angle tests whether GraphRAG-style track and phase-parent rollup summary nodes plus LightRAG incremental set-merge can produce records that reach the prod top-3, and where the rollup-node-vs-mirage tension sits.

## FINDINGS

The corpus does not have track-level or phase-parent rollup summary nodes today. The community-summary system builds flat clusters from the `causal_edges` table via label propagation (`community-detection.ts:52-80`), not from the packet hierarchy in graph-metadata.json, and there is no track or phase-parent concept in community detection. Meanwhile graph-metadata.json has parent_id, children_ids and causal_summary per packet, but `graphMetadataToIndexableText()` at `graph-metadata-parser.ts:1311-1353` flattens each packet individually. When it hits children at `:1328` it writes `Children: X, Y, Z` as plain text and does not pull in child summaries, aggregate key topics, or create a rollup record. The 028 phase-parent graph-metadata.json has a human-authored `causal_summary` at `:208` not an aggregation of its nine children (`028/graph-metadata.json:6-16`).

The backfill does not regenerate whole subtrees. `backfill-graph-metadata.ts:206-234` iterates per spec folder and calls `refreshGraphMetadataForSpecFolder()` for each with no subtree traversal or recursive aggregation. `deriveGraphMetadata()` at `graph-metadata-parser.ts:1089-1136` reads CANONICAL_PACKET_DOCS at `:36-47` from the one packet path only.

The 028 lesson is confirmed. `memory_match_triggers` defaults limit to 3 (`tool-schemas.ts:324-325`), the token-budget path floors detailed results at min(limit, 3) (`token-budget-skip-and-floor.vitest.ts:70`), and community fallback results receive a 0.02 score multiplier (`memory-search.ts:1286`) that places them below the MMR reranker floor for normal queries. Community summaries are keyword-matched not embedded (`community-search.ts:88-99`) and are a feature-gated fallback channel applied only when primary search returns weak results (`memory-search.ts:1228-1229`). The current community system never competes for top-3 in normal retrieval. Any change that only lifts recall@20 or community-fallback matching is invisible to the prod 3-result window, to matter it must produce a new record that can reach the top-3 vector or FTS position for broad queries.

The rollup-node-vs-mirage tension. Candidate 6 track and phase-parent rollup nodes have direct prod-path impact and are NOT a mirage if and only if the rollup is materialized as an embedded first-class memory_index record (context_type track_summary) rather than left in the keyword-only, 0.02-multiplier fallback channel where today's community summaries live. A broad query like what is the state of spec-kit retrieval would match the rollup embedding as a top-3 hit instead of 3 random child packet hits, then follow children_ids for multi-hop. Candidate 7 LightRAG set-merge is the mirage half here, it has only indirect prod impact (quality through freshness not ranking) and alone improves update efficiency not top-3 recall. So 6 prioritized over 7, and 7 is additive only.

## CONCRETE CHANGE

Prioritize candidate 6 over candidate 7. Generate one track-level and one phase-parent-level rollup summary node per hierarchy node, index them as embedded memory_index records with context_type track_summary, and wire them into the retrieval pipeline as first-class non-fallback results. The rollup aggregates children's causal_summary, key_topics and status distribution and carries children_ids for multi-hop. Implement candidate 7 set-merge after 6 to keep rollups fresh without full re-index churn, but not as a standalone retrieval win.

## EVIDENCE

- External brief: angle 3 at `stage-0-external-findings.md:30-31` cites Microsoft GraphRAG community hierarchy plus summaries (https://github.com/microsoft/graphrag) and LightRAG dual-level plus incremental set-merge (https://github.com/hkuds/lightrag), candidates 6 and 7 at `:96-97`.
- Real file: `028-memory-search-intelligence/graph-metadata.json:6-16` children_ids and `:208` causal_summary with no child aggregation.
- Per-packet indexing: `graph-metadata-parser.ts:1089-1136` deriveGraphMetadata reads one packet, `:1311-1353` flattens per-packet.
- Community internals: `community-detection.ts:52,536` adjacency from causal_edges plus full label propagation, `community-summaries.ts:110-165` full DELETE plus INSERT no set-merge, `community-search.ts:88-99` keyword-only score, `memory-search.ts:1228-1303,1286` fallback gate plus 0.02 multiplier.
- Floor: `tool-schemas.ts:324-325` default limit 3, `token-budget-skip-and-floor.vitest.ts:70` min(limit, 3). Backfill loop: `backfill-graph-metadata.ts:193,206-234`.

## READER

Retrieval primary. Track and phase-parent rollup nodes serve broad queries that today get 3 random leaf hits, returning the rollup as a top-3 result with multi-hop via children_ids. The logic angle is the aggregation correctness underneath, but the payoff lands on the retrieval reader.

## ON-WRITE OR RETROACTIVE

Retroactive. Rollup nodes derive from existing graph-metadata.json files across all packets with no new writes to existing packets, only a new generation script plus an indexing step. Set-merge is also retroactive since it replaces the current full-rescan logic with hash-aware incremental.

## RISK

Rollup summary generation wants an LLM pass to aggregate children into a coherent paragraph, a new dependency with latency and cost. A cheaper concatenated key_topics plus status-count first step is less semantically rich. Track-level rollups (30-plus packets) could be very large and crowd out specific leaf results for any in-track query, needing a boost-control or broad-vs-specific query gate. Set-merge needs per-packet content-hash tracking and a membership delta table, if the hash tracking drifts the incremental updates silently diverge from full detection, a correctness hazard needing a periodic full-rebuild health check. Without first-class embedded materialization, candidate 6 collapses back into the 0.02-multiplier fallback channel and becomes the same mirage 028 already measured.
