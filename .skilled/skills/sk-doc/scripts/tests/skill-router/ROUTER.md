---
title: "Fixture Router"
description: "A sibling router fixture that opens with an overview and ends with the machine router."
---

# Fixture Router

> A sibling router fixture for the skill_router document type.

---

## 1. OVERVIEW

This fixture proves a ROUTER.md auto-detects as a skill router.

---

## 2. INTENT MODEL

One intent, `FIXTURE`, loads one reference.

---

## 3. MACHINE ROUTER

```python
INTENT_SIGNALS = {"FIXTURE": {"weight": 4, "keywords": ["fixture"]}}
RESOURCE_MAP = {"FIXTURE": ["references/fixture.md"]}
DEFAULT_RESOURCE = "references/fixture.md"
```
