---
title: "Feature Specification: Write-Containment Hardening"
description: "Group the deep-loop fan-out write-containment guard fixes so a dispatched leaf can never leave, delete, or misattribute out-of-scope writes."
trigger_phrases:
  - "write containment hardening"
  - "deep-loop dispatch containment guard group"
  - "fanout containment sibling and concurrent safety"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "spec-author"
    recent_action: "Grouped the write-containment guard children under one phase parent"
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

# Feature Specification: Write-Containment Hardening

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/003-write-containment-hardening |
| **Level** | phase parent (Level 2) |
| **Priority** | P0 |
| **Status** | In progress |
| **Created** | 2026-08-08 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/036-deep-loop-innovation |
| **Predecessor** | `002-executor-wiring-and-parity` |
| **Successor** | `004-deep-alignment-integrity` |
| **Handoff Criteria** | The deep-loop fan-out write-containment guard reverts genuine out-of-scope leaf writes, never destroys unattributable sibling or untracked files, and runs safely on a dirty multi-actor working tree; each child phase strict-validates independently. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-loop runtime dispatches CLI leaves that can write to the working tree, and the only structural protection against a leaf editing files outside its artifact directory is the fan-out write-containment guard. That guard has to walk a fine line: revert a leaf's genuine out-of-scope edits without destroying concurrent writes it cannot attribute — a sibling lineage's artifacts under concurrency, or untracked operator files it has no basis to delete. Each of those failure modes is a separate, safety-critical fix on the same guard surface (`write-containment.ts`, `fanout-run.cjs`).

This phase parent groups that guard-hardening work under one root: adding the structural post-dispatch containment guard for the `cli-codex` branch, scoping the guard away from sibling lineages under concurrency, and stopping the guard from irreversibly deleting untracked out-of-scope files it cannot attribute. Each child owns its own plan, tasks, checklist, and continuity; this parent tracks only the shared purpose and the phase manifest below.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-cli-codex-write-containment/` | A structural post-dispatch guard that reverts and fails any `cli-codex` leaf write outside its artifact directory, closing the asymmetry with the `cli-opencode` dispatch branch. | Complete |
| 002 | `002-fanout-containment-sibling/` | Scope the fan-out containment guard away from sibling lineages, so a sibling's concurrent artifacts are never reverted by the leaf that trips the guard. | Planned |
| 003 | `003-write-containment-concurrent-safety/` | Stop the guard from irreversibly deleting untracked out-of-scope files it cannot attribute, so fan-out can run safely on a dirty, multi-actor working tree. | Complete |
<!-- /ANCHOR:phase-map -->
