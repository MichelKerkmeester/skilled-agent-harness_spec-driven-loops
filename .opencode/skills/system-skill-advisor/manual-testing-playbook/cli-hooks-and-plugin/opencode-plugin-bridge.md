---
title: "CL-005 OpenCode Plugin Bridge"
description: "Manual validation for the OpenCode mk-skill-advisor plugin and bridge."
trigger_phrases:
  - "cl-005"
  - "opencode plugin bridge"
  - "opencode plugin"
  - "opencode"
version: 0.8.0.17
id: CL-005
category: cli_hooks_and_plugin
stage: routing
expected_workflow_mode: system-skill-advisor
expected_leaf_resources:
  - workflow_mode: system-skill-advisor
    leaf_resource_id: references/hooks/skill-advisor-hook.md
---

# CL-005 OpenCode Plugin Bridge

Prompt: Manual validation for the OpenCode mk-skill-advisor plugin and bridge.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the OpenCode plugin path that delegates through the stable native compat entrypoint, then falls back to Python brief production when needed.

---

## 2. SCENARIO CONTRACT

- MCP server build is current.
- Plugin host file exists at `.opencode/plugins/mk-skill-advisor.js`.
- Bridge helper exists at `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`.

---

## 3. TEST EXECUTION

1. Build:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
```

2. Run bridge directly:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | node .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
```

3. Inspect plugin status tool in OpenCode, when available:

```text
spec_kit_skill_advisor_status({})
```

### Expected Signals

- Bridge returns JSON with `status: "ok"` or prompt-safe fail-open status.
- Native success has `metadata.route: "native"` and an `Advisor:` brief.
- Success metadata reports the 014 threshold pair: `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `confidenceOnly: false`.
- Bridge imports `.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/compat/index.js`, not private handler paths.
- Disable flag returns a disabled brief or skipped state without invoking the native path.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Private dist pinning | Bridge imports handler internals directly | Update bridge to use `compat/index.ts` after code approval. |
| Plugin disabled unexpectedly | Status tool reports `disabled_reason` | Check env and plugin options. |
| Bridge timeout | `error: "TIMEOUT"` | Inspect build and Node binary path. |

---

## 4. SOURCE FILES

- `.opencode/plugins/mk-skill-advisor.js`
- `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`
- `.opencode/skills/system-skill-advisor/mcp-server/compat/index.ts`

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-005
- Canonical root source: manual-testing-playbook.md
- Feature file path: cli-hooks-and-plugin/opencode-plugin-bridge.md

---

## 6. EVIDENCE

Preconditions observed:

```text
.opencode/plugins/mk-skill-advisor.js read successfully; total 747 lines.
.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs read successfully; total 935 lines.
.opencode/skills/system-skill-advisor/mcp-server/compat/index.ts read successfully; total 9 lines.
```

Build command:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
```

Build output:

```text
> @spec-kit/mcp-server@1.8.0 build
> tsc --build && node scripts/finalize-dist.mjs
```

Bridge command:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | node .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
```

Bridge output:

```json
{"brief":null,"status":"skipped","metadata":{"route":"native","workspaceRoot":"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public","effectiveThresholds":{"confidenceThreshold":0.8,"uncertaintyThreshold":0.35,"confidenceOnly":false},"freshness":"unavailable","generation":9476,"cacheHit":false,"recommendationCount":0,"tokenCap":80,"skillLabel":null,"status":null,"redirectTo":null,"redirectFrom":[]}}
```

OpenCode status tool command:

```text
spec_kit_skill_advisor_status({})
```

OpenCode status tool output:

```text
plugin_id=mk-skill-advisor
enabled=true
disabled_reason=none
cache_ttl_ms=300000
threshold_confidence=0.8
max_tokens=80
max_prompt_bytes=65536
max_brief_chars=2048
max_cache_entries=1000
runtime_ready=true
node_binary=node
bridge_timeout_ms=10000
bridge_path=[skill-advisor-bridge]
last_bridge_status=skipped
last_runtime_status=skipped
last_error_code=none
last_runtime_error=none
last_duration_ms=453
bridge_invocations=8
advisor_lookups=8
cache_entries=0
cache_hits=0
cache_misses=8
cache_hit_rate=0
```

Bridge import path evidence from `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs`:

```js
const compat = await import(new URL('../dist/mcp-server/compat/index.js', import.meta.url));
```

Disable flag contract evidence from `.opencode/skills/system-skill-advisor/mcp-server/schemas/compat-contract.json`:

```json
{
  "statusValues": ["ok", "skipped", "degraded", "fail_open"],
  "disabledEnv": "SPECKIT_SKILL_ADVISOR_HOOK_DISABLED",
  "forceLocalEnv": "SPECKIT_SKILL_ADVISOR_FORCE_LOCAL",
  "defaults": {
    "confidenceThreshold": 0.8,
    "uncertaintyThreshold": 0.35
  }
}
```

Disabled bridge command:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs
```

Disabled bridge output:

```json
{"brief":null,"status":"skipped","metadata":{"route":"disabled","freshness":"unavailable","recommendationCount":0}}
```

---

## 7. PASS/FAIL

FAIL

The bridge preconditions and build succeeded, the bridge imported `../dist/mcp-server/compat/index.js`, threshold metadata matched `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, and `confidenceOnly: false`, and the disable flag returned a skipped disabled route. However, the direct bridge invocation returned `status:"skipped"`, `brief:null`, `freshness:"unavailable"`, and did not produce an `Advisor:` brief, so the native success expected signal did not hold.
