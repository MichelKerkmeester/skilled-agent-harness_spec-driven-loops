---
title: "Tasks: Gate-3 Relay Edge-Triggering"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate 3 relay tasks"
  - "edge-triggered gate delivery tasks"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/005-gate3-relay-edge-triggering"
    last_updated_at: "2026-08-07T04:31:31Z"
    last_updated_by: "opus"
    recent_action: "Authored the task list for Gate-3 relay edge-triggered delivery suppression"
    next_safe_action: "Begin T001 once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Gate-3 Relay Edge-Triggering

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

Status: Complete - the Gate-3 shadow predicate, receipt logging, collision-safe identity fallback, matrix controls, and rollback record are verified; activation remains off.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [B] Confirm Phase 001 canonical block IDs, hashes, and delivery-receipt fields are available to reuse (`spec-gate-core.mjs`)
- [x] T002 Locate the exact `GATE_3_QUESTION` emission site and the `classifyIntent` boundary (`spec-gate-core.mjs`)
- [x] T003 [P] Draft the session+epoch+gate-state-hash key shape (`spec-gate-core.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement the suppression predicate as a pure function, independent of `classifyIntent` (`spec-gate-core.mjs`)
- [x] T005 Wire the predicate into the `GATE_3_QUESTION` delivery site behind an independent flag, shadow-only (`spec-gate-core.mjs`)
- [x] T006 Add shadow-receipt logging for every suppress/emit decision (`spec-gate-core.mjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Author the 11-row gate-matrix negative-control suite (adjacent spec-gate test file)
- [x] T008 Run the 11-row suite and confirm all rows pass
  - **Evidence**: `spec-gate-core.test.mjs:368-519`; final suite reports 82 tests, 79 passed, 0 failed, 3 skipped, exit 0.
- [x] T009 Confirm shadow-mode output diff against baseline is empty
  - **Evidence**: `spec-gate-core.test.mjs:286-366`; flag-off/shadow-on relay byte comparisons pass in the final suite, exit 0.
- [x] T010 `rg` the suppression predicate to confirm no call sites inside `classifyIntent`/enforcement
- [x] T011 Document the per-block rollback procedure
  - **Evidence**: `rollback-procedure.md:5-38` defines disable, state clearing, baseline confirmation, and emit fallback.
- [x] T012 Reconcile spec/plan/tasks/checklist/implementation-summary for this packet
  - **Evidence**: `checklist.md`, `implementation-summary.md`, and generated metadata are synchronized; phase strict validation passes after the final metadata refresh.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] 11-row gate-matrix suite green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
