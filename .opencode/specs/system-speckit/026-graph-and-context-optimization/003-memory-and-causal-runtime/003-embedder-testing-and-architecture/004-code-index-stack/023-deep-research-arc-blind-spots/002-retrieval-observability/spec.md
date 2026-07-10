---
title: "Feature Specification: 023C Retrieval Observability"
description: "Add retrieval-stage diagnostics and effective configuration fingerprints to mcp-coco-index so operators can see candidate counts, reranker fallbacks, and index/runtime drift."
trigger_phrases:
  - "retrieval observability"
  - "cocoindex diagnostics"
  - "index fingerprint"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented retrieval diagnostics and fingerprints"
    next_safe_action: "Review verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py"
    session_dedup:
      fingerprint: "sha256:023c000000000000000000000000000000000000000000000000000000000000"
      session_id: "023-deep-research-arc-blind-spots/002-retrieval-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-bound to phase folder option E"
---
# Feature Specification: 023C Retrieval Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
mcp-coco-index had timing logs and result metadata, but it did not expose enough retrieval-stage evidence to explain quality regressions. Operators could not see vector/FTS candidate counts, fusion overlap, reranker fallback reasons, boost-driven reorders, or whether a live daemon was searching with a different embedder/configuration from the indexed corpus.

### Purpose
Expose additive per-query diagnostics and index/runtime fingerprints so retrieval behavior can be audited before 023B calibration and later request-budget work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add per-query diagnostics to search responses and structured logs.
- Add index/runtime fingerprint fields to status responses and `ccc status`.
- Persist `index_meta.json` at index time and warn on runtime mismatch.
- Add unit coverage for diagnostics, fallback tracking, fingerprints, and pytest-cov availability.

### Out of Scope
- Request-budget enforcement and `SearchBudget` logic.
- Embedder or reranker model changes.
- Calibration sweeps and score tuning.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py` | Modify | Add diagnostics and fingerprint helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py` | Modify | Add response payload fields |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Modify | Record retrieval-stage counters |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py` | Modify | Record cross-encoder fallback reasons |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py` | Modify | Record Jina fallback and missing-index reasons |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` | Modify | Surface fingerprints, persist metadata, warn on mismatch |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` | Modify | Mirror diagnostics in MCP search response |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py` | Modify | Provide index-time metadata writer |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` | Modify | Print fingerprint block in `ccc status` |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/` | Modify | Add diagnostics, fingerprint, and coverage-tooling tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Per-query diagnostics are additive and visible in search responses | SearchResponse and MCP SearchResultModel include `diagnostics` |
| REQ-002 | Retrieval stages report the requested counters | Tests assert all nine diagnostic fields are present |
| REQ-003 | Reranker fallbacks are observable | Cross-encoder/Jina paths set fallback used and reason |
| REQ-004 | Status includes effective configuration fingerprint | ProjectStatusResponse and `ccc status` expose fingerprint fields |
| REQ-005 | Index/runtime drift is detectable | Search logs `INDEX_FINGERPRINT_MISMATCH` when stored hash differs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | pytest-cov works in the verify venv | `pytest --cov=cocoindex_code --co tests/` returns rc=0 |
| REQ-007 | Existing response shapes stay backward compatible | Fields are additive with defaults |
| REQ-008 | Packet docs capture evidence | implementation-summary.md lists files, fields, findings, and verification |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tests/test_observability.py` verifies counters, overlap, fallback, and boost flip behavior.
- **SC-002**: `tests/test_fingerprint.py` verifies metadata persistence, mismatch warning, and stable hash canonicalization.
- **SC-003**: Full MCP server test suite passes at or above the current 172-test floor.
- **SC-004**: Ruff and pytest-cov verification pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Search response schema changes | Client decode could fail if fields are required | Add defaults only; no removals |
| Risk | Fingerprint drift false positives | Operators could see mismatch warnings after env changes | Store current and indexed hashes separately |
| Dependency | pytest-cov in local venv | Coverage command fails without plugin | Installed declared dev dependency into `.venv` and added smoke test |
| Risk | Parallel 023E changes in CLI/server/query | Merge conflict or scope drift | Left budget logic intact and only added observability fields |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Diagnostics must not add model calls or extra retrieval passes.
- **NFR-P02**: Fingerprint hashing must use small in-memory config payloads only.

### Security
- **NFR-S01**: Diagnostics must not expose code content beyond existing search results.
- **NFR-S02**: Fingerprints must avoid secrets and store only effective model/config names.

### Reliability
- **NFR-R01**: Missing `index_meta.json` must not block search.
- **NFR-R02**: Fingerprint mismatch must warn without preventing operator inspection.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty FTS lane: `fts_candidates_count=0` and `overlap_count=0`.
- Vector-only lane: diagnostic fields still exist with default values.
- Missing Jina indices: fallback reason records `missing_indices`.

### Error Scenarios
- Reranker load failure: fallback reason records `model_load_failed`.
- Reranker model error: fallback reason records `model_error`.
- Missing metadata file: status still returns current fingerprint.

### State Transitions
- Index completes: metadata writer stores current hash.
- Runtime config changes: search logs `INDEX_FINGERPRINT_MISMATCH`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Query, daemon, protocol, MCP, CLI, tests |
| Risk | 12/25 | Additive public fields with serialization impact |
| Research | 8/20 | Existing retrieval and status paths had to be mapped |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
