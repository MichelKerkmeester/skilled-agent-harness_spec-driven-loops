---
title: "Tasks: Phase 11: two-version-proof-and-closeout"
description: "Ordered proof, claim and closeout tasks that run the whole tree on OpenCode 1.19.3 and 2.0.32, record the scoped claim and reconcile the packet."
trigger_phrases:
  - "two version proof and closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: two-version-proof-and-closeout

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

Each task names its executor in brackets at the end of its line when it is not the orchestrator. DeepSeek runs through cli-devin with the markdown persona inlined. Luna runs through cli-codex.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read `../001-unknowns-and-baseline/baseline.json` and create `proof.md` with one row for each suite and its baseline count (`proof.md`) (orchestrator)
- [ ] T002 Record the output of `opencode --version` and `opencode2 --version` in `proof.md` (`proof.md`) (orchestrator)
- [ ] T003 [P] Save a pre-claim copy of `cli-opencode/SKILL.md`, its README and its references under `scratch/pre-claim/` (`scratch/pre-claim/`) (orchestrator)
- [ ] T004 [P] Save a pre-reconcile copy of the parent `spec.md`, the parent `goal.md` and each child's `implementation-summary.md` and `acceptance-criteria.md`, under `scratch/pre-reconcile/` (`scratch/pre-reconcile/`) (orchestrator)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Proof

- [ ] T005 Run each plugin test file named in the baseline with `node --test`, and record each pass count in `proof.md` (orchestrator)
- [ ] T006 Run `node --test .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`, and record each pass count in `proof.md` (orchestrator)
- [ ] T007 Run the cli-opencode suite named in the baseline, and run `npm test` in `.skilled/skills/system-deep-loop/runtime/`. Record each pass count in `proof.md` (orchestrator)
- [ ] T008 Run `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` against OpenCode 1.19.3, repeat until the count is stable and record the exit status and output in `proof.md` (orchestrator)
- [ ] T009 Run `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` against OpenCode 2.0.32, repeat until the count is stable and record the exit status and output in `proof.md`. Never restart or stop the v2 background service (orchestrator)
- [ ] T010 Compare every count with the baseline and record the delta in `proof.md`. Stop here, and route the failure to its owning phase, if a count is below its baseline or a battery exits non-zero (orchestrator)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Claim

- [ ] T011 Write the D8 claim into `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`, with the verification date from T008 and T009. Add the same wording to the README and references where they name a version (`cli-opencode/SKILL.md`) (DeepSeek through cli-devin, persona inlined)
- [ ] T012 Review the claim text against D8 and return findings only. Flag any word that claims more than the two pinned versions (`cli-opencode/SKILL.md`) (Luna through cli-codex)
- [ ] T013 Fix each finding from T012 with the minimal edit, if T012 returns any (`cli-opencode/SKILL.md`) (DeepSeek through cli-devin)
- [ ] T014 Run `validate_document.py` with the skill type on `cli-opencode/SKILL.md` and `validate_skill_package.py` on the cli-opencode folder and record each exit status in `proof.md` (orchestrator)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Reconcile and Close

- [ ] T015 Update the parent phase map statuses so that each child's status matches its `implementation-summary.md` (`../spec.md`) (orchestrator)
- [ ] T016 Add the closeout entry to the parent log, and leave the parent directive unchanged (`../goal.md`) (orchestrator)
- [ ] T017 Fill the Evidence cell of each acceptance row in phases 001 to 010 with the observed output and exit status (each child's `acceptance-criteria.md`) (orchestrator)
- [ ] T018 Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict`, and record the RESULT line in `proof.md` (orchestrator)
- [ ] T019 Run `git status --short` and confirm that only the files named in `spec.md` changed. Then clear `scratch/` except `.gitkeep` (orchestrator)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Every suite at or above its baseline, and both battery runs exit 0
- [ ] Recursive strict validation prints `RESULT: PASSED`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md. Check: `grep -c 'REQ-00' spec.md` prints 6 or more.
- [ ] CHK-002 [P0] Technical approach defined in plan.md. Check: `grep -c 'Ordered Steps and Dispatch Plan' plan.md` prints 1.
- [ ] CHK-003 [P1] Phases 001 to 010 closed. Check: `grep -n 'Status' ../0[0-9][0-9]-*/implementation-summary.md` shows Complete for each of the ten children.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Proof Quality

- [ ] CHK-010 [P0] Every suite at or above its baseline count. Check: each count in `proof.md` is greater than or equal to its row in `../001-unknowns-and-baseline/baseline.json`.
- [ ] CHK-011 [P0] Doctor battery exits 0 on OpenCode 1.19.3. Check: the exit status from T008 is 0.
- [ ] CHK-012 [P0] Doctor battery exits 0 on OpenCode 2.0.32. Check: the exit status from T009 is 0.
- [ ] CHK-013 [P0] Recursive strict validation prints `RESULT: PASSED`. Check: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Check: `grep -c '| Unmet |' ../0[0-9][0-9]-*/acceptance-criteria.md` prints 0 for every child, and for this folder.
- [ ] CHK-021 [P1] Evidence present on every Met row. Check: each Met row in each child's acceptance table has a non-empty Evidence cell that shows observed output.
- [ ] CHK-022 [P1] Scoped claim present. Check: `grep -n 'Verified against OpenCode 1.19.3 and 2.0.32 on' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` prints one line.
- [ ] CHK-023 [P1] Completion state reconciled. Check: the parent phase map in `../spec.md` and each child's `implementation-summary.md` show the same status.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase fixes no code.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No install change and no service restart (D4). Check: `proof.md` shows no `upgrade --major` command and no service restart or stop command.
- [ ] CHK-031 [P1] No secret value in `proof.md`. Check: a read of `proof.md` finds no provider key and no session token.
- [ ] CHK-032 [P1] Claim names only the two pinned versions (D8). Check: the claim line names OpenCode 1.19.3 and 2.0.32 and one verification date, and no other version.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized. Check: each of the three files names `proof.md` as the proof record.
- [ ] CHK-041 [P1] Claim validates. Check: the exit status from T014 is 0 for `validate_document.py` and for `validate_skill_package.py`.
- [ ] CHK-042 [P2] Parent directive unchanged. Check: `git diff -- ../goal.md` shows changes only in the log section.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only. Check: `git status --short` lists only the files named in `spec.md`.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Check: `ls -A scratch/` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-18
<!-- /ANCHOR:summary -->
