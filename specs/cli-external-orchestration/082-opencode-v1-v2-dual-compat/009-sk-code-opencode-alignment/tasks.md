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

- [ ] T001 Read the 002 to 008 diffs with `git status --short` and `git diff --stat`, then list every changed code file in `findings.md` (orchestrator)
- [ ] T002 Reconcile the Files to Change table in `spec.md` with the list from T001 (`spec.md`)
- [ ] T003 Create `findings.md` with the header `| ID | File | Severity | Class | Status | Evidence |` and one row per changed file (`findings.md`)
- [ ] T004 [P] Copy each suite's pass count from the phase 001 baseline into `findings.md` (`../001-unknowns-and-baseline/baseline.json`)
- [ ] T005 [P] Save a pre-fix copy of each changed file under `scratch/pre-fix/` (`scratch/pre-fix/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Review

- [ ] T006 Run `run-all-drift-guards.sh` and `check-comment-hygiene.sh` on each changed file, and record every exit status in `findings.md` (orchestrator)
- [ ] T007 Review the changed JavaScript files findings-first against the sk-code-opencode JavaScript checklist. Return text and write nothing (`.opencode/plugins/`, `.skilled/hooks/dispatch/lib/`, `fanout-run.cjs`, `.skilled/skills/sk-vision/vision-runtime/src/`) (DeepSeek through cli-devin)
- [ ] T008 Review the changed shell and config files findings-first against the shell and config checklists. Return text and write nothing (`opencode-setup.sh`, `hard-rules.json`, the phase 008 workflow YAML) (DeepSeek through cli-devin)
- [ ] T009 Record each returned finding as one row in `findings.md` (orchestrator)
- [ ] T010 Read each cited line, confirm or reject each finding, then assign its severity and finding class (`findings.md`) (orchestrator)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Fix

- [ ] T011 Inventory same-class producers and consumers for each finding class that has a P0 or P1 row, and save the `rg` output in `findings.md` (orchestrator)
- [ ] T012 Fix the JavaScript P0 and P1 rows in one file group, editing only the files named in the rows (changed JavaScript files) (Luna through cli-codex)
- [ ] T013 Add adversarial table tests for each path, parser, redaction or security fix (the test folder of the fixed file) (Luna through cli-codex)
- [ ] T014 Fix the shell and config P0 and P1 rows, editing only the files named in the rows (changed shell and config files) (Luna through cli-codex)
- [ ] T015 Review each fix diff against the finding it claims to close. Return text and write nothing (DeepSeek through cli-devin)
- [ ] T016 Rerun the gate or suite that each finding names, then mark its row Closed in `findings.md` (orchestrator)
- [ ] T017 Raise any fix that needs a file outside the Files to Change table as an amendment before editing (`spec.md`) (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [ ] T018 Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` and record its exit status and summary line (orchestrator)
- [ ] T019 Run `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` on each changed code file in the final set, and record each exit status (orchestrator)
- [ ] T020 Rerun every suite that phases 002 to 008 touched, and compare each pass count with the baseline in `findings.md` (orchestrator)
- [ ] T021 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/009-sk-code-opencode-alignment --strict` and record its RESULT line (orchestrator)
- [ ] T022 Fill the Verification table in `implementation-summary.md` with the outputs from T018 to T021 (`implementation-summary.md`) (orchestrator)
- [ ] T023 Clear the contents of `scratch/` and keep `.gitkeep` (`scratch/`) (orchestrator)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No open P0 or P1 row in `findings.md`
- [ ] Gate outputs from T018 to T021 recorded in `implementation-summary.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Check: `grep -c 'REQ-00' spec.md` prints 7 or more.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Check: `grep -c 'Ordered Steps and Dispatch Plan' plan.md` prints 1.
- [ ] CHK-003 [P1] Dependencies identified and available. Check: `test -f ../001-unknowns-and-baseline/baseline.json` exits 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Drift guards pass. Check: `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0.
- [ ] CHK-011 [P0] Comment hygiene passes on each changed code file. Check: `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>` exits 0 for every file in the final set.
- [ ] CHK-012 [P1] Error handling implemented for each fix. Check: the adversarial tests from T013 pass under `node --test <test file>`.
- [ ] CHK-013 [P1] Code follows the sk-code-opencode checklists. Check: the reviews from T007, T008 and T015 record no open P0 or P1 row.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Check: `grep -c '| Unmet |' acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] Gate outputs read before the claim. Check: T018 to T021 outputs and exit statuses appear in `implementation-summary.md`.
- [ ] CHK-022 [P1] Edge cases tested. Check: the parser adversarial cases in `plan.md` pass under `node --test <parser test file>`.
- [ ] CHK-023 [P1] Error scenarios validated. Check: each failed dispatch was retried once and its retry is recorded in `findings.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a class. Check: every row in `findings.md` names one of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Check: the T011 `rg` output for each class is saved in `findings.md`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. Check: the T011 consumer output is saved in `findings.md`.
- [ ] CHK-FIX-004 [P0] Security, path, parser and redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases. Check: each such fix names its test file in `findings.md`.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Check: the `findings.md` header states the row count.
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed for each suite that reads process-wide state. Check: `env -i PATH="$PATH" node --test <test file>` passes.
- [ ] CHK-FIX-007 [P1] Evidence pinned to an explicit diff range, not a moving branch range. Check: `findings.md` names the pre-fix copies in `scratch/pre-fix/` as the range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Check: the T007 and T008 reviews record no secret literal in a changed file.
- [ ] CHK-031 [P0] Input validation implemented. Check: the parser adversarial tests from CHK-022 pass.
- [ ] CHK-032 [P1] Dispatch keeps `run --standalone` for v2 children (D3). Check: `rg -n -- '--standalone' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` returns the v2 branch.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized. Check: each of the three files names the same Files to Change rows.
- [ ] CHK-041 [P1] Code comments adequate. Check: CHK-011 passes on every changed file.
- [ ] CHK-042 [P2] README updated (if applicable). Check: not applicable here, because docs belong to phase 010.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Check: `git status --short` lists only the changed code files and this folder.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Check: `ls -A scratch/` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
