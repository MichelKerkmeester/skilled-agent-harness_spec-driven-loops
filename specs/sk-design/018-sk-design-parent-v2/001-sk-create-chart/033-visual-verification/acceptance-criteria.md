---
title: "Acceptance Criteria: every capture read by a fresh reviewer, and what that found"
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
    packet_pointer: "scaffold/033-visual-verification"
    last_updated_at: "2026-09-10T06:10:51Z"
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
# Acceptance Criteria: every capture read by a fresh reviewer, and what that found

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

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given every capture, When fresh reviewers read them against each figure's own claims, Then all are covered | Six reviewers over 29 templates, 7 deliveries, 3 proof sheets and the contact sheet | Met | - |
| AC-002 | REQ-001 | Given each reported defect, When it is checked here, Then it is confirmed or refused before any change | Twelve confirmed against the images and the source; three judgements refused with reasons | Met | - |
| AC-003 | REQ-002 | Given every form, When its readings are drawn, Then the ink is not the colour they take | Eighteen forms moved from ink marks with one accent to hued marks with one ink; corpus `RESULT: PASSED` | Met | - |
| AC-004 | REQ-001 | Given prose that names a lightness direction, When the check runs, Then it refuses | `ramp-prose` fires on the sentence that shipped; 39 assertions, and a case in the suite | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
