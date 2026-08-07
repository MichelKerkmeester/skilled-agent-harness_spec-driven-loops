# Iteration 15 (DeepSeek lineage): forgetting / decay / contradiction-resolution (Q7)

> Model: **DeepSeek v4 Pro** (read-only, via `opencode run`). Orchestrator-written. newInfoRatio **0.5**. Mined Mem0+Graphiti forgetting/invalidation; deepens the contradiction/invalidation vein around the banked spearhead. 2 genuinely-new, 3 overlap-banked/gated.

## Genuinely NEW this iteration
1. **GR-temporal-ordering-invalidation → EXTENDS contradiction-detection (H/S — strong).** Graphiti has a deterministic temporal rule: if an old edge's `valid_at` precedes the new edge's `valid_at`, the old edge is auto-invalidated — *beyond* relation-type conflicts. `graphiti edge_operations.py:564-571 (resolve_edge_contradictions)`. Maps to `lib/graph/contradiction-detection.ts:38-55` (only `CONFLICTING_RELATIONS` relation-pair rules; no temporal-ordering rule). **H/S** = high leverage, small effort — a natural companion to the banked `MEM-fact-invalidation-event-time` spearhead.
2. **GR-semantic-invalidation-discovery → NET-NEW (M/M).** Graphiti finds invalidation candidates via hybrid *semantic search* (not just same source+target pairs) — an existing edge can be invalidated by a new contradicting fact across *different* node pairs. `graphiti edge_operations.py:407-430`. Maps to `contradiction-detection.ts:84-93` (only queries same `source_id+target_id`). NET-NEW: cross-pair semantic invalidation discovery.

## Overlap-banked / gated (not new)
- **GR-dual-axis-temporal-model** (M/S) — separate `invalid_at` (event-time) from `expired_at` (tombstone-recorded). `graphiti edges.py:271-277`. = the banked **GR-five-timestamp-edge (expired_at half)** + the `MEM-fact-invalidation-event-time` consolidation. Re-confirm.
- **GR-llm-temporal-range-extraction** (L/S) — small-LLM populates `valid_at`/`invalid_at` from fact text. = the **LLM-discovery half** of `GR-llm-fact-invalidation`, already split to Wave-2 NEEDS-BENCHMARK. EXTENDS.
- **M0-entity-cascade-cleanup** (L/L) — ref-counted entity-link cleanup on delete (`mem0 main.py:545-598`). **Gated**: requires an entity-node abstraction our memory-ID graph lacks. Park (Wave-2).

## Net effect
The invalidation/contradiction vein is the one area still yielding net-new: `GR-temporal-ordering-invalidation` (H/S) is a cheap, high-leverage companion to the spearhead, and `GR-semantic-invalidation-discovery` (M/M) extends contradiction detection beyond same-pair. Both fold under the broader **bitemporal-currentness** roadmap theme (C3-x). Mem0 forgetting = gated on entity nodes (no transfer to our memory-ID graph).

## Next Focus
Fold `GR-temporal-ordering-invalidation` + `GR-semantic-invalidation-discovery` into the `MEM-fact-invalidation-event-time` roadmap cluster (Wave-1, currentness). Q7 answered: forgetting transfers are invalidation-side, not decay-side (our FSRS retention already covers decay).
