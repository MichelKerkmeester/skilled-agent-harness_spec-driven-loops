---
title: "Feature Specification: 001 Exemplars Schema"
description: "Level 2 child packet for Coco exemplar schema and SQLite migration planning."
trigger_phrases:
  - "027 011 001 exemplars schema"
  - "coco exemplars schema"
  - "examples_schema.py"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/008-coco-memory-context-extras/001-exemplars-schema"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Plan implementation for examples_schema.py"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-2026-05-12-027-011-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 001 Exemplars Schema

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-spec-kit/028-code-graph-and-cocoindex/008-coco-memory-context-extras` |
| **Track** | A: Coco Exemplars |
| **Depends On** | `system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CocoIndex has no storage contract for user-validated query examples. The existing code-chunk vector table is shaped for source chunks, so reusing it for examples would blur history, ranking, and maintenance responsibilities.

### Purpose
Define the exemplar schema and migration plan for `cocoindex_code/exemplars/examples_schema.py`, keeping exemplar rows separate from `code_chunks_vec` and ready for later retrieval and maintenance phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `examples_schema.py` module under `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/`.
- SQLite or vec0 migration for `coco_query_examples_vec`.
- Identity fields: query hash, result file, source realpath, content hash, path class, line range, validation source, validation timestamp, expiry timestamp.
- Privacy rule that free-form comments never enter exemplar rows.

### Out of Scope
- Query-time exemplar retrieval.
- TTL cleanup, cap enforcement, and reconciliation jobs.
- TypeScript `ccc_feedback` schema changes outside this child.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/examples_schema.py` | Create | Schema definitions and migration helpers |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/exemplars/__init__.py` | Create | Package surface for exemplar modules if absent |
| `.opencode/skills/mcp-coco-index/tests/test_examples_schema.py` | Create | Schema and privacy tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create an exemplar table separate from `code_chunks_vec` | Schema test proves code-chunk reindex paths do not drop exemplar history |
| REQ-002 | Store only identity metadata and query embedding fields | Schema review confirms no comment or free-form prose column exists |
| REQ-003 | Include expiry and validation timestamps | Migration exposes `validated_at_ms` and `expires_at_ms` fields |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Define stable query/result identity fields | Tests cover query hash, file path, line range, path class, and content hash |
| REQ-005 | Make migration idempotent | Running migration twice is a no-op with the same schema |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `examples_schema.py` defines a separate exemplar storage contract.
- **SC-002**: Schema tests pass for first-run and repeat-run migration paths.
- **SC-003**: Privacy test confirms no free-form feedback comment can be stored in exemplar rows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 complete CocoIndex fork | Exemplar schema path may not exist yet | Keep this child blocked until Phase 005 lands |
| Risk | vec0 schema mismatch | Migration fails at runtime | Mirror existing vector dimension constants and cover with tests |
| Risk | Feedback comments leak into exemplar rows | Privacy violation | Schema omits comment fields and test greps row shape |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Schema migration completes in under one second on an empty local database.
- **NFR-P02**: Table creation does not require reading or rewriting existing code chunk rows.

### Security
- **NFR-S01**: Exemplar rows store only identity metadata, embeddings, and timestamps.
- **NFR-S02**: Local-only storage remains governed by the existing CocoIndex database boundary.

### Reliability
- **NFR-R01**: Migration is idempotent.
- **NFR-R02**: Missing vec0 support fails with a clear diagnostic and no partial table state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty database: migration creates all required structures.
- Existing database: migration adds exemplar structures without changing code chunk rows.
- Invalid embedding dimension: migration fails before writing table metadata.

### Error Scenarios
- SQLite open failure: caller receives the original database error.
- vec0 unavailable: migration reports unsupported vector extension.
- Duplicate migration call: second call leaves schema unchanged.

### State Transitions
- Pre-feature state: no exemplar table exists.
- Post-migration state: exemplar table exists and remains empty until capture work lands.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One Python schema module plus tests |
| Risk | 13/25 | New local table, privacy guard, vec0 dependency |
| Research | 8/20 | Requires checking existing CocoIndex schema constants |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for scaffolding. Implementation should confirm the final embedding dimension source from the Phase 005 fork.
<!-- /ANCHOR:questions -->
