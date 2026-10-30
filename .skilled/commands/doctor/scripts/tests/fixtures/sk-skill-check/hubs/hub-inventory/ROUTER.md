---
title: fixture-hub-inventory surface router
description: Invented stage-two router that also carries a full-toolkit intent.
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# fixture-hub-inventory Surface Router

The hub picks the mode; this document picks the leaves.

```python
INTENT_SIGNALS = {
    "INVENTORY": {"weight": 4, "keywords": ["fixture inventory request", "fixture inventory mode"]},
    "FULL_INVENTORY": {"weight": 4, "keywords": ["full fixture toolkit"]},
}

RESOURCE_MAP = {
    "INVENTORY": [
        "fixture-inventory-mode/references/fixture-inventory.md"
    ],
    "FULL_INVENTORY": [
        "fixture-inventory-mode/references/fixture-inventory.md"
    ],
}
```
