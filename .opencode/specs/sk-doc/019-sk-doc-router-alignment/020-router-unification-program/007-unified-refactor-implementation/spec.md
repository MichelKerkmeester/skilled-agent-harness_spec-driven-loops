---
title: "Feature Specification: Unified Router Refactor — Phased Implementation Plan"
description: "Phase parent for implementing the council-synthesized unified router refactor: one content-addressed compiled policy, one closed decision algebra, one shared recovery budget, destination-local prepare/verify/commit, calibrated negotiation (Idea 5, fully integrated — not deferred), and an optional offline correction overlay. Nine top-level phases, two of them multi-phased (calibration, parent-hub rollout), each gated on route-gold and reversible, activated one skill at a time in the order mcp-code-mode → sk-code → system-deep-loop → mcp-tooling. The shared scorer is never touched."
trigger_phrases:
  - "unified router refactor implementation"
  - "phased router refactor plan"
  - "compiled policy migration phases"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: merge/migration-history narratives; heavy docs (plan/tasks/checklist/decision-record/implementation-summary belong in children).
  REQUIRED: root purpose; the phase map; the shared migration-gate model.
-->

# Unified Router Refactor — Phased Implementation Plan

## EXECUTIVE SUMMARY

Implement the unified router refactor designed by the Opus-4.8 council in the sibling research packet (`../006-unified-refactor-research/unified-refactor-synthesis.md`). The refactor is **not a router rewrite** — it is a shadow compiler plus additive semantic gates, activated one skill at a time behind a fenced activation selector, with legacy serving-authoritative until each gate passes. Route-gold stays green at every step; the shared benchmark scorer is never edited.

**Idea 5 (calibrated negotiation) is fully integrated here, not deferred.** The synthesis parked calibration for lack of a held-out corpus; this plan builds that corpus as a first-class sub-phase (`005/001`) so calibrated auto-routing ships as a real capability rather than a future note. The learning overlay (Idea 2) remains optional/offline/last — but is included so "all of it" has a home.

> **Phase-parent note:** this spec.md is the ONLY authored document at the parent level. Per-phase scope, plans, tasks, and gates live in the phase children below.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Multi-phase? |
|-------|--------|-------|--------------|
| 0 | 000-contract-schemas/ | Canonical, versioned schemas + deterministic serialization/hashing for the whole contract family (CompiledPolicy, RouteRequest, RouteDecision 4-action algebra, RouteProof, UncertaintyBudget, CorrectionOverlay, the 3 projections) | — |
| 1 | 001-compiler-n1-shadow/ | The shadow compiler + compile ONLY `mcp-code-mode` (the degenerate N=1 case) + the 3 projections + legacy-gold compatibility + shadow parity (zero live authority) + prove fenced activation + byte-exact rollback. **The recommended first slice.** | — |
| 2 | 002-decision-evaluator/ | The pure evaluator emitting the closed 4-action algebra + its invariants + typed route-gold fixtures via the compatibility projector (scorer untouched) | — |
| 3 | 003-execution-verify-commit/ | Destination-local PREPARE → VERIFY → COMMIT + proof-as-evidence + receipts + idempotency + stale-proof rejection | — |
| 4 | 004-recovery-ladder/ | The ordered clarify→handoff ladder on ONE shared uncertainty budget (H=1); acceptance ≠ completion | — |
| 5 | 005-calibration/ | **Idea 5, integrated.** Held-out corpus (005/001) → rank-vs-calibrated contract (005/002) → selective-classification controller (005/003) | **Yes (3 children)** |
| 6 | 006-parent-hub-rollout/ | Activate the compiled contract per parent hub, in blast-radius order: sk-code (006/001) → system-deep-loop (006/002) → mcp-tooling (006/003) | **Yes (3 children)** |
| 7 | 007-learning-overlay/ | Optional/offline CorrectionOverlay: candidate → gated promotion → pointer CAS (never edits serving policy). Built last; gated on a demonstrated routing gain | — |
| 8 | 008-fleet-cleanup/ | Retire legacy dual-read; per-skill deletion gates (incl. N=1 via the identical compiler path); retain-prior-generation window | — |

## SHARED MIGRATION-GATE MODEL (applies to every phase)

Authority moves in gates, not file conversions. The synthesis's seven migration stages map across the phases; each phase must satisfy its stage's gate before the next activates, and each is reversible:

| Stage | Gate | Owned by phase(s) |
|-------|------|-------------------|
| 0 Baseline freeze | full legacy baseline recorded | 000/001 |
| 1 Shadow compile | canonical bytes regenerate; typed fixtures parse; route-gold green | 001 |
| 2 Dual-read | every legacy input resolves; unmapped fails closed | 001, 006 |
| 3 Shadow evaluate | full typed replay deterministic; compatibility projection matches route-gold; gold never auto-updates | 002, 006 |
| 4 Per-hub canary | zero hard mismatch; advisor identity matches or ignored; document parity; rollback drill proven | 006/* |
| 5 Offline overlay | offline replay + safety/parity + independent approval + byte-stable tuple | 007 |
| 6 Destination rollout | proof/expiry/read-set/authority/epoch/idempotency/receipt fixtures; read-only legs before mutating | 003, 006/* |
| 7 Fleet cleanup | per-skill deletion gates | 008 |

**Hard constraints (every phase):** deterministic route-gold replay preserved; NEVER touch the shared scorer (`router-replay.cjs`); authority stays destination-local; reversible + gated; no over-emission. Each activation is a fenced CAS on the activation manifest; requests pin one generation; rollback swaps to the byte-identical prior manifest and CANNOT undo an external COMMITted effect (post-effect recovery is destination-owned).

## RELATED DOCUMENTS
- **Source design**: `../006-unified-refactor-research/unified-refactor-synthesis.md` + `../006-unified-refactor-research/ai-council/`
- **The eight fused ideas**: `../001-*` … `../008-*/presentation.md`
- **Parent Spec**: `../spec.md`
