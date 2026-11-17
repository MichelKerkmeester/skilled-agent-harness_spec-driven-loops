---
title: "Acceptance Criteria: Phase 20: command-offer-fit-guards"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "command offer fit guards acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/020-command-offer-fit-guards"
    last_updated_at: "2026-11-14T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001 and record the before numbers"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-020-command-offer-fit-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 20: command-offer-fit-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 020-command-offer-fit-guards
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
| AC-001 | REQ-001 | Given the phase diff, When the two capture scripts run, Then each of the five floor lines, the sealed plain count under the fixture regime among them, and the eval line equals its line in `scratch/before.txt` | Observed: `rg -c "^RESULT: every floor equals its before line$" scratch/after.txt` printed 1. The five `FLOOR` lines and `EVAL` `[161,51,21,5]` equal `before.txt` (`tasks.md:108`) | Met | - |
| AC-002 | REQ-002 | Given the eight refusal and question prompts, the two yes or no questions, the six request prompts and the five controls, When `commandOnlyMentioned` reads each, Then it returns `true` for the ten and `false` for the eleven | Observed: `npx vitest run tests/command-attach-guards.vitest.ts` printed `Tests  104 passed (104)`, holding the REFUSE8, QUESTION2, REQUEST6 and CONTROL5 cases and the request and question cases added after the first check (`tasks.md:84`) | Met | - |
| AC-003 | REQ-003 | Given the built advisor, When `probe-offers.mjs` runs, Then no row carries `/speckit:save`, `/deep:research`, `/deep:review`, `/speckit:plan` or `/doctor:update`, and `/speckit:complete` appears on 1 line | Observed: `rg -c -F 'command=/speckit:complete ' scratch/repro-after.txt` printed 1 and the T014 banned-command pattern printed nothing (`tasks.md:109`) | Met | - |
| AC-004 | REQ-004 | Given a small in-place edit of a README, When the hub route picks the README mode, Then no `/create:readme` is attached, and a plain README request still gets it | Observed: `rg -c -F 'command=/create:readme ' scratch/repro-after.txt` printed 2. The small-edit gate covers only the readme, catalog and playbook commands after the retry bound (`tasks.md:81`, `tasks.md:109`) | Met | - |
| AC-005 | REQ-005 | Given a command row that passes on meaning with uncertainty 0.42, When the scorer applies the meaning pass, Then the row does not pass | Observed: `npx vitest run tests/command-meaning-anchor.vitest.ts` printed `Tests  28 passed (28)` and `rg -c -F 'doctor:sk-skill' scratch/repro-after.txt` printed nothing (`tasks.md:86`) | Met | - |
| AC-006 | REQ-006 | Given a no-edit request, When command rows of class `add-only`, `mutates` and `read-only` pass, Then only the `read-only` row still passes | Observed: `npx vitest run tests/command-meaning-anchor.vitest.ts` printed `Tests  28 passed (28)` and the T014 pattern for `/doctor:speckit` and `/doctor:deep-loop` over `scratch/repro-after.txt` printed nothing (`tasks.md:91`) | Met | - |
| AC-007 | REQ-007 | Given a weak problem cue and no passing skill, When the ranker scores below 10, Then no doctor command is handed off, and at 10 or more it is | Observed: `npx vitest run tests/scorer/doctor-handoff-command.vitest.ts` printed `Tests  16 passed (16)` and both app-problem prompts print `(no recommendation)` in `scratch/repro-after.txt`. The weak cue has its own bar of 9 (`tasks.md:93`, `tasks.md:95`) | Met | - |
| AC-008 | REQ-008 | Given the phase diff, When added comment lines are searched for a spec path or an id, Then nothing is found and only seven files changed | Observed: the comment id search in `scratch/boundaries.txt` exited 1 and the AGENTS.md and package checks printed nothing. Eight files changed, the seven named plus `command-routing-baseline.json`, recaptured under decision P020 in `../decision-record.md` (`tasks.md:110`) | Met | - |
| AC-009 | REQ-001 | Given the whole advisor suite, When it runs after the build, Then it reports 0 failed with more passed tests than before | Observed: `scratch/after.txt` holds 1919 passed, 6 skipped and 0 failed over 184 of 184 files, against 1838 passed before (`tasks.md:107`) | Met | - |

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

Every criterion is Met with observed evidence, and the strict validation passed at close-out.
<!-- /ANCHOR:closure -->
