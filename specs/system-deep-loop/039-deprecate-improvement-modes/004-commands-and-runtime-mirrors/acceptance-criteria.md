---
title: "Acceptance Criteria: Phase 4: commands-and-runtime-mirrors"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "commands and runtime mirrors acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/004-commands-and-runtime-mirrors"
    last_updated_at: "2026-10-10T18:23:51Z"
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
# Acceptance Criteria: Phase 4: commands-and-runtime-mirrors

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/039-deprecate-improvement-modes/004-commands-and-runtime-mirrors
**Level:** 2
**Status:** Complete
**Date:** 2026-10-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the finished work units, When the commands, assets and agent are deleted, Then `ls .skilled/commands/deep .skilled/agents` lists none of them | `ls .skilled/commands/deep` lists 3 commands; agent gone. `.skilled/commands/README.txt:45` | Met | - |
| AC-002 | REQ-002 | Given the finished work units, When the generators run in check mode, Then codex, pi and hermes `--check` exit 0 and the symlink scan prints nothing | Generators and doctor pass; no new broken symlink. `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs:36` | Met | - |
| AC-003 | REQ-003 | Given the finished work units, When `dispatch-guard.cjs` is read, Then its set holds `deep-research` and `deep-review` only | `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:74` holds two agents | Met | - |

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

Every command, agent, copy and symlink is gone and the generators agree. The plugin guard tests wait on phase 006 by design.
<!-- /ANCHOR:closure -->
