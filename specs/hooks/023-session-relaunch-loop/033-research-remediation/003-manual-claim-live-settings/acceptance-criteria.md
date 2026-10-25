---
title: "Acceptance Criteria: Phase 3: manual-claim-live-settings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "manual claim live settings acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-manual-claim-live-settings"
    last_updated_at: "2026-10-25T13:42:28Z"
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
# Acceptance Criteria: Phase 3: manual-claim-live-settings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/003-manual-claim-live-settings
**Level:** 2
**Status:** Draft
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | **Given** a Claude launch on Sonnet low and a consumed record with Opus medium on a declined hop, **When** the manual command prints, **Then** it holds the Opus model and `--effort medium` and not Sonnet | `skilled-loop.test.cjs` "manual command carries the live model and effort", red before. Evidence: | Unmet | - |
| AC-002 | REQ-004 | **Given** a Cursor run whose record holds a live model, **When** the manual command prints, **Then** it holds `--model <that model>` | Test "Cursor manual command carries the live Cursor model". Evidence: | Unmet | - |
| AC-003 | REQ-003, REQ-005 | **Given** a record with no live values, **When** the manual command prints, **Then** it equals the pre-change output | Existing manual command tests pass unedited. Evidence: | Unmet | - |
| AC-004 | REQ-001 | **Given** a live model that fails the model check, **When** the command prints, **Then** it keeps the launch model | Test "manual command keeps the launch model for an invalid live model", a regression guard: green before and after the change. Evidence: | Unmet | - |
| AC-005 | REQ-006 | **Given** a Claude launch on Sonnet and a first hop whose record switched to Opus, **When** a later hop declines with a record holding no live values, **Then** the printed manual command holds the Opus model and not Sonnet, and the `SKILLED_LOOP_MANUAL_TEMPLATE` exported to that hop holds Opus too | `skilled-loop.test.cjs` "manual command after a model-switching hop carries the current hop's model", red before. Evidence: | Unmet | - |

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

Not closed yet. This statement is written when the packet closes.
<!-- /ANCHOR:closure -->
