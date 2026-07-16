---
title: "Tasks: Reset Stuck Embedding Rows"
description: "Task list for backing up the llama-cpp memory index database, resetting eligible stuck embedding rows, skipping orphans, validating the packet, and committing only the 040 folder."
trigger_phrases:
  - "040 reset stuck embedding rows tasks"
  - "retry-manager pending reset tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows"
    last_updated_at: "2026-05-14T15:15:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-040"
    recent_action: "Completed reset tasks through documentation"
    next_safe_action: "Stage only this packet folder and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/040-reset-stuck-embedding-rows/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-040-reset-stuck-embedding-rows"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reset Stuck Embedding Rows

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run required pre-check for an existing `040-` folder.
- [x] T002 Confirm the target database exists.
- [x] T003 Confirm `better-sqlite3` and `sqlite-vec` are available in `mcp_server/node_modules`.
- [x] T004 Inspect sibling 038 and 039 packet structure and metadata.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Back up the database before mutation.
- [x] T006 Select candidate stuck rows from `memory_index`.
- [x] T007 Skip rows whose `file_path` no longer exists.
- [x] T008 Reset eligible rows to pending with cleared retry failure metadata.
- [x] T009 Create the `040-reset-stuck-embedding-rows` Level 1 packet.
- [x] T010 Fill packet docs, `description.json`, and `graph-metadata.json`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Record `ROWS_RESET=789`.
- [x] T012 Record `ROWS_SKIPPED_AS_ORPHAN=10`.
- [x] T013 Record pre-counts `failed=30`, `retry=769`, `pending=0`.
- [x] T014 Record post-counts `failed=0`, `retry=10`, `pending=0`.
- [x] T015 Run strict validation for the 040 packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All packet tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] Strict validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
