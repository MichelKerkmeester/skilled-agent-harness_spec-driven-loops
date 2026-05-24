---
title: "Skill Advisor Embedder Adapter Shims"
description: "Stable advisor-owned adapter import paths that re-export canonical adapter implementations from @spec-kit/shared."
trigger_phrases:
  - "advisor embedder adapters"
  - "ollama adapter shim"
  - "embedder adapter shim"
---

# Skill Advisor Embedder Adapter Shims

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

`lib/embedders/adapters/` keeps stable advisor import paths for adapter implementations. The actual adapter logic is owned by `@spec-kit/shared`; this folder only re-exports those implementations.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| `ollama.ts` shim | Skill advisor | Preserves advisor-local import path. |
| Ollama adapter implementation | `@spec-kit/shared` | Source of truth for behavior and model handling. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `ollama.ts` | Re-exports `@spec-kit/shared/embeddings/adapters/ollama.js`. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Keep files in this folder as thin re-export shims.
- Do not fork adapter behavior in the advisor package.
- Add adapter parity tests before changing any shim path.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

```text
import { OllamaAdapter } from './adapters/ollama.js'
```

Compiled output belongs under `mcp_server/dist/mcp_server/lib/embedders/adapters/`.

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/embedders/shared-factory-parity.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../../../tests/embedders/README.md`](../../../tests/embedders/README.md)

<!-- /ANCHOR:7-related -->
