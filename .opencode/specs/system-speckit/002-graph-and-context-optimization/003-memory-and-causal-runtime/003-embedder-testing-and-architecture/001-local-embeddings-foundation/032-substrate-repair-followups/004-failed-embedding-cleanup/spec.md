---
title: "004 failed-embedding-cleanup"
description: "One-shot repair script for historical memory_index rows stuck at embedding_status='failed'. The script exists, but live cleanup is blocked by the local llama-cpp runtime."
trigger_phrases:
  - "repair failed embeddings script"
  - "memory_index embedding_status failed cleanup"
  - "one-shot embedding retry"
importance_tier: "normal"
status: "blocked"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup"
    last_updated_at: "2026-05-14T11:12:59Z"
    last_updated_by: "cli-codex"
    recent_action: "Script implemented; runtime blocked"
    next_safe_action: "Repair llama-cpp runtime, then rerun live script"
    blockers:
      - "llama-cpp provider cannot generate embeddings in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000004"
      session_id: "cli-codex-004-failed-embedding-cleanup"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "Should the llama-cpp runtime be fixed with CMake install, prebuilt CPU binary, or Metal access repair?"
    answered_questions:
      - "The active DB path is the llama-cpp q8 profile database."
---
# 004 failed-embedding-cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Feature** | Failed embedding cleanup |
| **Priority** | P0 |
| **Status** | Blocked |
| **Created** | 2026-05-14 |
| **Branch** | `004-failed-embedding-cleanup` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The active Memory MCP database has historical rows in `memory_index` with `embedding_status='failed'`. The original expectation was roughly 24 rows, but the active local database currently reports 214 failed rows.

### Purpose
Provide a one-shot repair script that regenerates embeddings for failed rows, writes vectors into the active vector table, and marks rows `success` only after the vector write succeeds.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create a direct Node.js repair script under `mcp_server/scripts`.
- Support `--dry-run`, `--batch-size N`, and `--db-path PATH`.
- Resolve the active profile DB by default.
- Re-embed failed rows through the current shared embedding provider.
- Write vectors to `vec_memories` and update `memory_index.embedding_status`.
- Document dry-run, live-run, and blocked verification evidence.

### Out of Scope
- Adding a new MCP tool.
- Deleting rows from `memory_index`.
- Bulk SQL delete operations.
- Modifying shared embedding source or `retry-manager.ts`.
- Fixing the full llama-cpp runtime dependency chain.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs` | Create | One-shot repair script |
| `plan.md` | Create | Design and invocation plan |
| `tasks.md` | Create | Task and acceptance tracking |
| `checklist.md` | Create | PASS/FAIL evidence |
| `implementation-summary.md` | Create | Outcome summary and logs |
| `graph-metadata.json` | Modify | Mark packet blocked instead of planned |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create executable repair script | File exists with shebang and executable bit |
| REQ-002 | Dry-run mode must not write | Dry-run reports failed rows and `processed=0` |
| REQ-003 | Live mode must repair failed rows | Failed count drops after live run |
| REQ-004 | Avoid unsafe deletes | Script never deletes from `memory_index` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Log per-row outcomes | Logs include row id, file_path, and message |
| REQ-006 | Remain safe with concurrent daemon | Uses short transactions and `busy_timeout` |
| REQ-007 | Document final outcome | Level 2 docs include counts and blocker evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Script exists, has shebang, and is executable.
- **SC-002**: Dry-run preview reports the active failed count without writes.
- **SC-003**: Live run drops `embedding_status='failed'` from 214 toward 0.
- **SC-004**: Idempotent live rerun shows 0 processed after repair.
- **SC-005**: Errors include row id, file path, and error message.
- **SC-006**: Documentation includes starting count, ending count, per-row error pattern, and elapsed runtime evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | llama-cpp embedding runtime | No vectors can be generated | Fix Metal access or install CPU backend dependencies, then rerun |
| Risk | Wrong vector table name | Script writes nowhere useful | Verified live schema uses `vec_memories` |
| Risk | Long SQLite write lock | Memory daemon contention | One row per short transaction |
| Risk | Marking success before vector write | Broken search state | Update status only after vector insert |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the next repair step install CMake locally, provide a prebuilt CPU backend, or repair Metal context creation?
- Should a future revision fail fast when the provider cannot initialize, instead of logging the same provider error for every row?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Process rows in batches with a 1s pause between batches.
- **NFR-P02**: Keep writes scoped to one row per transaction.

### Security
- **NFR-S01**: Do not delete from `memory_index`.
- **NFR-S02**: Do not modify shared provider code or retry manager code.

### Reliability
- **NFR-R01**: Re-check row status inside the write transaction.
- **NFR-R02**: Leave failed rows as `failed` when embedding generation fails.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `content_text`: fall back to reading `file_path`.
- Missing file fallback: log row-level error and leave status unchanged.
- Dimension mismatch: log error and leave status unchanged.

### Failure Modes
- Provider returns null: log row-level error and leave status unchanged.
- SQLite vector extension unavailable: fail before writes.
- Concurrent repair: skip row if status changed before write.

### State Transitions
- `failed` -> `success`: allowed only after vector insert.
- `failed` -> `failed`: default when provider or row content fails.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One script plus packet docs |
| Risk | 16/25 | Direct DB writes require careful ordering |
| Research | 12/20 | Existing schema/provider path had to be verified |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
