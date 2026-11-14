---
title: "Acceptance Criteria: Phase 8: history-test-database-env"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "history test database env acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/008-history-test-database-env"
    last_updated_at: "2026-11-14T06:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved red and green runs, the commit and the suite runs"
    next_safe_action: "None. Nothing is merged or pushed without the operator"
    blockers: []
    key_files: [".opencode/plugins/tests/session-history-lookup.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-history-test-database-env"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: history-test-database-env

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 008-history-test-database-env
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
| AC-001 | REQ-001 | Given `OPENCODE_DB=other-session.db` in the shell and the test unedited, When the history lookup test file runs, Then the redeem case fails with `store_unreadable` | `scratch/red.txt` shows `tests 3`, `pass 2` and `fail 1` and the reply `{"ok":false,"code":"store_unreadable"}`. Cited: `scratch/red.txt:5`, `scratch/red.txt:8`, `scratch/red.txt:28` | Met | - |
| AC-002 | REQ-001 | Given the same variable and the edited test, When the file runs, Then all three cases pass | `scratch/green.txt` shows `tests 3`, `pass 3` and `fail 0`. `env -u AI_SESSION_CHILD OPENCODE_DB=other-session.db node --test .opencode/plugins/tests/session-history-lookup.test.cjs` rerun on 2026-11-14 exited 0 with the same counts. Cited: `scratch/green.txt:5`, `scratch/green.txt:8` | Met | - |
| AC-003 | REQ-002 | Given the fix commit, When it is inspected, Then it changes one test file and adds no file and no product code | `git show --stat 94af61c540` lists `.opencode/plugins/tests/session-history-lookup.test.cjs` with 4 insertions and 1 deletion, and `git show 94af61c540 \| rg -c '^new file'` prints nothing with exit 1. Observed 2026-11-14. Cited: `.opencode/plugins/tests/session-history-lookup.test.cjs:135` | Met | - |
| AC-004 | REQ-003 | Given the final state and `OPENCODE_DB` unset, When the relaunch and OpenCode plugin suites run, Then they all pass | `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exited 0 with 1548 of 1548 on 2026-11-14 on the merged tree `be56fabc7b`. The commit message of `94af61c540` records 1543 of 1543. The 3 failures in an earlier run came from several agents running the suite at the same time. With nothing else running the same suite passed 1548 of 1548, exit 0, on that tree and 1550 of 1550, exit 0, after children 012 and 013. No run is saved under `scratch/`. Cited: `.opencode/plugins/tests/session-history-lookup.test.cjs:135` | Met | - |
| AC-005 | REQ-004 | Given the edited test, When the file is read, Then a comment says the reader takes its database name from `OPENCODE_DB` and why the test drops it | Cited: `.opencode/plugins/tests/session-history-lookup.test.cjs:133`, `.opencode/plugins/tests/session-history-lookup.test.cjs:135` | Met | - |

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

Every row is Met. No row asks for a live hop, and that gap is a Known Limitation in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
