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
    last_updated_at: "2026-11-14T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "Marked every criterion Met with the evidence observed at close-out"
    next_safe_action: "Coordinator commits the phase close-out, then starts phase 026"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-027-review-pass-four-remediation"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three or-list refusals and their controls, When the mention reader and the CLI read them, Then every refused command reads as a mention, both commands of `use A or B` and the first of `use A, not B` read as requests, and the CLI prints no row that carries a refused command | The or-list cases of T004 failed before and passed after, and the first `rg` of T020 prints nothing. Met. T004 first run 6 failed of 131, then 131 passed (`tasks.md:79`), and T028, T029 and T031 widened the same carry test first (`tasks.md:81`). The three or-list refusals print no command and both requests keep theirs (`scratch/repro-after-3.txt:2`, lines 2 to 6). The first `rg` of T020 printed nothing over `repro-after.txt` and `repro-after-3.txt`, rerun at close-out | Met | - |
| AC-002 | REQ-002 | Given a replay that names a partner-side command and one that names none, When the backfill and the live writer build their lines, Then each line carries `offeredAs` as `partner` or `null` | The cases of T006 and T007 failed before and passed after, and `BACKFILL` in T020 prints `HAS offeredAs`. Met. T006 first run 1 failed of 30, then 30 passed (`tasks.md:87`). T007 first run 2 failed of 15, then 15 passed (`tasks.md:88`). `BACKFILL` prints `HAS offeredAs` (`scratch/repro-after-3.txt:39`) | Met | - |
| AC-003 | REQ-003 | Given a shell `cat`, an `rg`, an in-place `sed` and a heredoc line over a command document, each followed by a write, and a shell read of the review document on a row with no loop command, When the scorer judges them, Then only the `cat` starts the command and the loop run is counted in `loops`, `loopsWithoutInit` and `unsafe` | The cases of T009 failed before and passed after, and `SHELLP` in T020 prints `"started":true`. Met. T009 first run 2 failed of 172 (the `cat` row and the loop case), then 172 passed (`tasks.md:93`). `SHELLP` prints `{"started":true,"unsafe":false,"selfAuto":false}` (`scratch/repro-after-3.txt:34`) | Met | - |
| AC-004 | REQ-004 | Given the fixed tree, When the floors, the fit counts, the scorer eval and every suite run, Then each floor line equals its before line and every suite reports 0 failed | `cmp` of the three before and after files in T019 prints nothing, and `after.txt` of T018. Met. `cmp` of each floor, fit and eval after file with its before file exits 0 for all three gate runs, and `floor-after-3.txt` reads 24 of 44, 0 of 35, 44 of 44, 28 of 45 and 1 of 44 (`scratch/floor-after-3.txt:1`). Every suite reports 0 failed, `VALL` 2065 passed (`scratch/after-3.txt:46`) | Met | - |
| AC-005 | REQ-005 | Given every stored arm, When it is scored before and after the fix, Then only start counts move, each moved run names its row, row type, policy and rule, and the parent goal log restates each moved start figure in rows that state the limits | `rescore-delta.txt` of T021 holds 23 start and 11 workflow lines, both `cmp` pairs exit 0, and the `rg` over `../goal.md` prints the new rows. Met. `rescore-delta.txt` holds 23 start lines and 11 workflow lines (`scratch/rescore-delta.txt:1`, lines 1 to 34) and 24 moved runs, each with its row label and rule T009 (`scratch/rescore-delta.txt:81`). Both `cmp` pairs exit 0 (`tasks.md:128`). `rg -c -F 'no brief reached Codex' ../goal.md` prints 4, and the four restating rows are at `../goal.md:285` to 288 | Met | - |
| AC-006 | REQ-006 | Given `Is the /doctor:update command safe?` and `the next step is the /speckit:implement command`, When the mention reader reads them, Then the first reads as a question and the second as a request, and the CLI prints no `/doctor:update` row for the first | The rows of T005 failed before and passed after, and the second `rg` of T020 prints nothing. Met. T005 first run 1 failed of 133, then 133 passed (`tasks.md:80`). `Is the /doctor:update command safe?` prints no command (`scratch/repro-after-3.txt:7`). The second `rg` of T020 printed nothing, rerun at close-out | Met | - |
| AC-007 | REQ-007 | Given a link inside the Codex store that points at a rollout, When `loadSession` reads it, Then the reader opens the resolved path and never the link, and the reader and history lookup tests pass | The case of T010 failed before and passed after, `RT` and `HT` pass in T018, and `RACE` prints `APPROVED-FILE` in T020. Met. T010 first run failed 1 (the link path was opened), then 96 of 96 (`tasks.md:98`). `RT` pass 96 fail 0 and `HT` 30 passed (`scratch/after-3.txt:24`, lines 24 to 30). `RACE` prints `APPROVED-FILE` (`scratch/repro-after-3.txt:43`) | Met | - |
| AC-008 | REQ-008 | Given heredocs whose end words are `END-SCRIPT` and `END.JS`, When `workflowPath` reads them, Then each returns `none` | The rows of T008 failed before and passed after, and every `heredoc` line of `SHELLP` in T020 ends in `improvised`. Met. T008 first run 2 failed of 167, then 167 passed (`tasks.md:92`). Every `heredoc` line ends in `improvised` (`scratch/repro-after-3.txt:27`, lines 27 to 32) | Met | - |
| AC-009 | REQ-009 | Given a made-up capture that publishes three holdout ids, When `publishedHoldoutIds` reads it, Then it returns the three ids, and the guard reads both the committed baseline and the live capture | The case of T011 failed before and passed after, and the slice test passes in T018. Met. T011 first run 1 failed (`publishedHoldoutIds` is not defined), then 10 of 10 (`tasks.md:102`). The slice test passes 10 of 10 after the build (`scratch/after-3.txt:21`) | Met | - |
| AC-010 | REQ-010 | Given the five documents, When each is searched for its new sentence, Then each names the behaviour the code has | The `rg` checks of T012 to T017. Met. The `rg` checks of T012 to T017 each print 1 (`tasks.md:106`, lines 106 to 117), and those of T030 and T033 hold (`tasks.md:108`). Rerun at close-out: `carries four fields`, `read from the same reads a load is`, `may hold a hyphen or a dot`, `The head keeps its command even then`, `28 cases:`, `parent-named only` and `reports a malformed router row` each print 1, and `three fields` prints nothing | Met | - |
| AC-011 | REQ-011 | Given the fix commit, When the confirming round runs and every P0 and P1 is adjudicated, Then each lineage ends at or below 0.10 with 0 adjudicated P1, or the last round closes with a written judgment, and `../review/review-report.md` holds counts from pass-four lineages only | `review-rounds.txt` and the goal log row of T025, and the report checks of T026. Met. `review-rounds.txt` holds one ratio line per lineage of rounds 4b and 4c and a reproduction line for each P1 (`scratch/review-rounds.txt:5`, lines 1 to 17). The goal log row is at `../goal.md:290`. `../review/review-report.md` counts 0 P0, 5 P1 and 25 P2 open rows from the pass-four lineages only, by two methods, and closes at 0 open P0 and 0 open P1 | Met | - |
| AC-012 | REQ-012 | Given the phase diff, When added comment lines are searched for a spec path or an id and the row files, the baseline, `AGENTS.md` and the package files are checked, Then nothing is found and nothing outside `FILES` changed | The checks of T022. Met. `AGENTS.md`, both row files and the routing baseline equal BASE, no package file changed and no added comment holds an id (`scratch/boundaries.txt:1`, lines 1 to 12). The diff names the 16 `FILES` and `codex.d.mts.map` (`scratch/boundaries.txt:13`). Rerun at close-out against `db14c22bb0` with the same results | Met | - |

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

Every row is met with evidence observed in the phase scratch files and rerun at close-out.
<!-- /ANCHOR:closure -->
