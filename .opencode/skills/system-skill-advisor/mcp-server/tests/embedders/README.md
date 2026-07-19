---
title: "Skill Advisor Embedder Tests"
description: "Vitest coverage for advisor embedder schema helpers, registry parity and active embedder selection."
trigger_phrases:
  - "embedder tests"
  - "advisor embedder tests"
  - "shared factory parity"
---

# Skill Advisor Embedder Tests

<!-- sk-doc-template: code_folder_readme -->

---

## 1. OVERVIEW

`tests/embedders/` verifies the advisor embedder shim layer, active embedder schema helpers and parity with `@spec-kit/shared`. Tests stay offline-safe by checking construction, metadata and mocks rather than calling external embedding services.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Schema tests | Skill advisor tests | Validate advisor SQLite pointer behavior. |
| Registry parity | Shared/advisor boundary | Proves shim exports match `@spec-kit/shared`. |
| Provider availability | Test mocks | Avoid dependency on local Ollama or network services. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `ensure-active-embedder.vitest.ts` | Covers auto-selection and orphan-pointer handling. |
| `registry.vitest.ts` | Guards manifest registry behavior. |
| `schema.vitest.ts` | Tests vector table and active pointer schema helpers. |
| `shared-factory-parity.vitest.ts` | Verifies advisor shims match direct `@spec-kit/shared` imports. |

---

## 4. BOUNDARIES

- Keep tests offline-safe and deterministic.
- Put canonical embedder behavior tests in `system-spec-kit/shared` when testing shared package internals.
- Keep advisor tests focused on shim, schema and integration boundaries.

---

## 5. ENTRYPOINTS

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test -- tests/embedders
```

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test -- tests/embedders
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/tests/embedders/README.md
```

---

## 7. RELATED

- [`../../lib/embedders/README.md`](../../lib/embedders/README.md)
- [`../skill-graph/README.md`](../skill-graph/README.md)
- [`../README.md`](../README.md)
