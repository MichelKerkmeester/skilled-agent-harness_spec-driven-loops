---
title: "Tasks: Phase 3: metadata-write-safety"
description: "Ordered, test-first tasks for the refresh write guard and the sub-track metadata seed: baseline, red cases, the lstat guard, the seed, and the rerun of both Measured Behavior cases."
trigger_phrases:
  - "metadata write safety tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: metadata-write-safety

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

- [x] T001 Record the baseline pass and fail counts of every test file in `T` (`scratch/baseline.txt`). Evidence: the four files show 101 passed and 0 failed in total. The required 11-file suite baseline is 190 passed, 0 failed.
- [x] T002 Record the operator's answers to D-003a and D-003b (`spec.md` section 7). Evidence: `rg -n 'Status: answered' spec.md` printed both decisions at lines 159 and 163.
- [x] T003 [P] Confirm that no track or sub-track in the checkout holds a symlinked metadata file (`specs/`). Evidence: `find specs -maxdepth 3 -name graph-metadata.json -type l` printed no paths and exited 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the red case for P2-4 on a sub-track: `refresh-track-roots.mjs --track demo/sub --apply` with a symlinked `graph-metadata.json` must exit 2 and leave the target unchanged (`K/cli/tests/track-roots.vitest.ts`). Evidence: `scratch/red-t004-subtrack-symlink.log` shows status 0 and the outside target rewritten with `demo/sub/001-nested-probe`.
- [x] T005 Add the same red case for the top-level `demo/graph-metadata.json`, if D-003a is Option A (`K/cli/tests/track-roots.vitest.ts`). Evidence: `scratch/red-t005-top-level-symlink.log` shows status 0 and the outside target rewritten with `demo/001-flat-probe` and `demo/sub`.
- [x] T006 Refuse a symlinked metadata path before the write, print `<name>: graph-metadata.json is a symlink, not written`, count it as a failure (`K/cli/spec/refresh-track-roots.mjs`). Evidence: `scratch/green-t006-symlink-guard.log` reports 2 passed, 0 failed.
- [x] T007 Add the red case for P2-3: with `demo/sub/graph-metadata.json` deleted, `--track demo/sub --apply` must exit 0 and `sweep-track-roots.mjs` must then exit 0 (`K/cli/tests/track-roots.vitest.ts`). Evidence: `scratch/red-t007-isolated-missing-subtrack.log` shows exit 2 with `graph-metadata.json is unreadable, not written`, no file created and sweep exit 1.
- [x] T008 Add the guard case for REQ-004: invalid JSON in `demo/sub/graph-metadata.json` must exit 2 with the bytes unchanged (`K/cli/tests/track-roots.vitest.ts`). Evidence: `scratch/green-t009-isolated-corrupt.log` reports 1 passed, 0 failed and asserts the original invalid bytes remain unchanged.
- [x] T009 Seed an absent sub-track metadata file in the track-root shape, only when `lstat` reports it absent, and only if D-003b is Option A (`K/cli/spec/refresh-track-roots.mjs`). Evidence: `scratch/green-t009-isolated-seed.log` reports 1 passed, 0 failed and asserts refresh and sweep both exit 0 with the expected metadata; the invalid-file guard remains green in `scratch/green-t009-isolated-corrupt.log`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the required 11-file CLI suite, which includes the full four-file `T` set (`K/cli/tests/`). Evidence: `scratch/final-cli-suite-status.log` reports 11 files, 194 passed, 0 failed, exit 0 (baseline 190 plus four new cases); `scratch/track-roots-final.json` confirms 23 passed (baseline 19), and `scratch/refresh-archive-final.json` confirms `create-track-refresh` 20 and `archive-track` 60, unchanged from baseline.
- [x] T011 Rerun the two Measured Behavior cases in a scratch workspace (`spec.md` section 2). Evidence: the tests create isolated temporary fixture workspaces and invoke the real CLI; `scratch/green-final-metadata-safety.log` reports all four symlink, seed/sweep and invalid-file assertions passed, and `scratch/green-t009-isolated-seed.log` reports the seed plus sweep case passed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: both Measured Behavior cases passed in isolated temporary fixture workspaces; see T011 evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
