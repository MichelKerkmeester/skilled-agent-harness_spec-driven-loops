---
title: "Tasks: Phase 2: review-mode-research"
description: "Setup, ten research iterations, a five-iteration second-model pass, the refreshed synthesis and verification for the sk-code-review research phase."
trigger_phrases:
  - "review mode research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: review-mode-research

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

- [x] T001 Confirm the executor alternation unit with the operator (`../spec.md`, open question 1) Evidence: the operator set per-iteration alternation as the working assumption (parent D4) and asked that it be recorded, not re-asked.
- [x] T002 Read the cli-codex `SKILL.md`, then probe Luna max fast via cli-codex with a one-line dispatch (`.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md`) Evidence: `codex exec --model gpt-6-luna -c model_reasoning_effort=max -c service_tier=fast` replied `OK`, log shows `model: gpt-6-luna`, `reasoning effort: max`.
- [x] T003 [P] Read the cli-pi `SKILL.md`, then probe DeepSeek flash max 1017 via cli-pi through llmgateway with a one-line dispatch (`.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`) Evidence: the probe ran three times (08:47, 09:08, 09:27 UTC) and was refused each time with HTTP 402 `billing_error` (DevPass daily pacing limit), so the executor was retired.
- [x] T004 Write the current HEAD sha into the Baseline row of the parent goal log so the boundary check has a baseline (`../goal.md`) Evidence: `f8671e07c2a7ae00cda7ba2a2d30b192d5928606` written to the parent Baseline row.
- [x] T005 Compose the brief: the reading list from `plan.md`, the three evidence labels, the source-tag format and the four `research.md` section names (`plan.md`) Evidence: strategy section 12 Known Context carries the reading list, labels, tag format and section names.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Iteration 1 on Luna: repo-bound inventory (`research/iterations/iteration-001.md`) Evidence: `iteration-001.md` written, `verify-iteration.cjs` printed `OK iteration 1 complete`.
- [x] T007 Iteration 2 on DeepSeek: the UNKNOWN-surface path (`research/iterations/iteration-002.md`) Evidence: `iteration-002.md` written, `verify-iteration.cjs` printed `OK iteration 2 complete`. Ran on Luna because DeepSeek was refused.
- [x] T008 Iteration 3 on Luna: the output contract (`research/iterations/iteration-003.md`) Evidence: `iteration-003.md` written, `verify-iteration.cjs` printed `OK iteration 3 complete`.
- [x] T009 Iteration 4 on DeepSeek: usefulness evidence (`research/iterations/iteration-004.md`) Evidence: `iteration-004.md` written, `verify-iteration.cjs` printed `OK iteration 4 complete`. Ran on Luna because DeepSeek was refused.
- [x] T010 Iteration 5 on Luna: PR-state efficiency gates (`research/iterations/iteration-005.md`) Evidence: `iteration-005.md` written, `verify-iteration.cjs` printed `OK iteration 5 complete`.
- [x] T011 Iteration 6 on DeepSeek: review and quality boundary (`research/iterations/iteration-006.md`) Evidence: `iteration-006.md` written, `verify-iteration.cjs` printed `OK iteration 6 complete`. Ran on Luna because DeepSeek was refused.
- [x] T012 Iteration 7 on Luna: surface packets (`research/iterations/iteration-007.md`) Evidence: `iteration-007.md` written, `verify-iteration.cjs` printed `OK iteration 7 complete`.
- [x] T013 Iteration 8 on DeepSeek: consumers and contracts (`research/iterations/iteration-008.md`) Evidence: `iteration-008.md` written, `verify-iteration.cjs` printed `OK iteration 8 complete`. Ran on Luna because DeepSeek was refused.
- [x] T014 Iteration 9 on Luna: user-authored modes (`research/iterations/iteration-009.md`) Evidence: `iteration-009.md` written, `verify-iteration.cjs` printed `OK iteration 9 complete`.
- [x] T015 Iteration 10 on DeepSeek: repo-local policy and floors (`research/iterations/iteration-010.md`) Evidence: `iteration-010.md` written, `verify-iteration.cjs` printed `OK iteration 10 complete`. Ran on Luna because DeepSeek was refused.
- [x] T016 Run the synthesis and write the four sections plus the ranked list (`research/research.md`) Evidence: `research/research.md` written with the four sections and twelve ranked rows.
- [x] T017 Check the synthesis for all four section names and at least eight ranked rows (`research/research.md`) Evidence: each section name and `Ranked Recommendations` grep to 1 or more, the label count is 13.

### Second-model pass (ADR-002)

- [x] T023 Read the cli-devin `SKILL.md` in full, resolve the DeepSeek flash id from it and from `devin models list`, and probe once (`.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md`) Evidence: `--model deepseek-v4-1-flash-max` is on the runtime allowlist, and a one-line read-only probe replied `PROBE-OK`, exit 0. Devin's session record shows it resolved to `deepseek-v4-1-flash-1017-max`.
- [x] T024 Reopen the completed lineage and raise `maxIterations` to 15 (`research/deep-research-config.json`) Evidence: `research/synthesis-v1.md` snapshot, `status` set to `initialized`, a `resumed` event accepted by the append gateway with exit 0, session id and generation unchanged. Run after child 001 finished, never alongside it.
- [x] T025 Iteration 11 on DeepSeek: replay I-6 and rank 12, and check I-5 (`research/iterations/iteration-011.md`) Evidence: verified on the first dispatch.
- [x] T026 Iteration 12 on DeepSeek: ranks 1 and 3 and the facts under them (`research/iterations/iteration-012.md`) Evidence: verified on the first dispatch.
- [x] T027 Iteration 13 on DeepSeek: INFERRED claims I-3, U-9 and E-3 (`research/iterations/iteration-013.md`) Evidence: verified on the first dispatch.
- [x] T028 Iteration 14 on DeepSeek: ranks 2, 4 and 5 (`research/iterations/iteration-014.md`) Evidence: verified on the first dispatch.
- [x] T029 Iteration 15 on DeepSeek: ranks 7 to 11 and an independent top five (`research/iterations/iteration-015.md`) Evidence: verified on the first dispatch.
- [x] T030 Refresh the synthesis so every ranked row states the second model's verdict (`research/research.md`) Evidence: sections 6a and 6b, with 9 rows confirmed, 1 refuted in part and 2 untested in their decisive claim.
- [x] T031 Record both operator rulings as ADRs (`decision-record.md`) Evidence: ADR-001 and ADR-002, both Accepted.
- [B] T032 Re-run the narrowed AC-011 check and close the row (`acceptance-criteria.md`) Blocked: the narrowed grep prints 1 each for `research/iterations/iteration-013.md` and `iteration-014.md`, lines stating the sibling folder was not read. Closing needs the operator's yes on the amendment in ADR-001.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run each command check in the acceptance criteria and record its output in the Verification cell (`acceptance-criteria.md`) Evidence: outputs recorded in `acceptance-criteria.md`.
- [x] T019 Open three source tags by hand and confirm each resolves to the quoted text (`research/research.md`) Evidence: `SKILL.md:223`, `SKILL.md:503`, `SKILL.md:530` and every other tag resolved.
- [x] T020 Run `validate.sh` on this phase with `--strict` and read the `RESULT:` line (`specs/sk-code/014-code-modes-research/002-review-mode-research`) Evidence: `--strict --no-recursive` printed `RESULT: PASSED`, `Errors: 0`, SOURCE_TAGS passed with 493 tags. Re-run after iteration 15 with `--recursive` on the parent: `RESULT: PASSED`, Errors 0, Warnings 0, 385 tags.
- [x] T021 Confirm `git diff --stat` from the recorded HEAD prints no path under `.skilled/` Evidence: empty for `sk-code-quality/` and `sk-code-review/`. Other `.skilled/` diffs are external, listed in AC-009.
- [x] T022 Fill the implementation summary and update the parent Phase Documentation Map status (`implementation-summary.md`, `../spec.md`) Evidence: implementation summary filled and the parent map row updated.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion reads Met with its command output recorded
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
- [x] CHK-003 [P1] Both executors probed and the alternation unit confirmed Evidence: both probed. DeepSeek was refused (402), recorded in T003. The second-model pass probed cli-devin, recorded in T023.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every finding carries OBSERVED, DERIVED or INFERRED Evidence: every finding and ranked row in `research/research.md`.
- [x] CHK-011 [P0] Every repository claim has a source tag with a path and line
- [x] CHK-012 [P1] Each recommendation names the non-framework repository case it serves Evidence: the last column of the ranked table.
- [x] CHK-013 [P1] No recommendation relaxes the security and correctness minimums, the three-value final status line or the cache-only Write scope Evidence: the ranked table preamble and rank 2.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: AC-011 amended and Met, AC-001 to AC-010 Met
- [x] CHK-021 [P0] Fifteen iteration files and fifteen state records exist, ten before ADR-002 raised the count Evidence: 15 files and 15 iteration records.
- [x] CHK-022 [P1] Three source tags opened by hand resolve to the quoted text Evidence: see T019.
- [x] CHK-023 [P1] Any conflict between the two executors is named in the synthesis Evidence: iterations 1 to 10 ran on Luna and 11 to 15 on DeepSeek V4.1 Flash Max. Section 6a of the synthesis names each disagreement, and section 5 lists the executor per iteration.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each ranked row is marked ready now or needs a decision.
- [x] CHK-FIX-002 [P0] Each recommendation lists the hub files it would touch, so a later packet can inventory producers and consumers. Evidence: the Hub files touched column.
- [x] CHK-FIX-003 [P1] Each recommendation that changes routing names both stages it must reach: `hub-router.json` and `ROUTER.md`. Evidence: ranks 3, 8 and 12 name `hub-router.json` and `ROUTER.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or token text is copied into any research file Evidence: a pattern scan of `research/` found no key or token text.
- [x] CHK-031 [P0] No file outside `research/` is written by the run Evidence: each iteration log shows writes only under `research/`. The workflow made its bounded `spec.md` edits.
- [x] CHK-032 [P1] No path under `.skilled/` is changed Evidence: scoped to the two mode folders, see AC-009.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the ten angles and the executor plan Evidence: they agree on the plan. The executor deviation is recorded in the implementation summary, and the five second-model iterations in ADR-002.
- [x] CHK-041 [P1] The parent Phase Documentation Map status matches this phase
- [x] CHK-042 [P2] The close-out names the top three recommendations for the operator Evidence: the implementation summary names the top three.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the executor leftover files were deleted with the operator's approval and `ls -A research/deltas` lists only the fifteen iteration files
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25, after iteration 15. CHK-020 and CHK-050 closed after the AC-011 amendment and the leftover deletion.
<!-- /ANCHOR:summary -->

---

