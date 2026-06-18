# Iteration 2 (Opus lineage): Cognee — ECL graph build / dedup / retrieval + novelty-diff

> Model: **Opus 4.8** (claude2, read-only); orchestrator-written. newInfoRatio 0.85, 8 findings + cross-system novelty-diff.

## Focus
Mine Cognee's extract-cognify-load (ECL) pipeline — graph node/edge build, entity dedup/merge, graph retrieval — for Memory-MCP causal-graph improvements; diff against Mem0 (iter 1) + prior art.

## Actions
Read `external/cognee/{infrastructure/engine/utils, modules/graph/utils, tasks/graph, modules/retrieval}`; cross-referenced internal `handlers/causal-graph.ts`, `lib/storage/causal-edges.ts`, the save/index path.

## Findings (8)
1. **CG-uuid5-entity-merge** (NET-NEW, **H/S**) — entity identity = `uuid5(NAMESPACE_OID, normalized-name)` so the same name collides to one node + auto-merges at write, no fuzzy/LLM. `cognee/infrastructure/engine/utils/generate_node_id.py:4`. → save/index + `causal-graph.ts` entity node creation.
2. **CG-composite-edge-dedup** (NET-NEW, **H/S**) — edges dedup on deterministic `src+rel+tgt` key → repeated extraction is idempotent. `modules/graph/utils/deduplicate_nodes_and_edges.py:15`. → `causal-edges.ts` edge upsert.
3. **CG-incremental-edge-merge** (NET-NEW, H/M) — loads `existing_edges_map` from the live graph before integrating a new chunk graph so new triples merge, not duplicate. `tasks/graph/extract_graph_from_data.py:105`. → save/index + `causal-edges.ts`.
4. **CG-ontology-canonicalization** (NET-NEW, M/L) — snap each entity/type to its closest controlled-vocab class (`ontology_resolver.get_subgraph`), regenerate id from canonical name, record alias → synonyms collapse to one node. `modules/graph/utils/expand_with_nodes_and_edges.py:122-137`. → `causal-graph.ts` normalization.
5. **CG-iterative-context-extension** (NET-NEW, H/M) — graph retrieval runs N rounds feeding the current completion back as the next query, merging new triplets, stopping when a round adds nothing (`check_convergence`). `modules/retrieval/graph_completion_context_extension_retriever.py:92,102-127`. → retrieval path.
6. **CG-neighborhood-rescore-ranking** (EXTENDS Mem0, H/M) — ranks triplets blending vector distance + node `importance_weight` + `feedback_weight`, seeds from top-k, expands neighborhood, re-runs ID-filtered vector search, applies hop-distance penalty (6.5). `modules/retrieval/utils/brute_force_triplet_search.py:56,70-73,170-205`. → retrieval scoring.
7. **CG-cascade-extraction** (EXTENDS Mem0, M/M) — node-first multi-round extraction (feeds `previous_nodes` back to raise recall) THEN a separate relation-binding pass — decouples entity recall from edge extraction. `tasks/graph/cascade_extract/utils/extract_nodes.py:15-42`. → LLM extraction stage.
8. **CG-schema-driven-edges** (NET-NEW, M/M) — for structured rows, skip LLM and build edges deterministically from schema/FK metadata. `tasks/graph/extract_graph_from_data.py:149-159`. → save/index for structured internal data (spec metadata, file/spec relations).

## Novelty-diff note (vs Mem0 iter 1)
Cognee corroborates Mem0's "LLM-driven linking at extraction" goal but **supersedes the dedup half**: `uuid5` name-collision merge + ontology snap achieve entity merge with **zero LLM calls** where Mem0 spends an LLM round. Cognee triplet ranking overlaps Mem0's entity-boost/adaptive-fusion (both blend importance) but extends it with structural neighborhood expansion + `feedback_weight` + hop-penalty. Mem0's entity-cardinality penalty has no Cognee analog (Cognee penalizes by graph hop-distance instead — complementary).

## Next Focus
MiMo/Graphiti (bi-temporal invalidation) + Kimi/Letta (memory tiers) landing next. Then DeepSeek iter on Mem0 update-merge logic.
