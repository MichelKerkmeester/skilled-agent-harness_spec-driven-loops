---
title: "Acceptance Criteria: Phase 19: refresh-rollback-snapshots-on-re-mint"
description: "The criteria phase 19 must satisfy before it may close."
trigger_phrases:
  - "rollback snapshot refresh acceptance"
  - "phase 19 closure gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/019-refresh-rollback-snapshots-on-re-mint"
    last_updated_at: "2026-09-19T06:44:20Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Planned the phase"
    next_safe_action: "Start the build when the operator says so"
    blockers:
      - "Planned, not built"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 19: refresh-rollback-snapshots-on-re-mint

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/019-refresh-rollback-snapshots-on-re-mint
**Level:** 2
**Status:** Planned
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a compiled-serving hub, When it is re-minted, Then its snapshot names the new policy with legacy authority | A unit test | Unmet | - |
| AC-002 | REQ-002 | Given the change, When every hub is resolved, Then serving is unchanged | The route guard and admission check | Unmet | - |
| AC-003 | REQ-003 | Given the harness, When it runs, Then its rollback and reflip checks pass | The harness output | Unmet | - |
| AC-004 | REQ-004 | Given the five snapshots, When they are refreshed, Then each names its hub's current policy | A hash comparison | Unmet | - |

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

The phase is planned, not built.
<!-- /ANCHOR:closure -->
