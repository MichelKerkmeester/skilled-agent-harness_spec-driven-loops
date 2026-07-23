---
title: "MCP Server Scripts: Node ABI Check"
description: "Manual diagnostic script that warns when the active Node ABI does not match mcp-code-mode's Node 24 requirement."
---

# MCP Server Scripts: Node ABI Check

---

## 1. OVERVIEW

`scripts/` holds the Node ABI guard for the `mcp-code-mode` MCP server. Code Mode runs every `call_tool_chain` call inside an `isolated-vm` V8 isolate, and `isolated-vm` has no Node 25+ build: under a wrong Node version it SIGSEGVs at isolate creation, a native crash that kills the whole MCP connection on the first tool call with no catchable error. `check-node.cjs` surfaces that failure mode as a visible warning instead of a silent segfault. It is a manual diagnostic, not an install hook: `mcp-server/` has no `package.json`, so nothing runs this script automatically at install time. Run it by hand to confirm the active Node ABI before starting the server.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `check-node.cjs` | Compares `process.versions.modules` against the required ABI `137` (Node 24) and prints a warning naming the installed Node version, the required ABI, and the `npm rebuild isolated-vm` fix when they diverge. |

## 3. RELATED

- [`../README.md`](../README.md)
