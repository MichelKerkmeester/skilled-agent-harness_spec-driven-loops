---
title: "Tasks: Phase 2: lighter-advisor-launcher"
description: "Tasks for the lighter advisor launcher: map, measure, decide, then build only on a go."
trigger_phrases:
  - "lighter advisor launcher tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: lighter-advisor-launcher

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Map every job the launcher does, with file:line (`.skilled/bin/system-skill-advisor-launcher.cjs`)
- [ ] T002 Measure launcher, advisor server and bare Node RSS on this machine, after phase 001
- [ ] T003 Write the go or no-go in `decision-record.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 On a go: move the lease and heartbeat into the advisor server
- [ ] T005 On a go: move model server supervision into the advisor server
- [ ] T006 On a go: turn the launcher into a thin exec for existing callers
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the launcher and lease suites
- [ ] T008 Live check: one advisor process per checkout and a working query
- [ ] T009 Strict validation of this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
