# Iteration 012 — system-code-graph: detect_changes handler + diff-parser.ts diff-to-symbol mapping

## Summary

Review of detect_changes handler and diff-parser.ts found one P1 issue (path mismatch in scope specification) and two P2 issues (data integrity validation and edge-case line counting). The code demonstrates strong security posture with comprehensive path validation and readiness blocking logic.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts` (lines read: 369)
- `.opencode/skills/system-code-graph/mcp_server/lib/diff-parser.ts` (lines read: 317)
- `.opencode/skills/system-code-graph/mcp_server/tests/detect-changes.test.ts` (lines read: 706)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 001 | Scope specification | Expected file `lib/diff-parser.ts` does not exist at specified path; actual location is `mcp_server/lib/diff-parser.ts` | Expected surface is missing from specified location, indicating scope documentation drift | Update scope specification to reflect actual file structure at `mcp_server/lib/diff-parser.ts` |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 002 | detect-changes.ts:330 | No validation that `node.endLine >= node.startLine`; calculation `Math.max(1, node.endLine - node.startLine + 1)` masks potential data integrity issues | Could produce incorrect overlap detection if database contains malformed nodes with `endLine < startLine` | Add validation: `if (node.endLine < node.startLine) continue;` before line calculation |
| 003 | diff-parser.ts:223-231 | Empty line handling treats truly empty lines as context lines on both sides, which may not match actual diff semantics for all tools | Could lead to incorrect line counting in edge cases where empty lines are not context lines | Consider distinguishing between git-style ` ` context lines and truly empty lines, or add explicit documentation of this behavior |

## Convergence Signal

newInfoRatio 0.9 vs prior iterations (first review of detect_changes handler and diff-parser.ts surface)
