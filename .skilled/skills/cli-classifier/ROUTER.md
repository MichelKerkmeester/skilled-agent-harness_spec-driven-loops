---
title: cli-classifier Surface Router — per-intent leaf sets
description: First-class surface router document at the cli-classifier hub root (ROUTER.md). hub-router.json selects the workflow mode, and this document maps a request's judgment intent to the exact packet-local leaf resources that mode loads, emitting canonical (workflowMode, leafResourceId) pairs.
trigger_phrases:
  - "cli-classifier root router"
  - "classifier routing control"
  - "jev routing control"
  - "typed judgment routing"
importance_tier: important
contextType: implementation
version: 0.8.3.0
router_state: active
skill_pointer: SKILL.md
---

# cli-classifier Surface Router — per-intent leaf sets

This is the cli-classifier hub's second-layer (surface) router, first-class at the hub root as `ROUTER.md`. The hub selects a workflow mode in [`hub-router.json`](hub-router.json), and this document maps a request's judgment intent to the exact packet-local leaf resources that mode loads. The hub currently registers `cli-jev`; a future classifier joins as a new mode with its own leaf set.

Routing is two stages: the hub picks the MODE, this router picks the LEAVES within it. The two layers stay separate: the hub never emits leaf paths, and this router never re-decides the mode.

Every `RESOURCE_MAP` path is packet-qualified under `cli-jev/` and converts to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

---

## 1. OVERVIEW

`SKILL.md` picks the mode. This document picks what that mode loads.

An intent that matches nothing is a gap to report, not a reason to load everything.

---

## 2. INTENT MODEL

Four intents for the currently registered `cli-jev` mode. The Jev command reference and integration-pattern guide load on each route. Every other intent adds its own leaves to that baseline, so a request loads only the resources it asks for. Future classifier modes add their own intents and leaf sets.

- **`JEV_JUDGMENT`** (`cli-jev`) — a Jev judgment named outright, such as "ask jev", "jev noul" or "jev choice", loads `cli-jev/references/cli-reference.md` and `cli-jev/references/integration-patterns.md`.
- **`JEV_QUESTION`** (`cli-jev`) — shaping or batching the question, such as "jev pick one", "jev options" or "jev batch", loads the baseline plus `cli-jev/assets/question-shaping-card.md`.
- **`JEV_PROVIDER`** (`cli-jev`) — the provider, model or auth, such as "jev provider", "jev model id" or "jev auth status", loads the baseline plus `cli-jev/references/providers-and-models.md`.
- **`JEV_MCP`** (`cli-jev`) — an MCP host as the caller, such as "jev mcp server" or "expose jev", loads the baseline plus `cli-jev/references/mcp-server.md`.
One dominant judgment intent routes to the `cli-jev` leaf set. Two near-tied Jev intents route to the deduped union of their resource sets. A bare classifier ask that names no registered mode falls back to the hub default (disambiguation), never a silent choice.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is the human-facing contract, and this block is the byte-for-byte source the deterministic router-replay parses. Keep them in sync: when a map row changes above, update the matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path resolves on disk and is registered in `leaf-manifest.json`, so each dual-reads to a canonical typed pair.

```python
# No hub-wide preamble: each intent lists its mode's baseline first, then its own
# leaves, so a request loads one mode's set and a no-match defers to stage one
# for disambiguation.
DEFAULT_RESOURCE = []

SHARED_CONTROL_RESOURCES = []

INTENT_SIGNALS = {
    "JEV_JUDGMENT":    {"weight": 4, "keywords": ["ask jev", "jev judgment", "jev noul", "jev choice", "jev score", "jev urgency check", "jev yes or no", "jev probability", "cli-jev", "cli-usage", "jev cli", "typesafe jev", "type-safe jev", "cli jev", "jev probability judgment", "typed judgment cli", "jev dispatch", "jev judgment call", "run jev", "use jev", "with jev", "through jev", "does jev use"]},
    "JEV_QUESTION":    {"weight": 3, "keywords": ["jev pick one", "jev options", "jev question", "shape a jev question", "jev batch", "jev run", "several jev questions", "jev question card"]},
    "JEV_PROVIDER":    {"weight": 3, "keywords": ["jev provider", "jev model id", "jev model", "jev openrouter", "jev official provider", "jev auth status", "jev auth"]},
    "JEV_MCP":         {"weight": 3, "keywords": ["jev mcp", "jev mcp host", "jev mcp server", "expose jev"]},
}

RESOURCE_MAP = {
    "JEV_JUDGMENT": [
        "cli-jev/references/cli-reference.md",
        "cli-jev/references/integration-patterns.md"
    ],
    "JEV_QUESTION": [
        "cli-jev/references/cli-reference.md",
        "cli-jev/references/integration-patterns.md",
        "cli-jev/assets/question-shaping-card.md"
    ],
    "JEV_PROVIDER": [
        "cli-jev/references/cli-reference.md",
        "cli-jev/references/integration-patterns.md",
        "cli-jev/references/providers-and-models.md"
    ],
    "JEV_MCP": [
        "cli-jev/references/cli-reference.md",
        "cli-jev/references/integration-patterns.md",
        "cli-jev/references/mcp-server.md"
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant intent routes to the `cli-jev` mode's leaf set.
- Two near-tied intents route to the deduped union of their leaf sets within that mode.
- The `cli-jev` baseline leaves load on each route, and the question-shaping card, provider guide and MCP reference load only when their intent fires.
- No keyword match is `UNKNOWN_FALLBACK`: confirm the target mode before loading anything.
- `FULL_INVENTORY` is absent because the hub has no show-everything intent.

---

## RELATED RESOURCES

- [`hub-router.json`](./hub-router.json) - first-stage mode selection.
- [`mode-registry.json`](./mode-registry.json) - the packet registry and discriminator source.
- [`SKILL.md`](./SKILL.md) - the hub's public routing entry point.

---

## 5. MACHINE ROUTER

The hub's routing prose, moved here from `SKILL.md` so the skill body keeps only the pointer. It sits last, after the stage-two map above, and it declares no map of its own: the `INTENT_SIGNALS` and `RESOURCE_MAP` block in section 3 stays the only replay source.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "<task>"
> ```
> Follow the returned decision: `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `cli-classifier`. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide. That is the explicit kill-switch.

### Surface Router — per-intent leaf sets

Stage 2 of routing lives in section 3 of this file, which ships `router_state: active`.
It maps Jev judgment, question-shaping, provider and MCP intents to the exact packet-local leaf resources that mode loads.
A future classifier mode can add its own intent and leaves.
The two layers stay separate: the hub never emits leaf paths, and the surface router never re-decides the mode.

### Two-Axis Model

- `packetKind: "transport"` marks a bridge to an external tool. It selects a value and never mutates this workspace.
- A transport declares `mutatesWorkspace: false`, forbids `Write`, `Edit` and `Task` and is registered under the `transport-axis` extension.
- The advisor resolves the hub identity and stays blind to the transports (`routingClass: "metadata"`). The hub owns the resolution.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak (currently cli-jev)
  -> read mode-registry.json for packetKind, backendKind, toolSurface and advisorRouting
  -> load the selected packet
```

### Outcomes

- `single`: one dominant judgment intent routes to the registered transport, currently `cli-jev`.
- `orderedBundle`: a request that explicitly names multiple registered modes routes to them in `tieBreak` order when a matching bundle rule is configured.
- `defer`: unclear intent asks for disambiguation rather than guessing a value. A request that names only the hub defers, because the hub name does not choose a backend.
