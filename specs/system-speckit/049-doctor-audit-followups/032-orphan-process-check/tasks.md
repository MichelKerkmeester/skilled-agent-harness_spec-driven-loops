---
title: "Tasks: Phase 32: orphan-process-check"
description: "Tasks for the doctor orphan process check: fixtures, scanner, classifier, guarded reap, doctor line, verification."
trigger_phrases:
  - "orphan process check tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 32: orphan-process-check

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

- [x] T001 Turn the 2026-10-21 cleanup into fixture `ps` rows, macOS and Linux (representative rows per kind; ADR-001)
- [x] T002 Write the allowlist of intended daemons
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Scanner and classifier (`orphan-process-check.cjs`)
- [x] T004 `--reap` with command-line and start-time re-check
- [x] T005 Doctor step and presentation line (`doctor-setup.yaml`, `doctor-setup-presentation.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Tests: parsing, allowlist, PID reuse, gone PID (`orphan-process-check.test.cjs`)
- [x] T007 Doctor tests (contract test for the setup step and line; suite 422 of 422)
- [x] T008 Live scan on this machine compared with a hand count
- [x] T009 Strict validation of this folder
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
