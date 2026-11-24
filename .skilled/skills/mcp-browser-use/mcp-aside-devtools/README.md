---
title: mcp-aside-devtools
description: "Turns browser work into agent work with the Aside AI browser: natural-language tasks that finish goals and a deterministic JavaScript REPL for evidence, with an MCP path for Code Mode composition."
trigger_phrases:
  - "aside browser"
  - "ai browser automation"
  - "aside cli"
  - "aside mcp"
  - "browser agent task"
version: 1.1.11.0
---

# mcp-aside-devtools

> Turn browser work into agent work: describe the outcome and let the Aside browser finish it. Or run deterministic JavaScript steps that leave evidence you can verify.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it gives you |
|---|---|
| **Use it for** | Browser goals an agent can finish and deterministic browser steps that leave checkable evidence |
| **Invoke with** | "aside", "aside browser", "AI browser automation", "aside cli", "aside mcp" or the `mcp-browser-use` hub's mode signal |
| **Works on** | macOS arm64 and x64 only. The official installer rejects Linux and Windows |
| **Produces** | Task answers, REPL results, screenshots, PDFs and snapshots, plus refreshed MCP inventory fixtures |

### What It Does

This skill turns browser work into an agent-run goal or a deterministic step you can check. The `aside` CLI is the surface you run. `aside "<task>"` and `aside exec` hand a goal to the browser agent under a signed-in account. `aside repl "<JavaScript>"` runs Playwright steps in a persistent context. `aside mcp` starts a local stdio server that Code Mode reaches through the registered `aside` manual. On version `1.26.626.1517` that server exposed one `repl` tool with `title` and `code` inputs.

The skill routes between these lanes and keeps the account and permission boundaries the product requires. The MCP transport belongs to `mcp-code-mode`. Chrome CDP debugging and HAR export stay with `mcp-chrome-devtools`. Application code that the browser only verifies belongs to `sk-code`.

### Why This Skill Exists

Browser work arrives in two shapes. A goal such as sign in and download wants an agent that decides the steps. A proof step such as open this tab and screenshot it wants a deterministic run you can repeat. Aside serves both from one binary and adds a local MCP server for chaining with other tools. Sending a proof job to the agent lane spends tokens on steps you already know.

### The Lane Capability Layer

| Capability | What the skill knows how to operate |
|---|---|
| **Agent task lane** | multi-step goals under a signed-in account, with approval gates and human-only identity checks |
| **Deterministic REPL lane** | Playwright JavaScript in a persistent context, with `openTab`, `snapshot`, `page.screenshot` and `page.pdf` helpers |
| **MCP composition path** | one `repl` tool over local stdio for chaining browser work with other Code Mode tools |
| **DevTools parity** | DOM query, screenshot and PDF, performance timing and navigation through the `page` API. Console and network capture are gaps on 1.26.626.1517, because `page.on` rejects those events. No native HAR export |

---

## 2. QUICK START

**Step 1: Install the CLI.** The installer is macOS only and operator-invoked. The wrapper checks the official installer against a pinned sha256 before it runs it.

```bash
bash scripts/install.sh
```

Expect the binary at `~/.local/bin/aside`. Add `~/.local/bin` to PATH if `command -v aside` finds nothing.

**Step 2: Verify the binary and the account.**

```bash
command -v aside
aside --version 2>&1
aside account status 2>&1
```

Expect a binary path and a version string. The account command prints a signed-in account line that names its profiles. The CLI and MCP observations in this skill are pinned to version `1.26.626.1517`.

**Step 3: Run a lane.**

```bash
aside "Open https://example.com and summarize the page"
aside repl "await openTab('https://example.com')"
```

The task lane prints the agent's answer. The REPL lane returns without an error and opens a background tab in Aside.

**Step 4: Use the MCP path with Code Mode.**

Discovery lists the registry name `aside.aside.repl`. The TypeScript callable inside `call_tool_chain` is `aside.aside_repl(args)`. Rediscover per session because `tools.listChanged` is true.

```typescript
call_tool_chain({ code: `
  const result = aside.aside_repl({
    title: "Open example.com",
    code: "await openTab('https://example.com'); console.log(await snapshot(page));"
  });
  return result;
` })
```

The call returns `{ success, result, logs }`. `result` holds the object your code returned and `logs` holds each `console.log` line. A discovered inventory that differs from one `repl` tool means version drift, so run discovery again before you rely on the call.

---

## 3. HOW IT WORKS

Browser work enters through the `mcp-browser-use` hub mode signal. A weighted intent scorer reads the request text, picks the lane, then loads only the reference files the router maps to that choice.

```text
                            ┌──────────────────────┐
                            │ Browser request      │
                            └──────────┬───────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │ Weighted intent      │
                            │ scoring              │
                            └──────────┬───────────┘
                                       │
           ┬───────────────────────────┼───────────────────────────┬
           │                           │                           │
           ▼                           ▼                           ▼
│ aside task lane      │    │ aside repl lane      │    │ Aside MCP repl via   │
│                      │    │                      │    │ Code Mode            │
└──────────┬───────────┘    └──────────┬───────────┘    └──────────┬───────────┘
           │                           │                           │
           ▼                           ▼                           ▼
│ Task answer          │    │ Screenshot, PDF or   │    │ Chained tool result  │
│                      │    │ snapshot             │    │                      │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

### The Routing Rule

The skill prefers the CLI. A goal with approvals or sign-in routes to the agent-task lane. A deterministic proof step routes to the REPL lane. Work that must chain with other Code Mode tools routes to the MCP path. The router maps five intent domains to reference files and suggests the CLI reference when nothing matches.

### The CLI Lanes

The agent-task lane covers `aside "<task>"`, `aside exec`, `--session <id>` continuation and `--account <id>` selection. It handles navigation, DOM inspection, screenshots, downloads and password-manager sign-in. MFA, CAPTCHA, vault unlock and approvals stay human-only.

The REPL lane keeps a persistent JavaScript context with Playwright APIs and helpers such as `openTab(url)`, `snapshot(page)`, `page.screenshot(options)` and `page.pdf(options)`. Discovery lists the helper surface but does not exercise the calls, so check each artifact on disk.

### The MCP Path

`aside mcp` is a client-spawned local stdio process with no credential field. It inherits the signed-in CLI context. The live handshake on `1.26.626.1517` reported protocol `2024-11-05` with `tools.listChanged: true`. `tools/list` returned one `repl` tool with a 120-second call timeout. On `1.26.626.1517` with the Aside app running and signed in, a fresh process is bound and lists tabs. Earlier versions left it browser-unbound until a task or profile binding existed. That error is a binding state, not an auth failure.

### Working Beside the User

`openTab(url)` opens a background tab. The user's active tab stays where it was. The page inside the new tab still reports `document.visibilityState` as `visible` and `document.hasFocus()` as `true`, so `page.evaluate` and `page.keyboard.press` work there. Open your own tab for a mutating step and close it with `closeTab(tab)`.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when a multi-step browser goal should run under a signed-in Aside account. Use it when a deterministic step must leave evidence you can check. Choose it as well when browser work must chain with other Code Mode tools.

Reach for `mcp-chrome-devtools` for CDP debugging or HAR export. Reach for a cross-browser test framework such as Playwright or Selenium when the job is a suite rather than one browser session.

### Related Skills

| Skill | Relationship |
|---|---|
| [`mcp-code-mode`](../../mcp-code-mode/README.md) | Owns the MCP transport. The `aside` manual is a registered provider, called through `call_tool_chain()` after discovery. |
| [`mcp-chrome-devtools`](../mcp-chrome-devtools/README.md) | Sibling packet for Chrome CDP debugging (`bdg`). Routing discipline is shared. Command surfaces are not. |
| [`sk-code`](../../sk-code/README.md) | Owns application-code standards and tests for the code the browser verifies. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: aside` | CLI absent or `~/.local/bin` not on PATH | Run the official installer as an operator. Add `~/.local/bin` to PATH |
| The installer refuses to run | Host is not macOS | macOS arm64 or x64 only. No workaround |
| `This task is not bound to a browser profile.` | MCP process with no task or profile binding (seen on earlier versions; a fresh process is bound on `1.26.626.1517` with the app running and signed in) | Not an auth error. The binding procedure is undocumented, so report the error verbatim and escalate |
| Built-in models fail after sign-out | The built-in tier fails closed when signed out | Run `aside account use <id>` or sign in again. BYO API-key providers keep working |
| A task pauses mid-run | MFA, CAPTCHA, identity check, vault unlock or an approval gate | Act in Aside, then resume the task |
| `tools/list` differs from one `repl` tool | Version drift under `listChanged: true` | Run discovery again, save a new fixture and re-check the workflow |

---

## 6. FAQ

### When should I use the agent-task lane instead of the REPL?

Use `aside "<prompt>"` when the outcome matters more than the steps, such as multi-site work, approvals, autofill sign-in or session continuation. Use `aside repl` when the steps are the deliverable: repeatable evidence you can check.

### Is the MCP path usable today?

Yes. `aside mcp` speaks stdio and the `aside` manual is registered in `.utcp_config.json`. Discovery lists one tool, registry name `aside.aside.repl`, called in TypeScript as `aside.aside_repl(args)`. Rediscover per session because `tools.listChanged` is true. Browser work still needs a profile binding.

### Does Aside capture console logs or network traffic?

Not on Aside 1.26.626.1517. The live runs showed that `page.on('console', ...)`, `page.on('request', ...)` and `page.on('response', ...)` each throw. The error points to `page.console.logs()`, which has not been run yet. There is no dedicated capture tool and no native HAR export. What works is `page.evaluate(...)`, which reads page state such as page-visible cookie names and storage keys.

### Can I run parallel Aside sessions?

Not with any documented isolation. Aside has no isolation flag. Keep one manual and one writer per account and profile. The multi-client isolation test that would settle the question has not run.

---

## 7. VERIFICATION

| Check | Result |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md` reports `✅ VALID` with zero issues |
| CLI health | `command -v aside && aside --version 2>&1 && aside account status 2>&1` prints a path, a version string and a signed-in account |
| Doctor | `bash .skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/doctor.sh` prints a ✓, ! or ✗ line per check and exits 1 only when the `aside` manual is missing from `.utcp_config.json` |
| MCP handshake | `bash .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/mcp-handshake-probe.sh` prints the protocol version and the discovered tools, then prints `Fixture saved: <path>` and a reminder to rediscover |
| Skill package | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/mcp-browser-use/mcp-aside-devtools --check` reports `Result: PASS` and one warning for the JSON fixture under `references/` |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, rules and lane routing |
| [`ROUTER.md`](./ROUTER.md) | Intent model, resource map and loading levels |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Install, sign-in, permission tiers and MCP wiring |
| [`references/aside-cli-reference.md`](./references/aside-cli-reference.md) | Command surface, options and boundary rules |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | Transport, handshake, discovery and registration |
| [`references/session-management.md`](./references/session-management.md) | Session layers, permissions and concurrency |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error taxonomy and recovery |
| [`references/discovery-fixture-2026-07-16.json`](./references/discovery-fixture-2026-07-16.json) | Recorded discovery output that pins the one-tool inventory |
| [`assets/utcp-aside-manual.md`](./assets/utcp-aside-manual.md) | Registered `aside` manual snapshot |
| [`examples/README.md`](./examples/README.md) | Runnable lane scripts and their exit codes |
| [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only diagnostics |
| [`scripts/install.sh`](./scripts/install.sh) | Operator-invoked install wrapper |
| [`scripts/README.md`](./scripts/README.md) | Script side effects and usage |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory over the five intent domains |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios across the lanes |
| [`mcp-servers/aside-cli/README.md`](./mcp-servers/aside-cli/README.md) | CLI install pointer |
| [`mcp-servers/aside-mcp/README.md`](./mcp-servers/aside-mcp/README.md) | MCP registration pointer |
| [`changelog/`](./changelog/) | Versioned release history |
