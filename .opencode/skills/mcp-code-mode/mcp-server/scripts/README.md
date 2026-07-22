---
title: "MCP Server Scripts: Node ABI Check"
description: "Install-time warning script guarding the mcp-code-mode server's Node 24 requirement."
---

# MCP Server Scripts: Node ABI Check

---

## 1. OVERVIEW

`scripts/` holds the Node ABI guard for the `mcp-code-mode` MCP server. Code Mode runs every `call_tool_chain` call inside an `isolated-vm` V8 isolate, and `isolated-vm` has no Node 25+ build: under a wrong Node version it SIGSEGVs at isolate creation, a native crash that kills the whole MCP connection on the first tool call with no catchable error. This script exists to surface that failure mode as a visible warning instead of a silent segfault.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `check-node.cjs` | Compares `process.versions.modules` against the required ABI `137` (Node 24) and prints a warning naming the installed Node version, the required ABI, and the `npm rebuild isolated-vm` fix when they diverge. |

## 3. RELATED

- [`../README.md`](../README.md)
