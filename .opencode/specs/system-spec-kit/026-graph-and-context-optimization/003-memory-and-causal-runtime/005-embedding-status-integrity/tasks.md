---
title: "Tasks: embedding-status integrity (durable prevention fixes)"
description: "Level 1 task tracker for the three durable mk-spec-memory embedding-status prevention fixes."
trigger_phrases:
  - "embedding status integrity tasks"
  - "reindex status commit tasks"
  - "retry retention non-destructive tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/005-embedding-status-integrity"
    last_updated_at: "2026-05-27T09:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored-level-1-tasks-all-complete"
    next_safe_action: "operator-rebuild-restart-daemon"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000053"
      session_id: "embedding-status-integrity-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All tasks complete + verified"
---
# Tasks: embedding-status integrity (durable prevention fixes)

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

- [x] T001 Verify 004 `file:line` claims against live source (`lib/embedders/reindex.ts`, `lib/providers/retry-manager.ts`)
- [x] T002 Confirm production columns `retry_count` / `updated_at` / `embedding_generated_at` exist
- [x] T003 Confirm build path (`npm run build` = tsc → dist; dist gitignored)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 REQ-001 add status-commit UPDATE to reindex completion transaction (`lib/embedders/reindex.ts`)
- [x] T005 REQ-002 add attempted-row guard to max-age + overflow-select + overflow-update retention queries (`lib/providers/retry-manager.ts`)
- [x] T006 REQ-003 add `getMaxRetryQueuePending()`/`getMaxRetryQueueAgeMs()` accessors, use as retention defaults, export (`lib/providers/retry-manager.ts`)
- [x] T007 Make `embedder-reindex` test schema realistic + assert status committed (`tests/embedder-reindex.vitest.ts`)
- [x] T008 Assert retention guard + call-time config (`tests/providers/retry-retention.vitest.ts`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 `npm run build` clean; confirm fixes present in `dist/`
- [x] T010 Run `embedder-reindex` + `retry-retention` suites (10 tests green)
- [x] T011 Regression sweep across coupled suites (135/136; T49 pre-existing flake on `main`)
- [x] T012 `validate.sh --strict` on the packet

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All three fixes implemented and present in `dist/`
- [x] New + existing tests green; regression sweep clean except pre-existing flake
- [x] Packet validates strict
- [ ] (Operator) daemon rebuilt + restarted; one-time backlog reconcile run

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Root-cause research**: See `../004-embedding-backlog-drain-investigation/research/research.md`

<!-- /ANCHOR:cross-refs -->
