---
title: "Acceptance Criteria: Phase 7: goal-handover-docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal handover docs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/007-goal-handover-docs"
    last_updated_at: "2026-11-12T22:42:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-goal-handover-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: goal-handover-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 007-goal-handover-docs
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the concern is on and the Claude enable switch holds `0`, When a startup payload carries the wrapper's claim seed, Then the claim is delivered and the README says `even while the Claude enable switch is off` while naming the master switch, the concern kill switch, `SESSION_RELAUNCH_GOAL=0`, `AI_SESSION_CHILD=1` and a loop-shell runtime as the cases that stay silent. Test `compact-pointer delivers the start claim with the Claude enable switch off` in `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` asserts the delivery, and test `compact-pointer adds no start claim for a dispatched child, a switched-off goal or a disabled hook` asserts the guards | `rg -n 'only while the switch is on' .skilled/hooks/session-relaunch/README.md` prints no line and `env -u AI_SESSION_CHILD node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 Observed 2026-11-13: the README states that the claim is delivered with the Claude enable switch off, in the section on the goal in a Claude receiver. | Met | - |
| AC-002 | REQ-002 | Given a copy of `hook-flags.env.example`, When the operator wants to stop the goal carry-over, Then the file holds one commented `SESSION_RELAUNCH_GOAL=0` row in its own block, the block says the switch is on by default, and the row cannot be read as a disable flag. Test `goalSwitchOn is on unless the operator turns it off` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` asserts that unset, `1`, `true`, `yes` and `on` are on and `0`, `false`, `no` and `off` are off | `rg -n 'SESSION_RELAUNCH_GOAL=0' .skilled/hooks/hook-flags.env.example` prints one line and `env -u AI_SESSION_CHILD node --test --test-name-pattern 'goalSwitchOn' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 Observed 2026-11-13: `.skilled/hooks/hook-flags.env.example` holds one commented `SESSION_RELAUNCH_GOAL=0` row, shown in `scratch/green.txt`. | Met | - |
| AC-003 | REQ-003 | Given a Claude sender under an unmet native goal, When the goal continuation runs during the arm, Then README §3 records the race, says no `UserPromptSubmit` fires, names the 3 s idle wait and the 30 s timeout, states the condition that loses the hop, and warns that a tool call longer than 3 s can be killed mid-run and is not in the note. Test `killer times out on an active transcript, unarms and releases its lock` in `.skilled/hooks/session-relaunch/tests/killer.test.cjs` asserts the timeout path | `rg -n '^### Known Race: A Claude Goal Continuation During The Arm$' .skilled/hooks/session-relaunch/README.md` prints one line and `env -u AI_SESSION_CHILD node --test --test-name-pattern 'killer times out on an active transcript' .skilled/hooks/session-relaunch/tests/killer.test.cjs` exits 0 Observed 2026-11-13: README section 3 holds the paragraph on a Claude sender under an unmet native goal, with the missing `UserPromptSubmit` and the 30 second limit. | Met | - |
| AC-004 | REQ-004 | Given a phase-child packet, When its goal command reports the budget, Then it prints `packet_budget=unknown`, and README carries a paragraph that begins `A phase child` and says Claude refuses that goal while Pi and OpenCode bind the packet. Test `a phase child goal carries no budget, matching the validator` in `.skilled/hooks/goal/lib/goal-slice.test.cjs` asserts the missing budget, and test `refuses a slice whose budget cannot be checked` in `.skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` asserts the Claude refusal | `rg -n '^A phase child' .skilled/hooks/session-relaunch/README.md` prints one line and `env -u AI_SESSION_CHILD node --test .skilled/hooks/goal/lib/goal-slice.test.cjs .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs` exits 0 Observed 2026-11-13: the README holds a paragraph that begins `A phase child`, and `goal.cjs packet` on a phase child prints `packet_budget=unknown`. | Met | - |
| AC-005 | REQ-005 | Given the four guard suites unchanged, When they run after the document edits, Then each exits 0, the claim and guard tests keep their assertions, and no test file changed. Test `compact-pointer delivers the claim at the start of a goal-command receiver` still asserts the seed, the claim command and the resume line, and test `killer signals an idle target and releases its lock` still asserts the 3 s idle path | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/goal-handover.test.cjs .skilled/hooks/session-relaunch/tests/killer.test.cjs .skilled/hooks/goal/lib/goal-slice.test.cjs` exits 0 and `git diff --name-only -- .skilled/hooks/session-relaunch/tests .skilled/hooks/goal` prints no line Observed 2026-11-13: the suites pass in the orchestrator's final run and no test file changed in this phase. | Met | - |

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

All 5 criteria are Met with observed evidence. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0. The evidence is pinned to the working tree of branch `worktrees/358-handover-goal-resume` before its commit.
<!-- /ANCHOR:closure -->
