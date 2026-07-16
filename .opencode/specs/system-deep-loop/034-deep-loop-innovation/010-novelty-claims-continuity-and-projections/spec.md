---
title: "Feature Specification: Novelty, Claims, Continuity & Projections (recommendations implementation phase 010)"
description: "This phase defines the intelligence layer over the durable deep-loop substrate: concept-level novelty, typed contradiction and supersession, stable claim continuity, next-focus semantics, and deterministic transactional projections and gauges for convergence to consume."
trigger_phrases:
  - "novelty claims continuity projections"
  - "deep-loop intelligence layer phase 010"
  - "semantic communities and claim continuity"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections"
    last_updated_at: "2026-07-15T15:02:15Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase-parent purpose and five-child documentation map"
    next_safe_action: "Author the child phase contracts without changing this parent scope"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose and child phase map only; mechanics live in the children. -->

# Feature Specification: Novelty, Claims, Continuity & Projections

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections |
| **Level** | phase parent (Level 2) |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-deep-loop/034-deep-loop-innovation |
| **Predecessor** | 009-fanout-fanin-durable-orchestration |
| **Successor** | 011-convergence-termination-and-health |
| **Handoff Criteria** | Semantic communities, contradiction/supersession events, claim continuity, next-focus semantics, and deterministic transactional projections/gauges are planned over the ledger + fan-in substrate, ready for convergence to consume. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The recommendations program places this phase after durable fan-in and before convergence: the ledger, shared evidence/control services, compatibility bridge, and stable fan-in identities provide durable inputs, but they do not yet tell the loop what is conceptually new, what conflicts with prior knowledge, how a claim persists across iterations, or where investigation should move next. The required ordering and outcome are fixed by `.opencode/specs/system-deep-loop/034-deep-loop-innovation/spec.md` and `.opencode/specs/system-deep-loop/034-deep-loop-innovation/manifest/phase-tree.json`.

Run-2 found that deep-loop value comes from a longitudinal, replayable evidence ledger rather than a stateless terminal result. Its deep-research findings call for stable claim records, duplicate-source handling, support/refute/qualify relationships, independence clusters, and supersession links; its cross-mode synthesis makes continuity identity and replayable projections shared runtime concerns. Those findings make string-equality deduplication and isolated scalar novelty insufficient inputs for later stopping decisions. Source: `.opencode/specs/system-deep-loop/034-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`.

This phase defines that intelligence layer over the durable substrate. Its five children establish concept-level semantic communities, typed contradiction and supersession, stable claim continuity, typed next-focus semantics, and deterministic transactional projections and gauges. Together they hand phase 011 coherent novelty, coverage, claim-state, and derived-view signals on which convergence, termination, and health decisions can rely.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-semantic-communities/` | Cluster findings/claims into semantic communities so novelty and dedup work at the concept level, not string equality. | Planned |
| 002 | `002-contradiction-and-supersession-events/` | Contradiction and supersession as first-class ledger events, so a later finding can typed-ly overturn or replace an earlier one with an audit trail. | Planned |
| 003 | `003-claim-continuity/` | Track each claim's lifecycle under a stable continuity identity across iterations, so a claim's support, contradiction, and status evolve without losing its identity. | Planned |
| 004 | `004-next-focus-semantics/` | Typed next-focus / where-to-look-next semantics that pick the next region to explore from coverage and novelty signals, generalizing the divergent-pivot logic. | Planned |
| 005 | `005-transactional-projections-and-gauges/` | Deterministic, transactional projections and gauges updated atomically from the ledger so derived views never partially apply or drift. | Planned |

The five children form one ordered intelligence contract over the ledger and fan-in substrate. Their combined output is the stable signal surface that the successor phase consumes for convergence, termination, and health planning.
<!-- /ANCHOR:phase-map -->
