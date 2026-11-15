---
title: "Acceptance Criteria: Phase 44: in-session-handover-rename"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "in session handover rename acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/044-in-session-handover-rename"
    last_updated_at: "2026-11-15T07:49:01Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-044-in-session-handover-rename"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 44: in-session-handover-rename

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `044-in-session-handover-rename`
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
| AC-001 | REQ-001 | Given the renamed tree, When the inventory grep runs with spec-folder names, changelogs, benchmark reports, archives and generated indexes excluded, Then it prints 0 lines | `git grep -I -i -E "session[-_ ]?relaunch"` with that pathspec, piped through `grep -v -E "[0-9]{3}-session-relaunch\|--session-relaunch" \| wc -l`, printed 0. Every remaining file names only a protected spec folder or is a generated index built from spec text | Met | - |
| AC-002 | REQ-002 | Given the renamed tree, When `HOOKDIR=session-handover bash scratch/gate.sh` runs, Then every suite prints its baseline count and both sync checks pass | Relaunch 1,567/0, flags 31/0 (30 plus the second-spelling test), Pi 67, `tsc` 0, goal 203/0, Vibe 48/0, doctor 17/0, spec gate 107/0, writer 75, hook sync PASS (35 hooks, 22 Pi extensions), mirror sync PASS (257), drift 4 PASS, advisor commands 14/14, env drift 5/5, README manifest and parity PASS | Met | - |
| AC-003 | REQ-003 | Given a Claude Code session started through `skilled-loop`, When it hands over, Then the receiver starts on `[session-handover] claim and continue handoff`, claims the note and reports the code word | `scratch/runs/short1-claude`: log `prepare`, `killer-signal`, `relaunch reason=ready`, note under `.state/session-handover/handoffs` with `status: done`, receiver reported ORCHID-10230, `score.cjs` printed `5/5` | Met | - |
| AC-004 | REQ-004 | Given an operator who set an old variable or holds an open note, When they read the v4.0.2.2 release note, Then it names each new variable, the state folder move and the registration command | `.skilled/changelog/skilled/v4.0.2.2.md` Upgrade Notes: replace `SESSION_RELAUNCH` with `SESSION_HANDOVER`, move `.state/session-relaunch/` to `.state/session-handover/`, run `sync-hook-registrations.cjs`. Shape gate, hvr_scan, `validate_document.py` and `extract_structure.py` all exit 0 | Met | - |
| AC-005 | REQ-005 | Given Codex with no other switch set, When only a `SYSTEM_IN_SESSION_HANDOVER_*` switch holds a value, Then both flag readers follow it, and when the main switch also holds a value the main one decides | `hook-flags.test.cjs` test "the in-session switch names answer only while the main name is blank, in both readers": seven cases, node and shell agree, the deciding switch named, 31/0 | Met | - |
| AC-006 | REQ-006 | Given the advisor, When a prompt says "session handover", "in session handover" or "session-handover", Then the result names `/speckit:handoff` | Worktree: all three name `/speckit:handoff` (command-speckit-handoff 0.85 to 0.87). Main: none of the three names a command | Met | - |
| AC-007 | REQ-007 | Given the parent packet, When its goal and spec are read, Then both are titled "Session handover loop" | `goal.md` and `spec.md` title and H1 read "Session handover loop" | Met | - |

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
