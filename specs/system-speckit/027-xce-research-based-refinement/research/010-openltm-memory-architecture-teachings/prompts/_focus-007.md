
# YOUR NARROW FOCUS — iteration 007 of 10: Provenance + audit chain
Read (stay scoped to this subsystem):
- `packages/openltm-core/src/dao/provenanceAudit.ts` — `memory_audit` (append-only who/what/when/before/after) + `memory_provenance` (source kind)
- `migrations/008_add_memory_provenance.sql`, `migrations/009_add_memory_audit.sql`, `migrations/013_add_created_by.sql`, `migrations/014_update_audit_op_check.sql`
- `docs/03-architecture.md` — provenance/audit narrative
Focus on: the provenance source taxonomy (session / git-backfill / evaluate / user-promotion / import) and the append-only audit trail. Contrast with our continuity provenance / `_memory.continuity` frontmatter. Is a structured per-memory audit + provenance source kind a genuine delta worth adopting for a single-user store?
