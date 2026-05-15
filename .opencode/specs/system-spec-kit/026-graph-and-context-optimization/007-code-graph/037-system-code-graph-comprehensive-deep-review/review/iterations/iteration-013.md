# Iteration 013 — system-code-graph: ccc_* CocoIndex bridge handlers (status/reindex/feedback)

## Summary

The ccc_* handlers exist and follow a consistent pattern, but all three return fake readiness state with hardcoded 'readiness_not_applicable' reason regardless of actual CocoIndex status. This makes the readiness/trustState fields meaningless. There's also significant code duplication of the `buildUnavailableReadiness` function across all files.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-status.ts` (lines read: 74)
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts` (lines read: 99)
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts` (lines read: 90)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| P0-001 | ccc-status.ts:37, ccc-reindex.ts:57, ccc-feedback.ts:57 | All three handlers return fake readiness state with hardcoded 'readiness_not_applicable' reason, making readiness/trustState fields meaningless regardless of actual CocoIndex state | Data integrity - consumers cannot trust readiness signals; breaks the readiness contract | Implement actual CocoIndex readiness detection or remove readiness fields entirely |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| P1-001 | ccc-status.ts:11-20, ccc-reindex.ts:16-25, ccc-feedback.ts:18-27 | Code duplication: `buildUnavailableReadiness` function is duplicated verbatim across all three files | Maintenance burden - changes must be replicated; violates DRY principle | Extract to shared utility module in `../lib/` |
| P1-002 | ccc-reindex.ts:68 | Output truncated to 2000 characters without documentation or justification | Users may miss important error messages or indexing details | Document truncation rationale or make configurable |
| P1-003 | ccc-feedback.ts:14 | Rating enum values not validated at runtime - could accept invalid strings | Type safety gap between TypeScript enum and runtime validation | Add runtime validation: `if (!['helpful', 'not_helpful', 'partial'].includes(args.rating))` |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| P2-001 | ccc-status.ts:26, ccc-reindex.ts:31 | Hardcoded path to ccc binary assumes specific venv structure | Fragile to installation changes | Make path configurable via environment variable |
| P2-002 | ccc-feedback.ts:60 | No validation that feedback file write succeeded | Silent failure possible | Check return value of appendFileSync or wrap in try-catch |
| P2-003 | ccc-status.ts:25, ccc-reindex.ts:30, ccc-feedback.ts:44 | process.cwd() used without validation - may not be project root in all contexts | Context assumptions may fail in nested workflows | Accept optional projectRoot parameter or validate against git root |

## Convergence Signal

newInfoRatio 0.85 vs prior iterations (first review of ccc_* bridge handlers - high novelty)
