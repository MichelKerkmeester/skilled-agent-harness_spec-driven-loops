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

`lib/embedders/` is the advisor package's local adapter surface for skill-graph embeddings. It owns advisor database schema helpers and re-exports the canonical embedder registry from `@spec-kit/shared`.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| Active embedder pointer | Skill advisor | Stored in advisor SQLite `vec_metadata`. |
| Embedder manifests and adapters | `@spec-kit/shared` | Re-exported here to keep public advisor imports stable. |
| Vector table schema | Skill advisor | Creates `vec_<dim>` tables inside the advisor DB. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `schema.ts` | Active embedder pointer, vector table creation and auto-select integration. |
| `registry.ts` | Re-exports canonical manifests and factory helpers from `@spec-kit/shared`. |
| `adapter.ts` | Re-exports the canonical adapter contract. |
| `types.ts` | Re-exports shared embedder types. |
| `index.ts` | Package-level embedder exports. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Add advisor database schema logic here.
- Add canonical model/provider registry changes in `system-spec-kit/shared`, not here.
- Keep adapter implementations inside `@spec-kit/shared` and expose them here through shims.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

```text
getActiveEmbedder()
setActiveEmbedder()
ensureActiveEmbedder()
refreshSkillEmbeddings() callers in ../skill-graph/
```

Compiled output belongs under `mcp_server/dist/mcp_server/lib/embedders/`.

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/embedders
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`adapters/README.md`](adapters/README.md)
- [`../skill-graph/README.md`](../skill-graph/README.md)
- [`../../tests/embedders/README.md`](../../tests/embedders/README.md)

<!-- /ANCHOR:7-related -->
