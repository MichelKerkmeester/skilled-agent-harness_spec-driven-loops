# Iteration 10: External Mining — galadriel harness → Code Graph (SATURATED)

## Focus
Round B mining: galadriel (Python memory-palace) harness/memory for NET-NEW Code Graph candidates (galadriel was only deepened for 001 in pass 1). Read-only.

## Findings — NET-NEW candidates (1; newInfoRatio 0.25 — SATURATED)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| edge/symbol structural-timeline query (merge live + tombstoned edges into a per-symbol chronological "when did this caller/import appear/disappear" view) | code-graph-db.ts:249-321 (tombstones only); query.ts:582-647 (live only) — GAP | L/M | BUILD | CONFIRMED (capped by DEFAULT_TOMBSTONE_LIMIT=100) |

**Already covered / saturated:** galadriel's bitemporal KG (valid_from/valid_to + invalidate-then-add) → subsumed by the roadmap CRDT/versioning cluster + tombstone deletion-history (code graph rebuilds from current source, so an append-only validity ledger is the wrong shape); predicate-rich typed relations → `code_edges.edge_type` IS the predicate already; wing/room/hall namespace → existing scope policy (scopeFingerprint/scopeLabel); seed-union → already the roadmap cluster; scope-first-then-widen → working-set-tracker analogue.

## Honest bottom line
**galadriel is effectively SATURATED for Code Graph** — it's a memory-palace, not a code-graph. Its one distinctive graph primitive (kg_timeline) is largely covered by tombstones + CRDT cluster + typed edges + scope policy. The only net-new sliver (per-symbol structural-timeline query) is L-leverage and capped by the lack of generation retention. This is a genuine convergence signal for the galadriel sub-thread.

## Next Focus
galadriel exhausted for code-graph. The Code Graph net-new surface is now concentrated in the aionforge CRDT/edge-lifecycle/audit clusters (iters 8-9). Round B converging → pivot toward Round C feasibility.
