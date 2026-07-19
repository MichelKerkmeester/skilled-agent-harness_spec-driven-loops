---
title: "MCP Route Guard"
description: "Manual scenario validating the mk-mcp-route-guard PreToolUse routing advisory guard."
trigger_phrases:
  - "mk-mcp-route-guard"
  - "mcp route guard"
  - "route guard"
  - "mcp routing advisory"
  - "code mode routing advisory"
version: 1.0.0.0
id: mcp-route-guard
category: plugins_and_hooks
stage: routing
expected_workflow_mode: mcp-code-mode
expected_leaf_resources: []
---

# MCP Route Guard

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-mcp-route-guard` is a warn-only, fail-open guard that nudges an agent toward Code Mode's `call_tool_chain` whenever it is about to call an external MCP tool natively instead of through Code Mode. It ships as two thin transport adapters over one runtime-neutral core:

- OpenCode plugin adapter: `.opencode/plugins/mk-mcp-route-guard.js` (`tool.execute.before`, appends to a bounded rotated log file, never stdout/stderr).
- Claude PreToolUse hook adapter: `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` (reads the PreToolUse JSON payload from stdin, emits `hookSpecificOutput.additionalContext`, never `permissionDecision`).
- Shared core: `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` (`evaluateNativeMcpCall`), which parses both Claude's `mcp__<server>__<tool>` shape and OpenCode's `<server>_<tool>` shape, normalizes the server token, exempts internal MCP servers (`code_mode`, `sequential_thinking`, `mk_spec_memory`, `mk_skill_advisor`, `mk_code_index`), and consults the Code Mode manifest (`.utcp_config.json`, mtime-cached) for a matching family. The only two decisions this core can ever return are `allow` and `warn`; every error path (missing manifest, unparsable manifest, malformed tool name, unexpected internal error) fails open to `allow`.

This scenario validates: the shared core + Claude-hook unit-test suite; a live invocation of the core against this repo's real `.utcp_config.json` manifest for both a routable family (ClickUp) and an unrouteable one (Webflow); the live Claude hook adapter piped real PreToolUse-shaped payloads for both cases; the kill-switch (`MK_MCP_ROUTE_GUARD_DISABLED`) and broad-mode (`MK_MCP_ROUTE_GUARD_BROAD_MODE`) env flags; and confirms, from real repo config, that the OpenCode plugin adapter's log-write path is currently dormant in this repo (`opencode.json` registers only internal-exempt MCP servers), so that specific path is validated through source read and the shared core's coverage rather than a live OpenCode session.

---

## 2. SCENARIO CONTRACT

- Preconditions: `.utcp_config.json` exists at the repo root with `manual_call_templates` naming `clickup_official` and no `webflow` entry (confirmed live, see Evidence). `.claude/settings.json` wires a `PreToolUse` hook with `matcher: "mcp__claude_ai_.*"` to `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs`. Node is on `PATH`.
- Real user-facing trigger: Claude Code (or OpenCode) attempts a native external MCP tool call that IS registered as a Code Mode manual, e.g. `mcp__claude_ai_ClickUp__clickup_create_task`, instead of routing it through `call_tool_chain` — exactly the violation the `mcp-code-mode` SKILL warns against.
- Expected signals: the unit test file reports `16/16 assertions passed` with exit 0; a live core call for the ClickUp shape returns `decision:"warn"` with a warning string containing `clickup_official`; a live core call for the Webflow shape returns `decision:"allow"` with zero warnings; the live Claude hook piped the ClickUp payload exits 0 and writes one JSON object with `hookSpecificOutput.hookEventName:"PreToolUse"` and an `additionalContext` string containing the advisory, with `permissionDecision` never present anywhere in stdout; the same hook piped the Webflow payload exits 0 with empty stdout; the kill-switch env flag forces empty stdout even for the ClickUp payload; the broad-mode env flag turns the Webflow (unrouteable) case into a warn carrying a "no Code Mode manual registers this family" advisory.
- Desired user-visible outcome: a concise pass/fail verdict citing the exact captured command output.
- Pass/fail: PASS if all signals above hold from real captured output and internal servers (`code_mode`, `mk_code_index`, `sequential_thinking`) never warn. FAIL if any unit assertion fails, if the hook ever emits `permissionDecision`, if a manifest-registered family fails to warn, if an internal server is warned on, or if a missing/malformed manifest throws instead of failing open to `allow`.

---

## 3. TEST EXECUTION

### Commands

1. Run the shared core + Claude-hook unit-test suite:

```bash
node .opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs
```

2. Live-invoke the core directly against this repo's real `.utcp_config.json` manifest for five representative tool names:

```bash
node -e "
const guardCore = require('./.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs');
const projectDir = process.cwd();
const cases = [
  'mcp__claude_ai_ClickUp__clickup_create_task',
  'mcp__claude_ai_Webflow__data_cms_tool',
  'mcp__code_mode__call_tool_chain',
  'mcp__mk_code_index__code_graph_query',
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
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
```

4. Pipe the same payload shape for the unrouteable Webflow case:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
```

5. Kill-switch check — expect empty stdout even for the routable ClickUp payload:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | MK_MCP_ROUTE_GUARD_DISABLED=1 node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
```

6. Broad-mode check — expect a coverage warn on the otherwise-silent Webflow case:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | MK_MCP_ROUTE_GUARD_BROAD_MODE=1 node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
```

7. Confirm the OpenCode plugin adapter's live wiring state by checking which MCP servers `opencode.json` registers natively:

```bash
python3 -c "import json; print(list(json.load(open('opencode.json'))['mcp'].keys()))"
```

### Expected

- Step 1: `[mcp-route-guard] 16/16 assertions passed`.
- Step 2: ClickUp -> `decision:"warn"` with a warning naming `clickup_official`; Webflow, code_mode, mk_code_index, Bash -> `decision:"allow"` with `warnings:[]`.
- Step 3: exit 0, one JSON object with `hookSpecificOutput.hookEventName:"PreToolUse"` and `additionalContext` naming `clickup_official`; no `permissionDecision` anywhere in stdout.
- Step 4: exit 0, empty stdout (manifest-strict default stays silent for an unrouteable family).
- Step 5: exit 0, empty stdout regardless of the routable match.
- Step 6: exit 0, one JSON object whose `additionalContext` says "no Code Mode manual registers this family".
- Step 7: only internal-exempt tokens are registered (`sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`) -- confirms no native external MCP server exists in `opencode.json` today, so the OpenCode plugin's `tool.execute.before` log-write path is dormant in this repo (matches the plugin's own header comment).

### Runtime Boundary (UNAUTOMATABLE)

The OpenCode plugin adapter (`mk-mcp-route-guard.js`) itself has no dedicated unit test (confirmed: `.opencode/plugins/tests/` contains no `route-guard` file) and its `tool.execute.before` hook and `appendGuardLog` file-write only execute inside a live OpenCode `ctx` session. This session is a Claude Code session, not a live OpenCode TUI session, and (per step 7) `opencode.json` registers no non-exempt external MCP server to warn on even if one were available. Concrete blocker: no live OpenCode runtime context (`ctx.directory`, `tool.execute.before` dispatch) is reachable from here. Fallback evidence: the plugin adapter is an 89-line pass-through that calls the identical `guardCore.evaluateNativeMcpCall` exercised live in steps 1-2 above and only adds file-logging around the same `warnings` array the Claude hook also consumes -- read confirmed at `.opencode/plugins/mk-mcp-route-guard.js:76-86`.

---

## 4. EVIDENCE

Real `.utcp_config.json` manual names (confirms ClickUp is registered, Webflow is not):

```text
chrome_devtools_1
chrome_devtools_2
clickup_official
figma
github
gitkraken
open_design
refero
```

Unit test command and real output:

```bash
node .opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs
```

```text
[mcp-route-guard] 16/16 assertions passed
```

(exit code 0)

Live core invocation command and real output:

```bash
node -e "
const guardCore = require('./.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs');
const projectDir = process.cwd();
const cases = [
  'mcp__claude_ai_ClickUp__clickup_create_task',
  'mcp__claude_ai_Webflow__data_cms_tool',
  'mcp__code_mode__call_tool_chain',
  'mcp__mk_code_index__code_graph_query',
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
{"toolName":"mcp__mk_code_index__code_graph_query","decision":"allow","warnings":[]}
{"toolName":"Bash","decision":"allow","warnings":[]}
```

Live Claude hook, routable ClickUp payload:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
```

```json
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"mcp-route-guard: native call to \"claude_ai_ClickUp\" -- Code Mode can route this family via the \"clickup_official\" manual (call_tool_chain); route through Code Mode for the ~98% context reduction the mcp-code-mode SKILL mandates."}}
```

(exit code 0; no `permissionDecision` in stdout)

Live Claude hook, unrouteable Webflow payload:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
```

```text
(empty stdout)
```

(exit code 0)

Kill-switch, routable ClickUp payload with `MK_MCP_ROUTE_GUARD_DISABLED=1`:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_ClickUp__clickup_create_task","tool_input":{},"cwd":"'"$PWD"'"}' | MK_MCP_ROUTE_GUARD_DISABLED=1 node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
```

```text
(empty stdout)
```

(exit code 0)

Broad-mode, unrouteable Webflow payload with `MK_MCP_ROUTE_GUARD_BROAD_MODE=1`:

```bash
printf '%s' '{"tool_name":"mcp__claude_ai_Webflow__data_cms_tool","tool_input":{},"cwd":"'"$PWD"'"}' | MK_MCP_ROUTE_GUARD_BROAD_MODE=1 node .opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs
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
['sequential_thinking', 'mk-spec-memory', 'mk_skill_advisor', 'mk_code_index', 'code_mode']
```

All five are internal-exempt tokens per `guardCore.INTERNAL_RAW_TOKENS`, so no non-exempt native external MCP server is currently registered in OpenCode for this repo.

---

## 5. SOURCE FILES

- OpenCode plugin adapter: `.opencode/plugins/mk-mcp-route-guard.js`
- Runtime-neutral core: `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs`
- Core + Claude-hook unit test: `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs`
- Claude PreToolUse hook adapter: `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs`
- Hook wiring: `.claude/settings.json` (`PreToolUse` matcher `mcp__claude_ai_.*`)
- Code Mode manifest consulted by the core: `.utcp_config.json`
- OpenCode native MCP registry consulted for dormancy check: `opencode.json`

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: mcp-route-guard
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/mcp-route-guard.md

---

## 7. PASS/FAIL

**PASS**

The 16-assertion unit-test suite passed 16/16 with exit 0. The live core invocation against this repo's real `.utcp_config.json` manifest correctly warned on the manifest-registered ClickUp family and allowed the unregistered Webflow family plus all three internal-exempt servers and a non-MCP `Bash` tool. The live Claude PreToolUse hook adapter, run exactly as `.claude/settings.json` wires it, emitted the expected `additionalContext` advisory (never `permissionDecision`) for the routable case and stayed silent for the unrouteable case. The kill-switch env flag suppressed the advisory and the broad-mode env flag correctly turned the unrouteable case into a coverage warn. One path is out of reach from this session: the OpenCode plugin adapter's own `tool.execute.before` log-write is UNAUTOMATABLE here because there is no live OpenCode TUI runtime context and `opencode.json` registers no non-exempt external MCP server today (confirmed live) -- that path is covered only by source read plus the shared core's identical, live-tested `evaluateNativeMcpCall` logic.
