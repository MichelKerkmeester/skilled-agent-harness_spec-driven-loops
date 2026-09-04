---
title: "Acceptance Criteria: Phase 5: verification-and-closeout"
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
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/005-verification-and-closeout"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this phase"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-005-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: verification-and-closeout

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/023-semantic-lane-enablement/005-verification-and-closeout
**Level:** 2
**Status:** Draft
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final state, When every gate is run, Then each number is recorded beside the command that produced it | `research/final-state.md` carries the ratchet, the corpus, the signals, the controls and the canaries | Unmet | - |
| AC-002 | REQ-002 | Given the validator, When the packet is validated recursively, Then every folder reports a passing result with its rule lines present | Six passing result lines, each with rule output above it, and zero errors | Unmet | - |
| AC-003 | REQ-003 | Given the last document edit, When metadata is regenerated, Then the integrity fingerprint matches what it attests | The generated metadata integrity rule passes for every folder | Unmet | - |
| AC-004 | REQ-004 | Given the predecessor packet, When this packet closes, Then its roadmap entry and finding 10 both carry closing evidence | Both documents name this packet and the result it reached | Unmet | - |
| AC-005 | REQ-005 | Given the packet documents, When their completion claims are compared, Then no two disagree | The parent map, the parent goal log and each phase's own status agree | Unmet | - |
| AC-006 | REQ-006 | Given the final pass, When the hashes and the coverage count are re-derived, Then they are unchanged | The before and after values are recorded and identical | Unmet | - |
| AC-007 | REQ-005 | Given the running weight, When it is compared with the committed default, Then they agree or the difference is recorded | The resolved weights and the registry default are both written down | Unmet | - |

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

Nothing has run yet. This phase closes when every gate has a number from one final state, the
predecessor's open items point at a result rather than at a plan, and the packet's own documents
tell one story.
<!-- /ANCHOR:closure -->
