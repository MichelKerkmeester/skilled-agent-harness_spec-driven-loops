---
title: "CL-005 OpenCode Plugin"
description: "Manual validation for the OpenCode system-skill-advisor plugin that spawns the advisor CLI."
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
    leaf_resource_id: hooks/skill-advisor-hook.md
---

# CL-005 OpenCode Plugin

Prompt: Manual validation for the OpenCode system-skill-advisor plugin that spawns the advisor CLI.


<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the OpenCode plugin path, which spawns the advisor CLI and falls back to Python brief production when needed.

---

## 2. SCENARIO CONTRACT

- Advisor runtime build is current.
- Plugin host file exists at `.opencode/plugins/system-skill-advisor.js`.
- The plugin reaches the advisor by spawning `.opencode/bin/skill-advisor.cjs`.

---

## 3. TEST EXECUTION

1. Build the advisor runtime the CLI and daemon run from:

```bash
npm --prefix .opencode/skills/system-skill-advisor/runtime install
npm --prefix .opencode/skills/system-skill-advisor/runtime run build
```

2. Run the plugin's advisor call path directly:

```bash
node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" \
  --options '{"topK":3,"includeAttribution":false,"includeAbstainReasons":true,"confidenceThreshold":0.8,"uncertaintyThreshold":0.35}' --format json
```

3. Inspect the plugin status tool through its test (runs without an interactive OpenCode session):

```bash
npm --prefix .opencode/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts
```

### Expected Signals

- The advisor call returns JSON with `status: "ok"` or a prompt-safe fail-open status.
- Native success carries an `Advisor:` brief rendered from the CLI payload (`route: "cli"`, or `cli-local-scorer` when the daemon was unreachable).
- The payload's `effectiveThresholds` report the 014 threshold pair: `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `confidenceOnly: false`.
- The plugin spawns `.opencode/bin/skill-advisor.cjs` and never private handler paths.
- `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` (or `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` for the plugin alone) yields a disabled brief without spawning the advisor. The legacy `SPECKIT_`-prefixed names still work.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Private dist pinning | Plugin imports handler internals directly | Update the plugin to spawn the advisor CLI instead. |
| Plugin disabled unexpectedly | Status tool reports `disabled_reason` | Check env and plugin options. |
| CLI timeout | `error: "TIMEOUT"` | Inspect build and Node binary path. |

---

## 4. SOURCE FILES

- `.opencode/plugins/system-skill-advisor.js`
- `.opencode/bin/skill-advisor.cjs`
- `.opencode/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts`

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
.opencode/plugins/system-skill-advisor.js read successfully; total 1476 lines.
.opencode/bin/skill-advisor.cjs read successfully; total 116 lines.
.opencode/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js present; 15675 bytes.
.opencode/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js present; 15501 bytes.
```

Advisor CLI command (step 2), run from the repository root:

```bash
node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" \
  --options '{"topK":3,"includeAttribution":false,"includeAbstainReasons":true,"confidenceThreshold":0.8,"uncertaintyThreshold":0.35}' --format json
```

Advisor CLI output (exit code 0; response abbreviated to the routing fields):

```json
{
  "status": "ok",
  "data": {
    "freshness": "stale",
    "trustState": { "state": "stale", "reason": "advisor-server-startup-scan", "generation": 256 },
    "recommendations": [
      { "skillId": "system-spec-kit", "confidence": 0.9423, "status": "active" }
    ],
    "effectiveThresholds": { "confidenceThreshold": 0.8, "uncertaintyThreshold": 0.35, "confidenceOnly": false }
  }
}
```

The call exits 0 whether the daemon answer is `live` or `stale`; `stale` is the prompt-safe degraded result the plugin renders, not a failed run.

Plugin test command (step 3):

```bash
npm --prefix .opencode/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts
```

Plugin test output:

```text
 Test Files  1 passed (1)
      Tests  40 passed (40)
   Duration  1.93s
```

Disable-flag evidence, from the same test file selected with `-t opt-out`:

```text
 Test Files  1 passed (1)
      Tests  3 passed | 37 skipped (40)
```

The three opt-out paths are `env opt-out disables bridge invocation`, `shared hook env opt-out disables bridge invocation` and `config opt-out disables bridge invocation`. Each asserts that no advisor process is spawned and that the status tool reports `enabled=false` with the matching `disabled_reason`.

Plugin source evidence from `.opencode/plugins/system-skill-advisor.js`:

```js
const ADVISOR_CLI_PATH = fileURLToPath(new URL('../bin/skill-advisor.cjs', import.meta.url));
```

The plugin resolves the CLI by path and spawns it; it never imports a bridge harness or a private handler module.

---

## 7. PASS/FAIL

PASS

The advisor CLI call exited 0 with `status: "ok"`, the 014 threshold pair (`confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `confidenceOnly: false`) and ranked recommendations, so the CLI path the plugin spawns is live. The plugin test suite then passed 40/40, including the brief-rendering, cache, timeout, fail-open and opt-out paths, and its `-t opt-out` selection proved all three disable routes spawn no advisor process and report `enabled=false`. A `stale` trust state is the documented degraded answer, not a failed run: the plugin renders it as the prompt-safe brief.
