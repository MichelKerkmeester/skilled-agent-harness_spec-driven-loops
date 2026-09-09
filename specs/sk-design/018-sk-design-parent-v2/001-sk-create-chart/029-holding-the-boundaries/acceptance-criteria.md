---
title: "Acceptance Criteria: hold the boundaries that turned out to be reachable"
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
    packet_pointer: "scaffold/029-holding-the-boundaries"
    last_updated_at: "2026-09-09T19:23:24Z"
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
# Acceptance Criteria: hold the boundaries that turned out to be reachable

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
| AC-001 | REQ-001 | Given the ramp interiors, When a rung is pushed toward either end, Then the evenness assertion fails | Moving the last rung reported a spread of 0.36 against the 0.08 they hold; the shipped ramps measure 0.010 and 0.015 | Met | - |
| AC-002 | REQ-001 | Given a form whose card opens on a band, When it declares a guide, Then it fails on that reason | `stacked-area` with the guide wired reported registering its card somewhere other than its readings | Met | - |
| AC-003 | REQ-001 | Given the carried source blocks, When a converted hex is checked against them, Then it reproduces | Eight sampled tokens reproduced exactly from the vendored `oklch()` declarations; the file is pinned and the pin is held | Met | - |
| AC-004 | REQ-001 | Given the reference-drawing loop that no shipped data runs, When a form is rendered with an entry injected, Then the rule and its label reach the document | Test renders `histogram` in headless Chrome; removing the append makes it fail | Met | - |
| AC-005 | REQ-001 | Given the corner mapping question, When both alternatives are measured, Then the choice is recorded with its reason | A name mapping hands the card rung 4px and breaks stock reproduction; recorded in the theming reference | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
