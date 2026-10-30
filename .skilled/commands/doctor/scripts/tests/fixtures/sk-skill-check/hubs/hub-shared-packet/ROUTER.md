---
title: fixture-hub-shared surface router
description: Invented stage-two router whose two modes load the same packet leaves.
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# fixture-hub-shared Surface Router

The hub picks the mode; this document picks the leaves. Both fixture modes share
one packet, so both stage-two intents load the same leaves.

```python
INTENT_SIGNALS = {
    "SHARED": {"weight": 4, "keywords": ["fixture shared request", "fixture shared mode"]},
    "SHARED_PARENT": {"weight": 4, "keywords": ["fixture shared parent request", "fixture shared parent mode"]},
}

RESOURCE_MAP = {
    "SHARED": [
        "fixture-shared-mode/references/fixture-shared.md"
    ],
    "SHARED_PARENT": [
        "fixture-shared-mode/references/fixture-shared.md"
    ],
}
```
