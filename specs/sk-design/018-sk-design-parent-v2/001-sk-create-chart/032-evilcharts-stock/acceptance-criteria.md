---
title: "Acceptance Criteria: make evilcharts the stock register and fix the ranked ladder"
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
    packet_pointer: "scaffold/032-evilcharts-stock"
    last_updated_at: "2026-09-10T05:16:46Z"
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
# Acceptance Criteria: make evilcharts the stock register and fix the ranked ladder

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
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the palette source, When the corpus check reads every block against it, Then all agree and every gate passes | 39 files repainted; `Summary: errors: 0`; palette-source 44 and palette-source-dark 40 assertions | Met | - |
| AC-002 | REQ-001 | Given the warmed dark ground, When every dark gate is recomputed, Then only the values recorded as moved have moved | Recomputed against `#141110`: one failure, the fourth neutral step, lifted to `#616161` at 3.03 | Met | - |
| AC-003 | REQ-001 | Given every role in the palette, When the derivation is read, Then each has exactly one origin | 29 roles to reference tokens, 2 gate-forced departures, 1 recorded choice, 9 arithmetics: 41 of 41 | Met | - |
| AC-004 | REQ-002 | Given a ranked system with steps under the floor, When the check runs, Then it fails | The shipped ladder measured 1.18 and 1.26 and would now fail; the new one holds 2.48, 1.81, 1.41 | Met | - |
| AC-005 | REQ-001 | Given the pair a reader is meant to compare, When the capture is read, Then the two are distinguishable | `population-pyramid` reads flame against teal; `grouped-bars` went from 1.49:1 to 4.5:1 between its series | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
