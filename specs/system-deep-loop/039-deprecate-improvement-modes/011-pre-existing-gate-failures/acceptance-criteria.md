---
title: "Acceptance Criteria: Phase 11: pre-existing-gate-failures"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pre existing gate failures acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/011-pre-existing-gate-failures"
    last_updated_at: "2026-10-11T04:57:16Z"
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
# Acceptance Criteria: Phase 11: pre-existing-gate-failures

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/039-deprecate-improvement-modes/011-pre-existing-gate-failures
**Level:** 2
**Status:** Complete
**Date:** 2026-10-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the finished work units, When the bin suite runs, Then 57/57 pass and the move simulation resolves all 7 hubs | Bin vitest 57/57, move simulation resolves 7 hubs | Met | - |
| AC-002 | REQ-002 | Given the finished work units, When the advisor suites run, Then vitest, pytests and the regression set pass with no gate number worse | Advisor vitest 0 failed, regression 84/84, pytests pass, scorer metrics identical | Met | - |
| AC-003 | REQ-003 | Given the finished work units, When the drill runs on a scratch clone of the staged tree, Then it exits 0 with every expectation PASS | Drill exit 0, 48/48 on a scratch clone of the staged tree | Met | - |
| AC-004 | REQ-004 | Given the finished work units, When verify-authority runs, Then exit 2 is recorded as the legacy-writer rollout state, not a defect | Help text defines exit 2 as not on ledger; records show legacy writer | Met | - |
| AC-005 | REQ-005 | Given the finished work units, When the phrase linter runs with no node_modules, Then it warns and exits 0 | Fail-open test fails before the fix, passes after | Met | - |
| AC-006 | REQ-006 | Given the finished work units, When every git-hook test script runs, Then each exits 0 | All 10 git-hook test scripts exit 0 | Met | - |

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

All six criteria are Met with command evidence; the phase is closeable.
<!-- /ANCHOR:closure -->
