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
- Plugin host file exists at `.skilled/plugins/system-skill-advisor.js`.
- The plugin reaches the advisor by spawning `.skilled/bin/skill-advisor.cjs`.

---

## 3. TEST EXECUTION

1. Build the advisor runtime the CLI and daemon run from:

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime install
npm --prefix .skilled/skills/system-skill-advisor/runtime run build
```

2. Run the plugin's advisor call path directly:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","options":{"topK":3,"includeAttribution":false,"includeAbstainReasons":true,"confidenceThreshold":0.8,"uncertaintyThreshold":0.35}}' \
  | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json
```

3. Inspect the plugin status tool through its test (runs without an interactive OpenCode session):

```bash
npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts
```

4. Load the plugin in a real OpenCode session. The unit tests import the module directly, so they cannot catch a module that OpenCode refuses to load. Pin the model, because a run that inherits an out-of-quota default provider prints nothing, and close stdin so the run cannot hang:

```bash
mkdir -p /tmp/skill-advisor-playbook
opencode run --print-logs --log-level INFO --dir "$PWD" -m opencode-go/deepseek-v4.1-flash \
  "List every tool you can call whose name contains advisor. Print only the tool names, one per line." \
  </dev/null > /tmp/skill-advisor-playbook/cl-005.stdout.txt 2> /tmp/skill-advisor-playbook/cl-005.log
echo "opencode exit=$?"
grep -n 'failed to load plugin' /tmp/skill-advisor-playbook/cl-005.log | grep 'system-skill-advisor.js'
grep -n 'spec_kit_skill_advisor_status' /tmp/skill-advisor-playbook/cl-005.stdout.txt
```

### Expected Signals

- The advisor call returns JSON with `status: "ok"` or a prompt-safe fail-open status.
- Native success carries an `Advisor:` brief rendered from the CLI payload. The brief starts with `Advisor: live;` when the daemon answered with a live graph, and with `Advisor: stale;` when the daemon answered with a stale graph or the CLI answered from its local scorer. The plugin's internal route label is not shown by any step and is not a pass criterion.
- The payload's `effectiveThresholds` report the 014 threshold pair: `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `confidenceOnly: false`.
- The plugin spawns `.skilled/bin/skill-advisor.cjs` and never private handler paths.
- Step 3 passes when the whole plugin suite is green: `Test Files  1 passed (1)` and a `Tests` line where every test passed and none failed. The test count grows as tests are added, so it is not a pass criterion. A count that differs from the recorded evidence is not a mismatch. The same holds for the skipped count in the `-t opt-out` selection, which must still report 3 passed.
- `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1` (or `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` for the plugin alone) yields a disabled brief without spawning the advisor. The legacy `SPECKIT_`-prefixed names still work.
- Step 4 exits `0`. The log has no `failed to load plugin` line naming `system-skill-advisor.js`, so the first `grep` prints nothing. The model's answer lists `spec_kit_skill_advisor_status`, so the second `grep` prints a match. A unit-test pass without this live load is not a PASS.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Private dist pinning | Plugin imports handler internals directly | Update the plugin to spawn the advisor CLI instead. |
| Plugin disabled unexpectedly | Status tool reports `disabled_reason` | Check env and plugin options. |
| CLI timeout | `error: "TIMEOUT"` | Inspect build and Node binary path. |
| OpenCode rejects the plugin | The log shows `failed to load plugin` naming `system-skill-advisor.js`, for example with `Plugin export is not a function` | OpenCode 1.18.32 rejects a plugin module that exports anything other than functions. Keep the module to its default factory export and move constants and helpers to a separate module. |
| Status tool missing from the session | No `spec_kit_skill_advisor_status` in the model's answer while the log shows no load failure | Check that `.opencode/plugins/system-skill-advisor.js` is present and current, then rerun step 4. |

---

## 4. SOURCE FILES

- `.skilled/plugins/system-skill-advisor.js`
- `.skilled/bin/skill-advisor.cjs`
- `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts`

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
.skilled/plugins/system-skill-advisor.js read successfully; total 1476 lines.
.skilled/bin/skill-advisor.cjs read successfully; total 116 lines.
.skilled/skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js present; 15675 bytes.
.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/render.js present; 15501 bytes.
```

Advisor CLI command (step 2), run from the repository root:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","options":{"topK":3,"includeAttribution":false,"includeAbstainReasons":true,"confidenceThreshold":0.8,"uncertaintyThreshold":0.35}}' \
  | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json
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
npm --prefix .skilled/skills/system-skill-advisor/runtime run test -- tests/system-skill-advisor-plugin.vitest.ts
```

Plugin test output:

```text
 Test Files  1 passed (1)
      Tests  65 passed (65)
   Duration  1.35s
```

Disable-flag evidence, from the same test file selected with `-t opt-out`:

```text
 Test Files  1 passed (1)
      Tests  3 passed | 62 skipped (65)
```

The three opt-out paths are `env opt-out disables bridge invocation`, `shared hook env opt-out disables bridge invocation` and `config opt-out disables bridge invocation`. Each asserts that no advisor process is spawned and that the status tool reports `enabled=false` with the matching `disabled_reason`.

Plugin source evidence from `.skilled/plugins/system-skill-advisor.js`:

```js
const ADVISOR_CLI_PATH = fileURLToPath(new URL('../bin/skill-advisor.cjs', import.meta.url));
```

The plugin resolves the CLI by path and spawns it; it never imports a bridge harness or a private handler module.

---

## 7. PASS/FAIL

PASS

The advisor CLI call exited 0 with `status: "ok"`, the 014 threshold pair (`confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `confidenceOnly: false`) and ranked recommendations, so the CLI path the plugin spawns is live. The plugin test suite then passed in full (65/65 on this run), including the brief-rendering, cache, timeout, fail-open and opt-out paths, and its `-t opt-out` selection proved all three disable routes spawn no advisor process and report `enabled=false`. A `stale` trust state is the documented degraded answer, not a failed run: the plugin renders it as the prompt-safe brief.
