---
title: Aside CLI Reference
description: Verified command surface, options, quoting, account selection, and boundary rules for the aside CLI's agent-task and REPL lanes.
trigger_phrases:
  - "aside cli commands"
  - "aside exec options"
  - "aside repl usage"
  - "aside account selection"
  - "aside session flag"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Aside CLI Reference

Operational reference for the `aside` binary: the natural-language agent-task lane, the deterministic REPL lane, account management, and the option surface — with every claim traced to published docs or a live help fixture, and every unresolved point marked UNKNOWN.

---

## 1. OVERVIEW

Aside is an AI browser with a real standalone macOS CLI, not merely an MCP server. The installed binary exposes agent tasks (`aside "<task>"`, `aside exec`), a deterministic Playwright-compatible browser JavaScript REPL (`aside repl`), account management (`aside account ...`), and a local MCP server launcher (`aside mcp`). Subcommands observed on version `1.26.626.1517` are exactly `account`, `exec`, `repl`, and `mcp`.

The command surface is **version-pinned evidence**. Re-capture `aside --version` and `aside --help` (plus per-subcommand `--help`) as fixtures before relying on any flag, and prefer the installed help over documentation examples when they disagree.

---

## 2. COMMAND SURFACE

### Verified Commands

| Command | Purpose |
|---|---|
| `aside "<task>"` | Start a natural-language browser-agent task (primary surface) |
| `aside --session <id> "<task>"` | Continue a prior task/session |
| `aside --account <id> "<task>"` | Run a direct task under a selected account |
| `aside exec ...` | Explicit task execution with provider/model controls |
| `aside account list` | Enumerate accounts |
| `aside account status [id]` | Inspect an account |
| `aside account use <id>` | Select the account |
| `aside repl "<JavaScript>"` | Deterministic browser automation (e.g. `openTab(...)`) |
| `aside mcp` | Start the local MCP server over stdio |

If no command is given, Aside starts a browser-agent session; passing a URL opens that page in Aside (observed on the installed help fixture).

### Top-Level Options (observed on 1.26.626.1517)

```text
--version | --session <id> | --account <id> | --model <model> | --provider <provider>
--speed <default|fast> | --effort <off|minimal|low|medium|high|xhigh|ultrabrowse> | --update
```

`--update` exists but must stay operator-invoked; never run updates or the installer implicitly.

### UNKNOWN: Model-Flag Spelling

Documentation examples show `aside exec --account u1 -m openai-codex/gpt-5.5` (a combined `-m provider/model` convention), while the installed `--help` shows separate `--model <model>` and `--provider <provider>` options with no `-m` recorded. This is unresolved — likely a docs-example alias versus installed-help difference. Capture the installed version's help before freezing either spelling in a script.

---

## 3. LANE SELECTION

### Agent-Task Lane

Use `aside "<prompt>"` or `aside exec` for goal-driven, multi-step, approval-gated, credential-autofill, or multi-site work. Documented agent capabilities: navigate, page/DOM inspection, screenshots, downloads, browse/search, use files, search history, request approvals, sign in via password-manager autofill, wait for notifications, and create/preview files (images/PDFs/HTML/text).

### Deterministic REPL Lane

Use `aside repl "<JavaScript>"` for direct inspection, screenshots, downloads, and repeatable evidence-producing steps. The documented example pattern is `openTab(...)`. The REPL keeps a persistent JavaScript context while its process is alive.

Helpers advertised by the MCP `repl` tool description (version-pinned to `1.26.626.1517`; the CLI REPL is documented as the same deterministic lane): `page`, `tabs`, `listBrowserTabs`, `attachBrowserTab(targetId)`, `attachActiveBrowserTab`, `getTabByTargetId`, `openTab(url)`, `closeTab`, `snapshot(page, options?)`, `page.screenshot(options)`, locator screenshots, `page.pdf`, `annotatedScreenshot`, `console.log`, `display`, `fetch`, `sleep`, `fs` (from `node:fs/promises`), `pwd`, `path`, `Buffer`. A non-mutating probe confirmed `page`, `tabs`, `fs`, `pwd` as values and `openTab`, `snapshot`, `annotatedScreenshot`, `fetch` as functions.

**UNKNOWN**: the exact output shapes of `snapshot` and screenshots on a *bound* page are untested; the full helper surface beyond the advertised/probed list is unconfirmed. Treat every helper call's result shape as probe-required until exercised.

---

## 4. BOUNDARY RULES

1. `--account` is documented for direct tasks and `exec` only — do not invent `aside mcp --account` or `aside repl --account`; `aside mcp --help` exposes no account/session option.
2. `--session` belongs to agent-task continuation; it is not an MCP browser-target selector.
3. There are no typed `aside navigate`, `aside dom`, `aside screenshot`, `aside console`, or `aside network` subcommands — deterministic work goes through the REPL.
4. Whether `repl` or `mcp` can select an account without changing the global default is UNKNOWN.
5. Quote the entire task prompt or REPL JavaScript as a single shell argument; capture stderr with `2>&1`.

---

## 5. ACCOUNTS AND PROVIDERS

Provider tiers (Settings > AI > Providers): **Aside built-in** (plan-included models, requires active cloud sign-in), **Subscription** (OAuth reuse of ChatGPT Plus/Pro, Claude Pro/Max, GitHub Copilot), and **API** (BYO keys: Anthropic, OpenAI, OpenRouter, Google, xAI, Vercel AI Gateway, Cloudflare AI Gateway).

Sign-out behavior: a warning is printed; BYO provider keys keep working, built-in models fail closed until re-sign-in. Recover with `aside account use <id>` or per-run `--account`. Model-provider credentials are not MCP transport credentials — the MCP surface has no published credential field.

---

## 6. REFERENCES AND RELATED RESOURCES

- [session_management.md](./session_management.md) — three-layer session model, daemon, concurrency, permission modes.
- [mcp_wiring.md](./mcp_wiring.md) — MCP transport, discovery, and Code Mode registration posture.
- [troubleshooting.md](./troubleshooting.md) — error taxonomy and recovery flows.
- Primary sources: https://docs.aside.com/help/developers, https://docs.aside.com/help/ai, https://docs.aside.com/help/tasks.
