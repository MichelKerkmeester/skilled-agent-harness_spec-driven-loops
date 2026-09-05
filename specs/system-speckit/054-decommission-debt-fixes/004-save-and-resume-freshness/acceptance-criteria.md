---
title: "Acceptance Criteria: Phase 4: save-and-resume-freshness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-decommission-debt-fixes/004-save-and-resume-freshness"
    last_updated_at: "2026-09-05T06:13:06Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-004-save-and-resume-freshness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: save-and-resume-freshness

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/004-save-and-resume-freshness
**Level:** 2
**Status:** Planned
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet whose `trigger_phrases` changed since the last regeneration, When a canonical save completes, Then the save's output reports the index as stale instead of only logging the manual-regeneration reminder | New workflow vitest case asserting the staleness signal | Unmet | - |
| AC-002 | REQ-002 | Given an `implementation-summary.md` with a malformed `session_dedup.fingerprint`, When `parseContinuitySignal` runs, Then it returns no signal instead of a manually-extracted one | New resume-ladder vitest case | Unmet | - |
| AC-003 | REQ-003 | Given a validated, packet-bound continuity signal and an unbound handover signal with a later timestamp, When the resume ladder compares them, Then continuity is chosen as primary | New resume-ladder vitest case | Unmet | - |
| AC-004 | REQ-004 | Given a handover signal that carries a matching packet pointer and a verifying fingerprint, and a later timestamp than continuity, When the resume ladder compares them, Then the handover is still allowed to win | New resume-ladder vitest case | Unmet | - |
| AC-005 | REQ-005 | Given all four scenarios above, When the full test suite runs, Then all new cases pass alongside the existing resume-ladder and workflow suites with no regression in prior pass counts | `npm run test:runtime` (or the workspace command running these suites) | Unmet | - |

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

All five criteria are Unmet; the staleness check and the resume-ladder trust-ranking changes have not been implemented yet.
<!-- /ANCHOR:closure -->
