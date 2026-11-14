---
title: "Acceptance Criteria: Phase 26: untuned-behaviour-arm"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "untuned behaviour arm acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/026-untuned-behaviour-arm"
    last_updated_at: "2026-11-14T15:37:14Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 once phase 024 is Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-026-untuned-behaviour-arm"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 26: untuned-behaviour-arm

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 026-untuned-behaviour-arm
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
| AC-001 | REQ-001 | Given the phase's evidence, summaries and task outputs, When they are searched for a prompt field, Then nothing is found, and every read of the three row files went through `jq 'del(.prompt)'` apart from the blind author | The prompt search in T050 prints nothing | Unmet | - |
| AC-002 | REQ-002 | Given the parent goal log and the freeze commit, When the first session starts and the phase closes, Then the `Arm target` and `Fresh rows frozen` rows precede it and the fresh file is unchanged | `rg` in T037 prints 2, and the `numstat` in T050 prints nothing | Unmet | - |
| AC-003 | REQ-003 | Given the six arenas and the run logs, When each arena and each log is read, Then each arena prints the arena commit, no remote and an empty status, and the logs hold at most 900 lines | The arena checks in T039 and the line counts in T042 and T043 | Unmet | - |
| AC-004 | REQ-004 | Given the evidence file and the parent goal log, When each number in the verdict is traced, Then it is a line the scorer or the capture printed, and the review and the step reader rows say judgment | `arm-evidence.txt` from T044 and T045, and the rows written in T046 and T048 | Unmet | - |
| AC-005 | REQ-005 | Given the first task, When `measure-brief-cost.mjs` runs once, Then the parent goal log holds a `Live brief cost` row with its numbers or its refusal line | `rg` in T001 prints 1 | Unmet | - |
| AC-006 | REQ-006 | Given inherited disable names and master switches in the shell, When `childEnv` builds the env for `off`, `on` and `pre`, Then `off` holds only the two `SYSTEM_` names set to `1`, `on` holds none and `pre` is unchanged | The `childEnv` case of T005 failed before and passed after, and the probe in T032 prints no `Advisor:` line under the switch | Unmet | - |
| AC-007 | REQ-007 | Given made-up row files and options, When the runner reads the fresh set or starts a fresh row, Then it refuses each named fault with exit 2 and its code, and a run line records `run` | The cases of T007, T009, T010 and T013 failed before and passed after, and `--list fresh` in T036 prints 36 lines | Unmet | - |
| AC-008 | REQ-008 | Given a temp source repository, When the builder makes an arena, Then the arena's `CLAUDE.md` reads `@AGENTS.md` and its git status prints nothing, and a source `CLAUDE.md` is kept | The arena builder cases of T014, and `cat CLAUDE.md` in each arena in T039 | Unmet | - |
| AC-009 | REQ-009 | Given made-up logs and the stored one-run logs, When the scorer summarizes them, Then the fresh label, the run key, the delivery check, count pairing, `pooled`, `signTestP` and the start fields behave as the requirement states, and the stored summaries are unchanged | `VALL` reports 0 failed and both `cmp` in T031 print nothing | Unmet | - |
| AC-010 | REQ-010 | Given the arm summary, When the evidence file is counted by prefix, Then it holds 12 `followed`, at most 6 `paired`, 1 `pooled`, 12 `starts`, 12 `delivery`, 2 `floor` and 6 `limit:` lines, and the goal log holds one `Arm verdict` row | The counts in T044 and T045 and the `rg` in T046 | Unmet | - |
| AC-011 | REQ-011 | Given the picked sessions, When the read-only reader judges three steps per session, Then the report holds one block per picked session and the goal log holds one `Step reader` row | The checks in T047 and T048 | Unmet | - |
| AC-012 | REQ-012 | Given the `starts` lines, When the B-5 rule is applied, Then the goal log holds one `B-5 trigger` row that reads `Fired` or `Declined` as the rule gives | The `rg` and the rule check in T049 | Unmet | - |
| AC-013 | REQ-013 | Given the harness diff, When added comment lines are searched for a spec path or an id, Then nothing is found and only the six harness files changed outside `specs/` | The comment search and the stat in T050 | Unmet | - |

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
