---
title: "Tasks: Repo rule concision and loading"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "repo rule concision research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Repo rule concision and loading

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

- [x] T001 Measure token load, read rates and compliance; write the evidence pack (`prep/evidence-pack.md`)
- [x] T002 Write the reproducible compliance script (`prep/measure-rule-compliance.py`)
- [x] T003 Probe each executor with a trivial dispatch
- [x] T004 Tighten the shared brief and the four angle files, and seed each `steer.md` (`research/lineages/<label>/steer.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Run the DeepSeek lineage, four iterations, loading design
- [x] T006 [P] Run the SWE 2 lineage, three iterations, concision
- [x] T007 [P] Run the compliance lineage, three iterations (second Luna lineage on cli-codex; the GLM route was broken)
- [x] T008 Run the Luna lineage, two iterations, devil's advocate and full load
- [x] T009 Steer each lineage between iterations by rewriting its `steer.md`
- [x] T010 Merge lineages and write the synthesis (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Check iteration counts and route-proof fields per lineage
- [x] T012 Check load-bearing citations against the working tree
- [x] T013 Write the findings block back and validate (`spec.md`)
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
- **Evidence**: See `prep/evidence-pack.md`
<!-- /ANCHOR:cross-refs -->

---
