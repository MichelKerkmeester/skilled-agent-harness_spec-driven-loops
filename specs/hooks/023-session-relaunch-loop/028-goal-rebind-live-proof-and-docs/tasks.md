---
title: "Tasks: Phase 28: goal-rebind-live-proof-and-docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal rebind live proof tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 28: goal-rebind-live-proof-and-docs

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

- [ ] T001 Baseline: run the relaunch gate, the OpenCode goal suites and the shared hook suites and record the totals
- [ ] T002 Check each runtime starts without printing a key, and mark the ones that cannot as SKIP with the reason
- [ ] T003 Prepare a short task and a low hop cap for each run (`SESSION_RELAUNCH_MAX_HOPS`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run a live hop with an active goal on Claude, Codex, OpenCode and Pi and save the receiver status (`scratch/`)
- [ ] T005 Run the same on Devin, Cursor and Hermes where the runtime allows, or record SKIP
- [ ] T006 Run the switch-off control and the no-goal control on the same runtimes (`scratch/`)
- [ ] T007 Add the scenarios to the three relaunch playbooks and the goal playbooks
- [ ] T008 Update the READMEs, the goal plugin doc, `/speckit:handoff` and the feature catalog entry
- [ ] T009 Add the 023 and 060 parent map rows and handoff criteria
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Rerun the whole relaunch and goal gates and report the delta against the baseline
- [ ] T011 Run `validate.sh --strict --recursive` on both parents and read the result
- [ ] T012 Confirm no goal, tmux session or process remains and `git status` shows only the intended files
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

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Credentials for each live runtime are available, or the runtime is recorded as SKIP
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Any changed script or playbook snippet runs under bash and zsh without word-splitting errors
- [ ] CHK-011 [P0] No console errors or warnings in the suite output
- [ ] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start
- [ ] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [ ] CHK-021 [P0] The relaunch and goal gates pass in the final state with the delta against the baseline reported
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests.
- [ ] CHK-FIX-004 [P0] No path or parser change is in this phase, so no adversarial table applies.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Each live run ran with the loop environment variables of the host session dropped.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written
- [ ] CHK-031 [P0] Input validation implemented for every path and value read from a note or an environment variable
- [ ] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [ ] CHK-042 [P2] The READMEs and the feature catalog entry pass the sk-doc validators
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/
- [ ] CHK-051 [P1] scratch/ holds only evidence this packet cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---
