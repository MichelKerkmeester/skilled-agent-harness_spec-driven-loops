---
title: "Acceptance Criteria: Phase 18: outside-loop-handoff"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "outside loop handoff acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/018-outside-loop-handoff"
    last_updated_at: "2026-10-21T08:30:00Z"
    last_updated_by: "worker"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/claude/compact-pointer.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-outside-loop-handoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 18: outside-loop-handoff

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/018-outside-loop-handoff
**Level:** 2
**Status:** Complete
**Date:** 2026-10-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a session with no `SKILLED_LOOP_ID` at 90% fill, When any automatic adapter nudges, Then the text asks for `keep` with its runtime and holds no `prepare --handoff` | `adapter-conformance.test.cjs` case for Claude, Codex, Hermes and OpenCode, and the Pi suite's matching case | Met | - |
| AC-002 | REQ-002 | Given a valid note outside the loop, When `keep` runs, Then it exits 0, prints the claim command and records `note-kept`; inside the loop it exits 2 naming `prepare` | `hop-history.test.cjs` "keep outside the loop records a note-kept line and prints the claim command"; live run exit 0 | Met | - |
| AC-003 | REQ-003 | Given a session inside the loop, When it nudges and prepares, Then the text and exit codes are unchanged | the existing handoff text, CLI and conformance tests pass with a loop id set | Met | - |
| AC-004 | REQ-001 | Given a session outside the loop that already has an open note, When the fill passes the next level, Then the nudge stays quiet with reason `note-open` | `nudge.test.cjs` `nudgeDecision` case; the live run showed the re-nudge this prevents | Met | - |
| AC-005 | REQ-004 | Given a Claude compaction and an open note, When `SessionStart` arrives with `source: compact`, Then the level resets to 0 and the claim instructions are added; with a fresh start, no open note or a prepared hop, nothing is added | three `compact-pointer` tests in `claude-adapters.test.cjs`; removing the prepared-hop guard fails its test; live `compact-pointer` log line and level 0 | Met | - |
| AC-006 | REQ-005 | Given an open note, When `history` runs, Then it prints `open notes: N handoff note(s) not claimed yet, oldest <name>` until the note is claimed, and `/doctor:setup` shows that line | `hop-history.test.cjs` open-notes test; doctor workflow step and presentation line; doctor tests 406/406 | Met | - |
| AC-007 | REQ-001, REQ-004 | Given a live Claude session outside the loop, When it passes the threshold and is then compacted, Then the history shows `note-kept`, `claimed` and `done` for its note | tmux run 2026-10-21 08:09 to 08:12 UTC, note `20261021T080927Z-00d3645c.md` ends `status: done` | Met | - |
| AC-008 | REQ-006 | Given the touched docs, When validated, Then each passes `validate_document.py` and keeps its HVR hard-blocker count | 0 issues on every touched doc; blocker counts equal their base files | Met | - |
| AC-009 | REQ-003 | Given the whole session-relaunch suite, When run, Then it passes with no lost tests | 616/616 (baseline 610 plus 6), Pi 40/40, registry sync 7/7 | Met | - |

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

The live run and the new tests carried the packet. The pointer after a compaction exists on Claude Code only; the other runtimes rely on the claim command `keep` prints.
<!-- /ANCHOR:closure -->
