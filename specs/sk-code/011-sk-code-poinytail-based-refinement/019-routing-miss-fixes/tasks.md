---
title: "Tasks: Phase 19: routing-miss-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "routing miss fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: routing-miss-fixes

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

- [x] T001 Capture both battery baselines, the advisor vitest, admission, canaries and the compiled-route tests
- [x] T002 Trace each miss to its rule: the router alias match, the deep-review penalty, the corpus-study bonus and the Python re-sort
- [x] T003 Snapshot the top three skills of 1,342 corpus and probe prompts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the finished-run clause to the authored deep-loop router and publish it (`canary-router.cjs`, `compiled-route-sync.cjs`)
- [x] T005 Add the code-authoring condition and the sk-code bonus (`fusion.ts`, `scoring-constants.ts`)
- [x] T006 Mirror the condition in the Python deep-loop precedence (`skill_advisor.py`)
- [x] T007 Add the finished-run test, four golden rows and the Python case
- [x] T008 Repin the divergence ledger, the eval baseline and the admission corpus size
- [x] T009 Make the deep-loop admission step blocking in CI (`.github/workflows/routing-registry-drift.yml`)
- [x] T010 Write the system-skill-advisor v0.15.3.0 entry and sync the Hermes copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run each new test on the old source and confirm it fails
- [x] T012 Rerun every baseline and diff the snapshot: only the intended rows move
- [x] T013 Validate the parent recursively and commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every goal.md criterion passes on the orchestrator's rerun
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
