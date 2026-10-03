---
title: "Tasks: Authored compiled-routing source home"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "authored routing source tasks"
  - "router program custodian tasks"
  - "compiled routing source verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Authored compiled-routing source home

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

- [x] T001 Confirm the layout pin (`.skilled/bin/lib/compiled-route-layout.cjs`) Evidence: `AUTHORED_PROGRAM_DIR` joins `specs`, `sk-doc`, `019-skill-routing-refactor`, `015-router-unification-program` at line 54.
- [x] T002 [P] Confirm the serving closure's source (`.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`) Evidence: `generatedFrom` names the authored program folder.
- [x] T003 [P] Count the tracked authored files (`015-router-unification-program/`) Evidence: `git ls-files` lists 127 files across seven program stages.
- [x] T004 [P] Locate the packet history (`specs/sk-doc/z_archive/019-skill-routing-refactor/`) Evidence: spec, context index, handover, timeline and two routing references present.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Write the specification (`spec.md`)
- [x] T006 Write the plan (`plan.md`)
- [x] T007 Write the task list (`tasks.md`)
- [x] T008 Write the implementation summary (`implementation-summary.md`)
- [x] T009 Generate the folder description and graph metadata (`description.json`, `graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Strict validation of the folder prints `RESULT: PASSED` (`validate.sh --strict`)
- [x] T011 [P] The compiled-route guard passes (`.skilled/bin/compiled-route-guard.cjs`)
- [x] T012 [P] The no-spec-imports guard passes (`.skilled/bin/check-no-spec-imports.cjs`)
- [x] T013 [P] No file under the authored program folder changed (`git status --short`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001 to T013)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (results in `implementation-summary.md`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **History**: See `specs/sk-doc/z_archive/019-skill-routing-refactor/spec.md`
<!-- /ANCHOR:cross-refs -->
