---
title: "Acceptance Criteria: Phase 3: Routing canon and tooling"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "routing canon and tooling acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/003-routing-canon-and-tooling"
    last_updated_at: "2026-10-28T06:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Planned the phase from the phase 001 research"
    next_safe_action: "Run /speckit:plan on this phase before implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: Routing canon and tooling

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/003-routing-canon-and-tooling`
**Level:** 2
**Status:** Planned
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: One proof packet uses the new shape and `verify-router-sync.cjs`, `package_skill.py --strict` and `parent-skill-check.cjs` pass on it. | Recorded in `scratch/after.md` | Unmet | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: Every tooling change ships with a test that fails without it. | Recorded in `scratch/after.md` | Unmet | - |
| AC-003 | REQ-003 | Given the phase is implemented, When its gates run, Then: The templates describe the new shape in plain words with one example. | Recorded in `scratch/after.md` | Unmet | - |
| AC-004 | REQ-004 | Given a new skill and a new parent skill are created through `/create:skill` and `/create:skill-parent`, When creation finishes, Then: both are in the new shape with no hand edit, and `package_skill.py --strict` passes on each. | Recorded in `scratch/after.md` | Unmet | - |
| AC-005 | REQ-005 | Given a `SKILL.md` in the old shape, When the extended creation check runs, Then: it fails, a test proves it failed before the change, and a fleet run lists existing old-shape skills as known debt and exits 0. | Recorded in `scratch/after.md` | Unmet | - |

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

The phase is Planned and no criterion is met yet.
<!-- /ANCHOR:closure -->
