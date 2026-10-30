---
name: fixture-mode-template
description: Router fixture whose intent map is the mode template spelling, keyed in lowercase.
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---
# Mode Template Fixture Router

## 1. OVERVIEW

This fixture declares one route, named and keyed the way the skill router template permits.

## 3. MACHINE ROUTER

```python
INTENT_MODEL = {
    "fixture_mode": {"weight": 4, "keywords": ["fixture", "mode template"]},
}

RESOURCE_MAP = {
    "fixture_mode": ["SKILL.md"],
}
```
