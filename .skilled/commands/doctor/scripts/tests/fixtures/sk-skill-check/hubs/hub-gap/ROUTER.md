---
title: fixture-hub-gap surface router
description: Invented stage-two router for the hub gap fixture.
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# fixture-hub-gap Surface Router

The hub picks the mode; this document picks the leaves.

```python
INTENT_SIGNALS = {
    "GAP_MODE": {"weight": 4, "keywords": ["fixture gap request", "fixture gap mode"]},
    "GAP_MUTE": {"weight": 4, "keywords": ["fixture gap mute", "fixture mute mode"]},
}

RESOURCE_MAP = {
    "GAP_MODE": [
        "fixture-gap-mode/references/fixture-mode.md"
    ],
    "GAP_MUTE": [
        "fixture-gap-mute/references/fixture-mute.md"
    ],
}
```

`FULL_INVENTORY` is absent because this fixture hub has no full-toolkit intent.
