---
title: "Tasks: Phase 11: frontmatter-values-to-sk-doc"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "frontmatter values to sk doc tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: frontmatter-values-to-sk-doc

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

- [x] T001 Record the baseline: shared tests, CLI vitest, sk-doc Python tests, advisor checker, and the exports of `dist/context-types.js` (`scratch/baseline/`): shared 18/18, CLI 1,671/19 skipped, sk-doc 7/7, advisor 2/2, corpus 7+7
- [x] T002 Write the D1 amendment (`decision-record.md`): ADR-001, amending 002 ADR-001
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Create the new file without the session list (`sk-create-frontmatter/assets/frontmatter-values.json`): lists equal to the old file
- [x] T004 Read it at run time and make the session list a literal (`context-types.ts`, `tsconfig.json`): exports from source and `dist` identical to the baseline
- [x] T005 Repoint the rule helper and its messages (`check-frontmatter-values-helper.cjs`, `check-frontmatter-values.sh`, `validator-registry.json`): CLI vitest unchanged
- [x] T006 Repoint the sk-doc validator (`validate_document.py`): 7/7, missing file still silent
- [x] T007 Repoint the advisor checker (`check-skill-doc-frontmatter.mjs`): 2/2
- [x] T008 Delete the old file (`system-spec-kit/shared/frontmatter-values.json`): backed up to `scratch/baseline/` first, with the stale `dist/` copy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every baseline check and compare: every count equal (`scratch/after/`)
- [x] T010 Rerun phase 008's corpus sweep and compare with its baseline: the same 7 warnings per checker
- [x] T011 Update every live doc that names the old path, and state the new owner in `sk-create-frontmatter`: `rg` outside `specs/` finds no old path
- [x] T012 Write the implementation summary
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

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`node --check`, `py_compile` and `tsc --build` clean)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented (missing file: three readers fail naming the path, the Python reader stays silent)
- [x] CHK-013 [P1] Code follows project patterns (walk-up follows `hf-local.ts` `systemSpecKitRoot()`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (8/8)
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested (run from `dist/`, run from a worktree)
- [x] CHK-023 [P1] Error scenarios validated (file missing, per reader)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (path move: cross-consumer)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (`rg -l frontmatter-values` lists every reader)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (three `@spec-kit/shared/context-types` importers covered by the CLI suite)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (not applicable, no parser change)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (four readers, two module locations)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (not applicable, no process-wide state read)
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (nothing is committed under D4, so no fix SHA exists yet)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (malformed or missing file fails, never an empty list)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable) (`sk-create-frontmatter/README.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion (scratch holds the baseline and backups, kept on purpose)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 12/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---
