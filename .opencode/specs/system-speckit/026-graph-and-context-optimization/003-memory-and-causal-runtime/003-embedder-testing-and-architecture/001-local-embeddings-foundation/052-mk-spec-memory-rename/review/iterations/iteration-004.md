---
iter: 004
dimensions: ["completeness", "integration"]
timestamp: 2026-05-15T05:35:55.218Z
---
# Iteration 004

## SCOPE VIOLATIONS

None.

## Findings

| ID | Severity | Title | Location (file:line) | Category | Recommendation |
|----|----------|-------|----------------------|----------|----------------|
| 017-iter004-P2-001 | P2 | VS Code MCP config was renamed but still bypasses the launcher path used by other runtime configs | .vscode/mcp.json:14 | completeness/integration | Either document `.vscode/mcp.json` as intentionally direct-to-dist, or align it to `.opencode/bin/mk-spec-memory-launcher.cjs` like `.mcp.json` and the four documented runtimes. |

findings_summary: { p0: 0, p1: 0, p2: 1, new_findings: 1 }
