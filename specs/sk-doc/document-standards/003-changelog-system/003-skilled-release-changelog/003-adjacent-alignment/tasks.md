---
title: "Tasks: Phase 3: adjacent-alignment"
description: "The ordered work for phase 3: reproduce and fix three code defects, correct the surfaces that describe them, add the catalog and playbook coverage, then version and verify."
trigger_phrases:
  - "adjacent-alignment tasks"
  - "changelog surface fix tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: adjacent-alignment

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

- [x] T001 Scaffold this phase and score its level (`recommend-level.sh`: Level 2, 48 of 100)
- [x] T002 Reproduce the hub defect: the version reader returns nothing for `sk-doc` and `sk-code` (step 3 of both YAMLs)
- [x] T003 Reproduce the type defects: three install-guide-named entries typed `install_guide`, five entries skipped as a fixture tree (`validate_document.py`)
- [x] T004 Reproduce the rendering defects: a quoted title breaks the YAML, and `$'` in a summary pastes the template tail (`nested-changelog.ts`)
- [x] T005 Trace the 027 finding to `parent_id` stored as the string `"null"`, shared by `sk-git/023`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Hub resolution in both workflows (`create-changelog-auto.yaml:448`, `create-changelog-confirm.yaml:437`, both parse)
- [x] T007 The hub rule in the mode contract (sk-create-changelog `SKILL.md:190` and `:374`)
- [x] T008 Changelog folder before the install-guide name, numbered spec folders out of the fixture rule, and tests (`validate_document.py:147`, `:254`, three tests at `test_changelog_validator.py:94`)
- [x] T009 Escaped frontmatter values, literal pasting and a test, then typecheck, suites and build (`nested-changelog.ts:572`, `nested-changelog.vitest.ts:251`, typecheck and build exit 0)
- [x] T010 [P] The command group README (`.skilled/commands/create/README.txt:49`, `:194`, `:208`)
- [x] T011 [P] The sk-create-changelog README (`sk-create-changelog/README.md:45`, `:106`)
- [x] T012 [P] The retrieval library README (`runtime/cli/retrieval/lib/README.md:32`)
- [x] T013 [P] The frontmatter reference (`sk-create-frontmatter/assets/frontmatter-templates.md:631`, `:682`)
- [x] T014 [P] The `.opencode` manifests (`.opencode/SYNC.md:34`, `.opencode/README.md:35`)
- [x] T015 CHG-001, CHG-006 and the playbook index (`sk-create-changelog/manual-testing-playbook/`, PASS with 0 violations)
- [x] T016 The sk-doc catalog entry for the changelog check (`sk-doc/feature-catalog/document-validation/changelog-entry-frontmatter-check.md`)
- [x] T017 The system-spec-kit catalog entry and playbook scenario for the identity phrase (`tooling-and-scripts/nested-changelog-generator.md` in each, scenario 458)
- [x] T018 The Changelogs section in the draft (`.skilled/changelog/skilled/v4.0.0.2.md:118`)
- [x] T019 `parent_id` as JSON null in packets 027 and `sk-git/023`, with the stale review flag removed (`graph-metadata.json:5` in each)
- [x] T020 Component entries, `SKILL.md` versions, the sk-doc hub files, child doc versions and the Hermes sync (v1.3.1.0, v2.2.2.0, v4.1.3.0, 3 Hermes copies written)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Rerun each reproduction and confirm it now passes (`acceptance-criteria.md` AC-001 to AC-003, AC-009)
- [x] T022 Run the suites, the validator sweep, the playbook and catalog validators, the drift guards and the voice scan (AC-004, AC-006, AC-007, AC-011, drift guards exit 0)
- [x] T023 Validate this folder and the parent with `validate.sh --strict` (both `RESULT: PASSED`, 0 errors and 0 warnings, the parent recursively)
- [x] T024 Refresh the frozen README manifest, which CI's sk-doc Script Tests failed on from the push that created `.skilled/changelog/skilled/` (`test_readme_manifest.py` reproduces 827 of 827)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

**Blocked now**: nothing. The commits, the committed index rebuild and the push follow validation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
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

- [x] CHK-010 [P0] `npm run typecheck` in `runtime/cli` exits 0, and `run-all-drift-guards.sh` passes both guards with exit 0 and no warning on a changed file
- [x] CHK-011 [P0] The vitest and pytest runs print no warning from the changed code (the one Vite config warning predates this phase)
- [x] CHK-012 [P1] A missing replacement key leaves its placeholder in place, and a hub path with no member link falls back to `{hub}/parent`
- [x] CHK-013 [P1] Code comments carry the durable why, with no spec path, packet number or finding id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (12 of 12 Met)
- [x] CHK-021 [P0] Each reproduction rerun by hand on the final tree: the version reader, the old and new validators and both renderers
- [x] CHK-022 [P1] Edge cases covered: a member whose link name differs from its packet, a title holding `"` and `\`, a summary holding `$'`, `$&` and a placeholder
- [x] CHK-023 [P1] A real install guide and a real fixture tree keep their handling (AC-012)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes recorded: hub resolution and type detection are `class-of-bug`, the renderer is `algorithmic`, and the two `"null"` strings are `instance-only`
- [x] CHK-FIX-002 [P0] Same-class producers inventoried: `rg -n "endswith\('fixtures'\)"` finds the validator and `package_skill.py`, and `rg -n '"parent_id": "null"'` finds only the two packets (plan.md affected surfaces)
- [x] CHK-FIX-003 [P0] Consumers inventoried: the validator's own entry point and tests read the two changed functions, `renderTemplate` has one caller, and the docs that describe each surface were corrected
- [x] CHK-FIX-004 [P0] Parser cases tested: a quote, a backslash, `$'`, `$&` and a placeholder inside a value, with the frontmatter parsed by `js-yaml`
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion: folder by name word by fixture segment (plan.md affected surfaces)
- [x] CHK-FIX-006 [P1] No changed code reads process-wide state, so no hostile variant applies
- [x] CHK-FIX-007 [P1] Evidence pinned to the working tree against HEAD `d6e0388d3e`, until the phase commits
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret in any changed file, and no `.env` file opened
- [x] CHK-031 [P0] A pasted value can no longer insert template text or break the frontmatter (AC-003)
- [x] CHK-032 [P1] No auth surface changed, so none needed checking
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] The command and mode READMEs updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratch folder only
- [x] CHK-051 [P1] This folder's `scratch/` holds nothing this phase wrote
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---
