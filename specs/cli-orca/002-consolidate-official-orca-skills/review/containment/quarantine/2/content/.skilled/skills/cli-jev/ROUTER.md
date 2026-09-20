---
title: cli-jev Root Router - stage-one routing control
description: Stage-two control document for the cli-jev hub. It declares router_state stage1-only with empty stage-two maps: hub-router.json plus mode-registry.json own the whole routing story until an author promotes this file with a concrete leaf map.
trigger_phrases:
  - "cli-jev root router"
  - "jev routing control"
  - "typed judgment routing"
importance_tier: important
contextType: implementation
version: 0.1.0.0
router_state: stage1-only
skill_pointer: SKILL.md
---

# cli-jev Root Router

This is the cli-jev hub's second-layer control document, first-class at the hub root as `ROUTER.md`. `hub-router.json` selects the workflow mode; this document would map a request's intent to the exact packet-local leaf resources that mode loads.

The hub ships `router_state: stage1-only`: it owns no second stage yet, so all four machine collections stay empty and routing delegates to `hub-router.json` plus `mode-registry.json`. Promote to `active` only when the maps carry concrete, resolvable leaf paths, never placeholder intents. Every `RESOURCE_MAP` path would be packet-qualified (`cli-usage/references|assets/...`) or a shared-alias disk path (`shared/...` listed in `leaf-aliases.json`), and both would convert to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

---

## 1. OVERVIEW

`SKILL.md` picks the mode. This document, once promoted, would pick what that mode loads. Until then, a cli-jev request loads the transport packet's own `SKILL.md` through `hub-router.json`, and the transport's references are navigation, not stage-two selections.

An intent that matches nothing is a gap to report, not a reason to load everything.

---

## 2. INTENT MODEL

The one registered mode is `cli-usage`, a `packetKind: "transport"` bridge to the `jev` CLI and MCP surface. A judgment request resolves to it; a request that needs work done resolves to a workflow mode in whatever hub owns that work, with the transport attached as the judgment source.

One dominant judgment intent routes to the transport. Two near-tied intents (within the router's ambiguity delta) defer rather than guess a value.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. This block is the byte-for-byte source the deterministic router-replay parses. In the stage1-only state every collection stays declared and empty.

```python
# No stage-two selections exist yet: the hub delegates to hub-router.json and
# mode-registry.json, so every collection below stays declared and empty.
DEFAULT_RESOURCE = []

SHARED_CONTROL_RESOURCES = []

INTENT_SIGNALS = {}

RESOURCE_MAP = {}
```

---

## 4. HOW TO READ THIS

- One dominant intent would route to one mode's leaf set; today stage one owns that decision.
- No keyword match is `UNKNOWN_FALLBACK`: confirm the target mode before loading anything.
- `FULL_INVENTORY` is absent because the hub has no show-everything intent.

---

## RELATED RESOURCES

- [`hub-router.json`](./hub-router.json) - first-stage mode selection.
- [`mode-registry.json`](./mode-registry.json) - the packet registry and discriminator source.
- [`SKILL.md`](./SKILL.md) - the hub's public routing entry point.
