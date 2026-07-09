---
title: "Tasks: Self-Healing Model Consolidation [template:level_2/tasks.md]"
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
    packet_pointer: "028-memory-search-intelligence/023-self-healing-model-consolidation"
    last_updated_at: "2026-07-09T20:30:10.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored task breakdown, status PLANNED"
    next_safe_action: "Start T001 once 017/018/019 land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
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

- [B] T001 Re-verify every file:line citation in spec.md and plan.md against the live tree; blocked on 017/018/019 landing (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts, .opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts, .opencode/skills/system-spec-kit/mcp_server/startup-checks.ts)
- [ ] T002 Confirm listIndexedRecordIdsForDeletedPaths is safely callable standalone from the scoped-delete branch, matching deleteStaleIndexedRecords's own internal call (.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts)
- [ ] T003 [P] Stand up a synthetic orphan backlog fixture reusing the existing pattern (.opencode/skills/system-spec-kit/mcp_server/tests/orphan-sweep-time-budget-and-refresh.vitest.ts)
- [ ] T004 [P] Stand up a synthetic git-hook-marker-driven scoped-delete fixture reusing the existing pattern (.opencode/skills/system-spec-kit/mcp_server/tests/memory-drift-healing.vitest.ts)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Convert runGlobalOrphanSweep's deleteIndexedRecordIds call to an appendMemoryDriftSuspects enqueue call; update OrphanSweepDeleteResult field semantics or add a distinct enqueue-count field (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts)
- [ ] T006 Convert the marker-triggered scoped-delete branch (files.length === 0, scopedScanPaths.length > 0) to resolve categorized.toDelete paths to ids via listIndexedRecordIdsForDeletedPaths and enqueue via appendMemoryDriftSuspects instead of calling deleteStaleIndexedRecords (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts)
- [ ] T007 Swap the orphan-sweep / suspect-confirmation phase-call order (or implement and document the accepted same-cycle alternative) so orphan-discovered suspects get real time separation before confirmation, per plan.md Decision 3 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts)
- [ ] T008 Add a size cap and/or metric to appendMemoryDriftSuspects; thread the resulting queue-size signal into the scan-result envelope alongside orphanSwept/suspectTombstoned/suspectCleared/suspectFailed (.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts)
- [ ] T009 Decide and implement the busy-timeout policy for the two new callers per plan.md Decision 5 (.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts if the constant is relocated or parameterized)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Update orphan-sweep-time-budget-and-refresh.vitest.ts to assert enqueue-then-later-confirm instead of immediate deletion (.opencode/skills/system-spec-kit/mcp_server/tests/orphan-sweep-time-budget-and-refresh.vitest.ts)
- [ ] T011 Extend suspect-confirmation.vitest.ts with fixtures seeded via the new orphan-sweep and scoped-delete discoverer paths, not only via appendMemoryDriftSuspects called directly (.opencode/skills/system-spec-kit/mcp_server/tests/suspect-confirmation.vitest.ts)
- [ ] T012 Add a phase-order test proving the chosen Decision 3 behavior (same-cycle vs. next-cycle confirmation) for an orphan-discovered id (.opencode/skills/system-spec-kit/mcp_server/tests/)
- [ ] T013 Add a size-cap boundary test (at-cap and one-over-cap) for appendMemoryDriftSuspects (.opencode/skills/system-spec-kit/mcp_server/tests/memory-drift-healing.vitest.ts)
- [ ] T014 Add a lock-contention test for at least one new caller's busy-timeout behavior (.opencode/skills/system-spec-kit/mcp_server/tests/)
- [ ] T015 Run rg -n "deleteIndexedRecordIds\(" against memory-index.ts and confirm exactly two call sites remain (runSuspectConfirmation and the out-of-scope full-corpus filesToDelete path)
- [ ] T016 Run the full existing regression suite (memory-drift-healing.vitest.ts, memory-search-drift-suspect-write-timeout.vitest.ts, startup-checks-processing-marker-sigkill.vitest.ts) and confirm no unintended behavior change
- [ ] T017 Update documentation (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
