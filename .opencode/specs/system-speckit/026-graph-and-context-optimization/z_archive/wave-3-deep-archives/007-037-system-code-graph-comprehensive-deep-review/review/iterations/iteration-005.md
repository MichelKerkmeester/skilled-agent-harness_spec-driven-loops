# Iteration 005 — system-code-graph: mcp_server/index.ts main entry point + server setup correctness

## Summary

The MCP server entry point is functionally complete with correct request handler wiring, but has critical reliability gaps (no error handling for server.connect, no uncaught exception handlers) and a naming mismatch (server name 'mk-code-index' vs skill 'system-code-graph'). The readiness marker uses process.cwd() without explicit workspace resolution, which may not match intended graph root.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/index.ts` (lines read: 31)
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` (lines read: 247)
- `.opencode/skills/system-code-graph/mcp_server/tools/index.ts` (lines read: 19)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| P0-005-001 | mcp_server/index.ts:31 | No error handling for `await server.connect(transport)` - connection failures will cause unhandled promise rejection | Server startup failures crash without diagnostic context, breaking MCP protocol handshake | Wrap in try-catch with error logging and process.exit(1) |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| P1-005-001 | mcp_server/index.ts:10 | Server name is 'mk-code-index' but skill is 'system-code-graph' - naming mismatch breaks discoverability and documentation alignment | Confusing for users and tool registration; inconsistent with skill identity | Update server name to 'system-code-graph' or align skill name to 'mk-code-index' |
| P1-005-002 | mcp_server/index.ts:24 | `writeCodeGraphReadinessMarker(process.cwd())` uses process.cwd() without explicit workspace root resolution - may not match intended graph directory | Readiness marker location may differ from actual graph root, causing readiness checks to fail | Accept explicit rootDir parameter or resolve from a canonical workspace detection function |
| P1-005-003 | mcp_server/index.ts:1-31 | No uncaught exception or unhandled rejection handlers - runtime errors crash without cleanup or logging | Production MCP servers need graceful error boundaries for reliability | Add process.on('uncaughtException') and process.on('unhandledRejection') handlers with logging |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| P2-005-001 | mcp_server/index.ts:23-28 | Readiness marker failure is logged but does not prevent server startup - server may run with corrupted or missing readiness state | Inconsistent state between marker and actual graph readiness could confuse callers | Consider making readiness marker failure block startup or emit a warning with degraded mode flag |
| P2-005-002 | mcp_server/tools/index.ts:9-18 | Dispatch function returns error payload but does not log unknown tool names - makes debugging harder | When a tool name is wrong, the error is silent in server logs | Add console.error logging for unknown tool dispatch attempts |

## Convergence Signal

newInfoRatio: 0.85 (high - this is the first iteration reviewing MCP server infrastructure; findings are foundational and not duplicated from prior doc/alignment iterations)
