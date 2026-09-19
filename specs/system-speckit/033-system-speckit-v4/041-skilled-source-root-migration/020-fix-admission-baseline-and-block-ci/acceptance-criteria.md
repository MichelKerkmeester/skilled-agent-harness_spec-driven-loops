---
title: "Acceptance Criteria: Phase 20: fix-admission-baseline-and-block-ci"
description: "The criteria phase 20 must satisfy before it may close."
trigger_phrases:
  - "admission baseline fix acceptance"
  - "phase 20 closure gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/020-fix-admission-baseline-and-block-ci"
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
    open_questions:
      - "Should mode hints be honored in every hub's compiler, or only where gold asks for them?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 20: fix-admission-baseline-and-block-ci

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 041-skilled-source-root-migration/020-fix-admission-baseline-and-block-ci
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
| AC-001 | REQ-001 | Given the fixes, When the admission check runs over all hubs, Then every admitted hub passes | `compiled-route-admission.cjs --all` | Unmet | - |
| AC-002 | REQ-002 | Given the before and after reports, When compared, Then no passing scenario regresses | A report diff | Unmet | - |
| AC-003 | REQ-003 | Given the re-mint, When the route guard runs, Then every hub is fresh | The guard | Unmet | - |
| AC-004 | REQ-004 | Given a push, When CI runs, Then the admission step blocks | A CI run ID | Unmet | - |

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
