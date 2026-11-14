---
title: "Acceptance Criteria: Phase 27: review-pass-four-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review pass four remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation"
    last_updated_at: "2026-11-14T16:35:20Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 once phase 024 is Complete and before any phase 026 task"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-027-review-pass-four-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 27: review-pass-four-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 027-review-pass-four-remediation
**Level:** 2
**Status:** Planned
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three or-list refusals and their controls, When the mention reader and the CLI read them, Then every refused command reads as a mention, both commands of `use A or B` and the first of `use A, not B` read as requests, and the CLI prints no row that carries a refused command | The or-list cases of T004 failed before and passed after, and the first `rg` of T020 prints nothing | Unmet | - |
| AC-002 | REQ-002 | Given a replay that names a partner-side command and one that names none, When the backfill and the live writer build their lines, Then each line carries `offeredAs` as `partner` or `null` | The cases of T006 and T007 failed before and passed after, and `BACKFILL` in T020 prints `HAS offeredAs` | Unmet | - |
| AC-003 | REQ-003 | Given a shell `cat`, an `rg`, an in-place `sed` and a heredoc line over a command document, each followed by a write, and a shell read of the review document on a row with no loop command, When the scorer judges them, Then only the `cat` starts the command and the loop run is counted in `loops`, `loopsWithoutInit` and `unsafe` | The cases of T009 failed before and passed after, and `SHELLP` in T020 prints `"started":true` | Unmet | - |
| AC-004 | REQ-004 | Given the fixed tree, When the floors, the fit counts, the scorer eval and every suite run, Then each floor line equals its before line and every suite reports 0 failed | `cmp` of the three before and after files in T019 prints nothing, and `after.txt` of T018 | Unmet | - |
| AC-005 | REQ-005 | Given every stored arm, When it is scored before and after the fix, Then only start counts move, each moved run names its row, row type, policy and rule, and the parent goal log restates each moved start figure in rows that state the limits | `rescore-delta.txt` of T021 holds 23 start and 11 workflow lines, both `cmp` pairs exit 0, and the `rg` over `../goal.md` prints the new rows | Unmet | - |
| AC-006 | REQ-006 | Given `Is the /doctor:update command safe?` and `the next step is the /speckit:implement command`, When the mention reader reads them, Then the first reads as a question and the second as a request, and the CLI prints no `/doctor:update` row for the first | The rows of T005 failed before and passed after, and the second `rg` of T020 prints nothing | Unmet | - |
| AC-007 | REQ-007 | Given a link inside the Codex store that points at a rollout, When `loadSession` reads it, Then the reader opens the resolved path and never the link, and the reader and history lookup tests pass | The case of T010 failed before and passed after, `RT` and `HT` pass in T018, and `RACE` prints `APPROVED-FILE` in T020 | Unmet | - |
| AC-008 | REQ-008 | Given heredocs whose end words are `END-SCRIPT` and `END.JS`, When `workflowPath` reads them, Then each returns `none` | The rows of T008 failed before and passed after, and every `heredoc` line of `SHELLP` in T020 ends in `improvised` | Unmet | - |
| AC-009 | REQ-009 | Given a made-up capture that publishes three holdout ids, When `publishedHoldoutIds` reads it, Then it returns the three ids, and the guard reads both the committed baseline and the live capture | The case of T011 failed before and passed after, and the slice test passes in T018 | Unmet | - |
| AC-010 | REQ-010 | Given the five documents, When each is searched for its new sentence, Then each names the behaviour the code has | The `rg` checks of T012 to T017 | Unmet | - |
| AC-011 | REQ-011 | Given the fix commit, When the confirming round runs and every P0 and P1 is adjudicated, Then each lineage ends at or below 0.10 with 0 adjudicated P1, or the last round closes with a written judgment, and `../review/review-report.md` holds counts from pass-four lineages only | `review-rounds.txt` and the goal log row of T025, and the report checks of T026 | Unmet | - |
| AC-012 | REQ-012 | Given the phase diff, When added comment lines are searched for a spec path or an id and the row files, the baseline, `AGENTS.md` and the package files are checked, Then nothing is found and nothing outside `FILES` changed | The checks of T022 | Unmet | - |

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

The phase is planned and not built, so every row is unmet.
<!-- /ANCHOR:closure -->
