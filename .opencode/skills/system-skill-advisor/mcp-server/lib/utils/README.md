---
title: "Advisor Utilities: Retry, JSON And Path Helpers"
description: "Small utility modules for busy retries, error formatting, JSON guards, skill markdown and workspace root resolution."
trigger_phrases:
  - "advisor utilities"
  - "busy retry"
  - "workspace root helper"
---

# Advisor Utilities: Retry, JSON And Path Helpers

<!-- sk-doc-template: skill_readme -->

---

## 1. OVERVIEW

`lib/utils/` contains small advisor utility modules. These helpers support retry behavior, error formatting, JSON validation, skill markdown handling and workspace root resolution without becoming a second runtime layer.

Current state:

- Provides focused helpers used by the advisor library.
- Keeps path and markdown utilities separate from scorer modules.
- Centralizes JSON and error handling helpers for reuse.

---

## 2. DIRECTORY TREE

```text
utils/
+-- busy-retry.ts       # Busy retry helper
+-- error-format.ts     # Error formatting helper
+-- json-guard.ts       # JSON shape guard helper
+-- skill-markdown.ts   # Skill markdown helper
+-- workspace-root.ts   # Workspace root resolver
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `busy-retry.ts` | Retries operations that may be temporarily busy. |
| `error-format.ts` | Formats errors for advisor diagnostics. |
| `json-guard.ts` | Guards parsed JSON values before use. |
| `skill-markdown.ts` | Handles skill markdown text helpers. |
| `workspace-root.ts` | Resolves the workspace root used by advisor paths. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Keep utilities dependency-light and reusable by sibling library modules. |
| Exports | Export small helpers only. |
| Ownership | Put general advisor utilities here. Put domain scoring, lifecycle and daemon behavior in their own folders. |

Main flow:

```text
advisor library caller
  -> utility helper
  -> normalized path, guarded value, formatted error or retry result
  -> caller continues domain logic
```

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `busy-retry.ts` | TypeScript module | Retry helper. |
| `error-format.ts` | TypeScript module | Error formatting helper. |
| `json-guard.ts` | TypeScript module | JSON guard helper. |
| `skill-markdown.ts` | TypeScript module | Skill markdown helper. |
| `workspace-root.ts` | TypeScript module | Workspace root resolver. |

---

## 6. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-skill-advisor/mcp-server/lib/utils/README.md
```

Expected result: exit code `0`.

---

## 7. RELATED

- [`../README.md`](../README.md)
- [`../scorer/README.md`](../scorer/README.md)
