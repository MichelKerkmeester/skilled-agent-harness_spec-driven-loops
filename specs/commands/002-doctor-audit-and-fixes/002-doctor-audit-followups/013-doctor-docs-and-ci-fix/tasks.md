---
title: "Tasks: Phase 13: doctor-docs-and-ci-fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor docs and ci fix tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: doctor-docs-and-ci-fix

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

- [x] T001 Reproduce the CI failure: `skill-advisor-route-contract.test.cjs` throws MODULE_NOT_FOUND for `yaml`
- [x] T002 Trace it: `yaml` is only a transitive dependency in `.skilled`, and the doctor-scripts job never installs `.skilled`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Declare `yaml` 2.9.0 as an exact devDependency (`.skilled/package.json`, `.skilled/package-lock.json`)
- [x] T004 Install `.skilled` in the doctor-scripts job (`.github/workflows/spec-kit-check.yml`)
- [x] T005 Correct the root README hook text: saved gate settings, `.sk-git/` rule changes, crash and unreadable-file blocks, Off Switches (`README.md`)
- [x] T006 [P] Add doctor command pointers to the five targeted skill READMEs and `ENV-REFERENCE.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Clean `npm ci` of `.skilled` installs yaml 2.9.0; `run-all.sh` passes 7 of 7 suites
- [x] T008 Every edited doc passes `validate_document.py`; Human Voice hard-blocker counts match the committed copies
- [x] T009 Recheck the v4.0.0.3 entry against the code; mirror, metadata and route-guard checks pass
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



