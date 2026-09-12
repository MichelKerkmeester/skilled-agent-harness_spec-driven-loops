---
title: "Acceptance Criteria: Phase 8: decision-and-handoff-rules"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/008-decision-and-handoff-rules"
    last_updated_at: "2026-09-12T15:40:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for phase 2's conflict resolution, then write the four uncontested clauses"
    blockers:
      - "Phase 2 has not run"
    key_files:
      - "repo-rules/presenting-decisions.md"
      - "repo-rules/handoff-and-questions.md"
      - "repo-rules/evidence-and-proof.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: decision-and-handoff-rules

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/008-decision-and-handoff-rules
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
| AC-001 | REQ-001 | Given the five candidates, When the phase closes, Then each lands in exactly one file per the allocation table | Walk the five rows against the three files, both directions | Unmet | - |
| AC-002 | REQ-002 | Given an added clause, When read, Then it names the failure it prevents | Read every added clause | Unmet | - |
| AC-003 | REQ-003 | Given the qualifier, When read beside the three tiers, Then an unconfirmed cause still cannot be presented as confirmed | Read the clause and the tier table together, and attempt the three adversarial readings | Unmet | - |
| AC-004 | REQ-004 | Given reader triage, When read, Then its distinction from the existing restate step is stated in the rule | Read both passages | Unmet | - |
| AC-005 | REQ-005 | Given the restatement clause, When read, Then a reader can tell whether they complied | Read the clause and check it states a cadence rather than a preference | Unmet | - |
| AC-006 | REQ-006 | Given the handback rule, When diffed, Then the closing contract is an edit to the existing obligation | Diff review of that file | Unmet | - |
| AC-007 | - | Given the three files, When scanned together, Then no close-out obligation appears in two of them | Duplication scan across all three | Unmet | - |

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

This phase is blocked on phase 2. The statement is written when the phase closes, naming which criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
