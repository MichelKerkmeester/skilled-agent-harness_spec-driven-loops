---
title: "Tasks: Phase 9: runtime-mirrors"
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
# Tasks: Phase 9: runtime-mirrors

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
## Phase 1: Audit

- [x] T001 Inventory every named path, script, command, flag and variable in the route and the workflow, each with the command that showed it (scratch/reality-check.md)
- [x] T002 Run the runtime-mirrors checker set read-only and keep the full output (scratch/doctor-run.log)
- [x] T003 [P] Test all 64 configured hook adapter paths with a plain path-existence read (scratch/doctor-run.log)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record the verdict `fix` with the evidence behind it (scratch/proposal.md)
- [x] T005 Add both Pi checker invocations to the route and pass `--allow-worktree` to the Codex hooks check (.skilled/commands/doctor/_routes.yaml)
- [x] T006 Add the command-catalog checker to the workflow inventory and steps, align the action text with the declared checkers, and define `STATUS=ERROR` for a refusal or a missing affirmative result (.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml)
- [x] T007 Show the runtime-mirrors target in the startup menu and the help block (.skilled/commands/doctor/assets/doctor-speckit-presentation.txt)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the route validator after the fix and confirm exit 0 (.skilled/commands/doctor/scripts/route-validate.sh)
- [x] T009 Parse every doctor asset YAML and the route manifest and confirm a clean load (.skilled/commands/doctor/assets)
- [x] T010 Run the command-catalog mirror check and the MCP mutation-class guard
- [x] T011 Run the doctor script tests and compare failures with the pre-batch baseline
- [x] T012 Confirm the startup menu displays the target and sweep the edited doctor files for retired identifiers
- [x] T013 Close the phase documentation and validate the packet (specs/system-speckit/048-doctor-command-audit/009-runtime-mirrors)
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited assets parse and pass the route checks (`route-validate.sh`, `python3 yaml.safe_load`)
- [x] CHK-011 [P0] No new console errors or warnings: the checkers print clean rows; `route-validate.sh` prints its two known informational H1 warnings
- [x] CHK-012 [P1] Error handling implemented: a refused check or a missing affirmative result is reported as `STATUS=ERROR`, not a pass
- [x] CHK-013 [P1] Code follows project patterns: the existing invocation style, checker inventory and status contract were extended, not replaced
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: the read-only checker set ran on this checkout and every completed check reported in sync (scratch/doctor-run.log)
- [x] CHK-022 [P1] Edge cases: all 64 hook adapter paths were tested individually and every one resolves
- [x] CHK-023 [P1] Error scenarios: the Codex hooks refusal on the linked worktree was observed and the workflow now maps it to `STATUS=ERROR`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each applied edit traces to the recorded verdict and the acceptance table
- [x] CHK-FIX-002 [P0] Same-class producer sweep: the workflow's checker inventory is the single list of checkers; the route invocations were compared against it
- [x] CHK-FIX-003 [P0] Consumer sweep: the route row, workflow asset, router document and presentation contract are the consumers of the target's invocations and display; each was read and updated where the audit found a gap
- [x] CHK-FIX-004 [P0] Result-contract cases (in sync, drift, refusal/error, missing affirmative output) are defined; the change touches no path, redaction, parser or security boundary
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: checker set × invocation form × result state; the in-sync and refusal rows were executed
- [x] CHK-FIX-006 [P1] Hostile env variant: the audit ran in a linked worktree, the guarded environment the Codex hooks check must handle; `--allow-worktree` is the intended path through it
- [x] CHK-FIX-007 [P1] Evidence is pinned to the worktree files after the applied edits and to the recorded outputs, not a moving branch
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the checkers print counts and paths only
- [x] CHK-031 [P0] Input validation implemented: the workflow takes no arguments, and every check-only invocation returns before any write
- [x] CHK-032 [P1] Auth/authz: not applicable to a read-only local diagnostic with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: the edited assets keep their durable WHY comments; no ephemeral labels were added
- [x] CHK-042 [P2] Operator-facing text updated in the presentation asset; the batch also refreshed the doctor README surfaces
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] Scratch keeps the audit evidence (`reality-check.md`, `doctor-run.log`, `proposal.md`) as this phase's record
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---



