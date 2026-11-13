---
title: "Acceptance Criteria: Phase 5: opencode-continuation-hop"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "opencode continuation hop acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-opencode-continuation-hop"
    last_updated_at: "2026-11-12T22:42:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-opencode-continuation-hop"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: opencode-continuation-hop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/005-opencode-continuation-hop
**Level:** 2
**Status:** Draft
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given autonomy active, an active goal and a pending relaunch record for the session, When `session.idle` reaches `maybeContinueGoal`, Then the decision is `suppressed` and `promptAsync` is not called | `node --test --test-name-pattern='pending relaunch record' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` passes `a pending relaunch record suppresses the goal continuation` | Unmet | - |
| AC-002 | REQ-002 | Given a first top-level `session.created` event with `SESSION_RELAUNCH_GOAL_PACKET` set, When the one bind attempt finishes, Then the packet variable is absent from `process.env` and the goal is bound | `node --test --test-name-pattern='packet variable is deleted' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` passes `the hand-over packet variable is deleted after the one bind attempt` | Unmet | - |
| AC-003 | REQ-003 | Given the plugin change, When the lifecycle, hand-over and relaunch suites run, Then they exit 0 and a continuation with no record still fires | `node --test .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs .opencode/plugins/tests/opencode-goal-handover.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` exits 0 | Unmet | - |

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

AC-001 is Unmet and blocks closure. The remaining rows are Unmet as well.
<!-- /ANCHOR:closure -->
