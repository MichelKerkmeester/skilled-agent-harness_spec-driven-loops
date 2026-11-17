---
title: "Acceptance Criteria: Phase 19: workflow-outcome-measure"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "workflow outcome measure acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/019-workflow-outcome-measure"
    last_updated_at: "2026-11-13T23:30:10Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-workflow-outcome-measure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 19: workflow-outcome-measure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 019-workflow-outcome-measure
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The short names are the ones `tasks.md` defines in its Task Notation.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the six value cases T005 adds, When `VX` runs after T010, Then each returns the value its case names: `command` twice, `skill`, `improvised`, `none` and `noOwner` | Observed: T010 then T015: `VX` printed `Tests  82 passed (82)` on the final code, rerun 2026-11-14 with the same line. `rg -c '^export function workflowPath' $SC` prints 1 (`tasks.md:77`) | Met | - |
| AC-002 | REQ-002 | Given the eight edge cases T006 adds, When `VX` runs after T010, Then a load after the first write is `improvised`, a nested mode `SKILL.md`, a `ROUTER.md`, a skill-tool load and a `compiled-route.cjs --hub` call for the owner are `skill`, a hub call or `SKILL.md` for another skill is `improvised` and a load with no write event counts | Observed: T006 printed 14 failed at `BASE`. After T010, T024 and T026 `VX` printed `Tests  82 passed (82)` with the eight T006 cases among them (`tasks.md:70`) | Met | - |
| AC-003 | REQ-003 | Given the owner table and the corpus, When T004 compares the owners and T016 and T017 score the arms, Then every `cmd-` row has an owner and every `mns-chat` row is `noOwner` | Observed: T004 recorded 15 commands with one non-null `skillId` each, ten equal to the command rows of `CA` and five to its tracked table. Every share denominator in both scratch files is at most 16 (largest 15 of 15 and 12 of 14) (`tasks.md:58`) | Met | - |
| AC-004 | REQ-004 | Given a built Claude transcript, When `--summary` runs with and without `--json`, Then the arm block holds `workflow` with its seven keys and the text prints one `workflow:` line ending in the share | Observed: The two T007 summary cases failed at `BASE` (16 failed) and pass in `VX` (82 passed). T012 printed five `    workflow: ` lines over the final arm (`tasks.md:71`) | Met | - |
| AC-005 | REQ-005 | Given the T001 captures, When the new scorer scores the same logs, Then every old field keeps its name and value | Observed: Both T018 `diff` runs over `OLDF` printed nothing and exited 0, and again after T025 (`tasks.md:96`) | Met | - |
| AC-006 | REQ-006 | Given the start commit, When the new cases run before and after the code, Then each fails first and the whole gate passes after | Observed: T005, T006 and T007 printed 6, 14 and 16 failed at `BASE`. T015 on the final code: `VX` 82 passed, `VALL` 184 files 1838 passed 0 failed, `TC` exit 0, `QG` exit 0 with p0 0, p1 0 and p2 0 (`tasks.md:93`) | Met | - |
| AC-007 | REQ-007 | Given the finished phase, When T019 checks the diff against `BASE`, Then no reader, corpus row, runner, bridge table, `lib` file or `package.json` changed and no model session ran | Observed: T019: the only other changed paths since `BASE` are the advisor changelog and the trigger index with its fixtures, both outside this phase's code. The protected `diff --quiet` exited 0, the package `--stat` printed nothing, no model session ran (`tasks.md:97`) | Met | - |
| AC-008 | REQ-008 | Given T003's devin reading, When the rule applies, Then every devin run sits in `workflow.unscored` and its text line names why, and when it does not apply nothing changed | Observed: T003 printed devin 532 of 532 and 356 of 356 tool events with a path or command, so the rule was not needed. `rg -c 'WORKFLOW_UNREADABLE_RUNTIMES' $SC` printed nothing and exited 1 (T013) (`tasks.md:57`) | Met | - |
| AC-009 | REQ-009 | Given the two scoring runs, When `SUMOK` and `WFSHOW` read the scratch files, Then each arm adds up and prints a share | Observed: Rerun 2026-11-14: `SUMOK` printed `true` over both scratch files, `WFSHOW` printed six `pre` lines and five `post` lines (`tasks.md:94`) | Met | - |
| AC-010 | REQ-010 | Given the scored arms, When T020 to T022 write the records, Then the same per-runtime shares appear in three places | Observed: T020 `rg -c` printed 6, T021 checks printed nothing, 1 and 1, T022 row added (its `rg -c` prints 2 with the older Planned row, a recorded deviation). An Opus verifier compared the three records with `WFSHOW` and found them equal (CHK-042) (`tasks.md:100`) | Met | - |
| AC-011 | REQ-011 | Given the routing-accuracy README, When its scorer row is read, Then it names `workflow` and says the share counts a load, not each step | Observed: The three T014 `rg` checks printed 1, 1 and nothing, checked by an Opus verifier (`tasks.md:84`) | Met | - |
| AC-012 | REQ-012 | Given the closed phase, When strict validation runs on this folder, Then it passes | Observed: `validate.sh $PH --strict` printed `RESULT: PASSED` at close-out on 2026-11-14 (T023) (`tasks.md:101`) | Met | - |
| AC-013 | REQ-013 | Given a run that read a file and ran a shell step on an owned row and wrote nothing, When `--summary` runs with and without `--json`, Then the block holds `none: 1`, `noneActed: 1`, `share: '0 of 0'` and `loadRate: '0 of 1'` and the text line holds `none 1, none acted 1,` and `load rate 0 of 1, share 0 of 0` | Observed: T025: before the code edit `VX` printed `Tests  1 failed` with 79 passed of 80 on the missing keys, after it 80 passed. The case name is in `TS` once and passes in the final `VX` run of 82 (`tasks.md:82`) | Met | - |

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

Every criterion is Met with observed evidence, and the strict validation of AC-012 passed at close-out.
<!-- /ANCHOR:closure -->
