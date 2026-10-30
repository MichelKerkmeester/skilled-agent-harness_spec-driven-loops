---
title: "Tasks: Phase 10: verification-and-release"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "verification and release tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 10: verification-and-release

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

`OUT` is this folder's `scratch/after.md`. `PS` is `python3 .skilled/skills/sk-doc/scripts/package_skill.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load the phase 1 strict baseline (`../001-check-engine/scratch/baseline/`). Verify: the file lists one verdict per shipped root.
- [ ] T002 Confirm phases 1 to 9 are closed. Verify: `validate.sh --strict` prints `RESULT: PASSED` for each child.
- [ ] T003 [P] Confirm the phase 5 temp-repo harness runs. Verify: its setup command exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run `PS <root> --check --strict` on every shipped skill, skipping `local-` roots (`OUT`). Verify: each verdict matches the phase 1 baseline.
- [ ] T005 [P] Run `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` without `--write` (`OUT`). Verify: 155/195, 49/66, 19/24.
- [ ] T006 [P] Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep ^total` (`OUT`). Verify: prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`.
- [ ] T007 [P] Run `bash .skilled/commands/doctor/scripts/tests/run-all.sh` (`OUT`). Verify: every suite prints PASS.
- [ ] T008 In the temp-repo harness, run a full `/doctor:sk-skill convert` on a scratch plain skill with an invented name. Verify: `PS <skill> --check --strict` prints `Result: PASS` and `ls .skilled/changelog/<name>/v<version>.md` resolves.
- [ ] T009 In the same harness, run a full convert on a copy of `sk-git` at `ca10a236d2^` under an invented name. Verify: strict PASS, a resolving changelog link, and `parseRouter` equal before and after.
- [ ] T010 [P] Check the setup listing (`.skilled/commands/doctor/assets/doctor-setup-presentation.txt`). Verify: `rg -c "doctor:sk-skill"` prints 2 and a `/doctor:setup` run shows both rows.
- [ ] T011 [P] Run `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` and `bash .skilled/commands/doctor/scripts/route-validate.sh`. Verify: `Total issues: 0`, exit 0 for both.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Confirm the worktree holds no scratch skill. Verify: `git status --porcelain` shows no path under `.skilled/skills/` or `.skilled/changelog/` from T008 or T009.
- [ ] T013 Write the framework release entry through create-changelog (`.skilled/changelog/skilled/v<next>.md`). Verify: `validate_document.py <entry> --type changelog` exits 0.
- [ ] T014 After the operator merges, read CI on main. Verify: `gh run list --branch main --commit <merge-sha>` shows every run `success` or switched off.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: `OUT` holds every check with output and exit code
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: `../scratch/design.md` sections 5 and 7
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

A failed check is marked `[B]` with the owning phase named; a P0 item never closes blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 1 baseline loaded
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every shipped skill keeps its baseline strict verdict
- [ ] CHK-011 [P0] `run-all.sh` passes
- [ ] CHK-012 [P1] The router passes `validate_document.py --type command`
- [ ] CHK-013 [P1] The presentation passes `route-validate.sh` menu parity
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Scorer and replay baselines unchanged
- [ ] CHK-022 [P0] Both scratch conversions end strict PASS with a resolving changelog link
- [ ] CHK-023 [P1] CI green on main
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: verification phase; it fixes no reported finding.

- [ ] CHK-FIX-001 [P2] N/A: no finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No `local-` root in the strict run or the scratch conversions
- [ ] CHK-031 [P0] The scorer baseline ran without `--write`
- [ ] CHK-032 [P1] No secret appears in `OUT`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Framework release changelog written through create-changelog
- [ ] CHK-042 [P2] Parent packet status updated after close
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Results live in `scratch/after.md`; scratch skills only in the temp repo
- [ ] CHK-051 [P1] scratch/ cleaned of everything but `after.md` before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 9 | 0/9 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



