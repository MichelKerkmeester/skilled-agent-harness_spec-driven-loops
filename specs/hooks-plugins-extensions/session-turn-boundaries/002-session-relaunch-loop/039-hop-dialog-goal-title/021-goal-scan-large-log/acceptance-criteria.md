---
title: "Acceptance Criteria: Phase 21: goal-scan-large-log"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal scan large log acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/021-goal-scan-large-log"
    last_updated_at: "2026-11-14T16:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the bounded whole-log scan and its six criteria"
    next_safe_action: "The builder records each run and marks every row Met"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs", ".skilled/hooks/session-relaunch/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-goal-scan-large-log"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How many Claude logs exceed 16 MB? The review measured 35 of 801 on one account, and the fix does not depend on the rate."
    answered_questions:
      - "Does an old ended goal stay ended after the scan? Yes, the newest entry anywhere decides, and an ended entry returns ended."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 21: goal-scan-large-log

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 021-goal-scan-large-log
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
| AC-001 | REQ-001 | Given a log of 17 one-MB filler lines with no goal entry and an unfinished packet goal beside the note, When `resolveGoalPacket` runs for a Claude sender, Then it returns that packet | Observed: `scratch/red.txt` prints the message `a log read whole with no goal entry` with `noGoal: ''` against `noGoal: 'specs/hooks/023-session-relaunch-loop'`, exit 1. `scratch/green.txt` prints tests 1, pass 1, fail 0, exit 0. The changed test is at `tests/relaunch-core.test.cjs:2850` and the packet fallback it reaches is at `lib/relaunch-core.cjs:760`. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:760`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2850` | Met | - |
| AC-002 | REQ-002 | Given a log whose only goal entry is a met goal before the last 16 MB and whose tail is filler, When `resolveGoalPacketResult` runs, Then it reports `ended: true` and no packet | Observed: the same `scratch/red.txt` run prints `an ended goal before the tail cap still ends it` with `ended: false` against `ended: true`, exit 1. `scratch/green.txt` prints tests 1, pass 1, fail 0, exit 0. The ended path is at `lib/relaunch-core.cjs:763` and the changed test is at `tests/relaunch-core.test.cjs:2850`. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:763`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2850` | Met | - |
| AC-003 | REQ-003 | Given a log that fits the cap, or a capped tail that holds a goal entry, When the reader runs, Then it reports what it reports today | Observed: `scratch/relaunch-core.txt` prints tests 167, pass 167, fail 0, exit 0. Every existing goal test passes, including the tail cases of `resolveGoalPacket leaves an ended or unreadable Claude goal uncarried` and `resolveGoalPacket follows the Claude session log goal entries`. The tail return is at `lib/relaunch-core.cjs:648` and the changed test at `tests/relaunch-core.test.cjs:2850`. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:648`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2850` | Met | - |
| AC-004 | REQ-004 | Given a capped tail with no goal entry, When the head scan runs, Then it reads `[0, tail.start)` once in 64 KiB buffers as bytes, parses only lines that contain `goal`, joins a line split by a chunk boundary, and joins a line that straddles the tail start with the tail's first partial line | Observed: source read of `latestGoalLogEntryBefore` at `lib/relaunch-core.cjs:588` to `:629` and `readLogTail` at `:540` to `:551`. The chunk constant is at `:64`, `readLogTail` returns `start` and `bytes` at `:548`, the scan reads `[0, endByte)` into one reused buffer at `:591` and `:596`, the remainder is a Buffer at `:609` and `:623`, every parse goes through `goalEntryFromLogLine` at `:574`, and the boundary join concatenates the head remainder with the tail's first partial bytes before one decode at `:654` to `:656`. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:540`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:588` | Met | - |
| AC-005 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with the baseline count | Observed: `scratch/final-suite.txt` prints tests 1555, pass 1555, fail 0, exit 0, equal to the 1555 baseline in `scratch/baseline.txt`. The changed test adds none. Cited: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2850` | Met | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then the comment and the README sentence name the whole read, and the commit adds no file, record key or log event | Observed: `rg -c 'fixed chunks' .skilled/hooks/session-relaunch/README.md` prints 1 with exit 0 at `README.md:182`, the comment above the cap names the fixed-chunk read, and the working-tree new-file filter printed nothing with exit 1 while the added `logEvent('` count printed nothing with exit 1. `git diff --name-only` lists the core, the test and the README as this child's changes. The commit-scoped `git show --stat FIX` form runs after the orchestrator makes the fix commit. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:58`, `.skilled/hooks/session-relaunch/README.md:182` | Met | - |

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

Every row is `Met`. T001 to T016 ran, each run is saved under `scratch/` and each row names the file that holds it. The fix commit is the orchestrator's to make, so the commit-scoped clause of AC-006 and CHK-FIX-007 run after it.
<!-- /ANCHOR:closure -->

---
