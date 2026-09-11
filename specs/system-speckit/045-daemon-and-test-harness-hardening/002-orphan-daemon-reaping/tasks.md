---
title: "Tasks: Phase 2: Orphan Daemon Reaping"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "orphan daemon reaping tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: Orphan Daemon Reaping

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Answer the autonomous-vs-confirmed apply question and record the decision
- [ ] T002 Choose the lifecycle event that invokes the sweep
- [ ] T003 Capture the negative control: orphan a launcher, record survival, lock validity, and sweep inaction
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the stdin-close shutdown handler (`.opencode/bin/system-spec-memory-launcher.cjs`)
- [ ] T005 Evaluate the orphan predicate on the existing heartbeat timer (`.opencode/bin/system-spec-memory-launcher.cjs`)
- [ ] T006 Make `isRespawnLockStale()` treat an orphaned holder as stale (`.opencode/bin/lib/model-server-supervision.cjs`)
- [ ] T007 Add the guarded apply path (`.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`)
- [ ] T008 Add the lifecycle hook that invokes the sweep (`.opencode/hooks/`)
- [ ] T009 [P] Update the "no live apply command exists" statement (`.opencode/skills/system-spec-kit/scripts/ops/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Re-run the negative control; confirm self-exit and lock release
- [ ] T011 Safety test: a launcher with a live parent is never signalled
- [ ] T012 Confirm the other launchers are unaffected
- [ ] T013 Run the full suite against the recorded baseline
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row in `acceptance-criteria.md` is Met, Waived or Superseded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
