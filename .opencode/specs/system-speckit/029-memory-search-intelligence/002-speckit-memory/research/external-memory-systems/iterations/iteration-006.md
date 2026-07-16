# Iteration 6 (Opus lineage — NATIVE): adversarial-verify the top candidates vs live internal code

> Model: **Opus 4.8 NATIVE** (Agent tool `model: opus`, read-only; NOT claude2 — operator directive). Orchestrator-written. newInfoRatio 0.7 (net-deflationary verify). Opened the cited internal seams in live `mcp_server/` code.

## Systemic finding (load-bearing)
**The internal causal graph is memory-ID→memory-ID, not entity-node.** `causal_edges` source_id/target_id are `memory_index` row IDs (`handlers/causal-graph.ts:856-892`, grep :995). Every Cognee/Graphiti candidate's `maps_to` assumes an *entity-node* graph — a mismatch the candidates glossed over. This downgrades the entity-merge candidates and marginalizes edge-fact-embedding (edges have no standalone fact text today).

## Verify verdicts (7 top candidates)
1. **CG-composite-edge-dedup → REFUTED.** `insertEdge` ALREADY dedups on a *superset* composite key `(source_id,target_id,relation,source_anchor,target_anchor)` — SELECT-then-UPDATE/INSERT, idempotent (`causal-edges.ts:348-453`; bulk INSERT OR IGNORE :560-563). Shipping it = no-op. **The single most-likely-wrong banked claim.**
2. **GR-llm-fact-invalidation → GO (confirmed).** `contradiction-detection.ts` is rule-based only (CONFLICTING_RELATIONS :38-42 + 'supersedes' :100; no LLM), gated OFF; `invalidateEdge` sets `invalid_at = now()` txn-time (`temporal-edges.ts:81-96`). Both deltas genuinely absent: (a) LLM-discovered contradictions beyond hard-coded pairs; (b) event-time close `invalid_at = new.valid_at`. **Highest value; split the two halves.**
3. **CG-uuid5-entity-merge → DOWNGRADE (NET-NEW→EXTENDS) + REFINE.** Mechanism already exists: `entity_catalog` keys on `normalizeEntityName→canonical_name` + alias collapse, zero-LLM (`entity-extractor.ts:260-321`; `entity-linker.ts:424-429`) — but on the *retrieval/linking* side, decoupled from causal-graph node creation. Net-new sliver = a stable uuid5 surface + deciding whether to introduce entity nodes into the (memory-ID) graph.
4. **M0-adaptive-additive-fusion → DOWNGRADE (NET-NEW→EXTENDS) + REFINE.** `adaptive-fusion.ts` already adapts per-intent/doc-type *weights* (INTENT_WEIGHT_PROFILES :66-75). Net-new sliver = only Mem0's additive `(Σ)/max_possible` + channel-gated divisor + semantic gate *formula*; low confidence it beats the tuned RRF+convergence-bonus superset — experimental.
5. **M0-entity-store-boost → HOLDS (NET-NEW) + REFINE.** No entity *vector* index exists; closest analog is the rrf-fusion `DEGREE` channel (:17, count-based). Only the *vector-matched-entity* boost is net-new; scope to "entity-embedding index → new boost channel."
6. **GR-fact-embedding-on-edge → HOLDS (NET-NEW) + REFINE (marginal).** `causal_edges` has no embedding column (confirmed grep). Net-new, but M/M + lower-leverage on the memory-ID graph (you'd synthesize edge fact text); worth it only if entity/fact nodes are introduced.
7. **LT-self-edit-char-limit-blocks → REFUTE (as framed).** Built on a misread of Letta (iter-5: Letta's char-limit is *advisory*, no auto-eviction). The only salvage is a block-size-triggered compaction idea — net-new but unrelated to Letta's actual behavior.

## Net effect
Of 7: **1 clean GO** (GR-llm-fact-invalidation), **1 net-new-marginal** (GR-fact-embedding), **4 refine/downgrade**, **1 refuted** (CG-composite-edge-dedup). The campaign's H/S "cheap wins" shrank — CG-composite-edge-dedup is gone, CG-uuid5 is an EXTENDS not a NET-NEW. The durable GO spearhead is **GR-llm-fact-invalidation (event-time close half = small, well-scoped)**.

## Next Focus
Continue Opus-lineage verify on the remaining candidates (transport-idempotency, fingerprint-WARN, ANN-tie-stable, constitutional-self-edit, Q3-PPR); DeepSeek/MiMo deepen Mem0 update-merge + Graphiti community detection; then GO/no-go synthesis (synthesis/06). All Opus seats now NATIVE (`model: opus`).
