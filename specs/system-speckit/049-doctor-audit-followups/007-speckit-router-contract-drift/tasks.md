---
title: "Tasks: Phase 7: speckit-router-contract-drift"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: speckit-router-contract-drift

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

- [x] T001 Confirm the cause: the contract still names the auto/confirm pair the three lifecycle commands merged (`command-contract.json`)
- [x] T002 Confirm resume keeps its pair on purpose (`033-system-speckit-v4/032-recorded-findings-closure/006-lifecycle-command-asset-merge/spec.md`)
- [x] T003 List the readers of asset entries: the generator and the doctor contract test
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `workflow` purpose and the `commands` filter (`command-contract.schema.json`)
- [x] T005 Describe the speckit family per router (`command-contract.json`)
- [x] T006 Skip an asset whose `commands` list leaves out the router (`generate-command-routers.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the generator check: 32 of 32 routers clean, exit 0
- [x] T008 Remove a required path from `plan.md`, then `resume.md`, and confirm the check exits 1 naming it; restore both from git
- [x] T009 Validate the contract with Ajv and confirm it rejects a malformed command id and an unknown purpose
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



