---
title: "Acceptance Criteria: Phase 2: lighter-advisor-launcher"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "lighter advisor launcher acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/037-advisor-daemon-memory/002-lighter-advisor-launcher"
    last_updated_at: "2026-10-21T09:51:16Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the no-go; AC-001 and AC-004 Met, AC-002 and AC-003 superseded"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-lighter-advisor-launcher"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: lighter-advisor-launcher

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-lighter-advisor-launcher
**Level:** 2
**Status:** Complete
**Date:** 2026-10-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given this machine, When the three processes are measured, Then their RSS and the decision are recorded in `decision-record.md` | `decision-record.md` ADR-001: measurement table (launcher 53 to 57 MB, advisor server 66 to 103 MB, bare Node 47 to 50 MB) and the no-go | Met | - |
| AC-002 | REQ-002 | Given a go, When a session queries the advisor in a fresh checkout, Then one advisor process serves it and lease takeover and model server respawn still work | not applicable after the no-go | Superseded | ADR-002 |
| AC-003 | REQ-003 | Given a go, When the launcher and lease suites run, Then they pass with no lost cases | not applicable after the no-go | Superseded | ADR-002 |
| AC-004 | REQ-004 | Given a no-go, When the phase closes, Then the decision names the recovery path that keeps the launcher and no code changed | ADR-001 names the crash and out-of-memory cleanup at `.skilled/bin/system-skill-advisor-launcher.cjs:1436`; `git diff` for this phase touches only this folder and its parent | Met | - |

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

The measurement and the recovery-path map carried the decision. The build criteria were superseded by ADR-002 after the no-go.
<!-- /ANCHOR:closure -->
