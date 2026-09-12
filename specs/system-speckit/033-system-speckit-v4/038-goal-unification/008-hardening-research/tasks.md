---
title: "Tasks: Hardening research"
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
# Tasks: Hardening research

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

- [x] T001 Write the charter with five angles (research/deep-research-strategy.md)
- [x] T002 Launch the research lineage and the second review lineage detached
- [x] T003 Read both syntheses and open the cited lines
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fence parity and CR normalization in both extractors, with a parity fixture
- [x] T005 Real-path packet lock under the workspace state root; record-free shared append; rebind archiving; CRLF-safe rows
- [x] T006 Plugin unbind, log, unknown-action error, workspace walk, budget line, truncation warning; reminder names the runtime command
- [x] T007 Bind on the offer path when goal.md exists; locked log as the only bound path; packet_state with hint
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 node --test hook and plugin suites, vitest validator suite, drift verifier
- [x] T009 Two-writer alias test, CRLF test, missing-document test, truncation test, unknown-action test
- [x] T010 Contracts, catalogs, playbooks and command docs updated
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



