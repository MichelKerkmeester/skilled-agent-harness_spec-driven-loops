# Iteration 16 (Round L): Q10 deep — causal/derived path content-addressing + C4-B blast-radius

## Focus
Resolve the Round K Q10 open: is the causal/derived/consolidation path content-addressed anywhere (reconsolidation tick / session-manager)? Scope C4-B feasibility. Read-only.

## Findings (newInfoRatio 0.55)
**RESOLUTION: NO-CONTENT-ID CONFIRMED.** The causal/derived-edge write path is content-addressed nowhere.
- `causal-edges.ts` has zero sha256/content_hash/idempotency/derived_id; dedup is the autoincrement `id` + natural-key `UNIQUE(source,target,relation,anchors)` + `INSERT OR IGNORE`/SELECT-UPSERT (`:349-358,560-561`).
- The reconsolidation tick's `content_hash` is on memory *records*, not edges (`reconsolidation-bridge.ts:598-599,713`), and it makes NO edge-write calls. `session-manager.ts:516-529` sha256 fingerprints memory identity for record dedup, not edges. Idempotency receipts are scoped `memory_save|memory_update` only (`idempotency-receipts.ts:9`).
- **C4-B feasibility (additive, contained):** add `derived_id TEXT` UNIQUE companion to `causal_edges` = `sha256(canonical-triple+source+rule_version)` at `insertEdge`, **keeping the autoincrement PK** so the lone FK (`weight_history.edge_id REFERENCES causal_edges(id)`, `vector-index-schema.ts:1423`) needs no migration. LEVERAGE M, EFFORT M (M-L if PK left intact).

## Most-likely-wrong
"weight_history is the ONLY FK on causal_edges.id" — the repo-wide FK sweep used a broken zsh glob, so dependents were confirmed only within causal-edges.ts + vector-index-schema.ts; a traversal/query handler elsewhere could join on the edge id unseen. → Re-verify in Round M (M6).

## Next Focus
C4-B is the concrete derived-identity transfer; pairs with L8's shared-canonicalization synthesis. Round M re-verifies the FK blast-radius.
