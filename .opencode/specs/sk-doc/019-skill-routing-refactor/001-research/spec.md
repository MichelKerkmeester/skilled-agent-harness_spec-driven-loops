---
title: "Feature Specification: Skill-Routing Research Layer"
description: "Lean phase parent for the ten research lineages that define the skill-routing program's benchmark, per-hub, defaultMode, out-of-box, and unified-refactor evidence base."
trigger_phrases:
  - "skill-routing research layer"
  - "routing research phase parent"
  - "per-hub routing research"
  - "unified refactor research"
importance_tier: "critical"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This parent is intentionally lean. Research methods, findings, and evidence live in
  the ten child folders below; no plan, tasks, checklist, or implementation summary belongs here.
-->

# Feature Specification: Skill-Routing Research Layer

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Research complete / implementation handoffs active |
| **Track** | sk-doc |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `sk-doc/019-skill-routing-refactor` |
| **Context Type** | Research |

## 2. PURPOSE

This phase parent holds the shared research layer for the skill-routing program. It provides the evidence and handoffs for the benchmark-driven fixes, per-hub typed-pair routing work, and the router-unification program. The ten children remain independent research lineages; this parent only defines their shared topology and purpose.

## PHASE DOCUMENTATION MAP

| Child | Focus |
|-------|-------|
| `001-sk-doc-routing-research` | Diagnose sk-doc benchmark recall failures and define the dependency-ordered path-contract fixes. |
| `002-skill-advisor-routing-research` | Measure advisor usefulness and isolate correctness, calibration, discovery, and transport defects. |
| `003-sk-design-routing-research` | Map sk-design's six-mode routing surface and define typed-pair measurement requirements. |
| `004-system-code-graph-routing-research` | Define a typed leaf contract and benchmark plan for the standalone code-graph skill. |
| `005-system-deep-loop-routing-research` | Diagnose deep-loop mode/packet routing collisions and normalize its typed measurement surface. |
| `006-sk-prompt-routing-research` | Diagnose sk-prompt mode routing, prompt-models coverage, and typed-gold gaps. |
| `007-default-mode-policy-research` | Establish the fleet policy for child defaults versus null/defer behavior on parent hubs. |
| `008-oob-glm-parallel-research` | Explore radical routing alternatives through the parallel GLM out-of-box lineage. |
| `009-oob-idea-deep-dives` | Deepen eight out-of-box routing directions through focused research children and presentations. |
| `010-unified-refactor-research` | Fuse the out-of-box findings into one evidence-backed unified-router design. |

## HANDOFFS

- `001` and `002` hand off their benchmark and advisor findings to implementation phases `../011-sk-doc-routing-fixes/` and `../012-skill-advisor-routing-fixes/`.
- `003`–`006` provide the per-hub research basis for `../014-sk-code-router-alignment/` and subsequent typed-pair routing work.
- `007`–`010` provide the policy and design basis for `../015-router-unification-program/`.

## RELATED DOCUMENTS

- **Parent program:** `../spec.md`
- **Research remediation reference:** `../research/remediation-plan.md`


## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `None` |
| **Successor** | `002-router-audit-and-fix-map` |
