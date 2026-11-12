---
title: "Acceptance Criteria: Phase 4: name-file-in-plan-phase-lines"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "plan phase file naming acceptance criteria"
  - "plan template example closure criteria"
  - "authoring card example acceptance"
  - "scaffold snapshot regeneration acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines"
    last_updated_at: "2026-11-12T00:15:09Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the captured T006 exit and closed both criteria"
    next_safe_action: "No follow-up action remains for this packet."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-name-file-in-plan-phase-lines"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "AC-002 exit=0 is recorded in scratch/build-evidence.md line 152."
---
# Acceptance Criteria: Phase 4: name-file-in-plan-phase-lines

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-name-file-in-plan-phase-lines
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the template and authoring-card examples exist, When T002 and T003 pass their Verify commands, Then each command prints one matching phase line naming a file for Setup, Implementation and Verification while leaving command proof on task lines. | T002: tasks.md:48 records search=1 and exit 0. T003: tasks.md:50 records search=1, CARD SYNC OK and exit 0. | Met | - |
| AC-002 | REQ-002 | Given the plan/implement entry and template snapshot are in scope, When T004, T005 and T006 pass, Then T004's search prints the scoped entry sentence, the regenerated snapshot differs by 4 lines in and 4 out, and the focused snapshot suite exits 0 without update mode. | T004 returned 1 (exit 0); T005 diff returned 4 insertions and 4 deletions (exit 0) and phrase search returned 4 (exit 0); ../scratch/build-evidence.md:152 records exit=0, 12 tests passed and 0 obsolete-or-written lines. | Met | - |

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

AC-001 and AC-002 are Met. The captured no-update run records exit=0, 12 passing tests and 0 obsolete-or-written lines (../scratch/build-evidence.md:152).
<!-- /ANCHOR:closure -->
