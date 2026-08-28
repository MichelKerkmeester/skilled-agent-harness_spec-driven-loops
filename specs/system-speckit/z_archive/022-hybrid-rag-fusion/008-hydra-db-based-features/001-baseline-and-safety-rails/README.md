---
title: "Phase README: 001-baseline-and-safety-rails"
description: "Navigation and current-status summary for Hydra roadmap Phase 1."
trigger_phrases:
  - "phase 1"
  - "baseline"
  - "safety rails"
  - "hydra baseline"
importance_tier: "critical"
contextType: "general"
---
# Phase 1: Baseline and Safety Rails

> This folder contains the Level 3+ execution package for the Hydra roadmap baseline phase, including buildability, rollout controls, checkpoint safety, baseline evaluation hooks, and documentation hardening.

## 1. OVERVIEW

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Status** | Complete |
| **Current Truth** | Phase documentation and implementation summary align to shipped baseline hardening work; residual follow-up items stay explicitly out of scope. |
| **Next Phase** | `../002-versioned-memory-state/` |

---

## 2. DOCUMENTS

- `spec.md` defines the scope, requirements, governance, and acceptance scenarios for Phase 1.
- `plan.md` breaks the baseline work into safety, telemetry, migration, and release-gate tracks.
- `tasks.md` tracks delivered hardening work and remaining baseline tasks.
- `checklist.md` records planning, verification, rollout, and documentation evidence.
- `decision-record.md` captures the phase-local architecture choices.
- `implementation-summary.md` records what has and has not been delivered so far.

---

## 3. SCOPE BOUNDARY

Included here:
- Build and runtime packaging correctness for the MCP server.
- Roadmap-safe Hydra capability flags and checkpoint tooling.
- Baseline evaluation and schema compatibility verification.
- Documentation and playbook alignment for the baseline slice.

Explicitly not included here:
- First-class lineage state rollout.
- Unified graph retrieval implementation.
- Adaptive ranking, governance enforcement, or shared-memory release work.

---

## 4. RELATED

- Parent roadmap: `../spec.md`
- Parent decisions: `../decision-record.md`
- Research grounding: `../research/001 - analysis-hydradb-architecture-and-turso-fit.md`
- Research recommendations: `../research/002 - recommendations-turso-migration-and-hydradb-inspired-roadmap.md`

