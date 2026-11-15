---
title: "Acceptance Criteria: Vibe sender history lookup at claim"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vibe history locator acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/046-vibe-history-locator"
    last_updated_at: "2026-11-15T15:05:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-046-vibe-history-locator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Vibe sender history lookup at claim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 046-vibe-history-locator
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a note with `runtime: vibe` whose session folder records a working folder in this checkout, When it is claimed, Then the output holds `## History Lookup` with the sender's session id | `claim prints the history lookup section for a Vibe sender whose session folder ran here` passes (191/191) | Met | - |
| AC-002 | REQ-002 | Given that claim, When the printed command runs from the receiver's checkout, Then it exits 0 with the sender's turns | `the command a claim prints answers with the sender turns from a Vibe store` passes, and `scratch/runs/replay1` redeems a real recorded session | Met | - |
| AC-003 | REQ-003 | Given a Vibe folder that is missing, unreadable or recorded in another checkout, When the note is claimed, Then no section prints and no hook state is written | the other-checkout, unreadable meta.json, other-session, no-journal and relative VIBE_HOME tests pass, and the two refusal tests fail when the check is bypassed | Met | - |
| AC-004 | REQ-004 | Given the final state, When the 044 gate runs, Then every suite keeps its baseline count or more and `tsc` exits 0 | `scratch/gate-final.txt`: relaunch 1600 against 1592, every other count unchanged, tsc 0, drift 4/4 | Met | - |
| AC-005 | REQ-005 | Given a live Vibe hop through `skilled-loop vibe`, When the receiver claims, Then the claim prints the section and the receiver's lookup returns the sender's turns | `scratch/runs/loc3-vibe` on deepseek-flash max: `relaunch reason=ready`, 43 lookups on the printed handle, side word `LAGOON-17653` reported and absent from the note | Met | - |

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

Every criterion is Met.
<!-- /ANCHOR:closure -->
