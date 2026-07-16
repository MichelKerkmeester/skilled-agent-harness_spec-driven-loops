---
title: "Implementation Plan: 023C Retrieval Observability"
description: "Implement additive retrieval diagnostics and index fingerprints across the CocoIndex query, daemon, MCP, CLI, and test surfaces."
trigger_phrases:
  - "retrieval observability"
  - "diagnostic counters"
  - "fingerprint status"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/002-retrieval-observability"
    last_updated_at: "2026-05-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented packet plan"
    next_safe_action: "Run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py"
    session_dedup:
      fingerprint: "sha256:023c000000000000000000000000000000000000000000000000000000000001"
      session_id: "023-deep-research-arc-blind-spots/002-retrieval-observability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 023C Retrieval Observability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11 |
| **Framework** | Typer CLI, FastMCP, msgspec IPC |
| **Storage** | SQLite index plus project-local `.cocoindex_code/index_meta.json` |
| **Testing** | pytest, pytest-cov, ruff |

### Overview
The implementation adds a `RetrievalDiagnostics` carrier for per-query counters and an `IndexFingerprint` carrier for effective runtime/index configuration. Query code records counters at natural pipeline boundaries; daemon/client response structs move the data outward; indexing/status code writes and compares hashes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] All acceptance criteria met.
- [x] Tests passing.
- [x] Docs updated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive telemetry DTOs with existing query, protocol, daemon, MCP, and CLI surfaces.

### Key Components
- **RetrievalDiagnostics**: records per-query stage counts and reranker fallback state.
- **IndexFingerprint**: captures effective embedder, prompt, reranker, chunking, corpus, RRF, and boost configuration.
- **ProjectRegistry**: writes metadata after index completion, compares live vs indexed hashes before search, and returns fingerprint status.

### Data Flow
`query_codebase()` builds diagnostics during retrieval, returns them on `QueryResults`, and daemon maps them to `SearchResponse.diagnostics`. Index completion writes `index_meta.json`; status recomputes live fingerprint and adds indexed hash/warning when a mismatch exists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `observability.py` | Timing and IPC helpers | Added diagnostic and fingerprint helpers | `tests/test_observability.py`, `tests/test_fingerprint.py` |
| `protocol.py` | msgspec IPC response shapes | Added additive diagnostics/fingerprint structs | Full pytest suite |
| `query.py` | Retrieval pipeline | Records vector, FTS, fusion, dedup, boost, rerank counters | `test_per_stage_counter_recorded`, `test_boost_flip_count` |
| `reranker.py`, `rerankers_jina_v3.py` | Optional rerank paths | Records fallback reasons | `test_reranker_fallback_recorded` |
| `daemon.py`, `server.py`, `cli.py` | Operator/API surfaces | Returns diagnostics and status fingerprints | Full pytest suite and ruff |

Required inventories completed with `rg -n "ProjectStatusResponse|SearchResponse|diagnostics|dedupedAliases|index_meta|metadata|status\\("` and `rg -n "rerank.*license|license.*rerank|jina-reranker|bge-reranker|RERANK"`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read listed source files.
- [x] Locate existing query, protocol, daemon, MCP, CLI, and test boundaries.
- [x] Confirm spec packet path.

### Phase 2: Core Implementation
- [x] Add diagnostics and fingerprint helpers.
- [x] Instrument query/reranker paths.
- [x] Extend daemon, MCP, protocol, and CLI surfaces.
- [x] Persist index metadata and compare runtime hash.

### Phase 3: Verification
- [x] Add observability and fingerprint tests.
- [x] Add pytest-cov smoke test.
- [x] Run pytest, ruff, coverage report, and strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Diagnostic counters, fallback state, boost flips | pytest |
| Unit | Fingerprint metadata, mismatch warning, hash canonicalization | pytest |
| Tooling | pytest-cov option availability | pytest subprocess |
| Regression | Existing CocoIndex MCP server tests | pytest |
| Static | Python lint and import hygiene | ruff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| pytest-cov | Dev dependency | Installed in `.venv` | Coverage verification fails |
| msgspec | Runtime dependency | Existing | IPC payload defaults must remain additive |
| sqlite-vec | Runtime dependency | Existing | Status count reads use existing vector DB path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Search or status serialization fails in daemon/MCP clients.
- **Procedure**: Revert additive diagnostic/fingerprint fields and helper calls in the changed files. Delete generated `index_meta.json` files if needed; indexes continue to work without the metadata file.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Core Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Read retrieval/status surfaces |
| Core Implementation | Medium | Add DTOs and response plumbing |
| Verification | Medium | Add tests, run suite, write docs |
| **Total** | | **Single-session implementation** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Additive response fields only.
- [x] Existing tests pass.
- [x] Coverage command produces report.

### Rollback Procedure
1. Revert diagnostics/fingerprint code changes.
2. Re-run pytest and ruff.
3. Remove project-local `index_meta.json` files if operators want clean status output.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete optional metadata files; SQLite index schema is unchanged.
<!-- /ANCHOR:enhanced-rollback -->
