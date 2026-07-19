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

---

## 1. OVERVIEW

`lib/embedders/adapters/` keeps stable advisor import paths for adapter implementations. The actual adapter logic is owned by `@spec-kit/shared`; this folder only re-exports those implementations.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| `ollama.ts` shim | Skill advisor | Preserves advisor-local import path. |
| Ollama adapter implementation | `@spec-kit/shared` | Source of truth for behavior and model handling. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `ollama.ts` | Re-exports `@spec-kit/shared/embeddings/adapters/ollama.js`. |

---

## 4. BOUNDARIES

- Keep files in this folder as thin re-export shims.
- Do not fork adapter behavior in the advisor package.
- Add adapter parity tests before changing any shim path.

---

## 5. ENTRYPOINTS

```text
import { OllamaAdapter } from './adapters/ollama.js'
```

Compiled output belongs under `mcp-server/dist/mcp-server/lib/embedders/adapters/`.

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test -- tests/embedders/shared-factory-parity.vitest.ts
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/lib/embedders/adapters/README.md
```

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../../../tests/embedders/README.md`](../../../tests/embedders/README.md)
