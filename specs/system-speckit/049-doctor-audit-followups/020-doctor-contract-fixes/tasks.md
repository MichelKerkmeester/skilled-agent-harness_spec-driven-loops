---
title: "Tasks: Phase 20: doctor-contract-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor contract fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 20: doctor-contract-fixes

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

- [x] T001 Read the research synthesis and both command contracts (`019-doctor-test-environment-research/research/research.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Make phrase quality an advisory and add explicit status rules (`doctor-speckit-retrieval.yaml`, `doctor-speckit-presentation.txt`)
- [x] T003 Add the `unknown_flag` error (`mcp.md`, `doctor-mcp-presentation.txt`)
- [x] T004 Write the two contract tests and list them in the tests README
- [x] T005 Update DOC-349 and DOC-350, create DOC-380 and index it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the new tests against the old and new contracts, then `run-all.sh`
- [x] T007 Validate the system-spec-kit and mcp-code-mode playbooks and voice-scan the edited scenarios
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



