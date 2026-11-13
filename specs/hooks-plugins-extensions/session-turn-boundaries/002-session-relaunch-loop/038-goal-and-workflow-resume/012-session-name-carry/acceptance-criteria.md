---
title: "Acceptance Criteria: Phase 12: session-name-carry"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "session name carry acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry"
    last_updated_at: "2026-11-13T00:00:00Z"
    last_updated_by: "builder"
    recent_action: "Set every row to Met with observed evidence"
    next_safe_action: "The orchestrator commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-session-name-carry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: session-name-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 012-session-name-carry
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
| AC-001 | REQ-001 | Given one scratch Claude session started with `claude --name probe-name` and never renamed, When its log is read by entry type only, Then `goal.md` section 4 records whether a `custom-title` entry is present, with the entry type list | `rg -n 'custom-title on a launch name' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/goal.md` prints 1 line that ends in yes or no Observed 2026-11-13: `rg -n 'custom-title on a launch name' goal.md` printed the one Progress row, which ends in `Answer: yes`; the Claude Code 2.1.323 print-mode probe `claude -p --name probe-name "Reply OK"` exited 0 and its log began custom-title, agent-name, session-owner. | Met | - |
| AC-002 | REQ-002 | Given a Claude log with two `custom-title` entries and an assistant turn after them, When `readClaudeSettings` runs, Then `name` is the second title. A title past the default tail is still found, and a log with no title gives `''` | `node --test --test-name-pattern 'custom title' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the `custom title` pattern ran 2 tests, 2 pass, fail 0, exit 0; the full context-usage file ran 29 pass. | Met | - |
| AC-003 | REQ-003 | Given `SKILLED_LOOP_NAME=launch` and a Claude log with `customTitle: "renamed"`, When `prepare` runs under the loop, Then the record's `name` is `renamed`. With no title it stays `launch` | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'custom title over SKILLED_LOOP_NAME\|keeps SKILLED_LOOP_NAME' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the two prepare name tests, 2 pass, fail 0, exit 0; the red run recorded `actual: 'launch'`. | Met | - |
| AC-004 | REQ-004 | Given an armed record with `name: "Work"`, When `consume` runs, Then its JSON holds `name: "Work"`. A record with no name prints no `name` key | `node --test --test-name-pattern 'consume reports' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the `consume reports` pattern ran 7 tests, 7 pass, fail 0, exit 0, including the new record-name case. | Met | - |
| AC-005 | REQ-005 | Given a Claude or Pi loop, When a hop replays the name, Then launch `X` gives `X (2)`, record name `Renamed` gives `Renamed (2)`, record name `X (2)` at hop 2 gives `X (3)`, record name `Phase (7)` at hop 1 gives `Phase (7) (2)`, and a consumed `-x` falls back to the launch name with a warning | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'numbers the replayed name\|live name with the next number\|instead of stacking\|ends in another number\|fails the check falls back' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the five name patterns plus Pi ran 7 tests, 7 pass, fail 0, exit 0; `X` gave `X (2)`, `Renamed` gave `Renamed (2)`, `X (2)` at hops 1 gave `X (3)`, `Phase (7)` gave `Phase (7) (2)`, and `-x` and `a\nb` fell back to the launch name with a warning. | Met | - |
| AC-006 | REQ-006 | Given a pending record that declines the hop, When the wrapper prints the manual command, Then the command holds `--name X` and no `(2)` | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'name stem without a number' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the manual test passed; the printed command held `'--name' 'X'` and no `(2)`. | Met | - |
| AC-007 | REQ-007 | Given the two option comments in the wrapper, When a reader checks the Codex, Cursor, Devin and OpenCode name entries, Then each comment says those runtimes have no name flag and the entry exists so a hop strips it | `rg -n 'no name flag' .skilled/bin/skilled-loop` prints 2 lines Observed 2026-11-13: `rg -n 'no name flag' .skilled/bin/skilled-loop` printed 2 lines, one above each option list. | Met | - |
| AC-008 | REQ-008 | Given the five guards named in `REQ-008`, When they run after the change, Then each passes with only its expected hop name changed | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-*.test.cjs` exits 0 with `fail 0`, and `git diff -U0 -- .skilled/hooks/session-relaunch/tests` shows changed lines in those guards only where a name appears Observed 2026-11-13: the wrapper suites ran 199 tests, 199 pass, fail 0, exit 0; the test diff changes only the five named guards, `a hop replaces the start prompt and the record settings` and the manual comparison that now expects the automatic name to be the stem plus ` (2)`. | Met | - |
| AC-009 | REQ-009 | Given the whole relaunch suite, When it runs on the final tree, Then every older test passes unchanged | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0` Observed 2026-11-13: the full relaunch suite ran 928 tests, 928 pass, fail 0, cancelled 0, skipped 0, exit 0; the baseline was 915, so the 13 new tests passed. | Met | - |

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

Every row is Met with observed evidence: the name reader, prepare, consume and the wrapper landed after their red runs, the relaunch suite passed 928 of 928, and strict validation printed `RESULT: PASSED`.
<!-- /ANCHOR:closure -->
