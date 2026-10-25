---
title: "Acceptance Criteria: Phase 9: pi-arm-on-agent-settled"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "pi arm on agent settled acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/009-pi-arm-on-agent-settled"
    last_updated_at: "2026-10-25T13:42:37Z"
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
# Acceptance Criteria: Phase 9: pi-arm-on-agent-settled

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/009-pi-arm-on-agent-settled
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
| AC-001 | REQ-001 | **Given** a pending record, **When** the test fires `agent_end` alone, **Then** the record stays pending; **When** it fires `agent_settled`, **Then** it is armed | Pi test, red before | Unmet | - |
| AC-002 | REQ-002, REQ-003 | **Given** `agent_end`, a continuation `agent_start`, `agent_end`, `agent_settled`, **When** run, **Then** the record ends armed, not disarmed | Pi test | Unmet | - |
| AC-003 | REQ-001, REQ-002 | **Given** the full suite, **When** `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` runs, **Then** it exits 0 | Output | Unmet | - |
| AC-004 | REQ-005 | **Given** the README, **When** searched for Pi's arm event, **Then** it names `agent_settled` and no line names `agent_end` as the arm | grep | Unmet | - |
| AC-005 | REQ-001, REQ-004 | No-regression check. **Given** a live Pi 1.4.0 session through `skilled-loop` with `openai/gpt-6-luna`, **When** the 031 harness runs one hop (command line in `tasks.md` T010), **Then** the record reaches `armed` and the receiver claims the note. A hop succeeds on either arm event, so AC-002 is the proof of the change | `scratch/pi-settled-live/relaunch-record-armed.json` holds `"status":"armed"` and `scratch/pi-settled-live/note-final.md` shows `status: claimed` or `done` | Unmet | - |
| AC-006 | REQ-006 | **Given** a pending record, **When** the test fires `agent_settled` with `aborted: true`, **Then** the record stays pending | Pi test, red before | Unmet | - |
| AC-007 | REQ-004 | **Given** a held nudge and a pending record, **When** the test fires `agent_end` without `agent_settled`, **Then** the nudge is sent with `deliverAs: 'followUp'` and the record stays pending, which checks that the held nudge stays on `agent_end` (`agent-session.js:1562-1564`) | Pi test | Unmet | - |

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

Not yet closed. The builder writes this statement when every row is Met.
<!-- /ANCHOR:closure -->
