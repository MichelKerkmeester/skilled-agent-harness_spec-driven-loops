# Aside CLI Installation Guide

> Install the Aside AI-browser CLI on macOS, sign in, understand the permission tiers, and verify the registered Aside MCP wiring for Code Mode.

---

## 0. AI-FIRST INSTALL GUIDE

Paste this prompt to an AI agent to run the install interactively:

```text
Install the Aside CLI on this macOS machine. Steps:
1. Confirm the platform is macOS (Darwin) arm64 or x64 — abort on anything else.
2. Check for an existing binary with `command -v aside`; if present, report the version and stop.
3. With my confirmation, run: curl -fsSL https://releases.aside.com/install.sh | bash
4. Verify: `command -v aside` (expect ~/.local/bin/aside) and `aside --version 2>&1`.
5. Capture `aside --help 2>&1` as a fixture for the installed command surface.
6. Check sign-in state with `aside account list 2>&1` and `aside account status 2>&1`.
7. Do NOT run `aside --update` or re-run the installer without asking me first.
Report each step's output and stop on any failure.
```

### Quick Success Check (30 seconds)

```bash
command -v aside && aside --version 2>&1 && aside account status 2>&1
# Expected: a binary path, a version string, and an account status
```

---

## 1. OVERVIEW

### Core Principle

The CLI is the primary surface; the MCP server is a fallback launched from the same binary (`aside mcp`). Install once, verify with fixtures, and never install or update implicitly from a workflow.

### Distribution

Aside ships via an official curl bootstrap installer — **not npm** and not a GitHub package:

```bash
curl -fsSL https://releases.aside.com/install.sh | bash
```

The Developer settings page inside the Aside app can also install, update, or reinstall the CLI.

### Two Surfaces After Install

| Surface | Launch | Use |
|---|---|---|
| CLI | `aside ...` | Agent tasks, deterministic REPL, account management |
| MCP server | `aside mcp` (stdio, spawned by the client) | Code Mode composition — the `aside` UTCP manual is registered in `.utcp_config.json` |

---

## 2. PREREQUISITES

### Platform Support

- **macOS (Darwin) arm64/aarch64 and x64 only.** The installer rejects Linux and Windows.
- An Aside account for sign-in (built-in models require an active cloud sign-in).

### Installer Environment Overrides

The installer honors: `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, `ASIDE_CLI_BIN_DIR`. Default shim location: `~/.local/bin/aside` — ensure `~/.local/bin` is on `PATH`.

> Install-target layout note: research descriptions of the app-bundle layout diverge (`Aside CLI.app` vs `~/.aside/cli`); both trace to the same installer. Capture your installed layout as a fixture if you need to document it.

---

## 3. INSTALLATION

### Step 1: Install the CLI

```bash
curl -fsSL https://releases.aside.com/install.sh | bash
```

Or run the packaged wrapper (platform gate + no-op when already installed):

```bash
bash .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/install.sh
```

### Step 2: Verify the binary

```bash
command -v aside
aside --version 2>&1
aside --help 2>&1     # save this output — the command surface is version-pinned
```

### Step 3: Sign in and select an account

Sign-in happens through the Aside app/account flow. Verify from the CLI:

```bash
aside account list 2>&1
aside account status 2>&1
aside account use <id>    # select when multiple accounts exist
```

Provider tiers (Settings > AI > Providers):
1. **Aside built-in** — plan-included models; requires active cloud sign-in (fails closed when signed out).
2. **Subscription** — OAuth reuse of ChatGPT Plus/Pro, Claude Pro/Max, GitHub Copilot.
3. **API (BYO key)** — Anthropic, OpenAI, OpenRouter, Google, xAI, Vercel AI Gateway, Cloudflare AI Gateway (keep working when signed out).

### Step 4: Understand the permission tiers before first use

- Task modes: `Default` (normal browser profile) or `Incognito`.
- Permission modes: **Read only / Guard (default) / Full access** — Full access never exposes saved password values to the agent.
- Layered Allow/Ask/Deny rules per agent and session; Deny wins.
- MFA, CAPTCHA, identity checks, vault unlock, and approvals pause tasks for a human — plan for resumable waiting.

### Step 5: Smoke test

```bash
aside repl "openTab('https://example.com')" 2>&1
```

A working REPL round trip confirms binary, account context, and browser wiring. If the result reports an unbound browser profile, see the troubleshooting reference — that is a binding state, not an auth failure.

---

## 4. CONFIGURATION (MCP VIA CODE MODE)

> **Registered.** The `aside` manual below is registered in `.utcp_config.json` (registered 2026-07-16). Verify it with jq — do not re-add it. The canonical snapshot lives in [`assets/utcp_aside_manual.md`](assets/utcp_aside_manual.md). Discovery confirmation of the callable is the remaining step and needs a fresh Code Mode session.

The registered `manual_call_templates[]` entry:

```json
{
  "name": "aside",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "aside": {
        "transport": "stdio",
        "command": "aside",
        "args": ["mcp"],
        "env": {}
      }
    }
  }
}
```

Post-registration validation sequence:

1. `jq empty .utcp_config.json` — syntax gate.
2. Code Mode `search_tools({ task_description: "Aside browser automation", limit: 20 })`.
3. `tool_info()` on every intended callable; expect `aside.aside_repl` per the `{manual_name}.{manual_name}_{tool_name}` convention — confirm, never assume.
4. Invoke only discovered callables inside `call_tool_chain()` with try/catch, explicit timeouts (the `repl` tool advertises 120 s), and cleanup in `finally`.

Notes: `env: {}` is correct (auth is account/session-based, no transport credential exists); resolve `command: "aside"` to an absolute path if the Code Mode server's PATH differs. Exactly **one** manual is registered — the dual-manual layout used by Chrome DevTools is not supported by any Aside isolation guarantee and remains an open research question; never add a second `aside` manual without that isolation evidence.

---

## 5. VERIFICATION

### One-Command Health Check

```bash
bash .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh
```

### Full Verification Checklist

- [ ] Platform is macOS arm64/x64
- [ ] `command -v aside` returns a path
- [ ] `aside --version 2>&1` returns a version string
- [ ] `aside --help 2>&1` fixture captured for the installed version
- [ ] `aside account status 2>&1` shows a signed-in account (or BYO keys configured)
- [ ] REPL smoke test round-trips (or its binding error is understood)
- [ ] MCP handshake probe (`examples/mcp-handshake-probe.sh`) reports a protocol version and tool list
- [ ] `jq '.manual_call_templates[] | select(.name == "aside")' .utcp_config.json` returns the registered manual object
- [ ] No `aside --update` or installer re-run happened without operator sign-off

---

## 6. TROUBLESHOOTING

| Symptom | Fix |
|---|---|
| `command not found: aside` | Add `~/.local/bin` to PATH; re-run the installer (operator-invoked) |
| Installer aborts | Confirm macOS arm64/x64 — other platforms are rejected by design |
| Built-in models fail | Signed out — `aside account use <id>` or re-sign-in; BYO keys unaffected |
| `not bound to a browser profile` | Binding state, not auth. See `references/troubleshooting.md`; the supported binding procedure is an open question |
| MCP tools differ from the documented single `repl` | Version drift — rediscover and save a new fixture |

Full taxonomy: [`references/troubleshooting.md`](references/troubleshooting.md).

---

## 7. SOURCES

- https://docs.aside.com/help/developers (incl. `#use-mcp`)
- https://releases.aside.com/install.sh
- https://docs.aside.com/help/ai (provider tiers, sign-out behavior)
- https://docs.aside.com/help/security and https://docs.aside.com/help/tasks (permission modes)
