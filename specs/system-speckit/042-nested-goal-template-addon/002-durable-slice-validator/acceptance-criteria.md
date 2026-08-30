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
      fingerprint: "sha256:77d521d8585822af9bf979529a93d65e7ba5d7703aae51be4710b0909a7cb038"
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
| AC-001 | REQ-001 | Given a packet with no goal document, When the rule runs, Then it reports nothing | `scripts/tests/check-goal-shape.sh:51` no goal document is a no-op | Met | - |
| AC-002 | REQ-002 | Given a durable slice over budget, When the rule runs, Then it reports the overage and the measurement excludes the log | `scripts/tests/check-goal-shape.sh:71` over-budget slice reported with its measurement; the same slice passes at the parent budget (`scripts/rules/check-goal-shape.sh:129`) | Met | - |
| AC-003 | REQ-003 | Given a phase-parent document without a binding block, When the rule runs, Then it reports the missing block | `scripts/tests/check-goal-shape.sh:63` phase parent without a binding block is reported | Met | - |
| AC-004 | REQ-004 | Given a listed child path that does not resolve, When the rule runs, Then it names that path | `scripts/tests/check-goal-shape.sh:58` parent binding a missing child names that path (`scripts/rules/check-goal-shape.sh:119`) | Met | - |
| AC-005 | REQ-005 | Given a well-formed document, When the rule runs, Then it reports nothing | `scripts/tests/check-goal-shape.sh:52` well-formed leaf passes; live run across five folders in this packet, all PASS with measurements | Met | - |

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

All five criteria met. The rule caught a real inconsistency in this packet's own goal document during dogfooding: the parent bound four children whose goal documents did not yet exist.
<!-- /ANCHOR:closure -->
