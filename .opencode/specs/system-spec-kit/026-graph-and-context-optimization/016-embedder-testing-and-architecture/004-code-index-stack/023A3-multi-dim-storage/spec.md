---
title: "Feature Specification: 023A3 Multi-Dim Storage"
description: "Add optional per-dimension vector tables for mcp-coco-index while keeping default 768d behavior unchanged."
trigger_phrases:
  - "023A3"
  - "multi-dim storage"
  - "per-dim vector tables"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023a3-multi-dim-storage"
    last_updated_at: "2026-05-19T23:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented optional per-dimension vector storage"
    next_safe_action: "Review verification evidence; do not commit unless explicitly requested"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/migrations/001_per_dim_tables.py"
    session_dedup:
      fingerprint: "sha256:023a300000000000000000000000000000000000000000000000000000000001"
      session_id: "023a3-multi-dim-storage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "023F removed per-side dimension knobs; 023A3 uses model-wide table selection."
      - "023A1 already stores embedder_dim; 023A3 uses that field for routing."
      - "023A2 registry accessors expose model dimensions."
---
# Feature Specification: 023A3 Multi-Dim Storage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

023A3 removes the destructive reset requirement for supported non-768d embedders by routing vector rows into model-wide per-dimension tables. The default 768d path stays compatible: legacy `vectors` or `code_chunks_vec` tables migrate to `vectors_768`, and future 1024d, 1536d, and 2048d tables are created lazily by the indexer.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The registry advertises non-768d embedders, but the SQLite vector table was hard-coded to one table name and effectively one dimension. Operators swapping to a different model dimension had to reset and reindex, losing the old 768d table that could otherwise support rollback.

### Purpose

Add optional per-dimension storage while preserving current behavior for the default embedder. Indexing writes to the active model dimension, search reads from that same dimension, metadata compatibility still hard-refuses cross-dimension search, and daemon status exposes table sizes for operators.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `vectors_768`, `vectors_1024`, `vectors_1536`, and `vectors_2048` table-name routing.
- Migrate legacy `vectors` and local legacy `code_chunks_vec` to `vectors_768`.
- Route index writes and query reads through the active registry dimension.
- Keep 023A1 `embedder_dim` compatibility refusal as the cross-dimension safety gate.
- Report per-dimension table sizes in project status.
- Add tests for migration, routing, refusal, status, idempotency, and table isolation.

### Out of Scope

- Calibration and fixture expansion owned by 023B.
- Doctor command workflow owned by 023D.
- Per-side dimension overrides; 023F explicitly disallows `indexing_params.dimensions` and `query_params.dimensions`.
- Git commit; user explicitly constrained this packet to no commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py` | Modify | Add dimension table helpers, identifier quoting, table detection, and table row counts. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/migrations/001_per_dim_tables.py` | Create | Idempotent legacy table rename migration. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Modify | Mount the active `vectors_<dim>` table at index time. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modify | Resolve and query the active vector table at search time. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Run migration on project access and expose per-dim sizes in status. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/project.py` | Modify | Provide the active vector table through project context and sync FTS from it. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/fts_index.py` | Modify | Allow FTS sync from the active vector table. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modify | Add additive `per_dim_table_sizes` field to project status. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_per_dim_storage.py` | Create | Focused 023A3 tests. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-A3-001 | Per-dim table names | `_table_name_for_dim(768)` returns `vectors_768`; supported dims are 768, 1024, 1536, and 2048. |
| REQ-A3-002 | Default compatibility | Default embedder routes to `vectors_768`; legacy local table names migrate without data loss. |
| REQ-A3-003 | Non-768 routing | A 1024d registry embedder routes to `vectors_1024` while retaining `vectors_768`. |
| REQ-A3-004 | Cross-dim refusal | Search still raises 023A1 `HARD_REFUSE` when indexed and active dimensions differ. |
| REQ-A3-005 | Status observability | Project status includes per-dimension vector table row counts. |
| REQ-A3-006 | Migration idempotency | Re-running the migration is safe and does not rename or drop authoritative tables. |
| REQ-A3-007 | Verification | Focused pytest, full pytest, ruff, migration smoke, and strict spec validation pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-A3-001**: Existing 768d indexes migrate to `vectors_768`.
- **SC-A3-002**: A model swap to a supported non-768d embedder does not delete the 768d table.
- **SC-A3-003**: Search cannot accidentally read a table from a different dimension.
- **SC-A3-004**: Daemon status reports sizes for all `vectors_<dim>` tables present in the project database.
- **SC-A3-005**: Findings HIGH-004-A, HIGH-019-B, and MED-019-A are closed or correctly resolved by prior packet ordering.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 023A1 metadata | `embedder_dim` must exist before routing. | Verified `IndexMetadata.embedder_dim` in 023A1 summary and code. |
| Dependency | 023A2 registry | Active model dimension must be available. | Use registry-backed runtime metadata. |
| Dependency | 023F upstream spike | Avoid per-side dimension knobs. | Use model-wide table selection only. |
| Risk | Legacy local table name differs from packet wording | Local fork used `code_chunks_vec`. | Migration accepts both `vectors` and `code_chunks_vec`. |
| Risk | SQL identifier injection through table names | Dynamic table names enter SQL. | Table names are generated or validated with `_quote_identifier`. |
| Risk | FTS mixing active dimensions | Hybrid search uses shared FTS table. | Project update syncs FTS from the active vector table after indexing. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-A3-R01**: Migration must be idempotent and transaction-bound.
- **NFR-A3-R02**: Protocol additions must be additive for existing clients.
- **NFR-A3-P01**: Table selection adds no vector scan before search.
- **NFR-A3-S01**: Dynamic table SQL must use controlled identifiers only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `vectors` exists and `vectors_768` does not: rename `vectors` to `vectors_768`.
- `code_chunks_vec` exists and `vectors_768` does not: rename `code_chunks_vec` to `vectors_768`.
- Both legacy and `vectors_768` exist: prefer `vectors_768` and warn.
- Search with active 1024d metadata against a 768d index: hard refusal before vector lookup.
- Status on a database with several per-dim tables: report all table sizes, while totals use the active table.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | Touches indexer, query, daemon, storage, protocol, and tests. |
| Risk | 25/25 | Wrong routing can silently corrupt retrieval correctness. |
| Architecture | 20/20 | Changes storage topology while preserving metadata refusal semantics. |
| **Total** | **68/70** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Active table mismatch | Low | Search correctness failure | Central table helper and focused query tests. |
| Legacy migration conflict | Low | Operator confusion | Prefer `vectors_768` when present and warn on legacy leftovers. |
| Unsupported dimension | Medium | Indexing cannot proceed | Refuse dimensions outside the supported table set. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-A3-001**: As an operator, I want a 1024d embedder to build its own table without deleting my 768d rollback table.
- **US-A3-002**: As a maintainer, I want search to refuse when the active dimension does not match index metadata.
- **US-A3-003**: As a daemon user, I want status to show which per-dim tables exist and how many chunks each contains.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

No unresolved design questions remain. The only operational caveat is that FTS remains one active-table mirror, not a per-dimension FTS table family; cross-dim vector search is still blocked by metadata refusal.
<!-- ANCHOR:questions -->
Question anchor mirror: all packet questions resolved.
<!-- /ANCHOR:questions -->
<!-- /ANCHOR:open-questions -->

---

<!-- ANCHOR:related-documents -->
## RELATED DOCUMENTS

| Document | Relationship |
|----------|--------------|
| `../023A1-metadata-fingerprint/implementation-summary.md` | Defines `IndexMetadata.embedder_dim` and hard refusal behavior. |
| `../023A2-prompt-license-registry/implementation-summary.md` | Defines registry accessors used for dimension lookup. |
| `../023F-upstream-rebase-spike/research/cross-packet-impact.md` | Rejects per-side dimension knobs. |
<!-- /ANCHOR:related-documents -->
