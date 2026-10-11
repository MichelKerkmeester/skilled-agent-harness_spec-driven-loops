---
title: "Acceptance Criteria: Phase 7: advisor-and-cross-skill-wiring"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor and cross skill wiring acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring"
    last_updated_at: "2026-10-10T18:23:53Z"
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
# Acceptance Criteria: Phase 7: advisor-and-cross-skill-wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/039-deprecate-improvement-modes/007-advisor-and-cross-skill-wiring
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
| AC-001 | REQ-001 | Given the finished work units, When the advisor suites run, Then typecheck, vitest, Python tests and the regression set match or beat the baseline; no alias, anchor or projection names a removed mode | Typecheck 0; vitest 2 pre-existing failures (baseline 7); pytests 0; regression 82/84 as baseline; no alias, anchor or projection names a removed mode | Met | - |
| AC-002 | REQ-002 | Given the finished work units, When sk-create-benchmark `SKILL.md` is read, Then `FAMILIES` lists behavior_benchmark and mcp_promotion only and sk-doc tests pass | `FAMILIES = ["behavior_benchmark", "mcp_promotion"]`; sk-doc pytests 171 passed | Met | - |
| AC-003 | REQ-003 | Given the finished work units, When the unit searches run, Then no live mention remains in the listed files | Removed-name search over every changed live file returns nothing | Met | - |

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

All three criteria are Met with command evidence; the phase is closeable.
<!-- /ANCHOR:closure -->
