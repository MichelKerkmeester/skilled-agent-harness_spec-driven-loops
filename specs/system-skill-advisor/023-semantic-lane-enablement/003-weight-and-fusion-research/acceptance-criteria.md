---
title: "Acceptance Criteria: Phase 3: weight-and-fusion-research"
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
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/003-weight-and-fusion-research"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this phase"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-003-weight-and-fusion-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: weight-and-fusion-research

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/023-semantic-lane-enablement/003-weight-and-fusion-research
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
| AC-001 | REQ-001 | Given the plan, When a question is read, Then it names the artifact that answers it and the number that closes it | All six questions in `research/research-plan.md` carry both columns filled | Unmet | - |
| AC-002 | REQ-002 | Given the plan, When the dispatch section is read, Then the command runs without further input | A dry run of the written command halts before writing state and reports no missing input | Unmet | - |
| AC-003 | REQ-003 | Given the measurement regime, When it is read, Then it says which numbers come from real vectors | `research/measurement-regime.md` names the flag that substitutes fixture vectors and lists the affected metrics | Unmet | - |
| AC-004 | REQ-004 | Given the regression set, When it is read, Then every corpus is named with its row count | The plan names 444 declared signals, 180 realistic rows and 224 out-of-scope controls, each with its file | Unmet | - |
| AC-005 | REQ-005 | Given a sweep result, When a row changes rank, Then the plan says how to attribute it to the score or to the rerank window | The attribution method is written and applies to a worked example | Unmet | - |
| AC-006 | REQ-006 | Given the phase closes, When the repository is inspected, Then nothing outside this folder changed | `git status --porcelain` lists only paths under this phase folder | Unmet | - |
| AC-007 | REQ-006 | Given the executors, When the plan names a model, Then that model was confirmed against its own skill document | The plan carries the check date and the roster it saw | Unmet | - |

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

Nothing has run yet. This phase closes when a reader can execute the plan without asking a
question, and when the two preconditions it depends on, full coverage and the vector regime
answer, are both recorded rather than assumed.
<!-- /ANCHOR:closure -->
