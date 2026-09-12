---
title: "Acceptance Criteria: Phase 3: root-doc-and-repo-rules"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/003-root-doc-and-repo-rules"
    last_updated_at: "2026-09-12T13:00:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for the phase 002 allocation table, then apply the rule-file changes"
    blockers:
      - "Phase 002 has not run"
    key_files:
      - "AGENTS.md"
      - "REPO RULES.md"
      - "repo-rules/communication.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: root-doc-and-repo-rules

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/003-root-doc-and-repo-rules
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
| AC-001 | REQ-001 | Given the scoped diff, When each change is traced, Then it maps to an adopted allocation row and nothing else appears | Walk the diff against the allocation table, both directions | Unmet | - |
| AC-002 | REQ-002 | Given a new rule file, When the router is walked, Then a trigger row names it and the trigger describes an action | Open every file each trigger row names, and grep every rule file for an inbound trigger | Unmet | - |
| AC-003 | REQ-003 | Given any punctuation mark or named construction, When the stack is scanned, Then exactly one instruction governs it | `rg` each mark across `AGENTS.md`, `REPO RULES.md` and `repo-rules/`, compared with the captured baseline | Unmet | - |
| AC-004 | REQ-004 | Given an added rule paragraph, When it is read, Then it names the failure it prevents | Read every added paragraph, because specificity is a judgment a grep cannot make | Unmet | - |
| AC-005 | REQ-005 | Given a clause added to the root doc, When it is read, Then it states why it cannot live in a rule file | Each added root-doc clause carries that statement | Unmet | - |
| AC-006 | REQ-006 | Given a touched rule file, When its length is checked, Then it is within its readable ceiling or it was split | Compare each file's size against its stated discipline | Unmet | - |
| AC-007 | REQ-007 | Given a new rule file, When it is opened, Then it carries the routed-from line, the bounded-by statement, a fires-when list and a self-check | Read each new file's header and closing section | Unmet | - |

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

This phase is blocked on phase 002. The statement is written when the phase closes, naming which
criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
