# Iteration 44 (Round O): gauge lag — S, decoupled from C4-C

## Focus
Scope gauge `lag` feasibility (does it need the C4-C cursor). Read-only.

## Findings (newInfoRatio 0.7) — CORRECTS iter-015/M8 (lag was gated on C4-C)
**PENDING/FAILED: S-aliases confirmed.** `pending` = in-memory `queued` AND durable count of `post_insert_enrichment_status IN ('pending','partial','failed')` rows; `failed` = `failureTotal` / `status='failed'`. No new state.
**LAG: S — does NOT need C4-C.** The enrichment seam already has a durable per-item state column (`post_insert_enrichment_status`, migrated + partial-indexed, `vector-index-schema.ts:1884-1885`) + `memory_index.created_at`. Oldest-pending age = `now − MIN(created_at) WHERE status != 'complete'`, bolted onto the EXISTING health query (`memory-crud-health.ts:902`, which already groups non-complete rows). C4-C builds a net-new episode→consolidation cursor + cadence clock; `lag` rides the already-shipped status column, so it's decoupled. LEVERAGE M, EFFORT S.

## Most-likely-wrong
`created_at` is an approximate staleness proxy — the backfill/repair path re-marks old rows pending without touching `created_at`, so lag would OVER-report for recovered rows. A precise lag wants a one-line `pending_at` stamp on `markEnrichmentPending` (`enrichment-state.ts:171-176`) — still S, still no cursor.

## Next Focus
Ledger correction: gauge lag/pending/failed = Wave-0/1 S (decoupled from C4-C), not gated as iter-015/M8 framed. Optional one-line `pending_at` for precision.
