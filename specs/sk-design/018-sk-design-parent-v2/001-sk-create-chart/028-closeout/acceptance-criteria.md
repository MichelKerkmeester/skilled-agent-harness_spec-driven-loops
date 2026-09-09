---
title: "Acceptance Criteria: close every recorded item across the chart phases"
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
    packet_pointer: "scaffold/028-closeout"
    last_updated_at: "2026-09-09T17:46:09Z"
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
# Acceptance Criteria: close every recorded item across the chart phases

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** [PACKET-ID]
**Level:** [2/3/3+]
**Status:** [Draft/In Progress/Complete]
**Date:** 2026-09-09
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the repaired `metric-block` guard, When a form drawing no metric header loses its declaration, Then the corpus fails | Stripping the block from `bar-columns` now reports `no METRIC block`; it did not before. Family went from deliveries-only to 122 assertions | Met | - |
| AC-002 | REQ-001 | Given the `palette-derivation` family, When any of its five branches is mutated, Then each fails on its own message | Five mutations run: a value from nowhere, a moved reference, a departure nothing forces, a shipped departure under its gate, and no derivation at all | Met | - |
| AC-003 | REQ-001 | Given the reverse `points` assertion, When a form declaring none paints a visible circle or builds one unreadably, Then both fail | Both mutations reported on `bar-line-composed` | Met | - |
| AC-004 | REQ-001 | Given the corrected colour prose, When it is read against the palette, Then every claim in it is measured | All four categorical hues verified clearing the mark gate on both grounds; the rotation illustration removed | Met | - |
| AC-005 | REQ-002 | Given the suite, When it runs, Then it passes without reaching outside the packet, and each new test fails when what it asserts is broken | 9 pass; removing the evilcharts sidecar and corrupting the palette pin each produce failures | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
