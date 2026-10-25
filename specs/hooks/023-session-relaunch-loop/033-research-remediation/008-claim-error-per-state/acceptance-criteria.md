---
title: "Acceptance Criteria: Phase 8: claim-error-per-state"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "claim error per state acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-claim-error-per-state"
    last_updated_at: "2026-10-25T13:42:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: claim-error-per-state

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/008-claim-error-per-state
**Level:** 2
**Status:** Draft
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | **Given** a done note, **When** claimed, **Then** the error starts `cannot claim handoff with status done` and says it is finished, do not continue. | Test, red before the change. Evidence: | Unmet | - |
| AC-002 | REQ-001, REQ-003 | **Given** a note claimed by `s-1` at `2026-10-25T10:00:00Z`, **When** claimed again, **Then** the error names `s-1` and that time. | Test. Evidence: | Unmet | - |
| AC-003 | REQ-001, REQ-004 | **Given** a note with no status, **When** claimed, **Then** the error starts `cannot claim handoff with status missing` and says it is not a handoff note. | Test. Evidence: | Unmet | - |
| AC-004 | REQ-005 | **Given** the existing tests at ~302 and ~1940, **When** run, **Then** they pass unedited. | Test run. Evidence: | Unmet | - |
| AC-005 | REQ-002 | **Given** a done note with `superseded_by: s-2`, **When** claimed, **Then** the error names `s-2`. | Test. Evidence: | Unmet | - |
| AC-006 | REQ-006 | **Given** a note with status `withdrawn`, **When** claimed, **Then** the error is exactly `cannot claim handoff with status withdrawn`. | Test. Evidence: | Unmet | - |

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

Not closed yet. The builder writes this statement when every row is Met.
<!-- /ANCHOR:closure -->
