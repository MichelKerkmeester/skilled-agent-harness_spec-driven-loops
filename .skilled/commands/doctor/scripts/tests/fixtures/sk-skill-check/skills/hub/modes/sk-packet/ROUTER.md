---
name: sk-packet
description: Router fixture for the nested packet.
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---
# Packet Router Fixture

## 1. OVERVIEW

This fixture declares one nested route.

## 3. MACHINE ROUTER

```python
INTENT_SIGNALS = {
    "FIXTURE": {"weight": 1, "keywords": ["fixture"]},
}

RESOURCE_MAP = {
    "FIXTURE": ["SKILL.md"],
}
```
