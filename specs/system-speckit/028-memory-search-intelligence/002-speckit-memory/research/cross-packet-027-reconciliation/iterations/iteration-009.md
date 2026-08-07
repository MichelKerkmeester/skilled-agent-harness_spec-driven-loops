# Iteration 9 (Round K): Q9 Observability / Continuity × consolidation gauges + as-of reads

## Focus
Reconcile 027's observability + continuity against 028's per-tick consolidation gauges (lag/pending/failed), C3-C TemporalMode (AsKnownAt), and the newInfoRatio-never-ingested gap. Read-only.

## Findings (newInfoRatio 0.55)
**VERDICT: EXTENDS** — both 028 sub-findings build on live 027 infra.
- 028's gauges (lag/pending/failed) + C4-C durable consolidation cursor extend 027's retrieval-only observability (`why_ranked`/`includeTrace`, `memory-search.ts:693-720`); 027 today exposes only a partial queue signal (`queued` + last-error via `memory_health`, `memory-save.ts:2956-2966`) and no structured consolidation-gauge taxonomy. PROMOTE+BUILD over the existing `background`/`deferred` seam.
- 028 C3-C `AsKnownAt` adds the transaction-time axis on top of 027's valid-time-only model — `resolveLineageAsOf` over `valid_from`/`valid_to` (`lineage-state.ts:1028-1039`) serves Current/AsOf/History but there is NO `ingested_at`/`known_at` column, so `AsKnownAt` is genuinely new.
- **Dropped-self-assessment has a 027 analogue:** §6 feedback signals were "collected but did not act on them," closed by shadow-first reducers (`before-vs-after.md:127-147`). 028's newInfoRatio computed-but-never-ingested (Deep-Loop) is the same compute-but-don't-act gap → 027's shadow-gated-ingestion is the transfer TEMPLATE (reverse-direction transfer: 027→028). LEVERAGE M, EFFORT M.

## Most-likely-wrong
That `resolveLineageAsOf` makes Current/AsOf/History reachable as a recall MODE — it may be an internal lineage helper (lib/storage + tests only) never wired to `memory_search`, making 028's TemporalMode closer to a new user-facing capability.

## Next Focus
Round L: confirm whether resolveLineageAsOf is wired to recall; capture the 027→028 reverse transfer (shadow-gated ingestion as the fix template for newInfoRatio).
