---
title: "Tasks: Repo rule surfacing through the advisor"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "repo rule advisor research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Repo rule surfacing through the advisor

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

- [x] T001 Scaffold the Level 1 packet and write the research question (`spec.md`)
- [x] T002 Confirm Devin CLI install and OAuth, and the two model ids against the allowlist
- [x] T003 Persist the fan-out config and evidence-carrying brief (`research/deep-research-config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run the `swe-2-max` lineage, four iterations (`research/lineages/swe-2-max/`)
- [x] T005 [P] Run the `deepseek-v4-1-flash-max` lineage, four iterations (`research/lineages/deepseek-v4-1-flash-max/`)
- [x] T006 Merge lineages and emit the resource map (`research/findings-registry.json`, `research/resource-map.md`)
- [x] T007 Write the synthesis with the disagreement named (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Check route-proof fields and four iteration records per lineage (state JSONL)
- [x] T009 Check the load-bearing citations against the working tree (`research/research.md` §9)
- [x] T010 Write the findings block back and validate (`spec.md`)
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
- **Findings**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---
