---
title: mcp-code-mode
description: Lets an agent reach every external MCP tool registered in `.utcp_config.json` through one TypeScript execution, with schemas discovered on demand so the context stays flat no matter how many servers are configured.
trigger_phrases:
  - "code mode"
  - "call_tool_chain"
  - "mcp tools"
  - "tool orchestration"
  - "context reduction"
version: 1.0.8.0
---

# mcp-code-mode

> Reach every external MCP tool you have configured from one TypeScript block while the context stays flat as you add servers.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Calling a configured MCP manual and chaining several calls in one run |
| **Invoke with** | "code mode", "call_tool_chain" or routing on an external service name |
| **Works on** | Manuals in `.utcp_config.json`, with credentials in `.env` |
| **Produces** | One envelope per run, with the returned data and the captured logs |

### What It Does

Code Mode gives one TypeScript block direct access to the external MCP tools your project has configured. You start from a task description, not a tool name. Discovery turns that description into a tool name and `tool_info` adds the interface. The call then runs inside one sandboxed execution. State stays in local variables between calls, so a flow that spans several services stays one flow.

The entry point is `call_tool_chain`. `SKILL.md` allows four tools: `search_tools` and `list_tools` for discovery, `tool_info` for an interface, then `call_tool_chain` to execute. The server also registers `register_manual` and `deregister_manual` for runtime work, plus `get_required_keys_for_tool` for credential checks.

The boundary is the manual list. Code Mode calls what `.utcp_config.json` declares, plus any manual registered at runtime through `register_manual`. A server the runtime registers natively stays outside it. So does every local tool the runtime already provides, which runs on its own.

### Why The Context Stays Small

Native MCP puts a schema for every tool into the context before the first call. The architecture reference puts that at about 141,000 tokens for 47 tools, which is why a project tends to stop at two or three servers.

Code Mode opens with its execution and discovery tools at about 1,600 tokens, then returns interfaces on demand. `search_tools` carries one per match and `tool_info` returns the full one. Extra servers add no opening cost. A tool you never call costs nothing. The same reference puts the saving at 98.7%.

---

## 2. QUICK START

**Step 1: Ask for the work in plain words.** Routing sends a request that names a configured service to this skill. You can also name the trigger: `code mode` or `call_tool_chain`.

**Step 2: Let discovery find the tool.**

```typescript
search_tools({ task_description: "find screens for banking onboarding", limit: 10 })
```

It returns `{ tools: [...] }` with one entry per match. Each entry carries the tool `name` and its `typescript_interface`. The default `limit` is 10.

**Step 3: Read the interface before you call it.**

```typescript
tool_info({ tool_name: "mobbin.mobbin_search_screens" })
```

It returns the TypeScript interface for that one tool, with the parameters and the return type. A name that is not registered returns `{ success: false, error: "Tool '<name>' not found" }`.

**Step 4: Run the call.**

```typescript
call_tool_chain({
  code: `
    const screens = mobbin.mobbin_search_screens({
      query: "iOS banking onboarding",
      platform: "ios",
      limit: 5
    })
    return screens
  `
})
```

It returns `{ success: true, result, logs }`. `result` holds what your code returned and `logs` holds every `console.log` line from the block. An error inside your code does not flip `success`. You still get `success: true`, with `result: null` and a `logs` line that starts with `[ERROR] Code execution failed:`. So check `logs` for `[ERROR]` before you trust `success`.

**Step 5: Check the install when a call fails for no visible reason.**

```bash
bash .skilled/skills/mcp-code-mode/scripts/doctor.sh
```

A healthy install prints three `PASS` lines and `Doctor done.`, then exits 0.

---

## 3. HOW IT WORKS

One request follows the same route. The router loads the reference files for the intent. Discovery resolves the tool name and `tool_info` resolves its interface. `call_tool_chain` then runs the code in a V8 isolate and returns one envelope.

```text
┌──────────────────────────────────────────┐
│ A request that names an external service │
└──────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│ Router loads workflows.md, then the      │
│ matched reference                        │
└──────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│ search_tools or list_tools returns names │
└──────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│ tool_info returns the interface          │
└──────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│ call_tool_chain runs the TypeScript      │
└──────────────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│ Result, logs and a success flag          │
└──────────────────────────────────────────┘
```

### The Naming Rule

Every external call to an `mcp` manual follows `{manual_name}.{manual_name}_{tool_name}`. The first part is the `name` field of the manual in `.utcp_config.json`, used as the TypeScript namespace. The second part repeats that name, then an underscore, then the tool name from the server.

Discovery and calling use different forms. `list_tools()` returns the dotted shape, such as `mobbin.mobbin.search_screens`. The call drops the second dot and joins the parts with an underscore: `mobbin.mobbin_search_screens()`.

Two more rules sit on top of this one. Tool names are snake_case, so a camelCase name is not found. The prefix rule covers `mcp` manuals only. A manual declared with `call_template_type: "cli"` keeps its own tool names and uses `{manual}.{tool}`.

### State, Errors and Limits

State lives for one execution. A variable set by the first call is visible to every later call in the same block, which is what lets a design fetch feed a task create in one chain.

An unhandled exception ends the whole execution. Wrap the calls that can fail in `try/catch` and return a structured result with a success flag, so a partial run is visible to the caller. Use `Promise.all` when every call must succeed and `Promise.allSettled` when partial success is acceptable.

The isolate cannot read the host file system or open its own network connection. A registered tool is the only way out.

The defaults come from the server. `call_tool_chain` waits 30,000 ms and caps output at 200,000 characters. Raise `timeout` to 60000 for three to five tools, then to 120000 for a longer flow.

### The Credential Prefix

Code Mode reads credentials through the manual name, with every underscore in that name doubled. A manual named `clickup_official` that declares `${CLICKUP_API_KEY}` needs `clickup__official_CLICKUP_API_KEY` in `.env`. The plain `CLICKUP_API_KEY` is not visible to the wrapped server. The call fails on a missing variable.

Run `get_required_keys_for_tool({ tool_name })` to print the exact names a tool expects. It returns `{ success, tool_name, required_variables }`.

---

## 4. INTEGRATION & NAVIGATION

### When To Use It

Reach for Code Mode when a request names a service that lives in `.utcp_config.json`: ClickUp, Notion, Figma, GitHub, Webflow, Chrome DevTools or a design research manual such as Mobbin. Reach for it too when one result feeds the next call and the hand-off should stay in one execution.

Stay with the runtime's own tools for everything else. Read, Write, Edit, Grep, Glob and Bash own local files. A server registered natively in the runtime config is called by its own name. Code Mode cannot see either, so routing them here costs a round trip and reaches nothing.

### Related Skills

The [mcp-tooling](../mcp-tooling/SKILL.md) hub dispatches six modes. Three of them run on Code Mode as their backend.

| Mode | What it runs through Code Mode |
|---|---|
| [mcp-notion](../mcp-tooling/mcp-notion/SKILL.md) | Notion workspace operations over the official Notion MCP |
| [mcp-refero](../mcp-tooling/mcp-refero/SKILL.md) | Read-only UI reference search |
| [mcp-mobbin](../mcp-tooling/mcp-mobbin/SKILL.md) | Read-only app and screen research |

The [mcp-browser-use](../mcp-browser-use/SKILL.md) hub dispatches three browser modes: Chrome DevTools, Aside and Bladebro. Each uses its CLI when installed and reaches its MCP server through Code Mode when the CLI is missing or the task needs an MCP-only capability.

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `Tool not found: <name>` | The call left out the manual prefix, so only the bare tool name was resolved | Run `search_tools` and `tool_info`, then call `{manual}.{manual}_{tool}` |
| `TypeError: <manual>.<manual> is not a function` | A double dot where an underscore belongs | Use one dot, then the repeated manual name and an underscore |
| A missing-variable error that names a prefixed key | `.env` holds the plain key. Code Mode reads the prefixed name | Prefix the key with the manual name and double each underscore in that name |
| A call stops at about 30 seconds | The default `timeout` is 30,000 ms | Set `timeout` on `call_tool_chain` for the size of the flow |
| A manual is missing from `list_tools()` | The entry is `disabled` or the server is registered natively in the runtime config | Check `disabled` in `.utcp_config.json`, else call the native tool by its own name |

---

## 6. VERIFICATION

The first four checks are read-only and safe to run at any time.

| Check | Command | What a pass prints |
|---|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-code-mode/README.md --type readme` | `✅ VALID` and `Total issues: 0` |
| Config syntax | `python3 .skilled/skills/mcp-code-mode/scripts/validate_config.py .utcp_config.json` | `✅ VALIDATION PASSED` and a `✓` line for each structure check |
| Server health | `bash .skilled/skills/mcp-code-mode/scripts/doctor.sh` | Three `PASS` lines and `Doctor done.`, exit 0 |
| Routable resources | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/mcp-code-mode` | `leaf-manifest.json OK` then a hash, exit 0 |

The config validator also takes `--check-env <path>` to check the prefixed keys in a dotenv file. The playbook covers the missing-key path, where the script exits non-zero and names the key.

Behavior needs a live session. The manual testing playbook holds 28 scenarios across 8 categories. Each one states its own expected signals and evidence.

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime rules, routing and the naming contract |
| [`ROUTER.md`](./ROUTER.md) | Intent map, resource map and loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Install and client wiring for the server |
| [`references/naming-convention.md`](./references/naming-convention.md) | The naming pattern and the errors it prevents |
| [`references/configuration.md`](./references/configuration.md) | `.utcp_config.json` and `.env` setup |
| [`references/tool-catalog.md`](./references/tool-catalog.md) | Configured manuals and live discovery |
| [`references/workflows.md`](./references/workflows.md) | Discovery-first patterns for chains and errors |
| [`references/architecture.md`](./references/architecture.md) | Token economics and the V8 isolate sandbox |
| [`assets/config-template.md`](./assets/config-template.md) | Copy-ready `.utcp_config.json` |
| [`assets/env-template.md`](./assets/env-template.md) | Copy-ready `.env` with prefixed placeholders |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The live validation scenarios |
| [`scripts/README.md`](./scripts/README.md) | Installer, updater, doctor and config validator |
