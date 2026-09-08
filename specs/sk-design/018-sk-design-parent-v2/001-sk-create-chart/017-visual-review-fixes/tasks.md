---
title: "Tasks: visual review fixes after the shadcn upgrade"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: visual review fixes after the shadcn upgrade

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

- [x] T001 Read the operator captures and locate each defect in the markup, CSS and script. Evidence: box-plot `<title id="fig-title">`, `.tip-row` grid, `th` rule, daily-line fade and rung filter
- [x] T002 Swap the SVG title for a desc and stop tooltip labels wrapping in all 33 files. Evidence: 32 desc lines, 23 nowrap rules; static gate PASSED
- [x] T003 [P] Add `th.num` and class every numeric header, including script-built ones. Evidence: agent report, 33 files, static gate PASSED
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Hide the indicator column on single-series cards via `data-single-series`. Evidence: agent report; static gate PASSED
- [x] T005 Daily-line: neutral fade 0.35 to 0.04, every rung up to the peak, label under the marker. Evidence: `daily-line.png`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Hover captures of box-plot in both schemes show one card and no native title. Evidence: `scratch/hover/` captures read by the conductor
- [x] T009 `check-corpus.cjs --render` prints RESULT: PASSED; screenshots regenerated. Evidence: run log
- [x] T010 Packet docs filled; validate.sh --strict RESULT: PASSED
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



