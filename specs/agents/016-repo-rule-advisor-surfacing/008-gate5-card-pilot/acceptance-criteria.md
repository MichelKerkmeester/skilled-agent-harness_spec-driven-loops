---
title: "Acceptance Criteria: Gate 5 card pilot"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot"
    last_updated_at: "2026-10-05T09:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked AC-002, AC-004 and AC-006 met from the scored pilot and the decision in 6ffe5e5514"
    next_safe_action: "Waive AC-003 by ADR or leave it Unmet, then adopt cards after the 006 window"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Gate 5 card pilot

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot
**Level:** 2
**Status:** In Progress (decided, awaiting adoption)
**Date:** 2026-10-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a rule edited without regenerating its card, When the checker runs, Then check 11 fails naming the card | `test_build_rule_cards.py`, 4 passed on 2026-10-04, including the drift test asserting `cards/alpha.md: drifted from its rule` | Met | - |
| AC-002 | REQ-002 | Given the first scored run, When `git log` is read, Then `preregistration.md` was committed earlier | `git log`: `preregistration.md` committed in `3990bc9fa5` at 2026-10-04 23:58:14, and the earliest scored transcript is `rollout-2026-10-04T23-58-29` | Met | - |
| AC-003 | REQ-003 | Given the scored runs, When each arm's long replies are counted, Then each meets the pre-registered size | `results/final-scores.txt`: 162 cards and 156 full runs, 132 and 138 long replies, against 180 runs per arm per executor. Deviation 3 cut the schedule, and no ADR waives the shortfall | Unmet | - |
| AC-004 | REQ-004 | Given the analysis, When the decision rule is applied, Then the outcome and its numbers are recorded | `results/decision.md` and `implementation-summary.md`: rule 1, adopt cards. Primary -4.0 points (-15.5 to +7.6), Gate 5 miss +2.2 (-3.3 to +7.9), bytes 42,064 against 59,620, committed in `6ffe5e5514` | Met | - |
| AC-005 | REQ-005 | Given the post-003 `AGENTS.md`, When the five reply-rule cards are added, Then arm C runs only at or under 32,768 bytes | `wc -c AGENTS.md` 26,778 B plus 7,677 B of generated reply-rule cards is 34,455 B, so arm C is dropped, recorded in `experiment/arms.json` | Met | - |
| AC-006 | REQ-006 | Given the decision, When the tree is inspected, Then no rejected arm's artifact remains | Cards won, so the rejected arm is full, which is the current repository. Arm C was dropped before anything was built. `ls .skilled/repo-rules/cards` finds no directory and `git status --short` was empty on 2026-10-05 | Met | - |

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

Not closed. The pilot is decided for cards, but AC-003 is Unmet because the schedule was cut short, and live adoption waits on the 006 window and on checks 2 and 10 accepting card links.
<!-- /ANCHOR:closure -->
