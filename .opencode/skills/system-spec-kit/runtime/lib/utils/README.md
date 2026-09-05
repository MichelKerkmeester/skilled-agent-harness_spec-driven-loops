---
title: "Utils: Path Identity and Scope"
description: "Canonical path identity, index-scope invariants, prompt-safety label sanitization, and exhaustiveness checking shared across the runtime package."
trigger_phrases:
  - "canonical path"
  - "index scope"
  - "skill label sanitizer"
  - "assertNever"
---

# Utils: Path Identity and Scope

> Low-level shared plumbing: path identity, index scope, prompt-safety sanitization, and exhaustiveness checking.

---

## 1. OVERVIEW

`lib/utils/` is a dependency root: it owns low-level shared plumbing that domain modules import, and it imports no domain module of its own. Four small, independent files live here.

Current state:

- `canonical-path.ts` resolves a path to its realpath-based canonical identity, falling back to a resolved absolute path when the target does not exist yet (the atomic-save case).
- `index-scope.ts` is the single source of truth for what is in scope for memory indexing, generated-metadata derivation, and code-graph scanning, and for the code-graph inclusion policy that gates `.opencode/` skills, agents, commands, specs, and plugins.
- `skill-label-sanitizer.ts` strips instruction-shaped labels and control characters before a label reaches a prompt, so a hostile skill name cannot smuggle an instruction across the shared-payload transport boundary.
- `exhaustiveness.ts` provides `assertNever()` for statically unreachable switch branches.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `canonical-path.ts` | `getCanonicalPathKey()`, `resolveCanonicalPath()`, and `canonicalizeForSpecFolderExtraction()` for symlink-aware path deduplication. |
| `index-scope.ts` | `shouldIndexForMemory()`, `isExcludedFromGeneratedMetadata()`, `shouldIndexForCodeGraph()`, and the `IndexScopePolicy` resolution behind the code-graph inclusion flags. |
| `skill-label-sanitizer.ts` | `sanitizeSkillLabel()`: canonical-folds, single-lines, and rejects instruction-shaped or control-character labels. |
| `exhaustiveness.ts` | `assertNever()`: throws for a branch that should be statically unreachable. |

---

## 3. BOUNDARIES

| Boundary | Rule |
|---|---|
| Imports | This folder imports nothing from sibling `lib/` domain modules. It may be imported by any other `lib/` module, by handlers, and by hooks. |
| Exclusion source of truth | `EXCLUDED_FOR_MEMORY`, `EXCLUDED_FOR_CODE_GRAPH`, and `EXCLUDED_FOR_GENERATED_METADATA` in `index-scope.ts` are the only place `z-future`, `z_archive`, `external`, `node_modules`, `.git`, `dist`, and `vendor` segment exclusions are declared; callers read these functions rather than re-deriving their own skip lists. |
| Prompt safety | `sanitizeSkillLabel()` is the only sanitizer `lib/context/shared-payload.ts` uses for label fields; it must stay in `lib/utils/` so cross-cutting payload code does not depend on an advisor-renderer module for it. |

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `getCanonicalPathKey(filePath)` | Function | Canonical identity string for path deduplication (realpath when possible, resolved absolute path otherwise). |
| `resolveCanonicalPath(absPath)` | Function | Realpath a path, failing open to the caller-supplied absolute path when the target is missing or broken. |
| `canonicalizeForSpecFolderExtraction(filePath)` | Function | Realpath a path for spec-folder extraction, walking up to the nearest existing ancestor when the file does not exist yet. |
| `shouldIndexForMemory(absolutePath)` | Function | Whether a path sits outside the memory index's z-future/external exclusion segments. |
| `isExcludedFromGeneratedMetadata(absolutePath)` | Function | Whether a path sits under a z-future/staging segment and must be excluded from generated metadata. |
| `shouldIndexForCodeGraph(absolutePath, policy)` | Function | Whether a path should be included in the code graph under the given or freshly resolved scope policy. |
| `sanitizeSkillLabel(skillLabel)` | Function | Sanitize a skill label to a single-line, control-character-free, non-instruction-shaped string, or `null`. |
| `assertNever(value, context)` | Function | Throw for a branch that should be statically unreachable, with optional call-site context. |

---

## 5. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run tests/index-scope.vitest.ts tests/exhaustiveness.vitest.ts tests/architecture-seam.vitest.ts
```

Expected result: index-scope and exhaustiveness suites pass directly; the seam suite exercises `sanitizeSkillLabel()`. `canonical-path.ts` has no dedicated suite and is exercised indirectly through discovery tests.

---

## 6. RELATED

- [`../README.md`](../README.md)
- [`../config/README.md`](../config/README.md)
- [`../context/README.md`](../context/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
