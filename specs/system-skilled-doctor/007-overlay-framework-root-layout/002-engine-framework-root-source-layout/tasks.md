---
title: "Tasks: Phase 2: engine-framework-root-source-layout"
description: "Ordered tasks that make the framework/ and root/ naming rule the overlay engine's default: failing cases first, then adoptSource, the LAYOUT cap, the root/skilled refusals and the excluded-path fallback, then the test sweep and the whole suite."
trigger_phrases:
  - "engine framework root source layout tasks"
  - "framework root default rule task list"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: engine-framework-root-source-layout

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

`E` is `.skilled/commands/doctor/scripts/overlay-engine.cjs`. `T` is `.skilled/commands/doctor/scripts/tests`. Every command runs from the Skilled repository root. This phase runs in Skilled. New test names carry the words the `--test-name-pattern` filters below match: `layout cap`, `old layout`, `root/skilled` and `excluded copy`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Run the engine suite on the phase 001 commit and write its pass count into this line (`$T/overlay-engine-*.test.cjs`). Verify: `node --test $T/overlay-engine-*.test.cjs` exits 0 with a fail count of 0. Evidence: 238 tests, 238 pass, 0 fail, exit 0 at `87de7f0` (`scratch/evidence/baseline.txt`).
- [x] T002 [P] List every `adoptSource` call (`$E`). Verify: `rg -n 'adoptSource\(' $E` prints seven lines: the definition at `:5399` and calls at `:3371`, `:5465`, `:5469`, `:5544`, `:5556`, `:5563`. Evidence: the definition and six calls, now at `:5443`, `:3383`, `:5509`, `:5513`, `:5588`, `:5600`, `:5607` before this phase.
- [x] T003 [P] List the test expectations that state the old rule and write the list into this line (`$T/overlay-engine-*.test.cjs`). Verify: `rg -n 'skilled-overlays/skilled/|\.\./overlays/skilled/' $T/overlay-engine-*.test.cjs` prints the six strict-writes lines `:173`, `:189`, `:279`, `:356`, `:554`, `:573`, the follow-up line `:1210`, and any phase 001 sibling case. Evidence: strict-writes `:186`, `:202`, `:292`, `:369`, `:567`, `:586`, follow-up `:1246`, plus the sibling cases built with `${SIBLING_LABEL}/skilled/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Add a `layout cap` case on an old-layout fixture: 25 entries whose sources sit at their dot-dropped paths give 20 entry lines plus `LAYOUT   … 5 more; run <engine> apply --relayout`, `--json` `offLayout` has 25 items, and 20 entries print no overflow line (`$T/overlay-engine-follow-up.test.cjs`). Verify: `node --test --test-name-pattern 'layout cap' $T/overlay-engine-follow-up.test.cjs` exits 1 with only the new case failing. Evidence: failed before the engine change (`scratch/evidence/negative-control.txt`).
- [x] T005 [P] Add an `old layout` case: a fixture whose sources sit at their dot-dropped paths applies with exit 0, and status prints `RESULT: PASSED` with LAYOUT lines naming `framework/` and `root/` targets (`$T/overlay-engine-follow-up.test.cjs`). Verify: `node --test --test-name-pattern 'old layout' $T/overlay-engine-follow-up.test.cjs` exits 1 with only the new case failing. Evidence: failed before the engine change, on the LAYOUT lines.
- [x] T006 [P] Add a `root/skilled` relayout case: an entry whose new-rule path lands under `root/skilled/` makes relayout exit 2, naming the entry and moving nothing (`$T/overlay-engine-follow-up.test.cjs`). Verify: `node --test --test-name-pattern 'root/skilled' $T/overlay-engine-follow-up.test.cjs` exits 1 with only the new case failing. Evidence: failed before the engine change, `0 !== 2`.
- [x] T007 [P] Add `root/skilled` cases: a source under `root/skilled/` is blocked by entry id and status exits non-zero, and an adopt of a destination starting `skilled/` exits 2 without writing (`$T/overlay-engine-strict-writes.test.cjs`). Verify: `node --test --test-name-pattern 'root/skilled' $T/overlay-engine-strict-writes.test.cjs` exits 1 with only the new cases failing. Evidence: failed before the engine change; a non-LAYOUT line naming the id was required, since today's LAYOUT hint already names both.
- [x] T008 [P] Add an `excluded copy` case: with copies at both `framework/local/hook.sh` and `skilled/local/hook.sh`, adopt of `.skilled/local/hook.sh` writes an entry with source `framework/local/hook.sh` (`$T/overlay-engine-strict-writes.test.cjs`). Verify: `node --test --test-name-pattern 'excluded copy' $T/overlay-engine-strict-writes.test.cjs` exits 1 with only the new case failing. Evidence: failed before the engine change, source `skilled/local/hook.sh`.
- [x] T009 Change `adoptSource` to the new rule: `.skilled/X` to `framework/X`, exactly `.skilled` to `framework`, any other `X` to `root/` plus `X` with leading dots dropped, and add the old-rule helper beside it (`$E:5399-5401`). Verify: `node --check $E` exits 0, and `rg -n 'adoptSource\(' $E` still prints seven lines. Evidence: `node --check` exit 0; `adoptSource` plus `legacyAdoptSource`.
- [x] T010 Cap the status LAYOUT lines at 20 plus one overflow line, leaving the JSON report whole (`$E:3606-3608`). Verify: `node --test --test-name-pattern 'layout cap' $T/overlay-engine-follow-up.test.cjs` exits 0. Evidence: both layout cap cases pass.
- [x] T011 Report a `source`, `fragment` or `base` at or under `root/skilled/` as a blocked overlay for its id (`$E:2759-2775`). Verify: the T007 blocked-source case passes under `node --test --test-name-pattern 'root/skilled' $T/overlay-engine-strict-writes.test.cjs`. Evidence: `BLOCKED` line by entry id for `source`, `fragment` and `base`.
- [x] T012 Refuse an adopt of a destination starting `skilled/` (`$E:5538-5575`). Verify: `node --test --test-name-pattern 'root/skilled' $T/overlay-engine-strict-writes.test.cjs` exits 0. Evidence: the adopt refusal names `root/skilled` and writes nothing.
- [x] T013 Refuse a relayout move whose target lands under `root/skilled/`, naming the entry (`$E:6215-6267`). Verify: `node --test --test-name-pattern 'root/skilled' $T/overlay-engine-follow-up.test.cjs` exits 0. Evidence: relayout exits 2 naming the entry; status now ends that LAYOUT line with `change the destination or remove the entry`.
- [x] T014 For an excluded path, check the new-rule then the old-rule copy in `hasOverlayCopy`, take whichever exists new-rule first as the source, and name the new-rule path in the refusal (`$E:5544`, `:5556`, `:5563`). Verify: `node --test --test-name-pattern 'excluded copy|repin.exclude' $T/overlay-engine-strict-writes.test.cjs` exits 1 only on the `:573` assertion, with `:554` and `:557` passing unedited. Evidence: the old-path copy test passes unedited apart from its printed path; the two-copy case takes `framework/`.
- [x] T015 Sweep the layout constants `:907`, `:975`, `:977`, `:979-980`, `:1210`, the comment at `:903` and the literal paths at `:1361-1366`, `:1398`, `:1403` and `:1438` to the new rule (`$T/overlay-engine-follow-up.test.cjs`). Verify: `node --test $T/overlay-engine-follow-up.test.cjs` exits 0, and `git diff -U0 -- $T/overlay-engine-follow-up.test.cjs | rg -c '^-.*belongs at \$\{PLACE_LAYOUT\}'` prints nothing (exit 1). Evidence: follow-up passes.
- [x] T016 Sweep the adopt and hint expectations `:173`, `:189`, `:194`, `:279`, `:285`, `:288`, `:298`, `:310`, `:328`, `:337`, `:342`, `:356`, `:364`, `:372`, `:392-418`, `:573` and `:575` to the new rule, keeping the old-path copy at `:550` (`$T/overlay-engine-strict-writes.test.cjs`). Verify: `node --test $T/overlay-engine-strict-writes.test.cjs` exits 0, and `rg -n 'skilled-overlays/skilled/' $T/overlay-engine-strict-writes.test.cjs` prints one line, the old-path fallback assertion from `:554`. Evidence: strict-writes passes; one `skilled-overlays/skilled/` line remains, the old-path fallback assertion.
- [x] T017 Sweep any phase 001 sibling-folder case that asserts an adopt, hint or layout path (`$T/overlay-engine-*.test.cjs`). Verify: `rg -n '\.\./overlays/skilled/' $T/overlay-engine-*.test.cjs` prints nothing. Evidence: the `rg` printed nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T018 Run the old-layout case end to end (`$T/overlay-engine-follow-up.test.cjs`). Verify: `node --test --test-name-pattern 'old layout' $T/overlay-engine-follow-up.test.cjs` exits 0. Evidence: passes.
- [x] T019 Run the whole engine suite (`$T/overlay-engine-*.test.cjs`). Verify: `node --test $T/overlay-engine-*.test.cjs` exits 0, and its pass count is the T001 count plus the new cases. Evidence: 250 tests, 250 pass, 0 fail, exit 0 (`scratch/evidence/after-engine-suite.txt`): 238 plus 12 new cases.
- [x] T020 Confirm the shared fixture manifests kept their sources (`$T/overlay-engine-fixtures.cjs`). Verify: before the phase commit, `git diff HEAD -- $T/overlay-engine-fixtures.cjs` prints nothing. Evidence: `git diff --quiet` exit 0.
- [x] T021 Confirm no manifest field chooses the rule (`$E`). Verify: `rg -c 'sourceLayout' $E $T` prints nothing and exits 1. Evidence: printed nothing, exit 1.
- [x] T022 Confirm no doc, playbook or Barter file changed (`.skilled/skills/system-skilled-doctor`). Verify: `git status --porcelain .skilled/commands/doctor/assets .skilled/commands/doctor/overlay.md .skilled/skills/system-skilled-doctor` prints nothing. Evidence: none of the three paths is in this phase's commit; the doc edits there belong to the next phase.
- [x] T023 Run the strict validator on this phase folder (`specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout --strict --quiet` prints `RESULT: PASSED`. Evidence: see `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance check in `spec.md` §4 passed; no manual run is needed, because the fixtures cover adopt, the hints, status, the LAYOUT cap and relayout
- [x] The proving artifact is the T019 run: `node --test $T/overlay-engine-*.test.cjs` exits 0 with the new default cases included
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: `../scratch/design-notes.md`
<!-- /ANCHOR:cross-refs -->

---
