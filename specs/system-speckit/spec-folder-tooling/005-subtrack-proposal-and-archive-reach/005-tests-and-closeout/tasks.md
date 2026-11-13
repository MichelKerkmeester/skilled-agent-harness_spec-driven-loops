---
title: "Tasks: Phase 5: tests-and-closeout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "tests and closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: tests-and-closeout

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

`K` is `.skilled/skills/system-spec-kit`. `T` is `$K/runtime/cli/tests`. `PKT` is `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`. Every `npx vitest run` command runs in `$K/runtime/cli`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the baseline from phase 001 exists and read its counts (`$PKT/001-relocation-engine/scratch/baseline.txt`). Verify: `ls $PKT/001-relocation-engine/scratch/baseline.txt` prints the path.
- [ ] T002 Read the temp-repo pattern and the tree builder before writing a suite (`$T/archive-track.vitest.ts`). Verify: `rg -n "export function buildSubtrackTree" $T/fixtures/subtrack-tree.mjs` prints line 68.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write the move, renumber and re-parent cases (`$T/relocate.vitest.ts`). Verify: `npx vitest run tests/relocate.vitest.ts` exits 0 with at least three passing cases.
- [ ] T004 Add the preflight refusal cases: collision, mixed track, second subtrack level, bad name and dirty path (`$T/relocate.vitest.ts`). Verify: `npx vitest run tests/relocate.vitest.ts -t refus` exits 0 and each case asserts exit 2 and an unchanged tree.
- [ ] T005 Add the idempotence case and the inbound reference cases, including the prefix-id pair (`$T/relocate.vitest.ts`). Verify: `npx vitest run tests/relocate.vitest.ts` exits 0.
- [ ] T006 [P] Write the cluster map, threshold and present-time fit cases (`$T/suggest-subtracks.vitest.ts`). Verify: `npx vitest run tests/suggest-subtracks.vitest.ts` exits 0 with at least three passing cases.
- [ ] T007 [P] Write the archive numbering cases for specs root, track and subtrack depth (`$T/archive-numbering.vitest.ts`). Verify: `npx vitest run tests/archive-numbering.vitest.ts` exits 0 with three passing cases.
- [ ] T008 [P] Write the default-vector, archive-mode, label and JSON lane cases (`$T/rg-include-archive.vitest.ts`). Verify: `npx vitest run tests/rg-include-archive.vitest.ts` exits 0.
- [ ] T009 [P] Write the recursive archive validation cases at track, subtrack and phase depth, plus the default run (`$T/validate-archive-recursive.vitest.ts`). Verify: `npx vitest run tests/validate-archive-recursive.vitest.ts` exits 0.
- [ ] T010 Watch each new suite fail once by breaking one expectation, then restore it (`$T/relocate.vitest.ts`). Verify: each of the five suites printed at least one failure in that run and exits 0 after the restore.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the full suite and report the delta against the baseline (`$K/runtime/cli/package.json`). Verify: `cd $K/runtime/cli && npm test` exits 0 and its fail count is not above the baseline.
- [ ] T012 Run the relocation checks on the real tree and a throwaway copy (`$K/runtime/cli/spec/relocate.mjs`). Verify: the dry run exits 1 with `git status --porcelain` unchanged, the apply in the copy exits 0 and the second run exits 0 with nothing to do.
- [ ] T013 Run the proposal check on a real flat track with more than eight packets (`$K/runtime/cli/spec/suggest-subtracks.mjs`). Verify: the emitted map passed to `relocate.mjs --map` exits 1 and not 2.
- [ ] T014 Run the sweep and the trigger index check (`$K/runtime/cli/spec/sweep-track-roots.mjs`). Verify: the sweep exits 0 apart from the known `ai-systems` drift and `node $K/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0.
- [ ] T015 Run `/speckit:search` with and without the archive mode on a phrase that lives only in `specs/sk-doc/z_archive/` (`.skilled/commands/speckit/search.md`). Verify: the run without the mode returns no hit and the run with it returns a hit labeled `archived`.
- [ ] T016 Fill the implementation summary of each child from its evidence (`$PKT/001-relocation-engine/implementation-summary.md` and the four sibling files). Verify: `rg -o '\[YOUR_VALUE_HERE:' $PKT/*/implementation-summary.md` prints nothing.
- [ ] T017 Mark each acceptance row with its observed evidence in every child (`$PKT/005-tests-and-closeout/acceptance-criteria.md` and the four sibling files). Verify: `rg -c "\| Unmet \|" $PKT/*/acceptance-criteria.md` prints nothing.
- [ ] T018 Validate the whole packet (`$PKT/spec.md`). Verify: `bash $K/runtime/cli/spec/validate.sh $PKT --strict --recursive` prints `RESULT: PASSED` for the parent and all five children.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] The five new suites pass alone and inside `npm test`
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
- [ ] CHK-003 [P1] Phases 001 to 004 handed off and the baseline file exists
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each new suite builds its own temp repository and removes it
- [ ] CHK-011 [P0] No new suite runs `git mv` or writes in the real repository
- [ ] CHK-012 [P1] No case re-asserts a framework or language guarantee
- [ ] CHK-013 [P1] No test comment names a spec path, a task id or a requirement id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Each new suite was seen failing once before its pass was accepted
- [ ] CHK-022 [P1] The prefix-id and the empty-map edge cases are covered
- [ ] CHK-023 [P1] Each preflight refusal asserts exit 2 and an unchanged tree
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase adds tests and fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No suite reads a credential or a `.env` file
- [ ] CHK-031 [P0] No suite reads or writes outside its temp directory
- [ ] CHK-032 [P1] N/A: the suites have no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Completion state agrees across `spec.md`, the acceptance rows and `implementation-summary.md` in every child
- [ ] CHK-042 [P2] The parent Phase Documentation Map shows each phase status
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Sample maps and run output live in `scratch/` only
- [ ] CHK-051 [P1] The throwaway copy is removed before completion
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
