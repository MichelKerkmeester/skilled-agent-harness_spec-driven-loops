---
title: "Tasks: Phase 3: subtrack-archive-and-numbering"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "subtrack archive and numbering tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: subtrack-archive-and-numbering

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

`K` is `.skilled/skills/system-spec-kit`. `C` is `$K/runtime/cli/spec`. `FIND` is `find specs -mindepth 3 -maxdepth 3 -type d -name z_archive -not -path "specs/*/[0-9][0-9][0-9]-*/*"`. `SCRATCH` is a scratch tree with one declared sub-track, `demo/sub`. `CLONE` is a throwaway clone used for the `create.sh` runs. Every `[EVIDENCE: ...]` note records a run the orchestrator observed on 2026-11-13, unless the note names another source.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Count the declared subtracks and their archive folders and record both numbers (`goal.md` section 4 of this phase). Verify: `FIND` prints nothing and the declared subtrack count is 40. [EVIDENCE: before the change `FIND` printed 0 paths and the sweep listed 40 declared sub-tracks. Both numbers are in `goal.md` section 4]
- [x] T002 Run the sweep before any change and save its output (`$C/sweep-track-roots.mjs`). Verify: `node $C/sweep-track-roots.mjs` output and exit code are saved to `scratch/sweep-before.txt`. [EVIDENCE: `scratch/sweep-before.txt` holds the sweep output, 40 of its lines naming a sub-track, and `exit=0`]
- [x] T003 Reuse the test baseline that phase 001 captured, copied into this phase because the first edit of this phase predates the session that closed it (`scratch/baseline.txt`). Verify: the file holds the `npm test` exit status and the pass and fail counts. [EVIDENCE: `scratch/baseline.txt` holds exit status 0, 206 test files passed and 2524 tests passed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the failing archive case first (`$K/runtime/cli/tests/create-root-numbering.vitest.ts`). Verify: `npx vitest run tests/create-root-numbering.vitest.ts` fails on the new case only. [EVIDENCE: reported by the build dispatch of the earlier session and not rerun by the orchestrator. The case `numbers after an archived packet so its number is not reused` failed before the `create.sh` change]
- [x] T005 Extend the highest-number loop in `resolve_branch_name` to read `"$SPECS_DIR"/z_archive/*` (`$C/create.sh`). Verify: `npx vitest run tests/create-root-numbering.vitest.ts` exits 0. [EVIDENCE: the loop reads `for dir in "$SPECS_DIR"/* "$SPECS_DIR"/z_archive/*`. The build dispatch reported the 17 tests of the file passing. The full `npm test` rerun exited 0 with 2525 tests passed, one above the baseline]
- [x] T006 Seed a missing `z_archive/.gitkeep` for each declared subtrack under `--apply` (`$C/refresh-track-roots.mjs`). Verify: in a scratch tree, `node $C/refresh-track-roots.mjs --specs <scratch>/specs --track demo/sub --apply` then `ls <scratch>/specs/demo/sub/z_archive/.gitkeep` prints the path. [EVIDENCE: `SCRATCH`, the dry run printed `demo/sub: create z_archive/.gitkeep`, exit 1, nothing written. `--apply` printed `demo/sub: create z_archive/.gitkeep (written)`, exit 0, and `.gitkeep` was present]
- [x] T007 Report a declared subtrack without `z_archive/` (`$C/sweep-track-roots.mjs`). Verify: in the same scratch tree before T006 ran, the sweep prints one line that names `demo/sub`. [EVIDENCE: `SCRATCH` before seeding, the sweep printed `demo/sub: sub-track has no z_archive/; seed it with refresh-track-roots.mjs --apply`, exit 0. After seeding it printed no such line, exit 0]
- [x] T008 Seed the real tree with the refresh for every track that holds subtracks (`specs/<track>/<sub-track>/z_archive/.gitkeep`). Verify: `FIND` prints 40 paths. [EVIDENCE: real tree, `node $C/refresh-track-roots.mjs --apply` wrote 40 `.gitkeep` files, exit 0. `FIND` then printed 40 paths]
- [x] T009 [P] Name the subtrack archive at line 41 (`$K/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md`). Verify: `rg -c -i "sub-track" $K/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` prints 1 or more. [EVIDENCE: the command printed 1. Line 41 names the sub-track's own `z_archive/`]
- [x] T010 [P] Name the subtrack archive in the `archive.sh` row, line 112 when planned and line 114 now (`$C/README.md`). Verify: `rg -c -i "sub-track's own .z_archive|sub-track archive" $C/README.md` prints 1 or more. [EVIDENCE: the command printed 1. The `refresh-track-roots.mjs` and `sweep-track-roots.mjs` rows describe the seeding and the advisory line too]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirm the sweep reports no missing archive (`$C/sweep-track-roots.mjs`). Verify: `node $C/sweep-track-roots.mjs` prints no missing-archive line and its exit code equals the one in `scratch/sweep-before.txt`. [EVIDENCE: real tree after seeding, the sweep printed no missing-archive line and exited 0, the exit code recorded in `scratch/sweep-before.txt`]
- [x] T012 Confirm the 40 files are ready to track (`specs/<track>/<sub-track>/z_archive/.gitkeep`). Verify: `git status --porcelain specs` lists 40 `z_archive/` entries, and after the operator's commit `git ls-files 'specs/*/*/z_archive/.gitkeep'` prints 40 lines. Evidence: before the commit `git status --porcelain specs` listed 40 `z_archive/` entries. After commit `5f3e19712e`, `git ls-files 'specs/*/*/z_archive/.gitkeep' | wc -l` printed 40.
- [x] T013 Confirm a second refresh writes nothing (`$C/refresh-track-roots.mjs`). Verify: `git status --porcelain` prints the same lines before and after a second `--apply` run. [EVIDENCE: real tree, `git status --porcelain` was byte-identical before and after a second `--apply`. In `SCRATCH` the second `--apply` printed only `demo/sub: up to date`, exit 0]
- [x] T014 Rerun the full suite and compare with the baseline (`scratch/baseline.txt`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline. [EVIDENCE: `npm test` exited 0. Vitest 206 files passed and 3 skipped, 2525 tests passed and 20 skipped, every legacy stage 0 failed. The baseline is 206 files and 2524 tests, so the delta is the one new numbering test. The first run after the build exited 1 with 3 failures in `tests/track-roots.vitest.ts`, fixed before this rerun]
- [x] T015 Validate this phase folder (`spec.md`). Verify: `bash $C/validate.sh . --strict` prints `RESULT: PASSED`. [EVIDENCE: run on 2026-11-13 after the last document edit, with `spec.md` at status Draft. It printed `RESULT: PASSED`]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed. The `SCRATCH`, `CLONE` and real-tree runs are recorded in `acceptance-criteria.md`
- [x] `FIND` prints 40 paths
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

- [x] CHK-001 [P0] Requirements documented in spec.md. [EVIDENCE: `spec.md` section 4 holds REQ-001 to REQ-006]
- [x] CHK-002 [P0] Technical approach defined in plan.md. [EVIDENCE: `plan.md` sections 3 and 4]
- [x] CHK-003 [P1] `scratch/sweep-before.txt` and `scratch/baseline.txt` exist and hold the state before the change. [EVIDENCE: `sweep-before.txt` holds the sweep output from before the seeding, with `exit=0`. `baseline.txt` is a copy of the phase 001 baseline. Neither file was written before the first edit, because that edit was made in an earlier session]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n $C/create.sh` exits 0. [EVIDENCE: exit 0]
- [x] CHK-011 [P0] `node --check $C/refresh-track-roots.mjs` and `node --check $C/sweep-track-roots.mjs` exit 0. [EVIDENCE: exit 0 for both scripts]
- [x] CHK-012 [P1] A symlinked `z_archive` is refused with a message that names it. [EVIDENCE: `SCRATCH` with `z_archive` a symlink, the refresh printed `demo/sub: z_archive is a symlink, not written`, exit 2, and the link target stayed empty]
- [x] CHK-013 [P1] No code comment names a spec path, a task id or a requirement id. [EVIDENCE: by reading `git diff` of the four changed code files on 2026-11-13. The added comments explain why archived packets count and why the archive is seeded]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. All 6 rows of `acceptance-criteria.md` are `Met`
- [x] CHK-021 [P0] The new numbering case failed before T005 and passes after it. [EVIDENCE: the failure before T005 is the report of the build dispatch of the earlier session, not an orchestrator run. The pass after it shows in the full suite, 2525 tests passed against a baseline of 2524]
- [x] CHK-022 [P1] An archive that holds only lower numbers does not change the allocated number. [EVIDENCE: `CLONE` with `005-c` live and `z_archive/002-low` archived, `create.sh` created `006-lower`]
- [x] CHK-023 [P1] `bash .skilled/scripts/git-hooks/tests/pre-push.test.sh` exits 0. [EVIDENCE: exit 0, `pre-push tests: PASS=50 FAIL=0`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase extends existing scripts and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No changed script reads a credential or a `.env` file. [EVIDENCE: by reading `git diff` of the three changed scripts. The added code calls `lstatSync`, `statSync`, `mkdirSync` and `writeFileSync` on `z_archive` paths only]
- [x] CHK-031 [P0] Seeding writes only inside a declared subtrack under `specs/`. [EVIDENCE: by reading `ensureArchive`, which returns early for a track name without a slash and writes only `z_archive/.gitkeep` beside the sub-track's `graph-metadata.json`. On the real tree `git status --porcelain specs` listed 40 `z_archive/` entries and no other new path]
- [x] CHK-032 [P1] N/A: the scripts have no auth surface. [EVIDENCE: none of the three scripts takes a credential or opens a network connection]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. [EVIDENCE: `spec.md`, `plan.md` and this file all describe seeding only when `z_archive/` is absent, the working-tree advisory and the archive-aware loop]
- [x] CHK-041 [P1] `spec-lifecycle-automation.md` and `$C/README.md` both name the subtrack archive. [EVIDENCE: `rg -c -i "sub-track"` on the catalog file printed 1, and `rg -c -i "sub-track's own .z_archive|sub-track archive"` on the README printed 1]
- [x] CHK-042 [P2] `$K/references/structure/folder-structure.md` line 123 still matches the behavior. [EVIDENCE: line 123 reads `A sub-track has its own z_archive/` and says the sweep's diagnostics are advisory and do not change its exit code]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The sweep output and the baseline live in `scratch/` only. [EVIDENCE: `scratch/` holds `sweep-before.txt` and `baseline.txt`, and no copy sits elsewhere in this folder]
- [x] CHK-051 [P1] `scratch/` holds only `sweep-before.txt` and `baseline.txt`, the evidence T002, T011 and T014 cite
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
