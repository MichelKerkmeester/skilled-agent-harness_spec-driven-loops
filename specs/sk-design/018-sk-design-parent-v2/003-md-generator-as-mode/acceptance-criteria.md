---
title: "Acceptance Criteria: sk-design-md-generator as the EXTRACT mode"
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
    packet_pointer: "scaffold/002-phase-2-provide-descriptive-slug"
    last_updated_at: "2026-09-06T13:52:16Z"
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
# Acceptance Criteria: sk-design-md-generator as the EXTRACT mode

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/003-md-generator-as-mode`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the regression phase 002 introduced, When the generator becomes a mode of the hub, Then `validate this design.md` routes above the 0.8 bar again | Replayed at daemon generation 618 after an explicit rebuild: 0.82, reaching the hub | Met | - |
| AC-002 | REQ-002 | Given the generator's second baseline phrase, When it is replayed from the merged identity, Then it still reaches the owner above the bar | `extract design tokens from stripe.com` at 0.896, generation 618 | Met | - |
| AC-003 | REQ-003 | Given a hub root, When the fleet gate runs, Then it reports no nested identity and `sk-design` stays class H | Fleet metadata audit after deleting the packet's four identity files | Met | - |
| AC-004 | REQ-004 | Given 74 files carrying the old path, When they are classified, Then all 44 live references resolve and none of the 30 historical records is rewritten | 24 in-tree plus 20 live rewritten in `fa35e09653`; the `016` records left as written | Met | - |
| AC-005 | REQ-005 | Given 7,942 moved files, When the index is inspected before commit, Then git records renames | `git diff --cached --name-status -M`, verified before committing | Met | - |
| AC-006 | REQ-006 | Given a shared branch, When the move and its rewrites land, Then they are one commit and no intermediate state carries a dead load path | Commit `fa35e09653` | Met | - |

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

REQ-001 carried this phase: it was written as the closing condition for a regression the previous
phase created, and the phase could not close until the phrase routed. Two criteria originally
phrased as 'at or above the baseline score' were corrected rather than declared met, because the
baselines belonged to a standalone identity and the answering identity is now the hub. Lifting the
`styles/` corpus was consciously left out; it is a separate packet.
<!-- /ANCHOR:closure -->
