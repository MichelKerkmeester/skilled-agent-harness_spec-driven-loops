---
title: "Acceptance Criteria: Manifest Entry and Goal Template"
description: "Put a goal document into the documentation-level contract as a lazy add-on and author its gated template, so the durable directive, its binding block and its optional log all have one authored shape."
trigger_phrases:
  - "goal manifest entry"
  - "goal template"
  - "lazy add-on goal"
  - "goal.md.tmpl"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/001-manifest-and-goal-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Add the contract entry and author the template"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-042-001-manifest-and-goal-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The document is a lazy add-on, not an optional one; the document collector walks lazy and skips optional"
---

# Acceptance Criteria: Manifest Entry and Goal Template

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/042-nested-goal-template-addon/001-manifest-and-goal-template
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
| AC-001 | REQ-001 | Given the contract, When a level's document set is resolved, Then the goal document appears for Levels 1, 2, 3, 3+ and phase and for no other level | `templates/spec-kit-docs.json:197` lazyAddonDocs carries it at 1/2/3/3+/phase and not at review | Met | - |
| AC-002 | REQ-002 | Given the template, When it is rendered at each level, Then the five carrying levels emit content and the rest emit nothing | Gate `templates/addons/goal.md.tmpl:1` renders 53 lines at 1/2/3/3+, 68 at phase, 0 at review | Met | - |
| AC-003 | REQ-003 | Given the mapping, When the document is resolved to a template, Then a path is returned at the carrying levels and null elsewhere | `scripts/utils/template-structure.js:102` maps the document to its template | Met | - |
| AC-004 | REQ-004 | Given a rendered document, When its headings are read, Then the durable directive and the volatile log are separable by heading alone | Splits at `templates/addons/goal.md.tmpl:42` (durable) and `:93` (log) | Met | - |
| AC-005 | REQ-005 | Given a phase-parent rendering, When it is read, Then it carries a binding block, and a standalone Level 1 rendering does not | Binding gated at `templates/addons/goal.md.tmpl:57`: 1 block at phase, 0 at Level 2 | Met | - |

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

All five criteria met with observed renders and resolver output. Nothing waived.
<!-- /ANCHOR:closure -->
