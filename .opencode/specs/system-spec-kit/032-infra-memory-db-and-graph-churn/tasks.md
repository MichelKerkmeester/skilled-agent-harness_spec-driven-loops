---
title: "Tasks: Infra investigations — memory-DB + graph-churn"
description: "Task tracker for the two infra fixes (investigation done; application pending)."
trigger_phrases:
  - "infra fix tasks memory db graph churn"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/032-infra-memory-db-and-graph-churn"
    last_updated_at: "2026-05-30T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Investigation committed; application pending"
    next_safe_action: "Apply graph-churn fix when tooling healthy"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003203"
      session_id: "032-infra-tasks"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Tasks: Infra investigations — memory-DB + graph-churn

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] T001 Root-cause memory-DB SQLITE_CONSTRAINT_PRIMARYKEY (corrupted FTS5 shadow after unclean shutdown)
- [x] T002 Root-cause graph-metadata churn (default-root walk + unconditional last_save_at, incl. archives)
- [x] T003 Revert the unsanctioned agent edit to graph-metadata-parser.ts; preserve it at /tmp for review

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [B] Add idempotent last_save_at skip in graph-metadata-parser.ts (blocked: tooling must be reliable)
- [ ] T005 [B] Scope save-time refresh to touched folder + exclude z_archive/z_future; keep global backfill as opt-in flag
- [ ] T006 [B] Build + targeted vitest + dry-run diff (scoped vs global)
- [ ] T007 [B] Memory-DB repair via /doctor memory / FTS runbook (operator-gated; DB-copy probe first)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-save a packet twice → second produces no graph-metadata.json diff
- [ ] T009 Save one packet → only its graph-metadata.json changes; archives untouched
- [ ] T010 memory_save / memory_index_scan / memory_match_triggers succeed; no .unclean-shutdown left

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Graph-churn fix applied + verified
- [ ] Memory DB repaired + writes succeed
- [ ] No `[B]` blocked tasks remaining

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Agent's proposed graph-churn edit**: `/tmp/graph-metadata-parser.AGENT-PROPOSED.ts` (reference only — re-derive when applying)

<!-- /ANCHOR:cross-refs -->
