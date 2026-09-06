---
title: "Tasks: Phase 3: Test Hang Containment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "test hang containment tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: Test Hang Containment

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

- [x] T001 Healthy baseline recorded per invocation — the runner now logs runtime, bound and margin on every successful run
- [x] T002 Leaked-timer reproduction built — pre-fix it persisted past the summary and named no handle
- [x] T003 Both: the bound lives in the invocation runner, the diagnosis in the vitest config
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 10-minute default bound with `SPECKIT_TEST_RUN_TIMEOUT_MS` override; terminates the process GROUP via SIGTERM then SIGKILL
- [x] T005 [P] `hanging-process` reporter enabled alongside default (`.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirmed independently — a 1200ms bound on a real suite yields `terminating process group` and exit 124
- [x] T007 Reporter named the retaining handle as `Timeout`
- [x] T008 Healthy run at a generous bound: 9 passed, 1093ms runtime, margin 178907ms, exit 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Baseline duration and bound margin recorded, and logged on every run
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
