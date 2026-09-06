---
title: "Acceptance Criteria: Phase 1: router-conformance"
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
    packet_pointer: "scaffold/009-router-conformance"
    last_updated_at: "2026-09-06T17:43:45Z"
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
# Acceptance Criteria: Phase 1: router-conformance

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/009-router-conformance`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a router with no machine-readable section, When it is rewritten, Then it carries one, numbered, with the replay note every peer has | `## 3. MACHINE-READABLE ROUTER (replay / benchmark source)` present; skeleton now OVERVIEW, INTENT MODEL, MACHINE-READABLE ROUTER, HOW TO READ THIS | Met | - |
| AC-002 | REQ-002 | Given peers that declare `DEFAULT_RESOURCE`, When this router is rewritten, Then it declares one with the reason it is empty | `DEFAULT_RESOURCE = []` with a comment explaining that a design request loads only the selected mode's leaves | Met | - |
| AC-003 | REQ-003 | Given a prose closing paragraph, When it is rewritten, Then it covers dominant intent, near-ties, same-mode ties and the UNKNOWN fallback | `## 4. HOW TO READ THIS`, seven bullets, including the chart-versus-flowchart tie and the fundamentals same-mode case | Met | - |
| AC-004 | REQ-004 | Given a structural rewrite, When the phrases are replayed, Then routing is unchanged | Replay at generation 653 byte-identical to the closing-phase capture; 14 of 14 `RESOURCE_MAP` paths resolve; contract validator 0 issues | Met | - |

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

AC-004 carried this phase: a router rewrite is only safe if it moves no routing, and the replay came
back byte-identical. The uncomfortable finding is AC-001's: the contract validator passed for this
file before and after, so nothing in the fleet would ever have reported the divergence. That is
recorded as an open question rather than fixed, because encoding a section skeleton in the validator
is its own change with its own blast radius.
<!-- /ANCHOR:closure -->
