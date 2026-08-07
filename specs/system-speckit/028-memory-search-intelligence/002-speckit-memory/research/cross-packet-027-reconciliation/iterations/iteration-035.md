# Iteration 35 (Round N adversarial): bi-temporal dissolution — PARTIAL (holds on current-memory axis)

## Focus
Adversarially verify the M4 dual-supersede-truth dissolution + the additive-M migration claim. Read-only.

## Findings (newInfoRatio 0.5) — sharpens iteration-024
**VERDICT: PARTIAL.** The dissolution HOLDS on the current-memory axis, two supporting framings imprecise.
- **Holds:** current-memory truth IS the `active_memory_projection` JOIN (`hybrid-search.ts:730-732`, `interference-scoring.ts:138-144`); supersession decisions live only in lineage (`lineage-state.ts:798-803`); causal supersede edges are one-way derived from lineage (`relation-backfill.ts:317-333` reads `superseded_by_memory_id`). Current-memory reads NEVER consult causal `invalid_at`, so the causal graph cannot create a competing memory-currency truth.
- **Imprecise (a):** "one-way pipeline" is too strong — causal `invalid_at` HAS an independent writer (`contradiction-detection.ts:99-110` on every edge insert, driven by relation conflict from any source: similarity edges, manual links — not lineage). It's one-way for SUPERSESSION specifically, not all causal invalidation.
- **Imprecise (b):** `active_memory_projection` is JOINed across **~12 read sites** (`vector-index-queries.ts` ×8, `vector-index-store.ts` ×3) with **2 writers** (`lineage-state.ts:833` + the re-index path `vector-index-mutations.ts:211-239`), not the single cited site. So IF C3-C "Current" replaced the projection with causal edge-presence reads, the rewrite surface is ~12 JOINs → cost is **L, not M**. LEVERAGE H, EFFORT M (migration) / L (if Current replaces projection).

## Most-likely-wrong
C3-B four-timestamp additivity is UNVERIFIED — no C3-B migration spec/SQL exists to read, so "additive-M, no reader rewrites" is neither confirmed nor refuted at source (only the C3-C blast radius was bounded).

## Next Focus
Ledger: lineage canonical for current-memory (holds); but note causal invalid_at's independent writer + the ~12-site/2-writer projection → C3-C "Current"-replaces-projection is the L-cost risk, and C3-B additivity is the residual unknown.
