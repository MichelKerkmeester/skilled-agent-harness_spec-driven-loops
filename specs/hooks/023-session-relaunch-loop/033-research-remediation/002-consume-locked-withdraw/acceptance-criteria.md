---
title: "Acceptance Criteria: Phase 2: consume-locked-withdraw"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "consume locked withdraw acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-consume-locked-withdraw"
    last_updated_at: "2026-10-25T13:42:27Z"
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
# Acceptance Criteria: Phase 2: consume-locked-withdraw

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw
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
| AC-001 | REQ-001, REQ-002 | **Given** a record disarmed with a withdrawn reason, **When** `consume` runs, **Then** its JSON holds `withdrawn: true` and the record file is gone | CLI test in `session-relaunch-cli.test.cjs`, red before the change. Evidence: | Unmet | - |
| AC-002 | REQ-003 | **Given** an armed record, **When** consume runs, **Then** the output has no `withdrawn` key and the exact-shape tests pass with unedited expectations | `session-relaunch-cli.test.cjs`. Evidence: | Unmet | - |
| AC-003 | REQ-004 | **Given** the wrapper got `relaunch: true` and the record is withdrawn before consume (test barrier or stub), **When** the wrapper continues, **Then** it prints the withdrawn warning, starts no second runtime and exits with the runtime's code | `skilled-loop.test.cjs`. Evidence: | Unmet | - |
| AC-004 | REQ-005 | **Given** that withdrawn decline, **When** the hop history is read, **Then** it holds no `handed-over` line | Test on the history file. Evidence: | Unmet | - |
| AC-005 | REQ-004 | **Given** a withdrawn record on the Ctrl-C path (runtime exit 130, not signalled), **When** consume runs, **Then** no claim command prints | `skilled-loop.test.cjs`. Evidence: | Unmet | - |

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
