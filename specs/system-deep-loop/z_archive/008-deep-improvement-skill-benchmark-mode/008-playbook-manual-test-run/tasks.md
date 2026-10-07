---
title: "Tasks: Deep-Improvement Playbook Manual Test Run"
description: "Reconstructed task list for the 008 manual test run, derived from spec.md and git history. Task state was not recorded in those sources."
trigger_phrases:
  - "deep-improvement playbook manual test run tasks"
  - "48 scenario test run tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Deep-Improvement Playbook Manual Test Run

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

- [ ] T001 Read the runbook top-to-bottom; cache the prerequisites (`handover.md` §2)
- [ ] T002 Pre-flight the provider for the model-dispatch scenarios (`handover.md` §2)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Execute the pure-node scenario categories in order, capturing stdout/stderr/exit code and generated files (`handover.md` §5)
- [ ] T004 Execute the model-dispatch scenarios (CP stress tests + any E2E that dispatches) one dispatch at a time (`handover.md` §5)
- [ ] T005 Record the verdict + one decisive evidence line + the failing check per scenario (`results-matrix.md`)
- [ ] T006 Clean up each scenario's `/tmp` dirs between runs (`/tmp`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Complete all 48 scenarios or SKIP-with-documented-blocker (`results-matrix.md`)
- [ ] T008 State the release-readiness verdict with its reason (`results-matrix.md`)
- [ ] T009 Confirm the repo was not mutated by a test; commit results by explicit pathspec (never `git add -A`)
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
