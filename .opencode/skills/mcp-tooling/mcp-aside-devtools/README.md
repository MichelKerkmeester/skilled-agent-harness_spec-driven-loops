---
title: mcp-aside-devtools
description: Aside AI-browser orchestrator that drives natural-language agent tasks and a deterministic Playwright-compatible REPL through the aside CLI, with the Aside MCP repl via Code Mode as the composition fallback.
trigger_phrases:
  - "aside browser"
  - "ai browser automation"
  - "aside cli"
  - "aside mcp"
  - "browser agent task"
version: 1.0.0.0
---

# mcp-aside-devtools

> Drive the Aside AI browser from your agent or terminal: natural-language tasks for outcomes, a deterministic JavaScript REPL for evidence, and an MCP path for Code Mode composition.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Goal-driven browser-agent tasks, deterministic browser steps (tabs, snapshots, screenshots), and MCP-composed browser work from an agent |
| **Invoke with** | "aside", "aside browser", "AI browser automation", "aside cli", "aside mcp" or auto-routing on browser-agent keywords |
| **Works on** | macOS (Darwin) arm64/x64 only — the official installer rejects Linux and Windows |
| **Produces** | Agent-task outcomes, REPL evaluation results, screenshots/PDFs/snapshots (verify independently), discovered MCP tool fixtures |

---

## 2. OVERVIEW

### Why This Skill Exists

Browser work from an agent splits into two very different shapes: outcome-oriented multi-step goals ("sign in, compare, download") and deterministic evidence steps ("open this tab, snapshot it, screenshot it"). Aside serves both from one binary — a natural-language browser agent and a Playwright-compatible JavaScript REPL — plus a local MCP server for composition with other tools. Picking the wrong lane wastes tokens, or worse, hands a deterministic proof job to a nondeterministic agent. This skill routes between the lanes and holds the safety lines Aside's identity/permission model requires.

### What It Does

The `aside` CLI is primary: `aside "<prompt>"` and `aside exec` run agent tasks under a signed-in account with pause/resume approval gates; `aside repl "<JavaScript>"` runs deterministic Playwright-style steps in a persistent context. The Aside MCP server (`aside mcp`, local stdio) is the Code Mode fallback for chaining browser work with other MCP tools — its live-probed inventory is exactly one `repl` tool on the pinned version, so the packet mandates runtime rediscovery instead of hardcoding tool names.

The MCP transport is owned by `mcp-code-mode`; this skill consumes Code Mode as a provider. Chrome/Chromium CDP debugging stays with `mcp-chrome-devtools` — Aside has no CDP-domain parity, and no dedicated console or network capture contract has been verified.

---

## 3. QUICK START

**Step 1: Install the CLI (macOS only, operator-invoked).**

```bash
curl -fsSL https://releases.aside.com/install.sh | bash
```

**Step 2: Verify the binary and sign-in state.**

```bash
command -v aside
# Expected: ~/.local/bin/aside (default shim location)

aside --version 2>&1
# Expected: a version string (e.g. 1.26.626.1517)

aside account list 2>&1
aside account status 2>&1
# Expected: at least one account; built-in models require active sign-in
```

**Step 3: Run each lane.**

```bash
# Agent task (outcome-oriented)
aside "Open https://example.com and summarize the page"

# Deterministic REPL (evidence-oriented)
aside repl "openTab('https://example.com')"
```

**Step 4: MCP path with Code Mode.**

The `aside` manual **is registered** in `.utcp_config.json` (registered 2026-07-16; snapshot in [`assets/utcp-aside-manual.md`](./assets/utcp-aside-manual.md)), and **live discovery confirmed the callable on 2026-07-16** (fixture: [`references/discovery-fixture-2026-07-16.json`](./references/discovery-fixture-2026-07-16.json)): discovery lists the registry name `aside.aside.repl` (dot-separated); the TypeScript call inside `call_tool_chain` is `aside.aside_repl(args)`:

```typescript
call_tool_chain(`
  const result = await aside.aside_repl({
    title: "Open example.com",
    code: "await openTab('https://example.com'); console.log(await snapshot(page));"
  });
  return result;
`)
// Discovery name (list_tools/search_tools): "aside.aside.repl" — dot-separated.
// TS callable (per the fixture's "Access as:" line): aside.aside_repl(args).
// Re-verify per session: tools.listChanged is true.
```

---

## 4. HOW IT WORKS

### The Routing Rule

The skill prefers the CLI. Outcome-oriented requests route to the agent-task lane; deterministic proof requests route to the REPL lane; composition with other Code Mode tools routes to the MCP path. A weighted intent scorer reads the request text and loads only the reference files relevant to the chosen lane.

### The CLI Paths

The agent-task lane (`aside "<task>"`, `aside exec`, `--session <id>` continuation, `--account <id>` selection) covers navigation, DOM inspection, screenshots, downloads, file use, approval requests, and password-manager sign-in — with MFA/CAPTCHA/vault boundaries kept human-only. The REPL lane (`aside repl`) keeps a persistent JavaScript context with Playwright APIs and helpers such as `openTab(url)`, `snapshot(page)`, `page.screenshot(options)`, and `annotatedScreenshot`.

### The MCP Path

`aside mcp` is a client-spawned local stdio process with no credential field; it inherits the logged-in CLI context. On the live-probed version (`1.26.626.1517`, protocol `2024-11-05`) the inventory is exactly one `repl` tool with `title` + `code` inputs and a 120-second timeout. `tools.listChanged: true` makes that inventory version-pinned evidence: rediscover at runtime, always. A fresh MCP process is browser-unbound until a task/profile binding exists — that error is a binding state, not an auth failure.

### Safety Lines

One UTCP manual, single-writer per account/profile (parallel-manual strategy is an unresolved research question). No implicit installs or updates. Untrusted-content discipline on every page and tool result. Artifacts verified independently: a screenshot is a non-empty PNG-magic file, not a successful tool response.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill when browser work should run through the Aside AI browser: agent-delegated multi-step goals, deterministic REPL evidence, or Aside-account-backed sessions. Reach for `mcp-chrome-devtools` when the job is imperative CDP debugging, console listing, or HAR export. Reach for Playwright/Puppeteer/Selenium for cross-browser test frameworks.

### Related Skills

| Skill | Relationship |
|---|---|
| `mcp-code-mode` | Owns the MCP transport. Aside is registered as a Code Mode provider (the `aside` manual) and is called through `call_tool_chain()` after discovery confirmation. |
| `mcp-chrome-devtools` | Sibling packet for Chrome CDP debugging (`bdg`). Routing discipline is shared; command surfaces are not. |
| `sk-code` | Owns application-code standards and tests for the code being verified in the browser. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `command not found: aside` | CLI not installed or `~/.local/bin` not on PATH | Run the official curl installer (operator-invoked); add `~/.local/bin` to PATH |
| Installer refuses to run | Non-macOS host | macOS (Darwin) arm64/x64 only — no workaround |
| `This task is not bound to a browser profile...` | Fresh MCP process without a task/profile binding | Not an auth error. Binding procedure is undocumented (open question) — escalate with the verbatim error |
| Built-in models fail after sign-out | Built-in tier fails closed when signed out | `aside account use <id>` or re-sign-in; BYO API-key providers keep working |
| Task pauses mid-run | MFA, CAPTCHA, identity check, vault unlock, or approval gate | Human-only boundary; resume the task after the operator acts |
| MCP `tools/list` differs from the documented one-tool inventory | Version drift (`listChanged: true`) | Re-run discovery, save the new fixture, re-evaluate the workflow |

---

## 7. FAQ

**Q: When do I use the agent-task lane versus the REPL?**

A: Use `aside "<prompt>"` when the outcome matters more than the steps (multi-site, approvals, autofill sign-in). Use `aside repl` when the steps ARE the deliverable — deterministic, repeatable, evidence-producing.

**Q: Can I use the MCP path today?**

A: Yes. The transport works (`aside mcp` over stdio), the `aside` UTCP manual is registered in `.utcp_config.json` (2026-07-16), and live discovery confirmed the surface the same day (fixture: `references/discovery-fixture-2026-07-16.json`): registry name `aside.aside.repl`, TS callable `aside.aside_repl(args)`, one `repl` tool only. Per-session rediscovery stays mandatory (`tools.listChanged: true`); actual browser work still needs a profile binding.

**Q: Does Aside capture console logs or network traffic like `bdg`?**

A: Yes, via the Playwright `page` API in the repl — the discovery fixture confirms `page.on('console'|'request'|'response', ...)` are available (see the DevTools-parity feature family, `feature-catalog/devtools-parity/console-and-network-capture.md`, scenario ASD-018). Two honest limits: there is no dedicated console/network *tool* (you register listeners and collect events yourself), and there is **no native HAR export** — you assemble a HAR-equivalent from the events. Live capture needs a bound authorized session, so the scenario is SKIP-valid until run against one.

**Q: Can I run parallel Aside sessions like `chrome_devtools_1`/`chrome_devtools_2`?**

A: Not under the current posture. Aside has no documented isolation flag, and the single-vs-dual manual question is unresolved pending a controlled multi-client isolation test. One manual, single writer per account/profile.

**Q: Which model flag do I pass — `-m provider/model` or `--model`/`--provider`?**

A: Unresolved. Docs examples show `-m provider/model`; the installed help shows separate `--model` and `--provider`. Capture `aside --help` for your installed version and follow it.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| CLI health | `command -v aside && aside --version 2>&1 && aside account status 2>&1` all pass |
| Doctor | `bash .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` exits 0 and reports binary, version, account, MCP handshake state, and the registered `aside` manual (a missing manual is an error) |
| MCP handshake | `examples/mcp-handshake-probe.sh` reports the protocol version and the discovered tool list (expect `repl` on the pinned version; rediscover on yours) |
| Skill package | `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-aside-devtools --check` reports 0 errors |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the lane router, and the full rule set |
| [`INSTALL-GUIDE.md`](./INSTALL-GUIDE.md) | Step-by-step install: curl installer, sign-in, permission tiers, MCP posture |
| [`references/aside-cli-reference.md`](./references/aside-cli-reference.md) | Verified command surface, options, boundary rules |
| [`references/mcp-wiring.md`](./references/mcp-wiring.md) | MCP transport, handshake, discovery, UTCP registration posture |
| [`references/session-management.md`](./references/session-management.md) | Three-layer session model, permissions, concurrency |
| [`references/troubleshooting.md`](./references/troubleshooting.md) | Error taxonomy and recovery sequences |
| [`references/aside-online-research-2026-07-17.md`](./references/aside-online-research-2026-07-17.md) | Dated online-research refresh: CLI/MCP/REPL corroboration, `mcp.json` wiring, permission model |
| [`examples/README.md`](./examples/README.md) | Guide to the workflow example scripts |
| [`scripts/install.sh`](./scripts/install.sh) | Non-interactive macOS installer wrapper with verification |
| [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only diagnostics: binary, version, account, MCP handshake, registered manual |
| [`assets/utcp-aside-manual.md`](./assets/utcp-aside-manual.md) | The registered `aside` manual snapshot and post-registration checklist |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory: five intent domains over three lanes |
| [`mcp-servers/aside-cli/README.md`](./mcp-servers/aside-cli/README.md) | CLI install pointer package |
| [`mcp-servers/aside-mcp/README.md`](./mcp-servers/aside-mcp/README.md) | MCP registration package (registered state) |
