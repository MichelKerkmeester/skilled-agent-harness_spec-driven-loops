---
title: "Tasks: Save-Handler README Doc-Sync"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "readme doc sync tasks"
  - "post-insert enrichment readme tasks"
  - "async enrichment docs tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/022-readme-doc-sync"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete"
    next_safe_action: "Commit when requested"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-doc-sync-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Save-Handler README Doc-Sync

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

<!-- Setup here = verify defaults in code before any edit -->

- [x] T001 Grep enrichment/reconsolidation flag helpers (`lib/search/search-flags.ts`, `handlers/save/post-insert.ts`, `handlers/memory-save.ts`)
- [x] T002 Confirm enrichment default-on + async-default + SYNC override; confirm reconsolidation stays opt-in
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Reword §7 ENTRYPOINTS `runPostInsertEnrichment()` line: default-on + async/deferred default + `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` forced-sync (`handlers/save/README.md`)
- [x] T004 Update §6 main-flow box to "create record; post-insert enrichment scheduled async (deferred) by default" (`handlers/save/README.md`)
- [x] T005 Append default-on async clause to §5 KEY FILES `post-insert.ts` row (`handlers/save/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm no reconsolidation wording changed and no code touched (scope lock)
- [x] T007 Run `validate.sh --strict` on the packet; record result in implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (README wording matches live code defaults)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
