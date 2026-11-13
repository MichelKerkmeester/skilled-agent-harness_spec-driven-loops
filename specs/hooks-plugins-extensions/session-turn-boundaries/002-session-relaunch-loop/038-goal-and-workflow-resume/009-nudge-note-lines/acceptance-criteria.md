---
title: "Acceptance Criteria: Phase 9: nudge-note-lines"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "nudge note lines acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines"
    last_updated_at: "2026-11-13T09:30:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Wait for the operator greenlight, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-nudge-note-lines"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: nudge-note-lines

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 009-nudge-note-lines
**Level:** 2
**Status:** Draft
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `handoffText` with a loop id, When the deep-loop step is printed, Then one step line holds `fanout-run.cjs`, `kill -TERM <runner-pid>`, `kill -0 <runner-pid>` and the `loop-lock.cjs release` form in that order, and it is the step right before `prepare` | `node --test --test-name-pattern 'stops a running fan-out runner and waits for it before releasing the lock' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`, after a recorded failing run in `scratch/red.txt`, and `node --test --test-name-pattern 'releases a deep-loop lock before prepare' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0` | Unmet | - |
| AC-002 | REQ-002 | Given `handoffText`, When the In-flight instruction is printed, Then it asks for `Running workers:` with the shape `pid <pid> log <path> collect <step>`, the empty value `Running workers: none`, and says `prepare` refuses a note without it | `node --test --test-name-pattern 'Running workers line with none as the empty value' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`, after a recorded failing run | Unmet | - |
| AC-003 | REQ-003 | Given a note whose In-flight state has no `Running workers:` line, When `prepare` runs under the loop, Then it exits 2, stderr names `Running workers:`, and no relaunch record exists for the loop | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'note with no Running workers line' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`, after a recorded failing run | Unmet | - |
| AC-004 | REQ-004 | Given notes with `Running workers: none`, `- Running workers: pid 4242 log /tmp/w.log collect read the log`, an empty value and `Running workers: some job`, When `prepare` runs on each, Then the first two are accepted and the last two exit 2 | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'accepts Running workers none and a line that names a pid' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` and the same command with the pattern `neither none nor a pid` each exit 0 with `fail 0` | Unmet | - |
| AC-005 | REQ-005 | Given `seedText` with and without `afterCompaction`, When the steps are printed, Then a step holding `Running workers:` and `kill -0` comes before the `run it again` step in both | `node --test --test-name-pattern 'checks running workers before running the active command again' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`, after a recorded failing run | Unmet | - |
| AC-006 | REQ-006 | Given `handoffText`, When the In-flight instruction is printed, Then it asks for `Scheduled:` and `Added directories:` lines with `Scheduled: none` and `Added directories: none` as the empty values | `node --test --test-name-pattern 'asks for Scheduled and Added directories lines' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`, after a recorded failing run | Unmet | - |
| AC-007 | REQ-007 | Given `seedText` with `afterCompaction` false, When the steps are printed, Then one step recreates the `Scheduled:` entries and one re-adds the `Added directories:` entries naming `/add-dir`, And given `afterCompaction` true, Then neither step appears | `node --test --test-name-pattern 'recreates scheduled tasks and re-adds directories' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`, after a recorded failing run | Unmet | - |
| AC-008 | REQ-008 | Given `.skilled/commands/speckit/handoff.md`, When a reader follows its template and Step 4, Then it asks for the three lines and stops the runner before the lock release | `rg -o -e 'Running workers:' -e 'Scheduled:' -e 'Added directories:' -e 'kill -TERM' .skilled/commands/speckit/handoff.md` prints each of the four strings at least once | Unmet | - |
| AC-009 | REQ-009 | Given the three test files after the change, When the full suites run, Then every existing test passes with its assertions unchanged, and `keep` still accepts a note with no `Running workers:` line | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`, and `git diff -U0 -- .skilled/hooks/session-relaunch/tests` changes no line inside an existing test except the two fixture notes | Unmet | - |
| AC-010 | REQ-001 | Given a live fan-out runner, When it gets SIGTERM, Then it exits 143 and writes a stopped summary, which the new step relies on | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/fanout-run.vitest.ts -t 'writes a stopped partial orchestration summary when SIGTERM interrupts an in-flight run'` exits 0 with 1 test passed, recorded in `goal.md` section 4 before T011 | Unmet | - |
| AC-011 | REQ-007 | Given the Claude Code scheduled-tasks page and `claude --help`, When T002 reads them, Then `goal.md` section 4 records whether a session can create a scheduled task and add a directory itself, with the quoted line, or UNCONFIRMED | `rg -n 'T002' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines/goal.md` prints a Done row with a quoted source line or the word UNCONFIRMED | Unmet | - |
| AC-012 | REQ-010 | Given the live hop harness after the change, When it writes its note, Then In-flight state holds `Running workers: none` and no other line of the script changed | `rg -c 'Running workers: none' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` prints 1, and `git diff --numstat -- specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` prints `1 0` | Unmet | - |

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

Nothing is built yet, because the operator has not given the greenlight, so every criterion is Unmet.
<!-- /ANCHOR:closure -->
