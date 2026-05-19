---
title: "Decision Record: 023A3 Multi-Dim Storage"
description: "ADRs for per-dimension vector tables, backward-compatible migration, and migration idempotency."
trigger_phrases:
  - "023A3 ADR"
  - "multi-dim storage decisions"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023a3-multi-dim-storage"
    last_updated_at: "2026-05-19T23:30:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded ADRs for 023A3"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:023a300000000000000000000000000000000000000000000000000000000005"
      session_id: "023a3-multi-dim-storage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: 023A3 Multi-Dim Storage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record + level3-arch | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: ADR-A3-001 Per-Dim Vector Table Approach

**Status**: Accepted

<!-- ANCHOR:adr-001-context -->
### Context

023F confirmed upstream does not support per-side dimension knobs. 023A1 now stores `embedder_dim`, and 023A2 exposes registry dimensions, so storage can route by model-wide dimension without adding unsupported query/index dimension params.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Use one vector table per supported dimension: `vectors_768`, `vectors_1024`, `vectors_1536`, and `vectors_2048`. The active registry dimension selects the table for indexing and search. This wins over a single table with a `dim` column because sqlite-vec table definitions are dimension-specific and query-time filtering cannot make one vector column safely hold multiple dimensions.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Single `vectors` table plus `dim` column | The embedding vector column itself remains fixed-width. |
| Separate index/query dimension params | 023F explicitly rejected per-side dimension knobs. |
| Destructive reset/reindex only | Leaves HIGH FINDING-004-A unresolved and removes rollback table retention. |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Positive: default 768d behavior stays intact.
- Positive: non-768d embedders can build side-by-side storage.
- Negative: status and query paths must resolve active table names consistently.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result |
|-------|--------|
| Correctness | Cross-dim search is hard-refused by 023A1 metadata. |
| Compatibility | Legacy tables migrate to `vectors_768`. |
| Operability | Status reports per-dim table counts. |
| Performance | Active table lookup is direct. |
| Rollback | Old 768d table is retained when non-768d tables are added. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Implemented in `schema.py`, `indexer.py`, `query.py`, `daemon.py`, `project.py`, `fts_index.py`, `protocol.py`, and `migrations/001_per_dim_tables.py`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-a3-002 -->
## ADR-A3-002: Backward-Compatible Rename and Retention Story

**Status**: Accepted

### Context

The packet names `vectors` as the legacy table, while this local fork used `code_chunks_vec`. Supporting only one name would strand either packet-intended or actual local indexes.

### Decision

The migration renames `vectors` to `vectors_768` when present. If local `code_chunks_vec` exists and `vectors_768` does not, it is renamed to `vectors_768`. If `vectors_768` already exists, it remains authoritative and legacy tables are retained with a warning.

### Consequences

- Positive: existing local indexes retain their rows.
- Positive: old 768d storage remains available after a 1024d table is added.
- Negative: a database with both legacy tables and no `vectors_768` needs deterministic source selection; `vectors` wins to match packet wording.
<!-- /ANCHOR:adr-a3-002 -->

---

<!-- ANCHOR:adr-a3-003 -->
## ADR-A3-003: Migration Idempotency Contract

**Status**: Accepted

### Context

The daemon may touch a project more than once, and operators may run repair flows repeatedly. The migration must be safe to re-run and must not drop rollback tables.

### Decision

The migration checks for `vectors_768` first. If it exists, migration stops. Otherwise it renames one legacy source inside a transaction. Missing databases and databases without legacy tables are no-ops.

### Consequences

- Positive: repeated daemon starts and status checks are safe.
- Positive: rollback data is preserved.
- Negative: cleanup of obsolete legacy tables is intentionally not automatic.
<!-- /ANCHOR:adr-a3-003 -->

---

### Cross-References

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Verification**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
