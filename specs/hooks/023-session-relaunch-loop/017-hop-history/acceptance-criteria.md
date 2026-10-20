---
title: "Acceptance Criteria: Phase 17: hop-history"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hop history acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/017-hop-history"
    last_updated_at: "2026-10-20T20:30:00Z"
    last_updated_by: "worker"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/hop-history.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-hop-history"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 17: hop-history

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/017-hop-history
**Level:** 2
**Status:** Complete
**Date:** 2026-10-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an armed record, When the wrapper relaunches and the new session claims and completes the note, Then the history holds `handed-over`, `claimed` and `done` lines with the hop number, cwd, goal and note name | `hop-history.test.cjs` tests 1 and 3; live hop 2026-10-20T20:21:49Z wrote all three lines | Met | - |
| AC-002 | REQ-001 | Given a stalled hop, When the killer gives up, Then the history holds a `timed-out` line | `killer.test.cjs` asserts a `\ttimed-out\tclaude\t` line and fails without the wiring | Met | - |
| AC-003 | REQ-002 | Given an unwritable state directory or an unreadable note, When an event is recorded, Then the hop goes on and `recordHop` returns false | `recordHop` wraps the write in try and catch; the note read falls back to empty fields | Met | - |
| AC-004 | REQ-003 | Given no history, When `history` runs, Then it prints `no hop recorded yet` and exits 0; given `--last zero`, it exits 2 | `hop-history.test.cjs` tests 4 and 5 | Met | - |
| AC-005 | REQ-004 | Given `/doctor:setup`, When it finishes the legs, Then it shows a `Last session hop:` line that never changes the status | `doctor-setup.yaml` step and presentation line; doctor tests pass and `route-validate` reports 14 routes OK | Met | - |
| AC-006 | REQ-005 | Given the switch unset, When a hop hands over, Then no notice runs; given `SESSION_RELAUNCH_NOTIFY_HOPS=1` in the hook-flags file, Then a "Session handed over" notice runs | `hop-history.test.cjs` tests 6 and 7 with a stub `osascript`; the example file keeps the line commented | Met | - |
| AC-007 | REQ-006 | Given the touched docs, When validated, Then each passes `validate_document.py` with no new HVR hard blockers | concern README, tests README, feature catalog entry and root README 0 issues; ENV-REFERENCE keeps only its pre-existing blockers | Met | - |
| AC-008 | REQ-001 | Given the whole session-relaunch suite, When run, Then it passes with the new tests and no lost tests | 597/597 (baseline 589 plus 8), Pi 40/40 | Met | - |

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

The live hop and the eight new tests carried the packet. Hops from before this phase are not in the history, and the notice stays macOS-only and off for clones.
<!-- /ANCHOR:closure -->
