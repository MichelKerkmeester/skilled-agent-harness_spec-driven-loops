---
title: "Acceptance Criteria: Phase 17: missing-transcript-notice"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "missing transcript notice acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/017-missing-transcript-notice"
    last_updated_at: "2026-11-14T18:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built and verified the missing-transcript notice; every row Met"
    next_safe_action: "The orchestrator commits the four files and runs T013 against the fix commit"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/claude/stop-arm.mjs", ".skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs", ".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/claude/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-missing-transcript-notice"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does Claude show a Stop systemMessage when the payload has no transcript path? Not run live; the background-task notice relies on the same contract."
    answered_questions:
      - "Is the silent withdrawal intended? The operator answered on 2026-11-14: Keep, add a notice (Recommended)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 17: missing-transcript-notice

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 017-missing-transcript-notice
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
| AC-001 | REQ-001 | Given a pending record and a Stop payload with no `transcript_path`, When the Stop hook runs, Then stdout holds one JSON line whose `systemMessage` matches `no transcript path` and `next prompt withdraws` and which has no `decision` key | `scratch/red.txt` prints `✖ stop-arm logs missing-transcript-path and marks the pending record deferred` before the edit, and `scratch/green.txt` prints `✔` for it after. Observed 2026-11-14: `scratch/red.txt:2` prints the `✖` line, `:3`, `:5` and `:6` print `ℹ tests 1`, `ℹ pass 0` and `ℹ fail 1`, and the `AssertionError` at `:16` reads `stdout is empty: the missing-transcript Stop printed no notice`; `scratch/green.txt:2` prints the `✔` line, and `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:958` to `:965` assert one line, both matches and no `decision` key. Cited: `scratch/red.txt:2`, `scratch/green.txt:2`, `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:958` | Met | - |
| AC-002 | REQ-002 | Given the same Stop, When the record and the log are read, Then the record holds `deferredAt` and its other fields unchanged, and the log holds one `missing-transcript-path` line | The changed test asserts both and passes in `scratch/green.txt`. Observed 2026-11-14: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:967` to `:973` assert the record equals the written one apart from `deferredAt`, that `deferredAt` parses as a date, and that exactly one filtered `missing-transcript-path` line exists; `scratch/green.txt:2` to `:11` print the `✔` line, `ℹ tests 1`, `ℹ pass 1`, `ℹ fail 0` and `exit=0`. An injected-throw check also saw one `missing-transcript-path` line. Cited: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:967`, `scratch/green.txt:2` | Met | - |
| AC-003 | REQ-003 | Given the edited branch, When its source is read, Then the write sits in a `try` whose `catch` logs `stop-arm-error` with `stage: 'notice'` | `git show <fix commit> -- .skilled/hooks/session-relaunch/claude/stop-arm.mjs` shows the `try` and the `catch`. Observed 2026-11-14: the working-tree diff shows `try` at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:143`, the write at `:144` to `:149`, and `catch` at `:150` to `:152` logging `stop-arm-error` with `stage: 'notice'` and `message: error.message`. An injected `write` that throws resolved the hook to `null`, left `deferredAt` stamped and logged one `stop-arm-error stage=notice` line, so the hook still exits 0. The commit-scoped form is the orchestrator's with T013. Cited: `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:143` | Met | - |
| AC-004 | REQ-004 | Given the edited adapter, When the Claude adapter and conformance suites run, Then they pass | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs` exits 0 with `fail 0`. Observed 2026-11-14: `scratch/claude-conformance.txt:117` prints `ℹ tests 115`, `:119` `ℹ pass 115`, `:120` `ℹ fail 0` and `:125` `exit=0`, with no `✖` line; the background-task notice test prints `✔` at `:69` and the changed test at `:81`. Cited: `scratch/claude-conformance.txt:117`, `scratch/claude-conformance.txt:125` | Met | - |
| AC-005 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with the baseline count | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and the `tests` count in `scratch/baseline.txt`. Observed 2026-11-14: `scratch/final-suite.txt:1566` prints `ℹ tests 1553`, `:1568` `ℹ pass 1553`, `:1569` `ℹ fail 0` and `:1574` `exit=0`, equal to the 1553 baseline at `scratch/baseline.txt:1565`, `:1567` and `:1568`; the file holds no `✖` line. Cited: `scratch/final-suite.txt:1566`, `scratch/final-suite.txt:1574` | Met | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then both READMEs name the notice and the commit adds no file and no log event | `rg -c 'no transcript path' .skilled/hooks/session-relaunch/README.md .skilled/hooks/session-relaunch/claude/README.md` prints a count for each, and the T013 filters print what T013 states. Observed 2026-11-14: `rg -c 'no transcript path'` printed 1 for each file with exit 0; `git diff --stat` lists the two READMEs, the adapter and the test file, all modifications, `git status --porcelain` shows no new tracked file, and the only added `logEvent('` line is the `stage: 'notice'` call at `.skilled/hooks/session-relaunch/claude/stop-arm.mjs:151`. The commit-scoped half needs the fix commit, which the orchestrator lands and checks with T013. Cited: `.skilled/hooks/session-relaunch/README.md:134`, `.skilled/hooks/session-relaunch/claude/README.md:27` | Met | - |


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

Every row is `Met` from a recorded run or a read source on 2026-11-14. The one commit-scoped form, the `git show` half of AC-003 and AC-006, is run by the orchestrator against the fix commit with T013. No row asks for a live Stop, and that gap is a known limitation the build records.
<!-- /ANCHOR:closure -->
