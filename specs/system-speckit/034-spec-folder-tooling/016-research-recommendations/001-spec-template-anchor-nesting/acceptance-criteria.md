---
title: "Acceptance Criteria: Phase 1: spec-template-anchor-nesting"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "spec template anchor nesting acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-spec-template-anchor-nesting"
    last_updated_at: "2026-10-08T04:22:39Z"
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
# Acceptance Criteria: Phase 1: spec-template-anchor-nesting

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting
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
| AC-001 | REQ-001 | Given a new L2, L3 and L3+ scaffold from the fixed template, When each is rendered, Then the questions anchor wraps only the questions and no other sections. | Snapshot test renders and compares all three levels, asserting no nesting of NFR/edge-cases/complexity inside questions. | Unmet | - |
| AC-002 | REQ-002 | Given the fixed template renders for L2, L3 and L3+, When snapshots are captured, Then they show the questions anchor in the correct position for each level. | The snapshot file `scaffold-golden-snapshots.vitest.ts.snap` holds 24 entries (one per level per document kind); verify the questions entries for L2/L3/L3+ match the new anchor depth. | Unmet | - |
| AC-003 | REQ-003 | Given new L2, L3 and L3+ scaffolds from the fixed template, When `validate.sh --strict` runs on each, Then ANCHORS_VALID reports pass for all three. | Run `validate.sh --strict` on three test packets (one per level) created with the fixed template; all must show ANCHORS_VALID: pass. | Unmet | - |
| AC-004 | REQ-004 | Given the snapshot test rendering all levels, When it asserts no anchor nesting, order and pairing, Then all assertions pass. | The test code in `scaffold-golden-snapshots.vitest.ts` carries `assert noNesting(...)` calls for each level; test output shows all assertions pass. | Unmet | - |
| AC-005 | REQ-005 | Given the spec-kit test suite, When it runs, Then no new test failures appear. | Command: `npx vitest run runtime/cli/tests`, exit code 0, test count unchanged or higher than baseline. | Unmet | - |

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

This packet is planned and will be closed once all five criteria are met: the template is fixed for all four levels, snapshots are regenerated, validation passes for all levels, and the test suite passes with new assertions.
<!-- /ANCHOR:closure -->
