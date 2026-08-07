---
title: "Implementation Plan: Reset Stuck Embedding Rows"
description: "Plan for backing up the llama-cpp memory index database, resetting eligible stuck rows, skipping orphan rows, and documenting the reset evidence."
trigger_phrases:
  - "040 reset stuck embedding rows plan"
  - "retry-manager pending reset plan"
  - "Embedding generation returned null recovery plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows"
    last_updated_at: "2026-05-14T15:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-040"
    recent_action: "Planned and executed stuck-row reset"
    next_safe_action: "Let retry-manager process reset rows in normal batches"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-040-reset-stuck-embedding-rows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reset Stuck Embedding Rows

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, better-sqlite3, sqlite-vec |
| **Framework** | system-spec-kit memory MCP storage |
| **Storage** | SQLite `memory_index` in the llama-cpp context index database |
| **Testing** | Post-count verification and strict spec validation |

### Overview

The reset uses one Node script against the live context-index database. It loads `better-sqlite3` and `sqlite-vec`, selects only rows carrying the old "Embedding generation returned null" failure reason, filters out missing `file_path` values, and updates the surviving ids in a transaction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 was pre-answered for this exact `040-reset-stuck-embedding-rows` folder.
- [x] Pre-check confirmed no existing `040-` folder was present.
- [x] Database file and required Node modules were present.
- [x] Worktree was checked so unrelated dirty files could be left unstaged.

### Definition of Done

- [x] Database backup exists.
- [x] Eligible live-file rows were reset to pending.
- [x] Orphan rows were skipped.
- [x] Pre-counts and post-counts were recorded.
- [x] Packet docs were written at Level 1.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Bounded data repair with a pre-flight copy and a single SQLite transaction.

### Key Components

- **Selector**: Finds rows with the old synthetic null failure reason and statuses `failed`, `retry`, or `pending`.
- **File existence gate**: Resolves each `file_path` and skips rows whose file no longer exists.
- **Reset transaction**: Sets eligible rows to `embedding_status='pending'`, `retry_count=0`, `failure_reason=NULL`, `last_retry_at=NULL`, and a fresh `updated_at` timestamp.
- **Evidence capture**: Records reset counts, skipped orphan counts, backup path, and before/after status counts.

### Data Flow

The script reads candidates from `memory_index`, partitions them into live-file and orphan groups, runs chunked `UPDATE ... WHERE id IN (...)` statements in one transaction for the live-file ids, then re-reads status counts for the same stuck-row predicate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory_index` stuck rows | Holds failed retry state from the old embedding pipeline | Reset eligible rows for normal retry-manager processing | `ROWS_RESET=789`; post stuck counts are `failed=0`, `retry=10`, `pending=0`. |
| Deleted spec-file rows | Rows point at missing `028-orphan-code-graph-db-cleanup` files | Leave untouched as orphans | `ROWS_SKIPPED_AS_ORPHAN=10`. |
| `040` packet folder | Durable documentation for the data repair | Create Level 1 docs and metadata | Strict validation. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Run the required pre-check for existing `040-` folders.
- [x] Read sibling 038 and 039 packet structure.
- [x] Verify the target database and Node native modules exist.

### Phase 2: Core Implementation

- [x] Copy the database to `.pre-040-reset-20260514T151344Z.bak`.
- [x] Run a single Node script using `better-sqlite3` and `sqlite-vec`.
- [x] Filter candidate rows by file existence.
- [x] Reset live-file rows in a transaction.

### Phase 3: Verification

- [x] Record `ROWS_RESET=789`.
- [x] Record `ROWS_SKIPPED_AS_ORPHAN=10`.
- [x] Record pre-counts and post-counts.
- [x] Run strict validation after final doc edits.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Data verification | Stuck-row status counts before and after reset | Node script post-count query |
| Safety check | Orphan rows skipped by file existence | `fs.existsSync` gate in reset script |
| Spec validation | `040` packet docs and metadata | PASS, exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 038 embedding error propagation | Internal packet | Green | Retry-manager can now record real provider failures. |
| 039 token-aware chunking | Internal packet | Green | Previously oversized content can now embed successfully. |
| Live retry-manager cadence | Runtime behavior | Green | Reset rows will be processed in normal five-minute batches. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reset is found to have touched the wrong rows.
- **Procedure**: Stop dependent processing, restore the sqlite file from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/.pre-040-reset-20260514T151344Z.bak`, and re-check stuck-row counts before retrying with a narrower predicate.
<!-- /ANCHOR:rollback -->
