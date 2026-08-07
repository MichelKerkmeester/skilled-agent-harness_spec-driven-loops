# Seat gpt-cli-frontdoors — iteration 3 (global #46)

- Model: `openai/gpt-5.5-fast` · Executor: opencode · Angle: gpt-cli-frontdoors
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=2 P2=0

## Analysis

Reviewing the CLI front-door and only its real call chain; no writes or write-producing commands.The front-door itself delegates to the compiled CLI, which loads the shared launcher bridge and daemon launcher. I am now checking prompt-time hook consumers to verify how `--warm-only` is actually used.I traced `.opencode/bin/code-index.cjs` through the built/source CLI, launcher bridge, daemon launcher, plugin bridge, and prompt-time OpenCode plugin consumers.

Confirmed behavior: warm-only cold-start prevention is present in the CLI path. Prompt-time env flags imply `warmOnly`, and `ensureDaemonReady()` probes before spawning, returning retryable `75` instead of launching when warm-only is set. The plugin bridge also probes first and skips absent sockets.

Fresh issues found: two prompt-time/security boundary gaps remain, both in the warm socket/prompt bridge path. The default OpenCode plugin calls only status, but the bridge exposes a `--tool` selector and its safety checks are weaker than the CLI alias surface and server-side IPC hardening.

```json
{
  "seat": "gpt-cli-frontdoors",
  "model": "openai/gpt-5.5-fast",
  "angle": "code-index.cjs front-door: warm-only socket probe first / skip if absent; no maintenance/scan from prompt-time hooks.",
  "verdict": "CONDITIONAL",
  "summary": "Warm-only no-spawn is present, but prompt-time bridge policy can be bypassed via camelCase tool aliases and warm socket trust lacks owner checks.",
  "files_reviewed": [
    ".opencode/bin/code-index.cjs",
    ".opencode/skills/system-code-graph/mcp_server/code-index-cli.ts",
    ".opencode/skills/system-code-graph/mcp_server/dist/code-index-cli.js",
    ".opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts",
    ".opencode/bin/lib/launcher-ipc-bridge.cjs",
    ".opencode/bin/mk-code-index-launcher.cjs",
    ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs",
    ".opencode/plugins/mk-code-graph.js",
    ".opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts",
    ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts",
    ".opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts",
    ".opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts",
    ".opencode/commands/doctor/_routes.yaml",
    ".opencode/commands/doctor/assets/doctor_code-graph.yaml",
    "opencode.json"
  ],
  "findings": [
    {
      "severity": "P1",
      "dimension": "security",
      "title": "CamelCase aliases bypass prompt-time maintenance block",
      "file": ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:18",
      "evidence": "MAINTENANCE_TOOLS blocks only snake/kebab names at lines 18-25, while parseArgs accepts arbitrary --tool at lines 257-260 and runCli checks the raw toolName at lines 301-308. The downstream CLI accepts camelCase aliases through commandAliases() in .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:220-221 and dispatches the canonical tool at lines 1146-1150.",
      "why": "A prompt-time bridge invocation with --tool codeGraphScan, codeGraphApply, or codeGraphVerify misses the bridge blocklist, then the CLI resolves the alias and can run maintenance/mutating code against a warm daemon. This violates the prompt-time no-maintenance/no-scan invariant the bridge is meant to enforce.",
      "recommendation": "Normalize the bridge tool name before policy checks using the same snake/kebab/camel alias map as code-index-cli, or block by canonical CLI tool definition after alias resolution. Add tests for codeGraphScan/codeGraphApply/codeGraphVerify."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Warm-only clients trust socket dirs without owner validation",
      "file": ".opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:924",
      "evidence": "ensureSocketEnvironment() sets or creates SPECKIT_IPC_SOCKET_DIR, then only rejects group/world-writable dirs at lines 924-934; it never verifies stat.uid is the current user. The client then deep-probes and connects to that socket at lines 1085-1106. The server bind path does enforce current-user ownership in .opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:274-282, but the warm-only client path does not.",
      "why": "On a shared host, a different local user can pre-create a non-world-writable /tmp/mk-code-index directory and a fake daemon socket before first use. The warm-only CLI/plugin bridge can accept the fake JSON-RPC endpoint and inject attacker-controlled status text into prompt-time OpenCode context instead of skipping or spawning safely.",
      "recommendation": "Before probing or connecting, validate the socket directory and socket path with lstat/stat: current uid ownership, not group/world-writable, no symlinked socket path, and allowed root containment. Reuse one hardened helper in code-index-cli and mk-code-graph-bridge."
    }
  ]
}
```
