---
name: fixture-canon
description: Router fixture for the synthetic current skill.
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---
# Canon Fixture Router

## 1. OVERVIEW

This small fixture declares one route.

## 3. MACHINE ROUTER

```python
INTENT_SIGNALS = {
    "FIXTURE": {"weight": 1, "keywords": ["fixture"]},
}

RESOURCE_MAP = {
    "FIXTURE": ["SKILL.md"],
}
```
