# Iteration 31: Round H Rust Reference — aionforge-retrieval → C-X1/C2/C6-A + the fuser adapter

## Focus
Round H: mine `aionforge-retrieval` for the RRF + query-class router + rank-time decay reference — Memory C-X1/C2-A/C2-C/C6-A + the Q8 fuser adapter. Read-only.

## Reference patterns (newInfoRatio 0.90)
| Technique | aionforge impl | Transferable |
|---|---|---|
| Weighted RRF (fuse-by-rank) | fusion.rs:91,62; k=60 | Σ weight/(k+rank+1); fixed-order sum (sort by signal enum) for float-determinism; final sort score-desc then node-id total_cmp tiebreak; weight=0 elides a channel |
| **C-X1 confirmed must-be-authored** | fusion.rs:114-130 (no bonus term); signals_run :358-406 | Multi-channel agreement is EMERGENT (more channels → more summed terms); aionforge has NO `{bonusOverChannels}`. The inputs exist (signals_run=active, non-zero weights=configured) but nothing computes a bonus → C-X1 is from-scratch |
| 5-class query-class router + per-class gating | router.rs:268,110,24,213 | SingleHopFactual/MultiHop/Temporal/Entity/Quote → per-signal weight ladder (HEAVY1.0/MOD0.6/LIGHT0.3/OFF0.0) + 5 behavior gates (graph_expansion/bitemporal/exact_rerank/quote/restrict); single-hop&quote SUPPRESS expansion (the precision rationale). classify() precedence most-specific-first; misclass degrades gracefully |
| Rank-time decay (opt-in, never written back) | rerank.rs:92,159; retriever.rs:365-408 | decay computed at query-time over (importance,last_access,now,half_life,pin), ORDERS but never persists; gated on caller stamping `now` (clock-less query = byte-identical); pin→full importance; recency is a SEPARATE axis on ingested_at (no double-count) |
| Content-derived serialization-id render order | temporal.rs:59; retriever.rs:462-466 | rendered view re-sorts by content-hash serialization-id (NOT mint-id) for cross-rebuild byte-identical render; fusion tiebreak (node-id) and render tiebreak (serialization-id) are SEPARATE |

## Key port note
**C-X1 confirmed from-scratch** (no reference bonus exists; aionforge's stance is summed RRF already encodes multi-channel preference). The query-class router is a complete reference for C2-A/C2-C (the HEAVY/MOD/LIGHT/OFF ladder + 5 gates + most-specific-first classify). C6-A's "opt-in on caller now, never write back, recency separate from last_access" exactly matches the verified internal design.

## Next Focus
C2-A/C2-C/C6-A reference-backed (the router + gating ladder + opt-in decay port directly); C-X1 confirmed authored-from-scratch. Feeds Round J (the C-X1 + query-class build sequence).
