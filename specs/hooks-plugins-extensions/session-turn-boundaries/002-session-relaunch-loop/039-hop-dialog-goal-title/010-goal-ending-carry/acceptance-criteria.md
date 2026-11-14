---
title: "Acceptance Criteria: Phase 10: goal-ending-carry"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "goal ending carry acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/010-goal-ending-carry"
    last_updated_at: "2026-11-14T07:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked every criterion Met from the saved test runs, the commit and the suite runs"
    next_safe_action: "None. Not merged or pushed, which parent decision D4 leaves to the operator"
    blockers: []
    key_files: [".skilled/hooks/session-relaunch/lib/relaunch-core.cjs", ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-goal-ending-carry"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: goal-ending-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 010-goal-ending-carry
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
| AC-001 | REQ-001 | Given a Claude log whose newest goal entry is met, failed or cleared, When `resolveGoalPacketResult` reads it, Then it returns `ended: true`, and for an active goal or no goal it returns `ended: false` | `scratch/red.txt` shows the resolver test failing before the edit with `undefined` where `true` was expected, and `scratch/green.txt` shows it passing after. Cited: `scratch/red.txt:2`, `scratch/red.txt:22`, `scratch/green.txt:2` | Met | - |
| AC-002 | REQ-002 | Given a note, When `recordGoalPacket` runs with `ended: true` and no packet, Then the note holds `goal_ended: true`, and a later call with a packet or without `ended` removes it | `scratch/red.txt` shows the recorder test failing before the edit with `false !== true`, and `scratch/green.txt` shows it passing after. Cited: `scratch/red.txt:4`, `scratch/red.txt:68`, `scratch/green.txt:4` | Met | - |
| AC-003 | REQ-003 | Given a Claude session with no goal entry whose claimed note carries `goal_ended: true`, When the resolver runs with the outgoing note's path, Then it carries no packet goal and reports `ended: true`, also for a log read only in part | `scratch/red.txt` shows the receiver test failing before the edit with `ended: false` expected and the parent packet returned, and `scratch/green.txt` shows it passing after. The test at line 2890 of `aee4ae8080` covers the whole log and a log of 17 entries of 1 MiB. Cited: `scratch/red.txt:3`, `scratch/red.txt:44`, `scratch/green.txt:3` | Met | - |
| AC-004 | REQ-004 | Given a Claude goal that was cleared, When `prepare` runs for the sender and then for a receiver that set no goal, Then both notes hold `goal_ended: true` and no `goal_packet` | `scratch/red.txt` shows the two-hop test failing before the edit with `ended: undefined`, and `scratch/green.txt` shows it passing after. Cited: `scratch/red.txt:5`, `scratch/red.txt:105`, `scratch/green.txt:5` | Met | - |
| AC-005 | REQ-005 | Given the fix commit, When it is inspected, Then it adds no module, no environment variable, no relaunch record key and no change to the wrapper | `git show --stat aee4ae8080` lists six files with none under `.skilled/bin`, and `git show aee4ae8080 \| rg -c '^new file'` prints nothing with exit 1. `rg -n 'goal_ended' .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` at the fix commit prints nothing, because the CLI passes `ended` through. Observed 2026-11-14. Cited: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:639` at `aee4ae8080` | Met | - |
| AC-006 | REQ-006 | Given a claimed note with the mark, When the session sets a goal of its own, Then that goal is carried with `ended: false`, and When another session claimed the note, Then the mark is ignored | The receiver test asserts `{ packet: GOAL_PACKET, reason: '', ended: false }` for a goal the receiver set and the parent packet for a note another session claimed, and the recorder test asserts the mark removed when a packet is carried again. Cited: `scratch/green.txt:3`, `scratch/green.txt:4` | Met | - |
| AC-007 | REQ-007 | Given the final state, When the relaunch and OpenCode plugin suites run, Then each passes | The fix commit message records 1547 of 1547 from 1543 before. This author reran `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` on 2026-11-14 on the working tree, which also holds the next commit's test, and it exited 0 with tests 1548, pass 1548 and fail 0. The 1547 figure was not rerun on the tree of `aee4ae8080` alone. Evidence is the verification section of the `git show aee4ae8080` commit message and this author's rerun, with no saved output file | Met | - |
| AC-008 | REQ-008 | Given the session-relaunch README, When it is searched, Then it names `goal_ended` and the lookup of the claimed note | `rg -n 'goal_ended' .skilled/hooks/session-relaunch/README.md` at the fix commit prints lines 177 and 182. Cited: `.skilled/hooks/session-relaunch/README.md:177` and `.skilled/hooks/session-relaunch/README.md:182` at `aee4ae8080` | Met | - |

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
