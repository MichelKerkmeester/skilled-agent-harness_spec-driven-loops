---
title: "CLI Executor Two-Axis Dispatch Routing"
description: "`mode-registry.json` and `hub-router.json` jointly resolve a request to a single executor, an ordered bundle, or a deferred disambiguation across the hub's eight modes."
trigger_phrases:
  - "cli executor two-axis dispatch routing"
  - "cli-external-orchestration hub-router scoring"
  - "cli-opencode cli-claude-code cli-codex cli-cursor dispatch"
  - "cli-external-orchestration smart routing"
version: 1.7.0.0
---

# CLI Executor Two-Axis Dispatch Routing (cli-external-orchestration)

## 1. OVERVIEW

`cli-external-orchestration` is registry-driven: `mode-registry.json` lists all eight modes in one `modes[]` array, and `hub-router.json` decides whether a request resolves to a single mode, an ordered bundle, or a deferred disambiguation.

The eight executor packets, `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-hermes` and `cli-deepseek-harness`, are `packetKind: "workflow"`. Each one classifies dispatch intent, chooses or confirms a provider and conducts the dispatched session. `cli-deepseek-harness` is experimental, because no keyed run has proven either of its routes. The transport this hub used to declare, `cli-jev`, now lives in the `cli-classifier` hub (`.skilled/skills/cli-classifier/`) as mode `cli-jev` over the `cli-jev` packet: it returns one typed judgment from a state and runs nothing, and that hub's `transport-axis` extension names it.

---

## 2. HOW IT WORKS

### Two-Axis Model

Every workflow packet orchestrates a CLI binary whose dispatched writes land in this repository's own workspace (`mutatesWorkspace: true`). The eight workflows are primary, independently-routable dispatch workflows rather than variants layered on a shared backend, and `tieBreak` lists all eight, with no transport to order after them.

### Routing Rule

Resolution reads `hub-router.json`, scores `routerSignals` and `vocabularyClasses`, applies `routerPolicy.tieBreak`, then reads `mode-registry.json` for each candidate's `packetKind`, `backendKind`, `toolSurface`, and `advisorRouting` before loading the selected packet(s).

### DeepSeek Model Requests

`cli-deepseek-harness` is selected by harness vocabulary only: `dsh`, `dsh headless`, `deepseek harness` and `delegate to dsh`. No alias is a bare model word. A request that names a DeepSeek model with another runtime goes to that runtime, so "use cli-opencode with deepseek-v4.1-flash" resolves to `cli-opencode`.

### Outcomes

The router resolves to `single` (one dominant executor signal routes to one mode), an `orderedBundle` (multiple explicitly requested executors route in tie-break order), or a `defer` (unclear or contradictory dispatch intent asks for disambiguation — the router does not silently default to `cli-opencode` on genuine ambiguity).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-external-orchestration/ROUTER.md` | Shared | §5 states the two-axis model, routing rule, and outcome set. |
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | Shared | Declarative registry for the eight executor packets. The `transport-axis` extension left with the mode it named, so this registry declares no extension and the `cli-classifier` hub declares the axis. |
| `.skilled/skills/cli-external-orchestration/hub-router.json` | Shared | Router signals, vocabulary classes, and tie-break policy. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Automated test | Structural hub conformance, including the tool-surface-union invariant. |

---

## 4. SOURCE METADATA

- Group: CLI Executor Two-Axis Dispatch Routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`

Related references:
- [compiled-routing-and-legacy-fallback.md](../compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md) — the opt-in compiled-routing layer that resolves ahead of this registry-driven routing when enabled.
