# [parent-skill-name] Surface Router — per-intent leaf sets

<!-- Second-layer (surface) router scaffold. Copy to shared/references/smart_routing.md
     in the hub root and replace every [bracketed] placeholder. The hub router
     (hub-router.json) selects a workflow MODE; this file maps a request's intent
     to the exact packet-local leaf resources that mode should load. Keep INTENT_SIGNALS
     and RESOURCE_MAP keys aligned. Delete FULL_INVENTORY if the hub has no
     show-everything intent. -->

This is [parent-skill-name]'s second-layer surface router. Every RESOURCE_MAP path is
either packet-qualified (`[packet]/references|assets/…`) or a shared-alias disk path
(`shared/…` listed in `leaf-aliases.json`); both convert to the canonical
`(workflowMode, leafResourceId)` pair at the one contract boundary — see
[parent_hub_router_schema.md](../../references/parent_skill/parent_hub_router_schema.md)
§8 (path contract). Never strip a prefix generically and never infer a shared-tier
file into a mode.

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

## How to read this

- One dominant intent routes to one mode's leaf set.
- Two near-tied intents (within the router's ambiguity delta) route to both leaf
  sets; the union is deduped by canonical pair.
- No keyword match is UNKNOWN_FALLBACK: confirm the target artifact and intent
  before loading anything.
- `FULL_INVENTORY` fires only on an explicit "show the whole toolkit" request. Two
  workflow modes that share one packet directory (N-to-1 fan-out) resolve from a
  packet-qualified raw path to whichever mode is bound first; the fan-out twin is an
  exact leaf duplicate. If a hub must enumerate both twins distinctly, drive that
  from the manifest, not from raw router strings.
