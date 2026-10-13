---
title: "Acceptance Criteria: Doctor guard and sync messages"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "doctor guard and sync messages acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-002-ac"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doctor guard and sync messages

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/002-doctor-guard-sync-messages
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
| AC-001 | REQ-001 | Given a copy with an example packet deleted, When the doctor runs, Then the 3c line names the README adaptation block | Ledger row P9-1 at `implementation-summary.md:92`; `goal.md` criterion 2 | Met | - |
| AC-002 | REQ-002 | Given a copy with `tieBreak` reordered and refreshed, When the guard runs, Then its authored-drift line names the runtime manifest and its authored twin | Ledger row P9-2 at `implementation-summary.md:93` | Met | - |
| AC-003 | REQ-003 | Given that copy, When the doctor's repair string is applied verbatim, Then the guard and sync `--check` exit 0 | Ledger row P9-3 at `implementation-summary.md:94`; `goal.md` criterion 2 | Met | - |
| AC-004 | REQ-004 | Given a copy with the authored closure missing, When sync `--check` and the guard run, Then sync exits 1 with one line naming the 015 folder and no stack, and the guard exits 1 naming the missing authored manifest | Ledger rows P9-4 and P9-5 at `implementation-summary.md:95` and `implementation-summary.md:96` | Met | - |
| AC-005 | REQ-005 | Given the 019-only copy and the live tree, When sync `--check`, the guard and the doctor run, Then each exits 0 | Ledger row P9-6 at `implementation-summary.md:97`; `goal.md` criterion 3 | Met | - |
| AC-006 | REQ-006 | Given the changed scripts, When the doctor and compiled-route suites run, Then they pass, and each new test fails before its change | Ledger rows P9-7 and T1 to T4 at `implementation-summary.md:98` and `implementation-summary.md:104`; `goal.md` criteria 1 and 4 | Met | - |

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

Every criterion is Met. Evidence is the ledger, the T rows and the RV rows in `implementation-summary.md`, rerun on the final commit, and `review/review-report.md`.
<!-- /ANCHOR:closure -->
