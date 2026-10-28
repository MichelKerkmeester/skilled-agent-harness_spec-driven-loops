---
title: "Tasks: Phase 2: Baseline and routing correctness"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "baseline and routing correctness tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: Baseline and routing correctness

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

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: findings 1, 8, 10, 11, 12 and 13 re-read at the cited lines; finding 4's count of 17 rechecked by script (`scratch/baseline.md` §2).
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: `scratch/baseline.md` §1 is the before record, every gate with its exit status.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: the six fixes were briefed one file each with a verify command; `implementation-summary.md` lists each with file:line.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run every gate in scope and save output and exit status to `scratch/baseline.md`. Evidence: `scratch/baseline.md` §1, all gates exit 0 at `bd8f7e946d`.
- [x] T005 Recount the drift numbers and record them in `scratch/baseline.md`. Evidence: `scratch/baseline.md` §2: stage-one terms missing from stage two, mcp-tooling 64 and cli-external-orchestration 36; sk-doc trigger terms missing from `hub-router.json`, 17.
- [x] T006 Fix the system-skill-advisor router and regenerate its leaf manifest and aliases. Evidence: `SKILL.md:104-110` roots fixed; `hooks` leaf root added; `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` wrote `leaf-manifest.json` and `leaf-aliases.json`; freshness 14/14.
- [x] T007 Fix sk-code `ROUTER.md` §2 and §9. Evidence: §2 and §9 intent sets compare `EQUAL True`; verify-router-sync 5/5.
- [x] T008 Fix the mcp-obsidian, cli-jev, shared-smart-router and benchmark-claim findings, one file per change. Evidence: `mcp-tooling/ROUTER.md:97`, `cli-classifier/cli-jev/SKILL.md:104,115,211`, `shared-smart-router.md:3,17,25`, `cli-external-orchestration/SKILL.md:75`, one dispatch each.
- [x] T009 Rerun the baseline and record the delta. Evidence: `scratch/after.md` §1 delta table, no gate worse.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1, every gate exit 0 and the same result as before.
- [x] T011 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity --recursive --strict` printed `RESULT: PASSED` for this folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: each changed file read and diffed by the orchestrator
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

- [x] CHK-001 [P0] Requirements documented in spec.md (spec.md §4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (plan.md §4)
- [x] CHK-003 [P1] Dependencies identified and available (research.md read; all gates available)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests (leaf-resource-contract.test.cjs passes, and fails on the old contract)
- [x] CHK-011 [P0] Every gate in scope passes (scratch/after.md §1)
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file (no operator-local name in any changed file)
- [x] CHK-013 [P1] Changes follow the phase 003 canon (N/A: phase 003 has not defined the canon yet; no fix changed a routing shape)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (acceptance-criteria.md, all rows Met)
- [x] CHK-021 [P0] Gate output recorded before and after (scratch/baseline.md and scratch/after.md)
- [x] CHK-022 [P1] The largest file in scope was changed last (N/A: every fix was a few lines; no file was restructured)
- [x] CHK-023 [P1] A reverted change leaves the gates as they were (each fix is a separate hunk with a revert path in plan.md §7)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file (no secrets in any changed file)
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested (the one script change is covered by a unit test)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree (spec, plan and tasks agree)
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill (seven changelog entries, versions stepped in every carrier)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (temp files kept out of the tree; scratch/ holds only baseline.md and after.md)
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
