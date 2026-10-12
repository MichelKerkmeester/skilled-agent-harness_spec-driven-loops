---
title: "Acceptance Criteria: README freshness fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "readme freshness fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes"
    last_updated_at: "2026-10-12T17:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet the review criterion"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-024-ac"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: README freshness fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the ledger in `implementation-summary.md`, When its F rows are counted, Then all 23 are Fixed with a backticked proof or Rejected with a reason | Goal criteria 1 and 2 print 23 and 0 | Met | - |
| AC-002 | REQ-002 | Given the five hubs, When the parent-skill doctor runs on each, Then no `13c-readme-version` line prints | Goal criterion 3 prints 0 | Met | - |
| AC-003 | REQ-003 | Given the doctor suite, When it runs with and without the change, Then it passes with it and its new test fails without it | DC-2 ledger line: 97 of 97 pass, and the new test fails with 13c restored | Met | - |
| AC-004 | REQ-004 | Given this phase's commits, found by their Spec trailer, When the changelog files they add are listed, Then there are none, and no `version:` line changed outside the hook's raises | Goal criterion 6 prints 0 | Met | - |
| AC-005 | REQ-005 | Given a five-iteration `/deep:review :auto` on cli-devin with `deepseek-v4-1-flash-max`, When it ends, Then every confirmed P0 to P2 is fixed or rejected with a reason | `review/review-report.md` | Unmet | - |
| AC-006 | REQ-006 | Given the Remaining table, When each row is read, Then it names the item and why it stays | RM-1 to RM-3 in `implementation-summary.md` | Met | - |

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

AC-005 waits on the review run.
<!-- /ANCHOR:closure -->
