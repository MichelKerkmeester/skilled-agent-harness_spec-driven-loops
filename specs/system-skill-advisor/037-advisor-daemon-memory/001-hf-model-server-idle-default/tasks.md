---
title: "Tasks: Phase 1: hf-model-server-idle-default"
description: "Tasks for the hf model server idle default: measure, change the default, update tests and env docs, verify live."
trigger_phrases:
  - "hf model server idle default tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: hf-model-server-idle-default

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

- [x] T001 Grep every reader of `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN`
- [x] T002 Measure the cold start after an eviction, three runs, and record it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Change the unset default in `getModelServerIdleConfig` (`.skilled/bin/lib/model-server-supervision.cjs`)
- [x] T004 Update the default-disabled expectations (`launcher-model-server-idle-eviction.vitest.ts`)
- [x] T005 Update the default in `ENV-REFERENCE.md` and `.env.example`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the idle eviction suite (embedders 90 passed, 2 skipped; supervision suites 29; advisor launcher-bootstrap 20)
- [x] T007 Live check: an idle launcher drops its model server and the next query respawns it (superseded by ADR-002; the eviction case in the supervision suite stands in)
- [x] T008 Strict validation of this folder (RESULT: PASSED after the orchestrator refreshed the generated metadata)
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
