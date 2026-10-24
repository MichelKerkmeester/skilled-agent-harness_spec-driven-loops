---
title: "Acceptance Criteria: Phase 28: goal-rebind-live-proof-and-docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal rebind live proof acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Wait for phases 025 to 027, then record the baselines"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-28-goal-rebind-live-proof-and-docs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 28: goal-rebind-live-proof-and-docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs
**Level:** 2
**Status:** Draft
**Date:** 2026-10-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a sender with an active goal, When a live hop completes, Then the receiver shows the same packet goal, read from the receiver | A transcript and receiver status per runtime with credentials | Unmet | - |
| AC-002 | REQ-002 | Given the switch off or a sender with no goal, When a live hop completes, Then the receiver has no goal | The two control transcripts per runtime | Unmet | - |
| AC-003 | REQ-003 | Given a runtime that cannot run, When recorded, Then it is a SKIP with its reason | The record for each skipped runtime | Unmet | - |
| AC-004 | REQ-004 | Given the changed docs, When read, Then they describe the behavior, the switch and the limits | `rg -n "SESSION_RELAUNCH_GOAL"` over the docs and the playbooks | Unmet | - |
| AC-005 | REQ-005 | Given both parents, When validated recursively, Then `RESULT: PASSED` prints | `validate.sh --strict --recursive` output for each parent | Unmet | - |

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

Every row is Unmet because the phase is planned and nothing in it has been built or run. The packet closes when every runtime with credentials has a live hop and controls and both parents validate.
<!-- /ANCHOR:closure -->
