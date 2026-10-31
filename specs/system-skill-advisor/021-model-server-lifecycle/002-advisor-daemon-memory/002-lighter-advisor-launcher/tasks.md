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

- [x] T001 Map every job the launcher does, with file:line (`.skilled/bin/system-skill-advisor-launcher.cjs`)
- [x] T002 Measure launcher, advisor server and bare Node RSS on this machine, after phase 001
- [x] T003 Write the go or no-go in `decision-record.md` (no-go, ADR-001)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 On a go: move the lease and heartbeat into the advisor server (not built: no-go)
- [x] T005 On a go: move model server supervision into the advisor server (not built: no-go)
- [x] T006 On a go: turn the launcher into a thin exec for existing callers (not built: no-go)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the launcher and lease suites (not run: no code changed after the no-go)
- [x] T008 Live check: one advisor process per checkout and a working query (not applicable: no-go)
- [x] T009 Strict validation of this folder (RESULT: PASSED)
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
