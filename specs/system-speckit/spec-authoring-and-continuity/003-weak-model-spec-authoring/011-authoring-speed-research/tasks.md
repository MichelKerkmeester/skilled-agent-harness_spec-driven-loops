---
title: "Tasks: Phase 11: authoring-speed-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "authoring speed research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 11: authoring-speed-research

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the research config names the `pi-deepseek` lineage (`research/deep-research-config.json`). Verify: `rg -c 'pi-deepseek' research/deep-research-config.json` prints a count above 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Run five `/deep:research` iterations with cli-pi DeepSeek V4.1 Flash max (`research/lineages/pi-deepseek/iterations/`). Verify: `ls research/lineages/pi-deepseek/iterations/ | wc -l` prints 5.
- [x] T003 Synthesize the ranking with an Opus high subagent (`research/research.md`). Verify: `rg -c 'SOURCE:' research/research.md` prints a count at least equal to the ranked rows.
- [x] T004 Assign each recommendation to a later phase or a deferral (`research/research.md`). Verify: `rg -c '\*\*(build now|defer)\*\*' research/research.md` prints 12.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Count unfilled tokens (`spec.md`, `plan.md`, `tasks.md`). Verify: the token count from step 8 of the spec authoring card prints 0.
- [x] T006 Validate the folder (this folder). Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `research/research.md` ranks and assigns every recommendation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



