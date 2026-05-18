---
title: "Tasks: 004 failed-embedding-cleanup"
description: "Task list for the failed embedding cleanup one-shot repair script."
trigger_phrases:
  - "failed embedding cleanup tasks"
  - "repair failed embeddings tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/032-substrate-repair-followups/004-failed-embedding-cleanup"
    last_updated_at: "2026-05-14T11:12:59Z"
    last_updated_by: "cli-codex"
    recent_action: "Documented blocked verification"
    next_safe_action: "Repair llama-cpp runtime, then rerun live script"
    blockers:
      - "Embedding provider returns null because llama-cpp runtime cannot initialize"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222224"
      session_id: "cli-codex-004-failed-embedding-cleanup"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Tasks: 004 failed-embedding-cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read packet spec (`spec.md`).
- [x] T002 Read vector write API (`vector-index-store.ts`, `vector-index-mutations.ts`).
- [x] T003 Read embedding provider entrypoint (`shared/dist/embeddings.js`, `shared/dist/embeddings/profile.js`).
- [x] T004 Read live retry reference (`retry-manager.ts`).
- [x] T005 Confirm active profile DB path and current failed count.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Create `mcp_server/scripts/repair-failed-embeddings.mjs`.
- [x] T007 Add `--dry-run`, `--batch-size`, and `--db-path`.
- [x] T008 Use profile-aware DB path resolution.
- [x] T009 Write vector rows to `vec_memories` and update `memory_index` only after vector write success.
- [x] T010 Make script executable.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run dry-run preview.
- [x] T012 Run live script.
- [B] T013 Confirm failed count drops from 214 toward 0. Blocked by llama-cpp runtime failure.
- [B] T014 Confirm idempotent live rerun shows 0 processed. Blocked because live repair never succeeded.
- [x] T015 Document provider/runtime blocker and counts.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All acceptance criteria met.
- [ ] No `[B]` blocked tasks remaining.
- [x] Manual verification evidence recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Outcome**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
