---
title: "Acceptance Criteria: Phase 9: adjacent-surface-rules"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/009-adjacent-surface-rules"
    last_updated_at: "2026-09-12T15:40:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for phase 2, then read the code skill's routing to confirm the target file"
    blockers:
      - "Phase 2 has not run"
      - "The code skill's comment-guidance file is unconfirmed"
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
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
# Acceptance Criteria: Phase 9: adjacent-surface-rules

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/009-adjacent-surface-rules
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
| AC-001 | REQ-001 | Given both candidates, When the phase closes, Then each traces to an adopted row in the decision record | Walk both rows against the decision record | Unmet | - |
| AC-002 | REQ-002 | Given the comment addition, When read beside the hard blocker, Then it does not read as an exception and names which wins | Read both passages together and attempt the exception reading | Unmet | - |
| AC-003 | REQ-003 | Given each change, When its owning skill's gate runs, Then it passes from the final state | Run both gates and read output and exit status | Unmet | - |
| AC-004 | REQ-004 | Given either surface, When searched for communication rule or wording-standard text, Then nothing was copied in | Ripgrep both surfaces for that vocabulary | Unmet | - |
| AC-005 | REQ-005 | Given an existing rule file, When validated against the changed template, Then it passes with no edits | Validate a sample of existing rule files | Unmet | - |
| AC-006 | REQ-006 | Given the code skill's routing, When read, Then it names the file the comment rule was added to | Read the routing and compare with the edited path | Unmet | - |

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

This phase is blocked on phase 2, and one target path is unconfirmed. The statement is written when the phase closes, naming which criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
