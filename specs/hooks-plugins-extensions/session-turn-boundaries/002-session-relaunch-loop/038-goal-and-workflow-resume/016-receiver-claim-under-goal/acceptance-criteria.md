---
title: "Acceptance Criteria: Phase 16: receiver-claim-under-goal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "receiver claim under goal acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal"
    last_updated_at: "2026-11-13T10:00:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for the operator's greenlight, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-receiver-claim-under-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 16: receiver-claim-under-goal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 016-receiver-claim-under-goal
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

Paths below are relative to the phase folder `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal` unless they start with `.skilled`. On the close branch, AC-004 to AC-010 are waived by the first decision record, which T009 writes.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the harness copy, When `make-goal.cjs` runs with mode `open` and with no mode, Then the `open` goal holds no `PONG` and no `do nothing else`, and the default goal matches the 028 copy byte for byte | `grep -c -e PONG -e 'do nothing else' scratch/g-open/goal.md` prints 0, and `cmp scratch/g-new/goal.md scratch/g-old/goal.md` exits 0 | Unmet | - |
| AC-002 | REQ-002 | Given ten fresh sandboxes under the `open` goal, When each hop runs with the 2026-11-13 timing, Then each run keeps its evidence and each delivered the start claim | `ls scratch/live-open` lists 10 run folders, and `rg -l goal-start-claim scratch/live-open/*/relaunch.log` lists 10 files | Unmet | - |
| AC-003 | REQ-003 | Given the ten counted runs, When the claims are counted, Then `goal.md` section 4 holds one decision gate row with that count out of ten and the branch it selects | the number of files `rg -l 'Z  claimed ' scratch/live-open/*/history.txt` lists is the count that `rg -n 'Decision gate' goal.md` shows, and the row says close at 10 and build below 10 | Unmet | - |
| AC-004 | REQ-004 | Given a slice and a claim line that fit 4,000 characters together, When `renderGoalSlice` runs, Then it returns the slice, a blank line and the claim line, and the first line is the slice's first line. Test `appends the claim line after the slice and keeps the headline first` in `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` | `node --test --test-name-pattern 'appends the claim line after the slice' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` exits 0 with `fail 0`, after a recorded failing run in `scratch/red.txt` | Unmet | - |
| AC-005 | REQ-005 | Given a 3,990-character slice and a claim line, When `renderGoalSlice` runs, Then it returns `ok` with the slice alone. Test `drops the claim line, not the goal, when the two pass the limit` in `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` | `node --test --test-name-pattern 'drops the claim line, not the goal' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` exits 0 with `fail 0`, after a recorded failing run in `scratch/red.txt` | Unmet | - |
| AC-006 | REQ-006 | Given a Claude hop with a goal, When the wrapper starts the receiver, Then the start prompt is `/goal`, the slice and the claim line, and `SKILLED_LOOP_CLAIM_SEED` and `SESSION_RELAUNCH_GOAL_PACKET` are still exported. Test `a Claude hop with a goal starts on the goal command and carries the claim in the environment` in `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0 with `fail 0`, after a recorded failing run in `scratch/red.txt` | Unmet | - |
| AC-007 | REQ-007 | Given a Claude goal log whose condition is a slice plus the claim line, When the goal packet is resolved, Then the packet comes back. Test `a Claude goal that ends with the claim line still resolves its packet` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | `node --test --test-name-pattern 'ends with the claim line still resolves its packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-008 | REQ-008 | Given the built change and a 3,500-character slice, When ten hops run under the `pong` goal and ten under the `open` goal, Then every note ends `done` | `rg -l '^status: done' scratch/live-after/*/*/note-final.md` lists 20 files | Unmet | - |
| AC-009 | REQ-009 | Given README line 183, When the reader looks for what the Claude start prompt carries, Then it names the claim line after the slice and the limit that drops it, and no other README line changes | `rg -n 'claim line' .skilled/hooks/session-relaunch/README.md` prints 1 line, and `git diff --numstat -- .skilled/hooks/session-relaunch/README.md` prints `1 1` | Unmet | - |
| AC-010 | REQ-010 | Given the edits, When the named guard tests run, Then each keeps its assertions and passes | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'renders exactly the chat slice' --test-name-pattern 'sends a slice of exactly 4000' --test-name-pattern 'keeps the claim seed as its start prompt' --test-name-pattern 'delivers the claim at the start of a goal-command receiver' --test-name-pattern 'goal headline outside' .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`, and `git diff -U0 -- .skilled/hooks/session-relaunch/tests` changes no line inside those tests | Unmet | - |

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

**Closeable:** No

Nothing has run yet, and the phase waits for the operator's greenlight before AC-001.
<!-- /ANCHOR:closure -->
