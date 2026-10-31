---
title: "Acceptance Criteria: Phase 11: spec-validator-fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "spec validator fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes"
    last_updated_at: "2026-09-27T17:51:28Z"
    last_updated_by: "closure-leaf"
    recent_action: "Marked AC-001 to AC-011 Met from the build evidence"
    next_safe_action: "None. The orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Counting unresolved citations: option A, report only (scratch/briefs/00-index.md)"
      - "Detecting a phase label that disagrees with its folder number: option A, fix at the source only (scratch/briefs/00-index.md)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: spec-validator-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a criteria table citing a file in the packet folder, a file at the repository root and an absolute path, When `AC_COVERAGE` runs, Then each resolves, and a line of 0 or past the file's end does not | New cases in `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` print `ok` for packet-relative, root-relative (inside a temporary `git init` repository), missing-file and past-the-end citations. Observed 2026-09-27 at `03e567cfe7`: the suite prints `44 passed, 0 failed`, exit 0, and `45 passed, 0 failed` at `baf2876802` after one more resolver case, including "a citation inside the file resolves" (a packet-relative and an absolute path), "a missing file and line 0 or past the end do not" and "a path from the repository root resolves" (a `git init` fixture). Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh:230`, `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh:231`, `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh:278` | Met | - |
| AC-002 | REQ-002 | Given a row citing a missing file next to a resolving one, When the rule runs, Then one detail line starting `Unresolved evidence citation(s):` names that AC id and the citation as written | The new `expect_detail` case in `tests/check-ac-coverage.sh` prints `ok`, and `validate.sh --strict` on a fixture packet prints a `detail` line with `Unresolved evidence citation(s): AC-` Observed 2026-09-27: "unresolved citations are named with their AC id" passes in the final 45/0 suite. The `validate.sh --strict` run was made on a real packet rather than a fixture: `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/010-template-contract-alignment` exits 0 with `RESULT: PASSED` and a detail line starting `Unresolved evidence citation(s): AC-001`. Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh:259`, `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:568` | Met | - |
| AC-003 | REQ-003 | Given the change, When the existing suite runs, Then every one of the 25 existing cases passes unedited and a fixture's ratio is the same with and without its cited files | `git diff` shows no edit to the 25 existing `expect`, `expect_source` and `expect_status` calls, the suite ends `0 failed`, and a new case asserts the same `covered/total` for a fixture before and after its cited file is created. Observed 2026-09-27: `git diff -U0 e9059c8073~1 03e567cfe7` on the test file adds 112 lines and removes none, so the 25 existing calls are unedited (checked read-only while closing these docs). The suite ends `44 passed, 0 failed` at `03e567cfe7` and `45 passed, 0 failed` at `baf2876802`, exit 0. "the ratio before the cited file exists" and "the ratio after the cited file exists is the same" both assert `1/2`, and "an unresolved citation still counts as coverage" asserts `3/3`. Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh:269`, `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh:271` | Met | - |
| AC-004 | REQ-004 | Given `specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md`, When `check-goal.cjs` runs on it, Then its stdout and exit code equal the run on the folder | `diff <(node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md) <(node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint)` prints nothing, and both runs exit 0 with `RESULT: PASSED (5/5 checks)` (the row said `4/4` at planning, before `e7c88670fb` added a fifth check). Observed 2026-09-27: the orchestrator's `diff` printed nothing. Rerun read-only while closing these docs: the `diff` prints nothing, exit 0, and each run prints `RESULT: PASSED (5/5 checks)`, exit 0. The baseline run on `goal.md` exited 2. Evidence: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:706` | Met | - |
| AC-005 | REQ-005 | Given a path to a file not named `goal.md`, When `check-goal.cjs` runs on it, Then it exits 2 with `packet path is not a directory`, and the exports block is unchanged | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/spec.md` exits 2 and prints `packet path is not a directory`, and `git diff` on `check-goal.cjs` shows no line inside `module.exports` or the `require.main` block. Observed 2026-09-27: the `spec.md` run prints `packet path is not a directory` and `RESULT: FAILED (0/5 checks; errors=1)`, exit 2. `git diff -U0 e9059c8073~1 03e567cfe7` on `check-goal.cjs` has one hunk, inside `main()`, and none in `module.exports` or the `require.main` block. Evidence: `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:93`, `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:160` | Met | - |
| AC-006 | REQ-006 | Given the new cases, When both suites run, Then each changed surface has a happy path and an edge case and nothing fails | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` ends `0 failed` with more than 25 passed, and `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` reports `fail 0` with more than 15 passing. Observed 2026-09-27: `44 passed, 0 failed` at `03e567cfe7` and `45 passed, 0 failed` at `baf2876802`, exit 0, from a baseline of 25. `tests 20`, `pass 20`, `fail 0`, exit 0, from a measured baseline of 18. Evidence: `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs:142`, `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh:283` | Met | - |
| AC-007 | REQ-007 | Given the owner docs, When they are searched, Then each names the new behavior | `rg -n 'nresolved' .skilled/skills/system-spec-kit/references/validation/validation-rules.md` returns the `AC_COVERAGE` paragraph, and `rg -n 'goal.md' .skilled/skills/sk-doc/sk-create-goal/scripts/README.md` returns the section 5 line. Observed 2026-09-27, rerun read-only while closing these docs: the first `rg` returns line 95, which names unresolved evidence citations and says they still count. The second returns line 70, "`<packet>` is a packet folder or the path to its `goal.md`". Evidence: `.skilled/skills/system-spec-kit/references/validation/validation-rules.md:95`, `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md:70` | Met | - |
| AC-008 | REQ-008 | Given the counting question, When the phase closes, Then the owner's answer on option A, B or C is recorded, or the log records that the build stayed on option A with no answer | `goal.md`'s log holds a row naming the chosen option and its source, and `git diff` on `check-ac-coverage.sh` changes no line that increments `covered`. Observed 2026-09-27: `goal.md`'s log records option A, report only, with `scratch/briefs/00-index.md` as its source. `git diff -U0 e9059c8073~1 -- .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh \| grep -cE '^[-+].*covered\+\+'` prints `0`. Evidence: `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:341` | Met | - |
| AC-009 | REQ-009 | Given a parent whose highest child is `001-foundation`, When `create.sh --phase --parent` adds two children, Then `002-implementation` is labeled "Phase 2" and `003-integration` "Phase 3" | `git diff` on `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` changes only the child loop, and `rg -n 'Phase \$\{_i\}' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` no longer matches the three label lines. Observed 2026-09-27: the fix landed in `8036425eaa` (another packet), whose `create.sh` hunks all fall inside the child loop, at lines 1487 to 1528. This phase edits no line of `create.sh`. The `rg` prints nothing, exit 1. The behavior is pinned by the new shell case, which fails against `8036425eaa^` (`11 passed, 1 failed`) and passes now. Evidence: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1489`, `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh:275` | Met | - |
| AC-010 | REQ-010 | Given the extended stub, When `tests/test-phase-system.sh` runs, Then the new label case passes and the 10 existing cases still pass | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` prints `Results: N passed, 0 failed` with N above 10, including a `pass` line for the appended-child labels. Observed 2026-09-27 at `03e567cfe7`: `Results: 12 passed, 0 failed (of 12)`, exit 0, from a baseline of 10, including "Appended children carry Phase 2 and Phase 3 in description, graph metadata and spec title". Evidence: `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh:275` | Met | - |
| AC-011 | REQ-011 | Given the label-detection question, When the phase closes, Then the owner's answer on option A, B or C is recorded, or the log records that the build stayed on option A with no answer | `goal.md`'s log holds a row naming the chosen option and its source, and `git diff` shows no change to `repair-derived.cjs` or to any file under `runtime/cli/rules/` other than `check-ac-coverage.sh`. Observed 2026-09-27: `goal.md`'s log records option A, fix at the source only, with `scratch/briefs/00-index.md` as its source. `git diff --name-only e9059c8073~1` over `runtime/cli/rules/` and `create.sh` names only `check-ac-coverage.sh`, and no `repair-derived.cjs` change. Evidence: `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:512` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eleven criteria are `Met` on the evidence of commits `e9059c8073` (the build), `03e567cfe7` (the three review fixes) and `baf2876802` (the outside-root test case), with no waiver. AC-009 is met by `8036425eaa`, which fixed the `create.sh` labels in another packet, together with this phase's shell test that pins them. Both owner questions stayed on option A. Every `goal.md` completion criterion is ticked, criterion 6 after an amendment at close that `goal.md`'s log records, so the phase is Complete.
<!-- /ANCHOR:closure -->
