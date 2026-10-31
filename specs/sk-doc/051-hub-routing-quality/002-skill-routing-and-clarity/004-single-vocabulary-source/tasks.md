---
title: "Tasks: Phase 4: Single vocabulary source per hub"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "single vocabulary source per hub tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: Single vocabulary source per hub

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

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: findings 4 and 8 rechecked by script (`scratch/baseline.md` §3). The hashed-input row in §6 was corrected for system-deep-loop and sk-doc (implementation-summary Deviations 6).
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: recorded in `scratch/baseline.md`, the name the phase brief set: 33 of 33 gates exit 0, plus two extra baselines and the drift counts.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: detailed from the measured drift instead of a `/speckit:plan` run. Each worker brief names its files and verify command (`.scratch-dc90/072-004/prompts/`), recorded as Deviation 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Pick the authored file per hub and write the generator or checker. Evidence: `hub-router.json` `vocabularyClasses` for all 7 hubs; `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs` and its test (7/7), wired into `routing-registry-drift.yml`.
- [x] T005 Run it in check mode and record every disagreement. Evidence: drift 375 before any edit (`spec.md` Measured Behavior, `scratch/baseline.md` §3).
- [x] T006 Resolve each disagreement, hub by hub. Evidence: drift 0 on all 7 hubs. The per-hub table is in implementation-summary What Was Built.
- [x] T007 Re-mint the compiled routes and run the guard. Evidence: all 7 hubs re-minted and their archive manifests copied; the guard reports 7 of 7 fresh, failures 0.
- [x] T008 Run router-reach and compare with the baseline. Evidence: wrong-hub 0, outranked 0, no-reach 0 (baseline the same); allowed 3 to 9 (`scratch/after.md` §3).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1; accuracy 155/195, 49/66, 19/24, unchanged.
- [x] T010 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity --recursive --strict` prints `RESULT: PASSED` (`scratch/after.md` §1).
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md §4, REQ-001 to REQ-004.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md §3 and §4.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: phase 003 canon read; built on 87e43b5dc0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: checker test 7/7; parent-skill-check invariants 109/109.
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §1.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: the new script builds the private prefix at run time; no `local-` name in any changed file.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: no SMART ROUTING section grew; the sk-doc edit stayed on one line.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md: 4 of 4 Met.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/baseline.md` and `scratch/after.md`.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: sk-doc, the largest hub, was verified last, with the benchmark trigger fix.
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: each worker's diff was checked against HEAD; the interim regressions were fixed by removing the cause and rerunning the gates.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets; JSON and Markdown routing text only.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: the check's CLI rejects unknown options and missing values with exit 2, tested.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec, plan and tasks agree.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: 13 changelog entries, carriers stepped.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary files in `.scratch-dc90/072-004/` and `scratch/` only.
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
