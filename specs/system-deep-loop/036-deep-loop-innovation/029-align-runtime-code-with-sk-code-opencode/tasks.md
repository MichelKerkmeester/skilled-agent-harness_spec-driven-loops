---
title: "Tasks: Phase 29: align system-deep-loop runtime code with sk-code-opencode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 29: align system-deep-loop runtime code with sk-code-opencode

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

All code work runs in `.worktrees/070-runtime-code-alignment` (branch `worktrees/070-runtime-code-alignment`). Spec docs stay on `main`, where validation is trustworthy.

- [x] T001 Create and provision the worktree (`worktree-naming.sh create` + `provision`: 4 installed, 2 built, 0 failed)
- [ ] T002 Record typecheck and vitest baselines for all three runtimes (`scratch/baseline/`)
- [ ] T003 Capture the checker's default-mode output on all three runtimes before touching it (`scratch/baseline/checker-default-*.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Prerequisites (Opus-built; block both sibling packets):

- [ ] T004 Add `--check-sections` to `verify_alignment_drift.py`, seeded from `scratch/investigation/census.py`, with one passing and one failing fixture test
- [ ] T005 Add `--check-folders` (missing README, double-underscore folder names) with one passing and one failing fixture test
- [ ] T006 Write the "Folders and tests" rule into `sk-code/shared/references/universal/code-style-guide.md` §3 and add OBSIDIAN to its description
- [ ] T007 [P] Fix the `tests/__helpers__/` example in sk-code-opencode's `directory-and-test-conventions.md` and link the shared rule
- [ ] T008 [P] Rewrite the test-layout guidance in `sk-code-obsidian/SKILL.md` and `assets/verification-checklist.md` to the `tests/` tree, recording the plugin repo's current layout as known violations
- [ ] T009 Author the ARCHITECTURE template in `sk-doc/sk-create-readme/assets/` from the shared 8-section skeleton and route to it from `sk-create-readme/SKILL.md`
- [ ] T010 Write `scratch/align-loop.sh` (modes `header`, `sections`, `readme`; comment-only diff filter; typecheck; checker; revert on fail; done list; vitest every 25 targets)
- [ ] T011 Dry-run the driver on 3 deep-loop files and inspect each diff by hand before any unattended run

system-deep-loop alignment:

- [ ] T012 Loop `header` mode over the 131 files without a MODULE header
- [ ] T013 Loop `sections` mode over the 68 non-test files over 150 lines without numbered sections
- [ ] T014 Loop `readme` mode over the code folders without a README
- [ ] T015 Merge `lib/cutover-binding/` into `lib/mode-append-gateway/` and repoint its 5 importers
- [ ] T016 Merge `scripts/tests/` into `tests/`, fixing its two in-file paths
- [ ] T017 Merge `tests/fixtures/council-value/data/` into its parent and repoint `seed-helpers.ts`
- [ ] T018 Write `.skilled/skills/system-deep-loop/ARCHITECTURE.md` from the T009 template
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 `verify_alignment_drift.py --check-exact-headers --check-sections --check-folders --root .skilled/skills/system-deep-loop/runtime` reports 0 errors
- [ ] T020 Typecheck passes and the vitest pass count equals the T002 baseline
- [ ] T021 The checker's default-mode output equals the T003 capture on all three runtimes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every `acceptance-criteria.md` row is Met, Waived or Superseded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Siblings waiting on T004-T010**: `specs/system-skill-advisor/031-align-runtime-code-with-sk-code-opencode`, `specs/system-speckit/046-align-runtime-code-with-sk-code-opencode`
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

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md §4 REQ-001..REQ-007]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3 data flow]
- [ ] CHK-003 [P1] Baselines recorded before the first code edit
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every loop batch diff touches comment and blank lines only
- [ ] CHK-011 [P0] Typecheck passes on all three runtimes
- [ ] CHK-012 [P1] New checker code follows sk-code-opencode Python conventions
- [ ] CHK-013 [P1] No ephemeral ids (spec paths, task ids) in any code comment
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] vitest pass count equals baseline on every runtime touched
- [ ] CHK-021 [P0] Each new checker flag has a passing and a failing test
- [ ] CHK-022 [P1] Checker default-mode output unchanged
- [ ] CHK-023 [P1] Each merge followed by `rg` for the old path returning nothing
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each merge names its finding class (`cross-consumer` for moves with importers)
- [ ] CHK-FIX-002 [P0] Same-class inventory done by the census and the new checker flags
- [ ] CHK-FIX-003 [P0] Consumer inventory for each moved folder recorded in `scratch/investigation/devin-swe2max-merge-factcheck.md`
- [ ] CHK-FIX-004 [P2] Adversarial path tests: not applicable, no path, parser or security logic changes
- [ ] CHK-FIX-005 [P1] Matrix: 3 runtimes x 3 loop modes listed in tasks T012-T014 and the sibling packets
- [ ] CHK-FIX-006 [P2] Hostile env variant: not applicable, no process-wide state read by changed code
- [ ] CHK-FIX-007 [P1] Evidence pinned to the worktree commit SHA
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credentials in any DeepSeek brief or log
- [ ] CHK-031 [P2] Input validation: not applicable, no new input surface
- [ ] CHK-032 [P2] Auth: not applicable
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Every runtime code folder has a README
- [ ] CHK-042 [P1] ARCHITECTURE.md written from the template
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ keeps only evidence and the driver before completion
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 2/10 |
| P1 Items | 12 | 0/12 |
| P2 Items | 4 | 0/4 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->

---
