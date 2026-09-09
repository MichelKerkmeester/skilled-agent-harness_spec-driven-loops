---
title: "Acceptance Criteria: a case for every family, and a guard that keeps it that way"
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
    packet_pointer: "scaffold/031-full-family-coverage"
    last_updated_at: "2026-09-09T20:32:05Z"
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
# Acceptance Criteria: a case for every family, and a guard that keeps it that way

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
| AC-001 | REQ-001 | Given the checker's registered families, When the suite runs, Then none is uncovered and unexempt | 47 registered, 42 covered, 5 browser-exempt, 0 uncovered | Met | - |
| AC-002 | REQ-001 | Given a family added with no case, When the suite runs, Then it fails naming that family | A family added to the checker failed the guard by name | Met | - |
| AC-003 | REQ-001 | Given a case naming a family that does not exist, When the suite runs, Then it fails | Renaming a family a case depends on failed the second guard | Met | - |
| AC-004 | REQ-001 | Given each new case, When it runs against the shipped corpus, Then it fails only after its mutation | 80 tests, 0 failures; nine mutations were refused on the way in for breaking something adjacent to the assertion | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
