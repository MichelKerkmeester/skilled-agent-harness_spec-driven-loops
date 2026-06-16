# Iteration 18: Round H Rust Reference — aionforge-store → Q1-C1 Bi-temporal (the schema reference)

## Focus
Round H: mine `aionforge-store` for the reference implementation of the bi-temporal storage + live-view + generation watermark + CRDT merge — Code Graph Q1-C1/views/Q6-C1/crdt-merge. Read-only.

## Reference patterns (newInfoRatio 0.55)
| Technique | aionforge impl | Transferable to SQLite/TS |
|---|---|---|
| Four-timestamp window, currentness=presence | fact.rs:203-239 | {valid_from,valid_to (event-time), ingested_at,expired_at (txn-time)}; valid_to/expired_at OMITTED while open (absence=current, no sentinel). Maps to nullable SQLite columns; "current" = `valid_to IS NULL AND expired_at IS NULL` |
| Non-destructive supersede (one atomic commit, deletes nothing) | store.rs:861-892; materialize.rs:80-90 | `BEGIN; UPDATE old SET valid_to=?, status='superseded'; INSERT new; INSERT superseded_by_edge; COMMIT` — txn-time untouched so as-of reads still resolve old. Direct-write + consolidation share ONE body (can't drift) |
| **Live-view chokepoint** | relates_to.rs:313-332; store.rs:894-927 | ONE definition of current (`valid_to IS NULL AND expired_at IS NULL AND status NOT IN(superseded,quarantined)`); a `CREATE VIEW current_facts` all default reads route through; as-of/audit readers deliberately bypass |
| Generation watermark + resumable cursor | consolidation.rs:126-127,91-96,382-446 | `generation:u64` +1 per commit (detect "changed since gen N"); cursor `"<ts>|<id>"` lexicographic, advances ONLY in the same atomic commit. SQLite must MAINTAIN the counter explicitly (meta row in-txn) |
| Order-independent CRDT merge | trust_fold.rs:183-259 | Resolved value = pure fold over content-addressed dedup'd log; idempotent via `UNIQUE(content_hash_id)` + INSERT-OR-IGNORE; materialized state = recomputable cache rewritten write-when-changed |

## Key port note
The live-view-chokepoint is the keystone (Round C's Q1-C1-views): define the current-view predicate ONCE (a SQL VIEW), force all default reads through it, retain non-current rows. The generation counter must be maintained explicitly in SQLite (aionforge gets it free from engine MVCC).

## Next Focus
Q1-C1/views/Q6-C1 are now schema-reference-backed (the four-timestamp window + atomic supersede + SQL VIEW + explicit generation counter port to SQLite). Feeds Round J migration plan (the code-graph-db.ts shared-txn cluster).
