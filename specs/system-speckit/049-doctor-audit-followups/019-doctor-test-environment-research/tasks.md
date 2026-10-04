---
title: "Tasks: Phase 19: doctor-test-environment-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor test environment research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 19: doctor-test-environment-research

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

- [x] T001 Scaffold the research phase and confirm the inputs: tags `v4.0.0.0` to `v4.0.0.2`, the Barter sk-git snapshot (10 files)
- [x] T002 Write the fan-out config with two lineages and concurrency 1 (`research/deep-research-config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the LUNA 6 lineage for two iterations through cli-codex (`research/lineages/luna-6-max-fast/`)
- [x] T004 Run the DeepSeek lineage for three iterations, moving to Cline after opencode-go refused the region (`research/lineages/deepseek-v4-1-flash-cline/`)
- [x] T005 Merge the lineages, emit the resource map, and write `research/research.md` and the findings block in `spec.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Check each load-bearing claim against the source: shared worktree config, index enumeration, dirty-target refusal, status lists, scorer, legacy tag trees
- [x] T007 Run strict validation of this phase and the recursive validation of the parent packet
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
