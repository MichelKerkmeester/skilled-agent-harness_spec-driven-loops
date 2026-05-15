# Iteration 011 — system-code-graph: code_graph_apply recovery-mode + apply-orchestrator.ts safety gates

## Summary

Found 1 P0 TypeScript compilation error that blocks release, 2 P1 safety gate inconsistencies (missing confirm requirement for repair-nodes, unused recovery procedure import), and 2 P2 improvements (generic error handling in handler, missing recovery-mode audit trail). The apply-orchestrator has robust safety gates overall but has gaps in consistency and recovery-mode coverage.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/apply.ts` (lines read: 35)
- `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts` (lines read: 530)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| 001 | apply-orchestrator.ts:342 | TypeScript syntax error in default case: `${operation satisfies never}` - invalid template literal syntax that will fail compilation | P0 - Compilation error prevents the code from building/deploying | Fix the error message to valid TypeScript: `Unsupported apply operation: ${String(operation)}` |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 002 | apply-orchestrator.ts:314-320 | repair-nodes operation requires crashRootCauseAddressed=true but lacks confirm=true gate, unlike other dangerous operations (recover-sqlite-corruption, rollback-bad-apply) | P1 - Safety gate inconsistency - repair-nodes mutates parser skip list and triggers scans but has weaker confirmation requirements than other recovery operations | Add confirm=true requirement for repair-nodes operation when eligible.length > 0 |
| 003 | apply-orchestrator.ts:18 | recoverPartialScanFailure is imported from recovery-procedures but never used in the codebase | P1 - Dead import suggests missing recovery mode coverage or incomplete implementation | Either implement recoverPartialScanFailure usage or remove the unused import |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| 004 | apply.ts:29-33 | Handler error handling is generic and does not distinguish between recoverable vs non-recoverable errors or surface recovery-mode context | P2 - Limits debugging and recovery-mode transparency in MCP responses | Enhance error handling to include error classification and recovery suggestions from apply-orchestrator |
| 005 | apply-orchestrator.ts:149-155 | Audit logging exists but has no explicit recovery-mode event type or structured recovery trail metadata | P2 - Recovery-mode operations would benefit from dedicated audit structure for post-mortem analysis | Add recovery-mode specific audit event types and structured metadata for recovery operations |

## Convergence Signal

newInfoRatio 0.85 vs prior iterations - first review of apply-orchestrator safety gates and recovery-mode logic revealed previously unexamined safety gaps.
