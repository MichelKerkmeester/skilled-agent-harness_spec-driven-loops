# Seat gpt-cli-frontdoors — iteration 4 (global #47)

- Model: `kimi-for-coding/k2p7` · Executor: opencode · Angle: gpt-cli-frontdoors
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=1 P2=0

## Analysis

I traced the three CLI shims into their compiled TypeScript dispatchers and compared how each one turns a daemon response into a process exit code.

The shims are consistent: all three use `spawnSync` with argv passthrough, exit `69` for stale/missing dist, exit `75` only when the child itself cannot be spawned (`result.error`), and otherwise propagate the child’s status. The TypeScript CLIs also agree on retryable classification (`EXIT_RETRYABLE=75` for JSON-RPC -32001, connection timeouts, `backend unavailable`, etc.) and on usage/protocol/runtime splits.

The one real divergence is in how each CLI decides whether a *successful MCP tool-result envelope* actually represents a failure. `skill-advisor-cli.ts` and `code-index-cli.ts` both treat an embedded JSON payload with `status: "error"` as a failure, but `spec-memory-cli.ts` does not.

```json
{
  "seat": "gpt-cli-frontdoors",
  "model": "openai/gpt-5.5-fast",
  "angle": "Exit-code contract consistency across all three CLIs: exit 75 = retryable daemon/IPC unavailability vs real errors; no success-on-failure.",
  "verdict": "CONDITIONAL",
  "summary": "spec-memory CLI can exit 0 when daemon payload reports status:error; other two CLIs already guard against this.",
  "files_reviewed": [
    ".opencode/bin/spec-memory.cjs",
    ".opencode/bin/skill-advisor.cjs",
    ".opencode/bin/code-index.cjs",
    ".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts",
    ".opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts",
    ".opencode/skills/system-code-graph/mcp_server/code-index-cli.ts",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs",
    ".opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-cli.vitest.ts",
    ".opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-blocked-read.vitest.ts"
  ],
  "findings": [
    {
      "severity": "P1",
      "dimension": "security",
      "title": "spec-memory CLI exits 0 on daemon payload status:error",
      "file": ".opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts:982",
      "evidence": "Line 980 extracts `{ payload, isError }` from `extractToolPayload`, and line 982 returns `isError ? EXIT_RUNTIME : EXIT_SUCCESS`. `extractToolPayload` (lines 635-663) sets `isError` only from `toolResult?.isError === true`; it never inspects the parsed payload's `status`. By contrast, skill-advisor-cli.ts:865 sets `isError: toolResult?.isError === true || isErrorPayload(payload)` inside `extractToolPayload`, and code-index-cli.ts:1157 explicitly returns `isError || isErrorPayload(renderedPayload) ? EXIT_RUNTIME : EXIT_SUCCESS`.",
      "why": "The spec-memory daemon can return a successful MCP envelope (`isError:false`) containing an embedded JSON payload with `status:'error'`. In that case spec-memory exits 0 while code-index and skill-advisor exit 1. This violates the 'no success-on-failure' contract and lets automated callers (hooks, scripts, CI) treat a failed memory operation as successful.",
      "recommendation": "Make spec-memory mirror the other two CLIs: either add `|| isErrorPayload(payload)` to `extractToolPayload` (skill-advisor style) or change line 982 to `return isError || isErrorPayload(payload) ? EXIT_RUNTIME : EXIT_SUCCESS;` (code-index style) and add a unit test that feeds a fake daemon response with `content:[{text: JSON.stringify({status:'error',...})}]` and asserts exit code 1."
    }
  ]
}
```
