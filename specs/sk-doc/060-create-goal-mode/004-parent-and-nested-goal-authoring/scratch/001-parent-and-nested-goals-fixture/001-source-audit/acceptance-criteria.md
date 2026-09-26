---
title: "Acceptance Criteria: Phase 1: source-audit"
description: "The criteria this packet must satisfy before it may close, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/001-source-audit"
    last_updated_at: "2026-09-25T20:49:06Z"
    last_updated_by: "markdown"
    recent_action: "Closed the source-audit criteria with task evidence"
    next_safe_action: "Recheck the folder sets if the parent map changes"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "acceptance-criteria.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fixture-source-audit-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: source-audit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/001-source-audit
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
| AC-001 | REQ-001 | Given the parent phase map and three child folders, When the source inventory is checked, Then it names all three mapped folders and their child source pairs | The source inventory records the parent map and child sources in `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/001-source-audit/tasks.md:47` | Met | - |
| AC-002 | REQ-002 | Given the parent map and direct numbered child folders, When their names are compared, Then both exact sets match | The exact three-folder comparison is recorded in `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/001-source-audit/tasks.md:38` | Met | - |
| AC-003 | REQ-003 | Given each closed criterion, When its verification cell is reviewed, Then it cites one observed file path and line number | The evidence review confirms single-line task citations in `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/001-source-audit/tasks.md:49` | Met | - |

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

All three criteria are Met with task-line evidence. The audit records the source set and exact folder comparison without authoring parent or child goals.
<!-- /ANCHOR:closure -->
