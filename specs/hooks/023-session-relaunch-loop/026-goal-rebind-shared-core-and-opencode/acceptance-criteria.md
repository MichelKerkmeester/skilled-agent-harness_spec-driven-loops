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
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Record the baselines, then read the probe D verdict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-26-goal-rebind-shared-core-and-opencode"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Draft
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a receiver with the packet variable and no record, When its first turn runs, Then it is bound to that packet on each of the five runtimes | One test per runtime, failing against the code before the phase | Unmet | - |
| AC-002 | REQ-002 | Given a receiver with an active, paused or completed record, When its first turn runs, Then the record is unchanged | Core test over the three states | Unmet | - |
| AC-003 | REQ-003 | Given a receiver with no variable, When its first turn runs, Then nothing is bound | The existing suites pass plus one test with the variable unset | Unmet | - |
| AC-004 | REQ-004 | Given the guard test and the goal suites, When run, Then they pass with the baseline totals | Gate output against the baseline | Unmet | - |
| AC-005 | REQ-005 | Given the changed docs, When read, Then they state when a hop binds and when it does not | `rg -n "hop"` over the plugin doc and the hook README | Unmet | - |

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

**Closeable:** No

Every row is Unmet because the phase is planned and nothing in it has been built or run. The packet closes when all five runtimes pass their tests and each new test fails against the earlier code.
<!-- /ANCHOR:closure -->
