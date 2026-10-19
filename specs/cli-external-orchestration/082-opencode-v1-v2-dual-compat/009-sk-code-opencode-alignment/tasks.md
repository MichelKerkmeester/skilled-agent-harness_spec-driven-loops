---
title: "Tasks: Phase 9: sk-code-opencode-alignment"
description: "Ordered review, fix and gate tasks that align the code changed in phases 002 to 008 with the sk-code OPENCODE surface."
trigger_phrases:
  - "sk code opencode alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: sk-code-opencode-alignment

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

Each task names its executor in brackets at the end of its line when it is not the orchestrator. Luna runs through cli-codex and DeepSeek runs through cli-devin.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the 002 to 008 diffs with `git status --short` and `git diff --stat`, then list every changed code file in `findings.md` (orchestrator) Evidence: `git diff --name-status -M 867b83b671 23756e8776` outside specs/, 121 files and 75 code files (scratch/inventory-all.txt, inventory-code.txt, decision 1).
- [x] T002 Reconcile the Files to Change table in `spec.md` with the list from T001 (`spec.md`) Evidence: spec.md Files to Change reconciled, with the amendment rows (decisions 5 and 7).
- [x] T003 Create `findings.md` with the header `| ID | File | Severity | Class | Status | Evidence |` and one row per changed file (`findings.md`) Evidence: findings.md, 75 changed-file rows and 26 findings.
- [x] T004 [P] Copy each suite's pass count from the phase 001 baseline into `findings.md` (`../001-unknowns-and-baseline/baseline.json`) Evidence: findings.md Baseline table; three counts from baseline.json and the rest from each phase's verification table (decision 2).
- [x] T005 [P] Save a pre-fix copy of each changed file under `scratch/pre-fix/` (`scratch/pre-fix/`) Evidence: a copy of each file before its first fix under scratch/pre-fix/, renamed `.orig` so no runner finds them, removed at closeout with the range pinned to `git diff 23756e8776` (decisions 10 and 12).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Review

- [x] T006 Run `run-all-drift-guards.sh` and `check-comment-hygiene.sh` on each changed file, and record every exit status in `findings.md` (orchestrator) Evidence: drift exit 0, 4 guards passed (scratch/gates/drift-before.txt); hygiene 71 exit 0 and 4 exit 2 (gates/hygiene-before.txt, decision 3).
- [x] T007 Review the changed JavaScript files findings-first against the sk-code-opencode JavaScript checklist. Return text and write nothing (`.opencode/plugins/`, `.skilled/hooks/dispatch/lib/`, `fanout-run.cjs`, `.skilled/skills/sk-vision/vision-runtime/src/`) (DeepSeek through cli-devin) Evidence: DeepSeek reviewed the 002 to 006 JavaScript and TypeScript (scratch/review-plugins-deepseek.txt, review-runtime-deepseek.txt, review-vision-deepseek.txt); Luna reviewed the 007 and 008 code (review-luna.txt), per decision 0.
- [x] T008 Review the changed shell and config files findings-first against the shell and config checklists. Return text and write nothing (`opencode-setup.sh`, `hard-rules.json`, the phase 008 workflow YAML) (DeepSeek through cli-devin) Evidence: Luna reviewed opencode-setup.sh, the battery and the workflow, and DeepSeek reviewed hard-rules.json and both package.json files (review-luna.txt, review-runtime-deepseek.txt); TOML and JSON parse (gates/config-parse.txt).
- [x] T009 Record each returned finding as one row in `findings.md` (orchestrator) Evidence: findings.md, F-01 to F-22 from the four reviews.
- [x] T010 Read each cited line, confirm or reject each finding, then assign its severity and finding class (`findings.md`) (orchestrator) Evidence: findings.md classes and severities; three rulings differ from the reviewers (decision 4).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Fix

- [x] T011 Inventory same-class producers and consumers for each finding class that has a P0 or P1 row, and save the `rg` output in `findings.md` (orchestrator) Evidence: scratch/inventories.txt.
- [x] T012 Fix the JavaScript P0 and P1 rows in one file group, editing only the files named in the rows (changed JavaScript files) (Luna through cli-codex) Evidence: batches 1, 2, 4 and 5 (p009-fix-b1, b2, b4, b5); DeepSeek wrote them (decision 0).
- [x] T013 Add adversarial table tests for each path, parser, redaction or security fix (the test folder of the fixed file) (Luna through cli-codex) Evidence: table tests in source-root-consumers.test.cjs, the two doctor test files, plugin.test.ts and dispatch-audit.test.mjs (findings.md F-01, F-03, F-04, F-26).
- [x] T014 Fix the shell and config P0 and P1 rows, editing only the files named in the rows (changed shell and config files) (Luna through cli-codex) Evidence: batch 3, `.gitignore` and the census row (decisions 7 and 8); no shell P0 or P1 was found.
- [x] T015 Review each fix diff against the finding it claims to close. Return text and write nothing (DeepSeek through cli-devin) Evidence: Luna's fix review and verify (scratch/review-fix-luna.txt FAIL, then review-fix-verify-luna.txt PASS).
- [x] T016 Rerun the gate or suite that each finding names, then mark its row Closed in `findings.md` (orchestrator) Evidence: each row closed after the orchestrator's own rerun (decision 8, decision 9, decision 10, findings.md Dispatch log).
- [x] T017 Raise any fix that needs a file outside the Files to Change table as an amendment before editing (`spec.md`) (orchestrator) Evidence: legacy-projection-manifest.ts, `.gitignore` and the census row, raised as amendments before the edit (decisions 5 and 7).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [x] T018 Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` and record its exit status and summary line (orchestrator) Evidence: exit 0, `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)`, twice (scratch/gates/drift-after.txt).
- [x] T019 Run `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` on each changed code file in the final set, and record each exit status (orchestrator) Evidence: 73 files exit 0, 4 TOML and YAML files exit 2 and are hand-checked (gates/hygiene-after.txt, decision 11).
- [x] T020 Rerun every suite that phases 002 to 008 touched, and compare each pass count with the baseline in `findings.md` (orchestrator) Evidence: every suite exits 0 at or above its baseline (scratch/suites-after/, findings.md Results).
- [x] T021 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/009-sk-code-opencode-alignment --strict` and record its RESULT line (orchestrator) Evidence: `RESULT: PASSED` at closeout.
- [x] T022 Fill the Verification table in `implementation-summary.md` with the outputs from T018 to T021 (`implementation-summary.md`) (orchestrator) Evidence: implementation-summary.md Verification table.
- [x] T023 Clear the contents of `scratch/` and keep `.gitkeep` (`scratch/`) (orchestrator) Amended, as phases 2 to 8 amended it: scratch/ keeps the cited captures and removes the working files. Evidence: scratch/pre-fix/ removed at closeout (decision 12).
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No open P0 or P1 row in `findings.md`
- [x] Gate outputs from T018 to T021 recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Check: `grep -c 'REQ-00' spec.md` prints 7 or more. Evidence: 7 REQ rows in spec.md.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Check: `grep -c 'Ordered Steps and Dispatch Plan' plan.md` prints 1. Evidence: plan.md holds the heading.
- [x] CHK-003 [P1] Dependencies identified and available. Check: `test -f ../001-unknowns-and-baseline/baseline.json` exits 0. Evidence: baseline.json exists; three counts there, the rest from each phase (findings.md Baseline).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Drift guards pass. Check: `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0. Evidence: exit 0, all 4 guards passed (scratch/gates/drift-after.txt).
- [x] CHK-011 [P0] Comment hygiene passes on each changed code file. Check: `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>` exits 0 for every file in the final set. Evidence: exit 0 on the 73 code files the checker reads; the 4 TOML and YAML files are hand-checked (decision 11).
- [x] CHK-012 [P1] Error handling implemented for each fix. Check: the adversarial tests from T013 pass under `node --test <test file>`. Evidence: the new table tests pass in the plugin, doctor, sk-vision and guard suites (scratch/suites-after/).
- [x] CHK-013 [P1] Code follows the sk-code-opencode checklists. Check: the reviews from T007, T008 and T015 record no open P0 or P1 row. Evidence: findings.md has no open P0 or P1; Luna's verify is PASS.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Check: `grep -c '| Unmet |' acceptance-criteria.md` prints 0. Evidence: acceptance-criteria.md has no Unmet row.
- [x] CHK-021 [P0] Gate outputs read before the claim. Check: T018 to T021 outputs and exit statuses appear in `implementation-summary.md`. Evidence: implementation-summary.md Verification table.
- [x] CHK-022 [P1] Edge cases tested. Check: the parser adversarial cases in `plan.md` pass under `node --test <parser test file>`. Evidence: the five parser cases pass in opencode-version-battery.test.cjs (28 of 28) and dispatch-audit.test.mjs (106 of 106), finding F-26.
- [x] CHK-023 [P1] Error scenarios validated. Check: each failed dispatch was retried once and its retry is recorded in `findings.md`. Evidence: no dispatch failed, so none was retried (findings.md Dispatch log).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a class. Check: every row in `findings.md` names one of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. Evidence: every findings.md row names one class.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Check: the T011 `rg` output for each class is saved in `findings.md`. Evidence: scratch/inventories.txt.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Check: the T011 consumer output is saved in `findings.md`. Evidence: scratch/inventories.txt, F-01 and F-02 consumer blocks.
- [x] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. Check: each such fix names its test file in `findings.md`. Evidence: findings.md F-01, F-03, F-04 and F-26 name their test files.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Check: the `findings.md` header states the row count. Evidence: findings.md header, 75 file rows and 26 findings.
- [x] CHK-FIX-006 [P1] Hostile environment variant executed for each suite that reads process-wide state. Check: `env -i PATH="$PATH" node --test <test file>` passes. Evidence: each changed test file exits 0 under `env -i` (scratch/gates/hostile-env.txt).
- [x] CHK-FIX-007 [P1] Evidence pinned to an explicit diff range, not a moving branch range. Check: `findings.md` names the pre-fix copies in `scratch/pre-fix/` as the range. Evidence: the range is `git diff 23756e8776` against the phase commit (decision 12).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Check: the T007 and T008 reviews record no secret literal in a changed file. Evidence: no review reports a secret literal; the battery outputs hold no password (gates/battery-both.txt).
- [x] CHK-031 [P0] Input validation implemented. Check: the parser adversarial tests from CHK-022 pass. Evidence: CHK-022's parser cases pass.
- [x] CHK-032 [P1] Dispatch keeps `run --standalone` for v2 children (D3). Check: `rg -n -- '--standalone' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` returns the v2 branch. Evidence: `--standalone` is at fanout-run.cjs:2407-2410, the v2 branch (review-runtime-deepseek.txt, frozen-rule checks).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Check: each of the three files names the same Files to Change rows. Evidence: spec.md Files to Change, tasks T012 to T017 and findings.md name the same fix files.
- [x] CHK-041 [P1] Code comments adequate. Check: CHK-011 passes on every changed file. Evidence: CHK-011.
- [x] CHK-042 [P2] README updated (if applicable). Check: not applicable here, because docs belong to phase 010. Not applicable: docs belong to phase 010. The compiled README line with the old manifest path goes to 010 (decision 5).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Check: `git status --short` lists only the changed code files and this folder. Evidence: `git status --short` lists only the fix files, this folder, the census row and the two untracked files kept out of every commit.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Check: `ls -A scratch/` prints only `.gitkeep`. Amended, as phases 2 to 8 amended it: scratch/ keeps the cited captures and removes the working files (scratch/pre-fix/ at closeout, decision 12).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 (CHK-051 amended) |
| P2 Items | 1 | 1/1 (not applicable, docs are phase 010's) |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->
