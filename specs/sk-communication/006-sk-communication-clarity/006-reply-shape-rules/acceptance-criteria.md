---
title: "Acceptance Criteria: Phase 6: reply-shape-rules"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/006-reply-shape-rules"
    last_updated_at: "2026-09-12T15:40:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for phase 3's split, then assign the ten candidates by governed unit"
    blockers:
      - "Phase 3 has not run"
      - "Phase 2 has not run"
    key_files:
      - "repo-rules/communication.md"
      - "REPO RULES.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: reply-shape-rules

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/006-reply-shape-rules
**Level:** 2
**Status:** Draft
**Date:** 2026-09-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the ten candidates, When the phase closes, Then each appears in exactly one half | Walk the ten allocation rows against both files, both directions | Unmet | - |
| AC-002 | REQ-002 | Given an added rule, When it is read, Then it names a failure specific enough to argue with | Read every added rule; reject any failure statement that would fit any rule set | Unmet | - |
| AC-003 | REQ-003 | Given any mark or construction, When the set is scanned, Then exactly one instruction governs it | Per-mark ripgrep across the root doc, the router and the rule directory, against the phase 3 baseline | Unmet | - |
| AC-004 | REQ-004 | Given a brevity rule, When it is read, Then the counterweight is reachable from it | Follow the cross-reference from each brevity rule | Unmet | - |
| AC-005 | REQ-005 | Given either half, When its size is measured, Then it is at or under the recorded ceiling | Measure both halves the same way the original ceiling was measured | Unmet | - |
| AC-006 | REQ-006 | Given the first-line rule, When it is read, Then it states a positive test and not only bans | Read the rule and confirm a reader can tell what the first line must do | Unmet | - |

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

This phase is blocked on phases 2 and 3. The statement is written when the phase closes, naming which criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
