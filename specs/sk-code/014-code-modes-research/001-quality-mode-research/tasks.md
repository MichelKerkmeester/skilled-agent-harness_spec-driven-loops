---
title: "Tasks: Phase 1: quality-mode-research"
description: "Setup, ten research iterations, a five-iteration second-model pass, the refreshed synthesis and verification for the sk-code-quality research phase."
trigger_phrases:
  - "quality mode research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: quality-mode-research

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

- [x] T001 Confirm the executor alternation unit with the operator (`../spec.md`, open question 1). Evidence: the operator's run brief of 2026-10-25 set per-iteration alternation (odd Luna, even DeepSeek) as the working assumption under parent D4.
- [x] T002 Read the cli-codex `SKILL.md`, then probe Luna max fast via cli-codex with a one-line dispatch (`.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`). Evidence: `codex exec --model gpt-6-luna -c model_reasoning_effort=max -c service_tier=fast` replied `OK` in 8 seconds, exit 0.
- [x] T003 [P] Read the cli-pi `SKILL.md`, then probe DeepSeek flash max 1017 via cli-pi through llmgateway with a one-line dispatch (`.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`). Evidence: the probe ran with `--model llmgateway/deepseek-v4.1-flash-1017 --thinking max` and was refused with `402 ... daily pacing allowance on the pro plan`. Re-probes at 09:05Z and 09:26Z gave the same refusal, so pi was retired after three failures.
- [x] T004 Write the current HEAD sha into the Baseline row of the parent goal log so the boundary check has a baseline (`../goal.md`). Evidence: Baseline row reads `f8671e07c2a7ae00cda7ba2a2d30b192d5928606`, which matches `git rev-parse HEAD` at this run's start.
- [x] T005 Compose the brief: the reading list from `plan.md`, the three evidence labels, the source-tag format and the four `research.md` section names (`plan.md`). Evidence: `research/prompts/iteration-1.md` through `iteration-10.md`, each the workflow prompt pack plus the child-dispatch preamble, the per-iteration plan angle, the evidence labels and the source-tag rule.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Iteration 1 on Luna: repo-bound inventory (`research/iterations/iteration-001.md`)
- [x] T007 Iteration 2 on DeepSeek: the UNKNOWN-surface path (`research/iterations/iteration-002.md`). Ran on Luna because pi was refused with 402.
- [x] T008 Iteration 3 on Luna: checker portability (`research/iterations/iteration-003.md`)
- [x] T009 Iteration 4 on DeepSeek: usefulness evidence (`research/iterations/iteration-004.md`). Ran on Luna after the third pi refusal retired pi.
- [x] T010 Iteration 5 on Luna: handoff to verify and debug (`research/iterations/iteration-005.md`)
- [x] T011 Iteration 6 on DeepSeek: quality and review boundary (`research/iterations/iteration-006.md`). Ran on Luna, pi retired.
- [x] T012 Iteration 7 on Luna: surface packets (`research/iterations/iteration-007.md`)
- [x] T013 Iteration 8 on DeepSeek: user-authored modes (`research/iterations/iteration-008.md`). Ran on Luna, pi retired.
- [x] T014 Iteration 9 on Luna: repo-local configuration (`research/iterations/iteration-009.md`)
- [x] T015 Iteration 10 on DeepSeek: floors and proof (`research/iterations/iteration-010.md`). Ran on Luna, pi retired.
- [x] T016 Run the synthesis and write the four sections plus the ranked list (`research/research.md`). Evidence: 304 lines, sections 3 to 6 present, 14 ranked rows.
- [x] T017 Check the synthesis for all four section names and at least eight ranked rows (`research/research.md`). Evidence: each section name counts 1 or more, `External-User Modes` counts 1, the ranked table holds 14 rows.

### Second-model pass (ADR-002)

- [x] T023 Read the cli-devin `SKILL.md` in full, resolve the DeepSeek flash id from it and from `devin models list`, and probe once (`.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md`). Evidence: `--model deepseek-v4-1-flash-max` is on the runtime allowlist, and a one-line read-only probe replied `PROBE-OK`, exit 0. Devin's session record shows it resolved to `deepseek-v4-1-flash-1017-max`.
- [x] T024 Reopen the completed lineage and raise `maxIterations` to 15 (`research/deep-research-config.json`). Evidence: `research/synthesis-v1.md` snapshot, `status` set to `initialized`, a `resumed` event accepted by the append gateway with exit 0, session id and generation unchanged.
- [x] T025 Iteration 11 on DeepSeek: re-check ranks 1 and 2 (`research/iterations/iteration-011.md`). Verified on the first dispatch.
- [x] T026 Iteration 12 on DeepSeek: re-check ranks 3, 4 and 5 with a checker run (`research/iterations/iteration-012.md`). Verified on the first dispatch.
- [x] T027 Iteration 13 on DeepSeek: re-check the INFERRED claims (`research/iterations/iteration-013.md`). The first dispatch failed `state_record_missing`, and the workflow's one redispatch verified.
- [x] T028 Iteration 14 on DeepSeek: routing replay for ranks 8 and 12 (`research/iterations/iteration-014.md`). Verified on the first dispatch.
- [x] T029 Iteration 15 on DeepSeek: re-check ranks 6, 7, 11, 13 and 14 and an independent top five (`research/iterations/iteration-015.md`). Verified on the first dispatch.
- [x] T030 Refresh the synthesis so every ranked row states the second model's verdict (`research/research.md`). Evidence: sections 6a and 6b, with 12 rows confirmed and 2 refuted in part.
- [x] T031 Record both operator rulings as ADRs (`decision-record.md`). Evidence: ADR-001 and ADR-002, both Accepted.
- [x] T032 Re-run the narrowed AC-011 check and close the row (`acceptance-criteria.md`). Blocked: the narrowed grep prints 1 for `research/iterations/iteration-011.md`, a line stating the sibling folder was not read. Closing needs the operator's yes on the amendment in ADR-001. Closed: the operator approved the amendment on 2026-10-25, and the amended check printed nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run each command check in the acceptance criteria and record its output in the Verification cell (`acceptance-criteria.md`)
- [x] T019 Open three source tags by hand and confirm each resolves to the quoted text (`research/research.md`). Evidence: `SKILL.md:193`, `check-comment-hygiene.sh:39` and `SKILL.md:27` each resolve to the quoted text.
- [x] T020 Run `validate.sh` on this phase with `--strict` and read the `RESULT:` line (`specs/sk-code/014-code-modes-research/001-quality-mode-research`). Evidence: `RESULT: PASSED`, Errors 0, recorded in AC-010. Re-run after iteration 15 with `--recursive` on the parent: `RESULT: PASSED`, Errors 0, Warnings 0.
- [x] T021 Confirm `git diff --stat` from the recorded HEAD prints no path under `.skilled/`. Evidence: narrowed per the operator to `sk-code-quality/` and `sk-code-review/`, which print nothing. The literal check lists 120 external files
- [x] T022 Fill the implementation summary and update the parent Phase Documentation Map status (`implementation-summary.md`, `../spec.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion reads Met with its command output recorded, or Superseded with its ADR, as AC-009 is by ADR-003
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
- [x] CHK-002 [P0] The ten angles and the launch command defined in plan.md
- [x] CHK-003 [P1] Both executors probed and the alternation unit confirmed. The second-model pass probed cli-devin as well
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every finding carries OBSERVED, DERIVED or INFERRED
- [x] CHK-011 [P0] Every repository claim has a source tag with a path and line
- [x] CHK-012 [P1] Each recommendation names the non-framework repository case it serves
- [x] CHK-013 [P1] No recommendation relaxes the P0 floor, the missing Write and Task authority or the advisory-only envelope status
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-011 amended and Met, AC-001 to AC-010 Met
- [x] CHK-021 [P0] Fifteen iteration files and fifteen state records exist, ten before ADR-002 raised the count
- [x] CHK-022 [P1] Three source tags opened by hand resolve to the quoted text
- [x] CHK-023 [P1] Any conflict between the two executors is named in the synthesis
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each ranked row is marked ready now or needs a decision.
- [x] CHK-FIX-002 [P0] Each recommendation lists the hub files it would touch, so a later packet can inventory producers and consumers.
- [x] CHK-FIX-003 [P1] Each recommendation that changes routing names both stages it must reach: `hub-router.json` and `ROUTER.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or token text is copied into any research file
- [x] CHK-031 [P0] No file outside `research/` is written by the run, apart from the bounded `spec.md` edits D1 and NFR-S01 allow Evidence: each iteration log shows writes only under `research/`, and the workflow's `spec.md` edits are the Research Context note and the `deep-research/spec-findings` generated block, both inside the `questions` anchor.
- [x] CHK-032 [P1] Neither subject mode folder under `.skilled/` is changed by the runs, the scope ADR-003 sets Evidence: `git diff --stat f8671e07c2 ee8c7e6f24 -- .skilled/skills/sk-code/sk-code-quality .skilled/skills/sk-code/sk-code-review` printed nothing. See AC-009 and ADR-003.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the ten angles and the executor plan, with the five second-model iterations recorded in ADR-002
- [x] CHK-041 [P1] The parent Phase Documentation Map status matches this phase
- [x] CHK-042 [P2] The close-out names the top three recommendations for the operator
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the executor leftover files were deleted with the operator's approval, and `ls -A research/deltas` lists the fifteen iteration files and one gitignored `.legacy-projection-watermarks/` folder
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25, after iteration 15. CHK-020 and CHK-050 closed after the AC-011 amendment and the leftover deletion. CHK-003: Luna and cli-devin were probed, and pi was refused with 402. CHK-023: iterations 1 to 10 ran on Luna and 11 to 15 on DeepSeek V4.1 Flash Max, and section 6a of the synthesis names every disagreement
<!-- /ANCHOR:summary -->

---

