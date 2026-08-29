---
title: "Spec Memory OpenCode Plugin"
description: "Manual validation for the system-spec-memory OpenCode plugin and warm CLI bridge."
trigger_phrases:
  - "plg-001"
  - "system-spec-memory"
  - "spec memory plugin"
  - "spec memory bridge"
  - "continuity injection"
version: 1.0.0.1
id: plugins-and-hooks-spec-memory-plugin
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Spec Memory OpenCode Plugin

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`system-spec-memory` is the OpenCode plugin (auto-discovered by OpenCode from `.opencode/plugins/*.js`, no manual registration entry) that bridges the standalone Spec Kit Memory MCP daemon into the OpenCode chat runtime. It has two jobs:

1. `experimental.chat.system.transform` silently appends a bounded, digest-marked Spec Kit continuity brief (`[system-spec-memory:continuity:<16-hex>]`) into every model turn's `output.system` array, sourced by spawning the warm CLI bridge (`system-spec-memory-bridge.mjs`) rather than talking to the daemon directly.
2. A `system_spec_memory_status` tool exposes plugin/bridge health (cache stats, last bridge status, warm route) to the user without leaking local filesystem paths.

The bridge itself never blocks or dispatches into the daemon's mutation surface: `promptSafeSpecMemoryBridgePolicy()` in `system-spec-memory-bridge.mjs` only allows `request:"brief"`/`"status"` paired with `toolName:"session_resume"`/`"memory_health"`, and every failure path (cold daemon, timeout, oversized stdout, EPIPE) fails open with an empty `output.system` rather than throwing. A sibling continuity path exists for the Claude Code runtime as compiled hooks under `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/` (`session-prime.js`, `compact-inject.js`, `user-prompt-submit.js`, `session-stop.js`), wired directly in `.claude/settings.json`; those are a separate delivery mechanism for the same continuity substrate, not this OpenCode plugin, and are covered here only as cross-reference.

This scenario validates: the plugin loads and exports only the factory function; config load handles missing/malformed/unreadable/valid `system-spec-memory.json`; the continuity cache is stable, digest-marked, and session/TTL/race-safe; oversized bridge stdout and early-exit/EPIPE bridges fail open; the status tool's capability-boundary fields are honest; the kill-switch envs (`SYSTEM_SPEC_MEMORY_PLUGIN_DISABLED`, legacy `SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED`) actually prevent the bridge subprocess from spawning; and the real bridge script, invoked live against the current (cold) daemon, reports a truthful retryable `SOCKET_ABSENT` skip rather than a fabricated brief.

---

## 2. SCENARIO CONTRACT

- Plugin host file exists at `.opencode/plugins/system-spec-memory.js`.
- Bridge helper exists at `.opencode/skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs`.
- Warm CLI shim exists at `.opencode/bin/spec-memory.cjs` (spawned by the bridge with `--warm-only`).
- Unit test exists at `.opencode/plugins/tests/system-spec-memory.test.cjs`.
- Real user-facing trigger: a user has an OpenCode chat session open; on every turn the plugin's `system.transform` hook should quietly attach current Spec Kit continuity (or nothing, if the daemon is cold) to the model's system context, and the user (or an operator) can run the `system_spec_memory_status` tool to check whether the warm bridge is healthy.
- Expected signals: `plugin_id=system-spec-memory`, `enabled=true|false`, `disabled_reason=`, `config_status=missing|loaded|parse_error|read_error`, `runtime_ready=`, `bridge_invocations=`, `last_bridge_status=ok|skipped|fail_open`, `last_error_code=`, `warm_status=`, `warm_route=warm_probe|cli`, `warm_exit_code=75` (retryable) on a cold daemon, `continuity_recovery=per_transform_warm`, `continuity_compaction=unsupported_runtime_event`, `continuity_autosave=unsupported_runtime_event`, and an injected `output.system` entry ending in `[system-spec-memory:continuity:<16 hex chars>]` only when the bridge returns a non-empty brief.
- Pass/fail: PASS if the unit-test suite is fully green, the real bridge script (invoked directly and through the plugin factory) returns a well-formed, truthfully-labeled response for the daemon's actual live state, and the kill-switch envs prevent any bridge subprocess spawn. FAIL if the plugin fabricates a brief when the bridge fails, omits `disabled_reason`/`last_error_code`, lets a stale in-flight lookup overwrite a newer one, or the kill-switch envs are ignored.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Validate the Spec Memory OpenCode Plugin end to end against the commands below, and report a PASS or FAIL verdict with cited command output.`

```text
a user has an OpenCode chat session open; on every turn the plugin's `system.transform` hook should quietly attach current Spec Kit continuity (or nothing, if the daemon is cold) to the model's system context, and the user (or an operator) can run the `system_spec_memory_status` tool to check whether the warm bridge is healthy
```

### Commands

1. Run the shipped regression suite:

```bash
node .opencode/plugins/tests/system-spec-memory.test.cjs
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
  | node .opencode/skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs
```

Expected signals: JSON with `"status":"skipped"` (or `"ok"` if a daemon happens to be warm), `"metadata":{"route":"warm_probe"|"cli", "retryable":true|false, ...}`.

4. Invoke the real bridge script directly, requesting a continuity brief:

```bash
printf '%s' '{"request":"brief","workspaceRoot":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs
```

5. Live-invoke the plugin factory itself (real bridge script, real cache/session logic; the only substitution is the same host-only `tool` import stub the shipped unit test performs, plus a literal `BRIDGE_PATH` because `new URL(..., import.meta.url)` cannot resolve relative to a `data:` module URL):

```bash
cat > /tmp/system-spec-memory-live-check.mjs <<'SCRIPT'
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PLUGIN_PATH = path.join(ROOT, '.opencode', 'plugins', 'system-spec-memory.js');
const REAL_BRIDGE_PATH = path.join(ROOT, '.opencode', 'skills', 'system-spec-kit', 'mcp-server', 'plugin-bridges', 'system-spec-memory-bridge.mjs');
const REAL_CLI_SHIM_PATH = path.join(ROOT, '.opencode', 'bin', 'spec-memory.cjs');

const source = fs.readFileSync(PLUGIN_PATH, 'utf8')
  .replace("import { tool } from '@opencode-ai/plugin/tool';", 'const tool = (definition) => definition;')
  .replace(
    /const BRIDGE_PATH = .*?;\nconst SOURCE_PATHS = \[[\s\S]*?\n\];/,
    `const BRIDGE_PATH = ${JSON.stringify(REAL_BRIDGE_PATH)};\nconst SOURCE_PATHS = [BRIDGE_PATH, ${JSON.stringify(REAL_CLI_SHIM_PATH)}];`,
  );

const pluginModule = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const hooks = await pluginModule.default({ directory: ROOT }, {});

console.log('--- system_spec_memory_status.execute() ---');
console.log(await hooks.tool.system_spec_memory_status.execute());

console.log('\n--- experimental.chat.system.transform() ---');
const output = { system: [] };
await hooks['experimental.chat.system.transform']({ sessionID: 'live-check-session' }, output);
console.log(JSON.stringify(output, null, 2));
SCRIPT
node /tmp/system-spec-memory-live-check.mjs
```

Keep the fixture in place — step 6 re-runs the very same script, so the single teardown lives at the end of step 6.

6. Kill-switch check — re-run the same script with the disable env set and confirm the bridge subprocess never spawns, then tear the fixture down:

```bash
SYSTEM_SPEC_MEMORY_PLUGIN_DISABLED=1 node /tmp/system-spec-memory-live-check.mjs
rm /tmp/system-spec-memory-live-check.mjs
```

Expected: `enabled=false`, `disabled_reason=SYSTEM_SPEC_MEMORY_PLUGIN_DISABLED`, `bridge_invocations=0`.

7. If a live OpenCode session is available, restart OpenCode after any plugin edit and run the `system_spec_memory_status` tool directly, then compare its fields against step 5's output. If a live OpenCode session is unavailable (the common case for an automated operator), rely on steps 1, 3, 4, 5, and 6 as the evidentiary fallback and classify the live-session-only portion SKIP, naming the unavailable live OpenCode session as the blocker.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: The unit-test suite is fully green, the real bridge script (invoked directly and through the plugin factory) returns a well-formed, truthfully-labeled response for the daemon's actual live state, and the kill-switch envs prevent any bridge subprocess spawn.
- **Fail**: The plugin fabricates a brief when the bridge fails, omits `disabled_reason`/`last_error_code`, lets a stale in-flight lookup overwrite a newer one, or the kill-switch envs are ignored.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the plugin host, bridge, and core files listed in section 4 are the ones actually loaded, and that any compiled output is current.
3. Compare the observed output field by field against the expected signals in section 2, and quote the first field that disagrees.


---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- `.opencode/plugins/system-spec-memory.js`
- `.opencode/plugins/tests/system-spec-memory.test.cjs`
- `.opencode/skills/system-spec-kit/mcp-server/plugin-bridges/system-spec-memory-bridge.mjs`
- `.opencode/skills/system-spec-kit/mcp-server/plugin-bridges/spec-kit-opencode-message-schema.mjs`
- `.opencode/bin/spec-memory.cjs`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-prime.ts`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/compact-inject.ts`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/session-stop.ts`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/shared.ts`
- `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-prime.js` (compiled, wired in `.claude/settings.json`)
- `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/compact-inject.js` (compiled, wired in `.claude/settings.json`)
- `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/session-stop.js` (compiled, wired in `.claude/settings.json`)
- `.opencode/skills/system-spec-kit/mcp-server/dist/hooks/claude/user-prompt-submit.js` (compiled, wired in `.claude/settings.json`)
- `.claude/settings.json`
- `opencode.json`

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: spec-memory-plugin
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/spec-memory-plugin.md
