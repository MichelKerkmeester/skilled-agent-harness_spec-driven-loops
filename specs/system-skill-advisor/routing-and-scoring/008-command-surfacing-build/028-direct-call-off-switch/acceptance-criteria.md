---
title: "Acceptance Criteria: Phase 28: direct-call-off-switch"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "direct call off switch acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/028-direct-call-off-switch"
    last_updated_at: "2026-11-14T22:11:48Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-028-direct-call-off-switch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 28: direct-call-off-switch

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 028-direct-call-off-switch
**Level:** [2/3/3+]
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a fake warm daemon that answers whatever the switch says, When the CLI client runs `advisor_recommend` under each switch name set to `1`, Then it prints the empty envelope that names the switch, sends the daemon no request, and with no daemon at all starts no launcher | The flagged cases of T005 failed before and passed after, and the no-daemon case of T005 passes | Unmet | - |
| AC-002 | REQ-002 | Given no switch, When the client runs against the warm daemon or a fresh socket folder, Then it prints the rows it printed before | The control case of T005 passes, and the `diff` of the `on` lines in T012 prints nothing | Unmet | - |
| AC-003 | REQ-003 | Given the fixed tree, When the switch list and the two callers are searched, Then the list is defined once in `lib/advisor-disabled.ts`, both callers use `disabledRecommendOutput` and the handler's two disabled cases pass with the same count as before | The `rg` checks of T004 and T005, and the two `VX tests/handlers/advisor-recommend.vitest.ts` runs of T004 | Unmet | - |
| AC-004 | REQ-004 | Given the fixed tree, When the floors, the eval and every gate run, Then each floor and eval line equals its before line and every gate passes | `cmp` of the before and after files in T011 prints nothing, and `after.txt` of T010 | Unmet | - |
| AC-005 | REQ-005 | Given the fixed and rebuilt tree and a warm workspace daemon, When the reproduction runs, Then each of its five `off` lines, warm and fresh, flag first and plain first, and the stdin form, prints `disabledCount=1` and the abstain reason | The two `rg -c` checks of T012 print 5 | Unmet | - |
| AC-006 | REQ-006 | Given the fixed client, When its runtime import closure is read, Then it holds no native package and no import from `handlers/` | The closure line and the `rg` of T005, and `closure-after.txt` of T012 | Unmet | - |
| AC-007 | REQ-007 | Given the three documents, When each is searched for its new sentence, Then each states the shipped behaviour, and the lines `plan.md` lists as unchanged still read as they did | The `rg` checks of T007 to T009, and `playbook-after.txt` of T012 | Unmet | - |
| AC-008 | REQ-008 | Given the `SYSTEM_` switch exported in the shell, When the dual-client suite runs, Then it reports 0 failed | The first run of T006 failed and the second passed | Unmet | - |
| AC-009 | REQ-009 | Given the phase diff, When added comment and doc lines are searched and the row files, the baseline, `AGENTS.md`, the package files and the touched paths are checked, Then nothing is found and nothing outside `FILES` and phase 026's own paths changed | The checks of T013 and the commit listing of T014 | Unmet | - |
| AC-010 | REQ-010 | Given the fix commit, When one Opus reviewer reads its diff, Then no P0 or P1 stays open | `scratch/review/report.txt` and the record on T015 | Unmet | - |

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

The phase is planned and no criterion has evidence yet.
<!-- /ANCHOR:closure -->
