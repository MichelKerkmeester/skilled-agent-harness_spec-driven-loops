---
title: "Skill Advisor Embedders"
description: "Advisor-local embedder schema and shim layer over the canonical @spec-kit/shared embedding registry and auto-select cascade."
trigger_phrases:
  - "skill advisor embedders"
  - "advisor embedder schema"
  - "active embedder"
---

# Skill Advisor Embedders

<!-- sk-doc-template: code_folder_readme -->

---

## 1. OVERVIEW

`lib/embedders/` is the advisor package's local adapter surface for skill-graph embeddings. It owns advisor database schema helpers and re-exports the canonical embedder registry from `@spec-kit/shared`.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Active embedder pointer | Skill advisor | Stored in advisor SQLite `vec_metadata`. |
| Embedder manifests and adapters | `@spec-kit/shared` | Re-exported here to keep public advisor imports stable. |
| Vector table schema | Skill advisor | Creates `vec_<dim>` tables inside the advisor DB. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `schema.ts` | Active embedder pointer, vector table creation and auto-select integration. |
| `registry.ts` | Re-exports canonical manifests and factory helpers from `@spec-kit/shared`. |
| `adapter.ts` | Re-exports the canonical adapter contract. |
| `types.ts` | Re-exports shared embedder types. |
| `index.ts` | Package-level embedder exports. |

---

## 4. BOUNDARIES

- Add advisor database schema logic here.
- Add canonical model/provider registry changes in `system-spec-kit/shared`, not here.
- Keep adapter implementations inside `@spec-kit/shared` and expose them here through shims.

---

## 5. ENTRYPOINTS

```text
getActiveEmbedder()
setActiveEmbedder()
ensureActiveEmbedder()
refreshSkillEmbeddings() callers in ../skill-graph/
```

Compiled output belongs under `mcp-server/dist/mcp-server/lib/embedders/`.

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test -- tests/embedders
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/lib/embedders/README.md
```

---

## 7. RELATED

- [`adapters/README.md`](adapters/README.md)
- [`../skill-graph/README.md`](../skill-graph/README.md)
- [`../../tests/embedders/README.md`](../../tests/embedders/README.md)
