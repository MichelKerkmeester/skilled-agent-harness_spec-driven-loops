---
title: "CM-027 -- MCP Route Guard conversation follow-up"
description: "This scenario validates the MCP Route Guard conversation follow-up for `CM-027` across Claude Code, OpenCode and Pi when a native ClickUp MCP server is configured."
id: CM-027
version: 1.1.0.0
---

# CM-027 -- MCP Route Guard conversation follow-up

This document captures the live conversation contract, execution flow, source anchors and metadata for `CM-027`.

---

## 1. OVERVIEW

This scenario validates the `mcp-route-guard` advisory and the follow-up Code Mode call for `CM-027`.

### Why This Matters

The companion command-level scenario checks the shared core and runtime adapters in isolation. This conversation scenario checks the guard signal in a live runtime session, then verifies the next user turn calls Code Mode for the same read-only ClickUp lookup.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-027` and confirm the expected signals without contradictory evidence.

- Objective: Verify that a native ClickUp teams call produces the route guard advisory when the runtime has a native ClickUp MCP server, then verify that the follow-up request uses Code Mode's `call_tool_chain` tool.
- Real user request: `I need a read-only list of my ClickUp teams.`
- Prompt: `I need a read-only list of my ClickUp teams.`
- Expected execution process: The runtime handles the read-only teams request. If it attempts a native ClickUp tool call, its MCP Route Guard adapter surfaces or records an advisory. The operator then repeats the request in a second turn. Setup skips OpenCode or Pi when its copied project config has no native ClickUp MCP server.
- Expected signals: Turn 1: Claude Code's transcript records the native ClickUp `PreToolUse` entry and the `mcp-route-guard` advisory naming `clickup_official`; OpenCode's session transcript records the native ClickUp tool call and its scratch `.skilled/logs/mcp-route-guard.log` records the advisory; Pi's session transcript records an actual native `mcp_*` ClickUp tool call and the returned advisory. Turn 2: each runtime's transcript records a Code Mode `call_tool_chain` tool call after the echoed follow-up request. No team, task or other ClickUp data is changed.
- Desired user-visible outcome: The runtime reports the ClickUp team names from a read-only lookup.
- Pass/fail: PASS if turn 1 confirms the native ClickUp call and the runtime-specific advisory evidence, turn 2 confirms a Code Mode `call_tool_chain` call after the follow-up, and the lookup remains read-only. FAIL if the native call or advisory is missing, the follow-up does not use Code Mode, or any data is changed. SKIP when setup finds a required repository skill, runtime project config, Code Mode config, native ClickUp MCP server, active `clickup_official` manual, login or network access missing, so no subject starts.

### Preconditions

- `.utcp_config.json` contains an active `clickup_official` manual, and the runtime has login plus network access for the read-only lookup.
- The runtime has a native ClickUp teams MCP tool so its guard adapter can observe the first call attempt. Claude setup confirms its account connector with `claude mcp list`; OpenCode requires a ClickUp server in `opencode.json`, and Pi requires one in `.pi/mcp.json`. A Code Mode `clickup_official` manual alone does not provide a native tool for this check.
- The scenario runs from a fresh scratch project outside the repository. Setup skips the runtime before the subject starts when a required skill, runtime config, Code Mode MCP config, native ClickUp MCP server, login or network precondition is missing. It copies `.claude/` and `.mcp.json` for Claude Code, `opencode.json` and `.opencode/` for OpenCode, or `.pi/` for Pi, along with `.skilled/` and `.utcp_config.json`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I need a read-only list of my ClickUp teams.`

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode",
    "pi"
  ],
  "setup": [
    "if [ ! -f \"$CONVERSATION_REPO_ROOT/.skilled/skills/mcp-code-mode/SKILL.md\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.utcp_config.json\" ] || ! node -e \"const fs=require('fs');const j=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));process.exit((j.manual_call_templates||[]).some(x=>x.name==='clickup_official'&&!x.disabled)?0:1)\" \"$CONVERSATION_REPO_ROOT/.utcp_config.json\" >/dev/null 2>&1; then printf '%s\\n' 'repository skills or active clickup_official manual are missing'; exit 77; fi",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) if [ ! -f \"$CONVERSATION_REPO_ROOT/.claude/settings.json\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.mcp.json\" ] || ! grep -Fq '\"code_mode\"' \"$CONVERSATION_REPO_ROOT/.mcp.json\"; then printf '%s\\n' 'Claude project or Code Mode MCP configuration is unavailable'; exit 77; fi; if ! command -v claude >/dev/null 2>&1; then printf '%s\\n' 'Claude Code CLI is unavailable'; exit 77; fi; if ! claude mcp list 2>&1 | grep -Fqi clickup; then printf '%s\\n' 'Claude Code lists no ClickUp MCP server'; exit 77; fi; auth_status=$(claude auth status 2>&1 || true); if printf '%s\\n' \"$auth_status\" | grep -Eiq 'not[[:space:]]+(authenticated|logged in)|unauthenticated|authenticated[^[:alnum:]]+false|logged[[:space:]]+in[^[:alnum:]]+false|401|login required'; then printf '%s\\n' 'Claude Code login is unavailable'; exit 77; elif ! printf '%s\\n' \"$auth_status\" | grep -Eiq 'authenticated|logged in|oauth|setup-token'; then printf '%s\\n' 'Claude Code login status is unreadable'; exit 77; fi ;; opencode) if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.opencode/plugins/mcp-route-guard.js\" ] || ! grep -Fq '\"code_mode\"' \"$CONVERSATION_REPO_ROOT/opencode.json\"; then printf '%s\\n' 'OpenCode project or Code Mode MCP configuration is unavailable'; exit 77; fi; if ! node -e \"const fs=require('fs');const j=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));process.exit(Object.keys(j.mcp||{}).some(n=>/click.?up/i.test(n))?0:1)\" \"$CONVERSATION_REPO_ROOT/opencode.json\" >/dev/null 2>&1; then printf '%s\\n' 'OpenCode has no native ClickUp MCP server for route-guard coverage'; exit 77; fi; if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'OpenCode CLI is unavailable'; exit 77; fi; if ! command -v sqlite3 >/dev/null 2>&1; then printf '%s\\n' 'sqlite3 is required to inspect OpenCode session evidence'; exit 77; fi; AUTH_ROOT=\"$XDG_DATA_HOME\"; if [ -z \"$AUTH_ROOT\" ]; then AUTH_ROOT=\"$HOME/.local/share\"; fi; if [ ! -f \"$AUTH_ROOT/opencode/auth.json\" ] || ! grep -Fq '\"llmgateway\"' \"$AUTH_ROOT/opencode/auth.json\"; then printf '%s\\n' 'OpenCode llmgateway login is unavailable'; exit 77; fi; if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi ;; pi) if [ ! -f \"$CONVERSATION_REPO_ROOT/.pi/mcp.json\" ] || [ ! -f \"$CONVERSATION_REPO_ROOT/.pi/extensions/mcp-route-guard.ts\" ] || ! grep -Fq '\"code_mode\"' \"$CONVERSATION_REPO_ROOT/.pi/mcp.json\"; then printf '%s\\n' 'Pi project or Code Mode MCP configuration is unavailable'; exit 77; fi; if ! node -e \"const fs=require('fs');const j=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));process.exit(Object.keys(j.mcpServers||{}).some(n=>/click.?up/i.test(n))?0:1)\" \"$CONVERSATION_REPO_ROOT/.pi/mcp.json\" >/dev/null 2>&1; then printf '%s\\n' 'Pi has no native ClickUp MCP server for route-guard coverage'; exit 77; fi; if ! command -v pi >/dev/null 2>&1; then printf '%s\\n' 'Pi CLI is unavailable'; exit 77; fi; PI_AGENT_DIR=\"$PI_CODING_AGENT_DIR\"; if [ -z \"$PI_AGENT_DIR\" ]; then PI_AGENT_DIR=\"$HOME/.pi/agent\"; fi; if [ ! -s \"$PI_AGENT_DIR/auth.json\" ] && ! env | grep -q '_API_KEY=.'; then printf '%s\\n' 'Pi login unavailable: no auth.json or provider API key'; exit 77; fi; if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi ;; *) printf '%s\\n' 'unsupported conversation runtime'; exit 77 ;; esac",
    "if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://mcp.clickup.com/mcp >/dev/null 2>&1; then printf '%s\\n' 'ClickUp MCP network access is unavailable'; exit 77; fi",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude && cp \"$CONVERSATION_REPO_ROOT/.mcp.json\" .mcp.json && cp \"$CONVERSATION_REPO_ROOT/.utcp_config.json\" .utcp_config.json ;; opencode) cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode && cp \"$CONVERSATION_REPO_ROOT/opencode.json\" opencode.json && cp \"$CONVERSATION_REPO_ROOT/.utcp_config.json\" .utcp_config.json ;; pi) cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled && cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi && cp \"$CONVERSATION_REPO_ROOT/.utcp_config.json\" .utcp_config.json && printf '%s\\n' \"$(pwd -P)\" > .pi-route-guard-marker ;; esac"
  ],
  "turns": [
    {
      "id": "native-clickup-advisory",
      "send": "I need a read-only list of my ClickUp teams.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}([Ff]older|[Ss]cope)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "select": [
              "D) Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}([Ff]older|[Ss]cope)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        },
        {
          "match": "Allow OpenCode to search the web",
          "answer": {
            "select": [
              "3. Disable web search"
            ]
          },
          "optional": true
        }
      ],
      "check": "case \"$CONVERSATION_RUNTIME\" in claude-code) T=\"$HOME/.claude/projects/$(pwd -P | sed 's|[^A-Za-z0-9]|-|g')\"; S=$(ls -t \"$T\"/*.jsonl 2>/dev/null | head -1); if [ -z \"$S\" ]; then printf '%s\\n' 'no Claude session transcript under ~/.claude/projects records this scratch project'; exit 1; fi; cp \"$S\" \"$CONVERSATION_TURN_DIR/transcript.jsonl\"; if ! grep -Fq '\"hookName\":\"PreToolUse:mcp__claude_ai_ClickUp__' \"$S\"; then printf '%s\\n' 'the transcript records no native ClickUp tool call'; exit 1; fi; if ! grep -Fq 'mcp-route-guard: native call to' \"$S\" || ! grep -Fq 'clickup_official' \"$S\"; then printf '%s\\n' 'the transcript records no mcp-route-guard advisory naming clickup_official'; exit 1; fi ;; opencode) P=$(pwd -P); DB=\"$HOME/.local/share/opencode/opencode.db\"; if [ ! -r \"$DB\" ]; then printf '%s\\n' 'OpenCode session database is unavailable'; exit 1; fi; PS=$(printf '%s' \"$P\" | sed \"s/'/''/g\"); S=$(sqlite3 -readonly -noheader \"$DB\" \"SELECT m.data FROM session_v2 AS s JOIN session_message AS m ON m.session_id=s.id WHERE s.directory='$PS' ORDER BY m.time_created;\" 2>/dev/null); if [ -z \"$S\" ]; then printf '%s\\n' 'no OpenCode session transcript records this scratch project'; exit 1; fi; printf '%s\\n' \"$S\" > \"$CONVERSATION_TURN_DIR/transcript.jsonl\"; if ! printf '%s\\n' \"$S\" | grep -Eiq '\"(name|tool|toolName)\"[[:space:]]*:[[:space:]]*\"[^\"]*(clickup|click_up)'; then printf '%s\\n' 'the OpenCode transcript records no native ClickUp tool call'; exit 1; fi; G=\"$P/.skilled/logs/mcp-route-guard.log\"; if [ ! -f \"$G\" ] || ! grep -Fq 'mcp-route-guard: native call to' \"$G\" || ! grep -Fq 'clickup_official' \"$G\"; then printf '%s\\n' 'the OpenCode route-guard log records no advisory naming clickup_official'; exit 1; fi ;; pi) P=$(cat .pi-route-guard-marker); D=\"$HOME/.pi/agent/sessions\"; S=$(find \"$D\" -type f -name '*.jsonl' -newer .pi-route-guard-marker -exec grep -lF \"$P\" {} + 2>/dev/null | head -1); if [ -z \"$S\" ]; then printf '%s\\n' 'no Pi session transcript newer than the marker records this scratch project'; exit 1; fi; cp \"$S\" \"$CONVERSATION_TURN_DIR/transcript.jsonl\"; if ! grep -Eiq '\"name\"[[:space:]]*:[[:space:]]*\"mcp_[^\"]*(clickup|click_up)' \"$S\"; then printf '%s\\n' 'the Pi transcript records no native ClickUp tool call'; exit 1; fi; if ! grep -Fq 'mcp-route-guard: native call to' \"$S\" || ! grep -Fq 'clickup_official' \"$S\"; then printf '%s\\n' 'the Pi transcript records no mcp-route-guard advisory naming clickup_official'; exit 1; fi ;; esac; echo 'native_call=clickup advisory=clickup_official'"
    },
    {
      "id": "code-mode-follow-up",
      "send": "Now finish the same read-only ClickUp teams lookup.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}([Ff]older|[Ss]cope)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "select": [
              "D) Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}([Ff]older|[Ss]cope)|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        },
        {
          "match": "Allow OpenCode to search the web",
          "answer": {
            "select": [
              "3. Disable web search"
            ]
          },
          "optional": true
        }
      ],
      "check": "case \"$CONVERSATION_RUNTIME\" in claude-code) T=\"$HOME/.claude/projects/$(pwd -P | sed 's|[^A-Za-z0-9]|-|g')\"; S=$(ls -t \"$T\"/*.jsonl 2>/dev/null | head -1); if [ -z \"$S\" ]; then printf '%s\\n' 'no Claude session transcript under ~/.claude/projects records this scratch project'; exit 1; fi; cp \"$S\" \"$CONVERSATION_TURN_DIR/transcript.jsonl\"; L=$(grep -nF '\"type\":\"user\"' \"$S\" | grep -F 'Now finish the same read-only ClickUp teams lookup.' | head -1 | cut -d: -f1); if [ -z \"$L\" ]; then printf '%s\\n' 'the transcript records no user turn for the follow-up request'; exit 1; fi; if ! tail -n +\"$L\" \"$S\" | grep -Eq '\"name\"[[:space:]]*:[[:space:]]*\"mcp__code_mode__call_tool_chain\"'; then printf '%s\\n' 'no Code Mode call_tool_chain tool call follows the echoed follow-up request'; exit 1; fi ;; opencode) P=$(pwd -P); DB=\"$HOME/.local/share/opencode/opencode.db\"; if [ ! -r \"$DB\" ]; then printf '%s\\n' 'OpenCode session database is unavailable'; exit 1; fi; PS=$(printf '%s' \"$P\" | sed \"s/'/''/g\"); S=$(sqlite3 -readonly -noheader \"$DB\" \"SELECT m.data FROM session_v2 AS s JOIN session_message AS m ON m.session_id=s.id WHERE s.directory='$PS' ORDER BY m.time_created;\" 2>/dev/null); if [ -z \"$S\" ]; then printf '%s\\n' 'no OpenCode session transcript records this scratch project'; exit 1; fi; printf '%s\\n' \"$S\" > \"$CONVERSATION_TURN_DIR/transcript.jsonl\"; L=$(printf '%s\\n' \"$S\" | grep -nF 'Now finish the same read-only ClickUp teams lookup.' | tail -1 | cut -d: -f1); if [ -z \"$L\" ]; then printf '%s\\n' 'the OpenCode transcript records no follow-up request'; exit 1; fi; if ! printf '%s\\n' \"$S\" | tail -n +\"$L\" | grep -Eq '\"(name|tool|toolName)\"[[:space:]]*:[[:space:]]*\"[^\"]*call_tool_chain'; then printf '%s\\n' 'no Code Mode call_tool_chain tool call follows the follow-up request'; exit 1; fi ;; pi) P=$(cat .pi-route-guard-marker); D=\"$HOME/.pi/agent/sessions\"; S=$(find \"$D\" -type f -name '*.jsonl' -newer .pi-route-guard-marker -exec grep -lF \"$P\" {} + 2>/dev/null | head -1); if [ -z \"$S\" ]; then printf '%s\\n' 'no Pi session transcript newer than the marker records this scratch project'; exit 1; fi; cp \"$S\" \"$CONVERSATION_TURN_DIR/transcript.jsonl\"; L=$(grep -nF 'Now finish the same read-only ClickUp teams lookup.' \"$S\" | tail -1 | cut -d: -f1); if [ -z \"$L\" ]; then printf '%s\\n' 'the Pi transcript records no follow-up request'; exit 1; fi; if ! tail -n +\"$L\" \"$S\" | grep -Eq '\"(name|tool|toolName)\"[[:space:]]*:[[:space:]]*\"[^\"]*call_tool_chain'; then printf '%s\\n' 'no Code Mode call_tool_chain tool call follows the follow-up request'; exit 1; fi ;; esac; echo 'follow_up=call_tool_chain'"
    }
  ]
}
```

- The first `send` matches the contract prompt exactly.
- Setup runs once for each runtime and branches on `CONVERSATION_RUNTIME`. Each missing precondition prints a one-line reason and exits `77`. It requires a native ClickUp server in the copied OpenCode or Pi project config, then copies that runtime config before the subject starts. Pi setup also writes `.pi-route-guard-marker` with the scratch project's real path.
- Claude checks read the newest transcript under `~/.claude/projects/<encoded scratch cwd>/`; OpenCode checks query `~/.local/share/opencode/opencode.db` read-only, joining `session_v2` to `session_message` by session id and filtering by the scratch project's real path; Pi checks read matching session JSONL files newer than `.pi-route-guard-marker`. Each check copies its transcript evidence into that turn's folder. OpenCode turn 1 also reads the plugin's scratch `.skilled/logs/mcp-route-guard.log`, because the plugin records its warning there. Turn 2 searches only after the follow-up request for the Code Mode tool call; it does not anchor on an OpenCode screen or a prefixed reply line.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/mcp-code-mode/manual-testing-playbook/plugins-and-hooks/mcp-route-guard-conversation.md --runtime claude-code,opencode,pi --scratch <scratch-dir-outside-repository> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

- Turn 1 passes when an actual native ClickUp tool call is recorded and the runtime's guard evidence names `clickup_official`: the Claude transcript, the OpenCode route-guard log, or the Pi transcript. A ClickUp name inside Code Mode code or tool output does not count as a native call.
- Turn 2 passes when the runtime transcript records a Code Mode `call_tool_chain` tool call after the echoed follow-up request. Pi transcript checks identify the tool call by its JSON `name` field; visible-screen checks use `history.txt` when they need the full scrollback after an echoed send.

### Evidence

Keep the runner's `screen.txt`, `history.txt`, per-turn `raw-pane.log` slices, copied `transcript.jsonl` files, `check.txt` outputs, `checkpoints.tsv` and `result.json` under each runtime's evidence folder. Claude's transcript records hook and tool evidence. OpenCode's transcript comes from the read-only session database query, joined by session id and filtered to the scratch project's real path; turn 1 also reads the scratch route-guard log. Pi's transcript comes from the session JSONL selected by the marker file and must contain a native ClickUp tool-call name, not only ClickUp text in a Code Mode call. OpenCode screens and history contain only the final frame, so checks use database and file state. Pi screen checks use `history.txt` for full scrollback after an echoed send. Replies have runtime prefixes, so checks do not use exact-line matching.

### Pass / Fail

- **Pass**: Both turn checks pass for the selected runtime, the follow-up uses Code Mode's `call_tool_chain`, and the lookup remains read-only.
- **Fail**: The runtime transcript records no native ClickUp call, the runtime-specific guard evidence omits its advisory, the follow-up does not invoke `call_tool_chain`, or the interaction changes ClickUp data.
- **Skip**: Setup reports a missing repository skill, runtime config, Code Mode config, native ClickUp MCP server, active `clickup_official` manual, login or network connection before the subject starts.

### Failure Triage

1. If setup skips, read the first blocker in `setup.log`; it identifies a missing runtime config, Code Mode config, native ClickUp server, manual, login or network requirement.
2. If turn 1 finds no native ClickUp call, first confirm setup did not run without a native server. Claude evidence is under `~/.claude/projects/`; OpenCode evidence is in the scratch project's session rows and `.skilled/logs/mcp-route-guard.log`; Pi evidence is in a session JSONL newer than the marker and containing its scratch path. A `call_tool_chain` call whose code mentions `clickup_official` is not a native ClickUp call.
3. If the call appears but the advisory is missing, confirm the copied runtime config loaded the corresponding guard adapter and the copied `.utcp_config.json` still has an active `clickup_official` manual.
4. If turn 2 fails, inspect the copied transcript after the follow-up send and confirm the Code Mode MCP server started. An expired ClickUp OAuth session can surface here because setup checks login and network reachability before the session starts.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `mcp-route-guard.md` | Existing command-level scenario for the guard core and adapters |
| No dedicated feature-catalog entry | This hook behavior is documented by the playbook scenario and its implementation anchors. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs` | Claude PreToolUse advisory adapter |
| `.opencode/plugins/mcp-route-guard.js` | OpenCode tool-execution advisory adapter |
| `.skilled/hooks/mcp-route-guard/pi/mcp-route-guard.ts` | Pi native MCP-call advisory adapter |
| `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.cjs` | Shared policy that resolves native tool names against the Code Mode manifest |
| `.skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs` | Shared core and Claude-hook regression tests |

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: CM-027
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/mcp-route-guard-conversation.md`
