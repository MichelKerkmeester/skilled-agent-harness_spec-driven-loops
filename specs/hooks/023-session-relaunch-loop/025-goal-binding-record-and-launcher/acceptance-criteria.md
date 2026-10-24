---
title: "Acceptance Criteria: Phase 25: goal-binding-record-and-launcher"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal binding record launcher acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/025-goal-binding-record-and-launcher"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Run the baseline relaunch gate in the three environments"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-25-goal-binding-record-and-launcher"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 25: goal-binding-record-and-launcher

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/025-goal-binding-record-and-launcher
**Level:** 2
**Status:** Draft
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a sender with a resolvable goal, When prepare or keep runs, Then the note holds `goal_packet`, and with no goal it is empty | A CLI test per runtime value, failing against the code before the phase | Unmet | - |
| AC-002 | REQ-002 | Given a `goal_packet` outside the repository or without `goal.md`, When prepare or keep runs, Then it exits non-zero with the reason | The adversarial table test and its output | Unmet | - |
| AC-003 | REQ-003 | Given a note with the field, When claim and the wrapper run, Then claim prints the packet and the receiver gets `SESSION_RELAUNCH_GOAL_PACKET`, and `SESSION_RELAUNCH_GOAL=0` removes both | Wrapper runtime suite with the switch on and off | Unmet | - |
| AC-004 | REQ-004 | Given a note with no `goal_packet`, When it is claimed, Then behavior is unchanged | The existing claim tests pass unchanged | Unmet | - |
| AC-005 | REQ-005 | Given the changed docs, When read, Then they name the field and the switch | `rg -n "goal_packet|SESSION_RELAUNCH_GOAL"` across the four docs | Unmet | - |

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

Every row is Unmet because the phase is planned and nothing in it has been built or run. The packet closes when the gate passes in every environment and each new test fails against the earlier code.
<!-- /ANCHOR:closure -->
