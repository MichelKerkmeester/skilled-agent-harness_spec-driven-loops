# Iteration 34 (Round N adversarial): C4-B checkpoint restore — clean-additive HOLDS

## Focus
Adversarially verify that C4-B (additive derived_id) is migration-free — does checkpoint restore preserve causal_edges.id. Read-only.

## Findings (newInfoRatio 0.4) — confirms iteration-016/023 with a precision fix
**VERDICT: CLEAN-ADDITIVE HOLDS.** Checkpoint restore uses `INSERT OR REPLACE INTO causal_edges (${columns}) VALUES(...)` (`checkpoints.ts:1896-1900`) where columns derive from a `SELECT * FROM causal_edges` snapshot (`:1499`) and INCLUDE `id` — so restore **preserves the exact id**, not reassignment; `weight_history.edge_id` linkage survives. `weight_history.edge_id REFERENCES causal_edges(id)` is the only schema FK (`vector-index-schema.ts:1423`); other id readers are transient (unlink handle, read-only telemetry alias). A `derived_id TEXT UNIQUE` collides with no existing column. LEVERAGE M, EFFORT S.

## Precision fix (correct iteration-016 wording)
`causal_edges.id` is `INTEGER PRIMARY KEY` — a plain **rowid alias, NOT AUTOINCREMENT** (`vector-index-schema.ts:1108`; contrast `weight_history.id ... AUTOINCREMENT` at `:1422`). Prior iterations said "keep the autoincrement PK" — functionally a monotonic rowid but rowids can be reused after deletion. Irrelevant to restore (preserves ids) but correct the wording → "rowid-alias PK." Also noted a pre-existing query quirk: `search-results.ts:528` joins `wh.edge_id = ce.edge_id` but causal_edges has no `edge_id` column (CTE-alias quirk; not material).

## Most-likely-wrong
Did not open `restoreMergeTableAtomically` (merge path); the dominant clearExisting path preserves id, and merge restores snapshot rows that also carry id.

## Next Focus
C4-B finalized clean-additive (rowid-alias PK). Flag the search-results.ts:528 ce.edge_id quirk as a 027-internal note.
