# Post-Fix Live MCP Verification Report

## Setup

- Commit: `646f28d2b` (post-remediation)
- MCP server: direct `spec_kit_memory` tool calls were exposed in Codex, but returned `user cancelled MCP tool call` before execution.
- Dist fallback: used rebuilt dist handler dispatcher via `node --input-type=module` importing `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tools/code-graph-tools.js`.
- Dist build: existing rebuilt dist from source via `npm run build` in 012/004.
- Status: `PARTIAL`, because the live MCP transport path could not be exercised; the fallback exercised the built dist handler path.

## Direct MCP Attempt

```text
memory_match_triggers({
  prompt: "Post-Fix Live MCP Verification ...",
  limit: 3
})
=> user cancelled MCP tool call

code_graph_scan({ incremental: false, includeSkills: "true" })
=> user cancelled MCP tool call
```

## SCENARIO 1 - Zero-Node Guard

| Step | Tool call | Expected | Actual | Verdict |
|---|---|---|---|---|
| 1.1 | `code_graph_scan({ incremental:false, includeSkills:true })` | populated index; `totalNodes >= 50000` | `status:"ok"`, `filesScanned:4204`, `filesIndexed:4135`, `totalNodes:56224`, `totalEdges:35095`, `parseDiagnostics.affectedFiles:69` | PASS |
| 1.2 | `code_graph_scan({ incremental:false })` | `reason:"zero_node_scan_rejected"` | `status:"ok"`, `filesScanned:137`, `filesIndexed:132`, `totalNodes:5`, `totalEdges:0`; no rejection | FAIL |
| 1.3 | `code_graph_status({})` | prior populated graph preserved | `status:"ok"`, `totalFiles:137`, `totalNodes:5`, `totalEdges:0` | FAIL |
| 1.4 | `code_graph_query({ operation:"calls_to", subject:"scoreLexicalLane", limit:10 })` | returns entries | `status:"error"`, `error:"Could not resolve subject: scoreLexicalLane"` | FAIL |

Scenario 1 verdict: FAIL. The default-scope full scan did not produce zero nodes in this checkout; it produced 5 nodes and promoted that smaller graph over the populated skill-inclusive graph.

### Raw Output Excerpts

Step 1.1:

```json
{
  "status": "ok",
  "data": {
    "filesScanned": 4204,
    "filesIndexed": 4135,
    "filesSkipped": 0,
    "totalNodes": 56224,
    "totalEdges": 35095,
    "errors": [
      ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts: Tree contains syntax errors (partial parse)",
      ".opencode/skills/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts: Tree contains syntax errors (partial parse)"
    ],
    "durationMs": 48131,
    "fullScanRequested": true,
    "effectiveIncremental": false,
    "fullReindexTriggered": false,
    "currentGitHead": "646f28d2ba02aa57d117be404676d4e6dc83369e",
    "previousGitHead": "646f28d2ba02aa57d117be404676d4e6dc83369e"
  }
}
```

Step 1.2:

```json
{
  "status": "ok",
  "data": {
    "filesScanned": 137,
    "filesIndexed": 132,
    "filesSkipped": 0,
    "totalNodes": 5,
    "totalEdges": 0,
    "errors": [
      ".gemini/scripts/spec-kit-memory.sh: resolved is not a function",
      ".github/hooks/spec-kit-copilot-hook.sh: resolved is not a function",
      ".opencode/install_guides/install_scripts/_utils.sh: resolved is not a function",
      ".opencode/install_guides/install_scripts/install-all.sh: resolved is not a function",
      ".opencode/install_guides/install_scripts/install-sequential-thinking.sh: resolved is not a function"
    ],
    "durationMs": 2443,
    "fullScanRequested": true,
    "effectiveIncremental": false,
    "fullReindexTriggered": false,
    "currentGitHead": "646f28d2ba02aa57d117be404676d4e6dc83369e",
    "previousGitHead": "646f28d2ba02aa57d117be404676d4e6dc83369e"
  }
}
```

Step 1.3:

```json
{
  "status": "ok",
  "data": {
    "totalFiles": 137,
    "totalNodes": 5,
    "totalEdges": 0,
    "freshness": "fresh",
    "activeScope": {
      "fingerprint": "code-graph-scope:v2:skills=none:agents=none:commands=none:specs=none:plugins=none:mcp-coco-index=excluded",
      "label": "end-user code only; .opencode skill, agent, command, specs and plugins excluded; mcp-coco-index/mcp_server excluded",
      "includeSkills": false,
      "includedSkills": "none",
      "includedAgents": "none",
      "includedCommands": "none",
      "includedSpecs": "none",
      "includedPlugins": "none",
      "source": "default"
    },
    "parseDiagnostics": {
      "affectedFiles": 69
    }
  }
}
```

Step 1.4:

```json
{
  "status": "error",
  "error": "Could not resolve subject: scoreLexicalLane"
}
```

## SCENARIO 2 - forceZeroNodeReset

| Step | Tool call | Expected | Actual | Verdict |
|---|---|---|---|---|
| 2.1 | `code_graph_scan({ incremental:false, forceZeroNodeReset:true })` | `status:"ok"`, `totalNodes:0` | `status:"ok"`, `filesScanned:137`, `filesIndexed:131`, `totalNodes:5`, `totalEdges:0` | FAIL |
| 2.2 | `code_graph_scan({ incremental:false, includeSkills:true })` in same fallback process | restored populated index | `status:"blocked"`, `reason:"zero_node_scan_rejected"`, `failedScan.totalNodes:0`, preserved prior `totalNodes:5`; parser emitted `memory access out of bounds` for many files | FAIL |
| 2.2 restore retry | fresh Node process, same dist dispatcher | restored populated index | `status:"ok"`, `filesScanned:4204`, `filesIndexed:4135`, `totalNodes:56224`, `totalEdges:35095` | PASS |

Scenario 2 verdict: FAIL. The escape hatch was not proven because the default scope produced 5 nodes, not 0. A fresh process restored the populated index after the same-process fallback run left the graph on the default-scope index.

### Raw Output Excerpts

Step 2.1:

```json
{
  "status": "ok",
  "data": {
    "filesScanned": 137,
    "filesIndexed": 131,
    "filesSkipped": 0,
    "totalNodes": 5,
    "totalEdges": 0,
    "errors": [
      ".gemini/scripts/spec-kit-memory.sh: resolved is not a function",
      ".github/hooks/spec-kit-copilot-hook.sh: resolved is not a function",
      ".opencode/install_guides/install_scripts/_utils.sh: resolved is not a function",
      ".opencode/install_guides/install_scripts/install-all.sh: resolved is not a function",
      ".opencode/install_guides/install_scripts/install-sequential-thinking.sh: memory access out of bounds",
      "scripts/setup-maintainer-filters.sh: memory access out of bounds"
    ],
    "durationMs": 77,
    "fullScanRequested": true,
    "effectiveIncremental": false
  }
}
```

Step 2.2 same-process fallback:

```json
{
  "status": "blocked",
  "reason": "zero_node_scan_rejected",
  "data": {
    "filesScanned": 4204,
    "filesIndexed": 0,
    "filesSkipped": 0,
    "totalNodes": 5,
    "totalEdges": 0,
    "errors": [
      ".opencode/skills/mcp-code-mode/mcp_server/index.ts: memory access out of bounds",
      ".opencode/skills/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts: memory access out of bounds",
      ".opencode/skills/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts: memory access out of bounds",
      ".opencode/skills/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts: memory access out of bounds",
      ".opencode/skills/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts: memory access out of bounds",
      ".opencode/skills/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts: memory access out of bounds",
      ".opencode/skills/system-spec-kit/mcp_server/api/eval.ts: memory access out of bounds",
      ".opencode/skills/system-spec-kit/mcp_server/api/index.ts: memory access out of bounds",
      ".opencode/skills/system-spec-kit/mcp_server/api/indexing.ts: memory access out of bounds",
      ".opencode/skills/system-spec-kit/mcp_server/api/providers.ts: memory access out of bounds"
    ],
    "durationMs": 1949,
    "fullScanRequested": true,
    "effectiveIncremental": false,
    "failedScan": {
      "reason": "zero_node_scan_rejected",
      "totalNodes": 0
    }
  }
}
```

Fresh restore retry:

```json
RESTORE_SCAN_SUMMARY {
  "status": "ok",
  "filesScanned": 4204,
  "filesIndexed": 4135,
  "totalNodes": 56224,
  "totalEdges": 35095,
  "parseDiagnosticsAffectedFiles": 69,
  "readiness": {
    "freshness": "fresh",
    "action": "full_scan",
    "inlineIndexPerformed": true,
    "reason": "scan completed and persisted current graph state",
    "canonicalReadiness": "ready",
    "trustState": "live"
  },
  "failedScan": null
}
```

## SCENARIO 3 - F-003 source verification

| Check | Expected | Actual | Verdict |
|---|---|---|---|
| Source guard | `ensure-ready.ts:465` has `parseHealth === 'error'` early return | `465:  if (result.parseHealth === 'error') {` | PASS |
| Dist guard | rebuilt dist contains guard | `372:    if (result.parseHealth === 'error') {` | PASS |

Grep result:

```text
465:  if (result.parseHealth === 'error') {
```

Context:

```text
   464 export function persistIndexedFileResult(result: ParseResult): void {
   465   if (result.parseHealth === 'error') {
   466     graphDb.recordParseDiagnostic(result.filePath, result.parseErrors.join('; '));
   467     return;
   468   }
```

Scenario 3 verdict: PASS.

## SCENARIO 4 - Parse diagnostics

| Step | Tool call | Expected | Actual | Verdict |
|---|---|---|---|---|
| 4.1 | Step 1.1 scan response | `parseDiagnostics` field with `affectedFiles` count | present: `parseDiagnostics.affectedFiles:69` | PASS |
| 4.2 | `code_graph_status({})` | diagnostics surfaced in status | present: `parseDiagnostics.affectedFiles:69` after restore; status also surfaced diagnostics during the failed run | PASS |

Response excerpts:

```json
{
  "status": "ok",
  "data": {
    "filesScanned": 4204,
    "filesIndexed": 4135,
    "totalNodes": 56224,
    "totalEdges": 35095,
    "parseDiagnostics": {
      "affectedFiles": 69,
      "recentErrors": [
        {
          "filePath": ".opencode/skills/system-spec-kit/scripts/tests/test-phase-system.sh",
          "errorMessage": "resolved is not a function",
          "errorCount": 1,
          "lastSeenAt": "2026-05-06T07:30:08.616Z"
        }
      ]
    }
  }
}
```

```json
RESTORE_STATUS_SUMMARY {
  "status": "ok",
  "filesScanned": 4140,
  "totalNodes": 56224,
  "totalEdges": 35095,
  "parseDiagnosticsAffectedFiles": 69,
  "readiness": {
    "freshness": "fresh",
    "action": "none",
    "inlineIndexPerformed": false,
    "reason": "all tracked files are up-to-date",
    "canonicalReadiness": "ready",
    "trustState": "live"
  }
}
```

Scenario 4 verdict: PASS.

## VERDICT

- F-002 LIVE BEHAVIOR: FAIL/PARTIAL. Direct MCP calls did not execute. Dist fallback showed the requested zero-node guard scenario does not reproduce because default scope indexes 5 nodes and promotes over the populated index.
- F-003 SOURCE VERIFIED: PASS.
- F-011 LIVE SURFACED: PASS in dist fallback; parse diagnostics appear in both scan and status responses.
- COMMIT READINESS: needs-fix.

## Notes

- The F-002 guard did fire once in the fallback run, but only after repeated scans in one Node process caused the skill-inclusive scan to index zero nodes with parser `memory access out of bounds` errors. That protected the then-current 5-node default graph, not the desired 56k-node populated graph.
- A fresh Node process restored the populated graph successfully: `totalNodes:56224`, `totalEdges:35095`.
- The direct MCP transport failure should be rerun separately once `spec_kit_memory` tool execution is available again.
