---
title: "Acceptance Criteria: Restore scaffold values a spec document lost, only where the right value can be proven"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/036-spec-doc-healer"
    last_updated_at: "2026-09-11T07:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Every criterion verified from the final state"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-spec-doc-healer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Restore scaffold values a spec document lost, only where the right value can be proven

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/036-spec-doc-healer
**Level:** 2
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an empty required field, When it is healed, Then the value comes from that document class's template | `heal-spec-docs.cjs` carries the defaults as literals copied from the core templates, and writes no composed value | Met | - |
| AC-002 | REQ-002 | Given a missing template header, When the document's anchors match the template set, Then the header is written | Proof packet gained `plan-core` and `tasks-core` only after the anchor check passed | Met | - |
| AC-003 | REQ-002 | Given anchors that do not match, When the healer runs, Then it refuses and lists the missing anchors | 73 refusals name the exact anchors absent, for example `does not carry summary, quality-gates, architecture` | Met | - |
| AC-004 | REQ-003 | Given a document with no frontmatter, When the healer runs, Then it refuses with that reason | 34 refusals read `no frontmatter block at all, so there is nothing to restore into` | Met | - |
| AC-005 | REQ-004 | Given a dry run, When it completes, Then nothing is written and the plan is reported | Default mode writes nothing, and the census ran repeatedly before any apply | Met | - |
| AC-006 | REQ-005 | Given both empty-list spellings, When either appears, Then it is detected | The inline `[]` form was missed by the first implementation and is now covered; it is the form the scaffold actually leaves | Met | - |
| AC-007 | REQ-006 | Given a healed document, When the metadata re-derive runs, Then the packet validates clean | Proof packet: frontmatter error cleared, integrity error appeared, re-derive cleared it, `RESULT: PASSED` | Met | - |
| AC-008 | REQ-007 | Given the same five tracks, When measured before and after, Then the failure count moves | 3 failures to 2 over 32 packets, with four of five tracks at zero | Met | - |
| AC-009 | REQ-004 | Given the dry run's prediction, When the apply runs, Then the counts agree | Predicted 323 healable, wrote 326, the difference being the three files from the proof packet applied earlier | Met | - |
| AC-010 | REQ-001 | Given a populated field, When the healer runs, Then it is never touched | The check requires the field to be present and empty, so a written value cannot be overwritten | Met | - |
| AC-011 | REQ-006 | Given the repository-wide chain, When the re-derive runs, Then it reports no failures | 148 packets re-derived, `failed=0`, where the same run reported eight before the tooling fix earlier today | Met | - |

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

AC-003 and AC-004 carried the packet, which is unusual: the refusals matter more than the fixes. A healer that filled every empty field would have scored better on the failure count and made the repository worse, because trigger phrases feed the retrieval index and invented ones are worse than absent ones. 107 documents were left exactly as found, each with the missing evidence named.

AC-008 is the honest ceiling. The heal moved three failures to two across the measured tracks. What remains needs documents written by hand, and no tool should close that gap.

One thing is worth carrying forward. The distinction this packet rests on, between a value a template defines and a value a person wrote, was available the whole time and nobody had drawn it. The existing repair tool refused the entire class as authored content, which was right about half of it and wrong about 323 documents.
<!-- /ANCHOR:closure -->
