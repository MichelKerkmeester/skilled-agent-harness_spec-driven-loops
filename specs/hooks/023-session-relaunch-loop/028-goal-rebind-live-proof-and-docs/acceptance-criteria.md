---
title: "Acceptance Criteria: Phase 28: goal-rebind-live-proof-and-docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal rebind live proof acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs"
    last_updated_at: "2026-10-25T01:10:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Marked each criterion against the live runs and recorded the OpenCode 2 hop as Unmet"
    next_safe_action: "Operator decides on the OpenCode 2 hop defect"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-28-goal-rebind-live-proof-and-docs"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 28: goal-rebind-live-proof-and-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a sender with an active goal, When a live hop completes, Then the receiver shows the same packet goal, read from the receiver | A transcript and receiver status per runtime with credentials | Superseded | ADR-001 |
| AC-002 | REQ-002 | Given the switch off or a sender with no goal, When a live hop completes, Then the receiver has no goal | The two control transcripts per runtime | Superseded | ADR-001 |
| AC-003 | REQ-003 | Given a runtime that cannot run, When recorded, Then it is a SKIP with its reason | Cursor: `cursor-agent about` printed `User Email         Not logged in` (`scratch/availability/cursor-about.txt`). Hermes: exit 1 with `Billing or credits exhausted: HTTP 402: You've reached the daily pacing allowance on the pro plan` (`scratch/availability/hermes-probe.txt`). Codex goal hop: not run, a Codex hop carries no packet by design (phase 27 ADR-002), so only the no-goal control ran (AC-007). Each runtime was checked once and not retried | Met | - |
| AC-004 | REQ-004 | Given the changed docs, When read, Then they describe the behavior, the switch and the limits | `rg -n "SESSION_RELAUNCH_GOAL" .skilled/hooks/session-relaunch/README.md .skilled/hooks/goal/goal-plugin.md .skilled/commands/speckit/handoff.md` lists the switch in each. The three relaunch playbooks carry the Goal Carry-Over checks (`rg -n "Goal Carry-Over Checks"` finds three), the feature catalog entry carries a Goal Carry-Over section, and the README, goal plugin doc and handoff command state the OpenCode 2 and Devin or Cursor limits. `validate-playbook-package.cjs --package system-spec-kit` printed `PASS ... violations=0`; `validate_catalog_package.py --package system-spec-kit --strict` printed `PASS ... violations=0` | Met | - |
| AC-005 | REQ-005 | Given both parents, When validated recursively, Then `RESULT: PASSED` prints | `validate.sh specs/hooks/023-session-relaunch-loop --strict --recursive` printed `RESULT: PASSED` for all 30 folders (the parent and 29 children), exit 0, `Errors: 0 Warnings: 0` each. `validate.sh specs/sk-doc/060-create-goal-mode --strict --recursive` printed `RESULT: PASSED` for all 16 folders, exit 0. The 060 spec has no relaunch phase row, so nothing was added there and it was not edited | Met | - |
| AC-006 | REQ-001 | Given a Claude or Pi sender with an active goal, When a live hop completes, Then the receiver shows the same packet goal, read from the receiver and not the sender | Claude: `scratch/claude-a-goal/` note carried `goal_packet: specs/demo/001-demo`, receiver log has `goal_status` with a 3,990-character condition and `goal-start-claim` is in `relaunch.log`, `GOALENV.marker` is the packet. Pi: `scratch/pi-a-goal/` note carried the packet, the receiver log has `goal-context-restore` naming goal id `goal-31277a81...` against the sender's `goal-90d89492...`, two records, `GOALENV.marker` is the packet. Both notes went open, claimed, done | Met | - |
| AC-007 | REQ-002 | Given the switch off or a sender with no goal, When a live hop completes on Claude or Pi, or a Codex hop completes, Then the receiver has no goal | Claude: `claude-b-switch-off/` (note kept the packet, receiver had no `goal_status`, `EMPTY`) and `claude-c-no-goal/` (no `goal_packet`, no `goal_status`, `EMPTY`). Pi: `pi-b-switch-off/` (receiver log has 0 goal blocks, one record, `EMPTY`), `pi-b2-switch-off-at-prepare/` and `pi-c-no-goal/` (no record, 0 goal blocks). Codex: `codex-c-no-goal/` note has no `goal_packet`, `GOALENV.marker` is `EMPTY`, note done. A Claude over-limit control is in phase 27 `scratch/claude-live-c-over-budget/` | Met | - |
| AC-008 | REQ-001 | Given OpenCode 2 or Devin started with the hand-over variable set by hand, When the first session runs, Then it binds the packet, and with the switch off or no variable it binds nothing. This is the receiver half and not a hop | OpenCode 2: `opencode-receiver-a-goal/` (model quoted `active_goal:goal-14f90962...`, the one record's id), `-b-switch-off/` and `-c-no-goal/` (`NONE`, no record). Devin: `devin-receiver-a-goal/` (reply `[active_goal:goal-43dcf9cc...]`, one `runtime=devin` record), `-b-switch-off/` and `-c-no-goal/` (`NONE`, no record). Two earlier OpenCode runs answered through a different model and failed on billing, so they are kept as `opencode-receiver-*-discarded-run1/` and were rerun | Met | - |
| AC-009 | REQ-001 | Given an OpenCode 2 sender with an active goal, When a live hop completes, Then the receiver shows the same packet goal | Run `scratch/opencode-a-hop-attempt/`: the sender's note carried the packet, the killer logged `killer-signal` and no `relaunch` line followed, the TUI stayed up showing `Connection lost... Reconnecting to the server automatically` and the note stayed open. Likely cause, inferred from `opencode-process-tree.txt` and the plugin source: the plugin passes its own pid, which is probably the TUI's server child. A fix belongs to the owning phase test-first, then this hop reruns | Unmet | - |
| AC-010 | REQ-001 | Given a Devin sender with an active goal, When a live hop completes, Then the receiver shows the same packet goal | No hop can run: Devin ships on the command trigger, nothing arms its record, and the printed manual command is a first launch that drops the packet. AC-008 covers the receiver half. See ADR-002 | Waived | ADR-002 |

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

AC-009 is Unmet: the OpenCode 2 hop did not reach the receiver, because the killer signalled a process that is not the TUI. Every other row is Met, Superseded or Waived. The packet closes when that hop is repaired in its owning phase and rerun with a goal, or when the operator waives it under a new decision record.
<!-- /ANCHOR:closure -->
