---
title: "Acceptance Criteria: Phase 27: goal-rebind-claude-and-codex"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal rebind claude codex acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex"
    last_updated_at: "2026-10-25T02:00:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Closed every criterion with evidence; waived the Codex row under ADR-002"
    next_safe_action: "None for this phase; phase 028 follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-27-goal-rebind-claude-and-codex"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 27: goal-rebind-claude-and-codex

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a hop whose note names a packet, When a Claude receiver starts, Then the goal is set from `goal.md` or the fenced slice is requested, on the path phase 24 selected | Path: the goal command as the start prompt (probe A), claim as start context (ADR-001). Live: `scratch/claude-live-a/` through the real wrapper, hook and CLI in a private tmux server. The receiver transcript has `Goal set` with a 3,990-character condition (`extract-063c884d-*.txt`), a `SessionStart:startup` context carrying the claim (`receiver-start-context.txt`), then the `claim` and `complete` commands. The note reads claimed by the receiver and done, `RESUMED.marker` holds `OK`, `history.txt` shows handed-over, claimed, done. Tests: `skilled-loop.test.cjs` goal-command case, `claude-adapters.test.cjs` start-claim case | Met | - |
| AC-002 | REQ-002 | Given the same hop, When a Codex receiver starts, Then the seed asks the model to create the goal from the slice | Not built. No Codex receiver can be handed a packet: a hop restarts the runtime it left, a Codex sender writes no `goal_packet`, and its `thread_goals` table held 0 rows. See ADR-002; AC-007 pins the reason | Waived | ADR-002 |
| AC-003 | REQ-003 | Given an over-budget slice, no packet or the switch off, When the receiver starts, Then nothing is sent and one line says why | Wrapper tests for the switch off, no packet, lost `goal.md`, over budget, unknown budget and empty slice: start prompt stays the claim seed, no claim variable, and exactly one warning line for a named packet that is refused (none for the switch or no packet, which are not surprises). Helper tests refuse each case in one line. Against the earlier code 5 of 7 wrapper tests and 3 of 4 hook tests fail and the helper suite cannot load. Live: `scratch/claude-live-b-switch-off/` and `scratch/claude-live-c-over-budget/` receivers have 0 `goal_status` entries and claimed the note through the seed. The terminal line itself is not in the pane capture, because the TUI redraws over it; the wrapper test reads it | Met | - |
| AC-004 | REQ-004 | Given a sent slice, When compared with `goal.cjs packet` output, Then it is the `chat_slice` and nothing else | `goal-handover.test.cjs` compares the helper output with the independently parsed `chat_slice` byte for byte and checks no frontmatter, comment or log text; adversarial output with frontmatter or markup is refused. Live: the condition set in the receiver is 3,990 characters, the length of `scratch/claude-live-a/slice.txt` | Met | - |
| AC-005 | REQ-005 | Given a hop with no goal, When the receiver starts, Then the claim seed and compaction pointer behave as before | The 814 earlier tests pass unchanged inside the 833 of 833, in the set, unset and foreign loop environments. Live: `scratch/claude-live-b-switch-off/` receiver started on the claim seed prompt, claimed and completed the note with no goal | Met | - |
| AC-006 | REQ-001 | Given a Hermes hop with the switch on and a packet in the note, When the wrapper relaunches, Then `HERMES_SPEC_FOLDER` is the packet for that hop only, and with the switch off or no packet nothing is exported and the operator's own value is kept | Three wrapper tests: export on the goal hop only, none with the switch off or no packet, operator value put back on a hop with no goal. The mutation that removes the restore fails the third. Other runtimes get no variable | Met | - |
| AC-007 | REQ-002 | Given a Codex sender, When the hand-over is prepared, Then the note carries no `goal_packet`, so the Codex seed path has no input | `relaunch-core.test.cjs` answers empty for a Codex sender with a `goal.md` in its spec folder, and `armableRecord` refuses a record of another runtime. `sqlite3` read of `~/.codex/goals_1.sqlite` `thread_goals`: 0 rows | Met | - |

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

Every row is Met except AC-002, which is waived under ADR-002 because the Codex path has no reachable input, and AC-007 records that reason as a checked fact. The relaunch gate went from 814 to 833 of 833, exit 0, in the set, unset and foreign loop environments. Against the code before this phase, 5 of 7 new wrapper tests and 3 of 4 new hook tests fail and the helper suite cannot load. The remaining new tests pin behavior that must not change.
<!-- /ANCHOR:closure -->
