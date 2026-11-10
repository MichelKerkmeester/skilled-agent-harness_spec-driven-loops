---
title: "Tasks: Let a host repository name its trigger index folder"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "configurable host index folder tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Let a host repository name its trigger index folder

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

`R` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval`, and `H` is `.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the HEAD case count of the host test file (`H`). Verify: `git show HEAD:<H> | rg -c "^\s+it\("` prints 20.
- [x] T002 Reproduce the fixed folder at HEAD (`R/lib/host-index.mjs`). Verify: `git show HEAD:<host-index.mjs> | rg -n "speckit-index|HOST_INDEX_RELATIVE"` prints lines 35 and 84 among its matches.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `hostIndexDir`, `DEFAULT_HOST_INDEX_DIR` and `HOST_SETTINGS_FILE`, with the settings contract (`R/lib/host-index.mjs`). Verify: `rg -n "^export (const|function) (DEFAULT_HOST_INDEX_DIR|HOST_SETTINGS_FILE|hostIndexDir)" R/lib/host-index.mjs` prints lines 41, 47 and 142.
- [x] T004 Route `isHostRepository()` and `hostIndexPath()` through the configured folder (`R/lib/host-index.mjs`). Verify: `rg -n "hostIndexDir\(" R/lib/host-index.mjs` prints lines 105, 142, 202 and 218.
- [x] T005 Read the configured folder in the generator's own-directory check, and update its header comment (`R/generate-trigger-index.mjs`). Verify: `rg -n "hostIndexDir" R/generate-trigger-index.mjs` prints the import on line 74 and the call on line 688.
- [x] T006 Map a setting error to exit 2 in the generator (`R/generate-trigger-index.mjs`, `main()`). Verify: the case "exits 2 from both scripts on a setting it cannot honor" in T017 passes.
- [x] T007 Map a setting error to exit 2 in the lookup (`R/lookup-trigger-index.mjs`, `main()`). Verify: the case "exits 2 from both scripts on a setting it cannot honor" in T017 passes.
- [x] T008 Name the configured folder in the lookup's header and function comments (`R/lookup-trigger-index.mjs`). Verify: `rg -n "indexDir" R/lookup-trigger-index.mjs` prints the comment lines 26 and 70.
- [x] T009 Describe `.skilled-host.json` and the linked-project reading rule (`runtime/data/README.md`). Verify: `rg -n "skilled-host\.json" .skilled/skills/system-spec-kit/runtime/data/README.md` prints lines 41 and 67.
- [x] T010 Document `hostIndexDir` and the error rules (`R/lib/README.md`). Verify: `rg -n "hostIndexDir" R/lib/README.md` prints lines 36 and 57.
- [x] T011 Name the configured folder in section 7 (`references/structure/folder-structure.md`). Verify: `rg -n "skilled-host\.json" .skilled/skills/system-spec-kit/references/structure/folder-structure.md` prints line 403.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Test the default folder when no setting exists (`H`). Verify: the verbose run lists "keeps the default directory when the host names none" as passed.
- [x] T013 Test generation into a named folder and the lookup that reads it (`H`). Verify: the verbose run lists "generates into the named directory and the lookup reads it" as passed.
- [x] T014 Test that the host check counts the named folder (`H`). Verify: the verbose run lists "counts the named directory, not the default, as the host signal" as passed.
- [x] T015 Test that a linked project reads its owner's named folder (`H`). Verify: the verbose run lists "lets a linked project read the directory its owning host names" as passed.
- [x] T016 Test the eleven rejected `indexDir` values (`H`). Verify: the run lists all eleven "rejects indexDir ... rather than falling back" cases as passed.
- [x] T017 Test exit 2 from both scripts on a setting they cannot honor (`H`). Verify: the verbose run lists "exits 2 from both scripts on a setting it cannot honor" as passed.
- [x] T018 Test that a settings file that is not JSON is refused (`H`). Verify: the verbose run lists "rejects a settings file that is not JSON" as passed.
- [x] T019 Run the 15 related cli test files with the same counts as the baseline. Verify: the clean run printed `Test Files  15 passed (15)` and `Tests  282 passed | 1 skipped (283)`, and exited 0.
- [x] T020 Mutation check: restoring the hard-coded default in `isHostRepository()` fails the host-check case (recorded by the operator, not re-run here). Verify: the recorded run printed `1 failed` for "counts the named directory, not the default, as the host signal".
- [x] T022 Test that a settings file holding JSON but no object is refused (`H`). Verify: the three "rejects settings ... that are JSON but not an object" cases pass in the 48-case run.
- [x] T023 Test that a linked project gets the packaged index when its owner names a folder holding no index (`H`). Verify: "gives a linked project the packaged index when its host names a folder holding no index" passes in the 48-case run.
- [x] T024 Correct `.skilled/commands/speckit/search.md` on host index selection and exit 2. Verify: `rg -n "skilled-host\.json" .skilled/commands/speckit/search.md` prints two lines.
- [x] T025 Judge the named folder by where it lands: trim it, follow links, refuse `.git/` and `node_modules/`, any letter case of a reserved name and a regular file (`R/lib/host-index.mjs`). Verify: the four added rejection rows and the cases "rejects a directory that is a link to somewhere outside the host", "rejects a directory that is a link into the corpus", "rejects a name that is already a regular file" and "ignores blank space around the directory name" pass in the 48-case run.
- [x] T026 Exit 2 from `runtime/cli/spec/upgrade-legacy.mjs` on a setting it cannot honor. Verify: "exits 2 from the legacy upgrade on a setting it cannot honor" passes in the 48-case run.
- [x] T027 Rerun the 15 related cli test files after T025 and T026. Verify: the run printed `Test Files  15 passed (15)` and `Tests  297 passed | 1 skipped (298)`, and exited 0.
- [x] T028 Print one stderr line from the lookup when the named folder holds no index and the default folder still does (`R/lib/host-index.mjs`, `R/lookup-trigger-index.mjs`). Verify: "says on stderr that a named folder holds no index while the default one still does" passes in the 48-case run.
- [x] T029 Test that a linked project reads the index it keeps itself (`H`). Verify: "reads the index the project keeps itself before its host is asked" passes in the 48-case run.
- [x] T030 Name the setting in `README.md`, `.skilled/skills/system-spec-kit/README.md` and `.skilled/commands/speckit/README.txt`, and state in `search.md` that a project's own index wins. Verify: `rg -l "skilled-host" README.md .skilled/skills/system-spec-kit/README.md .skilled/commands/speckit/README.txt` prints all three files.
- [x] T031 Fold the setting and the root guide alignment into `.skilled/changelog/skilled/v4.0.2.0.md`. Verify: `check_changelog_shape.py` prints `PASS` and `rg -c "skilled-host"` on the entry prints 2.
- [x] T032 Write `.skilled/skills/system-spec-kit/changelog/v2.12.40.0.md` and raise `SKILL.md` to 2.12.40.0. Verify: `check_changelog_shape.py` prints `PASS` and `validate_document.py` reports 0 issues.
- [x] T021 Strict validation of this folder. Verify: `validate.sh specs/system-speckit/047-v4-release-line-research/023-configurable-host-index-folder --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: none needed, every case is automated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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
- [x] CHK-003 [P1] Dependencies identified and available: vitest 4.1.12 is present at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes syntax and whitespace checks: `node --check` exits 0 on the four scripts, and `git diff --check` is clean
- [x] CHK-011 [P0] No failing case in the host test file. The only warning is the Vite `configLoader` notice that every run prints
- [x] CHK-012 [P1] Error handling implemented: the generator, the lookup and the legacy upgrade return exit 2 with a message on setting errors
- [x] CHK-013 [P1] Code follows the retrieval scripts' existing error convention: `process.stderr.write` and exit code 2
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: twelve of twelve are Met in `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing: N/A, every case is automated, and Barter's re-pin is Barter's step
- [x] CHK-022 [P1] Edge cases tested: the default, the empty value and the failure paths are covered. The maximum input has no test, because the code adds no length check
- [x] CHK-023 [P1] Error scenarios validated: the exit-2 case and the non-JSON case
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the diff of the twelve changed files holds no credential literal
- [x] CHK-031 [P0] Input validation implemented: `hostIndexDir` rejects the unsafe values listed in T016 and T025
- [x] CHK-032 [P1] N/A: no auth surface in this change
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: the validator's cross-doc status and spec-doc integrity rules pass, and the test counts match in all five files
- [x] CHK-041 [P1] Changed code comments state the rule the code applies, and carry no spec or finding labels
- [x] CHK-042 [P2] README updated: `runtime/data/README.md` and `lib/README.md`, and `folder-structure.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: probe logs were written to the session scratchpad, outside the worktree
- [x] CHK-051 [P1] scratch/ cleaned before completion: scratch/ holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---

