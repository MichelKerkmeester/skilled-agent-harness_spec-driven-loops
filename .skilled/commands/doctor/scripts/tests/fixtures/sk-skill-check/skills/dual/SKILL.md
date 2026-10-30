---
name: fixture-dual
description: A synthetic skill that declares its router in two places.
allowed-tools: [Read, Grep, Glob]
version: 1.0.0.0
---
# Dual Fixture

## 1. WHEN TO USE

Use this fixture to exercise duplicate router declarations.

## 2. SMART ROUTING

The sibling [ROUTER.md](./ROUTER.md) is also present.

## 3. MACHINE ROUTER

```python
INTENT_SIGNALS = {
    "INLINE": {"weight": 1, "keywords": ["inline"]},
}

RESOURCE_MAP = {
    "INLINE": ["SKILL.md"],
}
```
