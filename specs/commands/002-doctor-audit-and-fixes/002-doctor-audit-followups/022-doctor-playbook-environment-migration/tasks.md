---
title: "Tasks: Phase 22: doctor-playbook-environment-migration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor playbook environment migration tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 22: doctor-playbook-environment-migration

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

- [x] T001 Write the Test Environments guide and DOC-379
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Point the How to Run sections of three other doctor READMEs at the guide
- [x] T003 Move 11 spec-kit and skill-advisor scenarios onto the current-code environment
- [x] T004 Move 7 deep-loop, sk-git and mcp scenarios onto the current-code environment
- [x] T005 Move 5 /doctor:update scenarios onto the fixture
- [x] T006 Correct the rebuild scenario's step references by hand
- [x] T007 Regenerate the mcp-code-mode leaf manifests
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Validate, voice-scan and prompt-diff every changed scenario
- [x] T009 Rerun the fixture claims the update scenarios use
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



