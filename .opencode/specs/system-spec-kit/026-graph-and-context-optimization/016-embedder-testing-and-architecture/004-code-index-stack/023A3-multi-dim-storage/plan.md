---
title: "Implementation Plan: 023A3 Multi-Dim Storage"
description: "Plan for optional per-dimension vector tables, legacy migration, active table routing, and status observability."
trigger_phrases:
  - "023A3 plan"
  - "multi-dim storage plan"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023a3-multi-dim-storage"
    last_updated_at: "2026-05-19T23:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented per-dim vector table routing"
    next_safe_action: "Run full verification and strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:023a300000000000000000000000000000000000000000000000000000000002"
      session_id: "023a3-multi-dim-storage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 023A3 Multi-Dim Storage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, CocoIndex SDK, SQLite sqlite-vec, msgspec daemon protocol |
| **Storage** | Project-local `.cocoindex_code/target_sqlite.db` |
| **Testing** | pytest and ruff in `.opencode/skills/mcp-coco-index/mcp_server` |
| **Primary Risk** | Wrong vector table selected for active embedder dimension |

The design keeps dimensions model-wide. The active registry dimension chooses one `vectors_<dim>` table. Metadata compatibility from 023A1 remains the hard safety gate, so an index built with 768d cannot be searched after switching to 1024d until that dimension has been indexed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 pre-bound to option E and 023A3 packet path.
- [x] 023A1 summary read; `IndexMetadata.embedder_dim` confirmed.
- [x] 023A2 summary read; registry accessors confirmed.
- [x] 023F cross-packet impact read; no per-side dimension knobs.

### Definition of Done

- [x] Focused 023A3 tests pass.
- [x] Full `pytest tests/ -q` passes.
- [x] `ruff check` passes.
- [x] Fresh in-memory migration smoke passes.
- [x] `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Components

- **`schema.py` table helpers**: central dimension-to-table mapping, identifier validation, legacy table detection, and row counts.
- **Migration `001_per_dim_tables.py`**: idempotent rename from `vectors` or `code_chunks_vec` to `vectors_768`.
- **Indexer routing**: CocoIndex mounts `vectors_<active_dim>` through context.
- **Query routing**: search resolves the active vector table and falls back only to legacy names before migration.
- **Daemon status**: totals use the active table; `per_dim_table_sizes` reports all per-dim tables.
- **FTS mirror**: syncs from the active vector table after index update.

### Data Flow

User settings identify the active embedder. Registry metadata yields `embedder_dim`. The daemon computes `vectors_<dim>`, passes it through project context, and the indexer writes rows there. Search checks 023A1 metadata first, then queries the same active table. Status reads all per-dim table counts for observability.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `schema.py` | CodeChunk/QueryResult models | Add table helper functions and validated SQL identifier quoting. | `tests/test_per_dim_storage.py`. |
| `migrations/001_per_dim_tables.py` | New storage migration | Rename legacy table to `vectors_768`, idempotently. | Migration tests and smoke run. |
| `indexer.py` | Vector writer | Mount active per-dim table. | Source/path tests and package pytest. |
| `query.py` | Vector reader | Query active per-dim table and retain hard refusal. | Cross-dim refusal test. |
| `daemon.py` | Project lifecycle/status | Run migration on project access and report per-dim sizes. | Status table-size test. |
| `project.py` | Environment/context owner | Provide vector table context and sync active FTS mirror. | Full pytest. |
| `fts_index.py` | FTS mirror | Sync from caller-provided active vector table. | Existing FTS tests. |
| `protocol.py` | IPC status payload | Add `per_dim_table_sizes`. | Status test and full pytest. |

Consumer inventory: query KNN/full-scan paths, hybrid row fetch, daemon project status, index count metadata writes, FTS sync, and msgspec status clients.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Design
- Prefer per-dimension tables because upstream removed per-side dimension knobs.
- Retain 023A1 metadata hard refusal for cross-dim safety.
- Support both packet legacy name `vectors` and local fork legacy name `code_chunks_vec`.

### Phase 2: Implementation
- Add table helpers and migration.
- Thread active table name through project context.
- Update query/status/count paths to resolve active table.
- Add focused tests.

### Phase 3: Verification
- Run targeted pytest and ruff.
- Run full package pytest and ruff.
- Run migration smoke.
- Write docs and strict validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Targeted | Per-dim storage, migration, status, refusal, isolation | `28 passed in 3.69s` |
| Full | mcp-coco-index package tests | `223 passed in 17.92s` |
| Lint | Code and tests | `ruff check`: clean |
| Spec | Level 3 packet docs | strict validation passed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 023A1 metadata | Packet input | Verified | Required for dim compatibility refusal. |
| 023A2 registry | Packet input | Verified | Required for model dimension lookup. |
| 023F upstream spike | Packet input | Verified | Prevents adding rejected per-side dim params. |
| Local package venv | Runtime | Available | Required for pytest and ruff. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the code/test files and packet docs. Databases already migrated to `vectors_768` would need either a compatibility view or a manual table rename back to the previous legacy name if pre-023A3 code must read them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L3: PHASE DEPENDENCIES

```text
023A1 metadata -> 023A2 registry -> 023F upstream dimension constraint -> 023A3 per-dim storage
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L3: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Setup/design | Medium | Verified A1/A2/F inputs and mapped storage surfaces. |
| Implementation | High | Threaded dynamic table name through index/query/daemon/status paths. |
| Verification | Medium | Added focused tests plus full package verification. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

```text
metadata dim available -> active table helper -> migration -> index/query routing -> status/tests
```

The critical path stayed inside mcp-coco-index storage and daemon surfaces. Doctor and calibration remained out of scope.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status | Evidence |
|-----------|--------|----------|
| Preconditions verified | Complete | 023A1, 023A2, and 023F docs read. |
| Storage routing implemented | Complete | `schema.py`, `indexer.py`, `query.py`, `daemon.py`. |
| Verification passed | Complete | `223 passed`, ruff clean, migration smoke passed. |
| Strict validation | Complete | `validate.sh --strict`: passed. |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:enhanced-rollback -->
## L3: ENHANCED ROLLBACK

### Trigger

Rollback if default 768d indexing no longer creates/searches the active table, migration loses legacy rows, or cross-dim search returns results instead of refusing.

### Procedure

1. Stop the daemon.
2. Revert 023A3 code changes.
3. For any migrated database that must be read by older code, rename `vectors_768` back to the expected legacy name.
4. Re-run targeted pytest and full pytest.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
registry embedder_dim -> schema table name -> project context -> indexer/query/status
legacy table -> migration -> vectors_768 -> default search path
index_meta embedder_dim -> compatibility checker -> cross-dim hard refusal
```
<!-- /ANCHOR:dependency-graph -->
