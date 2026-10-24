---
title: "Acceptance Criteria: Phase 29: relaunch-evidence-gaps-and-playbook-drift"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "relaunch evidence gaps acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/029-relaunch-evidence-gaps-and-playbook-drift"
    last_updated_at: "2026-10-24T19:40:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the acceptance criteria for this planned phase"
    next_safe_action: "Record the relaunch gate baseline, then rerun the Codex withdraw scenario"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-29-relaunch-evidence-gaps-and-playbook-drift"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 29: relaunch-evidence-gaps-and-playbook-drift

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/029-relaunch-evidence-gaps-and-playbook-drift
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
| AC-001 | REQ-001 | Given the Codex withdraw scenario, When rerun with a long enough wait, Then the receiver reply is in a saved transcript | A transcript under `scratch/` with the wait used | Unmet | - |
| AC-002 | REQ-002 | Given the Claude extra-nudge scenario, When rerun several times, Then the producer is named with a failing-first test or the first-attempt rate is recorded | A rate table or a test that fails before the fix | Unmet | - |
| AC-003 | REQ-003 | Given the two playbook lines, When compared with a run, Then each states what the run printed and the command that prints it | The command output and the corrected line | Unmet | - |
| AC-004 | REQ-004 | Given the Pi suites, When run, Then totals and the date are recorded | The suite output | Unmet | - |
| AC-005 | REQ-005 | Given the changed playbooks, When validated, Then the sk-doc validators report no issue | Validator output for each file | Unmet | - |

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

Every row is Unmet because the phase is planned and nothing in it has been built or run. The packet closes when each gap is closed or recorded as open with its reason.
<!-- /ANCHOR:closure -->
