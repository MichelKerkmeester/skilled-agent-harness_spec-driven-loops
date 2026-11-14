---
title: "Acceptance Criteria: Phase 20: question-guard-killer-gone"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "question guard killer gone acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/020-question-guard-killer-gone"
    last_updated_at: "2026-11-14T19:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built the armable verdict fix, split the armed-record test and proved the throwing read"
    next_safe_action: "The orchestrator commits the fix and the operator decides the merge"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/subagent-guard.mjs", ".skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-question-guard-killer-gone"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Claude show the deny envelope in a live session? Not run live, the spawned hook and the suite are the evidence."
    answered_questions:
      - "Deny for every armable verdict, or only for killer-gone as well as pending? Every armable verdict, which is pending and killer-gone."
      - "Does a killer spawn failure always leave the record armed? Both spawn-error tests say yes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 20: question-guard-killer-gone

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 020-question-guard-killer-gone
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an armed record for this session and no live killer lock, When the guard sees an `AskUserQuestion` PreToolUse, Then stdout holds one deny envelope whose reason names the note and the `cancel` command | Planned: `scratch/red.txt` prints `✖ subagent-guard denies a question dialog over an armed record whose killer is gone` before the edit and `scratch/green.txt` prints `✔` after. The changed test sits beside `tests/subagent-guard.test.cjs:313` and reads the verdict at `claude/subagent-guard.mjs:84`. Cited: `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:84`, `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:313` Observed 2026-11-14: scratch/red.txt line 2 prints the cross mark for `subagent-guard denies a question dialog over an armed record whose killer is gone` with tests 2, pass 1, fail 1, exit 1, and scratch/green.txt line 2 prints its tick with tests 2, pass 2, fail 0, exit 0. The one envelope assertQuestionDenied parses names the note path and the `cancel` command. | Met | - |
| AC-002 | REQ-002 | Given the same armed record and a lock file owned by `process.pid`, When the guard sees the same dialog, Then it exits 0 with no output | Planned: `scratch/control.txt` prints `✔ subagent-guard lets a question dialog through over an armed record with a live killer`, and the run exits 0 with `fail 0`. The lock format follows `tests/relaunch-core.test.cjs:1686`. Cited: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1686`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1182` Observed: scratch/control.txt prints the tick for `subagent-guard lets a question dialog through over an armed record with a live killer` with tests 1, pass 1, fail 0, exit 0, over a lock file holding `${process.pid} <iso>` at `stateDir` path `killer-${LOOP_ID}.lock`. | Met | - |
| AC-003 | REQ-003 | Given a pending record, When the guard sees the dialog, Then the existing denial is unchanged | Planned: `scratch/guard-suite.txt` prints `✔ subagent-guard denies a question dialog while the session hand-over is pending` and `fail 0`. Cited: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:284` Observed: scratch/guard-suite.txt prints the tick for `subagent-guard denies a question dialog while the session hand-over is pending` with tests 23, pass 23, fail 0, exit 0. | Met | - |
| AC-004 | REQ-003 | Given no record, another session's record, a record with no `handoff`, no `SKILLED_LOOP_ID` or a disabled concern, When the guard sees the dialog, Then it exits 0 with no output | Planned: the five pass-through tests print `✔` in `scratch/guard-suite.txt` with `fail 0`. Cited: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:291` Observed: scratch/guard-suite.txt prints the tick for the no-record, another-session, no-note, outside-loop and disabled-concern tests, all with fail 0. | Met | - |
| AC-005 | REQ-004 | Given a record whose read throws, When the guard runs, Then it exits 0 with no output | Planned: `scratch/green.txt` and `scratch/guard-suite.txt` print `✔ subagent-guard lets a question dialog through when the record read throws`. The test sets mode `0o000` on the record and the guard catches the read at `claude/subagent-guard.mjs:73` to `:77`. Cited: `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:74`, `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:76` Observed: scratch/green.txt and scratch/guard-suite.txt print the tick for `subagent-guard lets a question dialog through when the record read throws` with fail 0. The test sets mode 0o000 on the record, `readRelaunchFile` rethrows the EACCES and the guard catches it. | Met | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then the Claude adapter README names both armable states and the live-killer exception, and the commit adds no file, record key or log event | Planned: `rg -c 'live killer' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more, the T014 filters print what T014 states, and `git show --stat FIX` lists three code or document files plus this child's records. Cited: `.skilled/hooks/session-relaunch/claude/README.md:28` Observed: `rg -c 'live killer'` printed 1 at `.skilled/hooks/session-relaunch/claude/README.md:28`, and the row names both armable states and the live-killer exception. The working-tree new-file filter printed only files in this child, and the added `logEvent('` count printed nothing with exit 1. The commit-scoped `git show --stat` runs after the orchestrator makes the fix commit, and it must list the three code or document files plus this child's records. | Met | - |
| AC-007 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with two more tests than the baseline | Planned: `scratch/final-suite.txt` prints `ℹ fail 0` and a `tests` count two above `scratch/baseline.txt`. Cited: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:313` Observed: scratch/final-suite.txt prints tests 1555, pass 1555, fail 0, exit 0, two above the 1553 in scratch/baseline.txt. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Pending` | Planned and not yet built. The builder replaces it with `Met` or `Unmet` when the fix commit lands. |
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

Every row is `Met`. T001 to T015 ran, each run is saved under `scratch/` and each row names the file that holds it. The fix commit is the orchestrator's to make, so the commit-scoped clause of AC-006 runs after it.
<!-- /ANCHOR:closure -->

---
