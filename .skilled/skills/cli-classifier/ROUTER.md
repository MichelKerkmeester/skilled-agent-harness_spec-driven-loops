---
title: cli-classifier Surface Router — per-intent leaf sets
description: First-class surface router document at the cli-classifier hub root (ROUTER.md). hub-router.json selects the workflow mode, and this document maps a request's judgment intent to the exact packet-local leaf resources that mode loads, emitting canonical (workflowMode, leafResourceId) pairs.
trigger_phrases:
  - "cli-classifier root router"
  - "classifier routing control"
  - "deem routing control"
  - "jev routing control"
  - "typed judgment routing"
importance_tier: important
contextType: implementation
version: 0.6.0.0
router_state: active
skill_pointer: SKILL.md
---

# cli-classifier Surface Router — per-intent leaf sets

This is the cli-classifier hub's second-layer (surface) router, first-class at the hub root as `ROUTER.md`. The hub selects a workflow mode in [`hub-router.json`](hub-router.json) (`cli-jev` or `cli-deem`), and this document maps a request's judgment intent to the exact packet-local leaf resources that mode loads.

Routing is two stages: the hub picks the MODE, this router picks the LEAVES within it. The two layers stay separate: the hub never emits leaf paths, and this router never re-decides the mode.

Every `RESOURCE_MAP` path is packet-qualified (`cli-jev/references/...`, `cli-jev/assets/...` or `cli-deem/references/...`) and converts to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

---

## 1. OVERVIEW

`SKILL.md` picks the mode. This document picks what that mode loads.

An intent that matches nothing is a gap to report, not a reason to load everything.

---

## 2. INTENT MODEL

Seven intents across two transports. Each transport's baseline leaves load on every route of that mode: the Jev command reference and integration-pattern guide for `cli-jev`, the Deem wire contract for `cli-deem`. Every other intent adds its own leaves to that baseline, so a request loads the baseline plus only what it asks for.

- **`JEV_JUDGMENT`** (`cli-jev`) — a Jev judgment named outright, such as "ask jev", "jev noul" or "jev choice", loads `cli-jev/references/cli-reference.md` and `cli-jev/references/integration-patterns.md`.
- **`JEV_QUESTION`** (`cli-jev`) — shaping or batching the question, such as "jev pick one", "jev options" or "jev batch", loads the baseline plus `cli-jev/assets/question-shaping-card.md`.
- **`JEV_PROVIDER`** (`cli-jev`) — the provider, model or auth, such as "jev provider", "jev model id" or "jev auth status", loads the baseline plus `cli-jev/references/providers-and-models.md`.
- **`JEV_MCP`** (`cli-jev`) — an MCP host as the caller, such as "jev mcp server" or "expose jev", loads the baseline plus `cli-jev/references/mcp-server.md`.
- **`DEEM_JUDGMENT`** (`cli-deem`) — a Deem judgment or health check, such as "ask deem", "deem health" or "is deem up", loads `cli-deem/references/wire-contract.md`.
- **`DEEM_PROVENANCE`** (`cli-deem`) — which model and commit Deem serves, such as "deem model pin" or "which deem model", loads the baseline plus `cli-deem/references/model-pin.md`.
- **`DEEM_LIFECYCLE`** (`cli-deem`) — starting, stopping, updating or rolling back the server, such as "restart deem" or "deem rollback", loads the baseline plus `cli-deem/references/deem-ctl-lifecycle.md`.

One dominant judgment intent routes to its transport's leaf set. Two near-tied intents (within the router's ambiguity delta) route to both leaf sets, deduped by canonical pair. A request that names both backends by their aliases routes to both in tie-break order, `cli-jev` first. A bare classifier ask that names neither backend falls back to the hub default (disambiguation), never a silent choice.

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
    "JEV_JUDGMENT":    {"weight": 4, "keywords": ["ask jev", "jev judgment", "jev noul", "jev choice", "jev score", "jev urgency check", "jev yes or no", "jev probability", "cli-jev", "cli-usage"]},
    "JEV_QUESTION":    {"weight": 3, "keywords": ["jev pick one", "jev options", "jev question", "shape a jev question", "jev batch", "jev run", "several jev questions", "jev question card"]},
    "JEV_PROVIDER":    {"weight": 3, "keywords": ["jev provider", "jev model id", "jev model", "jev openrouter", "jev official provider", "jev auth status", "jev auth"]},
    "JEV_MCP":         {"weight": 3, "keywords": ["jev mcp", "jev mcp host", "jev mcp server", "expose jev"]},
    "DEEM_JUDGMENT":   {"weight": 4, "keywords": ["ask deem", "deem health", "is deem up", "deem noul", "deem choice", "deem score", "deem run", "have deem pick", "cli-deem"]},
    "DEEM_PROVENANCE": {"weight": 3, "keywords": ["deem model pin", "deem provenance", "deem keep still holds", "deem pinned model", "deem model version", "which deem model"]},
    "DEEM_LIFECYCLE":  {"weight": 3, "keywords": ["deem is down", "start deem", "stop deem", "restart deem", "update deem", "deem rollback", "downgrade deem", "deem-ctl", "deem server log"]},
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
    "DEEM_JUDGMENT": [
        "cli-deem/references/wire-contract.md"
    ],
    "DEEM_PROVENANCE": [
        "cli-deem/references/wire-contract.md",
        "cli-deem/references/model-pin.md"
    ],
    "DEEM_LIFECYCLE": [
        "cli-deem/references/wire-contract.md",
        "cli-deem/references/deem-ctl-lifecycle.md"
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the router's ambiguity delta) route to both leaf sets, deduped by canonical pair.
- Each transport's baseline leaves load on every route of that mode, and the question-shaping card and the provider, MCP, provenance and lifecycle references load only when their intent fires.
- No keyword match is `UNKNOWN_FALLBACK`: confirm the target mode before loading anything.
- `FULL_INVENTORY` is absent because the hub has no show-everything intent.

---

## RELATED RESOURCES

- [`hub-router.json`](./hub-router.json) - first-stage mode selection.
- [`mode-registry.json`](./mode-registry.json) - the packet registry and discriminator source.
- [`SKILL.md`](./SKILL.md) - the hub's public routing entry point.
