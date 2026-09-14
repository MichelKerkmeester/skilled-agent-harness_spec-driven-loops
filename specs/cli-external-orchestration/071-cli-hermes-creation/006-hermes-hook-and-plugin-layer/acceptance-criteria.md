---
title: "Acceptance Criteria: Phase 5: hermes-hook-and-plugin-layer"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/006-hermes-hook-and-plugin-layer"
    last_updated_at: "2026-09-14T17:24:48Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: hermes-hook-and-plugin-layer

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer
**Level:** 3
**Status:** Complete
**Date:** 2026-09-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the plugin directory, When `hermes plugins validate` and `hermes plugins doctor` run, Then both pass | validate: "Validation passed" (2026-09-14); doctor: recorded in implementation-summary.md | Met | - |
| AC-002 | REQ-002 | Given a live session with the plugin enabled, When a `hermes chat` self-dispatch and an evidence-free completion claim occur, Then both are blocked | Live 2026-09-14: the nested dispatch was refused with the plugin message; the completion-evidence nudge stays advisory and fires only in a bound session | Met | - |
| AC-003 | REQ-003 | Given a broken or unreachable core, When a hook runs, Then it passes (fail-open) | Harness with node hidden: preflight unreachable -> None; every hook wrapped in try/except | Met | - |
| AC-005 | REQ-002 | Given a read-only leaf (`SPECKIT_HERMES_READ_ONLY=1`), When a write or terminal tool is called, Then the plugin blocks it and reads still pass | `test_repo_guards.py`: `test_read_only_leaf_refuses_writes_and_commands_but_reads`; live second-pass playbook run | Met | - |
| AC-006 | REQ-002 | Given a git command an sk-git rule flags, When it runs in a Hermes session, Then the advisory text reaches the tool result | `test_git_advisory_reaches_the_tool_result`; live second-pass playbook run | Met | - |
| AC-007 | REQ-002 | Given `HERMES_SPEC_FOLDER`, When the session starts, Then the prompt section names the packet and quotes its goal slice | `test_goal_slice_comes_from_the_bound_packet`, `test_session_section_carries_the_goal_and_the_read_only_notice`; live second-pass playbook run | Met | - |
| AC-004 | REQ-004 | Given the plugin, When its imports are read, Then only the standard library and the already-present node cores are used | `__init__.py` imports json, os, re, subprocess, pathlib, typing | Met | - |

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

All four criteria are met; the live block was observed in a Hermes session.
<!-- /ANCHOR:closure -->
