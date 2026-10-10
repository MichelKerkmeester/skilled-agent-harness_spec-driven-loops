---
title: "Tasks: Phase 13: root-cause-and-ux-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "root cause and ux research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: root-cause-and-ux-research

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

- [x] T001 Scaffold the phase folder with create.sh and author goal.md with sk-create-goal (`goal.md`)
- [x] T002 Write the research config with one cli-pi fan-out lineage (`research/deep-research-config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run the lineage for ten iterations on DeepSeek V4.1 Flash at max effort (`research/lineages/dsflash-llmgw/`)
- [x] T004 Spot-check the lineage's load-bearing claims against the repository (`research/research.md`)
- [x] T005 Write the synthesis with VERIFIED and INFERRED marks, rejected ideas and ranked phases (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run every completion criterion in goal.md (`goal.md`)
- [x] T007 Strict-validate this phase folder (`spec.md`)
- [x] T008 Fill the implementation summary (`implementation-summary.md`)
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
