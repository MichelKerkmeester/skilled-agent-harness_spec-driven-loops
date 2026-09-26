---
title: "Acceptance Criteria: Phase 3: binding-check"
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
    packet_pointer: "sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/003-binding-check"
    last_updated_at: "2026-09-25T20:49:06Z"
    last_updated_by: "markdown"
    recent_action: "Closed the binding-check criteria with task evidence"
    next_safe_action: "Rerun the exact-set and strict checks after a map or binding change"
    blockers: ["Final recursive strict validation"]
    key_files: ["spec.md", "plan.md", "tasks.md", "acceptance-criteria.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fixture-binding-check-session"
      parent_session_id: null
    completion_pct: 75
    open_questions: ["Final recursive strict validation result"]
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: binding-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/003-binding-check
**Level:** 2
**Status:** Complete
**Date:** 2026-09-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the three direct phase-child folders, When the parent binding is reviewed, Then it contains exactly one row for each folder | The three target rows are recorded in `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/003-binding-check/tasks.md:47` | Met | - |
| AC-002 | REQ-002 | Given the parent map, direct folders and binding targets, When their names are compared, Then all three exact sets match | The exact three-set comparison is recorded in `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/003-binding-check/tasks.md:48` | Met | - |
| AC-003 | REQ-003 | Given the three backticked targets, When each is checked on disk, Then every target resolves to an existing child goal file | Target existence is recorded in `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/003-binding-check/tasks.md:58` | Met | - |
| AC-004 | REQ-003 | Given the final fixture, When recursive strict validation runs on every rule except `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT` and `GRAPH_METADATA_CHILD_DRIFT`, which the graph-metadata writer cannot run under a scratch path, Then it reports `RESULT: PASSED` with no `SPECDOC_SUFFICIENCY_006` finding | Observed 2026-09-26: `RESULT: PASSED` for all four folders with `SPECKIT_RULES` set to the 37 other rules, and 0 `SPECDOC_SUFFICIENCY_006` in the full run (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/003-binding-check/tasks.md:59`) | Met | - |
| AC-005 | REQ-004 | Given each closed acceptance criterion, When its verification cell is reviewed, Then it cites one observed path and line number | The single-line citation format is recorded in `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/003-binding-check/tasks.md:49` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is `Waived` or `Superseded`, naming a decision record that exists in `decision-record.md`. A waiver naming an ADR that is not there fails validation: the point of a waiver is that someone recorded the reasoning, so an unbacked waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All five criteria are Met. AC-004 is judged on every rule except the three generated-metadata rules, which cannot run under a scratch path.
<!-- /ANCHOR:closure -->
