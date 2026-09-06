---
title: "Tasks: Phase 1: index-root-and-docs"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "trigger index repo root"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: index-root-and-docs

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Confirm the defect: `DEFAULT_REPO_ROOT` printed the `.opencode` directory and the index held 11,497 paths, all under `specs/` (`runtime/cli/retrieval/generate-trigger-index.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `findRepoRoot()` and derive `DEFAULT_REPO_ROOT` from it (`runtime/cli/retrieval/generate-trigger-index.mjs`)
- [x] T003 Regenerate the index and fixtures twice; both runs hash `1792466ed4…` (`runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/`)
- [x] T004 [P] Replace the five "46-rule" claims and the harness header count (`README.md`, `runtime/cli/tests/test-validation-extended.sh`)
- [x] T005 [P] State the API boundary (`runtime/api/README.md`)
- [x] T006 Add the root and count tests (`runtime/cli/tests/retrieval-repo-root.vitest.ts`, `runtime/cli/tests/validator-registry-doc-count.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Typecheck exit 0; CLI build; dist fresh
- [x] T008 New tests 4 of 4; parity and trigger-index suites 63 of 63; corpus walk yields 8,054 skill files; index lists 1,864 skill documents
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
