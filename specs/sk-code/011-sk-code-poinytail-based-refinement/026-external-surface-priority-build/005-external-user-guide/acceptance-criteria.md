---
title: "Acceptance Criteria: External user guide"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "external user guide acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide"
    last_updated_at: "2026-10-13T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-026-005-ac"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: External user guide

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide
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
| AC-001 | REQ-001 | Given the R4 lines, When they are read, Then each marks OpenCode native and the two examples optional, and no line tells the user to replace OpenCode | `goal.md` criterion 1; ledger row P11-5 | Unmet | - |
| AC-002 | REQ-002 | Given a fresh full-tree copy and an agent that reads only the adaptation block, When it removes both examples and adds a stand-in surface, Then the doctor, CI metadata check, guard, sync `--check` and drift wrapper exit 0 | Ledger rows P11-1, P11-2 and P11-4 | Unmet | - |
| AC-003 | REQ-003 | Given that copy, When the tie prompt routes, Then the result is `[sk-code-acme, sk-code-opencode]` | Ledger row P11-3 | Unmet | - |
| AC-004 | REQ-004 | Given the adaptation block, When it is searched, Then it names the nested path, the hooks, the keep-rule, the add command, the two ROUTER.md maps and the drift wrapper | `goal.md` criterion 2 | Unmet | - |
| AC-005 | REQ-005 | Given `.skilled/changelog/skilled/`, When the newest note is read, Then it is newer than v4.0.0.4, states the rule and passes `validate_document.py`, and v4.0.0.4 is unchanged | `goal.md` criterion 3 | Unmet | - |
| AC-006 | REQ-006 | Given the integration branch, When the live gates run, Then each exits 0 and the history carries all four earlier phases | `goal.md` criterion 5; ledger row P11-6 | Unmet | - |

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
