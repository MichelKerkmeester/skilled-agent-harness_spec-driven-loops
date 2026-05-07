---
title: "Code Graph Utils"
description: "Shared workspace-boundary helpers used by every code-graph handler that accepts caller-supplied paths."
trigger_phrases:
  - "workspace path validation"
  - "code graph utils"
  - "canonicalize workspace paths"
  - "workspace containment"
---

# Code Graph Utils

> Workspace canonicalization and containment helpers shared across the code-graph handler surface. Centralizes the workspace-boundary invariant so handlers stay consistent.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. STABLE API](#3--stable-api)
- [4. BOUNDARIES](#4--boundaries)
- [5. VALIDATION](#5--validation)
- [6. RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`utils/` provides one module: `workspace-path.ts`. It exports a small, deterministic helper set that every code-graph handler accepting a caller-supplied path uses to canonicalize that path and assert workspace containment before any read or scan happens.

Use this package whenever a code-graph handler must accept untrusted path input. Keep the workspace-boundary contract in one place so all handlers honor the same rule.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:structure -->
## 2. STRUCTURE

```text
utils/
└── workspace-path.ts
```

| File | Purpose |
| ---- | ------- |
| `workspace-path.ts` | Canonicalize workspace and candidate paths via `realpathSync` and assert workspace containment |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:stable-api -->
## 3. STABLE API

| Export | Kind | Purpose |
| ------ | ---- | ------- |
| `CanonicalizedWorkspace` | interface | Discriminated record of `canonicalWorkspace` and `canonicalRootDir` |
| `canonicalizeWorkspacePaths` | function | Resolve a workspace root and a candidate `rootDir` to canonical absolute paths; returns `null` on broken symlinks or invalid input |
| `isWithinWorkspace` | function | Boolean check that a candidate canonical path equals or descends from the canonical workspace root |
| `assertWithinWorkspace` | function | Throw-form of `isWithinWorkspace`; raises a labeled error when the boundary is violated |

These helpers operate on string paths only. Callers must canonicalize both inputs before calling `isWithinWorkspace` or `assertWithinWorkspace`.

<!-- /ANCHOR:stable-api -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARIES

- Code-graph handlers in `mcp_server/code_graph/handlers/**` import these helpers as the only sanctioned source of workspace-boundary checks.
- `utils/` may import Node standard modules. It must not import handler code, database adapters, or higher-level orchestration.
- Tests live with their handler caller; this folder stays test-free as long as the helper surface remains a single module.

Active production callers (fan-in):

| Caller | Helpers used |
| ------ | ------------ |
| `mcp_server/code_graph/handlers/scan.ts` | `canonicalizeWorkspacePaths`, `isWithinWorkspace` |
| `mcp_server/code_graph/handlers/verify.ts` | `canonicalizeWorkspacePaths`, `isWithinWorkspace`, `assertWithinWorkspace` |
| `mcp_server/code_graph/handlers/detect-changes.ts` | `canonicalizeWorkspacePaths`, `isWithinWorkspace` |

<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:validation -->
## 5. VALIDATION

```bash
npx tsc --noEmit
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/utils/README.md
```

Type checking covers the helper signatures. The README validator confirms structural alignment with the sk-doc readme template.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 6. RELATED DOCUMENTS

| Document | Purpose |
| -------- | ------- |
| [../README.md](../README.md) | Parent code-graph library overview, references this folder under §5 Key Files |
| [../../handlers/](../../handlers/) | Code-graph MCP handlers that consume these helpers |

<!-- /ANCHOR:related -->

---
