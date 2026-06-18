# Iteration 49 (Round O adversarial): What-breaks pass on the top GO candidates

## Focus
Final "what speaks the old contract" check on C4-B, C5-B, memory_history. Read-only.

## Findings (newInfoRatio 0.5) — two real constraint-risks
**C4-B: CONSTRAINT-RISK.** Legacy uniqueness is the **anchor-INCLUSIVE** 5-tuple `UNIQUE(source_id,target_id,relation,source_anchor,target_anchor)` (`vector-index-schema.ts:1121`); dedup keys on it via COALESCE (`causal-edges.ts:348-358`), so anchored edges are legal DISTINCT rows. A `derived_id = sha256(triple+source+rule_version)` OMITS anchors → two legacy anchored edges differing only by anchor collapse to one `derived_id` → UNIQUE backfill **REJECTS**. **Fix: `derived_id` MUST include anchors.** (Also: SQLite forbids inline UNIQUE on ADD COLUMN → ship as column + `CREATE UNIQUE INDEX`; fresh-DB CREATE TABLE is fine, the upgrade/backfill is the risk.)
**C5-B: REORDER-RISK (ties-only; non-ties safe).** The comparator is ALREADY a total deterministic order (score→similarity→`a.id-b.id`, id unique, `ranking-contract.ts:46-53`). So `content_hash asc` after id is dead code; before id it never reorders non-ties but CHANGES the resolved order of (score,similarity)-tied rows from id-asc to hash-asc — an already-deterministic order downstream may byte-cache. **So C5-B doesn't STABILIZE (nothing's unstable) — its value is content-DERIVED stability (survives id reassignment / cross-DB), not fixing instability.**
**memory_history: PARITY-RISK** — a new tool must be added across ≥4 surfaces (TOOL_NAMES + dispatch switch `memory-tools.ts:45-66`; schema registry + allowed-keys `tool-input-schemas.ts:574,626`; ListTools/inputSchema; handler export) + the daemon-CLI (5th). The "S 3-touch" was understated.

## Most-likely-wrong
The SQLite "inline UNIQUE forbidden on ADD COLUMN" claim — a table-recreate + separate CREATE UNIQUE INDEX avoids it. But the anchor-exclusion backfill-collision stands regardless.

## Next Focus
Ledger fixes: C4-B derived_id MUST include anchors (else backfill rejects); C5-B value reframed as content-derived stability (comparator already total via rowid); memory_history is ~5-surface parity.
