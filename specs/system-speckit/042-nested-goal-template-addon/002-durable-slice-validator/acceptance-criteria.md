---
title: "Acceptance Criteria: Durable Slice Validator"
description: "A present-file rule that checks a goal document's shape: its durable and log headings, a binding block on phase parents, listed child paths that exist, and a durable slice within its character budget."
trigger_phrases:
  - "goal validator"
  - "durable slice cap"
  - "binding block check"
  - "child path existence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/002-durable-slice-validator"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the rule and register it"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-042-002-durable-slice-validator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The cap applies to the durable slice only; a progress log is not a defect"
---

# Acceptance Criteria: Durable Slice Validator

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/042-nested-goal-template-addon/002-durable-slice-validator
**Level:** 2
**Status:** Draft
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet with no goal document, When the rule runs, Then it reports nothing | Recorded at implementation | Unmet | - |
| AC-002 | REQ-002 | Given a durable slice over budget, When the rule runs, Then it reports the overage and the measurement excludes the log | Recorded at implementation | Unmet | - |
| AC-003 | REQ-003 | Given a phase-parent document without a binding block, When the rule runs, Then it reports the missing block | Recorded at implementation | Unmet | - |
| AC-004 | REQ-004 | Given a listed child path that does not resolve, When the rule runs, Then it names that path | Recorded at implementation | Unmet | - |
| AC-005 | REQ-005 | Given a well-formed document, When the rule runs, Then it reports nothing | Recorded at implementation | Unmet | - |

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

Open until this phase is implemented and each criterion carries observed evidence.
<!-- /ANCHOR:closure -->
