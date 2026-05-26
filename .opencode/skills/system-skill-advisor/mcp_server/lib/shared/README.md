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

---

## 1. OVERVIEW

`lib/shared/` holds advisor-local helpers that are reused by multiple advisor modules. It is not the canonical `@spec-kit/shared` package; imports from `embeddings/` are a compatibility bridge to the shared package owned by `system-spec-kit/shared`.

---

## 2. OWNERSHIP

| Surface | Owner | Notes |
|---|---|---|
| `shared-payload.ts` | Skill advisor | Shared payload shape helpers for advisor runtime code. |
| `unicode-normalization.ts` | Skill advisor | Prompt and label normalization helpers. |
| `embeddings` symlink | `@spec-kit/shared` | Compatibility path only. Do not add advisor-owned embedder logic through the symlink. |

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `shared-payload.ts` | Defines reusable payload helpers shared across advisor modules. |
| `unicode-normalization.ts` | Normalizes Unicode-sensitive strings before scoring or rendering. |
| `embeddings` | Symlink bridge to the canonical shared embedding implementation. |

---

## 4. BOUNDARIES

- Keep advisor-specific helper code here only when it is used by more than one advisor module.
- Keep embedding registry, adapters and cascade logic in `@spec-kit/shared`.
- Do not place MCP handler registration, database mutation flows or test fixtures in this folder.

---

## 5. ENTRYPOINTS

```text
lib/shared/shared-payload.ts
lib/shared/unicode-normalization.ts
```

Runtime imports should compile into `mcp_server/dist/mcp_server/lib/shared/`.

---

## 6. VALIDATION

Run from the repository root.

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp_server/lib/shared/README.md
```

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../embedders/README.md`](../embedders/README.md)
- [`../../../../system-spec-kit/shared/README.md`](../../../../system-spec-kit/shared/README.md)
