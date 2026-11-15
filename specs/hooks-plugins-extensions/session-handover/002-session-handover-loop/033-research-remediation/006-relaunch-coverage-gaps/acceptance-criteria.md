---
title: "Acceptance Criteria: Phase 6: relaunch-coverage-gaps"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "relaunch coverage gaps acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/006-relaunch-coverage-gaps"
    last_updated_at: "2026-10-25T13:42:32Z"
    last_updated_by: "claude-opus"
    recent_action: "Met all five criteria with evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: relaunch-coverage-gaps

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/006-relaunch-coverage-gaps
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `skilled-loop opencode --server=http://localhost:4096` on a stub OpenCode 2, When it starts, Then stderr has the shared-server warning and the stub's launch arguments equal `['--server=http://localhost:4096']`, with no `--standalone` | Coverage test "OpenCode 2 equals-form server warns and keeps the launch"; passes on current code. Evidence: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1085`; coverage, green on the unchanged wrapper; `skilled-loop.test.cjs` asserts launch args deep-equal `['--server=http://localhost:4096']` (so no `--standalone`) and the warning; full run `scratch/final-node.txt` 924 pass, 0 fail, exit 0 | Met | - |
| AC-002 | REQ-002 | Given a PATH the test builds (a directory linking `node`, plus `/usr/bin:/bin`) with no runtime binary on it, When the wrapper starts the runtime, Then it exits 127 | Coverage test "missing runtime binary exits 127"; passes on current code. Evidence: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1100`; coverage, green on the unchanged wrapper; the test links `node` into its own directory, sets PATH to it plus `/usr/bin:/bin`, asserts `command -v claude` fails, then exit 127 and `claude: command not found`; `scratch/final-node.txt` | Met | - |
| AC-003 | REQ-003 | Given two child processes released by one start barrier to claim one open note, When both finish, Then exactly one returns the note, the other throws with the prefix `cannot claim handoff with status`, and the note's `claimed_by` names the winner | Coverage test "two concurrent claims have one winner"; passes on current code; implementation summary records the one-time run with the lock removed. Evidence: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2090`; coverage, green 5 of 5 by hand and in `scratch/final-node.txt`; ready files plus a go file form the barrier; asserts one winner, the `cannot claim handoff with status claimed` prefix and `claimed_by` naming the winner; with the lock removed on a scratchpad copy it failed 10 of 10 with two winners (`scratch/lock-removed-variant.txt`) | Met | - |
| AC-004 | REQ-004 | Given a note holding a goal packet, When prepare runs with `SESSION_RELAUNCH_GOAL=0` and consume runs with the switch off and again with it on, Then neither reports `goal_packet` | Failing-first test "a reused note with the goal switch off hands on no packet"; the on-at-consume run fails on current code and passes after the fix. Evidence: `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2590`; red before in `scratch/red-before-reused-note.txt` (the on-at-consume assertion got `goal_packet`, exit 1; the off-at-consume assertion passed); green after in `scratch/green-after-reused-note.txt` and `scratch/final-node.txt` | Met | - |
| AC-005 | REQ-005 | Given the fix, When prepare runs, Then `preparePending` records the goal-switch state on the relaunch record, consume hands on `goal_packet` only when that recorded state was on, and the existing consume test at `session-relaunch-cli.test.cjs:2496-2516` still reports the note's packet | Diff of `relaunch-core.cjs` and `bin/session-relaunch.cjs`; AC-004 test and the existing consume test pass. Evidence: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:479`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:830`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:533`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:724`; uncommitted diff against HEAD `65f37f5d70`: `preparePending` writes `goalSwitch` when given a boolean, the CLI prepare passes `goalSwitchOn(resolvedSwitches())`, consume passes `record?.goalSwitch`, and `usableGoalPacket` returns '' only for a recorded `false`; the existing test "consume reports the goal packet only while the switch is on and the packet holds goal.md" passes in `scratch/green-after-reused-note.txt` | Met | - |

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

All five rows are Met. The three coverage tests passed on current code, the reused-note test failed before the record-based fix and passed after it, and the full node run moved from 915 to 924 passing with no failures. Five of the nine new tests belong to the manual-command builder working in the same checkout.
<!-- /ANCHOR:closure -->
