---
title: "Tasks: Table wording experiment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "table wording experiment tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Table wording experiment

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Copy the two variants into `preregistration.md`
- [x] T002 Compute run counts and sample size from the pilot delivery rates
- [x] T003 Commit the pre-registration (`edba53daeb`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build both arm environments from commit `edba53daeb` (every scored run copied a fresh arm environment, see `results/runs/`)
- [x] T005 Run the second executor in the seed-16 order (the seat moved under `results/deviations.md` 1 to 4: DeepSeek through Devin 5 runs, SWE-2 Max 200, DeepSeek through OpenCode Go 60, DeepSeek through Cline 60)
- [x] T006 Run Luna, 300 runs in the seed-16 order (150 current and 150 short in `results/final-scores.txt`)
- [x] T007 Count unscorable runs separately (0 unscorable in either arm, `results/final-scores.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Check with `git log` that the live rule files did not change during the run (`git log edba53daeb..6ffe5e5514` on `communication.md`, `AGENTS.md`, `REPO RULES.md` and `.skilled/repo-rules/` lists no commit)
- [x] T009 Score and apply the decision rule (`results/decision.md`: rule 2, adopt the short wording, d = +0.0 points, 95% interval -3.4 to +3.4, committed in `6ffe5e5514`)
- [x] T010 Commit the chosen wording after the 006 window is measured (committed 2026-10-05 without the window, `decision-record.md` ADR-002; ledger `results/adoption-ledger.md`; `communication.md` 1.4.1.3)
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
<!-- /ANCHOR:cross-refs -->

---
