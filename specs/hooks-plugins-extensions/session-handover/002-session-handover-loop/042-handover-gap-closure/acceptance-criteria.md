---
title: "Acceptance Criteria: Handover gap closure on Pi, OpenCode and Codex"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handover gap closure acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/042-handover-gap-closure"
    last_updated_at: "2026-11-15T05:18:58Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-042-handover-gap-closure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Handover gap closure on Pi, OpenCode and Codex

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 042-handover-gap-closure
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a pending Pi record, When the model calls `question` or `ask_user_question`, Then the call is blocked with the note path | Test "tool_call refuses a question dialog while this session holds a pending hand-over" failed before the fix and passes. Live `qguardfix-pi`: "called Question ×3 · 2 failed", then `cancel` and an answered dialog with nothing armed, against `qguard-pi` waiting 4 m 54 s on a prepared record | Met | - |
| AC-002 | REQ-001 | Given a pending OpenCode record, When the model calls `question`, Then the call throws with the note path | Test "tool.execute.before refuses the question tool while this session holds a pending hand-over" failed before the fix and passes. Live `qguardfix-opencode`: the note says the guard refused the dialog and the receiver must ask, `relaunch loopId=22287 reason=ready`, against `qguard-opencode` stuck on the open dialog | Met | - |
| AC-003 | REQ-002 | Given an armed Pi record, When a new run withdraws it, Then a steer carries the withdrawn notice | Test "agent_start tells the model its armed hand-over was withdrawn, once" failed before the fix and passes. Live `withdrawfix-pi`: "The prepared hand-over was withdrawn when your new prompt arrived", against `withdraw-pi`: "I should stop now so the loop can relaunch" | Met | - |
| AC-004 | REQ-002 | Given an armed OpenCode record, When a new user message withdraws it, Then every request of that turn carries the notice until the next prompt | Test "a withdrawn arm tells the session through the system prompt until its next prompt" failed before the fix and passes. Live `withdrawfix-opencode`: "Withdrawn ... the killer never relaunched", against `withdrawbase-opencode`: "the record is armed and this session should go idle". The fixed run also read the hop history, so the live reply alone does not prove it read the notice | Met | - |
| AC-005 | REQ-003 | Given a Codex session with an open note, When Codex starts it again with `source: compact`, Then the level resets and the pointer names the note | Tests "compact-pointer points a compacted Codex session at its open note and resets the nudge level" and the startup case failed before the fix and pass, with the registry test. Live `compactclone-codex`: `compact-pointer sessionId=01a1ddbf...`, then the model ran `git log --since='2026-11-15T05:48:13.841Z' && git status`, which only the pointer text names | Met | - |
| AC-006 | REQ-004 | Given the five gaps, When each was probed live, Then each has a before run and an outcome | `scratch/runs/` holds the qguard, withdraw, modelroute, compactfix and goal runs, and `implementation-summary.md` names each outcome, including OpenCode model carry with no route and Codex goal carry working | Met | - |
| AC-007 | REQ-005 | Given Claude's guard on the shared check, When its suite runs, Then its behavior and text are unchanged | `subagent-guard.test.cjs` prints 23 passed, 0 failed, and live `qguard-claude` refused the dialog and moved the question into the note | Met | - |
| AC-008 | REQ-001 | Given the final tree, When the relaunch, plugin, flag, Pi and goal suites, the Pi type check and both sync checks run, Then none fails | 1,564, 29, 67 and 200 passed with 0 failed, `tsc` exit 0, both sync checks PASS | Met | - |

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

Every criterion is met by a test that failed first and a live run on the fixed code.
<!-- /ANCHOR:closure -->
