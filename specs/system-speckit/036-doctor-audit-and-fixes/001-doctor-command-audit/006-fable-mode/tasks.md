---
title: "Tasks: Phase 6: fable-mode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fable mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: fable-mode

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

- [x] T001 Inventory every path, script, command, flag and environment variable named by the fable-mode route and workflow (scratch/reality-check.md)
- [x] T002 Run the read-only check once and keep its output with the exit code (scratch/doctor-run.log)
- [x] T003 Write the keep, fix or retire verdict with its evidence (scratch/proposal.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remove the missing default target; require `--dir` or a positional path and fail clearly (fable-mode-check.cjs)
- [x] T005 Make `target_dir` required and wire `baseline` through the execution step (doctor-fable-mode.yaml)
- [x] T006 Forward the baseline override: add it to setup variables and the script invocation (_routes.yaml)
- [x] T007 Add the fable-mode artifact-directory setup prompt (doctor-speckit-presentation.txt)
- [x] T008 Reword the manifest row from review quality to metric drift (doctor-speckit-presentation.txt)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the fixed check with no arguments; confirm exit 2 and `pass --dir <path>`
- [x] T010 Run `node --check` on the diagnostic and parse the edited YAML assets (YAML_OK)
- [x] T011 Run the catalog mirror check (STATUS=OK) and the MCP mutation-class guard (GUARD PASS)
- [x] T012 Run the doctor script tests; three parent-skill fixtures fail identically to baseline, not a regression
- [x] T013 Run `route-validate.sh` from the final state (exit 0, 9 routes validated, 2 warnings)
- [x] T014 Grep the edited doctor files for retired routing symbols (no matches)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (no-argument run, YAML parse, route validation exit 0)
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
- [x] CHK-003 [P1] Dependencies identified and available (provisioned worktree; `_routes.yaml` validator)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check`: NODE_CHECK_OK)
- [x] CHK-011 [P0] No console errors or warnings (the only failure output is the deliberate exit-2 message for a missing input)
- [x] CHK-012 [P1] Error handling implemented (no target: `pass --dir <path>`; missing directory: `target not found` by name; optional baseline falls back to none loaded)
- [x] CHK-013 [P1] Code follows project patterns (route validation exit 0; catalog mirror check STATUS=OK)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`, 4 of 4 Met)
- [x] CHK-021 [P0] Manual testing complete (pre-fix read-only run and post-fix no-argument run)
- [x] CHK-022 [P1] Edge cases tested (no argument; missing directory; empty `--dir ""`; positional path with flags present)
- [x] CHK-023 [P1] Error scenarios validated (exit 2 by name for missing input; malformed baseline yields no baseline rather than a crash)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the missing default target is instance-only; the unwired baseline override is cross-consumer (route → workflow → script chain); the review-quality wording is instance-only.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: both flags traced across seven surfaces (route allowlist, setup variables, invocation, workflow inputs, execution step, script parser, presentation prompt); the faulting default was the script's only fixed-path fallback.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `_routes.yaml` and `doctor-fable-mode.yaml` consume the diagnostic, the presentation consumes the target table and setup variables, and `route-validate.sh` J1 checks all three in parity (PASS).
- [x] CHK-FIX-004 [P0] Path and parser edges checked: the observed no-argument and missing-directory runs exit 2 by name; the empty-value and positional rows were verified by reading the parser (fable-mode-check.cjs:19-26).
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: two axes (target source, baseline source) across five rows, with the absent-target row exiting 2.
- [x] CHK-FIX-006 [P1] Process-wide state variant: the diagnostic reads only `process.argv`; the route, workflow and presentation name no environment variables, so no hostile-env variant applies.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the recorded runs (`scratch/doctor-run.log`, the no-argument rerun) and the uncommitted worktree diff; the commit SHA is recorded at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (the diagnostic reads no environment variables and prints no credential values)
- [x] CHK-031 [P0] Input validation implemented (missing target and missing directory exit 2 by name; baseline is optional)
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable to a read-only local diagnostic with no network or auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (`validate.sh --strict` RESULT: PASSED)
- [x] CHK-041 [P1] Code comments adequate (the script header states the read-only contract and both exit codes)
- [x] CHK-042 [P2] README updated (if applicable) — no fable-mode-specific README change; the same batch refreshed shared route lists when it retired another target
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (reality-check.md, doctor-run.log, proposal.md)
- [x] CHK-051 [P1] scratch/ cleaned before completion (the three evidence files stay as the audit trail)
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

