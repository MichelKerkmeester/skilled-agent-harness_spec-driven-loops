---
title: "Tasks: Phase 26: goal-rebind-shared-core-and-opencode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal rebind shared core opencode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 26: goal-rebind-shared-core-and-opencode

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

- [ ] T001 Baseline: record the OpenCode goal suites, the shared hook suites and the Hermes tests before any change
- [ ] T002 Read each caller and the existing bind path, and note the one place each reads session state (`goal-core.cjs`, `goal-inject.mjs`, `goal-context.ts`, `opencode-goal.js`)
- [ ] T003 Read the probe D verdict and decide whether Hermes needs its own call
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the failing tests first: bind when none, keep when present, nothing without the variable, refuse an invalid packet (each runtime test file)
- [ ] T005 Add the bind-if-unbound function to the core (`goal-core.cjs`)
- [ ] T006 Call it from the Pi, Devin and Cursor injectors and, if needed, the Hermes plugin
- [ ] T007 Mirror it at session start in the OpenCode plugin (`opencode-goal.js`)
- [ ] T008 Describe the hop bind and its limits (`goal-plugin.md`, `README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Negative control: run the new tests against the code before this phase and confirm each fails
- [ ] T010 Rerun the whole OpenCode, shared hook and Hermes gate and report the delta against the baseline
- [ ] T011 Run the sk-code drift guards and `validate.sh --strict` on this folder
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
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Changed code files pass `node --check` and `bash -n` where they apply
- [ ] CHK-011 [P0] No console errors or warnings in the suite output
- [ ] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start
- [ ] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [ ] CHK-021 [P0] The OpenCode goal suites, the shared hook suites and the Hermes tests pass in the final state, delta reported
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the shared core: Pi, Devin, Cursor, Hermes and the CLI each named with `file:line`.
- [ ] CHK-FIX-004 [P0] The packet path is re-validated with outside-root, joined-path, symlink-out and no-`goal.md` cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written
- [ ] CHK-031 [P0] The packet path from the environment is validated before it is bound
- [ ] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] Code comments carry the reason, with no artifact ids
- [ ] CHK-042 [P2] README updated where the behavior changes
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
