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
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a log of 17 one-MB filler lines with no goal entry and an unfinished packet goal beside the note, When `resolveGoalPacket` runs for a Claude sender, Then it returns that packet | Planned: `scratch/red.txt` prints the assertion `a log read whole with no goal entry` failing before the edit, and `scratch/green.txt` prints `ℹ fail 0` after. The assertion sits beside `tests/relaunch-core.test.cjs:2876` and the refusal it removes is at `lib/relaunch-core.cjs:687`. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:687`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2876` | Pending | - |
| AC-002 | REQ-002 | Given a log whose only goal entry is a met goal before the last 16 MB and whose tail is filler, When `resolveGoalPacketResult` runs, Then it reports `ended: true` and no packet | Planned: the same run prints the assertion `an ended goal before the tail cap still ends it` failing before the edit with `ended: false` and passing after. The ended path is at `lib/relaunch-core.cjs:697`. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:697`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2876` | Pending | - |
| AC-003 | REQ-003 | Given a log that fits the cap, or a capped tail that holds a goal entry, When the reader runs, Then it reports what it reports today | Planned: `scratch/relaunch-core.txt` prints `ℹ fail 0`, and every existing goal test passes, including the tail cases of `resolveGoalPacket leaves an ended or unreadable Claude goal uncarried`. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:590`, `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2864` | Pending | - |
| AC-004 | REQ-004 | Given a capped tail with no goal entry, When the head scan runs, Then it reads `[0, tail.start)` once in 64 KiB buffers as bytes, parses only lines that contain `goal`, joins a line split by a chunk boundary, and joins a line that straddles the tail start with the tail's first partial line | Planned: source read of `latestGoalLogEntryBefore` and `readLogTail`, with the chunk constant, the `start` return, the byte remainder and the boundary join named in `plan.md` section 3. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:537`, `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:572` | Pending | - |
| AC-005 | REQ-005 | Given the final state, When the relaunch and OpenCode plugin suites run, Then they pass with the baseline count | Planned: `scratch/final-suite.txt` prints `ℹ fail 0` and the same `tests` count as `scratch/baseline.txt`. Cited: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2850` | Pending | - |
| AC-006 | REQ-006 | Given the fix commit, When it is inspected, Then the comment and the README sentence name the whole read, and the commit adds no file, record key or log event | Planned: `rg -c 'fixed chunks' .skilled/hooks/session-relaunch/README.md` prints 1 or more, the T015 filters print what T015 states, and `git show --stat FIX` lists the core, the test and the README plus this child's records. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:58`, `.skilled/hooks/session-relaunch/README.md:182` | Pending | - |

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

Every row is `Pending`, because this phase is planned and not built. The builder runs T001 to T016, saves each run under `scratch/`, marks every row `Met` with the observed line and cites the fix commit.
<!-- /ANCHOR:closure -->

---
