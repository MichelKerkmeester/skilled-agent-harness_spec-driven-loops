---
title: "Skill Advisor Test Fixtures"
description: "Shared fixtures for the skill advisor test suites: lifecycle metadata, skill-graph metadata writers, error envelopes and the affordance injection corpus."
trigger_phrases:
  - "skill advisor fixtures"
  - "advisor lifecycle fixtures"
---

# Skill Advisor Test Fixtures

<!-- sk-doc-template: skill_readme -->

> Shared fixtures for the skill advisor test suites.

---

## 1. OVERVIEW

`tests/fixtures/` stores small reusable data objects for skill advisor test suites.

Current state:

- Exposes lifecycle metadata fixtures from `lifecycle/index.ts`.
- Holds the error envelope builder handler tests assert against, and the adversarial affordance phrase corpus shared by the TypeScript and Python sanitizer tests.
- Covers active, deprecated, archived, future and legacy metadata shapes.
- Keeps shared test data separate from handler and compatibility assertions.

---

## 2. DIRECTORY TREE

```text
fixtures/
+-- lifecycle/
|   `-- index.ts                          # Lifecycle metadata fixture exports
+-- affordance-injection-fixtures.json    # Injection, benign and privacy phrases
+-- errors.ts                             # MemoryError and buildErrorResponse
+-- skill-graph-db.ts                     # writeGraphMetadata helper
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `lifecycle/index.ts` | Exports `lifecycleFixtures` for redirect, archive, future and version-mix scenarios. |
| `affordance-injection-fixtures.json` | Injection phrases that must be dropped, benign phrases that must survive normalization, and privacy phrases. Read by `affordance-normalizer.test.ts` and `python/test_skill_advisor.py`, so both sanitizers stay row-for-row identical. |
| `errors.ts` | `MemoryError` (a named error with a `code` and `context`) and `buildErrorResponse(toolName, error, input)`, which redacts the raw prompt out of the message, context and echoed input. Used by `handlers/advisor-recommend.vitest.ts`. |
| `skill-graph-db.ts` | `writeGraphMetadata()`, which writes skill graph metadata files for tests that build a graph database. |

---

## 4. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | Test suites may import fixture exports directly. |
| Exports | Fixture modules export data or small builders; none of them hold test assertions. |
| Ownership | Add shared advisor test data here when more than one suite needs it. |

---

## 5. RELATED

- [`../README.md`](../README.md)
- [`../handlers/README.md`](../handlers/README.md)
- [`../compat/README.md`](../compat/README.md)
