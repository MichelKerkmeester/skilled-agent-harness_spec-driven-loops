---
title: "Acceptance Criteria: Phase 2: Baseline and routing correctness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "baseline and routing correctness acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/002-baseline-and-routing-correctness"
    last_updated_at: "2026-10-28T06:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase: baseline, six fixes, rerun"
    next_safe_action: "Start phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: Baseline and routing correctness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/002-baseline-and-routing-correctness`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: A baseline file in this phase's `scratch/` records every gate's output and exit status before the first edit. | `scratch/baseline.md` §1, written at `bd8f7e946d` before the first edit, every gate with exit status | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: After the fixes, every gate in the baseline passes at least as well as before. | `scratch/after.md` §1 delta table: every gate exit 0 with the same result as before | Met | - |
| AC-003 | REQ-003 | Given the phase is implemented, When its gates run, Then: Each fixed defect cites the research finding it closes. | `implementation-summary.md` fix table names the research finding for each fix | Met | - |

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

Every criterion is Met, with evidence in `scratch/baseline.md`, `scratch/after.md` and `implementation-summary.md`.
<!-- /ANCHOR:closure -->
