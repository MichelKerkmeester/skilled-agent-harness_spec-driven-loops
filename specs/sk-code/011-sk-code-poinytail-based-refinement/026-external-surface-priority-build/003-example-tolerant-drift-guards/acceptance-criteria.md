---
title: "Acceptance Criteria: Example-tolerant drift guards"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "example-tolerant drift guards acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-003-ac"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Example-tolerant drift guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/003-example-tolerant-drift-guards
**Level:** 2
**Status:** Draft
**Date:** 2026-10-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the live tree, When `run-all-drift-guards.sh` runs, Then it exits 0 with the same per-check results as before the change | Ledger row P10-1; `goal.md` criterion 1 | Unmet | - |
| AC-002 | REQ-002 | Given a copy after the removal recipe, When router-sync runs, Then checks 1a, 1b, 2, 3 and 4 pass | Ledger row P10-2 | Unmet | - |
| AC-003 | REQ-003 | Given that copy with ROUTER.md's Webflow prose section removed, When router-sync runs, Then the same checks still pass | Ledger row P10-3; `goal.md` criterion 2 | Unmet | - |
| AC-004 | REQ-004 | Given a registry with two surfaces, When doc-claims runs, Then 'two surfaces' wording passes the `surfaces` rule | Ledger row P10-4; `goal.md` criterion 2 | Unmet | - |
| AC-005 | REQ-005 | Given the pristine copy, When router-sync check 2 runs, Then it reports no new problem | Ledger row P10-5 | Unmet | - |
| AC-006 | REQ-006 | Given the four changes, When their tests run, Then each fails before its change and passes after, and one sk-code-opencode release is added | Ledger rows T1 to T4; `goal.md` criteria 3 and 5 | Unmet | - |

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

The phase is planned and not built. The builder writes this statement when the packet closes.
<!-- /ANCHOR:closure -->
