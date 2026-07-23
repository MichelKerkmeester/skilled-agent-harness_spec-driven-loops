---
title: "Feature Specification: Parent-Hub defaultMode Policy Research"
description: "Deep research into whether a parent hub's routerPolicy.defaultMode should point at a child mode at all, or default to null (defer to the parent to disambiguate/detect). Evaluates each of the five auto-defaulting hubs for whether its default is the genuine dominant case or a presumption, and proposes a principled fleet policy encoded in the create-skill canon + route-gold benchmark."
trigger_phrases:
  - "default mode policy research"
  - "should hubs default to null"
  - "parent hub defaultMode design"
  - "defer to parent vs default to child"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Parent-Hub defaultMode Policy Research

---

## EXECUTIVE SUMMARY

A parent hub is a pure router: its `SKILL.md` never handles a request itself, it only dispatches to a child mode (or defers). `routerPolicy.defaultMode` is the hub's documented fallback when the request scores weakly. Today five hubs point `defaultMode` at a specific child (`sk-prompt`→`prompt-improve`, `cli-external-orchestration`→`cli-opencode`, `system-deep-loop`→`research`, `mcp-tooling`→`mcp-chrome-devtools`, `sk-design`→`interface`) while two use `null` (`sk-doc` defers to disambiguation; `sk-code` resolves its mode by surface detection). The open question: is "default to a child" a sound default, or a presumption that silently commits to a possibly-wrong mode — and should some or all of the five flip to `null`?

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Research — run 1 (4 iters) answered keep-1/flip-4; runs 2-3 (divergent + OOB agendas) open |
| **Created** | 2026-07-18 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/020-router-unification-program` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`defaultMode = <child>` auto-commits the hub to one mode when nothing specific fires. That is good UX when one child is overwhelmingly the common case (asking would be annoying), but a latent failure when the request was actually about a different mode — the hub silently mis-routes instead of deferring. `defaultMode = null` avoids the mis-route (the parent disambiguates or detects) at the cost of more clarification prompts. There is no articulated fleet policy for which hubs should do which, and the choice is currently ad hoc.

### Purpose

Determine the principled policy for `defaultMode` per tier and per hub, and how to encode it so new skills inherit the right default rather than copying a neighbour's.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:research-context -->
## 3. RESEARCH CONTEXT

### The core question

Should a parent hub's `routerPolicy.defaultMode` point at a child mode, or should it be `null` (defer to the parent's own `SKILL.md` to disambiguate or detect)? When is each correct?

### What to investigate (each iteration should advance these)

1. **Semantics.** Is "default to a child" coherent given the parent is a pure router with no mode of its own? What does the deterministic router-replay actually do when nothing scores and `defaultMode` is set vs `null` (route to the default child, emit nothing, or defer)? Confirm against `router-replay.cjs` behaviour, not assumption.
2. **Per-hub verdict.** For each of the five auto-defaulting hubs, is the named default the genuine dominant (~80%) case for a request that already routed to that skill, or a presumption? Evidence: the hub's own modes, its playbook scenarios, and what a mis-default would cost.
   - `sk-prompt` → `prompt-improve` (vs the niche `prompt-models`)
   - `cli-external-orchestration` → `cli-opencode` (vs `cli-claude-code`, `cli-codex`)
   - `system-deep-loop` → `research` (vs review, ai-council, improvement lanes)
   - `mcp-tooling` → `mcp-chrome-devtools` (vs 5 other unrelated transports)
   - `sk-design` → `interface` (vs foundations, motion, audit, md-generator)
3. **The two null models.** `sk-doc` (keyword-routed, no sensible default → defer) vs `sk-code` (detection-routed → no keyword default). Are these the reference patterns the five should be measured against?
4. **Interaction with the route-gold gate.** Under `sameSet` intent matching, does a `defaultMode` fallback ever emit a mode that fails or masks a route-gold scenario? Should the benchmark assert defer-vs-default behaviour explicitly (a scenario whose gold is "defer / disambiguate")?
5. **Encoding.** How should the chosen policy live in the `create-skill` canon (the `parent_skill_hub_router_template.json` + schema doc) so a new hub picks `defaultMode` deliberately rather than by imitation? What decision rule distinguishes "default to the dominant child" from "null / defer"?

### Constraints / ground truth

- The parent `SKILL.md` is a pure router; there is no "parent mode." Do not propose a default that is the parent itself.
- `AMBIGUITY_DELTA` is a hard-coded constant (1) in the benchmark replay; `routerPolicy.ambiguityDelta` in JSON is inert. Reason about defaulting within that scoring model.
- Recommendations that change a shipped `defaultMode` are behaviour changes to live routing — treat each as a proposal with a stated tradeoff (fewer wrong auto-picks vs more disambiguation prompts), not an auto-applied fix.

### Deliverable

`research/research.md` with: a per-hub verdict table (keep default / flip to null, with the dominant-case evidence and the mis-default cost), the principled decision rule, the benchmark implication (should defer be a gold outcome), and the exact `create-skill` canon change to encode it.
<!-- /ANCHOR:research-context -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- The `defaultMode` design question across the 7 parent hubs (5 default-to-child, 2 null).
- The decision rule + its encoding in the create-skill canon and the route-gold benchmark.

### Out of Scope
- Actually flipping any shipped `defaultMode` (that is a follow-on decision per hub).
- Layer-0 advisor (skill selection) — this is about Layer-1 mode selection only.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-1 | Per-hub defaultMode verdict (keep vs flip to null) | A table for the 5 default-to-child hubs with dominant-case evidence + mis-default cost |
| REQ-2 | The principled decision rule | A stated rule distinguishing "default to the dominant child" from "null / defer" |
| REQ-3 | Router-replay semantics on zero signal | Confirmed behaviour of `defaultMode` set vs null against `router-replay.cjs`, not assumption |
| REQ-4 | Benchmark implication | Whether the route-gold gate should assert defer-vs-default (a "defer / disambiguate" gold outcome) |
| REQ-5 | Encoding in the create-skill canon | The exact `parent_hub_router_template.json` + schema change so a new hub picks defaultMode deliberately |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- **SC-1**: `research/research.md` carries a per-hub verdict table with evidence and the mis-default cost.
- **SC-2**: The decision rule is articulated and directly encodable in the canon.
- **SC-3**: The benchmark defer-gold implication is stated (assert or not, with rationale).
- **SC-4**: The exact create-skill canon change is specified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| A recommendation silently becomes a live-routing change | Medium | High | Treat each shipped-defaultMode change as a proposal with a stated tradeoff, not an auto-applied fix |
| Reasoning drifts outside the benchmark's inert `ambiguityDelta` model | Low | Medium | Reason about defaulting within the hard-coded `AMBIGUITY_DELTA=1` scoring model |

### Dependencies

| Dependency | Status |
|------------|--------|
| `router-replay.cjs` zero-signal behaviour (ground truth) | Available; confirm, do not assume |
| The 7-hub router inventory (5 default-to-child, 2 null) | Captured |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## OPEN QUESTIONS

- Does loading the mode-map fallback actually help a live model route better, or just add tokens — and what is its ideal shape (full registry vs compressed disambiguation card)?
- Does a null hub push disambiguation cost up to Layer 0 (the advisor), and should the advisor pre-resolve more so hubs never hit zero signal?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:divergent-agenda -->
## 5. DIVERGENT EXPLORATION AGENDA (Run 2 — 20 iterations, non-converge)

Run 1 (4 iterations, in `run1-archive/`) reached a clear answer: keep sk-prompt, flip 4 to null; a null hub's fallback should load the routing helper (`smart_routing.md` + `mode-registry.json`), not a child or filler. Run 2 must NOT re-derive this — it must **diverge, expand, and stress-test**. Each iteration should open NEW territory. Do not converge; treat any "we already know this" as a signal to push into an unexplored angle. Candidate divergent threads (extend beyond these):

1. **The fallback-resource rule, stress-tested.** Does loading the mode-map actually help a live model route better, or just add tokens? Is there a case where a child hint beats the mode-map? What is the ideal *shape* of the routing-helper resource (full registry vs a compressed disambiguation card)?
2. **Layer-0 ↔ Layer-1 interaction.** How does the advisor's skill selection interact with a hub that defers? Does a null hub push disambiguation cost up to Layer 0? Should the advisor pre-resolve more, so hubs never hit zero-signal?
3. **Live-mode reality.** On a null hub, does a real model presented with the mode-map disambiguate cleanly, or freeze / pick arbitrarily? Design the experiment.
4. **Migration & rollback.** Safe ordering of the 4 flips; regression surface; how to detect a bad flip; can the flips be shipped behind a benchmark gate?
5. **The third archetype, fully specified.** Exact schema, validator rules, and the `defaultConfigured` rename ripple across replay, gold, dashboards, docs.
6. **Cross-hub generalization.** Should ALL hubs converge on one archetype? When is detection-routed (sk-code) the better answer than defer-routed? Could sk-design be detection-routed?
7. **Second-order effects.** Does removing defaults measurably raise disambiguation friction? What NEW anti-patterns could null + mode-map introduce (e.g. mode-map bloat, stale registries, over-deferring)?
8. **Multi-dominant hubs & bundling.** What if a hub genuinely has 2 co-equal common modes? Ordered-bundle vs defer vs a ranked mode-map.
9. **Edge cases & failure modes.** Empty mode-map, single-mode hubs, a mode-registry that drifts from hub-router, a hub whose "default" is contextual (cli's runtime-dependence — generalize it).
10. **The catch-all coupling, deeper.** Fable found `defaultMode` anchors `hub-identity`. If we null the default, where does hub-identity live on a keyword hub? Is "discovery-only" fully worked out? Does sk-design's 6-way co-fire have analogues elsewhere?
11. **Historical & evidential.** Why were defaults added (bulk commits)? What would a real zero-signal traffic corpus look like, and is it worth building vs the archetype+fixture approach?
12. **Contrarian pass.** Argue the STRONGEST case AGAINST the run-1 verdict — where might keeping a named default actually be right? Steelman "auto-default is fine."
<!-- /ANCHOR:divergent-agenda -->

---

<!-- ANCHOR:oob-agenda -->
## 6. OUT-OF-BOX AGENDA (Run 3 — 7 iterations, non-converge, lateral)

Runs 1-2 answered the practical question. Run 3 must be RADICAL and lateral — question the frame itself, not tune within it. Each iteration should propose a genuinely out-of-the-box idea and stress it, not refine run-2. Threads (extend freely):

1. **Abolish the hub-router layer.** What if hubs had no keyword router at all — the advisor (Layer 0) picks the mode directly, hubs are pure packet containers? What breaks, what improves?
2. **Learned / adaptive routing.** Routing weights that update from observed corrections; a hub that gets better at its own zero-signal branch over time. Feasible offline-deterministic?
3. **Cross-domain analogies.** How do OS schedulers, IP routers, DNS resolvers, load balancers, and a human receptionist each handle "no clear destination"? Which transfers?
4. **No-wrong-door / handoff routing.** Any mode can accept then hand off; routing becomes recoverable rather than a single upfront guess. Kills the whole keep-vs-null question?
5. **Routing as dialogue.** The zero-signal case as a one-turn negotiation with typed options, not a silent default — formalize the compressed card as an interaction protocol.
6. **Confidence-first architecture.** Every route carries a calibrated confidence; below a threshold the system always defers with the card. Does this subsume all three archetypes?
7. **Radical simplification.** Is the INTENT_SIGNALS + RESOURCE_MAP two-layer scheme even necessary, or an accident? A minimal replacement.
8. **Contrarian frame-break.** Argue the entire defaultMode debate is a symptom of a deeper design smell; name the smell and the reframe.
<!-- /ANCHOR:oob-agenda -->
