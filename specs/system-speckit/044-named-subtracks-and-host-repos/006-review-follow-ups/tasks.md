---
title: "Tasks: Phase 6: review-follow-ups"
description: "Ordered tasks for the last sub-track follow-ups: five failing cases, the track-segment alignment, archive seeding, the validate glob, two messages, and the red proof, full suites and recursive validation."
trigger_phrases:
  - "review follow ups tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: review-follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:notation -->
## Task Notation

`K` is `.skilled/skills/system-spec-kit/runtime`. `T` is the test command in `plan.md` section 5.

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

- [x] T001 Write the track-segment parity case over five non-track folders (`K/cli/tests/subtrack-predicate-parity.vitest.ts`). Verify: on the pre-phase code it fails. Evidence: 8 mismatches, `scratch/red.log`.
- [x] T002 Write the archive-seeding, packet-glob, refusal-text and sweep-wording cases (`K/cli/tests/subtrack-predicate-parity.vitest.ts`, `validate-subtrack.vitest.ts`, `create-track-containment.vitest.ts`, `track-roots.vitest.ts`). Verify: each fails on the pre-phase code. Evidence: `Tests 5 failed | 49 passed (54)`, `scratch/red.log`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 One name rule for tracks and sub-tracks, `z_*` excluded (`K/cli/lib/track-roots.mjs`). Verify: T001 passes for `z_track`. Evidence: `T` green.
- [x] T004 [P] Check the track segment in the parser and the repair (`K/lib/graph/graph-metadata-parser.ts`, `K/cli/spec/repair-derived.cjs`). Verify: T001 passes for `001_x`, `owns-spec-track`, `.hidden-track`, `node_modules`. Evidence: `T` green.
- [x] T005 [P] Refuse an archive, hidden or `node_modules` track in the sub-track check only (`K/cli/spec/validate.sh` `is_declared_subtrack_folder`, `K/lib/validation/orchestrator.ts`). Verify: T001 validation rows pass, and `is_track_root_folder` is unchanged. Evidence: `T` green; `git diff` shows `is_track_root_folder` untouched.
- [x] T006 [P] Refresh a declared sub-track whose metadata is missing, and anchor `track_of` (`K/cli/spec/archive.sh`). Verify: the archive-seeding case passes. Evidence: `T` green.
- [x] T007 [P] List `NNN` and `NNN_name` sub-track packets only (`K/cli/spec/validate.sh`). Verify: the packet-glob case passes. Evidence: `T` green.
- [x] T008 [P] Print the typed `--track` value in refusals, and "missing" for an absent file (`K/cli/spec/create.sh`, `K/cli/spec/sweep-track-roots.mjs`). Verify: both message cases pass. Evidence: `T` green.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Prove red: reverse-apply only the code patch, rebuild, run the four new-case files, reapply. Verify: the five new cases fail, then pass. Evidence: `scratch/red.log`; after reapply `T` prints `Tests 85 passed (85)`.
- [x] T010 Run the full cli and core suites (`K`). Verify: no failure the pre-phase run lacked. Evidence: `implementation-summary.md` Verification.
- [x] T011 Validate the packet (`..`). Verify: `validate.sh --strict --recursive` prints `RESULT: PASSED` for every folder. Evidence: `implementation-summary.md` Verification.
- [x] T012 Remove the tests that fail for no reason another test lacks: the fixture builder's own smoke file, the validation case the parity matrix's `linked-description` row already covers, and the refusal-text case, folded as one assertion into `create-track-refresh.vitest.ts`'s undeclared refusal (`K/cli/tests/`). Verify: the folded assertion fails when the diagnostic refusal line prints the stripped value, and the touched files pass. Evidence: the mutated line failed it with `expected 'Error: --track \'demo/loose\' refused…'`; restored, 8 files, 184 passed, 4 fewer than 188.
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
