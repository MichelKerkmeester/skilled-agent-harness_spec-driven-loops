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

- [x] T001 Load the phase 1 strict baseline (`../001-check-engine/scratch/baseline/`). Verify: the file lists one verdict per shipped root. Evidence: `package-skill.json` and `ci-skill-root-metadata.json` both declare `rootCount: 13` and hold 13 results, every one `valid: true` (exit 0) or `status: pass` (exit 0) (`scratch/after.md` T001).
- [x] T002 Confirm phases 1 to 9 are closed. Verify: `validate.sh --strict` prints `RESULT: PASSED` for each child. Evidence: nine children, nine `RESULT: PASSED`, every exit 0 (`scratch/after.md` T002).
- [x] T003 [P] Confirm the phase 5 temp-repo harness runs. Verify: its setup command exits 0. Evidence: `node --test .skilled/commands/doctor/scripts/tests/sk-skill-integrate.test.cjs` printed `tests 25 / pass 25 / fail 0` and exited 0 (`scratch/after.md` T003).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run `PS <root> --check --strict` on every shipped skill, skipping `local-` roots (`OUT`). Verify: each verdict matches the phase 1 baseline. Evidence: 13 of 13 shipped roots printed `Result: PASS` and exited 0, the same verdicts the baseline recorded, and no `local-` root was in the target list (`scratch/after.md` T004).
- [x] T005 [P] Run `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` without `--write` (`OUT`). Verify: 155/195, 49/66, 19/24. Evidence: exit 0, `full_corpus_top1` 155/195, `holdout_top1` 49/66 and `ambiguity_top1` 19/24 at `tau` 0.03, with no `--write` on the command line (`scratch/after.md` T005).
- [x] T006 [P] Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs | grep ^total` (`OUT`). Verify: prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`. Evidence: the replay exited 0 and the line matched character for character (`scratch/after.md` T006).
- [x] T007 [P] Run `bash .skilled/commands/doctor/scripts/tests/run-all.sh` (`OUT`). Verify: every suite prints PASS. Evidence: `[run-all] 7 suite(s) passed, 0 failed`, exit 0, with the vitest panel at 19 of 19 (`scratch/after.md` T007).
- [x] T008 In the temp-repo harness, run a full `/doctor:sk-skill convert` on a scratch plain skill with an invented name. Verify: `PS <skill> --check --strict` prints `Result: PASS` and `ls .skilled/changelog/<name>/v<version>.md` resolves. Evidence: in `runs/t008`, `harbor-ledger` converted with eight approved phrases, the `Read,Grep,Glob` grant, an agent output that passed preservation at 6 body lines and `--edge enhances:sk-code`, the skill the plan proposed from the advisor's ranking; the strict gate printed `Result: PASS` and `ls .skilled/changelog/harbor-ledger/` printed `v1.0.0.0.md`. The apply exited 0 with all six integration rows reporting, so the compiled graph and the Hermes mirror are current, and `sk-skill-check.cjs` printed `Result: PASS`. The no-write apply printed `Apply gate: no writes without --apply.` and left `git status --porcelain` at 0 lines (`scratch/after.md` T008).
- [x] T009 In the same harness, run a full convert on a copy of `sk-git` at `ca10a236d2^` under an invented name. Verify: strict PASS, a resolving changelog link, and `parseRouter` equal before and after. Evidence: in `runs/t009`, `ferry-commit` recovered from `ca10a236d2^` printed `Result: FAIL` on three routing-shape requirements before the move and `Result: PASS` after it, `ls .skilled/changelog/ferry-commit/` resolved to `v1.11.5.0.md`, and `parseRouter` read the same five intent groups, resource map and default resource both ways with `contentEqual: true` and `semanticsEqual: true`. The apply exited 0 with `Router source: inline -> ROUTER.md` and all six integration rows reporting, and the no-write apply left the tree at 0 status lines (`scratch/after.md` T009).
- [x] T010 [P] Check the setup listing (`.skilled/commands/doctor/assets/doctor-setup-presentation.txt`). Verify: `rg -c "doctor:sk-skill"` prints 2 and a `/doctor:setup` run shows both rows. Evidence: `rg -c` printed `2` at exit 0, and both matched lines sit in section 2, the doctor target list `/doctor:setup` renders before any leg runs (`scratch/after.md` T010).
- [x] T011 [P] Run `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/commands/doctor/sk-skill.md --type command` and `bash .skilled/commands/doctor/scripts/route-validate.sh`. Verify: `Total issues: 0`, exit 0 for both. Evidence: the validator printed `VALID` with `Total issues: 0` at exit 0, and route-validate printed `J1: targets are in parity with their router and presentation across 9 commands` with `OK: route-validate — 20 routes validated, 3 warnings` at exit 0 (`scratch/after.md` T011).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Confirm the worktree holds no scratch skill. Verify: `git status --porcelain` shows no path under `.skilled/skills/` or `.skilled/changelog/` from T008 or T009. Evidence: `git status --porcelain` printed 0 lines, and the same read scoped to `.skilled/skills .skilled/changelog` printed 0 lines; both scratch skills lived only inside `runs/t008` and `runs/t009` (`scratch/after.md` T012).
- [x] T013 Write the framework release entry through create-changelog (`.skilled/changelog/skilled/v<next>.md`). Verify: `validate_document.py <entry> --type changelog` exits 0. Evidence: `.skilled/changelog/skilled/v4.0.1.2.md` printed `VALID` with `Total issues: 0` at exit 0, the voice scan reported 0 hard blockers and the structure read 38 lines in the compact shape, after a bullet was added for the edge proposal and one for the in-place wiring (`scratch/after.md` T013). The version step is recorded there too: `v4.0.1.0` is tagged on origin and `v4.0.1.1` is not.
- [ ] T014 After the operator merges, read CI on main. Verify: `gh run list --branch main --commit <merge-sha>` shows every run `success` or switched off. Note: not run in this phase. It needs the merge commit the operator creates, so it stays open and is recorded in `scratch/after.md` T014.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`: T001 to T013 are `[x]` and T014 waits on the operator's merge
- [ ] No `[B]` blocked tasks remaining: two checklist rows wait on that merge
- [x] Manual verification passed: `OUT` holds every check with output and exit code
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-009 in section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md: baseline, rerun, compare, with the harness named in section 3
- [x] CHK-003 [P1] Phase 1 baseline loaded: T001
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every shipped skill keeps its baseline strict verdict: T004, 13 of 13 `Result: PASS`
- [x] CHK-011 [P0] `run-all.sh` passes: T007, 7 of 7 suites
- [x] CHK-012 [P1] The router passes `validate_document.py --type command`: T011, `Total issues: 0`
- [x] CHK-013 [P1] The presentation passes `route-validate.sh` menu parity: T011, the J1 row covers all 9 commands
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [B] CHK-020 [P0] All acceptance criteria met: met by AC-001 to AC-007 and AC-009; AC-008 needs the merge and the CI read, owned by T014 and the operator. The packet is not closeable until that row turns
- [x] CHK-021 [P0] Scorer and replay baselines unchanged: T005 and T006, every number identical
- [x] CHK-022 [P0] Both scratch conversions end strict PASS with a resolving changelog link: T008 and T009
- [B] CHK-023 [P1] CI green on main: T014, which waits on the operator's merge
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: verification phase; it fixes no reported finding.

- [x] CHK-FIX-001 [P2] N/A: no finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No `local-` root in the strict run or the scratch conversions: T004 skipped them by name, and T008 and T009 used the invented names `harbor-ledger` and `ferry-commit`
- [x] CHK-031 [P0] The scorer baseline ran without `--write`: T005's command line and its 0-line status read
- [x] CHK-032 [P1] No secret appears in `OUT`: the record holds command output only, with no credential, token or environment dump
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: this update, `implementation-summary.md`, the acceptance rows and the parent's completion fields
- [x] CHK-041 [P1] Framework release changelog written through create-changelog: T013
- [x] CHK-042 [P2] Parent packet status updated after close: the parent spec and graph metadata now read phase 010 as in progress with the CI read outstanding
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Results live in `scratch/after.md`; scratch skills only in the temp repo: T012
- [x] CHK-051 [P1] scratch/ cleaned of everything but `after.md` before completion: the folder holds `.gitkeep` and `after.md`, and every temporary file lives under the operator scratch area
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 8/9 met, 1 blocked on the merge |
| P1 Items | 9 | 8/9 met, 1 blocked on the merge |
| P2 Items | 2 | 2/2 met |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



