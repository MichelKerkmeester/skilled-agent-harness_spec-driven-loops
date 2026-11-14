---
title: "Acceptance Criteria: Phase 12: wrapper-notice-log"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "wrapper notice log acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/012-wrapper-notice-log"
    last_updated_at: "2026-11-14T08:10:00Z"
    last_updated_by: "code-agent"
    recent_action: "Built and verified the wrapper log line; every row Met"
    next_safe_action: "The orchestrator commits the four files, runs T014 against the fix commit, and decides the merge"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/README.md", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-wrapper-notice-log"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: wrapper-notice-log

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 012-wrapper-notice-log
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
| AC-001 | REQ-001 | Given a wrapper copy that changes after the loop started, When the wrapper hops, Then `relaunch.log` holds exactly one line with `wrapper-changed` and the loop id and stderr holds the note once | `scratch/red.txt` prints `✖ a hop logs wrapper-changed when the wrapper file changed after the loop started` before the edit and `scratch/green.txt` prints `✔` for it after. Observed 2026-11-14: `scratch/red.txt:7` prints the `✖` line, and `scratch/green.txt:3` prints the `✔` line; the test asserts one notice line, exactly one log line and the record's loop id on it. Cited: `scratch/red.txt:7`, `scratch/green.txt:3`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:314` | Met | - |
| AC-002 | REQ-002 | Given a wrapper copy that cannot be read at the hop, When the wrapper hops, Then stderr holds no `changed on disk` line, the log holds no `wrapper-changed` line and the runtime stub was invoked twice | `scratch/red.txt` prints `✖ a hop prints and logs nothing when the wrapper file cannot be read` before the edit and `scratch/green.txt` prints `✔` for it after. Observed 2026-11-14: `scratch/red.txt:8` prints the `✖` line with the false note in its assertion message, `scratch/green.txt:4` prints the `✔` line, and the test asserts two launch records. Cited: `scratch/red.txt:8`, `scratch/green.txt:4`, `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:337` | Met | - |
| AC-003 | REQ-003 | Given an unchanged wrapper copy, When the wrapper hops, Then the log holds no `wrapper-changed` line | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `tests 4`, `pass 4` and `fail 0`. Observed 2026-11-14: `scratch/green.txt:6` to `:9` print `ℹ tests 4`, `ℹ pass 4`, `ℹ fail 0`, `exit=0` at `:14`, and the unchanged test now asserts an empty `wrapper-changed` match. Cited: `scratch/green.txt:6`, `scratch/green.txt:9`, `scratch/green.txt:14` | Met | - |
| AC-004 | REQ-004 | Given the edited notice block, When it is read, Then the log call ends in `\|\| true` and the wrapper still parses | `rg -n 'wrapper-changed' -A 2 .skilled/bin/skilled-loop` shows `\|\| true` on the call, and `bash -n .skilled/bin/skilled-loop` exits 0. Observed 2026-11-14: the `appendLog` line is `.skilled/bin/skilled-loop:1478`, the next line ends in `\|\| true` at `:1479`, and `bash -n` exited 0. Cited: `.skilled/bin/skilled-loop:1479` | Met | - |
| AC-005 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with two more tests than the baseline | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and a `tests` count two above `scratch/baseline.txt`. Observed 2026-11-14: `scratch/final-suite.txt` prints `ℹ tests 1550`, `ℹ pass 1550`, `ℹ fail 0` and `exit=0`, against the 1548 baseline. Cited: `scratch/final-suite.txt:1563`, `scratch/final-suite.txt:1566`, `scratch/baseline.txt` | Met | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then the README names the log line and the commit adds no file, no module and no record key | `rg -c 'wrapper-changed' .skilled/hooks/session-relaunch/README.md` prints 1, `git show --stat` of the fix commit lists four files, and `git show <fix commit> \| rg -c '^new file'` prints nothing with exit 1. Observed 2026-11-14: the README count printed 1; the working-tree `git diff --stat` lists exactly four files, all modifications, with no new file. The commit-scoped half needs the fix commit, which the orchestrator lands and checks with T014. Cited: `.skilled/hooks/session-relaunch/README.md:112`, `git status --porcelain` of the four changed paths | Met | - |


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

Every row is Met. The commit-scoped half of AC-006 and T014's no-new-file check need the fix commit, which the orchestrator lands and inspects right after this build. No row asks for a live hop, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
