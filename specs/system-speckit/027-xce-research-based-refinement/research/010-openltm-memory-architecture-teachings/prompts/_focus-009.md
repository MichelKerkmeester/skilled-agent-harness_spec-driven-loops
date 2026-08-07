
# YOUR NARROW FOCUS — iteration 009 of 10: Schema/DB design + migration discipline
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/schema.sql` and `src/schema.sql` — DDL, FTS5 virtual tables + triggers, WAL
- `migrations/` — the numbered 001–022 set; note `001_baseline.sql`, `020_fts_coverage.sql` (FTS triggers), `schema_migrations` versioning
- `src/migrate.ts`, `packages/openltm-core/src/shared-db.ts` — the migration runner + connection setup
- `docs/internal/DB-SPEC.md` — authoritative schema reference
Focus on: FTS5-trigger-kept-in-sync indexing, the numbered backwards-compatible migration discipline, and `schema_migrations` version tracking. Contrast with our SQLite index schema + migration practice. What schema/migration practices are worth adopting?
