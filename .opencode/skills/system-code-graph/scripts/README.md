---
title: "Skill Scripts: Doctor"
description: "Read-only health check for the system-code-graph MCP server's build output and native dependencies."
---

# Skill Scripts

---

## 1. OVERVIEW

`scripts/` holds the operator-facing health check for the `system-code-graph` skill. It exists because the MCP server depends on a compiled `dist/` and two native/WASM modules (`better-sqlite3`, `web-tree-sitter`) that can fail silently at install time on a Node ABI mismatch, so a fast read-only script catches that before a user hits a confusing runtime error.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `doctor.sh` | Checks `mcp-server/dist/` exists, resolves a `node` interpreter and requires `better-sqlite3`, `web-tree-sitter`, the MCP SDK and `zod` from `mcp-server/` to confirm the runtime imports actually load |

## 3. VALIDATION

```bash
bash .opencode/skills/system-code-graph/scripts/doctor.sh [--strict]
```

Exit `0` on pass (or advisory warnings in default mode), `1` on invalid arguments, `20` when `mcp-server/dist` is missing, `26` when a runtime import fails under `--strict`. On a missing or ABI-mismatched `better-sqlite3` it prints the exact `npm install` / `npm rebuild better-sqlite3` fix.

## 4. CONSUMERS

- `.opencode/commands/doctor/mcp.md` and its `_routes.yaml` / `scripts/mcp-doctor.sh` route wiring call this as one of the MCP subsystem health checks.

## 5. RELATED

- [`system-code-graph/README.md`](../README.md)
- [`mcp-server/README.md`](../mcp-server/README.md)
