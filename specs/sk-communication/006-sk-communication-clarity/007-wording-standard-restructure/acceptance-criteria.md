---
title: "Acceptance Criteria: Phase 7: wording-standard-restructure"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/007-wording-standard-restructure"
    last_updated_at: "2026-09-12T15:40:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for phases 2 and 6, then enumerate consumers and map sections to the line"
    blockers:
      - "Phase 2 has not run"
      - "Phase 6 has not run"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md"
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: wording-standard-restructure

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/007-wording-standard-restructure
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
| AC-001 | REQ-001 | Given a consumer of the standard, When it is opened, Then it resolves to the content it needs | Open every consumer in both families; no pointer is trusted unopened | Unmet | - |
| AC-002 | REQ-002 | Given the scope gate, When its exclusion rows are counted, Then exactly one remains and it cites ownership | Read the gate and count | Unmet | - |
| AC-003 | REQ-003 | Given the base, When searched for file, score or publish-threshold language, Then nothing is found | Ripgrep the base for that vocabulary | Unmet | - |
| AC-004 | REQ-004 | Given the reply-scoped subsection, When a reply loads the base, Then that subsection is present | Read the base and locate the subsection | Unmet | - |
| AC-005 | REQ-005 | Given each of the six candidates, When read, Then it names the failure it prevents | Read each added rule | Unmet | - |
| AC-006 | REQ-006 | Given the document scan test and the worked exemplar, When placed, Then they sit where phase 2 decided | Compare placement with the decision record | Unmet | - |
| AC-007 | REQ-007 | Given the base, When read, Then it names the supplement | Read the base's routing sentence | Unmet | - |

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

This phase is blocked on phases 2 and 6. The statement is written when the phase closes, naming which criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
