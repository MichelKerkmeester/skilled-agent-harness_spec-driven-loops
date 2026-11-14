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
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the armable verdict fix and its seven criteria"
    next_safe_action: "The builder records each run and marks every row Met"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/subagent-guard.mjs", ".skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs", ".skilled/hooks/session-relaunch/claude/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-question-guard-killer-gone"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a killer spawn failure always leave the record armed? Both spawn-error tests say yes."
    answered_questions:
      - "Deny for every armable verdict, or only for killer-gone as well as pending? The review finding F1 asks for every armable verdict."
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
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an armed record for this session and no live killer lock, When the guard sees an `AskUserQuestion` PreToolUse, Then stdout holds one deny envelope whose reason names the note and the `cancel` command | Planned: `scratch/red.txt` prints `✖ subagent-guard denies a question dialog over an armed record whose killer is gone` before the edit and `scratch/green.txt` prints `✔` after. The changed test sits beside `tests/subagent-guard.test.cjs:313` and reads the verdict at `claude/subagent-guard.mjs:84`. Cited: `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:84`, `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:313` | Pending | - |
| AC-002 | REQ-002 | Given the same armed record and a lock file owned by `process.pid`, When the guard sees the same dialog, Then it exits 0 with no output | Planned: `scratch/control.txt` prints `✔ subagent-guard lets a question dialog through over an armed record with a live killer`, and the run exits 0 with `fail 0`. The lock format follows `tests/relaunch-core.test.cjs:1686`. Cited: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1686`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1182` | Pending | - |
| AC-003 | REQ-003 | Given a pending record, When the guard sees the dialog, Then the existing denial is unchanged | Planned: `scratch/guard-suite.txt` prints `✔ subagent-guard denies a question dialog while the session hand-over is pending` and `fail 0`. Cited: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:284` | Pending | - |
| AC-004 | REQ-003 | Given no record, another session's record, a record with no `handoff`, no `SKILLED_LOOP_ID` or a disabled concern, When the guard sees the dialog, Then it exits 0 with no output | Planned: the five pass-through tests print `✔` in `scratch/guard-suite.txt` with `fail 0`. Cited: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:291` | Pending | - |
| AC-005 | REQ-004 | Given a record whose read throws, When the guard runs, Then it exits 0 with no output | Planned: `scratch/green.txt` and `scratch/guard-suite.txt` print `✔ subagent-guard lets a question dialog through when the record read throws`. The test sets mode `0o000` on the record and the guard catches the read at `claude/subagent-guard.mjs:73` to `:77`. Cited: `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:74`, `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:76` | Pending | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then the Claude adapter README names both armable states and the live-killer exception, and the commit adds no file, record key or log event | Planned: `rg -c 'live killer' .skilled/hooks/session-relaunch/claude/README.md` prints 1 or more, the T014 filters print what T014 states, and `git show --stat FIX` lists three code or document files plus this child's records. Cited: `.skilled/hooks/session-relaunch/claude/README.md:28` | Pending | - |
| AC-007 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with two more tests than the baseline | Planned: `scratch/final-suite.txt` prints `ℹ fail 0` and a `tests` count two above `scratch/baseline.txt`. Cited: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:313` | Pending | - |

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

**Closeable:** No

Every row is `Pending`, because this phase is planned and not built. The builder runs T001 to T015, saves each run under `scratch/`, marks every row `Met` with the observed line and cites the fix commit.
<!-- /ANCHOR:closure -->

---
