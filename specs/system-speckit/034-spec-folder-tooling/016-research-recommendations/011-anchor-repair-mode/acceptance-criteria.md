---
title: "Acceptance Criteria: Phase 11: anchor-repair-mode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "anchor repair mode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/011-anchor-repair-mode"
    last_updated_at: "2026-10-08T04:22:47Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 11: anchor-repair-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode
**Level:** 2
**Status:** Planned
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a document with glued template pairs, When anchor-repair runs in dry-run, Then findings are reported and no files are written. | Test: `heal-spec-docs.vitest.ts` asserts stdout reports defects and no file write. | Unmet | - |
| AC-002 | REQ-002 | Given ambiguous duplicates with collision risk, When numbering runs, Then the collision is detected and reported instead of applied. | Test fixture with existing suffixes: collision detection blocks the change. | Unmet | - |
| AC-003 | REQ-003 | Given a spec.md with the nested questions layout, When the mode detects it, Then it moves only anchor markers to match the fixed template. | Test fixture: after repair, `parseAnchoredSections` returns sections not nested. | Unmet | - |
| AC-004 | REQ-004 | Given a document with defects, When apply runs, Then all edits complete atomically or none do. | Test with write failure: document restored to original state on failure. | Unmet | - |
| AC-005 | REQ-005 | Given anchors inside code fences, When pairing logic runs, Then fence boundaries are respected. | Test fixture: anchors inside and outside fences are never paired across boundaries. | Unmet | - |
| AC-006 | REQ-006 | Given a failing packet in `upgrade-legacy --apply`, When repair steps run, Then anchor-repair is one step and applies when needed. | Test: `upgrade-legacy.vitest.ts` asserts the step runs and document passes after. | Unmet | - |
| AC-007 | REQ-007 | Given the spec-kit test suite, When it runs, Then all tests pass. | Command: `npx vitest run runtime/cli/tests`, exit code 0. | Unmet | - |
| AC-008 | REQ-008 | Given an archived packet whose spec.md has the nested questions layout, When `upgrade-legacy --apply --include-archive` runs, Then only the anchor marker lines move and every prose line is unchanged. | Test: `upgrade-legacy.vitest.ts` archived fixture compares prose lines before and after. | Unmet | - |

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

**Closeable:** Pending

This packet is planned and will be closed once all eight criteria are met: the three anchor defect types are detected and fixed, collisions are prevented, atomic writes are guaranteed, the step integrates with upgrade-legacy, archived documents are un-nested by marker moves only and the test suite passes.
<!-- /ANCHOR:closure -->
