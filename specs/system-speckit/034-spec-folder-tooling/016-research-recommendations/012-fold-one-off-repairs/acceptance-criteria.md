---
title: "Acceptance Criteria: Fold one-off repairs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "fold one off repairs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs"
    last_updated_at: "2026-10-08T04:22:48Z"
    last_updated_by: "claude"
    recent_action: "Planned fold one-off repairs"
    next_safe_action: "Implement and verify all criteria"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fold one-off repairs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs
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
| AC-001 | REQ-001 | Given fillMissingFrontmatter in upgrade-legacy, When it fills frontmatter, Then template literal per document class takes precedence | Test extends "fills missing frontmatter" in upgrade-legacy.vitest.ts:151+ | Unmet | - |
| AC-002 | REQ-002 | Given upgrade-legacy with failures, When grouped-detail report runs, Then output shows failures grouped by rule with count | Test in upgrade-legacy.vitest.ts covers grouped-detail format | Unmet | - |
| AC-003 | REQ-003, REQ-004 | Given upgrade-legacy tests, When value-source order and grouped-detail are tested, Then tests pin both behaviors | New/extended tests in upgrade-legacy.vitest.ts for value-source and grouped-detail | Unmet | - |
| AC-004 | REQ-005 | Given the full suite, When npm test is run, Then no tests fail | `npm test` output in runtime/cli shows 0 failures | Unmet | - |

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
