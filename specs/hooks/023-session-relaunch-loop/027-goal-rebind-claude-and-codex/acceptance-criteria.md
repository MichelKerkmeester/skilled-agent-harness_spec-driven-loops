---
title: "Acceptance Criteria: Phase 27: goal-rebind-claude-and-codex"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "goal rebind claude codex acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Wait for the phase 024 verdicts, then record the baseline gate"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-27-goal-rebind-claude-and-codex"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 27: goal-rebind-claude-and-codex

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/027-goal-rebind-claude-and-codex
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
| AC-001 | REQ-001 | Given a hop whose note names a packet, When a Claude receiver starts, Then the goal is set from `goal.md` or the fenced slice is requested, on the path phase 24 selected | A stub-runtime test per path and the verdict it cites | Unmet | - |
| AC-002 | REQ-002 | Given the same hop, When a Codex receiver starts, Then the seed asks the model to create the goal from the slice | The seed text test | Unmet | - |
| AC-003 | REQ-003 | Given an over-budget slice, no packet or the switch off, When the receiver starts, Then nothing is sent and one line says why | Three tests, failing against the code before the phase | Unmet | - |
| AC-004 | REQ-004 | Given a sent slice, When compared with `goal.cjs packet` output, Then it is the `chat_slice` and nothing else | A byte comparison in the test | Unmet | - |
| AC-005 | REQ-005 | Given a hop with no goal, When the receiver starts, Then the claim seed and compaction pointer behave as before | The existing claim and conformance tests pass unchanged | Unmet | - |

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

Every row is Unmet because the phase is planned and nothing in it has been built or run. The packet closes when the gate passes and each new test fails against the earlier code.
<!-- /ANCHOR:closure -->
