---
title: "Feature Specification: Router-Unification Program (phase parent)"
description: "The fleet router-unification program: from making every skill's router consistent (3-tier standard), through the defaultMode policy question and its shipped fix, through two parallel out-of-box exploration lineages, to the unified router refactor — one compiled policy, one closed decision algebra, one shared recovery budget, destination-local prepare/verify/commit, calibrated negotiation, and an optional offline correction overlay — and its phased implementation plan. Seven phases arranged historic-to-current; the shared benchmark scorer is never touched and every routing change stays reversible and gated on route-gold."
trigger_phrases:
  - "router unification program"
  - "fleet routing consistency to unified refactor"
  - "router alignment program parent"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: merge/migration/consolidation narratives (see context-index.md); heavy docs (plan/tasks/checklist/decision-record/implementation-summary belong in children).
  REQUIRED: root purpose; the phase map; the current-vs-historic context map.
-->

# Feature Specification: Router-Unification Program

## EXECUTIVE SUMMARY

This is the umbrella program for making the fleet's parent-hub routing **consistent, correct, and — ultimately — unified under one contract**. It runs as a historic-to-current arc: it began as a fleet-wide consistency push (one 3-tier routing standard for all 49 units), surfaced and answered a sharp policy question (should a hub `defaultMode` guess a child, or defer?), shipped that answer, then opened two parallel out-of-box exploration lineages that questioned the whole two-layer routing frame. Those explorations fused into a single **unified router refactor** — one content-addressed compiled policy, one closed `route | clarify | defer | reject` decision algebra, one shared recovery budget, destination-local PREPARE→VERIFY→COMMIT, calibrated negotiation, and an optional offline correction overlay — which now has a phased, reversible implementation plan.

Every phase holds two invariants: the deterministic route-gold benchmark stays green, and the shared benchmark scorer is never edited. Live-routing changes are reversible and gated one hub at a time.

> **Phase-parent note:** this `spec.md` is the only authored document at the parent level. Per-phase scope, plans, tasks, and evidence live in the phase children below. A per-phase index cross-reference for this parent is maintained in `context-index.md`.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Kind |
|-------|--------|-------|------|
| 1 | 001-3-tier-consistency-standard/ | The origin program: one universal 3-tier routing standard across all 49 units; route-gold gate; de-skill-specific the shared harness; fleet verification | Implementation (in progress) |
| 2 | 002-default-mode-policy-research/ | Deep research: should a hub's `defaultMode` point at a child or default to `null` and defer? Hosts the `sol-oob` out-of-box lineage | Research |
| 3 | 003-default-mode-implementation/ | The shipped fix: keep sk-prompt; flip four hubs to `defaultMode: null` with a routing-helper fallback; fix sk-design hub-identity over-emission | Implementation (shipped) |
| 4 | 004-oob-glm-parallel-research/ | Parallel GLM-5.2-max out-of-box lineage exploring the same radical agenda concurrently, to diversify the idea space | Research |
| 5 | 005-oob-idea-deep-dives/ | **Sub-parent (8 children).** One 5-iteration deep-dive per lateral direction surfaced by the exploration, each with a plain-language presentation | Research |
| 6 | 006-unified-refactor-research/ | The council synthesis: the eight directions fused into one coherent unified-router design + the Opus-4.8 ai-council deliberation | Design |
| 7 | 007-unified-refactor-implementation/ | **Sub-parent.** The phased, reversible implementation plan for the unified refactor (compiler → evaluator → execution → recovery → calibration → per-hub rollout → cleanup) | Implementation (planned) |

## CURRENT vs HISTORIC CONTEXT

**Start here (current, actionable):**
- **`007-unified-refactor-implementation/`** — the live plan of record. The phased, gated build of the unified router refactor. This is what "do the work" points at now.
- **`006-unified-refactor-research/`** — the design the plan implements (read `unified-refactor-synthesis.md` first, then `ai-council/`).

**Background (historic, the trail that produced the design — read only if tracing *why*):**
- **`001-3-tier-consistency-standard/`** — where the program started; the consistency baseline the whole fleet still rests on (its own REQ work is separately in progress).
- **`002` + `003`** — the defaultMode question and its shipped answer; the practical fix that is already live and is NOT re-opened by the refactor.
- **`004` + `005`** — the two exploration lineages (GLM parallel + the eight per-idea deep-dives). Their conclusions survive, fused, in phase `006`; the raw research iterations were distilled into the presentations rather than kept verbatim.

## HARD CONSTRAINTS (every phase)
- Deterministic route-gold replay preserved; the shared scorer (`router-replay.cjs`) is never edited.
- Live-routing changes are reversible and gated on route-gold staying green; no over-emission.
- Authority stays destination-local (a proof or recommendation is never a capability).

## RELATED DOCUMENTS
- **Phase index cross-reference**: `context-index.md`
- **The unified design**: `006-unified-refactor-research/unified-refactor-synthesis.md`
- **The current plan**: `007-unified-refactor-implementation/spec.md`
- **Parent Spec**: `../spec.md`
