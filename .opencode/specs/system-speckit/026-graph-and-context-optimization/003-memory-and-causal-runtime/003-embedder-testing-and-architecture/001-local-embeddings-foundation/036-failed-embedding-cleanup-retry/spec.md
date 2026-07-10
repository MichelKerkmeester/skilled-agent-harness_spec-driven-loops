---
title: "036 Failed Embedding Cleanup Retry"
description: "Run the existing failed-embedding repair script against the healed llama-cpp worker and document whether historical failed rows are cleared."
trigger_phrases:
  - "036 failed embedding cleanup retry"
  - "repair failed embeddings"
  - "llama-cpp historical failed embeddings"
  - "memory_index embedding_status failed cleanup"
related_specs:
  - "037-llama-cpp-embedding-worker-deep-dive"
  - "038-embedding-error-propagation"
  - "039-token-aware-chunking"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/036-failed-embedding-cleanup-retry"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Dry-run and live repair completed; zero failed rows selected"
    next_safe_action: "No 036 action needed; pending/retry backlog remains outside this script scope"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000036"
      session_id: "036-failed-embedding-cleanup-retry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: E — Phase folder 036-failed-embedding-cleanup-retry"
      - "Branch: stay on main; do not commit"
      - "Memory MCP and SpawnAgent: forbidden"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.2 -->
# Feature Specification: 036 Failed Embedding Cleanup Retry

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | main (no feature branch; no commit per dispatch) |
| **Parent Spec** | ../spec.md (014-local-embeddings-migration phase parent) |
| **Phase** | 36 |
| **Predecessors** | 037, 038, 039 |
| **Handoff Criteria** | Dry-run and live repair output captured; final DB status documented; strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packets 037, 038, and 039 restored llama-cpp embedding-worker health and error behavior, but the active llama-cpp SQLite profile still contains historical rows that did not embed successfully before the worker was fixed. The repair target is `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`.

The baseline at packet start was:

| embedding_status | count |
|------------------|-------|
| pending | 741 |
| retry | 18 |
| success | 2897 |

No `embedding_status='failed'` rows were present at baseline, which differs from the dispatch context's earlier count. That made this packet a verification cleanup run rather than a guaranteed mutation; dry-run and live repair completed with zero rows selected.

### Purpose

Run `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs` exactly against the healed worker, first in dry-run mode and then live, so the database state and any remaining backlog are documented with command evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Scaffold Level-2 documentation for packet 036.
- Inspect baseline `memory_index.embedding_status` counts.
- Run `repair-failed-embeddings.mjs --dry-run` with `EMBEDDINGS_PROVIDER=llama-cpp`.
- Run `repair-failed-embeddings.mjs` live with `EMBEDDINGS_PROVIDER=llama-cpp`.
- Retry with `NODE_LLAMA_CPP_GPU=false` only if Metal contention crashes the live run.
- Verify final `memory_index.embedding_status` counts and `vec_memories` count.
- Document deltas and strict-validate the 036 packet.

### Out of Scope

- Source-code edits to the repair script or embedding worker.
- Changes to 037, 038, 039, or parent packet docs.
- Memory MCP calls.
- Branch creation, commits, or PR work.
- Repairing `pending` or `retry` rows unless the existing script selects them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/036-failed-embedding-cleanup-retry/` | Create | Level-2 packet documentation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baseline DB status is recorded | `implementation-summary.md > What Was Built` includes pre-run `embedding_status` counts. |
| REQ-002 | Dry-run repair is executed | Dry-run command exit code and summary line are captured without state mutation. |
| REQ-003 | Live repair is executed | Live command exit code and summary line are captured. |
| REQ-004 | Final DB status is verified | Final `embedding_status` counts and vector-row count are documented. |
| REQ-005 | No source code is modified | `git status` shows no source-code edits attributable to this packet. |
| REQ-006 | Strict validation passes | `validate.sh <036-folder> --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the healed llama-cpp worker, **When** the repair script runs in dry-run mode, **Then** it reports the rows it would repair and exits cleanly.
- **SC-002**: **Given** dry-run has completed, **When** the live repair script runs, **Then** it processes all selected failed rows and exits cleanly.
- **SC-003**: **Given** the live run has completed, **When** `memory_index` is queried, **Then** `embedding_status='failed'` is absent or counted as zero.
- **SC-004**: **Given** plain `sqlite3` cannot load `sqlite-vec`, **When** vector rows are counted, **Then** the count is obtained through a Node path that loads `sqlite-vec`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Baseline has no explicit `failed` rows | Medium | Treat live run as an idempotence verification and report `processed=0` honestly. |
| Risk | Plain `sqlite3` cannot query `vec_memories` virtual table | Low | Use Node with `better-sqlite3` and `sqlite-vec` for vector count. |
| Risk | Metal context contention | Medium | Script defaults `NODE_LLAMA_CPP_GPU=false`; dispatch also allows explicit CPU retry if needed. |
| Dependency | Healed llama-cpp worker from 037/039 | High | Packet depends on 037 and 039 in graph metadata. |
| Dependency | Error propagation from 038 | Medium | Packet depends on 038 so repair failures are visible if rows are selected. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Why did the current baseline show `retry` and `pending` rows but no explicit `failed` rows? This packet records the observation; it does not broaden scope to retry-manager backlog draining.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

| NFR | Target | Verification |
|-----|--------|--------------|
| Idempotence | Repair script is safe when no failed rows exist | Live summary shows processed/succeeded counts without code changes |
| Traceability | Every command result is represented in docs | `implementation-summary.md` captures exit code and summary line |
| Minimality | No source edits | `git status --short` reviewed for source-code changes |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

1. **Zero failed rows**: dry-run and live run should exit 0 with `failed_count=0` / `starting_failed_count=0`.
2. **Plain sqlite vector query failure**: `sqlite3` can report `memory_index` but not `vec_memories` without the extension.
3. **Status drift between dry-run and live-run**: live output is source of truth because the script rechecks status before write.
4. **CPU fallback already active**: the repair script sets `NODE_LLAMA_CPP_GPU=false` by default, so a Metal retry may be unnecessary.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Phase | Complexity | Rationale |
|-------|------------|-----------|
| Scaffold | Low | Docs-only Level-2 packet. |
| Baseline | Low | One `memory_index` aggregation query. |
| Dry-run | Low | Existing script has explicit dry-run path and no writes. |
| Live run | Medium | May invoke local embedding runtime if failed rows exist. |
| Verification | Low | Final counts plus strict spec validation. |
<!-- /ANCHOR:complexity -->
