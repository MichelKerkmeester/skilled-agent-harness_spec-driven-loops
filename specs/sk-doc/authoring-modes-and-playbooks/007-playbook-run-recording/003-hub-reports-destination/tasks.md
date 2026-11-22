---
title: "Tasks: Phase 3: hub-reports-destination"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub reports destination tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: hub-reports-destination

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the recorder's default destination and refusal rules (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs`). Verify: `rg -n 'function resolveReports' <file>` prints one line.
- [x] T002 Confirm the three packets with no benchmark folder of their own (`.skilled/skills/sk-code/sk-code-ci`, `.skilled/skills/sk-code/sk-code-frontend`, `.skilled/skills/cli-external-orchestration/cli-mistral-vibe`). Verify: `ls -d <packet>/benchmark` prints `No such file or directory` for each.
- [x] T003 Count the cli-mistral-vibe playbook files this phase changed (`.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/`). Verify: `git -c core.fsmonitor=false diff --name-only -- <folder> | wc -l` prints 26, the root plus 25 scenario files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `--reports DIR` and `resolveReports` to the recorder, exported (`scripts/record-playbook-run.cjs`). Verify: `rg -n 'resolveReports' <file>` prints three lines: the definition, its call and the export.
- [x] T005 Forward `--reports` from the runner into the printed `save results:` command (`scripts/run-conversation-scenario.cjs`). Verify: `rg -n -- '--reports' <file>` prints the argument parse and the printed destination.
- [x] T006 Add the hub-reports test and the runner assertion (`scripts/tests/record-playbook-run.test.cjs`, `scripts/tests/run-conversation-scenario.test.cjs`). Verify: `node scripts/tests/record-playbook-run.test.cjs` prints `recorder hub reports: PASS (8 assertions)`.
- [x] T007 Name `--reports` in the sk-code-ci and sk-code-frontend result blocks, bumping 1.1.3.0 to 1.1.4.0 and 1.0.3.0 to 1.0.4.0 (`.skilled/skills/sk-code/sk-code-ci/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/skills/sk-code/sk-code-frontend/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n -- '--reports .skilled' <file>` prints one line in each root.
- [x] T008 Move the 25 cli-mistral-vibe `Recorded Result` blocks into the two recorder-written report folders and remove them from the scenario files (`.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/`). Verify: `rg -l 'Recorded Result' <folder>` prints nothing.
- [x] T009 Name `--reports` in the cli-mistral-vibe root block, bumping 1.0.11.0 to 1.0.12.0 (`.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -n -- '--reports .skilled' <file>` prints one line.
- [x] T010 Add the `Skip blocker:` line to the live-probe scenario contract (`.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/fanout/adapter-stress-cells.md`). Verify: `rg -n 'Skip blocker' <file>` prints one line.
- [x] T011 Document `--reports` in the mode SKILL.md (version 1.3.0.0), its template (version 1.0.3.0) and changelog `v1.3.0.0.md` (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/`). Verify: `rg -n '^version: 1.3.0.0' SKILL.md` prints one line, and `rg -n -- '--reports' SKILL.md` prints the paragraph.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the three mode test files (`record-playbook-run.test.cjs`, `run-conversation-scenario.test.cjs`, `validate-playbook-package.test.cjs`). Verify: each exits 0; the runner reports `fail 0`.
- [x] T013 Run the package validator on the three roots (`scripts/validate-playbook-package.cjs --package <root>`). Verify: each prints `violations=0` and exits 0.
- [x] T014 Dry run the recorder into the sk-code hub with `ci-surface-ci-standards`, without writing (`scripts/record-playbook-run.cjs --dry-run`). Verify: exits 0, and `git -c core.fsmonitor=false status --short -- .skilled/skills/sk-code/benchmark` prints nothing.
- [x] T015 Run `validate.sh --strict` on this child, the parent, 001 and 002, and read each `RESULT:` line. Verify: each prints `RESULT: PASSED`.
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4, REQ-001 to REQ-004.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: Node.js ran all three suites (T012).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: no linter was run for these scripts in this phase; the three test suites exit 0 (T012).
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the recorder test output shows five PASS lines and the runner test reports `fail 0` (T012).
- [x] CHK-012 [P1] Error handling implemented. Evidence: `resolveReports` refuses before any write (recorder, the function body after its doc comment), and `runHubReports` covers both refusals.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: `--reports` sits in the recorder's option table with the existing `--results` and `--runner-out` options.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md AC-001 to AC-005, each Met.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the sk-code dry run (T014) exits 0 and writes nothing.
- [x] CHK-022 [P1] Edge cases tested. Evidence: `runHubReports` refuses a path that does not end in `benchmark/reports` and a foreign reports folder.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the foreign reports folder is refused and not created, asserted by `runHubReports`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: a pattern scan (`api_key`, `secret`, `password`, `bearer`, `token=`, `sk-` and `ghp_` strings) over the added diff lines of the changed roots and over the two new report folders, the reports index and the changelog finds no match.
- [x] CHK-031 [P0] Input validation implemented. Evidence: `resolveReports` checks the path shape and the owner before any write.
- [x] CHK-032 [P1] Auth/authz. N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: validate.sh --strict printed RESULT: PASSED for this child, the parent, 001 and 002 (T015).
- [x] CHK-041 [P1] Code comments adequate. Evidence: `resolveReports` carries its own doc comment above the function.
- [x] CHK-042 [P2] README updated. N/A: the mode README names "the owning skill" at its save step (line 86), and that sentence still holds. A `--reports` line there would be an optional follow-up outside the operator's list.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files outside the repository. Evidence: test temp folders use `os.tmpdir()`, and the dry-run input CSV sits in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` in this child holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
