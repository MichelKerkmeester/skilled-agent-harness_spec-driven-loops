---
title: "Skill Advisor Test Fixtures"
description: "Shared fixture data for skill advisor lifecycle tests."
trigger_phrases:
  - "skill advisor fixtures"
  - "advisor lifecycle fixtures"
---

# Skill Advisor Test Fixtures

<!-- sk-doc-template: skill_readme -->

> Shared fixture data for skill advisor lifecycle tests.

---

## 1. OVERVIEW

`tests/fixtures/` stores small reusable data objects for skill advisor test suites.

Current state:

- Exposes lifecycle metadata fixtures from `lifecycle/index.ts`.
- Covers active, deprecated, archived, future and legacy metadata shapes.
- Keeps shared test data separate from handler and compatibility assertions.

---

## 2. DIRECTORY TREE

```text
fixtures/
+-- lifecycle/
|   `-- index.ts       # Lifecycle metadata fixture exports
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `lifecycle/index.ts` | Exports `lifecycleFixtures` for redirect, archive, future and version-mix scenarios. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Test suites may import fixture exports directly. |
| Exports | Fixture modules export static data only. |
| Ownership | Add shared advisor test data here when more than one suite needs it. |

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../compat/README.md`](../compat/README.md)
