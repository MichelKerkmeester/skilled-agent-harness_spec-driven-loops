---
title: Parent Skill Root Router Template - Root ROUTER.md Authoring
description: Authoring guide for the root ROUTER.md stage-two control document: the active state maps request intent to packet-local leaf resources, and the stage1-only state delegates all routing to hub-router.json plus mode-registry.json.
trigger_phrases:
  - "parent skill root router template"
  - "root router authoring"
  - "intent signals resource map"
  - "leaf resource routing"
  - "stage1-only router"
importance_tier: normal
contextType: general
version: 1.1.0.0
router_state: active
skill_pointer: SKILL.md
---

# [parent-skill-name] Root Router — Two-State Authoring

The parent hub's stage-two control document is first-class at the hub root as
`ROUTER.md` — never at a nested path. `hub-router.json` selects a workflow mode;
this document maps a request's intent to the exact packet-local leaf resources
that mode loads. It declares exactly one of two states:

| State | Meaning | Stage-two content |
|-------|---------|-------------------|
| `router_state: active` | The hub owns second-stage leaf selection | Non-empty equal-key `INTENT_SIGNALS` / `RESOURCE_MAP`; `SHARED_CONTROL_RESOURCES` names `shared/…` control documents exempt from typed-pair checks |
| `router_state: stage1-only` | The hub owns no leaf selection | Empty maps, empty stage-two default, and empty `SHARED_CONTROL_RESOURCES`; routing delegates to `hub-router.json` plus `mode-registry.json` |

Every `RESOURCE_MAP` path is either packet-qualified (`[packet]/references|assets/…`) or a shared-alias disk path (`shared/…` listed in `leaf-aliases.json`). Both convert to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary. Keep `INTENT_SIGNALS` and `RESOURCE_MAP` keys aligned. Delete `FULL_INVENTORY` if the hub has no show-everything intent. A root `skill_pointer: SKILL.md` and a four-part `version` are required in both states, and the router must never coexist with a legacy `smart-routing.md`.

---

## 1. ACTIVE STATE

Replace `router_state` with `active` only after a concrete leaf map exists. Every path below must resolve on disk and be registered in `leaf-manifest.json` as a typed pair.

```python
# An always-loaded preamble is optional; [] keeps the default route minimal.
DEFAULT_RESOURCE = []

# Hub-shared control documents deliberately exempted from typed-pair checks.
# Each entry must start with `shared/` and be referenced by RESOURCE_MAP below.
SHARED_CONTROL_RESOURCES = ["shared/references/[shared-standard].md"]

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

## 2. STAGE1-ONLY STATE

A hub with no authored leaf map stays `stage1-only`: all four collections remain empty and the prose delegates routing to stage one.

```python
DEFAULT_RESOURCE = []

SHARED_CONTROL_RESOURCES = []

INTENT_SIGNALS = {}

RESOURCE_MAP = {}
```

Promote to `active` only when the maps carry concrete, resolvable leaf paths — never placeholder intents.

---

## 3. HOW TO READ THIS

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the router's ambiguity delta) route to both leaf sets. The union is deduped by canonical pair.
- No keyword match is `UNKNOWN_FALLBACK`. Confirm the target artifact and intent before loading anything.
- `FULL_INVENTORY` fires only on an explicit "show the whole toolkit" request. Two workflow modes that share one packet directory (N-to-1 fan-out) resolve from a packet-qualified raw path to whichever mode is bound first. The fan-out twin is an exact leaf duplicate. If a hub must enumerate both twins distinctly, drive that from the manifest, not from raw router strings.

---

## 4. RELATED RESOURCES

- [`parent-hub-router-schema.md`](../../references/parent-skill/parent-hub-router-schema.md) - The two-axis hub router schema and the path contract these paths obey.
- [`parent-skill-hub-template.md`](./parent-skill-hub-template.md) - The first-layer hub scaffold this router pairs with.
