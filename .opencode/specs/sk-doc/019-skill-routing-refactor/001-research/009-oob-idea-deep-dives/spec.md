---
title: "Feature Specification: Out-of-Box Routing Idea Deep-Dives (phase parent)"
description: "Sub-phase parent housing eight per-idea presentation docs plus a dedicated 5-iteration SOL xhigh-fast deep-research lineage for each lateral routing direction surfaced by the sol-oob out-of-box research: compiled-policy collapse, replayable correction overlay, typed no-destination, no-wrong-door handoff, calibrated negotiation, minimal typed contract, proof-carrying commit, and the (T,R,P) decomposition candidate. This is the exploration layer of the router-unification program; its eight directions were fused into the unified refactor design in sibling phase 006."
trigger_phrases:
  - "out-of-box routing idea deep dives"
  - "per-idea routing research"
  - "routing idea presentations"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: merge/migration/consolidation narratives; heavy docs (plan/tasks/checklist/decision-record/implementation-summary belong in children).
  REQUIRED: root purpose; the eight-child phase map; the shared research method.
-->

# Feature Specification: Out-of-Box Routing Idea Deep-Dives

## EXECUTIVE SUMMARY

The `sol-oob` out-of-box research lineage (sibling phase `002-default-mode-policy-research`, seven iterations, cli-codex GPT-5.6-SOL) produced seven genuinely distinct lateral rethinks of parent-hub routing. This sub-phase parent takes each direction and gives it two things: a **plain-language presentation** (what it is, how it would work, before/after versus today, risks) and a **dedicated 5-iteration deep-research lineage** (SOL xhigh, fast) that deepens the single idea rather than surveying all of them at once. An eighth direction — the (T,R,P) decomposition — arrived from the parallel GLM lineage and is carried here as a forward-looking candidate.

The goal is depth-per-idea. Run 3 (in `002`) explored breadth: one iteration per direction. This layer inverts that — one full five-iteration study **per** direction, so each candidate is stress-tested on its own terms. These eight directions are the raw material the unified refactor design (sibling phase `006-unified-refactor-research`) fuses into one coherent contract.

> **Position in the program:** this is the *exploration* layer. Its conclusions live on in the presentations here and, fused, in `../006-unified-refactor-research/`. The raw per-idea research iterations were distilled into those presentations and are not retained verbatim.

## 3. RESEARCH CONTEXT

Source material (do NOT re-derive): the seven `sol-oob` iterations and their lineage synthesis in
`../002-default-mode-policy-research/research/lineages/sol-oob/` (`iteration-001.md`..`iteration-007.md` and `research.md`). The prior practical answer — keep sk-prompt, flip four hubs to `defaultMode: null` with a routing-helper fallback — is already implemented in sibling phase `../003-default-mode-implementation/` and is NOT the subject here.

Each child deepens exactly one direction. The presentation is the operator-facing deliverable; the child research lineage was the evidence that backed (and could revise) it.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Idea (direction) | Status |
|-------|--------|------------------|--------|
| 1 | 001-compiled-policy-collapse/ | Compile the two hand-authored routing maps into one immutable, hash-addressed, registry-derived policy; keep a thin packet-local resolver | Complete — 5/5 dive (SOL xhigh) + presentation + 3-dim read |
| 2 | 002-replayable-correction-overlay/ | Learn from corrections in a separate plane — immutable base + hash-addressed overlay, shadow eval, explicit promotion, hash rollback | Complete — 5/5 dive (SOL xhigh) + presentation + 3-dim read |
| 3 | 003-typed-no-destination/ | Replace `null` with typed no-destination outcomes (idle / no-match / dependency-failure / degraded-fallback / handoff-required) | Complete — 5/5 dive (SOL xhigh) + presentation + 3-dim read |
| 4 | 004-no-wrong-door-handoff/ | Any mode accepts intake then hands off through a bounded INTAKE→OFFERED→ACCEPTED→ACTIVE protocol; acceptance ≠ completion | Complete — 5/5 dive (SOL xhigh) + presentation + 3-dim read |
| 5 | 005-calibrated-negotiation/ | Expose rank + margin always, calibrated error only when validated; one typed clarification turn under a measurable friction budget | Complete — 5/5 dive (SOL xhigh) + presentation + 3-dim read |
| 6 | 006-minimal-typed-contract/ | RouteRequest facts + CompiledPolicy + typed RouteDecision (single/orderedBundle/surfaceBundle/clarify/defer/reject) | Complete — 5/5 dive (SOL xhigh) + presentation + 3-dim read |
| 7 | 007-proof-carrying-commit/ | PREPARE→VERIFY→COMMIT; a route proof is evidence not authority; destination-local verify gates the first side effect | Complete — 5/5 dive (SOL xhigh) + presentation + 3-dim read |
| 8 | 008-trp-decomposition/ | Candidate (GLM-originated): the (T,R,P) knob decomposition — Threshold/Recovery/Provenance; `defaultMode` is one corner `(T low, R none, P static)` | Presentation authored (forward-looking); 5-iteration dive NOT run |

### Shared research method (every child)

- **Executor**: cli-codex, `gpt-5.6-sol`, `reasoningEffort=xhigh`, `serviceTier=fast`.
- **Iterations**: exactly 5, `stop-policy=max-iterations` (no early convergence — deepen the single idea).
- **Steering**: each child `spec.md` §research-context carries that idea's specific agenda.
- **Evidence discipline**: repository contracts as primary evidence; cross-domain primary sources for transferable mechanisms; explicit falsification against dissimilar hubs.

## 4. SCOPE

### In Scope
- Eight per-idea `presentation.md` deliverables (plain-language).
- The distilled findings of each idea's 5-iteration SOL xhigh-fast deep-research lineage (folded into the presentations).

### Out of Scope
- Implementation of any idea (that is the unified plan in `../007-unified-refactor-implementation/`).
- Re-deriving the run-1/run-2/run-3 `defaultMode` answer already shipped in `../003-default-mode-implementation/`.
- Any change to live routing config, shared benchmark machinery, or the scorer.

## RELATED DOCUMENTS
- **Source research**: `../002-default-mode-policy-research/research/lineages/sol-oob/`
- **Shipped baseline**: `../003-default-mode-implementation/`
- **Parallel GLM lineage**: `../004-oob-glm-parallel-research/` → distilled in `../GLM-cross-lineage-notes.md`
- **Where these ideas were fused**: `../006-unified-refactor-research/`
- **Parent Spec**: `../spec.md`
