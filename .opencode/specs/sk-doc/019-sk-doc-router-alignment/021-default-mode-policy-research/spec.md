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
