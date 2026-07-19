---
title: "Code Graph Utils: Workspace Path Safety"
description: "Shared workspace-boundary helpers used by code-graph handlers that accept caller-supplied paths."
trigger_phrases:
  - "workspace path validation"
  - "code graph utils"
  - "canonicalize workspace paths"
  - "workspace containment"
---

# Code Graph Utils: Workspace Path Safety

> Workspace canonicalization and containment helpers shared across the code-graph handler surface.

---

## 1. OVERVIEW

`utils/` provides one module: `workspace-path.ts`. It canonicalizes workspace and candidate paths, then checks that caller-supplied roots stay inside the active workspace before any scan, verify or diff preflight proceeds.

Use this package when a code-graph handler accepts untrusted path input. Keep the workspace-boundary contract here so handlers enforce the same rule.

---

## 2. DIRECTORY TREE

```text
utils/
+-- workspace-path.ts  # Canonical path and workspace-containment helpers
`-- README.md
```

---

## 3. STABLE API

| Export | Kind | Purpose |
|---|---|---|
| `CanonicalizedWorkspace` | Interface | Discriminated record of `canonicalWorkspace` and `canonicalRootDir`. |
| `canonicalizeWorkspacePaths` | Function | Resolves a workspace root and candidate `rootDir` to canonical absolute paths. Returns `null` on broken symlinks or invalid input. |
| `isWithinWorkspace` | Function | Checks whether a candidate canonical path equals or descends from the canonical workspace root. |
| `assertWithinWorkspace` | Function | Throw-form of `isWithinWorkspace` with a labeled error for boundary violations. |

These helpers operate on string paths only. Callers must canonicalize both inputs before calling `isWithinWorkspace` or `assertWithinWorkspace`.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `utils/` may import Node standard modules. It must not import handlers, database adapters or orchestration modules. |
| Exports | Handlers import these helpers as the sanctioned workspace-boundary check. |
| Tests | Coverage currently lives with the handler callers. Keep this folder test-free while it remains a single helper module. |

Active production callers:

| Caller | Helpers Used |
|---|---|
| `mcp-server/handlers/scan.ts` | `canonicalizeWorkspacePaths`, `isWithinWorkspace` |
| `mcp-server/handlers/verify.ts` | `canonicalizeWorkspacePaths`, `isWithinWorkspace`, `assertWithinWorkspace` |
| `mcp-server/handlers/detect-changes.ts` | `canonicalizeWorkspacePaths`, `isWithinWorkspace` |

---

## 5. VALIDATION

Run from the repository root.

```bash
.opencode/skills/system-code-graph/node_modules/.bin/tsc --noEmit -p .opencode/skills/system-code-graph/tsconfig.json
python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme .opencode/skills/system-code-graph/mcp-server/lib/utils/README.md
```

Expected result: TypeScript exits `0`, and the README validator reports no blocking errors.

---

## 6. RELATED

| Document | Purpose |
|---|---|
| [../README.md](../README.md) | Parent code-graph library overview. |
| [../../handlers/README.md](../../handlers/README.md) | Code-graph MCP handlers that consume these helpers. |
| [../../../README.md](../../../README.md) | Skill-level overview and operator guide. |
