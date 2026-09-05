---
title: "Acceptance Criteria: Phase 7: memory-command-family-naming-decision"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/007-memory-command-family-naming-decision"
    last_updated_at: "2026-09-05T06:13:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-007-memory-command-family-naming-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: memory-command-family-naming-decision

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/007-memory-command-family-naming-decision
**Level:** 2
**Status:** Planned
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the two naming options, When `spec.md` is read, Then each option's blast radius is grouped by consumer class with a reproducible `rg` command | `spec.md` Scope and Success Criteria sections | Unmet | - |
| AC-002 | REQ-002 | Given the operator's decision, When it is made, Then `decision-record.md` exists in this folder and names the chosen option before any rename work is scheduled | `test -f decision-record.md` and its content | Unmet | - |
| AC-003 | REQ-003 | Given Option A is chosen, When the decision record is written, Then it also names the follow-on documentation task (README/ARCHITECTURE/`memory-system.md` clarification) rather than leaving it implicit | `decision-record.md` content, once written | Unmet | - |
| AC-004 | REQ-004 | Given Option B is chosen, When the follow-on execution packet is opened, Then its scope explicitly names `runtime/hooks/claude/session-stop.ts:73-76` | The follow-on packet's `spec.md`, once it exists | Unmet | - |

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

Note: AC-003 and AC-004 are mutually exclusive by construction - only the row matching the eventual decision applies. The non-applicable row should be marked `Superseded` once the decision is recorded, naming the resulting `decision-record.md` as its ADR.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

All four criteria are Unmet; the operator has not yet made or recorded the naming decision.
<!-- /ANCHOR:closure -->
