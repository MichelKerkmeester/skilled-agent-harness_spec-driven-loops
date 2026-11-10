---
title: "Tasks: Phase 12: authoring-speed-fixes-and-alignment"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "authoring speed fixes and alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 12: authoring-speed-fixes-and-alignment

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-spec-kit`. `R` is `../011-authoring-speed-research/research/phase-012-proposal.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the three lanes and the stale-surface list (`R`). Verify: `rg -c '^\*\*Lane [123]\*\*' R` prints 3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Lane 1: skip fsmonitor in the scanner git calls (`$S/runtime/cli/rules/check-source-tags-helper.mjs`, `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`). Verify: `rg -c 'core.fsmonitor=false'` prints at least 1 per file.
- [x] T003 [P] Lane 3: drop the stale size labels and checklist wording (`$S/references/templates/level-specifications.md`). Verify: `rg -c '~455 LOC|~875 LOC|~1090 LOC|~1075 LOC'` prints nothing.
- [x] T004 Lane 2: one answer for long plans and a template description that names `Verify:` (`$S/references/workflows/spec-authoring-card.md`, `$S/templates/core/tasks.md.tmpl`). Verify: `rg -c 'Split it or raise the level'` on the card prints nothing.
- [x] T005 Alignment pass over the surfaces in section 6 of `R` and phase 010's open items (catalog, playbook, README, reference docs). Verify: each surface has an outcome row in `scratch/alignment.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the lane 1 tests and compare scanner output (`scratch/lane-1/`). Verify: `diff before.txt after.txt` shows only timing lines, and both test files pass.
- [x] T007 Run the lane 2 guards (`$S/runtime/cli/spec/`). Verify: `check-card-sync.sh` and `check-example-drift.sh` each exit 0.
- [x] T008 Validate the folder (this folder). Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The goal's four criteria hold
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---
