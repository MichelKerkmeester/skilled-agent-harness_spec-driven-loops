# Focus

F4 OpenCode plugin bridge native route fail-open.

# Actions Taken

- Read the OpenCode plugin entrypoint, bridge source, built compat entrypoint, launcher, launcher IPC bridge, advisor server, IPC socket server, status handler, recommend handler, and compat daemon probe.
- Reproduced the requested bridge command from repo root.
- Re-ran the bridge with `forceNative:true` to expose the masked native-probe branch.
- Imported the built compat entrypoint directly to check whether `dist/mcp_server/compat/index.js` is missing or malformed.
- Traced the launcher lease path and IPC socket guard that runs before the MCP server starts.

# Findings[file:line]

- The OpenCode plugin never imports the compat module. `.opencode/plugins/mk-skill-advisor.js:42` points `BRIDGE_PATH` at `mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`; `.opencode/plugins/mk-skill-advisor.js:452` spawns `options.nodeBinary` with `[BRIDGE_PATH]`; `.opencode/plugins/mk-skill-advisor.js:526` sends stdin JSON from `bridgePayloadJson()`.
- The bridge's "native" path is currently an MCP stdio subprocess, not a direct `compat/index.js` import. `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:45` resolves `bin/mk-skill-advisor-launcher.cjs`; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:231` creates `StdioClientTransport`; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:233` uses `process.execPath`; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:234` passes the launcher path as the only child arg.
- Native availability is decided by `advisor_status` over that MCP subprocess. `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:273` defines `loadNativeAdvisorModules()`; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:275` maps `readAdvisorStatus` to `callAdvisorTool('advisor_status', ...)`; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:302` loads the modules; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:306` reads status; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:308` treats only `live` or `stale` freshness as available.
- The fail-open masking is deliberate but too opaque. `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:442` probes native; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:444` only calls `buildNativeBrief()` when `probe.available`; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:450` catches probe exceptions and suppresses the original error unless `forceNative` is set; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:456` falls through to `buildLegacyBrief()`; `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:407` through `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:418` emits `status:"fail_open"`, `error:"SYSTEM_SKILL_ADVISOR_UNAVAILABLE"`, and `metadata.route:"python"`.
- Reproduction matches the reported symptom. The requested command returned `{"status":"fail_open","metadata":{"route":"python",...},"error":"SYSTEM_SKILL_ADVISOR_UNAVAILABLE"}`. Adding `forceNative:true` returned `{"status":"fail_open","metadata":{},"error":"NATIVE_PROBE_FAILED"}`, which pins the failure before `buildNativeBrief()`.
- `dist/mcp_server/compat/index.js` is present and exports the expected API. `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts:5` exports `handleAdvisorRecommend`; `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts:6` exports `readAdvisorStatus`; `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts:7` exports `probeAdvisorDaemon`; `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts:8` exports `buildSkillAdvisorBrief`; `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts:9` exports `renderAdvisorBrief`. The built file mirrors these exports at `.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/compat/index.js:4` through `.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/compat/index.js:8`.
- Direct compat import is healthy. `node -e "import('./.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/compat/index.js')..."` listed `buildSkillAdvisorBrief`, `handleAdvisorRecommend`, `probeAdvisorDaemon`, `readAdvisorStatus`, and `renderAdvisorBrief`; direct `readAdvisorStatus({workspaceRoot:process.cwd()})` returned `freshness:"live"`, `generation:4466`, and `skillCount:23`.
- The precise runtime failure point is the launcher lease-to-IPC bridge, not a missing import/export. `.opencode/bin/mk-skill-advisor-launcher.cjs:228` checks whether a launcher lease is already held; `.opencode/bin/mk-skill-advisor-launcher.cjs:243` calls `bridgeOrReportLeaseHeld()` for a held daemon lease; `.opencode/bin/mk-skill-advisor-launcher.cjs:479` enables strict single-writer mode by default; `.opencode/bin/mk-skill-advisor-launcher.cjs:481` returns early when `checkStrictSingleWriter()` reports a holder.
- The bridge-to-holder guard requires an IPC socket. `.opencode/bin/lib/launcher-ipc-bridge.cjs:121` computes the socket path; `.opencode/bin/lib/launcher-ipc-bridge.cjs:122` checks whether it exists; `.opencode/bin/lib/launcher-ipc-bridge.cjs:123` writes `LEASE_HELD_BY:<pid> ... (no-bridge-socket)` to stdout and returns; `.opencode/bin/lib/launcher-ipc-bridge.cjs:127` through `.opencode/bin/lib/launcher-ipc-bridge.cjs:132` only bridge stdio to the holder when the socket exists.
- The current workspace has exactly that inconsistent state. `.opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json:2` contains `"pid": 26585`; `.opencode/skills/system-skill-advisor/mcp_server/database/.mk-skill-advisor-launcher.json:3` contains `"startedAt": "2026-05-26T19:56:02.671Z"`. `find .opencode/skills/system-skill-advisor/mcp_server/database -maxdepth 1 -name 'daemon-ipc.sock' -ls` returned no socket. Running `node .opencode/bin/mk-skill-advisor-launcher.cjs` printed `LEASE_HELD_BY:26585 startedAt=2026-05-26T19:56:02.671Z (no-bridge-socket)`.
- The socket server would create the missing file only after the advisor server reaches IPC startup. `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:306` calls `startIpcSocketServer()`; `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:307` passes `resolveIpcSocketPath(resolveSkillGraphDbDir())`; `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts:59` through `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts:63` resolves `daemon-ipc.sock`; `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts:173` through `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts:178` chmods the socket, stores the active path, and logs it.

# Questions Answered

- (a) The bridge attempts the native route by spawning `bin/mk-skill-advisor-launcher.cjs` as an MCP stdio child and calling `advisor_status`; it does not import `dist/mcp_server/compat/index.js`. It decides native is unavailable when `advisor_status` is not `live`/`stale` or when any probe exception is thrown.
- (b) The precise failure point is the launcher guard before MCP initialization: a stale or unusable launcher lease exists, the expected IPC socket is absent, the launcher writes `LEASE_HELD_BY... (no-bridge-socket)` to stdout, and `StdioClientTransport` cannot complete the MCP handshake. This is a subprocess/lease/IPC issue plus a fail-open catch that hides the actionable diagnostic. It is not a bad compat import path, missing export, or version skew.
- (c) Reproduced. Normal bridge input returns `route:"python"` and `SYSTEM_SKILL_ADVISOR_UNAVAILABLE`; `forceNative:true` returns `NATIVE_PROBE_FAILED`; direct compat import/status succeeds; direct launcher invocation emits `LEASE_HELD_BY... (no-bridge-socket)`.
- (d) Concrete remediation: change `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` so `loadNativeAdvisorModules()` first imports `../dist/mcp_server/compat/index.js` relative to the bridge and uses its `probeAdvisorDaemon`, `readAdvisorStatus`, `handleAdvisorRecommend`, `buildSkillAdvisorBrief` or `renderAdvisorBrief` directly. Keep the launcher/MCP subprocess as a fallback only when the direct compat import fails. Also change `.opencode/bin/lib/launcher-ipc-bridge.cjs` or `.opencode/bin/mk-skill-advisor-launcher.cjs` so a held lease without `daemon-ipc.sock` is treated as stale/reclaimable instead of writing `LEASE_HELD_BY... (no-bridge-socket)` to stdout for an MCP client.

# Remediation Sketch

Target `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`:

```js
async function loadNativeAdvisorModules() {
  try {
    const compat = await import(new URL('../dist/mcp_server/compat/index.js', import.meta.url));
    return {
      readAdvisorStatus: compat.readAdvisorStatus,
      handleAdvisorRecommend: compat.handleAdvisorRecommend,
      probeAdvisorDaemon: compat.probeAdvisorDaemon,
      buildSkillAdvisorBrief: compat.buildSkillAdvisorBrief,
      renderAdvisorBrief: compat.renderAdvisorBrief,
    };
  } catch (error) {
    return {
      readAdvisorStatus: async (args) => parseAdvisorToolData(await callAdvisorTool('advisor_status', args, args.workspaceRoot)),
      handleAdvisorRecommend: (args) => callAdvisorTool('advisor_recommend', args, args.workspaceRoot),
      probeAdvisorDaemon: null,
      buildSkillAdvisorBrief: null,
      renderAdvisorBrief,
    };
  }
}
```

Then adapt `buildNativeBrief()` to accept the direct handler's already-normal `content[0].text` shape, which `handleAdvisorRecommend()` already returns at `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:333` through `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:337`.

Target `.opencode/bin/lib/launcher-ipc-bridge.cjs`:

When `.opencode/bin/lib/launcher-ipc-bridge.cjs:122` sees a missing socket for a held lease, return a machine-readable nonzero launcher failure or let the launcher reclaim the stale lease instead of writing non-JSON `LEASE_HELD_BY` to stdout. The plugin bridge's MCP client cannot distinguish that line from protocol corruption.

# Questions Remaining

- I could not verify whether PID `26585` is genuinely alive because this sandbox denied process inspection (`ps` and `kill -0` were not permitted). The file/socket evidence is still sufficient for this bridge failure: a holder lease without `daemon-ipc.sock` is the state the launcher itself reports.
- The remediation pass should decide whether direct compat import becomes the primary path permanently or whether the subprocess path stays primary with better stale-lease recovery. My read: direct compat should be primary for this plugin bridge because the built compat API already exists, is importable, and avoids a second MCP client/server hop.

# Next Focus

F5 stale vitest path NC-004/005
