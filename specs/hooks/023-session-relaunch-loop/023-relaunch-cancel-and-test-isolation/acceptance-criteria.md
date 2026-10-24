---
title: "Acceptance Criteria: Phase 23: relaunch-cancel-and-test-isolation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "relaunch cancel and test isolation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/023-relaunch-cancel-and-test-isolation"
    last_updated_at: "2026-10-24T10:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked the widened criteria with their evidence"
    next_safe_action: "Commit the worktree once the operator approves"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/lib/relaunch-core.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1020489c-074c-4d37-89f4-75a670e5a052"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 23: relaunch-cancel-and-test-isolation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/023-relaunch-cancel-and-test-isolation
**Level:** 2
**Status:** Complete
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a shell that carries a looped session's `SKILLED_LOOP_*` variables, When the full relaunch gate runs there and again with them unset, Then every test passes both times | `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs`: 730 of 730 pass with this session's loop variables set, with them unset and with every loop variable set to foreign values, exit 0 each time; the baseline inside the loop was 669 of 682; scrub at .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:45 | Met | - |
| AC-002 | REQ-001 | Given the real `relaunch.log`, When the full gate runs twice, Then the log gains no lines and no `loopId=100` entry | Line count 361 before and after the final three runs, `loopId=100` count 84 before and after; sandbox runtime directory at .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1194 | Met | - |
| AC-003 | REQ-002 | Given a Claude record that Stop deferred for a background task, When the operator sends a prompt in that session, Then the record is disarmed with reason `user-message` and the session is told to keep working | .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:591, the withdraw test, which failed against main's code | Met | - |
| AC-004 | REQ-002 | Given the same deferred record, When the prompt is a `<task-notification>` completion, or the record was never deferred, Then the record stays pending | .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:666 and :677: "context-nudge keeps a deferred handoff when a background task reports back" and "context-nudge keeps a handoff that was prepared and never deferred" | Met | - |
| AC-005 | REQ-003 | Given an approved relaunch, When the wrapper's relaunch path runs, Then exactly one `handed-over` line is written, and none when the note is no longer open | .skilled/hooks/session-relaunch/tests/hop-history.test.cjs:137 and :165: "hand-over records a hand-over line with the note goal and hop number" and "hand-over records nothing when the note is no longer open"; `skilled-loop.test.cjs` counts `handed-over` lines after a wrapper hop; failed against main's code | Met | - |
| AC-006 | REQ-004 | Given a loop with a pending or armed record, When the session runs `cancel` with no flag, Then the record is disarmed for the loop in `SKILLED_LOOP_ID`, and with no record `cancel` exits 1 | .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1479 and :1500: "cancel disarms the loop prepared hand-over named by the loop environment" and "cancel exits one when the loop has no prepared hand-over"; `nudge.test.cjs` checks that the in-loop text names `cancel` | Met | - |
| AC-007 | REQ-005 | Given a claim, When `history` prints it, Then the line names the claiming session, and a seven-column line still renders | .skilled/hooks/session-relaunch/tests/hop-history.test.cjs:209 asserts column 8 is `receiver` on the claimed line and that the done line keeps 7 columns | Met | - |
| AC-008 | REQ-001 | Given the Pi extension, When its vitest runs, Then it passes at baseline | `npx --no-install vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`: 49 of 49, exit 0; suite .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:1 | Met | - |
| AC-009 | REQ-006 | Given a withdrawn or cancelled hand-over, When the fill keeps rising, Then the withdraw prompt carries only the notice, one more nudge fires a step above the re-arm fill and none after, and compaction gives a read-only pointer to a note the session has not updated since | .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:631 and :1290, .skilled/hooks/session-relaunch/tests/nudge.test.cjs:1263 and :1420; each failed against the code before the fix | Met | - |
| AC-010 | REQ-007 | Given a cancelled or withdrawn record, When the killer times out, the wrapper reads the decision or `history` lists open notes, Then no `timed-out` line or notice is written, no manual claim command is printed and the note is listed as withdrawn | .skilled/hooks/session-relaunch/tests/killer.test.cjs:1680 and :1742, .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1728, .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2156 and :2192, .skilled/hooks/session-relaunch/tests/hop-history.test.cjs:355 | Met | - |
| AC-011 | REQ-008 | Given a relaunch, When the consumed output cannot be read or `hand-over` itself fails, Then no `handed-over` line is written for a declined hop and the relaunch still runs | .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2213, the malformed-output wrapper test, and .skilled/hooks/session-relaunch/tests/hop-history.test.cjs:179 | Met | - |
| AC-012 | REQ-009 | Given concurrent writers, When arm, unarm, a defer, a withdraw, a claim, a complete or a supersede runs, Then each read-then-write holds its lock once, and a nested run cannot cancel the outer loop's hand-over without an explicit loop id, and a cancel landing after the killer's checks stops the signal | .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:460, :1780, :1802 and :1832, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:1516, .skilled/hooks/session-relaunch/tests/killer.test.cjs:1158 | Met | - |
| AC-013 | REQ-010 | Given a nested run or a note whose spec folder is missing, When `dropNestedLoop` runs or prepare and keep validate the note, Then every `SKILLED_LOOP_*` variable is dropped and the note is refused with exit 2 while a real folder is accepted | .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1745, .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:794 and :810 | Met | - |

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

All thirteen rows are Met on automated evidence. No live hop was run for this phase, and the expiry and stale-claim flag from the first plan were dropped by the operator before any criterion was written.
<!-- /ANCHOR:closure -->
