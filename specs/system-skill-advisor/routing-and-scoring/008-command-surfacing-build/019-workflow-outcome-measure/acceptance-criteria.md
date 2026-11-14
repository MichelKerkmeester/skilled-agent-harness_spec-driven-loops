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
| AC-001 | REQ-001 | Given the six value cases T005 adds, When `VX` runs after T010, Then each returns the value its case names: `command` twice, `skill`, `improvised`, `none` and `noOwner` | `VX` reports 0 failed for the `workflowPath` block. `rg -c '^export function workflowPath' $SC` prints 1 | Unmet | - |
| AC-002 | REQ-002 | Given the eight edge cases T006 adds, When `VX` runs after T010, Then a load after the first write is `improvised`, a nested mode `SKILL.md`, a `ROUTER.md`, a skill-tool load and a `compiled-route.cjs --hub` call for the owner are `skill`, a hub call or `SKILL.md` for another skill is `improvised` and a load with no write event counts | `VX` reports 0 failed and the eight case names T006 lists appear in its output | Unmet | - |
| AC-003 | REQ-003 | Given the owner table and the corpus, When T004 compares the owners and T016 and T017 score the arms, Then every `cmd-` row has an owner and every `mns-chat` row is `noOwner` | T004 records 15 commands with one non-null `skillId` each, equal to `ownerSkillId` in `CA`. In both scratch files every share has an `M` of at most 16 | Unmet | - |
| AC-004 | REQ-004 | Given a built Claude transcript, When `--summary` runs with and without `--json`, Then the arm block holds `workflow` with its seven keys and the text prints one `workflow:` line ending in the share | The two T007 summary cases pass in `VX` | Unmet | - |
| AC-005 | REQ-005 | Given the T001 captures, When the new scorer scores the same logs, Then every old field keeps its name and value | Both T018 `diff` runs over `OLDF` print nothing and exit 0 | Unmet | - |
| AC-006 | REQ-006 | Given the start commit, When the new cases run before and after the code, Then each fails first and the whole gate passes after | The T005 to T007 verify lines show 6, 14 and 16 failed at `BASE`. T015 shows `VX` and `VALL` at 0 failed and `TC` and `QG` exiting 0 | Unmet | - |
| AC-007 | REQ-007 | Given the finished phase, When T019 checks the diff against `BASE`, Then no reader, corpus row, runner, bridge table, `lib` file or `package.json` changed and no model session ran | Every T019 check prints what it names, and CHK-030 and CHK-031 in `tasks.md` are checked with evidence | Unmet | - |
| AC-008 | REQ-008 | Given T003's devin reading, When the rule applies, Then every devin run sits in `workflow.unscored` and its text line names why, and when it does not apply nothing changed | T003's two lines and decision are in `implementation-summary.md`. When the rule applies, the T016 and T017 `jq` checks print `true`. Otherwise `rg -c 'WORKFLOW_UNREADABLE_RUNTIMES' $SC` prints nothing | Unmet | - |
| AC-009 | REQ-009 | Given the two scoring runs, When `SUMOK` and `WFSHOW` read the scratch files, Then each arm adds up and prints a share | `SUMOK` prints `true` over `scratch/workflow-pre.json` and `scratch/workflow-final.json`. `WFSHOW` prints six `pre` lines and five `post` lines | Unmet | - |
| AC-010 | REQ-010 | Given the scored arms, When T020 to T022 write the records, Then the same per-runtime shares appear in three places | The T020, T021 and T022 verify lines print what they name, and the shares match `WFSHOW` | Unmet | - |
| AC-011 | REQ-011 | Given the routing-accuracy README, When its scorer row is read, Then it names `workflow` and says the share counts a load, not each step | The three T014 `rg` checks print 1, 1 and nothing | Unmet | - |
| AC-012 | REQ-012 | Given the closed phase, When strict validation runs on this folder, Then it passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED` (T023) | Unmet | - |

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

The phase is planned and no task has run, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
