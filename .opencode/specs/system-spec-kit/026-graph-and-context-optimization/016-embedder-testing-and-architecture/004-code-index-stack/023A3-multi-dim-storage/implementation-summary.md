---
title: "Implementation Summary: 023A3 Multi-Dim Storage"
description: "mcp-coco-index now routes vector storage through per-dimension tables with idempotent legacy migration and status observability."
trigger_phrases:
  - "023A3 complete"
  - "multi-dim storage complete"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023a3-multi-dim-storage"
    last_updated_at: "2026-05-19T23:30:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented optional per-dim storage and completed code verification"
    next_safe_action: "Commit only if explicitly requested"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/schema.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/migrations/001_per_dim_tables.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_per_dim_storage.py"
    session_dedup:
      fingerprint: "sha256:023a300000000000000000000000000000000000000000000000000000000006"
      session_id: "023a3-multi-dim-storage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 023A3 Multi-Dim Storage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023A3-multi-dim-storage` |
| **Completed** | 2026-05-19 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

023A3 adds optional per-dimension vector table storage. The default path resolves to `vectors_768`; supported non-default dimensions resolve to `vectors_1024`, `vectors_1536`, and `vectors_2048`. Existing legacy vector tables migrate to `vectors_768` idempotently.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cocoindex_code/schema.py` | Modified | Added `_table_name_for_dim`, supported dimension list, table detection, row counts, and identifier quoting. |
| `cocoindex_code/migrations/__init__.py` | Created | Re-exports the numeric migration module through a normal import surface. |
| `cocoindex_code/migrations/001_per_dim_tables.py` | Created | Idempotent rename from `vectors` or `code_chunks_vec` to `vectors_768`. |
| `cocoindex_code/shared.py` | Modified | Added `VECTOR_TABLE_NAME` context key. |
| `cocoindex_code/indexer.py` | Modified | Mounts active per-dim vector table instead of hard-coded `code_chunks_vec`. |
| `cocoindex_code/query.py` | Modified | Resolves active vector table for KNN, full-scan, and hybrid fetch paths. |
| `cocoindex_code/daemon.py` | Modified | Runs migration on project access, computes active table, counts per-dim tables, and exposes status sizes. |
| `cocoindex_code/project.py` | Modified | Provides active table context and syncs FTS from that active table. |
| `cocoindex_code/fts_index.py` | Modified | Allows FTS sync from a caller-provided source table. |
| `cocoindex_code/protocol.py` | Modified | Adds additive `per_dim_table_sizes` to `ProjectStatusResponse`. |
| `tests/test_per_dim_storage.py` | Created | Covers default routing, migration, swaps, hard refusal, status, idempotency, and table isolation. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation follows 023F by keeping dimensions model-wide. It does not add `indexing_params.dimensions`, `query_params.dimensions`, or separate document/query dimension overrides.

The migration story is conservative: rename only when `vectors_768` is absent, retain old tables if the authoritative per-dim table already exists, and never delete rollback data. Query still relies on 023A1 metadata compatibility, so switching from a 768d embedder to a 1024d embedder hard-refuses search until the 1024d index exists with matching metadata.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Per-dim tables over a `dim` column | sqlite-vec tables have fixed vector dimensions. |
| Support both `vectors` and `code_chunks_vec` legacy names | Packet wording and local fork reality differed. |
| Keep FTS as active-table mirror | Minimal change preserves hybrid search behavior while vector metadata blocks cross-dim misuse. |
| Add status table sizes | Operators can see retained rollback tables and newly indexed dimensions. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `.venv/bin/python -m pytest tests/test_per_dim_storage.py tests/test_fts_index.py tests/test_search_budget.py tests/test_prompt_policy_contract.py -q` | PASS, `28 passed in 3.69s` |
| `.venv/bin/ruff check cocoindex_code tests/test_per_dim_storage.py` | PASS, `All checks passed!` |
| `.venv/bin/python -m pytest tests/ -q` | PASS, `223 passed in 17.92s` |
| `.venv/bin/ruff check` | PASS, `All checks passed!` |
| Fresh in-memory migration smoke | PASS, `migration_smoke=passed` |
| `validate.sh --strict` | PASS, `RESULT: PASSED` |

Findings closed:

| Finding | Status | Evidence |
|---------|--------|----------|
| HIGH FINDING-004-A | Closed | Non-768d registry dims now route to their own vector tables instead of requiring destructive reset. |
| HIGH FINDING-019-B | Closed | A3 is isolated after A1 metadata, A2 registry, and 023F upstream spike. |
| MED FINDING-019-A | Closed by sequencing | 023E request-budget clamps shipped first; A3 keeps architecture scope narrow. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. FTS remains a single active-table mirror, not a per-dim FTS family.
2. Unsupported dimensions outside 768, 1024, 1536, and 2048 are refused by table-name routing.
3. No git commit was created per user constraint.

Sentinel:

```text
PACKET_023A3_COMPLETE pytest=223 ruff=clean strict_validate=PASSED findings_closed=3
SPAWN_AGENT_USED=no
AGENT_RECEIVED=cli-codex-gpt-5.5-high-fast
```
<!-- /ANCHOR:limitations -->
