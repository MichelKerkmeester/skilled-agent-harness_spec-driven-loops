---
title: "Tasks: Phase 4: archive-search-and-json"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "archive search and json tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: archive-search-and-json

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

`K` is `.skilled/skills/system-spec-kit`. `W` is `$K/runtime/cli/retrieval/rg-wrapper.mjs`. `PHRASE` is a phrase that lives only under `specs/sk-doc/z_archive/`, chosen in T003.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Count the archived packets with a non-null `parent_id` and record the number (`goal.md` section 4 of this phase). Verify: `rg -c "stale parent_id" goal.md` prints 1.
- [ ] T002 Count the rows in `specs/descriptions.json` whose folder is missing on disk and record the number (`specs/descriptions.json`). Verify: `rg -c "dead description rows" goal.md` prints 1.
- [ ] T003 Pick `PHRASE` and confirm the default search misses it (`$W`). Verify: `node $W` with `PHRASE` exits 1, and `rg -l -F "PHRASE" specs/sk-doc/z_archive` prints at least one path.
- [ ] T004 Capture the test baseline before the first edit (`$K/runtime/cli/package.json`). Verify: `cd $K/runtime/cli && npm test` prints the pass and fail counts, saved to `scratch/baseline.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Export an archive variant of `GLOBS` without `!**/z_archive/**`, leaving `GLOBS` frozen (`$K/runtime/cli/retrieval/lib/rg-lane.mjs`). Verify: `rg -n -F "'!**/z_archive/**'" $K/runtime/cli/retrieval/lib/rg-lane.mjs` still prints line 54 inside `GLOBS`.
- [ ] T006 Add `--include-archive` to the recipe builders and label each hit under `z_archive` as `archived` (`$W`). Verify: `node $W --include-archive` with `PHRASE` exits 0 and prints `archived`.
- [ ] T007 Add the JSON lane over `description.json` and `graph-metadata.json` under archives (`$W`). Verify: `node $W --include-archive` with an archived packet's `packet_id` prints a `graph-metadata.json` path.
- [ ] T008 Add `--include-archive` flag parsing beside `--recursive` (`$K/runtime/cli/spec/validate.sh`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/sk-doc --include-archive` without `--recursive` exits 2 with usage.
- [ ] T009 Make `collect_phase_dirs` append `z_archive/[0-9][0-9][0-9]-*/` at track, subtrack and phase depth when the flag is set (`$K/runtime/cli/spec/validate.sh`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/sk-doc --recursive --include-archive` prints a result line for `019-skill-routing-refactor`.
- [ ] T010 Run the repair pass over every archive, dry run first (`$K/runtime/cli/spec/repair-derived.cjs`). Verify: after `--roots <archive> --apply`, a second run without `--apply` exits 0.
- [ ] T011 Regenerate the description cache with the producer named in phase 001 task T002 (`specs/descriptions.json`). Verify: the T002 count, measured again, prints 0.
- [ ] T012 Refresh the description cache at the end of `archive_spec` and `restore_spec` (`$K/runtime/cli/spec/archive.sh`). Verify: `bash -n $K/runtime/cli/spec/archive.sh` exits 0 and `npx vitest run tests/archive-track.vitest.ts` exits 0.
- [ ] T013 [P] Document the mode and one recipe, and state that resume excludes archives (`.skilled/commands/speckit/search.md`). Verify: `rg -c -e "--include-archive" .skilled/commands/speckit/search.md` prints 1 or more.
- [ ] T014 [P] Document the mode beside the glob rules (`$K/references/retrieval/retrieval-conventions.md`). Verify: `rg -c -e "--include-archive" $K/references/retrieval/retrieval-conventions.md` prints 1 or more.
- [ ] T015 [P] Correct the doc comment at lines 469 to 475 (`$K/runtime/lib/search/folder-discovery.ts`). Verify: `rg -c "staging and archive" $K/runtime/lib/search/folder-discovery.ts` prints nothing.
- [ ] T016 [P] Correct lines 49 and 206 (`$K/runtime/ENV-REFERENCE.md`). Verify: `rg -n "SPECKIT_GENERATED_METADATA_Z_EXCLUSION" $K/runtime/ENV-REFERENCE.md` prints lines that name `z_future` only as excluded.
- [ ] T017 [P] Correct line 150 (`$K/runtime/lib/search/README.md`). Verify: `rg -n "isGeneratedMetadataZExclusionEnabled" $K/runtime/lib/search/README.md` prints a line without `z_archive` as excluded.
- [ ] T018 [P] Correct the comment at lines 1290 to 1292 (`$K/runtime/lib/validation/orchestrator.ts`). Verify: `rg -c "nothing re-derives it" $K/runtime/lib/validation/orchestrator.ts` prints nothing and `npm run build` in `$K/runtime` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Search `PHRASE` with and without the mode (`$W`). Verify: without the flag the run exits 1, and with `--include-archive` it exits 0 and every row is labeled `archived`.
- [ ] T020 Confirm the trigger index is unchanged (`$K/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: `node $K/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0.
- [ ] T021 Confirm the default recursive run visits the same folders (`$K/runtime/cli/spec/validate.sh`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/sk-doc --recursive` prints no folder path that holds `z_archive`.
- [ ] T022 Rerun the full suite and compare with the baseline (`scratch/baseline.txt`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline.
- [ ] T023 Validate this phase folder (`spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh . --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `PHRASE` is found only with `--include-archive`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A blocked task is marked `[B]` with its reason in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] The description cache producer is named in phase 001 `goal.md`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check $W` and `node --check $K/runtime/cli/retrieval/lib/rg-lane.mjs` exit 0
- [ ] CHK-011 [P0] `bash -n $K/runtime/cli/spec/validate.sh` and `bash -n $K/runtime/cli/spec/archive.sh` exit 0
- [ ] CHK-012 [P1] `--include-archive` without `--recursive` exits 2 with usage
- [ ] CHK-013 [P1] No code comment names a spec path, a task id or a requirement id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The default argument vector is byte-identical to the one before this phase
- [ ] CHK-022 [P1] An archive at subtrack depth and one at phase depth are both reached
- [ ] CHK-023 [P1] The repair pass dry run was read before `--apply`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase adds an opt-in mode and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No changed script reads a credential or a `.env` file
- [ ] CHK-031 [P0] The archive mode adds no search root outside `specs` and `.skilled`
- [ ] CHK-032 [P1] N/A: the scripts have no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `search.md` and `retrieval-conventions.md` show the same recipe
- [ ] CHK-042 [P2] The coverage row at `retrieval-conventions.md` line 315 mentions the opt-in mode
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The baseline lives in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
