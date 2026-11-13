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

`K` is `.skilled/skills/system-spec-kit`. `W` is `$K/runtime/cli/retrieval/rg-wrapper.mjs`. `PHRASE` is a phrase that lives only under `specs/sk-doc/z_archive/`, chosen in T003. It is "skill routing refactor". `CLONE` is a throwaway clone of the repository. Every `[EVIDENCE: ...]` note records a run the orchestrator observed on 2026-11-13, unless the note names another source. "By reading" means the closeout worker read the code diff of commit `05a83a7d88`, which is not a run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Count the archived packets with a non-null `parent_id` and record the number (`goal.md` section 4 of this phase). Verify: `rg -c "stale parent_id" goal.md` prints 1. [EVIDENCE: before the first edit 35 of 267 packets that sit directly in a `z_archive/` recorded a non-null `parent_id`. One row of `goal.md` section 4 holds the count before and after the repair]
- [x] T002 Count the rows in `specs/descriptions.json` whose folder is missing on disk and record the number (`specs/descriptions.json`). Verify: `rg -c "dead description rows" goal.md` prints 1. [EVIDENCE: before the first edit 1334 of 3916 rows named a folder missing on disk. One row of `goal.md` section 4 holds the count before and after the regeneration]
- [x] T003 Pick `PHRASE` and confirm the default search misses it (`$W`). Verify: `node $W` with `PHRASE` exits 1, and `rg -l -F "PHRASE" specs/sk-doc/z_archive` prints at least one path. [EVIDENCE: `node $W path "skill routing refactor"` exited 1 with 0 paths. `rg -l -F -i`, run with `-i` because the wrapper ignores case, found the phrase in `specs/sk-doc/z_archive/019-skill-routing-refactor/spec.md` and `timeline.md`]
- [x] T004 Capture the test baseline before the first edit (`$K/runtime/cli/package.json`). Verify: `cd $K/runtime/cli && npm test` prints the pass and fail counts, saved to `scratch/baseline.txt`. [EVIDENCE: `scratch/baseline.txt` is the full run after phase 003 and before the first edit of this phase. Exit 0, 206 files passed and 3 skipped, 2525 tests passed and 20 skipped, 0 failed in every legacy stage]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Export an archive variant of `GLOBS` without `!**/z_archive/**`, leaving `GLOBS` frozen (`$K/runtime/cli/retrieval/lib/rg-lane.mjs`). Verify: `rg -n -F "'!**/z_archive/**'" $K/runtime/cli/retrieval/lib/rg-lane.mjs` still prints line 54 inside `GLOBS`. [EVIDENCE: the command still prints line 54 inside `GLOBS`. By reading: the file exports `ARCHIVE_GLOBS`, filtered from `GLOBS`, and each of its three recipes takes an `{ includeArchive }` option]
- [x] T006 Add `--include-archive` to the recipe builders and label each hit under `z_archive` as archived, `[archived]` in the text report and `archived: true` in the JSON rows (`$W`). Verify: `node $W --include-archive` with `PHRASE` exits 0 and prints `archived`. [EVIDENCE: the path recipe with `--include-archive` exited 0 and printed 2 paths, both ending `[archived]`. The structured recipe with `--json` returned 2 rows, both `archived: true`, and `includeArchive: true`]
- [x] T007 Add the JSON lane over `description.json` and `graph-metadata.json` under archives (`$W`). Verify: `node $W --include-archive` with an archived packet's `packet_id` prints a `graph-metadata.json` path. [EVIDENCE: `node $W path "sk-doc/z_archive/019-skill-routing-refactor" --include-archive --limit 2` exited 0 and printed a `json    : 308 archived metadata file(s)` section. 154 of its lines are `graph-metadata.json` paths ending `[archived]`. A phrase that exists nowhere exited 1 with `json    : 0 archived metadata file(s)`]
- [x] T008 Add `--include-archive` flag parsing beside `--recursive` (`$K/runtime/cli/spec/validate.sh`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/sk-doc --include-archive` without `--recursive` exits 2 with usage. [EVIDENCE: the run printed `ERROR: --include-archive requires --recursive` and exited 2. `bash -n validate.sh` exited 0. By reading: a `Usage:` line follows the error line]
- [x] T009 Make `collect_phase_dirs` append the `z_archive/[0-9][0-9][0-9]*/` packets of the folder it is given, and of each subtrack when that folder is a track root, when the flag is set (`$K/runtime/cli/spec/validate.sh`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/sk-doc --recursive --include-archive` prints a result line for `019-skill-routing-refactor`. [EVIDENCE: the run printed 73 `RESULT:` lines, one of them for `specs/sk-doc/z_archive/019-skill-routing-refactor`. It exited 2 because old archived packets fail current rules, which is expected. Reworded: the archive is read one level only. Subtrack and phase depth were observed later through `tests/validate-archive-recursive.vitest.ts`, which runs the real `validate.sh` in temp trees: 5 of 5 cases pass, and the sub-track case and the phase parent case each assert the archived folder is reported with the flag and absent without it]
- [x] T010 Run the repair pass over every archive, dry run first (`$K/runtime/cli/spec/repair-derived.cjs`). Verify: after `--roots <archive> --apply`, a second run without `--apply` exits 0. [EVIDENCE: the first dry run over all 53 `z_archive/` folders gave 43 exit 0 and 10 exit 1, with 187 packets to re-derive. After `--apply` the second dry run exited 0 for all 53, yet 31 packets still recorded their archive as `parent_id`. After the fix to `repair-derived.cjs` and `--apply` on those 31 packets, 31 exit 0, the dry run exits 0 for all 53 and 0 of 267 archived packets record a non-null `parent_id`]
- [x] T011 Regenerate the description cache with its producer, `ensureDescriptionCache` in `$K/runtime/lib/search/folder-discovery.ts`, called from the compiled module because no CLI regenerates it (`specs/descriptions.json`). Verify: the T002 count, measured again, prints 0. [EVIDENCE: on the real tree the producer ran in 30 seconds. Afterwards `specs/descriptions.json` holds 5152 rows, 0 dead rows and 2213 rows under `z_archive`]
- [x] T012 Refresh the description cache at the end of `archive_spec` and `restore_spec` (`$K/runtime/cli/spec/archive.sh`). Verify: `bash -n $K/runtime/cli/spec/archive.sh` exits 0 and `npx vitest run tests/archive-track.vitest.ts` exits 0. [EVIDENCE: `bash -n archive.sh` exited 0. In `CLONE`, `archive.sh --force specs/cli-classifier/006-jev-feature-auto-enable` exited 0 in 13 seconds, and `descriptions.json` then held no row for the old path, one row for `cli-classifier/z_archive/006-jev-feature-auto-enable` and 0 dead rows. `npx vitest run tests/archive-track.vitest.ts` alone: 60 passed. In `CLONE`, after that archive, `archive.sh --restore specs/cli-classifier/z_archive/006-jev-feature-auto-enable` exited 0, and the cache then held a row for `cli-classifier/006-jev-feature-auto-enable`, no row for the archived path and 0 dead rows]
- [x] T013 [P] Document the mode and one recipe, and state that resume excludes archives (`.skilled/commands/speckit/search.md`). Verify: `rg -c -e "--include-archive" .skilled/commands/speckit/search.md` prints 1 or more. [EVIDENCE: the command printed 1 or more. By reading: the added block shows the path recipe with `PHRASE` and says `/speckit:resume` excludes archives. A Fable 5.2 documents worker made the edit]
- [x] T014 [P] Document the mode beside the glob rules (`$K/references/retrieval/retrieval-conventions.md`). Verify: `rg -c -e "--include-archive" $K/references/retrieval/retrieval-conventions.md` prints 1 or more. [EVIDENCE: the command printed 1 or more. By reading: the mode is named beside the glob rules, in the glob order note and in the `z_archive` coverage row]
- [x] T015 [P] Correct the doc comment at lines 469 to 475 (`$K/runtime/lib/search/folder-discovery.ts`). Verify: `rg -c "staging and archive" $K/runtime/lib/search/folder-discovery.ts` prints nothing. [EVIDENCE: the command printed nothing. By reading: the comment now says `z_archive` folders stay in the cache]
- [x] T016 [P] Correct lines 49 and 206 (`$K/runtime/ENV-REFERENCE.md`). Verify: `rg -n "SPECKIT_GENERATED_METADATA_Z_EXCLUSION" $K/runtime/ENV-REFERENCE.md` prints lines that name `z_future` only as excluded. [EVIDENCE: both rows name only z-future as excluded. By reading: each row spells it `z-future`, the segment `index-scope.ts` matches, and adds "`z_archive` stays in the scan"]
- [x] T017 [P] Correct line 150 (`$K/runtime/lib/search/README.md`). Verify: `rg -n "isGeneratedMetadataZExclusionEnabled" $K/runtime/lib/search/README.md` prints a line without `z_archive` as excluded. [EVIDENCE: the row names only z-future as excluded. By reading: it ends "`z_archive` stays in"]
- [x] T018 [P] Correct the comment at lines 1290 to 1292 (`$K/runtime/lib/validation/orchestrator.ts`). Verify: `rg -c "nothing re-derives it" $K/runtime/lib/validation/orchestrator.ts` prints nothing and `npm run build` in `$K/runtime` exits 0. [EVIDENCE: the command printed nothing and `npm run build` exited 0]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Search `PHRASE` with and without the mode (`$W`). Verify: without the flag the run exits 1, and with `--include-archive` it exits 0 and every row is labeled `archived`. [EVIDENCE: without the flag the argument vector still holds `--glob '!**/z_archive/**'` and the run exits 1. With the flag the path recipe exits 0 with 2 paths, both ending `[archived]`, and the structured recipe returns 2 rows, both `archived: true`]
- [ ] T020 Confirm the trigger index is unchanged (`$K/runtime/cli/retrieval/generate-trigger-index.mjs`). Verify: `node $K/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0. Open: the check exited 1 during the build because 33 documents of this packet are new since the index was last built, not because of the code of this phase. The orchestrator regenerates and commits the index after these documents are written, and this task stays open until that check exits 0.
- [x] T021 Confirm the default recursive run visits the same folders (`$K/runtime/cli/spec/validate.sh`). Verify: `bash $K/runtime/cli/spec/validate.sh specs/sk-doc --recursive` prints no folder path that holds `z_archive`. [EVIDENCE: the run printed 25 `RESULT:` lines, none holding `z_archive`, and exited 0. With timings stripped its output was identical to the same run with the script from before the change]
- [x] T022 Rerun the full suite and compare with the baseline (`scratch/baseline.txt`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline. [EVIDENCE: `npm test` exited 0. 206 files passed and 3 skipped, 2525 tests passed and 20 skipped, 0 failed. The counts are identical to `scratch/baseline.txt`, so the delta is zero]
- [x] T023 Validate this phase folder (`spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh . --strict` prints `RESULT: PASSED`. [EVIDENCE: run by the closeout worker on 2026-11-13 after the last document edit, with `spec.md` at status Draft. It printed `RESULT: PASSED`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`. Open: T020 waits for the regenerated trigger index
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The subtrack and phase parent runs AC-004 names passed through `tests/validate-archive-recursive.vitest.ts`, and the restore run AC-006 names exited 0 in `CLONE` with 0 dead rows
- [x] `PHRASE` is found only with `--include-archive`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: `spec.md` section 4 holds REQ-001 to REQ-008]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: `plan.md` sections 3 and 4]
- [x] CHK-003 [P1] The description cache producer is named in phase 001 `goal.md`. [EVIDENCE: by reading, the T002 row of `../001-relocation-engine/goal.md` names `ensureDescriptionCache` in `folder-discovery.ts` and says no CLI calls it]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check $W` and `node --check $K/runtime/cli/retrieval/lib/rg-lane.mjs` exit 0. [EVIDENCE: `node --check` exits 0 for `rg-wrapper.mjs` and for `rg-lane.mjs`]
- [x] CHK-011 [P0] `bash -n $K/runtime/cli/spec/validate.sh` and `bash -n $K/runtime/cli/spec/archive.sh` exit 0. [EVIDENCE: exit 0 for both scripts]
- [x] CHK-012 [P1] `--include-archive` without `--recursive` exits 2 with usage. [EVIDENCE: `validate.sh specs/sk-doc --include-archive` printed `ERROR: --include-archive requires --recursive` and exited 2]
- [x] CHK-013 [P1] No code comment names a spec path, a task id or a requirement id. [EVIDENCE: by reading the diff of the seven code files in commit `05a83a7d88`. The added comments explain why the archive variant exists, why the JSON lane is its own invocation, why only the producer rewrites the cache and why the validator report alone misses a stale parent]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. Open: 7 of the 8 rows of `acceptance-criteria.md` are `Met`. AC-002 is `Unmet` until the regenerated trigger index makes `generate-trigger-index.mjs --check` exit 0
- [x] CHK-021 [P0] The default argument vector is byte-identical to the one before this phase. [EVIDENCE: without the flag the vector still holds `--glob '!**/z_archive/**'`, the JSON record holds no `jsonLane` and no `archived` field, and `tests/rg-wrapper-recipes.vitest.ts` and `tests/retrieval-coverage-parity.vitest.ts` passed 44 tests. By reading: both `GLOBS` constants are untouched and every builder takes `GLOBS` unless `includeArchive` is true. No dump of the vector from before the phase was compared byte for byte]
- [x] CHK-022 [P1] An archive at subtrack depth and one at phase depth are both reached. [EVIDENCE: `tests/validate-archive-recursive.vitest.ts` runs the real `validate.sh` in temp trees. Its sub-track case and its phase parent case pass, 5 of 5 in the file, and each asserts the archived folder is reported with the flag and absent without it. The real-tree runs sit in `specs/sk-doc/z_archive/`, an archive at track depth]
- [x] CHK-023 [P1] The repair pass dry run was read before `--apply`. [EVIDENCE: the first dry run over all 53 archives gave 43 exit 0 and 10 exit 1, with 187 packets to re-derive, and `--apply` ran after it]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase adds an opt-in mode and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed script reads a credential or a `.env` file. [EVIDENCE: by reading the diff of commit `05a83a7d88`. The added code builds ripgrep arguments, globs `z_archive` folders, reads `graph-metadata.json` and calls `ensureDescriptionCache` on the specs root]
- [x] CHK-031 [P0] The archive mode adds no search root outside `specs` and `.skilled`. [EVIDENCE: by reading, the archive variant only removes one glob, and `jsonLaneRecipe` takes the same roots as the main recipe]
- [x] CHK-032 [P1] N/A: the scripts have no auth surface. [EVIDENCE: by reading, none of the changed scripts takes a credential or opens a network connection]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. [EVIDENCE: `spec.md`, `plan.md` and this file all name the `repair-derived.cjs` fix, the producer `ensureDescriptionCache`, the two operator decisions and the one-level archive validation]
- [x] CHK-041 [P1] `search.md` carries the recipe and `retrieval-conventions.md` describes the same mode. [EVIDENCE: by reading the diff of commit `05a83a7d88`. Reworded: the row asked for the same recipe in both files. Only `search.md` shows a command line, the path recipe with `PHRASE`. `retrieval-conventions.md` describes the flag, the label and the JSON lane in prose]
- [x] CHK-042 [P2] The coverage row at `retrieval-conventions.md` line 315 mentions the opt-in mode. [EVIDENCE: by reading, the `z_archive` row now says the ripgrep wrapper searches it only on request, with `--include-archive`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The baseline lives in `scratch/` only. [EVIDENCE: `scratch/` holds `baseline.txt`, and no copy sits elsewhere in this folder]
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep` and `baseline.txt`, the evidence T004 and T022 cite. [EVIDENCE: `ls scratch` run by the closeout worker listed those two files. Reworded: the row asked for a cleaned `scratch/`, and the baseline stays because two tasks cite it]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 7/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
