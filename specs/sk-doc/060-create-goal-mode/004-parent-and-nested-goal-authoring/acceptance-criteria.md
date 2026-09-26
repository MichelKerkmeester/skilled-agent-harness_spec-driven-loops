---
title: "Acceptance Criteria: Phase 4: parent-and-nested-goal-authoring"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "parent goal authoring acceptance"
  - "phase binding criteria"
  - "goal retrofit evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned parent and nested goal workflow"
    next_safe_action: "Execute the planned phase tasks"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "UNKNOWN"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: parent-and-nested-goal-authoring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring
**Level:** 2
**Status:** Complete
**Date:** 2026-09-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. AC-ID is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a top-level packet with its own spec.md and acceptance-criteria.md, When the top-level operation authors its goal, Then the goal uses those sources and the canonical template. | T004; reference path and template-conformance inspection. Observed 2026-09-26: top-level workflow at `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:30`, rendering through the shared template | Met | - |
| AC-002 | REQ-002 | Given a phase parent, When its map and child directories match, Then there is exactly one binding row per child; when they differ, authoring stops and reports the mismatch. | T005; fixture row count compared with direct child-directory count. Observed: phase-parent workflow with set comparison and STOP at `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:54`; fixture 3 folders and 3 rows | Met | - |
| AC-003 | REQ-003 | Given a child phase with its own spec.md and acceptance-criteria.md, When its goal is authored, Then its phase objective and criteria derive from those files and it has no BINDING section. | T006; child fixture source-to-goal review. Observed: nested-child workflow at `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:77`; each fixture child goal is phase-local with no binding section | Met | - |
| AC-004 | REQ-004 | Given an existing phase packet without a parent goal.md, When the retrofit operation runs, Then it renders the phase-level goal contract with inline-gate-renderer.sh --level phase. | T005; fixture parent goal contains the phase binding block. Observed: retrofit at `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:96`; the fixture parent goal was rendered at `--level phase` and carries the binding block (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/goal.md:74`) | Met | - |
| AC-005 | REQ-005 | Given a new phase reflected in the parent map and on disk, When the phase-add operation runs, Then one binding row and one child goal are added and the parent chat slice is resent. | T006; fixture before-and-after row count and resend checklist. Observed: on a copy of the fixture, `create.sh --phase --parent` added phase 004; one row added took rows from 3 to 4 for 4 folders, 0 `SPECDOC_SUFFICIENCY_006`, chat slice printed with the new row (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/phase-add-check.md:1`) | Met | - |
| AC-006 | REQ-006 | Given a child change that alters a parent decision or criterion, When the amendment is handled, Then the parent is changed first and its chat slice is resent. | T006; parent amendment procedure review. Observed: parent-first amendment and resend at `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:127` | Met | - |
| AC-007 | REQ-007 | Given a fixture with three on-disk phase children and three binding rows, When validate.sh runs with --strict on every rule except the three generated-metadata rules (`GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `GRAPH_METADATA_CHILD_DRIFT`), which the graph-metadata writer cannot run under a scratch path, Then it exits 0, prints RESULT: PASSED, and reports zero SPECDOC_SUFFICIENCY_006 findings. | T008 and T009; validator output and 3-to-3 count record. Observed: `RESULT: PASSED` for all four fixture folders with `SPECKIT_RULES` set to the 37 other rules, exit 0; full run 0 `SPECDOC_SUFFICIENCY_006` (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/goal.md:1`) | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All seven criteria are Met with observed evidence. AC-007 is judged on every rule except the three generated-metadata rules, which cannot run under a scratch path; the operator approved that scope on 2026-09-26.
<!-- /ANCHOR:closure -->
