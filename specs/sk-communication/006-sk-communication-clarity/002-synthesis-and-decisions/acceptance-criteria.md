---
title: "Acceptance Criteria: Phase 2: synthesis-and-decisions"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions"
    last_updated_at: "2026-09-12T13:00:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Verify phase 001 artifacts, then record the verdicts"
    blockers:
      - "Phase 001 has not run"
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: synthesis-and-decisions

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions
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
| AC-001 | REQ-001 | Given the merged recommendation list, When the phase closes, Then every row carries adopt, reject or already-covered | Count rows against the union of lineage recommendations, and scan for blanks | Unmet | - |
| AC-002 | REQ-002 | Given an adopted recommendation, When the allocation table is read, Then it names exactly one owning document | Duplicate scan over the owning-document column returns nothing | Unmet | - |
| AC-003 | REQ-003 | Given an adopted recommendation, When its row is read, Then it names a specific failure rather than a general benefit | Read each adopted row and reject any failure statement that would fit any rule set | Unmet | - |
| AC-004 | REQ-004 | Given a contradiction between a source and an existing rule, When the phase closes, Then an ADR names which wins and why | One ADR per contradiction exists in `decision-record.md`, including the colon case | Unmet | - |
| AC-005 | REQ-005 | Given two lineages that disagree, When the disagreement is recorded, Then it is diagnosed as underspecified or thin-evidence and not averaged | Every disagreement entry carries a diagnosis, and no entry carries a tally | Unmet | - |
| AC-006 | REQ-006 | Given a proposed new repo rule, When its row is read, Then it names why no existing document can carry it | Each new-rule proposal names the existing files it was tested against | Unmet | - |
| AC-007 | REQ-007 | Given the reader-profile recommendations, When the phase closes, Then the record states always-binding rule or operator-selected mode | The answer appears in `decision-record.md` as a decision, not as an open question | Unmet | - |

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

This phase is blocked on phase 001. The statement is written when the phase closes, naming which
criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
