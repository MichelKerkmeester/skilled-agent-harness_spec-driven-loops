---
title: "Tasks: Phase 1: create-track-fixes"
description: "Ordered, test-first tasks for the create.sh --track fixes: baseline, three red cases, the normalization, the guard and the full rerun, each with its verify command."
trigger_phrases:
  - "create track fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: create-track-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`K` is `.skilled/skills/system-spec-kit/runtime`. `T` is the test command in `plan.md` section 5, run from `K/cli` after `npm run build` in `K`.

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

- [x] T001 Record the baseline pass and fail counts of the three test files in `T` (`scratch/baseline.txt`). Verify: `cat scratch/baseline.txt` shows one total per file. Evidence: `scratch/baseline.txt` records 16 refresh, 11 containment, and 16 root-numbering passes, 43 total.
- [x] T002 [P] Search for callers that pass a slash `--track` value (`K/../../../`). Verify: `rg -n -e '--track [a-z0-9._-]+/[a-z0-9._-]+' .skilled specs --glob '!**/tests/**' --glob '!**/review*/**'` prints only packet docs, or names each caller to check against D-001. Evidence: the literal executable-source search returned no matches; all matches came from packet Markdown. `.env` and Barter paths were excluded.
- [x] T003 Record the operator's answer to D-001 (`spec.md` section 7). Verify: `rg -n 'Status: answered' spec.md` prints one line naming Option A or B. Evidence: `spec.md` section 7 records Option A as decided by the operator on 2026-11-07.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the red case for F-P1-1: `--track demo/sub/` must list the new packet in `demo/sub` and `demo/sub` once in `demo` (`K/cli/tests/create-track-refresh.vitest.ts`). Verify: the case fails on the unchanged script with the sub-track's `children_ids` equal to `['demo/sub/001-nested-probe']`. Evidence: `scratch/red-T004.log` records the missing new child; the final three-file suite passed.
- [x] T005 Add the red case for F-P1-2: `--track demo/linked` must exit non-zero and leave `linked-target/` without a new folder (`K/cli/tests/create-track-refresh.vitest.ts`). Verify: the case fails on the unchanged script with exit 0 and a `002-*` folder in `linked-target/`. Evidence: `scratch/red-T005.log` records exit 0; the T009 focused run passed all three refusal cases.
- [x] T006 Add the red case for P2-5: `--track a/b/c` must exit non-zero and leave `specs/a` absent (`K/cli/tests/create-track-refresh.vitest.ts`). Verify: the case fails on the unchanged script with exit 0 and `specs/a/b/c/001-*` present. Evidence: `scratch/red-T006.log` records exit 0; the T009 focused run passed all three refusal cases.
- [x] T007 Rewrite the `leaves an undeclared slash value alone` case at line 184 to the answer recorded in T003, and add a flat `--track demo/` case that expects `demo` to refresh (`K/cli/tests/create-track-refresh.vitest.ts`). Verify: both cases fail on the unchanged script, the first with exit 0 under Option A and the second with `demo`'s `children_ids` unchanged. Evidence: `scratch/red-T007.log` records both failures; T008 passed the flat case and T009 passed the undeclared case.
- [x] T008 Normalize `TRACK="${TRACK%/}"` once where option parsing sets it, before `SPECS_DIR` is built, and update the refusal text that cites `demo/sub` (`K/cli/spec/create.sh`). Verify: the T004 case and the T007 flat `demo/` case pass. Evidence: the focused trailing-slash run passed 2 tests.
- [x] T009 Add the guard before `mkdir -p "$SPECS_DIR"`: refuse three or more segments, a symlinked sub-track (`-L`), and per T003 an undeclared sub-track, naming the reader's diagnostic (`K/cli/spec/create.sh`). Verify: the T005, T006 and T007 cases pass. Evidence: the focused refusal run passed all 3 tests and the temporary scratch reproduction showed no write on refused paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the whole `T` command and `bash -n` on the script (`K/cli/spec/create.sh`). Verify: `T` prints zero failures and the baseline totals plus the new cases, and `bash -n spec/create.sh` exits 0. Evidence: the final three-file suite passed 47 tests (baseline 43 plus 4); `bash -n spec/create.sh` exited 0.
- [x] T011 Confirm a flat symlinked track is still allowed (`K/cli/tests/create-track-containment.vitest.ts`). Verify: the case at line 132 passes unchanged inside the T010 run. Evidence: the T010 verbose run passed the flat symlink case; only the nested-path case's fixture was changed to declare its sub-track.
- [x] T012 Rerun the four Measured Behavior commands in a scratch workspace (`spec.md` section 2). Verify: the trailing-slash run lists `002-*` in both metadata files, and the three refused values exit non-zero with no folder created. Evidence: the temporary workspace accepted and listed `demo/sub/`, accepted the declared `demo/sub` control, and refused `demo/linked`, `a/b/c`, and `demo/loose` without changing their target folders.
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
