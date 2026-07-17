---
title: "Implementation Plan: 004 failed-embedding-cleanup"
description: "One-shot Node repair script for historical memory_index rows stuck at embedding_status='failed'. The plan mirrors the existing vector mutation path while keeping transactions short for SQLite WAL safety."
trigger_phrases:
  - "repair failed embeddings plan"
  - "failed embedding cleanup implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup"
    last_updated_at: "2026-05-14T11:12:59Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented repair script; runtime blocked"
    next_safe_action: "Install/repair llama-cpp CPU or Metal runtime, then rerun script"
    blockers:
      - "llama-cpp provider cannot generate embeddings in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111114"
      session_id: "cli-codex-004-failed-embedding-cleanup"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "Should the runtime fix be handled by installing CMake or by repairing Metal access?"
    answered_questions:
      - "Active DB path resolved to the llama-cpp q8 profile database."
---
# Implementation Plan: 004 failed-embedding-cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM |
| **Framework** | system-spec-kit Memory MCP support script |
| **Storage** | SQLite via `better-sqlite3`, vector table `vec_memories` |
| **Testing** | dry-run, live invocation, direct DB status-count verification |

### Overview
Create `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs` as a direct, idempotent repair script. It selects rows from `memory_index` where `embedding_status='failed'`, embeds `content_text` through the active shared embedding provider, writes the vector into `vec_memories`, and flips the row to `success` only after the vector write succeeds.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Active DB path identified through the profile resolver.
- [x] Existing vector write pattern confirmed from `vector-index-mutations.ts`.

### Definition of Done
- [x] Script exists and is executable.
- [x] Dry-run reports failed rows without writes.
- [ ] Live run repairs failed rows.
- [ ] Idempotent rerun shows 0 processed.
- [x] Blocker is documented with provider/runtime evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone maintenance script using the same storage primitives as the MCP vector index.

### Key Components
- **Argument parser**: handles `--dry-run`, `--batch-size N`, and `--db-path PATH`.
- **Profile-aware DB resolver**: uses `resolveActiveProfileDbPath()` with an optional override.
- **Embedding repair loop**: embeds normalized `content_text`, with file-path fallback when content is empty.
- **Vector writer**: deletes stale `vec_memories` row, inserts the new vector buffer, then updates `memory_index`.

### Data Flow
`memory_index failed row` -> `normalizeContentForEmbedding()` -> active embedding provider -> `vec_memories(rowid, embedding)` -> `memory_index.embedding_status='success'`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mcp_server/scripts/repair-failed-embeddings.mjs` | New one-shot repair entrypoint | Created | `node mcp_server/scripts/repair-failed-embeddings.mjs --dry-run` |
| `memory_index` | Source of failed rows and status update target | Runtime write only | Direct DB status-count query |
| `vec_memories` | Runtime vector storage table | Runtime write only | Script uses `sqlite-vec` and same rowid contract as mutations |
| shared embeddings provider | Current embedding runtime | Used, not modified | Live run reached provider and failed at runtime setup |

Required inventories:
- Same-class producers: `rg -n "embedding_status = 'success'|INSERT INTO vec_memories|DELETE FROM vec_memories" .opencode/skills/system-spec-kit/mcp_server/lib/search`.
- Consumers of changed script: none; script is directly invoked from `mcp_server/scripts`.
- Matrix axes: dry-run/live, auto DB path/override DB path, content_text/file fallback, provider success/provider failure.
- Algorithm invariant: no row is marked `success` unless the vector write in `vec_memories` succeeds in the same short transaction.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet `spec.md`.
- [x] Read vector write path, embedding provider entrypoint, retry manager, and launcher metadata.
- [x] Confirm active profile DB path.

### Phase 2: Core Implementation
- [x] Add one-shot Node script.
- [x] Add dry-run preview.
- [x] Add WAL-friendly short transaction writes.
- [x] Add provider runtime guard for headless macOS sessions: default `NODE_LLAMA_CPP_GPU=false`.

### Phase 3: Verification
- [x] Run dry-run.
- [x] Run live mode.
- [ ] Confirm failed count drops toward 0.
- [ ] Confirm live rerun shows 0 processed.
- [x] Document runtime blocker.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Script path, shebang, executable bit | `ls`, direct read |
| Dry-run | DB resolution and failed-row preview | `node mcp_server/scripts/repair-failed-embeddings.mjs --dry-run` |
| Live | Provider embedding plus DB write path | `node mcp_server/scripts/repair-failed-embeddings.mjs` |
| Health | Ending failed count | Direct SQLite status-count query; MCP memory health tool was not exposed in this Codex session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `better-sqlite3` | Internal package dependency | Green | Script cannot open DB |
| `sqlite-vec` | Internal package dependency | Green | Script cannot write vector table |
| shared embeddings provider | Internal runtime | Red | No vectors can be generated |
| `node-llama-cpp` CPU or Metal backend | Optional runtime dependency | Red | Live run returns null embeddings for every row |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Script writes incorrect vectors or marks rows success incorrectly.
- **Procedure**: Remove `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs`; restore the SQLite DB from the latest memory checkpoint or filesystem backup if live writes occurred. No successful writes occurred during this run.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Core Implementation) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation, llama-cpp runtime | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30 minutes |
| Core Implementation | Medium | 1 hour |
| Verification | High | Blocked by runtime dependency |
| **Total** | | **Blocked after implementation** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Dry-run executed before live mode.
- [x] DB path logged before live mode.
- [x] Script avoids `memory_index` deletes.

### Rollback Steps
1. Remove `repair-failed-embeddings.mjs` if the script should not remain available.
2. Restore the SQLite DB from backup if a future successful run writes incorrect vectors.
3. Re-run dry-run to confirm failed rows before any second live attempt.

### Data Reversal
- **Has data migrations?** No schema migration.
- **Reversal procedure**: restore DB backup if live vector writes need to be undone.
<!-- /ANCHOR:enhanced-rollback -->
