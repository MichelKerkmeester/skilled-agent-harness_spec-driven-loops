---
name: fixture-dual
description: Second router declaration for the synthetic skill.
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---
# Dual Fixture Router

## 3. MACHINE ROUTER

```python
INTENT_SIGNALS = {
    "SIBLING": {"weight": 1, "keywords": ["sibling"]},
}

RESOURCE_MAP = {
    "SIBLING": ["SKILL.md"],
}
```
