---
title: "Acceptance Criteria: Phase 4: sk-communication-upgrade"
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
    packet_pointer: "sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade"
    last_updated_at: "2026-09-12T13:00:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for phases 002 and 003, then change the skill documents"
    blockers:
      - "Phase 002 has not run"
      - "Phase 003 has not run"
    key_files:
      - ".opencode/skills/sk-communication/SKILL.md"
      - ".opencode/commands/rewrite/response.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: sk-communication-upgrade

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade
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
| AC-001 | REQ-001 | Given the skill, its commands and its assets, When searched for rubric text, Then one home is pointed at and no second copy exists | Re-run the duplication search and compare with the captured baseline | Unmet | - |
| AC-002 | REQ-002 | Given the scoped diff, When each change is traced, Then it maps to an adopted allocation row | Walk the diff against the allocation table, both directions | Unmet | - |
| AC-003 | REQ-003 | Given a failing or unsupported rewrite path, When it returns, Then the bytes are the exact original | Exercise a rejected candidate and a cancelled run, and compare bytes | Unmet | - |
| AC-004 | REQ-004 | Given either rewrite command document, When it is read, Then it names the pass it performs | Read both command documents and both runtime mirrors | Unmet | - |
| AC-005 | REQ-005 | Given the wording standard, When the skill's pointer is followed, Then the target's stated scope covers a live reply without a hand-maintained exclusion list, or the skill says plainly that it does not | Follow the pointer and read the target's scope statement | Unmet | - |
| AC-006 | REQ-006 | Given the change, When the enablement default and the advisor exclusion are read, Then both are unchanged | Read the enablement check and the route-exclusion list | Unmet | - |
| AC-007 | REQ-007 | Given the change, When the feature catalog and changelog are read, Then both record what changed | Read both, and confirm they describe the shipped behavior | Unmet | - |
| AC-008 | - | Given the final state, When the package gate runs, Then it passes with its output and exit status both read | `npm run check` in the package directory | Unmet | - |

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

This phase is blocked on phases 002 and 003. The statement is written when the phase closes, naming
which criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
