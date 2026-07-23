---
title: Parent Skill Smart Routing Template - Surface Router Scaffold
description: Copy-paste second-layer surface router scaffold that maps request intent to packet-local leaf resources for a parent hub.
trigger_phrases:
  - "parent skill smart routing template"
  - "surface router scaffold"
  - "intent signals resource map"
  - "leaf resource routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# [parent-skill-name] Surface Router - Per-Intent Leaf Sets

A copy-paste scaffold for a parent hub's second-layer surface router. It maps a request's intent to the exact packet-local leaf resources a mode should load.

---

## 1. OVERVIEW

### Purpose

The hub router (`hub-router.json`) selects a workflow mode. This file is the second layer: it maps a request's intent to the specific leaf resources that mode loads. Copy it to `shared/references/smart-routing.md` in the hub root and replace every bracketed placeholder.

### Usage

Every `RESOURCE_MAP` path is either packet-qualified (`[packet]/references|assets/…`) or a shared-alias disk path (`shared/…` listed in `leaf-aliases.json`). Both convert to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary. See [parent-hub-router-schema.md](../../references/parent-skill/parent-hub-router-schema.md) section 8, the path contract. Never strip a prefix generically, and never infer a shared-tier file into a mode. Keep `INTENT_SIGNALS` and `RESOURCE_MAP` keys aligned. Delete `FULL_INVENTORY` if the hub has no show-everything intent.

---

## 2. INTENT SIGNALS AND RESOURCE MAP

```python
INTENT_SIGNALS = {
    "[INTENT_A]": {"weight": 4, "keywords": ["[phrase a1]", "[phrase a2]"]},
    "[INTENT_B]": {"weight": 4, "keywords": ["[phrase b1]", "[phrase b2]"]},
    "FULL_INVENTORY": {"weight": 4, "keywords": ["full [parent-skill-name] toolkit", "show the full", "all templates"]},
}

RESOURCE_MAP = {
    "[INTENT_A]": [
        "[packet-a]/references/[leaf-a1].md",
        "[packet-a]/assets/[leaf-a2].md"
    ],
    "[INTENT_B]": [
        "[packet-b]/references/[leaf-b1].md",
        "shared/references/[shared-standard].md"
    ],
    "FULL_INVENTORY": [
        "[packet-a]/references/[leaf-a1].md",
        "[packet-b]/references/[leaf-b1].md"
    ],
}
```

---

## 3. HOW TO READ THIS

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the router's ambiguity delta) route to both leaf sets. The union is deduped by canonical pair.
- No keyword match is `UNKNOWN_FALLBACK`. Confirm the target artifact and intent before loading anything.
- `FULL_INVENTORY` fires only on an explicit "show the whole toolkit" request. Two workflow modes that share one packet directory (N-to-1 fan-out) resolve from a packet-qualified raw path to whichever mode is bound first. The fan-out twin is an exact leaf duplicate. If a hub must enumerate both twins distinctly, drive that from the manifest, not from raw router strings.

---

## 4. RELATED RESOURCES

- [`parent-hub-router-schema.md`](../../references/parent-skill/parent-hub-router-schema.md) - The two-axis hub router schema and the path contract (section 8) these paths obey.
- [`parent-skill-hub-template.md`](./parent-skill-hub-template.md) - The first-layer hub scaffold this surface router pairs with.
