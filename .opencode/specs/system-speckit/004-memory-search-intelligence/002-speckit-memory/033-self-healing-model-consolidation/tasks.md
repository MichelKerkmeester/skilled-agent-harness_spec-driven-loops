---
title: "Tasks: Self-Healing Model Consolidation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "self-healing model consolidation"
  - "suspect queue sole confirmation funnel"
  - "runSuspectConfirmation one confirmer"
  - "orphan sweep discoverer not deleter"
  - "drift suspect queue size cap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/033-self-healing-model-consolidation"
    last_updated_at: "2026-07-10T09:45:40.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed implementation and verification"
    next_safe_action: "No further implementation work"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Self-Healing Model Consolidation

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

- [x] T001 Re-verified live seams with `rg -n` (`memory-index.ts:788-861,1064-1081,1565-1576`; `memory-drift-healing.ts:10,114-151`)
- [x] T002 Confirmed standalone path-to-id resolution (`incremental-index.ts:439-494`; used at `memory-index.ts:1075`)
- [x] T003 [P] Added synthetic orphan fixture (`orphan-sweep-time-budget-and-refresh.vitest.ts:131-172`)
- [x] T004 [P] Added scoped-delete fixture (`suspect-confirmation.vitest.ts:224-250`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Converted orphan discovery to enqueue and added `enqueued`/`queueSize` (`memory-index.ts:265-271,819-861`)
- [x] T006 Converted scoped candidates to resolved-id enqueue (`memory-index.ts:1074-1081`)
- [x] T007 Swapped to next-cycle confirmation (`memory-index.ts:1064-1065,1565-1576`)
- [x] T008 Added a 1,000-entry cap and scan queue-size signal (`memory-drift-healing.ts:10,114-151`; `memory-index.ts:1164,1576`)
- [x] T009 Retained caller-local 25ms search timeout; scan calls use default timeout (`memory-search.ts:224,421-437`; `suspect-confirmation.vitest.ts:252-289`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Asserted enqueue-then-later-confirm (`orphan-sweep-time-budget-and-refresh.vitest.ts:131-172`)
- [x] T011 Added orphan and scoped discoverer fixtures (`suspect-confirmation.vitest.ts:195-250`)
- [x] T012 Proved next-cycle ordering (`orphan-sweep-time-budget-and-refresh.vitest.ts:131-172`)
- [x] T013 Tested at-cap and one-over-cap (`memory-drift-healing.vitest.ts:67-91`)
- [x] T014 Tested default-timeout lock contention (`suspect-confirmation.vitest.ts:252-289`)
- [x] T015 Confirmed exactly two call sites with `rg -n "deleteIndexedRecordIds\("` (785 and 923)
- [x] T016 Ran `npx vitest run ...`: 26/26 tests, 5/5 files, 0 skipped
- [x] T017 Updated all five packet documents (`implementation-summary.md:50-118`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (`tasks.md:54-84`)
- [x] No `[B]` blocked tasks remaining (`tasks.md:54-84`)
- [x] Real-SQLite integration verification passed (`npx vitest run ...`: 26/26)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
