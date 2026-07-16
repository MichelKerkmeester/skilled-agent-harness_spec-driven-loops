---
title: "Feature Specification: convergence-termination-and-health"
description: "The current convergence anchor is council-specific and threshold-based. This phase defines five child contracts that replace count-based stopping with path coverage, cycle detection, independent stopping clocks, value-of-computation allocation, and generic cross-mode health signals."
trigger_phrases:
  - "convergence termination and health"
  - "deep-loop phase 011"
  - "path-covering loop termination"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health"
    last_updated_at: "2026-07-15T15:17:01Z"
    last_updated_by: "codex"
    recent_action: "Authored the five-child convergence, termination, and health phase map"
    next_safe_action: "Author the path-covering termination child contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Convergence, Termination & Health

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/011-convergence-termination-and-health |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/034-deep-loop-innovation |
| **Predecessor** | 010-novelty-claims-continuity-and-projections |
| **Successor** | 012-shared-mode-contracts-and-fixtures |
| **Handoff Criteria** | Path-covering termination, cycle detection, stopping clocks, value-of-computation allocation, and a generic health/degeneration harness are planned as consumers of fan-in (006) and novelty (007), replacing count-based stopping. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shipped convergence anchor, `.opencode/skills/system-deep-loop/runtime/lib/council/convergence.cjs`, makes council-local stop decisions from fixed agreement, dissent, evidence-depth, disagreement, and confidence thresholds. It provides explicit blockers and a decision trace, but it does not establish that the loop covered its available search paths, detect repeated states or claims, arbitrate independent stop conditions, direct compute toward high-value branches, or expose degeneration consistently across modes. The run-2 findings in `.opencode/specs/system-deep-loop/034-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md` likewise reject raw `newInfoRatio` and iteration exhaustion as evidence of convergence: stopping must be grounded in trusted evidence yield, coverage, unresolved blockers, and longitudinal state.

This phase defines the shared planning boundary for replacing count-based stopping with five complementary contracts. It is deliberately sequenced after durable fan-in and novelty/claims continuity because coverage, cycle, allocation, and health decisions consume those signals, as specified by `.opencode/specs/system-deep-loop/034-deep-loop-innovation/spec.md` and `.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json`. Its children generalize the current council convergence anchor across all modes and hand phase 012 a coherent termination-and-health boundary on which shared mode contracts and fixtures can depend.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-path-covering-termination/` | Terminate on proven coverage of the search paths/space rather than a raw iteration count, using the coverage + community signals. | Planned |
| 002 | `002-cycle-detection/` | Detect when the loop is going in circles - revisiting states, claims, or foci - and treat that as a termination/health signal. | Planned |
| 003 | `003-stopping-clocks/` | Multiple independent stopping clocks (budget, novelty-decay, coverage, wall-time) whose earliest firing stops the loop, each recorded. | Planned |
| 004 | `004-value-of-computation-allocation/` | Value-of-computation scoring + adaptive allocation: spend more iterations where marginal value is high, gated by the phase-007 typed budgets. | Planned |
| 005 | `005-health-and-degeneration-harness/` | A generic health + degeneration harness that detects mode collapse, repetition, and quality decay across any mode. | Planned |

The five children jointly plan when the loop may stop, where remaining compute is worth spending, and whether continued execution remains healthy. Their detailed mechanisms and verification contracts live only in the child folders.
<!-- /ANCHOR:phase-map -->
