---
title: "Tasks: Phase 3: alignment-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: alignment-fixes

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

- [x] T001 Merge both runs' findings into one list of distinct fixes (`~/.local/state/local-{skilled,doc}-alignment/541-own-all-doctor-commands/*/findings.json`). Verify: each fix names one file and one line.
- [x] T002 Scaffold this phase under the 008 parent (`003-alignment-fixes/`). Verify: `ls specs/system-skilled-doctor/008-own-all-doctor-commands/003-alignment-fixes` lists `spec.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Point seven `skill_owner` lines at system-skilled-doctor (`.skilled/commands/doctor/assets/`). Verify: `grep -n '^skill_owner' *.yaml | grep -v system-skilled-doctor` prints nothing.
- [x] T004 [P] Correct the command and scenario counts (`README.md`, `system-skilled-doctor/README.md`, `routing/moved-command-contract.md`). Verify: `rg -n 'owns eleven doctor|holds 13 scenarios'` prints nothing.
- [x] T005 [P] Complete the doctor-commands scope table, legs and placement map (`doctor-commands/README.md`). Verify: the table lists DOC-407 to DOC-410 and six legs.
- [x] T006 [P] Fix the root playbook's runs path, fixture count and catalog sentence (`manual-testing-playbook.md`). Verify: `rg -n '.skilled/release/runs'` prints nothing there.
- [x] T007 Rewrite four routing scenarios to the live brief (`doctor-routing-{setup-onboarding,env-prompt,helper-handoff,contested-second-line}.md`). Verify: each scenario's hook command prints the line it now expects.
- [x] T008 Move DOC-409 to the engine's state paths (`doctor-update-apply-conversation.md`). Verify: `grep -c 'release/'` prints 0.
- [x] T009 [P] Set four scenarios' `expected_workflow_mode` to `UNKNOWN` like their siblings. Verify: `grep -h '^expected_workflow_mode' doctor-commands/*.md | sort | uniq -c` prints one value.
- [x] T010 [P] Name the scenarios that stay with their skill, and drop moved IDs (`sk-code`, `sk-code-ci` playbooks, `sk-git` catalog, `system-spec-kit` catalog overview). Verify: `rg -n 'DOC-38[23]' sk-code/manual-testing-playbook` hits only the test-source table.
- [x] T011 Add six skill-setup phrases to stage two (`system-skilled-doctor/ROUTER.md`). Verify: a replay of `INTENT_SIGNALS` maps each phrase to `DOCTOR_COMMANDS` and an unrelated prompt to no intent.
- [x] T012 Pin the doctor index in the provenance scan (`playbook-provenance-paths.vitest.ts`). Verify: the test fails with the index's provenance line removed and passes with it restored.
- [x] T013 Pin the deep-loop doctor on a writing-about prompt and the typed skill-setup command (`multi-typed-command-gates.vitest.ts`, `command-attach.vitest.ts`). Verify: both files pass.
- [x] T014 Extend the three open changelog entries (`system-skilled-doctor` v1.3.0.0, `system-skill-advisor` v2.0.5.0, `skilled` v4.2.0.0). Verify: `validate_document.py` prints `Total issues: 0` for each.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Rerun the phase 2 gates (`scratch/gates/`). Verify: `run-all.sh` prints `7 suite(s) passed, 0 failed`; spec-kit root vitest `1365 passed | 11 skipped`; advisor vitest `3206 passed | 4 skipped`.
- [x] T016 Rerun the alignment recheck (`~/.local/state/local-skilled-alignment/.../20261124T213537Z/recheck.md`). Verify: `resolved=15 still_open=2 new=0`, the two open rows outside this branch.
- [x] T017 Validate the packet (`validate.sh --strict --recursive`). Verify: prints `RESULT: PASSED`.
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
- [x] CHK-003 [P1] Dependencies identified and available: the built advisor runtime in the worktree
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The sk-code quality gate exits 0 on the three test files, with comment hygiene, conflict markers and secrets clean
- [x] CHK-011 [P0] The doctor, advisor and spec-kit root suites pass
- [x] CHK-012 [P1] N/A: no runtime error path changed
- [x] CHK-013 [P1] The new tests follow the file's existing case and comment style
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The four routing scenarios' hook commands print the lines they expect
- [x] CHK-022 [P1] Edge case: DOC-406 takes prompts that still reach the helper hand-off, since bridges now catch the old ones
- [x] CHK-023 [P1] Error scenario: the provenance test fails with the index line removed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`, docs and metadata that restate the owner rows.
- [x] CHK-FIX-002 [P0] Same-class inventory: `grep '^skill_owner'` over every doctor workflow and an `rg` sweep for each stale phrase.
- [x] CHK-FIX-003 [P0] Consumer inventory: listed in `plan.md` affected surfaces.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix: four routing scenarios by brief head and companion line, each replayed live.
- [x] CHK-FIX-006 [P1] N/A: no test reads new process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the uncommitted worktree diff on top of `4db9cef56bc`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] N/A: no input surface changed
- [x] CHK-032 [P1] N/A: no auth surface changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments keep the durable why
- [x] CHK-042 [P2] README updated: root and skill READMEs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the gate evidence the summary cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---
