---
title: "Tasks: Phase 11: Regeneration and verification"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "regeneration and verification tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: Regeneration and verification

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

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: the phase acts on the research's §9 row for this phase, regenerate and verify against the phase 002 baseline. Both drift counts from §8 were rechecked by script and read 0 (`scratch/after.md` §5).
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: `scratch/before.md` §1 records 36 of 38 gates at exit 0 and the two failures with their causes, and §2 the five red CI jobs on main.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: each task below names its command, and `scratch/after.md` records each command's output line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Regenerate every derived surface. Evidence: every generator ran in write mode and wrote nothing, apart from the one manifest a restored line changed (`scratch/after.md` §1).
- [x] T005 Rerun the baseline gates and write the delta report. Evidence: `scratch/after.md` §2 sets each phase 002 gate beside its baseline reading and states the delta.
- [x] T006 Bump versions and changelogs. Evidence: no skill changed in this phase except `cli-claude-code`, whose restored bullet is recorded in its existing `changelog/v1.5.6.0.md`, so no new version was needed. The prose sweep stepped every other changed skill in phase 010.
- [x] T007 Run the mirror checks. Evidence: `scratch/after.md` §4: the Hermes, runtime-mirror and agent-mirror checks all pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §2, all 38 gates at exit 0, none worse than `scratch/before.md`.
- [x] T009 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
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
- **Research**: See `../001-deep-research/research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md §4, REQ-001 to REQ-003.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md, regenerate then verify against the baseline.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: phases 001 to 010 are Complete, and the plugin-move breakage on main was fixed first (`scratch/after.md` §3).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: the changed scripts are `check-gate-inputs.sh` and five tests. `check-gate-inputs: 61 passed, 0 failed`, and each changed test passes with its own runner (`scratch/after.md` §3).
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §2, 38 of 38 at exit 0.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: `router-reach` reports `operator-local=0`. The new ignore line names a shared folder, not a private entry.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: no routing shape changed. `package_skill.py --check --strict` passes on all 13 roots, and `compiled-route-guard` reports 0 failures.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: 3 of 3 criteria Met, and acceptance-criteria.md reads `Closeable: Yes`.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/before.md` and `scratch/after.md`.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: not applicable as written. The phase changed no large file. Its edits are one restored bullet, five test paths, one checker rule and one ignore line.
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: each fix is one commit, `20d345fa06` and `ac29b2694f`, so a revert returns the gate it fixed to the state in `scratch/before.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets. The changes are paths, one checker rule, test cases and prose.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: the checker change has two new cases: an OpenCode-only filter passes, and a near-miss path still needs its twin.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec, plan, tasks, acceptance-criteria and implementation-summary all read Complete.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: see T006.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: raw logs in `.scratch-dc90/072-011/`, and the two records under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
