---
title: "Acceptance Criteria: Prove the repair write reaches the file the scan classified, and retire the containment branch that proves nothing"
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
    packet_pointer: "scaffold/046-path-containment-followups"
    last_updated_at: "2026-08-30T14:17:45Z"
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
# Acceptance Criteria: Prove the repair write reaches the file the scan classified, and retire the containment branch that proves nothing

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/046-path-containment-followups
**Level:** 2
**Status:** Draft
**Date:** 2026-08-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a scanned directory replaced by a symlink between the scan and the write, When the write runs, Then it is refused and the file outside the tree is unchanged | [the reproduction above, run against the fix] | Unmet | - |
| AC-002 | REQ-001 | Given the same case run against the pre-change code, When it runs, Then it writes through — so the new case fails without the fix | [negative control output] | Unmet | - |
| AC-003 | REQ-001 | Given the final component replaced by a symlink, When the write runs, Then it is still refused | `scripts/tests/repair-write-symlink-refusal.sh` | Unmet | - |
| AC-004 | REQ-001 | Given a legitimate repair target inside a symlinked sibling-repository track, When the write runs, Then it succeeds | [a real track exercised, not a fixture] | Unmet | - |
| AC-005 | REQ-002 | Given the containment guard reduced to one root source, When the suite runs, Then it passes unchanged | `scripts/tests/graph-metadata-write-containment.sh` 8/8, and 4/8 with the guard neutered | Met | - |
| AC-006 | REQ-003 | Given a destination with a directory named `.opencode` beside it, When a write is attempted, Then the suite records that it succeeds, so the guard's limit is pinned rather than described | `scripts/tests/graph-metadata-write-containment.sh` case "another workspace, anchored on .opencode" | Met | - |

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

[Write this when the packet is closed, not before. AC-002 and AC-004 are the pair that matters:
one proves the fix does something, the other proves it did not achieve that by refusing the
symlinked tracks — which is how the previous stricter attempt at this failed.]
<!-- /ANCHOR:closure -->
