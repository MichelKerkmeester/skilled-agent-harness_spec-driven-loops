---
title: "Acceptance Criteria: Phase 6: repair-speckit-workflow-gates"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "repair speckit workflow gates acceptance"
  - "plan clarity gate criteria"
  - "pre-implementation design-choice stop"
  - "speckit test-failure stop"
  - "clarification markers per pass"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates"
    last_updated_at: "2026-11-11T23:32:15Z"
    last_updated_by: "codex-closeout"
    recent_action: "Recorded verified acceptance evidence"
    next_safe_action: "Keep the packet Draft until its owner closes it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-repair-speckit-workflow-gates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 6: repair-speckit-workflow-gates

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->

## 1. METADATA

**Packet:** 006-repair-speckit-workflow-gates
**Level:** 2
**Status:** Draft
**Date:** 2026-11-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->

## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the pre-implementation score evaluates a plan, When plan_clarity is scored, Then the check has an explicit pass condition while retaining 25 points and threshold 70 | `tasks.md#phase-2-implementation` — ticked T004; output: `25 70 Pass only when plan.md states a concrete technical approach and affected files; fail if a material design choice remains.` | Met | - |
| AC-002 | REQ-002 | Given plan.md leaves a material design choice to the implementer, When the implementation prerequisite check runs, Then its on_fail stops before coding | `tasks.md#phase-2-implementation` — ticked T005; output: `none true` (exit 0). | Met | - |
| AC-003 | REQ-003 | Given test validation fails during completion, When the completion outcome is evaluated, Then the workflow stops and directs the implementer to fix the failing tests before continuing | `tasks.md#phase-2-implementation` — ticked T006; output: `STOP and fix the failing tests, then rerun them before completion continues` (exit 0). | Met | - |
| AC-004 | REQ-004 | Given plan.md exists without a substantive technical approach, When the complete workflow phase gate runs, Then the gate fails and returns to planning | `tasks.md#phase-2-implementation` — ticked T007; count output: `1` (exit 0). | Met | - |
| AC-005 | REQ-005 | Given clarification markers remain, When the plan workflow runs its clarification step, Then it processes up to three markers per pass and repeats until none remain | `tasks.md#phase-2-implementation` — ticked T008; new wording count: `1`; old wording search: no output, exit 1. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in a decision record. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in a decision record. |

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

All five acceptance rows are Met with the observed T004–T008 outputs; all 10 task rows and 29 verification-checklist rows are checked, and spec.md records Status Complete. The scope check printed `CHK-012 scope check passed` (exit 0), confirming the scoped plan_clarity row while preserving unrelated quality_gates, circuit_breaker and default_level settings.
<!-- /ANCHOR:closure -->
