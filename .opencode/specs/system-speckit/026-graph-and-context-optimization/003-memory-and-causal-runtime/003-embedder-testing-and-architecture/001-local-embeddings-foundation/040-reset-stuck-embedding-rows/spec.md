---
title: "Reset Stuck Embedding Rows"
description: "Reset memory_index rows stuck on the old synthetic null embedding failure so the retry-manager can re-process them under the 038 error propagation and 039 token-aware truncation fixes."
trigger_phrases:
  - "040 reset stuck embedding rows"
  - "Embedding generation returned null reset"
  - "retry-manager stuck embedding rows"
  - "038 039 embedding retry reset"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows"
    last_updated_at: "2026-05-14T15:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-040"
    recent_action: "Reset eligible stuck embedding rows"
    next_safe_action: "Let the retry-manager re-process pending rows"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/spec.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-040-reset-stuck-embedding-rows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Only rows whose file_path still exists were reset."
      - "Rows pointing at deleted files were treated as orphans and left untouched."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reset Stuck Embedding Rows

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Rows in `memory_index` were stuck with `failure_reason='Embedding generation returned null'` after the old embedding path swallowed provider failures. Packets 038 and 039 fixed the pipeline, but rows with high retry counts and `embedding_status='failed'` or `retry` would not all re-enter processing without a bounded reset.

### Purpose

Reset eligible stuck rows to pending state so the existing retry-manager can re-process them under the corrected 038 and 039 embedding pipeline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Back up the llama-cpp memory index database before mutation.
- Identify rows whose failure reason contains "Embedding generation returned null" and whose status is `failed`, `retry`, or `pending`.
- Reset only rows whose `file_path` still exists on disk.
- Leave orphan rows untouched and report their count.
- Create this Level 1 packet with the reset evidence.

### Out of Scope

- `system-code-graph` skill work, including `.opencode/skills/system-code-graph/`.
- 014/008/038/039 packets, including the shipped 038 and 039 sibling packet folders.
- The orchestrator-owned shared/dist patch at `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/`.
- Live MCP child processes such as `spec-kit-memory-launcher`, `system-code-graph-launcher`, and `skill-advisor-launcher`.
- The parallel 041 packet folder owned by codex-2.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` | Modify | Reset eligible stuck rows to pending with retry_count 0 and cleared failure metadata. |
| `.opencode/skills/system-spec-kit/mcp_server/database/.pre-040-reset-20260514T151344Z.bak` | Create | Pre-flight database backup. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/` | Create | Track scope, plan, tasks, results, and metadata for this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A database backup exists before mutation | Backup path is recorded in `implementation-summary.md`. |
| REQ-002 | Eligible live-file rows are reset | `ROWS_RESET=789` and reset rows have `embedding_status='pending'`, `retry_count=0`, `failure_reason=NULL`, and `last_retry_at=NULL`. |
| REQ-003 | Orphan rows are not reset | `ROWS_SKIPPED_AS_ORPHAN=10` and post counts retain only those skipped retry rows. |
| REQ-004 | Packet docs validate | Strict spec validation exits 0 for this folder. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Commit scope stays narrow | Only the `040-reset-stuck-embedding-rows` packet folder is staged for commit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_index` rows with live files and the old null failure are reset for retry-manager processing.
- **SC-002**: Rows whose files no longer exist stay untouched as orphan evidence.
- **SC-003**: The packet records pre-counts, post-counts, rows reset, rows skipped, and the backup path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Live database mutation | Incorrect predicate could reset unrelated rows. | Filter by exact old failure reason fragment and allowed statuses, then require file existence before update. |
| Risk | Orphan rows remain in retry status | Post-counts still show retry rows. | Treat them as intentionally skipped; this packet does not own orphan cleanup. |
| Dependency | 038 and 039 shipped behavior | Reset rows rely on the corrected retry path. | Run the reset only after those packets are present in the working tree. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
