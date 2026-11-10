---
title: "Tasks: Phase 9: gate-3-menu-series-parent"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gate 3 menu series parent tasks"
  - "menu wording tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: gate-3-menu-series-parent

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

- [x] T001 Read the Phase 7 research and the second-opinion review, and fold every copy they name into the file list (`../007-series-parent-review-and-hardening-research/research/research.md`, `../007-series-parent-review-and-hardening-research/review/second-opinion-luna.md`)
- [x] T002 Record the baseline before the first edit (hook suite 169 pass, 3 skipped, 0 fail out of 172)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite option B as new or unrelated work and option C to name the series parent in `GATE_3_QUESTION` and `GATE_3_MUTATION_NOTICE`, and export the choice labels (`.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`)
- [x] T004 Read the dialog labels from the core instead of a local literal (`.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts`)
- [x] T005 Regenerate the byte pins for the question, the notice, the labels and the hash (`.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs`)
- [x] T006 Carry the new menu text into the skill-advisor parity fixture (`.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json`)
- [x] T007 Update the speckit plan and complete presentations and `speckit-implement.yaml` to the short form (`.skilled/commands/speckit/assets/`)
- [x] T008 Update the deep review, research and ai-council presentations and regenerate the compiled contracts (`.skilled/commands/deep/assets/`)
- [x] T009 Update the six create presentations (`.skilled/commands/create/assets/`)
- [x] T010 Update the teaching copies (root `README.md`, `references/workflows/worked-examples.md`, `references/memory/trigger-config.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Sweep the repository outside `specs/` for `including a phase child` and `related folder or phase child`, and confirm no copy remains
- [x] T012 Run the hook suite from the final state, with `AI_SESSION_CHILD` and `SYSTEM_SPEC_GATE_ENFORCE` unset (169 pass, 3 skipped, 0 fail)
- [x] T013 Run the Pi extension suite and the typecheck (9/9, `tsc --noEmit -p tsconfig.pi.json` exit 0)
- [x] T014 Run the skill-advisor parity suite (32/32)
- [x] T015 Run the deep contract suites after regeneration (11 files, 326 tests pass)
- [x] T016 Run the whole spec-kit CLI test folder as the final regression check (161 files passed, 3 skipped, 1621 tests passed, 19 skipped, 0 failed)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md - spec.md §4 lists REQ-001 to REQ-005
- [x] CHK-002 [P0] Technical approach defined in plan.md - plan.md §3 names the one source and the pinned projections
- [x] CHK-003 [P1] Dependencies identified and available - the Phase 7 research and its second-opinion review were read and folded in
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - hook suite 0 fail, `tsc --noEmit -p tsconfig.pi.json` exit 0
- [x] CHK-011 [P0] No console errors or warnings - no recorded run reported a failure (hook suite 0 fail, parity 32/32, extension 9/9)
- [x] CHK-012 [P1] Error handling implemented - N/A, the change carries text and label exports, no error path
- [x] CHK-013 [P1] Code follows project patterns - the Pi dialog reads the labels from the core, matching the one-source pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - acceptance-criteria.md: 5 of 5 Met
- [x] CHK-021 [P0] Manual testing complete - the repository sweep outside `specs/` is this phase's manual check and it returned nothing
- [x] CHK-022 [P1] Edge cases tested - label-keyed answers keep working, the byte pins cover the labels and their order
- [x] CHK-023 [P1] Error scenarios validated - N/A, no error scenario changed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class - class-of-bug, every runtime copy of the menu, not just the first four files
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep - the second-opinion review and the repository sweep enumerated the copies, and all of them were updated
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests - the Pi dialog, the parity fixture, the command presentations, the compiled contracts and the teaching copies, all named in plan.md
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests - N/A, no security, path, parser or redaction change
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed - N/A, no matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state - the hook suite rerun ran with `AI_SESSION_CHILD` and `SYSTEM_SPEC_GATE_ENFORCE` unset
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range - the tree is uncommitted while the packet closes, so the pin is the enumerated file list and the recorded suite outputs
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - no secrets touched
- [x] CHK-031 [P0] Input validation implemented - N/A, no input validation changed
- [x] CHK-032 [P1] Auth/authz working correctly - N/A, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - spec, plan, tasks and acceptance criteria reconciled at close
- [x] CHK-041 [P1] Code comments adequate - the wording change carries its meaning, no ids were added to comments
- [x] CHK-042 [P2] README updated (if applicable) - the root README Gate 3 box was rebuilt with the new menu
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - scratch/ holds only its `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion - no working files left behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-07
<!-- /ANCHOR:summary -->

---
