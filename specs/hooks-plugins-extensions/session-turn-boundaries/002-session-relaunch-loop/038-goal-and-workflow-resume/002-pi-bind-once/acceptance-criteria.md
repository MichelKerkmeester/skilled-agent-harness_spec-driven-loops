---
title: "Acceptance Criteria: Phase 2: pi-bind-once"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pi bind once acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-pi-bind-once"
    last_updated_at: "2026-11-12T22:42:02Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-pi-bind-once"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: pi-bind-once

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-pi-bind-once
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
| AC-001 | REQ-001 | Given a Pi receiver process has made its one hand-over attempt with a session id, When a second `session_start` arrives with a new id, Then it binds nothing and `SESSION_RELAUNCH_GOAL_PACKET` is no longer set, so a nested runtime has nothing to bind. | `node --test --test-name-pattern 'a second session_start with a new id binds nothing' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0 and its case asserts the empty record and the cleared variable. | Unmet | - |
| AC-002 | REQ-002 | Given the existing hand-over cases in `goal-pi.test.mjs`, When the once-per-process guard lands, Then the first receiver still binds at session start, its later input does not rebind, an own or cleared goal is left alone, an `AI_SESSION_CHILD=1` child binds nothing, and the off switch, an empty variable and a missing packet bind nothing. | `node --test --test-name-pattern 'hand-over|first input binds|session own|dispatched child|switch, an empty variable' .skilled/hooks/goal/pi/goal-pi.test.mjs` exits 0. | Unmet | - |

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
