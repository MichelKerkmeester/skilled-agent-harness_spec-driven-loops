---
title: "MCP Route Guard"
description: "Manual scenario validating the mcp-route-guard PreToolUse routing advisory guard."
trigger_phrases:
  - "mcp-route-guard"
  - "mcp route guard"
  - "route guard"
  - "mcp routing advisory"
  - "code mode routing advisory"
version: 1.0.2.0
id: mcp-route-guard
category: plugins_and_hooks
stage: routing
expected_workflow_mode: mcp-code-mode
expected_leaf_resources: []
---

# MCP Route Guard

---

## 1. OVERVIEW

`mcp-route-guard` is a warn-only, fail-open guard that nudges an agent toward Code Mode's `call_tool_chain` whenever it is about to call an external MCP tool natively instead of through Code Mode. It ships as two thin transport adapters over one runtime-neutral core:

- OpenCode plugin adapter: `.opencode/plugins/mcp-route-guard.js` (`tool.execute.before`, appends to a bounded rotated log file, never stdout/stderr).
- Claude PreToolUse hook adapter: `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` (reads the PreToolUse JSON payload from stdin, emits `hookSpecificOutput.additionalContext`, never `permissionDecision`).

This scenario validates: the shared core + Claude-hook unit-test suite; a live invocation of the core against this repo's real `.utcp_config.json` manifest for both a routable family (ClickUp) and an unrouteable one (Webflow); the live Claude hook adapter piped real PreToolUse-shaped payloads for both cases; the kill-switch (`MCP_ROUTE_GUARD_DISABLED`) and broad-mode (`MCP_ROUTE_GUARD_BROAD_MODE`) env flags; and confirms, from real repo config, that the OpenCode plugin adapter's log-write path is currently dormant in this repo (`opencode.json` registers only internal-exempt MCP servers), so that specific path is validated through source read and the shared core's coverage rather than a live OpenCode session.

---

## 2. SCENARIO CONTRACT

- Preconditions: `.utcp_config.json` exists at the repo root with `manual_call_templates` naming `clickup_official` and no `webflow` entry (confirmed live, see Evidence). `.claude/settings.json` wires a `PreToolUse` hook with `matcher: "mcp__claude_ai_.*"` to `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs`. Node is on `PATH`.
- Real user-facing trigger: Claude Code (or OpenCode) attempts a native external MCP tool call that IS registered as a Code Mode manual, e.g. `mcp__claude_ai_ClickUp__clickup_create_task`, instead of routing it through `call_tool_chain` — exactly the violation the `mcp-code-mode` SKILL warns against.
- Orchestrator prompt: `As a manual-testing orchestrator, run the shared-core + Claude-hook unit-test suite, then live-invoke the core and the Claude PreToolUse hook against this repo's real .utcp_config.json manifest for a routable family (ClickUp) and an unrouteable one (Webflow), exercise the kill-switch (MCP_ROUTE_GUARD_DISABLED) and broad-mode (MCP_ROUTE_GUARD_BROAD_MODE) env flags, and confirm the OpenCode plugin adapter's log-write path is dormant in this repo. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: the unit test file reports `16/16 assertions passed` with exit 0; a live core call for the ClickUp shape returns `decision:"warn"` with a warning string containing `clickup_official`; a live core call for the Webflow shape returns `decision:"allow"` with zero warnings; the live Claude hook piped the ClickUp payload exits 0 and writes one JSON object with `hookSpecificOutput.hookEventName:"PreToolUse"` and an `additionalContext` string containing the advisory, with `permissionDecision` never present anywhere in stdout; the same hook piped the Webflow payload exits 0 with empty stdout; the kill-switch env flag forces empty stdout even for the ClickUp payload; the broad-mode env flag turns the Webflow (unrouteable) case into a warn carrying a "no Code Mode manual registers this family" advisory.
- Desired user-visible outcome: a concise pass/fail verdict citing the exact captured command output.
- Pass/fail: PASS if every step meets its Expected signal, FAIL if a signal is missing, a hook emits `permissionDecision` or a step exits non-zero.

---

## 3. TEST EXECUTION

### Prompt

- Orchestrator prompt: `As a manual-testing orchestrator, run the shared-core + Claude-hook unit-test suite, then live-invoke the core and the Claude PreToolUse hook against this repo's real .utcp_config.json manifest for a routable family (ClickUp) and an unrouteable one (Webflow), exercise the kill-switch (MCP_ROUTE_GUARD_DISABLED) and broad-mode (MCP_ROUTE_GUARD_BROAD_MODE) env flags, and confirm the OpenCode plugin adapter's log-write path is dormant in this repo. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Run the shared core + Claude-hook unit-test suite:

```bash
node .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

2. Live-invoke the core directly against this repo's real `.utcp_config.json` manifest for five representative tool names:

```bash
node -e "
const guardCore = require('./.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs');
const projectDir = process.cwd();
const cases = [
  'mcp__claude_ai_ClickUp__clickup_create_task',
  'mcp__claude_ai_Webflow__data_cms_tool',
  'mcp__code_mode__call_tool_chain',
  'Bash',
];
for (const toolName of cases) {
  const result = guardCore.evaluateNativeMcpCall({ toolName, projectDir });
  console.log(JSON.stringify({ toolName, decision: result.decision, warnings: result.warnings }));
}
"
```

3. Pipe a real PreToolUse-shaped payload for the routable ClickUp case into the live Claude hook (the same script `.claude/settings.json` wires for `mcp__claude_ai_.*`):

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

4. Pipe the same payload shape for the unrouteable Webflow case:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

5. Kill-switch check — expect empty stdout even for the routable ClickUp payload:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | MCP_ROUTE_GUARD_DISABLED=1 node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

6. Broad-mode check — expect a coverage warn on the otherwise-silent Webflow case:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | MCP_ROUTE_GUARD_BROAD_MODE=1 node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

7. Confirm the OpenCode plugin adapter's live wiring state by checking which MCP servers `opencode.json` registers natively:

```bash
python3 -c "import json; print(list(json.load(open('opencode.json'))['mcp'].keys()))"
```

### Expected

- Step 1: `[mcp-route-guard] 16/16 assertions passed`.
- Step 3: exit 0, one JSON object with `hookSpecificOutput.hookEventName:"PreToolUse"` and `additionalContext` naming `clickup_official`; no `permissionDecision` anywhere in stdout.
- Step 4: exit 0, empty stdout (manifest-strict default stays silent for an unrouteable family).
- Step 5: exit 0, empty stdout regardless of the routable match.
- Step 6: exit 0, one JSON object whose `additionalContext` says "no Code Mode manual registers this family".

### Runtime Boundary

The OpenCode plugin adapter (`mcp-route-guard.js`) itself has no dedicated unit test (confirmed: `.opencode/plugins/tests/` contains no `route-guard` file) and its `tool.execute.before` hook and `appendGuardLog` file-write only execute inside a live OpenCode `ctx` session. This session is a Claude Code session, not a live OpenCode TUI session, and (per step 7) `opencode.json` registers no non-exempt external MCP server to warn on even if one were available. Concrete blocker: no live OpenCode runtime context (`ctx.directory`, `tool.execute.before` dispatch) is reachable from here, so this path is recorded as `SKIP` with that blocker. Fallback evidence: the plugin adapter is an 89-line pass-through that calls the identical `guardCore.evaluateNativeMcpCall` exercised live in steps 1-2 above and only adds file-logging around the same `warnings` array the Claude hook also consumes -- read confirmed at `.opencode/plugins/mcp-route-guard.js:76-86`.

### Evidence

Capture the output and exit code of each numbered step, plus the `.utcp_config.json` manual names and the `opencode.json` server list. The blocks below show the shape of each capture.

Real `.utcp_config.json` manual names (confirms ClickUp is registered, Webflow is not):

```text
chrome_devtools_1
chrome_devtools_2
clickup_official
figma
github
gitkraken
refero
```

Unit test command and real output:

```bash
node .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

```text
[mcp-route-guard] 16/16 assertions passed
```

(exit code 0)

Live core invocation command and real output:

```bash
node -e "
const guardCore = require('./.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs');
const projectDir = process.cwd();
const cases = [
  'mcp__claude_ai_ClickUp__clickup_create_task',
  'mcp__claude_ai_Webflow__data_cms_tool',
  'mcp__code_mode__call_tool_chain',
  'Bash',
];
for (const toolName of cases) {
  const result = guardCore.evaluateNativeMcpCall({ toolName, projectDir });
  console.log(JSON.stringify({ toolName, decision: result.decision, warnings: result.warnings }));
}
"
```

```text
{"toolName":"mcp__claude_ai_ClickUp__clickup_create_task","decision":"warn","warnings":["mcp-route-guard: native call to \"claude_ai_ClickUp\" -- Code Mode can route this family via the \"clickup_official\" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the mcp-code-mode SKILL mandates."]}
{"toolName":"mcp__claude_ai_Webflow__data_cms_tool","decision":"allow","warnings":[]}
{"toolName":"mcp__code_mode__call_tool_chain","decision":"allow","warnings":[]}
{"toolName":"Bash","decision":"allow","warnings":[]}
```

Live Claude hook, routable ClickUp payload:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"mcp-route-guard: native call to \"claude_ai_ClickUp\" -- Code Mode can route this family via the \"clickup_official\" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the mcp-code-mode SKILL mandates."}}
```

(exit code 0; no `permissionDecision` in stdout)

Live Claude hook, unrouteable Webflow payload:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

```text
(empty stdout)
```

(exit code 0)

Kill-switch, routable ClickUp payload with `MCP_ROUTE_GUARD_DISABLED=1`:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | MCP_ROUTE_GUARD_DISABLED=1 node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

```text
(empty stdout)
```

(exit code 0)

Broad-mode, unrouteable Webflow payload with `MCP_ROUTE_GUARD_BROAD_MODE=1`:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | MCP_ROUTE_GUARD_BROAD_MODE=1 node .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs
```

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"mcp-route-guard: native call to \"claude_ai_Webflow\" (family \"webflow\") -- no Code Mode manual registers this family in .utcp_config.json yet; register one to make this call routable."}}
```

(exit code 0)

`opencode.json` registered MCP servers (confirms OpenCode-side dormancy):

```bash
python3 -c "import json; print(list(json.load(open('opencode.json'))['mcp'].keys()))"
```

```text
```

All five are internal-exempt tokens per `guardCore.INTERNAL_RAW_TOKENS`, so no non-exempt native external MCP server is currently registered in OpenCode for this repo.

### Pass / Fail

- **Pass**: The unit-test suite reports all assertions passed with exit 0. The live core call warns on the manifest-registered ClickUp family and allows the Webflow family, the internal-exempt servers and the non-MCP `Bash` tool. The live Claude hook emits the `additionalContext` advisory for the ClickUp payload with no `permissionDecision` anywhere in stdout and stays silent for the Webflow payload. The kill-switch flag empties stdout for the ClickUp payload and the broad-mode flag turns the Webflow payload into a coverage warn.
- **Fail**: Any of those signals is missing, a hook emits `permissionDecision` or a step exits non-zero.
- **Skip**: The live OpenCode plugin-adapter path only, with the blocker named under Runtime Boundary. It does not change the verdict of the other steps.

### Failure Triage

1. If step 1 fails: the shared core or the Claude-hook adapter changed behaviour. Read the first failing assertion before running the live steps.
2. If the ClickUp case returns `allow` or empty stdout: confirm `.utcp_config.json` names `clickup_official` in `manual_call_templates` and that `MCP_ROUTE_GUARD_DISABLED` is not set in the shell.
3. If the Webflow case warns without the broad-mode flag: confirm `.utcp_config.json` has no `webflow` entry and that `MCP_ROUTE_GUARD_BROAD_MODE` is not set in the shell.
4. If `permissionDecision` appears in any stdout: the guard stopped being warn-only, which fails the contract whatever the other steps show.
5. If step 7 lists a server outside `guardCore.INTERNAL_RAW_TOKENS`: the OpenCode plugin path is no longer dormant, so the dormancy claim under Runtime Boundary needs review.

---

## 4. SOURCE FILES

- Root playbook: `manual-testing-playbook.md`
- OpenCode plugin adapter: `.opencode/plugins/mcp-route-guard.js`
- Runtime-neutral core: `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs`
- Core + Claude-hook unit test: `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs`
- Claude PreToolUse hook adapter: `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs`
- Hook wiring: `.claude/settings.json` (`PreToolUse` matcher `mcp__claude_ai_.*`)
- Code Mode manifest consulted by the core: `.utcp_config.json`
- OpenCode native MCP registry consulted for dormancy check: `opencode.json`

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: mcp-route-guard
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: plugins-and-hooks/mcp-route-guard.md
