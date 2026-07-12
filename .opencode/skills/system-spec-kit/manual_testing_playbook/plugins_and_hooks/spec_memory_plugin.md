---
title: "Spec Memory OpenCode Plugin"
description: "Manual validation for the mk-spec-memory OpenCode plugin and warm CLI bridge."
trigger_phrases:
  - "plg-001"
  - "mk-spec-memory"
  - "spec memory plugin"
  - "spec memory bridge"
  - "continuity injection"
version: 1.0.0.1
---

# Spec Memory OpenCode Plugin

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-spec-memory` is the OpenCode plugin (auto-discovered by OpenCode from `.opencode/plugins/*.js`, no manual registration entry) that bridges the standalone Spec Kit Memory MCP daemon into the OpenCode chat runtime. It has two jobs:

1. `experimental.chat.system.transform` silently appends a bounded, digest-marked Spec Kit continuity brief (`[mk-spec-memory:continuity:<16-hex>]`) into every model turn's `output.system` array, sourced by spawning the warm CLI bridge (`mk-spec-memory-bridge.mjs`) rather than talking to the daemon directly.
2. A `mk_spec_memory_status` tool exposes plugin/bridge health (cache stats, last bridge status, warm route) to the user without leaking local filesystem paths.

The bridge itself never blocks or dispatches into the daemon's mutation surface: `promptSafeSpecMemoryBridgePolicy()` in `mk-spec-memory-bridge.mjs` only allows `request:"brief"`/`"status"` paired with `toolName:"session_resume"`/`"memory_health"`, and every failure path (cold daemon, timeout, oversized stdout, EPIPE) fails open with an empty `output.system` rather than throwing. A sibling continuity path exists for the Claude Code runtime as compiled hooks under `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/` (`session-prime.js`, `compact-inject.js`, `user-prompt-submit.js`, `session-stop.js`), wired directly in `.claude/settings.json`; those are a separate delivery mechanism for the same continuity substrate, not this OpenCode plugin, and are covered here only as cross-reference.

This scenario validates: the plugin loads and exports only the factory function; config load handles missing/malformed/unreadable/valid `mk-spec-memory.json`; the continuity cache is stable, digest-marked, and session/TTL/race-safe; oversized bridge stdout and early-exit/EPIPE bridges fail open; the status tool's capability-boundary fields are honest; the kill-switch envs (`MK_SPEC_MEMORY_PLUGIN_DISABLED`, legacy `SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED`) actually prevent the bridge subprocess from spawning; and the real bridge script, invoked live against the current (cold) daemon, reports a truthful retryable `SOCKET_ABSENT` skip rather than a fabricated brief.

---

## 2. SCENARIO CONTRACT

- Plugin host file exists at `.opencode/plugins/mk-spec-memory.js`.
- Bridge helper exists at `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs`.
- Warm CLI shim exists at `.opencode/bin/spec-memory.cjs` (spawned by the bridge with `--warm-only`).
- Unit test exists at `.opencode/plugins/tests/mk-spec-memory.test.cjs`.
- Real user-facing trigger: a user has an OpenCode chat session open; on every turn the plugin's `system.transform` hook should quietly attach current Spec Kit continuity (or nothing, if the daemon is cold) to the model's system context, and the user (or an operator) can run the `mk_spec_memory_status` tool to check whether the warm bridge is healthy.
- Expected signals: `plugin_id=mk-spec-memory`, `enabled=true|false`, `disabled_reason=`, `config_status=missing|loaded|parse_error|read_error`, `runtime_ready=`, `bridge_invocations=`, `last_bridge_status=ok|skipped|fail_open`, `last_error_code=`, `warm_status=`, `warm_route=warm_probe|cli`, `warm_exit_code=75` (retryable) on a cold daemon, `continuity_recovery=per_transform_warm`, `continuity_compaction=unsupported_runtime_event`, `continuity_autosave=unsupported_runtime_event`, and an injected `output.system` entry ending in `[mk-spec-memory:continuity:<16 hex chars>]` only when the bridge returns a non-empty brief.
- Pass/fail: PASS if the unit-test suite is fully green, the real bridge script (invoked directly and through the plugin factory) returns a well-formed, truthfully-labeled response for the daemon's actual live state, and the kill-switch envs prevent any bridge subprocess spawn. FAIL if the plugin fabricates a brief when the bridge fails, omits `disabled_reason`/`last_error_code`, lets a stale in-flight lookup overwrite a newer one, or the kill-switch envs are ignored.

---

## 3. TEST EXECUTION

1. Run the shipped regression suite:

```bash
node .opencode/plugins/tests/mk-spec-memory.test.cjs
```

Expected: TAP output, `# tests 13`, `# pass 13`, `# fail 0`.

2. Confirm the plugin's own OpenCode-host import is unresolvable outside a live OpenCode process (this is why both the shipped test and step 5 below stub only that one import, never plugin logic):

```bash
node -e "import('@opencode-ai/plugin/tool').then(()=>console.log('resolved')).catch(e=>console.log('FAIL', e.code || e.message))"
```

Expected: `FAIL ERR_MODULE_NOT_FOUND`.

3. Invoke the real bridge script directly, requesting a status frame, with no daemon assumed warm:

```bash
printf '%s' '{"request":"status","workspaceRoot":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs
```

Expected signals: JSON with `"status":"skipped"` (or `"ok"` if a daemon happens to be warm), `"metadata":{"route":"warm_probe"|"cli", "retryable":true|false, ...}`.

4. Invoke the real bridge script directly, requesting a continuity brief:

```bash
printf '%s' '{"request":"brief","workspaceRoot":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs
```

5. Live-invoke the plugin factory itself (real bridge script, real cache/session logic; the only substitution is the same host-only `tool` import stub the shipped unit test performs, plus a literal `BRIDGE_PATH` because `new URL(..., import.meta.url)` cannot resolve relative to a `data:` module URL):

```bash
cat > /tmp/mk-spec-memory-live-check.mjs <<'SCRIPT'
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PLUGIN_PATH = path.join(ROOT, '.opencode', 'plugins', 'mk-spec-memory.js');
const REAL_BRIDGE_PATH = path.join(ROOT, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'plugin_bridges', 'mk-spec-memory-bridge.mjs');
const REAL_CLI_SHIM_PATH = path.join(ROOT, '.opencode', 'bin', 'spec-memory.cjs');

const source = fs.readFileSync(PLUGIN_PATH, 'utf8')
  .replace("import { tool } from '@opencode-ai/plugin/tool';", 'const tool = (definition) => definition;')
  .replace(
    /const BRIDGE_PATH = .*?;\nconst SOURCE_PATHS = \[[\s\S]*?\n\];/,
    `const BRIDGE_PATH = ${JSON.stringify(REAL_BRIDGE_PATH)};\nconst SOURCE_PATHS = [BRIDGE_PATH, ${JSON.stringify(REAL_CLI_SHIM_PATH)}];`,
  );

const pluginModule = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const hooks = await pluginModule.default({ directory: ROOT }, {});

console.log('--- mk_spec_memory_status.execute() ---');
console.log(await hooks.tool.mk_spec_memory_status.execute());

console.log('\n--- experimental.chat.system.transform() ---');
const output = { system: [] };
await hooks['experimental.chat.system.transform']({ sessionID: 'live-check-session' }, output);
console.log(JSON.stringify(output, null, 2));
SCRIPT
node /tmp/mk-spec-memory-live-check.mjs
```

Keep the fixture in place — step 6 re-runs the very same script, so the single teardown lives at the end of step 6.

6. Kill-switch check — re-run the same script with the disable env set and confirm the bridge subprocess never spawns, then tear the fixture down:

```bash
MK_SPEC_MEMORY_PLUGIN_DISABLED=1 node /tmp/mk-spec-memory-live-check.mjs
rm /tmp/mk-spec-memory-live-check.mjs
```

Expected: `enabled=false`, `disabled_reason=MK_SPEC_MEMORY_PLUGIN_DISABLED`, `bridge_invocations=0`.

7. If a live OpenCode session is available, restart OpenCode after any plugin edit and run the `mk_spec_memory_status` tool directly, then compare its fields against step 5's output. If a live OpenCode session is unavailable (the common case for an automated operator), rely on steps 1, 3, 4, 5, and 6 as the evidentiary fallback and classify the live-session-only portion SKIP with that reason.

---

## 4. EVIDENCE

Preconditions observed (real `wc -l`):

```text
.opencode/plugins/mk-spec-memory.js: 551 lines
.opencode/plugins/tests/mk-spec-memory.test.cjs: 396 lines
.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs: 387 lines
.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs: 147 lines
.opencode/bin/spec-memory.cjs: 168 lines
```

Unit test command:

```bash
node .opencode/plugins/tests/mk-spec-memory.test.cjs
```

Unit test output (tail):

```text
# Subtest: exports only the OpenCode plugin factory
ok 1 - exports only the OpenCode plugin factory
# Subtest: reports missing, malformed, unreadable, and valid configuration safely
ok 2 - reports missing, malformed, unreadable, and valid configuration safely
# Subtest: uses stable bounded markers and keeps ordinary message events inside the TTL
ok 3 - uses stable bounded markers and keeps ordinary message events inside the TTL
# Subtest: does not let an invalidated in-flight result replace a newer lookup
ok 4 - does not let an invalidated in-flight result replace a newer lookup
# Subtest: accepts bridge stdout at the ceiling and rejects the first byte over it
ok 5 - accepts bridge stdout at the ceiling and rejects the first byte over it
# Subtest: fails open when the bridge exits before consuming stdin
ok 6 - fails open when the bridge exits before consuming stdin
# Subtest: status names the runtime continuity capability boundaries
ok 7 - status names the runtime continuity capability boundaries
# Subtest: deduplicates marked synthetic text parts with unrelated extra fields
ok 8 - deduplicates marked synthetic text parts with unrelated extra fields
# Subtest: UserPromptSubmit passes through one valid JSON line
ok 9 - UserPromptSubmit passes through one valid JSON line
# Subtest: UserPromptSubmit maps malformed and nonzero child output to the safe JSON default
ok 10 - UserPromptSubmit maps malformed and nonzero child output to the safe JSON default
# Subtest: UserPromptSubmit terminates a hanging child inside the outer hook budget
ok 11 - UserPromptSubmit terminates a hanging child inside the outer hook budget
# Subtest: UserPromptSubmit bounds both stdin and captured child output
ok 12 - UserPromptSubmit bounds both stdin and captured child output
# Subtest: Claude hook sources pin bounded, truthful, snapshot-consistent behavior
ok 13 - Claude hook sources pin bounded, truthful, snapshot-consistent behavior
1..13
# tests 13
# suites 0
# pass 13
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 4456.269291
```

Host-import isolation check:

```bash
node -e "import('@opencode-ai/plugin/tool').then(()=>console.log('resolved')).catch(e=>console.log('FAIL', e.code || e.message))"
```

```text
FAIL ERR_MODULE_NOT_FOUND
```

Direct real-bridge invocation, `request:"status"` (daemon cold, no `/tmp/mk-spec-memory` socket present):

```bash
printf '%s' '{"request":"status","workspaceRoot":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs
```

```json
{"status":"skipped","brief":null,"data":null,"metadata":{"route":"warm_probe","retryable":true,"durationMs":1,"socketPath":"[spec-memory-socket]","exitCode":75},"error":"SOCKET_ABSENT"}
```

Direct real-bridge invocation, `request:"brief"` (same cold-daemon state):

```bash
printf '%s' '{"request":"brief","workspaceRoot":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs
```

```json
{"status":"skipped","brief":null,"data":null,"metadata":{"route":"warm_probe","retryable":true,"durationMs":1,"socketPath":"[spec-memory-socket]","exitCode":75},"error":"SOCKET_ABSENT"}
```

Live plugin-factory invocation (real bridge script, real cache/session state, only the host-only `tool` import stubbed):

```text
--- mk_spec_memory_status.execute() ---
plugin_id=mk-spec-memory
enabled=true
disabled_reason=none
config_status=missing
config_error_code=none
cache_ttl_ms=5000
max_brief_chars=2400
max_cache_entries=200
runtime_ready=false
node_binary=node
bridge_timeout_ms=3000
cli_timeout_ms=2500
bridge_path=[spec-memory-bridge]
last_bridge_status=skipped
last_error_code=SOCKET_ABSENT
last_duration_ms=38
bridge_invocations=1
continuity_lookups=0
cache_entries=0
cache_hits=0
cache_misses=0
cache_hit_rate=0
continuity_recovery=per_transform_warm
continuity_compaction=unsupported_runtime_event
continuity_autosave=unsupported_runtime_event
warm_status=skipped
warm_error=SOCKET_ABSENT
warm_route=warm_probe
warm_retryable=true
warm_exit_code=75

--- experimental.chat.system.transform() ---
{
  "system": []
}

--- mk_spec_memory_status.execute() AFTER transform ---
plugin_id=mk-spec-memory
enabled=true
disabled_reason=none
config_status=missing
config_error_code=none
cache_ttl_ms=5000
max_brief_chars=2400
max_cache_entries=200
runtime_ready=false
node_binary=node
bridge_timeout_ms=3000
cli_timeout_ms=2500
bridge_path=[spec-memory-bridge]
last_bridge_status=skipped
last_error_code=SOCKET_ABSENT
last_duration_ms=37
bridge_invocations=3
continuity_lookups=1
cache_entries=0
cache_hits=0
cache_misses=1
cache_hit_rate=0
continuity_recovery=per_transform_warm
continuity_compaction=unsupported_runtime_event
continuity_autosave=unsupported_runtime_event
warm_status=skipped
warm_error=SOCKET_ABSENT
warm_route=warm_probe
warm_retryable=true
warm_exit_code=75
```

Kill-switch check (`MK_SPEC_MEMORY_PLUGIN_DISABLED=1`, same script, fixture still present because the teardown now runs after this step):

```text
--- mk_spec_memory_status.execute() ---
plugin_id=mk-spec-memory
enabled=false
disabled_reason=MK_SPEC_MEMORY_PLUGIN_DISABLED
config_status=missing
config_error_code=none
cache_ttl_ms=5000
max_brief_chars=2400
max_cache_entries=200
runtime_ready=false
node_binary=node
bridge_timeout_ms=3000
cli_timeout_ms=2500
bridge_path=[spec-memory-bridge]
last_bridge_status=uninitialized
last_error_code=none
last_duration_ms=0
bridge_invocations=0
continuity_lookups=0
cache_entries=0
cache_hits=0
cache_misses=0
cache_hit_rate=0
continuity_recovery=per_transform_warm
continuity_compaction=unsupported_runtime_event
continuity_autosave=unsupported_runtime_event
warm_status=skipped
warm_error=MK_SPEC_MEMORY_PLUGIN_DISABLED
warm_route=unknown
warm_retryable=false
warm_exit_code=none

--- experimental.chat.system.transform() ---
{
  "system": []
}
```

Claude Code hook wiring evidence from `.claude/settings.json` (the sibling continuity delivery path for the Claude runtime, not this OpenCode plugin):

```text
SessionStart -> node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js
PreCompact   -> node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js
UserPromptSubmit -> node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js
Stop         -> node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js (async)
```

OpenCode MCP daemon registration evidence from `opencode.json` (the standalone daemon this plugin's bridge probes; distinct from the plugin's own file-based auto-discovery):

```json
"mk-spec-memory": {
  "type": "local",
  "command": ["node", ".opencode/bin/mk-spec-memory-launcher.cjs"],
  "environment": { "SPECKIT_IPC_SOCKET_DIR": "/tmp/mk-spec-memory", "...": "..." }
}
```

---

## 5. SOURCE FILES

- `.opencode/plugins/mk-spec-memory.js`
- `.opencode/plugins/tests/mk-spec-memory.test.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs`
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs`
- `.opencode/bin/spec-memory.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js` (compiled, wired in `.claude/settings.json`)
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js` (compiled, wired in `.claude/settings.json`)
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js` (compiled, wired in `.claude/settings.json`)
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` (compiled, wired in `.claude/settings.json`)
- `.claude/settings.json`
- `opencode.json`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: spec-memory-plugin
- Canonical root source: manual_testing_playbook.md
- Feature file path: plugins_and_hooks/spec_memory_plugin.md

---

## 7. PASS/FAIL

PASS

All 13 unit-test cases in `mk-spec-memory.test.cjs` passed (`# pass 13`, `# fail 0`). The real bridge script, invoked directly and through a live plugin-factory instantiation with only the host-only `@opencode-ai/plugin/tool` import stubbed (the same technique the shipped test itself uses, never a mock of plugin logic), truthfully reported the actual cold-daemon state (`status:"skipped"`, `error:"SOCKET_ABSENT"`, `retryable:true`, `exitCode:75`) instead of fabricating a continuity brief, and correctly produced an empty `output.system` for that turn. The kill-switch env (`MK_SPEC_MEMORY_PLUGIN_DISABLED=1`) suppressed the bridge entirely (`enabled=false`, `bridge_invocations=0`) as designed.

SKIP (documented, not blocking the PASS above): full end-to-end continuity-brief injection — a non-empty `output.system` entry ending in a real `[mk-spec-memory:continuity:...]` marker sourced from a warm daemon inside a live OpenCode session — was not observed, because no OpenCode session was live in this environment and the shared `mk-spec-memory` MCP daemon was cold (`/tmp/mk-spec-memory` had no daemon socket, only an unrelated `hf-embed.pid`/`relaunch.log`). That path is covered functionally by unit test 3 (`uses stable bounded markers and keeps ordinary message events inside the TTL`), which exercises the identical code path against a scripted warm bridge stand-in.
