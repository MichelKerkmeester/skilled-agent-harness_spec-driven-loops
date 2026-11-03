---
title: "Acceptance Criteria: Phase 5: inferred-confirmations"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "inferred confirmations acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/005-inferred-confirmations"
    last_updated_at: "2026-11-03T08:33:57Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: inferred-confirmations

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `sk-code/018-frontend-upstream-proposals/005-inferred-confirmations`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each rank, When its first code edit is made, Then its confirming run is already saved in `scratch/` with command, output and exit status | File timestamps or commit order of `scratch/rank1*-*.txt` against the fix commits | Unmet | - |
| AC-002 | REQ-002 | Given `decision-record.md`, When it is read, Then it holds four verdicts, each citing its saved run | `rg -c "^### ADR-"` prints 4 | Unmet | - |
| AC-003 | REQ-003 | Given every shipped fix, When the fix is reverted and its test reruns, Then the test fails | The revert-proof notes from T011 | Unmet | - |
| AC-004 | REQ-004 | Given rank 11 shipped, When reach runs on every hub at concurrency 2, Then each prints `outranked=  0` and `wrong-hub=  0` | `scratch/rank11-reach.txt` | Unmet | - |
| AC-005 | REQ-005 | Given rank 10 shipped, When a fundamentals control prompt replays, Then an intent resolves | Replay output after the fix | Unmet | - |
| AC-006 | REQ-006 | Given rank 12 shipped, When the index is generated from a linked project, Then it holds that project's `specs/` paths or warns that the roots differ | Index path count or the warning line | Unmet | - |
| AC-007 | REQ-007 | Given rank 13 shipped, When a save scores a payload 0, Then the save prints the reason | The save output | Unmet | - |
| AC-008 | REQ-008 | Given the final state, When the existing suites of every touched script run, Then each exits 0 | Suite output and exit status | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

Nothing is built yet, and every criterion is unmet.
<!-- /ANCHOR:closure -->
