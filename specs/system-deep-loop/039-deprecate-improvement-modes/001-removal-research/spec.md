---
title: "Feature Specification: Phase 1: removal-research"
description: "Two parallel forced-depth deep research runs, one per mode, that inventory every model-benchmark and agent-improvement reference so the removal can be planned from evidence."
trigger_phrases:
  - "removal research"
  - "phase 1 removal research"
  - "improvement modes removal inventory"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 1: removal-research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/039-deprecate-improvement-modes |
| **Predecessor** | None |
| **Successor** | `../002-removal-plan/spec.md` |
| **Handoff Criteria** | Both children hold a verified `research/research.md` after 10 iterations each |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Removing the `model-benchmark` and `agent-improvement` modes touches the hub, its shared `deep-improvement` packet, the advisor, other skills, every CLI runtime mirror and many READMEs. Nobody holds a complete map of that wiring, and a removal planned from a grep alone leaves dead routes, broken drift guards and stale mirrors.

### Purpose
Produce two path-cited inventories, one per mode, from two deep research runs that each use DeepSeek V4.1 Flash at max reasoning for 10 iterations with no early convergence. Phase 002 plans the removal from them.

> **Phase-parent note:** This spec.md is the only authored document at this level. Each child holds its own plan, tasks and research output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One deep research run per mode, started at the same time
- Read-only inspection of the whole repository, writes only under each child's `research/`

### Out of Scope
- Any edit, move or deletion outside the two `research/` directories
- Planning the removal order, which belongs to `../002-removal-plan/`

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-model-benchmark-inventory/research/` | Create | 001 | Model-benchmark inventory |
| `002-agent-improvement-inventory/research/` | Create | 002 | Agent-improvement inventory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable spec folder. Both run in parallel.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-model-benchmark-inventory/ | Inventory every model-benchmark reference | Complete |
| 2 | 002-agent-improvement-inventory/ | Inventory every agent-improvement and deep-improvement reference | Complete |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently
- Both children finish before `../002-removal-plan/` starts
- Run `validate.sh --recursive` on this folder to validate both children together

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-model-benchmark-inventory | ../002-removal-plan | `research.md` with 10 iterations and a `maxIterationsReached` stop | Iteration count, stop reason and five citation spot checks |
| 002-agent-improvement-inventory | ../002-removal-plan | `research.md` with 10 iterations and a `maxIterationsReached` stop | Iteration count, stop reason and five citation spot checks |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which surfaces do the two modes share, and which child's inventory owns each one in the plan?
- How should the ten files both runs missed be classified? They are listed in `002-agent-improvement-inventory/research/research.md` under Orchestrator Verification.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-model-benchmark-inventory/`, `002-agent-improvement-inventory/`
- **Parent Spec**: `../spec.md`
- **Graph Metadata**: `graph-metadata.json`
