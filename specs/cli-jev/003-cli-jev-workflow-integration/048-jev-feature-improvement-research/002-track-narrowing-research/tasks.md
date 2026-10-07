---
title: "Tasks: Phase 2: track-narrowing-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "track narrowing research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: track-narrowing-research

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

- [x] T001 Bind the research topic and the two-lineage fan-out config
- [x] T002 Confirm `pi` and `codex` are on PATH
- [x] T003 [P] Confirm the cli-pi model is on the allowlist
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run the DeepSeek lineage, 5 iterations (`research/lineages/deepseek/`)
- [x] T005 [P] Run the Luna lineage, 3 iterations (`research/lineages/luna/`)
- [x] T006 Merge both lineages into `research/research.md`
- [x] T007 Record any early lineage stop in the goal log
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Count iteration records per lineage
- [x] T009 Check that recommendations cite evidence
- [x] T010 Run `validate.sh --strict` on this phase
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



