---
title: "CLI Executor Two-Axis Dispatch Routing"
description: "How the cli-external-orchestration hub scores and dispatches one of seven CLI-executor workflow packets or the cli-jev transport, with the single transport-axis extension and no surface or runtime-loop axis."
trigger_phrases:
  - "cli executor two-axis dispatch routing"
  - "cli-external-orchestration hub-router scoring"
  - "cli-opencode cli-claude-code cli-codex cli-cursor dispatch"
  - "cli-external-orchestration smart routing"
version: 1.6.0.0
---

# CLI Executor Two-Axis Dispatch Routing (cli-external-orchestration)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`cli-external-orchestration` is registry-driven: `mode-registry.json` lists all eight modes in one `modes[]` array, and `hub-router.json` decides whether a request resolves to a single mode, an ordered bundle, or a deferred disambiguation.

The seven executor packets — `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, and `cli-hermes` — are `packetKind: "workflow"`; each independently classifies dispatch intent, chooses or confirms a provider, and conducts the dispatched session. The eighth mode, `cli-jev`, is the hub's only `packetKind: "transport"` and the only member of the `transport-axis` extension: it returns one typed judgment from a state and runs nothing, so it selects where a workflow acts.

---

## 2. HOW IT WORKS

### Two-Axis Model

Every workflow packet orchestrates a CLI binary whose dispatched writes land in this repository's own workspace (`mutatesWorkspace: true`); the transport packet is the exception, declaring `mutatesWorkspace: false` with `Write`, `Edit` and `Task` forbidden. The seven workflows are primary, independently-routable dispatch workflows rather than variants layered on a shared backend, and `tieBreak` lists them before the transport.

### Routing Rule

Resolution reads `hub-router.json`, scores `routerSignals` and `vocabularyClasses`, applies `routerPolicy.tieBreak`, then reads `mode-registry.json` for each candidate's `packetKind`, `backendKind`, `toolSurface`, and `advisorRouting` before loading the selected packet(s).

### Outcomes

The router resolves to `single` (one dominant executor signal routes to one mode), an `orderedBundle` (multiple explicitly requested executors route in tie-break order), or a `defer` (unclear or contradictory dispatch intent asks for disambiguation — the router does not silently default to `cli-opencode` on genuine ambiguity).

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/cli-external-orchestration/SKILL.md` | Shared | States the two-axis model, routing rule, and outcome set. |
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | Shared | Declarative registry for the seven executor packets plus the `cli-jev` transport, and for the `transport-axis` extension that declares it. |
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
