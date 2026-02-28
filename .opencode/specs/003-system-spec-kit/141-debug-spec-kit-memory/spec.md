# 141-debug-spec-kit-memory

## Objective
Fix the Out-of-Memory (OOM) crash that prevents the `spec_kit_memory` MCP server from starting and connecting to the Gemini CLI.

## Context
When running `node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` from the workspace root, the Node process crashed with a "JavaScript heap out of memory" error. This was caused by `transactionManager.recoverAllPendingFiles(basePath)` recursively scanning the entire workspace (including `node_modules`, `.git`, etc.) when `basePath` is `process.cwd()`.

## Requirements
- Prevent `recoverAllPendingFiles` from scanning the entire workspace.
- Restrict pending file recovery scan to known memory file locations (`specs` and `.opencode/specs`).
- The MCP server must successfully start and respond to `initialize` requests without running out of memory.