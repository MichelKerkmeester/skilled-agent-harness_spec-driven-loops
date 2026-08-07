
# YOUR NARROW FOCUS — iteration 011 of 15: Unit-of-memory & storage-model contrast (the transfer filter)
Characterize OpenLTM's memory unit and write path precisely, so we can classify which of its mechanisms are row-coupled vs storage-agnostic. Read:
- `packages/openltm-core/src/db.ts` — the `learn()` function end to end: what a "memory" IS at write time (fields, dedup_key, confirm_count, status), and the write queue
- `packages/openltm-core/src/schema.sql` — the `memories` table + related tables: is the row the source of truth?
- `packages/openltm-core/src/lib/writeQueue.ts` — how writes are serialized
- `docs/internal/DB-SPEC.md`, `docs/03-architecture.md` — their stated data model
Then produce the core deliverable of this whole pass: a **classification of OpenLTM's major subsystems** (recall, decay, janitor, hooks, graph, secrets, provenance, embeddings, learn/reinforce) into TRANSFERS / DOC-ANALOG / ROW-COUPLED for a spec-documentation-based consumer. This iteration sets the filter the other four apply.
