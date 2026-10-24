---
title: "Acceptance Criteria: Phase 26: goal-rebind-shared-core-and-opencode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal rebind shared core opencode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/026-goal-rebind-shared-core-and-opencode"
    last_updated_at: "2026-10-25T01:30:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Closed all five criteria with observed evidence"
    next_safe_action: "Phase 27 binds Claude and Codex; the launcher exports HERMES_SPEC_FOLDER for Hermes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-26-goal-rebind-shared-core-and-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 26: goal-rebind-shared-core-and-opencode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/026-goal-rebind-shared-core-and-opencode
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a receiver with the packet variable and no record, When its first turn runs, Then it is bound to that packet on each of the five runtimes | One test per runtime, failing against the code before the phase. Observed: Pi `session_start` and first `input` tests, Devin and Cursor first-turn tests, 9 core tests and 9 OpenCode `session.created` tests all pass now and 23 of the 28 new tests fail on a `git archive HEAD` copy. Hermes carries no new test or code by the probe D verdict: its plugin already binds `HERMES_SPEC_FOLDER` to a session without a goal (existing `test_goal_section_binds_the_environment_packet_before_its_first_render`, 61 of 62 in that suite before and after). The launcher does not yet export that variable to a Hermes receiver, so a real hop to Hermes does not bind until that follow-up lands | Met | - |
| AC-002 | REQ-002 | Given a receiver with an active, paused or completed record, When its first turn runs, Then the record is unchanged | Core test over the three states. Observed: `an active or paused goal of the session is kept byte for byte` and `a goal that was completed or cleared in this session is not replaced` (core), plus the same on Pi, Cursor and OpenCode, with the record bytes compared before and after; an unparseable record also stays untouched. A completed or cleared goal leaves no record, so the core refuses on its archive entry | Met | - |
| AC-003 | REQ-003 | Given a receiver with no variable, When its first turn runs, Then nothing is bound | The existing suites pass plus one test with the variable unset. Observed: `nothing is bound without the packet variable, with it empty, or with the switch off` (core) and the matching Pi, Devin, Cursor and OpenCode cases; hooks gate 178 of 178 and plugins 549 of 549 | Met | - |
| AC-004 | REQ-004 | Given the guard test and the goal suites, When run, Then they pass with the baseline totals | Gate output against the baseline. Observed: hooks gate 159 of 159 before, 178 of 178 after; plugins folder 540 of 540 before, 549 of 549 after; exit 0 each, also with `SESSION_RELAUNCH_GOAL_PACKET` set to a real packet; the no-budget-stop guard (`a recorded token budget never ends or silences a goal that keeps running`) is in the core suite of the hooks gate and passes | Met | - |
| AC-005 | REQ-005 | Given the changed docs, When read, Then they state when a hop binds and when it does not | `rg -n "hop"` over the plugin doc and the hook README. Observed: the hook README has a Hand-over bind section and two configuration rows, the plugin doc has a behavior bullet and two variable rows, and `validate_document.py` reports 0 issues on the README and a pre-existing type-fallback warning on the plugin doc | Met | - |

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

**Closeable:** Yes

All five rows are Met. The caveat on AC-001 stands: Hermes binds through code that was already there, and a hop to a Hermes receiver binds only once the launcher exports the packet as `HERMES_SPEC_FOLDER`. That export is a recorded follow-up outside this phase's file list, and the live proof on each runtime belongs to phase 28.
<!-- /ANCHOR:closure -->
