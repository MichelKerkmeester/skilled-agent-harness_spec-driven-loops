---
title: "Implementation Plan: 036 Failed Embedding Cleanup Retry"
description: "Plan for running the existing failed-embedding repair script against the healed llama-cpp profile and documenting the DB delta."
trigger_phrases:
  - "036 plan"
  - "failed embedding cleanup plan"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/036-failed-embedding-cleanup-retry"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Executed dry-run and live repair; verified final DB counts"
    next_safe_action: "No 036 action needed"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->
# Implementation Plan: 036 Failed Embedding Cleanup Retry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runtime** | Node.js script under system-spec-kit MCP server |
| **Embedding Provider** | `EMBEDDINGS_PROVIDER=llama-cpp` |
| **Database** | `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite` |
| **Repair Script** | `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs` |
| **Mutation Scope** | Database rows selected by the existing repair script; packet docs only |

### Overview

Packet 036 is a one-shot operational cleanup. The safest path is to record the baseline, dry-run the existing script, run it live without source changes, then verify final status counts and strict-validate the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered with the 036 phase folder.
- [x] User forbade source edits, branch creation, commits, Memory MCP, and sub-agents.
- [x] Repair script exists and selects only `embedding_status='failed'` rows.
- [x] Baseline `memory_index` counts captured.

### Definition of Done

- [x] Dry-run exit code and summary line captured.
- [x] Live-run exit code and summary line captured.
- [x] Final `embedding_status` counts captured.
- [x] `vec_memories` count captured via sqlite-vec-aware Node query.
- [x] Checklist updated with evidence.
- [x] Strict validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

No architecture change. The packet invokes a pre-existing repair command that reads failed rows, normalizes content, generates llama-cpp embeddings, writes vectors to `vec_memories`, and transitions each repaired `memory_index` row to `success`.

### Key Components

- **`repair-failed-embeddings.mjs`**: selects `embedding_status='failed'`; dry-run prints previews; live mode writes vectors and success status.
- **`memory_index`**: source table for status counts and row selection.
- **`vec_memories`**: sqlite-vec virtual table that receives repaired vectors.
- **`better-sqlite3` + `sqlite-vec`**: required to count vector rows reliably outside the plain CLI.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Baseline

- Scaffold Level-2 packet docs.
- Inspect repair script behavior.
- Query baseline `memory_index` status counts.

### Phase 2: Repair Execution

- Run dry-run repair with `EMBEDDINGS_PROVIDER=llama-cpp`.
- Run live repair with `EMBEDDINGS_PROVIDER=llama-cpp`.
- If live run crashes on Metal contention, retry with explicit `NODE_LLAMA_CPP_GPU=false`.

### Phase 3: Verification

- Query final `memory_index` status counts.
- Query `vec_memories` through a sqlite-vec-aware Node command.
- Update docs and checklist with evidence.
- Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Baseline query | `memory_index.embedding_status` grouped counts | `sqlite3` |
| Dry-run | Preview selected failed rows without mutation | `node repair-failed-embeddings.mjs --dry-run` |
| Live run | Execute selected-row repair | `node repair-failed-embeddings.mjs` |
| Final status | `memory_index` grouped counts and vector rows | `sqlite3` + Node sqlite-vec load |
| Documentation validation | Level-2 packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact |
|------------|--------|--------|
| 037 worker fix | Complete per context | Required for meaningful repair if failed rows exist. |
| 038 error propagation | Complete per graph metadata | Helps surface real provider errors during retry. |
| 039 token-aware chunking | Complete per graph metadata | Prevents re-embedding overflow for oversized content. |
| Cached GGUF model | Assumed present | Repair would fail only if failed rows are selected and embedding runtime cannot load. |
| Active llama-cpp DB | Present | Target of baseline/live/final queries. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The script is idempotent and only transitions selected failed rows to success after vector insertion. If it repairs rows incorrectly, restore from the operator's database backup or rerun status-specific maintenance. No source rollback is expected because this packet does not modify source code.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends on | Blocks |
|-------|------------|--------|
| Setup and Baseline | Existing DB and script | Repair execution |
| Repair Execution | Baseline captured | Verification |
| Verification | Dry-run and live run attempted | Final status |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimate | Notes |
|-------|----------|-------|
| Setup and Baseline | 5 min | Mostly documentation and SQL aggregation. |
| Repair Execution | 1-20 min | Near-instant if zero failed rows; longer if embeddings are generated. |
| Verification | 5 min | Counts, checklist, strict validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Scenario | Action |
|----------|--------|
| Dry-run fails | Stop and document fatal output; do not run live. |
| Live run fails before writes | Retry once with explicit `NODE_LLAMA_CPP_GPU=false` if the error is Metal-related. |
| Live run has per-row errors | Document remaining failed count and error lines; mark packet partial. |
| Validation fails | Patch only 036 packet docs until strict validation passes or report failure. |
<!-- /ANCHOR:enhanced-rollback -->
