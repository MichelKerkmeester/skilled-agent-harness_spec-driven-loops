---
title: "Acceptance Criteria: Series parent rule, sibling listing and trigger phrases for new packets"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing"
    last_updated_at: "2026-10-06T20:29:11Z"
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
# Acceptance Criteria: Series parent rule, sibling listing and trigger phrases for new packets

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `phase-definitions.md` §2, When a reader looks for where a second small change to the same file goes, Then it defines a series parent by same artifact, same track and a different change, and sends a correction back to the existing packet | `phase-definitions.md` §2 text | Unmet | - |
| AC-002 | REQ-002 | Given the rule docs and command notes, When searched for the old labels, Then no line says Option D adds a phase or Option E skips, and §4 lets a standard packet become a series parent's first child | `rg` over the edited files | Unmet | - |
| AC-003 | REQ-003 | Given every doc that restates the phase thresholds, When read, Then each names the series parent exception | `rg -n ">= 25"` over the edited docs | Unmet | - |
| AC-004 | REQ-004 | Given a track with packets created in the last 14 days, When `create.sh` makes a top-level packet there, Then stderr lists them, and a phase child or sub-folder run lists nothing | create test plus a scratch run | Unmet | - |
| AC-005 | REQ-005 | Given `create.sh` copies a `spec.md`, When the file is read, Then its trigger phrases come from the slug and description, not the four template defaults | create test plus a scratch run | Unmet | - |
| AC-006 | REQ-006 | Given a spec with the four template phrases, When `GREP_CONVENTION` judges it, Then it warns with the generic-trigger class | trigger-index test | Unmet | - |
| AC-007 | REQ-007 | Given the change, When the six baseline test files and new tests run, Then all pass and the golden snapshot diff touches only trigger phrase lines | Vitest output and snapshot diff | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
