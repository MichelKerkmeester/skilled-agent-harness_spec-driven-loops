---
title: "Acceptance Criteria: Surface tie order warning"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "surface tie order warning acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning"
    last_updated_at: "2026-10-13T15:21:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ac-027"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Surface tie order warning

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a sk-code tieBreak with a user surface after `sk-code-opencode`, When the doctor runs, Then it prints `FAIL: 5l:` naming that surface and both fixes, and exits 1 | Ledger row T1; `goal.md` criterion 2 | Unmet | - |
| AC-002 | REQ-002 | Given the shipped order quality, review, opencode, obsidian, webflow, When the doctor runs, Then 5l prints PASS | Ledger row T2; `goal.md` criterion 1 | Unmet | - |
| AC-003 | REQ-003 | Given a tree without the two examples and a user surface ahead of opencode, When the doctor runs, Then 5l prints PASS | Ledger row T3; `goal.md` criterion 2 | Unmet | - |
| AC-004 | REQ-004 | Given the seven parent hubs, When the doctor runs on each, Then each exits 0 | `goal.md` criterion 3 | Unmet | - |

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

Written at closeout.
<!-- /ANCHOR:closure -->
