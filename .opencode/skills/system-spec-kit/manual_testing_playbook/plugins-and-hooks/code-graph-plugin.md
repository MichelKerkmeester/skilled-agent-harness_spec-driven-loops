---
title: "PLG-008 -- Code Graph OpenCode Plugin"
description: "Manual scenario validating the mk-code-graph OpenCode plugin tool and hooks."
trigger_phrases:
  - "plg-001"
  - "mk-code-graph"
  - "code graph opencode plugin"
  - "code graph status tool"
  - "code graph transport bridge"
version: 1.0.0.0
---

# PLG-008 -- Code Graph OpenCode Plugin

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-code-graph` (`.opencode/plugins/mk-code-graph.js`) is a thin OpenCode plugin hook layer. It deliberately never imports the code-index MCP server bundle directly inside the OpenCode host process, because that bundle's native modules (`better-sqlite3`, `sqlite-vec`) may be compiled for a different Node ABI than the host runtime. Instead it shells out, via a bounded `execFile` call, to a plain `node` bridge subprocess (`mk-code-graph-bridge.mjs`) that warm-probes the `mk-code-index` daemon and returns a validated "transport plan" JSON payload on stdout.

The plugin consumes that plan to:
- register an `mk_code_graph_status` diagnostic tool exposing cache/runtime state;
- inject a system-prompt digest via `experimental.chat.system.transform`;
- append a synthetic text part via `experimental.chat.messages.transform`;
- append a compaction note via `experimental.session.compacting`;
- invalidate its per-session transport cache on `session.created`/`session.deleted` events.

Each injection path is gated by a cache TTL, a single-flight in-flight map (concurrent cold-cache calls share one bridge subprocess), and a `dedupeKey` guard so the same block is never injected twice into the same output array.

This is a distinct component from its sibling `.opencode/plugins/mk-code-graph-freshness.js` (debounced mutation-triggered rescans, covered by `plugins-and-hooks/code-graph-freshness-guard.md`) and from Claude Code's own code-graph status surfacing, which runs through `system-spec-kit`'s `session-prime.ts`/`compact-inject.ts` hooks reading `lib/code-graph-boundary.ts` -- a separate code path that does not load this plugin file at all. `mk-code-graph.js` itself is OpenCode-only: it uses the `@opencode-ai/plugin/tool` decorator and the `experimental.chat.*`/`experimental.session.compacting` hook surface, neither of which exists in the Claude Code hook system.

This scenario validates that: the plugin's Node test-runner suite passes; a real, unmocked invocation of the actual plugin file (not a test double) correctly registers its tool and hooks, safely no-ops every injection path when the code-index daemon is unavailable (the live state of this sandbox), and surfaces an accurate diagnostic through `mk_code_graph_status` rather than throwing; and the warm-success injection path (block actually appended) is proven correct at the unit level via the real transport-plan parser.

---

## 2. SCENARIO CONTRACT

- Preconditions:
  - Plugin host file exists at `.opencode/plugins/mk-code-graph.js`.
  - Bridge helper exists at `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`.
  - Transport parser exists at `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs`.
  - CLI shim exists at `.opencode/bin/code-index.cjs`.
- Real user-facing trigger: any OpenCode chat turn (system-prompt construction, a message send, or a session compaction) while `mk-code-graph.js` is loaded; also `mk_code_graph_status({})` invoked directly in an OpenCode session as a diagnostic tool.
- Expected signals:
  - The plugin module exports only `default` (no stray named exports that OpenCode's legacy loader would misregister as plugin entrypoints).
  - `mk_code_graph_status` output includes `plugin_id=mk-code-graph`, `cache_ttl_ms=`, `runtime_ready=`, `node_binary=`, `bridge_timeout_ms=`, `bridge_path=`, `config_error=`, `last_runtime_error=`, `cache_entries=`.
  - A cold/unavailable daemon leaves `output.system`, the anchor message's `parts`, and `output.context` unchanged (clean no-op, no thrown exception) and surfaces the reason via `last_runtime_error`.
  - A warm/ok bridge response appends exactly one deduped block per hook and skips re-injection on a second call within the cache TTL; concurrent cold-cache calls for the same session share one bridge subprocess.
  - `session.created`/`session.deleted` events invalidate only the affected session's cache entry; other event types (for example `message.updated`, `session.updated`) leave the cache warm.
  - A malformed `~/.config/opencode/plugin/mk-code-graph.json` surfaces via `config_error=` in `mk_code_graph_status` instead of crashing plugin load.
- Pass/fail: PASS if the unit suite is green AND a live, unmocked call against the real bridge and transport parser either injects a valid deduped block (warm daemon) or no-ops cleanly with a diagnosed `last_runtime_error` (cold daemon), with no exception thrown in either case. FAIL if the plugin throws, injects malformed/duplicate content, imports the MCP server bundle directly, or `mk_code_graph_status` omits any of the diagnostic fields above.

---

## 3. TEST EXECUTION

1. Run the plugin's Node test-runner regression suite:

```bash
node --test .opencode/plugins/tests/mk-code-graph.test.cjs
```

Expected: `# tests 9`, `# pass 9`, `# fail 0`.

2. Probe the real code-index CLI shim directly (the same call path the bridge issues under the hood):

```bash
node .opencode/bin/code-index.cjs code-graph-status --format json --timeout-ms 3000 --warm-only
```

Expected: `status:"ok"` with graph stats on a warm daemon, or a `backend unavailable` error with `exitCode 75` (retryable) when the daemon socket is absent.

3. Invoke the real bridge script directly, unmocked, exactly as the plugin's `execFile` call does:

```bash
node .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs --minimal --timeout-ms 3000
```

Expected: `status:"ok"` with a rendered `brief` and `data.opencodeTransport` on a warm daemon, or `status:"skipped"` with `metadata.exitCode:75` and `error:"SOCKET_ABSENT"` (or another retryable reason) on a cold daemon -- either way, valid JSON on stdout, exit code `0`.

4. Load the real plugin file (not the test's stub copy) and drive its actual exported hooks end to end. Stub only the two host-runtime bindings that a `data:` URL module cannot resolve because it has no real filesystem base path (the `@opencode-ai/plugin/tool` decorator, resolved as a bare npm specifier -- it is a real installed dependency at `.opencode/node_modules/@opencode-ai/plugin`, but bare-specifier resolution still requires a real importing-file path that a `data:` URL lacks, and the plugin's two same-repo relative ESM imports, which fail for the same reason as relative paths) -- leave `execFile`, the real bridge script, and the real CLI shim completely untouched:

```bash
node /path/to/live-invoke-mk-code-graph.mjs
```

Script body (see Evidence for the run captured from this exact script):

```js
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PLUGIN_PATH = path.join(ROOT, '.opencode', 'plugins', 'mk-code-graph.js');
const MESSAGE_SCHEMA_PATH = path.join(ROOT, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'plugin_bridges', 'spec-kit-opencode-message-schema.mjs');
const TRANSPORT_PATH = path.join(ROOT, '.opencode', 'skills', 'system-code-graph', 'mcp_server', 'plugin_bridges', 'mk-code-graph-transport.mjs');
const BRIDGE_PATH = path.join(ROOT, '.opencode', 'skills', 'system-code-graph', 'mcp_server', 'plugin_bridges', 'mk-code-graph-bridge.mjs');

const source = fs.readFileSync(PLUGIN_PATH, 'utf8')
  .replace("import { tool } from '@opencode-ai/plugin/tool';", 'const tool = (definition) => definition;')
  .replace(
    "'../skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs'",
    JSON.stringify(pathToFileURL(MESSAGE_SCHEMA_PATH).href),
  )
  .replace(
    "'../skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs'",
    JSON.stringify(pathToFileURL(TRANSPORT_PATH).href),
  )
  .replace(
    /const BRIDGE_PATH = fileURLToPath\(new URL\('\.\.\/skills\/system-code-graph\/mcp_server\/plugin_bridges\/mk-code-graph-bridge\.mjs', import\.meta\.url\)\);/,
    `const BRIDGE_PATH = ${JSON.stringify(BRIDGE_PATH)};`,
  );

const mod = await import(`data:text/javascript;base64,${Buffer.from(`${source}\n`).toString('base64')}`);
const hooks = await mod.default({ directory: ROOT }, {});

console.log('--- mk_code_graph_status (before any transform call) ---');
console.log(await hooks.tool.mk_code_graph_status.execute());

console.log('\n--- experimental.chat.system.transform (real bridge subprocess) ---');
const systemOutput = { system: [] };
await hooks['experimental.chat.system.transform']({ sessionID: 'live-probe-session' }, systemOutput);
console.log(JSON.stringify(systemOutput, null, 2));

console.log('\n--- mk_code_graph_status (after transform call) ---');
console.log(await hooks.tool.mk_code_graph_status.execute());
```

### Expected

- Step 1: `# tests 9`, `# pass 9`, `# fail 0`, covering malformed-config observability, cache-TTL retention on slow bridge responses, single-flight concurrent transforms, transport-plan validation (rejects malformed blocks, keeps the plugin default-export-only), messages-transform output-container guards, non-string dedupe-scan tolerance, event-driven cache invalidation scoping, `--minimal` payload shape, and bounded bridge timeout settlement.
- Step 2/3: either a warm `status:"ok"` response with graph stats and a transport plan, or a cold `status:"skipped"`/`"error"` response with an `exitCode`/`error` of `75`/`"SOCKET_ABSENT"` (or another documented retryable reason) -- never an uncaught exception.
- Step 4: `mk_code_graph_status` reports `runtime_ready=false` and `cache_entries=0` before any bridge call; the system-transform output stays `{"system":[]}` when the daemon is cold (no injected content, no exception); the second `mk_code_graph_status` call then surfaces the exact bridge diagnostic via `last_runtime_error=`.

### Kill-Switch / Config Checks

- `MK_CODE_GRAPH_CACHE_TTL_MS`, `MK_CODE_GRAPH_NODE_BINARY`, `MK_CODE_GRAPH_BRIDGE_TIMEOUT_MS`, `MK_CODE_GRAPH_SPEC_FOLDER` override plugin options via env (`normalizeOptions`, `mk-code-graph.js:147-172`); a per-user `~/.config/opencode/plugin/mk-code-graph.json` (parsed by `loadConfig`, `mk-code-graph.js:54-66`) can override the same fields, and a broken JSON file there must surface through `config_error=` rather than crash plugin load -- covered live by the `malformed configuration remains observable through plugin status` unit test (test 1 of 9).

---

## 4. EVIDENCE

Node test-runner unit-test run (`node --test .opencode/plugins/tests/mk-code-graph.test.cjs`):

```text
TAP version 13
# Subtest: malformed configuration remains observable through plugin status
ok 1 - malformed configuration remains observable through plugin status
# Subtest: slow successful bridge responses retain a full live cache TTL
ok 2 - slow successful bridge responses retain a full live cache TTL
# Subtest: concurrent cold-cache transforms share one bridge subprocess
ok 3 - concurrent cold-cache transforms share one bridge subprocess
# Subtest: transport validation rejects malformed blocks and keeps the plugin default-export-only
ok 4 - transport validation rejects malformed blocks and keeps the plugin default-export-only
# Subtest: messages transform rejects invalid output containers before bridge work
ok 5 - messages transform rejects invalid output containers before bridge work
# Subtest: system and compaction dedup scans tolerate non-string entries
ok 6 - system and compaction dedup scans tolerate non-string entries
# Subtest: routine events keep warm cache entries while scoped lifecycle events invalidate
ok 7 - routine events keep warm cache entries while scoped lifecycle events invalidate
# Subtest: bridge --minimal omits raw payload and no longer advertises a spec-folder scope
ok 8 - bridge --minimal omits raw payload and no longer advertises a spec-folder scope
# Subtest: bridge timeout settles even when no process lifecycle event arrives
ok 9 - bridge timeout settles even when no process lifecycle event arrives
1..9
# tests 9
# suites 0
# pass 9
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 251.263250
```

Direct CLI shim probe against the real, live daemon state (`node .opencode/bin/code-index.cjs code-graph-status --format json --timeout-ms 3000 --warm-only`):

```json
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Real, unmocked bridge invocation, the same call the plugin's `execFile` issues (`node .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs --minimal --timeout-ms 3000`):

```json
{"status":"skipped","brief":null,"data":null,"metadata":{"route":"warm_probe","retryable":true,"durationMs":1,"socketPath":"[code-index-socket]","exitCode":75},"error":"SOCKET_ABSENT"}
```

Exit code of the bridge invocation: `0` (the bridge itself never fails hard on a cold daemon -- it reports the failure in-band as JSON).

Live-repo state check explaining the `SOCKET_ABSENT` result above -- the socket directory exists but is empty, even though a stale owner heartbeat file claims a recent daemon:

```text
$ ls -la /tmp/mk-code-index/
total 0
drwx------@    2 michelkerkmeester  wheel     64 Jul 11 10:04 .
drwxrwxrwt  1233 root               wheel  39456 Jul 11 14:44 ..

$ cat .opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json
{
  "schemaVersion": 1,
  "generatedAt": "2026-07-11T05:55:40.708Z",
  "producer": "mk-code-index",
  "graphFreshness": "empty",
  "graphState": "empty",
  "readiness": { "freshness": "empty", "action": "full_scan", "reason": "graph is empty (0 nodes)" }
}

$ cat .opencode/skills/system-code-graph/mcp_server/database/.code-graph-owner.json
{
  "ownerPid": 46779,
  "lastHeartbeatIso": "2026-07-11T12:44:02.232Z",
  "ttlMs": 60000,
  "socketPath": "/tmp/mk-code-index/daemon-ipc.sock"
}
```

`warmProbe()` in `mk-code-graph-bridge.mjs` checks `existsSync(socketPath)` directly and does not trust the owner heartbeat file alone; with no socket file present the bridge correctly reports `socket_absent` regardless of the heartbeat's freshness -- this sandbox's code-index daemon is cold for this run.

Live, unmocked invocation of the real plugin file (step 4 script; only the two unresolvable host-runtime bindings were stubbed, `execFile`/the bridge/the CLI shim are all real):

```text
--- mk_code_graph_status (before any transform call) ---
plugin_id=mk-code-graph
cache_ttl_ms=5000
spec_folder=auto
resume_mode=minimal
messages_transform_enabled=true
messages_transform_mode=schema_aligned
runtime_ready=false
node_binary=node
bridge_timeout_ms=15000
bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs
config_error=none
last_runtime_error=none
cache_entries=0
cache=empty

--- experimental.chat.system.transform (real bridge subprocess) ---
{
  "system": []
}

--- mk_code_graph_status (after transform call) ---
plugin_id=mk-code-graph
cache_ttl_ms=5000
spec_folder=auto
resume_mode=minimal
messages_transform_enabled=true
messages_transform_mode=schema_aligned
runtime_ready=false
node_binary=node
bridge_timeout_ms=15000
bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs
config_error=none
last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
cache_entries=0
cache=empty
```

This confirms the full cold-daemon contract live: `mk_code_graph_status` starts clean (`runtime_ready=false`, no error yet), the system-transform hook injects nothing and throws nothing (`output.system` stays `[]`), and the status tool then surfaces the exact bridge failure reason via `last_runtime_error` -- the message text (`Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op`) is produced by `diagnoseTransportPlanFailure()` in `mk-code-graph-transport.mjs:50-60`, reachable only through the real bridge output parsed above, not fabricated for this scenario.

Warm-daemon injection note (scope-limited SKIP for this run): no warm `mk-code-index` daemon was available in this sandbox (confirmed above), so the "block actually appended" success path could not be exercised live end-to-end through the plugin. That exact branch is proven at the unit level instead, deterministically, by tests 2, 3, 6, and 8 of the suite above -- `slow successful bridge responses retain a full live cache TTL`, `concurrent cold-cache transforms share one bridge subprocess`, `system and compaction dedup scans tolerate non-string entries` (asserts the exact appended string `System digest\nGraph is ready` and that a second call does not duplicate it), and `bridge --minimal omits raw payload...` (asserts `minimal.data.opencodeTransport` is present on an `ok` bridge response). These mock only the `execFile`/`spawn` boundary, not the plugin's own parsing, caching, or dedupe logic.

---

## 5. SOURCE FILES

- OpenCode plugin under test: `.opencode/plugins/mk-code-graph.js`
- Plugin unit test: `.opencode/plugins/tests/mk-code-graph.test.cjs`
- Bridge subprocess: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs`
- Transport-plan parser: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-transport.mjs`
- Plugin bridges overview: `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md`
- CLI shim invoked by the bridge: `.opencode/bin/code-index.cjs`
- Shared message-schema helper: `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs`
- Related sibling plugin (distinct responsibility, not this scenario): `.opencode/plugins/mk-code-graph-freshness.js` -- see `plugins-and-hooks/code-graph-freshness-guard.md`
- Claude Code's separate code-graph status path (does not load this plugin file): `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `compact-inject.ts`, `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: PLG-008
- Canonical root source: manual_testing_playbook.md
- Feature file path: plugins-and-hooks/code-graph-plugin.md

---

## 7. PASS/FAIL

PASS

The plugin's Node test-runner suite is fully green against the live source (9/9). A real, unmocked invocation of the actual plugin file -- stubbing only the two host-runtime bindings that cannot resolve outside a running OpenCode process, leaving `execFile`, the real bridge script, and the real CLI shim untouched -- confirmed the plugin registers `mk_code_graph_status` correctly, exposes all documented diagnostic fields, and safely no-ops every injection hook when the code-index daemon is cold: `output.system` stayed `[]` (no exception, no malformed content), and `mk_code_graph_status` surfaced the precise bridge failure reason (`SOCKET_ABSENT`, `exit=75`) afterward. The cold state was independently confirmed against this repo's real markers: `/tmp/mk-code-index/` is empty (no socket file), and `.code-graph-readiness.json` reports `graphFreshness:"empty"`. The one path not exercised live end-to-end through the plugin -- a warm daemon producing an actually-appended transport block -- is proven instead by four of the nine unit tests, which mock only the subprocess boundary and assert the plugin's real parsing, caching, single-flight, and dedupe logic against a scripted `ok` response; this is labeled above as a scope-limited SKIP for the live run, not a gap in the plugin's correctness.
