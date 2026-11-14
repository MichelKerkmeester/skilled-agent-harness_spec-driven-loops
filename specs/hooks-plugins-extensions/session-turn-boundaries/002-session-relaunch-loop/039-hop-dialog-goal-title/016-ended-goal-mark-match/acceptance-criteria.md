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
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the claimed-last rule and the unreadable-log mark with two failing-first tests"
    next_safe_action: "Build the phase from tasks.md after phase 15 and the operator's workspace choice"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-ended-goal-mark-match"
      parent_session_id: null
    completion_pct: 0
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
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an older marked note and a newer unmarked note claimed by one session and a whole log with no goal entry, When the goal is resolved, Then the result is the parent packet with `ended: false`, and with only the older note left it is `ended: true` | `scratch/red.txt` prints `✖ the ended-goal mark counts only from the note this session claimed last` before the edit, and `scratch/green.txt` prints `✔` for it after | Unmet | - |
| AC-002 | REQ-002 | Given a marked claimed note, When no session log is found or the log path cannot be read, Then the result is `ended: true`, and without the mark it is `{ packet: '', reason: '', ended: false }` | `scratch/red.txt` prints `✖ a goal the sender ended stays ended when the session log cannot be read` before the edit, and `scratch/green.txt` prints `✔` for it after | Unmet | - |
| AC-003 | REQ-003 | Given the edited core, When the two existing ended-goal tests run, Then both pass unchanged | `scratch/green.txt` shows `tests 4`, `pass 4` and `fail 0` for the T011 name pattern, and `git show <fix commit> -- .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` adds lines only | Unmet | - |
| AC-004 | REQ-004 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with two more tests than the baseline | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and a `tests` count two above `scratch/baseline.txt` | Unmet | - |
| AC-005 | REQ-005 | Given the fix commit, When it is inspected, Then it changes three files, adds no file and writes no new note field or record key | `git show --stat <fix commit>` lists the core, the test file and the README, and the two `rg -c` filters of T014 print nothing with exit 1 | Unmet | - |
| AC-006 | REQ-006 | Given the README, When the Claude row of the goal table is read, Then it names the note claimed last and says an unreadable log keeps the mark | `rg -c 'claimed last' .skilled/hooks/session-relaunch/README.md` prints 1 or more, and the old sentence on a log with no readable entry is gone | Unmet | - |


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

Every row is Unmet because the phase is planned and not built. No row asks for a live hop, and that gap is a known limitation the build records.
<!-- /ANCHOR:closure -->
