# Iteration 023 — P1-B Runtime Correctness Cluster Verification

## Summary

Five P1-B findings are **VERIFIED**: B1, B3, B4, B6, and B7. Two are **PARTIAL**: B2 has real logic issues but overstates the edge-counter problem; B5 correctly spots a narrower local trust enum but misstates the canonical trust type as four-state when the shared type currently has seven values.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/index.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts`
- `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/context/shared-payload.ts`

## Findings

### P0 (release-blocking)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| — | — | — | None | — |

### P1 (high priority)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| P1-B1 | VERIFIED | `mcp_server/index.ts:23-31` | `writeCodeGraphReadinessMarker(process.cwd())` is best-effort, but `await server.connect(transport)` is unwrapped. A repo-wide grep found no `uncaughtException` / `unhandledRejection` / `process.on` handler under `mcp_server/`. | Add startup try/catch and global process error handlers; decide whether marker root should be explicit instead of `process.cwd()`. |
| P1-B2 | PARTIAL | `mcp_server/handlers/scan.ts:358-368`, `scan.ts:613-619`, `lib/structural-indexer.ts:1896-1899` | `fullReindexTriggered` is hardcoded false despite git-head detection, and `failedScanErrors` filters structural errors that are already also in `errors`. The edge counter claim is overstated: `reconciledEdges` is computed before the counter diff and before assignment, so the counter is not incremented "before filtering" in the behavioral sense. | Fix the hardcoded reindex flag and simplify error aggregation. Re-evaluate whether any edge-counter change is actually needed. |
| P1-B3 | VERIFIED | `mcp_server/handlers/query.ts:1333-1371`; `query.ts:1419`, `1460`, `1486` | `blast_radius` calls `computeBlastRadius(...)` without a `graphDb.getDb().transaction(...)` wrapper, while other multi-query operations use transaction wrappers. | Wrap blast-radius computation in a transaction for snapshot stability. |
| P1-B4 | VERIFIED | `mcp_server/lib/code-graph-context.ts:372-426` | Neighborhood mode pushes outgoing target nodes and incoming source nodes into the same `nodes` array with no dedupe. A symbol connected in both directions can appear twice. | Deduplicate nodes by `symbolId` or stable `(file,line,name)` identity before returning. |
| P1-B5 | PARTIAL | `mcp_server/handlers/status.ts:29`, `status.ts:167-169`; `system-spec-kit/mcp_server/lib/context/shared-payload.ts:34-43` | Local `GoldVerificationTrust` is three-state and returns `stale` for any non-fresh graph. The report is right that it cannot emit `unavailable`; however, the cited canonical `SharedPayloadTrustState` is seven-state (`cached`, `stale`, `absent`, `unavailable`, `imported`, `rebuilt`, `rehomed`), not four-state. | If `goldVerificationTrust` is meant to mirror readiness trust, widen or document it. Otherwise revise the report wording. |
| P1-B6 | VERIFIED | `mcp_server/lib/apply-orchestrator.ts:313-339`; `apply-orchestrator.ts:293-296`, `412-424` | `repair-nodes` requires `crashRootCauseAddressed=true` but does not require `confirm=true` before `scan(...)`; other mutating/safety-sensitive paths require `confirm=true`. | Add or explicitly document a confirmation gate for repair-nodes mutation. |
| P1-B7 | VERIFIED | `mcp_server/lib/apply-orchestrator.ts:15-21`; `apply-orchestrator.ts:18` | `recoverPartialScanFailure` is imported and a file grep shows no use beyond the import. | Wire it into the intended operation or remove the dead import. |

### P2 (nice-to-have)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| — | — | — | None | — |

## Convergence Signal

newInfoRatio 0.35: most runtime findings are reproducible; two should be corrected before remediation tickets are written.
