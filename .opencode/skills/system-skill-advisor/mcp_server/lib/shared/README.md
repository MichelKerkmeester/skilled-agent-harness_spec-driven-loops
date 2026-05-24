---
title: "Skill Advisor Shared Helpers"
description: "Small advisor-owned shared helpers and compatibility shims used by the TypeScript runtime without owning the canonical spec-kit shared package."
trigger_phrases:
  - "skill advisor shared helpers"
  - "advisor shared lib"
  - "shared-payload"
---

# Skill Advisor Shared Helpers

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

`lib/shared/` holds advisor-local helpers that are reused by multiple advisor modules. It is not the canonical `@spec-kit/shared` package; imports from `embeddings/` are a compatibility bridge to the shared package owned by `system-spec-kit/shared`.

<!-- /ANCHOR:1-overview -->

---

<!-- ANCHOR:2-ownership -->
## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| `shared-payload.ts` | Skill advisor | Shared payload shape helpers for advisor runtime code. |
| `unicode-normalization.ts` | Skill advisor | Prompt and label normalization helpers. |
| `embeddings` symlink | `@spec-kit/shared` | Compatibility path only. Do not add advisor-owned embedder logic through the symlink. |

<!-- /ANCHOR:2-ownership -->

---

<!-- ANCHOR:3-key-files -->
## 3. KEY FILES

| File | Responsibility |
|---|---|
| `shared-payload.ts` | Defines reusable payload helpers shared across advisor modules. |
| `unicode-normalization.ts` | Normalizes Unicode-sensitive strings before scoring or rendering. |
| `embeddings` | Symlink bridge to the canonical shared embedding implementation. |

<!-- /ANCHOR:3-key-files -->

---

<!-- ANCHOR:4-boundaries -->
## 4. BOUNDARIES

- Keep advisor-specific helper code here only when it is used by more than one advisor module.
- Keep embedding registry, adapters and cascade logic in `@spec-kit/shared`.
- Do not place MCP handler registration, database mutation flows or test fixtures in this folder.

<!-- /ANCHOR:4-boundaries -->

---

<!-- ANCHOR:5-entrypoints -->
## 5. ENTRYPOINTS

```text
lib/shared/shared-payload.ts
lib/shared/unicode-normalization.ts
```

Runtime imports should compile into `mcp_server/dist/mcp_server/lib/shared/`.

<!-- /ANCHOR:5-entrypoints -->

---

<!-- ANCHOR:6-validation -->
## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/shared/README.md
```

<!-- /ANCHOR:6-validation -->

---

<!-- ANCHOR:7-related -->
## 7. RELATED

- [`../README.md`](../README.md)
- [`../embedders/README.md`](../embedders/README.md)
- [`../../../../system-spec-kit/shared/README.md`](../../../../system-spec-kit/shared/README.md)

<!-- /ANCHOR:7-related -->
