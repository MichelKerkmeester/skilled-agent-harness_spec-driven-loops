
# YOUR NARROW FOCUS — iteration 002 of 10: Importance-weighted decay
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/janitor/decay.ts` — the decay formula and importance half-lives (reported 14/30/90/180-day + immortal), materialized `decay_score`, and the soft-deprecate threshold (~0.25)
- `migrations/011_add_decay_score_and_archive.sql`, `migrations/022_add_relevance_signal.sql`, `migrations/006_temporal_metadata.sql`
- `src/__tests__/decay.test.ts` — the formula exercised
- `docs/02-how-it-works.md` — half-life table
Contrast with our FSRS-based decay + co-activation. Does OpenLTM's importance-tiered half-life + materialized decay_score + soft-deprecate-but-retain have anything our FSRS lacks (e.g. query-time speed via materialization, retain-but-hide semantics, importance×confidence weighting)?
