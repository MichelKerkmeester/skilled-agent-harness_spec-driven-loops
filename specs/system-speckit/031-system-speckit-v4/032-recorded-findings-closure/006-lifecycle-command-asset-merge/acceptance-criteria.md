---
title: "Acceptance Criteria: Phase 6: lifecycle-command-asset-merge"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lifecycle command merge acceptance criteria"
  - "execution mode branch closure gate"
  - "save context tail criterion"
  - "command tree parity ac"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/006-lifecycle-command-asset-merge"
    last_updated_at: "2026-09-07T15:05:47Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: lifecycle-command-asset-merge

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/006-lifecycle-command-asset-merge
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `/speckit:plan`, `/speckit:implement` and `/speckit:complete`, When their asset directory is listed, Then each resolves to one workflow asset with an execution-mode branch and a declared checkpoint list | `ls .opencode/commands/speckit/assets/speckit-{plan,implement,complete}*.yaml` lists three files | Met | - |
| AC-002 | REQ-002 | Given the three merged assets, When `save_context` is searched, Then the step body is defined once and referenced by all three | `grep -rn 'save_context' .opencode/commands/speckit/assets/` | Met | - |
| AC-003 | REQ-003 | Given the three merged assets, When every `validate.sh [SPEC_FOLDER] --strict` call site is read, Then each carries a one-line cadence comment | manual diff of every call site against the pre-merge files | Met | - |
| AC-004 | REQ-004 | Given the merged assets, When the parity and mirror checks run, Then both pass | `bash .opencode/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` and `node .../runtime-mirrors/sync-runtime-mirrors.cjs --check` | Met | - |
| AC-005 | REQ-005 | Given the three merged assets, When their step names are extracted, Then no command's step sequence duplicates another's verbatim beyond `complete`'s documented reuse | step-name extraction script output compared across the three files | Met | - |

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

Planning only. No criterion is met yet. The merge, the shared tail extraction and the cadence comments have not started.
<!-- /ANCHOR:closure -->
