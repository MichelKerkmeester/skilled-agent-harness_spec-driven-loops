# Plugin Audit Review - mk-code-graph

> **Iteration 2 cross-check (Opus 4.8):** 8 iteration-1 findings adjudicated (4 adjusted, 4 confirmed); 5 new findings. Full detail in [`iteration-002-opus-4.8.md`](./iteration-002-opus-4.8.md).

> **Source:** GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast --variant high`) read-only audit via cli-opencode, 2026-07-10. Findings are hypotheses with file:line evidence, pending remediation-time confirmation.

## Summary

The plugin violates OpenCode's default-export-only loader contract, which can prevent the entire plugin file from loading. The bridge also lacks the bounded subprocess cleanup already present in the Claude counterpart, while Claude refreshes code-graph status only at session start/resume and currently executes a stale compiled artifact.

| Field | Value |
|-------|-------|
| Plugin | `.opencode/plugins/mk-code-graph.js` (Code-graph context transport plugin) |
| Claude hook counterpart | .claude/settings.json, .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts, .opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts |
| Verdict | REFINE |
| Findings | 0 P0 / 3 P1 / 4 P2 / 1 refinement (8 total) |

**Parity assessment:** The bridge and Claude helper render broadly equivalent warm-only status summaries, but lifecycle and process-control parity are incomplete. The absence of a dedicated Claude code-graph hook is a real behavioral gap because session-prime only covers startup/resume, whereas OpenCode refreshes status during chat and compaction; additionally, the OpenCode bridge lacks the descendant-safe timeout handling already implemented by the Claude helper.

## Finding Registry

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| F1 | P2 <-P0 | bug | `.opencode/plugins/mk-code-graph.js:176` | Named parser export can cause OpenCode to drop the entire plugin | high |
| F2 | P1 | parity | `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:403` | Bridge timeout can leave its promise unresolved when descendants retain stdio | high |
| F3 | P1 | error | `.claude/settings.json:56` | Claude runs a stale compiled hook instead of the reviewed source | high |
| F4 | P1 | parity | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:361` | Claude never refreshes code-graph status after startup or resume | high |
| F5 | P2 | error | `.opencode/plugins/mk-code-graph.js:54` | Malformed plugin configuration is silently treated as absent | high |
| F6 | P2 | bug | `.opencode/plugins/mk-code-graph.js:318` | Successful slow bridge responses are cached already expired | high |
| F7 | P2 | bug | `.opencode/plugins/mk-code-graph.js:193` | Transport-plan validation permits message blocks that crash the transform | high |
| F8 | refinement | refinement | `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:239` | Bridge accepts minimal and spec-folder flags but never uses them | high |

## Finding Detail

### F1 - Named parser export can cause OpenCode to drop the entire plugin
- **Severity / Category / Confidence:** P2 (adjudicated from P0) / bug / high
- **Location:** `.opencode/plugins/mk-code-graph.js:176`
- **Evidence:** The plugin exports parseTransportPlan in addition to its default factory. OpenCode treats every function export as a plugin entrypoint; returning an empty object for non-string input at lines 177-180 does not restore the required default-export-only module shape. The regression test explicitly requires both exports at opencode-plugin.vitest.ts:142-147, thereby codifying the incompatible shape.
- **Impact:** OpenCode can load parseTransportPlan as a second plugin, reject the module, and silently omit all mk-code-graph hooks and the mk_code_graph_status tool.
- **Proposed fix:** Remove the named export from the plugin module. Keep parseTransportPlan module-local or move it to a separate non-plugin helper module that tests can import, and add a loader-contract test asserting that the plugin module exposes exactly one default export.
- **Orchestrator adjudication:** ORCHESTRATOR-VERIFIED / DOWNGRADED P0->P2: mk-code-graph.js:177-181 guards the loader-invoke path (non-string input returns {} instead of throwing), so the whole-file-drop crash is already mitigated. Residual issue is a real but non-fatal default-export-only convention violation (README §1), not a P0.

### F2 - Bridge timeout can leave its promise unresolved when descendants retain stdio
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:403`
- **Evidence:** The timeout kills only the direct child, then attempts SIGKILL on that same child after 100 ms, while completion depends exclusively on error or close events at lines 419-420. If the shim exits but a descendant retains the pipes, close may never fire and the second kill targets an already-dead process. The Claude fallback handles this exact condition by spawning detached, killing the process group, and settling shortly after exit at code-index-cli-fallback.ts:218-295.
- **Impact:** A timed-out bridge can hold the OpenCode transform indefinitely beyond its intended deadline and leak descendant processes or stdio handles.
- **Proposed fix:** Mirror the Claude fallback: spawn the shim with detached:true, kill the process group on timeout, listen for exit as well as close, and settle after a short exit grace period.

### F3 - Claude runs a stale compiled hook instead of the reviewed source
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.claude/settings.json:56`
- **Evidence:** SessionStart invokes mcp_server/dist/hooks/claude/session-prime.js rather than the TypeScript source. The active dist-freshness guard reports @spec-kit/mcp-server as stale and requires rebuilding it.
- **Impact:** The actual Claude behavior may differ from session-prime.ts, so source-level fixes and parity assumptions are not active or trustworthy until dist is rebuilt.
- **Proposed fix:** Rebuild the spec-kit MCP server and keep the dist-freshness check as a blocking verification gate whenever hook source changes.

### F4 - Claude never refreshes code-graph status after startup or resume
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:361`
- **Evidence:** The warm code-index fallback is restricted to source=startup or source=resume and is also skipped whenever any Structural Context section already exists. OpenCode queries status from system, message, and compaction transforms at mk-code-graph.js:442, 470, and 520. Claude settings has no code-graph counterpart on UserPromptSubmit or PreCompact, and source=compact is explicitly excluded here.
- **Impact:** After a scan, edits, daemon transition, or compaction, Claude can continue operating from stale readiness information for the rest of the session while OpenCode receives refreshed status.
- **Proposed fix:** Reuse the bounded warm-only helper from the existing UserPromptSubmit and PreCompact paths, or add equivalent cached refresh logic there. Also permit a compact-source status section when the recovered payload lacks current structural status.

### F5 - Malformed plugin configuration is silently treated as absent
- **Severity / Category / Confidence:** P2 / error / high
- **Location:** `.opencode/plugins/mk-code-graph.js:54`
- **Evidence:** loadConfig catches every read and JSON parsing error and returns {} without retaining or exposing the failure. ENOENT, permission failures, and malformed JSON are therefore indistinguishable.
- **Impact:** Configuration mistakes silently select defaults, and the status tool cannot explain why configured node, timeout, cache, or spec-folder values were ignored.
- **Proposed fix:** Ignore only ENOENT silently. Record other failures in plugin diagnostic state and expose them through mk_code_graph_status, with stderr emission remaining debug-gated.

### F6 - Successful slow bridge responses are cached already expired
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-code-graph.js:318`
- **Evidence:** The timestamp used for expiresAt is captured before the subprocess starts at line 290. The default cache TTL is 5 seconds while the bridge timeout is 15 seconds, so a successful call taking at least 5 seconds is inserted with an expiration time already in the past.
- **Impact:** Slow but successful bridge operation causes every subsequent transform to spawn another bridge process, increasing latency and subprocess pressure precisely when the daemon is degraded.
- **Proposed fix:** Calculate expiresAt from Date.now() after the bridge succeeds, while retaining the original start time separately if latency diagnostics are needed.

### F7 - Transport-plan validation permits message blocks that crash the transform
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-code-graph.js:193`
- **Evidence:** parseTransportPlan verifies only transportOnly and that messagesTransform is an array. It does not validate each block or its title, content, and dedupeKey fields. A syntactically valid response such as messagesTransform:[null] passes parsing and then throws when line 498 reads block.dedupeKey.
- **Impact:** Bridge version drift or malformed output can turn a fail-open transport boundary into a thrown OpenCode message-transform error.
- **Proposed fix:** Validate interfaceVersion and every transport block before caching the plan; reject the complete plan with a status-tool diagnostic when required string fields are absent.

### F8 - Bridge accepts minimal and spec-folder flags but never uses them
- **Severity / Category / Confidence:** refinement / refinement / high
- **Location:** `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:239`
- **Evidence:** parseArgs stores minimal and specFolder at lines 240-260, and the plugin always passes --minimal plus optional --spec-folder. runCli at lines 300-421 never reads either property or forwards specFolder in the CLI arguments.
- **Impact:** The transport contract advertises controls that have no effect; specFolder changes only the plugin cache namespace, not the queried bridge data, and tests can falsely imply scoped behavior.
- **Proposed fix:** Either remove the unused flags and related plugin option or explicitly map them into supported code-index arguments and add an integration assertion proving the resulting query scope.

## Files Reviewed

- `.opencode/plugins/mk-code-graph.js`
- `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`
- `.claude/settings.json`
- `.opencode/skills/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
- `.opencode/skills/system-code-graph/mcp_server/tests/mk-code-graph-bridge-maintenance-block.vitest.ts`
