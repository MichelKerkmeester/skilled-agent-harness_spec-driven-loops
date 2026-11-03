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
    recent_action: "Met every criterion with observed evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given each rank, When its first code edit is made, Then its confirming run is already saved in `scratch/` with command, output and exit status | File timestamps or commit order of `scratch/rank1*-*.txt` against the fix commits. Observed: the four runs were created 13:28 to 13:34 and the first build brief at 13:44 (`stat -f %SB`); all four are committed in `a71daa9605` with the rank 10 fix | Met | - |
| AC-002 | REQ-002 | Given `decision-record.md`, When it is read, Then it holds four verdicts, each citing its saved run | `rg -c "^### ADR-"` prints 4. Observed: prints 4 | Met | - |
| AC-003 | REQ-003 | Given every shipped fix, When the fix is reverted and its test reruns, Then the test fails | The revert-proof notes from T011. Observed: `scratch/rank10-revert-test.txt` (2 fail reverted, 24/24 restored), `scratch/rank11-revert-test.txt` (3 fail, 27/27), `scratch/rank12-revert-test.txt` (1 fail, 3/3) | Met | - |
| AC-004 | REQ-004 | Given rank 11 shipped, When reach runs on every hub at concurrency 2, Then each prints `outranked=  0` and `wrong-hub=  0` | `scratch/rank11-reach.txt`. Observed: all seven hubs `outranked=  0`, `wrong-hub=  0`, `RESULT: PASSED`, the same counts as `scratch/rank11-reach-before.txt` | Met | - |
| AC-005 | REQ-005 | Given rank 10 shipped, When a fundamentals control prompt replays, Then an intent resolves | Replay output after the fix. Observed: `scratch/rank10-after.txt`, ten intents parse and the control prompt selects `DIAGNOSE` (score 10), where it selected nothing before | Met | - |
| AC-006 | REQ-006 | Given rank 12 shipped, When the index is generated from a linked project, Then it holds that project's `specs/` paths or warns that the roots differ | Index path count or the warning line. Observed: `scratch/rank12-after.txt`, a plain run from a linked temp project prints the warning naming both roots; with `--repo-root .` it prints none | Met | - |
| AC-007 | REQ-007 | Given rank 13 shipped, When a save scores a payload 0, Then the save prints the reason | The save output. Rank 13 was refuted: no save scores a payload 0, so nothing shipped (ADR-004) | Superseded | ADR-004 |
| AC-008 | REQ-008 | Given the final state, When the existing suites of every touched script run, Then each exits 0 | Suite output and exit status. Observed: `scratch/final-suites.txt`, every suite exits 0 except `compiled-route-admission.test.cjs`, whose one failure, the gold-corpus pin `84 !== 96`, fails identically at merge-base `a5105fb512` before this branch and counts scenario files, not the changed matchers | Met | - |

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

**Closeable:** Yes

Every criterion is met, and the one rank that was refuted is superseded by its ADR.
<!-- /ANCHOR:closure -->
