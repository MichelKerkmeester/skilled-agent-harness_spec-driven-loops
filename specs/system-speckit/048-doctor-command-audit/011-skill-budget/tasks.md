---
title: "Tasks: Phase 11: skill-budget"
description: "The ordered work for the skill-budget phase: inventory the target, run it read-only, record the verdict, apply the two fixes, and verify with the manifest, YAML, mirror and guard checks."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: skill-budget

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

- [x] T001 Read the route entry, workflow, router and presentation surfaces for `skill-budget` (`.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-skill-budget.yaml`, `.skilled/commands/doctor/speckit.md`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`)
- [x] T002 Check every path, script, command, flag and environment variable the surfaces name against this checkout and record the evidence (`scratch/reality-check.md`)
- [x] T003 [P] Confirm the baseline gates run: `route-validate.sh` and a YAML parse over the doctor assets (`scratch/doctor-run.log` STEP 8)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `/doctor:speckit skill-budget` in its read-only form and save the command, output and exit code (`scratch/doctor-run.log`)
- [x] T005 Record the verdict and the evidence behind it (`scratch/proposal.md`)
- [x] T006 Record the audit-script invocation in the route entry (`.skilled/commands/doctor/_routes.yaml`)
- [x] T007 Name `python3` as the interpreter in the workflow's audit activity (`.skilled/commands/doctor/assets/doctor-skill-budget.yaml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run `bash .skilled/commands/doctor/scripts/route-validate.sh`; expect exit 0 with the audit script covered by `PASS: I1`
- [x] T009 Re-parse the edited YAML and re-run the audit script through `python3`; expect exit 0 and unchanged counts (`scratch/doctor-run.log` STEPs 1-6)
- [x] T010 Close the packet docs with the observed evidence (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md`)
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
- [x] CHK-003 [P1] Dependencies identified and available (a provisioned worktree, the route manifest and its validator)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (every edited YAML parses; the doctor scripts' own tests run as at baseline)
- [x] CHK-011 [P0] No console errors or warnings (the audit runs exit 0 or 1 by contract; `route-validate.sh` exits 0)
- [x] CHK-012 [P1] Error handling implemented (a missing script or a failing audit surfaces as a named failure, never a pass)
- [x] CHK-013 [P1] Code follows project patterns (the interpreter is named in the workflow text, matching the canonical form in `scripts/README.md`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (one read-only run recorded in `scratch/doctor-run.log`)
- [x] CHK-022 [P1] Edge cases tested (direct execution exits 126; `--fail-over=5600` exits 1 with the documented FAIL; `--top-n=5` truncates the table)
- [x] CHK-023 [P1] Error scenarios validated (exit 75 retryable semantics verified in the advisor CLI source; no write path exists)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class (two instance fixes: the route omission and the missing interpreter; the subsystem findings are recorded, not fixed)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (only `doctor-skill-budget.yaml` runs the audit script, so the interpreter fix has one producer)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed surfaces (route manifest, workflow, router, presentation and scripts README re-checked; `PASS: I1` and `PASS: J1`)
- [x] CHK-FIX-004 [P0] Adversarial cases covered (direct path execution exits 126, `python3` execution exits 0, and the fail-over run exits 1)
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion (invocation form, output mode and fail-over; the rows in `scratch/doctor-run.log` STEPs 1-6)
- [x] CHK-FIX-006 [P1] Hostile env variant executed (the warm-only CLI probe ran against the live advisor and its exit-75 contract was verified in source)
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff against HEAD `83616db9ba` and the recorded run log, before any commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (the audit script and workflow hold no credentials)
- [x] CHK-031 [P0] Input validation implemented (the router rejects unknown flags; the script parses its four flags with argparse)
- [x] CHK-032 [P1] The target stays read-only (no write calls in the audit script; `mutating: read-only` and `GUARD PASS`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Comments adequate (no ephemeral labels added; the route comment states the durable why)
- [x] CHK-042 [P2] README updated (not needed: `scripts/README.md` already documents the canonical `python3` form)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (the run log, inventory and proposal live in `scratch/`)
- [x] CHK-051 [P1] The evidence records are kept in `scratch/` as the phase evidence
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



