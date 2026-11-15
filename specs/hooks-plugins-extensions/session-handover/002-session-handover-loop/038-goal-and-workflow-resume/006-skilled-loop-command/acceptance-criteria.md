---
title: "Acceptance Criteria: Phase 6: skilled-loop-command"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "skilled loop command acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/006-skilled-loop-command"
    last_updated_at: "2026-11-12T22:42:06Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-skilled-loop-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: skilled-loop-command

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 006-skilled-loop-command
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given bash or zsh sources the shim, When the new case runs, Then `command -v skilled-loop` prints `skilled-loop` and the function calls the wrapper with `bash` | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` (new case) Observed 2026-11-13: the new case passes in `scratch/green.txt` and failed in `scratch/red.txt`: `command -v skilled-loop` prints `skilled-loop` in bash and zsh. | Met | - |
| AC-002 | REQ-002 | Given the existing shell cases, When `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` runs, Then wrapper resolution, passthrough and snapshot cases pass | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` Observed 2026-11-13: the existing shell cases pass in `scratch/green.txt`. | Met | - |
| AC-003 | REQ-003 | Given the cursor and devin printed manual commands, When `skilled-loop-wrapper-claim-goal.test.cjs` runs, Then lines 160-170 keep the same `skilled-loop cursor` and `skilled-loop devin` text | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` Observed 2026-11-13: `skilled-loop-wrapper-claim-goal.test.cjs` passes in the final full run with the printed commands unchanged. | Met | - |

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

All 3 criteria are Met with observed evidence. The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0. The evidence is pinned to the working tree of branch `worktrees/358-handover-goal-resume` before its commit.
<!-- /ANCHOR:closure -->
