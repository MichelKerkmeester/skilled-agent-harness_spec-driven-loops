# Iteration 7: DB — the 21 indexed constitutional rows + learned-triggers confirmation

## Focus
Read-only verification of the memory DB: constitutional tier rows, learned-triggers state, tier config, and the vector/projection surfaces those rows live in. (Read-only sqlite3 queries only.)

## Findings

### F7.1 Tier distribution (confirmed live DB)
`context-index.sqlite` (mcp-server/database/): important 5411, normal 5376, critical 984, deprecated 427, **constitutional 21**, archived 1. [SOURCE: sqlite3 -readonly SELECT GROUP BY, Iter 7]

### F7.2 The 21 constitutional rows = 20 rule files + folder README
- 20 distinct filenames = exactly the 20 rule files (automated-writers…verify-before-completion-claims); 21st row = `constitutional/README.md`. All in `spec_folder='system-spec-kit'`. [SOURCE: sqlite3 SELECT DISTINCT substr(file_path…), Iter 7]
- 20 of 21 rows present in `active_memory_projection` (one row — presumably README or a deleted-file row — not in the active projection). [SOURCE: JOIN count = 20, Iter 7]

### F7.3 Learned-triggers: 0 populated rows (confirmed)
- `learned_triggers` column: 0 rows with non-empty/non-'[]' values. Grounding confirmed. [SOURCE: sqlite3 SELECT COUNT, Iter 7]

### F7.4 DB action options
- **DELETE (recommended):** physical delete of the 21 rows + their vector embeddings + projection rows + FTS rows. Matches "deprecate the constitutional LAYER completely" + "unindexed reference docs" (kept files must NOT be searchable memories). The tier's searchBoost/alwaysSurface/decay semantics (importance-tiers.ts:34-42) disappear with the tier.
- **Rewrite tier (not recommended):** re-tier to 'important' would keep the rule docs searchable as ordinary memories — contradicts "unindexed reference docs" and would leave the 3x boost/alwaysSurface history semantics ambiguous.
- Dependency: `memory-index.ts:624` (include_constitutional default true) + `findConstitutionalFiles` discovery (`:759`) + `tool-schemas.ts:761` default must be flipped/removed BEFORE the delete — otherwise the next scan re-indexes the folder and recreates the rows. Also `cli.ts:489` hardcodes true. [SOURCE: file:handlers/memory-index.ts:624,759; file:cli.ts:489; file:tool-schemas.ts:761]
- Migration history: v28 partial unique index `idx_memory_logical_key_active_unique` ("at most one non-deprecated, non-constitutional row per logical key") becomes a plain non-constitutional index — harmless after rows are gone. [SOURCE: file:feature-catalog/feature-catalog.md:1356]

### F7.5 Vector surfaces for the rows
- Vector table `edge_vector_embeddings` exists; the constitutional rows carry embeddings (embedding_status success/pending per memory-surface.ts:168 query pattern). Row deletion must cascade to vector + active_memory_projection + FTS5 index. [SOURCE: sqlite3 .tables + memory-surface.ts:167-171, Iter 7]

## Sources Consulted
- `mcp-server/database/context-index.sqlite` (read-only queries), memory-index.ts, cli.ts, tool-schemas.ts, memory-surface.ts

## Assessment
- newInfoRatio: 0.75 — DB state confirmed (21 rows, 0 learned); new detail: README row included, 20/21 active.
- Novelty justification: fifth+1 surface; exact row composition + delete dependencies established.
- Confidence: high (live DB read; read-only).

## Reflection
- Worked: sqlite3 -readonly queries — safe, fast, exact.
- Ruled out: modifying the DB (out of scope — lineage is read-only on repo state); schema-level grep for constitutional defaults in migrations (covered by feature-catalog v28 note).

## Recommended Next Focus
Iter 8: Dedup + classification reconciliation — consolidate Iter 1-7 findings into the master inventory table draft with classes [DONE|TODO|KEEP-AS-DOC|DELETE].
