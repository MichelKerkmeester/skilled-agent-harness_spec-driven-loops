---
title: "Acceptance Criteria: Phase 2: scripts-into-runtime-nesting"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting"
    last_updated_at: "2026-09-05T06:13:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-002-scripts-into-runtime-nesting"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: scripts-into-runtime-nesting

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting
**Level:** 2
**Status:** Planned
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the T001 `rg` hit list, When each hit is classified live-consumer or prose, Then every live hit names its resolving mechanism (import, exec, config-string) and every count is grouped by consumer class | `spec.md` Scope section's per-class counts, traceable to the saved hit list | Unmet | - |
| AC-002 | REQ-002 | Given the `runtime/scripts/` collision, When the target-layout decision is recorded, Then `spec.md` names the chosen layout (`runtime/cli/`) and states why it was chosen over folding `runtime/scripts/`'s three files into the incoming tree | `spec.md` Scope section, In Scope bullet 2 | Unmet | - |
| AC-003 | REQ-003 | Given this folder, When `recommend-level.sh` runs against it, Then its numeric score and recommended level are recorded here | Command output pasted into this row's Verification cell once run: `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` | Unmet | - |
| AC-004 | REQ-004 | Given the execution-phase handoff, When it is created, Then its `spec.md` opens with the atomic-commit plan (one `git mv` plus freshness/hook/workspace/CLAUDE.md updates in the same commit) and cites packet 053's review-loop precedent by folder path | The created execution packet's `spec.md`, once it exists | Unmet | - |

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

All four criteria are Unmet; the resolution-based inventory and the level re-check have not run yet.
<!-- /ANCHOR:closure -->
