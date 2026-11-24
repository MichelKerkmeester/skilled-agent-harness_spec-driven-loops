---
title: "Acceptance Criteria: Phase 16: stop-hook-auto-record"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "stop hook auto record acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/decision-capture/001-decision-capture/016-stop-hook-auto-record"
    last_updated_at: "2026-11-24T18:37:58Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-stop-hook-auto-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 16: stop-hook-auto-record

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `016-stop-hook-auto-record`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a transcript naming one packet with a `spec.md` and two queued tool answers, When Stop runs, Then that packet's `decision-record.md` holds both answers verbatim | `npx vitest run tests/hook-session-stop.vitest.ts`, bound case | Unmet | - |
| AC-002 | REQ-002 | Given the AC-001 run, When `pendingRecords` is read for the session, Then it returns 0 and Stop prints no nudge | `npx vitest run tests/hook-session-stop.vitest.ts`, bound case | Unmet | - |
| AC-003 | REQ-003 | Given a transcript naming no packet or two packets, When Stop runs, Then no decision record changes and the nudge text prints | `npx vitest run tests/hook-session-stop.vitest.ts`, unbound cases | Unmet | - |
| AC-004 | REQ-004 | Given a writer that throws, When Stop runs, Then it exits 0, both answers stay pending and the nudge prints | `npx vitest run tests/hook-session-stop.vitest.ts`, throw case | Unmet | - |
| AC-005 | REQ-005 | Given `AI_SESSION_CHILD=1` and one bound packet, When Stop runs, Then nothing is written | `npx vitest run tests/hook-session-stop.vitest.ts`, child case | Unmet | - |
| AC-006 | REQ-006 | Given `SYSTEM_DECISION_CAPTURE_DISABLED=1` and one bound packet, When Stop runs, Then nothing is written | `npx vitest run tests/hook-session-stop.vitest.ts`, disabled case | Unmet | - |
| AC-007 | REQ-007 | Given the AC-001 run, When the new rows are read, Then each `decided` cell starts "Recorded at session end" and each `why` cell reads `Not stated.` | `npx vitest run tests/hook-session-stop.vitest.ts`, bound case assertion | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

No. Nothing is built yet, so every criterion is unmet.
<!-- /ANCHOR:closure -->
