---
title: "Acceptance Criteria: Phase 45: vibe-automatic-handover"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vibe automatic handover acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/045-vibe-automatic-handover"
    last_updated_at: "2026-11-15T11:21:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-045-vibe-automatic-handover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 45: vibe-automatic-handover

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `045-vibe-automatic-handover`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the Vibe switch on, When a turn start or a tool call finds the fill past the threshold share of the compaction point, Then the session gets the hand-off text once, and below it gets nothing | `tests/vibe-adapters.test.cjs` "turn-start nudges past the threshold and stays quiet below it" and "post_tool nudges"; live `scratch/runs/hop1-vibe` and `hop2-vibe`: `prepare` logged with the session's own Vibe id | Met | - |
| AC-002 | REQ-002 | Given a prepared record, When the turn ends with no other part denying, Then the record is armed and the killer ends Vibe | live `hop1-vibe`: `killer-signal targetPid=78444 signal=SIGTERM`, then `relaunch reason=ready` 0.5 s later. `turn-end.test.mjs`: a deny before the hand-over part leaves the record `pending` | Met | - |
| AC-003 | REQ-003 | Given `skilled-loop vibe`, When the sender is ended, Then Vibe restarts on the claim seed and the receiver claims and closes the note | `score.cjs` printed `5/5` for `hop1-vibe` and `hop2-vibe`, the same as the Claude Code baseline `base1-claude`. Notes read `status: done` | Met | - |
| AC-004 | REQ-004 | Given the switch off, a missing folder or an unreadable file, When a hand-over part runs, Then the turn is untouched | `vibe-adapters.test.cjs` "the switch silences both parts", `compaction-post-tool.test.mjs` switch-off case, `readVibeUsage` returns null for a missing folder. Live `off1-vibe`: no `prepare`, no `killer-signal` | Met | - |
| AC-005 | REQ-005 | Given an armed hand-over, When the operator types a prompt, Then the hand-over is withdrawn and the session carries on | live `wd1-vibe`: `withdrawn reason=user-message`, then `killer-no-armed-record`, and the session answered with the code word | Met | - |
| AC-006 | REQ-006 | Given the playbooks, When an operator looks for the automatic tier, Then scenarios cover the hop, the withdraw and the switch off | `VIB-HK-027` (`relaunch-automatic-tier-conversation.md`) and the spec-kit `session-handover-vibe.md` scenario with VB-1 hop, VB-2 withdraw and VB-3 switch off, each `validate_document.py` VALID with 0 issues. The live runs `hop1-vibe`, `hop2-vibe`, `wd1-vibe` and `off1-vibe` followed those procedures | Met | - |
| AC-007 | REQ-007 | Given the same harness task, When Vibe and Claude Code each hop once, Then Vibe scores what Claude Code scores, with stage times recorded | `base1-claude` 5/5 (prepare 17.5 s, signal 6.2 s, relaunch 1.2 s, closed 35.1 s). `hop1-vibe` 5/5 (15.5, 38.7, 0.5, 67.4). `hop2-vibe` 5/5 (12.8, 19.4, 0.4, 42.1) | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
