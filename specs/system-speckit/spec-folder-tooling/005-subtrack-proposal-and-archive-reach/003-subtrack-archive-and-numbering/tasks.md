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

`K` is `.skilled/skills/system-spec-kit`. `C` is `$K/runtime/cli/spec`. `FIND` is `find specs -mindepth 3 -maxdepth 3 -type d -name z_archive -not -path "specs/*/[0-9][0-9][0-9]-*/*"`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Count the declared subtracks and their archive folders and record both numbers (`goal.md` section 4 of this phase). Verify: `FIND` prints nothing and the declared subtrack count is 40.
- [ ] T002 Run the sweep before any change and save its output (`$C/sweep-track-roots.mjs`). Verify: `node $C/sweep-track-roots.mjs` output and exit code are saved to `scratch/sweep-before.txt`.
- [ ] T003 Capture the test baseline before the first edit (`$K/runtime/cli/package.json`). Verify: `cd $K/runtime/cli && npm test` prints the pass and fail counts, saved to `scratch/baseline.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the failing archive case first (`$K/runtime/cli/tests/create-root-numbering.vitest.ts`). Verify: `npx vitest run tests/create-root-numbering.vitest.ts` fails on the new case only.
- [ ] T005 Extend the highest-number loop in `resolve_branch_name` to read `"$SPECS_DIR"/z_archive/*` (`$C/create.sh`). Verify: `npx vitest run tests/create-root-numbering.vitest.ts` exits 0.
- [ ] T006 Seed a missing `z_archive/.gitkeep` for each declared subtrack under `--apply` (`$C/refresh-track-roots.mjs`). Verify: in a scratch tree, `node $C/refresh-track-roots.mjs --specs <scratch>/specs --track demo/sub --apply` then `ls <scratch>/specs/demo/sub/z_archive/.gitkeep` prints the path.
- [ ] T007 Report a declared subtrack without `z_archive/` (`$C/sweep-track-roots.mjs`). Verify: in the same scratch tree before T006 ran, the sweep prints one line that names `demo/sub`.
- [ ] T008 Seed the real tree with the refresh for every track that holds subtracks (`specs/<track>/<sub-track>/z_archive/.gitkeep`). Verify: `FIND` prints 40 paths.
- [ ] T009 [P] Name the subtrack archive at line 41 (`$K/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md`). Verify: `rg -c -i "sub-track" $K/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md` prints 1 or more.
- [ ] T010 [P] Name the subtrack archive at line 112 (`$C/README.md`). Verify: `rg -c -i "sub-track's own .z_archive|sub-track archive" $C/README.md` prints 1 or more.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm the sweep reports no missing archive (`$C/sweep-track-roots.mjs`). Verify: `node $C/sweep-track-roots.mjs` prints no missing-archive line and its exit code equals the one in `scratch/sweep-before.txt`.
- [ ] T012 Confirm the 40 files are ready to track (`specs/<track>/<sub-track>/z_archive/.gitkeep`). Verify: `git status --porcelain specs` lists 40 `z_archive/` entries, and after the operator's commit `git ls-files 'specs/*/*/z_archive/.gitkeep'` prints 40 lines.
- [ ] T013 Confirm a second refresh writes nothing (`$C/refresh-track-roots.mjs`). Verify: `git status --porcelain` prints the same lines before and after a second `--apply` run.
- [ ] T014 Rerun the full suite and compare with the baseline (`scratch/baseline.txt`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline.
- [ ] T015 Validate this phase folder (`spec.md`). Verify: `bash $C/validate.sh . --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `FIND` prints 40 paths
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
- [ ] CHK-003 [P1] `scratch/sweep-before.txt` and `scratch/baseline.txt` exist before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n $C/create.sh` exits 0
- [ ] CHK-011 [P0] `node --check $C/refresh-track-roots.mjs` and `node --check $C/sweep-track-roots.mjs` exit 0
- [ ] CHK-012 [P1] A symlinked `z_archive` is refused with a message that names it
- [ ] CHK-013 [P1] No code comment names a spec path, a task id or a requirement id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The new numbering case failed before T005 and passes after it
- [ ] CHK-022 [P1] An archive that holds only lower numbers does not change the allocated number
- [ ] CHK-023 [P1] `bash .skilled/scripts/git-hooks/tests/pre-push.test.sh` exits 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase extends existing scripts and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No changed script reads a credential or a `.env` file
- [ ] CHK-031 [P0] Seeding writes only inside a declared subtrack under `specs/`
- [ ] CHK-032 [P1] N/A: the scripts have no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `spec-lifecycle-automation.md` and `$C/README.md` both name the subtrack archive
- [ ] CHK-042 [P2] `$K/references/structure/folder-structure.md` line 123 still matches the behavior
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The sweep output and the baseline live in `scratch/` only
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
