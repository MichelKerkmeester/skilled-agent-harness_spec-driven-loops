---
title: "Feature Specification: Deep-Alignment Integrity"
description: "Group the deep-alignment loop integrity fixes: a trustworthy findings-registry seal state and a contained multi-executor path."
trigger_phrases:
  - "deep alignment integrity"
  - "alignment registry seal and multi executor group"
  - "deep-alignment loop trust fixes"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/049-deep-alignment-integrity"
    last_updated_at: "2026-08-08T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Grouped the deep-alignment integrity children under one phase parent"
    next_safe_action: "Resume the specific child phase that needs work via its own continuity ladder"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Deep-Alignment Integrity

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/049-deep-alignment-integrity |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-08-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation |
| **Predecessor** | `048-write-containment-hardening` |
| **Successor** | `050-trustworthy-state-records` |
| **Handoff Criteria** | The deep-alignment loop marks its findings registry sealed only at terminal synthesis, and can dispatch a contained non-codex leaf with early convergence optionally disabled; each child phase strict-validates independently. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The autonomous deep-alignment loop makes two independent trust claims that each need a fix. Its findings registry must not present a mid-loop fail-closed seed as an authoritative sealed verdict when a run halts before terminal synthesis. And its executor path must be able to run a contained non-codex leaf, with an option to disable early convergence, without reaching for a tool-mediated write that trips the loop's contract. Both fixes touch the same alignment reducer, command assets, and convergence surface.

This phase parent groups that deep-alignment integrity work under one root: sealing the findings registry only at terminal synthesis, and extending the command with a contained `cli-opencode` leaf plus a convergence-off option. Each child owns its own plan, tasks, checklist, and continuity; this parent tracks only the shared purpose and the phase manifest below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-alignment-registry-sealing/` | Mark the deep-alignment findings registry as sealed only at terminal synthesis, so a run that halts mid-loop no longer strands its fail-closed seed as an authoritative verdict. | In Progress |
| 002 | `002-deep-alignment-multi-executor/` | Extend the autonomous deep-alignment command with a contained `cli-opencode` leaf and an option that disables early convergence. | In Progress |
<!-- /ANCHOR:phase-map -->
