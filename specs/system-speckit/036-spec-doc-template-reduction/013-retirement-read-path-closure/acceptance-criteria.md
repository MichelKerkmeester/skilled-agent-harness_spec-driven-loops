---
title: "Acceptance Criteria: Retirement Read-Path Closure"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "read path closure criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/013-retirement-read-path-closure"
    last_updated_at: "2026-08-30T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-retirement-read-path-closure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Retirement Read-Path Closure

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-spec-doc-template-reduction/013-retirement-read-path-closure
**Level:** 2
**Status:** Draft
**Date:** 2026-08-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given that the evidence rule was deleted as advisory, When this packet closes, Then it records whether a blocking successor is wanted and why | [the decision, written down with its reasoning] | Unmet | - |
| AC-002 | REQ-001 | Given a successor is wanted, When its id matching is specified, Then it covers the family, colon and four-digit shapes the deleted rule missed | [the shapes enumerated against the template's real ids] | Unmet | - |
| AC-003 | REQ-002 | Given a level-2 packet, When level is inferred, Then both modules return 2 | [both call sites exercised, with the pre-change return of 1 as the control] | Unmet | - |
| AC-004 | REQ-002 | Given the module the retirement never touched, When it infers level, Then it uses the replacement document rather than the deleted one | [file:line plus exercised output] | Unmet | - |
| AC-005 | REQ-003 | Given a misspelled value in either enforcement variable, When the rule runs, Then it reports the unrecognized value instead of disabling itself | [rule output for a misspelled value] | Unmet | - |
| AC-006 | REQ-004 | Given the reference tree, When it is searched for instructions to create the retired document, Then none remain and no link points at the deleted template | [search output, against the eight files that still match after a concurrent dead-link sweep] | Unmet | - |
| AC-007 | REQ-005 | Given a phase child scaffolded at level 2, When it is created, Then it has the merged verification region | [the region present in a freshly created packet] | Unmet | - |
| AC-008 | REQ-005 | Given a packet scaffolded at level 1 and then upgraded, When the upgrade completes, Then it has the same verification region as one scaffolded at level 2 | [both packets compared] | Unmet | - |

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

[Write this when the packet is closed, not before. AC-007 and AC-008 are the rows that decide
whether the other fixes hold: a coverage rule and an evidence rule are only as good as the
document they read, and today the scaffold does not produce one.]
<!-- /ANCHOR:closure -->
