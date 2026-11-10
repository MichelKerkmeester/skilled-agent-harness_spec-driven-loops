---
title: "Tasks: README audit and changelog validator accuracy fixes"
description: "Ordered tasks and verification checklist for the README audit and changelog validator accuracy fixes."
trigger_phrases:
  - "audit and validator accuracy tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: README audit and changelog validator accuracy fixes

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the audit and the sk-doc suite on the unchanged tree. Verify: 237 / 98 / 14; suite `all sk-doc script tests passed`
- [x] T002 Test the symlink claim against the broken list. Verify: 0 of 98 references resolve from any of 479 symlinked aliases of their README folder
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Resolve git-ignored runtime paths in one batch (`audit_readmes.py`). Verify: `test_gitignored_runtime_path_is_resolved_with_evidence` passes
- [x] T004 Add the nearest package root as a base for bare tokens (`audit_readmes.py`). Verify: `test_bare_token_resolves_from_the_nearest_package_root` passes
- [x] T005 Match README names case-sensitively in discovery and the manifest (`audit_readmes.py`). Verify: `test_discovery_matches_readme_names_case_sensitively` passes
- [x] T006 Treat a folder ending in `-fixture` as a fixture payload (`audit_readmes.py`). Verify: `test_folder_named_as_a_fixture_is_a_fixture_payload` passes
- [x] T007 Carve algorithm names out of the changelog id pattern (`validate_document.py`). Verify: `test_algorithm_names_are_not_internal_ids` passes
- [x] T008 Regenerate the durable manifest. Verify: three directories removed, `test_readme_manifest.py` prints `manifest=reproducible`
- [x] T009 Write the sk-doc patch entry and carriers, regenerate the Hermes copy. Verify: carriers read 2.3.17.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the new tests against the HEAD scripts. Verify: 8 fail before, all pass after
- [x] T011 Rerun the audit and the changelog check. Verify: 235 / 50 / 13; SHA-256 warnings 4 to 0
- [x] T012 Rerun the full sk-doc suite. Verify: `all sk-doc script tests passed`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. Evidence: all six are `class-of-bug` in the checkers, not single-document fixes
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: every README-name comparison in `audit_readmes.py` now reads `README_FILENAMES`
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: plan.md affected surfaces
- [x] CHK-FIX-004 [P0] Path handling has adversarial tests. Evidence: outside-root, mistyped path under a broad rule, dotted token, package search above the repo root
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: base (README folder, package root, repo root) by state (exists, ignored, ignored with missing folder, outside repo)
- [x] CHK-FIX-006 [P1] Hostile global state: N/A, the tests build their own git repos under tmp_path
- [x] CHK-FIX-007 [P1] Evidence pinned to a diff range. Evidence: working tree over `3c6a76eeaa`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edited files pass their checks. Evidence: sk-doc suite passes
- [x] CHK-011 [P0] No new validator warnings on edited docs. Evidence: `validate_document.py` valid with no warnings on the changelog entry and both READMEs
- [x] CHK-012 [P1] Failure path handled. Evidence: a git error returns no ignored paths, so references stay broken
- [x] CHK-013 [P1] Code follows the file's existing style. Evidence: diff review
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Each change has a test that fails before. Evidence: 8 new tests fail on the HEAD scripts
- [x] CHK-022 [P1] Edge cases checked. Evidence: numbered `-fixture` spec folders stay in scope; `./` and `../` tokens stay README-relative
- [x] CHK-023 [P1] Before and after counts measured. Evidence: 237 / 98 / 14 to 235 / 50 / 13
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: diff review
- [x] CHK-031 [P0] Input validation: paths outside the repo are never passed to git. Evidence: `test_path_outside_the_repo_is_never_cleared_by_gitignore`
- [x] CHK-032 [P1] Auth/authz: N/A, local checker only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: validate.sh strict
- [x] CHK-041 [P1] Code comments carry the durable why. Evidence: diff review
- [x] CHK-042 [P2] README updated where in scope. Evidence: `sk-create-readme/scripts/README.md` and `scripts/tests/README.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept outside the repo, in the session scratchpad. Evidence: `git status`
- [x] CHK-051 [P1] scratch/ holds only its .gitkeep. Evidence: `ls scratch`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
