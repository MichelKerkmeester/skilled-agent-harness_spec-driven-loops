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
    last_updated_by: "builder"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-003-ac"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-10-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the live tree, When `run-all-drift-guards.sh` runs, Then it exits 0 with the same per-check results as before the change | Ledger row P10-1 (`implementation-summary.md:82`); `goal.md` criterion 1 | Met | - |
| AC-002 | REQ-002 | Given a copy after the removal recipe, When router-sync runs, Then checks 1a, 1b, 2, 3 and 4 pass | Ledger row P10-2 (`implementation-summary.md:83`) | Met | - |
| AC-003 | REQ-003 | Given that copy with ROUTER.md's Webflow prose section removed, When router-sync runs, Then the same checks still pass | Ledger row P10-3 (`implementation-summary.md:84`); `goal.md` criterion 2 | Met | - |
| AC-004 | REQ-004 | Given a registry with two surfaces, When doc-claims runs, Then 'two surfaces' wording passes the `surfaces` rule | Ledger row P10-4 (`implementation-summary.md:85`); `goal.md` criterion 2 | Met | - |
| AC-005 | REQ-005 | Given the pristine copy, When router-sync check 2 runs, Then it reports no new problem | Ledger row P10-5 (`implementation-summary.md:86`) | Met | - |
| AC-006 | REQ-006 | Given the four changes, When their tests run, Then each fails before its change and passes after, one sk-code-opencode release is added and the sk-code doctor's 13d passes | Ledger rows T1 to T4 (`implementation-summary.md:92`); `goal.md` criteria 1, 3 and 5 | Met | - |

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

Every row is Met. The live wrapper is unchanged (P10-1), the removal copy passes router-sync with and without the Webflow map (P10-2, P10-3), a two-surface registry accepts "two surfaces" (P10-4), pristine check 2 is identical (P10-5), T1 to T4 fail before and pass after, sk-code-opencode 1.2.4.0 is released and the doctor's 13d passes.
<!-- /ANCHOR:closure -->
