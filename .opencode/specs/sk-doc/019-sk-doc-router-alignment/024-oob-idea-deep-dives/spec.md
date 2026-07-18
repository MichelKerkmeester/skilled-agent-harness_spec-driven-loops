---
title: "Feature Specification: Out-of-Box Routing Idea Deep-Dives (phase parent)"
description: "Phase parent housing seven per-idea presentation docs plus a dedicated 5-iteration SOL xhigh-fast deep-research lineage for each of the seven lateral routing directions surfaced by the sol-oob out-of-box research: compiled-policy collapse, replayable correction overlay, typed no-destination, no-wrong-door handoff, calibrated negotiation, minimal typed contract, and proof-carrying commit."
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
  REQUIRED: root purpose; the seven-child phase map; the shared research method.
-->

# Feature Specification: Out-of-Box Routing Idea Deep-Dives

## EXECUTIVE SUMMARY

The `sol-oob` out-of-box research lineage (packet `021`, seven iterations, cli-codex GPT-5.6-SOL) produced seven genuinely distinct lateral rethinks of parent-hub routing. This phase parent takes each of those seven directions and gives it two things: a **plain-language presentation** (what it is, how it would work, before/after versus today, risks) and a **dedicated 5-iteration deep-research lineage** (SOL xhigh, fast) that deepens the single idea rather than surveying all of them at once.

The goal is depth-per-idea. Run 3 (`021`) explored breadth: one iteration per direction. This packet inverts that — one full five-iteration study **per** direction, so each candidate is stress-tested on its own terms before any of them is proposed for implementation.

## 3. RESEARCH CONTEXT

Source material (do NOT re-derive): the seven `sol-oob` iterations and their lineage synthesis in
`../021-default-mode-policy-research/research/lineages/sol-oob/` (iterations `iteration-001.md`..`iteration-007.md` and `research.md`). The prior practical answer — keep sk-prompt, flip four hubs to `defaultMode: null` with a routing-helper fallback — is already implemented in packet `022` and is NOT the subject here.

Each child deepens exactly one direction. The presentation is the operator-facing deliverable; the child `research/` lineage is the evidence that backs (and may revise) it.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Idea (direction) | Status |
|-------|--------|------------------|--------|
| 1 | 001-compiled-policy-collapse/ | Compile the two hand-authored routing maps into one immutable, hash-addressed, registry-derived policy; keep a thin packet-local resolver | Complete — 5/5 dive (SOL xhigh) + presentation updated with findings + 3-dim read |
| 2 | 002-replayable-correction-overlay/ | Learn from corrections in a separate plane — immutable base + hash-addressed overlay, shadow eval, explicit promotion, hash rollback | Complete — 5/5 dive (SOL xhigh) + presentation updated with findings + 3-dim read |
| 3 | 003-typed-no-destination/ | Replace `null` with typed no-destination outcomes (idle / no-match / dependency-failure / degraded-fallback / handoff-required) | Complete — 5/5 dive (SOL xhigh) + presentation updated with findings + 3-dim read |
| 4 | 004-no-wrong-door-handoff/ | Any mode accepts intake then hands off through a bounded INTAKE→OFFERED→ACCEPTED→ACTIVE protocol; acceptance ≠ completion | Complete — 5/5 dive (SOL xhigh) + presentation updated with findings + 3-dim read |
| 5 | 005-calibrated-negotiation/ | Expose rank + margin always, calibrated error only when validated; one typed clarification turn under a measurable friction budget | Complete — 5/5 dive (SOL xhigh) + presentation updated with findings + 3-dim read |
| 6 | 006-minimal-typed-contract/ | RouteRequest facts + CompiledPolicy + typed RouteDecision (single/orderedBundle/surfaceBundle/clarify/defer/reject) | Complete — 5/5 dive (SOL xhigh) + presentation updated with findings + 3-dim read |
| 7 | 007-proof-carrying-commit/ | PREPARE→VERIFY→COMMIT; a route proof is evidence not authority; destination-local verify gates the first side effect | Complete — 5/5 dive (SOL xhigh) + presentation updated with findings + 3-dim read |
| 8 | 008-trp-decomposition/ | Candidate (GLM-originated): the (T,R,P) knob decomposition — Threshold/Recovery/Provenance; `defaultMode` is one corner `(T low, R none, P static)` | Presentation authored (forward-looking); 5-iteration dive NOT yet run |

### Shared research method (every child)

- **Executor**: cli-codex, `gpt-5.6-sol`, `reasoningEffort=xhigh`, `serviceTier=fast`.
- **Iterations**: exactly 5, `stop-policy=max-iterations` (no early convergence — deepen the single idea).
- **Artifact root**: each child's own `research/lineages/<label>/`.
- **Steering**: each child `spec.md` §research-context carries that idea's specific agenda.
- **Evidence discipline**: repository contracts as primary evidence; cross-domain primary sources for transferable mechanisms; explicit falsification against dissimilar hubs.

## 4. SCOPE

### In Scope
- Seven per-idea `presentation.md` deliverables (plain-language).
- Seven per-idea 5-iteration SOL xhigh-fast deep-research lineages.
- A combined synthesis once all seven complete (and once the `023` GLM lineage is folded in).

### Out of Scope
- Implementation of any idea (these are research + presentation only; implementation would be separate gated packets).
- Re-deriving the run-1/run-2/run-3 `defaultMode` answer already shipped in `022`.
- Any change to live routing config, shared benchmark machinery, or the scorer.

## RELATED DOCUMENTS
- **Source research**: `../021-default-mode-policy-research/research/lineages/sol-oob/`
- **Shipped baseline**: `../022-default-mode-implementation/`
- **Parallel GLM lineage (folded in)**: `../023-oob-glm-parallel/` → distilled in `./GLM-cross-lineage-notes.md`
- **GLM cross-lineage notes**: `./GLM-cross-lineage-notes.md` (the (T,R,P) decomposition — a candidate 8th idea — plus the handoff-as-training-signal and learn-the-vocab-table refinements)
- **Parent Spec**: `../spec.md`
