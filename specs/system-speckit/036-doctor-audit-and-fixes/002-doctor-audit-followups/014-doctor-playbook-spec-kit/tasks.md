---
title: "Tasks: Phase 14: doctor-playbook-spec-kit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor-playbook-spec-kit tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 14: doctor-playbook-spec-kit

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

- [x] T001 Read the command contracts and list one scenario per target (.skilled/commands/doctor/speckit.md, .skilled/commands/doctor/runtime-mirrors.md, .skilled/commands/doctor/env.md, .skilled/commands/doctor/update.md, .skilled/commands/doctor/assets/)
- [x] T002 Allocate DOC- IDs that no other playbook uses
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write the 13 new scenario files through a delegated executor (`.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/`)
- [x] T005 Add the root index rows and the category README
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` exits 0
- [x] T007 Check every expected signal against the command doc or its YAML asset
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



