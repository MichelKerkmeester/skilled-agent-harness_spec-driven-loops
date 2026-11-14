---
title: "Acceptance Criteria: Phase 16: ended-goal-mark-match"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "ended goal mark match acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/016-ended-goal-mark-match"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "code-agent"
    recent_action: "Read every row at fix commit c37531f72b (Commit-Id 0014029); every row Met"
    next_safe_action: "The operator decides the merge"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-ended-goal-mark-match"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 16: ended-goal-mark-match

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 016-ended-goal-mark-match
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
| AC-001 | REQ-001 | Given an older marked note and a newer unmarked note claimed by one session and a whole log with no goal entry, When the goal is resolved, Then the result is the parent packet with `ended: false`, and with only the older note left it is `ended: true` | `scratch/red.txt` prints `✖ the ended-goal mark counts only from the note this session claimed last` before the edit, and `scratch/green.txt` prints `✔` for it after. Observed 2026-11-14: `scratch/red.txt:3` prints the `✖` line, `scratch/red.txt:5`, `:7` and `:8` print `ℹ tests 2`, `ℹ pass 0` and `ℹ fail 2`, `scratch/green.txt:4` prints the `✔` line, and the test asserts the parent packet with `ended: false`, then `ended: true` once the newer note is removed. Cited: `scratch/red.txt:3`, `scratch/green.txt:4`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2958` | Met | - |
| AC-002 | REQ-002 | Given a marked claimed note, When no session log is found or the log path cannot be read, Then the result is `ended: true`, and without the mark it is `{ packet: '', reason: '', ended: false }` | `scratch/red.txt` prints `✖ a goal the sender ended stays ended when the session log cannot be read` before the edit, and `scratch/green.txt` prints `✔` for it after. Observed 2026-11-14: `scratch/red.txt:4` prints the `✖` line, `scratch/green.txt:5` prints the `✔` line, and the test asserts `ended: true` for a missing config folder and for a log path that is a directory, then the empty result with the mark removed. Cited: `scratch/red.txt:4`, `scratch/green.txt:5`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2993` | Met | - |
| AC-003 | REQ-003 | Given the edited core, When the two existing ended-goal tests run, Then both pass unchanged | `scratch/green.txt` shows `tests 4`, `pass 4` and `fail 0` for the T011 name pattern, and `git show <fix commit> -- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` adds lines only. Observed 2026-11-14: `scratch/green.txt:3` and `:6` print `✔` for the two existing tests, `:7`, `:9` and `:10` print `ℹ tests 4`, `ℹ pass 4` and `ℹ fail 0`, `:15` prints `exit=0`, and `git show c37531f72b -- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` adds lines only. Cited: `scratch/green.txt:3`, `scratch/green.txt:6`, `scratch/green.txt:7`, commit `c37531f72b` | Met | - |
| AC-004 | REQ-004 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with two more tests than the baseline | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and a `tests` count two above `scratch/baseline.txt`. Observed 2026-11-14: `scratch/final-suite.txt:1567` prints `ℹ tests 1553`, `:1569` `ℹ pass 1553`, `:1570` `ℹ fail 0` and `:1575` `exit=0`, against the 1551 baseline at `scratch/baseline.txt:1563`. Cited: `scratch/final-suite.txt:1567`, `scratch/final-suite.txt:1575`, `scratch/baseline.txt:1563` | Met | - |
| AC-005 | REQ-005 | Given the fix commit, When it is inspected, Then it changes three files, adds no file and writes no new note field or record key | `git show --stat <fix commit>` lists the core, the test file and the README, and the two `rg -c` filters of T014 print nothing with exit 1. Observed 2026-11-14: `git show --stat c37531f72b` (Commit-Id 0014029) lists `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` and `.skilled/hooks/session-relaunch/README.md` among its 12 files. Both T014 filters printed nothing with exit 1, so the commit adds no file outside this child, no note field and no record key. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:635`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2958`, `.skilled/hooks/session-relaunch/README.md:182`, commit `c37531f72b` | Met | - |
| AC-006 | REQ-006 | Given the README, When the Claude row of the goal table is read, Then it names the note claimed last and says an unreadable log keeps the mark | `rg -c 'claimed last' .skilled/hooks/session-relaunch/README.md` prints 1 or more, and the old sentence on a log with no readable entry is gone. Observed 2026-11-14: `rg -c 'claimed last'` printed 1, exit 0, on `.skilled/hooks/session-relaunch/README.md:182`; `rg -c 'With no readable log the goal cannot be proven, so no field is written'` printed nothing with exit 1. The row now says no packet can be proven without a readable log and a mark the note claimed last carries still stands. Cited: `.skilled/hooks/session-relaunch/README.md:182` | Met | - |


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

Every row is `Met` from a recorded run, a searched source or the fix commit `c37531f72b` (Commit-Id 0014029) on 2026-11-14. The `git show` halves of AC-003 and AC-005 were read at that commit. No row asks for a live hop, and that gap is a known limitation the build records.
<!-- /ANCHOR:closure -->
