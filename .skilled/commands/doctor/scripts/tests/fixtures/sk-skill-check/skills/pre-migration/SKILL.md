---
name: fixture-pre-migration
description: A synthetic earlier skill with its router at the end of this file.
allowed-tools: [Read, Grep, Glob]
version: 1.0.0.0
---
# Earlier Fixture

## 1. WHEN TO USE

Use this fixture to exercise the earlier inline-router shape.

## 2. SMART ROUTING

The machine router is kept at the end of this document.

## 3. MACHINE ROUTER

```python
INTENT_SIGNALS = {
    "FIXTURE": {"weight": 1, "keywords": ["fixture"]},
}

RESOURCE_MAP = {
    "FIXTURE": ["SKILL.md"],
}
```
