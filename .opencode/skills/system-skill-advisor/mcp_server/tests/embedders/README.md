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

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. OWNERSHIP](#2--ownership)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

`tests/embedders/` verifies the advisor embedder shim layer, active embedder schema helpers and parity with `@spec-kit/shared`. Tests stay offline-safe by checking construction, metadata and mocks rather than calling external embedding services.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Schema tests | Skill advisor tests | Validate advisor SQLite pointer behavior. |
| Registry parity | Shared/advisor boundary | Proves shim exports match `@spec-kit/shared`. |
| Provider availability | Test mocks | Avoid dependency on local Ollama or network services. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `ensure-active-embedder.vitest.ts` | Covers auto-selection and orphan-pointer handling. |
| `registry.vitest.ts` | Guards manifest registry behavior. |
| `schema.vitest.ts` | Tests vector table and active pointer schema helpers. |
| `shared-factory-parity.vitest.ts` | Verifies advisor shims match direct `@spec-kit/shared` imports. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Keep tests offline-safe and deterministic.
- Put canonical embedder behavior tests in `system-spec-kit/shared` when testing shared package internals.
- Keep advisor tests focused on shim, schema and integration boundaries.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/embedders
```

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/embedders
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/tests/embedders/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../../lib/embedders/README.md`](../../lib/embedders/README.md)
- [`../skill-graph/README.md`](../skill-graph/README.md)
- [`../README.md`](../README.md)

<!-- /ANCHOR:7-related -->
