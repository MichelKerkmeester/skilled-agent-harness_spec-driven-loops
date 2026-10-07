---
title: "Tasks: Deep research: cli-classifier quality audit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli classifier quality research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deep research: cli-classifier quality audit

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

- [x] T001 Scaffold the packet and fill spec, plan and tasks (`spec.md`, `plan.md`, `tasks.md`)
- [x] T002 Bind the research topic and the two-lineage fan-out config (`research/deep-research-config.json`)
- [x] T003 Commit the packet before the run so write containment starts from a clean tree
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run the DeepSeek V4.1 Flash max lineage on cli-devin, five iterations (`research/lineages/deepseek-v4-1-flash-max/`)
- [x] T005 [P] Run the GPT-6 Luna max fast lineage on cli-codex, five iterations (`research/lineages/luna-max-fast/`)
- [x] T006 Merge both lineages and write the synthesis (`research/research.md`)
- [x] T007 Record any lineage failure or disagreement in the synthesis
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Spot-check the top findings against the repository (`implementation-summary.md`)
- [x] T009 Confirm no write landed outside `research/` (`git status`)
- [x] T010 Validate the packet with `validate.sh --strict` and write the summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Top findings spot-checked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



