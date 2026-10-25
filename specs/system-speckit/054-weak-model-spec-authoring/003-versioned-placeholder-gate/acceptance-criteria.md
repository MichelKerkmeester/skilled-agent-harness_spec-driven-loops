---
title: "Acceptance Criteria: Phase 3: versioned-placeholder-gate"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "versioned placeholder gate acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate"
    last_updated_at: "2026-10-23T11:27:22Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: versioned-placeholder-gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate
**Level:** 3
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five templates, When `tasks.md` T011 has run, Then they hold 217 value tokens, the seven stamp lines read v2.3, the manifest holds five v2.3 entries and the leftover hints equal the kept list | T011 prints `LEFTOVERS_SAME` and `217`, and the search for old stamps prints nothing. T014 prints `112 112 101 101 0` for the five docs of a Level 2 scaffold. Observed: T011 printed `LEFTOVERS_SAME`, 217 value tokens counted over the five templates, no v2.2 stamp left (`rg` rc 1), manifest holds five v2.3 entries. T014 printed `112 112 101 101 0` for the Level 2 scaffold | Met | - |
| AC-002 | REQ-002 | Given a doc stamped v2.3 or later, When the orchestrator and the shell rule read it, Then an unfilled token warns at Draft and errors at any other status, `[NEEDS CLARIFICATION:` errors at both, and a v2.2 doc keeps its error | `tests/placeholder-token-gate.vitest.ts` prints `Tests  5 passed (5)` in T009, and the harness runs print 8 of 8 and 3 of 3. Observed: `placeholder-token-gate.vitest.ts` printed `Tests  5 passed (5)` in T009 and again after the review fix (`exit=0`); the harness printed `8/8 passed` and `3/3 passed`, `Failed:  0`, `RESULT: PASSED` | Met | - |
| AC-003 | REQ-003 | Given the new test, When T007 runs before the code change and T010 breaks the code three ways, Then the test fails first, fails under each break and passes again after the restore | T007 saves a red run in `scratch/test-red.txt`. T010 prints `M1_RED`, `M2_RED`, `M3_RED` and `GREEN_AGAIN` and then `RESTORED`. Observed: `scratch/test-red.txt` shows `Tests  1 failed \| 4 passed (5)` before the code change; T010 printed `M1_RED`, `M2_RED`, `M3_RED`, `GREEN_AGAIN` and `RESTORED` | Met | - |
| AC-004 | REQ-004 | Given the frozen folder list, When `tasks.md` T015 runs the census after the change, Then Gate A and Gate B give the same result per folder as T006 gave before | T015 prints `CENSUS_SAME gate A` and `CENSUS_SAME gate B`. Observed: T015 printed `CENSUS_SAME gate A` and `CENSUS_SAME gate B` twice (before and after the review fix), `4496 PASS` and `192 FAIL` both times, 4688 folders | Met | - |
| AC-005 | REQ-005 | Given the phase 1 `suite-start.txt`, When `tasks.md` T017 compares the end of this phase, Then the suite differs by one test file and five tests and nothing else | T017 second block prints `SUITE_MATCH_PLUS_NEW_TEST`. Observed: T017 second block printed `SUITE_MATCH_PLUS_NEW_TEST` on both suite runs (`exit=0`); the cli lane rose from 180 to 181 files and from 2061 to 2066 tests, the core lane stayed at 276 files and 4162 tests | Met | - |
| AC-006 | REQ-006 | Given the finished diff, When `tasks.md` T018 runs, Then no path changed outside the file list in `spec.md` section 3 and this folder | T018 last command prints `0` and `git log -1 --format=%H` prints the hash recorded in T003. Observed: T018 last command printed `1`, the one path being `specs/system-speckit/054-weak-model-spec-authoring/goal.md`, the parent goal changed by the conductor and excluded from this phase's commit; every other changed path is in the allowed list. `git log -1 --format=%H` printed the T003 start hash | Met | - |
| AC-007 | REQ-007 | Given the two reference docs, When `tasks.md` T012 has run, Then `template-guide.md` no longer says `[PLACEHOLDER]` and `validation-rules.md` holds the lifecycle section | T012 prints `APPLIED 5 edits` and `APPLIED 1 edits`, the count search for the old text prints nothing and the count search for the lifecycle heading prints `1`. Observed: T012 printed `APPLIED 5 edits` and `APPLIED 1 edits`; `rg -c 'PLACEHOLDER\]'` over `template-guide.md` printed nothing (rc 1); the lifecycle search over `validation-rules.md` counts 3 lines and the heading count printed `1` | Met | - |
| AC-008 | REQ-008 | Given a scaffold in `specs/zz-bench-gate/`, When `tasks.md` T014 runs, Then Draft passes with a warning, Complete errors, a v2.2 stamp errors and the track is deleted | T014 prints `RESULT: PASSED`, then `error` twice, then `TRACK_GONE`. Observed: T014 printed `RESULT: PASSED` with `PLACEHOLDER_FILLED` as a warning at Draft, `error 36 placeholder(s) found` at Complete, `error 30 placeholder(s) found` with a v2.2 stamp, and `TRACK_GONE` | Met | - |
| AC-009 | REQ-009 | Given the diff, When the frontier review in `tasks.md` T019 returns, Then each P0 and P1 finding is fixed, each P2 finding is fixed or recorded, and the operator items are recorded | the verify command of T019 prints `0`, T020 prints `FINDINGS_TALLIED` with two equal numbers, and `goal.md` section 4 holds the five operator rows with probe output for OP-1 to OP-3. Observed: `scratch/review/T019.txt` holds one `P2` line (the verify command printed `0`); T020 printed `FINDINGS_TALLIED 1 1`; the finding was confirmed by reading the file and applied; `goal.md` section 4 holds the five operator rows, with probe output for OP-1 to OP-3 | Met | - |

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

All nine criteria are `Met` with observed evidence. The phase made one local commit on the worktree branch and did not push.
<!-- /ANCHOR:closure -->
