---
title: "CLI Executor Two-Axis Dispatch Routing"
description: "How the cli-external-orchestration hub scores and dispatches one of three CLI-executor workflow packets, with no surface, transport, or runtime-loop extension axis."
trigger_phrases:
  - "cli executor two-axis dispatch routing"
  - "cli-external-orchestration hub-router scoring"
  - "cli-opencode cli-claude-code cli-codex dispatch"
  - "cli-external-orchestration smart routing"
version: 1.0.0.0
---

# CLI Executor Two-Axis Dispatch Routing (cli-external-orchestration)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`cli-external-orchestration` is registry-driven: `mode-registry.json` lists all three executor packets in one `modes[]` array, and `hub-router.json` decides whether a request resolves to a single mode, an ordered bundle, or a deferred disambiguation.

All three packets — `cli-opencode`, `cli-claude-code`, `cli-codex` — are `packetKind: "workflow"` with zero extension axes: no surface axis, no transport axis, no runtime-loop. Each independently classifies dispatch intent, chooses or confirms a provider, and conducts the dispatched session.

---

## 2. HOW IT WORKS

### Two-Axis Model

Every packet orchestrates a CLI binary whose dispatched writes land in this repository's own workspace (`mutatesWorkspace: true`); none is a transport packet. The three modes are primary, independently-routable dispatch workflows rather than variants layered on a shared backend.

### Routing Rule

Resolution reads `hub-router.json`, scores `routerSignals` and `vocabularyClasses`, applies `routerPolicy.tieBreak`, then reads `mode-registry.json` for each candidate's `packetKind`, `backendKind`, `toolSurface`, and `advisorRouting` before loading the selected packet(s).

### Outcomes

The router resolves to `single` (one dominant executor signal routes to one mode), an `orderedBundle` (multiple explicitly requested executors route in tie-break order), or a `defer` (unclear or contradictory dispatch intent asks for disambiguation — the router does not silently default to `cli-opencode` on genuine ambiguity).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/cli-external-orchestration/SKILL.md` | Shared | States the two-axis model, routing rule, and outcome set. |
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | Shared | Declarative registry for the three executor packets. |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Shared | Router signals, vocabulary classes, and tie-break policy. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the tool-surface-union invariant. |

---

## 4. SOURCE METADATA

- Group: CLI Executor Two-Axis Dispatch Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven routing when enabled.
