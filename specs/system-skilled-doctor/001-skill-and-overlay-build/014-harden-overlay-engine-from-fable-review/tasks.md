---
title: "Tasks: Phase 14: harden-overlay-engine-from-fable-review"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "harden overlay engine from fable review tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: harden-overlay-engine-from-fable-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

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
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [ ] T001 Get operator answers to the three open questions (`spec.md`). Verify: `rg -n 'OPEN QUESTIONS' -A6 spec.md` shows each question with its decision.
- [ ] T002 Record the baseline suite (`.skilled/commands/doctor/scripts/tests`). Verify: `node --test .skilled/commands/doctor/scripts/tests` prints `tests 1220` and `fail 0`.
- [ ] T003 Write a probe that fails a regenerate step, fixes it, reruns apply, then drops the added item (`scratch/p02-failed-regenerate.cjs`). Verify: on `969335a6380` the rerun prints `0 changed` and the dropped item stays in the file.
- [ ] T004 [P] Write a probe with one malformed entry set beside a valid overlay (`scratch/p05-malformed-entry-set.cjs`). Verify: on `969335a6380` status exits 2 and names no file.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T005 Write `files`, `items` and `sets` right after the destination writes in `applyUnderLock` (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: probe p02 drops the item on the built engine.
- [ ] T006 Rerun a regenerate step that failed on the last apply (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: probe p02's rerun runs the step and its verify steps.
- [ ] T007 Refuse, not delete, a dropped key whose record says the overlay did not add it, and match `added` with `samePath` (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the new hand-added-key test in `overlay-engine-sync.test.cjs` passes.
- [ ] T008 Bump the state to schema version 2 with a loader that upgrades version 1, and check each `items` and `sets` record's `path` on load (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the upgrade test writes version 2, and the bad-record test exits 2 and names the record.
- [ ] T009 Write the state file and the manifest through a temporary file and a rename (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the atomic-write test passes and no temporary file is left.
- [ ] T010 Print a `NOTE` when no checkout can be read, and resolve a relative `pin.checkout` against the tree root (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the no-checkout test prints one `NOTE` and the relative-path test reads the checkout.
- [ ] T011 Catch a malformed entry set as a problem that names `entry.source` (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: probe p05 reports the valid overlay and names the broken file.
- [ ] T012 Print a non-failing `NOTE` for each `setKeyOnItem`, `insertObjectKeys` and indexed `set` (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the untracked-operation test prints a `NOTE` per operation and exits 0.
- [ ] T013 Apply the entry set to the pinned text when it is readable and report a difference from the live result (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: the dropped-`setKeyOnItem` test prints a cross-check line naming the destination.
- [ ] T014 Describe the new lines, the rerun behavior and the `pin.checkout` resolution (`.skilled/skills/system-skilled-doctor/references/overlays.md`, `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt`). Verify: `rg -n 'NOTE' .skilled/skills/system-skilled-doctor/references/overlays.md` prints the new lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T015 Run the doctor suite (`.skilled/commands/doctor/scripts/tests`). Verify: `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with at least 1230 tests.
- [ ] T016 Run probes p02 and p05 on the built engine (`scratch/`). Verify: neither shows its problem.
- [ ] T017 Write the Barter handover for the changed output and the `pin.checkout` resolution (`handover-to-barter.md`). Verify: `rg -n 'pin.checkout' handover-to-barter.md` prints a line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



