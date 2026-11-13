---
title: "Acceptance Criteria: Phase 3: goal-resolver-prepare"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal resolver prepare acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-goal-resolver-prepare"
    last_updated_at: "2026-11-12T22:42:03Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-goal-resolver-prepare"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: goal-resolver-prepare

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-goal-resolver-prepare
**Level:** 2
**Status:** Draft
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a `devin` or `cursor` session with a uuid and no goal record, When `SESSION_RELAUNCH_GOAL_PACKET` names a packet that passes `goalPacketProblem`, Then `resolveGoalPacket` returns that packet, a matching record still wins, and a value without `goal.md` is refused. | `node --test --test-name-pattern 'hands a devin or cursor session the hand-over packet' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 and its case asserts the accepted packet for both runtimes, the record precedence and the refused value. | Unmet | - |
| AC-002 | REQ-002 | Given an active Claude goal whose text names no packet, or a Codex sender, When `prepare` runs with the goal switch on, Then it writes exactly one `goal not carried:` line to stderr and stdout keeps the pinned prepared text. | `node --test --test-name-pattern 'one goal reason on stderr for a Claude free-text goal' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 and `node --test --test-name-pattern 'one goal reason on stderr for a Codex sender' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0, each asserting one stderr line and the unchanged stdout. | Unmet | - |
| AC-003 | REQ-003 | Given the goal headline appears in exactly one `goal.md` under `specs/` outside the spec folder lineage, When the Claude goal resolves, Then that packet is returned, and when two packets carry the headline the answer is `''`. | `node --test --test-name-pattern 'finds a goal headline outside the packet lineage' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 and its case asserts the one match and the empty answer for two packets. | Unmet | - |
| AC-004 | REQ-004 | Given a `cursor` or `devin` session under the loop, When `prepare` arms the hand-over, Then its stdout says nothing ends the session and tells the operator to exit it and run the claim command the wrapper prints. | `node --test --test-name-pattern 'manual route for a cursor or devin session' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 and its case asserts the exact stdout for each runtime. | Unmet | - |
| AC-005 | REQ-005 | Given the hand-over packet variable is set and no record matches for `claude`, `codex`, `pi` or `opencode`, When the resolver runs, Then it returns `''`, and the pinned prepared text for `claude` stays byte-identical. | `node --test --test-name-pattern 'keeps the hand-over packet off' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 and `node --test --test-name-pattern 'prepared handoff and the stop instruction' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. | Unmet | - |

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

Every criterion is unmet because this is a planning-only packet.
<!-- /ANCHOR:closure -->
