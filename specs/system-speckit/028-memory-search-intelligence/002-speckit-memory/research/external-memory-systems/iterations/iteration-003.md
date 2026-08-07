# Iteration 3 (MiMo lineage): Graphiti/Zep — bi-temporal invalidation / episodes / hybrid retrieval

> Model: **MiMo v2.5 Pro** (`xiaomi/mimo-v2.5-pro --variant high`), read-only opencode seat; orchestrator-written. newInfoRatio 0.8, 6 findings.
> **Source caveat:** opencode search respects `.gitignore` and `external/` is gitignored, so the seat could not discover the local `external/graphiti/` clone and **read Graphiti's source from GitHub instead** — findings are valid but line numbers are approximate (`~lines`). Remaining seats will be told to read `external/<repo>` by explicit path / `cat`, not Glob.

## Focus
Mine Graphiti for bi-temporal fact-invalidation, episode/provenance, and hybrid retrieval — diff against 028's existing bi-temporal candidates (C3-A/B/C) and the 5-channel RRF.

## Findings (6)
1. **GR-five-timestamp-edge** (EXTENDS C3-B, M/M) — EntityEdge carries `valid_at`/`invalid_at` (event-time) + `expired_at` (txn-time the system recorded invalidity) + `created_at` (txn-time) + `reference_time` (episode anchor) — a **5th timestamp** beyond aionforge's 4, separating "when system learned the fact ended" from "when it actually ended." `graphiti_core/edges.py` EntityEdge (~230-260). → `lib/graph/temporal-edges.ts:35-80` + C3-B.
2. **GR-llm-fact-invalidation** (EXTENDS C3-A/B, **H/M**) — on extraction an LLM finds contradicting edges; `resolve_edge_contradictions()` closes old edges with `invalid_at = new.valid_at` (event-time) + `expired_at = now()` (txn-time), never deleting. `graphiti_core/utils/maintenance/edge_operations.py` (~380-420, 520-580). → `lib/graph/contradiction-detection.ts:75-110` (today: rule-based, txn-time only, gated OFF). Contribution: **LLM-based** contradiction discovery + **event-time close** vs internal `invalid_at = now()`.
3. **GR-episode-provenance** (EXTENDS aionforge, M/H) — EpisodicNode is the ingestion unit; MENTIONS edges link episode→entity; `EntityEdge.episodes` tracks which episodes produced a fact. `graphiti_core/nodes.py` (~180-220) + `graphiti.py:add_episode()`. → `handlers/save/create-record.ts` (no episode model today) + C4-C. Internal has no episode-as-node concept.
4. **GR-hybrid-rrf-3channel** (**NO-TRANSFER**, L/N) — fulltext + vector RRF + BFS-from-seed (depth≤3) + MMR(0.5). `search/search_utils.py:hybrid_node_search()`. → ours is a **superset** (5-channel RRF + convergence bonus + GRAPH_WEIGHT_BOOST); Graphiti's 3-channel is a strict subset. Recorded as no-transfer.
5. **GR-fact-embedding-on-edge** (NET-NEW, M/M) — EntityEdge has a `fact_embedding` over the fact text → semantic edge dedup + similarity edge retrieval at write. `graphiti_core/edges.py` fact_embedding (~235). → `lib/storage/causal-edges.ts` (no embedding column; edges traversed structurally, not semantically); our dedup (`handlers/save/dedup.ts:17`, 0.88 cosine) is on memory content, not edge facts. Edge-level fact embeddings = net-new.
6. **GR-episode-window-context** (EXTENDS aionforge, M/M) — `retrieve_episodes()` fetches last N episodes (default 3) before reference_time as `previous_episodes` context for extraction prompts. `utils/maintenance/graph_data_operations.py` (~30-90, EPISODE_WINDOW_LEN=3). → ingestion-time context window (vs aionforge's recall-time diversity cap) — different lifecycle phase.

## Next Focus
Kimi/Letta (memory tiers) landing next. Then DeepSeek iter on Mem0 ADD/UPDATE/DELETE merge logic; deeper Graphiti `resolve_extracted_edge` dedup.
