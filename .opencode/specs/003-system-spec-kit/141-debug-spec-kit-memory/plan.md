# Plan: 141-debug-spec-kit-memory

## 1. Research and Diagnosis
- Observe the "Client is not connected" error in the MCP client.
- Run the MCP server from the workspace root to reproduce the issue.
- Identify the OOM crash during the "Checking for pending memory files..." phase.

## 2. Root Cause Analysis
- Trace `recoverPendingFiles` in `context-server.ts`.
- Notice that it calls `transactionManager.recoverAllPendingFiles(basePath)` which uses a recursive directory read (`fs.readdirSync(dirPath, { recursive: true })`).
- Because `basePath` is the workspace root, it attempts to read `node_modules` and all other directories, exceeding the V8 heap limit.

## 3. Implementation
- Modify `recoverPendingFiles` in `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`.
- Restrict the `recoverAllPendingFiles` calls to specifically target the `specs` and `.opencode/specs` folders instead of the entire `basePath`.
- Recompile the MCP server.

## 4. Verification
- Verify the server starts successfully without OOM when run from the root directory.
- Verify the MCP initialization JSON-RPC response is valid.