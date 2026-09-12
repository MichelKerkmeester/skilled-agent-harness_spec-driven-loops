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
    last_updated_at: "2026-09-12T17:47:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Realigned the criteria with the eight Accepted ADRs and the remaining allocation work"
    next_safe_action: "Build the allocation table over the candidate union, then record the non-work rows and the rejection list"
    blockers: []
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

The eight operator decisions are already recorded and Accepted in `decision-record.md`, so no criterion
below asks whether a decision was reached. They ask whether the allocation table is complete, whether
each candidate is assigned once, whether the eight ADRs are reachable and Accepted, and whether the
non-work register and the rejection list carry their reasons.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the union of candidates from both research syntheses, When the allocation table is read, Then every candidate carries exactly one verdict and no row is blank | Count the rows against the 29-candidate union the phase 001 synthesis records, scan for blanks, and confirm the four non-work rows are present | Unmet | - |
| AC-002 | REQ-002 | Given an adopted candidate, When the owning-document column is read, Then it names exactly one document | A duplicate scan over the owning-document column returns nothing, and every adopted row's cell is filled | Unmet | - |
| AC-003 | REQ-003 | Given an adopted candidate, When its row is read, Then it names the specific failure the rule prevents rather than a general benefit | Read each adopted row and reject any failure statement that would fit any rule set | Unmet | - |
| AC-004 | REQ-004 | Given a source rule that conflicts with an existing rule, When the packet closes, Then an Accepted ADR says which side wins and why, and ADR-001 through ADR-008 are present and reachable | Read every ADR in `decision-record.md`, confirm each Status field reads Accepted, and confirm the colon case names the rule that stands and the rule that would have changed | Unmet | - |
| AC-005 | REQ-005 | Given two lineages that disagree, When the disagreement is recorded, Then it is diagnosed as an underspecified question or as thin evidence, and never averaged | Every disagreement entry carries a diagnosis, and no entry carries a tally | Unmet | - |
| AC-006 | REQ-006 | Given a candidate the table assigns to a new rule file, When its row is read, Then it names why no existing document can carry it | Each new-file assignment names the existing file it was tested against, which for the reply-shape bundle is the length ceiling `communication.md` records | Unmet | - |
| AC-007 | REQ-007 | Given the reader-profile candidates, When their rows are read, Then the answer is explicit: the delivery rules bind whenever a reply is written, and the reader-conditional rules need an operator-selected mode that stays off by default | The split appears in the table as a decision, not as an open question | Unmet | - |
| AC-008 | REQ-001 | Given a candidate no surface can carry, When its row is read, Then it is recorded as deliberate non-work with a blocking reason and no owning document | Four rows are present, covering the editing lane for durable prose, the long-session decay problem, runtime mirror verification, and reply-level numbering | Unmet | - |
| AC-009 | REQ-001 | Given a candidate or an option the decisions did not adopt, When the rejection list is read, Then each rejection carries one reason | Read each rejection and confirm no rejected option reappears as an adopted row | Unmet | - |

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

Every row above is `Unmet`, so closure is blocked. The eight decisions are recorded and Accepted, so
the deciding half of this phase is done. What is not done is the allocation table, the four non-work
rows and the rejection list, and this statement will be rewritten when they land.
<!-- /ANCHOR:closure -->
