---
title: "Tasks: Phase 6: doctor-helper-handoff"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor helper handoff tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: doctor-helper-handoff

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

`R` is `.skilled/skills/system-skill-advisor/runtime`. `H` is `.skilled/commands/doctor/scripts/doctor-helper-match.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Probe sixteen reworded doctor prompts through the built scorer (`R/dist`). Verify: the probe lists the doctor command in the recommendations for 3 of 16, and 5 with no recommendation.
- [x] T002 Rank the same prompts with `H --json --top=1`. Verify: the intended command is first for 14 of 16.
- [x] T003 Measure the helper's score on the helper fixtures against the labeled and holdout corpora (`H`). Verify: score alone does not separate them (50 of 261 ordinary prompts score 10 or more), so a cue gate is needed.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the hand-off module (`R/lib/scorer/doctor-helper-handoff.ts`). Verify: `npm run typecheck` in `R` exits 0.
- [x] T005 Add `applyDoctorHelperHandoff` after the doctor ordering step (`R/lib/scorer/fusion.ts`). Verify: the hook brief for "my AGENTS.md is out of date with the template" starts `Advisor: live; use /doctor:helper`.
- [x] T006 Add the unit tests (`R/tests/doctor-helper-handoff.vitest.ts`). Verify: `npx vitest run tests/doctor-helper-handoff.vitest.ts` passes 6.
- [x] T007 Add four `B-helper-handoff` rows (`R/scripts/routing-accuracy/doctor-prompts.jsonl`). Verify: the slice passes, and with the fusion change stashed it fails on rows 01, 02 and 04.
- [x] T008 [P] Correct the doctor routing paragraph (`R/scripts/command-bridges/README.md`, `feature-catalog/scorer-fusion/doctor-command-routing.md`, `doctor-routing-contested-second-line.md`). Verify: `rg -n "surfaces only on its own wording" .skilled` prints nothing.
- [x] T009 [P] Add playbook scenario DOC-406 and register it (`.skilled/manual-testing-playbook/`). Verify: `validate_document.py` prints `VALID` with 0 issues.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Count hand-off fires across the holdout, labeled, doctor and ambiguity corpora. Verify: `fired 0` for each of the four.
- [x] T011 Measure reach on the helper fixtures. Verify: held-out 4/48 before, 15/48 after; tune 13/58 before, 26/58 after; 0 non-doctor rows fire.
- [x] T012 Run the full advisor suite (`R`). Verify: `Test Files  159 passed (159)`, `Tests  1359 passed | 8 skipped`.
- [x] T013 Run DOC-406's commands. Verify: the three briefs match the scenario's expected lines.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: DOC-406's three briefs match
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
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: `H` exports `loadEntries` and `rankProblem`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` and `npm run build` in `R` exit 0
- [x] CHK-011 [P0] `check-comment-hygiene.sh` on the three changed code files exits 0
- [x] CHK-012 [P1] A load or rank failure returns no match: the missing-workspace unit test passes
- [x] CHK-013 [P1] The module follows the scorer's module layout (banner, numbered sections, design note)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: DOC-406
- [x] CHK-022 [P1] Edge cases tested: no cue, weak cue beside a skill, missing helper script
- [x] CHK-023 [P1] Error scenarios validated: the ranker failure path returns null
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation: the ranker's candidate is used only when its command is a string and its score a number
- [x] CHK-032 [P1] N/A: no auth surface. The step reads two files inside the scored workspace.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The module's design note states why the ranker is loaded at run time and why cues are tiered
- [x] CHK-042 [P2] The command-bridges README and the advisor feature catalog describe the hand-off
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the probe scripts lived in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-31
<!-- /ANCHOR:summary -->

---
