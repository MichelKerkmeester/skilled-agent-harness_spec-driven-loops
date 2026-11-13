---
title: "Acceptance Criteria: Phase 8: review-advisories"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review advisories acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/008-review-advisories"
    last_updated_at: "2026-11-13T05:02:30Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-review-advisories"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: review-advisories

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 008-review-advisories
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a startup payload with `source: "startup"` and no `hook_event_name`, When the Claude start claim is emitted, Then it carries `hookEventName: "SessionStart"`. Test `compact-pointer names the SessionStart event on a start claim with no hook event` in `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` asserts the emitted event name | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'names the SessionStart event on a start claim' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the test failed in `scratch/red-a.txt` with `PostToolUse` and passes in `scratch/green-a.txt` and in the final full run. | Met | - |
| AC-002 | REQ-002 | Given a note whose frontmatter says `status: claimed`, When `recordGoalPacket` is called with a packet, Then it returns `false` and the file bytes are unchanged. Test `recordGoalPacket leaves a note that is not open untouched` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` asserts the return and the bytes | `node --test --test-name-pattern 'recordGoalPacket leaves a note that is not open' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the test failed in `scratch/red-b.txt` because the claimed note was rewritten, and passes in `scratch/green-b.txt` and in the final full run. | Met | - |
| AC-003 | REQ-003 | Given an active Claude goal entry with an empty condition, When `resolveGoalPacketResult` runs, Then the packet is empty and the reason is `the active goal has no text to match a packet by`. Test `an active goal with no text names the empty goal, not a missing packet` in `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` asserts both fields | `node --test --test-name-pattern 'active goal with no text names the empty goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the test failed in `scratch/red-b.txt` with the old reason and passes in `scratch/green-b.txt` and in the final full run. | Met | - |
| AC-004 | REQ-004 | Given a session id and a cwd that each contain a line break, When `handoffText` prints the note template, Then exactly one `session_id:` line and one `cwd:` line appear and no frontmatter line starts with text taken from after the break. Test `handoff text strips control characters from the session id and the cwd` in `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` asserts both counts and the absent injected line | `node --test --test-name-pattern 'strips control characters from the session id and the cwd' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the test failed in `scratch/red-c.txt` on two forged frontmatter lines and passes in `scratch/green-c.txt` and in the final full run. | Met | - |
| AC-005 | REQ-005 | Given the value `node /x/cli.js; echo hi`, When `commandPrefix` builds the command, Then the whole value is one quoted argument after `node `. Test `commandPrefix quotes a node command that carries more than one argument` in `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` asserts the exact quoted form | `node --test --test-name-pattern 'quotes a node command that carries more than one argument' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the test failed in `scratch/red-c.txt` on the unquoted value and passes in `scratch/green-c.txt` and in the final full run. | Met | - |
| AC-006 | REQ-006 | Given `SKILLED_LOOP_HOPS: 'abc'`, When `hopLimitReached` runs, Then it returns `true`. Test `hopLimitReached treats an unusable hop count as the limit reached` in `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` asserts the return | `node --test --test-name-pattern 'treats an unusable hop count as the limit reached' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the test failed in `scratch/red-c.txt` with `false` and passes in `scratch/green-c.txt` and in the final full run. | Met | - |
| AC-007 | REQ-007 | Given a hand-over bind that throws during `session.created`, When the event handler returns, Then `SESSION_RELAUNCH_GOAL_PACKET` is unset and the error still propagates. Test `a throwing hand-over bind still deletes the packet variable` in `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` asserts the unset variable and the rejected event | `node --test --test-name-pattern 'throwing hand-over bind still deletes the packet variable' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the test failed in `scratch/red-d.txt` with the variable still set and passes in `scratch/green-d.txt` and in the final full run. The event wrapper catches the error and logs `event_error`, so the test asserts that log entry where the criterion says the error propagates. | Met | - |
| AC-008 | REQ-008 | Given a goal bound through the plugin for one session id, When `resolveGoalPacketResult` runs with `runtime: 'opencode'` and the same session id, Then it returns the bound packet. Test `the plugin record path is the one the relaunch core reads` in `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` asserts the round trip | `node --test --test-name-pattern 'plugin record path is the one the relaunch core reads' .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the contract test passed at once in `scratch/red-d.txt`, as planned, and passes in the final full run. | Met | - |
| AC-009 | REQ-009 | Given README line 19, When the reader looks for the Claude events, Then the sentence names `SessionStart` after a compaction and at startup for the claim of a hop whose start prompt is the goal command, and no other README line changes. `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` names line 19 | `rg -n 'at startup for the claim of a hop whose start prompt is the goal command' .skilled/hooks/session-relaunch/README.md` prints 1 line on line 19 and `git diff --numstat -- .skilled/hooks/session-relaunch/README.md` prints `1 1` Observed 2026-11-13: `rg -n` for the new sentence prints one line, line 19, and the README diff holds that one line. | Met | - |
| AC-010 | REQ-010 | Given the four test files after the package edits, When the named guard tests run, Then each still asserts its recorded behavior and passes. In `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`, `compact-pointer delivers the start claim with the Claude enable switch off`, `compact-pointer delivers the claim at the start of a goal-command receiver` and `compact-pointer points a compacted session at its open note and resets the nudge level` still assert a start claim and the pointer. In `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`, `recordGoalPacket writes, replaces and removes the field and skips an unchanged note`, `the resolver result carries the packet and the reason together` and `finds a goal headline outside the packet lineage` still assert the open-note write, the zero-match reason and the several-match result. In `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`, `commandPrefix(nudge.CLI_COMMAND)`, the plain path form, `hopLimitReached` with an unset or empty value and every existing `handoffText` test still pass. In `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`, every existing test still passes | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/nudge.test.cjs .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` exits 0 with `fail 0`, and `git diff -U0 -- .skilled/hooks/session-relaunch/tests .opencode/plugins/tests` shows no changed line inside the named guard tests Observed 2026-11-13: every older test passed in all four red runs and in the final full run of 1480 tests. `git diff --name-only` over the two code folders lists the nine named files. | Met | - |

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

All 10 criteria are Met with observed evidence. The orchestrator reran every suite from the final working tree with the loop variables unset: relaunch and OpenCode plugin suites 1480 of 1480, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0. The evidence is pinned to the working tree of branch `worktrees/358-handover-goal-resume` before its commit.
<!-- /ANCHOR:closure -->
